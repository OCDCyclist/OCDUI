import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Box, CssBaseline, Divider, Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import UpdateIcon from '@mui/icons-material/Update';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DatasetIcon from '@mui/icons-material/Dataset';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ScaleIcon from '@mui/icons-material/Scale';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TuneIcon from '@mui/icons-material/Tune';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import BoltIcon from '@mui/icons-material/Bolt';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import SettingsIcon from '@mui/icons-material/Settings';
import FunctionsIcon from '@mui/icons-material/Functions';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import LoginStatus from './authentication/LoginStatus';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 240;

interface OCDCyclistAppBarProps {
  onLogout: () => void;
  onMenuClick: () => void;
  drawerOpen?: boolean;
}

const OCDCyclistAppBar: React.FC<OCDCyclistAppBarProps> = ({
  onLogout,
  onMenuClick,
  drawerOpen = false
}) => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  const toggleItem = (itemText: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemText]: !prevState[itemText],
    }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSelectedItem(path);
  };

  const menuItems = [
    { text: 'Rider Summary', icon: <HomeIcon />, path: '/' },
    {
      text: 'Rides',
      icon: <DirectionsBikeIcon />,
      children: [
        { text: 'Rides', icon: <DirectionsBikeIcon />, path: '/rides/recent' },
        { text: 'Rides by Year', icon: <DirectionsBikeIcon />, path: '/rides/allrides' },
        { text: 'Yesteryear', icon: <TravelExploreIcon />, path: '/rides/lookback' },
        { text: 'Add Ride', icon: <PlusOneIcon />, path: '/rides/add' },
      ]
    },
    {
      text: 'OCDs',
      icon: <CalendarViewMonthIcon />,
      children: [
        { text: 'Cummulatives', icon: <QueryStatsIcon />, path: '/ocds/cummulatives' },
        { text: 'All Cummulatives', icon: <DirectionsBikeIcon />, path: '/ocds/allcummulatives' },
        { text: 'Year and Month', icon: <DatasetIcon />, path: '/ocds/yearandmonth' },
        { text: 'Year and DOW', icon: <ViewWeekIcon />, path: '/ocds/yearanddow' },
        { text: 'Day of Month', icon: <CalendarMonthIcon />, path: '/ocds/monthanddom' },
      ]
    },
    {
      text: 'Segments',
      icon: <AutoAwesomeIcon />,
      children: [
        { text: 'Starred', icon: <AutoAwesomeIcon />, path: '/segments/starred' },
        { text: 'Starred by Month', icon: <AutoAwesomeIcon />, path: '/segments/byMonth' },
        { text: 'Starred by DOW', icon: <ViewWeekIcon />, path: '/segments/byDOW' },
        { text: 'Update Starred', icon: <CalendarMonthIcon />, path: '/segments/updatestarred' },
      ]
    },
    {
      text: 'Power',
      icon: <ElectricMeterIcon />,
      children: [
        { text: 'Power Curve', icon: <BoltIcon />, path: '/power/powercurve' },
      ]
    },
    {
      text: 'Clusters',
      icon: <AnalyticsIcon />,
      children: [
        { text: 'Cluster Setup', icon: <TuneIcon />, path: '/clusters/clustersetup' },
        { text: 'Cluster Centroids', icon: <QueryStatsIcon />, path: '/clusters/clustercentroids' },
        { text: 'Cluster Visuals', icon: <PivotTableChartIcon />, path: '/clusters/clustervisuals' },
      ]
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      children: [
        { text: 'Heatmap', icon: <SolarPowerIcon />, path: '/reports/yearheatmap' },
        { text: 'Milestones', icon: <AirlineStopsIcon />, path: '/reports/milestones' },
        { text: 'In or Outside', icon: <NaturePeopleIcon />, path: '/reports/inoroutside' },
        { text: 'Streaks', icon: <SettingsEthernetIcon />, path: '/reports/streaks' },
        { text: 'Days With Rides', icon: <StackedLineChartIcon />, path: '/reports/ridedayfractions' },
      ]
    },
    {
      text: 'Rider',
      icon: <PersonIcon />,
      children: [
        { text: 'Weight Tracker', icon: <MonitorHeartIcon />, path: '/rider/weighttracker' },
        { text: 'Record Weight', icon: <ScaleIcon />, path: '/rider/addweight' },
        { text: 'Goals', icon: <FlagCircleIcon />, path: '/rider/goals' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/rider/settings' },
      ]
    },
    {
      text: 'Gear',
      icon: <FunctionsIcon />,
      children: [
        { text: 'Bikes', icon: <DirectionsBikeIcon />, path: '/gear/bikes' },
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

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }} component="span">
            OCD Cyclist
          </Typography>
          <LoginStatus
            onLogin={handleLoginLogout}
            onLogout={handleLoginLogout}
            background="dark"
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.text}>
                {!item.children ? (
                  <ListItem
                    sx={{
                      backgroundColor: selectedItem === item.path ? '#fbeacd' : 'transparent'
                    }}
                    onClick={() => handleNavigation(item.path)}
                    component="div"
                  >
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
                            sx={{
                              pl: 4,
                              backgroundColor:
                                selectedItem === subItem.path ? '#fbeacd' : 'transparent'
                            }}
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
            onLogin={handleLoginLogout}
            onLogout={handleLoginLogout}
            background="light"
          />
        </Box>
      </Drawer>
    </>
  );
};

export default OCDCyclistAppBar;
