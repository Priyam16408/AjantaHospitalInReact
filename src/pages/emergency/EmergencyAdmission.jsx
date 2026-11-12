import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import ReactSelect from "../../components/formComponent/ReactSelect";
import OverLay from "../../components/modalComponent/OverLay";
import { Fragment, lazy, useEffect, useMemo, useRef, useState } from "react";
import TestPayment from "../../components/front-office/TestPayment";
import PaymentGateway from "../../components/front-office/PaymentGateway";
import TestAddingTable from "../../components/UI/customTable/frontofficetables/TestAddingTable";
import {
    BindDisApprovalList,
    BindPRO,
    CheckblacklistAPI,
    GetBindDoctorDept,
    GetDiscReasonList,
    GetEligiableDiscountPercent,
    GetLastVisitDetail,
    LastVisitDetails,
    PatientSearchbyBarcode,
    SaveLabPrescriptionOPD,
    bindHashCode,
    bindPanelByPatientID,
} from "../../networkServices/opdserviceAPI";
import { PAYMENT_OBJECT, THEAD } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import {
    GetBindDepartment,
    GetBindReferDoctor,
    GetBindReferalType,
} from "../../store/reducers/common/CommonExportFunction";
import {
    EmgPatientSaveReg,
    OPDServiceBookingPayload,
    ReactSelectisDefaultValue,
    handleReactSelectDropDownOptions,
    handlereferDocotorIDByReferalType,
    notify,
    reactSelectOptionList,
} from "../../utils/utils";
import SearchComponentByUHIDMobileName from "../../components/commonComponents/SearchComponentByUHIDMobileName";
import DetailsCardForDefaultValue from "../../components/commonComponents/DetailsCardForDefaultValue";
import Index from "../frontOffice/PatientRegistration/Index";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import NotificationCard from "../frontOffice/Re_Print/NotificationCard";
import MessageCard from "../frontOffice/Re_Print/MessageCard";
import { useLocation } from "react-router-dom";
import { OpenPDFURL } from "../../networkServices/PDFURL";
import { bindEmergencyRoomBed, bindEmergencyRoomType, bindFieldList, SaveEmergencyAdmission } from "../../networkServices/Emergency";

