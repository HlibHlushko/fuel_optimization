import React from 'react'
import { Typography } from '@material-ui/core'

import { RouteList } from '../RouteList'

import { getAddressText } from '../../services/hereClient'

export const Trip = ({ classes: { tripPoint, tripPointLast, tripSummary, tripArrow }, points, selected }) => {
  const ps = points.filter(p => p.type !== 4 && p.type !== 3) // junktion -> move POINT_TYPE into service
  if (selected) {
    return (
      <RouteList
        points={console.log(ps), ps}
        renderPoint={(p, i) =>
          <div className={i === ps.length - 1 ? tripPointLast : tripPoint}>
            {p.type <= 1
              ? getAddressText(p.address).all + ((p.load || p.unload) ? ` (load: ${p.load || 0}kg, unload: ${p.unload || 0}kg)` : '')
              : p.type === 2
                ? p.name + ` (refuel: ${p.refuel}L)`
                : ''}
          </div>}
      />
    )
  } else {
    const { main/*, secondary */ } = getAddressText(ps[0].address)
    const { main: mainLast/*, secondary: secondaryLast */ } = getAddressText(ps[ps.length - 1].address)
    return (
      <div className={tripSummary}>
        <div>
          <Typography variant='body2'>{main}</Typography>
          {/* <Typography variant='caption'>{secondary}</Typography> */}
        </div>
        <Typography variant='body2' className={tripArrow}>➜</Typography>
        <div>
          <Typography variant='body2'>{mainLast}</Typography>
          {/* <Typography variant='caption'>{secondaryLast}</Typography> */}
        </div>
      </div>
    )
  }
}
