import React from "react";

const RadioInput = ({ label, className }) => {
  return (
    <div className={className}>
      <input type="radio" className="mt-1" />
      <label className="m-0">{label}</label>
    </div>
  );
};

export default RadioInput;
