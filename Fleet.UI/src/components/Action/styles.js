export const styles = ({
  addActionBtn: {
    textTransform: 'none',
    padding: '0px',
    color: '#3A84FF',
    borderRadius: '0px',
    borderBottom: '1px dashed #3A84FF',
    '&:hover': {
      background: 'inherit'
    }
  },
  loadAction: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'cemter',
    alignItems: 'center',
    width: '288px'
  },
  loadInputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  loadFormControl: {
    width: '60px',
    marginRight: '25px',
    marginLeft: '15px'
  },
  loadActionButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  loadInput: {
    '&::before': {
      border: '0',
      borderBottom: '1px dashed #3A84FF'
    },
    '&:hover:before': {
      borderBottom: '1px solid #3A84FF'
    }
  },
  loadInputKg: {
    fontSize: '14px',
    lineHeight: '17px',
    color: '#3A84FF'
  }
})
