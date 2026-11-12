import React, { useState } from 'react'
import Heading from '../../UI/Heading'
import ColorCodingSearch from '../../commonComponents/ColorCodingSearch'
import ReactSelect from '../../formComponent/ReactSelect'
import { handleReactSelectDropDownOptions, notify } from '../../../utils/utils'
import { INVESTIGATION_VIEW } from '../../../utils/constant'
import Tables from '../../UI/customTable'
import DatePicker from '../../formComponent/DatePicker'
import { BindInvestigationViewList } from '../../../networkServices/Emergency'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

export default function InvestigationView({ data }) {
    const [values, setValues] = useState({ Type: { value: "ALL" }, fromDate: new Date(), toDate: new Date() })
    const [tBody, setTBody] = useState([])
    const {t}=useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
    const isMobile = window.innerWidth <= 800;

    const handleChangeCheckboxHeader = (e) => {
        let data = tBody?.map((val) => {
            val.isChecked = e?.target?.checked
            return val
        })
        setTBody(data)
    }
    const thead = [
        { width: "1%", name: !isMobile ? <input type="checkbox" style={{ "marginLeft": "3px" }} onChange={(e) => { handleChangeCheckboxHeader(e) }} /> : "Check" },
        { name: "Delta Check" },
        "Date",
        "Barcode No",
        "Department",
        "Investigations",
        "Pacs Images",
    ]



    const hanldeSelect = async (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }

    const InvestigationViewList = async (status) => {
        // let payload = {
        //     "pid": "AM24-07270001",
        //     "status": "",
        //     "fromDate": "2024-09-18",
        //     "toDate": "2024-11-21",
        //     "labDepartmentType": "ALL"
        // }
        let payload = {
            "pid": data?.PatientID,
            "status": status,
            "fromDate": moment(values?.fromDate).format("yyyy-MM-DD"),
            "toDate": moment(values?.toDate).format("yyyy-MM-DD"),
            "labDepartmentType": String(values?.Type?.value)
        }

        let apiResp = await BindInvestigationViewList(payload)
        if (apiResp?.success) {
            let tableList = apiResp?.data?.map((val) => {
                val.isChecked = false
                return val
            })
            setTBody(tableList)
        } else {
            setTBody([])
            notify(apiResp?.message, "error")
        }

    }

    const getRowClass = (val, index) => {
        let data = tBody[index]

        if (data?.Status === "SN") {
            return "statusEmergency";
        }
        if (data?.Status === "RN") {
            return "statusIsPaid";
        }
        if (data?.Status === "SC") {
            return "statusDocOut";
        }
        if (data?.Status === "NA") {
            return "CreditPanelLimitOver";
        }
        if (data?.Status === "A") {
            return "LightGreen";
        }
    };

    return (
        <>
            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("InvestigationResult")}</div>}
                        secondTitle={<>
                            <ColorCodingSearch label={'Test Prescribed'} color="#f5f3b2" onClick={() => { InvestigationViewList("SN") }} cursor="pointer" />
                            <ColorCodingSearch label={'Sample Collected'} color="#f5c6f7" onClick={() => { InvestigationViewList("RN") }} cursor="pointer" />
                            <ColorCodingSearch label={'Department Received'} color="#c6eea7" onClick={() => { InvestigationViewList("SC") }} cursor="pointer" />
                            <ColorCodingSearch label={'Not Approved'} color="#ffbfbf" onClick={() => { InvestigationViewList("NA") }} cursor="pointer" />
                            <ColorCodingSearch label={'Approved'} color="LightGreen" onClick={() => { InvestigationViewList("A") }} cursor="pointer" />

                        </>
                        }

                    />
                    <div className="row p-2">
                        <ReactSelect
                            placeholderName={t('Type')}
                            className="form-control"
                            id={"Type"}
                            name="Type"
                            removeIsClearable={true}
                            dynamicOptions={INVESTIGATION_VIEW}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            requiredClassName={"required-fields"}
                            value={values?.Type?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <DatePicker
                            className="custom-calendar"
                            id="fromDate"
                            name="fromDate"
                            lable={t("FromDate")}
                            value={moment(values?.fromDate).toDate()}
                            handleChange={(e) => { hanldeSelect("fromDate", e.target.value) }}
                            placeholder={VITE_DATE_FORMAT}
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                        />
                        <DatePicker
                            className="custom-calendar"
                            id="toDate"
                            name="toDate"
                            value={moment(values?.toDate).toDate()}
                            handleChange={(e) => { hanldeSelect("toDate", e.target.value) }}
                            lable={t("ToDate")}
                            placeholder={VITE_DATE_FORMAT}
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                        />

                        <div className=" col-sm-2 col-xl-2">
                            <button className="btn btn-sm btn-success" type="button" onClick={() => { InvestigationViewList("") }}>
                               {t("Search")}
                            </button>
                        </div>


                    </div>

                    <div className='' >
                        <Tables
                            thead={thead}
                            tbody={tBody?.map((item, index) => ({
                                Sno: <input type='checkbox' checked={item?.isChecked} disabled />,
                                DeltaCheck: " ",
                                Date: item?.DATE,
                                BarcodeNo: item?.BarcodeNo,
                                Department: item?.Department,
                                Name: item?.Name,
                                PacsImages: " ",

                            }))}
                            getRowClass={getRowClass}
                        />

                    </div>
                </div>
            </div>
        </>
    )
}
