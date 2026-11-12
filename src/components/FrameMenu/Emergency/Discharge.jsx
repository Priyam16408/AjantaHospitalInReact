import React, { useState } from 'react'
import Heading from '../../UI/Heading'
import { useTranslation } from 'react-i18next'
import DatePicker from '../../formComponent/DatePicker'
import TimePicker from '../../formComponent/TimePicker'
import { DISTCHARGETYPE } from '../../../utils/constant'
import ReactSelect from '../../formComponent/ReactSelect'
import { DischargePatientAPI } from '../../../networkServices/Emergency'
import moment from 'moment'
import { notify } from '../../../utils/utils'

export default function Discharge({ data }) {
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [t] = useTranslation()
    const [values, setValues] = useState({ DATE: new Date(), Time: new Date(), DischargeType: { label: "Normal", value: "Normal" } })

    const handleChange = (e) => {
        const { name, value } = e.target
        setValues((val) => ({ ...val, [name]: value }))
    }

    const DischargePatient = async () => {
        let payload = {
            "transactionID": Number(data?.TID),
            "roomId": String(data?.RoomId),
            "timeOfDischarge": moment(values?.Time).format("HH:mm:ss"),
            "ddlType": String(values?.DischargeType?.value),
            "dischargeType":String(values?.DischargeType?.value),
            "dateOfDischarge": moment(values?.DATE).format("YYYY-MM-DD")
          }
          try {
              let apiResp = await DischargePatientAPI(payload)

              if(apiResp?.success){
                  notify(apiResp?.message,"success" )
              }
              else{
                    notify(apiResp?.message,"error" )
              }

          } catch (error) {
            notify(apiResp?.message,"error" )
          }

    }
    return (
        <>
            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("DialysisPatientDischarge")}</div>} />
                    <div className="row p-2">
                        <ReactSelect
                            placeholderName={t("DischargeType")}
                            className="form-control"
                            id={"DischargeType"}
                            name="DischargeType"
                            dynamicOptions={DISTCHARGETYPE}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.DischargeType?.value}
                            handleChange={(name, value) => setValues((val) => ({ ...val, [name]: value }))}
                        />
                        <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
                            <DatePicker
                                className={`custom-calendar `}
                                
                                respclass="vital-sign-date"
                                id="Date"
                                name="DATE"
                                // inputClassName={"required-fields"}
                                value={values?.DATE ? values?.DATE : new Date()}
                                handleChange={handleChange}
                                lable={t("Date")}
                                placeholder={VITE_DATE_FORMAT}
                            />
                            <TimePicker
                                placeholderName={t("Time")}
                                lable={t("Time")}
                                id="Time"
                                respclass="vital-sign-time ml-1"
                                name="Time"
                                value={values?.Time ? values?.Time : new Date()}
                                handleChange={handleChange}
                            />
                        </div>
                        <div className='col-1'>
                            <button type='button' className='btn btn-sm btn-primary' onClick={DischargePatient}>
                                {t("Discharge")}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
