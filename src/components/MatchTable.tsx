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
import { MatchRow, ReferenceLevel } from "../types/types";
import { formatDateTime, formatElapsedTimeShort } from "../utilities/formatUtilities";
import { getLevelForPower } from "../utilities/metricsUtils";

// Define the props interface.
interface MatchTableProps {
  matches: MatchRow[];
  referenceLevels: ReferenceLevel[];
  weight: number | null | undefined;
}

const MatchTable: React.FC<MatchTableProps> = ({ matches, referenceLevels, weight }) => {

  const title = matches.length > 0 ? `Matches burned on this ride (${matches.length})` : "No matches burned on this ride";

  if (matches.length === 0)
    return (
      <Typography variant="h6" align="center" gutterBottom>
      {title}
      </Typography>
  )

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Start</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Period (s)</TableCell>
            <TableCell align="center">Power (w)</TableCell>
            <TableCell align="center">Actual Period (s)</TableCell>
            <TableCell align="center">Actual Power (w)</TableCell>
            <TableCell align="center">Max Sustained (w)</TableCell>
            <TableCell align="center">Max Sustained (w/kg)</TableCell>
            <TableCell align="center">Peak Power (w)</TableCell>
            <TableCell align="center">HR</TableCell>
            <TableCell align="center">Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map((match, index) => (
            <TableRow key={index}>
              <TableCell align="left">{formatDateTime(match.starttime)}</TableCell>
              <TableCell align="left">{match.type}</TableCell>
              <TableCell align="center">{`${formatElapsedTimeShort(match.period)}`}</TableCell>
              <TableCell align="center">{match.targetpower}</TableCell>
              <TableCell align="center">{`${formatElapsedTimeShort(match.actualperiod)}`}</TableCell>
              <TableCell align="center">{match.averagepower}</TableCell>
              <TableCell align="center">{match.maxaveragepower}</TableCell>
              <TableCell align="center">
                {
                  weight && typeof weight === "number"//
                  ? `${(match.maxaveragepower / weight).toFixed(1)} wkg`
                  : ""
                }
              </TableCell>
              <TableCell align="center">{match.peakpower}</TableCell>
              <TableCell align="center">{match.averageheartrate}</TableCell>
              <TableCell align="center">
                {
                  weight && typeof weight === "number"
                  ? getLevelForPower(referenceLevels, match.maxaveragepower / weight, match.period) || ""
                  : ""
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MatchTable;
