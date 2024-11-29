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
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, xKey, yKey, fieldLabels }) => {
  // Prepare data for Chart.js
  const chartData: ChartData<"scatter"> = {
    datasets: Array.from(new Set(data.map((point) => point.cluster))).map((cluster) => {
        // Find the clusterindex corresponding to the current cluster
        const clusterPoint = data.find((point) => point.cluster === cluster);

        return {
          datasetIdKey: 'rideid',
          label: clusterPoint ? `${1 + (clusterPoint.clusterindex ?? 0)}: ${cluster}` : `Cluster ${cluster}`,
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
          backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
        };
      }),
    };

    const chartOptions: ChartOptions<"scatter"> = {
        scales: {
          x:{
                title:{
                    display: true,
                    text: fieldLabels[xKey as string] || xKey
                }
            },
          y:{
                title: {
                    display: true,
                    text: fieldLabels[yKey as string] || yKey
                }
            },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                // Access x and y values
                const xValue = context.raw.x || '';
                const yValue = context.raw.y || '';
                const xLabel = context.chart.options.scales?.x?.title?.text || "X"; // Get the x-axis label
                const yLabel = context.chart.options.scales?.y?.title?.text || "Y"; // Get the y-axis label
                const title = context.raw?.title ?? '';
                const date = formatDate(context.raw?.date ?? '');

                // Customize the tooltip text
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
