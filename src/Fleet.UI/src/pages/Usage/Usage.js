import React from 'react'
import { Typography } from '@material-ui/core'
export class Usage extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <Typography variant='h5'>Usage</Typography>
        <Typography>This app is intended to build route with the least cost of fuel.</Typography>
        <Typography>It considers such parameters as fuel cost in different countries and car fuel consumption.</Typography>
        <Typography>So flow is - you enter addresses where you need to drive, you select or create car, you enter how many fuel you have. And after some time(it needs time to compute) you get optimal route with addresses of fuel stations where you need to refuel, cost at this station and gas volume and some additional info about route. Pretty easy, isn't it?</Typography>
      </div>
    )
  }
}
