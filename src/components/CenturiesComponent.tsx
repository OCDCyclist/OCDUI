import React, { useState, useEffect, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
} from '@mui/material';
import axios from 'axios';
import { Centuries, RideDataWithTags } from '../types/types';
import { formatDate, formatInteger, formatNumber1 } from '../utilities/formatUtilities';
import RideListComponent from './RideListComponent';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
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
  const [ridesFiltered, setRidesFiltered] = useState<RideDataWithTags[]>([]);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogInfo, setDialogInfo] = useState<{ year?: number, month?: number, day?: number, rides?: RideDataWithTags[] } | null>(null);
  const [sortConfig1, setSortConfig1] = useState<{ key: keyof Centuries | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE_URL}/ocds/centuries`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData1(res.data))
      .catch((err) => console.error('Error fetching centuries:', err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE_URL}/ocds/centuriesdetail`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDataDetail(res.data))
      .catch((err) => console.error('Error fetching centuries detail:', err));
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (year: number, month: number, day: number) => {
    setDialogInfo( { year, month, day} );
    setDialogOpen(true);
  };

  const handleSort1 = (columnKey: keyof Centuries) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig1.key === columnKey && sortConfig1.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig1({ key: columnKey, direction });
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortRows = (rows: Record<string, any>[]) => {
    if (!sortConfig.key) return rows;
    const sorted = [...rows].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  // helper to get canonical YYYY-MM-DD for a ride
  const canonicalDateKey = (ride: RideDataWithTags) => {
    if (ride.datenotime) {
      // datenotime is often date-only or date-with-zero-time; slice ensures YYYY-MM-DD
      return ride.datenotime.slice(0, 10);
    }
    // fallback: use UTC date portion of ride.date
    return new Date(ride.date).toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  };

  const centuriesByYearMonth = useMemo(() => {
    if (!dataDetail.length) return [];

    // Map: year -> monthIndex (0..11) -> Set<YYYY-MM-DD>
    const setsByYearMonth: Record<number, Record<number, Set<string>>> = {};

    dataDetail.forEach((ride) => {
      const dateKey = canonicalDateKey(ride); // YYYY-MM-DD
      const [yStr, mStr /*, dStr */] = dateKey.split('-');
      const year = Number(yStr);
      const monthIndex = Number(mStr) - 1; // convert 1..12 to 0..11

      if (!setsByYearMonth[year]) setsByYearMonth[year] = {};
      if (!setsByYearMonth[year][monthIndex]) setsByYearMonth[year][monthIndex] = new Set<string>();

      // Add the canonical day key — multiple rides same calendar day map to same key
      setsByYearMonth[year][monthIndex].add(dateKey);
    });

    const years = Object.keys(setsByYearMonth).map(Number).sort((a, b) => a - b);
    return years.map((year) => {
      const row: Record<string, any> = { year };
      let total = 0;
      months.forEach((_m, idx) => {
        const setForMonth = setsByYearMonth[year][idx];
        const count = setForMonth ? setForMonth.size : 0;
        row[months[idx]] = count;
        total += count;
      });
      row['Total'] = total;
      return row;
    });
  }, [dataDetail]);

  const centuriesByYearDayOfWeek = useMemo(() => {
    if (!dataDetail.length) return [];

    // For each year -> dayOfWeek (0=Sun..6=Sat) -> Set<YYYY-MM-DD>
    const setsByYearDow: Record<number, Record<number, Set<string>>> = {};

    dataDetail.forEach((ride) => {
      const dateKey = canonicalDateKey(ride); // YYYY-MM-DD
      const d = new Date(dateKey + 'T00:00:00Z'); // use dateKey to ensure consistent DOW
      const year = d.getUTCFullYear();
      const dow = d.getUTCDay(); // 0 = Sun ... 6 = Sat

      if (!setsByYearDow[year]) setsByYearDow[year] = {};
      if (!setsByYearDow[year][dow]) setsByYearDow[year][dow] = new Set<string>();

      setsByYearDow[year][dow].add(dateKey);
    });

    const years = Object.keys(setsByYearDow).map(Number).sort((a, b) => a - b);
    return years.map((year) => {
      const row: Record<string, any> = { year };
      let total = 0;
      daysOfWeek.forEach((_d, idx) => {
        const setForDow = setsByYearDow[year][idx];
        const count = setForDow ? setForDow.size : 0;
        row[daysOfWeek[idx]] = count;
        total += count;
      });
      row['Total'] = total;
      return row;
    });
  }, [dataDetail]);

  const handleCellClick = (year: number, key: string) => {
    let rides: RideDataWithTags[] = [];

    if (months.includes(key)) {
      const monthIndex = months.indexOf(key);
      rides = dataDetail.filter((r) => {
        const d = new Date(r.date);
        return d.getFullYear() === year && d.getMonth() === monthIndex;
      });
      setDialogTitle(`Century rides in ${key} ${year}`);
      setDialogInfo( {rides} );

    } else if (daysOfWeek.includes(key)) {
      const dowIndex = daysOfWeek.indexOf(key);
      rides = dataDetail.filter((r) => {
        const d = new Date(r.date);
        return d.getFullYear() === year && d.getDay() === dowIndex;
      });
      setDialogTitle(`Century rides on ${key}s in ${year}`);
    } else return;

    setRidesFiltered(rides);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setRidesFiltered([]);
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

  const renderSummaryTable = (rows: Record<string, any>[], columns: string[]) => {
    const sorted = sortRows(rows);
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  align="center"
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => handleSort(col)}
                >
                  {col}
                  {sortConfig.key === col ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((row, i) => (
              <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    align="center"
                    onClick={
                      col !== 'year' && col !== 'Total'
                        ? () => handleCellClick(row.year, col)
                        : undefined
                    }
                    sx={{
                      cursor: col !== 'year' && col !== 'Total' ? 'pointer' : 'default',
                    }}
                  >
                    {row[col]}
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
    <Container maxWidth="xl" sx={{ marginY: 2 }}>
      <Paper elevation={3} sx={{ backgroundColor: '#fbeacd', padding: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Centuries" />
          <Tab label="Centuries by Year and Month" />
          <Tab label="Centuries by Year and Day of Week" />
        </Tabs>

        {/* Tab 0 — Original Table */}
        <TabPanel value={tabIndex} index={0}>
          {renderTable_1_day([
            { key: 'year', label: "Year"},
            { key: 'month', label: "Month"},
            { key: 'day', label: "Day"},
            { key: 'total_distance', label: "Century Distance (miles)"}
          ])}
        </TabPanel>

        {/* Tab 1 — By Year and Month */}
        <TabPanel value={tabIndex} index={1}>
          {renderSummaryTable(centuriesByYearMonth, ['year', ...months, 'Total'])}
        </TabPanel>

        {/* Tab 2 — By Year and Day of Week */}
        <TabPanel value={tabIndex} index={2}>
          {renderSummaryTable(centuriesByYearDayOfWeek, ['year', ...daysOfWeek, 'Total'])}
        </TabPanel>

        {/* Dialog for filtered rides */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xl">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            {dialogInfo ? <RideListComponent year={dialogInfo?.year} month={dialogInfo?.month} dom={dialogInfo?.day} rides={ridesFiltered} /> : undefined}
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default CenturiesComponent;
