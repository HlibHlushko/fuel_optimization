import React from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { CreateTrip } from './pages/CreateTrip/'
import { Footer } from './components/Footer'
import { Trips } from './pages/Trips'
import { updateService } from './services/updateService'
class App extends React.Component {
  componentDidMount () {
    updateService.connect()
  }

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
        <Footer />
      </div>

    )
  }
}

export default withRouter(App)
