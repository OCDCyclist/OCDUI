import React, { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { MonthAndDOMData } from "../types/types";
import RideListComponent from "./RideListComponent";
import { formatDateHelper } from "./formatters/formatDateHelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getColor = (distance: number) => {
  if (distance >= 1000) return "green";
  if (distance >= 900) return "gold";
  return "lightcoral";
};

const monthKeys = [
  "distancejan",
  "distancefeb",
  "distancemar",
  "distanceapr",
  "distancemay",
  "distancejun",
  "distancejul",
  "distanceaug",
  "distancesep",
  "distanceoct",
  "distancenov",
  "distancedec",
] as const;

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type DialogInfo = { month: number; column: string; dom: number } | null;

const getMonthStatusColor = (data: MonthAndDOMData[], month: keyof MonthAndDOMData) => {
  const greens = data.filter((d) => d[month] >= 1000).length;

  if (greens === 0) return "lightcoral";
  if (greens > 20) return "green";
  return "gold";
};

const isValidDate = (day: number, month: number) => {
  // month is 1–12, day is 1–31
  const date = new Date(2024, month - 1, day); // 2024 is leap year → safe for Feb
  return date.getMonth() === month - 1 && date.getDate() === day;
};

export const YearHeatmap: React.FC = () => {
  const [data, setData] = useState<MonthAndDOMData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState<DialogInfo>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE_URL}/ocds/monthanddom`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCellClick = (dom: number, column: string, month: number) => {
    if (month >= 1 && month <= 12) {
      setDialogInfo({ month, column, dom });
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogInfo(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
       Month and Day of Month Heatmap
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="center"
      >
        {monthKeys.map((month, monthIdx) => (
          <Grid
            item
            key={month}
            xs={12}   // mobile: 1 month per row
            sm={4}    // small tablet: 3 months per row
            md={2}    // tablet: 6 months per row
            lg={1}    // desktop: 12 months per row
          >
            <Typography
                variant="body2"
                align="center"
                sx={{
                    mb: 1,
                    fontWeight: "bold",
                    borderRadius: 1,
                    px: 1,
                    backgroundColor: getMonthStatusColor(data, month),
                    color:
                    getMonthStatusColor(data, month) === "gold" ? "black" : "white",
                }}
                >
                {monthLabels[monthIdx]}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateRows: "repeat(31, 1fr)",
                gap: 0.5,
                justifyContent: "center",
              }}
            >
                {Array.from({ length: 31 }, (_, dayIdx) => {
                const day = dayIdx + 1;

                // skip invalid day/month combos
                if (!isValidDate(day, monthIdx + 1)) return null;

                const dayData = data.find((d) => d.dom === day);
                if (!dayData) return null;

                const value = dayData[month];

                return (
                    <Tooltip
                    key={`${month}-${dayIdx}`}
                    title={`Day ${day}: ${value} miles`}
                    arrow
                    >
                    <Box
                        onClick={() => handleCellClick(day, month, monthIdx + 1)}
                        sx={{
                        width: 16,
                        height: 16,
                        bgcolor: getColor(value),
                        borderRadius: 0.5,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                        margin: "auto",
                        }}
                    />
                    </Tooltip>
                );
                })}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 3,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: "green", borderRadius: 0.5 }} />
          <Typography variant="body2">≥ 1000 miles</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: "gold", borderRadius: 0.5 }} />
          <Typography variant="body2">900–999 miles</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: "lightcoral", borderRadius: 0.5 }} />
          <Typography variant="body2">&lt; 900 miles</Typography>
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>
          Rides for{" "}
          {dialogInfo
            ? formatDateHelper({ dom: dialogInfo.dom, month: dialogInfo.month })
            : ""}
        </DialogTitle>
        <DialogContent>
          {dialogInfo ? (
            <RideListComponent dom={dialogInfo.dom} month={dialogInfo.month} />
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
