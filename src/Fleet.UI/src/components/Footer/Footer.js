import React from 'react'
import clsx from 'clsx'
import { IconButton, Icon, Button } from '@material-ui/core/'
import { ReactComponent as QuestionIcon } from '../../pics/question-sign.svg'

export class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  render () {
    const handleChange = (value) => { this.setState({ opened: value }) }

    const { classes } = this.props
    const { opened } = this.state
    return (
      <>
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
            variant='contained'
            color='primary'
          >
            about author
          </Button>
          <Button
            variant='contained'
            color='primary'
          >
            how to use
          </Button>
        </div>
      </>
    )
  }
}
