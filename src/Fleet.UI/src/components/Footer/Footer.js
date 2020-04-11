import React from 'react'
import clsx from 'clsx'
import { IconButton, Icon, Button } from '@material-ui/core/'
import { ReactComponent as QuestionIcon } from '../../pics/question-sign.svg'
import { Redirect } from 'react-router-dom'

export class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      opened: false,
      author: false,
      usage: false,
      trip: false
    }
  }

  render () {
    const handleChange = (value) => { this.setState({ opened: value }) }

    const { classes } = this.props
    const { opened, author, usage, trip } = this.state
    const ns = {
      author: false,
      usage: false,
      trip: false
    }
    return (
      <>
        {author && (
          <Redirect to='/author' />
        )}
        {trip && (
          <Redirect to='/create-trip' />
        )}
        {usage && (
          <Redirect to='/usage' />
        )}
        <IconButton
          className={classes.speedDial}
          color='primary'
          onClick={() => handleChange(!opened)}
          onMouseOver={() => handleChange(true)}
          onMouseLeave={() => handleChange(false)}
        >
          <Icon>
            <QuestionIcon className={classes.icon} />
          </Icon>
        </IconButton>
        <div
          className={clsx(classes.containerButton, (!opened && classes.hidden))}
          onMouseOver={() => handleChange(true)}
          onMouseLeave={() => handleChange(false)}
        >
          <Button
            className={classes.lowerCase}
            variant='contained'
            color='primary'
            onClick={() => this.setState(() => {
              ns.trip = true
              return ns
            }
            )}
          >
            Create trip
          </Button>
          <Button
            className={classes.lowerCase}
            variant='contained'
            color='primary'
            onClick={() => this.setState(() => {
              ns.author = true
              return ns
            }
            )}
          >
            About author
          </Button>
          <Button
            className={classes.lowerCase}
            variant='contained'
            color='primary'
            onClick={() => this.setState(() => {
              ns.usage = true
              return ns
            }
            )}
          >
            How to use
          </Button>

        </div>

      </>
    )
  }
}
