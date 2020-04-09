import React from 'react'
import throttle from 'lodash/throttle'
import { lineString } from '@turf/helpers'
import length from '@turf/length'
import lineSlice from '@turf/line-slice'
import { Button, MenuItem, FormControl, Input, InputLabel, Select, ButtonBase } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import { getSuggestionsAsync, getLocationAsync, getRouteAsync, getAddressAtLatLngAsync } from '../../services/hereClient'

import { TripRoute } from '../../components/TripRoute'
import { TripMap } from '../../components/TripMap'
import { MapPopup } from '../../components/MapPopup'
import { CreateCar } from '../../components/CreateCar'

import { localStorageService } from '../../services/localStorageService'
import { tripService } from '../../services/tmService'

const defaultPoint = (address, coordinates, placeholder) => ({
  address,
  coordinates,
  placeholder,
  isActionButtonShown: false,
  load: null,
  unload: null,
  isLoadingInputsShown: false,
  isLoadingActionsShown: false,
  corrections: [],
  newCorrection: 0,
  routeChunk: null,
  error: null
})
const defaultPointPopup = (address, latlng, visible) => ({
  address, latlng, visible
})
const defaultState = () => ({
  newCar: false,
  car: '',
  liters: '',
  brands: [
    { id: 1, brand: 'Audi' },
    { id: 2, brand: 'BMW' },
    { id: 3, brand: 'Nissan' },
    { id: 4, brand: 'Renault' },
    { id: 5, brand: 'Ford' },
    { id: 6, brand: 'Toyota' },
    { id: 7, brand: 'Infinity' }
  ],
  cars: [
    { id: 1, brandId: 1, consumption: 9, tank: 75, model: 'Q7' },
    { id: 2, brandId: 2, consumption: 8, tank: 80, model: 'X5' },
    { id: 3, brandId: 3, consumption: 6, tank: 60, model: 'X-Trail' },
    { id: 4, brandId: 4, consumption: 10, tank: 50, model: 'Logan' },
    { id: 5, brandId: 5, consumption: 5, tank: 63, model: 'Mondeo' },
    { id: 6, brandId: 6, consumption: 12, tank: 60, model: 'Camry' },
    { id: 7, brandId: 7, consumption: 21, tank: 80, model: 'QX80' }
  ],
  suggestions: [],
  points: [
    defaultPoint(null, null, 'Indicate departure point'),
    defaultPoint(null, null, 'Indicate destination')
  ],
  pointPopup: defaultPointPopup(null, null, false),
  saveDisabled: false,
  needPanToBounds: true
})

export class CreateTrip extends React.Component {
  constructor (props) {
    super(props)

    this._pointReqs = []

    this.state = defaultState()

    this.getPointSuggestions = throttle(this.getPointSuggestions.bind(this), 500)
    this.handleSave = this.handleSave.bind(this)
    this.handleDiscardChanges = this.handleDiscardChanges.bind(this)
  }

  handleDiscardChanges () {
    this.setState(defaultState())
  }

  handleSave () {
    // this.setState({ saveDisabled: true, needPanToBounds: true })
    tripService.createTrip({
      car: [...this.state.cars, ...localStorageService.getAllCars()].filter(c => c.id === this.state.car)[0],
      residualFuel: this.state.liters,
      inputPoints: this.state.points
        .reduce((a, p) => {
          if (p.coordinates) {
            a.push({
              latitude: p.coordinates[0],
              longitude: p.coordinates[1],
              name: null,
              address: '"' + JSON.stringify(p.address) + '"',
              type: (p.load || p.unload) ? 0 : 1,
              load: p.load ? p.load : null,
              unload: p.unload ? p.unload : null
            })
            if (p.corrections) {
              for (const c of p.corrections) {
                a.push({
                  latitude: c.coordinates[0],
                  longitude: c.coordinates[1],
                  name: null,
                  address: null,
                  type: 3,
                  load: null,
                  unload: null
                })
              }
            }
          }
          return a
        }, [])
    })
      .then(resp => {
        console.log(resp)
        this.handleDiscardChanges()
        this.setState({ saveDisabled: false })
        this.setState({ tripId: resp.tripId, needToRedirect: true })
        // this.props.onClose(resp)
      })
      .catch(resp => {
        console.log(resp)
        // this.setState({ saveDisabled: false })
      })
  }

