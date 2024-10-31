import React, { useState, useMemo } from 'react';
import { Box, Select, MenuItem, Button, Stack, Typography } from '@mui/material';

type ElapsedTimeEditorProps = {
  initialSeconds: number;
  onSave: (newSeconds: number) => void;
};

const ElapsedTimeEditor: React.FC<ElapsedTimeEditorProps> = ({ initialSeconds, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(Math.floor(initialSeconds / 3600));
  const [minutes, setMinutes] = useState(Math.floor((initialSeconds % 3600) / 60));
  const [seconds, setSeconds] = useState(initialSeconds % 60);

  const displayTime = useMemo(() => {
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, [hours, minutes, seconds]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setHours(Math.floor(initialSeconds / 3600));
    setMinutes(Math.floor((initialSeconds % 3600) / 60));
    setSeconds(Math.floor(initialSeconds % 60));
    setIsEditing(false);
  }

  const handleSave = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    onSave(totalSeconds);
    setIsEditing(false);
  };

  const handleHoursChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setHours(Number(e.target.value));
  };

  const handleMinutesChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setMinutes(Number(e.target.value));
  };

  const handleSecondsChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSeconds(Number(e.target.value));
  };

  const generateOptions = (maxValue: number) => {
    return Array.from({ length: maxValue + 1 }, (_, index) => (
      <MenuItem key={index} value={index}>
        {String(index).padStart(2, '0')}
      </MenuItem>
    ));
  };

  return (
    <Box>
      {isEditing ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Select value={hours} onChange={handleHoursChange}>
            {generateOptions(23)}
          </Select>
          <Typography>:</Typography>
          <Select value={minutes} onChange={handleMinutesChange}>
            {generateOptions(59)}
          </Select>
          <Typography>:</Typography>
          <Select value={seconds} onChange={handleSecondsChange}>
            {generateOptions(59)}
          </Select>
          <Button variant="contained" color="primary" size="small" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" size="small" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      ) : (
        <Typography onClick={handleEdit} sx={{ cursor: 'pointer' }}>
          {displayTime}
        </Typography>
      )}
    </Box>
  );
};

export default ElapsedTimeEditor;
