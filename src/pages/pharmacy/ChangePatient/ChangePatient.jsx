import React, { useEffect, useState, useRef } from "react";
import Heading from "../../../components/UI/Heading.jsx";
import { useTranslation } from "react-i18next";
import ReactSelect from '../../../components/formComponent/ReactSelect.jsx';
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils.js";
import Modal from "../../../components/modalComponent/Modal.jsx";
import Tables from "../../../components/UI/customTable/index.jsx";
import { approvalBindLedger, approvalGetPurchaseRequests, ApprovalGetSelectedItems, ApprovalGRNAppovalCancel, ApprovalSavePurchaseApproval, bindDepartments, LoadApprovalRight } from "../../../networkServices/purchaseDepartment.js"
import ChangeDetails from "./ChangeDetails.jsx";
import Input from "../../../components/formComponent/Input.jsx";
import DatePicker from "../../../components/formComponent/DatePicker.jsx";
import moment from "moment";
import { OPDGetChangeBillDetails } from "../../../networkServices/opdserviceAPI.js";
import ChangeRelation from "./ChangeRelation.jsx";


const ChangePatient = () => {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [tableData, setTableData] = useState([]);
    // const [isLoad,setIsload]=useState(false)
    const [values, setValues] = useState({
        type: { value: "OPD", label: "OPD" },
        receiptno: "",
        regno: "",
        patientName: "",
        ipdno: "",
        billno: "",
        fromDate: new Date(),
        toDate: new Date()

    })
    console.log("values", values)
    const LoadApporval = async () => {
        try {
            const response = await LoadApprovalRight();
            if (response?.success) {
                // setIsApprovel(response?.data[0]?.Approval)
                console.log("firstresponse?.data[0]?.Approval", response?.data[0]?.Approval)

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    useEffect(() => {
        LoadApporval()
    }, [])

    const THEAD = [
        { width: "1%", name: t("SNo") },
        { width: "1%", name: t("Date") },
        { width: "1%", name: t("Bill No.") },
        { width: "1%", name: t("Receipt No.") },
        { width: "5%", name: t("UHID") },
        { width: "5%", name: t("Patient Name") },
        { width: "5%", name: t("Age/Sex") },
        { width: "5%", name: t("PAnel Name") },
        { width: "5%", name: t("Doctor Name") },
        { width: "1%", name: t("Amount") },
        { width: "1%", name: t("Change Relation") },
        { width: "1%", name: t("Change Doctor") },
        { width: "1%", name: t("Change Panel") },

    ];

    const [handleModelData, setHandleModelData] = useState({});
    const [tbodyRequestDetails, setTbodyRequestDetails] = useState([
    ]);


    const handleClick = (data, Details) => {

        const { itemLabel, Component } = Details;

        setHandleModelData({
            isOpen: true,
            width: '60vw',
            label: itemLabel,
            Component: Component,
            // RejectPurchaseRequest: RejectPurchaseRequest
        })

    }
    const getItemsOfPurchaseRq = async (prNo) => {


        try {

            let payload = {
                prnOs: [
                    prNo
                ],
                ledgerNumber: values.store?.LedgerNumber
            };

            let apiResp = await ApprovalGetSelectedItems(payload);
            if (apiResp?.success) {

                setTbodyRequestDetails(apiResp.data)

            }
        } catch (error) {
            console.log(apiResp?.message);
            console.log(error);
            notify(apiResp?.message, "error");
            setTbodyRequestDetails([]);
        }
        console.log(tbodyRequestDetails)

    }

    const handleSearch = async () => {
        const payload = {
            "type": values?.type?.value,
            "reciptNo": values?.receiptno,
            "billNo": values?.billno,
            "ipdNo": values?.ipdno,
            "uhid": values?.regno,
            "patientName": values?.patientName,
            "fromDate": values?.fromDate,
            "toDate": values?.toDate
        }
        try {
            const response = await OPDGetChangeBillDetails(payload)
            if (response?.success) {
                setTableData(response?.data)
            }
            else {
                 setTableData([])
                notify(response?.message, "error")
            }

        } catch (error) {

        }
    }
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }
    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };

    // useEffect(() => {
    //     GetPurchaseRequests()
    // }, []);
    // }, [values, handleModelData]);

    const handleClose = () => {

        setHandleModelData((val) => ({ ...val, isOpen: false }))
    }
  
    return (
        <>
            {handleModelData?.isOpen && (
                <Modal
                    visible={handleModelData?.isOpen}
                    setVisible={handleClose}
                    modalWidth={handleModelData?.width}
                    Header={t(handleModelData?.label)}
                    buttonType={"button"}


                    footer={<></>}

                >
                    {handleModelData?.Component}
                </Modal>
            )}
            <div className="card patient_registration border mt-2">
                <div className="row ">
                    <div className="col-sm-12">
                        {/* <div className="card patient_registration  "> */}

                            <form className="">
                                <Heading
                                    title={t("Change Patient Details")}
                                    isBreadcrumb={false}
                                />
                                <div className="row p-2">
                                    <ReactSelect
                                        placeholderName={t("Type")}
                                        id={"type"}
                                        searchable={true}
                                        removeIsClearable={true}
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                        dynamicOptions={[{ value: "OPD", label: "OPD" }]}
                                        handleChange={handleSelect}
                                        value={`${values?.type?.value}`}
                                        name={"type"}
                                    />
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="receiptno"
                                        name="receiptno"
                                        value={values?.receiptno}
                                        onChange={handleChange}
                                        lable={t("Receipt No.")}
                                        placeholder=" "
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    />
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="regno"
                                        name="regno"
                                        value={values?.regno}
                                        onChange={handleChange}
                                        lable={t("UHID")}
                                        placeholder=" "
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    />
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="patientName"
                                        name="patientName"
                                        value={values?.patientName}
                                        onChange={handleChange}
                                        lable={t("Patient Name")}
                                        placeholder=" "
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    />
                                    {/* <Input
                                        type="text"
                                        className="form-control"
                                        id="ipdno"
                                        name="ipdno"
                                        value={values?.ipdno}
                                        onChange={handleChange}
                                        lable={t("IPD No.")}
                                        placeholder=" "
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    /> */}
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="billno"
                                        name="billno"
                                        value={values?.billno}
                                        onChange={handleChange}
                                        lable={t("Bill No.")}
                                        placeholder=" "
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    />

                                    <DatePicker
                                        className="custom-calendar"
                                        id="From Data"
                                        name="fromDate"
                                        lable={t("From Date")}
                                        placeholder={VITE_DATE_FORMAT}
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                        value={
                                            values.fromDate
                                                ? moment(values.fromDate, "YYYY-MM-DD").toDate()
                                                : null
                                        }
                                        maxDate={new Date()}
                                        handleChange={searchHandleChange}
                                    />
                                    <DatePicker
                                        className="custom-calendar"
                                        id="DOB"
                                        name="toDate"
                                        lable={t("To Date")}
                                        value={
                                            values.toDate
                                                ? moment(values.toDate, "YYYY-MM-DD").toDate()
                                                : null
                                        }
                                        maxDate={new Date()}
                                        handleChange={searchHandleChange}
                                        placeholder={VITE_DATE_FORMAT}
                                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    />
                                    <button className="btn btn-sm btn-success" type="button" onClick={() => handleSearch("")}>
                                        {t("Search")}
                                    </button>
                                </div>
                            </form>
                        {/* </div> */}
                        {
                            tableData?.length > 0 &&
                            <div className="card">
                                <div className=" mt-2 spatient_registration_card">
                                    <Heading title={t("Files Details")} isBreadcrumb={false} />
                                    <Tables
                                        // getRowClick={getItemsOfPurchaseRq}
                                        thead={THEAD}
                                        tbody={tableData?.map((val, index) => ({

                                            sno: index + 1,
                                            BillDate: moment(val.BillDate).format('DD-MM-YYYY') || "",
                                            BillNo: val?.BillNo || "",
                                            ReceiptNo: val.ReceiptNo || "",
                                            crno: val?.PatientID,


                                            patientName: val.PatientName || "",
                                            AgeSex: val.AgeSex || "",
                                            PanelName: val.PanelName || "",
                                            DoctorName: val.DoctorName || "",
                                            NetAmount: val?.NetAmount || "",
                                            // reject: <i className="fa fa-trash text-danger" /> || "",
                                           changeRelation : (
                                                <span
                                                    onClick={() => {
                                                        handleClick(val, {
                                                            itemLabel: "Change Relation",
                                                            Component: <ChangeRelation
                                                                handleSearch={handleSearch}
                                                                inputData={val}
                                                                handleClose={handleClose}
                                                                setTbodyRequestDetails={setTbodyRequestDetails}
                                                                changeDoctor={true}
                                                            />

                                                        });
                                                    }}
                                                >
                                                    <i className="fa fa-edit text-primary" />
                                                    {/* <i className="fa fa-trash text-danger" /> */}
                                                </span>
                                            ),
                                            changeDoctor: (
                                                <span
                                                    onClick={() => {
                                                        handleClick(val, {
                                                            itemLabel: "Change Details",
                                                            Component: <ChangeDetails
                                                                handleSearch={handleSearch}
                                                                inputData={val}
                                                                handleClose={handleClose}
                                                                setTbodyRequestDetails={setTbodyRequestDetails}
                                                                changeDoctor={true}
                                                            />

                                                        });
                                                    }}
                                                >
                                                    <i className="fa fa-edit text-primary" />
                                                    {/* <i className="fa fa-trash text-danger" /> */}
                                                </span>
                                            ),
                                            changePanel: (
                                                <span
                                                    onClick={() => {
                                                        handleClick(val, {
                                                            itemLabel: "Change Details",
                                                            Component: <ChangeDetails
                                                                handleSearch={handleSearch}
                                                                inputData={val}
                                                                handleClose={handleClose}
                                                                setTbodyRequestDetails={setTbodyRequestDetails}
                                                                changeDoctor={false}
                                                            />

                                                        });
                                                    }}
                                                >
                                                    <i className="fa fa-edit text-primary" />
                                                    {/* <i className="fa fa-trash text-danger" /> */}
                                                </span>
                                            ),

                                        }))}

                                        style={{ maxHeight: "55vh" }}
                                        //  tableHeight={"scrollView"}
                                    />
                                </div>
                            </div>
                        }




                    </div>
                </div>
                {/* <ChangeDetails/> */}
            </div>
        </>
    )
}

export default ChangePatient

