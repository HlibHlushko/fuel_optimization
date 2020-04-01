import React from 'react'
import { Button, Paper, CircularProgress, IconButton } from '@material-ui/core'
import clsx from 'clsx'

import donePic from '../../pics/done.png'
import errorPic from '../../pics/error.png'

import { CreateTrip } from '../CreateTrip'
import { Table } from '../../components/Table'
import { Trip } from '../../components/Trip'
import { TripMap } from '../../components/TripMap'

import { tripService } from '../../services/tmService'
import { getRouteAsync, getRouteNewAsync, getAddressText } from '../../services/hereClient'
// import { ws } from '../../services/wsService'

import GetAppIcon from '@material-ui/icons/GetApp'

// import { truckService } from '../../services/fmService'
// import { userClient } from '../../services/userClient'

export class Trips extends React.Component {
  constructor (props) {
    super(props)

    this._tripReq = null

    this.state = {
      isOpen: true,
      headRows: [
        // { id: 'id', numericHead: false, numeric: false, disablePadding: false, label: 'Id' },
        // { id: 'description',numericHead: false, numeric: false, disablePadding: false, label: 'Description' },
        { id: 'trip', numericHead: false, numeric: false, disablePadding: false, label: 'Route' },
        // { id: 'distance',numericHead: false, numeric: true, disablePadding: false, label: 'Distance' },
        { id: 'fuel', numericHead: true, numeric: true, disablePadding: false, maxWidth: 100, label: 'Residual fuel' },
        { id: 'status', numericHead: false, numeric: false, disablePadding: true, label: 'Status' },
        { id: 'download', numericHead: false, numeric: false, disablePadding: true, label: 'Download' }
        // { id: 'capacity',numericHead: false, numeric: true, disablePadding: false, label: 'Capacity (kg)' }
      ]
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
  }

  componentDidMount () {
    this.updateTrips()
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

  updateTrips () {
    // return Promise.all([
    //   // tripService.getAllTrips(),
    //   // truckService.getAllTrucks(),
    //   // userClient.getUsersAsync()
    // ])
    //   .then(([resp, trucks, users]) => {
    //     const rows = resp.map(({ id, driverId, truckId, status, residualFuel, load, unload, inputPoints, optimizedPoints }) => ({
    //       id,
    //       driverId,
    //       truckId,
    //       fuel: residualFuel,
    //       points: this.mapToPoint(inputPoints),
    //       optimizedPoints: optimizedPoints ? this.mapToPoint(optimizedPoints) : [],
    //       status
    //     }))
    //     this.setState({ rows })
    //   })
  }

  handleOpenDialog () {
    const newIsOpen = !this.state.isOpen
    this.setState({ isOpen: newIsOpen })
    if (!newIsOpen) this.updateTrips()
  }

  handleDelete ({ id }) {
    tripService.deleteTrip(id)
      .then(() => this.updateTrips())
  }

  handleSelect ({ id, points, optimizedPoints }) {
    const reqs = [getRouteAsync(...points.map(p => p.coordinates))]
    if (optimizedPoints.length > 0) {
      for (let i = 0; i < optimizedPoints.length; ++i) {
        if (optimizedPoints[i].type === 4) {
          reqs.push(getRouteNewAsync(...optimizedPoints.slice(i, i + 3).map(p => p.coordinates)))
          i += 2
        }
      }
    }

    const tripPromise = Promise.all(reqs)
    this._tripReq = tripPromise

    return tripPromise.then(([original, ...optimizedChunks]) => {
      if (tripPromise === this._tripReq) {
        this.setState({
          selectedId: id,
          selectedPoints: optimizedPoints.length > 0 ? optimizedPoints : points,
          originalRoute: optimizedPoints.length > 0 ? original : null,
          routeChunks: optimizedChunks.length > 0 ? optimizedChunks : optimizedPoints.length > 0 ? [] : original
        })
      } else {
        console.warn('ignoring: ' + JSON.stringify(optimizedPoints))
      }
    })
  }

  render () {
    const {
      page,
      tripsToolbar,
      button, buttonText,
      main,
      tableContainer,
      paper,
      large, upper, bold
    } = this.props.classes
    const { rows, headRows, selectedId, selectedPoints, originalRoute, routeChunks } = this.state
    if (this.state.isOpen) {
      return (
        <CreateTrip
          onClose={this.handleOpenDialog}
        />
      )
    }

    const renderStatus = (status) => {
      const { progressDone, statusClass } = this.props.classes
      if (status === 'loading') return <CircularProgress size={20} className={progressDone} />
      if (status === 'done') return <img src={donePic} alt='done' className={statusClass} />
      if (status === 'error') return <img src={errorPic} alt='done' className={statusClass} />
    }
    return (
      <div className={page}>
        <div className={tripsToolbar}>
          <div className={clsx(large, upper, bold)}>Routes</div>
          <Button
            className={button}
            onClick={this.handleOpenDialog}
          >
            <div className={buttonText}>Create route</div>
          </Button>
        </div>
        <div className={main}>
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
          <Paper className={tableContainer}>
            <Table
              headRows={headRows}
              isDeletion
              onDeleteRequested={this.handleDelete}
              rows={rows && rows.map(row => {
                const selected = row.id === selectedId
                let docLink = null
                if (row.doc) {
                  const point1 = getAddressText(row.optimizedPoints[0].address).main
                  const point2 = getAddressText(row.optimizedPoints[row.optimizedPoints.length - 1].address).main
                  const fileName = `Route ${row.id} ${point1}-${point2}.pdf`
                  docLink = (

                    <a
                      href={row.doc.url}
                      download={fileName}
                      onClick={() => {
                        if (window.navigator.msSaveBlob) {
                          window.navigator.msSaveBlob(row.doc.blob, { fileName })
                        }
                      }}
                    >
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation()
                        }}
                      >
                        <GetAppIcon />
                      </IconButton>
                    </a>
                  )
                }

                return {
                  ...row,
                  status: renderStatus(row.status),
                  download: docLink || (<IconButton disabled> <GetAppIcon disabled /> </IconButton>),
                  trip: <Trip selected={selected} points={selected ? selectedPoints : row.points} />
                }
              })}
              points={selectedPoints}
              onSelect={this.handleSelect.bind(this)}
            />
          </Paper>
        </div>
      </div>
    )
  }
}
