import React from 'react';
import Autosuggest from 'react-autosuggest';
import SearchButton from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton'
import './map.css';
import MapPic from './MapPic'

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
      input: (this.props.point.locationName ? this.props.point.locationName : ''),
      suggestions: []
    };
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
  getLocation = (locationId) => {
    const { app_code, app_id } = this.props.credentials;
    let url = 'http://geocoder.api.here.com/6.2/geocode.json';
    return fetch(`${url}?locationId=${locationId}&app_id=${app_id}&&app_code=${app_code}`, {
      method: 'GET',
      mode: 'cors'
    }).then(response => {
      return response.json();
    }).then(json => {
      if (!json.Response.View[0]) return [0,0];
      let pos = json.Response.View[0].Result[0].Location.DisplayPosition;
      let coordinates = [pos.Latitude, pos.Longitude];
      return coordinates;
    });
  }
  onSuggestionsFetchRequested = (value) => {
    if (!value) { this.setState({ suggestions: [] }); return; }
    let suggestions;
    this.getSuggestions(value.value)
      .then(resp => {
        suggestions = resp.suggestions;
        return Promise.all(
          suggestions.map(s=> this.getLocation(s.locationId))
        );
      })
      .then(newCoordinates => {

        let result = suggestions.map((suggestion, i) => (
          {
            label: suggestion.label,
            value: newCoordinates[i]
          }
        ));
        this.setState({ suggestions: result });
      });
  }
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  findLabelByValue = (value) =>{
    let equal = (x, y) => {
        return x[0] === y[0] && x[1]===y[1];
    }
    let sug = this.state.suggestions.filter(s=>equal(value,s.value));
    return sug ? sug[0].label:'';
  }
  
  onChange = (event, { newValue, method }) => {
    
    if (typeof(newValue)=='string') {
      this.setState({input: newValue});
      return;
    }
    this.setState({ input: this.findLabelByValue(newValue) })
    // let new_label = this.state.suggestions.find(sug => sug.value === newValue);
    // if (new_label) this.props.handleLocationIdChanged(newValue);
    // new_label = new_label ? new_label.label : null;
    // this.setState({ value: new_label ? new_label : newValue });
    // this.onSuggestionsUpdateRequested(new_label ? new_label : newValue);

  }

  onSuggestionsUpdateRequested({ value }) {
    this.getSuggestions(value ? value.value : null);

  }

  onSearchRequested = () => {
    this.getSuggestions(this.state.input).then(resp => {
      console.log('null',resp)
      if (resp.length===0 || resp.suggestions.length===0) return; 
      this.setState({ input: resp.suggestions[0].label });
      this.getLocation(resp.suggestions[0].locationId).then(coordinates=>{
        this.props.handlePointSelected(coordinates);
      })
      // console.log('p;osdfj',position)
      // this.props.handleLocationIdChanged();

    });
  }
  handlePointSelected = (location) => {
    this.props.handlePointSelected(location).then(newLabel =>{
      // if (!newLabel) this.setState({})
      this.setState({input:newLabel});
    });
  }
  handleSuggestionSelected = (event, {suggestionValue}) =>{
    this.props.handlePointSelected(suggestionValue);
  }
  render() {
    const { required } = this.props;
    const { input, suggestions } = this.state;
    const inputProps = {
      id: 'search',
      name: 'search',
      value: input,
      className: 'react-autosuggest__input',
      required,
      onChange: this.onChange
    };
    return (
      <div>
        <div className='search-bar-container'>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            onSuggestionSelected  = {this.handleSuggestionSelected}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
          <IconButton size='small' className='search-button' onClick={this.onSearchRequested} >
            <SearchButton className='search-icon' />
          </IconButton>
        </div>

        <MapPic 
          point = {this.props.point}
          handlePointSelected={this.handlePointSelected}
        />
      </div>
    );
  }
}

export default MapContainer;






