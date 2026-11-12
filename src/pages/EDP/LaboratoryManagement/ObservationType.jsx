import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
// import {
//   BindCategorylabortarymanagment,
//   BindObservationType,
//   SaveObservation,
//   UpdateObservation,
// } from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import {
  BindCategorylabortarymanagment,
  BindObservationType,
  SaveObservation,
  UpdateObservation,
} from "../../../networkServices/EDP/karanedp";
import CustomSelect from "../../../components/formComponent/CustomSelect";

function ObservationType({ data }) {
  const [bindInvestigation, setBindInvestigation] = useState([]);
  const [observationData, setObservationData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [originalRowData, setOriginalRowData] = useState(null);
  const [t] = useTranslation();

  const isActiveOptions = [
    { value: "0", label: "No" },
    { value: "1", label: "Yes" },
  ];
  const [values, setValues] = useState({
    departmentName: "",
    category: "",
    description: "",
    searchdescription: "",
  });

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // BindCategorylabortarymanagment

  const handleBindCategory = async () => {
    try {
      const response = await BindCategorylabortarymanagment();
      if (response.success) {
        setBindInvestigation(response?.data);
        console.log("the response from api is work", response);
      } else {
        // console.error(
        //   "API returned success as false or invalid response:",
        //   response
        // );
        setBindInvestigation([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindInvestigation([]);
    }
  };
  const ip = localStorage.getItem("ip");

  // const handleSaveObservation = async () => {

  //   console.log(values?.category?.value);
  //   const payload = {
  //     name: values?.departmentName,
  //     description: values?.description,
  //     deptEmailID: "",
  //     templateType: true,
  //     ipAddress: ip,
  //     categoryID: values?.category?.value,
  //   };

  //   try {
  //     const apiResp = await SaveObservation(payload);
  //     if (apiResp.success) {
  //       notify(`${apiResp?.message}`, "success");
  //       setValues({
  //         departmentName: "",
  //         category: "",
  //         description: "",
  //         searchdescription: "",
  //       })
  //     } else {
  //       notify(apiResp?.message, "error");
  //     }
  //   } catch (error) {
  //     console.error("Error while fetching data:", error);
  //     notify("An error occurred while fetching data", "error");
  //   }
  // };

  // SaveObservation

  const handleSaveObservation = async () => {
    if (
      !values?.departmentName?.trim() ||
      !values?.description?.trim() ||
      !values?.category?.value
    ) {
      notify("Please filled all the fields", "error");
      return;
    }

    console.log(values?.category?.value);
    const payload = {
      name: values?.departmentName,
      description: values?.description,
      deptEmailID: "",
      templateType: true,
      ipAddress: ip,
      categoryID: values?.category?.value,
    };

    try {
      const apiResp = await SaveObservation(payload);
      if (apiResp.success) {
        notify(`${apiResp?.message}`, "success");
        setValues({
          departmentName: "",
          category: "",
          description: "",
          searchdescription: "",
        });
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }
  };

  const handleReset = () => {
    setValues({
      departmentName: "",
      category: "",
      description: "",
      searchdescription: "",
      creditlimitpercent: "",
    });
  };

  const handleBindObservationType = async () => {
    try {
      if (!values?.searchdescription) {
        notify("Enter Search Department", "error")
        return;
      }
      const response = await BindObservationType(1, values?.searchdescription);
      if (response.success) {
        console.log("the response is", response);
        setObservationData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        notify(response?.message, "error");
        setObservationData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setObservationData([]);
    }
  };

  const theadObservation = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Name") },
    { width: "15%", name: t("Print Sequence") },
    { width: "10%", name: t("Authorised") },
    { width: "15%", name: t("Active") },
    { width: "15%", name: t("Edit") },
  ];

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedData = [...observationData];
    updatedData[index][field] = value;
    setObservationData(updatedData);
  };

  const handleUpdate = async (index) => {
    const Name = observationData[index].Name;
    const printSequence = observationData[index].PrintSequence;
    const observationId = observationData[index].ObservationType_ID;
    const active = observationData[index].IsActive;

    const payload = {
      observationTypeID: observationId,
      description: "",
      name: Name,
      flag: true,
      printSequence: Number(printSequence),
      groupID: 0,
      active: active == 1 ? true : false,
      logo: "",
    };

    try {
      const apiResp = await UpdateObservation(payload);
      if (apiResp.success) {
        notify("Data Updated successfully...", "success");
        handleBindObservationType();
        setEditingIndex(null);
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleReactSelect = (index, name, e) => {
    const updatedData = [...observationData];
    updatedData[index][name] = e.value;
    setObservationData(updatedData);

  }

  const handleCancelEdit = () => {
    if (originalRowData && editingIndex !== null) {
      const updatedData = [...observationData];
      updatedData[editingIndex] = originalRowData;
      setObservationData(updatedData);
    }
    setEditingIndex(null);
    setOriginalRowData(null);
  };

  const handleEdit = (index) => {
    if (originalRowData && editingIndex !== null) {
      const updatedData = [...observationData];
        updatedData[editingIndex] = originalRowData;
        setObservationData(updatedData);
      }
    setEditingIndex(index);
    setOriginalRowData({ ...observationData[index] });
  };
  useEffect(() => {
    handleBindCategory();
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
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Category")}
            id={"category"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="category"
            requiredClassName={"required-fields"}
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                bindInvestigation,
                "Name",
                "CategoryID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.category?.value}`}
          />

          <Input
            type="text"
            className="form-control required-fields"
            id="departmentName"
            name="departmentName"

            value={values?.departmentName}
            onChange={handleChange}
            lable={t("Department Name")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control required-fields"
            id="description"
            name="description"
            // value={values?.creditlimitpercent}
            value={values?.description}
            onChange={handleChange}
            lable={t("Description")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <div className="d-flex col-12 ">
            <button
              onClick={handleSaveObservation}
              className="btn btn-sm btn-success ml-2"
              type="button"
            >
              {t("Save")}
            </button>

            <button
              onClick={handleReset}
              className="btn btn-sm btn-success ml-2"
              type="button"
            >
              {t("Reset")}
            </button>
          </div>
        </div>

        <Heading title={t("Search")} isBreadcrumb={false} />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="searchdescription"
            name="searchdescription"
            value={values?.searchdescription}
            onChange={handleChange}
            lable={t("Search Department")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <div className="col-12">
            <button
              onClick={handleBindObservationType}
              className="btn btn-sm btn-success ms-auto"
              type="button"
            >
              {t("Search")}
            </button>
          </div>
        </div>
        <Tables
          thead={theadObservation}
          tbody={observationData?.map((val, index) => ({
            sno: index + 1,
            Name: (
              <Input
                type="text"
                className="table-input"
                value={val?.Name || ""}
                placeholder=" "
                disabled={editingIndex !== index ? true : false}
                onChange={(e) => handleInputChange(e, index, "Name")}
              />
            ),

            PrintSequence: (
              <Input
                type="number"
                className="table-input"
                value={String(val?.PrintSequence)}
                placeholder=" "
                disabled={editingIndex !== index ? true : false}
                onChange={(e) => handleInputChange(e, index, "PrintSequence")}
              />
            ),
            Authorised: val?.Authorise == 1 ? "Yes" : "No",

            Active: (
              editingIndex === index ? (
                <>
                  <CustomSelect
                    name="IsActive"
                    option={isActiveOptions}
                    placeholderName={t("IsActive")}
                    value={String(val?.IsActive) || ""}
                    onChange={(name, e) => handleReactSelect(index, name, e)}
                  />

                </>
              )
                : val?.IsActive == 1 ? "Yes" : "No"),
            Edit: (
              editingIndex === index ? (
                <>
                  <i className="fa fa-save m-1 text-success" onClick={() => handleUpdate(index)} title="Update" />
                  <i className="fa fa-times p-1 text-danger ml-3" onClick={handleCancelEdit} title="Cancel" />
                </>
              ) : (
                <i className="fa fa-edit p-1" onClick={() => handleEdit(index)} title="Edit" />
              )
              // <i className="fa fa-edit p-1" onClick={() => handleEdit(index)} />
            ),
          }))}
          tableHeight={"scrollView"}
          style={{ height: "60vh", padding: "2px" }}
        />
      </div>
    </>
  );
}

export default ObservationType;
