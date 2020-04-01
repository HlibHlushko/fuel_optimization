import lineIntersect from '@turf/line-intersect'
import { point, lineString, length, circle, lineSlice, lineOverlap } from '@turf/turf'

import { CoordArr, Coords } from '../types/basic'
import { RouteResponse, Credentials, Geometry, Waypoint, FuelStation, FuelStationInfos, RouteIsolineResponse, FuelStationInfo } from '../types/here'
import { getFuelStationsAsync, getRouteAsync } from './hereClient'
import { POI, POIType, POIInfo } from '../types/models'

export const getFuelStationsAlongTwoPointsRouteAsync = async (cred: Credentials, departCoords: Coords, destCoords: Coords, detour: number): Promise<FuelStationInfos> => {
  console.log(`got fs request for (${departCoords.lat},${departCoords.lng}) and (${destCoords.lat},${destCoords.lng}) (detour: ${detour})`)

  let resj: RouteIsolineResponse
  try {
    resj = await getFuelStationsAsync(cred, departCoords, destCoords, detour);
  } catch (e) {
    console.log('error : ' + JSON.stringify(e))
    throw new Error('no internet')
  }
  if (!resj.response) {
    throw new Error('no route')
  }

  console.log(`got ${resj.response.route[0].searchResult.geometries.length} fuel stations`)

  console.time('shape')
  const link = resj.response.route[0].leg[0].link
  const shapeLength = link.reduce((a, c) => a + c.shape.length, 0) / 2
  const shape = new Array(shapeLength)
  let offset = 0
  for(let i = 0; i < link.length; ++i) {
    reversePairInto(link[i].shape, shape, offset)
    offset += link[i].shape.length / 2
  }
  console.timeEnd('shape')

  console.time('geoRoute')
  const depp = point([departCoords.lng, departCoords.lat])
  const destp = point([destCoords.lng, destCoords.lat])

  const geoRoute = lineSlice(depp, destp, lineString(shape))
  const stationsInfo: FuelStationInfos = {
    departCoords,
    destCoords,
    distance: length(geoRoute) * 1000,
    route: geoRoute,
    infos: []
  }
  console.timeEnd('geoRoute')

  console.time('geoms')
  const geometries = resj.response.route[0].searchResult.geometries
  if (geometries.length > 0) {
    const stations = extractStationsFromGeometries(geometries).filter(s => s.isDiesel)
    console.timeEnd('geoms')

    console.time('stations')
    for (const fs of stations) {
      const jp = point([fs.junctionLatLng.lng, fs.junctionLatLng.lat])
      const fsp = point([fs.latlng.lng, fs.latlng.lat])
      const dpToJpRouteSlice = lineSlice(depp, jp, geoRoute)
      const jpToDestRouteSlice = lineSlice(jp, destp, geoRoute)

      const fsInfo: FuelStationInfo = {
        fs,
        info: {
          points: { dp: depp, jp, fsp, lp: null },
          dists: {
            distFromStartToJunc: length(dpToJpRouteSlice) * 1000, distFromOverlapToEnd: length(jpToDestRouteSlice) * 1000,
            distFromJuncToFs: -1, distFromJuncToFsFromReq: -1, distfromFsToOverlap: -1 },
          partOfRoute: false, overlapBounds: null, error: null, intersections: null, fromJunkToFs: null, fromFsToLastIntersection: null, overlap: null, overlapPoint: null
        }
      }

      if (fs.partOfRoute) {
        fsInfo.info.dists.distFromJuncToFs = 0
        fsInfo.info.dists.distFromJuncToFsFromReq = 0
        fsInfo.info.dists.distfromFsToOverlap = 0
        fsInfo.info.partOfRoute = true
        fsInfo.info.overlapPoint = point([fs.latlng.lng, fs.latlng.lat])
        stationsInfo.infos.push(fsInfo)
        continue
      }

      const overlapBounds = circle(fsp, detour / 1000)
      fsInfo.info.overlapBounds = overlapBounds

      const boundsIntersections = lineIntersect(jpToDestRouteSlice, overlapBounds)
      if (boundsIntersections.features.length === 0) {
        fsInfo.info.error = 'no bounds intersection'
        stationsInfo.infos.push(fsInfo)
        continue
      }

      fsInfo.info.points.lp = boundsIntersections.features[boundsIntersections.features.length - 1]
      fsInfo.info.intersections = boundsIntersections
      stationsInfo.infos.push(fsInfo)
    }
    console.timeEnd('stations')

    console.log(`got ${stationsInfo.infos.length} diesel stations`)

    console.time('routes')
    const infos = stationsInfo.infos.filter(i => i.info.points.lp)
    let routes: RouteResponse[] = null
    try {
      routes = await Promise.all(
        infos.map(({fs, info: {points: {jp, lp}}}) =>
          getRouteAsync(cred, { lat: jp.geometry.coordinates[1], lng: jp.geometry.coordinates[0] }, fs.latlng, { lat: lp.geometry.coordinates[1], lng: lp.geometry.coordinates[0] })
        )
      )
    } catch (e) {
      console.log('error : ' + JSON.stringify(e))
      throw new Error('no internet')
    }
    console.timeEnd('routes')

    console.log(`got ${routes.length} routes`)

    console.time('overlap')
    for (const [i, r] of routes.entries()) {
      if (!r.response) {
        console.log('route : ' + JSON.stringify(r))
        infos[i].info.error = 'no route from DS to intersection'
        continue
      }
      const shape = r.response.route[0].shape
      const route = lineString(reversePairInto(shape, new Array(shape.length / 2)))

      const { points: { jp, fsp, lp } } = infos[i].info
      const fromJunkToFs = lineSlice(route.geometry.coordinates[0], fsp, route)
      const fromFsToInstersection = lineSlice(fsp, lp, route)
      const fromJuncToInstersection = lineSlice(jp, lp, geoRoute)
      const overlap = lineOverlap(fromJuncToInstersection, fromFsToInstersection, {tolerance: 0.005})
      if (overlap.features.length === 0) {
        infos[i].info.fromJunkToFs = fromJunkToFs
        infos[i].info.fromFsToLastIntersection = fromFsToInstersection
        infos[i].info.error = 'no overlap'
        continue
      }

      const overlapPoints =  overlap.features
        .map(f => [f.geometry.coordinates[0], f.geometry.coordinates[f.geometry.coordinates.length - 1]])
        .reduce((acc, fp) => acc.concat(fp), [])
      const { op: overlapPoint, dist: distfromFsToOverlapKm } = overlapPoints
        .map(op => ({ op, dist: length(lineSlice(fsp, op, fromFsToInstersection)) }))
        .reduce((res, od) => od.dist < res.dist ? od : res, { op: null, dist: Math.min()})

      const fromJpToOverlap = lineSlice(jp, overlapPoint, fromJuncToInstersection)

      infos[i].info = {
        ...infos[i].info,
        fromJunkToFs: fromJunkToFs,
        fromFsToLastIntersection: fromFsToInstersection,
        overlap: overlap,
        overlapPoint: point(overlapPoint),
        dists: {
          distFromStartToJunc: infos[i].info.dists.distFromStartToJunc,
          distFromJuncToFs: length(fromJunkToFs) * 1000,
          distFromJuncToFsFromReq: infos[i].fs.distanceToReach,
          distfromFsToOverlap: distfromFsToOverlapKm * 1000,
          distFromOverlapToEnd: infos[i].info.dists.distFromOverlapToEnd - length(fromJpToOverlap) * 1000
        }
      }
    }
    console.timeEnd('overlap')
  }

  return stationsInfo
}

