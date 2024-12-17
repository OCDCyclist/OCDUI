import React  from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CentroidSelectorData } from '../types/types';

interface ClusterCentroidSelectorProps {
  clustersAvailable: CentroidSelectorData[];
  clusterCentroidSelected: CentroidSelectorData | null;
  onCentroidChange: (centroid: CentroidSelectorData) => void;
}

const ClusterCentroidSelector: React.FC<ClusterCentroidSelectorProps> = ({
  clustersAvailable,
  clusterCentroidSelected,
  onCentroidChange,
}) => {

  const centroidToDisplay = (centroid: CentroidSelectorData | null) =>
    centroid
      ? `${centroid.startyear} to ${centroid.endyear} (${centroid.active ? 'Active' : 'Not Active)'}`
      : 'Select a centroid';

  return (
    <FormControl fullWidth>
      <InputLabel id="cluster-centroid-selector-label">Select Cluster to Visualize</InputLabel>
      <Select
        labelId="cluster-centroid-selector-label"
        value={
          clusterCentroidSelected
            ? centroidToDisplay(clusterCentroidSelected)
            : centroidToDisplay(
                clustersAvailable.find((centroid) => centroid.active) || clustersAvailable[0]
              )
        }
        onChange={(e) => {
          const selectedCentroid = clustersAvailable.find(
            (centroid) => centroidToDisplay(centroid) === e.target.value
          );
          if (selectedCentroid) {
            onCentroidChange(selectedCentroid);
          }
        }}
        data-testid="centroid-selector"
      >
        {clustersAvailable.map((centroid) => (
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
