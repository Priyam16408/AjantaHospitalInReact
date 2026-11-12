import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  BindDetailApproval,
  BindDoctor,
  BindEmployeeApproval,
  BindRoleApproval,
  RemoveSignApproval,
  SaveManageApproval,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { THEAD } from "../../../utils/constant";
import Tables from "../../../components/UI/customTable";
import BrowseButton from "../../../components/formComponent/BrowseButton";

const ManageApproval=()=> {
  const forApprovalOptions = [
    { ID: 1, Name: "Approve" },
    { ID: 2, Name: "Forward" },
    { ID: 3, Name: "Approve & NotApprove" },
    { ID: 4, Name: "Approve & NotApprove & Unhold" },
    { ID: 5, Name: "Result Entry" },
  ];
  const [t] = useTranslation();
  const [bindDoctorData, setBindDoctorData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [bindRoledata, setBindRoledata] = useState([]);
  const [manageApprovalData, setManageApprovaldata] = useState([]);

  const [values, setValues] = useState({
    doctor: "",
    technician: "",
    bindRole: "",
    DigitalSignature: "",
    forApproval: "",
  });

  const BindDoctorAPI = async () => {
    try {
      const response = await BindDoctor();
      if (response.success) {
        setBindDoctorData(response?.data);
      } else {
        setBindDoctorData([]);
      }
    } catch (error) {
      setBindDoctorData([]);
    }
  };

  const handleBindEmployeeApproval = async () => {
    try {
      const response = await BindEmployeeApproval();
      if (response.success) {
        setEmployee(response?.data);
      } else {
        setBindDoctorData([]);
      }
    } catch (error) {
      setBindDoctorData([]);
    }
  };

  const handleBindRoleApproval = async () => {
    try {
      const response = await BindRoleApproval();
      if (response.success) {
        setBindRoledata(response?.data);
        console.log("the response bindrole the observation", response);
      } else {
        setBindRoledata([]);
      }
    } catch (error) {
      setBindRoledata([]);
    }
  };

  const handleBindApproval = async () => {
    try {
      const response = await BindDetailApproval();
      if (response.success) {
        setManageApprovaldata(response?.data);
        console.log("the binde approval for table data is", response);
      } else {
        setManageApprovaldata([]);
      }
    } catch (error) {
      setManageApprovaldata([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        notify("File size exceeds 5MB. Please choose a smaller file.", "error");
        return;
      }
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        setValues((val) => ({ ...val, [e?.target?.name]: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(values);

  const handleSaveManageApproval = async () => {
    if (!values?.doctor) {
      notify("Please select doctor", "error");
      return;
    }
    if (!values?.technician) {
      notify("Please select technician", "error");
      return;
    }
    if (!values?.bindRole) {
      notify("Please select role", "error");
      return;
    }
    let payload = {
      employeeID: values?.doctor,
      technicalID: values?.technician,
      approval: values?.forApproval,
      DigitalSignature: values?.DigitalSignature,
      roleID: values?.bindRole,
    };
    try {
      const apiResp = await SaveManageApproval(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleBindApproval();
        setValues({
          doctor: "",
          technician: "",
          bindRole: "",
          DigitalSignature: "",
          forApproval: "",
        });
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleOpenImage = (base64String) => {
    const imageType = "png";
    const imageSrc = `data:image/${imageType};base64,${base64String}`;
  
    const newTab = window.open('', '', 'width=600,height=400');
    if (newTab) {
      newTab.document.write(`<img src="${imageSrc}" style="width: 600px; height: 400px; object-fit: contain; alt="Image" />`);
      newTab.document.title = "Base64 Image";
    } };

  const handleSelect = (name, value) => {
    console.log(value);
    setValues((prev) => ({ ...prev, [name]: value?.value }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await RemoveSignApproval(id);
      if (response.success) {
        notify(response?.message, "success");
        handleBindApproval();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const Thead = [
    { width: "5%", name: t("Sr.No") },
    { width: "15%", name: t("RoleName") },
    { width: "15%", name: t("Employee Name") },
    { width: "15%", name: t("Technician Name") },
    { width: "10%", name: t("Authority") },
    { width: "15%", name: t("Default Signature") },
    { width: "10%", name: t("Delete") },
    { width: "10%", name: t("View Signature") },
  ];

  useEffect(() => {
    BindDoctorAPI();
    handleBindEmployeeApproval();
    handleBindRoleApproval();
    handleBindApproval();
  }, []);
  return (
    <div className="card pt-3">
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Doctor")}
          id={"doctor"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="doctor"
          dynamicOptions={[
            ...handleReactSelectDropDownOptions(
              bindDoctorData,
              "NAME",
              "EmployeeID"
            ),
          ]}
          handleChange={handleSelect}
          value={`${values?.doctor}`}
        />
        <ReactSelect
          placeholderName={t("Technician")}
          id={"technician"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="technician"
          dynamicOptions={[
            ...handleReactSelectDropDownOptions(employee, "name", "employeeID"),
          ]}
          handleChange={handleSelect}
          value={`${values?.technician}`}
        />
        <ReactSelect
          placeholderName={t("Login Type")}
          id={"bindRole"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="bindRole"
          dynamicOptions={[
            ...handleReactSelectDropDownOptions(bindRoledata, "RoleName", "ID"),
          ]}
          handleChange={handleSelect}
          value={`${values?.bindRole}`}
        />
        <ReactSelect
          placeholderName={t("For Approval")}
          id={"forApproval"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="forApproval"
          dynamicOptions={[
            ...handleReactSelectDropDownOptions(
              forApprovalOptions,
              "Name",
              "ID"
            ),
          ]}
          handleChange={handleSelect}
          value={values?.forApproval}
        />

        <div className="d-flex justify-content-center align-items-baseline">
          <BrowseButton
            handleImageChange={handleImageChange}
            value={values.DigitalSignature}
            className={"btn-primary  w-100 "}
            name="DigitalSignature"
            label={t("Digital Signature")}
            accept={".jpg, .jpeg, .png"}
          />

          <button
            className="btn btn-lg btn-success ml-2"
            type="button"
            onClick={handleSaveManageApproval}
          >
            {t("Add")}
          </button>
        </div>
      </div>

      {manageApprovalData.length > 0 && (
        <div className="card">
          <Tables
            thead={Thead}
            tbody={manageApprovalData?.map((val, index) => ({
              sno: index + 1,
              RoleName: val.Rolename || "",
              EmployeeName: val.empName || "",
              TechnicianName: val.TechName || "",
              Authority: val.Authority || "",
              DefaultSignature: val.DefaultSignature || "No",
              Delete: (
                <i
                  className="fa fa-trash text-danger"
                  onClick={() => handleDelete(val.id)}
                  
                ></i>
              ),
              ViewSignature: (
                <i
                  className="fa fa-search text-primary"
                  onClick={()=>handleOpenImage(val?.DigitalSignature)}
                ></i>
              ),
            }))}
          />
        </div>
      )}
    </div>
  );
}

export default ManageApproval;
