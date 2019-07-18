import React from 'react';
import Route from '../Route/route';
import TruckPicker from '../TruckPicker/TruckPicker';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import './optimization.css'


class Optimization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTruck: null,
            points: null,
            isDialogOpened: false,
            credentials: {
                app_id: 'fLR4pqJX0jZZZle8nwaM',
                app_code: 'eM1d0zQLOLaA44cULr6NwQ',
            },
            cars: []
        }

    }
    componentDidMount() {
        this.setState({
            points: [
                {
                    mapData: 'mapData1',
                    name: 'Ukraine',
                    orders: [
                        {
                            selectedBrand: { value: 1, label: 'Renault' },
                            selectedModel: { value: 1, label: 'Logan' },
                            number: 4
                        },
                    ],
                    coordinates: [50.393219, 30.488314],
                    // locationId: 'NT_s5uXPmqbNH4pCOzMAorV.C',
                    locationName: 'aszcx',
                    MapView: {
                        BottomRight: {Latitude: 53.11653, Longitude: 13.90612},
                        TopLeft: {Latitude: 53.1228, Longitude: 13.90277}
                    }

                },
                {
                    mapData: 'mapData2',
                    name: 'England',
                    orders: [
                        {
                            selectedBrand: { value: 2, label: 'Nissan' },
                            selectedModel: { value: 3, label: 'X-Trail' },
                            number: 2
                        },
                    ],
                    coordinates: [51.797901, 11.198762],
                    // locationId: 'NT_Bn2nZIGG5u7l6Vv2n9z9AD',
                    locationName: 'dfkl',
                    MapView: {
                        BottomRight: {Latitude: 53.11653, Longitude: 13.90612},
                        TopLeft: {Latitude: 53.1228, Longitude: 13.90277}
                    }
                }
            ]
        });

        fetch('http://localhost:1984/api/GetBrands', {
            method: 'GET',
            mode: 'cors',
            headers: {
                
            }
        })
            .then(response=>  response.json() )
            .then(data=>{
                this.setState({cars:data});
                // this.state.cars = data;
            })
        // const cars = require('./models.json');
        // const brands = [...new Set(cars.map((model)=>{
        //     return model.brandName;
        // }))];
        // const models = cars.filter(model=>this.props.selectedBrand && model.brandName === this.props.selectedBrand.label);
        
    }
    handleTruckChanged = (truck) => {
        this.setState({ selectedTruck: truck });
    }

    handleOrderChanged = (pointId, orderId, newOrder) => {
        this.setState({
            points: [...this.state.points.slice(0, pointId),
            {
                ...this.state.points[pointId],
                orders: [...this.state.points[pointId].orders.slice(0, orderId),
                    newOrder,
                ...this.state.points[pointId].orders.slice(orderId + 1)]
            },
            ...this.state.points.slice(pointId + 1)]
        })
    }
    handleOrderAdded = (pointId) => {
        this.setState({
            points: [...this.state.points.slice(0, pointId),
            {
                ...this.state.points[pointId],
                orders: [...this.state.points[pointId].orders, {
                    selectedBrand: null,
                    selectedModel: null,
                    number: 1
                }]
            },
            ...this.state.points.slice(pointId + 1)]
        });
    }
    handleOrderDeleted = (pointId, orderId) => {
        this.setState({
            points:
                [...this.state.points.slice(0, pointId),
                {
                    ...this.state.points[pointId],
                    orders: [...this.state.points[pointId].orders.slice(0, orderId),
                    ...this.state.points[pointId].orders.slice(orderId + 1)]
                },
                ...this.state.points.slice(pointId + 1)]
        })
    }
    handlePointAdded = () => {
        this.setState({
            points: [...this.state.points, {
                mapData: 'mapData' + this.state.points.length,
                name: '',
                coordinates: null,
                orders: [
                    {
                        selectedBrand: null,
                        selectedModel: null,
                        number: 1
                    },
                ]
            }]
        });
    }
    handlePointDeleted = (pointId) => {
        this.setState({
            points:
                [...this.state.points.slice(0, pointId),
                ...this.state.points.slice(pointId + 1)]
        });
    }
    handlePointSelected = (pointId, coordinates) => {
        const {app_id, app_code} = this.state.credentials;
        let url = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json';
        return fetch(`${url}?prox=${coordinates[0]},${coordinates[1]}&mode=retrieveAddresses&maxresults=1&app_id=${app_id}&app_code=${app_code}`)
            .then(response => {
                return (response.json());
            }).then(json => {
                if (json.Response.View.length === 0) return this.state.points[pointId].locationName;
                
                let res = json.Response.View[0].Result[0].Location.Address;
                this.setState({
                    points: [...this.state.points.slice(0, pointId),
                    {
                        ...this.state.points[pointId],
                        locationName: res.Label,
                        coordinates: [json.Response.View[0].Result[0].Location.DisplayPosition.Latitude, json.Response.View[0].Result[0].Location.DisplayPosition.Longitude],
                        name: res.AdditionalData[0].value + (res.City ? ', ' + res.City : ''),
                    },
                    ...this.state.points.slice(pointId + 1)]
                });
                return res.Label;
            });
    }
    handleSendRequested = () =>{
        let points = this.state.points;
        let filled = this.state.selectedTruck ? true : false;
        
        for (let i=0; i<points.length;++i)
            {
                if (!points[i].coordinates||!points[i].orders) 
                    { 
                        filled=false; 
                        break; 
                    }
                for(let j=0;j<points[i].orders.length;++j)
                    if (!points[i].orders[j].selectedBrand || !points[i].orders[j].selectedModel) {
                        filled = false;
                        break;
                    }

            }
        
        if (!filled) this.setState({isDialogOpened:true}); else{
            console.log('ok')
        }
    }
    handleCloseDialog = () =>{
        this.setState({isDialogOpened: false});
    }
    render() {
        return (
            <div>
                <TruckPicker handleTruckChanged={this.handleTruckChanged} />
                <Route
                    points={this.state.points}
                    credentials={this.state.credentials}
                    cars = {this.state.cars}
                    handleOrderChanged={this.handleOrderChanged}
                    handleOrderAdded={this.handleOrderAdded}
                    handleOrderDeleted={this.handleOrderDeleted}
                    handlePointAdded={this.handlePointAdded}
                    handlePointDeleted={this.handlePointDeleted}
                    handlePointSelected={this.handlePointSelected}
                // handleLocationIdChanged = {this.handleLocationIdChanged}
                />
                <div>
                    <Fab className ='add-point-icon' size="small" onClick = {this.handlePointAdded}>
                        <AddIcon/>
                    </Fab>
                    <Fab variant = 'extended'  size = 'medium' className='send-button' onClick = {this.handleSendRequested}>
                        Send 
                    </Fab>
                </div>
                <Dialog open = {this.state.isDialogOpened}>
                    <DialogTitle> Warning </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You have unfilled fields, check your input and try again
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick = {this.handleCloseDialog}>OK</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

}

export default Optimization;