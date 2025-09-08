import React, { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { IndoorOutdoorData } from "../types/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ThresholdConfig = {
  min: number;
  max?: number;
  color: string;
  label: string;
};

const defaultThresholds: ThresholdConfig[] = [
  { min: 75, color: "#1565c0", label: "≥ 75% Outdoor" },
  { min: 50, max: 74.9, color: "#64b5f6", label: "50–74%" },
  { min: 25, max: 49.9, color: "#ffb74d", label: "25–49%" },
  { min: 0, max: 24.9, color: "#ef6c00", label: "< 25%" },
];

const monthLabels = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const getColorForPct = (
  pctOutdoor: number,
  thresholds: ThresholdConfig[] = defaultThresholds
) => {
  const match = thresholds.find(
    (t) =>
      pctOutdoor >= t.min && (t.max === undefined || pctOutdoor <= t.max)
  );
  return match ? match.color : "#e0e0e0";
};

export const IndoorOutdoorHeatMap: React.FC = () => {
  const [data, setData] = useState<IndoorOutdoorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE_URL}/ocds/outdoorindooryearmonth`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching indoor/outdoor data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Unique years, descending
  const years = Array.from(new Set(data.map((d) => d.year))).sort((a, b) => b - a);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Indoor vs Outdoor Heatmap (Year × Month)
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {/* Left-hand year column */}
        <Grid item xs={12} sm={2} md={1}>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 1, fontWeight: "bold" }}
          >
            Year
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: `repeat(${years.length}, 1fr)`,
              gap: 0.5,
              justifyContent: "center",
            }}
          >
            {years.map((year) => (
              <Typography
                key={year}
                variant="body2"
                align="center"
                sx={{ lineHeight: "16px" }}
              >
                {year}
              </Typography>
            ))}
          </Box>
        </Grid>

        {/* Month columns */}
        {monthLabels.map((label, monthIdx) => (
           <Grid
              item
              key={label}
           >
            {/* Month header */}
            <Typography
              variant="body2"
              align="center"
              sx={{
                mb: 1,
                fontWeight: "bold",
                borderRadius: 1,
                px: 1,
                backgroundColor: "#f0f0f0",
              }}
            >
              {label}
            </Typography>

            {/* Year rows */}
            <Box
              sx={{
                display: "grid",
                gridTemplateRows: `repeat(${years.length}, 1fr)`,
                gap: 0.5,
                justifyContent: "center",
              }}
            >
              {years.map((year) => {
                // Find record that matches this exact year+month
                const monthData = data.find(
                  (d) => d.year === year && d.month === monthIdx + 1
                );

                if (!monthData) {
                  // No data → render blank white box
                  return (
                    <Box
                      key={`${year}-${monthIdx}`}
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: "white",
                        borderRadius: 0.5,
                        margin: "auto",
                        border: "1px solid #eee",
                      }}
                    />
                  );
                }

                return (
                  <Tooltip
                    key={`${year}-${monthIdx}`}
                    title={`${year} ${label}: Outdoor ${monthData.pct_outdoor.toFixed(
                      1
                    )}% | Indoor ${monthData.pct_indoor.toFixed(1)}%`}
                    arrow
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: getColorForPct(monthData.pct_outdoor),
                        borderRadius: 0.5,
                        cursor: "default",
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
        {defaultThresholds.map((t) => (
          <Box
            key={t.label}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: t.color,
                borderRadius: 0.5,
              }}
            />
            <Typography variant="body2">{t.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
