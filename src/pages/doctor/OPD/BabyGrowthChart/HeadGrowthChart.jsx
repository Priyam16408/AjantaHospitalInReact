import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js modules
Chart.register(...registerables);

const HeadGrowthChart = ({ apiResponse, Sex }) => {
  // Process the API response to prepare chart data
  const labels = apiResponse.map((item) => item.age); // X-axis (age in months)
  const abnormalUpper = apiResponse.map((item) => item.abnormalUpperValue);
  const abnormalMiddle = apiResponse.map((item) => item.abnormalMiddleValue);
  const normal = apiResponse.map((item) => item.normalValue);
  const abnormalLower = apiResponse.map((item) => item.abnormalLowerValue);
  const abnormalLowerMiddle = apiResponse.map(
    (item) => item.abnormalLowerMiddleValue
  );

  // Prepare datasets and filter out lines where all values are 0
  const datasets = [
    {
      label: " Upper",
      data: abnormalUpper,
      borderColor: "black",
      borderWidth: 1.5,
      fill: false,
      tension: 0.4,
    },
    {
      label: " Middle",
      data: abnormalMiddle,
      borderColor: "red",
      borderWidth: 1.5,
      fill: false,
      tension: 0.4,
    },
    {
      label: "Normal",
      data: normal,
      borderColor: "blue",
      borderWidth: 1.5,
      fill: false,
      tension: 0.4,
    },
    {
      label: " Lower",
      data: abnormalLower,
      borderColor: "green",
      borderWidth: 1.5,
      fill: false,
      tension: 0.4,
    },
    {
      label: " Lower Middle",
      data: abnormalLowerMiddle,
      borderColor: "orange",
      borderWidth: 1.5,
      fill: false,
      tension: 0.4,
    },
  ].filter((dataset) => dataset.data.some((value) => value !== 0)); // Exclude datasets with all 0 values

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable default aspect ratio for better control
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: `Baby ${Sex === "Male" ? "Boy" : "Girl"} Head Growth Chart`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Age (months)",
        },
        grid: {
          color: "#ddd",
        },
      },
      y: {
        title: {
          display: true,
          text: "Head Circumference (cm)", // Updated for head circumference
        },
        ticks: {
          callback: function (value) {
            return `${value} cm`; // Append "cm" to Y-axis values
          },
        },
        beginAtZero: false,
        grid: {
          color: "#ddd",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%", // Prevent chart from exceeding container width
        margin: "0 auto", // Center the chart
        padding: "1rem",
      }}
    >
      <div
        style={{
          height: "76vh", // Adjust height dynamically for responsiveness
          minHeight: "300px", // Set a minimum height for smaller screens
        }}
      >
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HeadGrowthChart;
