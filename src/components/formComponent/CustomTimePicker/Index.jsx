import React, { useEffect, useState } from "react";
import "../CustomTimePicker/CustomTimePicker.css";

const Index = ({ onClose, onSelect,initialTime }) => {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const [mode, setMode] = useState("hour");
  const [selectedHour, setSelectedHour] = useState("3");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [period, setPeriod] = useState("AM");

  const handleClockClick = (value) => {
    if (mode === "hour") {
      setSelectedHour(value);
      setMode("minute");
    } else {
      setSelectedMinute(value);
    }
  };

  const handleOK = () => {
    onSelect?.(selectedHour, selectedMinute, period);
    onClose?.();
  };
     useEffect(() => {
    if (initialTime) {
      const [time, p] = initialTime.split(" ");
      const [h, m] = time.split(":");
      setSelectedHour(h);
      setSelectedMinute(m);
      setPeriod(p);
    }
  }, [initialTime]);

  return (
    <div className="custom-clock-container background-theme-colo">
      <div className="custom-clock-header">
        <div className="custom-time-display">
          <span className="pointer-cursor" onClick={() => setMode("hour")}>{selectedHour}</span>:
          <span onClick={() => setMode("minute")}>{selectedMinute}</span>
          <span className="custom-period-toggle">
            <span
              className={period === "AM" ? "custom-active" : ""}
              onClick={() => setPeriod("AM")}
            >
              AM
            </span>
            <span
              className={period === "PM" ? "custom-active" : ""}
              onClick={() => setPeriod("PM")}
            >
              PM
            </span>
          </span>
        </div>
        {mode === "minute" && (
          <div className="">
            <button className="btn btn-sm btn-primary" onClick={() => setMode("hour")}>&#x1F868;</button>
          </div>
        )}
      </div>

      <div className="custom-clock-face background-theme-color">
        <div
          className="custom-clock-needle"
          style={{
            transform: `rotate(${
              mode === "hour"
                ? ((parseInt(selectedHour) % 12) - 1) * 30
                : parseInt(selectedMinute) * 6
            }deg)`,
          }}
        ></div>

        {(mode === "hour" ? hours : minutes).map((val, i) => {
          const total = mode === "hour" ? 12 : 60;
          const angle = (i / total) * 360;
          const x = 100 + 70 * Math.sin((angle * Math.PI) / 180);
          const y = 100 - 70 * Math.cos((angle * Math.PI) / 180);
          const isLabel = mode === "hour" || i % 5 === 0;

       return (
  <div
    key={val}
    className={`custom-clock-number ${
      isLabel ? "custom-label" : "custom-dot"
    } ${
      (mode === "hour" && val === selectedHour) ||
      (mode === "minute" && val === selectedMinute)
        ? "custom-active"
        : ""
    }`}
    style={{ left: `${x}px`, top: `${y}px`, position: "absolute" }}
    onClick={() => handleClockClick(val)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") handleClockClick(val);
    }}
  >
    {isLabel ? val : ""}
  </div>
);

        })}

        <div className="custom-clock-center-dot"></div>
      </div>

      <div className="custom-clock-actions">
        <button className="btn btn-sm btn-primary" onClick={handleOK}>
          OK
        </button>
      </div>
    </div>
  );
};
export default Index;
