import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, Box, Button, Stack, Typography } from '@mui/material';
import { fetchTags } from '../api/tags/fetchTags';

type TagSelectorProps = {
  initialTags: string[];
  locationId:  string | number | null;
  assignmentId: string | number | null;
  onClose: () => void;
  onSave: (locationId : number | string | null, assignmentId : number | string | null, tags: string[]) => void;
};

const TagSelector: React.FC<TagSelectorProps> = ({ initialTags, locationId, assignmentId, onClose, onSave }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return;
    fetchTags(token)
        .then( (result)=>{
            if( result.error){
                setError(result.error);
                setAllTags([]);
            }
            else{
                setError(null);
                const tagStrings = result.tags.map( obj => obj.name);
                setAllTags(tagStrings);
            }
        })
        .catch( (error) =>{
            setError(error.message);
            setAllTags([]);
        });
  }, []);

  const handleTagSelect = (_event: React.SyntheticEvent, newValue: string[]) => {
    const newTags = newValue.filter(tag => !allTags.includes(tag));
    setSelectedTags(newValue);
    if (newTags.length > 0) {
      setAllTags([...allTags, ...newTags]);
    }
  };

  const handleSave = async () => {
    await onSave(locationId, assignmentId, selectedTags );
    onClose();
  };

  const handleCancel = () => {
    setSelectedTags(initialTags); // Reset selected tags
    onClose();
  };

  return (
    <Box>
      <Autocomplete
        multiple
        freeSolo
        options={allTags}
        value={selectedTags}
        onChange={handleTagSelect}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => <TextField 
            {...params}
            label="Choose existing or add a new tag" 
            helperText="Press Enter to add new tag" />}
      />

      {error &&
        <Typography>
            {`Error: ${error}`}
        </Typography>
       }

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!!error}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default TagSelector;
