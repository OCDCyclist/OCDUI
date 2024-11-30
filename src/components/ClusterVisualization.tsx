import React, { useState } from "react";
import { Grid, CircularProgress, Alert, Stack } from "@mui/material";
import ScatterPlot from "./plotting/ScatterPlot";
import { useFetchClusterData } from "../api/clusters/fetchClusterData";
import { CentroidSelectorData, RideDataWithTagsClusters } from "../types/types";
import ClusterCentroidSelector from "./ClusterCentroidSelector";

const ClusterVisualization: React.FC = () => {
  const defaultCentroid: CentroidSelectorData =  {clusterid: 0, startyear: 0, endyear: 0, active: true};
  const token = localStorage.getItem('token');
  const [selectedCentroid, setSelectedCentroid] = useState<CentroidSelectorData>(defaultCentroid);
  const { data, loading, error } = useFetchClusterData(token || '', selectedCentroid);

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

  const handleCentroidSelection = (value: CentroidSelectorData) =>{
    if( value !== null){
      setSelectedCentroid(value);
    }
  }

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <ClusterCentroidSelector clusterCentroidSelected={selectedCentroid} onCentroidChange={handleCentroidSelection} />

      <Grid container spacing={2}>
        {dimensionPairs.map(({ x, y }, index) => (
          <Grid item xs={12} md={6} key={index}>
            <ScatterPlot data={data} xKey={x as keyof RideDataWithTagsClusters} yKey={y as keyof RideDataWithTagsClusters} fieldLabels = {fieldLabels} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ClusterVisualization;