import React, { useEffect, useRef, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import moment from "moment";
import DatePicker from "../../../components/formComponent/DatePicker";
import { Tabfunctionality } from "../../../utils/helpers";
import Input from "../../../components/formComponent/Input";
import { useSelector } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  GetBindDepartment,
  getEmployeeWise,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import {
  BindStoreRequisitionDepartment,
  GetAutoPurchaseRequestItemsApi,
  GetCategoryByStoreType,
  getCreateRequisition,
  GetStore,
  GetSubCategoryByCategory,
  PrintIndent,
} from "../../../networkServices/BillingsApi";
import {
  handleReactSelectDropDownOptions,
  notify,
  SaveCreateRequisitionPayload,
} from "../../../utils/utils";
import CreateRequisitionIndentTable from "../../../components/UI/customTable/billings/CreateRequisitionIndentTable";
import { DDlRequisitionType } from "../../../utils/constant";
import ViewUserRequisition from "./ViewUserRequisition";
import { RedirectURL } from "../../../networkServices/PDFURL";

const CreateRequisition = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [showCategory, setShowCategory] = useState(false);
  const [tableItems, setTableItems] = useState([]);
  const [indexItem, setIndexItem] = useState([]);
  const [tbody, setTbody] = useState([
    {
      SrNo: 1,
    },
  ]);
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    StoreType: "STO00001",
    center: "1",
    Department: "LSHHI17",
    Category: "5",
    SubCategoryID: "0",
    RequisitionOn: new Date(),
    RequisitionType: "1",
    Narration: "",
    RequestFor: "10",
    MinDays: "10",
  };
  const [DropDownState, setDropDownState] = useState({
    bindStore: [],
    category: [],
    subcategory: [],
    departments: [],
  });
  const { GetEmployeeWiseCenter } = useSelector((state) => state?.CommonSlice);
  const [values, setValues] = useState({ ...initialValues });
  // console.log("  values?.StoreType",  values?.StoreType)

  // console.log(values?.Department);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleReactSelect = (name, value) => {
    console.log("name", name, "value", value);
    console.log(value);
    setValues((val) => ({ ...val, [name]: value?.value || "" }));
    if (name === "StoreType") {
      getBindCategory({ storeID: value?.value });
      getBindStoreRequisitionDepartment({ storetype: value?.value });
    }
    if (name === "Category") {
      getBindSubcategory({ categoryID: value?.value });
    }
  };

  console.log("SetValue's value", values);

  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindStoreRequisitionDepartment = async (val) => {
    try {
      const response = await BindStoreRequisitionDepartment(val?.storetype);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindCategory = async (val) => {
    try {
      const response = await GetCategoryByStoreType(val?.storeID);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindSubcategory = async (val) => {
    try {
      const response = await GetSubCategoryByCategory(val?.categoryID);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const [BindGetStore, BindCategory, BindSubCategory, BindDepartment] =
        await Promise.all([
          GetBindStoreID(),
          getBindCategory({
            storeID: values?.StoreType,
          }),
          getBindSubcategory({
            categoryID: values?.Category,
          }),
          getBindStoreRequisitionDepartment({
            storetype: values?.StoreType,
          }),
        ]);

      const dropDownData = {
        bindStore: handleReactSelectDropDownOptions(
          BindGetStore,
          "LedgerName",
          "LedgerNumber"
        ),

        category: handleReactSelectDropDownOptions(
          BindCategory,
          "name",
          "categoryID"
        ),
        subcategory: [
          { label: "All", value: "0" },
          ...handleReactSelectDropDownOptions(
            BindSubCategory,
            "name",
            "subCategoryID"
          ),
        ],

        departments: handleReactSelectDropDownOptions(
          BindDepartment,
          "LedgerName",
          "LedgerNumber"
        ),
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (localData?.employeeID) {
      dispatch(getEmployeeWise({ employeeID: localData?.employeeID }));
    }
  }, [dispatch]);
  useEffect(() => {
    dispatch(GetBindDepartment());
    FetchAllDropDown();
  }, []);
  const thead = [
    { name: t("S.No."), width: "3%" },
    t("ItemName"),
    { name: t("Qty"), width: "4%" },
    { name: t("Unit"), width: "5%" },
    { name: t("SalesQty"), width: "7%" },
    { name: t("Net Qty"), width: "7%" },
    { name: t("MinLevel"), width: "7%" },
    { name: t("MaxLevel"), width: "7%" },
    { name: t("Stock"), width: "7%" },
    { name: t("Dept Stock"), width: "7%" },
    { name: t("Pen Indent Qty"), width: "7%" },
    { name: t("Remarks"), width: "14%" },
  ];
  const [insdentNo, setIndentNo] = useState("");
  const sendReset = () => {
    setValues(initialValues);
    setTbody([{ SrNo: 1 }]);
  };

  const handleCreateRequisition = async () => {
    // console.log(" at HandleCreateRequistion Tbody " , tbody , "value" , values , "LocalData" , localData)
    const requestBody = SaveCreateRequisitionPayload(
      tbody,
      values,
      localData,
      localData?.StoreType
    );
    // console.log("Resquested Body" , requestBody)
    console.log("requestBodyrequestBody", requestBody);

    try {
      if (tbody.length > 1) {
        if (tbody?.Quantity < 0) {
          notify("Please enter qty", "error");
        }
        const response = await getCreateRequisition(requestBody);
        if (response?.success) {
          notify(response?.message, "success");
          setIndentNo(response?.data);
          const reportResp = await PrintIndent(response?.data);
          if (reportResp?.success) {
            RedirectURL(reportResp?.data?.pdfUrl);
            sendReset();
          } else {
            notify(reportResp?.data?.message, "error");
          }
          sendReset();
        } else {
          notify(response?.message, "error");
        }
      } else {
        notify("Please add at least One Item to proceed.", "error");
      }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };

  const handleItemSelect = (value) => {
    console.log(value);
    setIndexItem(value);
  };

  const handleToggle = () => {
    setShowCategory((prev) => !prev);
  };

  const handleAutoPurchaseRequisition = async () => {
    const requestBody = {
      departmentLedgerNo: String(localData?.deptLedgerNo) || "",
      deptTo: String(values?.Department) || "",
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      categoryID: Number(values?.Category) || 0,
      subCategoryID: Number(values?.SubCategoryID) || 0,
      minDays: Number(values?.MinDays) || 0,
      reorderInDays: Number(values?.RequestFor) || 1,
      centreTo: Number(values?.center) || 0,
      centreID: Number(localData?.centreID) || 0,
    };

    try {
      const response = await GetAutoPurchaseRequestItemsApi(requestBody);
      if (response?.success) {
        setTableItems(response?.data);
        sendReset();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };
  console.log(tableItems);
  return (
    <>
      <div className="card patient_registration border">
        <Heading title={"Admitted Patients"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("StoreType")}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name={"StoreType"}
            dynamicOptions={DropDownState?.bindStore}
            value={values?.StoreType}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("CenterTo")}
            id={"center"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
              return { label: ele.CentreName, value: ele.CentreID };
            })}
            name="center"
            handleChange={handleReactSelect}
            value={values?.center}
          />
          <ReactSelect
            placeholderName={t("DepartmentTo")}
            id={"Department"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={DropDownState?.departments}
            name="Department"
            handleChange={handleReactSelect}
            value={values?.Department}
          />
          <button className="btn btn-sm btn-success ml-2" onClick={handleToggle}>
            {t("Auto Indent")}
          </button>
        </div>
        {showCategory && (
          <div className="row px-2">
            <ReactSelect
              placeholderName={t("Category")}
              id={"Category"}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              name={"Category"}
              dynamicOptions={DropDownState?.category}
              value={values?.Category}
              handleChange={handleReactSelect}
            />
            <ReactSelect
              placeholderName={t("Sub_Category")}
              id={"SubCategoryID"}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              name={"SubCategoryID"}
              dynamicOptions={DropDownState?.subcategory}
              value={values?.SubCategoryID}
              handleChange={handleReactSelect}
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id="fromDate"
              name="fromDate"
              value={
                values.fromDate
                  ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              handleChange={handleChange}
              lable={t("From Date")}
              placeholder={VITE_DATE_FORMAT}
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id="toDate"
              name="toDate"
              value={
                values.toDate
                  ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                  : null
              }
              handleChange={handleChange}
              lable={t("ToDate")}
              placeholder={VITE_DATE_FORMAT}
            />
            <Input
              type="text"
              className="form-control"
              lable={t("Min Days")}
              placeholder=" "
              id="MinDays"
              name="MinDays"
              onChange={handleChange}
              value={values?.MinDays}
              required={true}
              respclass="col-xl-1 col-md-3 col-sm-6 col-12"
              onKeyDown={Tabfunctionality}
            />
            <Input
              type="text"
              className="form-control"
              lable={t("Request For")}
              placeholder=" "
              id="RequestFor"
              name="RequestFor"
              onChange={handleChange}
              value={values?.RequestFor}
              required={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              onKeyDown={Tabfunctionality}
            />
            <button
              className="btn btn-sm btn-success ml-2 mb-2"
              onClick={handleAutoPurchaseRequisition}
            >
              {t("Add Indent")}
            </button>
          </div>
        )}
      </div>
      <div className="card">
        {/* {console.log("values in the create", values?.StoreType)} */}
        <CreateRequisitionIndentTable
          THEAD={thead}
          val={values?.StoreType}
          values={values}
          tbody={tbody}
          setTbody={setTbody}
          handleItemSelect={handleItemSelect}
          localData={localData}
        />
      </div>
      <div className="card">
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("RequisitionType")}
            id={"RequisitionType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={DDlRequisitionType}
            name="RequisitionType"
            handleChange={handleReactSelect}
            value={values?.RequisitionType}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="RequisitionOn"
            name="toDate"
            value={
              values.RequisitionOn
                ? moment(values?.RequisitionOn, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("Requisition On")}
            placeholder={VITE_DATE_FORMAT}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Narration")}
            placeholder=" "
            id="Narration"
            name="Narration"
            onChange={handleChange}
            value={values?.Narration}
            required={true}
            respclass="col-xl-4 col-md-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <div className="d-flex align-item-centre justify-content-end ml-2">
            <button
              className="btn btn-sm btn-success"
              onClick={handleCreateRequisition}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <ViewUserRequisition
          insdentNo={insdentNo}
          storetype={values?.StoreType}
        />
      </div>
    </>
  );
};

export default CreateRequisition;
