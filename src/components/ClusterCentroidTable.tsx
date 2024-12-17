import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, Container, TableCellProps, Typography, DialogTitle, Alert } from '@mui/material';
import { CentroidDefinition } from '../types/types';
import RideListComponent from './RideListComponent';
import { formatCentroidDefinition } from './formatters/formatCentroidDefinition';
import { useFetchAllClusterCentroids } from '../api/clusters/useFetchAllClusterCentroids';
import { useClusterCentroidUpdates } from '../api/clusters/useClusterCentroidUpdates';

const ClusterCentroidTable = () => {
  const token = localStorage.getItem('token');
  const { data, loading, error, refetch  } = useFetchAllClusterCentroids(token || '');
  const { setName, setColor, loading: loadingUpdates, error: errorUpdates } = useClusterCentroidUpdates(token || '');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<{ centroidDefinition: CentroidDefinition; column: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CentroidDefinition | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 190);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight - 190;
      setTableHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSort = (columnKey: keyof CentroidDefinition) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleRowClick = (centroidDefinition: CentroidDefinition, column: string) => {
    setDialogInfo({centroidDefinition, column});
    setDialogOpen(true);
  };

  const handleUpdateName = async (centroidDefinition: CentroidDefinition) => {
    console.log("Updated Name:", centroidDefinition);
    await setName( {clusterId: centroidDefinition.clusterid, cluster: centroidDefinition.cluster, name: centroidDefinition.name });
    refetch();
  };

  const handleUpdateColor = async (centroidDefinition: CentroidDefinition) => {
    console.log("Updated Color:", centroidDefinition);
    await setColor( {clusterId: centroidDefinition.clusterid, cluster: centroidDefinition.cluster, color: centroidDefinition.color });
    refetch();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const isNameOrColor = (value: string): boolean => {
    const allowedValues = new Set(['name', 'color']);
    return allowedValues.has(value);
  };

  const renderTableRecent = (columns: { key: keyof CentroidDefinition; label: string; justify: string, width: string, type: string }[]) => {
    return (
      <TableContainer sx={{ maxHeight: tableHeight }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.justify as unknown as TableCellProps["align"]}
                  onClick={() => handleSort(col.key)}
                  sx={{ backgroundColor: '#e0e0e0', cursor: 'pointer', width: col.width }}
                >
                  {col.label}
                  {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(() => {
              let currentColor = '#fff';
              let lastClusterWasZero = false; // Track the state of the last row's cluster

              return sortedData.map((row) => {
                if (row.cluster === 0) {
                  // Switch color only when cluster is 0 and it wasn't already 0
                  if (!lastClusterWasZero) {
                    currentColor = currentColor === '#f9f9f9' ? '#fff' : '#f9f9f9';
                  }
                  lastClusterWasZero = true;
                } else {
                  lastClusterWasZero = false;
                }

                return (
                  <TableRow
                    key={`${row.startyear}-${row.endyear}-${row.cluster}`}
                    sx={{ backgroundColor: currentColor }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        align={col.justify as unknown as TableCellProps["align"]}
                        sx={{ paddingRight: '1em' }}
                        onClick={ !isNameOrColor(col.key) ? () => handleRowClick(row, col.key) : undefined}
                      >
                        {formatCentroidDefinition(col, row[col.key] ?? '', row, handleUpdateName, handleUpdateColor)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              });
            })()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (errorUpdates) return <Alert severity="error">{errorUpdates}</Alert>;

  return (
    <Container maxWidth='xl' sx={{ marginY: 0 }}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#fbeacd',
          padding: 2,
          marginBottom: '1em',
          margin: 'auto',
          width: '100%',
        }}
      >
        <Box display="flex" flexDirection= 'column' alignItems="left">
          <Typography component="span">
            { loading || loadingUpdates ? "Loading cluster centroids" : 'Cluster Centroids'}
          </Typography>
        </Box>

        {renderTableRecent([
          { key: 'startyear', label: 'Start Year', justify: 'center', width: '80', type: 'number' },
          { key: 'endyear', label: 'End Year', justify: 'center', width: '80', type: 'number' },
          { key: 'cluster', label: 'Cluster', justify: 'center', width: '80', type: 'number' },
          { key: 'distance', label: 'Distance', justify: 'right', width: '80', type: 'number' },
          { key: 'speedavg', label: 'Avg Speed', justify: 'right', width: '80', type: 'number' },
          { key: 'elevationgain', label: 'Elevation', justify: 'right', width: '80', type: 'number' },
          { key: 'hravg', label: 'Avg HR', justify: 'right', width: '100', type: 'number' },
          { key: 'powernormalized', label: 'Normalized Power', justify: 'right', width: '90', type: 'number' },
          { key: 'name', label: 'Name', justify: 'center', width: '90', type: 'string' },
          { key: 'color', label: 'Color', justify: 'center', width: '90', type: 'string' },
          { key: 'ride_count', label: 'Ride Count', justify: 'right', width: '90', type: 'number' },
        ])}

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
        >
          <DialogTitle>{`Rides in cluster ${dialogInfo?.centroidDefinition.startyear} - ${dialogInfo?.centroidDefinition.endyear}: ${dialogInfo?.centroidDefinition.name} (#${dialogInfo?.centroidDefinition.cluster})`} </DialogTitle>
          <DialogContent>
            {
              dialogInfo && dialogInfo.column.toLowerCase() !== 'name'
              ?
              <RideListComponent cluster={dialogInfo?.centroidDefinition} />
              :
              undefined
            }
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ClusterCentroidTable;
