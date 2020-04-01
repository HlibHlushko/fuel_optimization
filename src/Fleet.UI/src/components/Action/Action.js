import React from 'react'
import { FormControl, Input, InputAdornment, Button, IconButton } from '@material-ui/core'

import plus from '../../pics/Plus.svg'
import minus from '../../pics/Minus.svg'
import okButton from '../../pics/okButton.svg'
import cancelButton from '../../pics/cancelButton.svg'

function addLoadingAction ({
  classes: { loadAction, loadInputWrapper, loadFormControl, loadInputKg, loadInput, loadActionButtons },
  handleActionInput, handleLoadingAction, handleActionChange
}) {
  return (
    <div className={loadAction}>
      <div className={loadInputWrapper}>
        <img src={plus} alt='plus' />
        <FormControl className={loadFormControl}>
          <Input
            id='load'
            endAdornment={<InputAdornment position='end'><p className={loadInputKg}>t</p></InputAdornment>}
            className={loadInput}
            onChange={handleActionInput.bind(null, 'load')}
          />
        </FormControl>
      </div>
      <div className={loadInputWrapper}>
        <img src={minus} alt='minus' />
        <FormControl className={loadFormControl}>
          <Input
            id='unload'
            endAdornment={<InputAdornment position='end'><p className={loadInputKg}>t</p></InputAdornment>}
            className={loadInput}
            onChange={handleActionInput.bind(null, 'unload')}
          />
        </FormControl>
      </div>
      <div className={loadActionButtons}>
        <IconButton onClick={handleLoadingAction}><img src={okButton} alt='okBtn' /></IconButton>
        <IconButton onClick={handleActionChange}><img src={cancelButton} alt='cancelBtn' /></IconButton>
      </div>
    </div>
  )
}

function showAddedActions ({ classes: { loadAction, loadInputWrapper, loadFormControl, loadInputKg, loadInput }, load, unload }) {
  return (
    <div className={loadAction}>
      {load && (
        <div className={loadInputWrapper}>
          <img src={plus} alt='plus' />
          <FormControl className={loadFormControl}>
            <Input
              id='load'
              readOnly
              endAdornment={<InputAdornment position='end'><p className={loadInputKg}>kg</p></InputAdornment>}
              className={loadInput}
              defaultValue={load}
            />
          </FormControl>
        </div>
      )}
      {unload && (
        <div className={loadInputWrapper}>
          <img src={minus} alt='minus' />
          <FormControl className={loadFormControl}>
            <Input
              id='unload'
              readOnly
              endAdornment={<InputAdornment position='end'><p className={loadInputKg}>kg</p></InputAdornment>}
              className={loadInput}
              defaultValue={unload}
            />
          </FormControl>
        </div>
      )}
    </div>
  )
}

export const Action = ({
  action: { isActionButtonShown, isLoadingInputsShown, isLoadingActionsShown, load, unload },
  classes, handleActionChange, handleActionInput, handleLoadingAction
}) => {
  if (isActionButtonShown && !isLoadingActionsShown) {
    return (
      <div>
        <Button
          className={classes.addActionBtn}
          onClick={handleActionChange}
        >+ Action
        </Button>
      </div>
    )
  } else if (isLoadingInputsShown) {
    return addLoadingAction({ classes, handleActionInput, handleLoadingAction, handleActionChange })
  } else if (isLoadingActionsShown) {
    return showAddedActions({ classes, load, unload })
  } else {
    return <span />
  }
}
