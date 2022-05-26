import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import axiosInstance from '../axios';

const filter = createFilterOptions();

export default function ListCreateAnswer(props) {
  const [value, setValue] = React.useState(null);
  
  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          props.setSelectedAnswer({
            answer: newValue.answer,
            answer_id: newValue.id
          })
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          console.log(newValue.inputValue)
          console.log(props.selectedQuestion.pk)
          axiosInstance.post("sitting/question_answers/", {
            answer: newValue.inputValue,
            question: props.selectedQuestion.pk
          }).catch(error => {
            console.log(error)
          })
            .then(response => {
              if (response.status == 201) {
                props.setAnswers([...props.options, response.data.answer]);
                props.setSelectedAnswer({
                  answer: response.data.answer.answer,
                  answer_id: response.data.answer.id
                });
              }
            });
        } else {
          props.setSelectedAnswer({
            answer: newValue.answer,
            answer_id: newValue.id,
          })
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.answer);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            answer: `Utwórz "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      fullWidth
      handleHomeEndKeys
      id="answers-list"
      options={props.options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.answer;
      }}
      renderOption={(props, option) => <li {...props}>{option.answer}</li>}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label={props.label} />
      )}
    />
  );
}