import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import { getBindCountryList } from "../../../networkServices/ReportsAPI";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import {
  EDPLoadLocationDetail,
  EDPSaveLocation,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/ustil2";

const LocationMaster = ({ data }) => {
  const [t] = useTranslation();

  const initialPayload = {
    IsActive: { label: "No", value: "0" },
    Location: "",
    Description: "",
  };

  const THEAD = [
    { name: "S.No", width: "1%" },
    { name: "Location Name" },
    { name: "Description Name" },
    { name: "Active Status" },
    { name: "Created Detail" },
    { name: "Updated Detail" },
    { name: "Edit" },
  ];

  const [values, setValues] = useState({ ...initialPayload });
  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);
  console.log("values", values);
  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSave = async () => {
    if (!values?.Location && !values?.Description) {
      notify("Please enter required Fields", "error");
      return;
    }
    const payload = {
      locationID: values?.LocationID,
      locationName: values?.Location,
      description: values?.Description,
      isActive: values?.IsActive?.value,
    };

    const response = await EDPSaveLocation(payload);

    if (response?.success) {
      notify(response?.message, "success");
      locationTableData();
      setValues(initialPayload);
    } else {
      notify(response?.message, "error");
    }
  };

  const locationTableData = async () => {
    const response = await EDPLoadLocationDetail();
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleEdit = (ele) => {
    console.log("Ele", ele);

    setValues({
      ...initialPayload, // Reset to default values
      Location: ele?.LocationName || "",
      Description: ele?.Description,
      LocationID: ele?.LocationID,
      CreatedDetail: ele?.CreatedDetail,
      UpdatedDetail: ele?.UpdatedDetail,
      ActiveStatus: ele?.ActiveStatus,
      IsActive:
        ele?.IsActive === 1
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
    });
  };

  useEffect(() => {
    locationTableData();
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
          lable={t("Location")}
          placeholder=" "
          //   id="ItemName"
          name="Location"
          onChange={(e) => handleInputChange(e, 0, "Location")}
          value={values?.Location}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Description")}
          placeholder=" "
          //   id="ItemName"
          name="Description"
          onChange={(e) => handleInputChange(e, 0, "Description")}
          value={values?.Description}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Is Active")}
          name="IsActive"
          value={values?.IsActive?.value}
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
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={() => {
            setValues(initialPayload);
          }}
        >
          {t("Reset")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, i) => {
            return {
              Sno: i + 1,
              LocationName: ele?.LocationName,
              Description: ele?.Description,
              ActiveStatus: ele?.ActiveStatus,
              CreatedDetail: ele?.CreatedDetail,
              UpdateDetail: ele?.UpdatedDetail,
              Edit: (
                <div
                  onClick={() => handleEdit(ele)}
                  className="fa fa-edit"
                ></div>
              ),
            };
          })}
        />
      )}
    </div>
  );
};

export default LocationMaster;
