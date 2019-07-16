import { Map, TileLayer, Marker } from 'react-leaflet';
import React from 'react';

export const hereCredentials = {
    id: 'fLR4pqJX0jZZZle8nwaM',
    code: 'eM1d0zQLOLaA44cULr6NwQ',
}

export const maxIsolineRangeLookup = {
    time: 20000,
    distance: 400000
}


// const hereIsolineUrl = (coords, options) => `https://isoline.route.api.here.com/routing/7.2/calculateisoline.json?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&mode=shortest;${options.mode};traffic:${options.traffic}&start=geo!${coords[0]},${coords[1]}&range=${options.range}&rangetype=${options.type}`

const hereTileUrl = (style) => `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&ppi=320`;

class MapPic extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            app_id: 'fLR4pqJX0jZZZle8nwaM',
            app_code: 'eM1d0zQLOLaA44cULr6NwQ',
            mapRef : React.createRef(),
            // markerPosition: this.props.point.coordinates,
            // center: center
        }
        // const mapRef = React.createRef();

    }
    handleClick = (event)=>{
        let position = [event.latlng.lat,event.latlng.lng];
        this.props.handlePointSelected(position);
        // this.setState({markerPosition:position});
        // console.log(event.latlng.lat,event.latlng.lng);
    }
    render() {
        // console.log(this.state);
        
        // console.log('center', this.props.point)
        let center = this.props.point.coordinates;
        center = center ? center : [49.43532, 19.33918];
        return (
            <div>
                <Map
                    center={center}
                    className='map-picture'
                    zoom={10}
                    onClick = {this.handleClick}
                    
                    >
                    {this.props.point.coordinates ? <Marker position = {this.props.point.coordinates}/> : null }
                    <TileLayer
                        url={hereTileUrl('reduced.day')}
                    />
                </Map>
            </div>
        )
    }
}

export default MapPic;