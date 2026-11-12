import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  DRDetailsApproveDischargeSummary,
  DRDetailsBindApprovalDoctor,
  DRDetailsBindDetails,
  DRDetailsLoadHeaders,
  DRDetailsLoadTemplates,
  DRDetailsPatientTemplateDelete,
  DRDetailsPrintDischargeReport,
  DRDetailsSaveDischargeSummary,
  DRDetailsTemplateChange,
  DRDetailsTemplateDelete,
} from "../../networkServices/dischargeSummaryAPI";
import {
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
} from "../../utils/utils";
import { formats, modules } from "../../utils/constant";
import ReactQuill from "react-quill";
import ColorCodingSearch from "../commonComponents/ColorCodingSearch";
import Input from "../formComponent/Input";
import Tables from "../UI/customTable";
import { Tooltip } from "primereact/tooltip";
import { RedirectURL } from "../../networkServices/PDFURL";
import { Checkbox } from "primereact/checkbox";
import FullTextEditor from "../../utils/TextEditor";

const DROPDOWN_DATA = [
  {
    label: "Update Template",
    value: "Update",
  },
  {
    label: "New Template",
    value: "New",
  },
  {
    label: "Nothing",
    value: "Nothing",
  },
];

const THEAD = [
  { name: "S.No", width: "10%", textAlign: "center" },
  { name: "Header Added", width: "80%", textAlign: "left" },
  { name: "Action", width: "10%", textAlign: "center" },
];

