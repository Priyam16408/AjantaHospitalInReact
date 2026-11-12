import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import DatePicker from '../../../components/formComponent/DatePicker';
import ColorCodingSearch from '../../../components/commonComponents/ColorCodingSearch';
import { useDispatch } from 'react-redux';
import { GetBindAllDoctorConfirmation, GetBindDepartment, getBindPanelList } from '../../../store/reducers/common/CommonExportFunction';
import moment from 'moment';
import Heading from '../../../components/UI/Heading';
import { handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import { POSearchPRSummary, PRBindEmployee, PRBindLedger, PurchaseBindGetItems } from '../../../networkServices/Purchase';
import Report from './Report';
import Modal from '../../../components/modalComponent/Modal';
import ViewDetails from './ViewDetails';
export default function ViewPurchaseRequest() {

    let [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [modalData, setModalData] = useState({ visible: false })
    const [alldata, setAllData] = useState([])
    const [dropDownState, setDropDownState] = useState({
        BindItems: [],
        raisedUser: [],
        BindStore: []
    })
    const requestType = [
        { value: 0, label: "Normal" },
        { value: 1, label: "Urgent" },
        { value: 2, label: "Immediate" }
    ]

    const status = [
        // by tez sir
        { value: 0, label: "All" },
        { value: 1, label: "Pending" },
        { value: 2, label: "Reject" },
        { value: 3, label: "Open" },
        { value: 4, label: "Close" },
        // by komal maam
        // { value: 5, label: "All" },
        // { value: 0, label: "Pending" },
        // { value: 1, label: "Reject" },
        // { value: 2, label: "Open" },
        // { value: 3, label: "Close" },
    ]

    const [values, setValues] = useState({
        RequestNo: "",
        raisedUser: { value: "0", label: "All" },
        requestType: { value: 0, label: "Normal" },
        status: { value: 0, label: "All" },
        storeType: { name: 'Medical Store', categoryID: '8', configID: '28', label: 'Medical Store', value: 'STO00001' },
        // storeType: { value: "0", label: "Medical Store" },
        item: "",

        toDate: moment().format("YYYY-MM-DD"),
        fromDate: moment().format("YYYY-MM-DD"),
    });


    const PRBindStore = async () => {
        try {
            const BindStore = await PRBindLedger();
            setDropDownState((val) => ({
                ...val,
                BindStore: handleReactSelectDropDownOptions(
                    BindStore?.data,
                    "LedgerName",
                    "LedgerNumber"
                ),
            }));
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    const getItemApi = async () => {
        try {
            const BindItems = await PurchaseBindGetItems();
            if (BindItems?.success) {
                setDropDownState((val) => ({
                    ...val,
                    BindItems: handleReactSelectDropDownOptions(
                        BindItems?.data,
                        "ItemName",
                        "ItemID"
                    ),
                }));
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const GetPRBindEmployee = async () => {
        try {
            const raisedUser = await PRBindEmployee();
            if (raisedUser?.success) {
                setDropDownState((val) => ({
                    ...val,
                    raisedUser: handleReactSelectDropDownOptions(
                        raisedUser?.data,
                        "Name",
                        "EmployeeID"
                    ),
                }));

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    // const GetPRGetStore = async () => {
    //     try {
    //         const raisedUser = await GetStore();
    //         if (raisedUser?.success) {
    //             setDropDownState((val) => ({
    //                 ...val,
    //                 raisedUser: handleReactSelectDropDownOptions(
    //                     raisedUser?.data,
    //                     "Name",
    //                     "EmployeeID"
    //                 ),
    //             }));

    //         }
    //     } catch (error) {
    //         console.log(error, "SomeThing Went Wrong");
    //     }
    // };
    useEffect(() => {

        getItemApi()
        GetPRBindEmployee()
        PRBindStore()
    }, [])
    const dispatch = useDispatch()
    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };
    useEffect(() => {
        dispatch(GetBindAllDoctorConfirmation({ Department: "All" }));
        dispatch(GetBindDepartment());
        dispatch(getBindPanelList());
    }, [dispatch]);

    const handleSearchViewReqDetails = async (item = "") => {

        try {
            let payloadData =
            {
                "prNo": values?.RequestNo || "",
                "item": values?.item ? values?.item : "0",
                "employee": String(values?.raisedUser?.value || "0"),
                "requestType": values?.requestType.value || 0,
                "status": Number(values?.status.value),
                "purchase": values?.storeType?.value,
                "fromDate": values?.RequestNo ? "" : moment(values?.fromDate).format("DD-MMM-YYYY"),
                "toDate": values?.RequestNo ? "" : moment(values?.toDate).format("DD-MMM-YYYY"),
                "reportType": "",
                "reportFormat": "",
                "detailType": "",
                "partial": false
            }

            // by komal maam
            // {
            //     "prNumber":values?.RequestNo || "",
            //     "requestType":values?.requestType.value || 0,
            //     "fromDate":  values?.RequestNo ? "" :  moment(values?.fromDate).format("DD-MM-YYYY"),
            //     "toDate": values?.RequestNo ? "" : moment(values?.toDate).format("DD-MM-YYYY"),
            //     "status": values?.status.value,
            //     "employee": values?.raisedUser?.value || "",
            //     "item":values?.item ? values?.item : 0,
            //     "storeType":  values?.storeType?.value || "",
            //     "partial": 0
            //   }

            // {
            //     "prNumber": "",
            //     "requestType": 0,
            //     "fromDate": "2025-02-05",
            //     "toDate": "2025-02-08",
            //     "status": 0,
            //     "employee": "",
            //     "item": 0,
            //     "storeType": "STO00001",
            //     "partial": 0
            //   }

            // {
            //     "prNo": values?.RequestNo || "",
            //     "item": values?.item ? values?.item : "0",
            //     "employee": values?.raisedUser?.value || "",
            //     "requestType": "0",
            //     // "requestType": values?.requestType.value || "",
            //     "status": values?.status.value,
            //     "purchase": values?.storeType?.value,
            //     // "fromDate":"01-Dec-2020",
            //    "fromDate": values?.RequestNo ? "" :  moment(values?.fromDate).format("DD-MMM-YYYY"),
            //  "toDate": values?.RequestNo ? "" : moment(values?.toDate).format("DD-MMM-YYYY"),
            //     // "subject": "",
            //     "reportType": "",
            //     "reportFormat": "",
            //     "detailType": "",
            //     "partial": false
            // };
            let apiResp = await POSearchPRSummary(payloadData);
            const data = apiResp?.data?.filter((val) => val.STATUS === item || item === "")
            if (data.length === 0) {
                notify("Data not Found", "error");
            }
            if (apiResp?.data) {
                setAllData(data)
            }

        } catch (error) {
            console.log(error);
            notify(apiResp?.message, "error");
        }


    }

    const handleClickReport = () => {
        debugger
        setModalData({
            visible: true,
            width: "30vw",
            Heading: "60vh",
            label: t("Select Report Type"),
            footer: <></>,
            Component: <Report valuesData={values} setModalData={setModalData} />,

        })

    }
    const ViewThead = [
        { name: t("S.No."), width: "3%" },
        { name: t("PR No"), width: "7%" },
        { name: t("Store"), width: "10%" },
        { name: t("Remarks"), width: "3%" },
        { name: t("Type"), width: "3%" },
        { name: t("Status"), width: "3%" },
        { name: t("Partial"), width: "3%" },
        { name: t("Date"), width: "3%" },
        { name: t("Raised User"), width: "3%" },
        { name: t("View"), width: "3%" },
    ];

    const handleCallViewMedReq = (item) => {
        handleSearchViewReqDetails(item);
    };

    return (
        <>
            <div className="m-2 spatient_registration_card card">
                <Heading
                    title={t("sampleCollectionManagement.sampleCollection.heading")}
                    isBreadcrumb={true}
                />
                <div className="row  p-2">
                    <Input
                        type="text"
                        className="form-control"
                        id="RequestNo"
                        name="RequestNo"
                        value={values?.RequestNo ? values?.RequestNo : ""}
                        onChange={handleChange}
                        lable={t("Request No.")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />

                    <ReactSelect
                        placeholderName={t("Raised User")}
                        id={"raisedUser"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={[{ value: "0", label: "All" }, ...(dropDownState?.raisedUser || [])]}
                        // dynamicOptions={dropDownState?.raisedUser}
                        handleChange={handleSelect}
                        value={`${values?.raisedUser?.value}`}
                        name={"raisedUser"}
                    />
                    <ReactSelect
                        placeholderName={t("Request Type")}
                        id={"requestType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={requestType}
                        handleChange={handleSelect}
                        value={`${values?.requestType?.value}`}
                        name={"requestType"}
                    />
                    <ReactSelect
                        placeholderName={t("Status")}
                        id={"status"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={status}
                        handleChange={handleSelect}
                        value={`${values?.status?.value}`}
                        name={"status"}
                    />
                    <ReactSelect
                        placeholderName={t("Store Type")}
                        id={"storeType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        // dynamicOptions={storeType}
                        dynamicOptions={dropDownState?.BindStore}
                        handleChange={handleSelect}
                        value={`${values?.storeType?.value}`}
                        name={"storeType"}
                    />
                    <ReactSelect
                        placeholderName={t("Item")}
                        id={"item"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        // dynamicOptions={SampleCollected}
                        dynamicOptions={dropDownState?.BindItems}
                        handleChange={handleSelect}
                        value={`${values?.item?.value}`}
                        name={"item"}
                    />



                    <DatePicker
                        className="custom-calendar"
                        id="From Data"
                        name="fromDate"
                        lable={t("FromDate")}
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
                    <div className=" col-xl-2 col-md-3 col-sm-6 col-12">
                        <button className="btn btn-sm btn-success" type="button" onClick={() => handleSearchViewReqDetails("")}>
                            {t("Search")}
                        </button>
                        <button className="btn btn-sm btn-success ml-2" type="button"
                            onClick={handleClickReport}
                        >

                            {t("Report")}
                        </button>
                    </div>

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
                <Heading
                    title={t("Search Item")}
                    secondTitle={
                        <>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#09a115"}
                                    label={t("Open")}
                                    onClick={() => {
                                        handleCallViewMedReq("Open");
                                    }}
                                />
                            </span>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#9acd32"}
                                    label={t("Close")}
                                    onClick={() => {
                                        handleCallViewMedReq("Close");
                                    }}
                                />
                            </span>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#ffb6c1"}
                                    label={t("Reject")}
                                    onClick={() => {
                                        handleCallViewMedReq("Reject");
                                    }}
                                />
                            </span>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#ffff00"}
                                    label={t("Pending")}
                                    onClick={() => {
                                        handleCallViewMedReq("Pending");
                                    }}
                                />
                            </span>

                        </>
                    }
                />

                <ViewDetails
                    THEAD={ViewThead}
                    tbody={alldata}

                />

            </div>
        </>
    )
}
