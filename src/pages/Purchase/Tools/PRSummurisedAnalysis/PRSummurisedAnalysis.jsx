import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../../../components/formComponent/Input';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import { useSelector } from 'react-redux';
import Heading from '../../../../components/UI/Heading';
import { handleReactSelectDropDownOptions, notify } from '../../../../utils/utils';
import {
    GRNBindRequisitionType,
    GRNGetStore,
    GRNGetVendor,
    GRNSearch,
    POApprovalMasterBindEmployee,
    PReqGetPRDetailsReport,
    PRPOGRNBindItemapp,
    RNPOApprovalPOReport,

} from '../../../../networkServices/Purchase';
import Tables from '../../../../components/UI/customTable';
import DatePicker from '../../../../components/formComponent/DatePicker';
import moment from 'moment';
import ViewPRAnalysis from './ViewPRAnalysis';
import Modal from '../../../../components/modalComponent/Modal';
import { RedirectURL } from '../../../../networkServices/PDFURL';

export default function PRSummurisedAnalysis() {
    const [modalData, setModalData] = useState({ visible: false })
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [t] = useTranslation();
    const [dropDownState, setDropDownState] = useState({
        BindItems: [],
        storeType: [],
        requestType: [],
        vendor: [],
    });
    const [values, setValues] = useState({
        RequestNo: "",
        storeType: {
            LedgerName: "Medical Store",
            value: "STO00001",
        },
        requestType: {},
        fromDate: moment(new Date()).toDate(),
        toDate: moment(new Date()).toDate(),
        vendor: "",
    });
    const [tableData, setTableData] = useState([]);

    const GetStore = async () => {
        try {
            const storeType = await GRNGetStore();
            if (storeType?.success) {
                setDropDownState((val) => ({
                    ...val,
                    storeType: handleReactSelectDropDownOptions(
                        storeType?.data,
                        "LedgerName",
                        "LedgerNumber"
                    ),
                }));
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    const GetGRNBindRequisitionType = async () => {
        try {
            const requestType = await GRNBindRequisitionType();
            if (requestType?.success) {
                setDropDownState((val) => ({
                    ...val,
                    requestType: handleReactSelectDropDownOptions(
                        requestType?.data,
                        "TypeName",
                        "TypeID"
                    ),
                }));
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    const GetGRNGetVendor = async () => {
        try {
            const vendor = await GRNGetVendor();
            if (vendor?.success) {
                setDropDownState((val) => ({
                    ...val,
                    vendor: handleReactSelectDropDownOptions(
                        vendor?.data,
                        "VendorName",
                        "Vendor_ID"
                    ),
                }));
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

 
    useEffect(() => {
     
        GetStore();
        GetGRNBindRequisitionType();
        GetGRNGetVendor();
    }, []);

    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };

    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    const handleSearch = async () => {
        try {
            let payload = {
                fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
                toDate: moment(values.toDate).format("YYYY-MM-DD"),
                storeType: values?.storeType?.value,
                vendorName: values?.vendor?.value ? values?.vendor?.value : "",
                prNo: values?.RequestNo,
                requestType: values?.requestType?.value ? values?.requestType?.value : 0,
            };
            const response = await GRNSearch(payload);
            if (response.success) {
                setTableData(response?.data);
            } else {
                console.error("API returned success as false:", response);
                notify(response?.message, "error");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notify(error?.message || "An error occurred during search.", "error");
        }
    };
    const handleClose = () => {

        setModalData((val) => ({ ...val, visible: false }))

    }

    const handleViewClick = async (prNo) => {

        try {
            const response = await PRPOGRNBindItemapp(prNo)
            if (response?.success) {

                setModalData({
                    visible: true,
                    width: "80vw",
                    Heading: "60vh",
                    label: "Purchase Request's",
                    footer: (
                        <>
                        </>
                    ),
                    Component: <ViewPRAnalysis response={response?.data} handleClose={handleClose} />
                })

            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notify(error?.message || "An error occurred during search.", "error");
        }

    };
    const handlePOClick = async (currentPONumber) => {
       console.log("currentPONumber",currentPONumber)
        const payload=  {
            poNumber:currentPONumber
            }
        try {
            const response = await RNPOApprovalPOReport(payload)
            if (response?.success) {
                 RedirectURL(response?.data?.pdfUrl);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notify(error?.message || "An error occurred during search.", "error");
        }

    };
    const handlePRClick = async (currentPRNo) => {
      const payload=  {
            PrNumber:currentPRNo
            }

        try {
            const response = await PReqGetPRDetailsReport(payload)
            if (response?.success) {
            
                RedirectURL(response?.data?.pdfUrl);

            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notify(error?.message || "An error occurred during search.", "error");
        }

    };


    const transformedData = [];
    let previousPRNo = null;
    let previousGRNDATE = null;
    let previouspoDate = null;
    let previousPONumber = null;
    let previousRaisedBy = null;
    let previousPrDate = null;
    let previousSupplier = null;
    let previousGrnNumber = null;

    tableData?.forEach((val, index) => {
        const currentPRNo = val.PurchaseRequestNo || "";
        const currentGRNDATE = val.GRNDATE || "";
        const currentpoDate = val.PODate || "";
        const currentPONumber = val.PONumber || "";
        const currentRaisedBy = val.raisedBy || "No";
        const currentPrDate = val.RequestDate || "";
        const currentSupplier = val.VendorName || "No suppliers";
        const currentGrnNumber = val.ReferenceNo || "";
        const shouldDisplayViewButton = currentPRNo !== previousPRNo;


        transformedData.push({
            sno: index + 1,
            store: val.LedgerName,
            prNo: currentPRNo === previousPRNo ? "" : <span onDoubleClick={()=>handlePRClick(currentPRNo)}>{currentPRNo}</span>,
            view: shouldDisplayViewButton ? <i className="fa fa-eye" onClick={() => handleViewClick(currentPRNo)}> </i>
                // <button className="btn " onClick={() => handleViewClick(currentPRNo)}>View</button> 
                : "",
            prDate: currentPrDate === previousPrDate ? "" : currentPrDate,
            raisedBy: currentRaisedBy === previousRaisedBy ? "" : currentRaisedBy,
            poNumbers: currentPONumber === previousPONumber ? "" : <span onDoubleClick={()=>handlePOClick(currentPONumber)}>{currentPONumber}</span>,
            poDate: currentpoDate === previouspoDate ? "" : currentpoDate,
            suppliers: currentSupplier === previousSupplier ? "" : currentSupplier,
            grnNumbers: currentGrnNumber === previousGrnNumber ? "" : currentGrnNumber,
            grnDate: currentGRNDATE === previousGRNDATE ? "" : currentGRNDATE,
        });

        previousPRNo = currentPRNo;
        previousGRNDATE = currentGRNDATE;
        // previouspoDate = currentpoDate;
        previousPONumber = currentPONumber;
        previousRaisedBy = currentRaisedBy;
        previousPrDate = currentPrDate;
        previousSupplier = currentSupplier;
        previousGrnNumber = currentGrnNumber;
    });

    return (
        <>
            <div className="m-2 spatient_registration_card card">
                <Heading title={t("heading")} isBreadcrumb={true} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                    <Input
                        type="text"
                        className="form-control"
                        id="RequestNo"
                        name="RequestNo"
                        value={values?.RequestNo || ""}
                        onChange={handleChange}
                        lable={t("Request No.")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Store Type")}
                        id={"storeType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={dropDownState?.storeType}
                        handleChange={handleSelect}
                        value={values?.storeType?.value || ""}
                        name={"storeType"}
                    />
                    <ReactSelect
                        placeholderName={t("Request Type")}
                        id={"requestType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={dropDownState?.requestType}
                        handleChange={handleSelect}
                        value={values?.requestType?.value || ""}
                        name={"requestType"}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="fromDate"
                        name="fromDate"
                        lable={t("FromDate")}
                        value={values?.fromDate || new Date()}
                        handleChange={handleChange}
                        placeholder={VITE_DATE_FORMAT}
                        respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="toDate"
                        name="toDate"
                        value={values?.toDate || new Date()}
                        handleChange={handleChange}
                        lable={t("ToDate")}
                        placeholder={VITE_DATE_FORMAT}
                        respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                    />
                    <ReactSelect
                        placeholderName={t("Vendor")}
                        id={"vendor"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={dropDownState?.vendor}
                        handleChange={handleSelect}
                        value={values?.vendor?.value || ""}
                        name={"vendor"}
                    />
                    <div className=" col-sm-2 col-xl-2">
                        <button className="btn btn-sm btn-success" type="button" onClick={handleSearch}>
                            {t("Search")}
                        </button>
                    </div>
                </div>
                <Heading title={t("Approval Master List")} isBreadcrumb={false} />
            </div>
            <div className="mt-2 spatient_registration_card">
                <Tables
                    thead={[
                        { width: "1%", name: t("SNo") },
                        { name: t("Store") },
                        { name: t("PR No.") },
                        { width: "5%", name: t("View") },
                        { name: t("PR Date") },
                        { name: t("PR RaisedBy") },
                        { name: t("PO Number") },
                        { name: t("PO Date") },
                        { width: "2%", name: t("Supplier") },
                        { width: "2%", name: t("GRN Number") },
                        { width: "2%", name: t("GRN Date") },
                    ]}
                    tbody={transformedData}
                />
            </div>
            {modalData?.visible && (
                <Modal
                    visible={modalData?.visible}
                    setVisible={() => { setModalData({ visible: false }) }}
                    modalData={modalData?.URL}
                    modalWidth={modalData?.width}
                    Header={modalData?.label}
                    buttonType="button"
                    footer={modalData?.footer}
                >
                    {modalData?.Component}
                </Modal>
            )}
        </>
    );
}

