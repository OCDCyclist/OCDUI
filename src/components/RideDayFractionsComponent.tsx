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
  const [sortConfig, setSortConfig] = useState<{ key: keyof RideDayFractionsData | string | null; direction: 'asc' | 'desc' }>({
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

  const handleSort = (columnKey: keyof RideDayFractionsData | string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Only these keys are valid for month-level sorting
  const monthKeys: Array<keyof RideDayFractionsData> = [
    'year_month',
    'ride_days_count',
    'days_in_month',
    'fraction_of_days_with_rides',
  ];

  // Sort logic for Year-Month tab (only runs when sort key is a valid month key)
  const sortedData = React.useMemo(() => {
    // if no key or we're on Year tab, return original data
    if (!sortConfig.key || tabIndex === 1) return data;

    // ensure the key is one of the monthKeys; otherwise return data unchanged
    if (!monthKeys.includes(sortConfig.key as keyof RideDayFractionsData)) {
      return data;
    }

    // perform sort
    const key = sortConfig.key as keyof RideDayFractionsData;
    return [...data].sort((a, b) => {
      const va = a[key];
      const vb = b[key];

      // numeric compare when both values are numbers (or keys that are numeric)
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortConfig.direction === 'asc' ? va - vb : vb - va;
      }

      // otherwise fallback to string compare
      const sa = String(va ?? '');
      const sb = String(vb ?? '');
      if (sa < sb) return sortConfig.direction === 'asc' ? -1 : 1;
      if (sa > sb) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, tabIndex]);

  // 🔹 Table for Year-Month detail view — now uses sortedData
  const renderTable = (columns: { key: keyof RideDayFractionsData; label: string }[]) => {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Exclude the Overall row from month table and use sortedData (which may equal data)
    const rows = sortedData.filter((d) => d.year_month !== 'Overall');

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
            {rows.map((row, index) => (
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
                      ? col.key === 'fraction_of_days_with_rides'
                        ? (row[col.key] * 100).toFixed(0) + '%'
                        : row[col.key]
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

  // 🔹 Year Summary Table with Overall record pinned at top (still sortable for year rows)
  const renderTableYear = () => {
    // Separate the Overall record
    const overall = data.find((d) => d.year_month === 'Overall');
    const monthlyData = data.filter((d) => d.year_month !== 'Overall' && d.year_month.includes('-'));

    // Aggregate by year
    const yearlyData = monthlyData.reduce(
      (acc: Record<string, { ride_days_count: number; days_in_month: number }>, row) => {
        const [year] = row.year_month.split('-');
        if (!acc[year]) acc[year] = { ride_days_count: 0, days_in_month: 0 };
        acc[year].ride_days_count += row.ride_days_count;
        acc[year].days_in_month += row.days_in_month;
        return acc;
      },
      {}
    );

    // Convert to array
    let rows = Object.entries(yearlyData).map(([year, values]) => ({
      year,
      ride_days_count: values.ride_days_count,
      days_in_month: values.days_in_month,
      fraction_of_days_with_rides: values.ride_days_count / values.days_in_month,
    }));

    // Sort the year rows according to sortConfig if it's a valid key for years
    if (sortConfig.key) {
      // allowed keys for year table: 'year' (special), plus numeric keys matching interface
      const sk = sortConfig.key;
      if (sk === 'year') {
        rows = [...rows].sort((a, b) =>
          sortConfig.direction === 'asc' ? Number(a.year) - Number(b.year) : Number(b.year) - Number(a.year)
        );
      } else if (monthKeys.includes(sk as keyof RideDayFractionsData)) {
        const key = sk as keyof typeof rows[0];
        rows = [...rows].sort((a, b) => {
          const va = a[key as keyof typeof a];
          const vb = b[key as keyof typeof b];

          if (typeof va === 'number' && typeof vb === 'number') {
            return sortConfig.direction === 'asc' ? va - vb : vb - va;
          }
          const sa = String(va ?? '');
          const sb = String(vb ?? '');
          if (sa < sb) return sortConfig.direction === 'asc' ? -1 : 1;
          if (sa > sb) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      } else {
        // unknown key — keep default ordering (by year asc)
        rows.sort((a, b) => Number(a.year) - Number(b.year));
      }
    } else {
      // default ordering: year asc
      rows.sort((a, b) => Number(a.year) - Number(b.year));
    }

    // Build final display list (Overall + sorted years), using API Overall if available
    const rowsWithTotal = overall
      ? [
          {
            year: 'Total (All Years)',
            ride_days_count: overall.ride_days_count,
            days_in_month: overall.days_in_month,
            fraction_of_days_with_rides: overall.fraction_of_days_with_rides,
          },
          ...rows,
        ]
      : rows;

    const now = new Date();
    const currentYear = now.getFullYear().toString();

    const columns = [
      { key: 'year', label: 'Year' },
      { key: 'ride_days_count', label: 'Days with Rides' },
      { key: 'days_in_month', label: 'Total Days' },
      { key: 'fraction_of_days_with_rides', label: 'Fraction with Rides' },
    ];

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
            {rowsWithTotal.map((row, index) => (
              <TableRow
                key={row.year}
                sx={{
                  backgroundColor:
                    row.year === 'Total (All Years)'
                      ? '#e0f7fa'
                      : row.year === currentYear
                      ? '#e3f1c4'
                      : index % 2 === 0
                      ? '#f9f9f9'
                      : '#fff',
                  fontWeight: row.year === 'Total (All Years)' ? 'bold' : 'normal',
                }}
              >
                <TableCell align="right">{row.year}</TableCell>
                <TableCell align="right">{row.ride_days_count}</TableCell>
                <TableCell align="right">{row.days_in_month}</TableCell>
                <TableCell align="right">
                  {(row.fraction_of_days_with_rides * 100).toFixed(1)}%
                </TableCell>
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
            <Tab label="Year Month" />
            <Tab label="Year" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable([
              { key: 'year_month', label: 'Year Month' },
              { key: 'ride_days_count', label: 'Days with Rides' },
              { key: 'days_in_month', label: 'Days in Month' },
              { key: 'fraction_of_days_with_rides', label: 'Fraction with Rides' },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTableYear()}
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default RideDayFractionsComponent;
