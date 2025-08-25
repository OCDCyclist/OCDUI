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
                <TableCell key="segmentname" align="left">
                  Starred Segment Efforts by Month
                </TableCell>
                {months.map((m) => (
                  <TableCell key={m.key} align="center">
                    {m.label}
                  </TableCell>
                ))}
                <TableCell key="total" align="center">
                  Total
                </TableCell>
                <TableCell key="tags" align="left">
                  Tags
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
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
