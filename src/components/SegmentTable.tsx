import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { SegmentEffortMini } from "../types/types";
import { formatElapsedTimeShort } from "../utilities/formatUtilities";

interface SegmentTableProps {
  segmentEfforts: SegmentEffortMini[];
}

const SegmentTable: React.FC<SegmentTableProps> = ({ segmentEfforts }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof SegmentEffortMini | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  const handleSort = (columnKey: keyof SegmentEffortMini) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedSegmentEfforts = React.useMemo(() => {
    if (!sortConfig.key) return segmentEfforts;
    const sorted = [...segmentEfforts].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [segmentEfforts, sortConfig]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              onClick={() => handleSort('name')}
              sx={{ cursor: 'pointer' }}>
              Name
            </TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('elapsed_time')}
              sx={{ cursor: 'pointer' }}>
              Elapsed
            </TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('moving_time')}
              sx={{ cursor: 'pointer' }}>
              Moving
            </TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('starttime')}
              sx={{ cursor: 'pointer' }}>
              Start
            </TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('endtime')}
              sx={{ cursor: 'pointer' }}>
              End
            </TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('average_watts')}
              sx={{ cursor: 'pointer' }}
            >
              Watts
            </TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('average_heartrate')}
              sx={{ cursor: 'pointer' }}
              >
                HR
              </TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('max_heartrate')}
              sx={{ cursor: 'pointer' }}
              >Max HR</TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('effort_count')}
              sx={{ cursor: 'pointer' }}
              >Efforts</TableCell>
            <TableCell
              align="center"
              onClick={() => handleSort('rank')}
              sx={{ cursor: 'pointer' }}
            >Rank</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSegmentEfforts.map((effort, index) => (
            <TableRow key={index}>
              <TableCell align="left">{effort.name}</TableCell>
              <TableCell align="center">{formatElapsedTimeShort(effort.elapsed_time)}</TableCell>
              <TableCell align="center">{formatElapsedTimeShort(effort.moving_time)}</TableCell>
              <TableCell align="right">{new Date(effort.starttime).toLocaleTimeString()}</TableCell>
              <TableCell align="right">{new Date(effort.endtime).toLocaleTimeString()}</TableCell>
              <TableCell align="right">{effort.average_watts}</TableCell>
              <TableCell align="right">{effort.average_heartrate}</TableCell>
              <TableCell align="right">{effort.max_heartrate}</TableCell>
              <TableCell align="right">{effort.effort_count}</TableCell>
              <TableCell align="right">{effort.rank}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SegmentTable;
