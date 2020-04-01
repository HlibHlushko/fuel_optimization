const lineHeight = 12
const height = lineHeight * 3
const ellipsisWidth = '2.5em'

export const styles = ({
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
  popup: {
    '& .leaflet-popup-content-wrapper': {
      background: 'transparent',
      borderRadius: '0px',
      boxShadow: 'none'
    },
    '& .leaflet-popup-tip': {
      width: '0px',
      height: '0px'
    }
  },
  popupTile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: '#fff',
    width: '220px',
    padding: '20px'
  },
  popupRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  popupColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  okButton: {
    backgroundColor: '#3f51b5',
    '&:hover': {
      backgroundColor: '#303f9f'
    },
    '& path': {
      fill: 'white'
    }
  },
  // https://codepen.io/abothun/pen/MKpPjX
  ellipsisContainer: {
    width: '130px',
    marginTop: '5px',
    boxSizing: 'content-box'
  },
  ellipsis: {
    overflow: 'hidden',
    height: (height - 1) + 'px',
    lineHeight: lineHeight + 'px',
    '&:before': {
      content: '""',
      float: 'left',
      width: '5px',
      height: height + 'px'
    },
    '& > *:first-child': {
      float: 'right',
      width: '100%',
      marginLeft: '-5px'
    },
    '&:after': {
      content: '"\\02026"',

      float: 'right',
      position: 'relative',
      top: `-${lineHeight}px`,
      left: '100%',
      width: ellipsisWidth,
      marginLeft: `-${ellipsisWidth}`,
      paddingRight: '5px',

      textAlign: 'right',
      background: 'linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white)',
      fallbacks: {
        background: 'white'
      }
    }
  }
})
