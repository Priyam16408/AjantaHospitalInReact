import React, { useEffect } from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import { PHARMACY_ITEMINDENT_STATUS, PHARMACY_ITEMINDENT_TYPE } from '../../../utils/constant'
import Input from '../../../components/formComponent/Input'
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp'
import DatePicker from '../../../components/formComponent/DatePicker'
import Tables from '../../../components/UI/customTable'
import { SelectIconSVG } from '../../../components/SvgIcons'
import Heading from '../../../components/UI/Heading'
import { handleReactSelectDropDownOptions } from '../../../utils/utils'

export default function PendingIndent({ values, handleReactSelect, handleChange, department, getIndentItem, handleMultiSelectChange, bodyData, SelectPendingIndent, SelectCancelIndent }) {
    const [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;

    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Indent No"), width: "1%" },
        { name: t("Date"), width: "1%" },
        { name: t("IPD No."), width: "1%" },
        { name: t("EMG No."), width: "1%" },
        { name: t("Bed No."), width: "1%" },
        { name: t("Patient Name"), width: "1%" },
        { name: t("Panel"), width: "1%" },
        { name: t("Requested"), width: "1%" },
        { name: t("Rejected"), width: "1%" },
        { name: t("Indent Type"), width: "1%" },
        { name: t("Indent From."), width: "1%" },
        { name: t("Indent By"), width: "1%" },
        { name: t("Status"), width: "1%" },
        // { name: t("Select"), width: "1%" },
        { name: t("Reject"), width: "1%" },

    ]

    useEffect(() => {
        if (values?.deptLedgerNo) {
            getIndentItem(false)
        }
    }, [values?.deptLedgerNo])

    return (
        <>

            <div className="row pt-2 px-2">

                <ReactSelect placeholderName={t("Type")}
                    id="type"
                    inputId="type"
                    name="type"
                    value={values?.type?.value}
                    isDisabled={values?.isDisabled}
                    dynamicOptions={PHARMACY_ITEMINDENT_TYPE}
                    searchable={true}
                    removeIsClearable={true}
                    handleChange={(name, e) => { handleReactSelect(name, e) }}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                />

                <Input
                    type="text"
                    className="form-control"
                    disabled={values?.isDisabled}
                    removeFormGroupClass={true}
                    // placeholder={`Please Enter ${values?.type?.label ? values?.type?.label : ""}`}
                    name="Name"
                    lable={t(`Please Enter ${values?.type?.label ? values?.type?.label : ""}`)}

                    value={values?.Name ? values?.Name : ""}
                    respclass="col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"
                    onChange={handleChange}
                />

                <ReactSelect placeholderName={t("Status")}
                    id="Status"
                    inputId="Status"
                    name="Status"
                    value={values?.Status?.value}
                    dynamicOptions={PHARMACY_ITEMINDENT_STATUS}
                    searchable={true}
                    removeIsClearable={true}
                    handleChange={(name, e) => { handleReactSelect(name, e) }}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                />
                <ReactSelect placeholderName={t("Panel Type")}
                    id="panelType"
                    inputId="panelType"
                    name="panelType"
                    value={values?.panelType?.value ? values?.panelType?.value : values?.panelType}
                    dynamicOptions={[
                        { value: "0", label: "Credit" },
                        { value: "1", label: "Cash" }
                    ]}
                    searchable={true}
                    removeIsClearable={true}
                    handleChange={(name, e) => { handleReactSelect(name, e) }}
                    respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
                />
                <MultiSelectComp
                    respclass="col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"
                    name="department"
                    id="department"
                    placeholderName="Department"
                    dynamicOptions={
                        department?.map((item) => ({
                            name: item.ledgerName,
                            code: item.ledgerNumber,
                        }))}
                    // dynamicOptions={[{ value: "0", label: "ALL" }, 
                    //         ...handleReactSelectDropDownOptions(department ? department : "", "ledgerName", "ledgerNumber")]}
                    handleChange={handleMultiSelectChange}
                    value={values?.department}

                />
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
            </div>
            <div className="row pt-2 px-2">
                
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
                    <button className="btn  btn-success px-3" type='button' onClick={getIndentItem}>{t("Search")}</button>
                </div>

            </div>
            <Tables
                thead={thead}
                tbody={bodyData?.map((val, index) => ({
                    sno: index + 1,
                    IndentNo: val?.indentno,
                    Date: val?.dtEntry,
                    IPDNo: val?.IPDNo,
                    EMGNo: val?.EMGNo,
                    BillNo: val?.BedDetail,
                    PName: val?.PName,
                    Panel: val?.PanelName,
                    ReqQty: val?.ReqQty ? val?.ReqQty : "0",
                    RejectQty: val?.RejectQty ? val?.RejectQty : "0",
                    IndentType: val?.IndentType,
                    DeptFrom: val?.DeptFrom,
                    UserName: val?.UserName,
                    StatusNew: val?.StatusNew,
                    // Select: <span onClick={() => { SelectPendingIndent(val) }}><SelectIconSVG /></span>,
                    Delete: <i className="fa fa-trash text-danger text-center" onClick={() => { SelectCancelIndent(val) }} aria-hidden="true"></i>,
                }))}
                style={{ height: "20vh" }}
                handleDoubleClick={SelectPendingIndent}
            />



        </>
    )
}
