import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utilities/jwtUtils';
import {
  Container,
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import WeightTracker from './WeightTracker';


const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// WeightReading Interface
interface WeightReading {
  date: string;
  weight: string;
  bodyfatfraction: string;
  bodyh2ofraction: string;
}

const defaultWeightMeasurement: WeightReading = {date: getTodayDate(), weight: "150", bodyfatfraction: "0.10", bodyh2ofraction: "0.55" };

// Component to add a new weight measurement
const AddWeightForm: React.FC = () => {
  const [date, setDate] = useState<string>(getTodayDate());  // Date string in 'YYYY-MM-DD'
  const [weight, setWeight] = useState<number | string>('');
  const [bodyfatfraction, setBodyfatfraction] = useState<number | string>('');
  const [bodyh2ofraction, setBodyh2ofraction] = useState<number | string>('');
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  const [error, setError] = useState<string | null>(null); // For error state
  const [weightData, setWeightData] = useState<WeightReading>(null as unknown as WeightReading); // For success response

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!isTokenValid(token)) {
      localStorage.removeItem('token');
      navigate('/login');
    }

    const formattedDateTime = `${date}`;
    // Build the payload
    const payload = {
      date: formattedDateTime,
      weight: Number(weight),
      bodyfatfraction: Number(bodyfatfraction),
      bodyh2ofraction: Number(bodyh2ofraction)
    };

    try {
      const response = await fetch('http://localhost:3000/addWeight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setWeightData(data); // Store the returned weight data
        setLoading(false);
      } else {
        setError('Failed to add weight');
        setLoading(false);
      }
    } catch (error) {
      setError(`Error adding weight: ${error}`);
      setLoading(false);
    }
  };

  // Handle add another weight measurement button
  const handleAddAnotherWeight = () => {
    setWeightData(defaultWeightMeasurement); // Clear success state to show form again
  };

  // Handle navigation to weighttracker
  const handleGoToWeightTracker = () => {
    navigate('/rider/weighttracker');
  };

  const ErrorComponent = ({ error }: { error: string }) => (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={handleAddAnotherWeight}>
              Try Again
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" onClick={handleGoToWeightTracker}>
              Go to Weight Tracker
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

  if (weightData) {
    return <WeightTracker />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
        >
          Record a Weight Measurement
        </Typography>

        <form onSubmit={handleSubmit} >
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

            {/* Weight */}
            <Grid item xs={12}>
              <TextField
                label="Weight (lbs)"
                fullWidth
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">lbs</InputAdornment> }}
              />
            </Grid>

            {/* Body Fat fraction */}
            <Grid item xs={6}>
              <TextField
                label="Body Fat Fraction"
                fullWidth
                type="number"
                value={bodyfatfraction}
                onChange={(e) => setBodyfatfraction(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Body H2O Fraction"
                fullWidth
                type="number"
                value={bodyh2ofraction}
                onChange={(e) => setBodyh2ofraction(e.target.value)}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" color="primary">
                Submit Weight
              </Button>
            </Grid>
          </Grid>
        </form>
       </Paper>
    </Container>
  );
};

export default AddWeightForm;
