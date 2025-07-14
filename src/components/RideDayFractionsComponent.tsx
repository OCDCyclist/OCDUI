import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from '@mui/material';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RideDayFractionsData {
  year_month: string;
  ride_days_count: number;
  days_in_month: number;
  fraction_of_days_with_rides: number;
}

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const RideDayFractionsComponent = () => {
  const [data, setData] = useState<RideDayFractionsData[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RideDayFractionsData | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE_URL}/ocds/ridedayfractions`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof RideDayFractionsData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const renderTable = (columns: { key: keyof RideDayFractionsData; label: string }[]) => {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

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
              <TableRow key={row.year_month} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align="right"
                    sx={{
                      paddingRight: '1em',
                      backgroundColor: row.year_month === currentYearMonth ? '#e3f1c4' : 'inherit',
                    }}
                  >
                    {typeof row[col.key] === 'number'
                      ? (
                          (col.key === 'ride_days_count' || col.key === 'days_in_month')
                          ? row[col.key]
                          : (Number(row[col.key]) * 100.0).toLocaleString(undefined,{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }) + '%'
                        )
                      : row[col.key]}
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
      maxWidth="xl"
      sx={{
        marginY: 2,
        maxWidth: '1200px',
        width: '100%',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#e1f5fe',
          padding: 2,
          margin: 'auto',
          width: '100%',
        }}
      >
        <Box>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Days with Rides" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable([
              { key: 'year_month', label: 'Year Month' },
              { key: 'ride_days_count', label: 'Days with Rides' },
              { key: 'days_in_month', label: 'Days in Month' },
              { key: 'fraction_of_days_with_rides', label: 'Fraction with Rides' },
            ])}
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default RideDayFractionsComponent;