const DischargeReport = ({
  data,
  handleDRDetailsGetDRDetails,
  patientData,
}) => {
  const [t] = useTranslation();
  const [dropDownState, setDropDownState] = useState({
    Header: [],
    Template: [],
    ApproveDoctor: [],
  });

  const [editorValue, setEditorValue] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [checkbox, setCheckbox] = useState(0);
  const [Editable, setEditable] = useState(false)

  const [payload, setPayload] = useState({
    HeaderData: {},
    TemplateData: {},
    TemplateAction: { label: "Nothing", value: "Nothing" },
    templateName: "",
    ApproveDoctorID: {},
  });

  const [reportType, setReportType] = useState({
    label: "Discharge Summary",
    value: 1,
  });

  const printOptions = [
    { label: "Discharge Summary", value: 1 },
    { label: "Case Summary", value: 2 },
  ]
  // Handle value change
  const handleChangeInPrint = (name, selected) => {
    setReportName((prev) => ({
      ...prev,
      [name]: selected,
    }));
    console.log(`Selected ${name}:`, selected);
  };

  const handleReactChange = (name, e, callbackFunction, setObject) => {
    if (callbackFunction) {
      callbackFunction(e?.value);
    }
    if (setObject) {
      setPayload(setObject);
      return;
    }
    setPayload({ ...payload, [name]: e });
  };

  const handleChange = (value) => {
    setEditorValue(value);
  };

  const handleCheckboxChange = (e) => {
    setCheckbox(e.target.checked);
  };

  const handleDRDetailsLoadTemplates = async (TempHeaderID) => {
    try {
      const response = await DRDetailsLoadTemplates(TempHeaderID);
      if (response?.data?.length > 0) {
        const options = reactSelectOptionList(
          response.data,
          "Temp_Name",
          "Template_Value"
        );
        setDropDownState({
          ...dropDownState,
          Template: [...options]
        });

        setEditorValue(false);
      } else {
        notify(response?.message || "Template not found", "error")
        setDropDownState({
          ...dropDownState,
          Template: []
        });
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleDRDetailsTemplateChange = async (TemplateID) => {
    try {
      if (!TemplateID) {
        return;
      }
      const response = await DRDetailsTemplateChange(TemplateID);
      setEditorValue(response?.data);
      setEditable(true)
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleTemplateName = (val) => {
    const reponse = {
      Update: payload?.TemplateData?.label,
    };
    return reponse[val] ?? payload?.templateName;
  };

  const handleTemplateAction = (name, e, callback) => {
    const responsetemplateName = callback(e?.value);
    setPayload({ ...payload, [name]: e, templateName: responsetemplateName });
  };

  const handleDRDetailsLoadHeaders = async (
    department,
    DischargeName,
    transactionID
  ) => {
    if (department) {
      try {
        const [Header, ApprovalDoctor] = await Promise.all([
          DRDetailsLoadHeaders(department, DischargeName, transactionID),
          DRDetailsBindApprovalDoctor(),
        ]);
        setDropDownState({
          ...dropDownState,
          Header: handleReactSelectDropDownOptions(
            Header?.data,
            "HeaderName",
            "Header_Id"
          ),
          ApproveDoctor: handleReactSelectDropDownOptions(
            ApprovalDoctor?.data,
            "Name",
            "DoctorID"
          ),
        });

        setPayload({
          ...payload,
          ApproveDoctorID: {
            label: data?.reportHeader?.approvedDoctorName,
            value: Number(data?.reportHeader?.appDoctorID),
          },
        });
      } catch (error) {
        console.log(error, "SomeThing Went Wrong");
      }
    }
  };

  const handleDRDetailsSaveDischargeSummary = async () => {
    if (!payload?.HeaderData?.value) {
      notify("Please select Discharge Details Entries", "warn");
      return;
    }
    try {
      const requestBody = {
        headerID: Number(payload?.HeaderData?.value),
        headerText: String(payload?.HeaderData?.label),
        details: String(editorValue),
        transactionID: Number(data?.transactionID),
        templatesID: Number(payload?.TemplateData?.value ?? 0),
        templateAction: String(payload?.TemplateAction?.value),
        templateName: String(payload?.templateName),
      };

      const response = await DRDetailsSaveDischargeSummary(requestBody);
      notify(response?.message, response?.success ? "success" : "error");
      handleDRDetailsBindDetails(data?.transactionID);
      if (response?.success) {
        setPayload({
          HeaderData: {},
          TemplateData: {},
          TemplateAction: { label: "Nothing", value: "Nothing" },
          templateName: "",
        });

        setEditorValue(false);
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  console.log(payload, "payload------");





  const handleDRDetailsTemplateDelete = async (Template_ID) => {
    try {
      if (Template_ID) {
        const response = await DRDetailsTemplateDelete(Template_ID);
        notify(response?.message, response?.success ? "success" : "error");
        handleDRDetailsLoadTemplates(Template_ID);
      } else {
        notify("Please Select Template", "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    handleDRDetailsLoadHeaders(
      data?.reportHeader?.department,
      data?.reportHeader?.header,
      data?.transactionID
    );
  }, [data?.reportHeader?.department, data?.reportHeader?.header, data?.transactionID]);

  const colorCodeOfDropDown = (number) => {
    const color = {
      1: "#90ee90",
      2: "#ff0",
    };

    return color[number];
  };

  const handleFormatlabel = (name, label, rest) => {
    return (
      <div
        style={{
          backgroundColor: colorCodeOfDropDown(Number(rest?.ColorCode)),
          margin: "-8px -12px", // Adjust this to match the parent's padding
          padding: "8px 12px", // Add your own padding if needed inside the label
          boxSizing: "border-box",
        }}
      >
        {label}
      </div>
    );
  };

  const handleDRDetailsPatientTemplateDelete = async (
    transactionID,
    Header_ID
  ) => {
    try {
      const response = await DRDetailsPatientTemplateDelete(
        transactionID,
        Header_ID
      );
      notify(response?.message, response?.success ? "success" : "error");
      handleDRDetailsBindDetails(transactionID);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleEditTable = (row) => {
    console.log(row);

    setPayload({
      ...payload,
      HeaderData: {
        value: row?.Header_ID,
        label: row?.HeaderName,
      },
    });
    const updated = row?.Value ?? '';
    setEditorValue(updated);
    setEditable(true)
  };

  const handleTable = (tableData) => {
    return tableData?.map((item, index) => {
      return {
        Sno: <div className="text-center">{index + 1}</div>,
        HeaderAdded: item?.HeaderName,
        Action: (
          <div className="p-1">
            <span className="mx-1" onClick={() => handleEditTable(item)}>
              <i className="fa fa-edit" aria-hidden="true"></i>
            </span>
            <span
              className="mx-1"
              onClick={() =>
                handleDRDetailsPatientTemplateDelete(
                  data?.transactionID,
                  item?.Header_ID
                )
              }
            >
              <i className="fa fa-trash text-danger"></i>
            </span>
          </div>
        ),
      };
    });
  };

  const handleApproveButtonAndType = (type) => {
    const ButtonAndType = {
      0: {
        ButtonName: t("Approve"),
        type: "Approve",
      },
      1: {
        ButtonName: t("Not Aprrove"),
        type: "Not Approved",
      },
    };

    return ButtonAndType[[0, 1].includes(type) ? type : 0];
  };

  const handleDRDetailsApproveDischargeSummary = async () => {
    try {
      const response = await DRDetailsApproveDischargeSummary(
        payload?.ApproveDoctorID?.value,
        data?.transactionID,
        handleApproveButtonAndType(
          Number(data?.reportHeader?.isDisChargeSummaryApproved)
        )?.type
      );

      notify(response?.message, response?.success ? "success" : "error");

      if (response?.success) {
        handleDRDetailsGetDRDetails();
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleDRDetailsBindDetails = async (transactionID) => {
    // debugger
    try {
      const response = await DRDetailsBindDetails(transactionID);
      setTableData(response?.data);
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleDRDetailsPrintDischargeReport = async () => {
    try {
      console.log("dis")
      const requestBody = {
        transactionID: Number(data?.transactionID),
        status: patientData.data.status,
        reportType: "PDF",
        isEmergencyPatient: 0,
        dischargeDate: "",
        onlineHeader: "",
        testID: "",
        labType: "",
        orderBy: "",
        pHead: 0,
        IsImage: checkbox ? 1 : 0,
        Type: "",
      };
      console.log("Payloadby discharge report---:", requestBody);
      const response = await DRDetailsPrintDischargeReport(requestBody);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        console.log(response, "response ❌❌");
      } else notify(response?.message, response?.success ? "success" : "error");
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
    const requestBody = {
      transactionID: 0,
      status: "string",
      reportType: "string",
      isEmergencyPatient: 0,
      dischargeDate: "string",
      onlineHeader: "string",
      testID: "string",
      labType: "string",
      orderBy: "string",
      pHead: 0,
      IsImage: checkbox ? 1 : 0,
    };
  };

  const handleDRDetailsPrintCaseReport = async () => {
    try {
      console.log("case")
      const requestBody = {
        transactionID: Number(data?.transactionID),
        status: patientData.data.status,
        reportType: "PDF",
        isEmergencyPatient: 0,
        dischargeDate: "",
        onlineHeader: "",
        testID: "",
        labType: "",
        orderBy: "",
        pHead: 0,
        IsImage: checkbox ? 1 : 0,
        Type: "CaseSumarry",
      };
      const response = await DRDetailsPrintDischargeReport(requestBody);
      if (response?.success) RedirectURL(response?.data?.pdfUrl);
      else notify(response?.message, response?.success ? "success" : "error");
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
    const requestBody = {
      transactionID: 0,
      status: "string",
      reportType: "string",
      isEmergencyPatient: 0,
      dischargeDate: "string",
      onlineHeader: "string",
      testID: "string",
      labType: "string",
      orderBy: "string",
      IsImage: checkbox ? 1 : 0,
      Type: "CaseSumarry",
    };
    console.log("Payload -----by case summry----:", requestBody);
  };

  useEffect(() => {
    handleDRDetailsBindDetails(data?.transactionID);
  }, []);

  return (
    <>
      <div className="col-sm-10"></div>

      <div className="col-12">
        <div className="row">
          <div className="col-xl-8 p-1" style={{ border: "1px solid #e7e7e7" }}>
            <div className="row">
              <ReactSelect
                respclass={"col-lg-6 col-xl-4 col-12"}
                requiredClassName={"required-fields"}
                lable={""}
                name="HeaderData"
                value={payload?.HeaderData?.value}
                dynamicOptions={dropDownState?.Header}
                placeholderName={t("Discharge Details Entries")}
                handleChange={(name, e) =>
                  handleReactChange(name, e, handleDRDetailsLoadTemplates, {
                    ...payload,
                    [name]: e,
                    TemplateData: {},
                  })
                }
                handleFormatlabel={handleFormatlabel}
              />

              <div className="col-lg-6 col-xl-4 col-12">
                <div className="d-flex">
                  <ReactSelect
                    lable={""}
                    respclass={"w-100"}
                    name="TemplateData"
                    dynamicOptions={dropDownState?.Template}
                    placeholderName={t("Select Template")}
                    value={payload?.TemplateData ? payload?.TemplateData?.value : ''}
                    handleChange={(name, e) =>
                      handleReactChange(name, e, handleDRDetailsTemplateChange)
                    }
                    removeIsClearable={true}
                  />
                  <button
                    className="btn btn-sm btn-danger mx-2"
                    style={{ backgroundColor: "red", border: "none" }}
                    onClick={() =>
                      handleDRDetailsTemplateDelete(payload?.TemplateData?.value)
                    }
                  >
                    <Tooltip
                      target={`#delete`}
                      position="top"
                      content={"Delete Template"}
                      event="hover"
                      className="ToolTipCustom"
                    />
                    <i
                      className="fa fa-trash fs-icons"
                      aria-hidden="true"
                      id="delete"

                    ></i>
                  </button>
                </div>
              </div>

              <div className="col-lg-2  col-xl-4 col-12 mb-2">
                <div className="d-flex">
                  <ColorCodingSearch
                    label={t("Already Added")}
                    color={colorCodeOfDropDown(1)}
                  />
                  <ColorCodingSearch
                    label={t("Mandatory Header")}
                    color={colorCodeOfDropDown(2)}
                  />
                </div>
              </div>
            </div>
            {/* <ReactQuill
              value={editorValue}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              style={{
                marginBottom: "10px",
              }}
            /> */}
            <FullTextEditor
              value={editorValue}
              // value={getTest}
              setValue={handleChange}
              EditTable={Editable}
              setEditTable={setEditable}
            />
            <div className="col-12">
              <div className="row flex-row-reverse pt-1">
                <div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleDRDetailsSaveDischargeSummary}
                  >
                    {t("Add Details")}
                  </button>
                </div>
                <Input
                  type={"text"}
                  respclass="col-xl-2 col-md-3 col-sm-4 col-4"
                  className="form-control"
                  lable={t("Temp. Name")}
                  value={payload?.templateName}
                  name={"templateName"}
                  disabled={
                    ["New"].includes(payload?.TemplateAction?.value)
                      ? false
                      : true
                  }
                  onChange={handleInputChange}
                />

                <ReactSelect
                  respclass="col-xl-2 col-md-3 col-sm-4 col-4"
                  lable={""}
                  name="TemplateAction"
                  value={payload?.TemplateAction?.value}
                  dynamicOptions={DROPDOWN_DATA}
                  removeIsClearable={true}
                  placeholderName={t("Template Action")}
                  handleChange={(name, e) =>
                    handleTemplateAction(name, e, handleTemplateName)
                  }
                />
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="col-12">
              <div className="d-flex mt-2">
                <ReactSelect
                  dynamicOptions={dropDownState?.ApproveDoctor}
                  lable={""}
                  respclass={"w-100"}
                  requiredClassName={"required-fields"}
                  name="ApproveDoctorID"
                  value={payload?.ApproveDoctorID?.value}
                  placeholderName={t("Approve Doctor")}
                  handleChange={(name, e) => handleReactChange(name, e)}
                />
                <button
                  className="btn btn-sm btn-primary mx-2"
                  onClick={handleDRDetailsApproveDischargeSummary}
                  style={{ zIndex: "999999999" }}
                >
                  {
                    handleApproveButtonAndType(
                      Number(data?.reportHeader?.isDisChargeSummaryApproved)
                    )?.ButtonName
                  }
                </button>

                <ReactSelect
                  lable={""}
                  respclass={"w-100"}
                  dynamicOptions={[

                    ...handleReactSelectDropDownOptions(printOptions, "label", "value")]}
                  name="reportType"
                  value={reportType?.value}
                  handleChange={(name, val) => {
                    setReportType({
                      label: val?.label,
                      value: val?.value
                    })

                  }}
                />


                <button
                  className="btn btn-sm btn-primary ml-2"
                  style={{ zIndex: "999999999" }}
                  onClick={
                    () => {

                      reportType?.value === 1
                        ? handleDRDetailsPrintDischargeReport()
                        : handleDRDetailsPrintCaseReport()

                    }
                  }


                >
                  {t("Print")}
                </button>
              </div>
              <span>
                <label
                  className="d-flex align-items-center ml-3"
                  style={{ cursor: "pointer" }}
                >
                  <Checkbox
                    id="checkbox"
                    className="mt-2"
                    name="checkbox"
                    onChange={handleCheckboxChange}
                    checked={checkbox}
                  />
                  {t("Required logo on report")}
                </label>
              </span>
            </div>

            <Tables thead={THEAD} tbody={handleTable(tableData)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DischargeReport;
