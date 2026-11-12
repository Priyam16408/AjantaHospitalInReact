import React from "react";
import styled from "styled-components";
import Input from "./Input";

const StyledLabel = styled.label`
  font-size: 11px !important;
  font-weight: 500 !important;
  display: inline-block;
  width: "70%";
`;

const CombinedSelectAndInput = ({
  label,
  dynamicOptions,
  selectedValue,
  selectName,
  inputValue,
  inputName,
  handleChange,
}) => {

  return (
    <div className="d-flex align-items-center justify-content-between">
      <StyledLabel className="w-50">{label}</StyledLabel>
      <div className="w-50">
        <div className="d-flex">
          <div>
            <select
              className="form-control"
              style={{
                borderRight: "none",
                backgroundColor: "#c1c1c169",
                padding: "0px",
                width: "max-content",
                maxWidth: "50px",
              }}
              value={selectedValue}
              name={selectName}
              onChange={handleChange}
            >
              {dynamicOptions?.map((items, index) => (
                <option value={items?.value} key={index}>
                  {items?.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Input
              className={"form-control combined-input-style"}
              name={inputName}
              value={inputValue}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* <div className="d-flex align-items-center justify-content-between">
        {children}
      </div> */}
    </div>
  );
};

export default CombinedSelectAndInput;
