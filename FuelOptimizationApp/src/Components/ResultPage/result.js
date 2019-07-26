import React from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import  {hereTileUrl} from '../InputPage/Map/MapPic'
import './Result.css'

const output = [
    { "Coordinates": [49.43532, 19.33918], "UnloadCars": null, "FuelCost": 1.0, "FuelVolume": 630 },
    { "Coordinates": [49.53532, 19.346918], "UnloadCars": [{"BrandId": 1,"ModelId": 1,"BrandName": "Renault","ModelName": "Logan"},{"BrandId": 1,"ModelId": 2,"BrandName": "Renault","ModelName": "Master"},{"BrandId": 2,"ModelId": 3,"BrandName": "Nissan","ModelName": "X-Trail"}], "FuelCost": null, "FuelVolume": null },
    { "Coordinates": [49.39532, 19.71918], "UnloadCars": null, "FuelCost": 0.94, "FuelVolume": 370 }];


class Result extends React.Component {
    

    
    getPopupText = (point) =>{
         let innerData;
         if (point.FuelCost!=null){
             innerData = (
                 <div>
                    <div>Refuel here {point.FuelVolume} liters with cost {point.FuelCost} euro/liter</div>
                    <div>Total cost = {Number((point.FuelVolume * point.FuelCost).toFixed(10))} euros </div>
                </div>
             );
         } else
            innerData = point.UnloadCars.map((item, id) => <div key = {id} > {item.BrandName} {item.ModelName} </div>);
         

        return (
            <div>
                <div>Type: {point.FuelCost? 'FuelStation': 'Dealer'} </div>
                <div>Name: {point.Coordinates}</div>
                {innerData}
            </div>
        )
    } 

    render() {
        let center = null;
        center = center ? center : [49.43532, 19.33918];
        let markers = output.map((item, id) =>{
            return (
                <Marker key = {id}
                    position = {item.Coordinates} >
                        <Popup autoClose = {false}>
                            {this.getPopupText(item)}
                        </Popup>
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