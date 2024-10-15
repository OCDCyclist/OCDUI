import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import UpdateStrava from './pages/UpdateStrava';
import RiderSummary from './pages/RiderSummary';
import AddWeight from './pages/AddWeight';
import WeightTracker from './pages/WeightTracker';
import CumulativeDataComponent from './components/CumulativeDataComponent';
import YearAndMonthComponent from './components/YearAndMonthComponent';
import AddRide from './pages/AddRide';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RiderSummary />} />
          <Route path="login" element={<Login />} />
          <Route path="ocds/cummulatives" element={<CumulativeDataComponent />} />
          <Route path="ocds/yearandmonth" element={<YearAndMonthComponent />} />
          <Route path="updateStrava" element={<UpdateStrava />} />
          <Route path="rider/weighttracker" element={<WeightTracker />} />
          <Route path="rider/addweight" element={<AddWeight />} />

          <Route path="rides/recent" element={<AddRide />} />
          <Route path="rides/add" element={<AddRide />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
