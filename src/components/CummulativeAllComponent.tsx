import React, { useState } from 'react';
import { Box, Paper, Dialog, DialogContent, Container, Button } from '@mui/material';
import RideListComponent from './RideListComponent';
import RideYearFilter from './filters/RideYearFilter';
import CummulativeDataComponent from './CummulativeDataComponent';

const CummulativeAllComponent = () => {
  const [rideFilterDialogOpen, setRideFilterDialogOpen] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const handleCloseRideFilterDialog = () => {
    setRideFilterDialogOpen(false);
  };

  const toggleSelectFilters = () =>{
    setRideFilterDialogOpen(true);
  }

  const handleYearSelection = ( yearsSet: number[] | undefined) =>{
    if(Array.isArray(yearsSet)){
      setYears(yearsSet)
    }
    setRideFilterDialogOpen(false);
  }

  return (
    <Container maxWidth='xl' sx={{ marginY: 0 }}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#fbeacd',
          padding: 2, // Increase padding
          marginBottom: '1em',
          margin: 'auto', // Center the component
          width: '100%', // Occupy the full width of the container
        }}
      >
        <Box>
          Years selected: {years.length === 0 ? "none" : years.sort().join(", ")}

          <Button variant="text" onClick={toggleSelectFilters}>
            Select Years
          </Button>
        </Box>

        <CummulativeDataComponent years={years} />

        <Box>
          <Dialog
            open={rideFilterDialogOpen}
            onClose={handleCloseRideFilterDialog}
            fullWidth
            maxWidth="lg"
          >
            <DialogContent
              sx={{
                padding: 4,
                width: '100%',
              }}
            >
              <RideYearFilter onClose={handleYearSelection} defaultSelectedYears={years} />
            </DialogContent>
          </Dialog>

        </Box>
      </Paper>
    </Container>
  );
};

export default CummulativeAllComponent;
