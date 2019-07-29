/* global fetch */
import React from 'react'
import Select from 'react-select'
import './TruckPicker.css'

class TruckPicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      suggestions: []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    fetch('http://localhost:1984/api/GetTrucks', {
      method: 'GET',
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ suggestions: data })
      })
  }

  handleChange (selectedOption) {
    this.props.handleTruckChanged(selectedOption)
  }
  ;
  render () {
    return (
      <Select className='picker'
        onChange={this.handleChange}
        options={this.state.suggestions.map(item => { return { value: item.id, label: item.name } })}
        placeholder='Select truck'
      />
    )
  }
}

export default TruckPicker
