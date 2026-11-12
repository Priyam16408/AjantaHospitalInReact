import React, { useEffect , useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../../components/UI/customTable";

const BankChargesTable = ({ excelData }) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const thead = [
    { name: "S/No.", width: "5%" },
    { name: "Voucher No", width: "15%" },
    { name: "Voucher Date", width: "10%" },
    { name: "Amount Local", width: "10%" },
    { name: "Entry Date", width: "10%" },
    { name: "Entry By", width: "10%" },
    { name: "View", width: "5%" },
    { name: "Edit", width: "5%" },
    { name: "Review Resolved", width: "10%" },
    { name: "Print", width: "5%" },
  ];

  const [bodyData, setBodyData] = useState([]);

  const handleBodyData = (ele, index) => {

    console.log("Ele" , ele)
    // let obj = {};

    // obj.SrNo = index + 1;
    // obj.accName = (
    //   <div style={{ whiteSpace: "normal" }}>{ele?.GroupName}</div>
    // );
    // obj.AccountName = (
    //   <div style={{ whiteSpace: "normal" }}>{ele?.AccountName}</div>
    // );
    // obj.branchCentre = (
    //   <div style={{ whiteSpace: "normal", width: "100%" }}>
    //     <CustomSelect
    //       placeHolder={t("BRANCH CENTRE")}
    //       name="branchCentre"
    //       onChange={(name, e) => {
    //         handleCustomInput(index, "branchCentre", e);
    //       }}
    //       isRemoveSearchable={true}
    //       value={ele?.branchCentre?.value}
    //       option={filterByTypes(
    //         list,
    //         [14],
    //         ["TypeID"],
    //         "TextField",
    //         "ValueField"
    //       )}
    //     />
    //   </div>
    // );
    // obj.Department = (
    //   <div style={{ whiteSpace: "normal", width: "100%" }}>
    //     {" "}
    //     <CustomSelect
    //       placeHolder={t("Department")}
    //       requiredClassName={"required-fields"}
    //       name="Department"
    //       onChange={(name, e) => {
    //         handleCustomInput(index, "Department", e);
    //       }}
    //       isRemoveSearchable={true}
    //       value={ele?.Department?.value}
    //       option={filterByTypes(
    //         list,
    //         [2],
    //         ["TypeID"],
    //         "TextField",
    //         "ValueField"
    //       )}
    //     />
    //   </div>
    // );
    // obj.Amount = !ele?.isAccountType ? (
    //   <Input
    //     type="text"
    //     className="table-input required-fields"
    //     respclass={"w-100"}
    //     removeFormGroupClass={true}
    //     display={"right"}
    //     disabled={ele?.isAccountType ? true : false}
    //     name={"Amount"}
    //     value={ele?.Amount ? ele?.Amount : ""}
    //     onChange={(e) => {
    //       handleCustomInput(
    //         index,
    //         "Amount",
    //         e.target.value,
    //         "number",
    //         1000000000
    //       );
    //     }}
    //   />
    // ) : (
    //   <span className="text-right mt-2">
    //     {ele?.Amount ? ele?.Amount : "0.00"}
    //   </span>
    // );
    // obj.locals =
    //   values?.ConversionFactor * ele?.Amount > 0
    //     ? (values?.ConversionFactor * ele?.Amount).toFixed(ROUNDOFF_VALUE)
    //     : "0.00";
    // if (values?.VoucherType?.value === "PB") {
    //   obj.TaxAmount = (
    //     <Input
    //       type="number"
    //       className="table-input"
    //       respclass={"w-100"}
    //       removeFormGroupClass={true}
    //       display={"right"}
    //       name={"TaxAmount"}
    //       value={ele?.TaxAmount ? ele?.TaxAmount : ""}
    //       onChange={(e) => {
    //         handleCustomInput(
    //           index,
    //           "TaxAmount",
    //           e.target.value,
    //           "number",
    //           1000000000
    //         );
    //       }}
    //     />
    //   );
    // }
    // obj.balanceType = !ele?.isAccountType ? (
    //   <CustomSelect
    //     placeHolder={t("Bal. Type")}
    //     name="balanceType"
    //     isDisable={ele?.isAccountType ? true : false}
    //     onChange={(name, e) => {
    //       handleCustomInput(index, "balanceType", e);
    //     }}
    //     isRemoveSearchable={true}
    //     value={ele?.balanceType?.value}
    //     option={[
    //       { label: "Cr", value: "Cr" },
    //       { label: "Dr", value: "Dr" },
    //     ]}
    //   />
    // ) : (
    //   <span>{ele?.balanceType?.value}</span>
    // );

    // if (
    //   ["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value)
    // ) {
    //   obj.PaymentMode = (
    //     <CustomSelect
    //       placeHolder={t("Payment Mode")}
    //       requiredClassName={"required-fields"}
    //       name="PaymentMode"
    //       onChange={(name, e) => {
    //         handleCustomInput(index, "PaymentMode", e);
    //       }}
    //       isRemoveSearchable={true}
    //       value={ele?.PaymentMode?.value}
    //       option={filterByTypes(
    //         list,
    //         [10],
    //         ["TypeID"],
    //         "TextField",
    //         "ValueField"
    //       )}
    //     />
    //   );
    //   obj.Refnumber = (
    //     <Input
    //       type="text"
    //       className="table-input required-fields"
    //       removeFormGroupClass={true}
    //       // display={"right"}
    //       respclass="w-100"
    //       name={"Refnumber"}
    //       value={ele?.Refnumber ? ele?.Refnumber : ""}
    //       onChange={(e) => {
    //         handleCustomInput(index, "Refnumber", e.target.value, "text", 100);
    //       }}
    //     />
    //   );
    //   obj.RefDate = (
    //     <DatePicker
    //       className="custom-calendar-table"
    //       id="RefDate"
    //       respclass="w-100"
    //       name="RefDate"
    //       inputClassName={"required-fields"}
    //       value={ele?.RefDate ? moment(ele?.RefDate).toDate() : new Date()}
    //       maxDate={new Date()}
    //       handleChange={(e) =>
    //         handleCustomInput(index, "RefDate", e.target.value)
    //       }
    //       placeholder={VITE_DATE_FORMAT}
    //     />
    //   );
    // } else {
    //   obj.InvoiceNumber = (
    //     <Input
    //       type="text"
    //       className="table-input required-fields"
    //       removeFormGroupClass={true}
    //       // display={"right"}
    //       respclass="w-100"
    //       name={"InvoiceNumber"}
    //       value={ele?.InvoiceNumber ? ele?.InvoiceNumber : ""}
    //       onChange={(e) => {
    //         handleCustomInput(
    //           index,
    //           "InvoiceNumber",
    //           e.target.value,
    //           "text",
    //           100
    //         );
    //       }}
    //     />
    //   );
    //   obj.InvoiceDate = (
    //     <DatePicker
    //       className="custom-calendar-table"
    //       inputClassName={"required-fields"}
    //       id="InvoiceDate"
    //       respclass="w-100"
    //       name="InvoiceDate"
    //       value={
    //         ele?.InvoiceDate ? moment(ele?.InvoiceDate).toDate() : new Date()
    //       }
    //       maxDate={new Date()}
    //       handleChange={(e) =>
    //         handleCustomInput(index, "InvoiceDate", e.target.value)
    //       }
    //       placeholder={VITE_DATE_FORMAT}
    //     />
    //   );
    // }

    // obj.Remark = (
    //   <Input
    //     type="text"
    //     className="table-input required-fields"
    //     removeFormGroupClass={true}
    //     respclass="w-100"
    //     name={"Remark"}
    //     value={ele?.Remark ? ele?.Remark : ""}
    //     onChange={(e) => {
    //       handleCustomInput(index, "Remark", e.target.value);
    //     }}
    //   />
    // );
    // if (
    //   !["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value)
    // ) {
    //   obj.CostCentre = !ele?.isAccountType ? (
    //     <button
    //       className="btn btn-sm btn-primary px-2 table-btn w-100"
    //       onClick={() => {
    //         handleOpenCostCentre(ele, index);
    //       }}
    //     >
    //       {t("cc")}
    //     </button>
    //   ) : (
    //     ""
    //   );
    // }
    // if (values?.VoucherType?.value === "PB") {
    //   obj.MapADV = ele?.isAccountType ? (
    //     <button
    //       className="btn btn-sm btn-primary px-2 table-btn w-100"
    //       onClick={() => {
    //         handleOpenAdvance(ele, index);
    //       }}
    //     >
    //       {t("Adv.")}
    //     </button>
    //   ) : (
    //     ""
    //   );
    // }
    // return obj;
  };

  // useEffect(() => {
  //   let data = [];
  //   excelData?.map((val, ind) => {
  //     data.push(handleBodyData(ele, ind));
  //   });
  //   setBodyData(data);
  // }, [excelData]);



  return (
    <>
      <div>
        <Tables thead={thead} tbody={excelData} />
      </div>
    </>
  );
};

export default BankChargesTable;
