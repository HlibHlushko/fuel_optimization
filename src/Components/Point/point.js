import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper'
import Map from '../Map/map'
import Order from '../Orders/orders'
import './point.css'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'

class Point extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isActive : false
        }
    }
    handleExpandedChange = () => {
        this.setState({ isActive: !this.state.isActive });
    }
    render() {
        const orders = this.props.point.orders ? 
                this.props.point.orders.map((item, id)=>
                    <Order 
                        selectedBrand = {item.selectedBrand}
                        selectedModel = {item.selectedModel}
                        number = {item.number}
                        id = {id}
                        key={id}
                        handleOrdersChanged = {this.props.handleOrdersChanged.bind(this, id)}
                    />) 
                : null;
        const expandedHeader = 'highlight-expanded-header--' + this.state.isActive;
        //console.log('order after render', this.state.orders);
        return (
            <div >
                <ExpansionPanel className='expansionPanel' onChange={this.handleExpandedChange}>
                    <ExpansionPanelSummary className={expandedHeader} expandIcon={<ExpandMoreIcon />}>
                        Point #{this.props.id}: {this.props.point.name}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails >
                        <Paper className='mapData'>
                            <Map  point={this.props.point.mapData} coordinates = {this.props.point.coordinates} />
                        </Paper>
                        <Paper className = 'ordersData'>
                            {orders}
                            <Fab size="small" className='add-button' onClick={this.props.handleOrdersAdded}>
                                <AddIcon className='add-icon'/>
                            </Fab>
                        </Paper>



                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}

export default Point;