export const getDieselStationsAlongRouteAsync = async (cred: Credentials, detour: number, ...waypoints: Waypoint[]): Promise<[POI[], POI[]]> => {
  const infosCount = waypoints.length - 1
  let stationInfos: FuelStationInfos[] = new Array(infosCount)
  try {
    for (let i = 0; i < infosCount; i++) {
      stationInfos[i] = await getFuelStationsAlongTwoPointsRouteAsync(cred, waypoints[i], waypoints[i + 1], detour)
    }
  } catch (e) {
    throw e.message
  }

  console.log(`got ${stationInfos.length} station infos with total ${stationInfos.reduce((acc, si) => acc + si.infos.length, 0)} stations`)

  const pois: POI[] = []
  const unreachablePOIs: POI[] = []
  const wpname = ''
  for (const { infos, route, distance, departCoords } of stationInfos) {
    const [reachable, unreachable] = infos.reduce((acc, i) => {
      const reachable = !i.info.error && i.info.dists.distFromJuncToFs + i.info.dists.distfromFsToOverlap < detour
      acc[reachable ? 0 : 1].push(i)
      return acc
    }, (<[POIInfo[],POIInfo[]]>[[], []]))

    for (const poiInfo of unreachable) {
      unreachablePOIs.push({ type: POIType.FuelStation, info: poiInfo, name: poiInfo.fs.name, coords: poiInfo.fs.latlng, junction0: null, junction1: null, distanceToNextPoint: -1 })
    }

    reachable.sort((a, b) => a.info.dists.distFromStartToJunc - b.info.dists.distFromStartToJunc)

    pois.push({ type: POIType.Waypoint, info: null, junction0: null, junction1: null, name: wpname, coords: departCoords, distanceToNextPoint: reachable.length > 0
      ? reachable[0].info.dists.distFromStartToJunc + reachable[0].info.dists.distFromJuncToFs
      : distance })

    for (const [i, poiInfo] of reachable.entries()) {
      // if (i < reachable.length - 1)
      //   console.log(poiInfo.fs.name + ' 1: ' + poiInfo.info.dists.distfromFsToOverlap +
      //               ' 2: ' + length(lineSlice(poiInfo.info.overlapPoint,  reachable[i + 1].info.points.jp, route)) * 1000 +
      //               ' 3: ' + reachable[i + 1].info.dists.distFromJuncToFs)
      // if (i === reachable.length - 1)
      //   console.log(poiInfo.fs.name + ' 1: ' + poiInfo.info.dists.distfromFsToOverlap + ' 2: ' + poiInfo.info.dists.distFromOverlapToEnd)
      pois.push({ type: POIType.FuelStation, info: poiInfo, name: poiInfo.fs.name, coords: poiInfo.fs.latlng,
        junction0: !poiInfo.info.partOfRoute ? { lat: poiInfo.info.points.jp.geometry.coordinates[1], lng: poiInfo.info.points.jp.geometry.coordinates[0] } : null,
        junction1: !poiInfo.info.partOfRoute ? { lat: poiInfo.info.overlapPoint.geometry.coordinates[1], lng: poiInfo.info.overlapPoint.geometry.coordinates[0] } : null,
        distanceToNextPoint: i < reachable.length - 1
          ? poiInfo.info.dists.distfromFsToOverlap + length(lineSlice(poiInfo.info.overlapPoint,  reachable[i + 1].info.points.jp, route)) * 1000 + reachable[i + 1].info.dists.distFromJuncToFs
          : poiInfo.info.dists.distfromFsToOverlap + poiInfo.info.dists.distFromOverlapToEnd })
    }

    console.log('distExpected: ' +  distance + ' accDistGot: ' + pois.reduce((acc, p) => { return acc + p.distanceToNextPoint }, 0))
  }
  pois.push({ type: POIType.Waypoint, info: null, junction0: null, junction1: null, name: wpname, coords: stationInfos[stationInfos.length - 1].destCoords, distanceToNextPoint: 0 })

  return [pois, unreachablePOIs]
}

