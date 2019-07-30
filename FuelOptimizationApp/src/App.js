import React from 'react'
import Optimization from './Components/InputPage/Optimization/optimization'
import Result from './Components/ResultPage/result'
import { Switch, Route } from 'react-router-dom'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      credentials: {
        appId: 'fLR4pqJX0jZZZle8nwaM',
        appCode: 'eM1d0zQLOLaA44cULr6NwQ'
      },
      points: null
    }
    this.handleStartOptimization = this.handleStartOptimization.bind(this)
  }

  handleStartOptimization (points) {
    this.setState({ points: points })
  }

  render () {
    const { credentials, points } = this.state
    return (
      <div className='App'>
        <Switch>
          <Route exact path='/' component={() =>
            <Optimization
              credentials={credentials}
              handleStartOptimization={this.handleStartOptimization}
            />} />
          <Route exact path='/result' component={() =>
            <Result
              credentials={credentials}
              points={points} />}
          />
        </Switch>
      </div>
    )
  }
}

export default App
