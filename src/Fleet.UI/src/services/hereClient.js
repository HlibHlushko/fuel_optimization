import { get } from './utilService'
import { lineString } from '@turf/helpers'
import lineSlice from '@turf/line-slice'
import uniqBy from 'lodash.uniqby'

const appId = process.env.REACT_APP_HERE_APP_ID
const appCode = process.env.REACT_APP_HERE_APP_CODE

export const getMapTileUrl = () => ({
  url: `https://{s}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?app_id=${appId}&app_code=${appCode}&ppi=320`,
  subdomains: '1234'
})

export const getTruckRestrictionTileUrl = () => ({
  url: `https://{s}.base.maps.api.here.com/maptile/2.1/truckonlytile/newest/normal.day/{z}/{x}/{y}/512/png8?style=fleet&app_id=${appId}&app_code=${appCode}&ppi=320`,
  subdomains: '1234'
})

const reversePair = shape => {
  const res = new Array(shape.length / 2)
  for (let i = 0; i < shape.length; i += 2) {
    res[i / 2] = [shape[i + 1], shape[i]]
  }
  return res
}
const extractShape = geoJSON => {
  const res = new Array(geoJSON.geometry.coordinates.length)
  for (let i = 0; i < res.length; ++i) {
    res[i] = [geoJSON.geometry.coordinates[i][1], geoJSON.geometry.coordinates[i][0]]
  }
  return res
}
const extractRoute = resj => {
  // console.log(resj.response.route[0].summary)
  return resj.response.route[0].leg.map(({ link }, i) => {
    const { latitude: slat, longitude: slng } = resj.response.route[0].waypoint[i].originalPosition
    const { latitude: elat, longitude: elng } = resj.response.route[0].waypoint[i + 1].originalPosition
    const slink = link[0].shape
    const elink = link[link.length - 1].shape

    const newSLink = extractShape(lineSlice([slng, slat], [slink[slink.length - 1], slink[slink.length - 2]], lineString(reversePair(slink))))
    const newELink = extractShape(lineSlice([elink[1], elink[0]], [elng, elat], lineString(reversePair(elink))))

    const shapeLength = newSLink.length +
      link.slice(1, link.length - 1).reduce((a, c) => a + c.shape.length, 0) / 2 + newELink.length
    const res = new Array(shapeLength)
    for (let i = 0; i < newSLink.length; ++i) {
      res[i] = newSLink[i]
    }
    const eLinkShift = res.length - newELink.length
    for (let i = 0; i < newELink.length; ++i) {
      res[eLinkShift + i] = newELink[i]
    }

    for (let i = newSLink.length, j = 1, k = 0; i < eLinkShift; ++i) {
      if (k >= link[j].shape.length) {
        j = j + 1
        k = 0
      }
      const lat = link[j].shape[k++]
      const lng = link[j].shape[k++]
      res[i] = [lat, lng]
    }
    return res
  })
}

export const getRouteAsync = (...waypoints) => {
  // console.log(waypoints)
  return get('https://fleet.api.here.com/2/calculateroute.json?' +
    ([ // 'routeAttributes=waypoints,summary,shape,legs,notes',
      'app_code=' + appCode,
      'app_id=' + appId,
      ...waypoints.map((wp, i) => 'waypoint' + i + '=geo!' + wp.lat + ',' + wp.lng),
      // 'jsonAttributes=1',
      'legAttributes=none,links',
      // 'mapMatchRadius=500',
      'mode=fastest;car;traffic:disabled',
      'tollPass=transponder'
    ].join('&'))
  ).then(extractRoute)
}
export const getRouteInfoAsync = (...waypoints) => {
  // console.log(waypoints)
  return get('https://fleet.api.here.com/2/calculateroute.json?' +
    ([ // 'routeAttributes=waypoints,summary,shape,legs,notes',
      'app_code=' + appCode,
      'app_id=' + appId,
      ...waypoints.map((wp, i) => 'waypoint' + i + '=geo!' + wp.lat + ',' + wp.lng),
      // 'jsonAttributes=1',
      'legAttributes=none,links',
      // 'mapMatchRadius=500',
      'mode=fastest;car;traffic:disabled',
      'tollPass=transponder'
    ].join('&'))
  ).then(r => r.response.route[0].summary)
}

export const getRouteNewAsync = (...waypoints) =>
  get('https://route.api.here.com/routing/7.2/calculateroute.json?' +
    (['routeAttributes=waypoints,summary,shape,legs,notes',
      'app_code=' + appCode,
      'app_id=' + appId,
      ...waypoints.map((wp, i) => 'waypoint' + i + '=geo!' + wp.lat + ',' + wp.lng),
      'jsonAttributes=33',
      'legAttributes=none,links',
      'mode=fastest;car;traffic:disabled'
    ].join('&'))
  ).then(r => {
    const shape = r.response.route[0].shape
    const dest = new Array(shape.length / 2)
    for (let i = 0; i < shape.length; i += 2) {
      dest[i / 2] = [shape[i], shape[i + 1]]
    }
    return dest
  })

