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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ id: number; dow: number } | null>(null);
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 190);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const getUniqueTags = (segments: SegmentEffortByDOWWithTags[]): string[] => {
    const tagSet = new Set<string>();

    segments.forEach(segment => {
      // Check if tags exist and are non-null before iterating
      if (segment.tags && segment.tags.trim().length > 0) {
        segment.tags.split(',').forEach(tag => tagSet.add(tag));
      }
    });

    return Array.from(tagSet); // Convert the Set back to an array
  };

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

  const filterByTag = (segmentData: SegmentEffortByDOWWithTags[], filterTags: string[]) => {
    if(filterTags.length === 0 ) return segmentData;
    return segmentData.filter(
      segment => {
        const segmentTags = segment.tags ? segment.tags.trim().split(',') : [];
        return filterTags.every(tag => segmentTags.includes(tag));
      }
    );
  }

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
                  Starred Segment Efforts by Day of Week
                </TableCell>
                {months.map((m) => (
                  <TableCell key={m.key} align="right">
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
