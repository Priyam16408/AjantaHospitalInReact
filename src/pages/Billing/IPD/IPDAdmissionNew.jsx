import React, { useCallback, useEffect, useMemo, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import SearchComponentByUHIDMobileName from "../../../components/commonComponents/SearchComponentByUHIDMobileName";
import {
  bindHashCode,
  bindPanelByPatientID,
  BindPRO,
  CheckblacklistAPI,
  GetBindDoctorDept,
  GetLastVisitDetail,
  LastVisitDetails,
  PatientSearchbyBarcode,
} from "../../../networkServices/opdserviceAPI";
import DetailsCardForDefaultValue from "../../../components/commonComponents/DetailsCardForDefaultValue";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import TimePicker from "../../../components/formComponent/TimePicker";
import Input from "../../../components/formComponent/Input";
import {
  AdmissionType,
  BasicMasterBindPro,
  BasicMasterSavePro,
  BillingCategory,
  BillingIPDBindTPA,
  BillingIPDSaveReferDoctor,
  BindRoomBed,
  CommonReceiptPdf,
  GetPatientAdmissionDetails,
  IPDAdmissionMultipleReport,
  IPDAdmissionReport,
  RoomType,
  SaveIPDAdmission,
  UpdatePatientAdmissionDetails,
} from "../../../networkServices/BillingsApi";
import {
  filterByType,
  filterByTypes,
  handleReactSelectDropDownOptions,
  handlereferDocotorIDByReferalType,
  handleSaveIPDAdmissionPayload,
  handleUpdateIPDAdmissionPayload,
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
import { MapGeneric_OPTION, MOBILE_NUMBER_VALIDATION_REGX, ReferedSourceConst } from "../../../utils/constant";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useLocation } from "react-router-dom";
import OverLay from "../../../components/modalComponent/OverLay";
import { RedirectURL } from "../../../networkServices/PDFURL";
import Index from "../../frontOffice/PatientRegistration/Index";
import moment from "moment";
import { Button, Card } from "react-bootstrap";
import Tables from "../../../components/UI/customTable";
import { Checkbox } from "primereact/checkbox";
import { object } from "yup";
import Modal from "../../../components/modalComponent/Modal";
import ReferDoctorModal from "./ReferDoctorModal";


const IPDAdmissionNew = ({ data }) => {
  const [t] = useTranslation();
  const [singlePatientData, setSinglePatientData] = useState({});
  const [visible, setVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });

  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  // const handleSinglePatientData = async (data) => {
  //   let blacklist = await CheckblacklistAPI();
  //   const { MRNo } = data;
  //   try {
  //     const data = await PatientSearchbyBarcode(MRNo, 1);

  //     setSinglePatientData(
  //       Array.isArray(data?.data) ? data?.data[0] : data?.data
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
          secondTitle={
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
                {t("New Registration")}
              </button>
            </>
          }
        />
        {!data && Object.keys(singlePatientData)?.length === 0 ? (
          <SearchComponentByUHIDMobileName
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

export default IPDAdmissionNew;

const DetailCard = ({
  singlePatientData,
  data,
  ModalComponent,
  setVisible,
  sendReset,
  bindDetailAPI,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  let ip = useLocalStorage("ip", "get");
  const location = useLocation();
  const { VITE_DATE_FORMAT } = import.meta.env;


  const { CentreWiseCache, CentreWisePanelControlCacheList, BindResource } = useSelector(
    (state) => state.CommonSlice
  );

  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

  const [relation, setRelation] = useState({
    "RelationOf": "",
    "IsPersonal": 1,
    "RelationName": "",
    "RelationPhone": "",
  });




  const [TPAList, setTPAList] = useState([]);

  const [relationsOnEdit, setRelationsOnEdit] = useState([]);


  const relationCheckList = singlePatientData?.PatientRelationData?.filter(
    (rel) => rel?.IsPersonal === 1
  )

  const [selectedRelations, setSelectedRelations] = useState(!data ? relationCheckList : []);
  const relationsData = data ? relationsOnEdit : relationCheckList;

  console.log(selectedRelations, relation, "selectedRelationsselectedRelationsselectedRelations");

  const initialState = {
    panelID: "",
    TPA: "",
    MLC: "",
    admittedBy: "",
    referalTypeID: { label: "Self", value: 4 },
    referDoctorID: "",
    proId: "",
    DepartmentID: "ALL",
    DoctorID: "",
    ConsultingDoctor: "",
    dateOfVisit: new Date(),
    time: new Date(),
    admissionType: "",
    IPDCaseTypeID: "",
    RoomBed: "",
    BillingCategory: "",
    ReferedSource: "",
    requestedRoomType: "",
    IssuedVisitorCardNo: "",
    admissionReason: "",
    treatment: "",
    isApporvaldays: 0,
    ECHS: "",
    diagnosis: "",
  };

  const [payloadData, setPayloadData] = useState({
    ...initialState,
  });



  console.log("payloadData", payloadData);

  const [errors, setErrors] = useState({});

  const { GetBindReferDoctorList, GetReferTypeList, GetDepartmentList } =
    useSelector((state) => state?.CommonSlice);
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




  const handleChangRelation = (name, selectedOption) => {
    if (selectedOption) {
      setRelation({ ...relation, RelationOf: selectedOption.value });
    } else {
      setRelation({ ...relation, RelationOf: "" });
    }
  };

  const handleAddRelation = () => {
    if (relation.RelationOf && relation.RelationName) {
      const updatedList = [...selectedRelations, { ...relation, IsPersonal: 1 }]
      setSelectedRelations(updatedList);
      setRelationsOnEdit(updatedList);

      setRelation({ Relation: "", RelationName: "", RelationPhone: "" });
    }
  };

  const handleDeleteRelation = (index) => {
    const updatedRelations = relationsOnEdit.filter((_, i) => i !== index);
    setRelationsOnEdit(updatedRelations);
    setSelectedRelations(updatedRelations);
  };

  const multipleRepots = async (transactionID) => {
    try {
      debugger;
      const payload = {
        transactionID: transactionID,
      };

      const response = await IPDAdmissionMultipleReport(payload);

      if (response?.success) {
        Object.keys(response.data).forEach((key) => {
          const url = response.data[key];
          RedirectURL(url);
        });
      }
    } catch (error) {
      console.error("Error in multipleReports:", error);
    }
  };


  const ErrorHandling = () => {
    let errors = {};

    if (payloadData?.panelID == "") {
      errors.panelID = "panelID Is Required";
    }
    if (payloadData?.referalTypeID == "") {
      errors.referalTypeID = "referalTypeID Is Required";
    }
    if (payloadData?.referalTypeID == "") {
      errors.referalTypeID = "referalTypeID Is Required";
    }
    if (!payloadData?.DoctorID?.length > 0) {
      errors.DoctorID = "Doctor field Is Required";
    }
    if (!payloadData?.dateOfVisit) {
      errors.dateOfVisit = "Date of Visit Is Required";
    }
    if (payloadData?.admissionType == "") {
      errors.admissionType = "admissionType Is Required";
    }
    if (payloadData?.IPDCaseTypeID == "") {
      errors.IPDCaseTypeID = "Room Type Is Required";
    }
    if (payloadData?.RoomBed == "") {
      errors.RoomBed = "Room/Bed Is Required";
    }
    if (payloadData?.BillingCategory == "") {
      errors.BillingCategory = "Billing Category Is Required";
    }

    return errors;
  };

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

  // const handleBindPRO = async (referDoctorID) => {
  //   try {
  //     const data = await BindPRO(referDoctorID);
  //     setDropDownState({
  //       ...DropDownState,
  //       getBindProList: handleReactSelectDropDownOptions(
  //         data?.data,
  //         "ProName",
  //         "Pro_ID"
  //       ),
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
          label: t("Outstanding"),
          value: singlePatientData?.Outstanding ?? "0.00",
        },
      ];

      return data;
    } else {
      return [];
    }
  }, [singlePatientData, data]);

  const handlePanelReactSelectChange = (name, e) => {
    const data = DropDownState?.getBindPanelByPatientID.find(
      (ele) => Number(ele?.value) === Number(e?.value)
    );

    setPayloadData({
      ...payloadData,
      [name]: data,
    });
  };

  const handleMultiSelectDropDown = (state) => {
    return state?.map((items, _) => {
      return {
        name: items?.Name,
        code: items?.DoctorID,
      };
    });
  };

  const handleReactSelectChange = async (name, e) => {
    debugger
    switch (name) {
      case "referDoctorID":
        // handleBindPRO(e?.value);
        setPayloadData({
          ...payloadData,
          [name]: e?.value,
        });
        break;
      case "DepartmentID":
        const data = await handleDoctorDeptWise(e?.label);
        setDropDownState({
          ...DropDownState,
          getDoctorDeptWise: handleMultiSelectDropDown(data),
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

  const handleMultiSelectChange = (name, selectedOptions) => {
    setPayloadData({
      ...payloadData,
      [name]: selectedOptions,
    });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setPayloadData({
      ...payloadData,
      [name]: value,
    });
  };

  const handleReactSelect = async (name, value, secondName) => {
    debugger
    const obj = { ...payloadData };
    obj[name] = value?.value || "";
    if (secondName) obj[secondName] = value?.BillingCategoryID || "";
    setPayloadData(obj);
    if (name === "IPDCaseTypeID") {
      const response = await getBindRoom({ caseType: value.value });
      setDropDownState((prevState) => ({
        ...prevState,
        getBindRoomBed: response,
      }));
    }
  };

  const handleReactSelectDynamicOptions = (name, value) => {

    setPayloadData((prevData) => {
      return {
        ...prevData,
        [name]: value || "",
      };
    })
  }

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };


  // const handleReactSelect = async (name, value) => {
  //   setPayloadData((prevData) => ({
  //     ...prevData,
  //     [name]: value?.value,
  //   }));

  //   switch (name) {
  //     case "IPDCaseTypeID":
  //       const response = await getBindRoom({ caseType: value.value });
  //       setDropDownState((prevState) => ({
  //         ...prevState,
  //         getBindRoomBed: response,
  //       }));
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const findReferDisable = useCallback(
    (GetReferTypeListData, KeyMatch, valueMatch) => {
      return GetReferTypeListData?.find(
        (ele) => Number(ele[KeyMatch]) === Number(valueMatch)
      );
    },
    [payloadData?.referalTypeID]
  );

  const handleUpdatePatientAdmissionDetails = async () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 0) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[0], "error");
      }
      return false;
    }
    try {
      const requestBody = handleUpdateIPDAdmissionPayload(
        singlePatientData,
        payloadData,
        updataDataList,
        selectedRelations
      );

      const response = await UpdatePatientAdmissionDetails(requestBody);
      if (response?.success) {
        notify(response?.message, "success");
        setPayloadData({ ...initialState });
        sendReset();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  console.log(selectedRelations, "selectedRelations")
  console.log(payloadData, "payloadDatapayloadData")

  const handleSaveIPDAdmission = async () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 0) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[0], "error");
      }
      return false;
    }
    try {
      const hashcode = await bindHashCode();
      debugger
      const requestBody = handleSaveIPDAdmissionPayload(
        hashcode?.data,
        singlePatientData,
        payloadData,
        ip,
        location,
        selectedRelations
      );

      const response = await SaveIPDAdmission(requestBody);
      console.log(
        "response?.data?.transactionID",
        response?.data?.transactionID
      );
      if (response?.success) {
        debugger
        const reportResp = await IPDAdmissionReport(
          Number(response?.data?.transactionID),
          2
        );
        const multiReportResponse = await multipleRepots(response?.data?.transactionID)

        if (reportResp?.success) {
          RedirectURL(reportResp?.data?.pdfUrl);
        } else {
          notify(reportResp?.data?.message, "error");
        }
        notify(response?.message, "success");
        setPayloadData({ ...initialState });
        sendReset();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

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
          TPA: { value: responseAdmissionDetails?.tpaId },
          MLC: responseAdmissionDetails?.mlc,
          admittedBy: responseAdmissionDetails?.admittedBy,
          ConsultingDoctor: responseAdmissionDetails?.consultationDoctorID,
          dateOfVisit: new Date(responseAdmissionDetails?.dateOfAdmit),
          time: parseTimeString(responseAdmissionDetails?.timeOfAdmit),
          admissionType: responseAdmissionDetails?.admission_Type,
          IPDCaseTypeID: responseAdmissionDetails?.roomTypeID,
          RoomBed: responseAdmissionDetails?.roomId,
          BillingCategory: responseAdmissionDetails?.rommType_BillID,
          ReferedSource: responseAdmissionDetails?.source,
          requestedRoomType: responseAdmissionDetails?.requestedRoomType,
          IssuedVisitorCardNo: responseAdmissionDetails?.admissionReason,
          admissionReason: responseAdmissionDetails?.admissionReason,
          treatment: responseAdmissionDetails?.treatment ? responseAdmissionDetails?.treatment : "",
          diagnosis: responseAdmissionDetails?.diagnosis,
          isApporvaldays: responseAdmissionDetails?.approvalDays ? responseAdmissionDetails?.approvalDays : 0,
          Informedward: Number(responseAdmissionDetails?.isInformedWard) === 1 ? "yes" : "no",
          ECHS: responseAdmissionDetails?.ecsh,
          DoctorID: doctorIDData,
          // panelID: responseAdmissionDetails?.panelID,
          panelID: responseDropdown?.getBindPanelByPatientID.find(
            (ele) =>
              Number(ele?.value) === Number(responseAdmissionDetails?.panelID)
          ),
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

  const saveProName = async (modalData) => {
    // debugger
    try {
      let payload = {
        "proName": modalData?.name,
        "ipaddress": ip || ""
      }
      const response = await BasicMasterSavePro(payload);
      if (response?.success) {
        notify(response?.message, "success");
        setIsOpen()
        setModalData({});
        FetchAllDropDown()
        //  getProNameList();
      }

    } catch (error) {
      console.error("Error saving Pro Name:", error);

    }
  }

  const saveReferalDoctor = async (modalData) => {
    debugger
    try {
      let payload = {
        "title": modalData?.title?.value,
        "doctorName": modalData?.name,
        "mobile": modalData?.contactNo,
        "address": modalData?.address,
        "proID": modalData?.proName?.value,
      }

      const response = await BillingIPDSaveReferDoctor(payload);
      if (response?.success) {
        notify(response?.message, "success");
        setIsOpen()
        setModalData({});
        FetchAllDropDown()
      }
      else {
        notify(response?.message, "error");
        setIsOpen()
        setModalData({});
      }

    } catch (error) {
      console.error("Error saving Pro Name:", error);

    }
  }





  console.log(DropDownState, "DropDownState?.getBindProList");

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
  console.log(payloadData, "payloadData")
  console.log(selectedRelations, relationsData, "selectedRelationsselectedRelations");

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {/* //uguiguiguiguig */}
          {handleModelData?.Component}
        </Modal>
      )}
      <DetailsCardForDefaultValue
        singlePatientData={handleDataInDetailView}
        PatientRegistrationArg={PatientRegistrationArg}
        ModalComponent={ModalComponent}
        sendReset={() => {
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
            dateOfVisit: new Date(),
            time: new Date(),
            admissionType: "",
            IPDCaseTypeID: "",
            BillingCategory: "",
            RoomBed: "",
            ReferedSource: "",
            requestedRoomType: "",
            IssuedVisitorCardNo: "",
            admissionReason: "",
          });
          sendReset();
        }}
        show={data}
      >
        <>
          <ReactSelect
            placeholderName={t("InSurancePanel")}
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
            placeholderName={t("TPA")}
            id={"TPA"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={payloadData?.TPA}
            name={"TPA"}

            // dynamicOptions={handleReactSelectDropDownOptions(
            //   TPAList,
            //   "TextField",
            //   "ValueField"
            // )}
            dynamicOptions={[...handleReactSelectDropDownOptions(TPAList, "TextField", "ValueField")]}
            handleChange={handleReactSelectDynamicOptions}
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
            // isDisabled={UHID ? true : false}
            removeIsClearable={true}
          />
          <div className="d-flex col-xl-2 col-md-4 col-sm-6 col-12">
            <ReactSelect
              placeholderName={t("referDoctor")}
              id={"referDoctor"}
              searchable={true}
              respclass="col-xl-10 col-md-10 col-sm-10 pl-0"
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

            <div>
              <button
                className="btn btn-sm btn-primary"

                onClick={() => {

                  setHandleModelData({
                    label: t("Add Refer Doctor"),
                    buttonName: t(""),
                    width: "30vw",
                    isOpen: true,
                    Component: (<ReferDoctorModal isProName={false} setModalData={setModalData} DropDownState={DropDownState} />),
                    handleInsertAPI: saveReferalDoctor,
                  });
                }}
                // disabled={isDisableInputs}
                type="button"
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
              </button>
            </div>
          </div>
          <div className="d-flex col-xl-2 col-md-4 col-sm-6 col-12">
            <ReactSelect
              placeholderName={t("PRO")}
              id={"PRO"}
              searchable={true}
              name={"proId"}
              respclass="col-xl-10 col-md-10 col-sm-10 pl-0"
              dynamicOptions={DropDownState?.getBindProList}
              value={payloadData?.proId}
              handleChange={handleReactSelectChange}
            // isDisabled={UHID ? true : false}
            />

            <div>
              <button
                className="btn btn-sm btn-primary"

                onClick={() => {

                  setHandleModelData({
                    label: t("Add Refer Doctor"),
                    buttonName: t(""),
                    width: "30vw",
                    isOpen: true,
                    Component: (<ReferDoctorModal isProName={true} setModalData={setModalData} />),
                    handleInsertAPI: saveProName,
                  });
                }}
                // disabled={isDisableInputs}
                type="button"
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
              </button>
            </div>
          </div>


          <ReactSelect
            placeholderName={t("department")}
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
            // isDisabled={UHID ? true : false}
            removeIsClearable={true}
          />


          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="DoctorID"
            id="DoctorID"
            placeholderName={t("Doctor")}
            dynamicOptions={DropDownState?.getDoctorDeptWise?.map((ele) => ({
              code: ele?.code || ele?.DoctorID,
              name: ele?.name || ele?.Name,
            }))}
            handleChange={handleMultiSelectChange}
            value={payloadData?.DoctorID}
            requiredClassName={`required-fields ${errors?.DoctorID ? "required-fields-active" : ""}`}
          />
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="ConsultingDoctor"
            id="ConsultingDoctor"
            placeholderName={t("Consulting Doctor")}
            // dynamicOptions={DropDownState?.getDoctorDeptWise?.map((ele) => ({
            //   value: ele?.code || ele?.DoctorID,
            //   label: ele?.name || ele?.Name,
            // }))}
            dynamicOptions={[...handleReactSelectDropDownOptions(DropDownState?.getDoctorDeptWise, "label", "value")]}

            handleChange={handleReactSelectDynamicOptions}
            value={payloadData?.ConsultingDoctor}
          // requiredClassName={`required-fields ${errors?.DoctorID ? "required-fields-active" : ""}`}
          />

          <ReactSelect
            placeholderName={t("MLC")}
            id={"MLC"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={MapGeneric_OPTION}
            name="MLC"
            handleChange={handleReactSelect}
            value={payloadData?.MLC}
          // isDisabled
          // requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            id="admittedBy"
            name="admittedBy"
            value={payloadData?.admittedBy}
            onChange={handleChange}
            lable={t("Admitted By")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("ECHS")}
            id={"ECHS"}
            name="ECHS"
            value={payloadData?.ECHS}
            handleChange={handleReactSelectChange}
            dynamicOptions={filterByTypes(DropDownState?.getAdmissionType?.length > 0 ? DropDownState?.getAdmissionType : [], ["ECHS"], ["AType"], "label", "label", "value")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          // requiredClassName={`required-fields ${errors?.admissionType ? "required-fields-active" : ""}`}
          />

          <ReactSelect
            placeholderName={t("treatment")}
            id={"treatment"}
            name="treatment"
            value={payloadData?.treatment}
            handleChange={handleReactSelectChange}
            dynamicOptions={filterByTypes(DropDownState?.getAdmissionType?.length > 0 ? DropDownState?.getAdmissionType : [], ["Treatment"], ["AType"], "label", "label", "value")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          // requiredClassName={`required-fields ${errors?.admissionType ? "required-fields-active" : ""}`}
          />

          {payloadData?.DoctorID?.length > 0 && (
            <div className="col-12">
              <div className="doctorBind">
                <div className="doctorsName">
                  {payloadData?.DoctorID?.map((item) => {
                    return item?.name;
                  }).join("  ,  ")}
                </div>
              </div>
            </div>
          )}
        </>
      </DetailsCardForDefaultValue>
      <div className="row px-2">

        <Input
          type="text"
          className="form-control"
          id="diagnosis"
          name="diagnosis"
          value={payloadData?.diagnosis}
          onChange={handleChange}
          lable={t("Diagnosis")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className="form-control"
          id="isApporvaldays"
          name="isApporvaldays"
          value={payloadData?.isApporvaldays}
          onChange={handleChange}
          lable={t("Approval Days")}
          placeholder=""
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Informed Ward")}
          id={"Informedward"}
          name="Informedward"
          value={payloadData?.Informedward}
          handleChange={handleReactSelectChange}
          dynamicOptions={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        // requiredClassName={`required-fields ${errors?.admissionType ? "required-fields-active" : ""}`}
        />
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
          <DatePicker
            className={`custom-calendar `}
            respclass="vital-sign-date"
            id="dateOfVisit"
            name="dateOfVisit"
            // value={
            //   payloadData?.dateOfVisit ? payloadData?.dateOfVisit : new Date()
            // }
            // handleChange={handleChange}
            value={
              payloadData?.dateOfVisit
                ? moment(payloadData?.dateOfVisit).toDate()
                : ""
            }
            maxDate={new Date()}
            handleChange={(e) => {
              const dateInput = e.target.value;

              setPayloadData((prev) => ({
                ...prev,
                dateOfVisit: moment(dateInput).toDate(), // Ensure state updates
              }));
            }}
            lable={t("Admission_Date")}
            placeholder={VITE_DATE_FORMAT}
            inputClassName={"required-fields"}
            disable={!data ? false : true}
          />

          <TimePicker
            lable={t("Time")}
            respclass="vital-sign-time ml-1"
            id="time"
            name="time"
            value={payloadData?.time}
            handleChange={handleChange}
            className={"required-fields"}
          />
        </div>
        <ReactSelect
          placeholderName={t("Admission_Type")}
          id={"admissionType"}
          name="admissionType"
          value={payloadData?.admissionType}
          handleChange={handleReactSelectChange}

          dynamicOptions={filterByTypes(DropDownState?.getAdmissionType?.length > 0 ? DropDownState?.getAdmissionType : [], ["AdmissionType"], ["AType"], "label", "label", "value")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          requiredClassName={`required-fields ${errors?.admissionType ? "required-fields-active" : ""}`}
        />

        {/* <ReactSelect
            placeholderName={t("Room_Type")}
            id={"IPDCaseTypeID"}
            name="IPDCaseTypeID"
            value={payloadData?.IPDCaseTypeID}
            handleChange={handleReactSelect}
            dynamicOptions={DropDownState?.getRoomType?.map((item) => ({
              label: item?.Name,
              value: item?.IPDCaseTypeID,
            }))}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            requiredClassName={`required-fields ${errors?.IPDCaseTypeID ? "required-fields-active" : ""}`}
          /> */}
        <ReactSelect
          placeholderName={t("Room_Type")}
          id={"IPDCaseTypeID"}
          name="IPDCaseTypeID"
          value={payloadData?.IPDCaseTypeID}
          handleChange={(name, e) =>
            handleReactSelect(name, e, "BillingCategory")
          }
          // dynamicOptions={DropDownState?.getRoomType?.map((item) => ({
          //   label: item?.Name,
          //   value: item?.IPDCaseTypeID,
          // }))}
          dynamicOptions={handleReactSelectDropDownOptions(DropDownState?.getRoomType ? DropDownState?.getRoomType : "", "Name", "IPDCaseTypeID")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          requiredClassName={`required-fields ${errors?.IPDCaseTypeID ? "required-fields-active" : ""}`}
        />

        <ReactSelect
          placeholderName={t("Room_BedNo")}
          id={"RoomBed"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="RoomBed"
          dynamicOptions={DropDownState?.getBindRoomBed?.map((item) => ({
            label: item?.Name,
            value: item?.RoomId,
          }))}
          value={payloadData?.RoomBed}
          handleChange={handleReactSelectChange}
          requiredClassName={`required-fields ${errors?.RoomBed ? "required-fields-active" : ""}`}
        />
        <ReactSelect
          placeholderName={t("Billing_Category")}
          id={"BillingCategory"}
          isDisabled={true}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="BillingCategory"
          dynamicOptions={DropDownState?.getBillingCategory?.map((item) => ({
            label: item?.Name,
            value: item?.IPDCaseTypeID,
          }))}
          value={payloadData?.BillingCategory}
          handleChange={handleReactSelect}
          requiredClassName={`required-fields ${errors?.BillingCategory ? "required-fields-active" : ""}`}
        />

        <ReactSelect
          placeholderName={t("Refered Source")}
          id={"ReferedSource"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="ReferedSource"
          dynamicOptions={ReferedSourceConst}
          value={payloadData?.ReferedSource}
          handleChange={handleReactSelectChange}
        // requiredClassName={`required-fields ${errors?.ReferedSource ? "required-fields-active" : ""}`}
        />

        <ReactSelect
          placeholderName={t("Requested_Room_Type")}
          id={"requestedRoomType"}
          name="requestedRoomType"
          value={payloadData?.requestedRoomType}
          handleChange={handleReactSelectChange}
          dynamicOptions={DropDownState?.getRoomType?.map((item) => ({
            label: item?.Name,
            value: item?.IPDCaseTypeID,
          }))}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        // requiredClassName={`required-fields ${errors?.requestedRoomType ? "required-fields-active" : ""}`}
        />
        {/* <Input
            type="text"
            className="form-control"
            id="IssuedVisitorCardNo"
            name="IssuedVisitorCardNo"
            value={payloadData?.IssuedVisitorCardNo}
            onChange={handleChange}
            lable={t("Visitor Card Qty")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> */}

        {data &&
          <div className="row px-2">
            <ReactSelect
              placeholderName={t("Relation_Of")}
              id="Relation"
              searchable={true}
              name="Relation"
              value={relation?.RelationOf}
              handleChange={handleChangRelation}
              // placeholder=" "
              respclass="col-xl-4 col-md-3 col-sm-4 col-12"
              dynamicOptions={filterByType(
                CentreWiseCache,
                6,
                "TypeID",
                "TextField",
                "ValueField"
              )}
            // isDisabled={isDisableInputs}
            />

            <Input
              type="text"
              className="form-control"
              id="Relation_Name"
              name="RelationName"
              value={relation.RelationName}
              onChange={(e) =>
                setRelation({ ...relation, RelationName: e.target.value })
              }
              lable={t("Relation_Name")}
              placeholder=" "
              respclass="col-xl-4 col-md-3 col-sm-4 col-12"
            // disabled={isDisableInputs}
            />
            <div className="col-xl-4 col-md-3 col-sm-4 col-12">
              <div className="d-flex">
                <Input
                  type="text"
                  className="form-control"
                  id="Relation_Phone"
                  name="RelationPhone"
                  value={relation.RelationPhone}
                  // onChange={(e) =>
                  //   setRelation({ ...relation, RelationPhone: e.target.value })
                  // }

                  onChange={(e) => {
                    const value = e.target.value;
                    if (MOBILE_NUMBER_VALIDATION_REGX.test(value)) {
                      setRelation({ ...relation, RelationPhone: value });
                    }
                  }}
                  lable={t("Relation_Phone")}
                  placeholder=" "
                  respclass="col-xl-12 col-md-3 col-sm-4 col-12"
                // disabled={isDisableInputs}
                />

                <div>
                  <button
                    className="btn btn-sm btn-primary"

                    onClick={handleAddRelation}
                    // disabled={isDisableInputs}
                    type="button"
                  >
                    <i className="fa fa-plus-circle fa-sm new_record_pluse "></i>
                  </button>
                </div>
              </div>
            </div>

          </div>}



        <div className="col-12 pb-2">
          {singlePatientData?.PatientRelationData?.length > 0 && (


            <Tables
              tbody={relationsData?.map((rel, index) => ({
                checkBox: (
                  <Checkbox
                    key={index}
                    // disabled={true}
                    className="pt-1"
                    checked={selectedRelations?.includes(rel)}
                    onChange={(e) => {
                      // debugger;
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        setSelectedRelations((prev) => [...prev, rel]);
                      } else {
                        setSelectedRelations(() =>
                          selectedRelations.filter((item) => item !== rel)
                        );
                      }
                    }}
                  />
                ),
                relation: rel.RelationName,
                RelationName: rel.RelationOf,
                RelationPhone: rel.RelationPhoneNo,
                delete: (

                  <i
                    className="fa fa-trash"
                    onClick={() => handleDeleteRelation(index)}
                    aria-hidden="true"
                    id="redDeleteColor"

                  ></i>

                ),
              }))}
              thead={[
                { name: t("isPersonal"), width: "1%" },
                t("Relation Of"),
                t("Relation Name"),
                t("Relation Phone"),
                { name: t("Action"), width: "1%" },
              ]}
            />


          )}
        </div>
        <Input
          type="text"
          className="form-control"
          id="admissionReason"
          name="admissionReason"
          value={payloadData?.admissionReason}
          onChange={handleChange}
          lable={t("Admission Reason")}
          placeholder=""
          respclass="col-xl-8 col-md-4 col-sm-4 col-12"
        />


        <div className="ml-2">
          {data ? (
            <button
              className="btn btn-primary btn-sm px-3"
              // type="submit"
              onClick={handleUpdatePatientAdmissionDetails}
            >
              {t("Update")}
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm px-3"
              // type="submit"
              onClick={handleSaveIPDAdmission}
            >
              {t("Save")}
            </button>
          )}
        </div>
      </div>

      {/* <div className="row p-2">
        <div className="col-sm-2 text-right">
          {data ? (
            <button
              className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
              // type="submit"
              onClick={handleUpdatePatientAdmissionDetails}
            >
              {t("Update")}
            </button>
          ) : (
            <button
              className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
              // type="submit"
              onClick={handleSaveIPDAdmission}
            >
              {t("Save")}
            </button>
          )}
        </div>
      </div> */}
    </>
  );
};
