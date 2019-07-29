import React from 'react'
import Optimization from './Components/InputPage/Optimization/optimization'
import Result from './Components/ResultPage/result'
import { Switch, Route } from 'react-router-dom'

const credentials = {
  appId: 'fLR4pqJX0jZZZle8nwaM',
  appCode: 'eM1d0zQLOLaA44cULr6NwQ'
}
function App () {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={() => <Optimization credentials={credentials} />} />
        <Route exact path='/result' component={() => <Result credentials={credentials} />} />
      </Switch>
    </div>
  )
}

export default App
