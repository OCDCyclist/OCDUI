import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { RideData } from './RideListComponent';
import { formatBoolean, formatDate, formatElapsedTime, formatInteger, formatNumber } from '../utilities/formatUtilities';

interface RideDetailProps {
  rideData: RideData | null;
  onClose: () => void;
}

const RideDetail = ({ rideData, onClose }: RideDetailProps) => {
  if (!rideData) {
    return <Typography variant="h6">No ride data available.</Typography>;
  }

  // Define table rows data
  const rows = [
    { label: 'Date', value: rideData.date },
    { label: 'Distance', value: `${rideData.distance} km` },
    { label: 'Avg Speed', value: `${rideData.speedavg} km/h` },
    { label: 'Max Speed', value: `${rideData.speedmax} km/h` },
    { label: 'Avg HR', value: `${rideData.hravg} bpm` },
    { label: 'Max HR', value: `${rideData.hrmax} bpm` },
    { label: 'Avg Power', value: `${rideData.poweravg} watts` },
    { label: 'Max Power', value: `${rideData.powermax} watts` },
    { label: 'Normalized Power', value: `${rideData.powernormalized} watts` },
    { label: 'Elevation Gain', value: `${rideData.elevationgain} m` },
    { label: 'Elevation Loss', value: `${rideData.elevationloss} m` },
    { label: 'Elapsed Time', value: formatElapsedTime(rideData.elapsedtime) },
    { label: 'Cadence', value: `${rideData.cadence} rpm` },
    { label: 'Trainer', value: rideData.trainer ? 'Yes' : 'No' },
    { label: 'TSS', value: rideData.tss },
    { label: 'Intensity Factor', value: rideData.intensityfactor },
  ];

  return (
    <Container maxWidth="lg" sx={{ marginY: 5 }}>
      <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: '0 auto' }}>
        <Typography variant="h5" align="center" paddingBottom={3}>
          {rideData.title || 'Ride Detail'}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow
                    key={'ride-date'}
                    sx={{
                      backgroundColor: '#f9f9f9' // '#fff',
                    }}
                >
                <TableCell>Ride Date</TableCell><TableCell>{formatDate(rideData.date)}</TableCell>
                <TableCell>Elapsed Time</TableCell><TableCell>{`${formatElapsedTime(rideData.elapsedtime)}`}</TableCell>
              </TableRow>
              <TableRow
                    key={'ride-speed'}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                >
                <TableCell>Avg Speed</TableCell><TableCell>{`${formatNumber(rideData.speedavg)} mph`}</TableCell>
                <TableCell>Max Speed</TableCell><TableCell>{`${formatNumber(rideData.speedmax)} mph`}</TableCell>
              </TableRow>
              <TableRow
                    key={'ride-elevation'}
                    sx={{
                      backgroundColor: '#f9f9f9',
                    }}
                >
                <TableCell>Elevation Gain</TableCell><TableCell>{`${formatInteger(rideData.elevationgain)} mph`}</TableCell>
                <TableCell>Elevation Loss</TableCell><TableCell>{`${formatInteger(rideData.elevationloss)} mph`}</TableCell>
              </TableRow>

              <TableRow
                    key={'ride-hr'}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                >
                <TableCell>Avg HR</TableCell><TableCell>{`${formatInteger(rideData.hravg)} bpm`}</TableCell>
                <TableCell>Max HR</TableCell><TableCell>{`${formatInteger(rideData.hrmax)} bpm`}</TableCell>
              </TableRow>
              <TableRow
                    key={'ride-power'}
                    sx={{
                      backgroundColor: '#f9f9f9',
                    }}
                >
                <TableCell>Avg Power</TableCell><TableCell>{`${formatInteger(rideData.poweravg)} w`}</TableCell>
                <TableCell>Max Power</TableCell><TableCell>{`${formatInteger(rideData.powermax)} w`}</TableCell>
              </TableRow>
              <TableRow
                    key={'ride-normalized'}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                >
                <TableCell>Normalized Power</TableCell><TableCell>{`${formatInteger(rideData.powernormalized)} w`}</TableCell>
                <TableCell>Intentsity Factor</TableCell><TableCell>{`${formatNumber(100 * rideData.intensityfactor)} %`}</TableCell>
              </TableRow>
              <TableRow
                    key={'ride-tss'}
                    sx={{
                      backgroundColor: '#f9f9f9',
                    }}
                >
                <TableCell>TSS</TableCell><TableCell>{`${formatInteger(rideData.tss)}`}</TableCell>
                <TableCell>Cadence</TableCell><TableCell>{`${formatInteger(rideData.cadence)}`}</TableCell>
              </TableRow>
              <TableRow
                    key={'ride-other'}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                >
                <TableCell>Trainer</TableCell><TableCell>{`${formatBoolean(rideData.trainer)}`}</TableCell>
                <TableCell></TableCell><TableCell></TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ marginTop: 4, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        >
          Close
        </Button>
      </Paper>
    </Container>
  );
};

export default RideDetail;
