import React from 'react'
// import HEREMap from 'react-here-maps'

class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            app_id:'fLR4pqJX0jZZZle8nwaM',
            app_code: 'eM1d0zQLOLaA44cULr6NwQ',
        }
    }
    render(){
        return (
            <div>
                {/* <HEREMap 
                    appId = {this.state.app_id}
                    appCode= {this.state.app_code}
                    center = { {lat: 51.5, lng:0}}
                    zoom = {8}
                /> */}
            </div>
        )
    }
}

export default Map;