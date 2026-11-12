import React from "react";
import Tables from "../../../../UI/customTable/index";
const index = ({ thead, tbody }) => {
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody.map((ele, index) => ({
          SrNo: index + 1,
          Company_Name: ele?.Company_Name,
          Address: ele?.Company_Name,
          Ref_Company: ele?.Ref_Company,
          Ref_CompanyOPD: ele?.Ref_CompanyOPD,
          Contact_Person: ele?.Contact_Person,
          DateFrom: ele?.DateFrom,
          DateTo: ele?.DateTo,
          CreditLimit: ele?.CreditLimit,
        }))}
      />
    </>
  );
};

export default index;
