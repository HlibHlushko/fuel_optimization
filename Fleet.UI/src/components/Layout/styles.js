
const drawerWidth = 200
const colapsedDrawerWidth = 63

export const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%'
  },
  appBar: {
    boxShadow: 'none',
    border: 'none',
    // left: `${colapsedDrawerWidth}px`,
    zIndex: theme.zIndex.drawer - 1,
    width: `calc(100% - ${colapsedDrawerWidth}px)`,
    transition: theme.transitions.create(['width', 'left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    boxShadow: 'none',
    border: 'none',
    // left: `${drawerWidth}px`,
    // width: '100%',
    width: `calc(100% - ${colapsedDrawerWidth}px)`,
    transition: theme.transitions.create(['width', 'left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 5
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(8) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '8px 8px',
    minHeight: '0px',
    height: '57px',
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    // ...theme.mixins.toolbar,
    // border: 'none',
    // width: `calc(100% - ${drawerWidth}px)`,
    boxShadow: 'none'

  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: theme.spacing(3),
    height: 'calc(100% - 57px)',
    marginTop: '57px'
  },
  logo: {
    minHeight: '20px',
    maxHeight: '20px',
    height: '20px',
    width: '20px',
    padding: '10px',
    boxSizing: 'content-box'
  },
  innerContent: {
    height: '100%'
  },
  fleetLogo: {
    position: 'absolute',
    left: '25px'
  },
  fleetLogoOpacity: {
    opacity: '0',
    transition: '0.4s'
  },
  sideBarToolBar: {
    zIndex: -1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '8px 8px',
    height: '56px',
    // ...theme.mixins.toolbar,
    // minHeight: '0px !important',

    border: 'none',
    boxShadow: 'none'
  },
  sideBarList: {
    padding: 0
  },
  userInfo: {
    marginRight: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  userName: {
    // padding: '10px',
    height: '20px',
    fontFamily: 'TT Commons',
    fontSize: '16px'
  },
  link: {
    textDecoration: 'none'
  }
})
