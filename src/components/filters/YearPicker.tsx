import React, { useState, useEffect } from 'react';
import { Checkbox, Grid, Typography } from '@mui/material';

interface YearPickerProps {
  startYear: number;
  initialSelectedYears: number[];
  onChange: (selectedYears: number[]) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ startYear, initialSelectedYears, onChange }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYears, setSelectedYears] = useState<number[]>(initialSelectedYears);

  useEffect(() => {
    onChange(selectedYears);
  }, [selectedYears, onChange]);

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
};

  const renderYearCheckbox = (year: number) => {
    const isSelected = selectedYears.includes(year);

    return (
      <Grid item key={year}>
        <Checkbox
          checked={isSelected}
          onChange={() => handleYearToggle(year)}
          disabled={false}
          sx={{
            color: 'green'
          }}
        />
        <Typography variant="body2" sx={{ color:'green' }} component={"span"}>
          {year}
        </Typography>
      </Grid>
    );
  };

  const renderYearRows = () => {
    const years: number[] = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    // Group years by decade
    const decades = years.reduce((acc: Record<number, number[]>, year) => {
      const decade = Math.floor(year / 10) * 10;
      if (!acc[decade]) acc[decade] = []; // Initialize array for each decade
      acc[decade].push(year);
      return acc;
    }, {} as Record<number, number[]>); // Initialize acc as an empty object

    return Object.keys(decades).map((decade) => (
      <Grid container spacing={2} key={decade}>
        {decades[Number(decade)].map((year) => renderYearCheckbox(year))}
      </Grid>
    ));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom component={"span"}>
        Select one or more years to display
      </Typography>
      {renderYearRows()}
    </div>
  );
};

export default YearPicker;
