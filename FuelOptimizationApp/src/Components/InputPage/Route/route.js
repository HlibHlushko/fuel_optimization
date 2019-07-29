import React from 'react'
import Point from '../Point/point'
import './route.css'

class Route extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  // handleOrderChanged = () =>{}

  render () {
    const points = this.props.points
      ? this.props.points.map((point, id) =>
        <Point
          point={point}
          id={id}
          key={id}
          credentials={this.props.credentials}
          cars={this.props.cars}
          handlePointSelected={this.props.handlePointSelected.bind(this, id)}
          handleOrderChanged={this.props.handleOrderChanged.bind(this, id)}
          handleOrderAdded={this.props.handleOrderAdded.bind(this, id)}
          handleOrderDeleted={this.props.handleOrderDeleted.bind(this, id)}
          handlePointDeleted={this.props.handlePointDeleted.bind(this, id)}
          // handleLocationIdChanged = {this.props.handleLocationIdChanged.bind(this, id)}
        />)
      : null
    return (
      <div>
        {points}

      </div>)
  }
}

export default Route
