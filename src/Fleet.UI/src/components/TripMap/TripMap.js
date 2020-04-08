import React from 'react'
import { icon } from 'leaflet'
import 'leaflet-active-area'
import { TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet'
import { multiLineString } from '@turf/helpers'
import flip from '@turf/flip'
import { getCoords } from '@turf/invariant'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import ts from '@turf/transform-scale'

import pin from '../../pics/Pin.svg'
import hollowPin from '../../pics/pin-hollow.svg'
import fsPin from '../../pics/fs-pin.svg'

import { Map } from '../../components/Map'
import { getAddressText, getMapTileUrl } from '../../services/hereClient'

const POINT_TYPE = {
  waypoint: 1,
  fuelStation: 2,
  junktion: 4
}

const firstWPIcon = icon({ iconUrl: pin, iconSize: [14, 14] })
const regularWPIcon = icon({ iconUrl: pin, iconSize: [10, 10] })
const lastWPIcon = icon({ iconUrl: hollowPin, iconSize: [18, 18] })
const FSIcon = icon({ iconUrl: fsPin, iconSize: [24, 24], iconAnchor: [12, 24] })

const _getCoords = geoJSON => getCoords(flip(geoJSON))
const getRegAndMaxBounds = geoJSON => {
  const bb = bboxPolygon(bbox(geoJSON))
  return [ts(bb, 1.2), ts(bb, 2)].map(_getCoords)
}

let onMove
export class TripMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {
      classes: { map, marker },
      disabled,
      dragEnabled, panToBounds,
      points, routeChunks, originalRoute, popup,
      onTripDragStart, onTripDragEnd, onMapDoubleClick
    } = this.props
    const { dotLatLng, index } = this.state
    const setDotLanLng = (x) => this.setState({ dotLatLng: x })
    const setIndex = (x) => this.setState({ index: x })
    let routeChunksGeoJSON = null
    if (panToBounds) {
      if (originalRoute) {
        routeChunksGeoJSON = multiLineString(originalRoute.map(c => c.map(p => [p[1], p[0]])))
      } else if (routeChunks && routeChunks.length > 0) {
        routeChunksGeoJSON = multiLineString(routeChunks.map(c => c.map(p => [p[1], p[0]])))
      }
    }

    // const mapEl = useRef(null)
    // useEffect(() => {
    //   if (mapActiveArea) mapEl.current.leafletElement.setActiveArea(mapArea, true)
    // }, [mapActiveArea])

    const [bounds/*, maxBounds */] = routeChunksGeoJSON ? getRegAndMaxBounds(routeChunksGeoJSON) : [null, null]
    return (
      <div className={map}>
        <Map
          // ref={useRef(null)}
          center={!points || points.length === 0
            ? [50.400158, 30.560204]
            : points.length === 1 && points[0].coordinates}
          bounds={panToBounds && bounds}
          maxBounds={/* panToBounds && maxBounds ? maxBounds : */ [[-90, -185], [90, 185]]}
          maxBoundsViscosity={/* panToBounds && maxBounds ? 0.8 : */ 1.0}
          className={map}
          zoom={10}
          minZoom={2}
          maxZoom={19}
          dragging={!dotLatLng}
          doubleClickZoom={onMapDoubleClick == null}
          ondblclick={onMapDoubleClick}
          onmouseup={e => {
            if (dragEnabled && dotLatLng) {
              setDotLanLng(null)
              onTripDragEnd(index)
            }
          }}
          onmousemove={e => {
            if (dragEnabled && dotLatLng != null) {
              setDotLanLng(e.latlng)
              onMove({ latlng: e.latlng, pointIndex: index })
            }
          }}
        >
          <TileLayer {...getMapTileUrl()} />
          {dotLatLng &&
            <Marker
              icon={icon({
                iconUrl: pin,
                iconSize: [8, 8],
                className: marker
              })}
              position={dotLatLng}
            />}
          {originalRoute &&
            <Polyline
              positions={originalRoute}
              color='#3a84ff'
              opacity={0.8}
              weight={6}
            />}
          {routeChunks && routeChunks.map((r, i) =>
            <Polyline
              key={i}
              positions={r}
              color={disabled ? 'grey' : originalRoute ? 'rgb(240, 101, 101)' : '#3a84ff'}
              opacity={0.8}
              weight={6}
              onmousedown={e => {
                if (dragEnabled) {
                  setIndex(i)
                  setDotLanLng(e.latlng)
                  onTripDragStart({ latlng: e.latlng, pointIndex: i })
                }
              }}
            />
          )}
          {/* {bounds &&
            <Polygon
              positions={bounds}
              color='green'
            />}
          {maxBounds &&
            <Polygon
              positions={maxBounds}
              color='red'
            />} */}
          {points && points
            .filter(p => p.type !== POINT_TYPE.junktion)
            .map((p, i, ps) => {
              return (
                <Marker
                  key={i}
                  icon={i === 0
                    ? firstWPIcon
                    : i === ps.length - 1
                      ? lastWPIcon
                      : p.type === POINT_TYPE.fuelStation
                        ? FSIcon
                        : regularWPIcon}
                  position={p.coordinates}
                >
                  {p.type === POINT_TYPE.fuelStation &&
                    <Tooltip offset={[0, -12]}>
                      <div>Volume: {p.refuel}</div>
                      <div>Cost: {p.cost} </div>
                    </Tooltip>}
                  {p.type === POINT_TYPE.waypoint &&
                    <Tooltip offset={[0, 0]}>
                      <div>{`Address: ${getAddressText(p.address).all}`}</div>
                      <div>{p.load && `Load: ${p.load}`}</div>
                      <div>{p.unload && `Unload: ${p.unload}`}</div>
                    </Tooltip>}
                </Marker>
              )
            })}
          {popup}
        </Map>
      </div>
    )
  }
}
