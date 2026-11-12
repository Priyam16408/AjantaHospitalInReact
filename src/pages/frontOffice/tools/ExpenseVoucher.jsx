import React, { useCallback, useEffect, useRef, useState } from "react";
import PersonalDetails from "@app/components/front-office/PersonalDetails";
import OtherDetails from "@app/components/front-office/OtherDetails";
import { useTranslation } from "react-i18next";
import Accordion from "@app/components/UI/Accordion";
import AddNewExpense from "@app/components/front-office/tools/AddNewExpense";
import Heading from "@app/components/UI/Heading";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import DatePicker from "@app/components/formComponent/DatePicker";
import Tables from "@app/components/UI/customTable";
import { Avatar } from "primereact/avatar";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AddNewExpenseTo,
  GetEmployeeDoctorByEmployeeType,
  GetExpenceHead,
  GetExpenceList,
  GetExpenceSubHeadByExpenceHeadID,
  getApprovedAPI,
  saveExpenseData,
} from "../../../networkServices/ExpenseVoucherApi";
import Modal from "../../../components/modalComponent/Modal";
import { SAVE_EXPENSE } from "../../../utils/constant";
import { notify } from "../../../utils/utils";
import moment from "moment";
import ExpenseVoucherTable from "../../../components/UI/customTable/expenseVoucherTable/expenseVoucherTable";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import { addNewExpenseValidation } from "../../../utils/validationschema";

