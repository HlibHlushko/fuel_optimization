import dots from '../../pics/dots.svg'
import pin from '../../pics/Pin.svg'
import plusPin from '../../pics/bx-plus-circle.svg'
import hollowPin from '../../pics/pin-hollow.svg'

export const styles = ({
  pointWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative'
  },
  paramWrapper: {
    width: '100%',
    margin: '0px 0px 0px 24px'
  },
  paramPins: {
    width: '20px',
    height: '100%',
    position: 'absolute',
    left: '0',
    top: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  dots: {
    flexGrow: '1',
    width: '100%',
    overflow: 'hidden',
    backgroundSize: '2px',
    backgroundImage: `url(${dots})`,
    backgroundRepeatX: 'no-repeat',
    backgroundRepeatY: 'repeat',
    backgroundPositionX: 'center'
  },
  solid: {
    flexGrow: '1',
    width: '2px',
    overflow: 'hidden',
    backgroundSize: '2px',
    backgroundColor: 'grey',
    backgroundRepeatX: 'no-repeat',
    backgroundRepeatY: 'repeat',
    backgroundPositionX: 'center'
  },
  firstPin: {
    height: '14px',
    backgroundSize: '14px',
    width: '100%',
    backgroundImage: `url(${pin})`,
    backgroundRepeatX: 'no-repeat',
    backgroundRepeatY: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: 'top'
  },
  lastPin: {
    height: '18px',
    backgroundSize: '18px',
    width: '100%',
    backgroundImage: `url(${hollowPin})`,
    backgroundRepeatX: 'no-repeat',
    backgroundRepeatY: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: 'top'
  },
  smallPin: {
    height: '10px',
    backgroundSize: '10px',
    width: '100%',
    backgroundImage: `url(${pin})`,
    backgroundRepeatX: 'no-repeat',
    backgroundRepeatY: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: 'top'

  },
  plusPin: {
    height: '20px',
    backgroundSize: '20px',
    width: '100%',
    backgroundImage: `url(${plusPin})`,
    backgroundRepeatX: 'no-repeat',
    backgroundRepeatY: 'no-repeat',
    backgroundPositionX: 'center',
    backgroundPositionY: 'top'
  }
})