export const getAddressText = (item, preserveMarkup = false) => {
  try {
    const { houseNumber, street, district, city, county, state, country } = item.address

    const suggestion = { main: '', secondary: [], all: [] }
    switch (item.matchLevel) { // matchLevel intersection is not included
      case 'houseNumber':
        if (city.endsWith('район')) {
          suggestion.main = district
        } else {
          suggestion.main = city
        }
        suggestion.all.push(street, houseNumber, city)
        suggestion.secondary.push(street, houseNumber)
        if (district && district !== city) {
          suggestion.all.push(district)
        }
        break
      case 'street':
        suggestion.main = city
        suggestion.all.push(street, city)
        if (district && district !== city) {
          suggestion.secondary.push(district)
          suggestion.all.push(district)
        }
        suggestion.secondary.push(street)
        break
      case 'district':
        suggestion.all.push(district)
        if (district !== city) {
          suggestion.main = city
          suggestion.all.push(city)
          suggestion.secondary.push(district)
        } else {
          suggestion.main = district
        }
        suggestion.all.push(country)
        break
      case 'city':
        suggestion.main = city
        suggestion.all.push(city)
        if (county && county !== city) suggestion.all.push(county)
        if (state && state !== city) suggestion.all.push(state)
        suggestion.all.push(country)
        break
      case 'county':
        suggestion.main = county
        suggestion.all.push(county)
        if (state && state !== county) suggestion.all.push(state)
        suggestion.all.push(country)
    }

    const suggestionText = {
      main: suggestion.main,
      secondary: suggestion.secondary.join(', '),
      all: suggestion.all.join(', ')
    }
    if (item.coords) {
      suggestionText.main = `${item.coords.lat.toFixed(7)}, ${item.coords.lng.toFixed(7)} (${suggestionText.main})`
      suggestionText.all = `${item.coords.lat.toFixed(7)}, ${item.coords.lng.toFixed(7)} (${suggestionText.all})`
    }
    if (!preserveMarkup) {
      for (const prop in suggestionText) {
        if (Object.prototype.hasOwnProperty.call(suggestionText, prop)) {
          suggestionText[prop] = suggestionText[prop].replace(/\[|\]/g, '')
        }
      }
    }
    return suggestionText
  } catch (e) {
    // console.log(e)
    // console.log(item)
    return {}
  }
}
export const getSuggestionsAsync = value => {
  const url = `https://autocomplete.geocoder.api.here.com/6.2/suggest.json?query=${value}&beginHighlight=[&endHighlight=]&app_id=${appId}&app_code=${appCode}`
  return get(url)
    .then(res => uniqBy(res.suggestions
      .filter(s => ['state', 'country', 'postalCode'].every(ml => ml !== s.matchLevel))
      .map(item => {
        item.suggestion = getAddressText(item, true).all
          .split('[')
          .reduce((a, s) => {
            var [s1, s2] = s.split(']')
            if (s1 !== '') {
              if (!s2) {
                a.push({ bold: s2 === '', text: s1 })
              } else {
                a.push(
                  { bold: true, text: s1 },
                  { bold: false, text: s2 }
                )
              }
            }
            return a
          }, [])
        return item
      }), item => item.suggestion.map(c => c.text).join(''))
    )
}

export const getLocationAsync = locationId => {
  const url = 'https://geocoder.api.here.com/6.2/geocode.json'
  return get(`${url}?locationId=${locationId}&app_id=${appId}&app_code=${appCode}`)
    .then(resj => {
      if (!resj.Response.View[0]) return null
      return resj.Response.View[0].Result[0].Location.DisplayPosition
    })
}

export const getAddressAtLatLngAsync = ({ lat, lng }) => {
  const url = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json'
  return get(`${url}?prox=${lat.toFixed(7)},${lng.toFixed(7)},10&jsonattributes=1&app_id=${appId}&app_code=${appCode}&mode=retrieveAddresses`)
    .then(resj => {
      const hereAddress = resj.response.view[0]
      if (!hereAddress) return null
      console.log(hereAddress)
      let address = null
      for (let i = 0; i < hereAddress.result.length; i++) {
        const a = hereAddress.result[i]
        if (a.distance > 20) break
        if ((a.matchLevel === 'street' && a.location.address.street != null) ||
          a.matchLevel === 'houseNumber') {
          address = a
          break
        }
      }
      if (!address) {
        address = hereAddress.result[0]
        if (address.location.address.district != null) {
          address.matchLevel = 'district'
        } else if (address.location.address.city != null) {
          address.matchLevel = 'city'
        } else if (address.location.address.country != null) {
          address.matchLevel = 'country'
        } else {
          return null
        }
      }

      address.address = address.location.address
      if (address.address.additionalData) {
        const country = address.address.additionalData.filter(d => d.key === 'CountryName')
        if (country[0]) {
          address.address.country = country[0].value
        }
      }
      return address
    })
}
