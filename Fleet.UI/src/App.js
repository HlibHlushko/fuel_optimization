import React from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { CreateTrip } from './pages/CreateTrip/'
import { Trips } from './pages/Trips'
class App extends React.Component {
  render () {
    return (
      <div
        className='App'
        style={{ height: '100%', margin: '10px 10px 0 10px' }}
      >
        <Trips />
      </div>
    )
  }
}

export default withRouter(App)
