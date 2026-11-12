import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import {
  EDPSaveMessage,
  EDPSearchMessage,
  EDPUpdateMessage,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const WelcomeMessage = ({ data }) => {
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const THEAD = [
    { name: "S.No." },
    { name: "Message" },
    { name: "Current" },
    { name: "CreatedBy" },
    { name: "CreatedDate" },
    { name: "Edit" },
  ];
  const initialValues = {
    WelcomeMessage: "",
    IsCurrent: {
      label: "",
      value: "",
    },
  };
  const [values, setValues] = useState({ ...initialValues });
  console.log("values ", values);
  const [tableData, setTableData] = useState([]);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleEdit = (ele) => {
    // ;
    console.log("Ele", ele);

    setValues({
      ...initialValues, // Reset to default values
      WelcomeMessage: ele.Message || "",
      ID: ele?.ID,
      IsCurrent:
        ele?.Current === "Yes"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
    });
  };

  const searchMessage = async () => {
    const response = await EDPSearchMessage();

    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleUpdate = async () => {
    console.log("values ", values);
    // ;
    const payloadToBe = {
      message: values?.WelcomeMessage,
      active: values?.IsCurrent?.value,
      ipaddress: ip,
      id: values?.ID,
    };

    const response = await EDPUpdateMessage(payloadToBe);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      searchMessage();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSave = async () => {
    console.log("values ", values);
    // ;
    const payloadToBe = {
      message: values?.WelcomeMessage,
      active: values?.IsCurrent?.value,
      ipaddress: ip,
    };

    const response = await EDPSaveMessage(payloadToBe);

    if (response?.success) {
      notify(response?.message, "success");
      searchMessage();
      setValues(initialValues);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    searchMessage();
  }, []);
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Welcome Message")}
          placeholder=" "
          name="WelcomeMessage"
          onChange={(e) => handleInputChange(e, 0, "WelcomeMessage")}
          value={values?.WelcomeMessage}
          required={true}
          respclass="col-xl-6 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is Current")}
          name="IsCurrent"
          value={values?.IsCurrent?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={values?.isEdit == 1 ? handleUpdate : handleSave}
        >
          {values?.isEdit == 1 ? t("Update") : t("Save")}
        </button>
      </div>
      <div>
        <Heading title={"Results"} isBreadcrumb={false} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            Message: ele?.Message,
            Current: ele?.Current,
            CreatedBy: ele?.CreatedBy,
            CreatedDate: ele?.CreatedDate,
            Edit: (
              <div className="fa fa-edit" onClick={() => handleEdit(ele)}></div>
            ),
          }))}
        />
      </div>
    </div>
  );
};

export default WelcomeMessage;
