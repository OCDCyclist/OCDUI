import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { ZoneType } from "../types/types";

// Define the props interface.
interface ZoneTableProps {
  zoneType: ZoneType; // The type of zone data (HR, Power, Cadence).
  zoneDefinitions: number[]; // The start and end points for each zone.
  zoneValues: number[]; // The number of seconds spent in each zone.
}

const ZoneTable: React.FC<ZoneTableProps> = ({ zoneType, zoneDefinitions, zoneValues }) => {
  // Parse the zone definitions into an array of ranges.
  const parsedZones = zoneDefinitions.map((value, index) => {
    const start = index === 0 ? 0 : Number(zoneDefinitions[index - 1]) + 1;
    const end = Number(value);

    if (start === 0 || end === 9999) {
      if (start === 0) {
        return `<= ${end}`;
      }
      return `>= ${start}`;
    }

    return end !== 9999 ? `${start}-${end}` : `${start}+`;
  });

  // Helper function to format time from seconds to HH:MM:SS.
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate total time spent across all zones.
  const totalTime = zoneValues.reduce((sum, time) => sum + time, 0);

  // Helper function to calculate the percentage of time in a zone.
  const calculatePercentage = (time: number): string => {
    if (totalTime === 0) return "0%";
    const percentage = (time / totalTime) * 100;
    return `${Math.round(percentage)}%`;
  };

  const isValidZoneDefinitions = Array.isArray(zoneDefinitions) && zoneDefinitions.length > 0;
  const isValidZoneData =
    isValidZoneDefinitions &&
    Array.isArray(zoneValues) &&
    zoneValues.length > 0 &&
    zoneDefinitions.length === zoneValues.length;
  const title = isValidZoneData ? `${zoneType} Zones` : `${zoneType} Zones (No Data)`;

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Zone</TableCell>
            <TableCell>Range</TableCell>
            <TableCell>Time (HH:MM:SS)</TableCell>
            <TableCell>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parsedZones.map((range, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{range}</TableCell>
              <TableCell>{formatTime(isValidZoneData ? zoneValues[index] : 0)}</TableCell>
              <TableCell>
                {isValidZoneData ? calculatePercentage(zoneValues[index]) : "0%"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ZoneTable;
