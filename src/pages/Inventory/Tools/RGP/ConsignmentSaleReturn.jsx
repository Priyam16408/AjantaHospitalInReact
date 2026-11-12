import React, { useMemo, useState } from "react";
import Input from "../../../../components/formComponent/Input";
import Heading from "../../../../components/UI/Heading";
import {
  BindPatientReturn,
  ConsignmentBindItem,
  consignmentReturnSearch,
  ConsignmentSave,
  PatientReturnReport,
  ReturnItem,
  SaveFromDepartment,
} from "../../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import ConsignmentSaleReturnTable from "../../../../components/UI/customTable/MedicalStore/ConsignmentSaleReturnTable";
import { useTranslation } from "react-i18next";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { notify } from "../../../../utils/utils";
import IssuedItemsTable from "../../../../components/UI/customTable/MedicalStore/IssuedItemsTable";
import ConsignmentSaleReturnAddedTable from "../../../../components/UI/customTable/MedicalStore/ConsignmentSaleReturnAddedTable";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import { useLocation } from "react-router-dom";

const ConsignmentSaleReturn = () => {
  const localdata = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const location = useLocation();
  const initialPayload = {
    pName: "",
    IPDNo: "",
    item: { label: "", value: "" },
  };
  const [payload, setPayload] = useState({ ...initialPayload });
  const [tableData, setTableData] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [list, setList] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [showTable , setShowTable] = useState(true);

  const handleSearch = async () => {
    const TransNo = payload?.IPDNo ? payload?.IPDNo : "";
    const PatientName = payload?.pName ? payload?.pName : "";
    const Dept = localdata?.deptLedgerNo;
    try {
      const response = await consignmentReturnSearch(
        TransNo,
        PatientName,
        Dept
      );
      setTableData(response?.data || []);
      setPayload({ ...initialPayload });
      setShowTable(true);
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  const [pdetail, setPDetail] = useState([]);
  const getConsignmentBindItem = async (val) => {
    try {
      const response = await ConsignmentBindItem(val);
      const patientDetail = await BindPatientReturn(val);
      if (response?.data.length > 0) {
        setPayload((prev) => ({
          ...prev,
          item: {
            value: response?.data[0].ItemId,
            label: response?.data[0].TypeName,
          },
        }));
      }

      setList(response?.data);
      setPDetail(patientDetail?.data);
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  const thead = [
    { name: t("IPD No."), width: "3%" },
    t("Patient Name"),
    t("Address"),
    { name: t("Select"), width: "5%" },
  ];
  const IssuedItemsthead = [
    { name: t("Action"), width: "3%" },
    t("Item"),
    { name: t("Issue Qty."), width: "10%" },
    { name: t("Date"), width: "10%" },
    { name: t("Batch No."), width: "10%" },
    { name: t("MRP"), width: "10%" },
    t("Department Name"),
    { name: t("InHand"), width: "10%" },
    { name: t("Ret. Qty."), width: "10%" },
  ];
  const AddeddItemsthead = [
    { name: t("Sr.No"), width: "3%" },
    t("Item"),
    { name: t("Batch No."), width: "15%" },
    { name: t("MRP"), width: "10%" },
    { name: t("Return. Qty."), width: "15%" },
    { name: t("Rejected Qty."), width: "15%" },
    { name: t("Remove"), width: "5%" },
  ];
  const handleDataInDetailView = useMemo(() => {
    if (pdetail?.dt?.length > 0) {
      const data = [
        {
          label: "UHID",
          value: pdetail?.dt[0]?.PatientID,
        },
        {
          label: "Patient Name",
          value: pdetail?.dt[0]?.PName,
        },
        {
          label: "IPD No.",
          value: pdetail?.dt[0]?.TransNo || "",
        },
        {
          label: "Room No.",
          value: pdetail?.dt[0]?.RoomNo,
        },
        {
          label: "Doctor Name",
          value: pdetail?.dt1[0]?.DoctorName || "",
        },
        {
          label: "Panel",
          value: pdetail?.dt[0]?.Company_Name,
        },
        {
          label: "Admission Date",
          value: pdetail?.dt1[0]?.DateOfAdmit || "",
        },
      ];

      return data;
    } else {
      return [];
    }
  }, [pdetail]);

  const handleReactSelect = (name, value) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value || "",
    }));
    setShowTable(true);
  };

  // const handleAddItem = async () => {
  //   const TID = pdetail?.dt[0]?.TransactionID
  //     ? pdetail?.dt[0]?.TransactionID
  //     : 0;
  //   const ItemID = payload?.item?.value ? payload?.item?.value : 0;
  //   try {
  //     const response = await ReturnItem(TID, ItemID);
  //     setItemDetails(response?.data || []);
  //     setPayload(() => {
  //       return {
  //         ...payload,
  //         item: { label: "", value: "" },
  //       };
  //     })
  //     setShowTable(true);
  //   } catch (error) {
  //     notify("Something Went's Wrong", "error");
  //   }
  // };


  const handleAddItem = async () => {
    const TID = pdetail?.dt?.[0]?.TransactionID || 0;
    const ItemID = payload?.item?.value || 0;

    try {
        const response = await ReturnItem(TID, ItemID);
        setItemDetails(response?.data || []); // Store fetched items
        setPayload((prev) => ({
            ...prev,
            item: { label: "", value: "" },
        }));
    } catch (error) {
        notify("Something Went Wrong", "error");
    }
};


  const handleCustomInput = (index, name, value, type, max) => {
    if (!isNaN(value) && Number(value) <= max) {
      const data = [...itemDetails];
      data[index][name] = value;
      setItemDetails(data);
    } else {
      return false;
    }
  };
  const handleChangeCheckbox = (e, ele, index) => {
    let data = itemDetails.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setItemDetails(data);
  };
  console.log("list", list);
  console.log("itemDetails", itemDetails);
  const [newItemDetail, setNewItemDetail] = useState([]);
  const AddRowData = () => {
    const checkedRows = itemDetails.filter((row) => row.isChecked); // Get selected items
    setNewItemDetail((prev) => [...prev, ...checkedRows]); // Move to the new table
    setItemDetails([]); // Clear IssuedItemsTable to hide it
};

  const handleRemove = (index) => {
    setNewItemDetail((prevState) => prevState.filter((_, i) => i !== index));
  };
  console.log("newItemDetail", newItemDetail);
  console.log("payload", payload);
  console.log("pdetail", pdetail);

  const sendReset = () => {
    // setPayload({initialState});
    setTableData([]);
    setItemDetails([]);
    setNewItemDetail([]);
    setPDetail([]);
  };
  const handleSave = async () => {
    try {
      const returnMeds = newItemDetail?.map((ele) => ({
        consignmentID: 0,
        retQty: Number(ele?.ReturnQty) || 0,
        saleTaxPer: Number(ele?.SaleTaxPer) || 0,
        mrp: Number(ele?.MRP) || 0,
        unitPrice: Number(ele?.UnitPrice) || 0,
        igstAmt: Number(ele.IGSTAmt) || 0,
        cgstAmt: Number(ele?.CGSTAmt) || 0,
        sgstAmt: Number(ele?.SGSTAmt) || 0,
        itemID: Number(ele?.ItemID) || 0,
        stockID: Number(ele?.StockID) || 0,
        medExpiryDate: ele?.MedExpiryDate,
        isFree: Number(ele?.IsFree) || 0,
        gstType: String(ele?.GSTType) || "",
        hsnCode: String(ele?.HSNCode) || "",
        vendorLedgerNo: "",
        rate: Number(ele?.Rate) || 0,
        disAmt: Number(ele?.DiscAmt) || 0,
        challanNo: String(ele?.ChalanNo) || "",
        date: ele?.Date,
        itemName: String(ele?.ItemName) || "",
        disper: Number(ele?.DiscPer) || 0,
        conversionFactor: Number(ele.ConversionFactor) || 0,
        majorUnit: Number(ele?.MajorUnit) || 0,
        deptLedgerNo: String(ele?.LedgerNumber) || "",
        igstPercent: Number(ele?.IGSTPercent) || 0,
        cgstPercent: Number(ele?.CGSTPercent) || 0,
        sgstPercent: Number(ele?.SGSTPercent) || 0,
        specialDiscPer: Number(ele?.SpecialDiscPer) || 0,
        isDeal: Number(ele?.isDeal) || 0,
        otherCharges: Number(ele?.OtherCharges) || 0,
        markUpPercent: Number(ele?.MarkUpPercent) || 0,
        currencyCountryID: Number(ele?.CurrencyCountryID) || 0,
        currency: Number(ele?.Currency) || 0,
        currencyFactor: Number(ele?.CurrencyFactor) || 0,
        inHandUnits: Number(ele?.inHandUnits) || 0,
        serviceItemID: String(ele?.ServiceItemID) || "",
        batchNumber: String(ele?.BatchNumber) || "",
        amount: Number(ele?.Rate) || 0,
        typeID: String(ele?.Type_ID) || "",
        toBeBilled: String(ele?.ToBeBilled) || "",
        isVerified: Number(ele?.IsVerified) || 0,
        isExpirable: ele?.IsExpirable,
        taxPercent: Number(ele?.TaxPercent) || 0,
        purTaxPer: Number(ele?.PurTaxPer) || 0,
        subCategoryID: String(ele?.SubCategoryID) || "",
        isPackage: Number(ele?.IsPackage) || 0,
        packageID: String(ele?.PackageID) || "",
        id: String(ele?.ID) || "",
        rejectQty: Number(ele?.RejectQty) || 0,
        billNo: "",
        ledgerTransactionNo: 0,
        indentNo: String(ele?.IndentNo) || "",
      }));

      const Itempayload = {
        tid: Number(pdetail?.dt[0]?.TransactionID) || 0,
        patientID: String(pdetail?.dt[0]?.PatientID) || "",
        ipAddress: ip,
        patientType: String(pdetail?.dt[0]?.PatientType) || "",
        panelID: Number(pdetail?.dt[0]?.PatientType) || 0,
        pageURL: location?.pathname ? String(location?.pathname) : "",
        roomID: Number(pdetail?.dt[0]?.RoomID) || 0,
        ipdCaseTypeID: Number(pdetail?.dt[0]?.IPDCaseTypeID) || 0,
        dtItem: returnMeds,
      };

      const response = await ConsignmentSave(Itempayload);
      sendReset();
      console.log("response from PatientReturnReport",response);
      const reportResp = await PatientReturnReport(
        response?.data?.salesNo,
        response?.data?.deptLedger
      );
      if (reportResp?.success) {
        RedirectURL(reportResp?.data?.pdfUrl);
      } else {
        notify(reportResp?.data?.message, "error");
      }
      if (response?.success) {
        notify(response?.message, "success");
        sendReset();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="pName"
            name="pName"
            value={payload?.pName}
            onChange={handleChange}
            lable={t("Patient Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="IPDNo"
            name="IPDNo"
            value={payload?.IPDNo}
            onChange={handleChange}
            lable={t("IPD Number")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success" onClick={handleSearch}>
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading title={"Search Patient"} />
          <ConsignmentSaleReturnTable
            thead={thead}
            tbody={tableData}
            getConsignmentBindItem={getConsignmentBindItem}
          />
        </div>
      )}
      {pdetail?.dt?.length > 0 && (
        <div className="card mt-2">
          <Heading title={"Patient Information"} />
          <div className="row p-2">
            {handleDataInDetailView?.map((data, index) => (
              <>
                <div
                  className="col-xl-2 col-md-4 col-sm-6 col-12"
                  key={index}
                  style={{
                    display: "grid",
                    alignItems: "center",
                  }}
                >
                  <div className="d-flex align-items-center m-1">
                    <LabeledInput
                      label={data?.label}
                      value={data?.value}
                      className={"w-100"}
                      // style={{ textAlign: "right",  }}
                    />
                  </div>
                </div>
              </>
            ))}
            <ReactSelect
              placeholderName={t("Item")}
              id={"item"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name={"item"}
              dynamicOptions={list?.map((ele) => ({
                label: ele?.TypeName,
                value: ele?.ItemId,
              }))}
              value={payload?.item?.value}
              handleChange={handleReactSelect}
            />{" "}
            <div className="col-sm-1">
              <button
                className="btn btn-sm btn-success"
                onClick={handleAddItem}
              >
                {t("Get Items")}
              </button>
            </div>
          </div>
        </div>
      )}
      {itemDetails.length > 0 && (
    <div className="card mt-2">
        <Heading title={"Issued Items"} />
        <IssuedItemsTable
            thead={IssuedItemsthead}
            tbody={itemDetails}
            handleChangeCheckbox={handleChangeCheckbox}
            handleCustomInput={handleCustomInput}
        />
        <div className="row p-2 text-right">
            <div className="col-sm-12">
                <button className="btn btn-sm btn-success" onClick={AddRowData}>
                    {t("Add Items")}
                </button>
            </div>
        </div>
    </div>
)}

      {newItemDetail?.length > 0 && (
        <div className="card mt-2">
          <Heading title={"Issued Items"} />
          <ConsignmentSaleReturnAddedTable
            thead={AddeddItemsthead}
            tbody={newItemDetail}
            handleRemove={handleRemove}
          />
          <div className="row p-2 text-right">
            <div className="col-sm-11 d-flex justify-content-end">
              <button className="btn btn-sm btn-success" onClick={handleSave}>
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsignmentSaleReturn;
