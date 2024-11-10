import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { YearAndMonthData } from '../types/types';
import { formatInteger, formatNumber1 } from '../utilities/formatUtilities';

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const YearAndMonthComponent = () => {
  const [data, setData] = useState<YearAndMonthData[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ year: number; column: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof YearAndMonthData | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/ocds/yearandmonth', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof YearAndMonthData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (year: number, column: string) => {
    setDialogInfo({ year, column });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const format = ( col:  { key: keyof YearAndMonthData; label: string }, theDatum: string | number) =>{
    switch(col.key){
      case 'jan_elevationgain':
      case 'feb_elevationgain':
      case 'mar_elevationgain':
      case 'apr_elevationgain':
      case 'may_elevationgain':
      case 'jun_elevationgain':
      case 'jul_elevationgain':
      case 'aug_elevationgain':
      case 'sep_elevationgain':
      case 'oct_elevationgain':
      case 'nov_elevationgain':
      case 'dec_elevationgain':
      case 'elapsedtime_hours':
      case 'jan_elapsedtime_hours':
      case 'feb_elapsedtime_hours':
      case 'mar_elapsedtime_hours':
      case 'apr_elapsedtime_hours':
      case 'may_elapsedtime_hours':
      case 'jun_elapsedtime_hours':
      case 'jul_elapsedtime_hours':
      case 'aug_elapsedtime_hours':
      case 'sep_elapsedtime_hours':
      case 'oct_elapsedtime_hours':
      case 'nov_elapsedtime_hours':
      case 'dec_elapsedtime_hours':{
        return formatInteger(Number(theDatum));
      }
      case 'jan_distance':
      case 'feb_distance':
      case 'mar_distance':
      case 'apr_distance':
      case 'may_distance':
      case 'jun_distance':
      case 'jul_distance':
      case 'aug_distance':
      case 'sep_distance':
      case 'oct_distance':
      case 'nov_distance':
      case 'dec_distance':
      {
        return formatNumber1(theDatum);
      }
      case 'rideyear':{
        return theDatum;
      }
      default: return formatNumber1(theDatum);
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

  const renderTable = (columns: { key: keyof YearAndMonthData; label: string }[]) => {
    const currentYear = new Date().getFullYear();
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
                key={row.rideyear}
                sx={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : '#ffffff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      sx={{ paddingRight: '1em',  backgroundColor: row.rideyear === currentYear ? '#e3f1c4' : 'inherit', }}
                      onClick={() => handleRowClick(row.rideyear, col.key)}
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
          backgroundColor: '#f9f1d1', //'#fbeacd',
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
            <Tab label="Avg Speed" />
            <Tab label="Avg HR" />
            <Tab label="Max HR" />
            <Tab label="Avg Power" />
            <Tab label="Max Power" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_distance', label: "Jan" },
              { key: 'feb_distance', label: "Feb" },
              { key: 'mar_distance', label: "Mar" },
              { key: 'apr_distance', label: "Apr" },
              { key: 'may_distance', label: "May" },
              { key: 'jun_distance', label: "Jun" },
              { key: 'jul_distance', label: "Jul" },
              { key: 'aug_distance', label: "Aug" },
              { key: 'sep_distance', label: "Sep" },
              { key: 'oct_distance', label: "Oct" },
              { key: 'nov_distance', label: "Nov" },
              { key: 'dec_distance', label: "Dec" },
              { key: 'total_distance_miles', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_elevationgain', label: "Jan" },
              { key: 'feb_elevationgain', label: "Feb" },
              { key: 'mar_elevationgain', label: "Mar" },
              { key: 'apr_elevationgain', label: "Apr" },
              { key: 'may_elevationgain', label: "May" },
              { key: 'jun_elevationgain', label: "Jun" },
              { key: 'jul_elevationgain', label: "Jul" },
              { key: 'aug_elevationgain', label: "Aug" },
              { key: 'sep_elevationgain', label: "Sep" },
              { key: 'oct_elevationgain', label: "Oct" },
              { key: 'nov_elevationgain', label: "Nov" },
              { key: 'dec_elevationgain', label: "Dec" },
              { key: 'total_elevationgain', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_elapsedtime_hours', label: "Jan" },
              { key: 'feb_elapsedtime_hours', label: "Feb" },
              { key: 'mar_elapsedtime_hours', label: "Mar" },
              { key: 'apr_elapsedtime_hours', label: "Apr" },
              { key: 'may_elapsedtime_hours', label: "May" },
              { key: 'jun_elapsedtime_hours', label: "Jun" },
              { key: 'jul_elapsedtime_hours', label: "Jul" },
              { key: 'aug_elapsedtime_hours', label: "Aug" },
              { key: 'sep_elapsedtime_hours', label: "Sep" },
              { key: 'oct_elapsedtime_hours', label: "Oct" },
              { key: 'nov_elapsedtime_hours', label: "Nov" },
              { key: 'dec_elapsedtime_hours', label: "Dec" },
              { key: 'elapsedtime_hours', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={3}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_avg_speed', label: "Jan" },
              { key: 'feb_avg_speed', label: "Feb" },
              { key: 'mar_avg_speed', label: "Mar" },
              { key: 'apr_avg_speed', label: "Apr" },
              { key: 'may_avg_speed', label: "May" },
              { key: 'jun_avg_speed', label: "Jun" },
              { key: 'jul_avg_speed', label: "Jul" },
              { key: 'aug_avg_speed', label: "Aug" },
              { key: 'sep_avg_speed', label: "Sep" },
              { key: 'oct_avg_speed', label: "Oct" },
              { key: 'nov_avg_speed', label: "Nov" },
              { key: 'dec_avg_speed', label: "Dec" },
              { key: 'avg_speed', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={4}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_avg_hr', label: "Jan" },
              { key: 'feb_avg_hr', label: "Feb" },
              { key: 'mar_avg_hr', label: "Mar" },
              { key: 'apr_avg_hr', label: "Apr" },
              { key: 'may_avg_hr', label: "May" },
              { key: 'jun_avg_hr', label: "Jun" },
              { key: 'jul_avg_hr', label: "Jul" },
              { key: 'aug_avg_hr', label: "Aug" },
              { key: 'sep_avg_hr', label: "Sep" },
              { key: 'oct_avg_hr', label: "Oct" },
              { key: 'nov_avg_hr', label: "Nov" },
              { key: 'dec_avg_hr', label: "Dec" },
              { key: 'avg_hr', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={5}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_max_hr', label: "Jan" },
              { key: 'feb_max_hr', label: "Feb" },
              { key: 'mar_max_hr', label: "Mar" },
              { key: 'apr_max_hr', label: "Apr" },
              { key: 'may_max_hr', label: "May" },
              { key: 'jun_max_hr', label: "Jun" },
              { key: 'jul_max_hr', label: "Jul" },
              { key: 'aug_max_hr', label: "Aug" },
              { key: 'sep_max_hr', label: "Sep" },
              { key: 'oct_max_hr', label: "Oct" },
              { key: 'nov_max_hr', label: "Nov" },
              { key: 'dec_max_hr', label: "Dec" },
              { key: 'max_hr', label: "Total" },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={6}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_avg_power', label: "Jan" },
              { key: 'feb_avg_power', label: "Feb" },
              { key: 'mar_avg_power', label: "Mar" },
              { key: 'apr_avg_power', label: "Apr" },
              { key: 'may_avg_power', label: "May" },
              { key: 'jun_avg_power', label: "Jun" },
              { key: 'jul_avg_power', label: "Jul" },
              { key: 'aug_avg_power', label: "Aug" },
              { key: 'sep_avg_power', label: "Sep" },
              { key: 'oct_avg_power', label: "Oct" },
              { key: 'nov_avg_power', label: "Nov" },
              { key: 'dec_avg_power', label: "Dec" },
              { key: 'avg_power', label: "Total" },
            ])}
          </TabPanel>


          <TabPanel value={tabIndex} index={7}>
            {renderTable([
              { key: 'rideyear', label: 'Year' },
              { key: 'jan_max_power', label: "Jan" },
              { key: 'feb_max_power', label: "Feb" },
              { key: 'mar_max_power', label: "Mar" },
              { key: 'apr_max_power', label: "Apr" },
              { key: 'may_max_power', label: "May" },
              { key: 'jun_max_power', label: "Jun" },
              { key: 'jul_max_power', label: "Jul" },
              { key: 'aug_max_power', label: "Aug" },
              { key: 'sep_max_power', label: "Sep" },
              { key: 'oct_max_power', label: "Oct" },
              { key: 'nov_max_power', label: "Nov" },
              { key: 'dec_max_power', label: "Dec" },
              { key: 'max_power', label: "Total" },
            ])}
          </TabPanel>

          {/* Modal Dialog for clicking on a row */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Row Clicked</DialogTitle>
            <DialogContent>
              <Typography>
                {dialogInfo ? `Year: ${dialogInfo.year}, Column: ${dialogInfo.column}` : 'No details available'}
              </Typography>
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default YearAndMonthComponent;
