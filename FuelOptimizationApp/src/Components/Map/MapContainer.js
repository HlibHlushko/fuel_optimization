import React from 'react';
import Autosuggest from 'react-autosuggest';
import SearchButton from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton'
import './map.css';
import MapPic from './MapPic.js'

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.label}</span>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.value;
}

class MapContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.locationId || '',
      suggestions: [],//this.getSuggestions('')
    };

    // this.onChange = this.onChange.bind(this);
    // this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  getSuggestions(value) {
    if (!value) return Promise.resolve([]);
    const inputLength = value.length;
    if (inputLength === 0) return Promise.reject([]);
    let app_id = 'fLR4pqJX0jZZZle8nwaM';
    let app_code = 'eM1d0zQLOLaA44cULr6NwQ';
    let url = 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json';
    return fetch(`${url}?query=${value}&app_id=${app_id}&&app_code=${app_code}`, {
      method: 'GET',
      mode: 'cors'
    }).then(response => {
      return response.json();
    });
    
  }

  onSuggestionsFetchRequested = (value) => {
    this.getSuggestions(value? value.value : null).then(resp=>{
      console.log(resp.suggestions)
      let result = resp.suggestions.map(suggestion => (
        {
          label: suggestion.label,
          value: suggestion.locationId,
          position: this.props.position
        }
      ));
      this.setState({suggestions: result});
    });
  }
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  onChange = (event, { newValue }) => {
    let new_label = this.state.suggestions.find(sug => sug.value === newValue);
    console.log(new_label);

    if (new_label) this.props.handleLocationIdChanged(newValue);
    new_label = new_label ? new_label.label : null;
    this.setState({ value: new_label ? new_label : newValue });
    this.onSuggestionsUpdateRequested(new_label ? new_label : newValue);
    
  }

  onSuggestionsUpdateRequested({ value }) {
    this.getSuggestions(value? value.value: null);
  }
  
  onSearchRequested = () =>{
    this.getSuggestions(this.state.value).then(resp => {
      this.setState({value: resp.suggestions[0].label});
      this.props.handleLocationIdChanged(resp.suggestions[0].locationId);
  
    });
  }

  render() {
    const {  required } = this.props;
    const { value, suggestions } = this.state;
    const inputProps = {
      id: 'search',
      name: 'search',
      value,
      className: 'react-autosuggest__input',
      required,
      onChange: this.onChange
    };

    return (
      <div>
        <div className='search-bar-container'>
          <Autosuggest
            value={this.state.value}
            suggestions={suggestions}
            onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
            <IconButton size='small' className ='search-button' onClick = {this.onSearchRequested} >
              <SearchButton  className='search-icon' />
            </IconButton>
        </div>
        
        <MapPic position = {this.props.position}/>
    </div>
    );
  }
}

export default MapContainer;






