import React from 'react'
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet'
import { getMapTileUrl, getTruckRestrictionTileUrl } from '../../Services/hereClient'
import { getFuelStationsAlongTwoPointsRouteAsync, getDieselStationsAlongRouteAsync } from '../../Services/fuelStationsService'
import './fuelStations.css'

class FuelStations extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      departCoords: { lat: 50.51696, lng: 30.37131 },
      destCoords: { lat: 50.37766, lng: 30.550723 },
      fuelStations: null,
      routeShape: null
    }
  }

  render () {
    const { appId, appCode } = this.props.credentials
    const { departCoords, destCoords } = this.state
    const center = [49.43532, 19.33918]
    return (
      <div>
        <button onClick={() => {
          console.log(getDieselStationsAlongRouteAsync(appId, appCode, departCoords, destCoords))
          getFuelStationsAlongTwoPointsRouteAsync(appId, appCode, departCoords, destCoords)
            .then(stations => this.setState({ fuelStations: stations.fuelStations, routeShape: stations.originalRouteShape }))
            .catch(e => console.log('Error while fetching fuel stations ', e))
        }}>Find fuel stations</button>
        <Map
          center={center}
          className='map'
          zoom={10}
        >
          <TileLayer {...getMapTileUrl(appId, appCode)} />
          <TileLayer {...getTruckRestrictionTileUrl(appId, appCode)} />
          {this.state.routeShape &&
            <Polyline
              positions={this.state.routeShape}
              color={'blue'}
            />}
          {this.state.fuelStations &&
            <React.Fragment>
              <Marker
                position={this.state.departCoords}
                onClick={() => console.log({ coords: this.state.departCoords, departDistance: this.state.fuelStations.departDistance, departPath: this.state.fuelStations.departPath })}
              />
              <Polyline
                positions={this.state.fuelStations.departPath}
                color={'cyan'}
              />
              <Marker
                position={this.state.destCoords}
                onClick={() => console.log({ coords: this.state.destCoords, destDistance: this.state.fuelStations.destDistance, destPath: this.state.fuelStations.destPath })}
              />
              <Polyline
                positions={this.state.fuelStations.destPath}
                color={'cyan'}
              />
            </React.Fragment>}
          {this.state.fuelStations && this.state.fuelStations.stations.map(fs =>
            <Marker
              key={`mk-${fs.latlng.lat}${fs.latlng.lng}`}
              position={fs.latlng}
              onClick={() => console.log(fs)}
              opacity={fs.isDiesel ? 1 : 0.5}
            />)}
          {this.state.fuelStations && this.state.fuelStations.stations
            .filter(fs => Boolean(fs.pathToNextPoint))
            .map(fs =>
              <Polyline
                key={`pl-${fs.latlng.lat}${fs.latlng.lng}`}
                positions={fs.pathToNextPoint}
                color={'green'}
              />)}
        </Map>
      </div>
    )
  }
}

export default FuelStations
