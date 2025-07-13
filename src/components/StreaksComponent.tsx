import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { Streak_1_Day, Streak_7_Day } from '../types/types';
import { formatDate, formatInteger } from '../utilities/formatUtilities';
import RideListComponent from './RideListComponent';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const StreaksComponent = () => {
  const [data1, setData1] = useState<Streak_1_Day[]>([]);
  const [data7, setData7] = useState<Streak_7_Day[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ start_date: string; end_date: string } | null>(null);
  const [sortConfig1, setSortConfig1] = useState<{ key: keyof Streak_1_Day | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [sortConfig7, setSortConfig7] = useState<{ key: keyof Streak_1_Day | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/ocds/streaks/1`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => setData1(response.data))
      .catch((error) => console.error('Error fetching consecutive days data:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/ocds/streaks/7days200`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => setData7(response.data))
      .catch((error) => console.error('Error fetching 7 days 200 data:', error));
  }, []);

  const handleSort1 = (columnKey: keyof Streak_1_Day) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig1.key === columnKey && sortConfig1.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig1({ key: columnKey, direction });
  };

  const handleSort7 = (columnKey: keyof Streak_7_Day) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig7.key === columnKey && sortConfig7.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig7({ key: columnKey, direction });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (start_date: string, end_date: string) => {
    setDialogInfo( { start_date, end_date} );
    setDialogOpen(true);
};

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const format = ( col:  { key: keyof Streak_1_Day | keyof Streak_7_Day; label: string }, theDatum: number | string  ) =>{
    switch(col.key){
      case 'streak_length':{
        return typeof theDatum === 'number' ? formatInteger(theDatum) : theDatum;
      }

      case 'start_date':
      case 'end_date':{
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

  const sortedData_7_day = React.useMemo(() => {
    if (!sortConfig1.key) return data7;
    const sorted = [...data7].sort((a, b) => {
      if (a[sortConfig7.key!] < b[sortConfig7.key!]) return sortConfig7.direction === 'asc' ? -1 : 1;
      if (a[sortConfig7.key!] > b[sortConfig7.key!]) return sortConfig7.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data7, sortConfig7]);

  const renderTable_1_day = (columns: { key: keyof Streak_1_Day; label: string }[]) => {
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
                key={`${row.start_date}-${row.end_date}-${row.streak_length}`}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      onClick={() => handleRowClick(row.start_date, row.end_date)}
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

  const renderTable_7_day = (columns: { key: keyof Streak_1_Day; label: string }[]) => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="right"
                  onClick={() => handleSort7(col.key)}
                  sx={{ cursor: 'pointer' }}
                >
                  {col.label}
                  {sortConfig7.key === col.key ? (sortConfig7.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData_7_day.map((row, index) => (
              <TableRow
                key={`${row.start_date}-${row.end_date}-${row.streak_length}`}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      onClick={() => handleRowClick(row.start_date, row.end_date)}
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
            <Tab label="Consecutive Days" />
            <Tab label="200 in 7 Days" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable_1_day([
              { key: 'start_date', label: "Start Date"},
              { key: 'end_date', label: "End Date"},
              { key: 'streak_length', label: "Streak Length"}
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable_7_day([
              { key: 'start_date', label: "Start Date"},
              { key: 'end_date', label: "End Date"},
              { key: 'streak_length', label: "Streak Length"}
            ])}
          </TabPanel>

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Streak rides between {dialogInfo ? formatDate(dialogInfo.start_date) : ""} and {dialogInfo ? formatDate(dialogInfo.end_date) : ""} </DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent start_date={dialogInfo?.start_date} end_date={dialogInfo?.end_date} /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default StreaksComponent;
