import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import {
  BindCategoryType,
  BindOutSourceLabOutSourceLab,
  SaveOutSourceLab,
  UpdateOutSourceLab,
} from "../../../networkServices/EDP/karanedp";

function OutsourceLabMaster({ data }) {
  const [t] = useTranslation();
  const [categoryType, setCategoryType] = useState([]);
  const [bindReturnData, setBindReturnData] = useState([]);

  const [outSourceData, setOutsourceData] = useState([]);
  const thead = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Lab Name") },
    { width: "15%", name: t("Contact Person") },
    { width: "15%", name: t("Address") },
    { width: "15%", name: t("Contact No") },
    { width: "15%", name: t("Active") },
  ];
  const [values, setValues] = useState({
    contactNo: "",
    contactperson: "",
    Address: "",
    // outsourceLabName: "",
    outsourceLabName: "",
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

  const handleChangeOutSource = (e, index) => {
    const { name, value } = e.target;
    const updatedData = [...outSourceData];
    updatedData[index][name] = value;
    setOutsourceData(updatedData);
  }
  const handleSelectOutSource = (e, selected, index) => {
    const updatedData = [...outSourceData];
    updatedData[index]["Active"] = selected.value;
    setOutsourceData(updatedData);
  }

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
      const response = await BindRetur(parseInt(values?.categoryType?.value));
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
    if (
      !values?.outsourceLabName?.trim() ||
      !values?.Address?.trim() ||
      !values?.contactperson?.trim() ||
      !values?.contactNo?.trim()
    ) {
      notify("All fields are required", "error");
      return;
    }

    const payload = {
      name: values.outsourceLabName,
      address: values.Address,
      contactPerson: values.contactperson,
      contactNo: values.contactNo,
      ipAddress: ip,
    };

    try {
      const apiResp = await SaveOutSourceLab(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setValues({
          outsourceLabName: "",
          Address: "",
          contactperson: "",
          contactNo: "",
        });
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleUpdateOutSourceLab = async () => {
    const payload = {
      outSourceLabdeatil: [
        {
          name: "add",
          address: "noida",
          contactPerson: values?.contactperson,
          contactNo: values?.contactperson,
          ipAddress: ip,
          outsourceLabID: 2,
          active: 1,
        },
      ],
    };
    try {
      const apiResp = await SaveOutSourceLab(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleBindOutSourcedata = async () => {
    const payload = {
      outSourceName: values?.outsourceLabName,
      contactPerson: values?.contactperson,
      address: values?.Address,
      contactNo: values?.contactNo,
      type: 1,
    };
    try {
      const apiResp = await BindOutSourceLabOutSourceLab(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setOutsourceData(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...outSourceData];
    updatedData[index][field] = value;
    setOutsourceData(updatedData);
  };

  const handleUpdate = async () => {
    const payload = {
      outSourceLabdeatil: outSourceData.map((item) => ({
        name: item?.Name,
        address: item?.Address,
        contactPerson: item?.ContactPerson,
        contactNo: item?.MobileNo,
        ipAddress: ip,
        outsourceLabID: item?.ID || 0,
        active: item?.Active ?? 1,
      })),
    };
    debugger
    try {
      const apiResponse = await UpdateOutSourceLab(payload);
      if (apiResponse) {
        notify(apiResponse?.message, "success");
      } else {
        notify("Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      notify("An error occurred", "error");
    }
  };
  const theadBindReturn = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("Lab Name") },
    { width: "5%", name: t("Contact Person") },
    { width: "5%", name: t("Address") },
    { width: "5%", name: t("Contact Number") },
    { width: "5%", name: t("isActive") },
  ];

  console.log("the outSourceData data is", outSourceData);

  useEffect(() => {
    handleBindCategoryType();
  }, []);

  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={data?.breadcrumb}
          // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
          data={data}
          isSlideScreen={true}
          isBreadcrumb={false}
        />
        {values?.type?.value === "New" ? (
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
            <Input
              type="text"
              className="form-control"
              id="outsourceLabName"
              placeholder=" "
              name="outsourceLabName"
              value={values?.outsourceLabName || ""}
              onChange={handleChange}
              lable={t("Outsource Lab")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="contactperson"
              name="contactperson"
              value={values?.contactperson || ""}
              onChange={handleChange}
              lable={t("Contact Person")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="Address"
              name="Address"
              value={values?.Address || ""}
              onChange={handleChange}
              lable={t("Address")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="contactNo"
              name="contactNo"
              value={values?.contactNo || ""}
              onChange={handleChange}
              lable={t("Contact No")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <div className="col-sm-2 col-xl-1">
              <button
                className="btn btn-sm btn-success"
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
              <Input
                type="text"
                className="form-control"
                id="outsourceLabName"
                placeholder=" "
                name="outsourceLabName"
                value={values?.outsourceLabName || ""}
                onChange={handleChange}
                lable={t("Outsource Lab")}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <Input
                type="text"
                placeholder=""
                className="form-control"
                id="contactperson"
                name="contactperson"
                value={values?.contactperson || ""}
                onChange={handleChange}
                lable={t("Contact Person")}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <Input
                type="text"
                placeholder=""
                className="form-control"
                id="Address"
                name="Address"
                value={values?.Address || ""}
                onChange={handleChange}
                lable={t("Address")}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <Input
                type="text"
                placeholder=""
                className="form-control"
                id="contactNo"
                name="contactNo"
                value={values?.contactNo || ""}
                onChange={handleChange}
                lable={t("Contact No")}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              />

              <div className="col-sm-2 col-xl-2">
                <button
                  className="btn btn-sm btn-success"
                  type="button"
                  onClick={handleBindOutSourcedata}
                >
                  {t("Search")}
                </button>

                <button
                  className="btn btn-sm btn-success ml-2"
                  type="button"
                  // onClick={handleBindOutSourcedata}
                  onClick={handleUpdate}
                >
                  {t("Update")}
                </button>
              </div>
            </div>
            {outSourceData.length > 0 && (
              <div className="card">
                <Tables
                  thead={theadBindReturn}
                  tbody={outSourceData.map((val, index) => ({
                    sno: index + 1,
                    name: (
                      <Input
                        type="text"
                        className="form-control"
                        id="Name"
                        name="Name"
                        value={val?.Name}
                        // onChange={(e) => handleChange(e, index)}
                        onChange={(e) => handleChangeOutSource(e, index)}
                        respclass="col-xl-12 col-md-4 col-sm-4 col-12"
                      />
                    ),
                    mobile: (
                      <Input
                        type="text"
                        className="form-control"
                        id="ContactPerson"
                        name="ContactPerson"
                        value={val?.ContactPerson}
                        // onChange={(e) => handleChange(e, index)}
                        onChange={(e) => handleChangeOutSource(e, index)}
                        respclass="col-xl-12 col-md-4 col-sm-4 col-12"
                      />
                    ),
                    Address: (
                      <Input
                        type="text"
                        className="form-control"
                        id="Address"
                        name="Address"
                        value={val?.Address}
                        // onChange={(e) => handleChange(e, index)}
                        onChange={(e) => handleChangeOutSource(e, index)}
                        respclass="col-xl-12 col-md-4 col-sm-4 col-12"
                      />
                    ),
                    ContactPerson: (
                      <Input
                        type="text"
                        className="form-control"
                        id="MobileNo"
                        name="MobileNo"
                        value={val?.MobileNo}
                        // onChange={(e) => handleChange(e, index)}
                        onChange={(e) => handleChangeOutSource(e, index)}
                        respclass="col-xl-12 col-md-4 col-sm-4 col-12"
                      />
                    ),
                    isActive: (
                      <>
                        
                        <ReactSelect
                          id={`activeType-${index}`}
                          searchable={true}
                          removeIsClearable={true}
                          respclass="col-xl-12 col-md-4 col-sm-4 col-12"
                          dynamicOptions={ActiveType}
                          handleChange={(e, value) =>
                            // handleSelect(selected, index)
                            handleSelectOutSource(e, value, index)
                          }
                          name="Active"
                          value={ActiveType.find(
                            (opt) => opt.value == val?.Active
                          )?.value}
                        />
                      </>
                    ),
                  }))}
                  tableHeight="scrollView"
                  style={{ height: "80vh", padding: "2px" }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default OutsourceLabMaster;
