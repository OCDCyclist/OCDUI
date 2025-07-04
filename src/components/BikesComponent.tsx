import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
} from "@mui/material";
import { Bike } from "../types/types";
import { useAddUpdateBike } from "../api/gear/useAddUpdateBike";
import { useFetchBikes } from "../api/gear/useFetchBikes";
import { formatDate, formatInteger } from "../utilities/formatUtilities";

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

const BikesComponent = () => {
  const token = localStorage.getItem("token") || "";
  const { bikes, error: fetchError, loading: fetchLoading, refetch } = useFetchBikes(token);

  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [editBike, setEditBike] = useState<Partial<Bike> | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Bike | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  const { addUpdateBike, loading: saveLoading, error: saveError } = useAddUpdateBike();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabIndex(newValue);

  const handleRowClick = (bike: Bike) => {
    setSelectedBike(bike);
    setEditBike({ ...bike });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBike(null);
    setEditBike(null);
  };

  const handleSort = (columnKey: keyof Bike) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedFilteredBikes = React.useMemo(() => {
    const filtered = tabIndex === 0
        ? bikes.filter((b) => !b.retired)
        : tabIndex === 1
        ? bikes.filter((b) => b.retired)
        : bikes; // All bikes

    if (!sortConfig.key) return filtered;
        return [...filtered].sort((a, b) => {
            const valA = a[sortConfig.key!];
            const valB = b[sortConfig.key!];
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
  }, [bikes, tabIndex, sortConfig]);

  const columns: { key: keyof Bike; label: string }[] = [
    { key: 'bikename', label: 'Bike Name' },
    { key: 'rides', label: 'Rides' },
    { key: 'distance', label: 'Distance (mi)' },
    { key: 'hours', label: 'Hours' },
    { key: 'earliest', label: 'Earliest' },
    { key: 'latest', label: 'Latest' }
  ];

  const renderCell = (col: keyof Bike, value: unknown) => {
    if (col === 'earliest' || col === 'latest') {
      return typeof value === 'string' ? formatDate(value) : '';
    } else if (col === 'distance' || col === 'hours' || col === 'rides') {
      return typeof value === 'number' ? formatInteger(value) : '';
    }
    return value;
  };

  const handleInputChange = (field: keyof Bike, value: string | boolean) => {
    setEditBike((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveBike = async () => {
    if (!editBike || selectedBike == null) return;
    const bikeToSave: Bike = {
      ...selectedBike,
      ...editBike,
    };

    const success = await addUpdateBike(bikeToSave);
    if (success) {
      refetch(); // refresh bikes using hook
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ marginY: 2, maxWidth: '1800px', width: '100%' }}>
      <Paper elevation={3} sx={{ backgroundColor: '#fbeacd', padding: 2 }}>
        <Box>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Active" />
                <Tab label="Retired" />
                <Tab label="All" />
            </Tabs>

            <TabPanel value={tabIndex} index={tabIndex}>
                <TableContainer>
                    <Table>
                    <TableHead>
                        <TableRow>
                        {columns.map((col) => (
                            <TableCell
                            key={col.key}
                            align="center"
                            onClick={() => handleSort(col.key)}
                            sx={{ cursor: 'pointer' }}
                            >
                            {col.label}
                            {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedFilteredBikes.map((bike, index) => (
                        <TableRow
                            key={bike.bikeid}
                            onClick={() => handleRowClick(bike)}
                            sx={{
                            backgroundColor: bike.isdefault
                                ? '#e3f1c4'
                                : index % 2 === 0
                                ? '#f9f9f9'
                                : '#fff',
                            cursor: 'pointer',
                            }}
                        >
                            {columns.map((col) => (
                            <TableCell key={col.key} align="center">
                                {renderCell(col.key, bike[col.key]) as React.ReactNode}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                {fetchLoading && <Typography>Loading...</Typography>}
                {fetchError && <Typography color="error">{fetchError}</Typography>}
            </TabPanel>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>Edit Bike</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                    label="Bike Name"
                    value={editBike?.bikename || ''}
                    onChange={(e) => handleInputChange('bikename', e.target.value)}
                />
                <TextField
                    label="Brand"
                    value={editBike?.brand || ''}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                />
                <TextField
                    label="Make"
                    value={editBike?.make || ''}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                />
                <TextField
                    label="Strava Name"
                    value={editBike?.stravaname || ''}
                    onChange={(e) => handleInputChange('stravaname', e.target.value)}
                />
                <TextField
                    label="Strava ID"
                    value={editBike?.stravaid || ''}
                    onChange={(e) => handleInputChange('stravaid', e.target.value)}
                />
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={editBike?.isdefault || false}
                        onChange={(e) => handleInputChange('isdefault', e.target.checked)}
                    />
                    }
                    label="Default Bike"
                />
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={editBike?.retired || false}
                        onChange={(e) => handleInputChange('retired', e.target.checked)}
                    />
                    }
                    label="Retired"
                />
                {saveError && <Typography color="error">{saveError}</Typography>}
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDialog} disabled={saveLoading}>Cancel</Button>
                <Button variant="contained" onClick={handleSaveBike} disabled={saveLoading}>
                    {saveLoading ? "Saving..." : "Save"}
                </Button>
                </DialogActions>
            </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default BikesComponent;
