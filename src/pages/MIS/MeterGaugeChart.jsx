import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Customized
} from 'recharts';

const GaugeWithNeedle = ({ value = 75 }) => {
  const angle = 180 - (value / 100) * 180; // Convert value to angle (0-100 → 180-0)

  const getColor = () => {
    if (value < 40) return '#dc3545'; // red
    if (value < 70) return '#ffc107'; // yellow
    return '#28a745'; // green
  };

  const needle = (props) => {
    const { cx, cy, radius } = props;
    const length = radius - 10;

    const rad = (Math.PI * angle) / 180;
    const x = cx + length * Math.cos(rad);
    const y = cy - length * Math.sin(rad);

    return (
      <>
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke="#333"
          strokeWidth={3}
        />
        {/* Needle base circle */}
        <circle cx={cx} cy={cy} r={5} fill="#333" />
      </>
    );
  };

  const data = [
    { value: 100, fill: '#e9ecef' },
    { value, fill: getColor() }
  ];

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="100%"
          innerRadius="80%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          barSize={20}
          data={data}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            minAngle={15}
            clockWise
            dataKey="value"
            cornerRadius={10}
          />
          <Customized component={needle} />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Value Display */}
      <div className="text-center mt-2">
        <div className="fw-bold fs-5" style={{ color: getColor() }}>
          {value}% {value < 40 ? 'Poor' : value < 70 ? 'Average' : 'Good'}
        </div>
      </div>
    </div>
  );
};

export default GaugeWithNeedle;
