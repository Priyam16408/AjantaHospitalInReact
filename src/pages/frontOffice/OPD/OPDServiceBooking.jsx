import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import OverLay from "../../../components/modalComponent/OverLay";
import { Fragment, lazy, useEffect, useMemo, useRef, useState } from "react";
import TestPayment from "../../../components/front-office/TestPayment";
import PaymentGateway from "../../../components/front-office/PaymentGateway";
import TestAddingTable from "../../../components/UI/customTable/frontofficetables/TestAddingTable";
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
  StickerPrintVisitWiseReport,
  bindHashCode,
  bindPanelByPatientID,
} from "../../../networkServices/opdserviceAPI";
import { PAYMENT_OBJECT, THEAD } from "../../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  GetBindDepartment,
  GetBindReferDoctor,
  GetBindReferalType,
} from "../../../store/reducers/common/CommonExportFunction";
import {
  OPDServiceBookingPayload,
  ReactSelectisDefaultValue,
  handleReactSelectDropDownOptions,
  handlereferDocotorIDByReferalType,
  notify,
} from "../../../utils/utils";
import SearchComponentByUHIDMobileName from "../../../components/commonComponents/SearchComponentByUHIDMobileName";
import DetailsCardForDefaultValue from "../../../components/commonComponents/DetailsCardForDefaultValue";
import Index from "../../frontOffice/PatientRegistration/Index";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import NotificationCard from "../Re_Print/NotificationCard";
import MessageCard from "../Re_Print/MessageCard";
import { useLocation } from "react-router-dom";
import { OpenPDFURL, RedirectURL } from "../../../networkServices/PDFURL";
import { BasicMasterBindPro, BasicMasterSavePro, BillingIPDSaveReferDoctor, CommonReceiptPdf } from "../../../networkServices/BillingsApi";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import {
  getECHSDoctorsListApi,
  getECHSPolyclinicListApi,
  getReferEmployeesListApi,
} from "../../../networkServices/directPatientReg";
import { MultiSelect } from "primereact/multiselect";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { Card } from "react-bootstrap";
import Tables from "../../../components/UI/customTable";

import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import NotificationVisitCard from "../../../components/commonComponents/NotificationVisitCard";
import ReferDoctorModal from "../../Billing/IPD/ReferDoctorModal";
import Modal from "../../../components/modalComponent/Modal";

