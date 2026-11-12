import React, { useEffect, useState } from "react";
import Input from "../../../../src/components/formComponent/Input";
import Heading from "../../../../src/components/UI/Heading";
import ReportDatePicker from "../../../../src/components/ReportCommonComponents/ReportDatePicker";
import moment from "moment";
import ReactSelect from "../../../../src/components/formComponent/ReactSelect";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  BindPatientDetailsList,
  PatientSearchList,
  ConsignmentStockItemList,
  AddItemList,
  SaveConsignment,
} from "../../../networkServices/InventoryApi";
import Tables from "../../../../src/components/UI/customTable";
import { notify } from "../../../utils/utils";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { AutoComplete } from "primereact/autocomplete";
import StockTransferTable from "../../../components/UI/customTable/MedicalStore/StockTransferTable";
import IssueStockItemDetailsTable from "../../../components/UI/customTable/MedicalStore/IssueStockItemDetailsTable";

const StockTransfer = () => {
  const [patientName, setPatientName] = useState("");
  const [ipdNo, setIpdNo] = useState("");
  const [Narration, setNarration] = useState("");

  const [patientList, setPatientList] = useState([]);
  const [patientDetailsList, setPatientDetailsList] = useState([]);
  const [ConsignmentItemList, setConsignmentItemList] = useState([]);
  const [ConsignmentMainItemList, setConsignmentMainItemList] = useState([]);
  const [showTable , setShowTable ] = useState(true);
  const [newRowData, setNewRowData] = useState({});
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    console.log("TableData on anychange", tableData);
  }, [tableData]);
  const [list, setList] = useState([]);

  const [value, setValue] = useState("");
  // const [stockShow, setStockShow] = useState([]);
  const [t] = useTranslation();

  useEffect(() => {
    fetchConsignmentStockItem();
  }, []);
  const fetchConsignmentStockItem = async () => {

    try {
      const response = await ConsignmentStockItemList({});
      if (response?.data) {
        setConsignmentItemList(response?.data);
        setConsignmentMainItemList(response?.data);
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };

  console.log("tableData BEFORE the payload", tableData);
  const SaveAddRowData = async () => {
    debugger;
    if (Narration == "" || Narration.trim().length == 0) {
      return notify("Please Enter Narration", "error");
    }

    console.log("tableData in the payload", tableData);
    const payload = {
      transactionNo: patientDetailsList[0].TransactionID.toString(),
      storToPat: true,
      storToDept: false,
      departmentId: 0,
      department: "",
      printChecked: true,
      patientID: patientDetailsList[0].PatientID,
      patientType: patientDetailsList[0].PatientType,
      panelID: patientDetailsList[0].PanelID,
      ipdCaseType_ID: patientDetailsList[0].IPDCaseTypeID,
      room_ID: patientDetailsList[0].RoomID,
      narration: Narration.trim(),
      grdItemDetails: list.map((item) => ({
        unitPrice: item.UnitPrice || 0,
        freight: item.Freight || 0,
        octori: item.Octroi || 0,
        roundOff: item.RoundOff || 0,
        issueQty: item.IssueQty || 0,
        stockID: item.ID.toString(),
        vendorLedgerNo: item.VendorLedgerNo,
        mrp: item.MRP || 0,
        itemName: item.ItemName,
        itemID: item.itemID.toString(),
        batchNumber: item.BatchNumber,
        medExpDate: item.MedExpiryDate,
        discount: item.DiscAmt || 0,
        rate: item.Rate || 0,
        ledTxnID: "",
        ledgerTnxNo: "",
        tranType: "",
        invoiceNo: "",
        challanNo: "",
        hsnCode: item.HSNCode || "",
        saleTaxPer: item.SaleTaxPer || 0,
        type: item.TYPE || "string",
        taxPer: item.TaxPer || 0,
        subCategoryId: item.SubCategoryID.toString(),
      })),
      dtItem: tableData.map((item) => ({
        stockID: item.ID,
        itemID: item.itemID,
        itemName: item.ItemName,
        batchNumber: item.BatchNumber,
        subCategory: item.SubCategoryID,
        unitType: item.UnitTYpe,
        mrp: item.MRP,
        unitPrice: item.UnitPrice,
        qty: item.AvailQty,
        issueQty: item.IssueQty,
        amount: item.Rate, // Assuming "amount" is the item's rate
        type_ID: item.Type_ID,
        roundOff: item.RoundOff,
      })),
    };
    try {
      const response = await SaveConsignment(payload);

      if (response?.success) {

        notify(response.message, "success");
        setList([]);
        setPatientList([]);
        setPatientDetailsList([]);
        setTableData([]);
        setNarration("");
        setPatientName("");
        setIpdNo("");
        setValue("");
        setConsignmentItemList([]);
        setConsignmentMainItemList([]);

        // setConsignmentItemList(response?.data);
        // setConsignmentMainItemList(response?.data)
      } else {
        notify(response.message, "error");
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
      notify(response.message, "error");
    }
  };
  const AddRowData = (data) => {
    console.log("Before filtering checked rows:", data);
    const checkedRows = tableData.filter(
      (row) => row.isChecked === true && parseInt(row?.IssueQty) > 0
    );

    if (checkedRows.length === 0) {
      console.warn("⚠️ No checked rows with IssueQty > 0 found!");
      return notify("No items selected", "error");
    }

    // console.log("Checked rows that will be added:", checkedRows);
    setList(checkedRows);
    setTableData(checkedRows);
    setValue("");
    setShowTable(!showTable)

    // Do not clear tableData immediately; delay it
    setTimeout(() => {
      //   setTableData([]); // Clear it only after saving
      console.log("Cleared tableData AFTER setting list");
    }, 500);
  };

  console.log("ASdasdasd", list);

  const handleSearch = async () => {
    console.log("Searching for:", { patientName, ipdNo });
    const payload = {
      Name: patientName,
      CRNo: ipdNo,
    };
    if (ipdNo == "" && patientName == "") {
      return notify("Please Enter Patient Name or IPD No.", "error");
    }
    setList([]);
    setNarration("");
    try {
      const response = await PatientSearchList(payload);
      if (response?.success) {
        notify(response?.message, "success");
        console.log("DataList for:", response.data);
        setPatientList(response.data);
        const mappedData = response.data.map((patient, index) => ({
          SNo: index + 1,
          IPDNo: patient.TransactionID, // Assuming TransactionID is used as IPD No.
          PatientName: patient.PName,
          Address: patient.Address,
          Select: (
            <i
              className="fas fa-search"
              aria-hidden="true"
              onClick={() => BindPatientdtl(patient.TransactionID, "")}
            ></i>
          ),
          // (
          //   <button onClick={() => handleSelect2(patient.TransactionID)}>
          //     Select
          //   </button>
          // )
        }));

        setPatientList(mappedData);
        setPatientDetailsList([]);
        setTableData([]);
      }else{
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  const Tabfunctionality = (e) => {};
  const THEAD = ["S.No.", "IPD No.", "Patient Name", "Address", "Select"];
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "PatientName") {
      setPatientName(value);
    }
    if (name === "IPDNo") {
      setIpdNo(value);
    }
    if (name === "Narration") {
      setNarration(value);
    }
  };
  const BindPatientdtl = async (TransactionID, PName) => {
    try {
      const response = await BindPatientDetailsList(TransactionID, PName);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        setPatientList([]);
        setPatientDetailsList(response?.data);
        setValue("");
        setTableData([]);
        console.log("listData: ", patientDetailsList);
      }
    } catch (error) {
      // console.log("Error updating invoice:", error);
      notify("Failed to update invoice.", "error");
    }
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.itemname}
        </div>
      </div>
    );
  };

  const handleSelectRow = async (e) => {
    // debugger
    console.log("SelectedSelectedSelectedSelectedSelected item:", e);
    const value = e?.itemid;
    // debugger;
    // setPayload((prevPayload) => ({
    //   ...prevPayload,
    //   ItemID: value?.ItemId?.split("#")[0],
    // }));
    try {
      const response = await AddItemList(value);
      console.log("Response from additem", response?.data);
      if (response?.data) {
        //   setConsignmentItemList(response?.data);
        //   setConsignmentMainItemList(response?.data)
        // debugger;
        setTableData(response?.data);
      }
    } catch {}
  };

  console.log("TableData after selecting item", tableData);

  const thead = [
    { name: t("Action"), width: "1%" },
    { name: t("Item Name") },
    { name: t("Batch No.") },
    { name: t("Expiry"), width: "5%" },
    { name: t("BuyPrice") },
    { name: t("RoundOff") },
    { name: t("Octroi") },
    { name: t("Freight") },
    { name: t("MRP") },
    { name: t("Avail Qty") },
    { name: t("Unit") },
    { name: t("IssueQty") },
  ];
  const IssueHead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Item Name"), width: "5%" },
    { name: t("Batch No."), width: "5%" },
    { name: t("MRP"), width: "4%" },
    { name: t("Quantity"), width: "10%" },
    { name: t("Remove"), width: "2%" },
  ];
  const handleRemove = (index) => {
    setList((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleChangeindex = (e, index) => {
    const { value } = e.target;
    // debugger;
    const updatedValue =
      value > tableData[index].AvailQty ? tableData[index].AvailQty : value;
    setTableData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, IssueQty: updatedValue } : item
      )
    );
  };
  const handleChangeCheckbox = (e, ele, index) => {
    let data = tableData.map((val, i) => {
      // debugger;
      if (i === index) {
        val.isChecked = e?.target?.checked;
        val.IssueQty = "0.0";
      }
      return val;
    });
    setTableData(data);
    if (!e?.target?.checked) {
      AddRowData(data);
    }
  };

  return (
    <>
      <div className="card">
        <Heading title={"GRN Search"} isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields"
            lable={t("Patient Name")}
            placeholder=" "
            id="patientName"
            name="PatientName"
            value={patientName}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control required-fields"
            lable={t("IPD No")}
            placeholder=" "
            id="ipdNo"
            name="IPDNo"
            value={ipdNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            onKeyDown={Tabfunctionality}
          />
          <div className=" col-sm-2">
            <button className="btn btn-sm btn-success" onClick={handleSearch}>
              {" "}
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <Tables
          thead={THEAD}
          tbody={patientList}
          style={{ maxHeight: "220px" }}
        />
      </div>
      <div className="card">
        {patientDetailsList.length > 0 ? (
          <div className="border-bottom border-top">
            <div className="row p-2">
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput
                  label={"UHID:"}
                  value={patientDetailsList[0]?.PatientID}
                />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput
                  label={"Patient Name:"}
                  value={patientDetailsList[0]?.PName}
                />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput
                  label={"IPD No:"}
                  value={patientDetailsList[0]?.TransactionID}
                />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput
                  label={"Room :"}
                  value={patientDetailsList[0]?.RoomNo}
                />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput
                  label={"Doctor :"}
                  value={patientDetailsList[0]?.DoctorName}
                />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput
                  label={"Panel :"}
                  value={patientDetailsList[0]?.Company_Name}
                />
              </div>
            </div>
            <div className="row p-2">
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={"Card No :"} value={""} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={"Valid UpTo :"} value={""} />
              </div>
              <div className="col-xl-4 col-md-4 col-sm-4 col-12 pb-2">
                <AutoComplete
                  style={{ width: "100%" }}
                  value={value}
                  suggestions={ConsignmentItemList}
                  completeMethod={(e) => {
                    const filteredList = ConsignmentMainItemList.filter(
                      (item) =>
                        item.itemname
                          .toLowerCase()
                          .includes(e.query.toLowerCase())
                    );
                    setConsignmentItemList(filteredList);
                  }}
                  className="w-100 required-fields"
                  onSelect={(e) => handleSelectRow(e.value)}
                  id="SearchByName"
                  onChange={(e) => {
                    const inputValue =
                      typeof e.value === "object" ? e.value.itemname : e.value;
                    setValue(inputValue);
                  }}
                  itemTemplate={(item) => (
                    <div>
                      {" "}
                      <strong>{item.itemname}</strong>
                    </div>
                  )}
                  field="itemname"
                />
                <label htmlFor={"SearchByName"} className="lable searchtest">
                  {t("Search By Name")}
                </label>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {showTable && tableData.length > 0 ? (
        <div className="card mt-2">
          <StockTransferTable
            thead={thead}
            tbody={tableData}
            handleChangeindex={handleChangeindex}
            handleChangeCheckbox={handleChangeCheckbox}
          />
          <div className="row p-2">
            <div className="col-12" style={{ textAlign: "end" }}>
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  AddRowData(tableData);
                }}
                type="button"
              >
                {t("Add Items")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {console.log("Show table" , showTable)}
      {list.length > 0 ? (
        <div className="card mt-2">
          <IssueStockItemDetailsTable
            thead={IssueHead}
            tbody={list}
            handleRemove={handleRemove}
          />
          {/* <div className="row p-2">
            <div className="col-12" style={{textAlign: "end"}}>
              <button className="btn btn-sm btn-success" onClick={()=>{AddRowData(tableData)}} type="button">
              Save
              </button>
            </div>
          </div> */}
          <div
            className="row p-2"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <Input
              type="text"
              className="form-control required-fields "
              lable="Narration"
              placeholder=" "
              id="Narration"
              name="Narration"
              value={Narration}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onChange={handleChange}
              onKeyDown={Tabfunctionality}
            />
            <div className="col-1 p-2 text-right">
              <button
                className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                type="button"
                onClick={() => {
                  SaveAddRowData();
                }}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default StockTransfer;
