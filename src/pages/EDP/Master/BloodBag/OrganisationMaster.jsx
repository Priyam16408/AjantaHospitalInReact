import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  EDPBindDataOrganisationAPI,
  EDPBindMappedBloodGroupAPI,
  EDPBloodBankMasterUpdateOrganisationAPI,
  EDPDeleteMapBloodGroupAPI,
  EDPSaveMapBloodGroupAPI,
  EDPSaveOrganisationAPI,
  EDPValidateOrganisationAPI,
} from "../../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import Tables from "../../../../components/UI/customTable";
import WrapTranslate from "../../../../components/WrapTranslate";
import { handleOrganisationPayload, notify } from "../../../../utils/ustil2";
import Input from "../../../../components/formComponent/Input";

export default function OrganisationMaster({ data }) {
  const initialState = {
    Active: { label: "Active", value: "1" },
    type: "save",
  };
  const thead = [
    { name: "S.No." },
    { name: "Organisaction" },
    { name: "Address" },
    { name: "City" },
    { name: "State" },
    { name: "PinCode" },
    { name: "PhoneNo" },
    { name: "MobileNo" },
    { name: "FaxNo" },
    { name: "EmailID" },
    { name: "Active" },
    { name: "Edit" },
  ];
  const [values, setValues] = useState(initialState);
  console.log("values", values);
  const [bodyData, setBodyData] = useState([]);
  const [t] = useTranslation();

  const handleSelect = (nane, value) => {
    if (nane === "FromBloodGroup") {
      bindMappedBloodGroupList(value.label);
    }
    setValues((val) => ({ ...val, [nane]: value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const BindDataOrganisation = async () => {
    let apiResp = await EDPBindDataOrganisationAPI();
    if (apiResp?.success) {
      setBodyData(apiResp?.data);
    } else {
      setBodyData([]);
    }
  };

  const handleEdit = async (val) => {
    console.log("val", val);
    setValues({
      id: val?.Id,
      Name: val?.Organisaction,
      Address: val?.Address,
      City: val?.City,
      State: { label: val?.State, value: val?.State },
      Pincode: val?.PinCode,
      PhoneNo: val?.PhoneNo,
      MobileNo: val?.MobileNo,
      FaxNo: val?.FaxNo,
      Email: val?.EmailID,
      Active: {
        label: val?.IsActive === "NO" ? "NO" : "YES",
        value: val?.IsActive === "NO" ? "0" : "1",
      },
      type: "update",
    });
  };
  const bindMappedBloodGroupList = async (id) => {
    let apiResp = await EDPBindMappedBloodGroupAPI(id);
    if (apiResp?.success) {
      setBodyData(apiResp?.data);
    } else {
      setBodyData([]);
    }
  };
  const SaveOrganisation = async () => {
    if (!values?.Name) {
      notify("Please enter Organisation Name", "error");
      return;
    }
    //  else if (!values?.State?.value) {
    //   notify("Please select State", "error");
    //   return;
    // }
    const type = "save";
    const payload = handleOrganisationPayload(values, type);
    let apiResp = await EDPSaveOrganisationAPI(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      setValues(initialState);
      BindDataOrganisation();
    } else {
      notify(apiResp?.message, "error");
    }
  };
  const UpdateOrganisation = async () => {
    if (!values?.Name) {
      notify("Please enter Organisation Name", "error");
      return;
    }
    // else if (!values?.State?.value) {
    //   notify("Please select State", "error");
    //   return;
    // }
    const type = "update";
    const payload = handleOrganisationPayload(values, type);
    let apiResp = await EDPBloodBankMasterUpdateOrganisationAPI(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      setValues(initialState);
      BindDataOrganisation();
    } else {
      notify(apiResp?.message, "error");
    }
  };
  useEffect(() => {
    BindDataOrganisation();
  }, []);
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={data?.breadcrumb}
          data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />

        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields"
            name="Name"
            value={values?.Name ? values?.Name : ""}
            onChange={handleChange}
            lable={t("Name")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            name="Address"
            value={values?.Address ? values?.Address : ""}
            onChange={handleChange}
            lable={t("Address")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            name="City"
            value={values?.City ? values?.City : ""}
            onChange={handleChange}
            lable={t("City")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("State")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            requiredClassName={"required-fields"}
            name="State"
            removeIsClearable={true}
            dynamicOptions={[]}
            handleChange={handleSelect}
            value={`${values?.State?.value}`}
          />

          <Input
            type="text"
            className="form-control"
            name="Pincode"
            value={values?.Pincode ? values?.Pincode : ""}
            onChange={handleChange}
            lable={t("Pincode")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            name="PhoneNo"
            value={values?.PhoneNo ? values?.PhoneNo : ""}
            onChange={handleChange}
            lable={t("Phone No.")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            name="MobileNo"
            value={values?.MobileNo ? values?.MobileNo : ""}
            onChange={handleChange}
            lable={t("Mobile No.")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            name="FaxNo"
            value={values?.FaxNo ? values?.FaxNo : ""}
            onChange={handleChange}
            lable={t("Fax No.")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            name="Email"
            value={values?.Email ? values?.Email : ""}
            onChange={handleChange}
            lable={t("Email")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Active")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="Active"
            removeIsClearable={true}
            dynamicOptions={[
              { label: "Yes", value: "1" },
              { label: "No", value: "0" },
            ]}
            handleChange={handleSelect}
            value={`${values?.Active?.value}`}
          />

          <button
            className="btn btn-sm btn-success px-4 ml-2"
            type="button"
            onClick={
              values?.type === "save" ? SaveOrganisation : UpdateOrganisation
            }
          >
            {t(values?.type === "save" ? "Save" : "Update")}
          </button>
          {values?.type != "save" && (
            <button
              className="btn btn-sm btn-success px-4 ml-2"
              type="button"
              onClick={() => {
                setValues(initialState);
              }}
            >
              {t("Cancel")}
            </button>
          )}
        </div>

        <Tables
          thead={WrapTranslate(thead, "name")}
          tbody={bodyData?.map((val, index) => ({
            SNo: index + 1,
            Organisaction: val?.Organisaction,
            Address: val?.Address,
            City: val?.City,
            State: val?.State,
            PinCode: val?.PinCode,
            PhoneNo: val?.PhoneNo,
            MobileNo: val?.MobileNo,
            FaxNo: val?.FaxNo,
            EmailID: val?.EmailID,
            IsActive: val?.IsActive,
            Edit: (
              <i className="fa fa-edit" onClick={() => handleEdit(val)}></i>
            ),
          }))}
        />
      </div>
    </div>
  );
}
