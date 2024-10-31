import React, { useState } from 'react';
import { Checkbox, FormGroup, FormControlLabel, Button, Box } from '@mui/material';

const DaysOfWeekFilter: React.FC = () => {
  // State to show/hide checkboxes
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // State for tracking selected days
  const [daysSelected, setDaysSelected] = useState({
    sunday: true,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
  });

  // Toggle function to show or hide the checkboxes
  const toggleShowFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Handle change event for checkboxes
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysSelected({
      ...daysSelected,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box display="flex" alignItems="center">
      <Button variant="text" color="primary" onClick={toggleShowFilters}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      {showFilters && (
        <FormGroup row style={{ marginLeft: '16px' }}> {/* Horizontal layout for checkboxes */}
          <FormControlLabel
            control={
              <Checkbox
                checked={daysSelected.sunday}
                onChange={handleCheckboxChange}
                name="sunday"
              />
            }
            label="Sunday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={daysSelected.monday}
                onChange={handleCheckboxChange}
                name="monday"
              />
            }
            label="Monday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={daysSelected.tuesday}
                onChange={handleCheckboxChange}
                name="tuesday"
              />
            }
            label="Tuesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={daysSelected.wednesday}
                onChange={handleCheckboxChange}
                name="wednesday"
              />
            }
            label="Wednesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={daysSelected.thursday}
                onChange={handleCheckboxChange}
                name="thursday"
              />
            }
            label="Thursday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={daysSelected.friday}
                onChange={handleCheckboxChange}
                name="friday"
              />
            }
            label="Friday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={daysSelected.saturday}
                onChange={handleCheckboxChange}
                name="saturday"
              />
            }
            label="Saturday"
          />
        </FormGroup>
      )}
    </Box>
  );};

export default DaysOfWeekFilter;
