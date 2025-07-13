import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { MonthAndDOMData } from '../types/types';
import { formatInteger, formatNumber } from '../utilities/formatUtilities';
import { formatDateHelper } from '../components/formatters/formatDateHelper';
import RideListComponent from './RideListComponent';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const MonthAndDOMComponent = () => {
  const [data, setData] = useState<MonthAndDOMData[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ month: number; column: string, dom: number } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof MonthAndDOMData | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/ocds/monthanddom`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof MonthAndDOMData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (dom: number, column: string, month: number) => {
    if( month >= 1 && month <= 12){
      setDialogInfo( { month: month, column: column, dom: dom } );
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const format = ( col:  { key: keyof MonthAndDOMData; label: string }, theDatum: number) =>{
    switch(col.key){
      case 'distancejan':
      case 'distancefeb':
      case 'distancemar':
      case 'distanceapr':
      case 'distancemay':
      case 'distancejun':
      case 'distancejul':
      case 'distanceaug':
      case 'distancesep':
      case 'distanceoct':
      case 'distancenov':
      case 'distancedec':
      case 'distance':{
        return formatNumber(theDatum);
      }
      case 'dom':
      case 'elevationgainjan':
      case 'elevationgainfeb':
      case 'elevationgainmar':
      case 'elevationgainapr':
      case 'elevationgainmay':
      case 'elevationgainjun':
      case 'elevationgainjul':
      case 'elevationgainaug':
      case 'elevationgainsep':
      case 'elevationgainoct':
      case 'elevationgainnov':
      case 'elevationgaindec':
      case 'elevationgain':
      case 'elapsedtimejan':
      case 'elapsedtimefeb':
      case 'elapsedtimemar':
      case 'elapsedtimeapr':
      case 'elapsedtimemay':
      case 'elapsedtimejun':
      case 'elapsedtimejul':
      case 'elapsedtimeaug':
      case 'elapsedtimesep':
      case 'elapsedtimeoct':
      case 'elapsedtimenov':
      case 'elapsedtimedec':
      case 'elapsedtime':
      case 'hraveragejan':
      case 'hraveragefeb':
      case 'hraveragemar':
      case 'hraverageapr':
      case 'hraveragemay':
      case 'hraveragejun':
      case 'hraveragejul':
      case 'hraverageaug':
      case 'hraveragesep':
      case 'hraverageoct':
      case 'hraveragenov':
      case 'hraveragedec':
      case 'hraverage':
      case 'poweraveragejan':
      case 'poweraveragefeb':
      case 'poweraveragemar':
      case 'poweraverageapr':
      case 'poweraveragemay':
      case 'poweraveragejun':
      case 'poweraveragejul':
      case 'poweraverageaug':
      case 'poweraveragesep':
      case 'poweraverageoct':
      case 'poweraveragenov':
      case 'poweraveragedec':
      case 'poweraverage': {
        return formatInteger(theDatum);
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

  const renderTable = (columns: { key: keyof MonthAndDOMData; label: string, month: number }[]) => {

    const today = new Date();
    const monthAbbreviation = today.toLocaleString('en-US', { month: 'short' });
    const currentDay = today.getDate();

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
                key={row.dom}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      sx={{ paddingRight: '1em',  backgroundColor: (row.dom === currentDay && col.label === monthAbbreviation) ? '#e3f1c4' : 'inherit', }}
                      onClick={() => handleRowClick(row.dom, col.key, col.month)}
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
              { key: 'dom', label: "Day", month: 0 },
              { key: 'distancejan', label: "Jan", month: 1 },
              { key: 'distancefeb', label: "Feb", month: 2 },
              { key: 'distancemar', label: "Mar", month: 3 },
              { key: 'distanceapr', label: "Apr", month: 4 },
              { key: 'distancemay', label: "May", month: 5 },
              { key: 'distancejun', label: "Jun", month: 6 },
              { key: 'distancejul', label: "Jul", month: 7 },
              { key: 'distanceaug', label: "Aug", month: 8 },
              { key: 'distancesep', label: "Sep", month: 9 },
              { key: 'distanceoct', label: "Oct", month: 10 },
              { key: 'distancenov', label: "Nov", month: 11 },
              { key: 'distancedec', label: "Dec", month: 12 },
              { key: 'distance', label: "Total", month: 13 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'dom', label: "Day", month: 0 },
              { key: 'elevationgainjan', label: "Jan", month: 1 },
              { key: 'elevationgainfeb', label: "Feb", month: 2 },
              { key: 'elevationgainmar', label: "Mar", month: 3 },
              { key: 'elevationgainapr', label: "Apr", month: 4 },
              { key: 'elevationgainmay', label: "May", month: 5 },
              { key: 'elevationgainjun', label: "Jun", month: 6 },
              { key: 'elevationgainjul', label: "Jul", month: 7 },
              { key: 'elevationgainaug', label: "Aug", month: 8 },
              { key: 'elevationgainsep', label: "Sep", month: 9 },
              { key: 'elevationgainoct', label: "Oct", month: 10 },
              { key: 'elevationgainnov', label: "Nov", month: 11 },
              { key: 'elevationgaindec', label: "Dec", month: 12 },
              { key: 'elevationgain', label: "Total", month: 13 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            {renderTable([
              { key: 'dom', label: "Day", month: 0 },
              { key: 'elapsedtimejan', label: "Jan", month: 1 },
              { key: 'elapsedtimefeb', label: "Feb", month: 2 },
              { key: 'elapsedtimemar', label: "Mar", month: 3 },
              { key: 'elapsedtimeapr', label: "Apr", month: 4 },
              { key: 'elapsedtimemay', label: "May", month: 5 },
              { key: 'elapsedtimejun', label: "Jun", month: 6 },
              { key: 'elapsedtimejul', label: "Jul", month: 7 },
              { key: 'elapsedtimeaug', label: "Aug", month: 8 },
              { key: 'elapsedtimesep', label: "Sep", month: 9 },
              { key: 'elapsedtimeoct', label: "Oct", month: 10 },
              { key: 'elapsedtimenov', label: "Nov", month: 11 },
              { key: 'elapsedtimedec', label: "Dec", month: 12 },
              { key: 'elapsedtime', label: "Total", month: 13 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={3}>
            {renderTable([
              { key: 'dom', label: "Day", month: 0 },
              { key: 'hraveragejan', label: "Jan", month: 1 },
              { key: 'hraveragefeb', label: "Feb", month: 2 },
              { key: 'hraveragemar', label: "Mar", month: 3 },
              { key: 'hraverageapr', label: "Apr", month: 4 },
              { key: 'hraveragemay', label: "May", month: 5 },
              { key: 'hraveragejun', label: "Jun", month: 6 },
              { key: 'hraveragejul', label: "Jul", month: 7 },
              { key: 'hraverageaug', label: "Aug", month: 8 },
              { key: 'hraveragesep', label: "Sep", month: 9 },
              { key: 'hraverageoct', label: "Oct", month: 10 },
              { key: 'hraveragenov', label: "Nov", month: 11 },
              { key: 'hraveragedec', label: "Dec", month: 12 },
              { key: 'hraverage', label: "Total", month: 13 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={4}>
            {renderTable([
              { key: 'dom', label: "Day", month: 0 },
              { key: 'poweraveragejan', label: "Jan", month: 1 },
              { key: 'poweraveragefeb', label: "Feb", month: 2 },
              { key: 'poweraveragemar', label: "Mar", month: 3 },
              { key: 'poweraverageapr', label: "Apr", month: 4 },
              { key: 'poweraveragemay', label: "May", month: 5 },
              { key: 'poweraveragejun', label: "Jun", month: 6 },
              { key: 'poweraveragejul', label: "Jul", month: 7 },
              { key: 'poweraverageaug', label: "Aug", month: 8 },
              { key: 'poweraveragesep', label: "Sep", month: 9 },
              { key: 'poweraverageoct', label: "Oct", month: 10 },
              { key: 'poweraveragenov', label: "Nov", month: 11 },
              { key: 'poweraveragedec', label: "Dec", month: 12 },
              { key: 'poweraverage', label: "Total", month: 13 },
            ])}
          </TabPanel>

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Rides for {formatDateHelper( { dom: dialogInfo?.dom, month: dialogInfo?.month } )} </DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent dom={dialogInfo?.dom} month={dialogInfo?.month} /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default MonthAndDOMComponent;
