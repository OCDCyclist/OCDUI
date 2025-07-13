import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, Checkbox, FormGroup, FormControlLabel, Button, TableCellProps, Typography } from '@mui/material';
import axios from 'axios';
import { formatDate, formatElapsedTime, formatInteger, formatNumber } from '../utilities/formatUtilities';
import { LocationId, SegmentEffortWithTags } from '../types/types';
import { dayFilterDefault, daysOfWeek } from '../utilities/daysOfWeek';
import TagChips from './TagChips';
import TagSelector from './TagSelector';
import { splitCommaSeparatedString } from '../utilities/stringUtilities';
import { getUniqueTags } from '../utilities/tagUtilities';
import TagFilter from './TagFilter';
import StravaEffortLink from './StravaEffortLink';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SegmentEffortListProps {
  segmentId: number;
}

const SegmentEffortListComponent = ({ segmentId }: SegmentEffortListProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SegmentEffortWithTags[]>([]);
  const [segmentName, setSegmentName] = useState<string>('');
  const [dialogInfo, setDialogInfo] = useState<{ segmentEffortData: SegmentEffortWithTags; column: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rideData, setRideData] = useState<SegmentEffortWithTags | null >(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof SegmentEffortWithTags | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
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

  // Toggle function to show or hide the checkboxes
  const toggleShowFilters = () => {
    setShowFilters(prev => !prev);
  };

  const toggleShowAll = () =>{
    setShowAll(prev => {
      if(prev){
        setSelectedDays({
          Sunday: true,
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true
        });
      }
      else{
        setSelectedDays({
          Sunday: false,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false
        });
      }
      return !prev;
    });
  };

  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(dayFilterDefault);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE_URL}/segment/efforts/${segmentId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) =>{
        const uniqueTags = getUniqueTags(response.data);
        setUniqueTags(uniqueTags);
        setData(response.data);
        setSegmentName(response.data.length > 0 ? `${response.data.length} Segment efforts for ${response.data[0]?.segment_name || "Unavailable"}` : "No segment efforts available")
        setLoading(false);
      })
      .catch((error) =>{
        console.error('Error fetching segment effort data:', error)
        setLoading(false);
      });
  }, [refreshData]);

  const handleSort = (columnKey: keyof SegmentEffortWithTags) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleRowClick = (rideData: SegmentEffortWithTags, column: string) => {
    if( column.toLowerCase().trim() === "tags"){
      setDialogInfo( {segmentEffortData: rideData, column });
      setRideData(rideData);
      setDialogOpen(true);
    }
  };

  const handleTagFilterChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setRideData(null);
  };

  const handleDayChange = (day: string) => {
    setSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [day]: !prevSelectedDays[day],
    }));
  };

  const filterByDay = (rides: SegmentEffortWithTags[]) => {
    return rides.filter(ride => {
      const rideDate = new Date(ride.start_date);
      const dayOfWeek = daysOfWeek[rideDate.getDay()];
      return selectedDays[dayOfWeek];
    });
  };

  const filterByTag = (segmentData: SegmentEffortWithTags[], filterTags: string[]) => {
    if(filterTags.length === 0 ) return segmentData;
    return segmentData.filter(
      segment => {
        const segmentTags = segment.tags ? segment.tags.trim().split(',') : [];
        return filterTags.every(tag => segmentTags.includes(tag));
      }
    );
  }

  const format = (col: { key: keyof SegmentEffortWithTags; label: string; justify: string, width: string, type: string }, theDatum: number | string, row: SegmentEffortWithTags) => {
    switch (col.key) {
      case 'segment_name': {
        return theDatum as string;
      }
      case 'tags':{
        if(col.type === 'tags'){
          const tagArray = (row?.tags ?? "").split(',').map(tag => tag.trim()).filter(Boolean);
          return <TagChips
            tags={tagArray}
            color="primary"
            onClick={(tag) => console.log(`Clicked on: ${tag}`)}
            onDelete={(tag) => console.log(`Deleted: ${tag}`)}
          />
        }
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

  const filteredData = React.useMemo(() => {
    let result = data;
    result = filterByDay(result);
    result = filterByTag(result, selectedTags);
    return result;
  }, [data, selectedDays, selectedTags]);

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

  const renderTableRecent = (columns: { key: keyof SegmentEffortWithTags; label: string; justify: string, width: string, type: string }[]) => {
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
                    onClick={() => handleRowClick(row, col.label)}
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
            { loading ? "Loading segment efforts" : `${segmentName}`}
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

                <Box display="flex" alignItems="center">
                  <TagFilter
                    availableTags={uniqueTags}
                    selectedTags={selectedTags}
                    onTagChange={handleTagFilterChange}
                  />
                </Box>

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
          { key: 'max_heartrate', label: 'Max HR', justify: 'left', width: '100', type: 'string' },
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
                  locationId={LocationId.SegmentEfforts}
                  assignmentId={rideData?.strava_effortid || null}
                  initialTags={splitCommaSeparatedString(dialogInfo?.segmentEffortData?.tags)}
                  onClose={handleCloseDialog}
                  onSave={handleOnSaveTags}
              />
              :
              undefined
            }
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default SegmentEffortListComponent;
