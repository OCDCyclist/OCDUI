import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js";
import { RideDataWithTagsClusters } from "../../types/types";
import { formatDate } from "../../utilities/formatUtilities";

// Register required components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface ScatterPlotProps {
  data: RideDataWithTagsClusters[];
  xKey: keyof RideDataWithTagsClusters;
  yKey: keyof RideDataWithTagsClusters;
  fieldLabels: Record<string, string>;
  colors: string[];
  highlightedRide?: RideDataWithTagsClusters | null;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, xKey, yKey, fieldLabels, colors, highlightedRide }) => {
  const chartData: ChartData<"scatter"> = {
    datasets: Array.from(new Set(data.map((point) => point.cluster))).map((cluster) => {
      const clusterIndex = data.find((point) => point.cluster === cluster)?.clusterindex ?? 0;

      return {
        datasetIdKey: "rideid",
        label: `${cluster}`,
        data: data
          .filter((point) => point.cluster === cluster)
          .map((point) => ({
            x: point[xKey],
            y: point[yKey],
            clusterindex: point.clusterindex,
            rideid: point.rideid,
            title: point.title,
            date: point.date,
          })),
        backgroundColor: colors[clusterIndex % colors.length],
        pointRadius: (context) => {
          const ride = context.raw;
          return highlightedRide && ride.rideid === highlightedRide.rideid ? 8 : 4;
        },
        pointBorderColor: (context) => {
          const ride = context.raw;
          return highlightedRide && ride.rideid === highlightedRide.rideid ? "black" : "rgba(0,0,0,0)";
        },
        pointBorderWidth: (context) => {
          const ride = context.raw;
          return highlightedRide && ride.rideid === highlightedRide.rideid ? 2 : 0;
        },
      };
    }),
  };

  const chartOptions: ChartOptions<"scatter"> = {
    scales: {
      x: {
        title: {
          display: true,
          text: fieldLabels[xKey as string] || xKey,
        },
      },
      y: {
        title: {
          display: true,
          text: fieldLabels[yKey as string] || yKey,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const xValue = context.raw.x || "";
            const yValue = context.raw.y || "";
            const xLabel = context.chart.options.scales?.x?.title?.text || "X";
            const yLabel = context.chart.options.scales?.y?.title?.text || "Y";
            const title = context.raw?.title ?? "";
            const date = formatDate(context.raw?.date ?? "");

            return `${xLabel}: ${xValue}, ${yLabel}: ${yValue}, date: ${date}, title: ${title}`;
          },
        },
      },
    },
    responsive: true,
  };

  return <Scatter data={chartData} options={chartOptions} />;
};

export default ScatterPlot;
