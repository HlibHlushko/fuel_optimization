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
    console.log(this.props.points)
    const points = this.props.points
      ? this.props.points.map((point) =>
        <Point
          point={point}
          id={point.id}
          key={point.id}
          credentials={this.props.credentials}
          cars={this.props.cars}
          handlePointSelected={this.props.handlePointSelected.bind(this, point.id)}
          handleOrderChanged={this.props.handleOrderChanged.bind(this, point.id)}
          handleOrderAdded={this.props.handleOrderAdded.bind(this, point.id)}
          handleOrderDeleted={this.props.handleOrderDeleted.bind(this, point.id)}
          handlePointDeleted={this.props.handlePointDeleted.bind(this, point.id)}
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
