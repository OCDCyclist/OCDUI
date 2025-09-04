import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const response = await axios.get(`${API_BASE_URL}/ride/updateMetrics`, {
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

  useEffect(() => {
    handleStravaUpdate();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ marginY: 5, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: 2 }} component={"span"}>
          Updating your rider metrics...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ marginY: 5 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Paper>
      </Container>
    );
  }

  if (updateResult) {
    return (
      <Container maxWidth="sm" sx={{ marginY: 5 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" align="center" component={"span"} gutterBottom>
            Rider Metrics Update Complete!
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" component={"span"}>
                <strong>Success:</strong> {updateResult.status ? 'Yes' : 'No'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component={"span"}>
                <strong>Message:</strong> {updateResult.message}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  return null; // Render nothing by default until the component is loaded
};

export default UpdateMetrics;
