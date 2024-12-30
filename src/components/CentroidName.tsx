import React, { useState } from 'react';
import { InputAdornment, TextField, Typography } from '@mui/material';
import { CentroidDefinition } from '../types/types';

interface CentroidNameProps {
  centroidDefinition: CentroidDefinition;
  onUpdate: (centroidDefinition: CentroidDefinition) => void;
}

const CentroidName: React.FC<CentroidNameProps> = ({ centroidDefinition, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(centroidDefinition.name);

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onUpdate({
        ...centroidDefinition,
        name
      });
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setName(centroidDefinition.name); // Reset name on cancel
    setIsEditing(false);
  };

  return isEditing ? (
    <TextField
      value={name}
      onChange={handleNameChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      size="small"
      autoFocus
      InputProps={{
        endAdornment: <InputAdornment position="end">text</InputAdornment>,
      }}
    />
  ) : (
    <Typography
      variant="body1"
      onClick={handleNameClick}
      style={{ cursor: 'pointer' }}
      component={"span"}
    >
      {centroidDefinition.name}
    </Typography>
  );
};

export default CentroidName;
