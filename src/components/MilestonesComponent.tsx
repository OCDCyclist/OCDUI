import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { Milestone_10K } from '../types/types';
import { formatDate, formatInteger } from '../utilities/formatUtilities';
import RideListComponent from './RideListComponent';

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const MilestonesComponent = () => {
  const [data1, setData1] = useState<Milestone_10K[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ ride_date: string;} | null>(null);
  const [sortConfig1, setSortConfig1] = useState<{ key: keyof Milestone_10K | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/ocds/milestones/TenK', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => setData1(response.data))
      .catch((error) => console.error('Error fetching 10K milestones data:', error));
  }, []);

  const handleSort1 = (columnKey: keyof Milestone_10K) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig1.key === columnKey && sortConfig1.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig1({ key: columnKey, direction });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (ride_date: string) => {
    setDialogInfo( { ride_date} );
    setDialogOpen(true);
};

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const format = ( col:  { key: keyof Milestone_10K; label: string }, theDatum: number | string  ) =>{
    switch(col.key){
      case 'distance_miles':{
        return typeof theDatum === 'number' ? formatInteger(theDatum) : theDatum;
      }

      case 'ride_date':{
        return typeof theDatum === 'string' ? formatDate(theDatum) : theDatum;
      }

      default: return theDatum;
    }
  }

  const sortedData_1_day = React.useMemo(() => {
    if (!sortConfig1.key) return data1;
    const sorted = [...data1].sort((a, b) => {
      if (a[sortConfig1.key!] < b[sortConfig1.key!]) return sortConfig1.direction === 'asc' ? -1 : 1;
      if (a[sortConfig1.key!] > b[sortConfig1.key!]) return sortConfig1.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data1, sortConfig1]);

  const renderTable_1_day = (columns: { key: keyof Milestone_10K; label: string }[]) => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="right"
                  onClick={() => handleSort1(col.key)}
                  sx={{ cursor: 'pointer' }}
                >
                  {col.label}
                  {sortConfig1.key === col.key ? (sortConfig1.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData_1_day.map((row, index) => (
              <TableRow
                key={`${row.ride_date}-${row.distance_miles}`}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      onClick={() => handleRowClick(row.ride_date)}
                    >
                      {format(col, row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container
      maxWidth='xl'
      sx={{
        marginY: 2, // Adds some vertical margin
        maxWidth: '1800px', // Increase max width
        width: '100%', // Set width to 100% for full-page width
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#fbeacd',
          padding: 2, // Increase padding
          margin: 'auto', // Center the component
          width: '100%', // Occupy the full width of the container
        }}
      >
        <Box>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="10,000 Miles" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable_1_day([
              { key: 'ride_date', label: "Ride Date"},
              { key: 'distance_miles', label: "Distance (miles)"}
            ])}
          </TabPanel>

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Milestone ride(s) on {dialogInfo ? formatDate(dialogInfo.ride_date) : ""}</DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent date={dialogInfo?.ride_date.split('T')[0]}  /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default MilestonesComponent;
