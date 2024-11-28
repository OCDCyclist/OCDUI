import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, Button, TableCellProps } from '@mui/material';
import axios from 'axios';
import RideDetail from './RideDetail';
import { formatDateHelper } from '../components/formatters/formatDateHelper';
import { ClusterDefinition, LocationId, RideDataWithTags } from '../types/types';
import { formatRideDataWithTags } from  './formatters/formatRideDataWithTags';
import TagSelector from './TagSelector';
import { splitCommaSeparatedString } from '../utilities/stringUtilities';
import { getUniqueTags } from '../utilities/tagUtilities';
import TagFilter from './TagFilter';
import LinearLoader from './loaders/LinearLoader';
import { rideUrlHelper } from './formatters/rideUrlHelper';

type RideListComponentProps = {
  date?: string;
  year?: number;
  month?: number;
  dow?: number;
  dom?: number;
  cluster?: ClusterDefinition;
};

const RideListComponent = ( { date, year, month, dow, dom, cluster }: RideListComponentProps) => {
  const [loadingState, setLoadingState] = React.useState({
    loading: false,
    message: "",
  });

  const [data, setData] = useState<RideDataWithTags[]>([]);
  const [dialogInfo, setDialogInfo] = useState<{ rideData: RideDataWithTags; column: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rideData, setRideData] = useState<RideDataWithTags | null >(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RideDataWithTags | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
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

  const toggleShowFilters = () => {
    setShowFilters(prev => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const theMessage: string = formatDateHelper({ date: date, year: year, month: month, dow: dow, dom: dom, cluster: cluster });
    const url: string = rideUrlHelper({ date: date, year: year, month: month, dow: dow, dom: dom, cluster: cluster });

    setLoadingState({ loading: true, message: theMessage });

    axios.get(url, {
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
        setLoadingState({ loading: false, message: '' });

      })
      .catch((error) => {
        console.error('Error fetching last month ride data:', error);
        setLoadingState({ loading: false, message: '' });
      });
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

  const filterByTag = (rideDataWithTags: RideDataWithTags[], filterTags: string[]) => {
    if(filterTags.length === 0 ) return rideDataWithTags;
    return rideDataWithTags.filter(
      tagsAsCsv => {
        const tagArray = tagsAsCsv.tags ? tagsAsCsv.tags.trim().split(',') : [];
        const clusterArray = tagsAsCsv?.cluster ? tagsAsCsv.cluster.trim().split(',') : [];
        return filterTags.every(tag => [...tagArray, ...clusterArray].includes(tag));
      }
    );
  }

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
    result = filterByTag(result, selectedTags);
    return result;
  }, [data, selectedTags]);

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
            { loadingState.loading ? <LinearLoader message={loadingState.message} /> : undefined }
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
                    {formatRideDataWithTags(col, row[col.key] ?? '', row)}
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
                <Box display="flex" alignItems="right">
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
          { key: 'cluster', label: 'Cluster', justify: 'center', width: '90', type: 'tags' },
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
