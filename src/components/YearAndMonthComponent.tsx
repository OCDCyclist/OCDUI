import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';

interface YearAndMonthData {
  rideyear: number;
  total_distance_miles: number;
  jan_distance: number;
  feb_distance: number;
  mar_distance: number;
  apr_distance: number;
  may_distance: number;
  jun_distance: number;
  jul_distance: number;
  aug_distance: number;
  sep_distance: number;
  oct_distance: number;
  nov_distance: number;
  dec_distance: number;
  total_elevationgain: number;
  jan_elevationgain: number;
  feb_elevationgain: number;
  mar_elevationgain: number;
  apr_elevationgain: number;
  may_elevationgain: number;
  jun_elevationgain: number;
  jul_elevationgain: number;
  aug_elevationgain: number;
  sep_elevationgain: number;
  oct_elevationgain: number;
  nov_elevationgain: number;
  dec_elevationgain: number;
  elapsedtime_hours: number;
  jan_elapsedtime_hours: number;
  feb_elapsedtime_hours: number;
  mar_elapsedtime_hours: number;
  apr_elapsedtime_hours: number;
  may_elapsedtime_hours: number;
  jun_elapsedtime_hours: number;
  jul_elapsedtime_hours: number;
  aug_elapsedtime_hours: number;
  sep_elapsedtime_hours: number;
  oct_elapsedtime_hours: number;
  nov_elapsedtime_hours: number;
  dec_elapsedtime_hours: number;
  avg_speed: number;
  jan_avg_speed: number;
  feb_avg_speed: number;
  mar_avg_speed: number;
  apr_avg_speed: number;
  may_avg_speed: number;
  jun_avg_speed: number;
  jul_avg_speed: number;
  aug_avg_speed: number;
  sep_avg_speed: number;
  oct_avg_speed: number;
  nov_avg_speed: number;
  dec_avg_speed: number;
  avg_cadence: number;
  jan_avg_cadence: number;
  feb_avg_cadence: number;
  mar_avg_cadence: number;
  apr_avg_cadence: number;
  may_avg_cadence: number;
  jun_avg_cadence: number;
  jul_avg_cadence: number;
  aug_avg_cadence: number;
  sep_avg_cadence: number;
  oct_avg_cadence: number;
  nov_avg_cadence: number;
  dec_avg_cadence: number;
  avg_hr: number;
  jan_avg_hr: number;
  feb_avg_hr: number;
  mar_avg_hr: number;
  apr_avg_hr: number;
  may_avg_hr: number;
  jun_avg_hr: number;
  jul_avg_hr: number;
  aug_avg_hr: number;
  sep_avg_hr: number;
  oct_avg_hr: number;
  nov_avg_hr: number;
  dec_avg_hr: number;
  max_hr: number;
  jan_max_hr: number;
  feb_max_hr: number;
  mar_max_hr: number;
  apr_max_hr: number;
  may_max_hr: number;
  jun_max_hr: number;
  jul_max_hr: number;
  aug_max_hr: number;
  sep_max_hr: number;
  oct_max_hr: number;
  nov_max_hr: number;
  dec_max_hr: number;
  avg_power: number;
  jan_avg_power: number;
  feb_avg_power: number;
  mar_avg_power: number;
  apr_avg_power: number;
  may_avg_power: number;
  jun_avg_power: number;
  jul_avg_power: number;
  aug_avg_power: number;
  sep_avg_power: number;
  oct_avg_power: number;
  nov_avg_power: number;
  dec_avg_power: number;
  max_power: number;
  jan_max_power: number;
  feb_max_power: number;
  mar_max_power: number;
  apr_max_power: number;
  may_max_power: number;
  jun_max_power: number;
  jul_max_power: number;
  aug_max_power: number;
  sep_max_power: number;
  oct_max_power: number;
  nov_max_power: number;
  dec_max_power: number;
}

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
  const [dialogInfo, setDialogInfo] = useState<{ date: string; column: string } | null>(null);
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

  const format = ( col:  { key: keyof YearAndMonthData; label: string }, theDatum: string) =>{
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
        return formatInteger(theDatum);
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
        return formatNumber(theDatum);
      }
      case 'rideyear':{
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

  const renderTable = (columns: { key: keyof YearAndMonthData; label: string }[]) => {
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
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                      key={col.key}
                      align="right"
                      sx={{ paddingRight: '1em' }}
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
      sx={{
        marginY: 2, // Adds some vertical margin
        maxWidth: '1200px', // Increase max width
        width: '100%', // Set width to 100% for full-page width
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#ffe5cc',
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
                {dialogInfo ? `Date: ${dialogInfo.date}, Column: ${dialogInfo.column}` : 'No details available'}
              </Typography>
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default YearAndMonthComponent;
