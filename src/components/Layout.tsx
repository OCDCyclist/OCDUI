import React, { useState } from 'react';
import OCDCyclistAppBar from './OCDCyclistAppBar';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login
  };

  const handleMenuClick = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <OCDCyclistAppBar
        onLogout={handleLogout}
        onMenuClick={handleMenuClick}
        drawerOpen={drawerOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: { sm: drawerOpen ? `${drawerWidth}px` : 0 }, // Shift only when open
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeInOut,
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
