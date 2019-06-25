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
    
    handleOrdersChanged = (pointId, orderId, newOrder ) =>{
        this.setState({
            points: [...this.state.points.slice(0,pointId),
                    {
                        mapData: this.state.points[pointId].mapData,
                        name: this.state.points[pointId].name,
                        coordinates: this.state.points[pointId].coordinates,
                        orders: [...this.state.points[pointId].orders.slice(0,orderId),
                                newOrder,
                                ...this.state.points[pointId].orders.slice(orderId+1)]
                    } ,
                    ...this.state.points.slice(pointId+1)]
        })
    }
    handleOrdersAdded = (pointId) => {
        this.setState({
            points: [...this.state.points.slice(0,pointId),
                    {
                        mapData: this.state.points[pointId].mapData,
                        name: this.state.points[pointId].name,
                        coordinates: this.state.points[pointId].coordinates,
                        orders: [...this.state.points[pointId].orders, {
                                                            selectedBrand: { value: null, label: null},
                                                            selectedModel: {value: null, label: null},
                                                            number: 1
                                                        }]
                    },
                    ...this.state.points.slice(pointId+1)]
        });
    }
    render(){
        return (
        <div>
            <TruckPicker handleTruckChanged = {this.handleTruckChanged}/>
            <Route points= {this.state.points} handleOrdersChanged = {this.handleOrdersChanged} handleOrdersAdded = {this.handleOrdersAdded} />
        </div>
        );
    }

}

export default Optimization;