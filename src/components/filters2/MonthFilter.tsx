import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, Box, Typography } from '@mui/material';
import { FilterComponentProps } from './FilterComponentProps';

const months = [
  { number: 1, abbreviation: 'Jan' },
  { number: 2, abbreviation: 'Feb' },
  { number: 3, abbreviation: 'Mar' },
  { number: 4, abbreviation: 'Apr' },
  { number: 5, abbreviation: 'May' },
  { number: 6, abbreviation: 'Jun' },
  { number: 7, abbreviation: 'Jul' },
  { number: 8, abbreviation: 'Aug' },
  { number: 9, abbreviation: 'Sep' },
  { number: 10, abbreviation: 'Oct' },
  { number: 11, abbreviation: 'Nov' },
  { number: 12, abbreviation: 'Dec' },
];

const MonthFilter: React.FC<FilterComponentProps<number[]>> = ({ value, onChange }) => {
  const handleToggle = (month: number) => {
    const updated = value.includes(month)
      ? value.filter((d) => d !== month)
      : [...value, month];
    onChange(updated);
  };

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {/* Title */}
      <Typography variant="subtitle1" style={{ marginRight: '16px' }}>
        Month
      </Typography>

      {/* Month Checkboxes */}
      <FormGroup row style={{ flexWrap: 'wrap' }}>
        {months.map(({ number, abbreviation }) => (
          <FormControlLabel
            key={number}
            control={
              <Checkbox
                checked={value.includes(number)}
                onChange={() => handleToggle(number)}
              />
            }
            label={abbreviation}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default MonthFilter;
