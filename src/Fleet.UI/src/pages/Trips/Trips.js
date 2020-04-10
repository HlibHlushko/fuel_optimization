import React from 'react'
import { Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { Summary } from '../../components/Summary'
import { TripMap } from '../../components/TripMap'
import { Redirect } from 'react-router-dom'
import { tripService } from '../../services/tmService'
import { getRouteAsync, getRouteNewAsync } from '../../services/hereClient'
import { updateService } from '../../services/updateService'
export class Trips extends React.Component {
  constructor (props) {
    super(props)

    this._tripReq = null

    this.state = {
      found: false,
      trip: null,
      redirect: false
    }
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleBuildRoute = this.handleBuildRoute.bind(this)
  }

  componentDidMount () {
    const { id } = this.props.match.params
    tripService.getTrip(id)
      .then(resp => {
        console.log(resp)
        const { inputPoints, optimizedPoints } = resp
        this.handleBuildRoute(this.mapToPoint(inputPoints || []), this.mapToPoint(optimizedPoints || []))
        this.setState({ trip: resp, found: true })
      })
      .then(() => {
        updateService.connection.on('UpdateTrip', (trip) => {
          console.log(trip)
          this.handleBuildRoute(this.mapToPoint(trip.inputPoints || []), this.mapToPoint(trip.optimizedPoints || []))
          this.setState({ trip: trip, found: true })
        })
      })
  }

  mapToPoint (ps) {
    return ps.map(p => ({
      type: p.type,
      coordinates: { lat: p.latitude, lng: p.longitude },
      address: p.address && JSON.parse(p.address.slice(1, -1)),
      name: p.name,
      refuel: p.refuel,
      cost: p.cost,
      load: p.load,
      unload: p.unload,
      residualFuel: p.remainder
    }))
  }

  handleOpenDialog (newId) {
    const newIsOpen = !this.state.isOpen
    this.setState({ isOpen: newIsOpen })
  }

  handleBuildRoute (points, optimizedPoints) {
    let reqs = []
    if (points.length > 0) { reqs = [getRouteAsync(1, ...points.map(p => p.coordinates))] }
    if (optimizedPoints.length > 0) {
      for (let i = 0; i < optimizedPoints.length; ++i) {
        if (optimizedPoints[i].type === 4) {
          reqs.push(getRouteNewAsync(...optimizedPoints.slice(i, i + 3).map(p => p.coordinates)))
          i += 2
        }
      }
    }
    if (reqs) {
      const tripPromise = Promise.all(reqs)
      return tripPromise.then(([route, ...optimizedChunks]) => {
        const info = route && route.info
        const original = route && route.route

        this.setState({
          info: info,
          selectedPoints: optimizedPoints.length > 0 ? optimizedPoints : points,
          originalRoute: optimizedPoints.length > 0 ? original : null,
          routeChunks: optimizedChunks.length > 0 ? optimizedChunks : optimizedPoints.length > 0 ? [] : original
        })
      })
    }
  }

  render () {
    const {
      page,
      button, buttonText,
      main,
      paper,
      dialog, dialogText
    } = this.props.classes
    const { trip, info, found, selectedPoints, originalRoute, routeChunks } = this.state
    if (this.state.isOpen || this.state.redirect) {
      return (
        <Redirect to='/create-trip' />
      )
    }

    // if (!trip)
    return (
      <div className={page}>
        {(found && !trip.inputPoints) ? (
          <Dialog open className={dialog}>
            <DialogTitle className={dialogText}>Trip not found :(</DialogTitle>
            <DialogContent className={dialogText}>Go to create new trip page?</DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ redirect: true })}>Yes</Button>
            </DialogActions>
          </Dialog>
        )
          : (
            <Summary
              trip={trip}
              info={info}
            />)}
        <div className={main}>
          <Button
            variant='contained'
            className={button}
            color='primary'
            onClick={this.handleOpenDialog}
          >
            <div className={buttonText}>Create new trip</div>
          </Button>

          <Paper className={paper}>
            <TripMap
              mapActiveArea
              panToBounds
              points={selectedPoints}
              originalRoute={originalRoute}
              routeChunks={routeChunks}
            />
          </Paper>

        </div>
      </div>
    )
  }
}
