import React from 'react';
import Point from '../Point/point';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import './route.css'

class Route extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            mapData : ['mapData1', 'mapData2'],
            points : [ {
                gpsLong : 10.11,
                gpsLat : 14.88,
                name: 'Ukraine'
            },
            {
                gpsLong : 98.32,
                gpsLat : 22.8,
                name: 'Australia'
            }],
        }
        this.handleAddClick.bind(this);
    }
    handleAddClick = ()=>{
      
        this.setState({ points: [...this.state.points, {
            gpsLat: null,
            gpsLong: null,
            name: null
        }]});
    }
    render(){
        let points = [];
        for (let i=0; i<this.state.points.length; ++i)
            points.push(<Point mapData = {this.state.mapData[i]} point = {this.state.points[i]} id = {i} key = {i} />);
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