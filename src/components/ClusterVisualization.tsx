import React, { useState } from "react";
import { Grid, Alert, Stack, List, ListItemText, Button, Typography, Box, ListItemButton } from "@mui/material";
import ScatterPlot from "./plotting/ScatterPlot";
import { useFetchClusterData } from "../api/clusters/useFetchClusterData";
import { CentroidSelectorData, RideDataWithTagsClusters } from "../types/types";
import ClusterCentroidSelector from "./ClusterCentroidSelector";
import LinearLoader from "./loaders/LinearLoader";
import { useFetchCentroidOptions } from "../api/clusters/useFetchCentroidOptions";
import { formatDate } from "../utilities/formatUtilities";

function getUniqueColorsPerCluster(data: RideDataWithTagsClusters[]): Record<number, string> {
  const uniqueColors: Record<number, string> = {};
  for (const ride of data) {
    const { clusterindex, color } = ride;
    if (typeof clusterindex === "number" && typeof color === "string") {
      if (!uniqueColors[clusterindex]) {
        uniqueColors[clusterindex] = color;
      }
    }
  }
  return uniqueColors;
}

function getColorsAsArray(uniqueColors: Record<number, string>): string[] {
  const sortedIndices = Object.keys(uniqueColors).map(Number).sort((a, b) => a - b);
  return sortedIndices.map(index => uniqueColors[index]);
}

const DRAWER_WIDTH = 300;

const ClusterVisualization: React.FC = () => {
  const defaultCentroid: CentroidSelectorData = { clusterid: 0, startyear: 0, endyear: 0, active: true };
  const token = localStorage.getItem("token");
  const { data: dataClusterOptions, loading: loadingClusterOptions, error: errorClusterOptions } = useFetchCentroidOptions(token ?? "");

  const [selectedCentroid, setSelectedCentroid] = useState<CentroidSelectorData>(defaultCentroid);
  const { data, loading, error, fetchClusterData } = useFetchClusterData();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideDataWithTagsClusters | null>(null);

  const handleCentroidSelection = (value: CentroidSelectorData) => {
    if (value !== null) {
      setSelectedCentroid(value);
      fetchClusterData(token || "", value);
    }
  };

  const handleRideSelect = (ride: RideDataWithTagsClusters) => {
    setSelectedRide(ride);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loadingClusterOptions) return <LinearLoader message="Loading cluster options" />;
  if (errorClusterOptions) return <Alert severity="error">{`Error loading cluster options: ${errorClusterOptions}`}</Alert>;
  if (loading) return <LinearLoader message="Loading cluster visualizations" />;
  if (error) return <Alert severity="error">{`Error loading cluster data: ${error}`}</Alert>;

  if (selectedCentroid.clusterid === 0 && Array.isArray(dataClusterOptions) && dataClusterOptions.length > 0) {
    handleCentroidSelection(dataClusterOptions.find((centroid) => centroid.active) || dataClusterOptions[0]);
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

  let colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
  if (Array.isArray(data) && data.length > 0) {
    const uniqueColorsPerCluster = getUniqueColorsPerCluster(data);
    colors = getColorsAsArray(uniqueColorsPerCluster);
  }

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <ClusterCentroidSelector
        clustersAvailable={dataClusterOptions}
        clusterCentroidSelected={selectedCentroid}
        onCentroidChange={handleCentroidSelection}
      />
      <Button variant="outlined" onClick={toggleDrawer} sx={{ mb: 1 }}>
        {drawerOpen ? "Hide Ride List" : "Show Ride List"}
      </Button>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={drawerOpen ? 9 : 12} sx={{ overflow: "hidden" }}>
          <Grid container spacing={2}>
            {dimensionPairs.map(({ x, y }, index) => (
              <Grid item xs={12} md={6} key={index}>
                <ScatterPlot
                  data={data}
                  xKey={x as keyof RideDataWithTagsClusters}
                  yKey={y as keyof RideDataWithTagsClusters}
                  fieldLabels={fieldLabels}
                  colors={colors}
                  highlightedRide={selectedRide}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        {drawerOpen && (
          <Grid item xs={3} sx={{ maxHeight: "80vh", overflowY: "auto" }}>
            <Box sx={{ width: DRAWER_WIDTH, padding: 2 }}>
              <Typography variant="h6">Ride List</Typography>
              <List>
                {data?.map((ride) => (
                  <ListItemButton
                    key={ride.rideid}
                    onClick={() => handleRideSelect(ride)}
                    selected={selectedRide?.rideid === ride.rideid}
                  >
                    <ListItemText primary={`${formatDate(ride.date)}`} secondary={ride.clusterindex !== undefined ? `${ride.cluster} ${ride.title}` : ""} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default ClusterVisualization;
