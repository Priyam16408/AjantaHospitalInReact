import React from "react";
import { Table } from "react-bootstrap";
import Tables from "../../../../components/UI/customTable";


const VoucherDetailModal = ({details}) => {
  const thead = [
    { name: "S.No.", width: "1%" },
    { name: " Branch Centre", width: "10%" },
    { name: " Chart Of Group", width: "10%" },
    { name: " Account Name", width: "10%" },
    { name: "Amount Local", width: "10%" },
    { name: "Amount", width: "10%" },
    { name: "BalType", width: "10%" },
    { name: "Remarks", width: "10%" },
  
  ];

  const tbody = [
    {
      "S.No.": 1,
      "Voucher No.": "1",
      "Voucher Date": "2024-10-20",
      "Voucher Type": "1",
      "Amount": "1",
      "Entry By": "1",
      "Entry Date": "2024-10-20",
      "Updated By": "1",
      "Updated Date": "2024-10-20",
    },
  ];
  return (
    <div>
      <Tables
        // style={{ maxHeight: "45vh" }}
        thead={thead}
        tbody={details?.map((val,ind)=>(
          {
            "S.No.": ind+1,
            " Branch Centre.":val?.BranchCentre,
            "Chart Of Group": val?.GroupName,
            "Account Name": val?.AccountName,
            "Amount Local": val?.AmountBase,
            "Amount": val?.AmountSpecific,
            "BalType": val?.BalType,
            "Remarks": val?.Remarks,
          
          }
        ))}
      />
    </div>
  );
};

export default VoucherDetailModal;
