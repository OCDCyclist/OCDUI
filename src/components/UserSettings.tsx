import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TableSortLabel,
  Typography,
  Box,
} from "@mui/material";
import { FetchUserSettingResult, GroupedSetting, Setting } from '../types/types';
import { fetchUserSettings } from '../api/user/userFetchSettings';
import { IconButton, TextField, DialogActions, Button } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import { useAddUserSettingValue } from "../api/user/adduserSettingValue";

type Order = "asc" | "desc";

type UserSettingsTableProps = {
  refreshCallback?: () => void;
};

const UserSettingsTable: React.FC<UserSettingsTableProps> = ({ refreshCallback }) => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof GroupedSetting>("property");
  const [order, setOrder] = useState<Order>("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<GroupedSetting | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addValueInput, setAddValueInput] = useState<string>("");
  const [addTarget, setAddTarget] = useState<GroupedSetting | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTarget, setMenuTarget] = useState<GroupedSetting | null>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const { addValue, loading: addLoading, error: addError } = useAddUserSettingValue();

  useEffect(() => {
    const loadSettings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found in localStorage.");
        return;
      }

      const result: FetchUserSettingResult = await fetchUserSettings(token);
      setSettings(result.settings);
      setError(result.error);
    };

    loadSettings();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Setting[]>();
    settings.forEach((s) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      map.get(s.property)?.push(s) || map.set(s.property, [s]);
    });

    return Array.from(map.entries()).map(([property, list]) => {
      const latest = list.reduce((a, b) => (a.date > b.date ? a : b));
      const display =
        latest.propertyvaluestring &&
        latest.propertyvaluestring.toLowerCase() !== "null"
          ? latest.propertyvaluestring
          : latest.propertyvalue.toString();

      return { property, date: latest.date, value: display, all: list };
    });
  }, [settings]);

  const sorted = useMemo(() => {
    return [...grouped].sort((a, b) => {
      const A = a[orderBy];
      const B = b[orderBy];
      if (A < B) return order === "asc" ? -1 : 1;
      if (A > B) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [grouped, orderBy, order]);

  const handleSort = (col: keyof GroupedSetting) => {
    const isAsc = orderBy === col && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(col);
  };

  const handleRowClick = (row: GroupedSetting) => {
    setSelected(row);
    setDialogOpen(true);
  };

  return (
    <>
      {error && <Typography color="error" sx={{ m: 2 }}>{error}</Typography>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <TableContainer component={Paper} sx={{ maxWidth: '800px' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ cursor: "pointer", paddingRight: '1em', }}
                  onClick={() => handleSort("property")} >
                  <TableSortLabel active={orderBy === "property"} direction={order}>
                    Property Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ cursor: "pointer", paddingRight: '1em', }} onClick={() => handleSort("value")}>
                  <TableSortLabel active={orderBy === "value"} direction={order}>
                    Property Value
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ cursor: "pointer", paddingRight: '1em', }} onClick={() => handleSort("date")}>
                  <TableSortLabel active={orderBy === "date"} direction={order}>
                    Last Updated
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Add</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sorted.map((row, index) => (
              <TableRow
                key={row.property}
                hover
                sx={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                }}
                onClick={(event) => {
                  // Prevent row click if the target is a button or inside a button
                  const target = event.target as HTMLElement;
                  if (target.closest('button')) return;
                  handleRowClick(row);
                }}
               >
                  <TableCell align="left">{row.property}</TableCell>
                  <TableCell align="center">{row.value}</TableCell>
                  <TableCell align="right">{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        setMenuAnchorEl(event.currentTarget);
                        setMenuTarget(row);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={() => setMenuAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                if (menuTarget) {
                  setAddTarget(menuTarget);
                  setAddValueInput(menuTarget.value);
                  setAddDialogOpen(true);
                }
                setMenuAnchorEl(null);
              }}
            >
              Add new value
            </MenuItem>
          </Menu>
        </TableContainer>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{selected?.property}</DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selected?.all
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {s.propertyvaluestring &&
                      s.propertyvaluestring.toLowerCase() !== "null"
                        ? s.propertyvaluestring
                        : s.propertyvalue}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Value</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Property: <strong>{addTarget?.property}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Value"
            value={addValueInput}
            onChange={(e) => setAddValueInput(e.target.value)}
            error={!!(addTarget?.value.match(/^\d+$/) && isNaN(Number(addValueInput)))}
            helperText={
              addTarget?.value.match(/^\d+$/) && isNaN(Number(addValueInput))
                ? "Must be a number"
                : ""
            }
          />
          {addError && <Typography color="error">{addError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} disabled={addLoading}>Cancel</Button>
          <Button
            onClick={async () => {
              const isNumeric = addTarget?.value.match(/^\d+$/);
              if (isNumeric && isNaN(Number(addValueInput))) return;

              const success = await addValue(addTarget!.property, isNumeric ? Number(addValueInput) : addValueInput);
              if (success) {
                setAddDialogOpen(false);
                refreshCallback?.();
              }
            }}
            disabled={addLoading}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSettingsTable;
