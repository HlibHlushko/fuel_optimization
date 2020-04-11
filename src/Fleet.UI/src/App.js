import React from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { CreateTrip } from './pages/CreateTrip/'
import { Footer } from './components/Footer'
import { Trips } from './pages/Trips'
import { Author } from './pages/Author'
import { Usage } from './pages/Usage'
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
          <Route path='/author'>
            <Author />
          </Route>
          <Route path='/usage'>
            <Usage />
          </Route>

          <Redirect to='/create-trip' />
        </Switch>
        <Footer />
      </div>

    )
  }
}

export default withRouter(App)
