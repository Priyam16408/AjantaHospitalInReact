import React from "react";

const PercentageChart = ({
  percentage,
  radius = 100,
  stroke = 10,
  strokeColor,
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#d6d6d6"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={strokeColor}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}  // Rotate the circle by -90 degrees
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        stroke="#000"
        strokeWidth="1px"
        dy=".3em"
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default PercentageChart;
