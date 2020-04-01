import React from 'react'
import clsx from 'clsx'

const addPointPins = (i, pointsLength, classes, withAdd, dashed, pinsClassName) => {
  return (
    <div className={clsx(classes.paramPins, pinsClassName)}>
      <div className={i === 0
        ? classes.firstPin
        : pointsLength === 2
          ? classes.lastPin
          : withAdd
            ? i === pointsLength - 2
              ? classes.lastPin
              : i === pointsLength - 1
                ? classes.plusPin
                : classes.smallPin
            : i === pointsLength - 1
              ? classes.lastPin
              : classes.smallPin}
      />
      {i !== pointsLength - 1 && <div className={dashed ? classes.dots : classes.solid} />}
    </div>
  )
}

export const RouteList = props => {
  const { classes, points, pinsClassName, renderPoint, withAdd, dashed } = props
  return points.map((p, i) => (
    <div
      className={classes.pointWrapper}
      key={i}
    >
      {addPointPins(i, points.length, classes, withAdd, dashed, pinsClassName)}
      <div className={classes.paramWrapper}>
        {renderPoint(p, i)}
      </div>
    </div>
  ))
}
