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
  TableFooter,
  Paper,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import axios from 'axios';
import RideListComponent from './RideListComponent';
import { formatDateHelper } from './formatters/formatDateHelper';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface YearAndIndoorOutdoorData {
  year: number;
  distance_outdoor: number;
  distance_indoor: number;
  total_distance: number;
  pct_outdoor: number;
  pct_indoor: number;
}

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const YearAndInOrOutsideComponent = () => {
  const [data, setData] = useState<YearAndIndoorOutdoorData[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ year: number; column: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof YearAndIndoorOutdoorData | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE_URL}/ocds/outdoorindoor`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof YearAndIndoorOutdoorData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRowClick = (year: number, column: string) => {
    if( year >= 0){
      setDialogInfo({ year, column });
      setDialogOpen(true);
    }
  };

    const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Helper to calculate totals
  const getDistanceTotals = () => {
    return data.reduce(
      (acc, row) => {
        acc.distance_outdoor += row.distance_outdoor;
        acc.distance_indoor += row.distance_indoor;
        acc.total_distance += row.total_distance;
        return acc;
      },
      { distance_outdoor: 0, distance_indoor: 0, total_distance: 0 }
    );
  };

  const getPercentTotals = () => {
    const length = data.length;
    const sumPctOutdoor = data.reduce((sum, row) => sum + row.pct_outdoor, 0);
    const sumPctIndoor = data.reduce((sum, row) => sum + row.pct_indoor, 0);
    return {
      pct_outdoor: sumPctOutdoor / length,
      pct_indoor: sumPctIndoor / length,
    };
  };

  const renderTable = (columns: { key: keyof YearAndIndoorOutdoorData; label: string }[]) => {
    const currentYear = new Date().getFullYear();
    const isDistanceTab = columns.some((col) => col.key === 'distance_outdoor');
    const isPercentTab = columns.some((col) => col.key === 'pct_outdoor');

    const totals = isDistanceTab ? getDistanceTotals() : null;
    const pctTotals = isPercentTab ? getPercentTotals() : null;

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
              <TableRow key={row.year} sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align="right"
                    sx={{
                      paddingRight: '1em',
                      backgroundColor: row.year === currentYear ? '#e3f1c4' : 'inherit',
                    }}
                    onClick={() => handleRowClick(row.year, col.key)}
                  >
                    {typeof row[col.key] === 'number'
                      ? (col.key === 'year'
                          ? row[col.key]
                          : (row[col.key] as number).toLocaleString(undefined, {
                              minimumFractionDigits: ['pct_outdoor', 'pct_indoor'].includes(col.key) ? 1 : 0,
                              maximumFractionDigits: ['pct_outdoor', 'pct_indoor'].includes(col.key) ? 1 : 0,
                            }))
                      : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow sx={{ backgroundColor: '#dfefff', fontWeight: 'bold' }}>
              {columns.map((col) => {
                let value: string | number = '';

                if (col.key === 'year') {
                  value = 'Total';
                } else if (isDistanceTab && totals) {
                  value = (totals[col.key as keyof typeof totals] as number).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });
                } else if (isPercentTab && pctTotals) {
                  value = (pctTotals[col.key as keyof typeof pctTotals] as number).toFixed(1);
                }

                return (
                  <TableCell key={col.key} align="right" sx={{ fontWeight: 'bold', paddingRight: '1em' }}>
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableFooter>
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
            <Tab label="Distance" />
            <Tab label="Percent" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            {renderTable([
              { key: 'year', label: 'Year' },
              { key: 'distance_outdoor', label: 'Outdoor Distance' },
              { key: 'distance_indoor', label: 'Indoor Distance' },
              { key: 'total_distance', label: 'Total Distance' },
            ])}
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            {renderTable([
              { key: 'year', label: 'Year' },
              { key: 'pct_outdoor', label: 'Outdoor %' },
              { key: 'pct_indoor', label: 'Indoor %' },
            ])}
          </TabPanel>

          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
          >
            <DialogTitle>Rides for {formatDateHelper( { year: dialogInfo?.year, trainer: dialogInfo && dialogInfo.column.includes('indoor') || false } )} </DialogTitle>
            <DialogContent>
              {dialogInfo ? <RideListComponent year={dialogInfo?.year} trainer={dialogInfo?.column ? dialogInfo.column.includes('indoor') : false} /> : undefined}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default YearAndInOrOutsideComponent;
