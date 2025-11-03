import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, TableCellProps, Typography, Card, CardContent, Stack } from '@mui/material';
import axios from 'axios';
import RideDetail from './RideDetail';
import { formatDateHelper } from '../components/formatters/formatDateHelper';
import { CentroidDefinition, LocationId, RideDataWithTags } from '../types/types';
import { formatRideDataWithTags } from  './formatters/formatRideDataWithTags';
import TagSelector from './TagSelector';
import { splitCommaSeparatedString } from '../utilities/stringUtilities';
import { getUniqueTags } from '../utilities/tagUtilities';
import LinearLoader from './loaders/LinearLoader';
import { rideUrlHelper } from './formatters/rideUrlHelper';
import RideDataFilter, { FilterObject } from './filters2/RideDataFilter';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RideListComponentProps = {
  date?: string;
  year?: number;
  month?: number;
  dow?: number;
  dom?: number;
  cluster?: CentroidDefinition;
  years?: number[];
  start_date?: string;
  end_date?: string;
  similar_to_rideid?: number;
  similareffort_to_rideid?: number;
  trainer?: boolean;
  rides?: RideDataWithTags[];
};

const RideListComponent = ( { date, year, month, dow, dom, cluster, years, start_date, end_date, similar_to_rideid, similareffort_to_rideid, trainer, rides }: RideListComponentProps) => {
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
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    // ✅ If rides are provided as a prop, just use them and skip fetching
    if (rides && rides.length > 0) {
      const uniqueTags = getUniqueTags(rides);
      setFilters(prev => ({ ...prev, availableTags: uniqueTags }));
      setData(rides);
      setError(null);
      setLoadingState({ loading: false, message: '' });
      return; // 🚫 Exit early – no API call
    }

    const token = localStorage.getItem('token');

    const theMessage: string = formatDateHelper({ date: date, year: year, month: month, dow: dow, dom: dom, cluster: cluster, years: years, start_date: start_date, end_date: end_date, trainer: trainer });
    const url: string = rideUrlHelper({ date: date, year: year, month: month, dow: dow, dom: dom, cluster: cluster, years: years, start_date: start_date, end_date: end_date, similar_to_rideid, similareffort_to_rideid, trainer: trainer });

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
        setError(null);
        setLoadingState({ loading: false, message: '' });
      })
      .catch((error) => {
        console.error('Error fetching last month ride data:', error);
        setError(error.message);
        setLoadingState({ loading: false, message: '' });
      });
  }, [refreshData, date, year, month, dow, dom, cluster, years, similar_to_rideid, similareffort_to_rideid, rides]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  type ColumnConfig<T> = T & { priority: number };

  type PriorityRule = {
    maxWidth: number;      // Max screen width for this rule
    maxPriority: number;   // Max priority allowed for this width
  };

  /**
   * Filters columns based on screen width and priority rules.
   * @param screenWidth - Current screen width
   * @param columns - Array of columns with priority
   * @param rules - Array of rules mapping screen widths to max priority
   */
  function getVisibleColumnsUtility<T>(
    screenWidth: number,
    columns: ColumnConfig<T>[],
    rules: PriorityRule[]
  ): ColumnConfig<T>[] {
    const matchedRule = rules.find(rule => screenWidth <= rule.maxWidth);
    const maxPriority = matchedRule ? matchedRule.maxPriority : 5;
    return columns.filter(col => col.priority <= maxPriority);
  }

  const priorityRules: PriorityRule[] = [
    { maxWidth: 480, maxPriority: 1 }, // smallest: only priority 1
    { maxWidth: 768, maxPriority: 2 }, // small tablets
    { maxWidth: 1024, maxPriority: 3 }, // large tablets
    { maxWidth: 1440, maxPriority: 4 }, // laptops
    // anything above 1440 → priority 5 (all columns)
];

  type RideDisplayColumn = {
    key: keyof RideDataWithTags;
    label: string;
    justify: string;
    width: string;
    type: string;
    priority: number;
  };

  const allColumns: RideDisplayColumn[] = [
    { key: 'date', label: 'Ride Date', justify: 'center', width: '80', type: 'number', priority: 1 },
    { key: 'distance', label: 'Distance', justify: 'center', width: '80', type: 'number', priority: 1 },
    { key: 'elapsedtime', label: 'Elapsed time', justify: 'center', width: '80', type: 'number', priority: 3 },
    { key: 'speedavg', label: 'Avg Speed', justify: 'center', width: '80', type: 'number', priority: 2 },
    { key: 'elevationgain', label: 'Elevation', justify: 'center', width: '80', type: 'number', priority: 2 },
    { key: 'hravg', label: 'Avg HR', justify: 'center', width: '80', type: 'number', priority: 3 },
    { key: 'poweravg', label: 'Avg Power', justify: 'center', width: '80', type: 'number', priority: 4 },
    { key: 'title', label: 'Title', justify: 'left', width: '100', type: 'string', priority: 1 },
    { key: 'cluster', label: 'Cluster', justify: 'center', width: '90', type: 'tags', priority: 5 },
    { key: 'tags', label: 'Tags', justify: 'left', width: '90', type: 'tags', priority: 5 },
  ];

  const isSmallScreen = windowWidth <= 480;
  const visibleColumns = getVisibleColumnsUtility(windowWidth, allColumns, priorityRules);

  const renderTableRecent = (columns: RideDisplayColumn[]) => {
    return (
      <TableContainer
        sx={{
          maxHeight: tableHeight,
          overflowX: 'auto',
        }}
      >
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

  const renderCardsRecent = (
    columns: typeof allColumns,
    data: RideDataWithTags[]
  ) => {
    return (
      <Stack spacing={2}>
        {data.map((row) => (
          <Card
            key={row.rideid}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              {columns.map((col) => (
                <Typography key={col.key} variant="body2">
                  <strong>{col.label}:</strong>{" "}
                  {formatRideDataWithTags(col, row[col.key] ?? "", row)}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ))}
      </Stack>
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

        <RideDataFilter filters={filters} onFilterChange={handleFilterChange} hideTagFilter={false} />

        {
          isSmallScreen
            ? renderCardsRecent(allColumns, sortedData) // cards for small screens
            : renderTableRecent(visibleColumns)             // table for larger screens
        }

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
              rideData && <RideDetail
                rideData={rideData}
                onRideUpdated={() => setRefreshData(prev => !prev)} // ← Trigger full refresh
                onClose={() => setDialogOpen(false)}
              />
            }
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default RideListComponent;
