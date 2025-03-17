import React from "react";
import LinearLoader from "./loaders/LinearLoader";
import { useFetchPowerCurves } from "../api/user/useFetchPowerCurves";
import PowerCurveChart from "./plotting/PowerCurveChart";
import { Alert } from "@mui/material";

const PowerCurverVisualization: React.FC = () => {
  const token = localStorage.getItem("token");
  const { data: dataPowerCurve, loading: loadingPowerCurve, error: errorPowerCurve } = useFetchPowerCurves(token ?? "");

  if (loadingPowerCurve) return <LinearLoader message="Loading power curves" />;
  if (errorPowerCurve) return <Alert severity="error">{`Error loading power curves: ${errorPowerCurve}`}</Alert>;

  return (
    <div style={{ width: "80vw", maxWidth: "1000px", height: "65vh", maxHeight: "600px", margin: "0 auto" }}>
      <h2>Power Curve</h2>
      <PowerCurveChart data={dataPowerCurve} />
    </div>
  );
};

export default PowerCurverVisualization;
