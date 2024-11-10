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
  Link,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { formatBoolean, formatDate, formatInteger, formatNumber, formatPercent, isTextPresent } from '../utilities/formatUtilities';
import { useNavigate } from 'react-router-dom';
import { Bike, RideData } from '../types/types';
import { isBooleanString, isStringInteger, isStringNumber } from '../utilities/validation';
import LinearIndeterminate from '../components/loaders/LinearIndeterminate';
import { isTokenValid } from '../utilities/jwtUtils';
import ElapsedTimeEditor from './ElapsedTimeEditor';

interface RideDetailProps {
  rideData: RideData;
  onClose: () => void;
}

const RideDetail = ({ rideData: initialRideData, onClose }: RideDetailProps) => {
  const [rideData, setRideData] = useState<RideData>(initialRideData); // For success response
  const [bikes, setBikes] = useState<Bike[]>([]); // Bikes data
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | number >('');
  const [inputError, setInputError] = useState<string | null>(null); // Tracks validation errors
  const [loading, setLoading] = useState<boolean>(false); // For loading state when updating
  const [error, setError] = useState<string | null>(null); // For error state when updating
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch bikes from the API
    const fetchBikes = async () => {

      try {
        const token = localStorage.getItem('token');

        if (!isTokenValid(token)) {
          localStorage.removeItem('token'); // Clear the token
          navigate('/login'); // Redirect to login
        }

        const response = await fetch('http://localhost:3000/bikes', {
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

  if (!rideData) {
    return <Typography variant="h6">No ride data available.</Typography>;
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
      const url = `http://localhost:3000/ride/${rideData.rideid}/update`;
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
      const url = `http://localhost:3000/ride/${rideData.rideid}/update`;
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

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <Container maxWidth="xl" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: '0 auto' }}>
        { loading ? <LinearIndeterminate /> : null}


        <Typography variant="h5" align="center" paddingBottom={3}>
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
            <span onClick={() => handleFieldClick('title', rideData.title)}>{rideData.title || 'Ride Detail'}</span>
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
                      handleSaveElapsedTime('elapsedtime');
                  }} />
                </TableCell>
              </TableRow>

              {/* Distnace */}
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
                          onChange={(e: { target: { value: unknown; }; }) => {
                            setEditValue(Number(e.target.value));
                            handleSave('bikeid');
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
                        <Typography variant='body2'>{`${rideData.bikename}`}</Typography>
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
                    <span onClick={() => handleFieldClick('poweravg', rideData.poweravg)}>
                      {`${formatInteger(rideData.poweravg)} watts`}
                    </span>
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
                    <span onClick={() => handleFieldClick('powermax', rideData.powermax)}>
                      {`${formatInteger(rideData.powermax)} watts`}
                    </span>
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
                    <span onClick={() => handleFieldClick('powernormalized', rideData.powernormalized)}>
                      {`${formatInteger(rideData.powernormalized)} watts`}
                    </span>
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
                <TableCell colSpan={4} align="right">
                  <Link target="_blank" href={`https://www.strava.com/activities/${rideData.stravaid}`}>Open in Strava</Link>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>

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
