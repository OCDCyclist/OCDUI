import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import RideListComponent from './RideListComponent';
import { CumulativeData } from '../types/types';


const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const CumulativeDataComponent = () => {
  const [data, setData] = useState<CumulativeData[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ date: string; column: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CumulativeData | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/ocds/cummulatives', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof CumulativeData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (date: string, column: string) => {
    setDialogInfo({ date, column });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);

    const datePart = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);

    const weekdayPart = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
    }).format(date);

    return `${datePart} ${weekdayPart}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: true,
    }).format(Number(num));
  };

  const formatInteger = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(Number(num));
  };

  const format = ( col:  { key: keyof CumulativeData; label: string }, theDatum: number) =>{
    switch(col.key){
      case 'moving_total_elevationgain1':
      case 'moving_total_elevationgain7':
      case 'moving_total_elevationgain30':
      case 'moving_total_elevationgain365':
      case 'moving_total_elevationgainalltime':
      case 'moving_total_elapsedtime30':
      case 'moving_total_elapsedtime365':
      case 'moving_total_elapsedtimealltime':
      case 'moving_hr_average1':
      case 'moving_hr_average7':
      case 'moving_hr_average30':
      case 'moving_hr_average365':
      case 'moving_hr_averagealltime':
      case 'moving_power_average1':
      case 'moving_power_average7':
      case 'moving_power_average30':
      case 'moving_power_average365':
      case 'moving_power_averagealltime':
      case 'runconsecutivedays':
      case 'run7days200':{
        return formatInteger(theDatum);
      }

      case 'ride_date': return formatDate(theDatum);
      case 'moving_total_elapsedtime1':
      case 'moving_total_elapsedtime7':
      default: return formatNumber(theDatum);
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const renderTable = (columns: { key: keyof CumulativeData; label: string }[]) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="right"
                  onClick={() => handleSort(col.key)}
                  sx={{ cursor: 'pointer' }}
                >
                  {col.label}
                  {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow
                key={row.ride_date}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      sx={{ paddingRight: '1em',  backgroundColor: (row.ride_date.split('T')[0]) === formattedDate ? '#e3f1c4' : 'inherit', }}
                      onClick={() => handleRowClick(row.ride_date, col.key)}
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
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Distance" />
            <Tab label="Elevation" />
            <Tab label="Elapsed Time" />
            <Tab label="HR" />
            <Tab label="Runs" />
            <Tab label="Power" />
            <Tab label="Fitness" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable([
              { key: 'ride_date', label: 'Ride Date' },
              { key: 'moving_total_distance1', label: "Distance" },
              { key: 'moving_total_distance7', label: 'Distance Last 7 Days' },
              { key: 'moving_total_distance30', label: 'Distance Last 30 Days' },
              { key: 'moving_total_distance365', label: 'Distance Last Year' },
              { key: 'moving_total_distancealltime', label: 'Distance All Time' },
            ])}
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'ride_date', label: 'Ride Date' },
              { key: 'moving_total_elevationgain1', label: "Elevation" },
              { key: 'moving_total_elevationgain7', label: 'Elevation Last 7 Days' },
              { key: 'moving_total_elevationgain30', label: 'Elevation Last 30 Days' },
              { key: 'moving_total_elevationgain365', label: 'Elevation Last Year' },
              { key: 'moving_total_elevationgainalltime', label: 'Elevation All Time' },
            ])}
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            {renderTable([
              { key: 'ride_date', label: 'Ride Date' },
              { key: 'moving_total_elapsedtime1', label: "Elapsed Time" },
              { key: 'moving_total_elapsedtime7', label: 'Elapsed Time Last 7 Days' },
              { key: 'moving_total_elapsedtime30', label: 'Elapsed Time Last 30 Days' },
              { key: 'moving_total_elapsedtime365', label: 'Elapsed Time Last Year' },
              { key: 'moving_total_elapsedtimealltime', label: 'Elapsed Time All Time' },
            ])}
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>
            {renderTable([
              { key: 'ride_date', label: 'Ride Date' },
              { key: 'moving_hr_average1', label: "Avg HR" },
              { key: 'moving_hr_average7', label: 'Avg HR Last 7 Days' },
              { key: 'moving_hr_average30', label: 'Avg HR Last 30 Days' },
              { key: 'moving_hr_average365', label: 'Avg HR Last Year' },
              { key: 'moving_hr_averagealltime', label: 'Avg HR All Time' },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={4}>
            {renderTable([
              { key: 'ride_date', label: 'Ride Date' },
              { key: 'moving_total_distance1', label: "Distance" },
              { key: 'moving_total_distance7', label: 'Distance Last 7 Days' },
              { key: 'runconsecutivedays', label: "Days Ridden" },
              { key: 'run7days200', label: '7 Day 200' },
            ])}
          </TabPanel>
          <TabPanel value={tabIndex} index={5}>
            {renderTable([
              { key: 'ride_date', label: 'Ride Date' },
              { key: 'moving_power_average1', label: "Avg Power" },
              { key: 'moving_power_average7', label: 'Avg Power Last 7 Days' },
              { key: 'moving_power_average30', label: 'Avg Power Last 30 Days' },
              { key: 'moving_power_average365', label: 'Avg Power Last Year' },
              { key: 'moving_power_averagealltime', label: 'Avg Power All Time' },
            ])}
          </TabPanel>
          <TabPanel value={tabIndex} index={6}>
            {renderTable([
              { key: 'ride_date', label: 'Ride Date' },
              { key: 'total_tss', label: 'TSS' },
              { key: 'tss30', label: 'TSS30' },
              { key: 'fitness', label: 'Fitness' },
              { key: 'fatigue', label: 'Fatigue' },
              { key: 'form', label: 'Form' },
            ])}
          </TabPanel>

          {/* Modal Dialog for clicking on a row */}
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="lg" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Rides for {dialogInfo?.date.split('T')[0] || 'Unknown date'}</DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent date={dialogInfo?.date.split('T')[0]} /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default CumulativeDataComponent;