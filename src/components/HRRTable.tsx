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
  Box,
} from "@mui/material";

export interface HRRRecord {
  startindex: number;
  endindex: number;
  idxpeakpower: number;
  idxhrpeak: number;
  idxstoppedaling: number;
  peakpower: number;
  hrpeak: number;
  hrr60: number;
  hrr120: number;
  tau: number;
}

interface HRRTableProps {
  hrrData: HRRRecord[];
}

const HRRTable: React.FC<HRRTableProps> = ({ hrrData }) => {
  const hasData = Array.isArray(hrrData) && hrrData.length > 0;

  if (!hasData) {
    return (
      <Typography variant="body1" sx={{ mt: 3 }}>
        No heart rate recovery data for this ride.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Heart Rate Recovery Results
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Peak Power</TableCell>
            <TableCell>Peak HR</TableCell>
            <TableCell>HRR 60s</TableCell>
            <TableCell>HRR 120s</TableCell>
            <TableCell>Tau (s)</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {hrrData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.peakpower}</TableCell>
              <TableCell>{row.hrpeak}</TableCell>
              <TableCell>{row.hrr60}</TableCell>
              <TableCell>{row.hrr120}</TableCell>
              <TableCell>{row.tau.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Benchmark Summary */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Heart Rate Recovery Benchmarks
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>HRR60 (beats drop after 60s):</strong>
          <br />• &gt; 25 bpm → Excellent / high fitness
          <br />• 15–25 bpm → Normal / good
          <br />• &lt; 12 bpm → Poor recovery
          <br />• &lt; 6–8 bpm → Very poor / clinical red flag
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>HRR120 (beats drop after 120s):</strong>
          <br />• &gt; 50 bpm → Excellent
          <br />• 30–50 bpm → Normal
          <br />• &lt; 30 bpm → Poor recovery
        </Typography>

        <Typography variant="body2">
          <strong>τ (Heart rate decay time constant):</strong>
          <br />• Elite cyclists: 40–70s
          <br />• Recreational adults: 70–120s
        </Typography>
      </Box>
    </TableContainer>
  );
};

export default HRRTable;
