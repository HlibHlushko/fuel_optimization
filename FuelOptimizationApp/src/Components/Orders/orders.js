import React from 'react';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField'
import './orders.css';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';


class Order extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    handleDelete = ()=>{
        this.props.onDeleteOrder(this.props.id);
    }
    handleBrandSelected = (selectedBrand)=>{
        this.props.handleOrderChanged({
            selectedBrand: selectedBrand,
            selectedModel: null,
            number: this.props.number
        });
    }
    handleModelSelected = (selectedModel)=>{
        this.props.handleOrderChanged({
            selectedBrand: this.props.selectedBrand,
            selectedModel: selectedModel,
            number: this.props.number
        });
    }
    handleNumberChanged =(event)=>{
        this.props.handleOrderChanged({
            selectedBrand: this.props.selectedBrand,
            selectedModel: this.props.selectedModel,
            number: event.target.value
        });
    }
    render(){
        const cars = require('./models.json');
        const brands = [...new Set(cars.map((model)=>{
            return model.brandName;
        }))];
        const models = cars.filter(model=>this.props.selectedBrand && model.brandName === this.props.selectedBrand.label);
        
        return(

            <div>
                <div className='orders-container'>
                    <Select
                        className = 'select'
                        options = {brands.map((item, id)=>{
                            return {label: item, value:id};
                        })}
                        value = {this.props.selectedBrand} //{this.state.selectedBrand.label ? this.state.selectedBrand : null}
                        onChange = {this.handleBrandSelected}
                        placeholder='Select brand'
                    />
                    <Select
                        className = 'select'
                        value = {this.props.selectedModel}
                        options = {models.map((item,id)=>{
                            return {label: item.name, value:id};
                        })}
                        onChange = {this.handleModelSelected}
                        placeholder='Select model'
                    />
                    <TextField 
                        type='number'
                        className='number'
                        value = {this.props.number}
                        onChange = {this.handleNumberChanged}
                        />
                    <Fab size="small" className='delete-button' onClick={this.props.handleOrderDeleted}>
                        <DeleteIcon className='delete-icon'/>
                    </Fab>
                </div>
                
            </div>
        );
    }
}

export default Order;