import React from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";

const MedicineReturn = () => {
  const [t] = useTranslation();
  return (
    <>
      <ReactSelect
        placeholderName={t("Department")}
        searchable={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
        id={"Department"}
        name={"Department"}
        // value={payload?.Type}
        // handleChange={handleReactSelect}
        // dynamicOptions={TypeOptions}
      />
    </>
  );
};

export default MedicineReturn;
