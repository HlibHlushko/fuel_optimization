import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet';

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
        }

    }
    render() {
        return (
            <div>
                <Map
                    center={this.props.position}
                    className='map-picture'
                    zoom={6}>

                    <TileLayer
                        url={hereTileUrl('reduced.day')}
                    />
                </Map>
            </div>
        )
    }
}

export default MapPic;