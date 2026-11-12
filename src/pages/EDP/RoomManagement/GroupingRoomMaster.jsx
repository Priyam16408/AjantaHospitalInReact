import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { GetDepartment } from "../../../networkServices/BillingsApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { RoomBindCentre } from "../../../networkServices/EDP/pragyaedp";

export default function GroupingRoomMaster({ handleChangeModel, inputData }) {
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);
  const [deparmentData, setDepartmentData] = useState([]);
  const handlechange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const handleSelect = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const [bindCentre, setBindCentre] = useState([]);

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);

  const StatusOptions = [
    { label: "yes", value: "1" },
    { label: "no", value: "0" },
  ];

  const [tableData, setTableData] = useState([]);
  const handleDepartmentDropdown = async () => {
    try {
      const apiResp = await GetDepartment();
      if (apiResp.success) {
        setDepartmentData(apiResp?.data);
        console.log("the data from search", apiResp);
      } else {
        notify(apiResp?.message, "error");
        // setLoadSurgeryData([]);
      }
    } catch (error) {
      console.error("Error loading surgery data:", error);
      notify("An error occurred while loading surgery data", "error");
    }
  };

  const handleBindSelectCentre = async () => {
    try {
      const apiResp = await RoomBindCentre();
      if (apiResp.success) {
        setBindCentre(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
        console.log("error in response:", apiResp);
      }
    } catch (error) {
      console.error("Error loading centre data:", error);
      notify("An error occurred while loading centre data", "error");
    }
  };

  useEffect(() => {
    handleDepartmentDropdown();
    handleBindSelectCentre();
  }, []);
  return (
    <>
      <div className="row p-2 w-200">
        <Input
          lable={t("Room Type")}
          className="form-control required-fields"
          id="addnew"
          rows={4}
          respclass="w-100"
          name="addnew"
          value={inputs?.addnew ? inputs?.addnew : ""}
          onChange={handlechange}
          maxLength={1000}
        />

        <TextAreaInput
          lable={t("Description")}
          className="form-control"
          id="description"
          rows={4}
          respclass="w-100"
          name="description"
          value={inputs?.description ? inputs?.description : ""}
          onChange={handlechange}
          // maxLength={1000}
        />

        <ReactSelect
          placeholderName={t("Department")}
          id={"department"}
          searchable={true}
          removeIsClearable={true}
          respclass="w-100"
            dynamicOptions={[
            { value: "0", label: "ALL" },
            ...handleReactSelectDropDownOptions(deparmentData, "Name", "ID"),
          ]}
          handleChange={handleSelect}
          value={`${inputs?.department?.value}`}
          name={"department"}
        />

        <ReactSelect
          placeholderName={t("Billing Category")}
          searchable={true}
          respclass="w-100"
          id="billingCategory"
          className="form-control required-fields"
          name="billingCategory"
          removeIsClearable={true}
          dynamicOptions={StatusOptions}
          value={inputs?.billingCategory?.value}
        />

        <ReactSelect
          placeholderName={t("Center Name")}
          removeIsClearable={true}
          name="centerName"
          value={inputs?.centerName?.value}
          handleChange={handleSelect}
          dynamicOptions={[
            ...handleReactSelectDropDownOptions(
              bindCentre,
              "CentreName",
              "CentreID"
            ),
          ]}
          searchable={true}
          // respclass="col-xl-2 col-md-4 col-sm-6 col-12" 
          respclass="w-100"
        />
      </div>
    </>
  );
}
