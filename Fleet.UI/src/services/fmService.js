import { isLocal, delay } from './utilService'
import { get, delete_, put } from './fetchService'

const url = process.env.REACT_APP_FM_URL
export const trailerService = {

  getTrailerTypesAsync () {
    return get(`${url}/trailer/types`)
  },
  getWheelsOnAxlesAsync () {
    return get(`${url}/trailer/wheels-on-axles`)
  },
  getAllTrailers () {
    return get(`${url}/trailer/all`)
  },
  createTrailer (trailer) {
    return put(`${url}/trailer`, JSON.stringify(trailer))
  },
  deleteTrailer (id) {
    return delete_(`${url}/trailer/${id}`)
  }
}

export const tractorService = {
  getTractorTypesAsync () {
    return get(`${url}/tractor/types`)
  },
  getWheelFormulaTypesAsync () {
    return get(`${url}/tractor/wheel-formula-types`)
  },
  getAllTractors () {
    return get(`${url}/tractor/all`)
  },
  createTractor (tractor) {
    return put(`${url}/tractor`, JSON.stringify(tractor))
  },
  deleteTractor (id) {
    return delete_(`${url}/tractor/${id}`)
  }
}
export const truckService = {
  getAllTrucks () {
    return get(`${url}/truck/all`)
  },
  createTruck (truck) {
    return put(`${url}/truck`, JSON.stringify(truck))
  },
  deleteTruck (id) {
    return delete_(`${url}/truck/${id}`)
  }
}

if (isLocal) {
  /// trailers ///
  trailerService.getAllTrailers = delay(() => [{ id: 2, type: 1, model: 'Lohr 1.21', stateNumberOrVin: 'KO9919KO', trailerId: 123, axles: 3, wheelsOnAxle: 1, capacity: 760 }])
  trailerService.getTrailerTypesAsync = delay(() => [{ id: 1, type: 'Trailer' }, { id: 2, type: 'SemiTrailer' }])
  trailerService.getWheelsOnAxlesAsync = delay(() => [{ id: 1, wheelsOnAxleNumber: 2 }, { id: 2, wheelsOnAxleNumber: 4 }, { id: 3, wheelsOnAxleNumber: 6 }])
  trailerService.createTrailer = delay(() => [])
  trailerService.deleteTrailer = delay(() => [])

  /// tractors ///

  tractorService.getAllTractors = delay(() => [{ id: 5, type: 'Tractor', model: 'DAF -XF 95.430', stateNumber: 'H14H88GU', tractorId: 134, ownWeight: 30000, fullWeight: 35000, engine: 500, wheelFormula: '2x4', tankVolume: 600, minTank: 30 }, { id: 4, type: 'Chassis', model: 'ACTROS 1845 LS EURO 5', stateNumber: 'AL918IA11', tractorId: 134, ownWeight: 30000, fullWeight: 35000, engine: 500, wheelFormula: '2x4', tankVolume: 600, minTank: 30 }])
  tractorService.getTractorTypesAsync = delay(() => [{ id: 1, type: 'Tractor' }, { id: 2, type: 'Chassis' }])
  tractorService.getWheelFormulaTypesAsync = delay(() => [{ id: 1, wheelFormulaType: '4x2' }, { id: 2, wheelFormulaType: '6x2' }, { id: 3, wheelFormulaType: '6x4' }, { id: 4, wheelFormulaType: '4x4' }, { id: 5, wheelFormulaType: '6x6' }, { id: 6, wheelFormulaType: '8x2' }, { id: 7, wheelFormulaType: '8x4' }, { id: 8, wheelFormulaType: '8x8' }])
  tractorService.createTractor = delay(() => [])
  tractorService.deleteTractor = delay(() => [])

  /// trucks ////

  truckService.getAllTrucks = delay(() => [{ id: 2, tractorModel: 'Lohr 1.21', tractorId: 123, tractorStateNumberOrVin: 'KK1234LL', trailerModel: 'Lohr 1.21', trailerId: 123, trailerStateNumberOrVin: 'OL1488EH', driver: 'Anime' }])
  truckService.deleteTruck = delay(() => [])
}
