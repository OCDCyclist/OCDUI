import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/authentication/Login';
import UpdateStrava from './pages/UpdateStrava';
import UpdateMetrics from './pages/UpdateMetrics.';
import RiderSummary from './pages/RiderSummary';
import AddWeight from './pages/AddWeight';
import WeightTracker from './pages/WeightTracker';
import CumulativeDataComponent from './components/CumulativeDataComponent';
import YearAndMonthComponent from './components/YearAndMonthComponent';
import YearAndDOWComponent from './components/YearAndDOWComponent';
import MonthAndDOMComponent from './components/MonthAndDOMComponent';
import AddRide from './pages/AddRide';
import RideListComponent from './components/RideListComponent';
import RideAllComponent from './components/RideAllComponent';
import RideLookbackComponent from './components/RideLookbackComponent';
import StarredSegmentsComponent from './components/StarredSegmentsComponent';
import UpdateStravaStarredSegments from './pages/UpdateStravaStarredSegments';
import ClusterDefinitionComponent from './components/ClusterDefinitionComponent';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RiderSummary />} />
          <Route path="login" element={<Login />} />
          <Route path="ocds/cummulatives" element={<CumulativeDataComponent />} />
          <Route path="ocds/yearandmonth" element={<YearAndMonthComponent />} />
          <Route path="ocds/yearanddow" element={<YearAndDOWComponent />} />
          <Route path="ocds/monthanddom" element={<MonthAndDOMComponent />} />
          <Route path="updateStrava" element={<UpdateStrava />} />
          <Route path="UpdateMetrics" element={<UpdateMetrics />} />
          <Route path="rider/weighttracker" element={<WeightTracker />} />
          <Route path="rider/addweight" element={<AddWeight />} />
          <Route path="rides/recent" element={<RideListComponent />} />
          <Route path="rides/lookback" element={<RideLookbackComponent />} />
          <Route path="rides/allrides" element={<RideAllComponent />} />
          <Route path="rides/add" element={<AddRide />} />
          <Route path="segments/starred" element={<StarredSegmentsComponent />} />
          <Route path="segments/updatestarred" element={<UpdateStravaStarredSegments />} />
          <Route path="/analysis/clusterdefinition" element={<ClusterDefinitionComponent />} />
          <Route path="/analysis/clustervisuals" element={<StarredSegmentsComponent />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
