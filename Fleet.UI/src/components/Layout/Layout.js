import React from 'react'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from 'react-router-dom'

import { ReactComponent as MenuLogo } from './resources/pics/menu.svg'
import { ReactComponent as AppLogo } from './resources/pics/logo.svg'
import { ReactComponent as UserLogo } from './resources/pics/user.svg'
import { ReactComponent as ExitLogo } from './resources/pics/exit.svg'

import { userClient } from '../../services/userClient'

const _toUriFormat = (label) => label.split(' ').join('-').toLowerCase()

export class Layout extends React.Component {
  constructor (props) {
    super(props)
    const links = Array.prototype.concat.apply([], this.props.menuItems).map(mi => _toUriFormat(mi.label))
    const segments = this.props.location.pathname.slice(1).split('/')
    let pageIdx = 0 // first menu link active by default
    if (segments.length === 2) {
      const idx = links.indexOf(segments[1])
      if (idx !== -1) {
        pageIdx = idx
      }
    }
    this.state = {
      open: true,
      currentPage: links[pageIdx]
    }

    this.handleDrawerOpen = this.handleDrawerOpen.bind(this)
  }

  handleDrawerOpen () {
    this.setState({ open: !this.state.open })
  }

  renderMenuItem ({ label, logo: Logo }) {
    const { classes, match } = this.props
    const labelWOspaces = _toUriFormat(label)
    const color = labelWOspaces === this.state.currentPage ? '#3A84FF' : '#94979B'
    return (
      <Link
        to={`${match.url}/${labelWOspaces}`}
        className={classes.link}
        onClick={() => this.setState({ currentPage: labelWOspaces })}
        key={label}
      >
        <ListItem button key={label}>
          <ListItemIcon>
            <Logo className={clsx(classes.logo)} fill={color} />
          </ListItemIcon>
          <ListItemText disableTypography primary={<Typography style={{ fontFamily: 'TT Commons', color }}>{label}</Typography>} />
        </ListItem>
      </Link>
    )
  }

  render () {
    const {
      classes,
      menuItems,
      content
    } = this.props
    const { open } = this.state
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          color='inherit'
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar className={classes.toolbar}>
            <div className={classes.userInfo}>
              <UserLogo fill='grey' className={clsx(classes.logo, classes.userLogo)} />
              <div className={classes.userName}>{userClient.profile ? userClient.profile.name : null}</div>
              <IconButton
                color='inherit'
                onClick={this.props.onLogout}
                className={classes.menuButton}
              >
                <ExitLogo fill='rgba(0,0,0,0.5)' />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open
            })
          }}
          open={open}
        >
          <div className={classes.sideBarToolBar}>
            <AppLogo className={clsx(classes.fleetLogo, { [classes.fleetLogoOpacity]: !open })} />
            <IconButton
              color='inherit'
              aria-label='close drawer'
              onClick={this.handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, {
                // [classes.hide]:
              })}
            >
              <MenuLogo fill='grey' />
            </IconButton>
          </div>
          <Divider />
          <List className={classes.sideBarList}>
            {Array.prototype.concat.apply([], menuItems.map((items, i) =>
              items.map(i => this.renderMenuItem(i))
                .concat(<Divider key={i} />)
            )).slice(0, -1)}
          </List>
        </Drawer>
        <main className={classes.content}>
          {content}
        </main>
      </div>
    )
  }
}
