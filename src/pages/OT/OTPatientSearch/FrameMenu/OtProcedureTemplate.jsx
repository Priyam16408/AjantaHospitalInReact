import React, { useEffect, useState } from "react";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import { formats, modules } from "../../../../utils/constant";
import ReactQuill from "react-quill";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import {
  OTADelete,
  OTAEdit,
  OTLoadTemplates,
  OTOPProcedureFillGrid,
  OTOPProcedureTemplateSave,
  OTOPProcedureTemplateUpdate,
} from "../../../../networkServices/OT/otAPI";
import { notify } from "../../../../utils/ustil2";
import Input from "../../../../components/formComponent/Input";
import FullTextEditor from "../../../../utils/TextEditor";

const OtProcedureTemplate = () => {
  const [t] = useTranslation();

  const initialValues = {
    Header: { label: "Procedure", value: "Procedure" },
  };
  const [clear, setClear] = useState(false)
  const [values, setValues] = useState({ ...initialValues });
  const [dropDownSate, setDropDownSate] = useState({});
  const [commentMessage, setCommentMessage] = useState("");
  const [testList, setTestList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [Editable, setEditable] = useState(true)

  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Header Added" },
    { name: "Edit", width: "1%" },
    { name: "Delete", width: "1%" },
  ];

  const handleReactSelect = (name, value) => {
    if(name==="Template"){
      handleEdit({ID:value?.value})
    }
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleEditorVal = (value) => {
    setCommentMessage(value);
    const finalData = [...testList];
    setTestList(finalData);
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  //API CALL FOR HEADER
  const Header = async () => {
    const response = await API();

    if (response?.success) {
      setDropDownSate((val) => ({
        ...val,
        Header: handleReactSelectDropDownOptions(response?.data, "NAME", "ID"),
      }));
    } else {
      notify(response?.message, "error");
    }
  };

  //API CALL FOR TEMPLATE
  const TemplateData = async () => {
    const payload = {
      TempHeaderName: values?.Header?.value,
    };
    const response = await OTLoadTemplates(payload?.TempHeaderName);

    if (response?.success) {
      setDropDownSate((val) => ({
        ...val,
        Template: handleReactSelectDropDownOptions(
          response?.data,
          "Temp_Name",
          "ID"
        ),
      }));
    } else {
      // notify(response?.message, "error");
    }
  };

  const gridData = async (first = false) => {
    const response = await OTOPProcedureFillGrid();
    if (response?.success) {
      setTableData(response?.data);
      if (first && response?.data?.length > 0) {
        handleEdit(response?.data[0])
      }
    } else {
      // notify(response?.message, "error");
    }
  };

  const handleDelete = async (ele) => {
    const response = await OTADelete(ele?.ID);
    if (response?.success) {
      notify(response?.message, "success");
      gridData();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleEdit = async (ele, index) => {
    const value = ele?.ID;
    const response = await OTAEdit(value);
    if (response?.success) {
      setEditable(true)
      setValues((val) => ({
        ...val,
        Template: {
          value: response?.data?.ID,
          label: response?.data?.Temp_Name,
        },
        isEdit: 1,
      }));
      setCommentMessage(response?.data?.Template_Value);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSave = async () => {
    const payload = {
      tempHeader: values?.TemplateHeader,
      detail: commentMessage,
      header: values?.Header?.value,
    };

    const response = await OTOPProcedureTemplateSave(payload);

    if (response?.success) {
      notify(response?.message, "success");
      gridData()
      setValues((val) => ({ ...val, TemplateHeader: "" }))
      setCommentMessage("");
      TemplateData();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleUpdate = async () => {
    const payload = {
      id: values?.Template?.value,
      detail: commentMessage,
    };

    const response = await OTOPProcedureTemplateUpdate(payload);
    if (response?.success) {
      notify(response?.message, "success");
      TemplateData();
      setCommentMessage("");
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    if (values?.Header?.value) {
      TemplateData();
    }
  }, [values?.Header?.value]);

  useEffect(() => {
    gridData(true);
  }, []);




  return (
    <div className="card">
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Header")}
          requiredClassName={"required-fields"}
          name="Header"
          value={values?.Header?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            {
              label: "Procedure",
              value: "Procedure",
            },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Template")}
          requiredClassName={"required-fields"}
          name="Template"
          value={values?.Template?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.Template}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {values?.isEdit !== 1 && (
          <Input
            type="text"
            className={"form-control required-fields"}
            lable={t("Template Header")}
            placeholder=" "
            name="TemplateHeader"
            onChange={(e) => handleInputChange(e, 0, "TemplateHeader")}
            value={values?.TemplateHeader}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        <button className="btn btn-sm btn-success px-3" onClick={() => {
            setClear(true)
              setCommentMessage("");
              setValues((val) => ({
                ...val,
                isEdit: 0,
                Header: { label: "Procedure", value: "Procedure" },
                Template: "",
                TemplateHeader: "",
              }));
        }}>
          {t("Add New Procedure")}
        </button>
      </div>
      <Heading title={t("Template text")} />
      <div>

        <FullTextEditor
          value={commentMessage}
          // value={getTest}
          clear={clear}
          setValue={handleEditorVal}
          EditTable={Editable}
          setEditTable={setEditable}
        />
        <div className="ml-2 mr-2 mb-2 mt-2 d-flex justify-content-end">
          <button
            className="btn btn-sm btn-success px-3"
            onClick={values?.isEdit === 1 ? handleUpdate : handleSave}
          >
            {values?.isEdit === 1 ? t("Update") : t("Save")}
          </button>
          <button
            className="ml-2 btn btn-sm btn-success px-3"
            onClick={() => {
              setClear(true)
              setCommentMessage("");

            }}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>

      {tableData?.length > 0 && (
        <div>
          <Heading title={t("Procedure Details List ")} />
          <Tables
            thead={THEAD}
            tbody={tableData?.map((ele, index) => ({
              Sno: index + 1,
              Header: ele?.HeaderName,
              edit: (
                <div
                  onClick={() => handleEdit(ele, index)}
                  className="fa fa-edit"
                ></div>
              ),
              delete: (
                <div
                  className="fa fa-trash text-danger"
                  onClick={() => handleDelete(ele)}
                ></div>
              ),
            }))}
            style={{ maxHeight: "25vh" }}
          />
        </div>
      )}
    </div>
  );
};

export default OtProcedureTemplate;
