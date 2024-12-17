import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { CentroidDefinition } from '../types/types';

interface ColorSwatchProps {
    centroidDefinition: CentroidDefinition;
    onUpdate: (centroidDefinition: CentroidDefinition) => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ centroidDefinition, onUpdate }) => {
  const [open, setOpen] = useState(false);

  const handleColorChange = (newColor: any) => {
    const color = newColor.hex;
    const updatedCentroid = { ...centroidDefinition, color};
    onUpdate(
        updatedCentroid
    );
    setOpen(false);
  };

  const color = centroidDefinition.color || '#FF0000';
  return (
    <Stack direction="row" alignItems="center">
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          borderRadius: '2px',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      />
      {open && (
        <SketchPicker
          color={color}
          onChange={handleColorChange}
        />
      )}
    </Stack>
  );
};

export default ColorSwatch;