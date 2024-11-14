import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, Checkbox, FormGroup, FormControlLabel, Button, TableCellProps } from '@mui/material';
import axios from 'axios';
import RideDetail from './RideDetail';
import { formatDate, formatElapsedTime, formatInteger, formatNumber } from '../utilities/formatUtilities';
import { LocationId, RideDataWithTags } from '../types/types';
import { dayFilterDefault, daysOfWeek } from '../utilities/daysOfWeek';
import TagChips from './TagChips';
import TagSelector from './TagSelector';
import { splitCommaSeparatedString } from '../utilities/stringUtilities';
import { getUniqueTags } from '../utilities/tagUtilities';
import TagFilter from './TagFilter';

const RideListComponent = () => {
  const [data, setData] = useState<RideDataWithTags[]>([]);
  const [dialogInfo, setDialogInfo] = useState<{ rideData: RideDataWithTags; column: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rideData, setRideData] = useState<RideDataWithTags | null >(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RideDataWithTags | null, direction: 'asc' | 'desc' }>({
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
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3000/rides/lastmonth', {
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
      })
      .catch((error) => console.error('Error fetching last month ride data:', error));
  }, [refreshData]);

  const handleSort = (columnKey: keyof RideDataWithTags) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleRowClick = (rideData: RideDataWithTags, column: string) => {
    setDialogInfo( {rideData, column });
    setRideData(rideData);
    setDialogOpen(true);
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

  const filterByDay = (rides: RideDataWithTags[]) => {
    return rides.filter(ride => {
      const rideDate = new Date(ride.date);
      const dayOfWeek = daysOfWeek[rideDate.getDay()];
      return selectedDays[dayOfWeek];
    });
  };

  const filterByTag = (segmentData: RideDataWithTags[], filterTags: string[]) => {
    if(filterTags.length === 0 ) return segmentData;
    return segmentData.filter(
      segment => {
        const segmentTags = segment.tags ? segment.tags.trim().split(',') : [];
        return filterTags.every(tag => segmentTags.includes(tag));
      }
    );
  }

  const format = (col: { key: keyof RideDataWithTags; label: string; justify: string, width: string, type: string }, theDatum: number | string, row: RideDataWithTags) => {
    switch (col.key) {
      case 'title':
      case 'comment':{
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

      case 'rideid':
      case 'cadence':
      case 'hravg':
      case 'hrmax':
      case 'poweravg':
      case 'powermax':
      case 'bikeid':
      case 'stravaid':
      case 'elevationgain':
      case 'powernormalized':
      case 'tss':
      case 'matches':
      case 'trainer':
      case 'elevationloss': {
        return formatInteger(theDatum as number);
      }
      case 'elapsedtime': {
        return formatElapsedTime(theDatum as number);
      }
      case 'date': return formatDate(theDatum as string);
      case 'distance':
      case 'speedavg':
      case 'speedmax':
      case 'intensityfactor':
      case 'fracdim':
      default: return formatNumber(theDatum as number);
    }
  };

  const handleOnSaveTags = (locationId : number | string | null, assignmentId : number | string | null, tags: string[]) =>{
    const token = localStorage.getItem('token');
    axios.post(
      'http://localhost:3000/user/saveTagAssignments',
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

  // Combine the filters using useMemo
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

  const renderTableRecent = (columns: { key: keyof RideDataWithTags; label: string; justify: string, width: string, type: string }[]) => {
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
                key={row.date}
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
          padding: 2, // Increase padding
          marginBottom: '1em',
          margin: 'auto', // Center the component
          width: '100%', // Occupy the full width of the container
        }}
      >
        <Box display="flex" alignItems="center">
          <Button variant="text" color="primary" onClick={toggleShowFilters}>
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
          { key: 'date', label: 'Ride Date', justify: 'center', width: '80', type: 'number' },
          { key: 'distance', label: 'Distance', justify: 'center', width: '80', type: 'number' },
          { key: 'elapsedtime', label: 'Elapsed time', justify: 'center', width: '80', type: 'number' },
          { key: 'speedavg', label: 'Avg Speed', justify: 'center', width: '80', type: 'number' },
          { key: 'elevationgain', label: 'Elevation', justify: 'center', width: '80', type: 'number' },
          { key: 'hravg', label: 'Avg HR', justify: 'center', width: '80', type: 'number' },
          { key: 'poweravg', label: 'Avg Power', justify: 'center', width: '80', type: 'number' },
          { key: 'title', label: 'Title', justify: 'left', width: '100', type: 'string' },
          { key: 'tags', label: 'Tags', justify: 'left', width: '90', type: 'tags' },
        ])}

        {/* Modal Dialog to display ride details */}
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
                  locationId={LocationId.Rides}
                  assignmentId={rideData?.rideid || null}
                  initialTags={splitCommaSeparatedString(dialogInfo?.rideData?.tags)}
                  onClose={handleCloseDialog}
                  onSave={handleOnSaveTags}
              />
              :
              rideData && <RideDetail rideData={rideData} onClose={() => setDialogOpen(false)} />
            }
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default RideListComponent;
