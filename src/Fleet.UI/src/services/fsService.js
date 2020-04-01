import { isLocal, delay } from './utilService'
import { get, post } from './fetchService'

const url = process.env.REACT_APP_FS_URL

export const fsService = {
  getAllCountriesAsync () {
    return get(`${url}/country`)
  },
  getAllNetworksAsync () {
    return get(`${url}/network`)
  },
  getAllFuelPricesAsync () {
    return get(`${url}/fuel-price`)
  },
  createFuelPriceAsync (price) {
    return post(`${url}/fuel-price`, JSON.stringify(price))
  }
}

if (isLocal) {
  fsService.getAllCountriesAsync = delay(() => [])
  fsService.getAllNetworksAsync = delay(() => [])
  fsService.getAllFuelPricesAsync = delay(() => [])
  fsService.createFuelPriceAsync = delay(() => [])
}
