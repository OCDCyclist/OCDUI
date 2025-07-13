import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  InputAdornment,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { formatBoolean, formatDate, formatInteger, formatNumber, formatPercent, isTextPresent } from '../utilities/formatUtilities';
import { useNavigate } from 'react-router-dom';
import { Bike, MatchRow, MetricRow, ReferenceLevel, RideData, SegmentEffortMini, UserZone, ZoneType } from '../types/types';
import { isBooleanString, isStringInteger, isStringNumber } from '../utilities/validation';
import LinearIndeterminate from './loaders/LinearIndeterminate';
import { isTokenValid } from '../utilities/jwtUtils';
import { wattsPerKilo } from '../utilities/metricsUtils';
import ElapsedTimeEditor from './ElapsedTimeEditor';
import DisplayPower from './DisplayPower';
import StravaRideLink from './StravaRideLink';
import DownloadRideDataLink from './DownloadRideDataLink';
import ZoneTable from './ZoneTable';
import MetricTable from './MetricTable';
import { fetchRideMetrics } from '../api/rides/fetchRideMetrics';
import { fetchRideMatches } from '../api/rides/fetchRideMatches';
import MatchTable from './MatchTable';
import { fetchUserZones } from '../api';
import { fetchRiderReferenceLevels } from '../api/rides/fetchRiderReferenceLevels';
import SegmentTable from './SegmentTable';
import { fetchRideSegmentEfforts } from '../api/rides/fetchRideSegmentEfforts';
import SimilarRides from './SimilarRides';
import { useRideFieldUpdate } from '../api/rides/useRideFieldUpdate';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

interface RideDetailProps {
  rideData: RideData;
  onClose: () => void;
  onRideUpdated: () => void;
}

