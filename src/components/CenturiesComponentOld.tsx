import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { Centuries, RideDataWithTags } from '../types/types';
import { formatDate, formatInteger, formatNumber1 } from '../utilities/formatUtilities';
import RideListComponent from './RideListComponent';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const CenturiesComponent = () => {
  const [data1, setData1] = useState<Centuries[]>([]);
  const [dataDetail, setDataDetail] = useState<RideDataWithTags[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ year: number, month: number, day: number;} | null>(null);
  const [sortConfig1, setSortConfig1] = useState<{ key: keyof Centuries | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/ocds/centuries`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setData1(response.data))
      .catch((error) => console.error('Error fetching century data:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/ocds/centuriesdetail`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setDataDetail(response.data))
      .catch((error) => console.error('Error fetchingcentury detail data:', error));
  }, []);

  const handleSort1 = (columnKey: keyof Centuries) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig1.key === columnKey && sortConfig1.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig1({ key: columnKey, direction });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (year: number, month: number, day: number) => {
    setDialogInfo( { year, month, day} );
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const format = ( col:  { key: keyof Centuries; label: string }, theDatum: number | string  ) =>{
    switch(col.key){
      case 'total_distance':{
        return typeof theDatum === 'number' ? formatNumber1(theDatum) : theDatum;
      }
      case 'day':
      case 'month':{
        return typeof theDatum === 'number' ? formatInteger(theDatum) : theDatum;
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

  const renderTable_1_day = (columns: { key: keyof Centuries; label: string }[]) => {
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
                key={`${row.year}-${row.month}-${row.day}`}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      onClick={() => handleRowClick(row.year, row.month, row.day)}
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
            <Tab label="Centuries" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable_1_day([
              { key: 'year', label: "Year"},
              { key: 'month', label: "Month"},
              { key: 'day', label: "Day"},
              { key: 'total_distance', label: "Century Distance (miles)"}
            ])}
          </TabPanel>

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Century ride(s) on {dialogInfo ? formatDate(`${dialogInfo.month}/${dialogInfo.day}/${dialogInfo.year}`) : ""}</DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent year={dialogInfo?.year} month={dialogInfo?.month} dom={dialogInfo?.day} /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default CenturiesComponent;
