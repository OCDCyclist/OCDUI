import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const UpdateMetrics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [updateResult, setUpdateResult] = useState<{ status: boolean; message: string } | null>(null); // Success response state

  // Function to handle Strava Update
  const handleStravaUpdate = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

    try {
      const response = await axios.get('http://localhost:3000/ride/updateMetrics', {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      });

      setUpdateResult(response.data);
      setLoading(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to update rider metrics rides. Please try again.');
      setLoading(false);
    }
  };

  // Run the update function when the component is mounted
  useEffect(() => {
    handleStravaUpdate();
  }, []);

  // If loading, show a spinner
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ marginY: 5, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Updating your rider metrics...
        </Typography>
      </Container>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ marginY: 5 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Paper>
      </Container>
    );
  }

  // If we have the result, show the success message with data
  if (updateResult) {
    return (
      <Container maxWidth="sm" sx={{ marginY: 5 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Rider Metrics Update Complete!
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Success:</strong> {updateResult.status ? 'Yes' : 'No'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Message:</strong> {updateResult.message}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: 3 }}>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" onClick={handleStravaUpdate}>
                Update Again (probably not necessary)
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  return null; // Render nothing by default until the component is loaded
};

export default UpdateMetrics;
