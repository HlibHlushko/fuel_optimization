import React from 'react'

import { Dropdown } from '../Dropdown'
import { RouteList } from '../RouteList'

import { getAddressText } from '../../services/hereClient'

export const TripRoute = ({
  classes: { pointWrapper, pins },
  points, suggestions, suggestionToString,
  handleInputChange, handleSelectChange, handleActionChange, handleActionInput, handleLoadingAction
}) => (
  <RouteList
    dashed
    withAdd
    pinsClassName={pins}
    points={points}
    renderPoint={(p, i) => (
      <div className={pointWrapper}>
        <Dropdown
          placeholder={p.placeholder}
          error={p.error}
          value={p.address && p.address.coords && getAddressText(p.address).all}
          disabled={p.address && !!p.address.coords}
          items={suggestions && suggestions.map(s => {
            s.id = s.locationId
            return s
          })}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange.bind(null, i)}
        />
      </div>
    )}
  />
)
