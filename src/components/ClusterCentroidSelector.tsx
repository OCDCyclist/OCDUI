import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { useFetchCentroidOptions } from '../api/clusters/useFetchCentroidOptions';
import { CentroidSelectorData } from '../types/types';

interface ClusterCentroidSelectorProps {
  clusterCentroidSelected: CentroidSelectorData | null;
  onCentroidChange: (centroid: CentroidSelectorData) => void;
}

const ClusterCentroidSelector: React.FC<ClusterCentroidSelectorProps> = ({
  clusterCentroidSelected,
  onCentroidChange,
}) => {
    const token = localStorage.getItem('token');
    const { data, loading, error } = useFetchCentroidOptions(token ?? '');

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (data && !clusterCentroidSelected && data.length > 0) {
    clusterCentroidSelected = data.find( cluster => cluster.active) ?? null;
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Failed to load centroids. Please try again later.
      </Typography>
    );
  }

  const centroidToDisplay = (centroid: CentroidSelectorData | null) => centroid ? `${centroid.active ? 'Active' : 'Not Active'} from ${centroid.startyear} to ${centroid.endyear}` : 'Select a centroid';
  const activeCentroid = data && clusterCentroidSelected?.active ? data.find( centroid => centroid.active) : undefined;
  return (
    <FormControl fullWidth>
      <InputLabel id="cluster-centroid-selector-label">Select Centroid</InputLabel>
      <Select
        labelId="cluster-centroid-selector-label"
        value={
          clusterCentroidSelected?.clusterid
            ? centroidToDisplay(clusterCentroidSelected)
            : centroidToDisplay(activeCentroid || clusterCentroidSelected)
        }
        onChange={(e) => {
          const selectedCentroid = data.find(
            (centroid: CentroidSelectorData) =>
                centroidToDisplay(centroid) === e.target.value
          );
          if (selectedCentroid) {
            onCentroidChange(selectedCentroid);
          }
        }}
        data-testid="centroid-selector"
      >
        {data.map((centroid: CentroidSelectorData) => (
          <MenuItem
            key={`${centroid.active}-${centroid.startyear}-${centroid.endyear}`}
            value={centroidToDisplay(centroid)}
          >
            {centroidToDisplay(centroid)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ClusterCentroidSelector;
