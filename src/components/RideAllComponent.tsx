import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, Button } from '@mui/material';
import axios from 'axios';
import RideDetail from './RideDetail';
import { formatRideData } from './formatters/formatRideData';
import { RideData } from '../types/types';
import RideFilter from './filters/RideFilter';

const RideAllComponent = () => {
  const [data, setData] = useState<RideData[]>([]);
  const [rideDetailDialogOpen, setRideDetailDialogOpen] = useState(false);
  const [rideFilterDialogOpen, setRideFilterDialogOpen] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [rideData, setRideData] = useState<RideData | null >(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RideData | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 250);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight - 250;
      setTableHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.post(
      'http://localhost:3000/ride/rides/history',
      {
        years, // Include the years array in the request body
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    )
    .then((response) => setData(response.data))
    .catch((error) => console.error('Error fetching data:', error));
  }, [years]); // Ensure useEffect re-runs if years changes

  const handleSort = (columnKey: keyof RideData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleRowClick = (rideData: RideData) => {
    setRideData(rideData);
    setRideDetailDialogOpen(true);
  };

  const handleCloseRideDetailDialog = () => {
    setRideDetailDialogOpen(false);
    setRideData(null);
  };

  const handleCloseRideFilterDialog = () => {
    setRideFilterDialogOpen(false);
  };

  const toggleSelectFilters = () =>{
    setRideFilterDialogOpen(true);
  }

  const renderTableAllRides = (columns: { key: keyof RideData; label: string; justify: string, width: string }[]) => {
    return (
      <>
        <Button variant="text" onClick={toggleSelectFilters}>
          Select Filters
        </Button>

        <TableContainer sx={{ maxHeight: tableHeight }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.justify}
                    onClick={() => handleSort(col.key)}
                    sx={{ cursor: 'pointer', width: col.width }}
                  >
                    {col.label}
                    {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.date}
                  sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.justify}
                      sx={{ paddingRight: '1em' }}
                      onClick={() => handleRowClick(row)}
                    >
                      {formatRideData(col, row[col.key] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

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
          Years selected {years.join(", ")}
        </Box>
        <Box>
          {renderTableAllRides([
            { key: 'date', label: 'Ride Date', justify: 'center', width: '80' },
            { key: 'distance', label: 'Distance', justify: 'center', width: '80' },
            { key: 'elapsedtime', label: 'Elapsed time', justify: 'center', width: '80' },
            { key: 'speedavg', label: 'Avg Speed', justify: 'center', width: '80' },
            { key: 'elevationgain', label: 'Elevation', justify: 'center', width: '80' },
            { key: 'hravg', label: 'Avg HR', justify: 'center', width: '80' },
            { key: 'poweravg', label: 'Avg Power', justify: 'center', width: '80' },
            { key: 'title', label: 'Title', justify: 'left', width: '100' },
          ])}

          <Dialog
            open={rideDetailDialogOpen}
            onClose={handleCloseRideDetailDialog}
            fullWidth
            maxWidth="md" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogContent
              sx={{
                padding: 4,
                width: '100%',
              }}
            >
              { rideData ? <RideDetail rideData={rideData} onClose={() => setRideDetailDialogOpen(false)} /> : undefined }
            </DialogContent>
          </Dialog>

          <Dialog
            open={rideFilterDialogOpen}
            onClose={handleCloseRideFilterDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogContent
              sx={{
                padding: 4,
                width: '100%',
              }}
            >
              <RideFilter onClose={(years) =>{
                  if(years){
                    setYears(years);
                  }
                  setRideFilterDialogOpen(false);
                }}
                defaultSelectedYears={years}
               />
            </DialogContent>
          </Dialog>

        </Box>
      </Paper>
    </Container>
  );
};

export default RideAllComponent;
