import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactQuill from "react-quill";
import { formats, modules } from "../../../utils/constant";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import {
  EDPBindColumnField,
  EDPBindEmailId,
  EDPBindPanel,
  EDPBindRole,
  EDPEmailBindTemplate,
} from "../../../networkServices/EDP/govindedp";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import FullTextEditor from "../../../utils/TextEditor";

const ManageEmailBodyMaster = ({ data }) => {
  const [t] = useTranslation();

  const [values, setValues] = useState({});
  const [commentMessage, setCommentMessage] = useState("");
  console.log("commentMessage", commentMessage);
  const [testList, setTestList] = useState([]);
  console.log("Values", values);
  const [index, setIndex] = useState(null);
  const [dropDownState, setDropDownState] = useState({
    Panel: [],
  });
  const [selectedColumns, setSelectedColumns] = useState([]);
  console.log("SelectedColumns", selectedColumns);

    const [Editable, setEditable] = useState(false) 

  const handleCheckboxChange = (e, column) => {
    if (e.target.checked) {
      setSelectedColumns((prev) => [...prev, column]);

      setCommentMessage(
        (prev) =>
          prev +
          `<span style="display:inline-block; margin-right:10px;">{${column?.FieldText}}</span>`
      );
    } else {
      setSelectedColumns((prev) => prev.filter((col) => col !== column));
      // Optional: Also remove that field from the commentMessage string
    }
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleReactSelect = (label, value) => {
    // 
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    // 
    setValues({ ...values, [name]: selectedOptions });
  };

  const handleEditorVal = (value) => {
    // ;
    setCommentMessage(value);
    const finalData = [...testList];
    // finalData[index]["description"] = value;
    setTestList(finalData);
  };

  const bindPanelData = async () => {
    const response = await EDPBindPanel();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Panel: handleReactSelectDropDownOptions(
          response?.data,
          "PanelName", // Ensure it matches API response
          "PanelID"
        ),
      }));
    }
  };
  const EDPBindRoleAPI = async () => {
    const response = await EDPBindRole();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Role: handleReactSelectDropDownOptions(
          response?.data,
          "RoleName", // Ensure it matches API response
          "ID"
        ),
      }));
    }
  };

  const bindTemplateData = async () => {
    const templateID = values?.TemplateType?.value;
    const response = await EDPBindPanel(templateID);

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        TemplateType: handleReactSelectDropDownOptions(
          response?.data,
          "PanelName", // Ensure it matches API response
          "PanelID"
        ),
      }));
    }
  };
  const bindTemplateTypeData = async () => {
    const response = await EDPEmailBindTemplate();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Template: handleReactSelectDropDownOptions(
          response?.data,
          "PanelName", // Ensure it matches API response
          "PanelID"
        ),
      }));
    }
  };
  const EDPBindEmailIdAPI = async () => {
    const id = values?.Email?.value ? values?.Email?.value : 0;
    const response = await EDPBindEmailId(id);

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Email: handleReactSelectDropDownOptions(
          response?.data,
          "PanelName", // Ensure it matches API response
          "PanelID"
        ),
      }));
    }
  };

  const bindColumnField = async () => {
    const response = await EDPBindColumnField();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        ColumnField: handleReactSelectDropDownOptions(
          response?.data,
          "FieldValue", // Ensure it matches API response
          "ID"
        ),
      }));
    }
  };

  useEffect(() => {
    // bindPanelData();
    bindTemplateTypeData();
    EDPBindRoleAPI();
    bindColumnField();
    EDPBindEmailIdAPI();
  }, []);

  useEffect(() => {
    bindTemplateData();
  }, [values?.TemplateType?.value]);
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        data={data}
        isBreadcrumb={true}
        isSlideScreen={false}
      />
      <div className="row p-2">
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Department")}
          name="Department"
          value={values?.Department?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Role}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Template Type")}
          name="TemplateType"
          value={values?.TemplateType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Template}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("From Email")}
          name="FromEmail"
          value={values?.FromEmail?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Email}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Email Subject")}
          placeholder=" "
          //   id="ItemName"
          name="EmailSubject"
          onChange={(e) => handleInputChange(e, 0, "EmailSubject")}
          value={values?.EmailSubject}
          required={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control"}
          lable={t("Error Notify Email")}
          placeholder=" "
          //   id="ItemName"
          name="ErrorNotifyEmail"
          onChange={(e) => handleInputChange(e, 0, "ErrorNotifyEmail")}
          value={values?.ErrorNotifyEmail}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
      </div>

      <Heading title={t("Email Body")} />
      <div className="row p-2">
        {/* <ReactQuill
          value={commentMessage}
          onChange={handleEditorVal}
          modules={modules}
          formats={formats}
          style={{
            marginBottom: "10px",
            height: "225px",
            backgroundClip: "#FFF",
            width: "80%",
          }}
        /> */}

         <FullTextEditor
                    value={commentMessage}
                    // value={getTest}
                    setValue={handleEditorVal}
                    EditTable={Editable}
                    setEditTable={setEditable}
                  />
        <div
          className="col"
          style={{ maxHeight: "250px", overflowY: "scroll" }}
        >
          <h1>{t("Column Fields")}</h1>
          {dropDownState?.ColumnField !== undefined &&
            dropDownState?.ColumnField?.map((ele, index) => (
              <div key={index}>
                <label className="">
                  <input
                    type="checkbox"
                    className="ml-2 mr-2"
                    // value={ele?.FieldText}
                    onChange={(e) => handleCheckboxChange(e, ele)}
                    checked={false}
                    // checked={selectedColumns.includes(ele)} // example state check
                  />
                  {ele?.FieldText}
                </label>
              </div>
            ))}
        </div>
      </div>
      <Heading title={t("Store Procedure")} />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Store Procedure Name")}
          placeholder=" "
          //   id="ItemName"
          name="StoreProcedureName"
          onChange={(e) => handleInputChange(e, 0, "StoreProcedureName")}
          value={values?.StoreProcedureName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Report Name")}
          placeholder=" "
          //   id="ItemName"
          name="ReportName"
          onChange={(e) => handleInputChange(e, 0, "ReportName")}
          value={values?.ReportName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Attachment Type")}
          name="AttachmentType"
          value={values?.AttachmentType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Active", value: "1" },
            { label: "Inactive", value: "0" },
          ]}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Include Centre Header")}
          name="AttachmentType"
          value={values?.AttachmentType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="Description"
          name="Description"
          value={values?.Description ? values?.Description : ""}
          onChange={handleChange}
          lable={t("Description")}
          placeholder=" "
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <div className="d-flex justify-content-end w-100">
          <button className="btn btn-sm btn-success mx-2" type="button">
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageEmailBodyMaster;
