/* global fetch */

import React from 'react'
import Route from '../Route/route'
import TruckPicker from '../TruckPicker/TruckPicker'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import './optimization.css'
import { Link } from 'react-router-dom'
import nextId from 'react-id-generator'

const necesseryPoints = [{
  id: nextId(),
  name: '',
  startOrFinish: 1,
  orders: null,
  coordinates: null,
  locationName: ''
},
{
  id: nextId(),
  name: '',
  startOrFinish: -1,
  orders: null,
  coordinates: null,
  locationName: ''
}]

class Optimization extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTruck: { value: 1, label: 'Lohr 1.21' },
      points: necesseryPoints,
      isDialogOpened: false,
      cars: []
    }
    this.handleTruckChanged = this.handleTruckChanged.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleOrderAdded = this.handleOrderAdded.bind(this)
    this.handleOrderChanged = this.handleOrderChanged.bind(this)
    this.handleOrderDeleted = this.handleOrderDeleted.bind(this)
    this.handleSendRequested = this.handleSendRequested.bind(this)
    this.handlePointAdded = this.handlePointAdded.bind(this)
    this.handlePointDeleted = this.handlePointDeleted.bind(this)
    this.handlePointSelected = this.handlePointSelected.bind(this)
  }

  componentDidMount () {
    fetch('http://localhost:1984/api/GetBrands', {
      method: 'GET',
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ cars: data })
      })
  }

  handleTruckChanged (truck) {
    this.setState({ selectedTruck: truck })
  }

  handleOrderChanged (pointId, orderId, newOrder) {
    pointId = this.state.points.findIndex(p => p.id === pointId)
    this.setState({
      points: [...this.state.points.slice(0, pointId),
        {
          ...this.state.points[pointId],
          orders: [...this.state.points[pointId].orders.slice(0, orderId),
            newOrder,
            ...this.state.points[pointId].orders.slice(orderId + 1)]
        },
        ...this.state.points.slice(pointId + 1)]
    })
  }

  handleOrderAdded (pointId) {
    pointId = this.state.points.findIndex(p => p.id === pointId)
    const emptyOrder = {
      selectedBrand: null,
      selectedModel: null,
      number: 1
    }
    const newOrders = this.state.points[pointId].orders ? [...this.state.points[pointId].orders, emptyOrder] : [emptyOrder]

    this.setState({
      points: [...this.state.points.slice(0, pointId),
        {
          ...this.state.points[pointId],
          orders: newOrders
        },
        ...this.state.points.slice(pointId + 1)]
    })
  }

  handleOrderDeleted (pointId, orderId) {
    pointId = this.state.points.findIndex(p => p.id === pointId)
    this.setState({
      points:
                [...this.state.points.slice(0, pointId),
                  {
                    ...this.state.points[pointId],
                    orders: [...this.state.points[pointId].orders.slice(0, orderId),
                      ...this.state.points[pointId].orders.slice(orderId + 1)]
                  },
                  ...this.state.points.slice(pointId + 1)]
    })
  }

  handlePointAdded () {
    this.setState({
      points: [...this.state.points.slice(0, this.state.points.length - 1), {
        id: nextId(),
        startOrFinish: 0,
        name: '',
        coordinates: null,
        orders: [
          {
            selectedBrand: null,
            selectedModel: null,
            number: 1
          }
        ]
      },
      this.state.points[this.state.points.length - 1]]
    })
  }

  handlePointDeleted (pointId) {
    pointId = this.state.points.findIndex(p => p.id === pointId)

    this.setState({
      points:
                [...this.state.points.slice(0, pointId),
                  ...this.state.points.slice(pointId + 1)]
    })
  }

  handlePointSelected (pointId, coordinates) {
    pointId = this.state.points.findIndex(p => p.id === pointId)
    const { appId, appCode } = this.props.credentials
    const url = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json'
    return fetch(`${url}?prox=${coordinates[0]},${coordinates[1]}&mode=retrieveAddresses&maxresults=1&app_id=${appId}&app_code=${appCode}`)
      .then(response => {
        return (response.json())
      }).then(json => {
        if (json.Response.View.length === 0) return this.state.points[pointId].locationName

        const res = json.Response.View[0].Result[0].Location.Address
        this.setState({
          points: [...this.state.points.slice(0, pointId),
            {
              ...this.state.points[pointId],
              locationName: res.Label,
              coordinates: [json.Response.View[0].Result[0].Location.DisplayPosition.Latitude, json.Response.View[0].Result[0].Location.DisplayPosition.Longitude],
              name: res.AdditionalData[0].value + (res.City ? ', ' + res.City : '')
            },
            ...this.state.points.slice(pointId + 1)]
        })
        return res.Label
      })
  }

  handleSendRequested (event) {
    const points = this.state.points
    let filled = !!this.state.selectedTruck

    for (let i = 0; i < points.length; ++i) {
      if (!points[i].coordinates || !points[i].orders) {
        filled = false
        break
      }
      for (let j = 0; j < points[i].orders.length; ++j) {
        if (!points[i].orders[j].selectedBrand || !points[i].orders[j].selectedModel) {
          filled = false
          break
        }
      }
    }

    if (!filled) {
      this.setState({ isDialogOpened: true })
      event.preventDefault()
    } else {
      this.props.handleStartOptimization(this.state.points)
    }
  }

  handleCloseDialog () {
    this.setState({ isDialogOpened: false })
  }

  render () {
    return (
      <div>
        <TruckPicker handleTruckChanged={this.handleTruckChanged} />
        <Route
          points={this.state.points}
          credentials={this.props.credentials}
          cars={this.state.cars}
          handleOrderChanged={this.handleOrderChanged}
          handleOrderAdded={this.handleOrderAdded}
          handleOrderDeleted={this.handleOrderDeleted}
          handlePointAdded={this.handlePointAdded}
          handlePointDeleted={this.handlePointDeleted}
          handlePointSelected={this.handlePointSelected}
          // handleLocationIdChanged = {this.handleLocationIdChanged}
        />
        <div>
          <Fab className='add-point-icon' size='small' onClick={this.handlePointAdded}>
            <AddIcon />
          </Fab>
          <Link to='/result' onClick={this.handleSendRequested}>
            <Fab variant='extended' size='medium' className='send-button' onClick={this.handleSendRequested}>
                            Send
            </Fab>
          </Link>

        </div>
        <Dialog open={this.state.isDialogOpened}>
          <DialogTitle> Warning </DialogTitle>
          <DialogContent>
            <DialogContentText>
                            You have unfilled fields, check your input and try again
            </DialogContentText>
            <DialogActions>
              <Button onClick={this.handleCloseDialog}>OK</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default Optimization
