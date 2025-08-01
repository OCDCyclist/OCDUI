import React, { useState } from 'react';
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
import ConfirmWeight from '../components/user/ConfirmWeight';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!isTokenValid(token)) {
      localStorage.removeItem('token');
      setLoading(false);
      setWeightData(defaultWeightMeasurement);
      setError('You are not logged in. Please login and try again.');
      }

    const formattedDateTime = `${date}`;
    // Build the payload
    const payload = {
      date: formattedDateTime,
      weight: Number(weight),
      bodyfatfraction: Number(bodyfatfraction) / 100.0,
      bodyh2ofraction: Number(bodyh2ofraction) / 100.0
    };

    try {
      const response = await fetch(`${API_BASE_URL}/addWeight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setWeightData(data);
      } else {
        setWeightData(defaultWeightMeasurement);
        setError('Failed to add weight');
      }
    } catch (error) {
      setError(`Error adding weight: ${error}`);
    }
    finally{
      setLoading(false);
    }
  };

  const handleAddAnotherWeight = () => {
    setWeightData(defaultWeightMeasurement);
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
    return <ConfirmWeight weightData = {weightData}/>;
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
            <Grid item xs={12}>
              <TextField
                label="Date (YYYY-MM-DD)"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </Grid>

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

            <Grid item xs={6}>
              <TextField
                label="Body Fat Percent"
                fullWidth
                type="number"
                value={bodyfatfraction}
                onChange={(e) => setBodyfatfraction(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Body H2O Percent"
                fullWidth
                type="number"
                value={bodyh2ofraction}
                onChange={(e) => setBodyh2ofraction(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              />
            </Grid>

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
