import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import  {hereTileUrl} from '../InputPage/Map/MapPic'; // woo-hoo
import './fuelStations.css';

class FuelStations extends React.Component {
    render() {
        let center = [49.43532, 19.33918];
        return (
            <div>
                <Map
                    center={center}
                    className='map'
                    zoom={10}                    
                >
                    <TileLayer
                        url={hereTileUrl()}
                    />
                </Map>
            </div>
        );
    }
}

export default FuelStations;