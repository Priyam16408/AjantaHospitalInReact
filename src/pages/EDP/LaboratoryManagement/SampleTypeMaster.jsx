import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
// import {
//   BindColours,
//   BindContainer,
//   BindSampleTypeMaster,
//   DeleteSampleType,
//   SaveSampleType,
//   UpdateSampleType,
// } from "../../../networkServices/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import {
  BindContainer,
  BindSampleTypeMaster,
  DeleteSampleType,
  SaveSampleType,
  UpdateSampleType,
} from "../../../networkServices/EDP/karanedp";
function SampleContainerMaster({data}) {
  const [t] = useTranslation();
  const [colors, setColors] = useState([]);
  const [sampleContainerData, setSampleContainerData] = useState([]);
  const [editId, setEditId] = useState(null);

  const [values, setValues] = useState({
    displayName: "",
    containerName: "",
    conatinerColor: "",
    sampleName: "",
  });

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBindColours = async () => {
    try {
      const response = await BindColours();
      if (response.success) {
        setColors(response?.data);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const [bindContainerdata, serBindConatainerdata] = useState([]);

  const handleBindContainer = async () => {
    try {
      const response = await BindContainer();
      if (response.success) {
        serBindConatainerdata(response?.data);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await BindSampleTypeMaster("");
      if (response.success) {
        setSampleContainerData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async () => {
    const payload = {
      sampleTypeName: values?.sampleName,
      displayName: values?.displayName,
      active: 1,
      containername: values?.containerName?.value,
      colourName: values?.conatinerColor?.label,
      colour: values?.containerName?.label,
    };
    try {
      const apiResp = await SaveSampleType(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setValues({
          sampleTypeName: "",
          displayName: "",
          containername: "",
          colourName: "",
        });
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleUpdateSampleContainer = async () => {
    const payload = {
      sampleTypeName: values?.sampleName,
      displayName: values?.displayName,
      active: 1,
      containername: values?.containerName?.label,
      colourName: values?.conatinerColor?.label,
      id: editId,
      colour: "red",
    };
    try {
      const apiResp = await UpdateSampleType(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setValues({ sampleName: "", displayName: "", colors: "" });
        setEditId(null);
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while updating data", "error");
    }
  };

  // DeleteSampleType

  const handleChangeStatus = async (rowData) => {
    const payload = {
      active: rowData?.STATUS == "Deactive" ? 0 : 1,
      id: rowData?.ID,
    };
    try {
      const apiResp = await DeleteSampleType(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };
  const handleEdit = (rowData) => {
    setValues({
      sampleName: rowData?.NAME,
      displayName: rowData?.DisplayName,
      colors: {
        label: rowData?.color,
        value: rowData?.color,
      },
    });
    setEditId(rowData?.ID);
  };

  const theadBindReturn = [
    { width: "5%", name: t("SNo") },
    { width: "20%", name: t("Name") },
    { width: "20%", name: t("Display Name") },
    { width: "20%", name: t("Container") },
    { width: "10%", name: t("Color Name") },
    { width: "20%", name: t("Status") },
    { width: "10%", name: t("Edit") },
    { width: "10%", name: t("ChnageStatus") },
  ];

  useEffect(() => {
    handleBindColours();
    handleSearch();
    handleBindContainer();
  }, []);

  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            id="sampleName"
            placeholder=" "
            name="sampleName"
            value={values?.sampleName || ""}
            onChange={handleChange}
            lable={t("Sample Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Container Name")}
            id={"containerName"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={handleReactSelectDropDownOptions(
              bindContainerdata,
              "containername",
              "ID"
            )}
            handleChange={handleSelect}
            value={values?.containerName}
            name={"containerName"}
          />
          <ReactSelect
            placeholderName={t("Container Color")}
            id={"conatinerColor"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={handleReactSelectDropDownOptions(
              colors,
              "ColorName",
              "ColorCode"
            )}
            handleChange={handleSelect}
            value={values?.conatinerColor}
            name={"conatinerColor"}
          />

          <Input
            type="text"
            className="form-control"
            id="displayName"
            placeholder=" "
            name="displayName"
            value={values?.displayName || ""}
            onChange={handleChange}
            lable={t("Display Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <div className="col-sm-2 col-xl-1">
            {editId ? (
              <button
                className="btn btn-sm btn-primary"
                type="button"
                onClick={handleUpdateSampleContainer}
              >
                {t("Update")}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-success"
                type="button"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            )}
          </div>
        </div>
        {sampleContainerData.length > 0 && (
          <div className="card">
            <Tables
              thead={theadBindReturn}
              tbody={sampleContainerData?.map((val, index) => ({
                sno: index + 1,
                Name: val?.NAME,
                displayName: val?.DisplayName,
                container: val?.Container,
                colorName: val?.ColorName,
                status: val?.STATUS,
                Edit: (
                  <i
                    className="fa fa-edit cursor-pointer"
                    onClick={() => handleEdit(val)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  ></i>
                ),
                changeStatus:
                  val?.STATUS === "Active" ? (
                    <span onClick={() => handleChangeStatus(val)}>
                      DeActive
                    </span>
                  ) : (
                    <span onClick={() => handleChangeStatus(val)}>Active</span>
                  ),
              }))}
              tableHeight={"scrollView"}
              style={{ height: "60vh", padding: "2px" }}
              isSearch={true}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default SampleContainerMaster;
