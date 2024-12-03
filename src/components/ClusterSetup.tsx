import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, TableCellProps, Typography, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ClusterDefinition } from '../types/types';
import { formatClusterDefinition } from './formatters/formatClusterDefinition';
import { useFetchAllClusterDefinitions } from '../api/clusters/useFetchAllClusterDefinitions';
import RowActions from './utility/RowActions';

const ClusterSetup = () => {
  const token = localStorage.getItem('token');
  const { data, loading, error, refetch } = useFetchAllClusterDefinitions(token || '');
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

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const handleRecalculate = async (id: string | number) => {
    try {
      const response = await fetch(`http://localhost:3000/cluster/cluster?clusterid=${id}`, {
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

  const handleSetActive = async (id: string | number) => {
    try {
      const response = await fetch(`http://localhost:3000/cluster/setActive?clusterid=${id}`, {
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

  const actions = [
    { label: 'Recalculate', callback: handleRecalculate },
    { label: 'Set as Active', callback: handleSetActive },
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
                      <RowActions id={row.clusterid} actions={actions} />
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
            { loading ? "Loading Cluster Setup" : 'Cluster Setup'}
          </Typography>
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
          maxWidth="xl" // You can set 'lg' or 'xl' for larger widths
        >
          <DialogTitle>Doing nothing yet</DialogTitle>
          <DialogContent>
            Content to happen later
          </DialogContent>
        </Dialog>

      </Paper>
    </Container>
  );
};

export default ClusterSetup;
