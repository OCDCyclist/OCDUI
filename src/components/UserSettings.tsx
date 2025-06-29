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
} from "@mui/material";
import { FetchUserSettingResult, GroupedSetting, Setting } from '../types/types';
import { fetchUserSettings } from '../api/user/userFetchSettings';

type Order = "asc" | "desc";

const UserSettingsTable: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof GroupedSetting>("property");
  const [order, setOrder] = useState<Order>("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<GroupedSetting | null>(null);

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

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{ cursor: "pointer", paddingRight: '1em', }}
                onClick={() => handleSort("property")} >
                <TableSortLabel active={orderBy === "property"} direction={order}>
                  Property
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ cursor: "pointer", paddingRight: '1em', }} onClick={() => handleSort("value")}>
                <TableSortLabel active={orderBy === "value"} direction={order}>
                  Value
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ cursor: "pointer", paddingRight: '1em', }} onClick={() => handleSort("date")}>
                <TableSortLabel active={orderBy === "date"} direction={order}>
                  Date
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sorted.map((row, index) => (
              <TableRow
                key={row.property}
                hover
                sx={{ cursor: "pointer", backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' } }
                onClick={() => handleRowClick(row)}

              >
                <TableCell align="left">{row.property}</TableCell>
                <TableCell align="center">{row.value}</TableCell>
                <TableCell align="right">{new Date(row.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </>
  );
};

export default UserSettingsTable;
