import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import StravaLogo from '../assets/powered by Strava/pwrdBy_strava_light/api_logo_pwrdBy_strava_horiz_light.svg';
import { RideDataStrava } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateStrava: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updateResult, setUpdateResult] = useState<{
    success: boolean;
    ridesAddedCount: number;
    ridesAdded: RideDataStrava[];
  } | null>(null);

  const handleStravaUpdate = async () => {
    setLoading(true);
    setError(null);
    setUpdateResult(null);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `${API_BASE_URL}/rider/updateStrava`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUpdateResult(response.data);
    } catch (err) {
      setError(`Failed to update Strava rides. Please try again: ${err}`);
    } finally {
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
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Updating your Strava rides...
        </Typography>
        <img
          src={StravaLogo}
          alt="Powered by Strava"
          style={{ marginTop: 20, width: '80%' }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        {error ? (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        ) : updateResult ? (
          <>
            <Typography variant="h5" align="center" gutterBottom>
              Strava Update Complete!
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Success:</strong>{' '}
                  {updateResult.success ? 'Yes' : 'No'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Rides Added:</strong>{' '}
                  {updateResult.ridesAddedCount}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : null}

        <Button
          variant="contained"
          fullWidth
          onClick={handleStravaUpdate}
          sx={{ marginTop: 3 }}
        >
          {error ? 'Retry Strava Update' : 'Run Strava Update Again'}
        </Button>

        <img
          src={StravaLogo}
          alt="Powered by Strava"
          style={{
            marginTop: 20,
            width: '80%',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </Paper>
    </Container>
  );
};

export default UpdateStrava;