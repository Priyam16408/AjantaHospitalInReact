import React, { useEffect, useState } from "react";
import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import { Tabfunctionality } from "../../../utils/helpers";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Heading from "../../../components/UI/Heading";
import VitalExaminationModal from "../../../components/modalComponent/Utils/VitalExaminationModal";
import Modal from "../../../components/modalComponent/Modal";
import DatePicker from "../../../components/formComponent/DatePicker";
import SearchPatientTable from "../../../components/UI/customTable/ExaminationRoom/SearchPatientTable"
import { BindPanelGroup } from "../../../networkServices/PanelDetailApi";
import { useDispatch, useSelector } from "react-redux";
import { GetBindSubCatgeory, getBindPanelList } from "../../../store/reducers/common/CommonExportFunction";
import { GetBindDoctorDept } from "../../../networkServices/opdserviceAPI";
import { GetBindDoctorGroup, TemperatureRoomSearchAPI, UpdateTemperatureRoomOut } from "../../../networkServices/examinationApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import moment from "moment";
import VitalSign from "../../doctor/OPD/VitalSign";
import ConcetForm from "../../doctor/OPD/ConcetForm";
import ViewLabReport from "../../doctor/OPD/ViewLabReport";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import noImange from "../../../assets/image/avatar.gif"