export default function OPDServiceBooking(props) {
  const { UHID, TestData, handleConfirmationSubmit
    //  ,sendFunctionToParent
  } = props;
  const location = useLocation();
  const [t] = useTranslation();
  // Starting date and time
  const start = moment(); // current date and time
  // Ending time (e.g., 5 minutes after the start)
  const end = moment(start).add(5, 'minutes');
  // Format the string
  const AppointmentFormattedString = `${start.format('DD-MMM-YYYY')}#${start.format('hh:mm A')}-${end.format('hh:mm A')}`;
  const [singlePatientData, setSinglePatientData] = useState({});
  const [relationdata, setRelationData] = useState([]);
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
  const [lastVisitData, setLastVisitData] = useState(null)
  const [lastVisitItemData, setLastVisitItemData] = useState(null)

  let userData = useLocalStorage("userData", "get");

  console.log(singlePatientData, "singlePatientDatasinglePatientData")

  // global state for this component
  const [payloadData, setPayloadData] = useState({
    panelID: singlePatientData?.PanelID,
    referalTypeID: {
      label: "Self",
      value: 4,
    },
    referDoctorID: "",
    DepartmentID: "ALL",
    DoctorID: "",
    proId: "",
    ECHSDoctorID: "",
    ECHSPolyClinicID: "",
    Source: "",
    MLC: "",
    ReferEmpID: "",
    PatientRelationData: [],
    contactNo:singlePatientData?.ContactNo
  });



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
      const response = await GetLastVisitDetail(PatientID, DoctorID);
      return response?.data

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
          <div>{t("Date")}</div>
          <div>{responsegetLastDetail?.VisitDate}</div>
        </div>

        <div className="d-flex justify-content-between">
          <div>{t("Valid To")}</div>
          <div>{responsegetLastDetail?.ValidTo}</div>
        </div>

        <div className="d-flex justify-content-between">
          <div>{t("Amount Paid")}</div>
          <div>{responsegetLastDetail?.AmountPaid}</div>
        </div>

        <div className="d-flex justify-content-between">
          <div>{t("Days")}</div>
          <div>{responsegetLastDetail?.Days}</div>
        </div>

        <div className="d-flex justify-content-between">
          <div>{t("Type")}</div>
          <div>{responsegetLastDetail?.VisitType}</div>
        </div>

        <div className="d-flex justify-content-between">
          <div>{t("Doctor")}</div>
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

  console.log(lastVisitData, "dayaya")

  const handleSinglePatientData = async (data) => {

    let blacklist = await CheckblacklistAPI();
    const { MRNo } = data;
    try {
      const data = await PatientSearchbyBarcode(MRNo, 1);
      const responseGetLastVisitDetail = await handleGetLastVisitDetail(
        MRNo,
        data?.data?.DoctorID
      );
      if (responseGetLastVisitDetail?.length > 0) {

        const finalData = responseGetLastVisitDetail?.flatMap((item) => [
          { label: "Date", value: item?.VisitDate || "" },
          { label: "Valid To", value: item?.ValidTo || "" },
          { label: "Amount Paid", value: item?.AmountPaid || 0 },
          { label: "Days", value: item?.Days || 0 },
          { label: "Type", value: item?.VisitType || "" },
          { label: "Doctor", value: item?.Doctor || "" },
        ]);

        setLastVisitData(finalData)
      }

      const responseLastVisitDetail = await handleLastVisitDetails(MRNo);
      if (responseLastVisitDetail?.length > 0) {

        const finalData = responseLastVisitDetail?.flatMap((item, i) => [
          { label: i + 1, value: item?.Name || "" },
        ]);

        setLastVisitItemData(finalData)
      }


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
      setPayloadData((val) => ({ ...val, DoctorID: data?.data?.DoctorID, Source: data?.data?.Source }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (UHID) {
      handleSinglePatientData({ MRNo: UHID });
    }
  }, [UHID]);

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
      coPayIsDefault,
      discountIsDefault,
      discountReason,
      discountApproveBy,
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
      disableDiscount,
      refund,
      constantMinimumPayableAmount,
      coPayIsDefault,
      discountIsDefault,
      discountReason,
      discountApproveBy,
    };
// debugger
    setPaymentMethod([]);
    setPaymentControlModeState(setData);
  };

  // table

  const handleChange = (e, index, name) => {
    const { value } = e.target;
    const data = [...bodyData];
    data[index][name] = value;
    console.log("data", data)
    setBodyData(data);
  };

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

  const handleStickerPrint = async (data) => {
    try {

      let payload = {
        "ledgerTransactionNo": data?.ledgerTransactionNo,
        "isCounsltation": data?.isConsultant,
        "isfree": data?.isFreeVisit
      }
      const stickerData = await StickerPrintVisitWiseReport(payload);

      if (stickerData?.success) {
        const urlsKeys = Object.keys(stickerData?.data);
        urlsKeys.map((url) => {
          RedirectURL(stickerData?.data[url]);
        })
      } else {
        // notify(stickerData?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOPDServiceAPI = async () => {
    // if(!payload.lt.DepositeBy){
    //  
    // }

    if (paymentControlModeState?.discountAmount > 0) {
      if (!paymentControlModeState?.discountReason) {
        notify("Discount Type is required", "error");
        return;
      } else if (!paymentControlModeState?.DiscountReasons1) {
        notify("Discount Reason is required", "error");
        return;
      } else if (!paymentControlModeState?.discountApproveBy?.value) {
        notify("Discount Approve By is required", "error");
        return;
      }

      // return;
    }



    const { pathname } = location;
    try {
      const hashcode = await bindHashCode();
      // console.log(payload , "payload by me -----")
      const { response, payload } = OPDServiceBookingPayload(
        singlePatientData,
        payloadData,
        hashcode?.data,
        testAddingTableState,
        paymentControlModeState,
        paymentMethod,
        pathname,
        relationdata,
        AppointmentFormattedString
      );

      if (!payload?.lt?.DepositedBy || payload.lt.DepositedBy.trim() === "") {
        notify("Deposited By is required", "warn");
        return;
      }



      if (Object?.keys(response).length > 0) {
        notify(response?.message, response?.status);
        return;
      }

      // if (type === "confirmation") {
      //   handleConfirmationSubmit(payload);
      //   return;
      // }

      const data = await SaveLabPrescriptionOPD({
        ...payload,
      });

      if (data?.success) {
        //  
        const reportResp = await CommonReceiptPdf({
          ledgerTransactionNo: data?.data?.ledgerTransactionNo,
          isBill: 1,
          receiptNo: "",
          duplicate: "",
          type: "OPD",
          supplierID: "",
          billNo: "",
          isEMGBilling: "",
          isOnlinePrint: "",
          isRefound: 0,
        });
        if (data?.success) {
          //  

          await handleStickerPrint(data?.data);
          if (data?.data?.isConsultant !== 0 && data?.data?.isOpdCardAllowed === 1) {
            OpenPDFURL("PrintCardPrintOut", singlePatientData?.PatientID, data?.data?.ledgerTransactionNo);
          }
          sendReset();
          if (reportResp?.success) {
            RedirectURL(reportResp?.data?.pdfUrl);
          } else {
            notify(reportResp?.data?.message, "error");
          }
        }
        else {
          sendReset();
          RedirectURL(reportResp?.data?.pdfUrl);
        }
        notify(data?.message, "success");
        sendReset();
        if (UHID) {
          handleConfirmationSubmit();
        }

        // console.log("singlePatientData",data?.data)
        // const reportResp = await CommonReceiptPdf({
        //   ledgerTransactionNo: data?.data?.ledgerTransactionNo,
        //   isBill: 1,
        //   receiptNo: "",
        //   duplicate: "",
        //   type: "OPD",
        //   supplierID: "",
        //   billNo: "",
        //   isEMGBilling: "",
        //   isOnlinePrint: "",
        //   isRefound: 0,
        // });
        // if (reportResp?.success) {
        //   RedirectURL(reportResp?.data?.pdfUrl);
        // } else {
        //   notify(reportResp?.data?.message, "error");
        // }
        // OpenPDFURL("OPDSericeReceipt", data?.data?.ledgerTransactionNo, "opd");
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      notify(error, "error");
      console.log(error, "error");
    }
  };

  useEffect(() => {
    GetDiscListAPI();
  }, []);


  const setCallingApi = (validateInvestigation) => {
    validateInvestigation()
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
                  {t("New Registration")}
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
            visible={visible}
            setVisible={setVisible}
            bindDetailAPI={handleSinglePatientData}
            UHID={UHID ?? false}
            setRelationData={setRelationData}
            lastVisitData={lastVisitData}
            lastVisitItemData={lastVisitItemData}
          // sendFunctionToParent={sendFunctionToParent}
          // sendFunctionToParent={setCallingApi}
          />
        )}
      </div>

      <TestPayment
        testPaymentState={testPaymentState}
        setTestPaymentState={setTestPaymentState}
        payloadData={payloadData}
        setPayloadData={setPayloadData}
        singlePatientData={singlePatientData}
        setTestAddingTable={setTestAddingTable}
        testAddingTableState={testAddingTableState}
        handlePaymentGateWay={handlePaymentGateWay}
        TestData={TestData ?? []}
        UHID={UHID ?? false}
      // apiCalling={apiCalling}
      // sendFunctionToParent={sendFunctionToParent}
      />


      <TestAddingTable
        bodyData={testAddingTableState}
        setBodyData={setTestAddingTable}
        handlePaymentGateWay={handlePaymentGateWay}
        paymentControlModeState={paymentControlModeState}
        
        singlePatientData={singlePatientData}
        payloadData={payloadData}
        discounts={discounts}
        THEAD={THEAD}
        handleChange={handleChange}
        UHID={UHID ?? false}
      />

      {/* Payment Component */}
      <PaymentGateway
        screenType={paymentControlModeState}
        setScreenType={setPaymentControlModeState}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        discounts={discounts}
        testAddingTableState={testAddingTableState}
        button={
          <button className="button" onClick={handleOPDServiceAPI}>
            {t("Save")}
          </button>
        }
      />

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
  visible,
  setVisible,
  bindDetailAPI,
  UHID,
  setRelationData,
  lastVisitData,
  lastVisitItemData
  // sendFunctionToParent
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  let ip = useLocalStorage("ip", "get");

  const { GetBindReferDoctorList, GetReferTypeList, GetDepartmentList } =
    useSelector((state) => state?.CommonSlice);

  const relationCheckList = singlePatientData?.PatientRelationData?.filter(
    (rel) => rel?.IsPersonal === 1
  )
  const [selectedRelations, setSelectedRelations] = useState(relationCheckList);
  const [ECHSDoctors, setECHSDoctors] = useState([]);
  const [ECHSPolyclinics, setECHSPolyclinics] = useState([]);
  const [referEmployeesList, setReferEmployeesList] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});

  const [modalData, setModalData] = useState({});
  const [values, setValues] = useState({
    contactNo:singlePatientData?.Mobile
  });

  const [DropDownState, setDropDownState] = useState({
    getBindPanelByPatientID: [],
    getBindProList: [],
    getDoctorDeptWise: [],
  });
 const handleChange = (e) => {
  debugger
    const { name, value } = e.target;
    setPayloadData({
      ...payloadData,
      [name]: value,
    });
  };

  const handlePanelReactSelectChange = (name, e) => {
    const data = DropDownState?.getBindPanelByPatientID.find(
      (ele) => Number(ele?.value) === Number(e?.value)
    );
    setPayloadData({
      ...payloadData,
      [name]: data,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  // react select handleChange
  const handleReactSelectChange = async (name, e) => {
    ;
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
          referDoctorID: e?.value === 4 ? e?.value : [],



          // referDoctorID: handlereferDocotorIDByReferalType(
          //   e?.value,
          //   payloadData?.DoctorID,
          //   ""
          // ),
        });
        break;

      case "DoctorID":
        setPayloadData({
          ...payloadData,
          [name]: e?.value,
          "SelectDoctor": e?.value, // This is to handle culsultation functionality
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
  const fetchECHSDoctors = async () => {
    try {
      const data = await getECHSDoctorsListApi();
      setECHSDoctors(
        data?.data?.map((ele) => ({
          label: ele?.DoctorName,
          value: ele?.DoctorID,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchReferEmployees = async () => {
    try {
      const data = await getReferEmployeesListApi();
      setReferEmployeesList(
        data?.data?.map((ele) => ({
          label: ele?.EmployeeName,
          value: ele?.EmployeeID,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchECHSPolyclinic = async () => {
    try {
      const data = await getECHSPolyclinicListApi(payloadData?.ECHSDoctorID);
      setECHSPolyclinics(
        data?.data?.map((ele) => ({
          label: ele?.PolyclinicName,
          value: ele?.PolyclinicID,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
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


  const handleDoctorDeptWise = async (Department) => {
    try {
      const data = await GetBindDoctorDept(Department);
      return data?.data;
    } catch (error) {
      console.log(error);
    }
  };
  const saveProName = async (modalData) => {
    //  
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
        getProNameList();

      }

    } catch (error) {
      console.error("Error saving Pro Name:", error);

    }
  }
  const saveReferalDoctor = async (modalData) => {
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
        dispatch(GetBindReferDoctor());
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
  // api call
  const FetchAllDropDown = async () => {
    //  ;
    try {

      const response = await Promise.all([
        handleBindPanelByPatientID(),
        handleDoctorDeptWise(payloadData?.DepartmentID),
        getProNameList()
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

        getBindProList: handleReactSelectDropDownOptions(
          response[2],
          "ProName",
          "Pro_ID"
        ),
      };
      setDropDownState(responseDropdown);
      setPayloadData({
        ...payloadData,
        panelID:
          responseDropdown?.getBindPanelByPatientID?.find((ele) => ele["PanelID"] === singlePatientData?.PanelID),

      });
      // setPayloadData({
      //   ...payloadData,
      //   panelID: singlePatientData?.PanelID? {value:singlePatientData?.PanelID} : ReactSelectisDefaultValue(
      //     responseDropdown?.getBindPanelByPatientID,
      //     "isDefaultPanel"
      //   ),
      // });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sourceOptions = [
    { label: "OPD", value: "OPD" },
    { label: "EMG", value: "EMG" },
    { label: "OUTSOURCE", value: "OUTSOURCE" },
  ];

  const handleDataInDetailView = useMemo(() => {
    const data = [
      {
        label: t("PatientID"),
        value: `${singlePatientData?.PatientID}`,
      },

      {
        label: t("Patient Name"),
        value: `${singlePatientData?.Title} ${singlePatientData?.PName}`,
      },
      {
        label: t("Gender/Age"),
        value: `${singlePatientData?.Gender} / ${singlePatientData?.Age}`,
      },
      // {
      //   label: t("Contact No."),
      //   value: singlePatientData?.Mobile,
      // },

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
  }, [singlePatientData]);
  useEffect(() => {
    FetchAllDropDown();
    fetchECHSDoctors();
  }, [visible]);

  useEffect(() => {
    payloadData?.ECHSDoctorID && fetchECHSPolyclinic();
  }, [payloadData?.ECHSDoctorID]);
  useEffect(() => {
    dispatch(GetBindReferDoctor());
    dispatch(GetBindReferalType());
    dispatch(GetBindDepartment());
    fetchReferEmployees();
  }, []);

  useEffect(() => {
    setRelationData(selectedRelations)
  }, [selectedRelations]);

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
        sendReset={sendReset}
        show={UHID}
      >
        <>
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <MultiSelect
              name="Relation"
              // id="Relation"
              placeholder={t("Relation")}
              onChange={(e) => {
                setPayloadData({
                  ...payloadData,
                  PatientRelationData: e.value,
                });
              }}
              options={singlePatientData?.PatientRelationData?.map(
                (ele, i) => ({
                  label: ele?.RelationName,
                  value: ele?.RelationID,
                })
              )}
              className="multiselect"
              value={payloadData?.PatientRelationData}
            />
          </div> */}
           {/* <Input
            type="text"
            className="form-control required-fields"
            id="Mobile"
            name="Mobile"
            onChange={handleChange}
            value={singlePatientData?.Mobile}
            lable={t("Contact No.")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          /> */}
          <Input
  type="text"
  className="form-control"
  id="contactNo"
  name="contactNo"
  maxLength="10"
  onChange={(e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPayloadData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }}
  value={values?.contactNo || ""}
  lable={t("Contact No.")}
  placeholder=" "
  respclass="col-xl-2 col-md-3 col-sm-6 col-12"
/>

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
            placeholderName={t("Source")}
            id={"Source"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={payloadData?.Source}
            name={"Source"}
            dynamicOptions={sourceOptions}
            handleChange={handleReactSelectChange}
            removeIsClearable={true}
          />
          <ReactSelect
            placeholderName={t("MLC")}
            id={"MLC"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={payloadData?.MLC}
            name={"MLC"}
            dynamicOptions={[
              { label: t("Yes"), value: "1" },
              { label: t("No"), value: "0" },
            ]}
            handleChange={handleReactSelectChange}
            removeIsClearable={true}
          />

          <ReactSelect
            placeholderName={t("Refer Type")}
            id={"referalTypeID"}
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
          <div className="d-flex col-xl-2 col-md-4 col-sm-6 col-12">
            <ReactSelect
              placeholderName={t("Refer Doctor")}
              id={"referDoctor"}
              searchable={true}
              respclass="col-xl-11 col-md-10 col-sm-10 pl-0"
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
                  : DropDownState?.getDoctorDeptWise
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
          <ReactSelect
            placeholderName={t("Refer Employee")}
            id={"ReferEmpID"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={referEmployeesList}
            name="ReferEmpID"
            value={payloadData?.ReferEmpID}
            handleChange={handleReactSelectChange}
          />
          <ReactSelect
            placeholderName={t("ECHS Doctors")}
            id={"ECHSDoctorID"}
            searchable={true}
            name={"ECHSDoctorID"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={ECHSDoctors}
            value={payloadData?.ECHSDoctorID}
            handleChange={handleReactSelectChange}
          />
          <LabeledInput
            label={t("ECHSPolyclinic")}
            id={"ECHSPolyClinicID"}
            name={"ECHSPolyClinicID"}
            className="col-xl-2 col-md-4 col-sm-6 col-12 pt-1"
            value={payloadData?.ECHSDoctorID ? ECHSPolyclinics[0]?.label : ""}
          />
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
              isDisabled={UHID ? true : false}
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
          <LabeledInput
            className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
            label={"International Patient"}
            value={
              singlePatientData?.IsInternational === 1 ? "Yes" : "No"
            }
            disabled={true}
          />
          <LabeledInput
            className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
            label={"Employee Id"}
            value={singlePatientData?.EmployeeReferenceID}
            disabled={true}
          />
        </>
      </DetailsCardForDefaultValue>

      <div>
        {singlePatientData?.PatientRelationData?.length > 0 && (
          <Card className="">
            <div className="col-12">
              <Tables
                tbody={relationCheckList?.map((rel, index) => ({
                  checkBox: (
                    <Checkbox
                      key={index}
                      // disabled={true}
                      checked={selectedRelations?.includes(rel)}
                      onChange={(e) => {
                        //  ;
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
                }))}
                thead={[
                  "isPersonal",
                  "Relation Of",
                  "Relation Name",
                  "Relation Phone",
                ]}
              />
            </div>
          </Card>
        )}
        {/* {lastVisitData && (

          <NotificationVisitCard data={lastVisitData} />
        )}
        {lastVisitItemData && (

          <NotificationVisitCard data={lastVisitItemData} />
        )} */}
      </div>
    </>
  );
};
