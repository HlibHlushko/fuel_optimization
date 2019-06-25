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
    handleAddClick = ()=>{
      
        this.props.handleRouteChanged([...this.props.points, {
            mapData: 'mapData'+this.props.points.length(),
            name: '',
            coordinates: {
                GpsLatitude: null,
                GpsLongitude: null
            },
            orders: [
                {
                    selectedBrand: null,
                    selectedModel: null,
                    number: 1
                },
            ]}]);
    }
    //handleOrderChanged = () =>{}
    
    
    
    render(){
        let points = this.props.points ? 
        this.props.points.map((point, id)=>
            <Point 
                    point = {point}
                    id = {id}
                    key = {id} 
                    handleOrderChanged = {this.props.handleOrderChanged.bind(this, id)}
                    handleOrderAdded = {this.props.handleOrderAdded.bind(this, id)}
                    handleOrderDeleted = {this.props.handleOrderDeleted.bind(this,id)}
                />)
        : null;
        return (
            <div>
                {points}
                <Fab className ='addIcon' size="small">
                    <AddIcon onClick={this.handleAddClick} />
                </Fab>
                
            </div>);
    }
}

export default Route;