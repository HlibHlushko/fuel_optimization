import React from 'react';
import Point from '../Point/point';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import './route.css'

class Route extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }
    //handleOrderChanged = () =>{}
    
    
    
    render(){
        let points = this.props.points ? 
        this.props.points.map((point, id)=>
            <Point 
                    point = {point}
                    id = {id}
                    key = {id} 
                    handlePointSelected = {this.props.handlePointSelected.bind(this, id)}
                    handleOrderChanged = {this.props.handleOrderChanged.bind(this, id)}
                    handleOrderAdded = {this.props.handleOrderAdded.bind(this, id)}
                    handleOrderDeleted = {this.props.handleOrderDeleted.bind(this,id)}
                    handlePointDeleted = {this.props.handlePointDeleted.bind(this,id)}
                    handleLocationIdChanged = {this.props.handleLocationIdChanged.bind(this, id)}
                />)
        : null;
        return (
            <div>
                {points}
                <Fab className ='addIcon' size="small" onClick = {this.props.handlePointAdded}>
                    <AddIcon/>
                </Fab>
                
            </div>);
    }
}

export default Route;