export default function OPDServiceBooking(props) {
    const { UHID, TestData, handleConfirmationSubmit } = props;

    const location = useLocation();
    const [t] = useTranslation();
    const [singlePatientData, setSinglePatientData] = useState({});
    const [roomList, setRoomList] = useState({ roomTypeList: [], roomBedNoList: [] });
    const [visible, setVisible] = useState(false);
    const [renderComponent, setRenderComponent] = useState({
        name: "",
        component: null,
    });
    const [discounts, setDiscounts] = useState({
        discountApprovalList: [],
        discountReasonList: [],
    });
    const [testPaymentState, setTestPaymentState] = useState({
        type: "",
        category: "0",
        subCategory: "0",
        searchType: 1,
    });
    const [testAddingTableState, setTestAddingTable] = useState([]);
    let userData = useLocalStorage("userData", "get");

    let initialValue = {
        panelID: "",
        referalTypeID: {
            label: "Self",
            value: 4,
        },
        referDoctorID: "",
        DepartmentID: "ALL",
        DoctorID: "",
        proId: "",
    }
    // global state for this component
    const [payloadData, setPayloadData] = useState(initialValue);

    const [paymentControlModeState, setPaymentControlModeState] =
        useState(PAYMENT_OBJECT);

    const [paymentMethod, setPaymentMethod] = useState([]);

    const [notificationDetail, setNotificationData] = useState([]);

    const sendReset = () => {
        setSinglePatientData({});

        setTestPaymentState({
            type: "",
            category: "0",
            subCategory: "0",
            searchType: 1,
        });

        setTestAddingTable([]);

        setPayloadData({
            panelID: "",
            referalTypeID: {
                label: "Self",
                value: 4,
            },
            referDoctorID: "",
            DepartmentID: "ALL",
            DoctorID: "",
            proId: "",
        });

        setPaymentControlModeState(PAYMENT_OBJECT);
        setPaymentMethod([]);
        setNotificationData([]);
    };

    const ModalComponent = (name, component) => {
        setVisible(true);
        setRenderComponent({
            name: name,
            component: component,
        });
    };

    const handleGetLastVisitDetail = async (PatientID, DoctorID) => {
        try {
            const data = await GetLastVisitDetail(PatientID, DoctorID);
            return data?.data;
        } catch (error) {
            console.log(error, "error");
        }
    };

    const handleLastVisitDetails = async (PatientID) => {
        try {
            const data = await LastVisitDetails(PatientID);
            return data?.data;
        } catch (error) {
            console.log(error, "error");
        }
    };

    //   const handleChecker = (params) => {
    //     const data = params.reduce((acc, current) => {
    //       if (Object.keys(current).length > 0) {
    //         acc.push(current);
    //       }
    //       return acc;
    //     }, []);
    // debugger
    //     return data;
    //   };

    // const handleDoctorSelected = (ID) => {
    //   setPayloadData({ ...payloadData, DoctorID: ID });
    // };

    const handleJSXNotificationDetils = (details) => {
        const { getLastDetail, lastDetail } = details;
        const response = {
            getLastDetail: {},
            lastDetail: {},
        };

        // getLastDetail

        response.getLastDetail.header = "Last Visit Details";

        const responsegetLastDetail = getLastDetail[getLastDetail.length - 1];

        const component = (
            <div>
                <div className="d-flex justify-content-between">
                    <div>Date</div>
                    <div>{responsegetLastDetail?.VisitDate}</div>
                </div>

                <div className="d-flex justify-content-between">
                    <div>Valid To</div>
                    <div>{responsegetLastDetail?.ValidTo}</div>
                </div>

                <div className="d-flex justify-content-between">
                    <div>Amount Paid</div>
                    <div>{responsegetLastDetail?.AmountPaid}</div>
                </div>

                <div className="d-flex justify-content-between">
                    <div>Days</div>
                    <div>{responsegetLastDetail?.Days}</div>
                </div>

                <div className="d-flex justify-content-between">
                    <div>Type</div>
                    <div>{responsegetLastDetail?.VisitType}</div>
                </div>

                <div className="d-flex justify-content-between">
                    <div>Doctor</div>
                    <div>{responsegetLastDetail?.Doctor}</div>
                </div>
            </div>
        );

        response.getLastDetail.component = component;

        // lastDetail

        response.lastDetail.header = "Last Visit Details";

        const responselastDetail = lastDetail;

        const responselastDetailcomponent = (
            <table>
                <tbody>
                    {responselastDetail?.map((ele, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ textAlign: "left" }}>{ele?.Name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );

        response.lastDetail.component = responselastDetailcomponent;
        return response;
    };

    const handleSinglePatientData = async (data) => {
        let blacklist = await CheckblacklistAPI();
        const { MRNo } = data;
        try {
            const data = await PatientSearchbyBarcode(MRNo, 1);
            const responseGetLastVisitDetail = await handleGetLastVisitDetail(
                MRNo,
                " "
            );
            const responseLastVisitDetail = await handleLastVisitDetails(MRNo);

            if (
                responseGetLastVisitDetail.length > 0 &&
                responseLastVisitDetail.length > 0
            ) {
                const { getLastDetail, lastDetail } = handleJSXNotificationDetils({
                    getLastDetail: responseGetLastVisitDetail,
                    lastDetail: responseLastVisitDetail,
                });

                const notificationResponse = [getLastDetail, lastDetail];

                setNotificationData(notificationResponse);
            }
            setSinglePatientData(
                Array.isArray(data?.data) ? data?.data[0] : data?.data
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (UHID) {
            handleSinglePatientData({ MRNo: UHID });
        }
    }, [UHID]);



    // table


    const renderNotification = useMemo(() => {
        return (
            <NotificationCard>
                {notificationDetail.map((row, index) => {
                    return (
                        <MessageCard header={row?.header} key={index}>
                            {row?.component}
                        </MessageCard>
                    );
                })}
            </NotificationCard>
        );
    }, [notificationDetail]);

    const GetDiscListAPI = async () => {
        try {
            const [
                discountReasonListRes,
                discountApprovalListRes,
                eligibleDiscountPercentRes,
                RoomTypeList,
                TriageCodeList
            ] = await Promise.all([
                GetDiscReasonList("OPD"),
                BindDisApprovalList("HOSPITAL", "1"),
                GetEligiableDiscountPercent(userData?.employeeID),
                bindEmergencyRoomType(),
                bindFieldList()
            ]);
            if (RoomTypeList?.success) {
                setRoomList((val) => ({ ...val, roomTypeList: reactSelectOptionList(RoomTypeList?.data, "Name", "IPDCaseTypeID") }))
            } else {
                setRoomList((val) => ({ ...val, roomTypeList: [] }))
            }
            if (TriageCodeList?.success) {
                setRoomList((val) => ({ ...val, TriageCodeList: TriageCodeList?.data?.filter((val) => val?.TypeID === 1) }))
            }
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

 

    // const[]

    useEffect(() => {
        GetDiscListAPI();
    }, []);

    const ReactSelectHandleChange = async (name, e) => {
        if (name === "RoomType") {
            let apiResp = await bindEmergencyRoomBed(e)
            if (apiResp?.success) {
                setRoomList((val) => ({ ...val, roomBedNoList: reactSelectOptionList(apiResp?.data, "Name", "RoomID") }))
            } else {
                setRoomList((val) => ({ ...val, roomBedNoList: [] }))
                // notify(apiResp?.message, "error")
            }
        }
        setPayloadData((val) => ({ ...val, [name]: e }))
    }

    const handleEmgSave = async () => {
        if (!payloadData?.DoctorID) {
            notify("Doctor field is require", "error")
            return 0
        } else if (!payloadData?.RoomType) {
            notify("Room type field is require", "error")
            return 0;
        }
        const hashcode = await bindHashCode();
        let payload = EmgPatientSaveReg(payloadData, singlePatientData, hashcode?.data)

        let apiResp = await SaveEmergencyAdmission(payload);
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            setPayloadData(initialValue)
            setSinglePatientData({})
        } else {
            notify(apiResp?.message, "error")
        }

    }

    return (
        <>
            {/* {bodyData.map((ele)=> ele.Qty * ele.Rate)} */}
            <div className="card patient_registration border">
                <Heading
                    title={"Search Criteria"}
                    isBreadcrumb={true}
                    secondTitle={
                        !UHID && (
                            <>
                                <button
                                    className="btn btn-primary btn-sm px-2 ml-1"
                                    onClick={() =>
                                        ModalComponent(
                                            " New Registration",
                                            <Index
                                                bindDetail={true}
                                                bindDetailAPI={handleSinglePatientData}
                                                setVisible={setVisible}
                                            />
                                        )
                                    }
                                >
                                    {t("NewRegistration")}
                                </button>
                            </>
                        )
                    }
                />
                {Object.keys(singlePatientData)?.length === 0 ? (
                    <SearchComponentByUHIDMobileName onClick={handleSinglePatientData} />
                ) : (
                    <DetailCard
                        ModalComponent={ModalComponent}
                        singlePatientData={singlePatientData}
                        payloadData={payloadData}
                        setPayloadData={setPayloadData}
                        sendReset={sendReset}
                        setVisible={setVisible}
                        bindDetailAPI={handleSinglePatientData}
                        UHID={UHID ?? false}
                    />
                )}
            </div>
            {!(Object.keys(singlePatientData)?.length === 0) && <>
                <div className="card  patient_registration_card ">
                    <div className="row  pt-2 pl-2 pr-2">
                        <ReactSelect
                            placeholderName={t("RoomType")}
                            id="RoomType"
                            searchable={true}
                            name="RoomType"
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                            requiredClassName={"required-fields"}
                            dynamicOptions={roomList?.roomTypeList}
                            value={payloadData?.RoomType}
                            handleChange={ReactSelectHandleChange}
                        />
                        <ReactSelect
                            placeholderName={t("RoomBedNo")}
                            id="RoomBedNo"
                            searchable={true}
                            name="RoomBedNo"
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                            dynamicOptions={roomList?.roomBedNoList}
                            value={payloadData?.RoomBedNo}
                            handleChange={ReactSelectHandleChange}
                        />
                        <ReactSelect
                            placeholderName={t("TriageCode")}
                            id="TriageCode"
                            searchable={true}
                            name="TriageCode"
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                            dynamicOptions={roomList?.TriageCodeList}
                            value={payloadData?.TriageCode}
                            handleChange={ReactSelectHandleChange}
                        />


                    </div>
                </div>

                <div className="mt-2  text-right">
                    <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields" type="button" onClick={handleEmgSave}>
                        {t("Save")}
                    </button>
                </div>
            </>
            }





            {/* Payment Component */}

            {/* <PaymentGateway
                screenType={paymentControlModeState}
                setScreenType={setPaymentControlModeState}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                discounts={discounts}
                testAddingTableState={testAddingTableState}
                button={
                    <button className="button" onClick={handleOPDServiceAPI}>
                        {t("FrontOffice.OPD.PaymentGateway.Save")}
                    </button>
                }
            /> */}

            <OverLay
                visible={visible}
                setVisible={setVisible}
                Header={renderComponent?.name}
            >
                {renderComponent?.component}
            </OverLay>

            {renderNotification}
        </>
    );
}

const DetailCard = ({
    ModalComponent,
    singlePatientData,
    payloadData,
    setPayloadData,
    sendReset,
    setVisible,
    bindDetailAPI,
    UHID,
}) => {
    const [t] = useTranslation();
    const dispatch = useDispatch();

    const { GetBindReferDoctorList, GetReferTypeList, GetDepartmentList } =
        useSelector((state) => state?.CommonSlice);

    const [DropDownState, setDropDownState] = useState({
        getBindPanelByPatientID: [],
        getBindProList: [],
        getDoctorDeptWise: [],
    });

    const handlePanelReactSelectChange = (name, e) => {
        const data = DropDownState?.getBindPanelByPatientID.find(
            (ele) => Number(ele?.value) === Number(e?.value)
        );
        setPayloadData({
            ...payloadData,
            [name]: data,
        });
    };

    // react select handleChange
    const handleReactSelectChange = async (name, e) => {
        // debugger;
        switch (name) {
            case "referDoctorID":
                handleBindPRO(e?.value);
                setPayloadData({
                    ...payloadData,
                    [name]: e?.value,
                });
                break;
            case "DepartmentID":
                const data = await handleDoctorDeptWise(e?.label);
                setDropDownState({
                    ...DropDownState,
                    getDoctorDeptWise: handleReactSelectDropDownOptions(
                        data,
                        "Name",
                        "DoctorID"
                    ),
                });

                setPayloadData({
                    ...payloadData,
                    [name]: e?.value,
                });

            case "referalTypeID":
                setPayloadData({
                    ...payloadData,
                    [name]: e,
                    referDoctorID: handlereferDocotorIDByReferalType(
                        e?.value,
                        payloadData?.DoctorID,
                        ""
                    ),
                });
                break;

            case "DoctorID":
                setPayloadData({
                    ...payloadData,
                    [name]: e?.value,
                    referDoctorID: handlereferDocotorIDByReferalType(
                        payloadData?.referalTypeID?.value,
                        e?.value,
                        payloadData?.referDoctorID
                    ),
                });
                break;

            default:
                setPayloadData({
                    ...payloadData,
                    [name]: e?.value,
                });
                break;
        }
    };

    const handleBindPanelByPatientID = async () => {
        try {
            const data = await bindPanelByPatientID(singlePatientData?.PatientID);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBindPRO = async (referDoctorID) => {
        try {
            const data = await BindPRO(referDoctorID);
            setDropDownState({
                ...DropDownState,
                getBindProList: handleReactSelectDropDownOptions(
                    data?.data,
                    "ProName",
                    "Pro_ID"
                ),
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDoctorDeptWise = async (Department) => {
        try {
            const data = await GetBindDoctorDept(Department);
            return data?.data;
        } catch (error) {
            console.log(error);
        }
    };

    // api call
    const FetchAllDropDown = async () => {
        // debugger;
        try {
            const response = await Promise.all([
                handleBindPanelByPatientID(),
                handleDoctorDeptWise(payloadData?.DepartmentID),
            ]);

            const responseDropdown = {
                getBindPanelByPatientID: handleReactSelectDropDownOptions(
                    response[0],
                    "PanelName",
                    "PanelID"
                ),
                getDoctorDeptWise: handleReactSelectDropDownOptions(
                    response[1],
                    "Name",
                    "DoctorID"
                ),
            };
            setDropDownState(responseDropdown);
            setPayloadData({
                ...payloadData,
                panelID: ReactSelectisDefaultValue(
                    responseDropdown?.getBindPanelByPatientID,
                    "isDefaultPanel"
                ),
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDataInDetailView = useMemo(() => {
        const data = [
            {
                label: t("PatientId"),
                value: `${singlePatientData?.PatientID}`,
            },

            {
                label: t("PatientName"),
                value: `${singlePatientData?.Title} ${singlePatientData?.PName}`,
            },
            {
                label: t("GenderAge"),
                value: `${singlePatientData?.Gender} / ${singlePatientData?.Age}`,
            },
            {
                label: t("ContactNo"),
                value: singlePatientData?.Mobile,
            },

            {
                label: t("Address"),
                value: singlePatientData.House_No,
            },

            {
                label: t("OutStanding"),

                value: singlePatientData?.Outstanding ?? "0.00",
            },
        ];

        return data;
    }, [singlePatientData]);

    useEffect(() => {
        FetchAllDropDown();
        dispatch(GetBindReferDoctor());
        dispatch(GetBindReferalType());
        dispatch(GetBindDepartment());
    }, []);

    const findReferDisable = (GetReferTypeListData, KeyMatch, valueMatch) => {
        return GetReferTypeListData?.find(
            (ele) => Number(ele[KeyMatch]) === Number(valueMatch)
        );
    };
    let PatientRegistrationArg = {
        PatientID: singlePatientData?.PatientID,
        setVisible: setVisible,
        bindDetailAPI: bindDetailAPI,
        handleBindPanelByPatientID: handleBindPanelByPatientID,
    };
    return (
        <>
            <DetailsCardForDefaultValue
                singlePatientData={handleDataInDetailView}
                PatientRegistrationArg={PatientRegistrationArg}
                ModalComponent={ModalComponent}
                sendReset={sendReset}
                show={UHID}
            >
                <>
                    <ReactSelect
                        placeholderName={t(
                            "InSurancePanel"
                        )}
                        id={"InSurancePanel"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        value={payloadData?.panelID?.value}
                        name={"panelID"}
                        dynamicOptions={DropDownState?.getBindPanelByPatientID}
                        handleChange={handlePanelReactSelectChange}
                        removeIsClearable={true}
                    />

                    <ReactSelect
                        placeholderName={t("refertype")}
                        id={"refertype"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        dynamicOptions={handleReactSelectDropDownOptions(
                            GetReferTypeList,
                            "ReferalType",
                            "ReferalTypeID"
                        )}
                        name={"referalTypeID"}
                        value={payloadData?.referalTypeID?.value}

                        handleChange={handleReactSelectChange}
                        isDisabled={UHID ? true : false}
                        removeIsClearable={true}
                    />

                    <ReactSelect
                        placeholderName={t("referDoctor")}
                        id={"referDoctor"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        isDisabled={
                            findReferDisable(
                                GetReferTypeList,
                                "ReferalTypeID",
                                payloadData?.referalTypeID?.value
                            )?.IsDisable
                        }
                        dynamicOptions={
                            Number(
                                findReferDisable(
                                    GetReferTypeList,
                                    "ReferalTypeID",
                                    payloadData?.referalTypeID?.value
                                )?.IsMainDoctor
                            ) === 0
                                ? handleReactSelectDropDownOptions(
                                    GetBindReferDoctorList,
                                    "NAME",
                                    "DoctorID"
                                )
                                : [...DropDownState?.getDoctorDeptWise]
                        }
                        name="referDoctorID"
                        value={payloadData?.referDoctorID}
                        handleChange={handleReactSelectChange}
                    />

                    <ReactSelect
                        placeholderName={t("PRO")}
                        id={"PRO"}
                        searchable={true}
                        name={"proId"}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        dynamicOptions={DropDownState?.getBindProList}
                        value={payloadData?.proId}
                        handleChange={handleReactSelectChange}
                        isDisabled={UHID ? true : false}
                    />

                    <ReactSelect
                        placeholderName={t("Department")}
                        id={"department"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        dynamicOptions={[
                            { label: "All", value: "ALL" },
                            ...handleReactSelectDropDownOptions(
                                GetDepartmentList,
                                "Name",
                                "ID"
                            ),
                        ]}
                        name="DepartmentID"
                        value={payloadData?.DepartmentID}
                        handleChange={handleReactSelectChange}
                        isDisabled={UHID ? true : false}
                        removeIsClearable={true}
                    />
                    <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                        <ReactSelect
                            placeholderName={t("Doctor")}
                            id={"doctor"}
                            searchable={true}
                            requiredClassName=" required-fields"
                            dynamicOptions={DropDownState?.getDoctorDeptWise}
                            name="DoctorID"
                            value={Number(payloadData?.DoctorID)}
                            handleChange={handleReactSelectChange}
                            isDisabled={UHID ? true : false}
                            removeIsClearable={true}
                        />
                    </div>
                </>
            </DetailsCardForDefaultValue>
        </>
    );
};
