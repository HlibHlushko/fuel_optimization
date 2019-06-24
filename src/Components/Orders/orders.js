import React from 'react';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField'
import './orders.css';

class Orders extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedBrand: props.selectedBrand? props.selectedBrand: {label:null, value:null},
            selectedModel: props.selectedModel
        }
        //this.handleBrandSelected(this);
        //this.handleModelSelected(this);
    }
    handleBrandSelected = (selectedBrand)=>{
        this.setState({
            selectedBrand: selectedBrand,
            selectedModel: null
        });
        console.log(selectedBrand.label);
    }
    handleModelSelected = (selectedModel)=>{
        this.setState({selectedModel: selectedModel});
        console.log(selectedModel.label);
    }
    render(){
        const cars = require('./models.json');
        const brands = [...new Set(cars.map((model)=>{
            return model.brandName;
        }))];
        const models = cars.filter(model=>model.brandName==this.state.selectedBrand.label);
        
        return(
            <span>
                <Select
                    className = 'select'
                    options = {brands.map((item, id)=>{
                        return {label: item, value:id};
                    })}
                    value = {this.state.selectedBrand.label ? this.state.selectedBrand : null}
                    onChange = {this.handleBrandSelected}
                    placeholder='Select brand'
                />
                <Select
                    className = 'select'
                    value = {this.state.selectedModel}
                    options = {models.map((item,id)=>{
                        return {label: item.name, value:id};
                    })}
                    onChange = {this.handleModelSelected}
                    placeholder='Select model'
                />
                <TextField 
                    type='number'
                    className='number'
                    InputProp= {{inputProps:{min:0, max:10}}}
                    />
            </span>
        );
    }
}

export default Orders;