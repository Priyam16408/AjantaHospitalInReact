import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  BindGrid,
  BindReturn,
  EditCategory,
  EditSaveSubCategory,
  EDPBindCategoryAPI,
  LoadDisplayName,
  SaveSubCategory,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
const { VITE_DATE_FORMAT } = import.meta.env;

function SubCategoryMaster({data}) {
  const [t] = useTranslation();
  const [categoryType, setCategoryType] = useState([]);
  const [bindReturnData, setBindReturnData] = useState([]);
  const [loadData, setLoadData] = useState([]);

  const [values, setValues] = useState({
    Abbreviation: "",
    printOrderNo: "",
    categoryType: "",
    displayName: "",
    active: { value: 1, label: "Yes" },
    category: "",
    subCategory: "",
    type: { value: "New", label: "New" },
  });

  const TYPE = [
    { value: "New", label: "New" },
    { value: "Edit", label: "Edit" },
  ];

  const isActive = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const ip = localStorage.getItem("ip");
  const isMobile = window.innerWidth <= 800;

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // LoadDisplayName

  const handleLoadDisplayName = async () => {
    try {
      const response = await LoadDisplayName();
      if (response.success) {
        console.log("the display data is", response);
        // setCategoryType(response?.data);
        setLoadData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleBindCategoryType = async () => {
    try {
      const response = await EDPBindCategoryAPI();
      if (response.success) {
        console.log("the department data is", response);
        setCategoryType(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleBindGrid = async () => {
    try {
      const response = await BindGrid(parseInt(values?.categoryType?.value));
      if (response.success) {
        console.log("the department data is", response);
        setBindReturnData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleSaveCategory = async () => {
    const payload = {
      displayName: values?.displayName?.DisplayName,
      categoryName: parseInt(values?.categoryType?.value, 10) || 0,
      name: values?.subCategory,
      active: values?.active?.value,
      ipAddress: ip,
      printOrder: parseInt(values?.printOrderNo) || 0,
      abbreviation: values?.Abbreviation,
      scaleOfCost: 0,
      validityPeriod: 0,
      isAsset: 0,
    };

    try {
      const apiResp = await SaveSubCategory(payload);
      if (apiResp.success) {
        notify("Data saved successfully...", "success");
        setValues({
          Abbreviation: "",
          printOrderNo: "",
          categoryType: "",
          displayName: "",
          active: { value: 1, label: "Yes" },
          category: "",
          subCategory: "",
          type: { value: "New", label: "New" },
        });
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  // const handleSaveCategory = async () => {
  //   const payload = {
  //     displayName: values?.displayName?.DisplayName,
  //     categoryName: parseInt(values?.categoryType?.value, 10) || 0,
  //     name: values?.subCategory,
  //     active: values?.active?.value,
  //     ipAddress: ip,
  //     printOrder: parseInt(values?.printOrderNo) || 0,
  //     abbreviation: values?.Abbreviation,
  //     scaleOfCost: 0,
  //     validityPeriod: 0,
  //     isAsset: 0,
  //   };
  //   try {
  //     const apiResp = await SaveSubCategory(payload);
  //     if (apiResp.success) {
  //       notify("data save successFully...", "success");
  //     v
  //     } else {
  //       notify("some error occurs", "error");
  //     }
  //   } catch (error) {
  //     notify("An error occurred while saving data", "error");
  //   }
  // };
  const handleEdit = async (index) => {
    const item = bindReturnData[index];
    const categotyid = bindReturnData[index]?.CategoryID;
    const subcategotyid = bindReturnData[index]?.SubCategoryID;
    const ConfigID = bindReturnData[index]?.ConfigID;

    const payload = {
      deptID: "",
      configID: ConfigID,
      subCategoryID: subcategotyid,
      categoryID: categotyid,
      description: "",
      name: item.Name,
      abbreviation: item.abbreviation,
      displayPriority: item.DisplayPriority,
      displayName: item.DisplayName,
      scaleOfCost: 0,
      validityPeriod: 0,
      active: item.Active ? 1 : 0,
      isAsset: 0,
    };

    try {
      const apiResp = await EditSaveSubCategory(payload);
      if (apiResp.success) {
        notify("Data edited successfully...", "success");
        handleBindGrid();
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedData = [...bindReturnData];
    updatedData[index][field] = value;
    setBindReturnData(updatedData);
  };

  const theadBindReturn = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("SubCategoryName") },
    { width: "5%", name: t("DisplayName") },
    { width: "5%", name: t("PrintOrderNo") },
    { width: "5%", name: t("Abbreviation") },
    { width: "5%", name: t("ValidityPeriod") },
    { width: "5%", name: t("Active") },
    { width: "5%", name: t("Department") },
    { width: "5%", name: t("Edit") },
  ];

  useEffect(() => {
    handleBindCategoryType();
    handleLoadDisplayName();
  }, []);

  return (
    <>
      <div className="spatient_registration_card card">
        <Heading
          title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />

        {values?.type?.value == "New" ? (
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
            <ReactSelect
              placeholderName={t("Type")}
              id={"type"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={TYPE}
              handleChange={handleSelect}
              value={`${values?.type?.value}`}
              name={"type"}
            />

            <ReactSelect
              placeholderName={t("Select Category")}
              id={"categoryType"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                ...handleReactSelectDropDownOptions(
                  categoryType,
                  "Name",
                  "CategoryID"
                ),
              ]}
              handleChange={handleSelect}
              value={`${values?.categoryType?.value}`}
              name={"categoryType"}
            />

            <Input
              type="text"
              className="form-control"
              id="subCategory"
              placeholder=" "
              name="subCategory"
              value={values?.subCategory || ""}
              onChange={handleChange}
              lable={t("Sub Category")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <ReactSelect
              placeholderName={t("Display Name")}
              id={"displayName"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                ...handleReactSelectDropDownOptions(
                  loadData,
                  "DisplayName",
                  "ID"
                ),
              ]}
              handleChange={handleSelect}
              value={`${values?.displayName?.value}`}
              name={"displayName"}
            />

            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="Abbreviation"
              name="Abbreviation"
              value={values?.Abbreviation || ""}
              onChange={handleChange}
              lable={t("Abbreviation")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="printOrderNo"
              name="printOrderNo"
              value={values?.printOrderNo || ""}
              onChange={handleChange}
              lable={t("Print Order No")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <ReactSelect
              placeholderName={t("Active")}
              id={"active"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={isActive}
              handleChange={handleSelect}
              value={`${values?.active?.value}`} 
              name={"active"}
            />

            <div className="col-sm-2 col-xl-1">
              <button
                className="btn btn-sm btn-success px-3"
                type="button"
                onClick={handleSaveCategory}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
              <ReactSelect
                placeholderName={t("Type")}
                id={"type"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={TYPE}
                handleChange={handleSelect}
                value={`${values?.type?.value}`}
                name={"type"}
              />

              <ReactSelect
                placeholderName={t("Category")}
                id={"categoryType"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={[
                  ...handleReactSelectDropDownOptions(
                    categoryType,
                    "Name",
                    "CategoryID"
                  ),
                ]}
                handleChange={handleSelect}
                value={`${values?.categoryType?.value}`}
                name={"categoryType"}
              />

              <div className="col-sm-2 col-xl-1">
                <button
                  className="btn btn-sm btn-success"
                  type="button"
                  onClick={handleBindGrid}
                >
                  {t("Search")}
                </button>
              </div>
            </div>

            {bindReturnData.length > 0 && (
              <div className="card">
                <Tables
                  thead={theadBindReturn}
                  tbody={bindReturnData.map((val, index) => ({
                    sno: index + 1,
                    SubCategoryName: (
                      <Input
                        type="text"
                        className="table-input"
                        value={val?.Name || ""}
                        placeholder=" "
                        onChange={(e) => handleInputChange(e, index, "Name")}
                      />
                    ),
                    DisplayName: (
                      <Input
                        type="text"
                        className="table-input"
                        value={val?.DisplayName || ""}
                        placeholder=" "
                        onChange={(e) =>
                          handleInputChange(e, index, "DisplayName")
                        }
                      />
                    ),
                    PrintOrderNo: (
                      <Input
                        type="text"
                        className="table-input"
                        value={val?.DisplayPriority || ""}
                        placeholder=" "
                        onChange={(e) =>
                          handleInputChange(e, index, "DisplayPriority")
                        }
                      />
                    ),
                    Abbreviation: (
                      <Input
                        type="text"
                        className="table-input"
                        value={val?.abbreviation || ""}
                        placeholder=" "
                        onChange={(e) =>
                          handleInputChange(e, index, "abbreviation")
                        }
                      />
                    ),
                    ValidityPeriod: "",
                    isActivee: val?.Active === 1 ? "Yes" : "No",
                    department: "",
                    Edit: (
                      <i
                        className="fa fa-edit p-1"
                        onClick={() => handleEdit(index)}
                      />
                    ),
                  }))}
                  tableHeight="scrollView"
                  style={{ height: "60vh", padding: "2px" }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SubCategoryMaster;
