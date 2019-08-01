import React from 'react'
import Optimization from './Components/InputPage/Optimization/optimization'
import Result from './Components/ResultPage/result'
import FuelStations from './Components/FuelStationsPage/fuelStations'
import { Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      credentials: {
        appId: 'fLR4pqJX0jZZZle8nwaM',
        appCode: 'eM1d0zQLOLaA44cULr6NwQ'
      },
      points: null,
      selectedTruck: 0
    }
    this.handleStartOptimization = this.handleStartOptimization.bind(this)
  }

  handleStartOptimization (points, selectedTruck) {
    this.setState({ points: points, selectedTruck: selectedTruck })
  }

  render () {
    const { credentials, points, selectedTruck } = this.state
    return (
      <div className='App'>
        <Switch history={history} >
          <Route exact path='/' component={() =>
            <Optimization
              credentials={credentials}
              handleStartOptimization={this.handleStartOptimization}
            />} />
          <Route exact path='/result' component={() =>
            <Result
              credentials={credentials}
              points={points}
              selectedTruck={selectedTruck}
            />}
          />
          <Route exact path='/fuel-stations' component={() =>
            <FuelStations
              credentials={credentials}
            />}
          />
        </Switch>
      </div>
    )
  }
}

export default App
