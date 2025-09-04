import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import StravaLogo from '../assets/powered by Strava/pwrdBy_strava_light/api_logo_pwrdBy_strava_horiz_light.svg';
import { RideDataStrava } from '../types/types';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateStrava: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [updateResult, setUpdateResult] = useState<{ success: boolean; ridesAddedCount: number, ridesAdded: RideDataStrava[] } | null>(null);

  const handleStravaUpdate = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${API_BASE_URL}/rider/updateStrava`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUpdateResult(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to update Strava rides. Please try again: ${err}`);
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
          Updating your Strava rides...
        </Typography>
        <img src={StravaLogo} alt="Powered by Strava" style={{ marginTop: 20, width: '80%' }} /> {/* Add image */}
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
            Strava Update Complete!
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" component={"span"}>
                <strong>Success:</strong> {updateResult.success ? 'Yes' : 'No'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component={"span"}>
                <strong>Rides Added:</strong> {updateResult.ridesAddedCount}
              </Typography>
            </Grid>
          </Grid>

          <img src={StravaLogo} alt="Powered by Strava" style={{ marginTop: 20, width: '80%' }} />
        </Paper>
      </Container>
    );
  }

  return null;
};

export default UpdateStrava;
