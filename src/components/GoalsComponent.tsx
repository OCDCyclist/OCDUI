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
import { Goal } from "../types/types";
import { useAddUpdateGoal } from "../api/user/useAddUpdateGoal";
import { useFetchGoals } from "../api/user/useFetchGoals";
import { formatDate, formatInteger } from "../utilities/formatUtilities";

function isPositiveInteger(value: string): boolean {
  return /^\d+$/.test(value) && parseInt(value, 10) > 0;
}

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

const GoalsComponent = () => {
  const token = localStorage.getItem("token") || "";
  const { goals, error: fetchError, loading: fetchLoading, refetch } = useFetchGoals(token);

  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editGoal, setEditGoal] = useState<Partial<Goal> | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Goal | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  const { addUpdateGoal, loading: saveLoading, error: saveError } = useAddUpdateGoal();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabIndex(newValue);

  const handleRowClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditGoal({ ...goal });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGoal(null);
    setEditGoal(null);
  };

  const handleSort = (columnKey: keyof Goal) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const filterGoals = (tabIndex: number) => {
    if (tabIndex === 0) {
      return goals.filter((goal) => goal.type === 'distance');
    } else if (tabIndex === 1) {
      return goals.filter((goal) => goal.type === 'time');
    }
    return goals;
  }

  const sortedFilteredGoals = React.useMemo(() => {
    const filtered =filterGoals(tabIndex);

    if (!sortConfig.key) return filtered;
        return [...filtered].sort((a, b) => {
            const valA = a[sortConfig.key!];
            const valB = b[sortConfig.key!];
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
  }, [goals, tabIndex, sortConfig]);

  const columns: { key: keyof Goal; label: string }[] = [
    { key: 'type', label: 'Goal Type' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const renderCell = (col: keyof Goal, value: unknown) => {
    if (col === 'week' || col === 'month' || col === 'year') {
      return typeof value === 'number' ? formatInteger(value) : '';
    }
    return value;
  };

  const handleInputChange = (field: keyof Goal, value: string) => {
    if (isPositiveInteger(value)){
      setEditGoal((prev) => (prev ? { ...prev, [field]:  parseInt(value, 10) } : prev));
    }
    else{
      setEditGoal((prev) => (prev ? { ...prev, [field]:  value } : prev));
    }
  };

  const handleSaveGoal = async () => {
    if (!editGoal || selectedGoal == null) return;
    const goalToSave: Goal = {
      ...selectedGoal,
      ...editGoal,
    };

    const success = await addUpdateGoal(goalToSave);
    if (success) {
      refetch(); // refresh goals using hook
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ marginY: 2, maxWidth: '1800px', width: '100%' }}>
      <Paper elevation={3} sx={{ backgroundColor: '#fbeacd', padding: 2 }}>
        <Box>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Distance" />
                <Tab label="Time" />
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
                        {sortedFilteredGoals.map((goal, index) => (
                        <TableRow
                            key={goal.goalid}
                            onClick={() => handleRowClick(goal)}
                            sx={{
                              backgroundColor:
                                index % 2 === 0
                                  ? '#f9f9f9'
                                  : '#fff',
                              cursor: 'pointer',
                            }}
                        >
                            {columns.map((col) => (
                            <TableCell key={col.key} align="center">
                                {renderCell(col.key, goal[col.key]) as React.ReactNode}
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
                <DialogTitle>Edit Goal</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  <Box height={8} />
                  <TextField
                      label="Type"
                      value={editGoal?.type || ''}
                      disabled
                  />
                  <TextField
                      label="Week"
                      value={editGoal?.week || 0}
                      onChange={(e) => handleInputChange('week', e.target.value)}
                  />
                  <TextField
                      label="Month"
                      value={editGoal?.month || 0}
                      onChange={(e) => handleInputChange('month', e.target.value)}
                  />
                  <TextField
                      label="Year"
                      value={editGoal?.year || 0}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                  />
                  {saveError && <Typography color="error">{saveError}</Typography>}
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDialog} disabled={saveLoading}>Cancel</Button>
                <Button variant="contained" onClick={handleSaveGoal} disabled={saveLoading}>
                    {saveLoading ? "Saving..." : "Save"}
                </Button>
                </DialogActions>
            </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default GoalsComponent;
