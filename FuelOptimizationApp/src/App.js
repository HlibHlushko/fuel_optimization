import React from 'react';
import Optimization from './Components/InputPage/Optimization/optimization';
import Result from './Components/ResultPage/result';
import {Switch, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component = {Optimization} />
        <Route exact path='/result' component = {Result}/>
      </Switch>
      
      
      
    </div>
  );
}

export default App;
