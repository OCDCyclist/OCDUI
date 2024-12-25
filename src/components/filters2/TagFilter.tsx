import React from 'react';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import { FilterComponentProps } from './FilterComponentProps';


const TagFilter: React.FC<FilterComponentProps<string[]> > = ({ value, optional, onChange }) => {

  const handleTagSelect = (_event: unknown, newValue: string[]) => {
    onChange(newValue); // Notify parent component of selected tags
  };

  return (
    <Autocomplete
      multiple
      options={optional ?? []}
      value={value}
      onChange={handleTagSelect}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            key={option}
          />
        ))
      }
      renderInput={(params) => (
        <Box sx={{ minWidth: 500 }}> {/* Set minimum width for the TextField */}
          <TextField
            {...params}
            label="Filter by Tags"
            placeholder="Select one or more tags from the list"
            fullWidth
          />
        </Box>
      )}
    />
  );
};

export default TagFilter;
