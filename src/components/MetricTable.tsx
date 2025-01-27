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
import { formatDateTime } from "../utilities/formatUtilities";

// Define the props interface.
interface MetricTableProps {
  metricData: MetricRow[];
}

const MetricTable: React.FC<MetricTableProps> = ({ metricData }) => {
  // Filter metrics that exist in METRIC_CONFIG
  const validMetrics = metricData.filter((row) => METRIC_CONFIG[row.metric]);
  const uniqueMetrics = Array.from(new Set(validMetrics.map((row) => row.metric)));

  // State for the currently selected tab
  const [selectedMetric, setSelectedMetric] = useState<string>(uniqueMetrics[0]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedMetric(newValue);
  };

  // Filter data for the selected metric
  const filteredData = validMetrics.filter((row) => row.metric === selectedMetric);

  return (
    <Box>
      {/* Tabs for each unique metric */}
      <Tabs
        value={selectedMetric}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Metric Tabs"
      >
        {uniqueMetrics.map((metric) => (
          <Tab
            key={metric}
            label={METRIC_CONFIG[metric]?.label ?? metric}
            value={metric}
          />
        ))}
      </Tabs>

      {/* Table displaying rows for the selected metric */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Metric</strong></TableCell>
              <TableCell><strong>Period</strong></TableCell>
              <TableCell><strong>Value</strong></TableCell>
              <TableCell><strong>Date and Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={`${row.metric}-${row.period}`}>
                <TableCell>{METRIC_CONFIG[row.metric]?.label ?? row.metric}</TableCell>
                <TableCell>
                  {row.period === 0 ? "Average" : `${row.period} seconds`}
                </TableCell>
                <TableCell>
                  {row.metric_value} {METRIC_CONFIG[row.metric]?.unit ?? ""}
                </TableCell>
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