  handleChange (field, event) {
    const newValue = event.target.value
    this.setState({ [field]: isNaN(newValue) ? newValue : Number(newValue) })
  }

  addNewPointIfNeeded (points) {
    if (points.every(p => p.address != null)) {
      points.push(defaultPoint(null, null, 'New point'))
    }
  }

  rebuildRoute (i, points) {
    const pointsWithCoords = points.filter(p => p.coordinates)
    if (points.length === 2 && pointsWithCoords.length <= 1) {
      return Promise.resolve()
    }

    const first = i === 0
    const last = i === pointsWithCoords.length
    const waypoints = pointsWithCoords
      .slice(...(first ? [i, i + 2] : last ? [i - 1, i + 1] : [i - 1, i + 2]))
      .map(p => ({ lat: p.coordinates[0], lng: p.coordinates[1] }))
      .reduce((acc, p, i, ps) => {
        if (i !== ps.length - 1) acc.push([p, ps[i + 1]])
        return acc
      }, [])

    const routeReq = Promise.all(
      waypoints.map(wps => getRouteAsync(0, ...wps))
    )
    this._pointReqs[i] = routeReq

    return routeReq
      .then(routes => {
        if (routeReq === this._pointReqs[i]) {
          const chunks = routes.map(r => r[0])
          const points = this.state.points.slice(0)
          if (first) {
            points[0].corrections = []
            points[0].routeChunk = chunks[0]
          } else if (last) {
            points[0].corrections = []
            points[i].routeChunk = chunks[0]
          } else {
            for (const [j, chunk] of chunks.entries()) {
              points[i - 1 + j].routeChunk = chunk
            }
          }
          this.setState({ points, needPanToBounds: true })
          console.log('rebuild route ok')
        } else {
          console.log('rebuild route result ignored')
        }
      })
      .catch(e => {
        if (routeReq === this._pointReqs[i]) {
          console.log('rebuild route error')
          this.pointError(i, 'unreachable')(e)
        } else {
          console.log('rebuild route ignored error')
        }
      })
  }

  pointError (i, message) {
    return (e) => { // handle point change
      if (e.status) {
        const points = this.state.points.slice(0)
        points[i].error = message
        this.setState({ points })
      } else {
        // network error
      }
    }
  }

  handleSelectChange (i, selectedItem) {
    this.setState({ saveDisabled: true })

    getLocationAsync(selectedItem.locationId)
      .then(pos => {
        if (!pos) return [0, 0]

        const coordinates = [pos.Latitude, pos.Longitude]

        const points = [
          ...this.state.points.slice(0, i),
          { ...this.state.points[i], address: selectedItem, error: false, coordinates, isActionButtonShown: true, isLoadingInputsShown: false },
          ...this.state.points.slice(i + 1)
        ]
        this.addNewPointIfNeeded(points)
        this.setState({ points })
        return this.rebuildRoute(i, points)
      }, this.pointError(i, 'location cannot be found'))
      .then(() => this.setState({ saveDisabled: false }))
  }

  handleTripDragStart ({ latlng, pointIndex: idx }) {
    const points = this.state.points
    const geoRouteChunk = lineString(points[idx].routeChunk.map(c => [c[1], c[0]]))
    const startPoint = [points[idx].routeChunk[0][1], points[idx].routeChunk[0][0]]
    const dragStartLength = length(lineSlice(startPoint, [latlng.lng, latlng.lat], geoRouteChunk)) // caution: low performance
    let i = 0
    for (const { length } of points[idx].corrections) {
      if (dragStartLength < length) break
      i++
    }

    points[idx].newCorrection = { index: i, length: dragStartLength, coordinates: null }
    this.setState({ points })

    console.log('dragStart', points[idx].newCorrection)
  }

