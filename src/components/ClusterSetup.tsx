import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, TableCellProps, Typography, Alert, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ClusterDefinition } from '../types/types';
import { formatClusterDefinition } from './formatters/formatClusterDefinition';
import { useFetchAllClusterDefinitions } from '../api/clusters/useFetchAllClusterDefinitions';
import RowActions from './utility/RowActions';
import ClusterEdit from './ClusterEdit';
import { useClusterDefinitionUpdates } from '../api/clusters/useClusterDefinitionUpdates';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ClusterSetup = () => {
  const token = localStorage.getItem('token');
  const { data, loading, error, refetch } = useFetchAllClusterDefinitions(token || '');
  const { setClusterDefinition, loading: loadingUpdates, error: errorUpdates } = useClusterDefinitionUpdates(token || '');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<ClusterDefinition | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ClusterDefinition | null, direction: 'asc' | 'desc' }>({
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

  const handleSort = (columnKey: keyof ClusterDefinition) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleRowClick = (clusterDefinition: ClusterDefinition) => {
    setDialogInfo(clusterDefinition);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveDialog = ( clusterDefinition: ClusterDefinition) => {
    setDialogOpen(false);
    setClusterDefinition(clusterDefinition);
    refetch();
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

  const handleRecalculate = async (clusterDefinition: ClusterDefinition) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cluster/cluster?clusterid=${clusterDefinition.clusterid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to recalculate cluster');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetActive = async (clusterDefinition: ClusterDefinition) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cluster/setActive?clusterid=${clusterDefinition.clusterid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set cluster as active');
      }

      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (clusterDefinition: ClusterDefinition) => {
    setDialogInfo(clusterDefinition);
    setDialogOpen(true);
  };

  const handleDelete = async (clusterDefinition: ClusterDefinition) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cluster/delete?clusterid=${clusterDefinition.clusterid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete cluster');
      }

      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const actions = [
    { label: 'Recalculate', callback: handleRecalculate },
    { label: 'Set as Active', callback: handleSetActive },
    { label: 'Edit Cluster', callback: handleEdit },
    { label: 'Delete Cluster', callback: handleDelete },
  ];

  const renderTableRecent = (columns: { key: keyof ClusterDefinition; label: string; justify: string, width: string, type: string }[]) => {
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
              <TableCell
                key={`$controls`}
                align={"left"}
                sx={{ backgroundColor: '#e0e0e0', cursor: 'pointer', width: 120 }}
              >
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(() => {

              return sortedData.map((row, index) => {
                return (
                  <TableRow
                    key={`${row.clusterid}`}
                    sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        align={col.justify as unknown as TableCellProps["align"]}
                        sx={{ paddingRight: '1em' }}
                        onClick={() => handleRowClick(row)}
                      >
                        {formatClusterDefinition(col, row[col.key] ?? '')}
                      </TableCell>
                    ))}
                    <TableCell>
                      <RowActions actions={actions} clusterDefinition={row} />
                    </TableCell>
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
<Container maxWidth="xl" sx={{ marginY: 0 }}>
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
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
      {/* Title on the right */}
      <Typography component="span">
        {loading || loadingUpdates ? 'Loading Cluster Setup' : 'Cluster Setup'}
      </Typography>

      {/* Button on the left */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setDialogOpen(true);
        }}
        sx={{ marginRight: '1em' }}
        startIcon={<AddIcon />}
      >
        Add Cluster
      </Button>
    </Box>

    {renderTableRecent([
      { key: 'startyear', label: 'Start Year', justify: 'center', width: '80', type: 'number' },
      { key: 'endyear', label: 'End Year', justify: 'center', width: '80', type: 'number' },
      { key: 'clustercount', label: 'Cluster Count', justify: 'center', width: '80', type: 'number' },
      { key: 'fields', label: 'Fields', justify: 'center', width: '80', type: 'string' },
      { key: 'active', label: 'Active', justify: 'center', width: '80', type: 'string' },
      { key: 'clusterid', label: 'ID', justify: 'center', width: '80', type: 'number' },
    ])}

    <Dialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="md" // You can set 'sm', 'md', 'lg' or 'xl'
    >
      <DialogTitle>Add or Edit Cluster Characteristics</DialogTitle>
      <DialogContent>
        <ClusterEdit
          clusterId={dialogInfo?.clusterid || -1}
          onClose={handleCloseDialog}
          onSave={handleSaveDialog}
        />
      </DialogContent>
    </Dialog>
  </Paper>
</Container>
  );
};

export default ClusterSetup;
