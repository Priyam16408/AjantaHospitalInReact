import React, { useEffect, useState } from 'react'
import Heading from '../../UI/Heading'
import { useTranslation } from 'react-i18next'
import { DISTCHARGETYPE } from '../../../utils/constant'
import ReactSelect from '../../formComponent/ReactSelect'
import { bindEmergencyRoomBed, bindEmergencyRoomType, DischargePatientAPI, shiftEmergencyBedAPI } from '../../../networkServices/Emergency'
import { notify, reactSelectOptionList } from '../../../utils/utils'
import LabeledInput from '../../formComponent/LabeledInput'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import { useLocation } from 'react-router-dom';


export default function BedShift({ data }) {
    const [t] = useTranslation()
    const [values, setValues] = useState({ Room: data?.Room, CurrentBed: "", RoomType: { label: "", value: "" }, BedNo: { label: "", value: "" } })

    let ip = useLocalStorage("ip", "get");
    const location = useLocation();


    const [room, setRoom] = useState({ roomList: [], bedList: [] })

    const bindRoom = async () => {
        try {
            const apiResp = await bindEmergencyRoomType()
            if (apiResp?.success) {
                setRoom((val) => ({ ...val, roomList: reactSelectOptionList(apiResp?.data, "Name", "IPDCaseTypeID") }))
            }
        } catch (error) {
            console.log("errr", error)
        }
    }

    useEffect(() => {
        bindRoom()
    }, [])

    // console.log("ASdasdas", data)

    const ShiftRoom = async () => {
        let payload = {
            "tid": String(data?.TID),
            "ltnxNo": String(data?.LTnxNo),
            "oldRoomId": String(data?.RoomId),
            "newRoomType": String(values?.RoomName?.value),
            "newRoomId": Number(values?.BedNo?.value),
            "doctorId": String(data?.DoctorID),
            "panelId": String(data?.PanelID),
            "pageURL": location.pathname,
            "ipAddress": ip
        }
        let apiResp = await shiftEmergencyBedAPI(payload)
        notify(apiResp?.message, apiResp?.success ? "success" : "error")
        if (apiResp?.success) {
            setValues({Room: apiResp?.data?.Room })
        }

    }

    const hanldeSelect = async (name, value) => {
        try {
            setValues((val) => ({ ...val, [name]: value }))
            let apiResp = await bindEmergencyRoomBed(value)
            if (apiResp?.success) {
                setRoom((val) => ({ ...val, bedList: reactSelectOptionList(apiResp?.data, "Name", "RoomID") }))
            }
        } catch (error) {

        }
    }
    return (
        <>
            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("DialysisPatientDischarge")}</div>} />
                    <div className="row p-2">

                        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                            <LabeledInput
                                label={t("CurrentBed")}
                                value={values?.Room}
                            />
                        </div>

                        <ReactSelect
                            placeholderName={t("RoomType")}
                            className="form-control"
                            id={"RoomName"}
                            name="RoomName"
                            dynamicOptions={room?.roomList}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.RoomName?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <ReactSelect
                            placeholderName={t("RoomBedNo")}
                            className="form-control"
                            id={"BedNo"}
                            name="BedNo"
                            dynamicOptions={room?.bedList}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.BedNo?.value}
                            handleChange={(name, value) => setValues((val) => ({ ...val, [name]: value }))}
                        />

                        <div className='col-1'>
                            <button type='button' className='btn btn-sm btn-primary' onClick={ShiftRoom}>
                                {t("Save")}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
