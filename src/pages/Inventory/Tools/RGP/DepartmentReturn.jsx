import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { GetStore } from "../../../../networkServices/BillingsApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import {
  FromDepartment,
  PatientReturnReport,
  ReturnBindItem,
  SaveFromDepartment,
  SearchDepartmet,
} from "../../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import FromDepartmentDetailTable from "../../../../components/UI/customTable/MedicalStore/FromDepartmentDetailTable";
import AddReturnDeptDetailTable from "../../../../components/UI/customTable/MedicalStore/AddReturnDeptDetailTable";
import Input from "../../../../components/formComponent/Input";
import { RedirectURL } from "../../../../networkServices/PDFURL";

const DepartmentReturn = () => {
  const [t] = useTranslation();
  const localdata = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  // Initial states
  const initialPayload = {
    StoreType: "",
    department: "",
    Item: "",
    narration: "",
  };
  const [payload, setPayload] = useState({
    ...initialPayload,
  });
  const [DropDownState, setDropDownState] = useState({
    bindStore: [],
    department: [],
    items: [],
  });
  const [tableData, setTableData] = useState([]);

  const updatePayload = (name, value) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value?.value || "",
    }));
  };

  const handleReactSelect = (name, value) => {
    updatePayload(name, value);
    console.log("LocalData" , localdata?.deptLedgerNo);

    switch (name) {
      case "StoreType":
        GetFromDepartment(value?.value);
        break;
      case "department":
        GeReturnBindItem(
          value?.value,
          payload.StoreType,
          localdata?.deptLedgerNo
        );
        break;
      default:
        break;
    }
  };

  // API Calls
  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      return response?.data;
    } catch (error) {
      console.error("Error fetching store data:", error);
      return [];
    }
  };

  const GetFromDepartment = async (storeType) => {
    try {
      const response = await FromDepartment(storeType);
      setDropDownState((prev) => ({
        ...prev,
        department: handleReactSelectDropDownOptions(
          response?.data,
          "LedgerName",
          "LedgerNumber"
        ),
      }));
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const GeReturnBindItem = async (department, storeType, ledgerNo) => {
    // debugger
    console.log("geReturnBindItem", department, storeType, ledgerNo);
    try {
      const response = await ReturnBindItem(department, storeType, ledgerNo);
      console.log("Response" , response);
      setDropDownState((prev) => ({
        ...prev,
        items: handleReactSelectDropDownOptions(
          response?.data,
          "itemname",
          "ItemID"
        ),
      }));
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  const GeSearchDepartmet = async () => {
    const Item = payload?.Item;
    const StoreType = payload?.StoreType;
    const Dept = localdata?.deptLedgerNo;
    const FromDept = payload?.department;
    try {
      const response = await SearchDepartmet(Item, StoreType, Dept, FromDept);
      setTableData(response?.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const storeData = await GetBindStoreID();
      setDropDownState((prev) => ({
        ...prev,
        bindStore: handleReactSelectDropDownOptions(
          storeData,
          "LedgerName",
          "LedgerNumber"
        ),
      }));
    } catch (error) {
      console.error("Error initializing dropdowns:", error);
    }
  };


  useEffect(() => {
    FetchAllDropDown();
  }, []);

  // Table headers
  const thead = [
    { name: t("Action"), width: "3%" },
    t("Item Name"),
    { name: t("Batch No."), width: "10%" },
    { name: t("Post Date"), width: "10%" },
    { name: t("Avail. Qty."), width: "10%" },
    { name: t("Unit Cost"), width: "10%" },
    { name: t("Return Qty."), width: "10%" },
  ];
  const ListHead = [
    { name: t("S.No."), width: "3%" },
    t("Item Name"),
    { name: t("Batch No."), width: "10%" },
    { name: t("Unit Cost"), width: "10%" },
    { name: t("Return Qty."), width: "10%" },
    { name: t("Action"), width: "3%" },
  ];

  const handleCustomInput = (index, name, value, type, max) => {
    console.log("index" , index , "name" , name , "value" , value , "type" , type , "max" , max); 
    if (!isNaN(value) && Number(value) <= max) {
      const data = [...tableData];
      data[index][name] = value;
      console.log("tableDattableDattableDattableDat" , tableData)
      setTableData(data);
    } else {
      return false;
    }
  };
  console.log("tableData" , tableData)
  const handleChangeCheckbox = (e, ele, index) => {
    let data = tableData.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setTableData(data);
  };
  const [list, setList] = useState([]);
  const AddRowData = () => {
    console.log("tableData from ---- " , tableData);
    console.log("")
    const checkedRows = tableData.filter((row) => row.ReturnQty > 0);
    setList((prevList) => [...prevList, ...checkedRows]);
    setTableData([]);
  };
  const handleRemove = (index) => {
    setList((prevState) => prevState.filter((_, i) => i !== index));
  };
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const sendReset = () => {
    setTableData([]);
    setList([]);
    setPayload({ ...initialPayload });
  };
  const handleSave = async () => {
    try {
      const returnMeds = list?.map((ele) => ({
        deptStockID: String(ele?.StockID) || "",
        itemID: String(ele?.itemid) || "",
        fromStockID: String(ele?.fromStockID) || "",
        itemName: String(ele?.ItemName) || "",
        batchNo: String(ele?.BatchNumber) || "",
        unitPrice: Number(ele?.UnitPrice) || 0,
        sellingPrice: Number(ele?.MRP) || 0,
        retQty: Number(ele?.ReturnQty) || 0,
        stockID: Number(ele?.StockID) || 0,
        medExpiry: ele?.MedExpiryDate,
        igstPercent: Number(ele?.IGSTPercent) || 0,
        cgstPercent: Number(ele?.CGSTPercent) || 0,
        sgstPercent: Number(ele?.SGSTPercent) || 0,
        hsnCode: String(ele?.HSNCode) || "",
        gstType: String(ele?.GSTType) || "",
        saleTaxPer: Number(ele?.SaleTaxPer) || 0,
        purTaxPer: Number(ele?.PurTaxPer) || 0,
      }));

      const Itempayload = {
        dtItem: returnMeds,
        storeType: String(payload?.StoreType),
        dept: String(payload?.department),
        narration: String(payload?.narration),
        ipAddress: String(ip),
      };

      const response = await SaveFromDepartment(Itempayload);
      console.log(response);
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
          <ReactSelect
            placeholderName={t("Store Type")}
            id="StoreType"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="StoreType"
            dynamicOptions={DropDownState?.bindStore}
            value={payload?.StoreType}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          <ReactSelect
            placeholderName={t("From Department")}
            id="department"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="department"
            dynamicOptions={DropDownState?.department}
            value={payload?.department}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          <ReactSelect
            placeholderName={t("Item")}
            id="Item"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Item"
            dynamicOptions={DropDownState?.items}
            value={payload?.Item}
            handleChange={handleReactSelect}
            removeIsClearable={true}
          />
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success"
              onClick={GeSearchDepartmet}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="card">
          <FromDepartmentDetailTable
            thead={thead}
            tbody={tableData}
            handleChangeCheckbox={handleChangeCheckbox}
            handleCustomInput={handleCustomInput}
          />
          <div className="row p-2">
            <div className="col-sm-12 text-right">

              <button className="btn btn-sm btn-success" onClick={AddRowData}>
              {t("Add Items")}
              </button>
            </div>
          </div>
        </div>
      )}
      {list?.length > 0 && (
        <div className="card">
          <AddReturnDeptDetailTable
            thead={ListHead}
            tbody={list}
            handleRemove={handleRemove}
          />
          <div className="row d-flex justify-content-end p-2">
            <Input
              type="text"
              className="form-control"
              id="narration"
              name="narration"
              value={payload?.narration}
              onChange={handleChange}
              lable={"Narration"}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            />
            <div className="col-sm-1 text-right">
              {/* <div className="btn btn-sm btn-success" onClick={handleSave}>
                {t("Save")}
              </div> */}
              <button className="btn btn-sm btn-danger" onClick={handleSave}>
              {t("Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentReturn;
