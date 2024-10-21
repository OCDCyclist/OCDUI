import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { MonthAndDOMData } from '../graphql/graphql';
import { formatInteger, formatNumber } from '../utilities/formatUtilities';

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
  const [dialogInfo, setDialogInfo] = useState<{ date: number; column: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof MonthAndDOMData | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/ocds/monthanddom', {
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

  const handleRowClick = (value: number, column: string) => {
    setDialogInfo( { date: value, column: column } );
    setDialogOpen(true);
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

  const renderTable = (columns: { key: keyof MonthAndDOMData; label: string }[]) => {
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
                      sx={{ paddingRight: '1em' }}
                      onClick={() => handleRowClick(row.dom, col.key)}
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
      sx={{
        marginY: 2, // Adds some vertical margin
        maxWidth: '1200px', // Increase max width
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
              { key: 'dom', label: 'Day' },
              { key: 'distancejan', label: "Jan" },
              { key: 'distancefeb', label: "Feb" },
              { key: 'distancemar', label: "Mar" },
              { key: 'distanceapr', label: "Apr" },
              { key: 'distancemay', label: "May" },
              { key: 'distancejun', label: "Jun" },
              { key: 'distancejul', label: "Jul" },
              { key: 'distanceaug', label: "Aug" },
              { key: 'distancesep', label: "Sep" },
              { key: 'distanceoct', label: "Oct" },
              { key: 'distancenov', label: "Nov" },
              { key: 'distancedec', label: "Dec" },
              { key: 'distance', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'dom', label: 'Day' },
              { key: 'elevationgainjan', label: "Jan" },
              { key: 'elevationgainfeb', label: "Feb" },
              { key: 'elevationgainmar', label: "Mar" },
              { key: 'elevationgainapr', label: "Apr" },
              { key: 'elevationgainmay', label: "May" },
              { key: 'elevationgainjun', label: "Jun" },
              { key: 'elevationgainjul', label: "Jul" },
              { key: 'elevationgainaug', label: "Aug" },
              { key: 'elevationgainsep', label: "Sep" },
              { key: 'elevationgainoct', label: "Oct" },
              { key: 'elevationgainnov', label: "Nov" },
              { key: 'elevationgaindec', label: "Dec" },
              { key: 'elevationgain', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            {renderTable([
              { key: 'dom', label: 'Day' },
              { key: 'elapsedtimejan', label: "Jan" },
              { key: 'elapsedtimefeb', label: "Feb" },
              { key: 'elapsedtimemar', label: "Mar" },
              { key: 'elapsedtimeapr', label: "Apr" },
              { key: 'elapsedtimemay', label: "May" },
              { key: 'elapsedtimejun', label: "Jun" },
              { key: 'elapsedtimejul', label: "Jul" },
              { key: 'elapsedtimeaug', label: "Aug" },
              { key: 'elapsedtimesep', label: "Sep" },
              { key: 'elapsedtimeoct', label: "Oct" },
              { key: 'elapsedtimenov', label: "Nov" },
              { key: 'elapsedtimedec', label: "Dec" },
              { key: 'elapsedtime', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={3}>
            {renderTable([
              { key: 'dom', label: 'Day' },
              { key: 'hraveragejan', label: "Jan" },
              { key: 'hraveragefeb', label: "Feb" },
              { key: 'hraveragemar', label: "Mar" },
              { key: 'hraverageapr', label: "Apr" },
              { key: 'hraveragemay', label: "May" },
              { key: 'hraveragejun', label: "Jun" },
              { key: 'hraveragejul', label: "Jul" },
              { key: 'hraverageaug', label: "Aug" },
              { key: 'hraveragesep', label: "Sep" },
              { key: 'hraverageoct', label: "Oct" },
              { key: 'hraveragenov', label: "Nov" },
              { key: 'hraveragedec', label: "Dec" },
              { key: 'hraverage', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={4}>
            {renderTable([
              { key: 'dom', label: 'Day' },
              { key: 'poweraveragejan', label: "Jan" },
              { key: 'poweraveragefeb', label: "Feb" },
              { key: 'poweraveragemar', label: "Mar" },
              { key: 'poweraverageapr', label: "Apr" },
              { key: 'poweraveragemay', label: "May" },
              { key: 'poweraveragejun', label: "Jun" },
              { key: 'poweraveragejul', label: "Jul" },
              { key: 'poweraverageaug', label: "Aug" },
              { key: 'poweraveragesep', label: "Sep" },
              { key: 'poweraverageoct', label: "Oct" },
              { key: 'poweraveragenov', label: "Nov" },
              { key: 'poweraveragedec', label: "Dec" },
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

export default MonthAndDOMComponent;
