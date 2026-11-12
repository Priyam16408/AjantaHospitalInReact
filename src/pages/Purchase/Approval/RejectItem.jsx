import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import LabeledInput from '../../../components/formComponent/LabeledInput';
import SaveButton from "@components/UI/SaveButton";
import CancelButton from '../../../components/UI/CancelButton';
import { ApprovalGRNAppovalCancel, ApprovalRejectItem } from '../../../networkServices/purchaseDepartment';
import { notify } from '../../../utils/utils';

export default function RejectItem({ handleClose, inputData, getItemsOfPurchaseRq}) {
    const [t] = useTranslation();
    const [inputs, setInputs] = useState(inputData)
    const handlechange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
     const RejectPurchaseRequestItem = async () => {
             try {
               
                let payload = {
                        prDetailID: `${inputs?.PuschaseRequistionDetailID}`,
                        purchaseRequisitionNo: `${inputs?.PurchaseRequisitionNo}`,
                        reasonItem: `${inputs?.reason}`
                    };
                let apiResp = await ApprovalRejectItem(payload);
                if (apiResp?.success) {
                    
                    handleClose()
                  
                    getItemsOfPurchaseRq(inputs?.PurchaseRequisitionNo)
                    //   handleSearchSampleCollection();
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
        <div className="row p-2">
            <div className="col-xl-2 col-md-3 col-sm-6 col-12">
                <LabeledInput
                    label={"PR No."}
                    value={`${inputs.PuschaseRequistionDetailID
                    }`}
                />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6 col-12">
                <LabeledInput
                    label={"Item Name"}
                    value={`${inputs.ItemName}`}
                />
            </div>

            <Input
                type="text"
                className="form-control required-fields"
                id="reason"
                name="reason"
                value={inputs?.reason}
                onChange={handlechange}
                // showTooltipCount={true}
                lable={t("Reason")}

                respclass="col-xl-2 col-md-3 col-sm-6 col-12 mt-2"
            />
        </div>
            <div className="ftr_btn">
                <SaveButton btnName={"Reject Item"} onClick = {RejectPurchaseRequestItem}/>
                <CancelButton
                    cancleBtnName={"Cancel"}
                    onClick={() => handleClose()}
                />
            </div>
         
        </>
    )
}
