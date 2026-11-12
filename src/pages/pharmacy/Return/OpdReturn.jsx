import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import { PharmacyIPDReturnItemAPI, PharmacyOPDReturnSearch, PharmacySearchIPDReturn, SaveIPDReurnAPI, SaveReurnAPI } from '../../../networkServices/pharmecy'
import { calculateBillAmount, handleCalculatePatientReturn, notify } from '../../../utils/utils'
import PatientDetail from './PatientDetail'
import PatientReturnTable from './PatientReturnTable'
import { useLocation } from 'react-router-dom'
import { PAYMENT_OBJECT } from '../../../utils/constant'
import { BindDisApprovalList, bindHashCode, GetDiscReasonList, GetEligiableDiscountPercent } from '../../../networkServices/opdserviceAPI'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import PaymentGateway from '../../../components/front-office/PaymentGateway'
import { useSelector } from 'react-redux'
import { ReturnIPDPayload, ReturnPayload } from '../../../utils/ustil2'
import PatientListTable from './PatientListTable'
import IPDPatientDetail from './IPDPatientDetail'
import { CommonReceiptPdf } from '../../../networkServices/BillingsApi'
import { RedirectURL } from '../../../networkServices/PDFURL'

export default function OpdReturn() {
    const intialValue = { SearchType: { value: "1" } }
    const [values, setValues] = useState(intialValue)
    const [bodyData, setBodyData] = useState([])
    const [patientDetail, setPatientDetail] = useState({})
    const [patientList, setPatientList] = useState([])
    const userData = useLocalStorage("userData", "get")
    const [t] = useTranslation()
    const { BindResource } = useSelector((state) => state.CommonSlice);
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }

    const handleReactSelect = async (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
        setBodyData([])
        setPatientDetail({})
        setPatientList([])
        setPaymentControlModeState(PAYMENT_OBJECT);
        setPaymentMethod([]);
    }

    const handleSearch = async () => {
        if (values?.SearchType?.value === "1") {
            if (!values?.ReceiptNo && !values?.BillNo && !values?.EmergencyNo && !values?.IPDNo) {
                notify(t("Please Enter At least One Field Value"), "error")
                return 0
            }
            let paylaod = {
                "emergencyNo": String(values?.EmergencyNo ? values?.EmergencyNo : ""),
                "receiptNo": String(values?.ReceiptNo ? values?.ReceiptNo : ""),
                "billNo": String(values?.BillNo ? values?.BillNo : ""),
                "ipdNo": String(values?.IPDNo ? values?.IPDNo : "")
            }
            const apiResp = await PharmacyOPDReturnSearch(paylaod)
            if (apiResp?.success) {
                let data = apiResp?.data?.map((val) => {
                    val.returnQty = 0
                    return val
                })
                setBodyData(data)
                setPatientDetail(data[0])
            } else {
                notify(apiResp?.message, "error")
            }
        } else if (values?.SearchType?.value === "2") {
            let paylaod = {
                "crNo": values?.IPDNo ? values?.IPDNo : "",
                "pName": values?.PatientName ? values?.PatientName : ""
            }
            const apiResp = await PharmacySearchIPDReturn(paylaod)
            if (apiResp?.success) {
                setPatientList(apiResp?.data)
            } else {
                notify(apiResp?.message, "error")
            }
        }
    }

    const handleCustomInput = (index, name, value, type, max) => {
        if (type === "number") {
            if (!isNaN(value) && Number(value) <= max) {
                const data = [...bodyData];
                data[index][name] = value;
                data[index]["panelID"] = data[index]["PanelID"];
                let calculatedAmount = handleCalculatePatientReturn(data[index])
                data[index] = calculatedAmount
                handleCalculateBillAmount(data?.filter((val) => val?.returnQty))

                setBodyData(data);
            } else {
                notify("Please Enter Valid Quantity", "error")
                return false
            }
        }

    };

    const SaveOPDReurn = async () => {
        const hashcode = await bindHashCode();
        let payload = ReturnPayload(bodyData, paymentMethod, paymentControlModeState, values, hashcode?.data)
        let apiResp = await SaveReurnAPI(payload)
        if (apiResp?.success) {
            const reportResp = await CommonReceiptPdf({
                ledgerTransactionNo: apiResp?.data?.responseURL?.ledTnxNo,
                isBill: String(apiResp?.data?.responseURL?.isBill),
                receiptNo: "",
                duplicate: "0",
                type: "PHY",
                supplierID: "",
                billNo: apiResp?.data?.isEMGBilling === 1 ? String(apiResp?.data?.emgBillNO) : "",
                isEMGBilling: String(apiResp?.data?.isEMGBilling ? 1 : ""),
                isOnlinePrint: "",
                isRefound: 0,
            });
            if (reportResp?.success) {
                RedirectURL(reportResp?.data?.pdfUrl);
            } else {
                // notify(reportResp?.data?.message, "error");
            }

            notify(apiResp?.message, "success")
            setBodyData([])
            setValues(intialValue)
            setPaymentControlModeState(PAYMENT_OBJECT);
            setPatientDetail({})
            setPaymentMethod([]);
        } else {
            notify(apiResp?.message, "error")
        }
    }


    // Handle Payment start
    const location = useLocation();
    const [paymentControlModeState, setPaymentControlModeState] = useState(PAYMENT_OBJECT);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [discounts, setDiscounts] = useState({
        discountApprovalList: [],
        discountReasonList: [],
    });
    const [testAddingTableState, setTestAddingTable] = useState([]);

    const GetDiscListAPI = async () => {
        try {
            const [
                discountReasonListRes,
                discountApprovalListRes,
                eligibleDiscountPercentRes,
            ] = await Promise.all([
                GetDiscReasonList("OPD"),
                BindDisApprovalList("HOSPITAL", "1"),
                GetEligiableDiscountPercent(userData?.employeeID),
            ]);
            const discountReasonList = discountReasonListRes?.data;
            const discountApprovalList = discountApprovalListRes?.data;
            const eligibleDiscountPercent =
                eligibleDiscountPercentRes?.data?.Eligible_DiscountPercent;

            if (discountReasonList)
                setDiscounts((val) => ({ ...val, discountReasonList }));
            if (discountApprovalList)
                setDiscounts((val) => ({ ...val, discountApprovalList }));
            if (eligibleDiscountPercent)
                setDiscounts((val) => ({
                    ...val,
                    Eligible_DiscountPercent: eligibleDiscountPercent,
                }));
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error as needed
        }
    };
    useEffect(() => {
        GetDiscListAPI();
    }, []);

    const handlePaymentGateWay = (details) => {
        const {
            panelID,
            billAmount,
            discountAmount,
            isReceipt,
            patientAdvanceAmount,
            autoPaymentMode,
            minimumPayableAmount,
            panelAdvanceAmount,
            disableDiscount,
            refund,
            constantMinimumPayableAmount,
            discountIsDefault,
            coPayIsDefault,
        } = details;

        const setData = {
            panelID,
            billAmount,
            discountAmount,
            isReceipt,
            patientAdvanceAmount,
            autoPaymentMode,
            minimumPayableAmount,
            panelAdvanceAmount,
            disableDiscount: true,
            refund,
            constantMinimumPayableAmount,
            discountIsDefault,
            coPayIsDefault: 1,
        };
        setPaymentMethod([]);
        setPaymentControlModeState(setData);
    };

    const handleCalculateBillAmount = (tableList) => {
        const data = calculateBillAmount(
            tableList,
            values?.SearchType?.value === "1" ? Number(BindResource?.IsReceipt) : 0,
            1,
            1,
            values?.SearchType?.value === "1" ? 0 : 4,
            0.0,
            1,
            1
        );
        handlePaymentGateWay(data);
    }
    // Handle Payment End


    //   IPD Return 
    const handleSearchIPDPatient = async (data,index) => {
        let val = {...patientList[index]}
        let apiResp = await PharmacyIPDReturnItemAPI(val?.TransactionID)
        if (apiResp?.success && apiResp?.data?.length > 0) {
            let data = apiResp?.data?.map((val) => {
                val.returnQty = 0
                return val
            })
            setPatientDetail(apiResp?.data[0])
            setBodyData(data)
        } else {
            notify(apiResp?.message, "error")
            setPatientDetail({})
            setBodyData([])
        }

    }

    const SaveIPDReurn = async () => {
        let payload = ReturnIPDPayload(bodyData, paymentMethod, paymentControlModeState, values)
        let apiResp = await SaveIPDReurnAPI(payload)
        if (apiResp?.success) {

            const reportResp = await CommonReceiptPdf({
                ledgerTransactionNo: apiResp?.data?.ledTxnID,
                isBill: "0",
                receiptNo: "",
                duplicate: "0",
                type: "PHY",
                supplierID: "",
                billNo: apiResp?.data?.isEMGBilling === 1 ? String(apiResp?.data?.emgBillNO) : "",
                isEMGBilling: String(apiResp?.data?.isEMGBilling ? 1 : ""),
                isOnlinePrint: "",
                isRefound: 0,
            });
            if (reportResp?.success) {
                RedirectURL(reportResp?.data?.pdfUrl);
            } else {
                // notify(reportResp?.data?.message, "error");
            }

            notify(apiResp?.message, "success")
            setBodyData([])
            setValues({SearchType: { value: "2" }})
            setPaymentControlModeState(PAYMENT_OBJECT);
            setPatientDetail({})
            setPaymentMethod([]);
        } else {
            notify(apiResp?.message, "error")
        }
    }



    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={true} title={"Patient Return"} />
                    <div className="row p-2">

                        <ReactSelect
                            placeholderName={t("searchType")}
                            id="SearchType"
                            name="SearchType"
                            value={values?.SearchType?.value}
                            handleChange={(name, e) => handleReactSelect(name, e)}
                            removeIsClearable={true}
                            dynamicOptions={[{ label: "OPD/EMG Billing", value: "1" }, { label: "IPD Billing", value: "2" }]}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />

                        {values?.SearchType?.value === "1" && <> <Input
                            type="text"
                            className="form-control "
                            id="ReceiptNo"
                            name="ReceiptNo"
                            value={values?.ReceiptNo ? values?.ReceiptNo : ""}
                            onChange={handleChange}
                            lable={t("ReceiptNo")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                            <Input
                                type="text"
                                className="form-control "
                                id="BillNo"
                                name="BillNo"
                                value={values?.BillNo ? values?.BillNo : ""}
                                onChange={handleChange}
                                lable={t("Bill Number")}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control "
                                id="EmergencyNo"
                                name="EmergencyNo"
                                value={values?.EmergencyNo ? values?.EmergencyNo : ""}
                                onChange={handleChange}
                                lable={t("EmergencyNo")}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            />
                        </>}

                        <Input
                            type="text"
                            className="form-control "
                            id="IPDNo"
                            name="IPDNo"
                            value={values?.IPDNo ? values?.IPDNo : ""}
                            onChange={handleChange}
                            lable={t("IPD No")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        {values?.SearchType?.value === "2" && <Input
                            type="text"
                            className="form-control "
                            id="PatientName"
                            name="PatientName"
                            value={values?.PatientName ? values?.PatientName : ""}
                            onChange={handleChange}
                            lable={t("PatientName")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        }

                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success" type='button' onClick={handleSearch}>{t("Search")}</button>
                        </div>

                    </div>
                </div>
            </div>

            {/* IPD */}    {patientList?.length > 0 && <PatientListTable tbody={patientList} handleSearchIPDPatient={handleSearchIPDPatient} />}
            {Object?.keys(patientDetail)?.length > 0 && values?.SearchType?.value === "1" && <PatientDetail patientDetail={patientDetail} />}

            {Object?.keys(patientDetail)?.length > 0 && values?.SearchType?.value === "2" && <IPDPatientDetail patientDetail={patientDetail} />}

            <PatientReturnTable handleCustomInput={handleCustomInput} tbody={bodyData} SearchType={values?.SearchType?.value} />


            <PaymentGateway
                screenType={paymentControlModeState}
                setScreenType={setPaymentControlModeState}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                discounts={discounts}
                testAddingTableState={testAddingTableState}
                button={
                    values?.SearchType?.value === "1" ? <button className="button" onClick={SaveOPDReurn}>
                        {t("Refund")}
                    </button> : <button className="button" onClick={SaveIPDReurn}>
                        {t("Refund")}
                    </button>


                }
            />

        </>
    )
}
