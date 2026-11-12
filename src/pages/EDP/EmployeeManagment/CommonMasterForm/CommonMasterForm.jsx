import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";

import EmployeeGroupMaster from "./EmployeeGroupMaster";
import EmployeeTypeMaster from "./EmployeeTypeMaster";
import JobTypeMaster from "./JobTypeMaster";
import DesignationMaster from "./DesignationMaster";
import DepartmentMaster from "./DepartmentMaster";
import DesignationDocumentMaster from "./DesignationDocumentMaster";
import DocumentMaster from "./DocumentMaster";

const CommonMasterForm = () => {
  const [t] = useTranslation();

  const [values, setValues] = useState();

  const [optionValues, setOptionValues] = useState(0);
  console.log("payload", values);

  const handleReactSelect = async (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const options = [
    { label: t("Select"), value: "0" },
    { label: t("Employee Group Master"), value: "1" },
    { label: t("Employee Type Master"), value: "2" },
    // { label: t("InterView Round Master"), value: "3" },
    { label: t("Job Type Master"), value: "3" },
    { label: t("Designation Master"), value: "4" },
    { label: t("Department Master"), value: "5" },
    // { label: t("Designation-Interview Round Mapping"), value: "7" },
    { label: t("Document Master"), value: "6" },
    { label: t("Designation-Document Mapping"), value: "7" },
  ];

  useEffect(() => {
    if (values?.Type?.value == 1) {
      setOptionValues(1);
    } else if (values?.Type?.value == 2) {
      setOptionValues(2);
    } else if (values?.Type?.value == 3) {
      setOptionValues(3);
    } else if (values?.Type?.value == 4) {
      setOptionValues(4);
    } else if (values?.Type?.value == 5) {
      setOptionValues(5);
    } else if (values?.Type?.value == 6) {
      setOptionValues(6);
    } else if (values?.Type?.value == 7) {
      setOptionValues(7);
    }
  }, [values?.Type]);
  return (
    <div className="card">
      <Heading title={t("Common Master Form")} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Type")}
          id={"Type"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={options}
          name="Type"
          handleChange={(name, e) => handleReactSelect(name, e)}
          value={values?.Type}
        />

        {optionValues === 1 && <EmployeeGroupMaster />}
        {optionValues === 2 && <EmployeeTypeMaster />}
        {optionValues === 3 && <JobTypeMaster />}
        {optionValues === 4 && <DesignationMaster />}
        {optionValues === 5 && <DepartmentMaster />}
        {optionValues === 6 && <DocumentMaster />}
        {optionValues === 7 && <DesignationDocumentMaster />}
      </div>
    </div>
  );
};

export default CommonMasterForm;
