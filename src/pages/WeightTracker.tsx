import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utilities/jwtUtils';
import {
    Container,
    Paper,
    Grid,
    Typography,
} from '@mui/material';
import WeightChart from '../components/plotting/WeightChart';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface WeightTrackerData {
    date: string;
    weight: number;
    weight7: number;
    weight30: number;
    weight365: number;
    bodyfatfraction: number;
    bodyfatfraction7: number;
    bodyfatfraction30: number;
    bodyfatfraction365: number;
    bodyh2ofraction: number;
    bodyh2ofraction7: number;
    bodyh2ofraction30: number;
    bodyh2ofraction365: number;
}

const WeightTracker: React.FC = () => {
    const [weightData, setWeightData] = useState<WeightTrackerData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!isTokenValid(token)) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/weighttracker`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch data:', response.statusText);
                return;
            }

            const data: WeightTrackerData = await response.json();
            setWeightData(data);
        };

        fetchData();
    }, [navigate]);

    if (!weightData) return <div>Loading...</div>;

    const formatPercent = (fraction: number) => {
        return fraction ? (fraction * 100).toFixed(1) : 0.0;
    };

    const formatNumber = (num: number) => {
        return num ? num.toFixed(1) : 0.0; // Round to 1 decimal place
    };

    const formatDate = (dateString: string) => {
      if( !dateString) return '';
      const date = new Date(dateString);

      const datePart = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(date);

      return `${datePart}`;
    };

    return(
      <Container maxWidth="md" sx={{ marginY: 5 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography
            variant="h5"
            align="center"
            component={"span"}
            paddingBottom={3}
          >
            Weight Tracker
          </Typography>
          <Grid container spacing={2}>
            {/* Header Row */}
            <Grid item xs={3}><Typography variant="h6" component={"span"}></Typography></Grid>
            <Grid item xs={3}><Typography variant="h6" component={"span"} sx={{ textAlign: 'right' }}>{`${formatDate(weightData.date)}`}</Typography></Grid>
            <Grid item xs={2}><Typography variant="h6" component={"span"} sx={{ textAlign: 'right' }}>7 Day Avg</Typography></Grid>
            <Grid item xs={2}><Typography variant="h6" component={"span"} sx={{ textAlign: 'right' }}>30 Day Avg</Typography></Grid>
            <Grid item xs={2}><Typography variant="h6" component={"span"} sx={{ textAlign: 'right' }}>365 Day Avg</Typography></Grid>

            {/* Weight Row */}
            <Grid item xs={4}><Typography>Weight (lbs)</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatNumber(weightData.weight)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatNumber(weightData.weight7)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatNumber(weightData.weight30)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatNumber(weightData.weight365)}</Typography></Grid>

            {/* Body Fat Row */}
            <Grid item xs={4}><Typography component={"span"}>Body Fat (%)</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyfatfraction)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyfatfraction7)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyfatfraction30)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyfatfraction365)}</Typography></Grid>

            {/* Body H2O Row */}
            <Grid item xs={4}><Typography component={"span"}>Body H2O (%)</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyh2ofraction)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyh2ofraction7)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyh2ofraction30)}</Typography></Grid>
            <Grid item xs={2}><Typography component={"span"} sx={{ textAlign: 'right' }}>{formatPercent(weightData.bodyh2ofraction365)}</Typography></Grid>
          </Grid>

          <WeightChart />
        </Paper>
      </Container>

    )
};

export default WeightTracker;
