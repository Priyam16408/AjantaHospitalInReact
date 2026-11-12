import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import SaveButton from "@components/UI/SaveButton";
import CancelButton from '../../../../components/UI/CancelButton';
import { PurchaseOrderApprovalRejectPurchaseOrder } from '../../../../networkServices/purchaseDepartment';
import { notify } from '../../../../utils/utils';
import TextAreaInput from '../../../../components/formComponent/TextAreaInput';

const RejectModal = ({ handleClose, inputData, getPurchaseOrder })=>{
    const [t] = useTranslation();
    const [inputs, setInputs] = useState(inputData)
    const handlechange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
  
     const RejectPurchaseOrder = async () => {
    try {
                let payload = {
                   
                    purchaseOrderNumber: inputs?.PurchaseOrderNo,
                    remark: `${inputs.reason}`
                };
               
                let apiResp = await PurchaseOrderApprovalRejectPurchaseOrder(payload);
                if (apiResp?.success) {
                   
                    handleClose();
                    getPurchaseOrder()
                    notify(apiResp?.message, "success");
                }
                else{
                    notify(apiResp?.message, "error");
                }
             } catch (error) {
                console.log(apiResp?.message);
                console.log(error);
                notify(apiResp?.message, "error");
             }
           
        };

    return (<>
        <div className="row p-2 ">
           

            <TextAreaInput
              
            lable={t("Reason")}
            className=" required-fields"
            id="reason"
            rows={4}
            name="reason"
            value={inputs?.reason ? inputs?.reason : ""}
            onChange={handlechange}
            maxLength={1000}
            respclass="col-12"
            />
        </div>
            <div className="ftr_btn">
                <SaveButton btnName={"Save"} 
                onClick = {RejectPurchaseOrder}
                />
                <CancelButton
                    cancleBtnName={"Cancel"}
                onClick={() => handleClose()}
                />
            </div>
         
        </>
    )
}

export default RejectModal;
