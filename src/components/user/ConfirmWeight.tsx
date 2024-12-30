import React from 'react';
import { Container, Paper, Typography, Grid } from '@mui/material';

// Define the WeightReading interface
interface WeightReading {
  date: string;
  weight: string;
  bodyfatfraction: string;
  bodyh2ofraction: string;
}

// ConfirmWeight Component
const ConfirmWeight: React.FC<{ weightData: WeightReading }> = ({ weightData }) => {
  const formattedDate = new Date(weightData.date).toLocaleDateString();
  const weight = `${weightData.weight} lbs`; // Weight in lbs
  const bodyFat = `${(parseFloat(weightData.bodyfatfraction) * 100).toFixed(1)}%`;
  const bodyWater = `${(parseFloat(weightData.bodyh2ofraction) * 100).toFixed(1)}%`;

  return (
    <Container maxWidth="sm" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" gutterBottom component={"span"}>
          Weight Measurement Confirmation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" component={"span"}>Date:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" component={"span"}>{formattedDate}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle1" component={"span"}>Weight:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" component={"span"}>{weight}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle1" component={"span"}>Body Fat:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" component={"span"}>{bodyFat}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle1" component={"span"}>Body Water:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" component={"span"}>{bodyWater}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ConfirmWeight;
