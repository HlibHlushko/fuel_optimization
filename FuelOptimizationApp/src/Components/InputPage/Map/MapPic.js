import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'

import { getMapTileUrl } from '../../../Services/hereClient'

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
    const { appId, appCode } = this.props.credentials
    let center = this.props.point.coordinates
    center = center || [50.372285, 30.575796]
    return (
      <div>
        <Map
          center={center}
          className='map-picture'
          zoom={10}
          onClick={this.handleClick}

        >
          {this.props.point.coordinates ? <Marker position={this.props.point.coordinates} /> : null }
          <TileLayer {...getMapTileUrl(appId, appCode)} />
        </Map>
      </div>
    )
  }
}

export default MapPic
