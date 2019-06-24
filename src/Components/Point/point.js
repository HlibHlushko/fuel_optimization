import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper'
import Map from '../Map/map'
import Orders from '../Orders/orders'
import './point.css'
class Point extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            mapData: props.mapData,
            point: props.point,
            isActive: false
        }
        this.handleExpandedChange.bind(this);
    }
    handleExpandedChange = () => {
        this.setState({ isActive: !this.state.isActive });
    }
    render() {

        const expandedHeader = 'highlight-expanded-header--' + this.state.isActive;
        return (
            <div >
                <ExpansionPanel className='expansionPanel' onChange={this.handleExpandedChange}>
                    <ExpansionPanelSummary className={expandedHeader} expandIcon={<ExpandMoreIcon />}>
                        Point #{this.state.id}: {this.state.point.name}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails >
                        <Paper className='mapData'>
                            <Map  point={this.state.point}/>
                        </Paper>
                        <Paper className = 'ordersData'>
                            <Orders/>
                        </Paper>



                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}

export default Point;