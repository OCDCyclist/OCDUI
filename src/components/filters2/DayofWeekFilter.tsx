import React from 'react';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { FilterComponentProps } from './FilterComponentProps';

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

const DayOfWeekFilter: React.FC<FilterComponentProps<number[]>> = ({ value, onChange }) => {
  const handleToggle = (dayIndex: number) => {
    const updated = value.includes(dayIndex)
      ? value.filter((d) => d !== dayIndex)
      : [...value, dayIndex];
    onChange(updated);
  };

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {/* Title */}
      <Typography variant="subtitle1" style={{ marginRight: '20px' }}>
        DOW
      </Typography>

      {/* Weekday Checkboxes */}
      <FormGroup row style={{ flexWrap: 'wrap' }}>
        {days.map((day, index) => (
          <FormControlLabel
            key={day}
            control={
              <Checkbox
                checked={value.includes(index)}
                onChange={() => handleToggle(index)}
              />
            }
            label={day}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default DayOfWeekFilter;
