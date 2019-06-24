import React from 'react'
import './map.css'

class Map extends React.Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            point: props.point
        }
    }
    render(){
        
        return (
            <div>
                <div> GpsLong: {this.state.point.gpsLong} </div>
                <div> GpsLat: {this.state.point.gpsLat} </div>
                <div>Map is supposed to be here</div>
            </div>
        );
    }
}

export default Map;