const RideDetail = ({ rideData: initialRideData, onRideUpdated, onClose }: RideDetailProps) => {
  const [rideData, setRideData] = useState<RideData>(initialRideData); // For success response
  const [userZones, setUserZones] = useState<UserZone[]>([]);
  const [rideMetricData, setRideMetricData] = useState<MetricRow[]>([]); // For metric data
  const [segmentEffortData, setSegmentEffortData] = useState<SegmentEffortMini[]>([]); // For segment effort data
  const [referenceLevels, setReferenceLevels] = useState<ReferenceLevel[]>([]); // For reference level data
  const [rideMatches, setRideMatches] = useState<MatchRow[]>([]); // For match data
  const [bikes, setBikes] = useState<Bike[]>([]); // Bikes data
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | number >('');
  const [inputError, setInputError] = useState<string | null>(null); // Tracks validation errors
  const [loading, setLoading] = useState<boolean>(false); // For loading state when updating
  const [error, setError] = useState<string | null>(null); // For error state when updating
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = useNavigate();

  const { rideData: updatedRideData, loading: updateLoading, error: updateError, updateRideField } = useRideFieldUpdate(rideData.rideid);

  useEffect(() => {
    if (updatedRideData) {
      setRideData(updatedRideData);
    }
  }, [updatedRideData]);

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
    // Fetch bikes from the API
    const fetchBikes = async () => {

      try {
        const token = localStorage.getItem('token');

        if (!isTokenValid(token)) {
          localStorage.removeItem('token'); // Clear the token
          navigate('/login'); // Redirect to login
        }

        const response = await fetch(`${API_BASE_URL}/bikes`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBikes(data);
        } else {
          setError('Failed to fetch bikes');
        }
      } catch (error) {
        setError('Error fetching bikes: ' + error);
      }
    };

    fetchBikes();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return;
    fetchRideMetrics(token, rideData.rideid)
        .then( (result)=>{
            if( result.error){
                setError(result.error);
                setRideMetricData([]);
            }
            else{
                setError(null);
                setRideMetricData(result.rideMetrics);
            }
        })
        .catch( (error) =>{
            setError(error.message);
            setRideMetricData([]);
         });
  }, [rideData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return;
    fetchRideMatches(token, rideData.rideid)
        .then( (result)=>{
            if( result.error){
                setError(result.error);
                setRideMatches([]);
            }
            else{
                setError(null);
                setRideMatches(result.rideMatches);
            }
        })
        .catch( (error) =>{
            setError(error.message);
            setRideMatches([]);
         });
  }, [rideData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return;
    fetchRideSegmentEfforts(token, rideData.rideid)
        .then( (result)=>{
            if( result.error){
                setError(result.error);
                setSegmentEffortData([]);
            }
            else{
                setError(null);
                setSegmentEffortData(result.segmentEfforts);
            }
        })
        .catch( (error) =>{
            setError(error.message);
            setSegmentEffortData([]);
         });
  }, [rideData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return;
    fetchRiderReferenceLevels(token)
        .then( (result)=>{
            if( result.error){
                setError(result.error);
                setReferenceLevels([]);
            }
            else{
                setError(null);
                setReferenceLevels(result.referenceLevels);
            }
        })
        .catch( (error) =>{
            setError(error.message);
            setReferenceLevels([]);
         });
  }, [rideData]);

  if (!rideData) {
    return <Typography variant="h6" component={"span"}>No ride data available.</Typography>;
  }

  const handleFieldClick = (field: string, currentValue: string | number) => {
    setEditingField(field);
    setEditValue(currentValue);
    setInputError(null); // Clear any previous errors when entering edit mode
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleSave = async (field: string) => {
    if (!validateInput(field, editValue)) {
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    try {
      const url = `${API_BASE_URL}/ride/${rideData.rideid}/update`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify({ [field]: editValue.toString() }),
      });

      setEditingField(null);
      setEditValue('');
      setInputError(null);

      if (response.ok) {
        const data = await response.json();
        setRideData(data);
        onRideUpdated();
        setLoading(false);
      } else {
        setError('Failed to update ride');
        setLoading(false);
      }
    } catch (error) {
      setError('Error updating ride: ' + error);
      setLoading(false);
    }

    // API call to save the change
    await fetch(`/api/ride/${rideData.rideid}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
      },
      body: JSON.stringify({ [field]: editValue }),
    });

    setEditingField(null);
    setEditValue('');
    setInputError(null);
  };

  const handleSaveElapsedTime = async () => {
    if(!Number.isInteger(elapsedTime)){
      setInputError("Invalid elapsed time value");
      return
    }

    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    try {
      const url = `${API_BASE_URL}/ride/${rideData.rideid}/update`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify({ ["elapsedtime"]: elapsedTime.toString() }),
      });

      setEditingField(null);
      setElapsedTime(0);
      setInputError(null);

      if (response.ok) {
        const data = await response.json();
        setRideData(data);
        setLoading(false);
      } else {
        setError('Failed to update ride');
        setLoading(false);
      }
    } catch (error) {
      setError('Error updating ride: ' + error);
      setLoading(false);
    }

    // API call to save the change
    await fetch(`/api/ride/${rideData.rideid}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
      },
      body: JSON.stringify({ [field]: editValue }),
    });

    setEditingField(null);
    setEditValue('');
    setInputError(null);
  };

  const validateInput = (field: string, value: string | number) => {
    switch (field) {
      case 'title':
      case 'comment':{
        if (typeof(value) !== 'string') {
          setInputError('Invalid text format. Please enter valid text.');
          return false;
        }
        break;
      }
      case 'date':
        if (typeof(value) !== 'string' || isNaN(Date.parse(value))) {
          setInputError('Invalid date format. Please enter a valid date.');
          return false;
        }
        break;
      case 'trainer':
        if (typeof(value) !== 'string' || !isBooleanString(value)) {
          setInputError(`${field} value must be a whole number.`);
          return false;
        }
        break;
      case 'bikeid':{
        if (!Number.isInteger(value)) {
          setInputError(`${field} value must be a whole number.`);
          return false;
        }
        break;
      }
      case 'elapsedtime':{
        if (!Number.isInteger(Number(value))) {
          setInputError(`${field} value must be a whole number.`);
          return false;
        }
        break;
      }
      case 'poweravg':
      case 'powermax':
      case 'hravg':
      case 'hrmax':
      case 'elevationgain':
      case 'elevationloss':
      case 'powernormalized':
      case 'tss':
      case 'cadence':{
        if (typeof(value) !== 'string' || !isStringInteger(value)) {
          setInputError(`${field} value must be a whole number.`);
          return false;
        }
        break;
      }
      case 'speedavg':
      case 'speedmax':
      case 'distance':
      case 'intensityfactor':
        if (typeof(value) !== 'string' || !isStringNumber(value)) {
          setInputError(`${field} value must be a number.`);
          return false;
        }
        break;
      default:
        setInputError(`${field} is an unknown type of update.`);
        return false;
    }
    setInputError(null); // Clear error if valid
    return true;
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
    setInputError(null); // Clear any error on cancel
  };

  const handleCloseErrorDialog = () => {
    setError(null); // Clear error state
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const ErrorComponent = ({ error }: { error: string }) => (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={handleCloseErrorDialog}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );

  const getZoneValues = (zoneType: ZoneType, userZones: UserZone[]): number[] => {
    const zone = userZones.find((zone) => zone.zonetype === zoneType);

    if (!zone) {
      return [];
    }

    const values = zone.zonevalues.split(',');
    const numbers = values.map((value) => {
      const number = parseFloat(value.trim());
      return isNaN(number) ? null : number;
    });

    return numbers.includes(null) ? [] : (numbers as number[]);
  };

  if (error || updateError) {
    return error ? <ErrorComponent error={error} /> : <ErrorComponent error={updateError || "Unknown update d"} />;
  }

  const zoneDefinitionsHR =  getZoneValues(ZoneType.HR, userZones);
  const zoneValuesHR = rideData.hrzones;

  const zoneDefinitionsPower = getZoneValues(ZoneType.Power, userZones);
  const zoneValuesPower = rideData.powerzones;

  const zoneDefinitionsCadence = getZoneValues(ZoneType.Cadence, userZones);
  const zoneValuesCadence = rideData.cadencezones;

  return (
    <Container maxWidth="xl" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: '0 auto' }}>
        { loading || updateLoading ? <LinearIndeterminate /> : null}

        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Summary" />
          <Tab label="HR" />
          <Tab label="Power" />
          <Tab label="Cadence" />
          <Tab label="Matches" />
          <Tab label="Metrics" />
          <Tab label="Segments" />
          <Tab label="Similar Rides" />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <Typography variant="h5" align="left" sx={{ marginTop: 4 }}>
            {editingField === 'title' ? (
              <TextField
                fullWidth
                value={editValue ?? rideData.title}
                onChange={handleInputChange}
                onBlur={handleCancel}
                onKeyUp={(e) => e.key === 'Enter' && handleSave('title')}
                error={!!inputError}
                helperText={inputError}
                InputProps={{
                  endAdornment: <InputAdornment position="end">text</InputAdornment>,
                }}
                autoFocus
              />
            ) : (
              <span title={`RideId: ${rideData.rideid}`} onClick={() => handleFieldClick('title', rideData.title)}>{rideData.title || 'Ride Detail'}</span>
            )}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {/* Ride Date */}
                <TableRow>
                  <TableCell>Ride Date</TableCell>
                  <TableCell>
                    {editingField === 'date' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.date}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('date')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">date</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <Button variant="text" color="primary" onClick={( () => {
                          handleFieldClick('date', rideData.date)
                        })}>
                        {formatDate(rideData.date)}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>Elapsed Time</TableCell>
                  <TableCell>
                    <ElapsedTimeEditor initialSeconds={rideData.elapsedtime} onSave={ (newSeconds: number) =>{
                        setElapsedTime(newSeconds);
                        handleSaveElapsedTime();
                    }} />
                  </TableCell>
                </TableRow>

                {/* Distance */}
                <TableRow>
                  <TableCell>Distance</TableCell>
                  <TableCell>
                    {editingField === 'distance' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.distance}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('distance')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">mph</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('distance', rideData.distance)}>
                        {`${formatNumber(rideData.distance)} miles`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>Bike Name</TableCell>
                  <TableCell>
                      {editingField === 'bikeid' ? (
                        <FormControl fullWidth>
                          <InputLabel id="bike-select-label">Select Bike</InputLabel>
                          <Select
                            labelId="bike-select-label"
                            value={rideData.bikeid}
                            onChange={async (e: { target: { value: unknown; }; }) => {
                              const selected = Number(e.target.value);
                              await updateRideField('bikeid', selected);
                              onRideUpdated()
                            }}
                            fullWidth
                          >
                            {bikes.map((bike) => (
                              <MenuItem key={bike.bikeid} value={bike.bikeid}>
                                {bike.bikename || 'Unknown'}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <span onClick={() => handleFieldClick('bikeid', rideData.bikeid)}>
                          <Typography variant='body2' component={"span"}>{`${rideData.bikename}`}</Typography>
                        </span>
                      )}
                  </TableCell>
                </TableRow>

                {/* Avg and Max Speed */}
                <TableRow>
                  <TableCell>Avg Speed</TableCell>
                  <TableCell>
                    {editingField === 'speedavg' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.speedavg}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('speedavg')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">mph</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('speedavg', rideData.speedavg)}>
                        {`${formatNumber(rideData.speedavg)} mph`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>Max Speed</TableCell>
                  <TableCell>
                    {editingField === 'speedmax' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.speedmax}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('speedmax')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">mph</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('speedmax', rideData.speedmax)}>
                        {`${formatNumber(rideData.speedmax)} mph`}
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {/* Elevation Gain and Elevation Loss */}
                <TableRow>
                  <TableCell>Elevation Gain</TableCell>
                  <TableCell>
                    {editingField === 'elevationgain' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.elevationgain}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('elevationgain')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">feet</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('elevationgain', rideData.elevationgain)}>
                        {`${formatInteger(rideData.elevationgain)} feet`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>Elevation Loss</TableCell>
                  <TableCell>
                    {editingField === 'elevationloss' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.elevationloss}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('elevationloss')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">feet</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('elevationloss', rideData.elevationloss)}>
                        {`${formatInteger(rideData.elevationloss)} feet`}
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {/* Avg HR and Max HR */}
                <TableRow>
                  <TableCell>Avg HR</TableCell>
                  <TableCell>
                    {editingField === 'hravg' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.hravg}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('hravg')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('hravg', rideData.hravg)}>
                        {`${formatInteger(rideData.hravg)} bpm`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>Max HR</TableCell>
                  <TableCell>
                    {editingField === 'hrmax' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.hrmax}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('hrmax')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('hrmax', rideData.hrmax)}>
                        {`${formatInteger(rideData.hrmax)} bpm`}
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {/* Avg Power and Max Power */}
                <TableRow>
                  <TableCell>Avg Power</TableCell>
                  <TableCell>
                    {editingField === 'poweravg' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.poweravg}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('poweravg')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">watts</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <DisplayPower
                        power={rideData.poweravg}
                        wattsPerKilo={wattsPerKilo(rideData.poweravg, rideData.calculated_weight_kg)}
                        onClick={() => handleFieldClick('poweravg', rideData.poweravg)}
                      />
                    )}
                  </TableCell>
                  <TableCell>Max Power</TableCell>
                  <TableCell>
                    {editingField === 'powermax' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.powermax}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('powermax')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">watts</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <DisplayPower
                        power={rideData.powermax}
                        wattsPerKilo={wattsPerKilo(rideData.powermax, rideData.calculated_weight_kg)}
                        onClick={() => handleFieldClick('powermax', rideData.powermax)}
                      />
                )}
                  </TableCell>
                </TableRow>

                {/* Normalized Power and Intensity Ractor */}
                <TableRow>
                  <TableCell>Normalized Power</TableCell>
                  <TableCell>
                    {editingField === 'powernormalized' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.powernormalized}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('powernormalized')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">watts</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                        <DisplayPower
                          power={rideData.powernormalized}
                          wattsPerKilo={wattsPerKilo(rideData.powernormalized, rideData.calculated_weight_kg)}
                          onClick={() => handleFieldClick('powernormalized', rideData.powernormalized)}
                        />
                    )}
                  </TableCell>
                  <TableCell>Intensity Factor</TableCell>
                  <TableCell>
                    {editingField === 'intensityfactor' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.intensityfactor}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('intensityfactor')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">fraction</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('intensityfactor', rideData.intensityfactor)}>
                        {`${formatPercent(rideData.intensityfactor)} %`}
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {/* TSS and Trainer */}
                <TableRow>
                  <TableCell>TSS</TableCell>
                  <TableCell>
                    {editingField === 'tss' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.tss}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('tss')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"></InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('tss', rideData.tss)}>
                        {`${formatInteger(rideData.tss)}`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>Trainer</TableCell>
                  <TableCell>
                    {editingField === 'trainer' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.trainer}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('trainer')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"> 1 or 0</InputAdornment>,
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('trainer', rideData.trainer)}>
                        {`${formatBoolean(rideData.trainer)}`}
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {/* Comment */}
                <TableRow>
                  <TableCell>Comment</TableCell>
                  <TableCell colSpan={3}>
                    {editingField === 'comment' ? (
                      <TextField
                        fullWidth
                        value={editValue ?? rideData.comment}
                        onChange={handleInputChange}
                        onBlur={handleCancel}
                        onKeyUp={(e) => e.key === 'Enter' && handleSave('comment')}
                        error={!!inputError}
                        helperText={inputError}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"></InputAdornment>,
                        }}
                        placeholder='Enter a comment'
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => handleFieldClick('comment', rideData.comment)}>
                        {`${ isTextPresent(rideData.comment) ? rideData.comment  : 'Click to add a comment'}`}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="left">
                    <DownloadRideDataLink rideid={rideData.rideid} />
                  </TableCell>
                  <TableCell colSpan={2} align="right">
                    <StravaRideLink stravaRideId={rideData.stravaid} />
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
        <div>
          <ZoneTable
            zoneType={ZoneType.HR}
            zoneDefinitions={zoneDefinitionsHR}
            zoneValues={zoneValuesHR}
          />
        </div>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <div>
            <ZoneTable
              zoneType={ZoneType.Power}
              zoneDefinitions={zoneDefinitionsPower}
              zoneValues={zoneValuesPower}
            />
          </div>
        </TabPanel>

        <TabPanel value={tabIndex} index={3}>
          <div>
            <ZoneTable
              zoneType={ZoneType.Cadence}
              zoneDefinitions={zoneDefinitionsCadence}
              zoneValues={zoneValuesCadence}
            />
          </div>
        </TabPanel>

        <TabPanel value={tabIndex} index={4}>
          <MatchTable matches={rideMatches} referenceLevels={referenceLevels} weight={rideData.calculated_weight_kg} />
        </TabPanel>

        <TabPanel value={tabIndex} index={5}>
          <MetricTable metricData={rideMetricData} referenceLevels={referenceLevels} weight={rideData.calculated_weight_kg} />
        </TabPanel>

        <TabPanel value={tabIndex} index={6}>
          <SegmentTable segmentEfforts={segmentEffortData} />
        </TabPanel>

        <TabPanel value={tabIndex} index={7}>
          <SimilarRides rideid={rideData.rideid} />
        </TabPanel>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ marginTop: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        >
          Close
        </Button>
      </Paper>
    </Container>
  );
};

export default RideDetail;
