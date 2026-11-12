import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import Input from "../../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../../../../components/UI/customTable";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import CustomSelect from "../../../../components/formComponent/CustomSelect";
import {
  EDPBindPaymentMode,
  EDPPaymentSearch,
  EDPSavePaymentMode,
} from "../../../../networkServices/EDP/govindedp";
import { notify } from "../../../../utils/ustil2";
import { getBankMaster } from "../../../../networkServices/PaymentGatewayApi";

const PaymentModeEdit = ({ data }) => {
  const [t] = useTranslation();

  const [dropDownState, setDropDownState] = useState({
    paymentMode: [],
    Bank: [],
  });

  const [originalData, setOriginalData] = useState([]);

  console.log("dropDownState", dropDownState);

  const initialValues = {
    ReceiptNo: "",
  };

  // const tableDataValue = [
  //   {
  //     ReceiptNo: "RCPT001",
  //     ReceiptDateTime: "2025-04-25 10:30 AM",
  //     PaymentMode: "Cash",
  //     payment: "1", // Cash
  //     BankName: "",
  //     RefNo: "TXN123456",
  //     Select: false,
  //     CardRefNo: "",
  //   },
  //   {
  //     ReceiptNo: "RCPT002",
  //     ReceiptDateTime: "2025-04-25 11:00 AM",
  //     PaymentMode: "UPI",
  //     payment: "9", // UPI
  //     BankName: "Google Pay",
  //     RefNo: "TXN123456",
  //     Select: true,
  //     CardRefNo: "REFUPI123",
  //   },
  //   {
  //     ReceiptNo: "RCPT003",
  //     ReceiptDateTime: "2025-04-25 11:15 AM",
  //     PaymentMode: "Cheque",
  //     payment: "2", // Cheque
  //     BankName: "HDFC Bank",
  //     RefNo: "CHQ789456",
  //     Select: false,
  //     CardRefNo: "CHQREF789",
  //   },
  // ];

  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);
  const [values, setValues] = useState({ ...initialValues });

  const RECEIPT_HEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t("Receipt No.") },
    { name: t("Receipt Date Time") },
    { name: t("Payment Mode") },
    { name: t("Amount") },
    { name: t("Bank Name") },
    { name: t("Card/Ref No") },
    { name: t("Ref No.") },
    { name: t("Update") },
  ];

  const filteredHead = RECEIPT_HEAD.filter((col) => {
    if (col.name === "Bank Name" || col.name === "Card/Ref No") {
      // Only show if at least one non-cash payment mode exists
      return tableData?.some((ele) => ele?.payment?.toString() !== "1");
    }
    return true;
  });

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleInputTableChange = (e, index, label) => {
    // ;
    const value = e.target?.value;
    const updatedData = [...tableData];
    updatedData[index][label] = value;
    setTableData(updatedData);
  };

  const handleCustomReactSelect = (index, name, value) => {
    // ;

    if (name === "PaymentMode") {
      const updatedData = [...tableData];
      updatedData[index][name] = value?.label;
      updatedData[index]["PaymentModeID"] = value?.value;
      setTableData(updatedData);
    }
    if (name === "BankName") {
      const updatedData = [...tableData];
      updatedData[index][name] = value?.label;
      updatedData[index]["PaymentModeID"] = value?.value;
      setTableData(updatedData);
    }
    // ;
  };

  const handleSearch = async () => {
    const receiptNo = values?.ReceiptNo;
    const response = await EDPPaymentSearch(receiptNo);
    if (response?.success) {
      setTableData(response?.data);
      setOriginalData(JSON.parse(JSON.stringify(response?.data)));
    } else {
      notify(response?.message, "error");
    }
  };

  const fetchData = async () => {
    const response = await EDPBindPaymentMode();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        paymentMode: response?.data?.map((val) => ({
          value: val?.PaymentModeID,
          label: val?.PaymentMode,
        })),
      }));
    }
  };

  const handleUpdate = async (ele) => {
    console.log(ele, "ele");
    const oldData = originalData[0];
    console.log("OrigingalData", originalData[0]);

    const payload = {
      receiptID: ele?.ReceiptID || 0,
      receiptNo: ele?.ReceiptNo || "",
      newPaymentModeID: ele?.PaymentModeID || 0,
      newPaymentMode: ele?.PaymentMode || "",
      newBankName: ele?.PaymentMode == "Cash" ? "" : ele?.BankName,
      newRefNo: ele?.CardRefNo ? ele?.CardRefNo : ele?.RefNo,
      oldPaymentModeID: oldData?.PaymentModeID || 0,
      oldPaymentMode: oldData?.PaymentMode || "",
      oldBankName: oldData?.BankName || "",
      oldRefNo: oldData?.RefNo || "",
      ledgerTransactionNo: ele?.AsainstLedgerTnxNo?.toString() || "",
      ledgerNoDr: ele?.LedgerNoDr || "",
      amount: ele?.AmountPaid || 0,
    };

    const response = await EDPSavePaymentMode(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setTableData([]);
      setValues(initialValues);
    } else {
      notify(response?.message, "error");
    }
  };
  const fetchGetBankMaster = async () => {
    try {
      const response = await getBankMaster();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          Bank: response?.data?.map((val) => ({
            value: val?.Bank_ID,
            label: val?.BankName,
          })),
        }));
      }
    } catch (error) {
      console.error("Failed to load currency detail:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchGetBankMaster();
  }, []);
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        isMainHeading={{
          data: data === undefined ? 0 : 1,
          FrameMenuID: data?.FrameMenuID,
        }}
        isSlideScreen={false}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Receipt No")}
          placeholder=" "
          name="ReceiptNo"
          onChange={(e) => handleInputChange(e, 0, "ReceiptNo")}
          value={values?.ReceiptNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={handleSearch}
        >
          {t("Search")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <div className="mt-2">
          {/* <Heading title={"Pro Doctor Mapping Table"} isBreadcrumb={false} /> */}
          <Tables
            thead={filteredHead}
            tbody={tableData?.map((ele, index) => {
              {
                console.log(
                  "first",
                  dropDownState?.paymentMode?.find(
                    (val) => val?.label === ele?.PaymentMode
                  )
                );
              }
              const isCash = ele?.PaymentMode?.toString() === "Cash";

              return {
                SrNo: index + 1,
                ReceiptNo: ele?.ReceiptNo,
                ReceiptDateTime: ele?.RecDateTime,
                PaymentMode: (
                  <CustomSelect
                    option={dropDownState?.paymentMode}
                    placeHolder={t("Payment Mode")}
                    value={
                      dropDownState?.paymentMode?.find(
                        (val) => val?.label === ele?.PaymentMode
                      )?.value
                    }
                    isRemoveSearchable={true}
                    name="PaymentMode"
                    onChange={(name, e) =>
                      handleCustomReactSelect(index, name, e)
                    }
                  />
                ),
                Amount: ele?.AmountPaid ? ele?.AmountPaid : 0,
                ...(isCash
                  ? {
                      BankName: "",
                      "Card/Ref No": "",
                      "Ref No": ele?.RefNo,
                    }
                  : {
                      BankName: (
                        <CustomSelect
                          option={dropDownState?.Bank}
                          placeHolder={t("Bank Name")}
                          value={
                            dropDownState?.Bank?.find(
                              (val) => val?.label === ele?.BankName
                            )?.value
                          }
                          isRemoveSearchable={true}
                          name="BankName"
                          onChange={(name, e) =>
                            handleCustomReactSelect(index, name, e)
                          }
                        />
                      ),
                      "Card/Ref No": (
                        <Input
                          type="text"
                          className={"table-input required-fields"}
                          placeholder=" "
                          name="CardRefNo"
                          onChange={(e) =>
                            handleInputTableChange(e, index, "CardRefNo")
                          }
                          value={ele?.CardRefNo}
                          required={true}
                          removeFormGroupClass={true}
                        />
                      ),
                      "Ref No": ele?.RefNo,
                    }),
                Select: (
                  <button
                    className=" btn btn-sm btn-success ml-2 px-3 update-btn"
                    onClick={() => handleUpdate(ele)}
                  >
                    {t("Update")}
                  </button>
                ),
              };
            })}
            style={{ maxHeight: "40vh" }}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentModeEdit;
