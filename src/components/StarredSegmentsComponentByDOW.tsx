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
  Box,
} from '@mui/material';
import axios from 'axios';
import SegmentEffortListComponent from './SegmentEffortListComponent';
import { SegmentEffortByDOWWithTags } from '../types/types';
import TagChips from './TagChips';
import TagFilter from './TagFilter';
import { filterByTag, getUniqueTags } from '../utilities/tagUtilities';

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
  const [data, setData] = useState<SegmentEffortByDOWWithTags[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SegmentEffortByDOWWithTags | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ id: number; dow: number } | null>(null);
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 190);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      .then((response) => {
        const uniqueTags = getUniqueTags(response.data);
        setUniqueTags(uniqueTags);
        setData(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSort = (columnKey: keyof SegmentEffortByDOWWithTags) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleCellClick = (id: number, dow: number) => {
    setDialogInfo({ id, dow });
    setDialogOpen(true);
  };

  const handleTagFilterChange = (tags: string[]) => {
    setSelectedTags(tags);
    // Filter segment data based on `tags` here
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  const filteredData = React.useMemo(
    () => filterByTag(data, selectedTags),
    [data, selectedTags]
  );

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const lhs = (a as SegmentEffortByDOWWithTags)[sortConfig.key!] || '';
      const rhs = (b as SegmentEffortByDOWWithTags)[sortConfig.key!] || '';
      if (lhs < rhs) return sortConfig.direction === 'asc' ? -1 : 1;
      if (lhs > rhs) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

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

        <Box display="flex" alignItems="center">
          <TagFilter
            availableTags={uniqueTags}
            selectedTags={selectedTags}
            onTagChange={handleTagFilterChange}
          />
        </Box>

        <TableContainer sx={{ maxHeight: tableHeight }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  key="segmentname"
                  align="left"
                  onClick={() => handleSort("segmentname")}
                  sx={{ cursor: 'pointer' }}
                >
                  Starred Segment Efforts by Day of Week
                </TableCell>
                {months.map((m) => (
                  <TableCell
                    key={m.key} align="right"
                    onClick={() => handleSort(m.key)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {m.label}
                    {sortConfig.key === m.key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </TableCell>
                ))}
                <TableCell
                  key="totalattempts"
                  align="center"
                  onClick={() => handleSort("totalattempts")}
                  sx={{ cursor: 'pointer' }}
                >
                  Total
                  {sortConfig.key === "totalattempts"
                    ? sortConfig.direction === "asc"
                      ? " ▲"
                      : " ▼"
                    : ""}
                </TableCell>
                <TableCell key="tags" align="left">
                  Tags
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row, index) => (
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

                  <TableCell
                    align="right"
                  >
                    <TagChips
                      tags={(row?.tags ?? "").split(',').map(tag => tag.trim()).filter(Boolean)}
                      color="primary"
                    />
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
