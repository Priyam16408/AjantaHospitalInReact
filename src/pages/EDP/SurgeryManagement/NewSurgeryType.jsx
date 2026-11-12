import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import {
  EDPSaveSurgeryType,
  EDPSearchSurgeryType,
  EDPUpdateSurgeryType,
} from "../../../networkServices/EDP/edpApi";
import { notify } from "../../../utils/utils";
import { UpdateSVG } from "../../../components/SvgIcons";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import CustomSelect from "../../../components/formComponent/CustomSelect";

const NewSurgeryType = ({data}) => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");

  console.log("ip", ip);

  const initialState = {
    SurgeryTypeName: "",
  };

  const THEAD = [
    { name: "S.No.", width: "3%" },
    { name: "Type Name" },
    { name: "Min Limit" },
    { name: "Basic Item For Calculating Surgery Amt" },
    { name: "Is This Doctor" },
    { name: "Description" },
    { name: "Edit" },
  ];

  const [values, setValues] = useState();
  console.log("firstfirstfirst", values);
  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSave = async () => {
    const payload = {
      surgeryTypeName: values?.SurgeryTypeName || "",
      shareInTotalSurgery: values?.ShareInTotalSurgery || 0,
      // sequenceNumber: values?.SequenceNumber || 0,
      ipAddress: String(ip),
      description: values?.SequenceNumber || "",
      baseItem: values?.BaseItem || 0,
      bindDoctor: values?.IsthisDoctor?.value || 0,
    };

    const response = await EDPSaveSurgeryType(payload);

    if (response?.success) {
      notify(response?.message, "success");
      EDPSearchSurgeryTypeAPI(); // Refresh the table after successful save
      setValues({}); // Reset form
    } else {
      notify(response?.message, "error");
    }
  };

  const EDPSearchSurgeryTypeAPI = async () => {
    const response = await EDPSearchSurgeryType();
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleUpdate = async (ele, index) => {
    console.log("Updating row:", ele);

    const payload = {
      name: ele?.TypeName || "",
      minLimit: ele?.MinLimit || 0,
      baseItem: ele?.BaseItem || 0,
      bindDoctor: ele?.IsSurgery || 0,
      description: ele?.Description || "",
      itemID: String(ele?.ItemID),
      ipAddress: String(ip),
    };

    console.log("payload while saving ", payload);

    const response = await EDPUpdateSurgeryType(payload);

    if (response?.success) {
      notify(response?.message, "success");
      EDPSearchSurgeryTypeAPI();
      setValues({});
    } else {
      notify(response?.message, "error");
    }
  };

  const handleCustomInput = (index, name, e, ele) => {
    // 
    const data = [...tableData];
    data[index][name] = e ? e : e.value;
    setTableData(data);
  };

  const handleCustomSelect = (index, name, value) => {

    const lableList = JSON.parse(JSON.stringify(tableData));
    lableList[index][name] = value;
    setTableData(lableList);
  };
  const handleCustomReactSelect = (index, name, value) => {
    const lableList = JSON.parse(JSON.stringify(tableData));
    lableList[index][name] = value?.value;
    setTableData(lableList);
  };

  useEffect(() => {
    EDPSearchSurgeryTypeAPI();
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
      <div className="px-2 row pt-2">
        <Input
          type="SurgeryTypeName"
          className={"form-control required-fields"}
          lable={t("Surgery Type Name")}
          placeholder=" "
          //   id="ItemName"
          name="SurgeryTypeName"
          onChange={(e) => handleInputChange(e, 0, "SurgeryTypeName")}
          value={values?.SurgeryTypeName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="Share In Total Surgery"
          className={"form-control required-fields"}
          lable={t("Share In Total Surgery")}
          placeholder=" "
          //   id="ItemName"
          name="ShareInTotalSurgery"
          onChange={(e) => handleInputChange(e, 0, "ShareInTotalSurgery")}
          value={values?.ShareInTotalSurgery}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="Sequence Number"
          className={"form-control required-fields"}
          lable={t("SequenceNumber")}
          placeholder=" "
          //   id="ItemName"
          name="SequenceNumber"
          onChange={(e) => handleInputChange(e, 0, "SequenceNumber")}
          value={values?.SequenceNumber}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is this Doctor")}
          name="IsthisDoctor"
          value={values?.IsthisDoctor?.value}
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
          onClick={handleSave}
        >
          {values?.isEdit === 1 ? t("Update") : t("Save")}
        </button>
      </div>
      <div className="">
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            TypeName: (
              <Input
                type="text"
                className={"table-input required-fields"}
                // lable={t("Description")}
                placeholder=" "
                name="TypeName"
                onChange={(e) =>
                  handleCustomInput(index, "TypeName", e.target.value, ele)
                }
                value={ele?.TypeName}
                required={true}
                respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              />
            ),
            MinLimit: ele?.MinLimit,
            BasicItem: (
              <CustomSelect
                option={[
                  { label: "Yes", value: "1" },
                  { label: "No", value: "0" },
                ]}
                placeHolder={t("Basic Item")}
                value={ele?.IsSurgery === 1 ? "1" : "0"}
                // value={"0"}
                isRemoveSearchable={true}
                name="IsSurgery"
                onChange={(name, e) => handleCustomReactSelect(index, name, e)}
              />
            ),
            isDoctor: (
              <CustomSelect
                isRemoveSearchable={true}
                option={[
                  { label: "Yes", value: "1" },
                  { label: "No", value: "0" },
                ]}
                placeHolder={t("Is this Doctor")}
                value={ele?.IsthisDoctor?.value}
                name="IsthisDoctor"
                onChange={(name, e) => handleCustomSelect(index, name, e)}
              />
            ), //PENDING
            Description: (
              <Input
                type="text"
                className={"table-input required-fields"}
                // lable={t("Description")}
                placeholder=" "
                name="Description"
                onChange={(e) =>
                  handleCustomInput(index, "Description", e.target.value, ele)
                }
                value={ele?.Description}
                required={true}
                respclass="col-xl-12 col-md-4 col-sm-6 col-12"
              />
            ),
            edit: (
              <div onClick={() => handleUpdate(ele, index)}>
                <UpdateSVG />
              </div>
            ),
          }))}
          style={{ maxHeight: "65vh" }}
        />
      </div>
    </div>
  );
};

export default NewSurgeryType;
