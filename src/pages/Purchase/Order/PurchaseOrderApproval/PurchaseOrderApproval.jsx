import React, { useState, useEffect } from 'react'
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import Heading from '../../../../components/UI/Heading';
import Tables from '../../../../components/UI/customTable';
import Modal from '../../../../components/modalComponent/Modal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { handleReactSelectDropDownOptions, notify } from '../../../../utils/utils';
import DatePicker from '../../../../components/formComponent/DatePicker';
import { PurchaseOrderApprovalGetPurchaseItems } from '../../../../networkServices/purchaseDepartment';
import RejectModal from './RejectModal';
import UpdateModal from './UpdateModal';
import ApprovalModal from './ApprovalModal';
import moment from 'moment';
import { PurchaGetDepartMent } from '../../../../networkServices/Purchase';
import { useLocalStorage } from '../../../../utils/hooks/useLocalStorage';

const PurchaseOrderApproval = () => {
    const {deptLedgerNo} = useLocalStorage("userData", "get")
    const [values, setValues] = useState({
        departmentTo: { value: deptLedgerNo, label: "" },
        type: { value: "1", label: "ALL" },
        fromDate: new Date(),
        toDate: new Date(),
        center: { value: "0", label: "ALL", CentreID: "0" },
    })

    const [tbodyPurchaseOrders, setTbodyPurchaseOrders] = useState([]);


    const [t] = useTranslation();
    const { GetEmployeeWiseCenter } = useSelector(
        (state) => state?.CommonSlice
    );

    const [dropDownState, setDropDownState] = useState({
        GetDepartMent: [],
    })
    const renderPurchaGetDepartMentAPI = async () => {
        try {
            const GetDepartMent = await PurchaGetDepartMent();
            if (GetDepartMent?.success) {
                setDropDownState((val) => ({
                    ...val,
                    GetDepartMent: handleReactSelectDropDownOptions(
                        GetDepartMent?.data,
                        "RoleName",
                        "DeptLedgerNo"
                    ),
                }));
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    useEffect(() => {
        renderPurchaGetDepartMentAPI();
    }, [])

    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }

    const [handleModelData, setHandleModelData] = useState({});

    const getPurchaseOrder = async () => {

        try {
            let payload =

            {
                "fromDate": moment(values?.fromDate).format("DD-MMM-YYYY"),
                "toDate": moment(values?.toDate).format("DD-MMM-YYYY"),
                "departmentLedgerNo": values?.departmentTo?.value,
                "CentreID": Number(values?.center.CentreID),
                "requestionTypeID": Number(values?.type?.value),
                "searchType": true
            }


            const response = await PurchaseOrderApprovalGetPurchaseItems(payload);
            if (response.success) {
                // setTbodyPurchaseRequest(response.data)

                setTbodyPurchaseOrders(response.data)

            } else {
                console.error(
                    "API returned success as false or invalid response:",
                    response
                );
                notify(response?.message, "error");
                setTbodyPurchaseOrders([]);
            }
        } catch (error) {
            console.error("Error fetching department data:", error);
            notify(response?.message, "error");
            setTbodyPurchaseOrders([]);

        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    }

    const handleReactChange = (name, e, key) => {

        setValues((val) => ({ ...val, [name]: e }));

    };
    const handleClickReject = (data, Details) => {

        const { itemLabel, Component, width } = Details;
        setHandleModelData({
            isOpen: true,
            width: width,
            label: itemLabel,
            Component: Component,
            // RejectPurchaseRequest: RejectPurchaseRequest
        })

    }

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
               
                        <div className="card patient_registration  ">

                            <Heading
                                title={t("Purchase Request Approval")}
                                isBreadcrumb={true}
                            />
                            <div className="row p-2">

                                <ReactSelect
                                    placeholderName={t("Centre")}
                                    id={"center"}
                                    searchable={true}
                                    removeIsClearable={true}
                                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(GetEmployeeWiseCenter ? GetEmployeeWiseCenter : "", "CentreName", "CentreID")]}
                                    handleChange={handleSelect}
                                    value={`${values?.center?.value}`}
                                    name={"center"}
                                />

                                <DatePicker
                                    className="custom-calendar"
                                    placeholder=""
                                    lable={t("From Date")}
                                    respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                                    name="fromDate"
                                    id="fromDate"
                                    value={values?.fromDate ? moment(values?.fromDate).toDate() : ""}
                                    // value={payload?.deliveryDate}
                                    showTime
                                    maxDate={new Date()}
                                    hourFormat="12"
                                    handleChange={handleChange}
                                />
                                <DatePicker
                                    className="custom-calendar"
                                    placeholder=""
                                    lable={t("To Date")}
                                    respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                                    name="toDate"
                                    id="toDate"
                                    value={values?.toDate ? moment(values?.toDate).toDate() : ""}
                                    // value={payload?.deliveryDate}
                                    showTime
                                    maxDate={new Date()}
                                    hourFormat="12"
                                    handleChange={handleChange}
                                />
                                <ReactSelect
                                    placeholderName={t("Department To")}
                                    searchable={true}
                                    requiredClassName={"required-fields"}
                                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    id={"departmentTo"}
                                    name={"departmentTo"}
                                    removeIsClearable={true}

                                    handleChange={(name, e) => handleReactChange(name, e)}
                                    dynamicOptions={[{ value: "0", label: "ALL" }, ...dropDownState?.GetDepartMent]}
                                    value={values?.departmentTo?.value}
                                />


                                <ReactSelect
                                    placeholderName={t("Type")}
                                    id={"type"}
                                    searchable={true}
                                    removeIsClearable={true}
                                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    dynamicOptions={[
                                        { value: "1", label: "ALL" },
                                        { value: "2", label: "Issue" },
                                        { value: "3", label: "Return" },
                                        { value: "4", label: "Direct Issue" },
                                    ]}
                                    handleChange={handleSelect}
                                    value={`${values?.type?.value}`}
                                    name={"type"}
                                />
                                <div>
                                    <button
                                        className="btn btn-sm btn-primary mx-1 px-4"
                                        onClick={() => {
                                            getPurchaseOrder()
                                        }}
                                    >
                                        {t("Search")}
                                    </button>
                                </div>



                            </div>
                        </div>

                        <div className="mt-2 spatient_registration_card">
                            <Tables
                                thead={
                                    [
                                        { width: "1%", name: t("SNo") },
                                        { width: "5%", name: t("Purchase Order No") },
                                        { width: "5%", name: t("Subject") },
                                        { width: "5%", name: t("Supplier") },
                                        { width: "5%", name: t("Net Amount") },
                                        { width: "5%", name: t("Raised By") },
                                        { width: "1%", name: t("Raised On") },
                                        { width: "1%", name: t("Status") },
                                        { width: "1%", name: t("Edit") },
                                        { width: "1%", name: t("Approved") },
                                        { width: "1%", name: t("Reject") },

                                    ]

                                }
                                tbody={tbodyPurchaseOrders?.map((val, index) => ({

                                    sno: index + 1,
                                    prNo: val.PurchaseOrderNo,
                                    subject: val.Subject || "",
                                    VendorName: val.VendorName || "",
                                    GrossTotal: val.GrossTotal || "",
                                    UserName: val.UserName || "",
                                    RaisedDate: val.RaisedDate || "",
                                    status: val?.Status,
                                    // reject: <i className="fa fa-trash text-danger" /> || "",
                                    edit: (
                                        <span
                                            onClick={() => {
                                                handleClickReject(val, {
                                                    itemLabel: "Purchase Order Edit",
                                                    Component: <UpdateModal
                                                        inputData={val} handleClose={handleClose}
                                                        setTbodyPurchaseOrders={setTbodyPurchaseOrders}

                                                    />,
                                                    width: "40vw",


                                                });
                                            }}
                                        >
                                            <i className="fa fa-edit" />
                                        </span>
                                    ),
                                    approved: (
                                        <span
                                            onClick={() => {
                                                handleClickReject(val, {
                                                    itemLabel: "Approved Remark",
                                                    Component: <ApprovalModal
                                                        inputData={val} handleClose={handleClose}
                                                        getPurchaseOrder={getPurchaseOrder}
                                                    />,
                                                    width: "20vw",

                                                });
                                            }}
                                        >
                                            <i className="fa fa-check" />
                                        </span>
                                    ),
                                    reject: (
                                        <span
                                            onClick={() => {
                                                handleClickReject(val, {
                                                    itemLabel: "Reject Remark",
                                                    Component: <RejectModal
                                                        inputData={val} handleClose={handleClose}
                                                        setTbodyPurchaseOrders={setTbodyPurchaseOrders}
                                                        getPurchaseOrder={getPurchaseOrder}

                                                    />,
                                                    width: "20vw",

                                                });
                                            }}
                                        >
                                            <i className="fa fa-trash text-danger" />
                                        </span>
                                    ),

                                }))}
                            />
                        </div>


                 
            </div>

        </>
    )
}

export default PurchaseOrderApproval;