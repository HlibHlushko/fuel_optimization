import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import { ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Paper from '@material-ui/core/Paper'
import MapContainer from '../Map/MapContainer'
import Order from '../Orders/orders'
import './point.css'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
class Point extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.handleExpandedChange = this.handleExpandedChange.bind(this)
  }

  handleExpandedChange () {
    this.setState({ isActive: !this.state.isActive })
  }

  render () {
    const orders = this.props.point.orders
      ? this.props.point.orders.map((item, id) =>
        <Order
          cars={this.props.cars}
          selectedBrand={item.selectedBrand}
          selectedModel={item.selectedModel}
          number={item.number}
          id={id}
          key={id}
          handleOrderChanged={this.props.handleOrderChanged.bind(this, id)}
          handleOrderDeleted={this.props.handleOrderDeleted.bind(this, id)}
        />)
      : null
    const expandedHeader = 'highlight-expanded-header--' + this.state.isActive
    const textToShow = this.props.point.startOrFinish ? (this.props.point.startOrFinish === 1 ? 'Start' : 'Finish') + ` point: ${this.props.point.name}` : `Intermediate point: ${this.props.point.name}`

    return (
      <div >
        <ExpansionPanel className='expansion-panel' onChange={this.handleExpandedChange} expanded={this.state.isActive} >
          <ExpansionPanelSummary className={expandedHeader} expandIcon={<ExpandMoreIcon />}>
            <div className='expansion-panel-summary'>
              <div className='expansion-panel-summary-info'> {textToShow} </div>
              <Fab
                size='small'
                className='expansion-panel-delete-button'
                onClick={this.props.handlePointDeleted}
                disabled={this.props.point.startOrFinish !== 0} >
                <DeleteIcon className='expansion-panel-delete-icon' />
              </Fab>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails >
            <Paper className='map-data'>
              <MapContainer
                credentials={this.props.credentials}
                point={this.props.point}
                handlePointSelected={this.props.handlePointSelected}
                //   handleLocationIdChanged = {this.props.handleLocationIdChanged}
              />
            </Paper>
            <Paper className='orders-data'>
              {orders}
              <Fab size='small' className='add-button' onClick={this.props.handleOrderAdded}>
                <AddIcon className='add-icon' />
              </Fab>
            </Paper>

          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

export default Point
