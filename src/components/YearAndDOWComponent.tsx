import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { YearAndDOWData } from '../types/types';
import RideListComponent from './RideListComponent';
import { formatDateHelper } from '../utilities/formatUtilities';

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const YearAndDOWComponent = () => {
  const [data, setData] = useState<YearAndDOWData[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ year: number; column: string, dow: number } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof YearAndDOWData | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/ocds/yearanddow', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof YearAndDOWData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (year: number, column: string, dow: number) => {
    setDialogInfo({ year, column, dow });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const formatNumber = (num: string | number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: true,
    }).format(Number(num));
  };

  const formatInteger = (num: string | number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(Number(num));
  };

  const format = ( col:  { key: keyof YearAndDOWData; label: string }, theDatum: string | number) =>{
    switch(col.key){
      case 'elevationgainmonday':
      case 'elevationgaintuesday':
      case 'elevationgainwednesday':
      case 'elevationgainthursday':
      case 'elevationgainfriday':
      case 'elevationgainsaturday':
      case 'elevationgainsunday':
      case 'elevationgain':
      case 'elapsedtimemonday':
      case 'elapsedtimetuesday':
      case 'elapsedtimewednesday':
      case 'elapsedtimethursday':
      case 'elapsedtimefriday':
      case 'elapsedtimesaturday':
      case 'elapsedtimesunday':
      case 'elapsedtime':
      case 'hraveragemonday':
      case 'hraveragetuesday':
      case 'hraveragewednesday':
      case 'hraveragethursday':
      case 'hraveragefriday':
      case 'hraveragesaturday':
      case 'hraveragesunday':
      case 'hraverage':
      case 'poweraveragemonday':
      case 'poweraveragetuesday':
      case 'poweraveragewednesday':
      case 'poweraveragethursday':
      case 'poweraveragefriday':
      case 'poweraveragesaturday':
      case 'poweraveragesunday':
      case 'poweraverage':{
        return formatInteger(theDatum);
      }
      case 'distancemonday':
      case 'distancetuesday':
      case 'distancewednesday':
      case 'distancethursday':
      case 'distancefriday':
      case 'distancesaturday':
      case 'distancesunday':
      case 'distance':{
        return formatNumber(theDatum);
      }
      case 'year':{
        return theDatum;
      }

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

  const renderTable = (columns: { key: keyof YearAndDOWData; label: string, dow: number }[]) => {
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
                key={row.year}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      sx={{ paddingRight: '1em' }}
                      onClick={() => handleRowClick(row.year, col.key, col.dow)}
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
            <Tab label="Distance" />
            <Tab label="Elevation" />
            <Tab label="Elapsed Time" />
            <Tab label="Avg HR" />
            <Tab label="Avg Power" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable([
              { key: 'year', label: 'Year', dow: -1  },
              { key: 'distancesunday', label: "Sun", dow: 0 },
              { key: 'distancemonday', label: "Mon", dow: 1 },
              { key: 'distancetuesday', label: "Tue", dow: 2 },
              { key: 'distancewednesday', label: "Wed", dow: 3  },
              { key: 'distancethursday', label: "Thu", dow: 4  },
              { key: 'distancefriday', label: "Fri", dow: 5  },
              { key: 'distancesaturday', label: "Sat", dow: 6 },
              { key: 'distance', label: "Total", dow: 7 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'year', label: 'Year', dow: 0 },
              { key: 'elevationgainsunday', label: "Sun", dow: 0 },
              { key: 'elevationgainmonday', label: "Mon", dow: 1 },
              { key: 'elevationgaintuesday', label: "Tue", dow: 2 },
              { key: 'elevationgainwednesday', label:"Wed", dow: 3 },
              { key: 'elevationgainthursday', label:"Thu", dow: 4 },
              { key: 'elevationgainfriday', label:"Fri", dow: 5 },
              { key: 'elevationgainsaturday', label:"Sat", dow: 6 },
              { key: 'elevationgain', label: "Total", dow: 7 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            {renderTable([
              { key: 'year', label: 'Year', dow: 0 },
              { key: 'elapsedtimesunday', label: "Sun", dow: 0 },
              { key: 'elapsedtimemonday', label: "Mon", dow: 1 },
              { key: 'elapsedtimetuesday', label:"Tue", dow: 2 },
              { key: 'elapsedtimewednesday', label:"Wed", dow: 3 },
              { key: 'elapsedtimethursday', label:"Thu", dow: 4 },
              { key: 'elapsedtimefriday', label:"Fri", dow: 5 },
              { key: 'elapsedtimesaturday', label:"Sat", dow: 6 },
              { key: 'elapsedtime', label: "Total", dow: 7 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={3}>
            {renderTable([
              { key: 'year', label: 'Year', dow: 0 },
              { key: 'hraveragesunday', label: "Sun", dow: 0 },
              { key: 'hraveragemonday', label: "Mon", dow: 1 },
              { key: 'hraveragetuesday', label:"Tue", dow: 2 },
              { key: 'hraveragewednesday', label:"Wed", dow: 3 },
              { key: 'hraveragethursday', label:"Thu", dow: 4 },
              { key: 'hraveragefriday', label:"Fri", dow: 5 },
              { key: 'hraveragesaturday', label:"Sat", dow: 6 },
              { key: 'hraverage', label: "Total", dow: 7 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={4}>
            {renderTable([
              { key: 'year', label: 'Year', dow: 0 },
              { key: 'poweraveragesunday', label: "Sun", dow: 0 },
              { key: 'poweraveragemonday', label: "Mon", dow: 1 },
              { key: 'poweraveragetuesday', label:"Tue", dow: 2 },
              { key: 'poweraveragewednesday', label:"Wed", dow: 3 },
              { key: 'poweraveragethursday', label:"Thu", dow: 4 },
              { key: 'poweraveragefriday', label:"Fri", dow: 5 },
              { key: 'poweraveragesaturday', label:"Sat", dow: 6 },
              { key: 'poweraverage', label: "Total", dow: 7 },
            ])}
          </TabPanel>

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Rides for {formatDateHelper( { year: dialogInfo?.year, dow: dialogInfo?.dow } )} </DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent year={dialogInfo?.year} dow={dialogInfo?.dow} /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default YearAndDOWComponent;
