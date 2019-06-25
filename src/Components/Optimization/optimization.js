import React from 'react';
import Route from '../Route/route';
import TruckPicker from '../TruckPicker/TruckPicker'

class Optimization extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTruck : null,
            points: null
        }

    }
    componentDidMount(){
        this.setState({points:[
            {
                mapData: 'mapData1',
                name: 'Ukraine',
                coordinates: {
                    GpsLatitude: '12.34',
                    GpsLongitude: '12.34'
                },
                orders: [
                    {
                        selectedBrand: { value: 0, label: 'Renault'},
                        selectedModel: {value: 0, label: 'Logan'},
                        number: 4
                    },
                ]
            },
            {
                mapData: 'mapData2',
                name: 'England',
                coordinates: {
                    GpsLatitude: '14.88',
                    GpsLongitude: '14.88'
                },
                orders: [
                    {
                        selectedBrand: { value: 0, label: 'Nissan'},
                        selectedModel: {value: 0, label: 'X-Trail'},
                        number: 2
                    },
                ]
            }
        ]});
    }
    handleTruckChanged = (truck) =>{
        this.setState({selectedTruck: truck});
    }
    handleRouteChanged = (points) =>{
        this.setState({points: points});
    }
    handleBrandSelected = (selectedBrand, id ) =>{
        this.setState({points:[
            ...this.state.points.slice(id),
            this.state.points[id]
        ]
         })
    }
    render(){
        return (
        <div>
            <TruckPicker handleTruckChanged = {this.handleTruckChanged}/>
            <Route points= {this.state.points} handleRouteChanged = {this.handleRouteChanged} />
        </div>
        );
    }

}

export default Optimization;