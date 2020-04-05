import React from 'react'
import { Button, Paper, Dialog } from '@material-ui/core'

import { TripMap } from '../../components/TripMap'
import { Redirect } from 'react-router-dom'
import { tripService } from '../../services/tmService'
import { getRouteAsync, getRouteNewAsync } from '../../services/hereClient'

export class Trips extends React.Component {
  constructor (props) {
    super(props)

    this._tripReq = null

    this.state = {
      found: false,
      trip: null
    }
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleBuildRoute = this.handleBuildRoute.bind(this)
  }

  componentDidMount () {
    const { id } = this.props.match.params
    console.log(id)
    tripService.getTrip(id)
      .then(resp => {
        // console.log(resp)
        const { inputPoints, optimizedPoints } = resp
        console.log(inputPoints || [])
        this.handleBuildRoute(this.mapToPoint(inputPoints || []), this.mapToPoint(optimizedPoints || []))
        this.setState({ trip: resp, found: true })
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

  updateTrips () {}

  handleOpenDialog (newId) {
    const newIsOpen = !this.state.isOpen
    this.setState({ isOpen: newIsOpen })
  }

  handleBuildRoute (points, optimizedPoints) {
    let reqs
    if (points.length > 0) { reqs = [getRouteAsync(...points.map(p => p.coordinates))] }
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
      return tripPromise.then(([original, ...optimizedChunks]) => {
        this.setState({
          // selectedId: id,
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
      paper
    } = this.props.classes
    const { trip, found, selectedPoints, originalRoute, routeChunks } = this.state
    if (this.state.isOpen) {
      return (
        <Redirect to='/create-trip' />
      )
    }
    if (found && !trip) {
      return (
        <Dialog open>Trip not found:(</Dialog>
      )
    }
    // if (!trip)
    return (
      <div className={page}>
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
              /* popup for truck tracking */
              popup={null}/* {popupLatLng &&
                <Marker
                  position={popupLatLng}
                  icon={icon({ iconUrl: pin, iconSize: [12, 12], popupAnchor: [0, 12] })}
                  ref={el => {
                    if (el) {
                      // el.leafletElement.openPopup()
                      // el.leafletElement.off('click')
                    }
                  }}
                >
                  <Popup
                    className={popup}
                    autoPan={false}
                    closeButton={false}
                    autoClose={false}
                    closeOnEscapeKey={false}
                    closeOnClick={false}
                  >
                    <div className={popupTile} style={{ height: '80px' }}>
                      <div className={popupRow}>
                        <span className={clsx(small, upper, bold)}>id</span>
                        <span className={medium}>{id}</span>
                      </div>
                      <div className={popupRow}>
                        <span className={clsx(small, upper, bold)}>sensor status</span>
                        <span className={medium} style={{ color: '#3A84FF' }}>Active</span>
                      </div>
                    </div>
                    <div style={{ height: '10px', opacity: 0.3 }} />
                    <div className={popupTile}>
                      <span className={clsx(small, upper, bold)}>route details</span>
                      <div style={{ marginTop: '33px' }}>
                        <RouteList
                          points={points
                            .filter(p => p.type === POINT_TYPE.waypoint)}
                          renderPoint={({ address }, i) => (
                            <span className={medium}>{getAddressText(address).all}</span>
                          )}
                        />
                      </div>
                    </div>
                  </Popup>
                </Marker>} */
            />
          </Paper>
        </div>
      </div>
    )
  }
}
