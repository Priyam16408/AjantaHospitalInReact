import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import { SelectIconSVG } from '../../../components/SvgIcons'
import DatePicker from '../../../components/formComponent/DatePicker'
import LabeledInput from '../../../components/formComponent/LabeledInput'

export default function PrescriptionList({ bodyData, getPatientIndentList, SelectPatientIndent, handleChange, values,PatientID }) {
    const [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;

    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Prescription On"), width: "1%" },
        { name: t("Prescription By"), width: "1%" },
        { name: t("No of Medicine"), width: "1%" },
        { name: t("Select"), width: "1%" },
    ]
    useEffect(() => {
        getPatientIndentList(false)
    }, [])
    return (
        <>
            <div className="row pt-2 px-2">


                <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                    <LabeledInput
                        label={t("UHID")}
                        value={PatientID}
                    />
                </div>

                <DatePicker
                    className="custom-calendar"
                    id="date"
                    name="FromDate"
                    placeholder={VITE_DATE_FORMAT}
                    value={values?.FromDate ? values?.FromDate : ""}
                    lable={t("From Date")}
                    respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                    handleChange={handleChange}
                />
                <DatePicker
                    className="custom-calendar"
                    id="date"
                    name="ToDate"
                    placeholder={VITE_DATE_FORMAT}
                    value={values?.ToDate ? values?.ToDate : ""}
                    lable={t("To Date")}
                    respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                    handleChange={handleChange}
                />
                <div className="col-xl-1 col-md-2 col-sm-4  col-6">
                    <button className="btn  btn-success px-3" type='button' onClick={getPatientIndentList} >{t("Search")}</button>
                </div>

            </div>
            <Tables
                thead={thead}
                tbody={bodyData?.map((val, index) => ({
                    sno: index + 1,
                    Date: val?.Date,
                    DoctorID: val?.DName,
                    NoOfMedicine: val?.NoOfMedicine,
                    Select: <span onClick={() => { SelectPatientIndent(val) }}><SelectIconSVG /></span>,

                }))}
                style={{ height: "20vh" }}
            />
        </>
    )
}
