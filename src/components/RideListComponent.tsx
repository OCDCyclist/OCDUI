import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, TableCellProps, Typography } from '@mui/material';
import axios from 'axios';
import RideDetail2 from './RideDetail';
import { formatDateHelper } from '../components/formatters/formatDateHelper';
import { CentroidDefinition, LocationId, RideDataWithTags, UserZone } from '../types/types';
import { formatRideDataWithTags } from  './formatters/formatRideDataWithTags';
import TagSelector from './TagSelector';
import { splitCommaSeparatedString } from '../utilities/stringUtilities';
import { getUniqueTags } from '../utilities/tagUtilities';
import LinearLoader from './loaders/LinearLoader';
import { rideUrlHelper } from './formatters/rideUrlHelper';
import RideDataFilter, { FilterObject } from './filters2/RideDataFilter';
import { fetchUserZones } from '../api';

type RideListComponentProps = {
  date?: string;
  year?: number;
  month?: number;
  dow?: number;
  dom?: number;
  cluster?: CentroidDefinition;
  years?: number[];
};

const RideListComponent = ( { date, year, month, dow, dom, cluster, years }: RideListComponentProps) => {
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
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 190);
  const [refreshData, setRefreshData] = useState(false);
  const [filters, setFilters] = useState<FilterObject>({
    dayOfWeek: [],
    month: [],
    tags: [],
    availableTags: [],
    search: '',
  });
  const [userZones, setUserZones] = useState<UserZone[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return;
    fetchUserZones(token)
        .then( (result)=>{
            if( result.error){
                setError(result.error);
                setUserZones([]);
            }
            else{
                setError(null);
                setUserZones(result.zones);
            }
        })
        .catch( (error) =>{
            setError(error.message);
            setUserZones([]);
         });
  }, []);

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

    const theMessage: string = formatDateHelper({ date: date, year: year, month: month, dow: dow, dom: dom, cluster: cluster, years: years });
    const url: string = rideUrlHelper({ date: date, year: year, month: month, dow: dow, dom: dom, cluster: cluster, years: years });

    setLoadingState({ loading: true, message: theMessage });

    axios.get(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) =>{
        const theRides = response.data;
        const uniqueTags = getUniqueTags(theRides);
        const availableTags = uniqueTags;
        setFilters({...filters, availableTags})
        setData(theRides);
        setLoadingState({ loading: false, message: '' });
      })
      .catch((error) => {
        console.error('Error fetching last month ride data:', error);
        setLoadingState({ loading: false, message: '' });
      });
  }, [refreshData, date, year, month, dow, dom, cluster, years]);

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

  const handleFilterChange = (updatedFilters: typeof filters) => {
    setFilters(updatedFilters);
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

  const filterByText = (rideDataWithTags: RideDataWithTags[], query: string): RideDataWithTags[] => {
    if (!query) return rideDataWithTags;

    const lowerQuery = query.toLowerCase();

    return rideDataWithTags.filter((ride) =>
        Object.values(ride).some((value) =>
            value != null &&
            value.toString().toLowerCase().includes(lowerQuery)
        )
    );
  };

  const filterByMonth = (rideDataWithTags: RideDataWithTags[], months: number[]): RideDataWithTags[] => {
    if (!Array.isArray(months) || months.length === 0) return rideDataWithTags;

    return rideDataWithTags.filter((ride) => {
        const rideMonth = new Date(ride.date).getMonth() + 1; // Months are 0-indexed, so add 1
        return months.includes(0) || months.includes(rideMonth);
    });
  };

  const filterByDayOfWeek = (rideDataWithTags: RideDataWithTags[], dayOfWeek: number[]): RideDataWithTags[] => {
    if (!Array.isArray(dayOfWeek) || dayOfWeek.length === 0) return rideDataWithTags;

    return rideDataWithTags.filter((ride) => {
        const rideDay = new Date(ride.date).getDay(); // Get the day of the week (Sunday = 0, Monday = 1, etc.)
        return dayOfWeek.includes(rideDay); // Check if the ride's day matches any in the dayOfWeek array
    });
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
    if(filters.tags && filters.tags.length > 0){
      result = filterByTag(result, filters.tags);
    }
    if(filters.search && filters.search.length > 0){
      result = filterByText(result, filters.search);
    }
    if(filters.month && filters.month.length > 0){
      result = filterByMonth(result, filters.month);
    }
    if(filters.dayOfWeek && filters.dayOfWeek.length > 0){
      result = filterByDayOfWeek(result, filters.dayOfWeek);
    }

    return result;
  }, [data, filters]);

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
          { loadingState.loading ? <LinearLoader message={loadingState.message} /> : undefined }
          <Table stickyHeader>
          <TableHead>
            <TableRow key={'header'}>
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
                key={row.rideid}
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

  if( error){
    <Typography component={"span"}>
        {`Error: ${error}`}
    </Typography>
  }

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

        <RideDataFilter filters={filters} onFilterChange={handleFilterChange}  />

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
              rideData && <RideDetail2 rideData={rideData} userZones={userZones} onClose={() => setDialogOpen(false)} />
            }
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default RideListComponent;
