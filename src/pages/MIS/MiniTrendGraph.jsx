import React from 'react';

const MiniTrendGraph = ({ value = 9308556, change = 4.98, positive = true }) => {
  const color = positive ? '#10b981' : '#ef4444'; // green / red
  const iconSize = 20;

  const UpwardSVG = () => (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="-77 -77 504 504"
      stroke={color}
      strokeWidth="9.45"
      style={{ marginRight: '6px' }}
    >
      <g>
        <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" />
        <polygon points="218.623,195.004 271.438,119.425 253.165,106.656 322.534,74.229 315.939,150.522 297.668,137.755 227.994,237.459 153.407,194.118 97.979,266.002 72.639,246.461 145.21,152.345" />
      </g>
    </svg>
  );

  const DownwardSVG = () => (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="-52.5 -52.5 455 455"
      stroke={color}
      strokeWidth="9.45"
      style={{ marginRight: '6px' }}
    >
      <g>
        <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" />
        <polygon points="211.232,145.228 264.046,220.807 245.774,233.575 315.143,266.002 308.548,189.709 290.276,202.477 220.604,102.772 146.016,146.113 90.588,74.229 65.247,93.771 137.819,187.887" />
      </g>
    </svg>
  );

  return (
    <div className="d-flex align-items-center gap-2">
      {positive ? <UpwardSVG /> : <DownwardSVG />}
      <div className="d-flex flex-column justify-content-center">
        <div
          className="fw-semibold"
          style={{
            fontSize: '14px',
            color,
            lineHeight: '1.1',
          }}
        >
          ${value.toLocaleString()}
        </div>
        <div
          className="fw-normal"
          style={{
            fontSize: '12px',
            color,
            opacity: 0.85,
          }}
        >
          {positive ? '▲' : '▼'} {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};

export default MiniTrendGraph;
