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
import { SegmentEffortByMonthWithTags, Tagable } from '../types/types';
import TagChips from './TagChips';
import TagFilter from './TagFilter';
import { filterByTag, getUniqueTags } from '../utilities/tagUtilities';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const months = [
  { key: 'january', label: 'Jan', num: 1 },
  { key: 'february', label: 'Feb', num: 2 },
  { key: 'march', label: 'Mar', num: 3 },
  { key: 'april', label: 'Apr', num: 4 },
  { key: 'may', label: 'May', num: 5 },
  { key: 'june', label: 'Jun', num: 6 },
  { key: 'july', label: 'Jul', num: 7 },
  { key: 'august', label: 'Aug', num: 8 },
  { key: 'september', label: 'Sep', num: 9 },
  { key: 'october', label: 'Oct', num: 10 },
  { key: 'november', label: 'Nov', num: 11 },
  { key: 'december', label: 'Dec', num: 12 },
];

const StarredSegmentsComponentByMonth: React.FC = () => {
  const [data, setData] = useState<SegmentEffortByMonthWithTags[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SegmentEffortByMonthWithTags | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ id: number; month: number } | null>(null);
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
      .get(`${API_BASE_URL}/segment/byMonth`, {
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

  const handleSort = (columnKey: keyof SegmentEffortByMonthWithTags) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleCellClick = (id: number, month: number) => {
    setDialogInfo({ id, month });
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


  const filteredData = React.useMemo(() => filterByTag(data, selectedTags), [data, selectedTags]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const lhs = (a as SegmentEffortByMonthWithTags)[sortConfig.key!] || '';
      const rhs = (b as SegmentEffortByMonthWithTags)[sortConfig.key!] || '';
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
                  Starred Segment Efforts by Month
                  {sortConfig.key === "segmentname" ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </TableCell>
                {months.map((m) => (
                  <TableCell
                    key={m.key}
                    align="center"
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
                    align="left"
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
                month={dialogInfo.month}
              />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default StarredSegmentsComponentByMonth;
