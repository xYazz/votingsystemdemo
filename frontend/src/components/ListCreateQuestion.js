import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import axiosInstance from '../axios';

const filter = createFilterOptions();

export default function ListCreateQuestion(props) {
  const [value, setValue] = React.useState(null);
  
  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
          console.log('test')
          console.log(props.allowedUsers)
        if (typeof newValue === 'string') {
          console.log('1')
          props.setSelectedQuestion({
            question: newValue.question,
            room: newValue.room,
            pk: newValue.pk,
          })
          console.log(props.allowedUsers)
          props.setAnswers(newValue.answers?newValue.answers:[])
        } else if (newValue && newValue.inputValue) {
          console.log('2')
          // Create a new value from the user input
          axiosInstance.post("sitting/room_questions/", {
            question: newValue.inputValue,
            room: props.selectedSitting.pk
          }).catch(error => {
            console.log(error)
          })
            .then(response => {
              if (response.status == 201) {
                props.setRoomQuestions([...props.options, response.data.question]),
                props.setSelectedQuestion({
                  question: response.data.question,
                  room: response.data.room.pk,
                  pk: response.data.pk
                })
              }
              console.log(response.data)
            });
            props.setAnswers([])

        } else {
          console.log('3')
          props.setSelectedQuestion({
            question: newValue.question,
            pk: newValue.pk,
            room: newValue.room.pk
          })
          props.setAnswers(newValue.answers?newValue.answers:[])
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.question);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            question: `Utwórz "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      fullWidth
      handleHomeEndKeys
      id="questions-list"
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
        return option.question;
      }}
      renderOption={(props, option) => <li {...props}>{option.question}</li>}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label={props.label} />
      )}
    />
  );
}