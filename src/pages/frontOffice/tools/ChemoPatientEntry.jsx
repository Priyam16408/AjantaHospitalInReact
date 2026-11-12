import React, { useCallback, useEffect, useMemo, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import {
    bindPanelByPatientID,
    GetBindDoctorDept,
    GetLastVisitDetail,
    LastVisitDetails,
} from "../../../networkServices/opdserviceAPI";
import DetailsCardForDefaultValue from "../../../components/commonComponents/DetailsCardForDefaultValue";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import TimePicker from "../../../components/formComponent/TimePicker";
import Input from "../../../components/formComponent/Input";
import {
    AdmissionType,
    BasicMasterBindPro,
    BillingCategory,
    BillingIPDBindTPA,
    BindRoomBed,
    CommonReceiptPdf,
    GetPatientAdmissionDetails,
    RoomType,
} from "../../../networkServices/BillingsApi";
import {
    filterByType,
    filterByTypes,
    handleReactSelectDropDownOptions,
    handlereferDocotorIDByReferalType,
    notify,
    parseTimeString,
    ReactSelectisDefaultValue,
} from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {
    CentreWiseCacheByCenterID,
    GetBindDepartment,
    GetBindReferalType,
    GetBindReferDoctor,
} from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useLocation } from "react-router-dom";
import OverLay from "../../../components/modalComponent/OverLay";
import Index from "../../frontOffice/PatientRegistration/Index";
import moment from "moment";
import { Button, Card } from "react-bootstrap";
import Tables from "../../../components/UI/customTable";
import { Checkbox } from "primereact/checkbox";
import { object } from "yup";
import Modal from "../../../components/modalComponent/Modal";
import SearchComponentforChemo from "./SearchComponentforChemo";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import { BillingToolSaveChemoPatientDetail } from "../../../networkServices/Tools";
import BindTableDetails from "./BindTableDetails";


