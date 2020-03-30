import React from 'react'
import { icon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { IconButton } from '@material-ui/core'
import clsx from 'clsx'

import pin from '../../pics/Pin.svg'
import { ReactComponent as OkButton } from '../../pics/okButton.svg'
// import { ReactComponent as PointIcon } from '../../pics/point.svg'

import { getAddressText } from '../../services/hereClient'

export class MapPopup extends React.Component {
  componentDidMount () {
    if (!this.props.visible) {
      this.marker.leafletElement.setOpacity(0)
      this.marker.leafletElement.closePopup()
    } else {
      this.marker.leafletElement.setOpacity(1)
      this.marker.leafletElement.openPopup()
    }
  }

  componentDidUpdate () {
    if (!this.props.visible) {
      this.marker.leafletElement.setOpacity(0)
      this.marker.leafletElement.closePopup()
    } else {
      this.marker.leafletElement.setOpacity(1)
      this.marker.leafletElement.openPopup()
    }
  }

  render () {
    const {
      classes: { small, upper, bold, popup, popupTile, popupRow, popupColumn, okButton, ellipsisContainer, ellipsis },
      latlng, address, onOkClick
    } = this.props

    return (
      <Marker
        position={latlng || { lat: 0, lng: 0 }}
        icon={icon({ iconUrl: pin, iconSize: [12, 12], popupAnchor: [0, 12] })}
        ref={el => {
          if (el) {
            el.leafletElement.off('click')
          }
          this.marker = el
        }}
      >
        <Popup
          className={popup}
          closeButton={false}
          autoPan={false}
          autoClose={false}
          closeOnEscapeKey={false}
          closeOnClick={false}
        >
          <div className={clsx(popupTile, popupRow)} style={{ height: '80px' }}>
            <div className={popupColumn}>
              <div>
                <span className={clsx(small, upper, bold)}>
                  {latlng && latlng.lat.toFixed(7) + ',' + latlng.lng.toFixed(7)}
                </span>
              </div>
              <div className={ellipsisContainer}>
                <div className={clsx(small, upper, ellipsis)}>
                  <span>{address != null
                    ? getAddressText(address).all
                    : 'loading address...'}
                  </span>
                </div>
              </div>
            </div>
            <IconButton className={okButton} onClick={onOkClick}>
              <OkButton />
            </IconButton>
          </div>
        </Popup>
      </Marker>
    )
  }
}
