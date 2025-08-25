import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, Link,TableCellProps, Box } from '@mui/material';
import axios from 'axios';
import { formatDate, formatElapsedTime, formatInteger, formatNumber } from '../utilities/formatUtilities';
import { LocationId, SegmentDataWithTags, Tagable } from '../types/types';
import TagChips from './TagChips';
import TagSelector from './TagSelector';
import { splitCommaSeparatedString } from '../utilities/stringUtilities';
import TagFilter from './TagFilter';
import SegmentEffortListComponent from './SegmentEffortListComponent';
import { filterByTag, getUniqueTags } from '../utilities/tagUtilities';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StarredSegmentsComponent = () => {
  const [data, setData] = useState<SegmentDataWithTags[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ segmentData: SegmentDataWithTags; column: string } | null>(null);
  const [segmentData, setSegmentData] = useState<SegmentDataWithTags | null >(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SegmentDataWithTags | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 190);
  const [refreshData, setRefreshData] = useState(false);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/segment/starred`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => {
        const uniqueTags = getUniqueTags(response.data);
        setUniqueTags(uniqueTags);
        setData(response.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [refreshData]);

  const handleSort = (columnKey: keyof SegmentDataWithTags) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleRowClick = (segmentData: SegmentDataWithTags, column: string, colType: string ) => {
    if(colType === "segmenturl"){ return;}
    setDialogInfo( {segmentData, column });
    setSegmentData(segmentData);
    setDialogOpen(true);
  };

  const handleTagFilterChange = (tags: string[]) => {
    setSelectedTags(tags);
    // Filter segment data based on `tags` here
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSegmentData(null);
  };

  const format = (col: { key: keyof SegmentDataWithTags; label: string; justify: string, width: string, type: string }, theDatum: number | string, row: SegmentDataWithTags) => {
    switch (col.key) {
      case 'name':{
        if(col.type === 'segmenturl'){
          return <Link target="_blank" href={`https://www.strava.com/segments/${row.id}`}>{theDatum}</Link>;
        }
        return theDatum as string;
      }
      case 'tags':{
        if(col.type === 'tags'){
          const tagArray = (row?.tags ?? "").split(',').map(tag => tag.trim()).filter(Boolean);
          return <TagChips
            tags={tagArray}
            color="primary"  // Use theme color
            onClick={(tag) => console.log(`Clicked on: ${tag}`)}
            onDelete={(tag) => console.log(`Deleted: ${tag}`)}
          />
        }
        return theDatum as string;
      }
      case 'id':
      case 'elevation_high':
      case 'elevation_low':
      case 'total_elevation_gain':
      case 'total_elevation_loss':
      case 'climb_category':
      case 'effort_count':
      case 'total_effort_count':
      case 'athlete_count': {
        return formatInteger(theDatum as number);
      }
      case 'pr_time':{
        return formatElapsedTime(theDatum as number);
      }
      case 'starred_date':
      case 'pr_date': return formatDate(theDatum as string);
      case 'distance':
      case 'average_grade':
      case 'maximum_grade':
      default: return formatNumber(theDatum as number);
    }
  };

  const handleOnSaveTags = (locationId : number | string | null, assignmentId : number | string | null, tags: string[]) =>{
    const token = localStorage.getItem('token');
    axios.post(
      `${API_BASE_URL}/user/saveTagAssignments`,
      {
        locationId,
        assignmentId,
        tags
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
         setRefreshData((prev) => !prev);  // Toggle refreshData to trigger useEffect
      })
      .catch((error) =>{
        console.error('Error fetching data:', error)
      });
  };

  const filteredData = React.useMemo(() => filterByTag(data, selectedTags), [data, selectedTags]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const lhs = (a as SegmentDataWithTags)[sortConfig.key!] || '';
      const rhs = (b as SegmentDataWithTags)[sortConfig.key!] || '';
      if (lhs < rhs) return sortConfig.direction === 'asc' ? -1 : 1;
      if (lhs > rhs) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const renderTableRecent = (columns: { key: keyof SegmentDataWithTags; label: string; justify: string, width: string, type: string }[]) => {
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
                key={row.name}
                sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.justify as unknown as TableCellProps["align"]}
                    sx={{ paddingRight: '1em' }}
                    onClick={() => handleRowClick(row, col.label, col.type)}
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
          padding: 2, // Increase padding
          marginBottom: '1em',
          margin: 'auto', // Center the component
          width: '100%', // Occupy the full width of the container
        }}
      >

        <Box display="flex" alignItems="center">
          <TagFilter
            availableTags={uniqueTags}
            selectedTags={selectedTags}
            onTagChange={handleTagFilterChange}
          />
        </Box>

        {renderTableRecent([
          { key: 'name', label: `Segments${'\u00A0'.repeat(3)}[${sortedData?.length || 0}]${'\u00A0'.repeat(3)}`, justify: 'left', width: '70', type: 'segmenturl' },
          { key: 'distance', label: 'Distance', justify: 'right', width: '90', type: 'number' },
          { key: 'total_elevation_gain', label: 'Elev Gain', justify: 'right', width: '90', type: 'number' },
          { key: 'average_grade', label: 'Avg Grade', justify: 'right', width: '90', type: 'number' },
          { key: 'climb_category', label: 'Climb Cat', justify: 'right', width: '90', type: 'number' },
          { key: 'effort_count', label: 'Count for You', justify: 'right', width: '90', type: 'number' },
          { key: 'total_effort_count', label: 'Count for All', justify: 'right', width: '90', type: 'number' },
          { key: 'pr_time', label: 'PR Time', justify: 'left', width: '90', type: 'number' },
          { key: 'tags', label: 'Tags', justify: 'left', width: '90', type: 'tags' },
        ])}

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent
            sx={{
              padding: 4,
              width: '100%',
            }}
          >
            {
              dialogInfo?.column.toLowerCase() === 'tags'
              ?
              <TagSelector
                  locationId={LocationId.Segments}
                  assignmentId={segmentData?.id || null}
                  initialTags={splitCommaSeparatedString(dialogInfo?.segmentData?.tags)}
                  onClose={handleCloseDialog}
                  onSave={handleOnSaveTags}
              />
              :
              <SegmentEffortListComponent segmentId={Number(dialogInfo?.segmentData.id || 0)} />
            }
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default StarredSegmentsComponent;
