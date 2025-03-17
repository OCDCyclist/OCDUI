import React, { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, ChartOptions, registerables } from "chart.js";
import { Checkbox, FormControlLabel, FormGroup, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { PowerCurveData } from "../../types/types";

Chart.register(...registerables);

interface PowerCurveChartProps {
  data: PowerCurveData[];
}

const PowerCurveChart: React.FC<PowerCurveChartProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<"max_power_watts" | "max_power_wkg">("max_power_watts");
  const [selectedPeriods, setSelectedPeriods] = useState<Record<string, boolean>>({});

  // Extract available periods dynamically
  const periods = useMemo(() => {
    const uniquePeriods = Array.from(new Set(data.map((d) => d.period)));
    return uniquePeriods;
  }, [data]);

  // Initialize selected periods when data changes
  useEffect(() => {
    if (periods.length > 0) {
      const defaultPeriod = periods.includes("overall") ? "overall" : periods[0];
      setSelectedPeriods({ [defaultPeriod]: true });
    }
  }, [periods]);

  // Filter data based on selected periods
  const filteredData = useMemo(() => {
    return data.filter((d) => selectedPeriods[d.period]);
  }, [data, selectedPeriods]);

  const chartData = useMemo(() => {
    const datasets = Object.keys(selectedPeriods)
      .filter((period) => selectedPeriods[period])
      .map((period) => {
        const periodData = filteredData.filter((d) => d.period === period);
        return {
          label: period,
          data: periodData.map((d) => ({
            x: d.duration_seconds,
            y: selectedMetric === "max_power_watts" ? d.max_power_watts : d.max_power_wkg,
            ride: d,
          })),
          borderColor: getRandomColor(),
          backgroundColor: "rgba(0, 0, 0, 0)",
          tension: 0.3,
        };
      });

    return { datasets };
  }, [filteredData, selectedMetric]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        type: "logarithmic",
        title: { display: true, text: "Time (seconds)" },
        ticks: {
          callback: (value) => `${value}`,
        },
      },
      y: {
        title: { display: true, text: selectedMetric === "max_power_watts" ? "Power (Watts)" : "Power (W/kg)" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const ride = context.raw as any;
            return `${ride.ride.title} (${new Date(ride.ride.date).toLocaleDateString()})`;
          },
        },
      },
    },
    onClick: (_event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const ride = chartData.datasets[datasetIndex].data[index] as any;
        if (ride.ride.stravaid) {
          window.open(`https://www.strava.com/activities/${ride.ride.stravaid}`, "_blank");
        }
      }
    },
  };

  function getRandomColor() {
    return `hsl(${Math.random() * 360}, 70%, 50%)`;
  }

  return (
    <div>
      <ToggleButtonGroup
        value={selectedMetric}
        exclusive
        onChange={(_, value) => value && setSelectedMetric(value)}
        aria-label="Power Metric"
      >
        <ToggleButton value="max_power_watts">Watts</ToggleButton>
        <ToggleButton value="max_power_wkg">W/kg</ToggleButton>
      </ToggleButtonGroup>

      <FormGroup row>
        {periods.map((period) => (
          <FormControlLabel
            key={period}
            control={
              <Checkbox
                checked={!!selectedPeriods[period]}
                onChange={() => setSelectedPeriods((prev) => ({ ...prev, [period]: !prev[period] }))}
              />
            }
            label={period}
          />
        ))}
      </FormGroup>

      <Line data={chartData} options={options} />
    </div>
  );
};

export default PowerCurveChart;
