import React from "react";
import Tables from "..";
import { Tooltip } from "primereact/tooltip";

const OPDSettlementTable = (props) => {
  const { THEAD, tbody, handlePaymentControl } = props;

  const handleSelectClick = (index) => {
    const selectItem = tbody[index];
    handlePaymentControl(selectItem);
  };

  const getRowClass = (ele) => {
    if (ele?.TransactionType?.toLowerCase() === "emergency") {
      return "EmergencyBills-table-color";
    }
  };

  return (
    <>
      {tbody.map((item, index) => (
        <Tooltip
          key={index}
          target={`#doctorName-${index}, #visitType-${index}`}
          position="top"
        />
      ))}
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "#": index + 1,
          CentreName: item?.CentreName,
          BillDate: item?.BillDate,
          BillNo: item?.BillNo,
          PatientName: item?.PatientName,
          UHID: item?.PatientID,
          BillAmt: item?.NetAmount,
          PaidAmt: item?.PaidAmt,
          PendingAmt: item?.PendingAmt,
          TransactionType: item?.TypeOfTnx,
          SettlementType: item?.SettlementType,
          PanelID: item?.CompanyName,
          Select: (
            <>
              <i
                className="fa fa-check-circle"
                aria-hidden="true"
                onClick={() => handleSelectClick(index)}
              ></i>
            </>
          ),
        }))}
        tableHeight={"tableHeight"}
        getRowClass={getRowClass}
      />
    </>
  );
};

export default OPDSettlementTable;
