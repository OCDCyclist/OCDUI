import React, { useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

type Decade = '1990-1995' | '1995-2000' | '2000-2005' | '2005-2010' | '2005-2010' | '2010-2015' | '2015-2020' | '2020-2025';

interface DecadeSelectorProps {
  onDecadeChange: (selectedDecades: number[]) => void;
}

const DecadeSelector: React.FC<DecadeSelectorProps> = ({ onDecadeChange }) => {
  const [selectedDecades, setSelectedDecades] = useState<{ [key in Decade]: boolean }>({
    '1990-1995': false,
    '1995-2000': false,
    '2000-2005': false,
    '2005-2010': false,
    '2010-2015': false,
    '2015-2020': false,
    '2020-2025': false,
  });

  const handleDecadeChange = (decade: Decade) => {
    setSelectedDecades((prevSelected) => {
      const updatedSelected = {
        ...prevSelected,
        [decade]: !prevSelected[decade],
      };

      // Extract the start year from each selected decade and pass it to the parent component
      const selectedStartYears = (Object.keys(updatedSelected) as Decade[])
        .filter((dec) => updatedSelected[dec])
        .map((dec) => parseInt(dec.split('-')[0]));

      onDecadeChange(selectedStartYears);

      return updatedSelected;
    });
  };

  return (
    <FormGroup row sx={{ marginY: 2 }} style={{ marginLeft: '16px' }}>
      {Object.keys(selectedDecades).map((decade) => (
        <FormControlLabel
          key={decade}
          control={
            <Checkbox
              checked={selectedDecades[decade as Decade]}
              onChange={() => handleDecadeChange(decade as Decade)}
              name={decade}
            />
          }
          label={decade}
        />
      ))}
    </FormGroup>
  );
};

export default DecadeSelector;
