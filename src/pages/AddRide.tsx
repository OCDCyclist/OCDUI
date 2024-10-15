import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';

// Bike Interface
interface Bike {
  bikeid: number;
  bikename: string;
  stravaname: string;
  isdefault: number;
}

import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utilities/jwtUtils';
// Component to add a new ride
const AddRideForm: React.FC = () => {
  const [date, setDate] = useState<string>('');  // Date string in 'YYYY-MM-DD'
  const [time, setTime] = useState<string>('');  // Time string in 'HH:mm:ss'
  const [distance, setDistance] = useState<number | string>('');
  const [speedAvg, setSpeedAvg] = useState<number | string>('');
  const [speedMax, setSpeedMax] = useState<number | string>('');
  const [cadence, setCadence] = useState<number | string>('');
  const [hrAvg, setHrAvg] = useState<number | string>('');
  const [hrMax, setHrMax] = useState<number | string>('');
  const [title, setTitle] = useState<string>('');
  const [powerAvg, setPowerAvg] = useState<number | string>('');
  const [powerMax, setPowerMax] = useState<number | string>('');
  const [bikeID, setBikeID] = useState<number>(0); // Initial bikeID to store selected bike
  const [bikes, setBikes] = useState<Bike[]>([]); // Bikes data
  const [stravaID, setStravaID] = useState<number | string>('');
  const [comment, setComment] = useState<string>('');
  const [elevationGain, setElevationGain] = useState<number | string>('');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [powerNormalized, setPowerNormalized] = useState<number | string>('');
  const [trainer, setTrainer] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  const [error, setError] = useState<string | null>(null); // For error state
  const [rideData, setRideData] = useState<unknown>(null); // For success response

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

          // Find and set the default bike
          const defaultBike = data.find((bike: Bike) => bike.isdefault === 1);
          if (defaultBike) {
            setBikeID(defaultBike.bikeid);
          }
        } else {
          setError('Failed to fetch bikes');
        }
      } catch (error) {
        setError('Error fetching bikes: ' + error);
      }
    };

    fetchBikes();
  }, []);

  // Convert elapsed time fields to hh:mm:ss
  const formatElapsedTime = (): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const formattedDateTime = `${date} ${time}`;
    // Build the payload
    const payload = {
      date: formattedDateTime,
      distance: Number(distance),
      speedAvg: Number(speedAvg),
      speedMax: Number(speedMax),
      cadence: Number(cadence),
      hrAvg: Number(hrAvg),
      hrMax: Number(hrMax),
      title,
      powerAvg: Number(powerAvg),
      powerMax: Number(powerMax),
      bikeID: Number(bikeID),
      stravaID: Number(stravaID),
      comment,
      elevationGain: Number(elevationGain),
      elapsedTime: formatElapsedTime(),
      powerNormalized: Number(powerNormalized),
      trainer
    };

    try {
      const response = await fetch('http://localhost:3000/addRide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setRideData(data); // Store the returned ride data
        setLoading(false);
      } else {
        setError('Failed to add ride');
        setLoading(false);
      }
    } catch (error) {
      setError('Error adding ride: ' + error);
      setLoading(false);
    }
  };

  // Handle add another ride button
  const handleAddAnotherRide = () => {
    setRideData(null); // Clear success state to show form again
  };

  // Handle navigation to dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Read-Only Success Component
  const RideSuccess = ({ ride }: { ride: unknown }) => (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Ride Added Successfully!
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Ride ID:</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{ride.rideid}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1"><strong>Date:</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{ride.date}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1"><strong>Distance:</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{ride.distance} mi</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1"><strong>Avg Speed:</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{ride.speedAvg} mi/h</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1"><strong>Max Speed:</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{ride.speedMax} mi/h</Typography>
          </Grid>

        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={handleAddAnotherRide}>
              Add Another Ride
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );

  // Error Component
  const ErrorComponent = ({ error }: { error: string }) => (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={handleAddAnotherRide}>
              Try Again
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ marginY: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (rideData) {
    return <RideSuccess ride={rideData} />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add a New Ride
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Date Field */}
            <Grid item xs={12}>
              <TextField
                label="Date (YYYY-MM-DD)"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </Grid>

            {/* Time Field */}
            <Grid item xs={12}>
              <TextField
                label="Time (HH:mm:ss)"
                fullWidth
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="HH:mm:ss"
              />
            </Grid>


            {/* Distance */}
            <Grid item xs={12}>
              <TextField
                label="Distance (mi)"
                fullWidth
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">mi</InputAdornment> }}
              />
            </Grid>

            {/* Speed Avg and Max */}
            <Grid item xs={6}>
              <TextField
                label="Avg Speed (mi/h)"
                fullWidth
                type="number"
                value={speedAvg}
                onChange={(e) => setSpeedAvg(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Speed (mi/h)"
                fullWidth
                type="number"
                value={speedMax}
                onChange={(e) => setSpeedMax(e.target.value)}
              />
            </Grid>

            {/* Cadence */}
            <Grid item xs={12}>
              <TextField
                label="Cadence (rpm)"
                fullWidth
                type="number"
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
              />
            </Grid>

            {/* Heart Rate Avg and Max */}
            <Grid item xs={6}>
              <TextField
                label="Avg Heart Rate (bpm)"
                fullWidth
                type="number"
                value={hrAvg}
                onChange={(e) => setHrAvg(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Heart Rate (bpm)"
                fullWidth
                type="number"
                value={hrMax}
                onChange={(e) => setHrMax(e.target.value)}
              />
            </Grid>

            {/* Title */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            {/* Power Avg and Max */}
            <Grid item xs={6}>
              <TextField
                label="Avg Power (W)"
                fullWidth
                type="number"
                value={powerAvg}
                onChange={(e) => setPowerAvg(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Power (W)"
                fullWidth
                type="number"
                value={powerMax}
                onChange={(e) => setPowerMax(e.target.value)}
              />
            </Grid>

            {/* Bike ID and Strava ID */}

            {/* Bike Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="bike-select-label">Select Bike</InputLabel>
                <Select
                  labelId="bike-select-label"
                  value={bikeID}
                  onChange={(e) => setBikeID(Number(e.target.value))}
                  fullWidth
                >
                  {bikes.map((bike) => (
                    <MenuItem key={bike.bikeid} value={bike.bikeid}>
                      {bike.bikename}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Strava ID"
                fullWidth
                type="number"
                value={stravaID}
                onChange={(e) => setStravaID(e.target.value)}
              />
            </Grid>

            {/* Comment */}
            <Grid item xs={12}>
              <TextField
                label="Comment"
                fullWidth
                multiline
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>

            {/* Elevation Gain */}
            <Grid item xs={12}>
              <TextField
                label="Elevation Gain (m)"
                fullWidth
                type="number"
                value={elevationGain}
                onChange={(e) => setElevationGain(e.target.value)}
              />
            </Grid>

            {/* Elapsed Time */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Hours</InputLabel>
                <Select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                  {[...Array(24).keys()].map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Minutes</InputLabel>
                <Select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
                  {[...Array(60).keys()].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Seconds</InputLabel>
                <Select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>
                  {[...Array(60).keys()].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Power Normalized */}
            <Grid item xs={12}>
              <TextField
                label="Power Normalized (W)"
                fullWidth
                type="number"
                value={powerNormalized}
                onChange={(e) => setPowerNormalized(e.target.value)}
              />
            </Grid>

            {/* Trainer */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trainer</InputLabel>
                <Select value={trainer} onChange={(e) => setTrainer(Number(e.target.value))}>
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" color="primary">
                Submit Ride
              </Button>
            </Grid>
          </Grid>
        </form>
       </Paper>
    </Container>
  );
};

export default AddRideForm;