const ExaminationRoom = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [bodyData, setBodyData] = useState([])

  const dispatch = useDispatch()
  const [list, setList] = useState({ doctorsList: [], visitTypeList: [], doctorGroupList: [], statusList: [] })
  const { getBindPanelListData } = useSelector(
    (state) => state?.CommonSlice
  );

  useEffect(() => {
    setList((val) => ({ ...val, panelList: getBindPanelListData }))
  }, [getBindPanelListData?.length])

  const bindAllList = async () => {
    try {
      Promise.all([
        GetBindDoctorDept("ALL"),
        dispatch(GetBindSubCatgeory({ Type: "1", CategoryID: "1" })),
        GetBindDoctorGroup(),
      ]).then(([doctors, visitType, doctorGroup]) => {
        setList((val) => ({
          ...val,
          doctorsList: doctors?.data,
          visitTypeList: visitType?.payload?.data,
          doctorGroupList: doctorGroup?.data,
          statusList: [{ value: "0", label: "Pending" }, { value: "1", label: "Close" }, { value: "2", label: "ALL" }]
        }))
      });

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    bindAllList();
  }, [])

  const [values, setValues] = useState({
    mrNo: "", pName: "", appNo: "",
    doctorID: { value: "0", label: "ALL" },
    status: { value: "2", label: "ALL" },
    drGroup: { value: "ALL", label: "ALL" },
    panelID: { value: "0", label: "ALL" },
    appointmentType: { value: "0", label: "ALL" },
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

  const TemperatureRoomSearch = async () => {

    let requestBody = {
      mrNo: values?.mrNo,
      pName: values?.pName,
      appNo: values?.appNo,
      doctorID: values?.doctorID?.label ? `${values?.doctorID?.value}` : "",
      status: values?.status?.label ? values?.status?.value : "",
      fromDate: moment(values?.fromDate).format('YYYY-MM-DD'),
      toDate: moment(values?.toDate).format('YYYY-MM-DD'),
      drGroup: values?.drGroup?.label ? `${values?.drGroup?.value}` : "",
      panelID: values?.panelID?.label ? values?.panelID?.value : "",
      appointmentType: values?.appointmentType?.label ? values?.appointmentType?.value : "",
    }
    try {
      const TemperatureRoomSearchAPIData = await TemperatureRoomSearchAPI(requestBody)
      if (TemperatureRoomSearchAPIData?.success) {
        if (TemperatureRoomSearchAPIData?.data?.length > 0) {
          setBodyData(TemperatureRoomSearchAPIData?.data)
        } else {
          setBodyData([])
        }

      } else {
        notify(TemperatureRoomSearchAPIData?.message, "error")
      }
    } catch (error) {
      console.error(error)
    }
  }
  const [selectedOption, setSelectedOption] = useState(null);
  const [openPageModal, setOpenPageModal] = useState({
    isShow: false,
    component: null,
    size: null,
    Header: null,
  });
  const mockPageList = [
    {
      id: 1,
      component: <VitalSign />,
      name: "Vital sign",
      size: "80vw",
      header: "OPD Service Booking",
    },
    {
      id: 2,
      component: <ConcetForm />,
      name: "Consent Form Master",
      size: "80vw",
      header: "Confirmation",
    },
    {
      id: 3,
      component: <ViewLabReport />,
      name: "View Lab Reports",
      size: "80vw",
      header: "View Lab Reports",
    },
    {
      id: 4,
      component: <ViewLabReport />,
      name: "Final Daignosis",
      size: "80vw",
      header: "Final Daignosis",
    },
    {
      id: 5,
      component: <ViewLabReport />,
      name: "View Discharge Summary",
      size: "80vw",
      header: "View Discharge Summary",
    },
  ];
  const handleSelectChange = (name, e) => {
    // console.log(name);
    // console.log(e);
    const selectedPage = mockPageList.find((ele) => ele.name === e.label);
    // console.log(selectedPage);

    setSelectedOption(name);
    setOpenPageModal((val) => ({ ...val, isShow: true, component: selectedPage.component, Header: selectedPage.name, size: selectedPage.size }));
  }

  const handleAPITempRoomOut = async (data) => {
    const apiResp = await UpdateTemperatureRoomOut(data?.App_ID)
    if (apiResp?.success) {
      TemperatureRoomSearch()
      notify(apiResp?.message, "success")
      setOpenPageModal({ isShow: false })
    } else {
      notify(apiResp?.message, "error")
    }
    console.log("ssss", apiResp)

  }
  return (
    <>

      <div className="card spatient_registration_card mb-2">
        {/* <div className="card patient_registration"> */}
        <Heading
          title={t("ExaminationRoom")}
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
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="appNo"
            name="appNo"
            lable={t("AppNo")}
            placeholder=" "
            value={values?.appNo ? values?.appNo : ""}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
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
            onKeyDown={Tabfunctionality}
          />
          <ReactSelect
            placeholderName={t("DoctorGroup")}
            id={"drGroup"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[{ value: "ALL", label: "ALL" }, ...handleReactSelectDropDownOptions(list?.doctorGroupList, "DocType", "ID")]}
            handleChange={handleSelect}
            value={`${values?.drGroup?.value}`}
            name={"drGroup"}
          />

          <ReactSelect
            placeholderName={t("Status")}
            id={"Status"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={list?.statusList}
            handleChange={handleSelect}
            value={`${values?.status?.value}`}
            name={"status"}
          />
          <ReactSelect
            placeholderName={t("VisitType")}
            id={"appointmentType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(list?.visitTypeList, "name", "subCategoryID")]}
            name={"appointmentType"}
            handleChange={handleSelect}
            value={`${values?.appointmentType?.value}`}
          />
          <ReactSelect
            placeholderName={t("Doctor")}
            id={"doctorID"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(list?.doctorsList, "Name", "DoctorID")]}
            name={"doctorID"}
            handleChange={handleSelect}
            value={`${values?.doctorID?.value}`}
          />
          <ReactSelect
            placeholderName={t("Panel")}
            id={"panelID"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={[{ value: "0", label: "ALL"},...list?.panelList]}
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
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            value={moment(values?.toDate).toDate()}
            handleChange={handleChange}
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />
          <div className=" col-sm-2 col-xl-2">
            <button className="btn btn-sm btn-success" type="button" onClick={TemperatureRoomSearch}>
              {t("Search")}
            </button>
          </div>
        </div>
        {/* </div> */}
 </div>
        <Heading
          // title={t("NursingWard.MedicationAdministrationRecord.HeadingName")}
          title=""
          isBreadcrumb={false}
          secondTitle={<>
           <ColorCodingSearch label={t("Emergency")} color="#f5f3b2" />
          <ColorCodingSearch label={t("PaymentPending")} color="#f5c6f7" />
          <ColorCodingSearch label={t("DoctorOUT")} color="#c6eea7" />
          <ColorCodingSearch label={t("DoctorIN")} color="#ffbfbf" />

          </>}
        />
   
        <SearchPatientTable tbody={bodyData} handleClickPatientWise={handleClickPatientWise} setOpenPageModal={setOpenPageModal} handleAPITempRoomOut={handleAPITempRoomOut} />
        {patientDetail?.TotaltableData?.length > 0 &&
          <>
            <div className="card mt-1">
              <Heading
                title={t("TemperatureRoom")}
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
                          <div className="text-dark ">{t("TemperatureRoomOut")} </div>
                        </button>

                        <ReactSelect
                          dynamicOptions={mockPageList?.map((ele) => {
                            return {
                              value: ele.component,
                              label: ele.name,
                            };
                          })}
                          placeholder=" "
                          placeholderName={t("PageList")}
                          id={"PageList"}
                          name={"PageList"}
                          value={selectedOption}
                          handleChange={handleSelectChange}
                          respclass='examinationRoomPageListReactSelect'
                          removeIsClearable={true}
                        // value={pageList}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
     
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
