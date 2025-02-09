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

interface RideDataFilterProps {
  filters: FilterObject;
  onFilterChange: (updatedFilters: FilterObject) => void;
  hideTagFilter: boolean;
}

const RideDataFilter: React.FC<RideDataFilterProps> = ({ filters, onFilterChange, hideTagFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterObject, value: unknown) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Box sx={{ marginBottom: '1em' }}>
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
          {hideTagFilter !== true && (
            <TagFilter
              value={filters.tags || []}
              optional={filters.availableTags || []}
              onChange={(value) => handleFilterChange('tags', value)}
            />
          )}
          <TextFilter
            value={filters.search || ''}
            onChange={(value) => handleFilterChange('search', value)}
          />
        </Stack>
      </Collapse>
    </Box>
  );
};

export default RideDataFilter;
