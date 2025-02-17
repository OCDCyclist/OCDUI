import React, { useState } from "react";
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
import { MenuItem, FormControl, Select, Checkbox, FormControlLabel, Alert, Box } from "@mui/material";
import { useFetchWeightData } from "../../api/user/useFetchWeightData";
import LinearLoader from "../loaders/LinearLoader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PERIOD_MAP: Record<string, string> = {
  week: "Week",
  month: "Month",
  year1: "Last 1 Year",
  year5: "Last 5 Years",
  year10: "Last 10 Years",
  all: "All Years",
};

const AVAILABLE_METRICS_MAP: Record<string, string> = {
  weight: "Weight",
  weight7: "Weight Week Avg",
  weight30: "Weight Month Avg",
  bodyfatfraction: "Body Fat Pct",
  bodyfatfraction30: "Body Fat Pct Month",
  bodyh2ofraction: "H2O Fraction",
  bodyh2ofraction7: "H2O Fraction Week",
  bodyh2ofraction30: "H2O Fraction Month",
};

const YEARLY_METRICS_MAP: Record<string, string> = {
  weight365: "Weight Year Avg",
  bodyfatfraction365: "Body Fat Pct Year",
  bodyh2ofraction365: "H2O Fraction Year",
};

const PERIODS = Object.keys(PERIOD_MAP);
const AVAILABLE_METRICS = Object.keys(AVAILABLE_METRICS_MAP);
const YEARLY_METRICS = Object.keys(YEARLY_METRICS_MAP);

const WeightChart: React.FC = () => {
  const [period, setPeriod] = useState("month");
  const [selectedMetrics, setSelectedMetrics] = useState(["weight"]);
  const token = localStorage.getItem('token');
  const { weightData, error, loading } = useFetchWeightData(token ?? '', period);

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const chartData = React.useMemo(() => {
    if (!weightData || weightData.length === 0) {
      return { labels: [], datasets: [] };
    }

    const firstValidMetric = selectedMetrics.find((metric) =>
      weightData.some((entry) => entry[metric] != null)
    );

    const labels = firstValidMetric
      ? weightData
          .filter((entry) => entry[firstValidMetric] != null)
          .map((entry) => new Date(entry.date).toLocaleDateString())
      : [];

    const datasets = selectedMetrics
      .map((metric) => {
        const filteredEntries = weightData.filter((entry) => entry[metric] != null);

        return filteredEntries.length > 0
          ? {
              label: AVAILABLE_METRICS_MAP[metric] || YEARLY_METRICS_MAP[metric],
              data: filteredEntries.map((entry) => entry[metric]),
              borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
              fill: false,
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
      <Box>
        {AVAILABLE_METRICS.map((metric) => (
          <FormControlLabel
            key={metric}
            control={
              <Checkbox
                checked={selectedMetrics.includes(metric)}
                onChange={() => handleMetricChange(metric)}
              />
            }
            label={AVAILABLE_METRICS_MAP[metric]}
          />
        ))}
      </Box>
      <Box mt={2}>
        {YEARLY_METRICS.map((metric) => (
          <FormControlLabel
            key={metric}
            control={
              <Checkbox
                checked={selectedMetrics.includes(metric)}
                onChange={() => handleMetricChange(metric)}
              />
            }
            label={YEARLY_METRICS_MAP[metric]}
          />
        ))}
      </Box>
      <Line data={chartData} />
    </div>
  );
};

export default WeightChart;
