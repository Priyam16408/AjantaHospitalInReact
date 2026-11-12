import React, { useEffect, useState } from "react";
import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import LabeledInput from "../../components/formComponent/LabeledInput";
import Heading from "../../components/UI/Heading";
import Modal from "../../components/modalComponent/Modal";
import DatePicker from "../../components/formComponent/DatePicker";
import EmergencyPatientTable from "../../components/UI/customTable/Emergency/EmergencyPatientTable"
import { useSelector } from "react-redux";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import moment from "moment";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import { bindFieldList, EmergencyPatientSearchAPI, RelaseForIPDAPI } from "../../networkServices/Emergency";
import noImange from "../../assets/image/avatar.gif"

const ExaminationRoom = () => {
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [t] = useTranslation();
    const [bodyData, setBodyData] = useState([])

    const [list, setList] = useState({})
    const { getBindPanelListData } = useSelector(
        (state) => state?.CommonSlice
    );

    useEffect(() => {
        setList((val) => ({ ...val, panelList: getBindPanelListData }))
    }, [getBindPanelListData?.length])

    const bindAllList = async () => {
        try {
            let data = await bindFieldList()
            if (data?.success) {
                setList((val) => ({ ...val, statusList: data?.data?.filter((val) => val?.TypeID === 2), TriageCode: data?.data?.filter((val) => val?.TypeID === 1) }))
            } else {
                setList((val) => ({ ...val, statusList: [], TriageCode: [] }))
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        bindAllList();
    }, [])

    const [values, setValues] = useState({
        mrNo: "", pName: "", EmergencyNo: "",
        Panel: { value: "0", label: "ALL" },
        status: { value: "IN", label: "ALL" },
        panelID: { value: "0", label: "ALL" },
        fromDate: moment(new Date()).toDate(),
        toDate: moment(new Date()).toDate()
    });






    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }


    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }


    const [patientDetail, setPatientDetail] = useState({});

    const handleClickPatientWise = async (selectedIndex) => {

        setPatientDetail({
            TotaltableData: bodyData,
            index: selectedIndex,
            currentPatient: bodyData[selectedIndex],
        })
    }

    const EmergencyPatientSearch = async (status) => {
        let requestBody = {
            MRNo: values?.mrNo,
            PName: values?.pName,
            EmergencyNo: values?.EmergencyNo,
            PanelId: values?.Panel?.value ? values?.Panel?.value : "",
            fromDate: moment(values?.fromDate).format('YYYY-MM-DD'),
            toDate: moment(values?.toDate).format('YYYY-MM-DD'),
            Status: status?status:values?.status?.value ,
            TriageCode: values?.TriageCode?.value ? values?.TriageCode?.value : "0",
        }
        try {
            const apiResp = await EmergencyPatientSearchAPI(requestBody)
            if (apiResp?.success) {
                if (apiResp?.data?.length > 0) {
                    setBodyData(apiResp?.data);
                } else {
                    setBodyData([]);
                }

            } else {
                notify(apiResp?.message, "error")
                setBodyData([]);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const [openPageModal, setOpenPageModal] = useState({
        isShow: false,
        component: null,
        size: null,
        Header: null,
    });
    const ReleaseForIPD = async(data)=>{
        // debugger
        let apiResp = await RelaseForIPDAPI({"TID":data?.TID,"EMGNo":data?.EmergencyNo,"RoomId":data?.RoomId})
        if(apiResp?.success){
            setOpenPageModal({
                isShow: false,
                component: null,
                size: null,
                Header: null,
            })
            notify(apiResp?.message,"success")
            EmergencyPatientSearch(values?.status?.value?values?.status?.value:"")
        }else{
            notify(apiResp?.message,"error")
        }
      
    }



    const handleFormatlabel = (name, label, rest) => {
        return (
            <div
                style={{
                    backgroundColor: rest?.ColorCode,
                    color: "#fff",
                    margin: "-8px -12px", // Adjust this to match the parent's padding
                    padding: "8px 12px", // Add your own padding if needed inside the label
                    boxSizing: "border-box",
                }}
            >
                {label}
            </div>
        );
    };
    return (
        <>

            <div className="m-2 spatient_registration_card">
                {/* <form className="card patient_registration"> */}
                <Heading
                    title={t("EmergencyModule.EmergencyPatientSearch")}
                    isBreadcrumb={true}
                />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">

                    <Input
                        type="text"
                        className="form-control"
                        id="mrNo"
                        name="mrNo"
                        value={values?.mrNo ? values?.mrNo : ""}
                        onChange={handleChange}
                        lable={t("UHID")}
                        placeholder=" "

                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    // onKeyDown={Tabfunctionality}
                    />

                    <Input
                        type="text"
                        className="form-control"
                        id="pName"
                        name="pName"
                        lable={t("PatientName")}
                        placeholder=" "
                        value={values?.pName ? values?.pName : ""}
                        onChange={handleChange}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        id="EmergencyNo"
                        name="EmergencyNo"
                        lable={t("EmergencyNo")}
                        placeholder=" "
                        value={values?.EmergencyNo ? values?.EmergencyNo : ""}
                        onChange={handleChange}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"

                    />

                    <ReactSelect
                        placeholderName={t("Panel")}
                        id={"panelID"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(list?.panelList?.length > 0 ? list?.panelList : [], "Company_Name", "PanelID")]}
                        name={"panelID"}
                        handleChange={handleSelect}
                        value={`${values?.panelID?.value}`}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="fromDate"
                        name="fromDate"
                        lable={t("FromDate")}
                        value={moment(values?.fromDate).toDate()}
                        handleChange={handleChange}
                        placeholder={VITE_DATE_FORMAT}
                        respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="toDate"
                        name="toDate"
                        value={moment(values?.toDate).toDate()}
                        handleChange={handleChange}
                        lable={t("ToDate")}
                        placeholder={VITE_DATE_FORMAT}
                        respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                    />


                    <ReactSelect
                        placeholderName={t("TriageCode")}
                        id={"TriageCode"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        dynamicOptions={list?.TriageCode}
                        name={"TriageCode"}
                        handleChange={handleSelect}
                        value={`${values?.TriageCode?.value}`}
                        handleFormatlabel={handleFormatlabel}
                    />


                    <ReactSelect
                        placeholderName={t("STATUS")}
                        id={"status"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        dynamicOptions={list?.statusList}
                        name={"status"}
                        handleChange={handleSelect}
                        value={`${values?.status?.value}`}

                    />
                    <div className=" col-sm-2 col-xl-2">
                        <button className="btn btn-sm btn-success" type="button" onClick={()=>{
                            EmergencyPatientSearch(values?.status?.value?values?.status?.value:"")
                        }}>
                            {t("Search")}
                        </button>
                    </div>
                </div>
                {/* </form> */}

                <Heading
                    // title={t("NursingWard.MedicationAdministrationRecord.HeadingName")}
                    title=""
                    isBreadcrumb={false}
                    secondTitle={<>
                        <ColorCodingSearch label={t("CurrentlyAdmitted")} color="#f5f3b2" onClick={()=>{EmergencyPatientSearch("IN")}}/>
                        <ColorCodingSearch label={t("ReleasedPatient")} color="#f5c6f7" onClick={()=>{EmergencyPatientSearch("OUT")}}/>
                        <ColorCodingSearch label={t("ReleasedForIPD")} color="#c6eea7" onClick={()=>{EmergencyPatientSearch("FRI")}}/>
                        <ColorCodingSearch label={t("ShiftedToIPD")} color="#ffbfbf" onClick={()=>{EmergencyPatientSearch("STI")}}/>

                    </>
                    }
                />

                <EmergencyPatientTable tbody={bodyData} handleClickPatientWise={handleClickPatientWise} setOpenPageModal={setOpenPageModal} ReleaseForIPD={ReleaseForIPD} EmergencyPatientSearch={EmergencyPatientSearch}/>
                {patientDetail?.TotaltableData?.length > 0 &&
                    <>
                        <div className="card mt-1">
                            <Heading
                                title={t("examinationRoom.OPD.TemperatureRoom")}
                                isBreadcrumb={false}
                            />
                            <div className="row mt-2">
                                <div className="col-sm-1">
                                    <div className="row p-1">
                                        <div
                                            className="col-md-12"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItem: "center",
                                            }}
                                        >
                                            <img
                                                src={noImange}
                                                className="emp-img"
                                                alt="Responsive image"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-11">
                                    <div className="row px-1">
                                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                            <LabeledInput
                                                label={"Patient Name"}
                                                value={patientDetail?.currentPatient?.Pname}
                                                className='mb-2'
                                            />
                                        </div>
                                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                            <LabeledInput
                                                label={"Age/Gender"}
                                                value={
                                                    <span>
                                                        {patientDetail?.currentPatient?.Age}/
                                                        {patientDetail?.currentPatient?.Gender}
                                                    </span>
                                                }
                                                className='mb-2'
                                            />
                                        </div>
                                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                            <LabeledInput
                                                label={"Mobile"}
                                                value={patientDetail?.currentPatient?.ContactNo}
                                                className='mb-2'
                                            />
                                        </div>
                                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                            <LabeledInput
                                                label={"Ref.By"}
                                                value={patientDetail?.currentPatient?.DName}
                                                className='mb-2'
                                            />
                                        </div>

                                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                            <LabeledInput
                                                label={"App. Date/No."}
                                                value={
                                                    <span>
                                                        {patientDetail?.currentPatient?.AppointmentDate}/
                                                        {patientDetail?.currentPatient?.AppNo}
                                                    </span>
                                                }
                                                className='mb-2'
                                            />
                                        </div>

                                        <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                            <LabeledInput
                                                label={"Panel"}
                                                value={patientDetail?.currentPatient?.PanelName}
                                                className='mb-2'
                                            />
                                        </div>
                                    </div>

                                    <div className="row p-1">
                                        <div className="col-lg-12 col-md-12">
                                            <div className="d-flex flex-row-reverse ">

                                                <button
                                                    className="btn btn-sm custom-button-temproom "
                                                    style={{
                                                        background: "#ACE1AF",
                                                    }}
                                                >
                                                    <div className="text-dark ">{t("examinationRoom.OPD.TemperatureRoomOut")} </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            {openPageModal.isShow && (
                <Modal
                    visible={openPageModal.isShow}
                    Header={openPageModal.Header}
                    modalWidth={openPageModal.size}
                    modalData={openPageModal.modalData}
                    handleAPI={openPageModal.handleAPI}
                    buttonName={openPageModal.buttonName}
                    setVisible={() => setOpenPageModal(false)}
                >
                    {openPageModal.component}
                </Modal>
            )}
        </>
    );
};

export default ExaminationRoom;
