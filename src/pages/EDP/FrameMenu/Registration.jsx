import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
// import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  BindEmployeeGroup,
  BindPayrollDepartment,
  BindQualification,
  BindTitleWithGender,
  BindUserType,
  BloodBank,
  EDPBindPayrollDesignation,
  EDPGetEmployee,
  EDPupdateEmployee,
  EPDsaveEmployee,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";

const Registration = ({ data }) => {
  console.log("data", data);

  const initialState = {
    FullName: "",
    Locality: "",
    HouseNo: "",
    StreetNo: "",
    City: "",
    PostalCode: "",
    pHouseNo: "",
    pStreetNo: "",
    pLocality: "",
    pCity: "",
    pPostalCode: "",
    FatherName: "",
    MotherName: "",
    Email: "",
    ContactNo: "",
    Title: {
      title: "",
      gender: "",
      label: "",
      value: "",
    },
    BloodGroup: {
      id: 0,
      BloodGroup: "",
      label: "",
      value: 0,
    },
    Discount: 0,
    UserType: {
      Name: "",
      ID: 0,
      label: "",
      value: 0,
    },
    startDate: "",
    userTypeID: "",
    deptID: "",
    deptName: "",
    desID: "",
    desName: "",
    Department: {
      Dept_ID: 0,
      Dept_Name: "",
      label: "",
      value: 0,
    }, // Ensure it matches API response
    Designation: {
      Des_ID: 0,
      Designation_Name: "",
      label: "",
      value: 0,
    },
    EmployeeGroup: {
      Name: "",
      ID: 0,
      label: "",
      value: 0,
    },
    empGroupName: "",
    qualificationID: "",
    qualificationName: "",
    Qualification: {
      ID: 0,
      Qualification: "",
      label: "",
      value: 0,
    },
    panNo: "",
    PassportNo: "",
    dob: new Date(),
    doj: null,
  };

  const transformEmployeeData = (data) => {
    console.log("datadatadata", data);
    //
    return {
      FullName: data?.Name || "",
      Locality: data?.Locality || "",
      HouseNo: data?.House_No || "",
      StreetNo: data?.Street_Name || "",
      City: data?.City || "",
      PostalCode: data?.Pincode || "",
      pHouseNo: data?.PHouse_No || "",
      pStreetNo: data?.PStreet_Name || "",
      pLocality: data?.PLocality || "",
      pCity: data?.PCity || "",
      pPostalCode: data?.PPincode || "",
      FatherName: data?.FatherName || "",
      MotherName: data?.MotherName || "",
      Email: data?.Email || "",
      ContactNo: data?.Mobile || data?.Phone || "",
      Title: {
        title: data?.Title || "",
        gender: data?.Title === "Mr." ? "Male" : "Female",
        label: data?.Title || "",
        value: data?.Title === "Mr." ? "Male" : "Female",
      },
      BloodGroup: {
        id: Number(data?.BloodGroup) || 0,
        BloodGroup: data?.BloodGroup || "",
        label: data?.BloodGroup || "",
        value: Number(data?.BloodGroup) || 0,
      },
      UserType: {
        Name: "",
        ID: Number(data?.UserType_ID) || 0,
        label: "",
        value: Number(data?.UserType_ID) || 0,
      },
      startDate: data?.StartDate || "",
      userTypeID: data?.UserType_ID || "",
      deptID: data?.Dept_ID,
      deptName: "",
      desID: data?.Desi_ID,
      desName: "",
      Department: {
        Dept_ID: data?.Dept_ID,
        Dept_Name: "",
        label: "",
        value: data?.Dept_ID,
      },
      Designation: {
        Des_ID: data?.Desi_ID,
        Designation_Name: "",
        label: "",
        value: data?.Desi_ID,
      },
      EmployeeGroup: {
        Name: "",
        ID: data?.Employee_Group_ID,
        label: "",
        value: data?.Employee_Group_ID,
      },
      empGroupName: "",
      qualificationID: data?.Qualification || "",
      qualificationName: "",
      Qualification: {
        ID: Number(data?.Qualification) || 0,
        Qualification: data?.Qualification || "",
        label: "",
        value: Number(data?.Qualification) || 0,
      },
      panNo: data?.PAN_No || "",
      PassportNo: data?.PassportNo || "",
      dob: data?.DOB || new Date(),
      doj: data?.StartDate || null,
      Discount: data?.DiscountPercent,
    };
  };

  // console.log("Transformed Data:", transformEmployeeData(dataGoing?.data));

  const [t] = useTranslation();
  const [values, setValues] = useState({ ...initialState });
  console.log("Values", values);

  // if(data?.data){
  //   setValues(data?.data);
  // }
  // console.log("values", values);
  const [dropDownState, setDropDownState] = useState({
    Designation: [],
    EmployeeGroup: [],
    Qualification: [],
  });

  const handleReactSelect = (name, value) => {
    //
    setValues((val) => ({ ...val, [name]: value }));
  };
  const handleInputChange = (e, index, label) => {
    setValues((val) => ({ ...val, [label]: e.target.value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const bindDesignation = async () => {
    const data = await EDPBindPayrollDesignation();
    setDropDownState((val) => ({
      ...val,
      Designation: handleReactSelectDropDownOptions(
        data?.data,
        "Designation_Name", // Ensure it matches API response
        "Des_ID"
      ),
    }));
  };

  const bindEmployeeGroup = async () => {
    const data = await BindEmployeeGroup();
    setDropDownState((val) => ({
      ...val,
      EmployeeGroup: handleReactSelectDropDownOptions(
        data?.data,
        "Name", // Ensure it matches API response
        "ID"
      ),
    }));
  };
  const BindUserTypeAPI = async () => {
    const data = await BindUserType();
    setDropDownState((val) => ({
      ...val,
      UserType: handleReactSelectDropDownOptions(
        data?.data,
        "Name", // Ensure it matches API response
        "ID"
      ),
    }));
  };

  const BindQualificationAPI = async () => {
    const data = await BindQualification();
    setDropDownState((val) => ({
      ...val,
      Qualification: handleReactSelectDropDownOptions(
        data?.data,
        "Qualification", // Ensure it matches API response
        "ID"
      ),
    }));
  };
  const BloodBankAPI = async () => {
    const data = await BloodBank();
    setDropDownState((val) => ({
      ...val,
      BloodBank: handleReactSelectDropDownOptions(
        data?.data,
        "BloodGroup", // Ensure it matches API response
        "id"
      ),
    }));
  };
  const bindDepartmentAPI = async () => {
    const data = await BindPayrollDepartment();

    if (data?.success) {
      setDropDownState((val) => ({
        ...val,
        Department: handleReactSelectDropDownOptions(
          data?.data,
          "Dept_Name",
          "Dept_ID"
        ),
      }));
    }
  };
  const BindTitleWithGenderAPI = async () => {
    const data = await BindTitleWithGender();

    if (data?.success) {
      setDropDownState((val) => ({
        ...val,
        Title: handleReactSelectDropDownOptions(data?.data, "title", "gender"),
      }));
    }
  };

  const handleUpdate = async () => {
    const payloadToBe = {
      title: values?.Title?.label,
      name: values?.FullName,
      houseNo: values?.HouseNo,
      streetName: values?.StreetNo,
      locality: values?.Locality,
      city: values?.City,
      pinCode: Number(values?.PostalCode) || 0,
      pHouseNo: values?.pHouseNo,
      pStreetName: values?.pStreetNo,
      pLocality: values?.pLocality,
      pCity: values?.pCity,
      pPinCode: Number(values?.pPostalCode) || 0,
      fatherName: values?.FatherName,
      motherName: values?.MotherName,
      esiNo: "", // PENDING
      epfNo: "", // PENDING
      panNo: "", // PENDING
      passportNo: values?.PassportNo,
      dob: values?.dob,
      qualification: values?.Qualification?.value,
      email: values?.Email,
      phone: values?.ContactNo,
      mobile: values?.ContactNo,
      bloodGroup: values?.BloodGroup?.value,
      startDate: values?.startDate,
      userTypeID: values?.UserType?.value,
      deptID: values?.Department?.Dept_ID,
      deptName: values?.Department?.Dept_Name,
      desiName: values?.Designation?.Designation_Name,
      desiID: values?.Designation?.Des_ID,
      employeeGroupID: values?.EmployeeGroup?.value,
      discountPercent: values?.Discount,
      employeeID: data?.EmployeeID,
    };

    console.log("payload before updating ", payloadToBe);
    const dataReceived = await EDPupdateEmployee(payloadToBe);
    if (dataReceived?.success) {
      notify(dataReceived?.message, "success");
      setValues(initialState);
    } else {
      notify(dataReceived?.message, "error");
    }
  };

  const handleSave = async () => {
    const payloadToBe = {
      title: values?.Title?.title,
      name: values?.FullName,
      houseNo: values?.HouseNo,
      streetName: values?.StreetNo,
      locality: values?.Locality,
      city: values?.City,
      pinCode: Number(values?.PostalCode) || 0,
      pHouseNo: values?.pHouseNo,
      pStreetName: values?.pStreetNo,
      pLocality: values?.pLocality,
      pCity: values?.pCity,
      pPinCode: Number(values?.pPostalCode) || 0,
      fatherName: values?.FatherName,
      motherName: values?.MotherName,
      esiNo: "", // PENDING
      epfNo: "", // PENDING
      panNo: "", // PENDING
      passportNo: values?.PassportNo,
      dob: values?.dob,
      qualification: values?.Qualification?.value,
      email: values?.Email,
      phone: values?.ContactNo,
      mobile: values?.ContactNo,
      bloodGroup: values?.BloodGroup?.value,
      startDate: values?.startDate,
      userTypeID: values?.UserType?.value,
      deptID: values?.Department?.Dept_ID,
      deptName: values?.Department?.Dept_Name,
      desiName: values?.Designation?.Designation_Name,
      desiID: values?.Designation?.Des_ID,
      employeeGroupID: values?.EmployeeGroup?.value,
      discountPercent: 0,
    };

    // console.log("Payload Before Saving", payloadToBe);

    const data = await EPDsaveEmployee(payloadToBe);

    if (data?.success) {
      notify(data?.message, "success");
    } else notify(data?.message, "error");
  };
  const handleReset = () => {
    setValues(initialState);
  };

  const GetEmployeeAPI = async () => {
    const empID = data?.EmployeeID;
    const dataGoing = await EDPGetEmployee(empID);
    if (dataGoing?.success) {
      console.log("Raw Date:", dataGoing?.data);
      console.log(
        "Transformed Data:",
        transformEmployeeData(dataGoing?.data[0])
      );
      const formattedData = transformEmployeeData(dataGoing?.data[0]);
      console.log("Formatted Data:", formattedData);
      //
      setValues(formattedData);
    } else {
      notify(data?.message, "error");
    }
  };

  useEffect(() => {
    if (data?.EmployeeID) {
      GetEmployeeAPI();
    }
  }, []);
  useEffect(() => {
    bindDesignation();
    bindEmployeeGroup();
    BindUserTypeAPI();
    BindQualificationAPI();
    BloodBankAPI();
    bindDepartmentAPI();
    BindTitleWithGenderAPI();
  }, []);

  return (
    <div className="mt-2 card">
      {/* <Heading title={"Employee Details"} />
      <div className="row p-3">
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={"Employee Name"}
            value={data?.data?.NAME}
            className=""
          />
        </div>
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={"Father's Name"}
            value={data?.data?.Pname}
            className=""
          />
        </div>
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={"Mother's Name"}
            value={data?.data?.Department}
            className=""
          />
        </div>
      </div> */}

      <Heading
        isBreadcrumb={true}
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
      />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Title")}
          id="Title"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="Title"
          value={values?.Title?.label}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={handleReactSelectDropDownOptions(
            dropDownState?.Title,
            "title",
            "title"
          )}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="FullName"
          className={"form-control required-fields"}
          lable={t("Full Name")}
          placeholder=" "
          //   id="ItemName"
          name="FullName"
          onChange={(e) => handleInputChange(e, 0, "FullName")}
          value={values?.FullName ? values?.FullName : ""}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="HouseNo"
          className={"form-control "}
          lable={t("Local House No.")}
          placeholder=" "
          //   id="ItemName"
          name="HouseNo"
          onChange={(e) => handleInputChange(e, 0, "HouseNo")}
          value={values?.HouseNo}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="StreetNo"
          className={"form-control "}
          lable={t("Local Street Number")}
          placeholder=" "
          id="StreetNo"
          name="StreetNo"
          onChange={(e) => handleInputChange(e, 0, "StreetNo")}
          value={values?.StreetNo}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="Locality"
          className={"form-control "}
          lable={t("Local Locality")}
          placeholder=" "
          id="Locality"
          name="Locality"
          onChange={(e) => handleInputChange(e, 0, "Locality")}
          value={values?.Locality}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="City"
          className={"form-control "}
          lable={t("Local City")}
          placeholder=" "
          //   id="ItemName"
          name="City"
          onChange={(e) => handleInputChange(e, 0, "City")}
          value={values?.City}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="PostalCode"
          className={"form-control "}
          lable={t("Local Postal Code")}
          placeholder=" "
          //   id="ItemName"
          name="PostalCode"
          onChange={(e) => handleInputChange(e, 0, "PostalCode")}
          value={values?.PostalCode}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="pHouseNo"
          className={"form-control "}
          lable={t("Permanent House No.")}
          placeholder=" "
          //   id="ItemName"
          name="pHouseNo"
          onChange={(e) => handleInputChange(e, 0, "pHouseNo")}
          value={values?.pHouseNo}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="pStreetNo"
          className={"form-control "}
          lable={t("Permanent Street Number")}
          placeholder=" "
          id="pStreetNo"
          name="pStreetNo"
          onChange={(e) => handleInputChange(e, 0, "pStreetNo")}
          value={values?.pStreetNo}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="pLocality"
          className={"form-control "}
          lable={t("Permanent Locality")}
          placeholder=" "
          id="pLocality"
          name="pLocality"
          onChange={(e) => handleInputChange(e, 0, "pLocality")}
          value={values?.pLocality}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="pCity"
          className={"form-control "}
          lable={t("Permanent City")}
          placeholder=" "
          id="pCity"
          name="pCity"
          onChange={(e) => handleInputChange(e, 0, "pCity")}
          value={values?.pCity}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="pPostalCode"
          className={"form-control "}
          lable={t("Permanent Postal Code")}
          placeholder=" "
          id="pPostalCode"
          name="pPostalCode"
          onChange={(e) => handleInputChange(e, 0, "pPostalCode")}
          value={values?.pPostalCode}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="Email"
          className={"form-control "}
          lable={t("Permanent Email")}
          placeholder=" "
          id="Email"
          name="Email"
          onChange={(e) => handleInputChange(e, 0, "Email")}
          value={values?.Email}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="ContactNo"
          className={"form-control "}
          lable={t("Permanent Contact No.")}
          placeholder=" "
          id="ContactNo"
          name="ContactNo"
          onChange={(e) => handleInputChange(e, 0, "ContactNo")}
          value={values?.ContactNo ? values?.ContactNo : ""}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <Input
          type="FatherName"
          className={"form-control"}
          lable={t("Father's Name")}
          placeholder=" "
          id="FatherName"
          name="FatherName"
          onChange={(e) => handleInputChange(e, 0, "FatherName")}
          value={values?.FatherName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="MotherName"
          className={"form-control"}
          lable={t("Mother's Name")}
          placeholder=" "
          //   id="ItemName"
          name="MotherName"
          onChange={(e) => handleInputChange(e, 0, "MotherName")}
          value={values?.MotherName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <DatePicker
          className="custom-calendar"
          placeholder={""}
          lable={t("Date of Birth")} // Corrected to "lable"
          name="dob"
          id="dob"
          value={values?.dob ? new Date(values?.dob) : new Date()}
          showTime
          hourFormat="12"
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Qualification")}
          id="Qualification"
          removeIsClearable={true}
          // requiredClassName={"required-fields"}
          name="Qualification"
          value={values?.Qualification?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Qualification}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="PassportNo"
          className={"form-control"}
          lable={t("Passport No.")}
          placeholder=" "
          id="PassportNo"
          name="PassportNo"
          onChange={(e) => handleInputChange(e, 0, "PassportNo")}
          value={values?.PassportNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Blood Group")}
          id="BloodGroup"
          removeIsClearable={true}
          // requiredClassName={"required-fields"}
          name="BloodGroup"
          value={values?.BloodGroup?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.BloodBank}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("User Type")}
          id="UserType"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="UserType"
          value={values?.UserType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.UserType}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Employee Group")}
          id="EmployeeGroup"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="EmployeeGroup"
          value={values?.EmployeeGroup?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.EmployeeGroup}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <DatePicker
          className="custom-calendar"
          placeholder={""}
          lable={t("Start Date")} // Corrected to "lable"
          name="startDate"
          id="startDate"
          value={values?.startDate ? new Date(values?.startDate) : new Date()}
          showTime
          hourFormat="12"
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Department")}
          id="Department"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="Department"
          value={values?.Department?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Department}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Designation")}
          id="Designation"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="Designation"
          value={values?.Designation?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Designation}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="Discount"
          className={"form-control required-fields"}
          lable={t("Allow Discount(%)")}
          placeholder=" "
          id="Discount"
          name="Discount"
          onChange={(e) => handleInputChange(e, 0, "Discount")}
          value={values?.Discount}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className="btn btn-sm btn-success ml-2"
          onClick={data?.NAME ? handleUpdate : handleSave}
        >
          {data?.NAME ? t("Update") : t("Save")}
        </button>
        <button className="btn btn-sm btn-success ml-2" onClick={handleReset}>
          {t("Reset")}
        </button>
      </div>

      {/* <Heading title={"Personal Details"} /> */}
      <div className="row p-2"></div>
    </div>
  );
};

export default Registration;
