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
import { MatchRow } from "../types/types";
import { formatDateTime, formatElapsedTimeShort } from "../utilities/formatUtilities";

// Define the props interface.
interface MatchTableProps {
  matches: MatchRow[];
}

// Helper function to format time from seconds to HH:MM:SS.
const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const MatchTable: React.FC<MatchTableProps> = ({ matches }) => {
  const title = `Matches burned on this rides (${matches.length})`;
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>Match Type</TableCell>
            <TableCell>Match Period (s)</TableCell>
            <TableCell>Match Power (w)</TableCell>
            <TableCell>Actual Period (s)</TableCell>
            <TableCell>Actual Power (s)</TableCell>
            <TableCell>Max Sustained Power (w)</TableCell>
            <TableCell>Peak Power (w)</TableCell>
            <TableCell>Average HR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map((match, index) => (
            <TableRow key={index}>
              <TableCell>{formatDateTime(match.starttime)}</TableCell>
              <TableCell>{match.type}</TableCell>
              <TableCell>{`${formatElapsedTimeShort(match.period)}`}</TableCell>
              <TableCell>{match.targetpower}</TableCell>
              <TableCell>{`${formatElapsedTimeShort(match.actualperiod)}`}</TableCell>
              <TableCell>{match.averagepower}</TableCell>
              <TableCell>{match.maxaveragepower}</TableCell>
              <TableCell>{match.peakpower}</TableCell>
              <TableCell>{match.averageheartrate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MatchTable;
