import React, { useEffect, useState } from "react";
import ReactSelect from "../../../formComponent/ReactSelect";
import { GenericReport_Formate } from "../../../../utils/constant";
import { useTranslation } from "react-i18next";

const ReportTypeModal = ({
  payload,
  handleChangeModel,
  setPayload,
  setReportTypeMajor,
}) => {
  const [t] = useTranslation();
  const [values, setValues] = useState(payload);
  // const handleReactSelect = (name, value) => {
  //   console.log(name, value);
  //   setValues((prev) => ({
  //     ...prev,
  //     [name]: value?.value || "",
  //   }));
  // };
  // setPayload(values);

  const handleReactSelect = (name, value) => {
    console.log(name, value);
    setReportTypeMajor(value?.value);
    const updatedValues = {
      ...values,
      [name]: value?.value || "",
    };
  
    setValues(updatedValues);
    setPayload(updatedValues); // ✅ This ensures `payload` is updated when report type changes
  };

  console.log()
  
  // console.log("values" , values)
  useEffect(() => {
    handleChangeModel(values);
  }, [values]);
  return (
    <div className="row">
      <ReactSelect
        placeholderName={t("Report Type")}
        id={"reportType"}
        searchable={true}
        respclass="col-12"
        name={"reportType"}
        dynamicOptions={GenericReport_Formate}
        value={values?.reportType}
        handleChange={handleReactSelect}
      />
    </div>
  );
};

export default ReportTypeModal;
