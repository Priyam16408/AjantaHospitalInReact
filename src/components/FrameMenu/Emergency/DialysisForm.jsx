import React, { useEffect, useState } from 'react'
import DatePicker from '../../formComponent/DatePicker'
import Heading from '../../UI/Heading';
import Input from '../../formComponent/Input';
import TextAreaInput from '../../formComponent/TextAreaInput';
import { bindDialysisFormListAPI, dialysisFormDeleteAPI, handleSaveDialysisAPI } from '../../../networkServices/Emergency';
import { notify, SaveDialysisPayload } from '../../../utils/utils';
import Tables from '../../UI/customTable';
import { useTranslation } from 'react-i18next';

export default function DialysisForm({ data }) {

    const thead = [
        "SRNO",
        "Dialysis_NO",
        "DialysisReUse",
        "Weight_pre",
        "Weight_post",
        "Weight_gain",
        "Temp_pre",
        "Temp_post",
        "Bp_pre",
        "Bp_post",
        "Hemparn_administered",
        "Duration_Ofhd",
        "ufr_tmp",
        "Venous_pressure",
        "Blood_flow",
        "miscellaneous",
        "Edit",
        "Delete",
    ]
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [values, setValues] = useState({ EntryDate: new Date(),saveType:"Save" })
    const [tBody, setTbody] = useState([])
    const handleChange = (e) => {
        const { name, value } = e.target
        setValues((val) => ({ ...val, [name]: value }))
    }
    const {t} =useTranslation()

    const handleSaveDialysis = async () => {
        if(!values?.miscellaneous){
            notify("Miscellaneous Field Is Required","error")
            return false
        }
        let payload = SaveDialysisPayload(values, data)
        let apiResp = await handleSaveDialysisAPI(payload)
        if(apiResp?.success){
            notify(apiResp?.message,"success")
            getDialysisFormList()
            setValues({ EntryDate: new Date(),saveType:"Save"})
        }else{
            notify(apiResp?.message,"error")
        }
    }

    const getDialysisFormList = async () => {
        let apiResp = await bindDialysisFormListAPI(data?.TID)
        if (apiResp?.success) {
            setTbody(apiResp?.data)
        } else {
            setTbody([])
        }
    }

    useEffect(() => {
        getDialysisFormList()
    }, [])


    const handleEditDialysis = (index)=>{
        let data = tBody[index]
        setValues({...data, saveType:"",EntryDate:new Date(data?.EntryDate)})
    }

        
    
    const handleDeleteDialysis = async(index)=>{
        let data = tBody[index]
        let apiResp = await dialysisFormDeleteAPI(String(data?.UID))
        if(apiResp?.success){
            getDialysisFormList()
            notify(apiResp?.message,"success")
        }else{
            notify(apiResp?.message,"error")
        }

    }



    return (
        <>
            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("DialysisForm")}</div>} />
                    <div className="row p-2">
                        <DatePicker
                            className={`custom-calendar `}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            id="Date"
                            name="EntryDate"
                            // inputClassName={"required-fields"}
                            value={values?.EntryDate ? values?.EntryDate : new Date()}
                            handleChange={handleChange}
                            lable={t("Date")}
                            placeholder={VITE_DATE_FORMAT}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="Dialysis_NO"
                            name="Dialysis_NO"
                            value={values?.Dialysis_NO ? values?.Dialysis_NO : ""}
                            onChange={handleChange}
                            lable={t("DialysisNo")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="Dialyzer_Reuse"
                            name="Dialyzer_Reuse"
                            value={values?.Dialyzer_Reuse ? values?.Dialyzer_Reuse : ""}
                            onChange={handleChange}
                            lable={t("DialyzerReUse")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="Hemparn_administered"
                            name="Hemparn_administered"
                            value={values?.Hemparn_administered ? values?.Hemparn_administered : ""}
                            onChange={handleChange}
                            lable={t("Hemparn_administered")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="Duration_Ofhd"
                            name="Duration_Ofhd"
                            value={values?.Duration_Ofhd ? values?.Duration_Ofhd : ""}
                            onChange={handleChange}
                            lable={t("Duration_Ofhd")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="ufr_tmp"
                            name="ufr_tmp"
                            value={values?.ufr_tmp ? values?.ufr_tmp : ""}
                            onChange={handleChange}
                            lable={t("ufr_tmp")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="Venous_pressure"
                            name="Venous_pressure"
                            value={values?.Venous_pressure ? values?.Venous_pressure : ""}
                            onChange={handleChange}
                            lable={t("Venous_pressure")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="Blood_flow"
                            name="Blood_flow"
                            value={values?.Blood_flow ? values?.Blood_flow : ""}
                            onChange={handleChange}
                            lable={t("Blood_flow")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />

                        <TextAreaInput
                            lable={t("miscellaneous")}
                            className="w-100 required-fields"
                            id="Miscellaneous"
                            rows={2}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            name="miscellaneous"
                            value={values?.miscellaneous ? values?.miscellaneous : ""}
                            onChange={handleChange}
                        />

                        <div className="mt-2  text-right pb-1">
                            <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button" type="button" onClick={handleSaveDialysis} >
                            {t(values?.saveType === "Save" ? "Save" : "Update")}                            </button>
                        </div>
                        <div className="mt-2  text-right pb-1">
                            <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button" type="button" 
                            >
                               {t("Report")} 
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("DialysisDetails")}</div>} />

                    <Tables
                        thead={thead}
                        // tbody={[{ name: "as" }]}
                    tbody={tBody?.map((val, index) => ({
                        sno: index+1,
                        Dialysis_NO: val?.Dialysis_NO,
                        Dialyzer_Reuse: val?.Dialyzer_Reuse,
                        Weight_pre: val?.Weight_pre,
                        Weight_post: val?.Weight_post,
                        Weight_gain: val?.Weight_gain,
                        Temp_pre: val?.Temp_pre,
                        Temp_post: val?.Temp_post,
                        Bp_pre: val?.Bp_pre,
                        Bp_post: val?.Bp_post,
                        Hemparn_administered: val?.Hemparn_administered,
                        Duration_Ofhd: val?.Duration_Ofhd,
                        ufr_tmp: val?.ufr_tmp,
                        Venous_pressure: val?.Venous_pressure,
                        Blood_flow: val?.Blood_flow,
                        miscellaneous: val?.miscellaneous,
                        edit: <i className="fa fa-edit text-center" aria-hidden="true" onClick={() => { handleEditDialysis(index) }}></i>,
                       

                        Remove: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { handleDeleteDialysis(index) }}></i>,
                    }))}
                    />

                </div>
            </div>

        </>
    )
}
