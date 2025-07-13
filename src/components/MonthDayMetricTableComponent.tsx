import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import axios from 'axios';
import { MonthAndDOMData } from '../types/types';
import { formatNumber, formatInteger } from '../utilities/formatUtilities';
import { formatDateHelper } from '../components/formatters/formatDateHelper';
import RideListComponent from './RideListComponent';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface MetricEntry {
  day: number;
  month: number;
  value: number;
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const metricKeys: { label: string; keyPrefix: keyof MonthAndDOMData }[] = [
  { label: 'Distance', keyPrefix: 'distancejan' },
  { label: 'Elevation Gain', keyPrefix: 'elevationgainjan' },
  { label: 'Elapsed Time', keyPrefix: 'elapsedtimejan' },
  { label: 'Avg HR', keyPrefix: 'hraveragejan' },
  { label: 'Avg Power', keyPrefix: 'poweraveragejan' },
];

const getMetricKey = (prefix: string, month: number): keyof MonthAndDOMData =>
  (prefix.slice(0, -3) + monthLabels[month - 1].toLowerCase()) as keyof MonthAndDOMData;

const MonthDayMetricTableComponent = () => {
  const [data, setData] = useState<MonthAndDOMData[]>([]);
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ month: number; column: string, dom: number } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof MetricEntry; direction: 'asc' | 'desc' }>({
    key: 'value',
    direction: 'desc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE_URL}/ocds/monthanddom`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const flattenedData = useMemo(() => {
    const result: MetricEntry[] = [];
    const keyPrefix = metricKeys[selectedMetricIndex].keyPrefix as string;

    for (const row of data) {
      for (let month = 1; month <= 12; month++) {
        const key = getMetricKey(keyPrefix, month);
        const value = row[key] as number;
        if (value !== null && value !== undefined) {
          result.push({ day: row.dom, month, value });
        }
      }
    }

    return result;
  }, [data, selectedMetricIndex]);

  const sortedData = useMemo(() => {
    const sorted = [...flattenedData];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [flattenedData, sortConfig]);

  const handleSort = (key: keyof MetricEntry) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
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

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;

  return (
    <Container
        maxWidth="xl"
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
        <Tabs value={selectedMetricIndex} onChange={(_, newIndex) => setSelectedMetricIndex(newIndex)}>
          {metricKeys.map((metric, index) => (
            <Tab key={index} label={metric.label} />
          ))}
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSort('month')}
                >
                  Month {sortConfig.key === 'month' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSort('day')}
                >
                  Day {sortConfig.key === 'day' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSort('value')}
                >
                  {metricKeys[selectedMetricIndex].label} {sortConfig.key === 'value' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((entry, index) => (
                <TableRow
                  key={`${entry.month}-${entry.day}-${index}`}
                  sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                >
                  <TableCell
                    sx={{
                        backgroundColor:
                        entry.day === currentDay && entry.month === currentMonth ? '#f1f8e9' : 'inherit',
                    }}
                    onClick={() => handleRowClick(entry.day, 'distance', entry.month)}
                  >{monthLabels[entry.month - 1]}</TableCell>
                  <TableCell
                    sx={{
                        backgroundColor:
                        entry.day === currentDay && entry.month === currentMonth ? '#f1f8e9' : 'inherit',
                    }}
                  >{entry.day}</TableCell>
                  <TableCell
                    sx={{
                        backgroundColor:
                        entry.day === currentDay && entry.month === currentMonth ? '#f1f8e9' : 'inherit',
                    }}
                    align="right"
                  >
                    {['Avg HR', 'Avg Power'].includes(metricKeys[selectedMetricIndex].label)
                      ? formatInteger(entry.value)
                      : formatNumber(entry.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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

      </Paper>
    </Container>
  );
};

export default MonthDayMetricTableComponent;
