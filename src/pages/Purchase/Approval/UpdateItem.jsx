import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import LabeledInput from '../../../components/formComponent/LabeledInput';
import SaveButton from "@components/UI/SaveButton";
import CancelButton from '../../../components/UI/CancelButton';
import {  ApprovalUpdatePurchaseApproval } from '../../../networkServices/purchaseDepartment';
import { notify } from '../../../utils/utils';

import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';

export default function UpdateItem({ handleClose, inputData, getItemsOfPurchaseRq }) {
    const [t] = useTranslation();

    const ip = useLocalStorage("ip","get")
    const {employeeID} = useLocalStorage("userData","get")

    const [inputs, setInputs] = useState(inputData)
    const handlechange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
    }

     const updateItemReq = async () => {
             try {
                console.log("👌😒",inputs)
                
                let payload = {
                    empID: employeeID,
                    prDetailID: inputs?.PuschaseRequistionDetailID,
                    approvedQty: parseInt(inputs.approvedQty),
                    ipAddress: ip,
                  };
                let apiResp = await ApprovalUpdatePurchaseApproval(payload);
                if (apiResp?.success) {
                    handleClose()
                    //   handleSearchSampleCollection();
                    getItemsOfPurchaseRq(inputs?.PurchaseRequisitionNo)
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
                    value={`${inputs.PurchaseRequisitionNo}`}
                />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <LabeledInput
                    label={"Item Name"}
                    value={`${inputs.ItemName}`}
                />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6 col-12 mt-2">
            <LabeledInput
                    label={"Available Qty"}
                    value={`${0}`}
                />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-6 col-12 mt-2">
                <LabeledInput
                    label={"Requested Qty"}
                    value={`${inputs.RequestedQty}`}
                />
            </div>

            <Input
                type="number"
                className="form-control required-fields"
                id="approvedQty"
                name="approvedQty"
                value={inputs?.reason}
                onChange={handlechange}
                // showTooltipCount={true}
                lable={t("Approved Qty")}

                respclass="col-xl-2 col-md-3 col-sm-6 col-12 mt-2"
            />
        </div>
            <div className="ftr_btn">
                <SaveButton btnName={"Update"} onClick = {updateItemReq}/>
                <CancelButton
                    cancleBtnName={"Cancel"}
                    onClick={() => handleClose()}
                />
            </div>
         
        </>
    )
}
