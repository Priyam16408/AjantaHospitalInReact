import React, { useEffect, useState } from "react";
import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import { Tabfunctionality } from "../../../utils/helpers";
import Heading from "../../../components/UI/Heading";
import Modal from "../../../components/modalComponent/Modal";
import { useFormik } from "formik";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import {
  DebitCreditNote_payload,
  MOBILE_NUMBER_VALIDATION_REGX,
  TYPECREDITDEBITLIST,
} from "../../../utils/constant";
import DebitCreditPatientDetailsTable from "../../../components/UI/customTable/ConfirmationTable/DebitCreditPatientDetailsTable";
import {
  GetDepartmentItemDetails,
  GetDepartmentWiseDetails,
  GetPanelList,
  SearchPatientCreditDebit,
} from "../../../networkServices/Tools";
import DepartmentWiseBillDetailTable from "../../../components/UI/customTable/ConfirmationTable/DepartmentWiseBillDetailTable";
import DebitCreditItemDetails from "../../../components/UI/customTable/ConfirmationTable/DebitCreditItemDetails";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Tables from "../../../components/UI/customTable";
import {
  handleSaveCreditDebitDetailsPayload,
  inputBoxValidation,
  notify,
  reactSelectOptionList,
} from "../../../utils/utils";
import { SaveCreditDebitDetails } from "../../../networkServices/opdserviceAPI";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { CommonReceiptPdf } from "../../../networkServices/BillingsApi";
import { RedirectURL } from "../../../networkServices/PDFURL";

