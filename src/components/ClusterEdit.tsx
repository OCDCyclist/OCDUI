import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import { ClusterDefinition } from '../types/types';
import { useFetchClusterDefinition } from '../api/clusters/useFetchClusterDefinition';
import LinearLoader from './loaders/LinearLoader';

type ClusterEditProps = {
  clusterId: number;
  onClose: () => void;
  onSave: (clusterDefinition: ClusterDefinition) => void;
};

const ClusterEdit: React.FC<ClusterEditProps> = ({ clusterId, onClose, onSave }) => {
  const token = localStorage.getItem('token');
  const currentYear = new Date().getFullYear();

  const { data: fetchedClusterDefinition, loading, error } = useFetchClusterDefinition(token || '', clusterId);

  const [clusterDefinition, setClusterDefinition] = useState<ClusterDefinition>({
    clusterid: clusterId,
    startyear: currentYear,
    endyear: currentYear,
    clustercount: 2,
    fields: '',
    active: false,
  });

  useEffect(() => {
    if (fetchedClusterDefinition) {
      setClusterDefinition(fetchedClusterDefinition);
    } else if (clusterId === -1) {
      setClusterDefinition((prev) => ({
        ...prev,
        startyear: currentYear,
        endyear: currentYear,
      }));
    }
  }, [fetchedClusterDefinition, clusterId, currentYear]);

  const handleChange = (field: keyof ClusterDefinition, value: string | number) => {
    setClusterDefinition((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    await onSave(clusterDefinition);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height={200}>
        <LinearLoader message="Loading cluster..." />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" component={"span"}>Create / Edit a Cluster Definition</Typography>

      {error && <Typography color="error" component={"span"}>Error: {error}</Typography>}

      <Stack spacing={2} mt={2}>
        {/* Cluster ID (Read-only) */}
        <TextField
          label="Cluster ID"
          value={clusterDefinition.clusterid}
          InputProps={{ readOnly: true }}
          fullWidth
        />

        {/* Start Year */}
        <TextField
          label="Start Year"
          type="number"
          value={clusterDefinition.startyear}
          onChange={(e) => handleChange('startyear', parseInt(e.target.value, 10))}
          fullWidth
        />

        {/* End Year */}
        <TextField
          label="End Year"
          type="number"
          value={clusterDefinition.endyear}
          onChange={(e) => handleChange('endyear', parseInt(e.target.value, 10))}
          fullWidth
        />

        {/* Cluster Count */}
        <FormControl fullWidth>
          <InputLabel>Cluster Count</InputLabel>
          <Select
            value={clusterDefinition.clustercount}
            onChange={(e) => handleChange('clustercount', parseInt(e.target.value as string, 10))}
          >
            {[2, 3, 4, 5, 6, 7].map((count) => (
              <MenuItem key={count} value={count}>
                {count}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Fields (Read-only) */}
        <TextField
          label="Fields"
          value={clusterDefinition.fields}
          InputProps={{ readOnly: true }}
          fullWidth
        />

        {/* Active Flag */}
        <Typography variant="subtitle1" component={"span"}>Active</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={clusterDefinition.active}
              onChange={(e) => handleChange('active', e.target.checked)}
            />
          }
          label={clusterDefinition.active ? 'Yes' : 'No'}
        />
      </Stack>

      <Stack direction="row" spacing={2} mt={3}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default ClusterEdit;
