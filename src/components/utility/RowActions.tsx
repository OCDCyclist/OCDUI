import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ClusterDefinition } from '../../types/types';

export interface RowActionsProps {
  actions: {
    label: string;
    callback: (clusterDefinition: ClusterDefinition) => void;
  }[];
  clusterDefinition: ClusterDefinition;
}

const RowActions: React.FC<RowActionsProps> = ({ actions, clusterDefinition }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (callback: (clusterDefinition: ClusterDefinition) => void) => {
    callback(clusterDefinition);
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        aria-label="actions"
        aria-controls={open ? 'row-actions-menu' : undefined}
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="row-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleActionClick(action.callback)}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RowActions;
