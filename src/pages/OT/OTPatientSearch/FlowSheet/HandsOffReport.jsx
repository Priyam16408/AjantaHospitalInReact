import React from "react";
import Tables from "../../../../components/UI/customTable";

const HandsOffReport = (props) => {
  const { thead, tableData } = props;
  return (
    <div>
      <Tables thead={thead} tbody={tableData} />
     
    </div>
  );
};

export default HandsOffReport;
