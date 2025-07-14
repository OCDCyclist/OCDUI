import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  FormControlLabel,
  Alert,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { useFetchWeightData } from "../../api/user/useFetchWeightData";
import LinearLoader from "../loaders/LinearLoader";
import { WeightData } from "../../types/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PERIOD_MAP: Record<string, string> = {
  week: "Week",
  month: "Month",
  year1: "Last 1 Year",
  year5: "Last 5 Years",
  year10: "Last 10 Years",
  all: "All Years",
};

const METRIC_CONFIG: {
  [key: string]: { label: string; color: string };
} = {
  weight: { label: "Weight", color: "#b71c1c" }, // dark red
  weight7: { label: "Weight Week Avg", color: "#e53935" }, // medium red
  weight30: { label: "Weight Month Avg", color: "#ef9a9a" }, // light red

  bodyfatfraction: { label: "Body Fat Pct", color: "#1b5e20" }, // dark green
  bodyfatfraction7: { label: "Body Fat Pct Week", color: "#43a047" }, // medium green
  bodyfatfraction30: { label: "Body Fat Pct Month", color: "#a5d6a7" }, // light green

  bodyh2ofraction: { label: "H2O Fraction", color: "#0d47a1" }, // dark blue
  bodyh2ofraction7: { label: "H2O Fraction Week", color: "#1e88e5" }, // medium blue
  bodyh2ofraction30: { label: "H2O Fraction Month", color: "#90caf9" }, // light blue
};

const METRIC_ROWS = [
  ["weight", "weight7", "weight30"],
  ["bodyfatfraction", "bodyfatfraction7", "bodyfatfraction30"],
  ["bodyh2ofraction", "bodyh2ofraction7", "bodyh2ofraction30"],
];

const PERIODS = Object.keys(PERIOD_MAP);

const WeightChart: React.FC = () => {
  const [period, setPeriod] = useState("month");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["weight"]);
  const token = localStorage.getItem("token");
  const { weightData, error, loading } = useFetchWeightData(token ?? "", period);

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const chartData = useMemo(() => {
    if (!weightData || weightData.length === 0) {
      return { labels: [], datasets: [] };
    }

    const firstValidMetric = selectedMetrics.find((metric) =>
      weightData.some((entry) => entry[metric as keyof WeightData] != null)
    );

    const labels = firstValidMetric
      ? weightData
          .filter((entry) => entry[firstValidMetric as keyof WeightData] != null)
          .map((entry) => new Date(entry.date).toLocaleDateString())
      : [];

    const datasets = selectedMetrics
      .map((metric) => {
        const config = METRIC_CONFIG[metric];
        const filteredEntries = weightData.filter(
          (entry) => entry[metric as keyof WeightData] != null
        );

        return filteredEntries.length > 0
          ? {
              label: config.label,
              data: filteredEntries.map(
                (entry) => entry[metric as keyof WeightData]
              ),
              borderColor: config.color,
              fill: false,
              tension: 0.3,
            }
          : null;
      })
      .filter(Boolean);

    return { labels, datasets };
  }, [weightData, selectedMetrics]);

  if (loading) return <LinearLoader message="Loading weight data" />;
  if (error) return <Alert severity="error">{`Error loading weight data: ${error}`}</Alert>;

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
          {PERIODS.map((p) => (
            <MenuItem key={p} value={p}>
              {PERIOD_MAP[p]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mt={2}>
        <Typography variant="subtitle1" gutterBottom>
          Select Metrics:
        </Typography>
        <Grid container spacing={1}>
          {METRIC_ROWS.map((row, rowIndex) => (
            <Grid container item spacing={1} key={rowIndex}>
              {row.map((metric) => (
                <Grid item xs={4} key={metric}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedMetrics.includes(metric)}
                        onChange={() => handleMetricChange(metric)}
                      />
                    }
                    label={METRIC_CONFIG[metric].label}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={3}>
        <Line data={chartData} />
      </Box>
    </div>
  );
};

export default WeightChart;
