import React from 'react'
import { Link, Typography, IconButton } from '@material-ui/core'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import TelegramIcon from '@material-ui/icons/Telegram'
import GitHubIcon from '@material-ui/icons/GitHub'
export class Author extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <Typography variant='h6'>
            Hi, I'm Hlib and I developed this site
          <Typography>
            I'm from Kyiv, Ukraine. I'm software developer and a student.
            I love dogs and eat.
          </Typography>
          <Typography>Checkout my social networks, feel free to text me for any reason.</Typography>
          <div className={classes.linksContainer}>
            <a href='https://www.linkedin.com/in/HlibHlushko/' className={classes.link}>
              <IconButton color='primary'>
                <LinkedInIcon />
              </IconButton>
            </a>
            <a href='https://t.me/GlebGlushko' className={classes.link}>
              <IconButton color='primary'>
                <TelegramIcon />
              </IconButton>
            </a>
            <a href='https://github.com/GlebGlushko/' className={classes.link}>
              <IconButton color='primary'>
                <GitHubIcon />
              </IconButton>
            </a>

          </div>
        </Typography>

      </div>
    )
  }
}
