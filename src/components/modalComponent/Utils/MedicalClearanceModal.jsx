import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ColorCodingSearch from "../../commonComponents/ColorCodingSearch";
import MedicalClearanceModalTable from "../../UI/customTable/billings/MedicalClearanceModalTable";
import Input from "../../formComponent/Input";

const MedicalClearanceModal = ({ getPayloadData,MedDetail }) => {
  const [t] = useTranslation();
  const initialValues = {
    deathover48hrs: "",
  };
  console.log(MedDetail)
  const [payload, setPayload] = useState({ ...initialValues });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };


  console.log(payload);
  const Thead = [
    t("S.No."),
    t("RequisitionDate"),
    t("RequisitionNo"),
    t("ToDepartment"),
    t("View Requisition"),
  ];

  useEffect(() => {
    getPayloadData(payload);
  }, [payload]);
  return (
    <>
      <div className="row">
        <div className="col-sm-12 d-flex align-items-center justify-content-center">
          <ColorCodingSearch label={"Pending"} color="lightblue" />
          <ColorCodingSearch label={"Close"} color="yellowgreen" />
          <ColorCodingSearch label={"Reject"} color="#cb2f2f" />
          <ColorCodingSearch label={"Partial"} color="#FDE76D" />
        </div>
      </div>
      <div className="row mt-2">
        <MedicalClearanceModalTable THEAD={Thead} tbody={MedDetail} />
      </div>
      <div className="row mt-2 d-flex justify-content-center">
        <Input
          type="checkbox"
          name="deathover48hrs"
          checked={payload?.deathover48hrs}
          handleChange={handleChange}
        />
        <label className="ml-2">Check for clearance Medicion / Pharmacy</label>
      </div>
    </>
  );
};

export default MedicalClearanceModal;
