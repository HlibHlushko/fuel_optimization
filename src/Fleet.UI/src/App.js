import React from 'react'
import { withRouter, Switch, Router, Redirect, Route } from 'react-router-dom'
import { CreateTrip } from './pages/CreateTrip/'
import { Trips } from './pages/Trips'
class App extends React.Component {
  render () {
    return (

      <div
        className='App'
        style={{ height: '100%' }}
      >
        <Switch>
          <Route path='/trip/:id' render={(props) => <Trips {...props} />} />
          <Route path='/'>
            <CreateTrip />
          </Route>
        </Switch>

      </div>

    )
  }
}

export default withRouter(App)
