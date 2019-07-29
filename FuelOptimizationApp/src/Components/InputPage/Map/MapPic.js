import { Map, TileLayer, Marker } from 'react-leaflet'
import React from 'react'

export const hereCredentials = {
  id: 'fLR4pqJX0jZZZle8nwaM',
  code: 'eM1d0zQLOLaA44cULr6NwQ'
}

export const hereTileUrl = () => `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&ppi=320`

class MapPic extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      app_id: 'fLR4pqJX0jZZZle8nwaM',
      app_code: 'eM1d0zQLOLaA44cULr6NwQ',
      mapRef: React.createRef()
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    const position = [event.latlng.lat, event.latlng.lng]
    this.props.handlePointSelected(position)
  }

  render () {
    let center = this.props.point.coordinates
    center = center || [49.43532, 19.33918]
    return (
      <div>
        <Map
          center={center}
          className='map-picture'
          zoom={10}
          onClick={this.handleClick}

        >
          {this.props.point.coordinates ? <Marker position={this.props.point.coordinates} /> : null }
          <TileLayer
            url={hereTileUrl()}
          />
        </Map>
      </div>
    )
  }
}

export default MapPic
