import React from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
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
          <Route path='/create-trip'>
            <CreateTrip />
          </Route>
          <Redirect to='/create-trip' />
        </Switch>

      </div>

    )
  }
}

export default withRouter(App)
