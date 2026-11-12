import React, { useState, useEffect } from "react";

const CustomDateInput = ({ value, onChange, index, className, disabled }) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    if (value === "") {
      setInputValue("");
      onChange("", index);
      return;
    }

    let month = value.slice(0, 2);
    let year = value.slice(2);

    // Automatically add 0 if first digit is 2-9
    if (month.length === 1 && parseInt(month, 10) > 1) {
      month = "0" + month; 
      value = month + year;
    }

    // Validate complete month (01-12)
    if (month.length === 2 && (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
      return; // Prevent invalid months
    }

    // Format input
    if (value.length > 2) {
      value = `${month}/${year}`;
    }

    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    setInputValue(value);
    onChange(value, index);
  };

  return (
    <input
    disabled={disabled}
      style={{
        border: "1px solid #B3B3B3",
        padding: "4px",
        height: "20px",
        marginTop: "2px",
      }}
      type="text"
      className={className}
      placeholder="MM/YY"
      value={inputValue}
      onChange={handleInputChange}
      maxLength={5}
    />
  );
};

export default CustomDateInput;
