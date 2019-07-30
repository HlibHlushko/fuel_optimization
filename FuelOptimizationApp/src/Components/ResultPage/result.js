/* global fetch */

import React from 'react'
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { hereTileUrl } from '../InputPage/Map/MapPic'
import './Result.css'
import CircularProgress from '@material-ui/core/CircularProgress'

const output = [
  { Coordinates: [49.43532, 19.33918], UnloadCars: null, FuelCost: 1.0, FuelVolume: 630 },
  { Coordinates: [49.53532, 19.346918], UnloadCars: [{ BrandId: 1, ModelId: 1, BrandName: 'Renault', ModelName: 'Logan' }, { BrandId: 1, ModelId: 2, BrandName: 'Renault', ModelName: 'Master' }, { BrandId: 2, ModelId: 3, BrandName: 'Nissan', ModelName: 'X-Trail' }], FuelCost: null, FuelVolume: null },
  { Coordinates: [49.39532, 19.71918], UnloadCars: null, FuelCost: 0.94, FuelVolume: 370 }]
const cred = {
  app_id: 'fLR4pqJX0jZZZle8nwaM',
  app_code: 'eM1d0zQLOLaA44cULr6NwQ'
}

class Result extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      polylineShape: null
    }
    this.getPopupText = this.getPopupText.bind(this)
    this.getRoute = this.getRoute.bind(this)
  }

  componentDidMount () {

    // this.getRoute()
  }

  getPopupText (point) {
    let innerData
    if (point.FuelCost != null) {
      innerData = (
        <div>
          <div>Refuel here {point.FuelVolume} liters with cost {point.FuelCost} euro/liter</div>
          <div>Total cost = {Number((point.FuelVolume * point.FuelCost).toFixed(10))} euros </div>
        </div>
      )
    } else { innerData = point.UnloadCars.map((item, id) => <div key={id} > {item.BrandName} {item.ModelName} </div>) }

    return (
      <div>
        <div>Type: {point.FuelCost ? 'FuelStation' : 'Dealer'} </div>
        <div>Name: {point.Coordinates}</div>
        {innerData}
      </div>
    )
  }

  getRoute () {
    let path = ''
    output.map((point, id) => {
      path += `&waypoint${id}=geo!${point.Coordinates[0]},${point.Coordinates[1]}`
      return path
    })
    path += `&waypoint${output.length - 1}=geo!${output[output.length - 1].Coordinates[0]},${output[output.length - 1].Coordinates[1]}`
    const url = `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=${cred.app_id}&app_code=${cred.app_code}${path}&mode=fastest;truck;traffic:disabled&limitedWeight=30.5&height=4.25&representation=overview&routeattributes=sh`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // this.setState({polylineShape: data.response.route[0].shape});
        const res = []
        console.log(data)
        data.response.route[0].shape.map((item) => { res.push(item.split(',')); return res })
        this.setState({ polylineShape: res })
      })
  }

  render () {
    console.log('again')
    if (!this.state.polylineShape) {
      console.log()
      return (<div className='welcome-container'>
        <img src='../../avtologistika-logo.png' alt='logo' className='logo-image' />
        <CircularProgress className='progress' />
        <div className='progress-label'>Obtaining route plan</div>
      </div>)
    }
    let center = null
    center = center || [49.43532, 19.33918]
    const markers = output.map((item, id) => {
      return (
        <Marker key={id}
          position={item.Coordinates} >
          <Popup autoClose={false}>
            {this.getPopupText(item)}
          </Popup>
        </Marker>
      )
    })

    return (
      <div>
        <Map
          center={center}
          className='map'
          zoom={10}
          onClick={this.handleClick}

        >
          {markers}
          <TileLayer
            url={hereTileUrl()}
          />

          {this.state.polylineShape ? <Polyline
            key={1}
            positions={this.state.polylineShape}
            color={'red'}
          > </Polyline> : null}
        </Map>
      </div>
    )
  }
}

export default Result
