import React from 'react';
import Select from 'react-select';
import './TruckPicker.css'

class TruckPicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedOption: null,
            suggestions : [
                {value: 1, label: 'Lohr 1.21'},
                {value: 2, label: 'Rolfo 228'},
                {value: 3, label: 'Azlagor 148'}
            ]
        };

    }
    handleChange = (selectedOption) => {
        this.setState(selectedOption = {selectedOption});
    };
    formatOptions(data){
        return data.map((value, id)=>{
            return (
            <div key={value.id}>
                {value.label}
            </div>)
        })
    }
    render(){
        return (
            <Select className='picker'
                defaultValue = {this.state.suggestions[0]}
                value = {this.state.selectedOption}
                onChange = {this.handleChange}
                options = {this.state.suggestions}
                placeholder = 'Select truck'
                />
        );
    }
}

export default TruckPicker;