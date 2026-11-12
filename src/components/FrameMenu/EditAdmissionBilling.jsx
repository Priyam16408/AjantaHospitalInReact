import React from "react";
import IPDAdmissionNew from "../../pages/Billing/IPD/IPDAdmissionNew";

const EditAdmissionBilling = ({ data }) => {
  console.log(data);
  return <IPDAdmissionNew  data={data} />;
};

export default EditAdmissionBilling;
