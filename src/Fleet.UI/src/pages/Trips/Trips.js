import React from 'react'
import { Button, Paper } from '@material-ui/core'

import { TripMap } from '../../components/TripMap'
import { Redirect } from 'react-router-dom'

export class Trips extends React.Component {
  constructor (props) {
    super(props)

    this._tripReq = null

    this.state = {
    }
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
  }

  componentDidMount () {
    // const { id } = useParams()
    this.setState({ tripId: this.props.match.params })
    // console.log(this.props.match.params)
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
    if (!newIsOpen) {
      this.setState({ tripId: newId.tripId, needRedirect: true })
    }
  }

  render () {
    const {
      page,
      button, buttonText,
      main,
      paper
    } = this.props.classes
    const { selectedPoints, originalRoute, routeChunks } = this.state
    if (this.state.isOpen) {
      return (
        <Redirect to='/create-trip' />
      )
    }

    return (
      <div className={page}>
        <div className={main}>
          <Button
            variant='contained'
            className={button}
            color='primary'
            onClick={this.handleOpenDialog}
          >
            <div className={buttonText}>Create route</div>
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