const extractStationsFromGeometries = (geometries: Geometry[]): FuelStation[] =>
  geometries.map(g => {
    const [[lng, lat],[jlng, jlat]] = [g.geometry, g.junctionLocation]
      .map(l => l
        .replace(/POINT \((.+)\)/, '$1')
        .split(' ')
        .map(Number))
    return {
      latlng: { lat, lng },
      junctionLinkId: g.junctionLinkId,
      junctionLatLng: { lat: jlat, lng: jlng },
      distanceToReach: g.distanceToReach,
      attributes: g.attributes,
      isDiesel: g.attributes.DIESEL && g.attributes.DIESEL.split(';')[0] === 'y',
      name: extractNames(g.attributes.NAMES)[0].text,
      partOfRoute: g.partOfRoute,
    }
  })

const reversePairInto = (coorArr: number[], dest: CoordArr[], offset = 0): CoordArr[] => {
  for (let i = 0; i < coorArr.length; i += 2) {
    dest[offset + i / 2] = [coorArr[i + 1], coorArr[i]]
  }
  return dest
}

const extractNames = (str: string) => {
  const names = str.split('\u001D')
  const ret = new Array(names.length)
  for (var i = 0; i < names.length; i++) {
    const name = names[i]
    const nameTextSplit = name.split('\u001E')
    const nameText = nameTextSplit[0]
    const translit = nameTextSplit[1]
    const translitsObj = []
    const phoneme = nameTextSplit[2]
    const phonemesObj = []

    const languageCode = nameText.substring(0, 3)
    const nameType = nameText.substring(3, 4)
    const isExonym = nameText.substring(4, 5)
    const text = nameText.substring(5, nameText.length)

    if (translit) {
      const translits = translit.split(';')
      for (let j = 0; j < translits.length; j++) {
        const lcode = translits[j].substring(0, 3)
        const tr = translits[j].substring(3, translits[j].length)
        translitsObj.push({ languageCode: lcode, translit: tr })
      }
    }

    if (phoneme) {
      const phonemes = phoneme.split(';')
      for (let j = 0; j < phonemes.length; j++) {
        const lcode = phonemes[j].substring(0, 3)
        const pr = phonemes[j].substring(3, 4)
        const ph = phonemes[j].substring(4, phonemes[j].length)
        phonemesObj.push({ languageCode: lcode, prefered: pr, phoneme: ph })
      }
    }

    ret[i] = { languageCode: languageCode, nameType: nameType, isExonym: isExonym, text: text, translits: translitsObj, phonemes: phonemesObj }
  }
  return ret
}
