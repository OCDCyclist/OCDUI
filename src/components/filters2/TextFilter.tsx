import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { FilterComponentProps } from './FilterComponentProps';
import ClearIcon from '@mui/icons-material/Clear';

const TextFilter: React.FC<FilterComponentProps<string>> = ({ value, onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      value={value}
      onChange={handleInputChange}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={handleClear}
              edge="end"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default TextFilter;
