import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { YearAndDOWData } from '../graphql/graphql';

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
  const [dialogInfo, setDialogInfo] = useState<{ date: string; column: string } | null>(null);
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

  const handleRowClick = (date: string, column: string) => {
    setDialogInfo({ date, column });
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

  const format = ( col:  { key: keyof YearAndDOWData; label: string }, theDatum: string) =>{
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

  const renderTable = (columns: { key: keyof YearAndDOWData; label: string }[]) => {
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
                      onClick={() => handleRowClick(row.year, col.key)}
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
              { key: 'year', label: 'Year' },
              { key: 'distancesunday', label: "Sun" },
              { key: 'distancemonday', label: "Mon" },
              { key: 'distancetuesday', label: "Tue" },
              { key: 'distancewednesday', label: "Wed" },
              { key: 'distancethursday', label: "Thu" },
              { key: 'distancefriday', label: "Fri" },
              { key: 'distancesaturday', label: "Sat" },
              { key: 'distance', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'year', label: 'Year' },
              { key: 'elevationgainsunday', label: "Sun" },
              { key: 'elevationgainmonday', label: "Mon" },
              { key: 'elevationgaintuesday', label: "Tue" },
              { key: 'elevationgainwednesday', label: "Wed" },
              { key: 'elevationgainthursday', label: "Thu" },
              { key: 'elevationgainfriday', label: "Fri" },
              { key: 'elevationgainsaturday', label: "Sat" },
              { key: 'elevationgain', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            {renderTable([
              { key: 'year', label: 'Year' },
              { key: 'elapsedtimesunday', label: "Sun" },
              { key: 'elapsedtimemonday', label: "Mon" },
              { key: 'elapsedtimetuesday', label: "Tue" },
              { key: 'elapsedtimewednesday', label: "Wed" },
              { key: 'elapsedtimethursday', label: "Thu" },
              { key: 'elapsedtimefriday', label: "Fri" },
              { key: 'elapsedtimesaturday', label: "Sat" },
              { key: 'elapsedtime', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={3}>
            {renderTable([
              { key: 'year', label: 'Year' },
              { key: 'hraveragesunday', label: "Sun" },
              { key: 'hraveragemonday', label: "Mon" },
              { key: 'hraveragetuesday', label: "Tue" },
              { key: 'hraveragewednesday', label: "Wed" },
              { key: 'hraveragethursday', label: "Thu" },
              { key: 'hraveragefriday', label: "Fri" },
              { key: 'hraveragesaturday', label: "Sat" },
              { key: 'hraverage', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={4}>
            {renderTable([
              { key: 'year', label: 'Year' },
              { key: 'poweraveragesunday', label: "Sun" },
              { key: 'poweraveragemonday', label: "Mon" },
              { key: 'poweraveragetuesday', label: "Tue" },
              { key: 'poweraveragewednesday', label: "Wed" },
              { key: 'poweraveragethursday', label: "Thu" },
              { key: 'poweraveragefriday', label: "Fri" },
              { key: 'poweraveragesaturday', label: "Sat" },
              { key: 'poweraverage', label: "Total" },
            ])}
          </TabPanel>

          {/* Modal Dialog for clicking on a row */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Row Clicked</DialogTitle>
            <DialogContent>
              <Typography>
                {dialogInfo ? `Date: ${dialogInfo.date}, Column: ${dialogInfo.column}` : 'No details available'}
              </Typography>
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default YearAndDOWComponent;
