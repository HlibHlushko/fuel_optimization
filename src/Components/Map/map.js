import React from 'react';
import Autosuggest from 'react-autosuggest';
import './map.css'


function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.label}</span>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.value;
}

class Map extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.location || '',
      suggestions: this.getSuggestions('')
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  getSuggestions(event) {
    if (!event) return [];
    const inputValue = event.value;
    const inputLength = inputValue.length;
    if (inputLength === 0) return [];
    let app_id = 'fLR4pqJX0jZZZle8nwaM';
    let app_code = 'eM1d0zQLOLaA44cULr6NwQ';
    let url = 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json';
    fetch(`${url}?query=${inputValue}&app_id=${app_id}&&app_code=${app_code}`, {
          method: 'GET', 
          mode: 'cors'
        }).then(response => {
          return response.json();
        }).then(resp=>{
          let result  = resp.suggestions.map(item=>(
            {
              label: item.label,
              value: item.locationId
            }
          ));
         
          this.setState({suggestions:result? result : []})
        });
  }

  onSuggestionsFetchRequested = (value) => {
    this.getSuggestions(value);
  }
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  onChange = (event, {newValue}) => {
    console.log(newValue);
    let new_label =  this.state.suggestions.find(sug=> sug.value == newValue);
    new_label = new_label? new_label.label : null;
    this.setState({ value: new_label?  new_label : newValue });
    this.onSuggestionsUpdateRequested( new_label? new_label:newValue);
  }

  onSuggestionsUpdateRequested({ value }) {
    this.getSuggestions(value);
  }

  render() {
    const { className, required } = this.props;
    const { value, suggestions } = this.state;
    const inputProps = {
      id: 'search',
      name: 'search',
      value,
      className: 'react-autosuggest__input',
      required,
      onChange: this.onChange
    };

    console.log(inputProps);

    return (
          <Autosuggest
            value={this.state.value}
            suggestions= {suggestions}
            onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps} />
    );
  }
}

export default Map;






