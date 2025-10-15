import React, { useState } from 'react';
import { isTokenValid } from '../utilities/jwtUtils';
import {
  Container,
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const RecalcCummulatives: React.FC = () => {
  const [date, setDate] = useState<string>(getTodayDate());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    if (!isTokenValid(token)) {
      localStorage.removeItem('token');
      setLoading(false);
      setError('You are not logged in. Please login and try again.');
      }

    const formattedDateTime = `${date}`;
    // Build the payload
    const payload = {
      date: formattedDateTime
    };

    try {
      const response = await fetch(`${API_BASE_URL}/ocds/refresh/cummulatives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError('Failed to add weight');
        setCompleted(false);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      setError(`Error recalculating cummulatives weight: ${error}`);
    }
    finally{
      setLoading(false);
    }
  };

  const ErrorComponent = ({ error }: { error: string }) => (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Alert severity="error">{error}</Alert>
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

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <Container maxWidth="sm" sx={{ marginY: 10 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
        >
          Recal Cummulatives from Date
        </Typography>

        <form onSubmit={handleSubmit} >
          <Grid container spacing={2} sx={{ paddingTop: 4 }}>
            <Grid item xs={12}>
              <TextField
                label="Date (YYYY-MM-DD)"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                disabled={completed}
              />
            </Grid>

            <Grid item xs={12} sx={{ paddingTop: 4 }}>
              {completed ? (
                <Typography
                  variant="body1"
                  align="center"
                  color="success.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  Cummulatives are recalculated
                </Typography>
              ) : (
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit Date
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
       </Paper>
    </Container>
  );
};

export default RecalcCummulatives;
