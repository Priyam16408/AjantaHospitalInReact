import React from "react";
import styled from "styled-components";

const DashboardTemplate = ({ thead, tbody, Header, TimeDuration }) => {
  const StyledTd = styled.td`
    border: 1px solid #ddd;
    background-color: ${(props) => props.bgColor || "#fff"};
    font-size: 10px !important;
  `;


  return (
    <div id="hidden-template" style={{ display: "none" }}>
      <div className="main-template-Container">
        <div className="Template-header">{Header}</div>
        <div className="Template-TimeStamp">{TimeDuration}</div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr>
            {thead?.map((headData, index) => (
              <th
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f4f4f4",
                }}
              >
                {headData}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tbody?.map((ele, index) => {
            const keys = Object.keys(ele).filter((key) => key !== "colorcode");

            return (
              <tr key={index}>
                {keys?.map((bodyData, inx) => (
                  <StyledTd key={inx} bgColor={ele.colorcode}>
                    {ele[bodyData]?.label
                      ? ele[bodyData]?.label
                      : ele[bodyData]}
                  </StyledTd>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTemplate;
