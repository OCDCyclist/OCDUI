import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip, Box, Button, Stack } from '@mui/material';
import { fetchTags } from '../api/tags/fetchTags';

type TagSelectorProps = {
  initialTags: string[];
  onClose: () => void;
  onSave: () => void;
};

const TagSelector: React.FC<TagSelectorProps> = ({ initialTags, onClose, onSave }) => {
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

  // Async function to create new tags
  const createTags = async (newTags: string[]) => {
    try {
      await fetch('/api/createTags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTags),
      });
    } catch (error) {
      console.error('Error creating tags:', error);
    }
  };

  // Async function to assign tags
  const assignTags = async (tags: string[]) => {
    try {
      await fetch('/api/assignTags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tags),
      });
    } catch (error) {
      console.error('Error assigning tags:', error);
    }
  };

  const handleTagSelect = (event: React.SyntheticEvent, newValue: string[]) => {
    const newTags = newValue.filter(tag => !allTags.includes(tag));
    setSelectedTags(newValue);
    if (newTags.length > 0) {
      setAllTags([...allTags, ...newTags]);
    }
  };

  const handleSave = async () => {
    const newTags = selectedTags.filter(tag => !availableTags.includes(tag));
    if (newTags.length > 0) {
      await createTags(newTags); // Create new tags
    }
    await assignTags(selectedTags); // Assign selected tags
    onSave();
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
        renderInput={(params) => <TextField {...params} label="Select or create tags" />}
      />

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
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
