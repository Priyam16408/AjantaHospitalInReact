import React from "react";
import Tables from ".";

const BussinessDashboardTable = ({ thead, tbody, tableHeight }) => {
  return (
    <Tables
      thead={thead}
      tbody={tbody}
      style={{ height: tableHeight, overflowX: "hidden", overflowY: "visible" }}
    />
  );
};

export default BussinessDashboardTable;
