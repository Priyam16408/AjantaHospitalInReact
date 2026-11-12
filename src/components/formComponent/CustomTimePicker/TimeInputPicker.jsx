import React, { useState, useRef, useEffect } from "react";
import CustomTimePickers from "../CustomTimePicker/Index";

const TimeInputPicker = ({
  name = "time",
  value = "03:30 AM",
  onChange = () => { },
  lable = "",
  id = "time",
  placeholder = "HH:MM AM/PM",
  respclass = "col-xl-2 col-md-4 col-sm-4 col-12",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const wrapperRef = useRef();

  const handleTimeSelect = (hour, minute, period) => {
    const formatted = `${hour}:${minute} ${period}`;
    setShowPicker(false);
    onChange({
      target: {
        name,
        value: formatted,
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 

  return (
    <div className={`custom-time-picker-wrapper ${respclass}`} ref={wrapperRef}>
      <div
        className="d-flex align-items-center pointer-cursor"
        onClick={() => setShowPicker(true)}
        style={{ position: "relative" }}
      >
        <input
          name={name}
          className="form-control pointer-cursor"
          value={value}
          placeholder={placeholder || "DD/MM/YYYY"}

          readOnly
        />
        {lable && (
          <label
            htmlFor={id}
            className="labelPicker lable truncate"
            style={{ fontSize: "5px !important" }}
          >
            {lable}
          </label>
        )}
        <i className="fa fa-clock" aria-hidden="true" style={{ position: "absolute", right: "15px" }}></i>
      </div>

      {showPicker && (
        <div className="custom-picker-popup">
          <CustomTimePickers
            onClose={() => setShowPicker(false)}
            onSelect={handleTimeSelect}
            initialTime={value}
          />
        </div>
      )}
    </div>
  );
};

export default TimeInputPicker;
