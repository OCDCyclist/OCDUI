import React, { useState } from "react";
import { Grid, Alert, Stack } from "@mui/material";
import ScatterPlot from "./plotting/ScatterPlot";
import { useFetchClusterData } from "../api/clusters/useFetchClusterData";
import { CentroidSelectorData, RideDataWithTagsClusters } from "../types/types";
import ClusterCentroidSelector from "./ClusterCentroidSelector";
import LinearLoader from "./loaders/LinearLoader";
import { useFetchCentroidOptions } from "../api/clusters/useFetchCentroidOptions";

function getUniqueColorsPerCluster(data: RideDataWithTagsClusters[]): Record<number, string> {
  const uniqueColors: Record<number, string> = {};

  for (const ride of data) {
    const { clusterindex, color } = ride;
    if( typeof(clusterindex) === 'number' && typeof(color) === 'string' ){
      if (!uniqueColors[clusterindex]) {
        uniqueColors[clusterindex] = color;
      }
    }
  }

  return uniqueColors;
}

function getColorsAsArray(uniqueColors: Record<number, string>): string[] {
  // Get the cluster indices in ascending order
  const sortedIndices = Object.keys(uniqueColors).map(Number).sort((a, b) => a - b);

  // Get the colors in the order of sorted indices
  const orderedColors = sortedIndices.map(index => uniqueColors[index]);

  return orderedColors;
}

const ClusterVisualization: React.FC = () => {
  const defaultCentroid: CentroidSelectorData = { clusterid: 0, startyear: 0, endyear: 0, active: true };
  const token = localStorage.getItem("token");
  const { data: dataClusterOptions, loading: loadingClusterOptions, error: errorClusterOptions } = useFetchCentroidOptions(token ?? "");

  const [selectedCentroid, setSelectedCentroid] = useState<CentroidSelectorData>(defaultCentroid);
  const { data, loading, error, fetchClusterData } = useFetchClusterData();

  const handleCentroidSelection = (value: CentroidSelectorData) => {
    if (value !== null) {
      setSelectedCentroid(value);
      fetchClusterData(token || "", value);
    }
  };

  if (loadingClusterOptions) return <LinearLoader message="Loading cluster options" />;
  if (errorClusterOptions) return <Alert severity="error">{`Error loading cluster options: ${errorClusterOptions}`}</Alert>;

  if (loading) return <LinearLoader message="Loading cluster visualizations" />;
  if (error) return <Alert severity="error">{`Error loading cluster data: ${error}`}</Alert>;

  if(selectedCentroid.clusterid === 0 && Array.isArray(dataClusterOptions) && dataClusterOptions.length > 0){
    handleCentroidSelection(dataClusterOptions.find((centroid) => centroid.active) || dataClusterOptions[0])
  }

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

  let colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"]; // Colors for clusters

  if( Array.isArray(data) && data.length > 0){
    const uniqueColorsPerCluster = getUniqueColorsPerCluster(data);
    const testColor = getColorsAsArray(uniqueColorsPerCluster);
    colors = testColor;
  }

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <ClusterCentroidSelector
        clustersAvailable={dataClusterOptions}
        clusterCentroidSelected={selectedCentroid}
        onCentroidChange={handleCentroidSelection}
      />

      <Grid container spacing={2}>
        {dimensionPairs.map(({ x, y }, index) => (
          <Grid item xs={12} md={6} key={index}>
            <ScatterPlot
              data={data}
              xKey={x as keyof RideDataWithTagsClusters}
              yKey={y as keyof RideDataWithTagsClusters}
              fieldLabels={fieldLabels}
              colors={colors}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ClusterVisualization;
