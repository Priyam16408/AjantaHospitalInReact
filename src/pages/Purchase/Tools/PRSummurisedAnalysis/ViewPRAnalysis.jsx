import React from 'react'

import { useTranslation } from "react-i18next";
import Tables from '../../../../components/UI/customTable';
const ViewPRAnalysis = ({response}) => {
   const [t] = useTranslation();
console.log("response",response)
const THEAD = [
  { width: "5%", name:  t("S No.") },
  { width: "10%", name: t("GRN Item Name") },
 
  { width: "10%", name: t("GRN Qty") },
  { width: "5%", name: t("PO Approve Qty") },
  { width: "10%", name: t("PO Number") },
  { width: "10%", name: t("PR ID") },
  { width: "5%", name: t("Purchase Requisition No") },
  { width: "5%", name: t("Reference No") },
  
];
    
  return (
    <div>
      {response?.length > 0 && (
        <div className="patient_registration card">
          <div className="row">
            <div className="col-12">
              <Tables
                thead={THEAD}
                tbody={response?.map((val, ind) => ({
                  Sno: ind + 1 || "",
                  GRNItemName: val?.Item,
              
                  GRNQty: val?.GRNQty?val?.GRNQty:"0",
                  POApproveQty: val?.POApproveQty?val?.POApproveQty : "0",
                  PONumber: val?.PONumber,
                  PRID: val?.PRID,
                  PurchaseRequisitionNo: val?.PurchaseRequisitionNo,
                  ReferenceNo: val?.ReferenceNo,
                }))}
                />
              </div>
            </div>
          </div>
       
      )}
    </div>
  )
}

export default ViewPRAnalysis