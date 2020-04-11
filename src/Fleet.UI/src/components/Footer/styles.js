export const styles = ({

  speedDial: {
    zIndex: 9000,
    position: 'absolute',
    right: '10px',
    bottom: '10px',
    backgroundColor: '#3f51b5',
    '&:hover': {
      backgroundColor: '#3f51b5'
    }
  },
  icon: {
    height: '20px',
    width: '20px',
    fill: 'white'
  },
  hidden: {
    visibility: 'hidden'
  },
  containerButton: {
    zIndex: 5000,
    position: 'absolute',
    flexDirection: 'column',
    right: '0px',
    bottom: '10px',
    display: 'flex',
    justifyContent: 'space-around',
    height: '150px',
    padding: '25px 25px 50px 25px'
    // justifyContent: ''
  },
  lowerCase: {
    textTransform: 'none'
  }

})
