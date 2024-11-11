import React from 'react';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';

interface TagFilterProps {
  availableTags: string[]; // All tags available for selection
  selectedTags: string[]; // Tags currently selected by the user
  onTagChange: (selectedTags: string[]) => void; // Callback to update selected tags
}

const TagFilter: React.FC<TagFilterProps> = ({ availableTags, selectedTags, onTagChange }) => {

  const handleTagSelect = (_event: unknown, newValue: string[]) => {
    onTagChange(newValue); // Notify parent component of selected tags
  };

  return (
    <Autocomplete
      multiple
      options={availableTags}
      value={selectedTags}
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
