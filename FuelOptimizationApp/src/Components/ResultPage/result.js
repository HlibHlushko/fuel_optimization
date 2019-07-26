import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet';
import  {hereTileUrl} from '../InputPage/Map/MapPic'
import './Result.css'

const output = [
    { "Coordinates": [49.43532, 19.33918], "UnloadCars": null, "FuelCost": 1.0, "FuelVolume": 630 },
    { "Coordinates": [49.53532, 19.346918], "UnloadCars": [{ "BrandId": 1, "ModelId": 1 }, { "BrandId": 1, "ModelId": 2 }, { "BrandId": 2, "ModelId": 3 }], "FuelCost": null, "FuelVolume": null },
    { "Coordinates": [49.39532, 19.71918], "UnloadCars": null, "FuelCost": 0.94, "FuelVolume": 370 }];


class Result extends React.Component {
    

    

    render() {
        let center = null;
        center = center ? center : [49.43532, 19.33918];
        let markers = output.map((item, id) =>{
            return (
                <Marker 
                    position = {item.Coordinates} >
                </Marker>
            );
        });

        return (
            <div>
                <Map
                    center={center}
                    className='map'
                    zoom={10}
                    onClick = {this.handleClick}
                    
                    >
                    {markers}
                    <TileLayer
                        url={hereTileUrl()}
                    />
                </Map>
            </div>
        );
    }
}

export default Result;