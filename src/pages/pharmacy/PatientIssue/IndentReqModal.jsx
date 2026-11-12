import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import Input from '../../../components/formComponent/Input'
import TextAreaInput from '../../../components/formComponent/TextAreaInput'
import { BindItemDetailsAPI, GetAllPendingIndentsPharmecy, getPatientIndentAPI, PendingDraftListAPI, PharmacyRejectIndentItem } from '../../../networkServices/pharmecy'
import moment from 'moment'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import { notify } from '../../../utils/utils'
import PendingIndent from './PendingIndent'
import PendingDraft from './PendingDraft'
import Heading from '../../../components/UI/Heading'
import PrescriptionList from './PrescriptionList'
import Modal from '../../../components/modalComponent/Modal'

export default function IndentReqModal({ department, type, setParentValues, setSearchPatient, setModalData, SearchPatient }) {
    const [t] = useTranslation()
    const [bodyData, setBodyData] = useState([])
    let userData = useLocalStorage("userData", "get")
    let initialValue = {
        ToDate: new Date(),
        FromDate: new Date(),
        panelType: "0",
        type: { value: SearchPatient?.PatientType === "EMG" ? "emg.EmergencyNo" : "id.TransactionID" },
        Status: { value: "OPEN" },
        deptLedgerNo: userData?.deptLedgerNo,
        Name: SearchPatient?.TransNo,
        isDisabled: SearchPatient?.TransNo ? true : false
    }
    const [values, setValues] = useState(initialValue)

    const handleReactSelect = async (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues((val) => ({ ...val, [name]: selectedOptions }));
    };

    const castDepPayload = () => {
        // let data = 
        // values?.department?.map((val, index) => {
        //     data += `${"'" + val?.code + "'"}${values?.department?.length - 1 !== index ? "," : ""}`
        // })
        let data =  values?.department?.map((val, index) => val?.code)
        debugger
        return data
    }
    const getIndentItem = async (isShowTost = true) => {
        // let payload = {
        //     "deptLedgerNo": values?.deptLedgerNo,
        //     "searchby": values?.type?.value,
        //     "searchtype": values?.SearchTypeNumber ? values?.SearchTypeNumber : "",
        //     "status": values?.Status?.value ? values?.Status?.value : "",
        //     "department": castDepPayload(),
        //     "fromDate": moment(values?.FromDate).format("DD-MMM-YYYY"),
        //     "toDate": moment(values?.ToDate).format("DD-MMM-YYYY")
        // }
        let payload = {
            "deptLedgerNo": castDepPayload()|| [],
            "searchby": values?.type?.value,
            "searchtype": values?.SearchTypeNumber ? values?.SearchTypeNumber : "",
            "status": values?.Status?.value ? values?.Status?.value : "",
            "department": "",
            "isCashPanel": values?.panelType?.value ? values?.panelType?.value : values?.panelType,
            "fromDate": moment(values?.FromDate).format("DD-MMM-YYYY"),
            "toDate": moment(values?.ToDate).format("DD-MMM-YYYY")
        }

        const apiResp = await GetAllPendingIndentsPharmecy(payload)
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
            isShowTost && notify(apiResp?.message, "error")
        }
    }
    const getPendingDraftList = async (isShowTost = true) => {
        let apiResp = await PendingDraftListAPI()
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
            isShowTost && notify(apiResp?.message, "error")
        }
    }

    // handle Bind Item Deatils
    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Medicine"), width: "1%" },
        { name: t("Requested"), width: "1%" },
        { name: t("Issued"), width: "1%" },
        { name: t("Rejected"), width: "1%" },
        { name: t("Available"), width: "1%" },
        { name: t("BatchNumber"), width: "1%" },
        { name: t("Expire Date"), width: "1%" },
        { name: t("MRP"), width: "1%" },
        { name: t("Issue"), width: "1%" },
        { name: t("Reject"), width: "1%" },
    ]
    const [itemDetailList, setItemDetailList] = useState([]);
    const BindItemDetails = async (URL, payload, isShowTost = true) => {
        let apiResp = await BindItemDetailsAPI(URL, payload)
        if (apiResp?.success) {
            let pendingQty = 0
            let data = apiResp?.data?.map((val, index) => {
                let needToIssuQty = val?.ReqQty - val?.RejectQty
                if (val?.ItemID === apiResp?.data[index - 1]?.ItemID) {
                    val.IssueQuantity = 0
                    if (pendingQty > 0) {
                        if (pendingQty > val?.AvlQty) {
                            val.IssueQuantity = val?.AvlQty
                            pendingQty = pendingQty - val?.AvlQty
                        } else {
                            val.IssueQuantity = pendingQty
                            pendingQty = 0
                        }
                    }
                } else {
                    if (needToIssuQty > val?.AvlQty) {
                        val.IssueQuantity = val?.AvlQty
                        pendingQty = needToIssuQty - val?.AvlQty
                    } else {
                        val.IssueQuantity = needToIssuQty
                        pendingQty = 0
                    }
                }
                return val
            })
            setItemDetailList(data?.filter((val) => val?.IssueQuantity !== 0 && val?.AvlQty !== 0))
            setModalData((val) => ({ ...val, modalData: data?.filter((val) => val?.IssueQuantity !== 0 && val?.AvlQty !== 0) }))


        } else {
            setItemDetailList([])
            setModalData((val) => ({ ...val, modalData: [] }))
            isShowTost && notify(apiResp?.message, "error")
        }
    }

    const SelectPendingIndent = (data, index) => {
        let item = { ...bodyData[index] }
        setParentValues((val) => ({ ...val, type: { value: 1 } }))
        if (item?.IPDNo) {
            // isCallhandleChange key is use for autometic search when slect patient from pending indent and call onchnage on seachitemEassyUI compnent 
            setSearchPatient((val) => ({ ...val, value: item?.IPDNo, isCallhandleChange: true, name: "" }))
        } else if (item?.EMGNo) {
            setSearchPatient((val) => ({ ...val, value: item?.EMGNo, isCallhandleChange: true, name: "" }))
        }
        BindItemDetails("BindIndentDetailsURL", `indentNo=${item?.indentno}&deptLedgerNo=${userData?.deptLedgerNo}`)
    }


    const [cancelModalData, setCancelModalData] = useState({ visible: false })
    const [rejectReason, setRejectReason] = useState("")

    const handleDeleteIndent = async (Data) => {
        let payload = {
            "indentID": String(Data?.indentno ? Data?.indentno : Data?.IndentNo ? Data?.IndentNo : ""),
            "itemID": String(Data?.ItemID ? Data?.ItemID : ""),
            "rejectReason": rejectReason ? rejectReason : ""
        }

        const apiResp = await PharmacyRejectIndentItem(payload)
        if (apiResp?.success) {
            notify(apiResp?.message)
            if (Data?.IndentNo) {
                BindItemDetails("BindIndentDetailsURL", `indentNo=${Data?.IndentNo}&deptLedgerNo=${userData?.deptLedgerNo}`, true)
            } else {
                await getIndentItem(false)
            }
            setCancelModalData({ visible: false })
        } else {
            notify(apiResp?.message, "error")
        }

    }
    const SelectCancelIndent = (item) => {
        setCancelModalData({
            visible: true,
            width: "25vw",
            label: <span>{t("Reject")}</span>,
            buttonName: "Reject",
            Component: <TextAreaInput
                lable={"Reject Reason"}
                className="w-100 required-fields"
                id="RejectReason"
                rows={3}
                respclass="w-100"
                name="RejectReason"
                // value={rejectReason?rejectReason:""}
                onChange={(e) => { setRejectReason(e?.target?.value) }}
            />,
            modalData: item,
            CallAPI: handleDeleteIndent

        })


    }

    const handleCustomInput = (index, name, value, type, max) => {
        if (!isNaN(value) && Number(value) <= max) {
            const data = [...itemDetailList];
            data[index][name] = value;
            setItemDetailList(data);
            setModalData((val) => ({ ...val, modalData: data }))
        } else {
            return false
        }


    };


    // Select Draft 

    const SelectDroftItem = (data, index) => {
        let item = {...bodyData[index]}

        setParentValues((val) => ({ ...val, type: { value: 1 } }))
        BindItemDetails("BindDraftDetailsURL", `demandDraftID=${item?.ID}&deptLedgerNo=${userData?.deptLedgerNo}`)
    }

    // prescription 

    const getPatientIndentList = async (isShowTost = true) => {
        let payload = {
            "deptLedgerNo": userData?.deptLedgerNo,
            "IPDNO": "",
            "MRNO": SearchPatient?.PatientID,
            "fromDate": moment(values?.FromDate).format("DD-MMM-YYYY"),
            "toDate": moment(values?.ToDate).format("DD-MMM-YYYY"),
            "indentID": "",
            "searchType": "",
            "demandDraftID": 0
        }
        let apiResp = await getPatientIndentAPI(payload)
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
            isShowTost && notify(apiResp?.message, "error")
        }

    }

    const SelectPatientIndent = (val) => {
        BindItemDetails("BindPrescribeDetailsURL", `date=${val?.Date}&patientID=${SearchPatient?.PatientID}&doctorID=${SearchPatient?.DoctorID}&deptLedgerNo=${userData?.deptLedgerNo}`)
    }

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    {type === "indent" && <PendingIndent handleChange={handleChange} handleReactSelect={handleReactSelect} values={values} department={department} handleMultiSelectChange={handleMultiSelectChange} getIndentItem={getIndentItem} bodyData={bodyData} SelectPendingIndent={SelectPendingIndent} SearchPatient={SearchPatient} SelectCancelIndent={SelectCancelIndent} />
                    }
                    {type === "draft" && <PendingDraft bodyData={bodyData} getPendingDraftList={getPendingDraftList} SelectDroftItem={SelectDroftItem} />}

                    {type === "prescription" && <PrescriptionList bodyData={bodyData} getPatientIndentList={getPatientIndentList} SelectPatientIndent={SelectPatientIndent} values={values} handleChange={handleChange} PatientID={SearchPatient?.PatientID} />}

                </div>
            </div>
            <div className='mt-2 spatient_registration_card'>
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={t("Item Details")} />

                    <Tables
                        thead={thead}
                        tbody={itemDetailList?.map((val, index) => ({
                            sno: index + 1,
                            ItemName: val?.ItemName,
                            ReqQty: val?.TotalReqQty ? val?.TotalReqQty : "0",
                            IssueQty: val?.ReceiveQty ? val?.ReceiveQty : "0",
                            RejectQty: val?.RejectQty ? val?.RejectQty : "0",
                            AvlQty: val?.AvlQty ? val?.AvlQty : "0",
                            BatchNumber: val?.BatchNumber,
                            MedExpiryDate: val?.MedExpiryDate,
                            MRP: val?.MRP ? val?.MRP.toFixed(4) : "0",
                            IssueQuantity: <Input
                                type="text"
                                className="table-input"
                                removeFormGroupClass={true}
                                display={"right"}
                                name={"IssueQuantity"}
                                value={val?.IssueQuantity}
                                onChange={(e) => { handleCustomInput(index, "IssueQuantity", e.target.value, "number", Number(val?.AvlQty)) }}
                            />,

                            Reject: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { SelectCancelIndent(val, "ItemDetails") }}></i>,
                        }))}
                        style={{ height: "20vh" }}
                    />
                </div>
            </div>

            {cancelModalData?.visible && (
                <Modal
                    visible={cancelModalData?.visible}
                    setVisible={() => { setCancelModalData({ visible: false }) }}
                    modalData={cancelModalData?.modalData}
                    modalWidth={cancelModalData?.width}
                    Header={cancelModalData?.label}
                    buttonType="button"
                    buttonName={cancelModalData?.buttonName}
                    footer={cancelModalData?.footer}
                    handleAPI={cancelModalData?.CallAPI}
                >
                    {cancelModalData?.Component}
                </Modal>
            )}

        </>
    )
}
