import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Container } from '@mui/material';
import axios from 'axios';
import { YearAndMonthData } from '../types/types';
import { formatDateHelper } from '../components/formatters/formatDateHelper';
import RideListComponent from './RideListComponent';
import { formatYearAndMonthData } from './formatters/formatYearAndMonthData';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [dialogInfo, setDialogInfo] = useState<{ year: number; column: string, month: number } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof YearAndMonthData | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/ocds/yearandmonth`, {
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (year: number, column: string, month: number) => {
    if( month >= 1 && month <= 12){
      setDialogInfo({ year, column, month });
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const renderTable = (columns: { key: keyof YearAndMonthData; label: string, month: number }[]) => {
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
                      onClick={() => handleRowClick(row.rideyear, col.key, col.month)}
                    >
                      {formatYearAndMonthData(col, row[col.key])}
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
        marginY: 2, 
        maxWidth: '1800px',
        width: '100%',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#f9f1d1', //'#fbeacd',
          padding: 2,
          margin: 'auto',
          width: '100%',
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
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_distance', label: "Jan", month: 1 },
              { key: 'feb_distance', label: "Feb", month: 2 },
              { key: 'mar_distance', label: "Mar", month: 3 },
              { key: 'apr_distance', label: "Apr", month: 4 },
              { key: 'may_distance', label: "May", month: 5 },
              { key: 'jun_distance', label: "Jun", month: 6 },
              { key: 'jul_distance', label: "Jul", month: 7 },
              { key: 'aug_distance', label: "Aug" , month: 8},
              { key: 'sep_distance', label: "Sep", month: 9 },
              { key: 'oct_distance', label: "Oct", month: 10 },
              { key: 'nov_distance', label: "Nov", month: 11 },
              { key: 'dec_distance', label: "Dec", month: 12 },
              { key: 'total_distance_miles', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_elevationgain', label: "Jan", month: 1 },
              { key: 'feb_elevationgain', label: "Feb", month: 2 },
              { key: 'mar_elevationgain', label: "Mar", month: 3 },
              { key: 'apr_elevationgain', label: "Apr", month: 4 },
              { key: 'may_elevationgain', label: "May", month: 5 },
              { key: 'jun_elevationgain', label: "Jun", month: 6 },
              { key: 'jul_elevationgain', label: "Jul", month: 7 },
              { key: 'aug_elevationgain', label: "Aug", month: 8 },
              { key: 'sep_elevationgain', label: "Sep", month: 9 },
              { key: 'oct_elevationgain', label: "Oct", month: 10 },
              { key: 'nov_elevationgain', label: "Nov", month: 11 },
              { key: 'dec_elevationgain', label: "Dec", month: 12 },
              { key: 'total_elevationgain', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            {renderTable([
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_elapsedtime_hours', label: "Jan", month: 1 },
              { key: 'feb_elapsedtime_hours', label: "Feb", month: 2 },
              { key: 'mar_elapsedtime_hours', label: "Mar", month: 3 },
              { key: 'apr_elapsedtime_hours', label: "Apr", month: 4 },
              { key: 'may_elapsedtime_hours', label: "May", month: 5 },
              { key: 'jun_elapsedtime_hours', label: "Jun", month: 6 },
              { key: 'jul_elapsedtime_hours', label: "Jul", month: 7 },
              { key: 'aug_elapsedtime_hours', label: "Aug", month: 8 },
              { key: 'sep_elapsedtime_hours', label: "Sep", month: 9 },
              { key: 'oct_elapsedtime_hours', label: "Oct", month: 10 },
              { key: 'nov_elapsedtime_hours', label: "Nov", month: 11 },
              { key: 'dec_elapsedtime_hours', label: "Dec", month: 12 },
              { key: 'elapsedtime_hours', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={3}>
            {renderTable([
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_avg_speed', label: "Jan", month: 1 },
              { key: 'feb_avg_speed', label: "Feb", month: 2 },
              { key: 'mar_avg_speed', label: "Mar", month: 3 },
              { key: 'apr_avg_speed', label: "Apr", month: 4 },
              { key: 'may_avg_speed', label: "May", month: 5 },
              { key: 'jun_avg_speed', label: "Jun", month: 6 },
              { key: 'jul_avg_speed', label: "Jul", month: 7 },
              { key: 'aug_avg_speed', label: "Aug", month: 8 },
              { key: 'sep_avg_speed', label: "Sep", month: 9 },
              { key: 'oct_avg_speed', label: "Oct", month: 10 },
              { key: 'nov_avg_speed', label: "Nov", month: 11 },
              { key: 'dec_avg_speed', label: "Dec", month: 12 },
              { key: 'avg_speed', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={4}>
            {renderTable([
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_avg_hr', label: "Jan", month: 1 },
              { key: 'feb_avg_hr', label: "Feb", month: 2 },
              { key: 'mar_avg_hr', label: "Mar", month: 3 },
              { key: 'apr_avg_hr', label: "Apr", month: 4 },
              { key: 'may_avg_hr', label: "May", month: 5 },
              { key: 'jun_avg_hr', label: "Jun", month: 6 },
              { key: 'jul_avg_hr', label: "Jul", month: 7 },
              { key: 'aug_avg_hr', label: "Aug", month: 8 },
              { key: 'sep_avg_hr', label: "Sep", month: 9 },
              { key: 'oct_avg_hr', label: "Oct", month: 10 },
              { key: 'nov_avg_hr', label: "Nov", month: 11 },
              { key: 'dec_avg_hr', label: "Dec", month: 12 },
              { key: 'avg_hr', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={5}>
            {renderTable([
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_max_hr', label: "Jan", month: 1 },
              { key: 'feb_max_hr', label: "Feb", month: 2 },
              { key: 'mar_max_hr', label: "Mar", month: 3 },
              { key: 'apr_max_hr', label: "Apr", month: 4 },
              { key: 'may_max_hr', label: "May", month: 5 },
              { key: 'jun_max_hr', label: "Jun", month: 6 },
              { key: 'jul_max_hr', label: "Jul", month: 7 },
              { key: 'aug_max_hr', label: "Aug", month: 8 },
              { key: 'sep_max_hr', label: "Sep", month: 9 },
              { key: 'oct_max_hr', label: "Oct", month: 10 },
              { key: 'nov_max_hr', label: "Nov" , month: 11 },
              { key: 'dec_max_hr', label: "Dec", month: 12 },
              { key: 'max_hr', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={6}>
            {renderTable([
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_avg_power', label: "Jan", month: 1 },
              { key: 'feb_avg_power', label: "Feb", month: 2 },
              { key: 'mar_avg_power', label: "Mar", month: 3 },
              { key: 'apr_avg_power', label: "Apr", month: 4 },
              { key: 'may_avg_power', label: "May", month: 5 },
              { key: 'jun_avg_power', label: "Jun", month: 6 },
              { key: 'jul_avg_power', label: "Jul", month: 7 },
              { key: 'aug_avg_power', label: "Aug", month: 8 },
              { key: 'sep_avg_power', label: "Sep", month: 9 },
              { key: 'oct_avg_power', label: "Oct", month: 10 },
              { key: 'nov_avg_power', label: "Nov", month: 11 },
              { key: 'dec_avg_power', label: "Dec", month: 12 },
              { key: 'avg_power', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={7}>
            {renderTable([
              { key: 'rideyear', label: 'Year', month: 0 },
              { key: 'jan_max_power', label: "Jan", month: 1 },
              { key: 'feb_max_power', label: "Feb", month: 2 },
              { key: 'mar_max_power', label: "Mar", month: 3 },
              { key: 'apr_max_power', label: "Apr", month: 4 },
              { key: 'may_max_power', label: "May", month: 5 },
              { key: 'jun_max_power', label: "Jun", month: 6 },
              { key: 'jul_max_power', label: "Jul", month: 7 },
              { key: 'aug_max_power', label: "Aug", month: 8 },
              { key: 'sep_max_power', label: "Sep", month: 9 },
              { key: 'oct_max_power', label: "Oct", month: 10 },
              { key: 'nov_max_power', label: "Nov", month: 11 },
              { key: 'dec_max_power', label: "Dec", month: 12 },
              { key: 'max_power', label: "Total", month: 0 },
            ])}
          </TabPanel>

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Rides for {formatDateHelper( { year: dialogInfo?.year, month: dialogInfo?.month } )} </DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent year={dialogInfo?.year} month={dialogInfo?.month} /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default YearAndMonthComponent;
