export const styles = ({
  main: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  tripsToolbar: {
    display: 'flex',
    paddingBottom: '10px',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    position: 'absolute',
    right: '50px',
    top: '20px',
    zIndex: 1000
  },
  small: {
    fontFamily: 'TT Commons',
    fontSize: '11px',
    lineHeight: '12px'
  },
  medium: {
    fontFamily: 'TT Commons',
    fontSize: '14px',
    lineHeight: '17px'
  },
  large: {
    fontFamily: 'TT Commons',
    fontSize: '18px'
  },
  upper: {
    textTransform: 'uppercase'
  },
  bold: {
    fontWeight: 'bold'
  },
  buttonText: {
    color: 'white',
    borderBottom: '1px dashed white'
  },
  mapContainer: {
    height: '100%',
    width: '100%'
  },
  page: {
    height: '100%'
  },
  paper: {
    width: '100%',
    background: 'transparent'
  },
  tableContainer: {
    height: 'calc(100% - 166px)',
    minWidth: '520px',
    maxWidth: '40%',
    position: 'absolute',
    right: '30px',
    padding: '10px 0px',
    margin: '5px 0px',
    zIndex: '400',
    background: 'linear-gradient(180deg, white, white, rgba(255,255,255,.9))'
  },
  logo: {
    minHeight: '15px',
    maxHeight: '15px',
    height: '15px',
    width: '15px',
    marginRight: '20px'
  },
  progressDone: {
    color: 'blue',
    position: 'relative'
  },
  statusClass: {
    width: '20px',
    height: '20px',
    padding: 0
  }
})
