import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/authentication/Login';
import UpdateStrava from './pages/UpdateStrava';
import UpdateMetrics from './pages/UpdateMetrics.';
import RiderSummary from './pages/RiderSummary';
import AddWeight from './pages/AddWeight';
import WeightTracker from './pages/WeightTracker';
import CumulativeDataComponent from './components/CummulativeDataComponent';
import YearAndMonthComponent from './components/YearAndMonthComponent';
import YearAndDOWComponent from './components/YearAndDOWComponent';
import MonthAndDOMComponent from './components/MonthAndDOMComponent';
import StreaksComponent from './components/StreaksComponent';
import AddRide from './pages/AddRide';
import RideListComponent from './components/RideListComponent';
import RideAllComponent from './components/RideAllComponent';
import RideLookbackComponent from './components/RideLookbackComponent';
import StarredSegmentsComponent from './components/StarredSegmentsComponent';
import UpdateStravaStarredSegments from './pages/UpdateStravaStarredSegments';
import ClusterSetup from './components/ClusterSetup';
import ClusterCentroidTable from './components/ClusterCentroidTable';
import ClusterVisualization from './components/ClusterVisualization';
import CummulativeAllComponent from './components/CummulativeAllComponent';
import PowerCurverVisualization from './components/PowerCurverVisualization';
import MilestonesComponent from './components/MilestonesComponent';
import YearAndIndoorOutdoorData from './components/YearAndInOrOutsideComponent';
import UserSettingsTable from './components/UserSettings';
import BikesComponent from './components/BikesComponent';
import GoalsComponent from './components/GoalsComponent';
import MonthDayMetricTableComponent from './components/MonthDayMetricTableComponent';
import RideDayFractionsComponent from './components/RideDayFractionsComponent';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RiderSummary />} />
          <Route path="login" element={<Login />} />
          <Route path="ocds/cummulatives" element={<CumulativeDataComponent />} />
          <Route path="ocds/allcummulatives" element={<CummulativeAllComponent />} />
          <Route path="ocds/yearandmonth" element={<YearAndMonthComponent />} />
          <Route path="ocds/yearanddow" element={<YearAndDOWComponent />} />
          <Route path="ocds/monthanddom" element={<MonthAndDOMComponent />} />
          <Route path="ocds/monthanddomvertical" element={<MonthDayMetricTableComponent />} />
          <Route path="/ocds/streaks" element={<StreaksComponent />} />
          <Route path="/ocds/milestones" element={<MilestonesComponent />} />
          <Route path="/ocds/inoroutside" element={<YearAndIndoorOutdoorData />} />
          <Route path="/ocds/ridedayfractions" element={<RideDayFractionsComponent />} />
          <Route path="updateStrava" element={<UpdateStrava />} />
          <Route path="UpdateMetrics" element={<UpdateMetrics />} />
          <Route path="rider/weighttracker" element={<WeightTracker />} />
          <Route path="rider/addweight" element={<AddWeight />} />
          <Route path="rider/goals" element={<GoalsComponent />} />
          <Route path="rider/settings" element={<UserSettingsTable />} />
          <Route path="gear/bikes" element={<BikesComponent />} />
          <Route path="rides/recent" element={<RideListComponent />} />
          <Route path="rides/lookback" element={<RideLookbackComponent />} />
          <Route path="rides/allrides" element={<RideAllComponent />} />
          <Route path="rides/add" element={<AddRide />} />
          <Route path="segments/starred" element={<StarredSegmentsComponent />} />
          <Route path="segments/updatestarred" element={<UpdateStravaStarredSegments />} />
          <Route path="/analysis/clustersetup" element={<ClusterSetup />} />
          <Route path="/analysis/clustercentroids" element={<ClusterCentroidTable />} />
          <Route path="/analysis/clustervisuals" element={<ClusterVisualization />} />
          <Route path="/power/powercurve" element={<PowerCurverVisualization />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
