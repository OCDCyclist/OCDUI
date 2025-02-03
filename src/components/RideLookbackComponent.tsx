import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import RideDetail from './RideDetail';
import { formatDate, formatElapsedTime, formatInteger, formatNumber } from '../utilities/formatUtilities';
import { RideData, RideDataWithTags } from '../types/types';

interface RideDataCategory extends RideData {
  category: string;
}

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const RideLookbackComponent = () => {
  const [data, setData] = useState<RideDataCategory[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rideData, setRideData] = useState<RideDataWithTags | null >(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RideDataCategory | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  const predefinedOrder = [
    "today", "1 year ago", "2 years ago", "5 years ago", "10 years ago", "15 years ago",
    "20 years ago", "25 years ago", "30 years ago", "35 years ago", "40 years ago"
  ];

// Memoize categories and sort them according to predefined order
const categories = useMemo(() => {
  const uniqueCategories = [...Array.from(new Set(data.map((ride) => ride.category))) ];

  const x =  uniqueCategories.sort((a, b) => {
      const indexA = predefinedOrder.indexOf(a);
      const indexB = predefinedOrder.indexOf(b);

      // If a category is in the predefined order, it gets a higher priority (lower index value)
      // If a category isn't in the predefined order, it comes after those that are
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b); // Sort alphabetically for categories not in the predefined list
      }
      if (indexA === -1) return 1; // Put non-predefined categories after predefined ones
      if (indexB === -1) return -1; // Put predefined categories before non-predefined ones
      return indexA - indexB; // Sort based on the order in the predefined list
    });

    return [...x, "All"];
  }, [data]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/ride/lookback', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof RideDataCategory) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (rideData: RideDataCategory) => {
    setRideData(rideData);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setRideData(null);
  };

  const format = (col: { key: keyof RideDataCategory; label: string; justify: string, width: string }, theDatum: number | string) => {
    switch (col.key) {
      case 'rideid':
      case 'cadence':
      case 'hravg':
      case 'hrmax':
      case 'poweravg':
      case 'powermax':
      case 'bikeid':
      case 'stravaid':
      case 'elevationgain':
      case 'powernormalized':
      case 'tss':
      case 'matches':
      case 'trainer':
      case 'elevationloss': {
        return formatInteger(theDatum as number);
      }
      case 'category':
      case 'title': {
        return theDatum as string;
      }
      case 'elapsedtime': {
        return formatElapsedTime(theDatum as number);
      }
      case 'date': return formatDate(theDatum as string);
      case 'distance':
      case 'speedavg':
      case 'speedmax':
      case 'intensityfactor':
      case 'fracdim':
      default: return formatNumber(theDatum as number);
    }
  };

  // Filtered data based on the selected tab
  const filteredData = React.useMemo(() => {
    if (categories[tabIndex] === 'All') return data;
    return data.filter(ride => ride.category === categories[tabIndex]);
  }, [data, categories, tabIndex]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const renderTable = (columns: { key: keyof RideDataCategory; label: string; justify: string, width: string }[]) => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.justify}
                  onClick={() => handleSort(col.key)}
                  sx={{ cursor: 'pointer' }}
                  width={col.width}
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
                key={row.rideid}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.justify}
                    sx={{ paddingRight: '1em' }}
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
          padding: 2,
          marginBottom: '1em',
          margin: 'auto',
          maxWidth: '1800px', // Increase max width
          width: '100%',
        }}
      >
        <Box>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            {categories.map((category, index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>

          {categories.map((category, index) => (
            <TabPanel value={tabIndex} index={index} key={index}>
              {renderTable([
                { key: 'date', label: 'Ride Date', justify: 'center', width: '80' },
                { key: 'distance', label: 'Distance', justify: 'center', width: '80' },
                { key: 'elapsedtime', label: 'Elapsed time', justify: 'center', width: '80' },
                { key: 'speedavg', label: 'Avg Speed', justify: 'center', width: '80' },
                { key: 'elevationgain', label: 'Elevation', justify: 'center', width: '80' },
                { key: 'hravg', label: 'Avg HR', justify: 'center', width: '80' },
                { key: 'title', label: 'Title', justify: 'left', width: '100' },
              ])}
            </TabPanel>
          ))}

          {/* Modal Dialog for clicking on a row */}
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogContent
              sx={{
                padding: 4,
                width: '100%',
              }}
            >
              {rideData &&  <RideDetail rideData={rideData} onClose={() => setDialogOpen(false)} />}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default RideLookbackComponent;
