import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  IssueTypeOptions,
  PatientTypeOption,
  Report_Formate,
  ReportTypeOptions,
  stockReportOptions,
  TransactionTypeOptions,
} from "../../../utils/constant";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import Input from "../../../components/formComponent/Input";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import {
  BindMedicineStoreDepartment,
  BindStoreGroup,
  BindStoreItems,
  BindStoreSubCategory,
  IssueDetail,
} from "../../../networkServices/InventoryApi";
import { GetStore } from "../../../networkServices/BillingsApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const StockLedgerMedical = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get");
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
  const [DropDownState, setDropDownState] = useState({
    bindStore: [],
    binddepartment: [],
    bindcategory: [],
    issuedetail: [],
  });

  const initialValues = {
    StockReport: "1",
    centre: [
      { name: localData?.centreName, code: Number(localData?.centreID) },
    ],
    StoreType: "",
    department: [],
    categoryId: [],
    subcategoryId: [],
    itemId: [],
    fromDate: new Date(),
    toDate: new Date(),
    issuedTo: [],
    reportType: "",
    issueType: "",
    transactionType: "",
    patientType: "",
    UHID: "",
  };
  const [subGroup, setSubGroup] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [values, setValues] = useState({ ...initialValues });

  const handleReactSelect = (name, value) => {
    console.log(value);
    setValues((prevData) => ({
      ...prevData,
      [name]: value?.value || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };
  console.log(values);

  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const GetBindDepartment = async () => {
    const DeptID = localData?.deptLedgerNo;
    try {
      const response = await BindMedicineStoreDepartment(DeptID);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindGroup = async () => {
    const DeptLedgerNo = localData?.deptLedgerNo;
    try {
      const response = await BindStoreGroup(DeptLedgerNo);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const [issueDept, setIssueDept] = useState([]);
  const getIssueDetail = async () => {
    try {
      const response = await IssueDetail();
      setIssueDept(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBindStoreSubCategory = async () => {
    const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
    try {
      const response = await BindStoreSubCategory(CategoryID);
      setSubGroup(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBindStoreItems = async () => {
    const Subcategory = handlePayloadMultiSelect(values?.subcategoryId);
    try {
      const response = await BindStoreItems(Subcategory);
      if (response?.success) {
        setStoreItems(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const [BindGetStore, BindStoreDept, BindGroupId, BindIssue] =
        await Promise.all([
          GetBindStoreID(),
          GetBindDepartment(),
          getBindGroup(),
          // getIssueDetail(),
        ]);

      const dropDownData = {
        bindStore: handleReactSelectDropDownOptions(
          BindGetStore,
          "LedgerName",
          "LedgerNumber"
        ),
        binddepartment: handleReactSelectDropDownOptions(
          BindStoreDept,
          "ledgerName",
          "ledgerNumber"
        ),
        bindcategory: handleReactSelectDropDownOptions(
          BindGroupId,
          "name",
          "categoryID"
        ),
        // issuedetail: handleReactSelectDropDownOptions(
        //   BindIssue,
        //   "name",
        //   "categoryID"
        // ),
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (values?.categoryId?.length > 0) {
      getBindStoreSubCategory();
    }
  }, [values.categoryId]);

  useEffect(() => {
    if (values?.subcategoryId?.length > 0) {
      getBindStoreItems();
    }
  }, [values?.subcategoryId?.length]);

  useEffect(() => {
    FetchAllDropDown();
    getIssueDetail();
  }, []);

  const MemoizedDropdown = React.memo(({ options }) => {
    return (
      <MultiSelect
        options={options}
        // onChange={handleChange}
        // value={selectedValues}
      />
    );
  });
  let showItem = {
    StockReport: true,
    CentreName: true,
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <form className="patient_registration position-relative">
          <div className="row p-2">
            {showItem?.StockReport && (
              <ReactSelect
                placeholderName={t("Stock Report")}
                id={"StockReport"}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name={"StockReport"}
                dynamicOptions={stockReportOptions}
                value={values?.StockReport}
                handleChange={handleReactSelect}
                requiredClassName="required-fields"
              />
            )}
            
            <ReportsMultiSelect
              name="centre"
              placeholderName="Centre"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              values={values}
              setValues={setValues}
              dynamicOptions={GetEmployeeWiseCenter}
              labelKey="CentreName"
              valueKey="CentreID"
              requiredClassName={true}
            />
            <ReactSelect
              placeholderName={t("Store Type")}
              id={"StoreType"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name={"StoreType"}
              dynamicOptions={DropDownState?.bindStore}
              value={values?.StoreType}
              handleChange={handleReactSelect}
            />
            <ReportsMultiSelect
              name="department"
              placeholderName="Department"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              values={values}
              setValues={setValues}
              dynamicOptions={DropDownState?.binddepartment}
              labelKey="ledgerName"
              valueKey="ledgerNumber"
            />
            <ReportsMultiSelect
              name="categoryId"
              placeholderName="Groups"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              values={values}
              setValues={setValues}
              dynamicOptions={DropDownState?.bindcategory}
              labelKey="name"
              valueKey="categoryID"
            />
            <ReportsMultiSelect
              name="subcategoryId"
              placeholderName="Sub Groups"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              values={values}
              setValues={setValues}
              dynamicOptions={subGroup}
              labelKey="Name"
              valueKey="SubCategoryID"
            />

            <ReportsMultiSelect
              name="itemId"
              placeholderName="Items"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              values={values}
              setValues={setValues}
              dynamicOptions={storeItems?.splice(0, 50)}
              labelKey="TypeName"
              valueKey="ItemID"
            />
            <ReportDatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              id="fromDate"
              name="fromDate"
              lable={t("FrontOffice.OPD.Report.CollectionReport.fromDate")}
              values={values}
              setValues={setValues}
              max={values?.toDate}
            />

            <ReportDatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              id="toDate"
              name="toDate"
              lable={t("FrontOffice.OPD.Report.CollectionReport.toDate")}
              values={values}
              setValues={setValues}
              max={new Date()}
              min={values?.fromDate}
            />
            {/* <ReportsMultiSelect
              name="issuedTo"
              placeholderName="Issued To"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              values={values}
              setValues={setValues}
              dynamicOptions={issueDept}
              labelKey="ledgerName"
              valueKey="ledgerNumber"
            /> */}

            {/* <ReactSelect
              placeholderName={t("Issue Type")}
              id="issueType"
              searchable
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={IssueTypeOptions}
              name="issueType"
              value={values?.issueType}
              removeIsClearable={true}
              handleChange={handleReactSelect}
            /> */}
            {/* <ReactSelect
              placeholderName={t("Transaction Type")}
              id="transactionType"
              searchable
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={TransactionTypeOptions}
              value={values?.transactionType}
              name="transactionType"
              removeIsClearable={true}
              handleChange={handleReactSelect}
            /> */}
            {/* <ReactSelect
              placeholderName={t("Patient Type")}
              id={"patientType"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={PatientTypeOption}
              name="patientType"
              handleChange={handleReactSelect}
              value={values?.patientType}
            /> */}
            <ReactSelect
              placeholderName={t("Report Formate")}
              id="reportformate"
              searchable
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={Report_Formate}
              value={values?.reportformate}
              name="reportformate"
              handleChange={handleReactSelect}
            />
            {/* <Input
              type="text"
              className="form-control"
              id="UHID"
              name="UHID"
              value={values?.UHID}
              onChange={handleChange}
              lable={t("UHID")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            /> */}
            <ReactSelect
              placeholderName={t("Report Type")}
              id="reportType"
              searchable
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={ReportTypeOptions}
              value={values?.reportType}
              name="reportType"
              removeIsClearable={true}
              handleChange={handleReactSelect}
            />
            <div className="d-flex align-items-end">
              <Input
                type="checkbox"
                id="IncludeZeroStock"
                name="IncludeZeroStock"
                value={values?.IncludeZeroStock}
                onChange={handleChange}
                lable={t("IncludeZeroStock")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <label className="ml-1">Include Zero Stock</label>
            </div>
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              // onClick={handleSubmit}
            >
              Report
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StockLedgerMedical;
