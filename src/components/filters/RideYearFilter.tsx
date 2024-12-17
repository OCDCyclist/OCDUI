import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Button,
  Box,
} from '@mui/material';
import YearPicker from './YearPicker';

interface RideFilterProps {
  onClose: (years?: number[]) => void;
  defaultSelectedYears: number[]; // New prop to set default selected years
}

const RideYearFilter = ({ onClose, defaultSelectedYears }: RideFilterProps) => {
  const [selectedYears, setSelectedYears] = useState<number[]>(defaultSelectedYears);

  useEffect(() => {
    setSelectedYears(defaultSelectedYears); // Update selected years if defaultSelectedYears changes
  }, [defaultSelectedYears]);

  const handleYearChange = (years: number[]) => {
    setSelectedYears(years);
  };

  const handleApply = () => {
    onClose(selectedYears);
    setSelectedYears([]);
  };

  const handleCancel = () => {
    onClose();
    setSelectedYears([]);
  };

  return (
    <Container maxWidth="lg" sx={{ marginY: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', margin: '0 auto' }}>
        <Box display="flex" flexDirection='row' justifyContent='center'>
          <YearPicker startYear={1990} initialSelectedYears={selectedYears} onChange={handleYearChange} />
        </Box>

        <Box display="flex" flexDirection='row' justifyContent='center'>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            sx={{ marginTop: 4, marginLeft: 'auto', marginRight: 2 }}
          >
            Apply Years Filter
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={handleCancel}
            sx={{ marginTop: 4, marginLeft: 2, marginRight: 'auto' }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RideYearFilter;
