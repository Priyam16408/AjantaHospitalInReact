import React, { useEffect, useState } from "react";
import TextAreaInput from "../../../../components/formComponent/TextAreaInput";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import Input from "../../../../components/formComponent/Input";
import ReactQuill from "react-quill";
import { formats, modules } from "../../../../utils/constant";
import { notify } from "../../../../utils/ustil2";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import {
  OTBindData,
  OTBindddlProcedure,
  OTBindSurgery,
  OTNotesSave,
  OTPrintOTNotes,
} from "../../../../networkServices/OT/otAPI";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import Tables from "../../../../components/UI/customTable";

const OtNotes = ({ data }) => {
  const [t] = useTranslation();
  const thead = [
    { name: "S.No.", width: "1%" },
    { name: t("PRE OPERATIVE DIAGNOSIS") },
    { name: t("POST OPERATIVE DIAGNOSIS") },
    { name: t("Operation") },
    { name: t("INCISIONS 1") },
    { name: t("INCISIONS 2") },
    { name: t("Ports") },
    { name: t("Anesthesia") },
    { name: t("Procedure Name") },
    // { name: t("Findings") },
    // { name: t("Drains") },
    // { name: t("Closure") },
    // { name: t("SAMPLE (TISSUE) SENT FOR HISTOPATH...") },
    // { name: t("COMPLICATIONS (IF ANY)") },
    // { name: t("BLOOD LOSS") },
    { name: "Edit" }
  ]

  const [values, setValues] = useState({});
  const [commentMessage, setCommentMessage] = useState("");
  const [testList, setTestList] = useState([]);
  const [dropDownSate, setDropDownState] = useState({
    ProcedureName: [],
    tableData: []
  });

  const [Editable, setEditable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleEditorVal = (value) => {
    setCommentMessage(value);
    const finalData = [...testList];
    setTestList(finalData);
  };

  const handleReactSelect = (name, value) => {
    // debugger;
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
    setCommentMessage(value?.Template_Value);
  };

  const BindData = async () => {
    const payload = {
      TransactionID: data?.TransactionID,
      LedgerTransactionNo: data?.OTBookingID,
    };
    const response = await OTBindData(payload);
    debugger
    const res = response?.data;
    if (response?.success) {
      const foramtedData = {
        PreoperativeDiagnosis: res?.PreOperatveDignose || "",
        PostOperativeDiagnosis: res?.PostOprDignosis || "",
        Operation: res?.Operation || "",
        Incisions1: res?.Incisions1 || "",
        Incisions2: res?.Incisions2 || "",
        Findings: res?.Findings || "",
        Drains: res?.Drains || "",
        Closure: res?.Closure || "",
        SampleHistopathology: res?.Sample || "",
        Complications: res?.Complication || "",
        BloodLoss: res?.BloodLoss || "",
        PostOperativeInstructions: res?.PostOpInstruction || "",
        Ports: res?.Ports || "",
        Anesthesia: res?.AnesthesiaType || "",
        SurgeryID: res?.SurgeryID || "",
        SurgeryName: res?.SurgeryName || "",
        isEdit: response?.data?.SurgeryID ? 1 : 0,
        ProcedureName: { value: res?.Procedures },
      }

      // debugger
      setDropDownState((val) => ({ ...val, tableData: [foramtedData] }))
      setValues(foramtedData);

      setCommentMessage(res?.Procedures || "");
    } else {
      // notify(response?.message, "error");
    }
  };
  console.log("    dropDownSate?.ProcedureName", dropDownSate?.ProcedureName)
  const OTBindddlProcedureData = async () => {
    const response = await OTBindddlProcedure();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        ProcedureName: handleReactSelectDropDownOptions(
          response?.data,
          "Temp_Name",
          "Template_Value"
        ),
      }));
    } else {
      notify(response?.message, "error");
    }
  };
  console.log("values?.ProcedureName", values)
  const handleSave = async () => {
    console.log("Values", values);
    debugger;
    const payload = {
      type: values?.isEdit === 1 ? "Update" : "Save",
      pid: data?.PatientID,
      tid: data?.TransactionID ? data?.TransactionID : 0,
      ledgerTransactionNo: data?.OTBookingID,
      urgency: "", //No entry in the BACKEND TABLE
      diagnosis: values?.PreoperativeDiagnosis ? values?.PreoperativeDiagnosis : "",
      operation: values?.Operation ? values?.Operation : "",
      incisions1: values?.Incisions1 ? values?.Incisions1 : "",
      incisions2: values?.Incisions2 ? values?.Incisions2 : "",
      findings: values?.Findings ? values?.Findings : "",
      drains: values?.Drains ? values?.Drains : "",
      clousre: values?.Closure ? values?.Closure : "",
      sample: values?.SampleHistopathology ? values?.SampleHistopathology : "",
      complications: values?.Complications ? values?.Complications : "",
      bloodLoss: values?.BloodLoss ? values?.BloodLoss : "",
      postODiagnosi: values?.PostOperativeDiagnosis ? values?.PostOperativeDiagnosis : "",
      postOInstructions: values?.PostOperativeInstructions ? values?.PostOperativeInstructions : "",
      ports: values?.Ports ? values?.Ports : "",
      procedures: commentMessage,
      // procedures: values?.ProcedureName?.value,
      anesthesiaType: values?.Anesthesia ? values?.Anesthesia : "",
      surgeryID: data?.SurgeryID,
      surgeryName: data?.SurgeryName,
    };

    //payload pending

    const response = await OTNotesSave(payload);

    if (response?.success) {
      notify(response?.message, "success");
      BindData();
    } else {
      notify(response?.message, "error");
    }
  };

  const handlePrint = async () => {
    const TransactionID = data?.TransactionID;
    const response = await OTPrintOTNotes(TransactionID);
    if (response?.success) {
      RedirectURL(response?.data?.pdfUrl);
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    BindData();
    OTBindddlProcedureData();
  }, []);

  const handleEdit = (val, index) => {
    setValues(val)

  }

  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row px-2 pt-2">
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="PreoperativeDiagnosis"
          name="PreoperativeDiagnosis"
          value={
            values?.PreoperativeDiagnosis ? values?.PreoperativeDiagnosis : ""
          }
          onChange={handleChange}
          lable={t("Pre operative Diagnosis")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="PostOperativeDiagnosis"
          name="PostOperativeDiagnosis"
          value={
            values?.PostOperativeDiagnosis ? values?.PostOperativeDiagnosis : ""
          }
          onChange={handleChange}
          lable={t("Post Operative Diagnosis")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="Operation"
          name="Operation"
          value={values?.Operation ? values?.Operation : ""}
          onChange={handleChange}
          lable={t("Operation")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Incisions 1")}
          placeholder=" "
          name="Incisions1"
          onChange={(e) => handleInputChange(e, 0, "Incisions1")}
          value={values?.Incisions1}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Incisions 2")}
          placeholder=" "
          name="Incisions2"
          onChange={(e) => handleInputChange(e, 0, "Incisions2")}
          value={values?.Incisions2}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Ports")}
          placeholder=" "
          name="Ports"
          onChange={(e) => handleInputChange(e, 0, "Ports")}
          value={values?.Ports}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Anesthesia")}
          placeholder=" "
          name="Anesthesia"
          onChange={(e) => handleInputChange(e, 0, "Anesthesia")}
          value={values?.Anesthesia}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="Findings"
          name="Findings"
          value={values?.Findings ? values?.Findings : ""}
          onChange={handleChange}
          lable={t("Findings")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="Drains"
          name="Drains"
          value={values?.Drains ? values?.Drains : ""}
          onChange={handleChange}
          lable={t("Drains")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="Closure"
          name="Closure"
          value={values?.Closure ? values?.Closure : ""}
          onChange={handleChange}
          lable={t("Closure")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="SampleHistopathology"
          name="SampleHistopathology"
          value={
            values?.SampleHistopathology ? values?.SampleHistopathology : ""
          }
          onChange={handleChange}
          lable={t("Sample (Tissue) sent for Histopathology (if any)")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="Complications"
          name="Complications"
          value={values?.Complications ? values?.Complications : ""}
          onChange={handleChange}
          lable={t("Complications (if any)")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="BloodLoss"
          name="BloodLoss"
          value={values?.BloodLoss ? values?.BloodLoss : ""}
          onChange={handleChange}
          lable={t("Blood Loss")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="PostOperativeInstructions"
          name="PostOperativeInstructions"
          value={
            values?.PostOperativeInstructions
              ? values?.PostOperativeInstructions
              : ""
          }
          onChange={handleChange}
          lable={t("Post Operative Instructions")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          rows={1}
        />
      </div>
      <Heading title={t("Procedures (if any)")} isBreadcrumb={false} />
      {console.log("values?.ProcedureName?.value", values?.ProcedureName?.value, dropDownSate?.ProcedureName)}
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Procedure Name")}
          requiredClassName={"required-fields"}
          name="ProcedureName"
          value={values?.ProcedureName?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.ProcedureName}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactQuill
          value={commentMessage}
          onChange={handleEditorVal}
          modules={modules}
          formats={formats}
          style={{
            // marginBottom: "10px",
            // height: "225px",
            backgroundClip: "#FFF",
            border: "none",
            width: "100vw",
          }}
        />
      </div>
      {/* <FullTextEditor
        value={commentMessage}
        setValue={handleEditorVal}
        EditTable={Editable}
        setEditTable={setEditable}
      /> */}
      <div className=" p-2 w-100 text-right">
        <button
          className="btn btn-sm btn-success px-3"
          onClick={() => handleSave()}
        >
          {values?.isEdit ? t("Update") : t("Save")}
        </button>
        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handlePrint}
        >
          {t("Print")}
        </button>
      </div>

      <Tables
        thead={thead}
        scrollView={"scrollView"}
        tbody={dropDownSate?.tableData?.map((ele, index) => {
          return {
            "S.No.": index + 1,
            PreoperativeDiagnosis: ele?.PreoperativeDiagnosis,
            PostOperativeDiagnosis: ele?.PostOperativeDiagnosis,
            Operation: ele?.Operation,
            Incisions1: ele?.Incisions1,
            Incisions2: ele?.Incisions2,
            Ports: ele?.Ports,
            Anesthesia: ele?.Anesthesia,
            Closure: ele?.ProcedureName?.label,
            // Findings:ele?.Findings,
            // Drains:ele?.Drains,
            // Closure:ele?.Closure,
            // SampleHistopathology:ele?.SampleHistopathology,
            // Complications:ele?.Complications,
            // BloodLoss:ele?.BloodLoss,

            edit: (
              <i className="fa fa-edit" onClick={() => handleEdit(ele, index)}></i>
            ),
          };
        })}
        style={{ maxHeight: "5vw" }}
      />
    </div>
  );
};

export default OtNotes;
