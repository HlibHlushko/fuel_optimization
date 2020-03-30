import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core'
export class Loading extends React.Component {
  render () {
    const { classes } = this.props
    return (<CircularProgress className={classes.loading} />)
  }
}
const styles = ({
  loading: {
    marginLeft: '50%',
    marginTop: '50px'
  }
})

export default withStyles(styles)(Loading)
