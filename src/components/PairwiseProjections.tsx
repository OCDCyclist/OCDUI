import React from "react";
import { Grid, CircularProgress, Alert } from "@mui/material";
import ScatterPlot from "./plotting/ScatterPlot";
import { useFetchClusterData } from "../api/clusters/fetchClusterData";
import { RideDataWithTagsClusters } from "../types/types";

const PairwiseProjections: React.FC = () => {

  const token = localStorage.getItem('token');

  const { data, loading, error } = useFetchClusterData(token || '', 2015, 2015);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const dimensionPairs = [
    { x: "distance", y: "speedavg" },
    { x: "distance", y: "elevationgain" },
    { x: "distance", y: "hravg" },
    { x: "distance", y: "powernormalized" },

    { x: "speedavg", y: "elevationgain" },
    { x: "speedavg", y: "hravg" },
    { x: "speedavg", y: "powernormalized" },

    { x: "elevationgain", y: "hravg" },
    { x: "elevationgain", y: "powernormalized" },

    { x: "hravg", y: "powernormalized" },
  ];

  const fieldLabels: Record<string, string> = {
    distance: "Distance",
    speedavg: "Avg Speed",
    elevationgain: "Elevation Gain",
    hravg: "Avg HR",
    powernormalized: "Normalized Power",
  };

  return (
    <Grid container spacing={2}>
      {dimensionPairs.map(({ x, y }, index) => (
        <Grid item xs={12} md={6} key={index}>
          <ScatterPlot data={data} xKey={x as keyof RideDataWithTagsClusters} yKey={y as keyof RideDataWithTagsClusters} fieldLabels = {fieldLabels} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PairwiseProjections;
