import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
// import {
//   BindColours,
//   BindGridsampleContainer,
//   SaveSampleContainer,
//   UpdateSampleContainer,
// } from "../../../networkServices/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import {
  BindColours,
  BindGridsampleContainer,
  SaveSampleContainer,
  UpdateSampleContainer,
} from "../../../networkServices/EDP/karanedp";

function SampleContainerMaster({data}) {
  const [t] = useTranslation();
  const [colors, setColors] = useState([]);
  const [sampleContainerData, setSampleContainerData] = useState([]);
  const [editId, setEditId] = useState(null); // <-- Store selected ID for editing

  const [values, setValues] = useState({
    centreName: "",
    colors: "",
    sampleQuantity: "",
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

  const handleSearch = async () => {
    try {
      const response = await BindGridsampleContainer("");
      if (response.success) {
        setSampleContainerData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = async () => {
    const payload = {
      containerName: values?.centreName,
      colour: values?.colors?.label,
      qty: values?.sampleQuantity,
      id: 0,
    };
    try {
      const apiResp = await SaveSampleContainer(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setValues({ centreName: "", sampleQuantity: "", colors: "" });
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
      containerName: values?.centreName,
      colour: values?.colors?.label,
      qty: values?.sampleQuantity,
      id: editId,
    };
    try {
      const apiResp = await UpdateSampleContainer(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setValues({ centreName: "", sampleQuantity: "", colors: "" });
        setEditId(null);
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while updating data", "error");
    }
  };

  const handleEdit = (rowData) => {
    setValues({
      centreName: rowData?.NAME,
      sampleQuantity: rowData?.qty,
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
    { width: "20%", name: t("Color") },
    { width: "20%", name: t("Quantity") },
    { width: "10%", name: t("Edit") },
  ];

  useEffect(() => {
    handleBindColours();
    handleSearch();
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
            id="centreName"
            placeholder=" "
            name="centreName"
            value={values?.centreName || ""}
            onChange={handleChange}
            lable={t("Container Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Colors")}
            id={"colors"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={handleReactSelectDropDownOptions(
              colors,
              "ColorName",
              "ColorCode"
            )}
            handleChange={handleSelect}
            value={values?.colors}
            name={"colors"}
          />

          <Input
            type="text"
            className="form-control"
            id="sampleQuantity"
            placeholder=" "
            name="sampleQuantity"
            value={values?.sampleQuantity || ""}
            onChange={handleChange}
            lable={t("Sample Quantity")}
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
                Color: val?.color,
                qty: val?.qty,
                Edit: (
                  <i
                    className="fa fa-edit cursor-pointer"
                    onClick={() => handleEdit(val)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  ></i>
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