  handleTripDrag ({ latlng, pointIndex: idx }) {
    const points = this.state.points

    const { coordinates: [slat, slng], corrections, newCorrection } = points[idx]
    const { coordinates: [flat, flng] } = points[idx + 1]

    const correctionsCoords = corrections.map(c => ({ lat: c.coordinates[0], lng: c.coordinates[1] }))
    const newCorrectionsCoords = [
      ...correctionsCoords.slice(0, newCorrection.index),
      latlng,
      ...correctionsCoords.slice(newCorrection.index)
    ]
    console.log('drag', newCorrection, latlng)

    const correctionReq = getRouteAsync(0,
      { lat: slat, lng: slng },
      ...newCorrectionsCoords,
      { lat: flat, lng: flng }
    )
    this._correctionPromise = correctionReq

    correctionReq
      .then(route => {
        if (this._correctionPromise === correctionReq) {
          const newChunk = route.slice(1).reduce((a, c) => a.concat(c), route[0])

          const points = this.state.points.slice(0)
          points[idx].routeChunk = newChunk
          points[idx].newCorrection.coordinates = latlng

          this.setState({ points, needPanToBounds: false })
        } else {
          console.log('ignoring too slow correction', latlng)
        }
      })
      .catch(() => { console.log('error') })
  }

  handleTripDragEnd (idx) {
    const points = this.state.points

    const { newCorrection, corrections } = points[idx]

    if (newCorrection.coordinates) {
      const newCorrections = [
        ...corrections.slice(0, newCorrection.index),
        { length: newCorrection.length, coordinates: [newCorrection.coordinates.lat, newCorrection.coordinates.lng] },
        ...corrections.slice(newCorrection.index)
      ]

      points[idx].corrections = newCorrections
    }

    points[idx].newCorrection = null
    this.setState({ points })
    console.log('dragEnd', points[idx])
  }

  handleMapDblClick (e) {
    const newPopup = defaultPointPopup(null, e.latlng, true)
    this.setState({ pointPopup: newPopup })
    getAddressAtLatLngAsync(e.latlng)
      .then(address => {
        if (!address) {
          return ''
        }
        return address
      }, err => {
        console.log(err)
        return ''
      })
      .then(address => {
        const pointPopup = this.state.pointPopup
        if (newPopup === pointPopup) {
          this.setState({ pointPopup: { ...pointPopup, address } })
        }
      })
  }

  handleOkClick (e) {
    const { points, pointPopup } = this.state
    let i = 0
    for (; i < points.length; i++) {
      if (points[i].address == null) break
    }
    const point = points[i]
    point.address = pointPopup.address
    point.address.coords = pointPopup.latlng
    point.coordinates = [pointPopup.latlng.lat, pointPopup.latlng.lng]
    point.isLoadingActionsShown = true
    this.addNewPointIfNeeded(points)
    this.setState({ points, pointPopup: { ...pointPopup, visible: false }, saveDisabled: true })
    this.rebuildRoute(i, points)
      .then(() => this.setState({ saveDisabled: false }))
  }

