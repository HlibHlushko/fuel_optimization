import React from 'react'
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { hereTileUrl } from '../InputPage/Map/MapPic'
import './Result.css'

const output = [
    { "Coordinates": [49.43532, 19.33918], "UnloadCars": null, "FuelCost": 1.0, "FuelVolume": 630 },
    { "Coordinates": [49.53532, 19.346918], "UnloadCars": [{ "BrandId": 1, "ModelId": 1, "BrandName": "Renault", "ModelName": "Logan" }, { "BrandId": 1, "ModelId": 2, "BrandName": "Renault", "ModelName": "Master" }, { "BrandId": 2, "ModelId": 3, "BrandName": "Nissan", "ModelName": "X-Trail" }], "FuelCost": null, "FuelVolume": null },
    { "Coordinates": [49.39532, 19.71918], "UnloadCars": null, "FuelCost": 0.94, "FuelVolume": 370 }];
const cred =  {
    app_id: 'fLR4pqJX0jZZZle8nwaM',
    app_code: 'eM1d0zQLOLaA44cULr6NwQ',
};
const polyline = [
    {
        from_lat: 49.43532,
        from_long: 19.33918,
        id: 1,
        to_lat: 49.53532,
        to_long: 19.346918,
    },
    {
        from_lat: 49.53532,
        from_long: 19.346918,
        id: 2,
        to_lat: 49.39532,
        to_long: 19.71918,
    }
]

class Result extends React.Component {

    constructor(props){
        super(props);
        this.state={
            polylineShape: null
        }
    }
    componentDidMount(){
        this.getRoute();

    }
    getPopupText = (point) => {
        let innerData;
        if (point.FuelCost != null) {
            innerData = (
                <div>
                    <div>Refuel here {point.FuelVolume} liters with cost {point.FuelCost} euro/liter</div>
                    <div>Total cost = {Number((point.FuelVolume * point.FuelCost).toFixed(10))} euros </div>
                </div>
            );
        } else
            innerData = point.UnloadCars.map((item, id) => <div key={id} > {item.BrandName} {item.ModelName} </div>);


        return (
            <div>
                <div>Type: {point.FuelCost ? 'FuelStation' : 'Dealer'} </div>
                <div>Name: {point.Coordinates}</div>
                {innerData}
            </div>
        )
    }

    getRoute = () =>{
        let path='';
        output.map((point, id)=>{
            return path+=`&waypoint${id}=geo!${point.Coordinates[0]},${point.Coordinates[1]}`});
        path+=`&waypoint${output.length-1}=geo!${output[output.length-1].Coordinates[0]},${output[output.length-1].Coordinates[1]}`;
        let url = `https://route.api.here.com/routing/7.2/calculateroute.json?app_id=${cred.app_id}&app_code=${cred.app_code}${path}&mode=fastest;truck;traffic:disabled&limitedWeight=30.5&height=4.25&representation=overview&routeattributes=sh`;
        fetch(url)
        .then(response=>response.json())
        .then(data=>{
            // this.setState({polylineShape: data.response.route[0].shape});
            let res = [];
            console.log(data);
            data.response.route[0].shape.map((item)=>{res.push(item.split(','))});
            this.setState({polylineShape: res});
        })

    }

    render() {
        console.log('again')
        let center = null;
        center = center ? center : [49.43532, 19.33918];
        let markers = output.map((item, id) => {
            return (
                <Marker key={id}
                    position={item.Coordinates} >
                    <Popup autoClose={false}>
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
                    onClick={this.handleClick}

                >
                    {markers}
                    <TileLayer
                        url={hereTileUrl()}
                    />


                    {this.state.polylineShape ? <Polyline
                        key={1}
                        positions={this.state.polylineShape}
                        color={'red'}
                    > </Polyline> : null}
                </Map>
            </div>
        );
    }
}

export default Result;