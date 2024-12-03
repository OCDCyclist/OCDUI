import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, Divider, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Close icon
import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import UpdateIcon from '@mui/icons-material/Update';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DayOfMonthIcon from '@mui/icons-material/CalendarViewDay';
import DatasetIcon from '@mui/icons-material/Dataset';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ScaleIcon from '@mui/icons-material/Scale';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import LoginStatus from './authentication/LoginStatus';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TuneIcon from '@mui/icons-material/Tune';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

const drawerWidth = 240;

interface OCDCyclistAppBarProps {
  onLogout: () => void;
}

const OCDCyclistAppBar: React.FC<OCDCyclistAppBarProps> = ({ onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({}); // New state for collapsible items

  useEffect(() => {
    const savedDrawerState = localStorage.getItem('drawerOpen');
    if (savedDrawerState) {
      setDrawerOpen(savedDrawerState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('drawerOpen', drawerOpen.toString());
  }, [drawerOpen]);

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleItem = (itemText: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemText]: !prevState[itemText], // Toggle the specific item
    }));
  };

  const menuItems = [
    { text: 'Rider Summary', icon: <HomeIcon />, path: '/' },
    {
      text: 'Rides',
      icon: <DirectionsBikeIcon />,
      children: [
        { text: 'Rides', icon: <DirectionsBikeIcon />, path: '/rides/recent' },
        { text: 'All Rides', icon: <DirectionsBikeIcon />, path: '/rides/allrides' },
        { text: 'Yesteryear', icon: <TravelExploreIcon />, path: '/rides/lookback' },
        { text: 'Add Ride', icon: <PlusOneIcon />, path: '/rides/add' },
      ]
    },

    {
      text: 'OCDs',
      icon: <CalendarViewMonthIcon />,
      children: [
        { text: 'Cummulatives', icon: <QueryStatsIcon />, path: '/ocds/cummulatives' },
        { text: 'Year and Month', icon: <DatasetIcon />, path: '/ocds/yearandmonth' },
        { text: 'Year and DOW', icon: <DayOfMonthIcon />, path: '/ocds/yearanddow' },
        { text: 'Day of Month', icon: <CalendarMonthIcon />, path: '/ocds/monthanddom' }
      ]
    },

    {
      text: 'Segments',
      icon: <AutoAwesomeIcon />,
      children: [
        { text: 'Starred', icon: <AutoAwesomeIcon />, path: '/segments/starred' },
        { text: 'Update Starred', icon: <AutoAwesomeIcon />, path: '/segments/updatestarred' },
      ]
    },

    {
      text: 'Analysis',
      icon: <AnalyticsIcon />,
      children: [
        { text: 'Cluster Setup', icon: <TuneIcon />, path: '/analysis/clustersetup' },
        { text: 'Cluster Centroids', icon: <QueryStatsIcon />, path: '/analysis/clustercentroids' },
        { text: 'Cluster Visuals', icon: <PivotTableChartIcon />, path: '/analysis/clustervisuals' },
      ]
    },

    {
      text: 'Rider',
      icon: <PersonIcon />,
      children: [
        { text: 'Weight Tracker', icon: <MonitorHeartIcon />, path: '/rider/weighttracker' },
        { text: 'Record Weight', icon: <ScaleIcon />, path: '/rider/addweight' },
        { text: 'Settings', icon: <SettingsApplicationsIcon />, path: '/rider/settings' },
      ]
    },

    {
      text: 'Updates',
      icon: <RefreshIcon />,
      children: [
        { text: 'Update Strava', icon: <UpdateIcon />, path: '/updateStrava' },
        { text: 'Update Metrics', icon: <UpdateIcon />, path: '/updateMetrics' },
      ]
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            OCD Cyclist
          </Typography>
          <LoginStatus
            onLogin={() => {
              handleLoginLogout();
            }}
            onLogout={() => {
              handleLoginLogout();
            }}
            background="dark" // AppBar background
          />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '0 8px' }}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.text}>
                {!item.children ? (
                  <ListItem onClick={() => handleNavigation(item.path)} component="div">
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ) : (
                  <>
                    <ListItem onClick={() => toggleItem(item.text)} component="div">
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                      {openItems[item.text] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((subItem) => (
                          <ListItem
                            component="div"
                            key={subItem.text}
                            sx={{ pl: 4 }}
                            onClick={() => handleNavigation(subItem.path)}
                          >
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.text} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
        <Divider />
        <Box sx={{ padding: 2 }}>
          <LoginStatus
            onLogin={() => {
              handleLoginLogout();
            }}
            onLogout={() => {
              handleLoginLogout();
            }}
            background="light" // AppBar background
          />
        </Box>
      </Drawer>
    </>
  );
};

export default OCDCyclistAppBar;
