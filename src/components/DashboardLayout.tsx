import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import OCDCyclistLogo from '../../src/assets/OCDCyclistLogo.webp';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token on logout
    navigate('/Login');
  };

  return (
    <div className="dashboard-layout">
      <header>
      <img src={OCDCyclistLogo} alt="App Logo" className="logo" style={{ width: '100px', height: 'auto' }} />
      <h1>OCD Cyclist</h1>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </header>
      <div className="container">
        <aside className="sidebar">
          <ul>
            <li><Link to="/dashboard/summary">Summary</Link></li>
            <li><Link to="/dashboard/addRide">Add Ride</Link></li>
            <li><Link to="/dashboard/addWeight">Add Weight</Link></li>
            <li><Link to="/dashboard/rides">Rides</Link></li>
            <li><Link to="/dashboard/ocds">OCDs</Link></li>
            <li><Link to="/dashboard/segments">Segments</Link></li>
            <li><Link to="/dashboard/config">Configuration</Link></li>
            <li><Link to="/dashboard/updateStrava">Update Strava</Link></li>
          </ul>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
