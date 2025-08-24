import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Checkbox, FormGroup, FormControlLabel, Button, TableCellProps, Typography } from '@mui/material';
import axios from 'axios';
import { formatDate, formatElapsedTime, formatInteger, formatNumber } from '../utilities/formatUtilities';
import { SegmentEffort } from '../types/types';
import { dayFilterDefault, daysOfWeek, monthsOfYear } from '../utilities/daysOfWeek';
import StravaEffortLink from './StravaEffortLink';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SegmentEffortListProps {
  segmentId: number;
  month?: number;
  dow?: number;
}

const SegmentEffortListComponent = ({ segmentId, month, dow }: SegmentEffortListProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SegmentEffort[]>([]);
  const [segmentName, setSegmentName] = useState<string>('');
  const [filteredName, setFilteredName] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof SegmentEffort | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 190);
  const [refreshData, setRefreshData] = useState(false);

  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(dayFilterDefault);
  const [selectedMonths, setSelectedMonths] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(monthsOfYear.map(m => [m, true]))
  );

  useEffect(() => {
    if (month !== undefined) {
      const monthIndex = month - 1; // Convert 1-based to 0-based index
      // Only select the provided month, deselect all others
      const updatedMonths = Object.fromEntries(
        monthsOfYear.map((m, idx) => [m, idx === monthIndex])
      );
      setSelectedMonths(updatedMonths);

      // Select all days
      const updatedDays = Object.fromEntries(daysOfWeek.map(d => [d, true]));
      setSelectedDays(updatedDays);
    }

    if (dow !== undefined) {
      // Only select the provided day, deselect all others
      const updatedDays = Object.fromEntries(
        daysOfWeek.map((d, idx) => [d, idx === dow])
      );
      setSelectedDays(updatedDays);

      // Select all months
      const updatedMonths = Object.fromEntries(monthsOfYear.map(m => [m, true]));
      setSelectedMonths(updatedMonths);
    }
  }, [month, dow]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/segment/efforts/${segmentId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
    })
      .then((response) =>{
        setData(response.data);
        setSegmentName(`${response.data[0]?.segment_name || "Unavailable"}`);
        setLoading(false);
      })
      .catch((error) =>{
        console.error('Error fetching segment effort data:', error)
        setLoading(false);
      });
  }, [refreshData]);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight - 190;
      setTableHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle function to show or hide the checkboxes
  const toggleShowFilters = () => {
    setShowFilters(prev => !prev);
  };

  const toggleShowAll = () => {
    setShowAll(prev => {
      const newValue = !prev;

      // update days
      const updatedDays = Object.fromEntries(
        daysOfWeek.map(day => [day, newValue])
      );
      setSelectedDays(updatedDays as { [key: string]: boolean });

      // update months
      const updatedMonths = Object.fromEntries(
        monthsOfYear.map(month => [month, newValue])
      );
      setSelectedMonths(updatedMonths as { [key: string]: boolean });

      return newValue;
    });
  };

  const handleSort = (columnKey: keyof SegmentEffort) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleDayChange = (day: string) => {
    setSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [day]: !prevSelectedDays[day],
    }));
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonths(prev => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const filterByDay = (rides: SegmentEffort[]) => {
    return rides.filter(ride => {
      const rideDate = new Date(ride.start_date);
      const dayOfWeek = daysOfWeek[rideDate.getDay()];
      return selectedDays[dayOfWeek];
    });
  };

  const filterByMonth = (rides: SegmentEffort[]) => {
    return rides.filter(ride => {
      const rideDate = new Date(ride.start_date);
      const monthAbbrev = monthsOfYear[rideDate.getMonth()];
      return selectedMonths[monthAbbrev];
    });
  };

  const format = (col: { key: keyof SegmentEffort; label: string; justify: string, width: string, type: string }, theDatum: number | string, row: SegmentEffort) => {
    switch (col.key) {
      case 'segment_name': {
        return theDatum as string;
      }
      case 'rank':{
        return <StravaEffortLink stravaRideId={row.strava_rideid} stravaEffortId={row.strava_effortid} text={String(theDatum)} />
      }
      case 'average_cadence':
      case 'average_watts':
      case 'average_heartrate':
      case 'max_heartrate':
      case 'start_index':
      case 'end_index':{
        return formatInteger(theDatum as number);
      }
      case 'moving_time':
      case 'elapsed_time': {
        return formatElapsedTime(theDatum as number);
      }
      case 'start_date': return formatDate(theDatum as string);
      case 'distance':
      default: return formatNumber(theDatum as number);
    }
  };

  const filteredData = React.useMemo(() => {
    let result = data;
    result = filterByDay(result);
    result = filterByMonth(result);
    setFilteredName(`Showing ${result.length} of ${data.length} efforts`);

    return result;
  }, [data, selectedDays, selectedMonths]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const lhs = a[sortConfig.key!] || '';
      const rhs = b[sortConfig.key!] || '';
      if (lhs < rhs) return sortConfig.direction === 'asc' ? -1 : 1;
      if (lhs > rhs) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const renderTableRecent = (columns: { key: keyof SegmentEffort; label: string; justify: string, width: string, type: string }[]) => {
    return (
      <TableContainer sx={{ maxHeight: tableHeight }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.justify as unknown as TableCellProps["align"]}
                  onClick={() => handleSort(col.key)}
                  sx={{ cursor: 'pointer', width: col.width }}
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
                key={row.start_date}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.justify as unknown as TableCellProps["align"]}
                    sx={{ paddingRight: '1em' }}
                  >
                    {format(col, row[col.key] ?? '', row)}
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
    <Container maxWidth='xl' sx={{ marginY: 0 }}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#fbeacd',
          padding: 2,
          marginBottom: '1em',
          margin: 'auto',
          width: '100%',
        }}
      >
        <Box display="flex" flexDirection= 'column' alignItems="left">
          <Typography component={"span"}>
            { loading ? "Loading segment efforts" : `${segmentName}: ${filteredName}`}
          </Typography>

          <Button variant="text" color="primary" onClick={toggleShowFilters} sx={{alignSelf: "left"}}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {
            showFilters && (
              <>
                <Button variant="text" color="primary" onClick={toggleShowAll}>
                    {showAll ? 'Select All' : 'Unselect All'}
                </Button>

                <FormGroup row sx={{ marginY: 2 }} style={{ marginLeft: '16px' }}>
                  {daysOfWeek.map((day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          checked={selectedDays[day]}
                          onChange={() => handleDayChange(day)}
                          name={day}
                        />
                      }
                      label={day}
                    />
                  ))}
                </FormGroup>

                <FormGroup row sx={{ marginY: 2 }} style={{ marginLeft: '16px' }}>
                  {monthsOfYear.map((month) => (
                    <FormControlLabel
                      key={month}
                      control={
                        <Checkbox
                          checked={selectedMonths[month]}
                          onChange={() => handleMonthChange(month)}
                          name={month}
                        />
                      }
                      label={month}
                    />
                  ))}
                </FormGroup>
              </>
            )
          }
        </Box>

        {renderTableRecent([
          { key: 'rank', label: 'Rank', justify: 'center', width: '80', type: 'number' },
          { key: 'start_date', label: 'Effort Date', justify: 'center', width: '80', type: 'number' },
          { key: 'elapsed_time', label: 'Elapsed Time', justify: 'center', width: '80', type: 'number' },
          { key: 'average_cadence', label: 'Avg Cadence', justify: 'center', width: '80', type: 'number' },
          { key: 'average_watts', label: 'Avg Power', justify: 'center', width: '80', type: 'number' },
          { key: 'average_heartrate', label: 'Avg HR', justify: 'center', width: '80', type: 'number' },
          { key: 'max_heartrate', label: 'Max HR', justify: 'left', width: '100', type: 'string' }
        ])}
      </Paper>
    </Container>
  );
};

export default SegmentEffortListComponent;
