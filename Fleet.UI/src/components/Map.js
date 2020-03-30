import React from 'react'
import { Map as M } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export const Map = React.forwardRef(({ children, style = {}, ...rest }, ref) => (
  <M
    ref={ref}
    {...rest}
    style={{ ...style, height: '100%' }}
  >
    {children}
  </M>
))
