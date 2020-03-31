export const localStorageService = {
  addNewCar (car) {
    localStorage.setItem('cars', JSON.stringify([car, ...JSON.parse(localStorage.cars || '[]')]))
  },
  getAllCars () {
    return localStorage.cars ? JSON.parse(localStorage.cars) : []
  }
}
