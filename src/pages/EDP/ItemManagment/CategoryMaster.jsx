import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  BindCategoryType,
  BindReturn,
  EditCategory,
  SaveCategory,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
const { VITE_DATE_FORMAT } = import.meta.env;

function CategoryMaster({ data }) {
  const [t] = useTranslation();
  const [categoryType, setCategoryType] = useState([]);
  const [bindReturnData, setBindReturnData] = useState([]);

  const [values, setValues] = useState({
    Abbreviation: "",
    printOrderNo: "",
    Name: "",
    active: { value: 1, label: "Yes" },
    categoryType: "",
    type: { value: "New", label: "New" },
    Active: "",
  });

  const TYPE = [
    { value: "New", label: "New" },
    { value: "Edit", label: "Edit" },
  ];

  const ActiveType = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const isActive = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];
  const ip = localStorage.getItem("ip");

  const handleCustomSelect = (index, name, e) => {
    const data = [...bindReturnData];
    data[index][name] = e.value;
    setBindReturnData(data);
  };

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBindCategoryType = async () => {
    try {
      const response = await BindCategoryType();
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

  const handleBindReturn = async () => {
    try {
      const response = await BindReturn(parseInt(values?.categoryType?.value));
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
      name: values?.Name,
      active: values?.active?.value,
      categoryID: parseInt(values?.categoryType?.value, 10) || 0,
      abbreviation: values?.Abbreviation,
      ipAddress: ip,
    };
    try {
      const apiResp = await SaveCategory(payload);
      if (apiResp.success) {
        notify("data save successFully...", "success");
      } else {
        notify("some error occurs", "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleEdit = async (index) => {
    const updatedName = bindReturnData[index]?.Name;
    const categotyid = bindReturnData[index]?.CategoryID;
    const payload = {
      name: updatedName,
      active: values?.Active?.value,
      categoryID: categotyid,
    };
    try {
      const apiResp = await EditCategory(payload);
      if (apiResp.success) {
        notify("Data edited successfully...", "success");
        handleBindReturn();
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedData = [...bindReturnData];
    updatedData[index].Name = value;
    setBindReturnData(updatedData);
  };

  const theadBindReturn = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("Name") },
    { width: "5%", name: t("isActive") },
    { width: "5%", name: t("Edit") },
  ];

  useEffect(() => {
    handleBindCategoryType();
  }, []);

  return (
    <>
      <div className="spatient_registration_card card">
        <Heading
          title={data?.breadcrumb}
          // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
          data={data}
          isSlideScreen={true}
        />

        {values?.type?.value == "New" ? (
          <>
            <div className="row pt-2 px-2">
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
                placeholderName={t("Category Type")}
                id={"categoryType"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={[
                  ...handleReactSelectDropDownOptions(categoryType, "NAME", "id"),
                ]}
                handleChange={handleSelect}
                value={`${values?.categoryType?.value}`}
                name={"categoryType"}
              />

              <Input
                type="text"
                className="form-control"
                id="Name"
                placeholder=" "
                name="Name"
                value={values?.Name || ""}
                onChange={handleChange}
                lable={t("Name")}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
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

            </div>
            <div className="d-flex justify-content-end mb-1 mr-2">
              <button
                className="btn btn-sm btn-success px-3"
                type="button"
                onClick={handleSaveCategory}
              >
                {t("Save")}
              </button>
            </div>
          </>
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
                placeholderName={t("Category Type")}
                id={"categoryType"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={[
                  ...handleReactSelectDropDownOptions(
                    categoryType,
                    "NAME",
                    "id"
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
                  onClick={handleBindReturn}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
            {bindReturnData.length > 0 && (
              <div className="card">
                <Tables
                  thead={theadBindReturn}
                  tbody={bindReturnData?.map((val, index) => ({
                    sno: index + 1,
                    name:
                      (
                        <Input
                          type="text"
                          className="table-input"
                          name="Value"
                          value={val?.Name || ""}
                          placeholder=" "
                          removeFormGroupClass={true}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      ) || "",
                    isActivee:
                      val?.Active === 1 ? (
                        <>
                          <CustomSelect
                            option={ActiveType}
                            isRemoveSearchable={true}
                            placeHolder={t("IsActive")}
                            value={String(val?.Active)}
                            name="Active"
                            onChange={(name, e) =>
                              handleCustomSelect(index, name, e)
                            }
                          />
                        </>
                      ) : (
                        <CustomSelect
                          option={ActiveType}
                          isRemoveSearchable={true}
                          placeHolder={t("IsActive")}
                          a
                          value={String(val?.Active)}
                          name="Active"
                          onChange={(name, e) =>
                            handleCustomSelect(index, name, e)
                          }
                        />
                      ),
                    Edit: (
                      <button className="btn btn-sm btn-primary tbl-btn" onClick={() => handleEdit(index)}> {t("Update")}</button>
                      // <i
                      //   className="fa fa-edit p-1"
                      //   onClick={() => handleEdit(index)}
                      // />
                    ),
                  }))}
                  tableHeight={"scrollView"}
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

export default CategoryMaster;
