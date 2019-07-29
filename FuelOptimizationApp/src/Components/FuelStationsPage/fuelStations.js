/* global fetch */

import React from 'react';
import {Map, TileLayer, Marker, Polyline} from 'react-leaflet';
import  {hereTileUrl} from '../InputPage/Map/MapPic'; // woo-hoo
import './fuelStations.css';

const hereCredentials = {
  id: 'fLR4pqJX0jZZZle8nwaM',
  code: 'eM1d0zQLOLaA44cULr6NwQ',
}
const getTruckRestrictionTilesURL = () => {
  return ['https://',
    '{s}',
    '.base.maps.api.here.com/maptile/2.1/truckonlytile/newest/normal.day/',
    '{z}/{x}/{y}',
    '/256/png8',
    '?style=fleet',
    '&app_code=',
    hereCredentials.code,
    '&app_id=',
    hereCredentials.id
  ].join('');
}
const extractNames = (str) => {
  const ret = [];
  const names = str.split("\u001D");
  for(var i = 0; i < names.length; i++)
  { 
    const name = names[i];
    const name_text_split = name.split("\u001E");
    const name_text = name_text_split[0];
    const translit = name_text_split[1];
    const translitsObj = [];
    const phoneme = name_text_split[2];
    const phonemesObj = [];

    const language_code = name_text.substring(0,3);
    const name_type = name_text.substring(3,4);
    const is_exonym = name_text.substring(4,5);
    const text = name_text.substring(5, name_text.length);

    if (translit)
    {
      const translits = translit.split(";");
      for(let j = 0; j < translits.length; j++)
      {
        const lcode = translits[j].substring(0,3),
          tr = translits[j].substring(3,translits[j].length);
        translitsObj.push({ language_code: lcode, translit: tr});
      }
    }

    if (phoneme)
    {
      const phonemes = phoneme.split(";");
      for(let j = 0; j < phonemes.length; j++)
      {
        const lcode = phonemes[j].substring(0,3),
          pr = phonemes[j].substring(3,4),
          ph = phonemes[j].substring(4,phonemes[j].length);
        phonemesObj.push({ language_code: lcode, prefered: pr, phoneme: ph});
      }
    }

    ret.push({language_code: language_code, name_type: name_type, is_exonym: is_exonym, text: text, translits: translitsObj, phonemes: phonemesObj});
  }
  return ret;
}

class FuelStations extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      departCoords: { lat: 50.51696, lng: 30.37131 },
      destCoords: { lat: 50.37766, lng: 30.550723 },
      fuelStations: null,
      routeShape: null,
    }
  }
  render() {
    let center = [49.43532, 19.33918]
    return (
      <div>
        <button onClick={() => {
          fetch([
            'https://cle.api.here.com/2/search/routeisoline.json?',
            'layer_ids=FUELSTATION_POI',
            'app_code=' + hereCredentials.code,
            'app_id=' + hereCredentials.id,
            'waypoint0=' + this.state.departCoords.lat + ',' + this.state.departCoords.lng,
            'waypoint1=' + this.state.destCoords.lat + ',' + this.state.destCoords.lng,
            'geom=local',
            'max_detour_distance=100',
            'trailersCount=1',
            'limitiedweight=20',
            'mode=fastest;truck;traffic:disabled'
          ].join('&'))
            .then(res => res.json())
            .then(resj => {
              const stations = resj.response.route[0].searchResult.geometries.map(g => {
                const [lng, lat] = g.geometry
                  .replace(/POINT \(([0-9. ]+)\)/, '$1')
                  .split(' ');
                return {
                  latlng: {lat: Number(lat), lng: Number(lng)},
                  attributes: g.attributes,
                  isDiesel: g.attributes.DIESEL && g.attributes.DIESEL.split(';')[0] === 'y',
                  name: extractNames(g.attributes.NAMES)[0].text
                }
              })
              const shape = Array.prototype.concat(...resj.response.route[0].leg[0].link.map(l =>
                l.shape.reduce((acc, coor, i, shape) => {
                  if (i % 2 === 1) acc.push([shape[i - 1], coor]);
                  return acc;
                }, [])
              ))

              this.setState({fuelStations: stations, routeShape: shape});
            }).catch(error => {
              console.log('Request failed', error);
            })
        }}>Find fuel stations</button>
        <Map
          center={center}
          className='map'
          zoom={10}
        >
          <TileLayer
            url={hereTileUrl()}
          />
          <TileLayer
            url={getTruckRestrictionTilesURL()}
            subdomains={'1234'}
          />
          {this.state.fuelStations && this.state.fuelStations.map(fs =>
            <Marker
              key={`${fs.latlng.lat}${fs.latlng.lng}`}
              position={fs.latlng}
              onClick={() => console.log(fs)}
              opacity={fs.isDiesel ? 1 : .5}
            />)}
          {this.state.routeShape && 
            <Polyline
              positions={this.state.routeShape}
              color={'blue'}
            />}
        </Map>
      </div>
    )
  }
}

export default FuelStations;