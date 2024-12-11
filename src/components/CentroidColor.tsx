import React, { useState } from 'react';
import { InputAdornment, TextField, Typography } from '@mui/material';
import { CentroidDefinition } from '../types/types';

interface CentroidColorProps {
  centroidDefinition: CentroidDefinition;
  onUpdate: (centroidDefinition: CentroidDefinition) => void;
}

const CentroidColor: React.FC<CentroidColorProps> = ({ centroidDefinition, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [color, setColor] = useState(centroidDefinition.color);

  const handleColorClick = () => {
    setIsEditing(true);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onUpdate({
        ...centroidDefinition,
        color
      });
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setColor(centroidDefinition.color);
    setIsEditing(false);
  };

  return isEditing ? (
    <TextField
      value={color}
      onChange={handleColorChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      size="small"
      autoFocus
      InputProps={{
        endAdornment: <InputAdornment position="end">color</InputAdornment>,
      }}
    />
  ) : (
    <Typography
      variant="body1"
      onClick={handleColorClick}
      style={{ cursor: 'pointer' }}
    >
      {centroidDefinition.color}
    </Typography>
  );
};

export default CentroidColor;