const DebitCreditNote = () => {
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [errors, setErrors] = useState({});
  const [inSurePanelList, setInSurePanelList] = useState([]);
  const [bodyData, setBodyData] = useState({
    SearchPatient: [],
    DepartmentWiseBillDetail: [],
    GetDepartmentItemDetails: [],
    DebitCreditItemDetailList: [],
    AddRow: [],
    selectedUHID: null,
    isItemEdited: 0,
  });

  const { handleChange, values, setFieldValue, handleSubmit, setValues } =
    useFormik({
      initialValues: DebitCreditNote_payload,
      onSubmit: async (values, { resetForm }) => {
        const newValues = {
          patientID: values?.patientID,
          transactionID: values?.transactionID,
          patientName: values?.patientName,
          billNo: values?.billNo,
          transNo: values?.transNo,
        };
        try {
          if (
            newValues?.patientID ||
            newValues?.transactionID ||
            newValues?.patientName ||
            newValues?.billNo ||
            newValues?.transNo
          ) {
            const dataRes = await SearchPatientCreditDebit(newValues);

            if (dataRes?.success) {
              setBodyData((prevState) => ({
                ...prevState,
                SearchPatient: dataRes?.data,
                DepartmentWiseBillDetail: [],
                DebitCreditItemDetailList: [],
                AddRow: [],
              }));
            } else {
              notify("No Record Found", "error");
            }

            setBodyData((prevState) => ({
              ...prevState,
              SearchPatient: dataRes.data,
            }));
          } else {
            setBodyData((prevState) => ({
              ...prevState,
              SearchPatient: [],
              DepartmentWiseBillDetail: [],
              DebitCreditItemDetailList: [],
              AddRow: [],
            }));

            notify("Please select any one field", "error");
          }
        } catch (error) {
          console.error(error);
        }
      },
    });

  const handleModel = (label, width, type, isOpen, Component) => {
    setHandleModelData({
      label: label,
      width: width,
      type: type,
      isOpen: isOpen,
      Component: Component,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const TheadPersonalDetails = [
    t("SrNo"),
    t("UHID"),
    t("PatientName"),
    t("IPDNo"),
    t("Panel"),
    t("Address"),
    t("Bill_No"),
    t("Action"),
  ];

  const TheadDepartmentWise = [
    t("SrNo"),
    t("Department"),
    t("Quantity"),
    t("Amount"),
    t("Action"),
  ];
  const TheadItemWise = [
    t("Sr No."),
    t("Item"),
    t("Date"),
    t("Quantity"),
    t("Discount Percent"),
    t("Discount"),
    t("Gross Amount"),
    t("Credit Note"),
    t("Debit Note"),
    t("Net Amount"),
    t("Action"),
  ];
  const TheadTest = [
    t("Sr.No."),
    t("Item Name"),
    t("Quantity"),
    t("DisplayName"),
    t("Discount"),
    t("GrossAmount"),
    t("CreditNote"),
    t("DebitNote"),
    t("Net Amount"),
    t("Amount"),
    t("Type"),
    t("Narration"),
    t("Delete"),
  ];

  // first table;
  const handleClickPatientWise = async (data) => {
    debugger
    const { TransactionID, Type, LedgertransactionNo, PatientID } = data;

    try {
      const panelData = await FetchPanelByPatientIDDropDown(
        TransactionID,
        Type,
        LedgertransactionNo
      );

      const departmentDetails = await GetDepartmentWiseDetails(
        TransactionID,
        Type,
        LedgertransactionNo
      );

      if (departmentDetails?.data?.length > 0) {
        setBodyData((val) => ({
          ...val,
          DepartmentWiseBillDetail: departmentDetails?.data,
          selectedUHID: PatientID,
        }));
        setBodyData((val) => ({
          ...val,
          DebitCreditItemDetailList: [],
          AddRow: [],
        }));

        setInSurePanelList(panelData);
      }
    } catch (error) {
      console.error("Error fetching department details:", error);
    }
  };

  // second table

  const handleClickDepartmentWiseBillDetail = async (data, index) => {
    debugger
    try {
      const [categoryId, configId] =
        bodyData?.DepartmentWiseBillDetail[index]?.Category.split("#");

      const requestbodyData = {
        transactionID: data?.TransactionId,
        configID: configId,
        categoryID: categoryId,
        displayName: bodyData?.DepartmentWiseBillDetail[index]?.DisplayName,
        type: bodyData?.DepartmentWiseBillDetail[index]?.Type,
        ledgerTransactionNo:
          (bodyData?.DepartmentWiseBillDetail[
            index
          ]?.LedgerTransactionNo).toString(),
      };
      const ItemDetails = await GetDepartmentItemDetails(requestbodyData);
     

      if (ItemDetails?.data?.length > 0) {
        setBodyData((val) => ({
          ...val,
          DebitCreditItemDetailList: ItemDetails?.data,
        }));
        setBodyData((val) => ({
          ...val,
          DebitCreditItemDetailList: ItemDetails?.data,
        }));
      }
       if(!ItemDetails?.success){
        notify(ItemDetails?.message,"error")
      }

    } catch (error) {
      console.error("Error fetching department details:", error);
    }
  };

  const FetchPanelByPatientIDDropDown = async (
    TransactionID,
    Type,
    LedgertransactionNo
  ) => {
    try {
      const response = await GetPanelList(
        TransactionID,
        Type,
        LedgertransactionNo
      );

      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!values?.crdrNoteType) {
      errors.crdrNoteType = "Credit/Debit Type Is Required";
      errors.id[errors.id?.length] = "crdrNoteTypeFocus";
    }
    if (!values?.panelID?.label) {
      errors.panelID = "Credit/Debit Type Is Required";
      errors.id[errors.id?.length] = "panelIDFocus";
    }
    if (!values?.CreditAmt) {
      errors.CreditAmt = "Credit/Debit Amount Is Required";
      errors.id[errors.id?.length] = "CreditAmtFocus";
    }
    if (!values?.Narration) {
      errors.Narration = "Narration Is Required";
      errors.id[errors.id?.length] = "NarrationFocus";
    }

    return errors;
  };

  useEffect(() => {
    if (errors?.id) {
      const inputElement = document.getElementById(errors?.id[0]);
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [errors]);

  const AddRowData = () => {
    const customerrors = ErrorHandling();
    console.log("customerrorscustomerrors", customerrors);
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return;
    }

    setBodyData((prevState) => ({
      ...prevState,
      AddRow: [...prevState.AddRow, values],
    }));
    setValues(DebitCreditNote_payload);
  };

  const handleDeleteRow = (index) => {
    setBodyData((prevState) => ({
      ...prevState,
      AddRow: prevState.AddRow.filter((_, i) => i !== index),
    }));
  };

  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
  };

  const handleDebitCreditItemDetails = (data) => {
    setValues({
      ...data,
      ...values,
      Amount: data?.Amount,
    });
    setBodyData({
      ...bodyData,
      isItemEdited: 1,
    });
  };

  const compareOPDAdvanceAmount = (e, handleChange) => {

    if (e.target.name === "CreditAmt" && e.target.value > values?.Amount) {
      return;
    }

    if (values?.crdrNoteType.value === 1 || values?.crdrNoteType.value === 2) {
      handleChange(e);
    } else {
      if (e.target.value <= (values?.Amount ? parseInt(values?.Amount) : 0)) {
        handleChange(e);
      }
    }
  };

  const handleSaveCreditDebitDetails = async () => {
    debugger
    try {
      if (bodyData?.AddRow?.length <= 0) {
        notify("Please add row", "error");
        return;
      }
      const ip = useLocalStorage("ip", "get");
      const data = await SaveCreditDebitDetails({
        ...handleSaveCreditDebitDetailsPayload(bodyData?.AddRow),
        ipAddress: ip,
        patientId: String(bodyData?.selectedUHID),
      });
      if (data?.success) {
        // debugger
        const reportResp = await CommonReceiptPdf({
          ledgerTransactionNo: bodyData?.AddRow.length > 0 ? bodyData?.AddRow[0]?.LedgerTransactionNo : "",
          isBill: 1,
          receiptNo: "",
          duplicate: "",
          type: bodyData?.AddRow.length > 0 ? bodyData?.AddRow[0]?.Type : "OPD",
          supplierID: "",
          billNo: "",
          isEMGBilling: "",
          isOnlinePrint: "",
          isRefound: 0,
        });
        if (reportResp?.success) {
          RedirectURL(reportResp?.data?.pdfUrl);
        }
        notify("Data Successfully Saved");
        setBodyData(DebitCreditNote_payload);
        setValues(DebitCreditNote_payload);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  console.log(bodyData);

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <form className="card patient_registration">
        <Heading title={t("Manage_Debit_Credit_Note")} isBreadcrumb={true} />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            lable={t("UHID")}
            placeholder=" "
            id="patientID"
            name="patientID"
            onChange={handleChange}
            value={values?.patientID}
            required={true}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("IPD_NO")}
            placeholder=" "
            id="transNo"
            name="transNo"
            onChange={handleChange}
            value={values?.transNo}
            required={true}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Patient_Name")}
            placeholder=" "
            id="patientName"
            name="patientName"
            onChange={handleChange}
            value={values?.patientName}
            required={true}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Bill_No")}
            placeholder=" "
            id="billNo"
            name="billNo"
            onChange={handleChange}
            value={values?.billNo}
            required={true}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
            onKeyDown={Tabfunctionality}
          />
          <div className=" col-sm-2">
            <button className="btn btn-sm btn-success" onClick={handleSubmit}>
              {t("Search")}
            </button>
          </div>
        </div>
      </form>
      <div className="card patient_registration my-2">
        <DebitCreditPatientDetailsTable
          THEAD={TheadPersonalDetails}
          tbody={bodyData?.SearchPatient}
          handleClickPatientWise={handleClickPatientWise}
        />
      </div>

      <div className="row">
        <div className="col-sm-5">
          <div className="card patient_registration mt-1">
            <DepartmentWiseBillDetailTable
              THEAD={TheadDepartmentWise}
              tbody={bodyData?.DepartmentWiseBillDetail}
              handleClickDepartmentWiseBillDetail={
                handleClickDepartmentWiseBillDetail
              }
            />
          </div>
        </div>

        <div className="col-sm-7">
          <div className="card patient_registration mt-1">
            <DebitCreditItemDetails
              THEAD={TheadItemWise}
              tbody={bodyData?.DebitCreditItemDetailList}
              handleDebitCreditItemDetails={handleDebitCreditItemDetails}
              values={values}
            />
          </div>
        </div>
      </div>

      {bodyData?.isItemEdited === 1 && (
        <>
          <div className="card patient_registration pt-2 px-2 mt-1">
            <div className="row">
              <ReactSelect
                placeholderName={t("DiscountType")}
                dynamicOptions={TYPECREDITDEBITLIST}
                searchable={true}
                id={"crdrNoteType"}
                removeIsClearable={true}
                name={"crdrNoteType"}
                value={`${values?.crdrNoteType}`}
                handleChange={handleReactSelect}
                respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                onKeyDown={Tabfunctionality}
                inputId="crdrNoteTypeFocus"
                requiredClassName={`required-fields ${errors?.crdrNoteType ? "required-fields-active" : ""}`}
                tabIndex="1"
              />
              <ReactSelect
                placeholderName={t("InSurancePanel")}
                id="panelID"
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                value={`${values?.panelID?.value}`}
                name="panelID"
                dynamicOptions={reactSelectOptionList(
                  inSurePanelList,
                  "Company_Name",
                  "PanelID"
                )}
                handleChange={handleReactSelect}
                inputId="panelIDFocus"
                requiredClassName={`required-fields ${errors?.panelID ? "required-fields-active" : ""}`}
                tabIndex="2"
              />
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput
                  label={t("Total Amount")}
                  value={values?.Amount}
                />
              </div>
              <Input
                name="CreditAmt"
                value={values?.CreditAmt ? values?.CreditAmt : ""}
                onChange={(e) => {
                  compareOPDAdvanceAmount(e, handleChange);
                  inputBoxValidation(
                    MOBILE_NUMBER_VALIDATION_REGX,
                    e,
                    () => { }
                  );
                }}
                lable={
                  values?.crdrNoteType.value === 1 ||
                    values?.crdrNoteType.value === 2
                    ? t("CreditAmt")
                    : t("DebitAmt")
                }
                id="CreditAmtFocus"
                tabIndex="3"
                className={`form-control required-fields ${errors?.CreditAmt && "required-fields-active"}`}
                placeholder=" "
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                onKeyDown={Tabfunctionality}
              />
              <Input
                type="text"
                id="Narration"
                name="Narration"
                value={values?.Narration}
                onChange={handleChange}
                lable={t("Narration")}
                placeholder=" "
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                onKeyDown={Tabfunctionality}
                inputId="NarrationFocus"
                tabIndex="4"
                className={`form-control required-fields ${errors?.Narration && "required-fields-active"}`}
              />
              <div className="col-sm-2">
                <button className="btn btn-sm btn-info" onClick={AddRowData}>
                  {t("Add")}
                </button>
              </div>
            </div>
          </div>
          <div className="card patient_registration my-2">
            <Tables
              thead={TheadTest}
              tbody={bodyData?.AddRow.map((item, index) => ({
                "Sr.No": index + 1,
                " Item Name": item?.ItemName,
                Quantity: item?.Quantity,
                "Display Name": item?.DisplayName,
                Discount: item?.DiscAmt,
                "Gross Amount": item?.Amount,
                "Credit Note": item?.CreditAmount,
                "Debit Note": item?.DebitAmount,
                NetAmount: item?.NetAmount,
                CreditAmt: item?.CreditAmt,
                Type: item?.crdrNoteType,
                Narration: item?.Narration,
                Delete: (
                  <>
                    <i
                      className="fa fa-trash text-danger text-center "
                      aria-hidden="true"
                      onClick={() => handleDeleteRow(index)}
                    />
                  </>
                ),
              }))}
            />
          </div>
          <div className="row d-flex justify-content-end">
            <div className="col-sm-1">
              <button
                className="btn btn-sm btn-block btn-info"
                onClick={handleSaveCreditDebitDetails}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DebitCreditNote;