const ExpenseVoucher = () => {
  const [customError, setCustomError] = useState(null);
  const [errorIndex, setErrorIndex] = useState(0);

  const { VITE_DATE_FORMAT } = import.meta.env;
  const inputRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const [searchState, setSearchState] = useState({
    toDate: moment().format("YYYY-MM-DD"),
    fromDate: moment().format("YYYY-MM-DD"),
    receiptNo: "",
  });
  const [addExpenseTo, setAddExpenseTo] = useState({ subHeadName: "" });

  const [apiData, setApiData] = useState({
    employeeType: [],
    GetExpenseAPIData: [],
    getExpenceHeadAPIData: [],
    getApprovedAPIData: [],
    getExpenseListData: [],
  });

  const handleModel = (
    label,
    width,
    type,
    isOpen,
    Component,
    handleAddExpenseTo
  ) => {
    setHandleModelData({
      label,
      width,
      type,
      isOpen,
      handleAddExpenseTo,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const {
    handleChange,
    values,
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    validateForm,
    resetForm,
  } = useFormik({
    initialValues: SAVE_EXPENSE,
    onSubmit: async (values) => {
      const customerrors = ErrorHandling();
      if (Object.keys(customerrors)?.length > 1) {
        if (Object.values(customerrors)[0]) {
          notify(Object.values(customerrors)[1], "error");
          return;
        }
      }

      if (values?.naration === "") {
        notify("Naration is required", "error");
        return;
      }

      const minusValues =
        values.paymentType === 1
          ? { amountPaid: values.amountPaid }
          : { amountPaid: -Math.abs(values.amountPaid) || "" };

      const newValues = {
        ...values,
        amountPaid: minusValues.amountPaid,
        amtCash: values.amountPaid,
        expenceTypeId: String(values.expenceTypeId.value),
        expenceType: values.expenceTypeId.label,
        expenceToId: String(values.expenceToId.value),
        expenceTo: values.expenceToId.label,
        roleID: values.roleID.value || values.roleID,
        approvedBy: values.approvedBy.label || "HOSPITAL",
        employeeID: values.employeeID.value || "",
        employeeName:
          values.employeeID.label || selectedItem?.NAME || values.employeeID,
        employeeType: values.employeeType.value,
        naration: values?.naration,
      };

      try {
        const dataRes = await saveExpenseData(newValues);
        debugger;
        if (dataRes?.data?.status === 400) {
          notify(dataRes.data.errors.ExpenceTo[0], "error");
        }
        if (dataRes.success) {
          notify(dataRes.message, "success");
          setValues(SAVE_EXPENSE);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleReactSelectChange = async (name, e) => {
    setFieldValue(name, e);
    const updateApiData = async (apiFunc, key) => {
      try {
        const data = await apiFunc(e);
        setApiData((prevState) => ({
          ...prevState,
          [key]: data.data,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    switch (name) {
      case "employeeType":
        return updateApiData(GetEmployeeDoctorByEmployeeType, "employeeType");
      case "expenceTypeId":
        return updateApiData(
          GetExpenceSubHeadByExpenceHeadID,
          "getExpenceHeadAPIData"
        );
      default:
        break;
    }
  };

  const fetchData = async (apiFunc, key) => {
    try {
      const data = await apiFunc();
      setApiData((prevState) => ({ ...prevState, [key]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(GetExpenceHead, "GetExpenseAPIData");
    fetchData(getApprovedAPI, "getApprovedAPIData");
  }, []);

  const handleAddExpenseInput = (e) => {
    setAddExpenseTo({ ...addExpenseTo, subHeadName: e.target.value });
  };

  const handleAddExpenseTo = async () => {
    if (!addExpenseTo.subHeadName.trim()) {
      notify("Please fill the input field.", "error");
      inputRef.current.focus();
      return;
    }
    try {
      const data = await AddNewExpenseTo({
        subHeadName: addExpenseTo.subHeadName,
        expenceType: values.expenceTypeId.label,
        // expenceType: values.expenceTypeId.label && selectedItem.ExpenceType,
      });
      if (data.success) {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
        
        notify(data.message, "success");
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setSearchState((prevState) => ({
      ...prevState,
      [name]: name === "receiptNo" ? value : moment(value).format("YYYY-MM-DD"),
    }));
  };

  const handleClickData = async () => {
    try {
      const data = await GetExpenceList(searchState);
      setApiData((prevData) => ({
        ...prevData,
        getExpenseListData: data?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetClickData = (item) => {
    setSelectedItem(item);
  };
  // console.log("")
  useEffect(() => {
    if (selectedItem) {
      setValues({
        ...values,
        amountPaid: "",
        amtCash: "",
        // expenceTypeId: Number(selectedItem?.ExpenceTypeId),
        // expenceType: selectedItem?.ExpenseType,
        // expenceToId: Number(selectedItem?.ExpenceToId),
        // expenceTo:  values.expenceToId.label,
        roleID: selectedItem?.RoleID,
        employeeID: selectedItem?.EmployeeID,
        naration: "",
        approvedBy: selectedItem?.ApprovedBy,
        receivedAgainstReceiptNo: selectedItem?.ReceiptNo,
        employeeName: selectedItem?.NAME,
        employeeType: selectedItem?.EmployeeType,
        paymentType: 2,
      });

      Promise.all([
        handleReactSelectChange("employeeType", {
          value: selectedItem.EmployeeType,
          label: selectedItem.EmployeeType,
        }),
        handleReactSelectChange("expenceTypeId", {
          value: selectedItem.ExpenceTypeId,
          label: selectedItem.ExpenceTypeId,
        }),
      ]);
    }
  }, [selectedItem]);

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!values?.employeeType) {
      errors.CardHolder = "Employee Type Is Required";
      errors.id[errors.id?.length] = "employeeType";
    }
    if (!values?.employeeID) {
      errors.employeeID = "Employee Name Is Required";
      errors.id[errors.id?.length] = "employeeID";
    }
    if (!values?.roleID) {
      errors.roleID = "Department Is Required";
      errors.id[errors.id?.length] = "roleID";
    }
    if (!values?.expenceTypeId) {
      errors.expenceTypeId = "Expence Type Is Required";
      errors.id[errors.id?.length] = "expenceTypeId";
    }
    if (!values?.expenceToId) {
      errors.expenceToId = "Expense To Is Required";
      errors.id[errors.id?.length] = "expenceToId";
    }
    if (!values?.amountPaid) {
      errors.amountPaid = "Amount Is Required";
      errors.id[errors.id?.length] = "amountPaid";
    }
    if (!values?.approvedBy) {
      errors.approvedBy = "Approved By Is Required";
      errors.id[errors.id?.length] = "approvedBy";
    }
    return errors;
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        return;
      }
    }
    await handleSubmit();
  };

  useEffect(() => {
    if (errorIndex > 0) {
      notify(customError, "error");
    }
  }, [customError]);

  return (
    <>
      <div className="m-2 spatient_registration_card">
        <form className="patient_registration card" onSubmit={handleSubmitForm}>
          <Heading title={t("SearchExpenceDetails")} isBreadcrumb={true} />

          <AddNewExpense
            handleReactSelectChange={handleReactSelectChange}
            apiData={apiData}
            handleModel={handleModel}
            inputValues={values}
            inputHandleChange={handleChange}
            handleAddExpenseTo={handleAddExpenseTo}
            formikError={errors}
            formikTouched={touched}
            selectedItem={selectedItem}
            // notifyError={notifyError}
          />
        </form>
        <form className="patient_registration card">
          <Heading title={t("Search Expence Details")} />
          <div className="row p-2">
            <DatePicker
              className="custom-calendar"
              id="From Data"
              name="fromDate"
              lable={t("FromDate")}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              value={
                searchState.fromDate
                  ? moment(searchState.fromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              handleChange={searchHandleChange}
            />
            <DatePicker
              className="custom-calendar"
              id="DOB"
              name="toDate"
              lable={t("To Date")}
              value={
                searchState.toDate
                  ? moment(searchState.toDate, "YYYY-MM-DD").toDate()
                  : null
              }
              handleChange={searchHandleChange}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            />

            <Input
              type="text"
              className="form-control "
              id="receiptNo"
              name="receiptNo"
              lable={t("Receipt No")}
              placeholder=" "
              value={searchState.receiptNo}
              onChange={searchHandleChange}
              respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            />

            {/* <MultiSelectComp respclass="col-xl-2 col-md-2 col-sm-6 col-12" /> */}
            <div className="box-inner ">
              <button
                className="btn btn-sm btn-primary ml-2"
                type="button"
                onClick={handleClickData}
              >
                {t("Search")}
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0 20px",
                gap: "10px",
              }}
            >
              <Avatar
                style={{ backgroundColor: "gray", color: "gray" }}
                shape="circle"
              />
              <p className="m-0">{t("Received")} </p>
            </div>
          </div>
        </form>
        <div className="card patient_registration_card my-1 mt-2">
          {apiData?.getExpenseListData?.length > 0 && (
            <ExpenseVoucherTable
              tbody={apiData?.getExpenseListData}
              handleSetClickData={handleSetClickData}
            />
          )}
        </div>
      </div>

      {handleModelData.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={handleModelData?.label}
          // buttonType={"submit"}
          // buttons={handleModelData?.extrabutton}
          modalData={handleModelData?.modalData}
          setModalData={setModalData}
          handleAPI={handleAddExpenseTo}
        >
          <div>
            <Input
              type="text"
              className="form-control required-fields"
              id="CreateExpense"
              name="subHeadName"
              lable={t("Create Expense")} // corrected 'lable' to 'label'
              placeholder=" "
              required={true}
              value={addExpenseTo.subHeadName} // Use addExpenseTo.subHeadName directly
              onChange={handleAddExpenseInput}
              respclass="col-xl-12 col-md-12 col-sm-6 col-12"
              inputRef={inputRef}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ExpenseVoucher;
