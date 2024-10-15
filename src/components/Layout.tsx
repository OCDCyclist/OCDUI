import React from 'react';
import OCDCyclistAppBar from './OCDCyclistAppBar';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <>
      <OCDCyclistAppBar onLogout={handleLogout} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: { sm: `${drawerWidth}px` }, // Shift content when drawer is open
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Add toolbar space to avoid content under app bar */}
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
