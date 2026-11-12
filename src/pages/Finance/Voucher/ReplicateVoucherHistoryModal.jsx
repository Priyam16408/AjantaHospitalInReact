import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/formComponent/Input'
import WrapTranslate from '../../../components/WrapTranslate'
import Tables from '../../../components/UI/customTable'
import { getReplicateVoucherHistoryAPI } from '../../../networkServices/finance'
import DatePicker from '../../../components/formComponent/DatePicker'
import moment from 'moment'
import { SelectIconSVG } from '../../../components/SvgIcons'

export default function ReplicateVoucherHistoryModal({ inputs, handleSelectVoucher }) {
    const { VITE_DATE_FORMAT } = import.meta.env;

    const [t] = useTranslation()
    const thead = [
        { name: "S/No.", width: "1%" },
        { name: "Select", width: "1%" },
        { name: "VoucherType" },
        { name: "Voucher No." },
        { name: "Voucher Date" },
        { name: "Department" },
        { name: "Project" },
        { name: "Entry Date" }
    ]

    const [values, setValues] = useState({ FromDate: new Date(), ToDate: new Date() })
    const [bodyData, setBodyData] = useState([])


    const searchReplicateVoucherHistory = async () => {
        let payload = {
            "fromDate": moment(values?.FromDate).format("DD-MMM-YYYY"),
            "toDate": moment(values?.ToDate).format("DD-MMM-YYYY"),
            "voucherNo": values?.voucherNo ? values?.voucherNo : "",
            "transacionType": 0
        }
        const apiResp = await getReplicateVoucherHistoryAPI(payload)
        if (apiResp?.success) {
            if (apiResp?.data?.length > 0) {
                setBodyData(apiResp?.data)
            } else {
                setBodyData([])
            }
        }
    }

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target?.value }))
    }

    useEffect(() => {
        searchReplicateVoucherHistory()
    }, [])
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <div className="row p-2">
                       
                        <DatePicker
                            className="custom-calendar"
                            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                            id="FromDate"
                            name="FromDate"
                            value={values?.FromDate ? moment(values?.FromDate).toDate() : new Date}
                            maxDate={new Date()}
                            handleChange={handleChange}
                            lable={t("From Date")}
                            placeholder={VITE_DATE_FORMAT}
                        />
                        <DatePicker
                            className="custom-calendar"
                            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                            id="ToDate"
                            name="ToDate"
                            value={values?.ToDate ? moment(values?.ToDate).toDate() : new Date}
                            maxDate={new Date()}
                            handleChange={handleChange}
                            lable={t("To Date")}
                            placeholder={VITE_DATE_FORMAT}
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="voucherNo"
                            name="voucherNo"
                            value={values?.voucherNo ? values?.voucherNo : ""}

                            onChange={handleChange}
                            lable={t("voucher No.")}
                            placeholder=" "
                            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                        // onKeyDown={onEnterAddItem}
                        />
                        <div className="col-xl-2 col-md-4  col-6  mb-2">
                            <button className="btn btn-sm btn-primary  w-100 px-xl-2 " type="button"
                                onClick={searchReplicateVoucherHistory} >
                                {t("Search")}
                            </button>
                        </div>


                    </div>
                </div>
            </div>
          
            <Tables
                thead={WrapTranslate(thead, "name")}
                style={{ maxHeight: "40vh" }}
                tbody={bodyData?.map((val, index) => ({
                    sno: index + 1,
                    SelectIconSVG: <span onClick={() => { handleSelectVoucher(val) }}><SelectIconSVG /></span>,
                    VoucherType: val?.VoucherName,
                    VoucherNo: val?.VoucherNo,
                    VoucherDate: val?.VoucherDate,
                    DepartmentName: val?.DepartmentName,
                    ProjectName: val?.ProjectName,
                    EntryDate: val?.EntryDate,

                }))}
            />

        </>
    )
}
