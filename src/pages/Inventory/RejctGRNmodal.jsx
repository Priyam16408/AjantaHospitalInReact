import React, { useState } from 'react'
import TextAreaInput from '../../components/formComponent/TextAreaInput';
import { GRNCancel } from '../../networkServices/InventoryApi';
import { notify } from '../../utils/ustil2';
import { useTranslation } from 'react-i18next';


const RejctGRNmodal = ({value, store ,setModalState}) => {

    const [payload, setPayload] = useState({
        remarks: "",
    });

    const [t] = useTranslation();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload({
          ...payload,
          [name]: value,
        });
      };

    const rejectGRN = async () => {
        // debugger
        const payloadIsGRNPost = {
            "gateNo": value?.GateNo,
            "cancelReason": payload?.remarks,
            "storeType": store
        }
        try {
            const response = await GRNCancel(payloadIsGRNPost);
            if (response?.success) {
                notify("GRN has been rejected successfully.", "success");
                setModalState(false)
                setPayload({
                    remarks: "",
                });
            }
            else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(response?.message, "error");
        }
    };

    return (
        <div>
           
            <TextAreaInput
                lable={t(
                    "Remarks"
                )}
                // placeholder="Remarks"
                className="w-100 required-fields"
                id="remarks"
                name="remarks"
                rows={3}
                value={payload?.remarks}
                maxLength={200}
                onChange={handleChange}
            />
            <div className="d-flex  justify-content-end mt-4">

                <button className="btn btn-primary" onClick={() => rejectGRN()}>
                    {t("Reject")}
                </button>
            </div>
        </div>
    )
}

export default RejctGRNmodal