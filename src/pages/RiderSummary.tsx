import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utilities/jwtUtils';
import {
    Container,
    Paper,
    Grid,
    Typography,
} from '@mui/material';
import './RiderSummary.css'; // Importing CSS for additional styling

interface RiderSummaryData {
    date: string;
    miles_today_actual: string;
    miles_week_actual: string;
    miles_month_actual: string;
    miles_year_actual: string;
    miles_alltime_actual: string;
    miles_week_target: string;
    miles_month_target: string;
    miles_year_target: string;
    miles_week_delta: string;
    miles_month_delta: string;
    miles_year_delta: string;
    miles_week_perday: string;
    miles_month_perday: string;
    miles_year_perday: string;
    miles_alltime_perday: string;
    elevation_today_actual: string;
    elevation_week_actual: string;
    elevation_month_actual: string;
    elevation_year_actual: string;
    elevation_alltime_actual: string;
    elevation_alltime_perday: string;
    time_today_actual: string;
    time_week_actual:string;
    time_month_actual: string;
    time_year_actual: string;
    time_alltime_actual: string;
    time_week_target: string;
    time_month_target: string;
    time_year_target: string;
    time_week_delta: string;
    time_month_delta: string;
    time_year_delta: string;
    time_week_perday: string;
    time_month_perday: string;
    time_year_perday: string;
    time_alltime_perday: string;
    total_days_alltime: number;
}

interface RiderSummaryProps {
    paperWidth?: number; // Optional prop to control the width of the Paper component
}

const RiderSummary: React.FC<RiderSummaryProps> = ({ paperWidth = 600 }) => {
    const [summaryData, setSummaryData] = useState<RiderSummaryData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!isTokenValid(token)) {
                localStorage.removeItem('token'); // Clear the token
                navigate('/login'); // Redirect to login
            }

            const response = await fetch('http://localhost:3000/dashboard/riderSummary', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch data:', response.statusText);
                return;
            }

            const data: RiderSummaryData = await response.json();
            setSummaryData(data);
        };

        fetchData();
    }, []);

    if (!summaryData) return <div>Loading...</div>;

    return (
        <Container sx={{ marginY: 0 }}>
            <SummarySection
                title="Today"
                distance={summaryData.miles_today_actual}
                elevation={summaryData.elevation_today_actual}
                time={summaryData.time_today_actual}
                deltaDistance=""
                deltaTime=""
                paperWidth={paperWidth}
            />
            <SummarySection
                title="This Week"
                distance={summaryData.miles_week_actual}
                elevation={summaryData.elevation_week_actual}
                time={summaryData.time_week_actual}
                deltaDistance={summaryData.miles_week_delta}
                deltaTime={summaryData.time_week_delta}
                paperWidth={paperWidth}
            />
            <SummarySection
                title="This Month"
                distance={summaryData.miles_month_actual}
                elevation={summaryData.elevation_month_actual}
                time={summaryData.time_month_actual}
                deltaDistance={summaryData.miles_month_delta}
                deltaTime={summaryData.time_month_delta}
                paperWidth={paperWidth}
            />
            <SummarySection
                title="This Year"
                distance={summaryData.miles_year_actual}
                elevation={summaryData.elevation_year_actual}
                time={summaryData.time_year_actual}
                deltaDistance={summaryData.miles_year_delta}
                deltaTime={summaryData.time_year_delta}
                paperWidth={paperWidth}
            />
            <SummarySectionAllTime
                title="All Time"
                distance={summaryData.miles_alltime_actual}
                elevation={summaryData.elevation_alltime_actual}
                time={summaryData.time_alltime_actual}
                distancePerDay={summaryData.miles_alltime_perday}
                elevationePerDay={summaryData.elevation_alltime_perday}
                timePerDay={summaryData.time_alltime_perday}
                paperWidth={paperWidth}
            />
        </Container>
    );
};

interface SummarySectionProps {
    title: string;
    distance: string;
    elevation: string;
    time: string;
    deltaDistance?: string;
    deltaTime?: string;
    paperWidth?: number;
}

interface SummarySectionAllTimeProps {
    title: string;
    distance: string;
    elevation: string;
    time: string;
    distancePerDay: string;
    elevationePerDay: string;
    timePerDay: string;
    paperWidth?: number;
}

const formatNumber = (num: string) => {
    return Number(num).toLocaleString(); // Format number with commas
};

const formatNumber2 = (num: string | number, decimalPlaces: number = 0) => {
    return Number(num).toLocaleString(undefined, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
};

const renderDelta = (delta: string) => {
    const deltaValue = Number(delta);
    const isPositive = deltaValue >= 0;
    return (
        <Typography variant="body2" className={isPositive ? 'positive' : 'negative'} component="span">
            {formatNumber2(delta, 1)}
        </Typography>
    );
};

const SummarySection: React.FC<SummarySectionProps> = ({
    title,
    distance,
    elevation,
    time,
    deltaDistance,
    deltaTime,
    paperWidth = 600,
}) => (
    <Paper
        elevation={3}
        sx={{
            backgroundColor: '#f5f5f5',
            marginBottom: '1em',
            padding: 2,
            textAlign: 'center',
            width: paperWidth // Control the width of the Paper
        }}
    >
        <Typography variant="h6" component="span">{title}</Typography>

        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span"></Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span"></Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" style={{ fontSize: '14px' }} component="span">{deltaDistance ? "Per Pace" : ""}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span"></Typography>
            </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">Distance:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{formatNumber2(distance, 1)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">mi</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{deltaDistance && renderDelta(deltaDistance)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{deltaDistance ? "mi" : ""}</Typography>
            </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">Elevation Gain:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{formatNumber(elevation)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">ft</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
            </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">Time:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{formatNumber2(time, 1)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">hr</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{deltaTime && renderDelta(deltaTime)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{deltaDistance ? "hr" : ""}</Typography>
            </Grid>
        </Grid>
    </Paper>
);

const SummarySectionAllTime: React.FC<SummarySectionAllTimeProps> = ({
    title,
    distance,
    elevation,
    time,
    distancePerDay,
    elevationePerDay,
    timePerDay,
    paperWidth = 600,
}) => (
    <Paper
        elevation={3}
        sx={{
            backgroundColor: '#f5f5f5',
            marginBottom: '1em',
            padding: 2,
            textAlign: 'center',
            width: paperWidth // Control the width of the Paper
        }}
    >
        <Typography variant="h6">{title}</Typography>
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span"></Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span"></Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span" style={{ fontSize: '14px' }}>Per Day</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span"></Typography>
            </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">Distance:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{formatNumber2(distance, 1)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">mi</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{formatNumber2(distancePerDay,2)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">mi</Typography>
            </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">Elevation Gain:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{formatNumber(elevation)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">ft</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
            <Typography variant="body1" component="span">{formatNumber(elevationePerDay)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{elevationePerDay ? "ft" : ""}</Typography>
            </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">Time:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{formatNumber2(time, 1)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">hr</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Typography variant="body1" component="span">{timePerDay && formatNumber2(timePerDay,1)}</Typography>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                <Typography variant="body1">{timePerDay ? "hr" : ""}</Typography>
            </Grid>
        </Grid>
    </Paper>
);

export default RiderSummary;
