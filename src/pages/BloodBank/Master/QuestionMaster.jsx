import React, { useEffect, useState } from "react";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import {
  BBBindQuestion,
  BBSaveQuestion,
  BBUpdateQuestion,
  BBValidateQuestion,
} from "../../../networkServices/BloodBank/BloodBank";
import { notify } from "../../../utils/ustil2";

const QuestionMaster = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({});
  const [tableData, setTableData] = useState([]);

  const thead = [
    { name: t("S.No"), width: "1%" },
    { name: t("Question") },
    { name: t("Type") },
    { name: t("Edit") },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };
  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const tableResponse = async () => {
    const response = await BBBindQuestion();
    if (response?.success) {
      setTableData(response?.data);
    } else {
      setTableData([]);
    }
  };

  const handleSave = async () => {
    if (!values?.Question) {
      notify("error", "Please enter question");
      return;
    }

    const payload = {
      id: 0,
      question: values?.Question,
      type: values?.Status?.value,
      isActive: values?.Active?.value,
      flag: values?.selected?.value === "1" ? 1 : 0,
    };

    const response = await BBSaveQuestion(payload);
    if (response?.success) {
      notify("success", response?.message);
      setValues({});
      tableResponse();
    } else {
      notify("error", response?.message);
    }
  };

  const handleEdit = (data) => {
    setValues({
      id: data?.Id,
      isEdit: 1,
      Question: data?.Question,
      Status: {
        value: data?.Type === "Text" ? "t" : "r",
        label: data?.Type === "Text" ? "Text" : "Radio",
      },
      Active: {
        value: data?.IsActive ? "1" : "0",
        label: data?.IsActive ? "Yes" : "No",
      },
      selected: {
        value: data?.flag ? "1" : "0",
        label: data?.flag ? "True" : "False",
      },
    });
  };

  const handleUpdate = async () => {
    const payload = {
      id: values?.id || 0,
      question: values?.Question,
      type: values?.Status?.value,
      isActive: values?.Active?.value,
    };
    const response = await BBUpdateQuestion(payload);
    if (response?.success) {
      notify("success", response?.message);
      tableResponse();
      setValues({});
    } else {
      tableResponse();

      notify("error", response?.message);
    }
  };

  useEffect(() => {
    tableResponse();
  }, []);
  return (
    <div className="card">
      <Heading title={t("Question Master")} isBreadcrumb={true} />
      <div className="row p-2">
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="Question"
          name="Question"
          value={values?.Question ? values?.Question : ""}
          onChange={handleChange}
          lable={t("Question")}
          placeholder=" "
          respclass="col-xl-5 col-md-4 col-sm-6 col-12"
          rows={1}
        />
        <ReactSelect
          placeholderName={t("Status")}
          name="Status"
          value={values?.Status?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Radio", value: "r" },
            { label: "Text", value: "t" },
          ]}
          searchable={true}
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Active")}
          name="Active"
          value={values?.Active?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is Selected")}
          name="selected"
          value={values?.selected?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "True", value: "1" },
            { label: "False", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className="btn btn-sm btn-success"
          onClick={values?.isEdit === 1 ? handleUpdate : handleSave}
        >
          {values?.isEdit === 1 ? t("Update") : t("Save")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <div>
          <Heading title={t("Question List")} isBreadcrumb={false} />
          <Tables
            thead={thead}
            tbody={tableData?.map((ele, index) => {
              return {
                SrNo: index + 1,
                Question: ele?.Question,
                Type: ele?.Type,
                Edit: (
                  <i
                    onClick={() => handleEdit(ele)}
                    className="fa fa-edit"
                    aria-hidden="true"
                  ></i>
                ),
              };
            })}
          />
        </div>
      )}
    </div>
  );
};

export default QuestionMaster;
