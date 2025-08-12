import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utilities/jwtUtils';
import {
    Container,
    Paper,
    Grid,
    Typography,
    Box,
} from '@mui/material';
import './RiderSummary.css'; // Importing CSS for additional styling
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const RiderSummary: React.FC<RiderSummaryProps> = () => {
    const [summaryData, setSummaryData] = useState<RiderSummaryData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!isTokenValid(token)) {
                localStorage.removeItem('token'); // Clear the token
                navigate('/login'); // Redirect to login
            }

            const response = await fetch(`${API_BASE_URL}/dashboard/riderSummary`, {
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
            <Box
                className="container-scroll"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // horizontal center
                    maxWidth: '100%',
                    paddingX: 1,
                }}
            >
            {/* pass down no fixed width here */}
            <SummarySection title="Today" distance={summaryData.miles_today_actual} elevation={summaryData.elevation_today_actual} time={summaryData.time_today_actual} deltaDistance="" deltaTime="" />
            <SummarySection title="This Week" distance={summaryData.miles_week_actual} elevation={summaryData.elevation_week_actual} time={summaryData.time_week_actual} deltaDistance={summaryData.miles_week_delta} deltaTime={summaryData.time_week_delta} />
            <SummarySection title="This Month" distance={summaryData.miles_month_actual} elevation={summaryData.elevation_month_actual} time={summaryData.time_month_actual} deltaDistance={summaryData.miles_month_delta} deltaTime={summaryData.time_month_delta} />
            <SummarySection title="This Year" distance={summaryData.miles_year_actual} elevation={summaryData.elevation_year_actual} time={summaryData.time_year_actual} deltaDistance={summaryData.miles_year_delta} deltaTime={summaryData.time_year_delta} />
            <SummarySectionAllTime
                title="All Time"
                distance={summaryData.miles_alltime_actual}
                elevation={summaryData.elevation_alltime_actual}
                time={summaryData.time_alltime_actual}
                distancePerDay={summaryData.miles_alltime_perday}
                elevationePerDay={summaryData.elevation_alltime_perday}
                timePerDay={summaryData.time_alltime_perday}
            />
            </Box>
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
}) => (
    <Paper
        elevation={3}
        sx={{
            backgroundColor: '#f5f5f5',
            marginBottom: '1em',
            padding: {
                xs: 1,    // small padding on very small screens
                sm: 2,    // medium padding on small+ screens
                md: 3,    // larger padding on medium+ screens
            },
            textAlign: 'center',
            width: {
                xs: '90vw',   // almost full viewport width on extra-small screens
                sm: 500,      // 500px on small+ screens
                md: 600,      // 600px on medium+ screens
            },
            boxSizing: 'border-box', // important for padding + width
            minWidth: 300, // set a min-width below which horizontal scroll will trigger
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
}) => (
    <Paper
        elevation={3}
        sx={{
            backgroundColor: '#f5f5f5',
            marginBottom: '1em',
            padding: {
                xs: 1,    // small padding on very small screens
                sm: 2,    // medium padding on small+ screens
                md: 3,    // larger padding on medium+ screens
            },
            textAlign: 'center',
            width: {
                xs: '90vw',   // almost full viewport width on extra-small screens
                sm: 500,      // 500px on small+ screens
                md: 600,      // 600px on medium+ screens
            },
            boxSizing: 'border-box', // important for padding + width
            minWidth: 300, // set a min-width below which horizontal scroll will trigger
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
