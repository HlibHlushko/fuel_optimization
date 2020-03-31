import React from 'react'
import { IconButton, MenuItem, FormControl, Input, InputLabel, Select, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import CheckRoundedIcon from '@material-ui/icons/CheckRounded'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { localStorageService } from '../../services/localStorageService'

export class CreateCar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedBrand: '',
      model: '',
      consumption: 1,
      tank: 1
    }
    this.handleAddNewCar = this.handleAddNewCar.bind(this)
  }

  handleAddNewCar () {
    const { selectedBrand, model, consumption, tank } = this.state
    localStorageService.addNewCar({
      id: localStorageService.getAllCars().length + 1000,
      brandId: selectedBrand,
      model: model,
      consumption: consumption,
      tank: tank
    })
    this.props.discard()
  }

  render () {
    const { classes, discard, opened, brands } = this.props
    const { selectedBrand, model } = this.state

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
                {brands.sort().map(brand => <MenuItem key={brand.id} value={brand.id}>{brand.brand}</MenuItem>)}
              </Select>
            </FormControl>
            <Input
              className={classes.selectModel}
              placeholder='Type model'
              value={model}
              onChange={event => this.setState({ model: event.target.value })}
            />
          </div>
          <div className={classes.carName}>
            <Input
              className={classes.consumptionInput}
              placeholder='Сonsumption per 100km'
              onChange={(event) => this.setState({ consumption: event.target.value })}
            />
            <Input
              className={classes.selectModel}
              placeholder='Car tank'
              onChange={(event) => this.setState({ tank: event.target.value })}
            />
          </div>
          <div className={classes.buttons}>
            <IconButton
              onClick={this.handleAddNewCar}
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