const ChemoPatientEntry = ({ data }) => {
    
    const [t] = useTranslation();
    const [singlePatientData, setSinglePatientData] = useState({});
    const [visible, setVisible] = useState(false);
    const [renderComponent, setRenderComponent] = useState({
        name: "",
        component: null,
    });

    const handleSinglePatientData = async (data) => {
        try {

            setSinglePatientData(data);

            setPayloadData((val) => ({ ...val, DoctorID: data?.data?.DoctorID }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (data?.patientID) {
            handleSinglePatientData({ MRNo: data?.patientID });
        }
    }, [data]);

    const sendReset = () => {
        setSinglePatientData({});
    };
    const ModalComponent = (name, component) => {
        setVisible(true);
        setRenderComponent({
            name: name,
            component: component,
        });
    };

    return (
        <>
            <div className="card patient_registration border">

                <Heading
                    title={"Search Criteria"}
                    isBreadcrumb={true}

                />
                {!data && Object.keys(singlePatientData)?.length === 0 ? (
                    <SearchComponentforChemo
                        onClick={handleSinglePatientData}
                        data={data}
                    />
                ) : (
                    <>
                        <DetailCard
                            ModalComponent={ModalComponent}
                            singlePatientData={singlePatientData}
                            data={data}
                            sendReset={sendReset}
                            setVisible={setVisible}
                            setSinglePatientData={setSinglePatientData}
                            // sendReset={sendReset}
                            // payloadData={payloadData}
                            // setPayloadData={setPayloadData}
                            bindDetailAPI={handleSinglePatientData}
                        // UHID={UHID ?? false}
                        // location={location}
                        // data={data}
                        />
                    </>
                )}
            </div>
            <OverLay
                visible={visible}
                setVisible={setVisible}
                Header={renderComponent?.name}
            >
                {renderComponent?.component}
            </OverLay>
        </>
    );
};

export default ChemoPatientEntry;

const DetailCard = ({
    singlePatientData,
    data,
    ModalComponent,
    setVisible,
    sendReset,
    bindDetailAPI,
}) => {
     const [dataLoading, setDataLoading] = useState(false);
    console.log("singlePatientData", singlePatientData)
    const [t] = useTranslation();
    const dispatch = useDispatch();
    let ip = useLocalStorage("ip", "get");
    const location = useLocation();
    const { VITE_DATE_FORMAT } = import.meta.env;


    const { BindResource } = useSelector(
        (state) => state.CommonSlice
    );

 
    const [TPAList, setTPAList] = useState([]);
    const [relationsOnEdit, setRelationsOnEdit] = useState([]);
    const relationCheckList = singlePatientData?.PatientRelationData?.filter(
        (rel) => rel?.IsPersonal === 1
    )

    const [selectedRelations, setSelectedRelations] = useState(!data ? relationCheckList : []);
    const relationsData = data ? relationsOnEdit : relationCheckList;

    const initialState = {
        date: moment().format("YYYY-MM-DD"),
        DepartmentID: "ALL",
       sift:{ value: "Morning", label: "Morning" },
        ConsultingDoctor: "",
       
    };

    const [payloadData, setPayloadData] = useState({
        ...initialState,
    });
    const [updataDataList, setUpdataDataList] = useState([]);
    const [DropDownState, setDropDownState] = useState({
        getBindPanelByPatientID: [],
        getBindProList: [],
        getDoctorDeptWise: [],
        doctorMulti: [],
        getRoomType: [],
        getBillingCategory: [],
        getBindRoomBed: [],
        getAdmissionType: [],
    });




    const handleBindPanelByPatientID = async (PatientID) => {
        const item = PatientID ? PatientID : data?.patientID;
        try {
            const data = await bindPanelByPatientID(item);
            return data.data;
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

    const getBindAdmissionType = async () => {
        try {
            const data = await AdmissionType();
            return data?.data;
        } catch (error) {
            console.error(error);
        }
    };

    const getProNameList = async () => {

        try {
            const response = await BasicMasterBindPro();
            if (response?.success) {
                return response?.data;
            }

        } catch (error) {
            console.error("Error fetching Pro Name List:", error);

        }
    }

    const getBindRoomType = async () => {
        try {
            const data = await RoomType();
            return data?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindRoom = async (params) => {
        const newPayload = {
            caseType: params.caseType,
            isDisIntimated: 0,
            type: "1",
            bookingDate: singlePatientData?.DateEnrolled || "",
        };

        try {
            const dataRes = await BindRoomBed(newPayload);
            return dataRes?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindBillingCategory = async () => {
        try {
            const data = await BillingCategory();
            return data?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const commonFetchAllDropDown = async () => {
        try {
            const response = await Promise.all([
                handleBindPanelByPatientID(singlePatientData?.PatientID),
                handleDoctorDeptWise(payloadData?.DepartmentID),
                getBindAdmissionType(),
                getBindRoomType(),
                getBindBillingCategory(),
                getProNameList()
            ]);

            const responseDropdown = {
                getBindPanelByPatientID: handleReactSelectDropDownOptions(
                    response[0],
                    "PanelName",
                    "PanelID"
                ),
                // getDoctorDeptWise: handleMultiSelectDropDown(response[1]),
                getDoctorDeptWise: handleReactSelectDropDownOptions(
                    response[1],
                    "Name",
                    "DoctorID"
                ),

                getAdmissionType: handleReactSelectDropDownOptions(
                    response[2],
                    "ADMISSIONTYPE",
                    "ID"
                ),
                getRoomType: handleReactSelectDropDownOptions(
                    response[3],
                    "Name",
                    "IPDCaseTypeID"
                ),
                getBillingCategory: handleReactSelectDropDownOptions(
                    response[4],
                    "Name",
                    "IPDCaseTypeID"
                ),
                getBindProList: handleReactSelectDropDownOptions(
                    response[5],
                    "ProName",
                    "Pro_ID"
                ),
            };

            return responseDropdown;
        } catch (error) {
            console.log(error, "Something Went Wrong");
        }
    };

    const FetchAllDropDown = async () => {
        try {
            const responseDropdown = await commonFetchAllDropDown();
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
        if (Object.keys(singlePatientData)?.length > 0 && !data) {
            const data = [
                {
                    label: t("PatientID"),
                    value: `${singlePatientData?.PatientID}`,
                },

                {
                    label: t("PatientName"),
                    value: ` ${singlePatientData?.PatientName}`,
                },
                {
                    label: t("GenderAge"),
                    value: `${singlePatientData?.Gender} / ${singlePatientData?.Age}`,
                },
                {
                    label: t("Contact No"),
                    value: singlePatientData?.MobileNo,
                },

                {
                    label: t("DOB"),
                    value: singlePatientData.DOB,
                },

                // {
                //   label: t("Outstanding"),
                //   value: singlePatientData?.Outstanding ?? "0.00",
                // },
            ];

            return data;
        } else {
            return [];
        }
    }, [singlePatientData, data]);



    const handleReactSelectDynamicOptions = (name, value) => {

        setPayloadData((prevData) => {
            return {
                ...prevData,
                [name]: value || "",
            };
        })
    }




    const GetPatientAdmissionitem = async (data) => {
        try {
            const datas = await GetPatientAdmissionDetails(
                data?.patientID,
                data?.transactionID
            );

            if (
                datas?.data?.admissionDetails?.length > 0 &&
                datas?.data?.doctorList?.length > 0
            ) {
                const responseAdmissionDetails = datas?.data?.admissionDetails[0];
                const responseDoctorList = datas?.data?.doctorList;
                setUpdataDataList(responseAdmissionDetails);
                const bindroomResponse = await getBindRoom({
                    caseType: responseAdmissionDetails?.roomTypeID,
                });

                const responseDropdown = await commonFetchAllDropDown();
                updataDataList;
                setDropDownState({
                    ...responseDropdown,
                    getBindRoomBed: bindroomResponse,
                });

                const doctorIDData = responseDoctorList?.map((items, _) => {
                    return {
                        name: items?.text,
                        code: items?.value,
                    };
                });
                setSelectedRelations(datas?.data?.patientrelationList || []);
                setRelationsOnEdit(datas?.data?.patientrelationList || []);

                setPayloadData({
                    ...payloadData,
          
                    ConsultingDoctor: responseAdmissionDetails?.consultationDoctorID,
                   
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getTPAList = async () => {

        try {
            const response = await BillingIPDBindTPA()
            if (response?.success) {
                setTPAList(response?.data)
            }
        } catch (error) {
            console.log(error, "Error fetching TPA List");

        }
    }

    const CentreWiseCacheByCenterIDAPI = async () => {
        let data = await dispatch(CentreWiseCacheByCenterID({}));
        if (data?.payload?.success) {
            // debugger
            let countryCode = filterByTypes(
                data?.payload?.data,
                [7, BindResource?.BaseCurrencyID],
                ["TypeID", "ValueField"],
                "TextField",
                "ValueField",
                "STD_CODE"
            );


        }
    };


    useEffect(() => {
        CentreWiseCacheByCenterIDAPI();
        getProNameList();
    }, []);

    // console.log(payloadData);

    useEffect(() => {
        dispatch(GetBindReferDoctor());
        dispatch(GetBindReferalType());
        dispatch(GetBindDepartment());
        getTPAList()
    }, []);

    useEffect(() => {
        if (data) {
            GetPatientAdmissionitem(data);
        } else {
            FetchAllDropDown();
        }
    }, [data]);

    let PatientRegistrationArg = {
        PatientID: singlePatientData?.PatientID,
        setVisible: setVisible,
        bindDetailAPI: bindDetailAPI,
        handleBindPanelByPatientID: handleBindPanelByPatientID,
    };
    const handleChange = (e) => {
        const { name, value } = e.target;


        setPayloadData({ ...payloadData, [name]: value });

    };
    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setPayloadData((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };
    const handleSave = async () => {
        if(!payloadData?.ConsultingDoctor?.DoctorID){
            notify("Please Select Doctor","warn")
            return
        }
        if(!payloadData?.sift?.value){
            notify("Please Select Sift","warn")
            return
        }
        const payload = {
            "patientID": singlePatientData?.PatientID || "",
            "shiftType": payloadData?.sift?.value || "",
            "doctorID": Number(payloadData?.ConsultingDoctor?.DoctorID) || "",
            "remark": payloadData?.remarks || "",
            "bookingDate": payloadData?.date || "",
        }
        try {
            const response = await BillingToolSaveChemoPatientDetail(payload);
            if (response?.success) {
                notify(response?.message, "success")
                 setDataLoading(!dataLoading);
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    console.log("payloadData", payloadData)
    return (
        <>

            <DetailsCardForDefaultValue
                singlePatientData={handleDataInDetailView}
                PatientRegistrationArg={PatientRegistrationArg}
                ModalComponent={ModalComponent}
                sendReset={() => {
                    setPayloadData({
                      
                        referDoctorID: "",
                        DepartmentID: "ALL",
                        DoctorID: "",
                       
                    });
                    sendReset();
                }}
                show={data}
            >
                <>
                    
                    <ReactSelect
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="ConsultingDoctor"
                        id="ConsultingDoctor"
                        placeholderName={t(" Doctor")}
                        // dynamicOptions={DropDownState?.getDoctorDeptWise?.map((ele) => ({
                        //   value: ele?.code || ele?.DoctorID,
                        //   label: ele?.name || ele?.Name,
                        // }))}
                        dynamicOptions={[...handleReactSelectDropDownOptions(DropDownState?.getDoctorDeptWise, "label", "value")]}

                        handleChange={handleReactSelectDynamicOptions}
                        value={payloadData?.ConsultingDoctor}
                    requiredClassName={`required-fields `}
                    />
                    <ReactSelect
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="sift"
                        id="sift"
                        placeholderName={t("Shift")}
                        // dynamicOptions={DropDownState?.getDoctorDeptWise?.map((ele) => ({
                        //   value: ele?.code || ele?.DoctorID,
                        //   label: ele?.name || ele?.Name,
                        // }))}
                        dynamicOptions={[{ value: "Morning", label: "Morning" }, { value: "Evening", label: "Evening" },]}

                        handleChange={handleReactSelectDynamicOptions}
                        value={payloadData?.sift?.value}
                    // requiredClassName={`required-fields ${errors?.DoctorID ? "required-fields-active" : ""}`}
                    />

                    <TextAreaInput
                        type="text"
                        name="remarks"
                        rows={2}
                        value={payloadData?.remarks}
                        onChange={handleChange}
                        lable={t("Remarks")}
                        placeholder=" "
                        respclass=" col-sm-6 col-12"
                        className="form-control "
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="DOB"
                        name="date"
                        lable={t("Date")}
                        value={
                            payloadData.date
                                ? moment(payloadData.date, "YYYY-MM-DD").toDate()
                                : null
                        }
                        maxDate={new Date()}
                        handleChange={searchHandleChange}
                        placeholder={VITE_DATE_FORMAT}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    <button
                        className="btn btn-primary btn-sm px-3"
                        // type="submit"
                        onClick={handleSave}
                    >
                        {t("Save")}
                    </button>
                </>
            </DetailsCardForDefaultValue>

<BindTableDetails dataLoading={dataLoading}/>
        </>
    );
};
