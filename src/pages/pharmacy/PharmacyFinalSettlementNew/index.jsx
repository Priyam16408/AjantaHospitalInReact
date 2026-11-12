import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import DatePicker from '../../../components/formComponent/DatePicker';
import Input from '../../../components/formComponent/Input';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Tables from '../../../components/UI/customTable';
import LabeledInput from '../../../components/formComponent/LabeledInput';
import { useSelector } from 'react-redux';
import { calculateBillAmount, handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import PaymentGateway from '../../../components/front-office/PaymentGateway';
import { BindDisApprovalList, bindHashCode, GetDiscReasonList, GetEligiableDiscountPercent, SaveOPDSettlement, SearchOPDBillsData } from '../../../networkServices/opdserviceAPI';
import { PAYMENT_OBJECT } from '../../../utils/constant';
import { PharmacyFinalSettlementPayload } from '../../../utils/ustil2';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';
import { CommonReceiptPdf } from '../../../networkServices/BillingsApi';
import { RedirectURL } from '../../../networkServices/PDFURL';


export default function index() {
    const [t] = useTranslation()
    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Centre Name"), width: "1%" },
        { name: t("Bill Date"), width: "1%" },
        { name: t("Bill No."), width: "1%" },
        { name: t("Patient Name"), width: "1%" },
        { name: t("UHID"), width: "1%" },
        { name: t("Bill Amount"), width: "1%" },
        { name: t("Paid Amount"), width: "1%" },
        { name: t("Pending Amount"), width: "1%" },
        { name: t("Type"), width: "1%" },
        { name: t("Panel"), width: "1%" },
        // { name: t("Select"), width: "1%" },
    ]
    const userData = useLocalStorage("userData","get")
    let initialData = { FromDate: new Date(), DateTo: new Date(), Centre: { value: String(userData?.defaultCentre) } }
    const [values, setValues] = useState(initialData)
    const { VITE_DATE_FORMAT } = import.meta.env;
   
    const [bodyData, setBodyData] = useState([])
    
    const [patientDetails, setPatientDetails] = useState({})

    const { getBindPanelListData, GetEmployeeWiseCenter } = useSelector(
        (state) => state?.CommonSlice
    );

    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    const handleReactSelect = async (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }

    const handleSearch = async () => {
        let payload = {
            "mrNo": String(values?.UHID ? values?.UHID : ""),
            "panelID": String(values?.Panel?.value ? values?.Panel?.value : ""),
            "fromDate": moment(values?.FromDate).format("YYYY-MM-DD"),
            "toDate": moment(values?.DateTo).format("YYYY-MM-DD"),
            "centreId": String(values?.Centre?.value ? values?.Centre?.value : ""),
            "billNo": String(values?.BillNo ? values?.BillNo : ""),
            isPharmacy:1
        }
        let apiResp = await SearchOPDBillsData(payload)
        if (apiResp?.success) {
            
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
            notify(apiResp?.message, "error")
        }
    }


    // Handle Payment start
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
            1,
            0,
            tableList[0]?.PendingAmt>0?0:1,
            0,
            0.0,
            1,
            1
        );

        handlePaymentGateWay(data);
    }
  

    const Save = async () => {
        const hashcode = await bindHashCode();
        let paylaod = PharmacyFinalSettlementPayload(bodyData,paymentMethod, paymentControlModeState, values,hashcode?.data)
        let apiResp = await SaveOPDSettlement(paylaod);
        if (apiResp?.success) {

            const reportResp = await CommonReceiptPdf({
                ledgerTransactionNo: apiResp?.data?.ledgerTranNo,
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
            }
            notify(apiResp?.message, "success")
            setBodyData([])
            setValues(initialData)
            setPatientDetails({})
            setPaymentControlModeState(PAYMENT_OBJECT);
            setPaymentMethod([]);
        } else {
            notify(apiResp?.message, "error")

        }
    }

    const handleSelectPatient = async (val, index) => {
        let value = { ...bodyData[index] }
        setPatientDetails(value)
        let data = JSON.parse(JSON.stringify(bodyData))?.map((val) => {
            val.grossAmount = val.PendingAmt
            val.panelID = val.PanelID
            val.discountAmount = "0"
            return val
        })
        handleCalculateBillAmount(data)
    }
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Search Patient"} />
                    <div className="row px-2 pt-2">
                        <Input
                            type="text"
                            className="form-control"
                            id="UHID"
                            name="UHID"
                            value={values?.UHID ? values?.UHID : ""}
                            onChange={handleChange}
                            lable={t("Barcode/UHID")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="BillNo"
                            name="BillNo"
                            value={values?.BillNo ? values?.BillNo : ""}
                            onChange={handleChange}
                            lable={t("Bill No.")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />
                        <ReactSelect placeholderName={t("Panel")}
                            id="Panel"
                            inputId="Panel"
                            name="Panel"
                            value={values?.Panel?.value}
                            dynamicOptions={handleReactSelectDropDownOptions(getBindPanelListData, "Company_Name", "PanelID")}
                            searchable={true}
                            removeIsClearable={true}
                            handleChange={(name, e) => handleReactSelect(name, e)}
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                        />

                        <DatePicker
                            className="custom-calendar"
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                            id="FromDate"
                            name="FromDate"
                            value={values?.FromDate ? moment(values?.FromDate).toDate() : ""}
                            maxDate={new Date()}
                            handleChange={handleChange}
                            lable={t("fromDate")}
                            placeholder={VITE_DATE_FORMAT}
                        />

                        <DatePicker
                            className="custom-calendar"
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                            id="DateTo"
                            name="DateTo"
                            value={values?.DateTo ? moment(values?.DateTo).toDate() : ""}
                            handleChange={handleChange}
                            lable={t("toDate")}
                            placeholder={VITE_DATE_FORMAT}
                        />
                        <ReactSelect placeholderName={t("Centre")}
                            id="Centre"
                            inputId="Centre"
                            name="Centre"
                            value={values?.Centre?.value}
                            dynamicOptions={handleReactSelectDropDownOptions(GetEmployeeWiseCenter, "CentreName", "CentreID")}
                            searchable={true}
                            removeIsClearable={true}
                            handleChange={(name, e) => handleReactSelect(name, e)}
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                        />

                    </div>
                    <div className="mb-2 text-right" >
                        <button className=" btn-primary btn-sm  ml-1 custom_save_button " type="button" onClick={handleSearch}>
                            {t("Search")}
                        </button>
                    </div>
                    <Tables
                        thead={thead}
                        tbody={bodyData?.map((val, index) => ({
                            SNO: index + 1,
                            CentreName: val?.CentreName,
                            BillDate: val?.BillDate,
                            BillNo: val?.BillNo,
                            PatientName: val?.PatientName,
                            PatientID: val?.PatientID,
                            Amount: val?.Amount,
                            PaidAmt: val?.PaidAmt,
                            PendingAmt: val?.PendingAmt,
                            SettlementType: val?.SettlementType,
                            CompanyName: val?.CompanyName,
                            // Select: <span onClick={() => { handleSelectPatient(val) }}><SelectIconSVG /></span>,

                        }))}
                        getRowClick={handleSelectPatient}

                    />
                    {Object?.keys(patientDetails)?.length > 0 && <div className="mt-2 spatient_registration_card">
                        <div className="patient_registration card">
                            <Heading isBreadcrumb={false} title={"Patient Details"} />
                            <div className='row p-2'>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2 ">
                                    <LabeledInput
                                        label={t("UHID")}
                                        value={patientDetails?.PatientID}
                                    />
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2 ">
                                    <LabeledInput
                                        label={t("Patient Name")}
                                        value={patientDetails?.PatientName}
                                    />
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2 ">
                                    <LabeledInput
                                        label={t("Panel")}
                                        value={patientDetails?.CompanyName}
                                    />
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2 ">
                                    <LabeledInput
                                        label={t("Bill No.")}
                                        value={patientDetails?.BillNo}
                                    />
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2 ">
                                    <LabeledInput
                                        label={t("Bill Amount")}
                                        value={patientDetails?.Amount}
                                    />
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2 ">
                                    <LabeledInput
                                        label={t("Paid Amount")}
                                        value={patientDetails?.PaidAmt}
                                    />
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2 ">
                                    <LabeledInput
                                        label={t("Centre")}
                                        value={patientDetails?.CentreName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            <PaymentGateway
                screenType={paymentControlModeState}
                setScreenType={setPaymentControlModeState}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                discounts={discounts}
                testAddingTableState={testAddingTableState}
                button={
                    <button className="button" onClick={Save}>
                        {t("Save")}
                    </button>


                }
            />
        </>
    )
}
