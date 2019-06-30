import React from 'react';
import Select from 'react-select';
import './TruckPicker.css'

class TruckPicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            suggestions : []
        };

    }
    componentDidMount(){
        this.setState({suggestions: [
            {value: 1, label: 'Lohr 1.21'},
            {value: 2, label: 'Rolfo 228'},
            {value: 3, label: 'Azlagor 148'}] });
    }
    handleChange = (selectedOption) => {
        this.props.handleTruckChanged(selectedOption);
    };
    render(){
        return (
            <Select className='picker'
                onChange = {this.handleChange}
                options = {this.state.suggestions}
                placeholder = 'Select truck'
                />
        );
    }
}

export default TruckPicker;