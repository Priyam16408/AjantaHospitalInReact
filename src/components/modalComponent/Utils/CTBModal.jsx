import React from "react";
import CTBTable from "../../UI/customTable/billings/CTBTable";

const CTBModal = ({  tbody, CTBList, setCTBList}) => {
  return (
    <div>
      <CTBTable
        tbody={tbody}
        CTBList={CTBList}
        setCTBList={setCTBList}
      />
    </div>
  );
};

export default CTBModal;
