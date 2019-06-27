import React from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' },
];

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => { }, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  if (inputLength === 0) return [];
 
  let app_id = 'fLR4pqJX0jZZZle8nwaM';
  let app_code = 'eM1d0zQLOLaA44cULr6NwQ';
  let url = 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json';
  let suggestions =  fetch(`${url}?query=${value}&app_id=${app_id}&&app_code=${app_code}`, {
    method: 'GET', 
    mode: 'cors'
  }).then(response => response.json());
  console.log(suggestions);
  return suggestions;



}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
}));

export default function IntegrationAutosuggest() {
  const classes = useStyles();
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState({
    single: '',
    popper: '',
  });

  const [stateSuggestions, setSuggestions] = React.useState([]);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = name => (event, { newValue }) => {
    setState({
      ...state,
      [name]: newValue,
    });
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          id: 'react-autosuggest-simple',
          //label: '',
          placeholder: 'Start searching',
          value: state.single,
          onChange: handleChange('single'),
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />


    </div>
  );
}


















// import React from 'react';
// import Autosuggest from 'react-autosuggest';


// const suggestions = [
//   {
//     name:'kek',

//   },
//   {
//     name:'lol'
//   }
// ];
// const getSuggestionValue = suggestion => suggestion.name;
// const getSuggestions = value =>{

//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;
//   return inputLength === 0 ? [] : suggestions.filter(sug => 
//     sug.name.toLowerCase().slice(0, inputLength) === inputValue);
// }
// const renderSuggestion = suggestion => (
//   <div>
//     {suggestion.name}
//   </div>
// );
// class Map extends React.Component{
//   constructor(props){
//     super(props);
//     this.state={
//       value: ' ',
//       suggestions: []
//     };
//   }
//   onSuggestionsFetchRequested = (value) => {
//     this.setState({suggestions: getSuggestions(value)})
//   }
//   onSuggestionsClearRequested = () => {
//     this.setState({
//       suggestions: []
//     });
//   };
//   onChange = (event) =>{
//     this.setState({suggestions: getSuggestions(event.target.value)})
//   }
//   render(){
//     const { value, suggestions } = this.state;
//     const inputProps = {
//       placeholder: 'Start searching...',
//       value,
//       onChange: this.onChange
//     };

//     return(
//         <Autosuggest
//             suggestions ={suggestions}
//             onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//             onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//             getSuggestionValue={getSuggestionValue}
//             renderSuggestion = {renderSuggestion}
//             inputProps = {inputProps}
//         />

//     );
//   }
// }
// export default Map;

