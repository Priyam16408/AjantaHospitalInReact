import React, { useState, useEffect } from "react"; 
import { useTranslation } from "react-i18next"; 
import moment from "moment";  
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect"; 
import { notify } from "../../../utils/utils";
import { SaveNewInvestigation } from "../../../networkServices/edpApi";
// import { SaveNewInvestigation } from "../../../networkServices/EDP/karanedp";
const { VITE_DATE_FORMAT } = import.meta.env;

function CreateLab() {
  const [t] = useTranslation(); 
  const genderType = [
    { value: "B", label: "Both" },
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
  ];

  const pathNumeric = [
    { value: "1", label: "Path Numeric" },
    { value: "3", label: "Path RichText" },
    { value: "5", label: "Radiology" },
    { value: "7", label: "Culture Report" },
  ];

  const TypeSelect = [
    { value: "R", label: "Sample Required" },
    { value: "N", label: "Sample Not Required" },
  ];
 

  const sampleCol = [
    { value: "1", label: "Normal" },
    { value: "7", label: "Slide" },
    { value: "8", label: "Block" },
  ];

  const IsDiscountable = [
    { value: "1", label: "No" },
    { value: "0", label: "Yes" },
  ];

  const RateEditable = [
    { value: "1", label: "No" },
    { value: "0", label: "Yes" },
  ];

  const Anatomic = [
    { value: "0", label: "Select" },
    { value: "6", label: "Movements" },
    { value: "8", label: "Left Hand Side" },
    { value: "7", label: "Neck regions" },
    { value: "9", label: "serd" },
  ];

  const OhterInformation = [
    { value: "0", label: "Show Name in Patient Report" },
    { value: "6", label: "Show in Online Report" },
    { value: "8", label: "Print Separate" },
    { value: "7", label: "PrintSampleName" },
    { value: "9", label: "IsCulture" },
  ];

  
  const ip= localStorage.getItem("ip"); 

  const initialValues = {
    department: "",
    anatomicSite: "",
    rateEditable: "",
    cptCode: "",
    isDiscountable: "",
    sampleCon: "",
    sampleType: "",
    printSequence: "",
    type: "",
    reportType: "",
    gender: "",
    method: "",
    description: "",
    IsCulture: "",
    investigation: "",
    Anatomic: "",
    IsDiscountable: "",
    Department: "",
    Sample: "",
    TypeSelect: "",
    PrintSampleName: "",
  };

  const [values, setValues] = useState(initialValues);
 
 
  const handleSave = async () => {
    const payload = {
      saveNewInvestigation: {
        invName: values?.investigation,
        description: values?.description,
        departmentID: values?.department?.value,
        departmentName: values?.department?.label,
        reportType: values?.reportType?.value,
        sampleType: values?.sampleType?.value,
        printSequence: "string",
        gender: values?.gender?.value,
        principle: "string",
        sampletypename: "string",
        cptCode: values?.cptCode,
        outsource: "",
        rateEditable: values?.rateEditable?.value,
        isUrgent: 0,
        showPtRpt: 0,
        showOnlineRpt: 0,
        printSeperate: 0,
        printSampleName: 0,
        deptID: 0,
        isDiscountable: 0,
        sampleTypeID: "string",
        isCulture: values?.IsCulture?.value,
        sampleContainer: values?.sampleCon?.value,
        anatomicSiteID: values?.Anatomic?.value,
      },
      ipAddress: ip,
    };

    try {
      const apiResp = await SaveNewInvestigation(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success"); 
        setValues(initialValues);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };                               

  

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value })); 
  }; 
  return (
    <>
      <div className=" spatient_registration_card card">
        <Heading  
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={[
            //   { value: "0", label: "ALL" },
            //   ...handleReactSelectDropDownOptions(
            //     departmentData,
            //     "Name",
            //     "ObservationType_ID"
            
            //   ),
            // ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          /> 
          <ReactSelect
            placeholderName={t("Sub.Dep")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={[
            //   { value: "0", label: "ALL" },
            //   ...handleReactSelectDropDownOptions(
            //     departmentData,
            //     "Name",
            //     "ObservationType_ID"
            //   ),
            // ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />
          <Input
            type="text"
            className="form-control"
            id="investigation"
            placeholder=" "
            name="investigation"
            value={values?.investigation || ""}
            onChange={handleChange}
            lable={t("Investigation")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="description"
            name="description"
            value={values?.description || ""}
            onChange={handleChange}
            lable={t("Description")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="method"
            name="method"
            value={values?.method || ""}
            onChange={handleChange}
            lable={t("Method")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> 
          {/* Gender */}
          <ReactSelect
            placeholderName={t("Gender")}
            id={"gender"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={genderType}
            handleChange={handleSelect}
            value={`${values?.gender?.value}`}
            name={"gender"}
          />

          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={pathNumeric}
            handleChange={handleSelect}
            value={`${values?.reportType?.value}`}
            name={"reportType"}
          />

          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={TypeSelect}
            handleChange={handleSelect}
            value={`${values?.type?.value}`}
            name={"type"}
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="printSequence"
            name="printSequence"
            value={values?.printSequence || ""}
            onChange={handleChange}
            lable={t("Print Sequence")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Sample Type")}
            id={"sampleType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={[
            //   { value: "0", label: "ALL" },
            //   ...handleReactSelectDropDownOptions(
            //     departmentData,
            //     "Name",
            //     "ObservationType_ID"
            //   ),
            // ]}
            handleChange={handleSelect}
            value={`${values?.sampleType?.value}`}
            name={"sampleType"}
          />

          <ReactSelect
            placeholderName={t("Sample Con")}
            id={"sampleCon"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={sampleCol}
            handleChange={handleSelect}
            value={`${values?.sampleCon?.value}`}
            name={"sampleCon"}
          />

          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={[
            //   { value: "0", label: "ALL" },
            //   ...handleReactSelectDropDownOptions(
            //     departmentData,
            //     "Name",
            //     "ObservationType_ID"
            //   ),
            // ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />

          <ReactSelect
            placeholderName={t("IsDiscountable")}
            id={"isDiscountable"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={IsDiscountable}
            handleChange={handleSelect}
            value={`${values?.isDiscountable?.value}`}
            name={"isDiscountable"}
          />   

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="cptCode"
            name="cptCode"
            value={values?.cptCode || ""}
            onChange={handleChange}
            lable={t("CPT Code")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          {/* Rate Editable */}

          <ReactSelect
            placeholderName={t("Rate Editable")}
            id={"rateEditable"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={RateEditable}
            handleChange={handleSelect}
            value={`${values?.rateEditable?.value}`}
            name={"rateEditable"}
          />


          <ReactSelect
            placeholderName={t("Anatomic Site")}
            id={"anatomicSite"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Anatomic}
            handleChange={handleSelect}
            value={`${values?.anatomicSite?.value}`}
            name={"anatomicSite"}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSave} 
            >
              {t("Save" )}
            </button>
          </div>
        </div>
      </div> 
    </>
  );
}

export default CreateLab;
