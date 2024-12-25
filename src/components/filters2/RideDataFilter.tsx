import React, { useState } from 'react';
import { Box, Button, Collapse, Stack } from '@mui/material';
import DayOfWeekFilter from './DayofWeekFilter';
import MonthFilter from './MonthFilter';
import TagFilter from './TagFilter';
import TextFilter from './TextFilter';

export interface FilterObject {
  dayOfWeek?: number[];
  month?: number[];
  tags?: string[];
  availableTags?: string[];
  search?: string;
}

interface ParentFilterProps {
  filters: FilterObject;
  onFilterChange: (updatedFilters: FilterObject) => void;
}

const ParentFilter: React.FC<ParentFilterProps> = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof FilterObject, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Box 
      sx={{
        marginBottom: '1em',
      }}
    >
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Filters' : 'Show Filters'}
      </Button>
      <Collapse in={isOpen}>
        <Stack spacing={2} mt={2}>
          <DayOfWeekFilter
            value={filters.dayOfWeek || []}
            onChange={(value) => handleFilterChange('dayOfWeek', value)}
          />
          <MonthFilter
            value={filters.month || []}
            onChange={(value) => handleFilterChange('month', value)}
          />
          <TagFilter
            value={filters.tags || []}
            optional={filters.availableTags || []}
            onChange={(value) => handleFilterChange('tags', value)}
          />
          <TextFilter
            value={filters.search || ''}
            onChange={(value) => handleFilterChange('search', value)}
          />
        </Stack>
      </Collapse>
    </Box>
  );
};

export default ParentFilter;
