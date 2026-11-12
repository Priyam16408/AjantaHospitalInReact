import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = () => {
  const data = {
    labels: ['Beds'],
    datasets: [
      {
        label: 'Occupied Bed',
        data: [20], // Number of occupied beds
        backgroundColor: 'green',
      },
      {
        label: 'Pending Bed Clearance',
        data: [90], // Number of beds pending clearance
        backgroundColor: 'yellow',
      },
      {
        label: 'Available Bed',
        data: [128], // Number of available beds
        backgroundColor: 'red',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Allow chart height to be adjusted manually
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,  // Stack the values along the x-axis (horizontal)
        beginAtZero: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    barThickness: 15,  // Controls the height of the bar
    maxBarThickness: 15, // Maximum thickness for the bars (height of the bar)
  };

  return <Bar data={data} options={options} />;
};

export default StackedBarChart;
