import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface DisplayPowerProps {
    power: number;
    wattsPerKilo: number;
    onClick?: () => void;
}

const DisplayPower: React.FC<DisplayPowerProps> = ({ power, wattsPerKilo, onClick }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            whiteSpace="nowrap"
            onClick={onClick}
            sx={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'normal', marginRight: 2 }}>
                {power} W
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" component="span">
                {wattsPerKilo.toFixed(1)} W/kg
            </Typography>
        </Box>
    );
};

export default DisplayPower;
