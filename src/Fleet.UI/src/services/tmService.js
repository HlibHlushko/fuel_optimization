import { isLocal, delay } from './utilService'
import { get, post, delete_ } from './fetchService'

const url = process.env.REACT_APP_TM_URL

export const tripService = {
  getAllTrips () {
    return get(`${url}/trip/all`)
  },
  createTrip (data) {
    console.log('data', data)
    return post(`${url}/trip/`, JSON.stringify(data))
  },
  deleteTrip (id) {
    return delete_(`${url}/trip/${id}`)
  }
}

if (isLocal) {
  /// trips ///
  tripService.getAllTrips = delay(() => [
    {
      id: 1,
      driverId: 9,
      truckId: 2010,
      residualFuel: 2,
      status: 'done',
      inputPoints: [
        {
          id: 1,
          latitude: 50.363456,
          longitude: 30.448254,
          label: 'Київ, Теремки',
          type: 0,
          load: 1000,
          unload: null,
          refuel: null
        },
        {
          id: 2,
          latitude: 50.187789,
          longitude: 30.220191,
          label: 'Кооператив Стугна',
          type: 1,
          load: null,
          unload: null,
          refuel: 300
        }

      ],
      optimizedPoints: [
        { id: 1, latitude: 50.363456, longitude: 30.448254, label: 'Київ, Теремки', type: 0, load: 1000, unload: null, refuel: null },
        { id: 0, latitude: 50.35786, longitude: 30.43877, label: 'ANP', type: 2, load: null, unload: null, refuel: 40 },
        { id: 2, latitude: 50.187789, longitude: 30.220191, label: 'Кооператив Стугна', type: 1, load: null, unload: null, refuel: 300 }]
    }
  ])

  tripService.createTrip = delay(() => {})
  tripService.deleteTrip = delay(() => {})
}
