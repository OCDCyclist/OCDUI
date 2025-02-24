import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { SegmentEffort } from "../types/types";
import { formatElapsedTimeShort } from "../utilities/formatUtilities";


interface SegmentTableProps {
  segmentEfforts: SegmentEffort[];
}

const SegmentTable: React.FC<SegmentTableProps> = ({ segmentEfforts }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Elapsed</TableCell>
            <TableCell>Moving</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Watts</TableCell>
            <TableCell>HR</TableCell>
            <TableCell>Max HR</TableCell>
            <TableCell>Efforts</TableCell>
            <TableCell>Rank</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {segmentEfforts.map((effort, index) => (
            <TableRow key={index}>
              <TableCell>{effort.name}</TableCell>
              <TableCell>{formatElapsedTimeShort(effort.elapsed_time)}</TableCell>
              <TableCell>{formatElapsedTimeShort(effort.moving_time)}</TableCell>
              <TableCell>{new Date(effort.starttime).toLocaleTimeString()}</TableCell>
              <TableCell>{new Date(effort.endtime).toLocaleTimeString()}</TableCell>
              <TableCell>{effort.average_watts}</TableCell>
              <TableCell>{effort.average_heartrate}</TableCell>
              <TableCell>{effort.max_heartrate}</TableCell>
              <TableCell>{effort.effort_count}</TableCell>
              <TableCell>{effort.rank}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SegmentTable;
