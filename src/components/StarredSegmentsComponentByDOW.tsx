import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  Container,
} from '@mui/material';
import axios from 'axios';
import SegmentEffortListComponent from './SegmentEffortListComponent';
import { SegmentEffortByDOW } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const months = [
  { key: 'monday', label: 'Mon', num: 1 },
  { key: 'tuesday', label: 'Tue', num: 2 },
  { key: 'wednesday', label: 'Wed', num: 3 },
  { key: 'thursday', label: 'Thu', num: 4 },
  { key: 'friday', label: 'Fri', num: 5 },
  { key: 'saturday', label: 'Sat', num: 6 },
  { key: 'sunday', label: 'Sun', num: 7 },
];

const StarredSegmentsComponentByDOW: React.FC = () => {
  const [data, setData] = useState<SegmentEffortByDOW[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ id: number; dow: number } | null>(null);
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 190);

  useEffect(() => {
    const handleResize = () => {
      setTableHeight(window.innerHeight - 190);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE_URL}/segment/byDOW`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleCellClick = (id: number, dow: number) => {
    setDialogInfo({ id, dow });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  return (
    <Container maxWidth="xl" sx={{ marginY: 0 }}>
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
        <TableContainer sx={{ maxHeight: tableHeight }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell key="segmentname" align="left">
                  Segment
                </TableCell>
                {months.map((m) => (
                  <TableCell key={m.key} align="right">
                    {m.label}
                  </TableCell>
                ))}
                <TableCell key="total" align="right">
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                >
                  <TableCell align="left">{row.segmentname}</TableCell>
                  {months.map((m) => (
                    <TableCell
                      key={m.key}
                      align="right"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleCellClick(row.id, m.num)}
                    >
                      {row[m.key]}
                    </TableCell>
                  ))}
                  <TableCell
                    align="right"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleCellClick(row.id, 0)}
                  >
                    {row.totalattempts}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="lg">
          <DialogContent sx={{ padding: 4, width: '100%' }}>
            {dialogInfo && (
              <SegmentEffortListComponent
                segmentId={dialogInfo.id}
                dow={dialogInfo.dow}
              />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default StarredSegmentsComponentByDOW;
