import React from 'react'
import Downshift from 'downshift'
import { FormControl, Input, FormHelperText, MenuItem, Paper, Typography, Box } from '@material-ui/core'

function renderInput ({ ref, forcedValue, inputProps: { fullWidth, value, ...others }, error }) {
  return (
    <FormControl fullWidth error={!!error.text}>
      <FormHelperText className={error.class}>{error.text}</FormHelperText>
      <Input
        ref={ref}
        {...others}
        fullWidth
        value={forcedValue || value}
      />
    </FormControl>
  )
}

function renderSuggestion (item, itemProps, isHighlighted, selectedItem) {
  return (
    <MenuItem
      component='div'
      key={item.id}
      value={item.id}
      selected={isHighlighted}
      {...itemProps}
    >
      <Typography variant='body2' noWrap>
        {item.suggestion.map(({ bold, text }, i) =>
          <Box component='span' key={i} fontWeight={bold ? 600 : 400}>{text}</Box>
        )}
      </Typography>
    </MenuItem>
  )
}

export const Dropdown = class extends React.Component {
  constructor (props) {
    super(props)

    this._inputNode = null
  }

  renderDropdown ({
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    inputValue,
    isOpen,
    selectedItem
  }) {
    const {
      classes: { menu, input, error: errorClass },
      placeholder, error, items, value, disabled,
      handleInputChange
    } = this.props

    return (
      <div>
        {renderInput({
          ref: node => {
            this._inputNode = node
          },
          forcedValue: value,
          inputProps: getInputProps({
            fullWidth: true,
            placeholder,
            disabled,
            className: input,
            onChange: handleInputChange
          }),
          error: {
            text: error,
            class: errorClass
          }
        })}
        <div {...getMenuProps()}>
          {isOpen && (
            <Paper square className={menu} style={{ width: this._inputNode ? this._inputNode.clientWidth : undefined }}>
              {items && items.map((item, i) =>
                renderSuggestion(
                  item,
                  getItemProps({ item }),
                  highlightedIndex === i,
                  selectedItem
                )
              )}
            </Paper>
          )}
        </div>
      </div>
    )
  }

  render () {
    const { handleSelectChange } = this.props

    return (
      <Downshift
        onChange={handleSelectChange}
        itemToString={item => item ? item.suggestion.map(s => s.text).join('') : ''}
      >
        {this.renderDropdown.bind(this)}
      </Downshift>
    )
  }
}
