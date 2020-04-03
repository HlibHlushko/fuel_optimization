export const styles = ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },

  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bold: {
    fontSize: '18px',
    fontFamily: 'TT Commons',
    fontWeight: 'bold',
    marginTop: '7px',
    textTransform: 'uppercase'
  },
  button: {
    margin: '0px 10px 0px 10px',
    width: '125px'
  },
  headerWrapper: {
    fontSize: '16px',
    fontFamily: 'TT Commons',
    fontWeight: 'bold'
  },
  subHeader: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '14px',
    fontFamily: 'TT Commons',
    color: '#94979B'
  },
  Id: {
    marginRight: '20px'
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  manageBtn: {
    width: '126px',
    height: '34px',
    borderRadius: '2px',
    color: '#FFFFFF'
  },
  discardBtn: {
    background: '#F06565'
  },
  saveBtn: {
    background: '#3A84FF',
    marginLeft: '20px'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    // marginTop: '30px',
    height: '100%'
  },
  parameters: {
    width: '520px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
    // marginRight: '20px'
  },
  paramHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '50px',
    padding: '20px 20px 28px 20px',
    background: '#3367D6'
  },
  truck: {
    width: '60%',
    '& label.Mui-focused': {
      color: 'white'
    }
  },
  litresInput: {
    '& label.Mui-focused': {
      color: 'white'
    }
  },
  litersLeft: {
    width: '100%',
    marginRight: '20px'
  },
  litersLabel: {
    width: '100%',
    fontSize: '14px',
    lineHeight: '20px',
    color: 'white',
    opacity: '0.8'
  },
  litersInput: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#FFFFFF',
    '&::before': {
      border: '0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.54);'
    }
  },
  truckSelect: {
    fontSize: '16px',
    color: '#FFFFFF',
    '&::before': {
      border: '0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.54)'
    }
  },
  selectIcon: {
    color: '#FFFFFF',
    opacity: '0.54'
  },
  paramContent: {
    height: '100%',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  },
  paramContentWrapper: {
    height: '100%',
    padding: '40px 30px 0 0',
    boxShadow: '0px 1px 0px rgba(0, 0, 0, 0.06)',
    '& > div': {
      margin: '0px 0px 0px 20px'
    }
  },
  balance: {
    width: '30%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '15px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  newCar: {
    // position: 'absolute',
    // top: '100px',
    // left: '40px',
    // zIndex: '5'
    // top: '-100px'
  }
})
