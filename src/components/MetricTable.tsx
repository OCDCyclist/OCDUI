import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { METRIC_CONFIG, MetricRow } from "../types/types";
import { formatDateTime, formatElapsedTimeShort } from "../utilities/formatUtilities";

// Define the props interface.
interface MetricTableProps {
  metricData: MetricRow[];
  weight: number | null | undefined;
}

// Configuration for grouping related metrics
const METRIC_GROUP_CONFIG: Record<string, { label: string; metrics: string[] }> = {
  altitude: {
    label: "Altitude",
    metrics: ["altitude", "altitudeHigh", "altitudeLow"],
  },
  temperature: {
    label: "Temperature",
    metrics: ["tempAvg", "tempMax", "tempMin"],
  },
  cadence: {
    label: "Cadence",
    metrics: ["cadence"],
  },
  heartrate: {
    label: "HR",
    metrics: ["heartrate"],
  },
  power: {
    label: "Power",
    metrics: ["watts", "normalized"],
  },
  speed: {
    label: "Speed",
    metrics: ["velocity_smooth"],
  },
};

const MetricTable: React.FC<MetricTableProps> = ({ metricData, weight }) => {
  // Map each metric to its group
  const metricToGroupMap: Record<string, string> = {};
  Object.entries(METRIC_GROUP_CONFIG).forEach(([groupKey, groupConfig]) => {
    groupConfig.metrics.forEach((metric) => {
      metricToGroupMap[metric] = groupKey;
    });
  });

  // Filter valid metrics and assign them to groups
  const validMetrics = metricData.filter((row) => METRIC_CONFIG[row.metric]);
  const groupedMetrics = validMetrics.map((row) => ({
    ...row,
    group: metricToGroupMap[row.metric] ?? row.metric,
  }));

  // Get unique groups
  const uniqueGroups = Array.from(
    new Set(groupedMetrics.map((row) => row.group))
  );

  // State for the currently selected tab
  const [selectedGroup, setSelectedGroup] = useState<string>(uniqueGroups[0]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedGroup(newValue);
  };

  // Filter data for the selected group
  const filteredData = groupedMetrics.filter((row) => row.group === selectedGroup);

  const isPowerGroup = selectedGroup === "power";

  return (
    <Box>
      {/* Tabs for each unique group */}
      <Tabs
        value={selectedGroup}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Metric Tabs"
      >
        {uniqueGroups.map((group) => (
          <Tab
            key={group}
            label={METRIC_GROUP_CONFIG[group]?.label ?? group}
            value={group}
          />
        ))}
      </Tabs>

      {/* Table displaying rows for the selected group */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Metric</strong></TableCell>
              <TableCell><strong>Period (MM:SS)</strong></TableCell>
              <TableCell><strong>Value</strong></TableCell>
              {isPowerGroup && <TableCell><strong>Watts/kg</strong></TableCell>}
              <TableCell><strong>Date and Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={`${row.metric}-${row.period}`}>
                <TableCell>{METRIC_CONFIG[row.metric]?.label ?? row.metric}</TableCell>
                <TableCell>
                  {row.period === 0 ? "Average" : `${formatElapsedTimeShort(row.period)}`}
                </TableCell>
                <TableCell>
                  {row.metric_value} {METRIC_CONFIG[row.metric]?.unit ?? ""}
                </TableCell>
                {isPowerGroup && (
                  <TableCell>
                    {weight && typeof weight === "number"
                      ? (row.metric_value / weight).toFixed(1)
                      : ""}
                  </TableCell>
                )}
                <TableCell>{formatDateTime(row.starttime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MetricTable;