  getPointSuggestions (e) {
    return getSuggestionsAsync(e.target.value)
      .then(suggestions => {
        this.setState({ suggestions })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleInputChange (e) {
    e.persist()
    this.getPointSuggestions(e)
  }

  handleActionChange (i) {
    const points = [
      ...this.state.points.slice(0, i),
      { ...this.state.points[i], isActionButtonShown: !this.state.points[i].isActionButtonShown, isLoadingInputsShown: !this.state.points[i].isLoadingInputsShown, load: null, unload: null },
      ...this.state.points.slice(i + 1)
    ]

    this.setState({ points })
  }

  handleActionInput (i, field, event) {
    const points = [
      ...this.state.points.slice(0, i),
      { ...this.state.points[i], [field]: event.target.value },
      ...this.state.points.slice(i + 1)
    ]

    this.setState({ points })
  }

  handleLoadingAction (i) {
    const points = [
      ...this.state.points.slice(0, i),
      { ...this.state.points[i], isActionButtonShown: false, isLoadingInputsShown: false, isLoadingActionsShown: true },
      ...this.state.points.slice(i + 1)
    ]

    this.setState({ points })
  }

  render () {
    const { classes } = this.props
    const { brands, car, liters, points, suggestions, pointPopup, saveDisabled, needPanToBounds, needToRedirect, tripId } = this.state
    const cars = [...this.state.cars, ...localStorageService.getAllCars()]
    const pointError = points.some(p => p.error)
    if (needToRedirect) {
      console.log(tripId, this.state)
      return (
        <Redirect to={`/trip/${tripId}`} />
      )
    }
    return (
      <div className={classes.main}>
        <div className={classes.content}>
          <div className={classes.parameters}>
            <div className={classes.paramHeader}>
              <FormControl className={classes.truck}>
                <InputLabel htmlFor='car' className={classes.litersLabel}>Car</InputLabel>
                <Select
                  displayEmpty
                  value={car || ''}
                  onChange={this.handleChange.bind(this, 'car')}
                  className={classes.truckSelect}
                  classes={{
                    icon: classes.selectIcon
                  }}
                >
                  <MenuItem key='add-new-car' style={{ padding: '0' }}>
                    <ButtonBase
                      style={{ width: '100%', height: '100%', padding: '5px', textAlign: 'left' }}
                      onClick={(event) => {
                        this.setState({ newCar: true })
                        // event.stopPropagation()
                      }}
                    >
                      Add new car...
                    </ButtonBase>
                  </MenuItem>

                  {cars.map(option => {
                    return (
                      <MenuItem key={option.id} value={option.id}>
                        {`${brands.filter(x => x.id === option.brandId)[0].brand} ${option.model}`}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <div className={classes.balance}>
                <FormControl className={classes.litresInput}>
                  <InputLabel className={classes.litersLabel} htmlFor='liters'>Residual fuel, L</InputLabel>
                  <Input
                    id='balance'
                    type='tel'
                    value={liters}
                    // defaultValue={0}
                    onChange={this.handleChange.bind(this, 'liters')}
                    className={classes.litersInput}
                  />
                </FormControl>
              </div>
            </div>
            {
              (
                <CreateCar
                  opened={this.state.newCar}
                  brands={brands}
                  // ok={() => this.setState({ newCar: false })}
                  discard={() => this.setState({ newCar: false })}
                />
              )
            }

            <div className={classes.paramContent}>
              <div className={classes.paramContentWrapper}>
                <TripRoute
                  points={points}
                  suggestions={suggestions}
                  handleInputChange={this.handleInputChange.bind(this)}
                  handleSelectChange={this.handleSelectChange.bind(this)}
                  // handleActionChange={this.handleActionChange.bind(this)}
                  // handleActionInput={this.handleActionInput.bind(this)}
                  // handleLoadingAction={this.handleLoadingAction.bind(this)}
                />
                <div className={classes.buttonContainer}>
                  <Button
                    className={classes.button}
                    variant='outlined'
                    color='secondary'
                    onClick={this.handleDiscardChanges}
                  >
                    Discard
                  </Button>
                  <Button
                    className={classes.button}
                    variant='outlined'
                    color='primary'
                    disabled={saveDisabled || pointError}
                    onClick={this.handleSave}
                  >
                     Save
                  </Button>
                </div>
              </div>
            </div>

          </div>
          <TripMap
            panToBounds={needPanToBounds}
            dragEnabled
            disabled={pointError}
            points={points.filter(p => p.coordinates)}
            routeChunks={points.map(p => p.routeChunk).filter(Boolean)}
            onTripDragStart={this.handleTripDragStart.bind(this)}
            onTripDrag={this.handleTripDrag.bind(this)}
            onTripDragEnd={this.handleTripDragEnd.bind(this)}
            onMapDoubleClick={this.handleMapDblClick.bind(this)}
            popup={
              <MapPopup
                {...pointPopup}
                onOkClick={this.handleOkClick.bind(this)}
              />
            }
          />
        </div>
      </div>
    )
  }
}
