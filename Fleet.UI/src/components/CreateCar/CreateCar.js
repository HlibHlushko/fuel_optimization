import React from 'react'
import { IconButton, MenuItem, FormControl, Input, InputLabel, Select, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import CheckRoundedIcon from '@material-ui/icons/CheckRounded'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'

export class CreateCar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedBrand: '',
      brands: ['Renault', 'BMW', 'Mercedes', 'Nissan', 'Audi', 'Volvo', 'Hyundai'],
      model: ''
    }
  }

  render () {
    const { classes, discard, ok, opened } = this.props
    const { brands, selectedBrand, model } = this.state
    console.log(selectedBrand)
    return (
      // <div className={classes.createCarContainer}>
      <Dialog
        open={opened}
      >
        <DialogTitle>
          Create new car
        </DialogTitle>
        <DialogContent>
          <div className={classes.carName}>
            <FormControl className={classes.selectBrand}>
              <InputLabel>Select Brand</InputLabel>
              <Select
                value={selectedBrand}
                onChange={(event) => this.setState({ selectedBrand: event.target.value })}
              >
                {brands.sort().map(brand => <MenuItem key={brand} value={brand}>{brand}</MenuItem>)}
              </Select>
            </FormControl>
            <Input
              className={classes.selectModel}
              placeholder='Type model'
              value={model}
              onChange={event => this.setState({ model: event.target.value })}
            />
          </div>
          <Input className={classes.consumptionInput} placeholder='Fuel consumption per 100km' />
          <div className={classes.buttons}>
            <IconButton
              onClick={ok}
            >
              <CheckRoundedIcon htmlColor='green' />
            </IconButton>
            <IconButton onClick={() => discard()}>
              <CloseRoundedIcon htmlColor='red' />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>

    // </div>
    )
  }
}
