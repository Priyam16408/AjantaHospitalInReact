import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  DietBindDetails,
  SaveDietType,
  UpdateDietType,
} from "../../../networkServices/EDP/pragyaedp";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/ustil2";

const DietTypeMaster = () => {
  const [t] = useTranslation();

  const initialValue = {
    DietType: "",
    Description: "",
    MinimumComponent: "",
    MaximumComponent: "",
    Status: { label: "Yes", value: "1" },
    id: "",
  };

  const [values, setValues] = useState({ ...initialValue });
  const [roommasterSearchData, setRoomMasterSearchData] = useState([]);
  const [showbtn, setSHowBtn] = useState(true);
  const [ID, setId] = useState("");

  const StatusOptions = [
    { label: "YES", value: "1" },
    { label: "NO", value: "0" },
  ];

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const TheadSearchTable = [
    { width: "5%", name: t("SNo") },
    { width: "25%", name: t("Diet Name") },
    { width: "25%", name: t("Description") },
    { width: "15%", name: t("Min. Range") },
    { width: "15%", name: t("Max. Range") },
    { width: "10%", name: t("Active") },
    { width: "5%", name: t("Edit") },
  ];

  const handleDietBindTable = async () => {
    try {
      const apiResp = await DietBindDetails();
      if (apiResp.success) {
        setRoomMasterSearchData(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error loading diet data:", error);
      notify("An error occurred while loading diet data", "error");
    }
  };

  const handleSaveDietChart = async () => {
    if (values?.DietType === "") {
      notify("Please Fill Required Fields", "error");
      return;
    }

    const payload = {
      name: values?.DietType,
      description: values?.Description,
      isActive: Number(values?.Status?.value || 0),
      min: values?.MinimumComponent,
      max: values?.MaximumComponent,
    };

    try {
      const apiResp = await SaveDietType(payload);
      if (apiResp?.success) {
        setSHowBtn(true);
        handleDietBindTable();
        notify(apiResp?.message, "success");
        clearForm();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error saving diet data:", error);
      notify("An error occurred while saving diet data", "error");
    }
  };

  const handleEDit = (rowData) => {
    setSHowBtn(false);
    setId(rowData?.DietID);
    setValues({
      id: rowData.id,
      DietType: rowData.Name,
      Description: rowData.Description,
      MinimumComponent: rowData.Min,
      MaximumComponent: rowData.Max,
      Status: {
        label: rowData.IsActive === "Yes" ? "YES" : "NO",
        value: rowData.IsActive === "Yes" ? "1" : "0",
      },
    });
  };

  const handelUpdateDietChart = async () => {
    const payload = {
      id: ID,
      name: values?.DietType,
      description: values?.Description,
      isActive: Number(values?.Status?.value || 0),
      min: values?.MinimumComponent,
      max: values?.MaximumComponent,
    };

    try {
      const apiResp = await UpdateDietType(payload);
      if (apiResp?.success) {
        setSHowBtn(true);
        handleDietBindTable();
        notify(apiResp?.message, "success");
        clearForm();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error updating diet data:", error);
      notify("An error occurred while updating diet data", "error");
    }
  };

  const clearForm = () => {
    setValues({ ...initialValue });
    setId("");
  };

  const handleCancel = () => {
    setSHowBtn(true);
    clearForm();
  };

  useEffect(() => {
    handleDietBindTable();
  }, []);

  return (
    <div className="mt-2 card">
      <Heading title={t("Master")} isBreadcrumb={false} />

      <div className="row mb-2 mt-2">
        <Input
          type="text"
          className="form-control required-fields"
          id="DietType"
          name="DietType"
          value={values?.DietType}
          onChange={handleChange}
          lable={t("Diet Type")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          className="form-control"
          id="Description"
          name="Description"
          value={values?.Description}
          onChange={handleChange}
          lable={t("Description")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="number"
          className="form-control"
          id="MinimumComponent"
          name="MinimumComponent"
          value={values?.MinimumComponent}
          onChange={handleChange}
          lable={t("Minimum Component")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="number"
          className="form-control"
          id="MaximumComponent"
          name="MaximumComponent"
          value={values?.MaximumComponent}
          onChange={handleChange}
          lable={t("Maximum Component")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("Status")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="Status"
          name="Status"
          removeIsClearable={true}
          dynamicOptions={StatusOptions}
          handleChange={handleSelect}
          value={values?.Status}
        />

        {showbtn ? (
          <button
            className="btn btn-sm btn-success py-1 px-2 mt-1"
            style={{ width: "70px" }}
            onClick={handleSaveDietChart}
          >
            {t("Save")}
          </button>
        ) : (
          <button
            className="btn btn-sm btn-success py-1 px-2 mt-1"
            style={{ width: "70px" }}
            onClick={handelUpdateDietChart}
          >
            {t("Update")}
          </button>
        )}

        <button
          className="btn btn-sm btn-secondary py-1 px-2 mt-1 ml-1"
          style={{ width: "70px" }}
          onClick={handleCancel}
        >
          {t("Cancel")}
        </button>
      </div>

      {roommasterSearchData.length > 0 && (
        <div className="card">
          <Tables
            thead={TheadSearchTable}
            tbody={roommasterSearchData?.map((val, index) => ({
              sno: index + 1,
              DietType: val?.Name,
              Description: val?.Description,
              maxCompo: val?.Max,
              minCompo: val?.Min,
              Status: val?.IsActive,
              Edit: (
                <i
                  className="fa fa-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEDit(val)}
                />
              ),
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default DietTypeMaster;
