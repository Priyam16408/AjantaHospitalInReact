import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import SaveButton from "@components/UI/SaveButton";
import { notify } from '../../../../utils/utils';

import { PrescriptionAdviceGiveVaccineToChild } from '../../../../networkServices/DoctorApi';
import DatePicker from '../../../../components/formComponent/DatePicker';
import TextAreaInput from '../../../../components/formComponent/TextAreaInput';

const UpdateGivenDateModal = ({ handleClose, inputData, getChildVaccination }) => {
    const [t] = useTranslation();
    const [values, setValues] = useState({
        givenDate: new Date(),
        Remarks: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    }


    const updateGivenDate = async () => {

        // console.log("the modal input in rejectPurs",modalInput)
        try {

            // debugger
            let payload = {...inputData,givenDate:values?.givenDate,Remarks:values?.Remarks};



            //   debugger
            let apiResp = await PrescriptionAdviceGiveVaccineToChild(payload);
            if (apiResp?.success) {
           
                handleClose();
                
               console.log(payload)
                notify(apiResp?.message, "success");
                getChildVaccination()
            }
            else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.log(apiResp?.message);
            console.log(error);
            notify(apiResp?.message, "error");
        }

      
    };

    // console.log(inputData)

    return (<>
        <div className=" ">

            <DatePicker
                className="custom-calendar"
                placeholder=""
                lable="Select Given Date"
                // respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                name="givenDate"
                id="Date"
                value={values?.givenDate}
                showTime
                hourFormat="12"
                handleChange={handleChange}
            />

        </div>
        <TextAreaInput
            lable={t("Remarks")}
            className=" required-fields"
            // id="reason"
            rows={4}
            name="Remarks"
            value={values?.Remarks ? values?.Remarks : ""}
            onChange={handleChange}
            maxLength={1000}
            respclass="col-12"
        />
        <div className="ftr_btn">
            <SaveButton btnName={"Save"}
                onClick={updateGivenDate}
            />

        </div>

    </>
    )
}

export default UpdateGivenDateModal;
