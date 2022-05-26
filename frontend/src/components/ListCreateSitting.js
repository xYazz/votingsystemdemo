import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import axiosInstance from '../axios';

const filter = createFilterOptions();

export default function ListCreateSitting(props) {
  const [value, setValue] = React.useState(null);
  
  return (
    <Autocomplete
      value={value}
      fullWidth
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          props.setSelectedSitting({
            name: newValue.name,
            pk: newValue.pk,
            status: newValue.status
          })
          props.setRoomQuestions(newValue.questions)
          props.setAllowedUsers(newValue.allowed_users)
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          axiosInstance.post("sitting/create/", {
            name: newValue.inputValue
          }).catch(error => {
            console.log(error)
          })
            .then(response => {
              if (response.status == 201) {
                props.setSittingsList([...props.options, response.data.room]),
                props.setSelectedSitting({
                  name: response.data.room.name,
                  pk: response.data.room.id,
                  status: newValue.status
                })
              }
            });
            props.setRoomQuestions([])
            props.setAllowedUsers([])

        } else {
          props.setSelectedSitting({
            name: newValue.name,
            pk: newValue.pk,
            status: newValue.status
          })
          props.setRoomQuestions(newValue.questions)
          props.setAllowedUsers(newValue.allowed_users)
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            name: `Utwórz "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      handleHomeEndKeys
      id="free-solo-with-text-demo"
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
        return option.name;
      }}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label={props.label} />
      )}
    />
  );
}