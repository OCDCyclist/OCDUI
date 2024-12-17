import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ChipProps, SxProps, Theme } from '@mui/material';

// Define the props interface
interface TagChipsProps {
  tags: string[];
  color?: 'primary' | 'secondary' | 'default' | string; // Allows for theme colors or custom hex
  onClick?: (tag: string) => void;
  onDelete?: (tag: string) => void;
}

// Component definition
const TagChips: React.FC<TagChipsProps> = ({ tags, color = 'default' }) => {
  // Determine if color is a theme color or custom color
  const chipColor: ChipProps['color'] | undefined =
    ['primary', 'secondary', 'default'].includes(color) ? color as ChipProps['color'] : undefined;
  const customColor: SxProps<Theme> = !chipColor ? { backgroundColor: color, color: '#fff' } : {};

  return (
    <Stack direction="row" spacing={1}>
      {Array.isArray(tags) && tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          size="small"
          color={chipColor}
          sx={customColor}
        />
      ))}
    </Stack>
  );
};

export default TagChips;
