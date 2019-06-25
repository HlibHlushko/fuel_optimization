import React from 'react'
import './map.css'

class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
    render(){
        
        return (
            <div>
                <div> GpsLong: {this.props.coordinates.GpsLongitude} </div>
                <div> GpsLat: {this.props.coordinates.GpsLatitude} </div>
                <div>Map is supposed to be here</div>
            </div>
        );
    }
}

export default Map;