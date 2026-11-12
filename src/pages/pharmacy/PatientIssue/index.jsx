import React, { useRef, useState } from "react";
import Modal from "../../../components/modalComponent/Modal";
import Heading from "../../../components/UI/Heading";
import SearchItemEassyUI from "../../../components/commonComponents/SearchItemEassyUI";
import {
  AGE_TYPE,
  AMOUNT_REGX,
  BIND_TABLE_OLDPATIENTSEARCH_PHARMECY,
  BIND_TABLE_BY_MED_FIRST_NAME_PHARMECY,
  PAYMENT_OBJECT,
  ROUNDOFF_VALUE,
  MOBILE_NUMBER_VALIDATION_REGX,
} from "../../../utils/constant";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Input from "../../../components/formComponent/Input";
import {
  BindDisApprovalList,
  bindHashCode,
  bindPanelByPatientID,
  GetBindDoctorDept,
  GetDiscountWithCoPay,
  GetDiscReasonList,
  GetEligiableDiscountPercent,
  PatientSearchbyBarcode,
} from "../../../networkServices/opdserviceAPI";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  CentreWiseCacheByCenterID,
  GetBindReferDoctor,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import {
  AddItemPharmecy,
  calculateBillAmount,
  filterByTypes,
  handleCalculatePatientIssue,
  handleReactSelectDropDownOptions,
  inputBoxValidation,
  notify,
} from "../../../utils/utils";
import {
  AddItemByItemIDPharmecy,
  bindFromDepartments,
  DraftPharmecyAPICall,
  GetPharmacyPatientDetail,
  PharmacyClinicalTrialAPI,
  PharmacyMedicineItemSearch,
  SavePharmecyAPICall,
} from "../../../networkServices/pharmecy";
import PatientIssueTable from "./PatientIssueTable";
import PaymentGateway from "../../../components/front-office/PaymentGateway";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import ClinicalTrialModal from "./ClinicalTrialModal";
import IndentReqModal from "./IndentReqModal";
import {
  CashPanel,
  DraftPharmecyAPIPayload,
  SavePharmecyAPIPayload,
} from "../../../utils/ustil2";
import { RedirectURL } from "../../../networkServices/PDFURL";
import {
  CommonReceiptPdf,
  PatientBillingGetPackage,
  PostIncludeBillApi,
} from "../../../networkServices/BillingsApi";

import Tables from "../../../components/UI/customTable";
import { Checkbox } from "primereact/checkbox";


export default function Index() {
  const [t] = useTranslation();

  const thead = [
    {name:t("Select"), width: "1%"},
    t("Date"),
    t("BillNo"),
    t("ReceiptNo"),
    t("Type"),
    t("Ipd No"),
    t("PName"),
    t("PackageName"),
    t("Paid Amount"),
    t("Package Amount"),
    t("Pharmacy Amt"),
    t("UtilizePharmacy Amt"),
  ];

  const [packageData, setPackageData] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);

  const [ischecked, setIsChecked] = useState(false);
      console.log(selectedPackage, "selectedPackageselectedPackage");
  const TYPE = [
    { label: t("Registered"), value: 1 },
    { label: t("Walk-in"), value: 2 },
  ];
  const DISMED = [
    { label: t("YES"), value: "1" },
    { label: t("NO"), value: "0" },
  ];
  const SearchByOption = [
    { label: t("Item Name"), value: "1" },
    { label: t("With Generic"), value: "2" },
    { label: t("Barcode"), value: "3" },
    { label: t("Generic"), value: "4" },
  ];
  const SellOnOption = [
    { label: t("MRP"), value: "0" },
    { label: t("Rate"), value: "1" },
  ];
  let initialValue = {
    type: { value: 1 },
    SearchBy: { value: "1" },
    itemType: { value: "1" },
    Generic: { value: "0" },
    addToImplant: { value: false },
    SellOn: { value: "0" },
    title: { value: t("Mr.") },
    Gender: { value: t("Male") },
    AgeType: { value: t("YRS") },
    DisMed: { value: "0" },
    Panel: CashPanel,
  };

  const [values, setValues] = useState(initialValue);
  const [department, setDepartment] = useState();
  const [panelList, setPanelList] = useState([]);
  const [mainDoctorList, setMainDoctorList] = useState([]);
  const dispatch = useDispatch();
  const { GetBindReferDoctorList, CentreWiseCache, BindResource } = useSelector(
    (state) => state.CommonSlice
  );
  const MedicineRef = useRef(null);
  const nameRef = useRef(null);
  const searchPatientRef = useRef(null);
  const quantityRef = useRef(null);

  const focusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  let userData = useLocalStorage("userData", "get");
  let isCashPanel = panelList?.find(item => item?.value === values?.Panel?.value)?.IsCash || 0;
  console.log(selectedPackage, isCashPanel, "selectedPackageselectedPackage")

  const getMainDoctorList = async () => {
    let apiResp = await GetBindDoctorDept("ALL");
    if (apiResp?.success) {
      setMainDoctorList(apiResp?.data);
    } else {
      setMainDoctorList([]);
    }
  };

  const GetDepartmentList = async () => {
    const apiResp = await bindFromDepartments(
      `deptID=${userData?.deptLedgerNo}&centreID=${userData?.centreID}`
    );
    if (apiResp?.success) {
      setDepartment(
        apiResp?.data
          ?.filter((val) => val?.IsStore === 1 && val?.IsMedical === 1)
          ?.sort((a, b) => a.ledgerName.localeCompare(b.ledgerName))
      );
    }
  };

  useEffect(() => {
    dispatch(GetBindReferDoctor());
    dispatch(CentreWiseCacheByCenterID({}));
    getMainDoctorList();
    GetDepartmentList();
    focusInput(nameRef);
  }, []);

  const [BindDetails, setBindDetails] = useState({
    label: t("Search Medicine"),
    value: "",
    className: "required-fields",
  });
  const [SearchPatient, setSearchPatient] = useState({
    label: t("UHID/IPDNo/EMGNo/Name/Mobile"),
    id: "UHIDPatientNameIPDNo",
    value: "",
    patientDetail: {},
  });

  const [modalData, setModalData] = useState({ visible: false });
  const [bodyData, setBodyData] = useState([]);

  useEffect(() => {
    focusInput(searchPatientRef);
  }, [values?.type]);

  const handleReactSelect = async (name, value) => {
    if (name === "SearchBy") {
      setBindDetails((val) => ({ ...val, searchBy: value?.value }));
    }
    if (name === "Panel") {
      setBindDetails((val) => ({ ...val, Panel: value?.value }));
    }
    if (name === "type") {
      setSearchPatient((val) => ({ ...val, patientDetail: {} }));
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handlePatientSearchPage = () => {
    setValues({ ...initialValue, type: { value: 1 } });
    setSearchPatient((val) => ({ ...val, ["patientDetail"]: {}, value: "" }));
  };

  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };
  const onEnterAddItem = (e) => {
    if (e?.keyCode === 13) {
      AddItem();
    }
  };

  const BindListAPI = async (itemName, BindDetails, selectedPackage, isCashPanel) => {
    debugger
    let payload = {
      cmd: "item",
      type: BindDetails?.searchBy === "4" ? "2" : "1",
      deptLedgerNo: userData?.deptLedgerNo,
      q: itemName,
      page: "1",
      rows: 20,
      sort: "ItemName",
      order: "asc",
      isWithAlternate: BindDetails?.searchBy === "2" ? true : false,
      isBarCodeScan: BindDetails?.searchBy === "3" ? true : false,
      PanelId: BindDetails?.Panel ? BindDetails?.Panel : values?.Panel?.value,
      "isCashPanel": isCashPanel,
      "isPackage": selectedPackage?.length > 0 ? 1 : 0,
    };
    try {
      let apiResp = await PharmacyMedicineItemSearch(payload);
      return apiResp;
    } catch (error) { }
  };

  const getPatientDetail = async (name) => {
    let apiResp = await GetPharmacyPatientDetail(name);
    return apiResp;
  };

  const getPanelIdList = async (PatientID) => {
    let apiResp = await bindPanelByPatientID(PatientID);
    if (apiResp?.success) {
      setPanelList(
        handleReactSelectDropDownOptions(apiResp?.data, "PanelName", "PanelID")
      );
    }
  };

  const hanldeCloseSearchMed = (value) => {
    //
    setValues((val) => ({ ...val, medicineName: value }));
    setBindDetails((val) => ({ ...val, value: value?.ItemName }));
    focusInput(quantityRef);
  };


  const addMoreItemByItemId = async () => {
    const payload = {
      itemID: String(values?.medicineName?.ItemID?.split("#")[0]),
      qty: String(values?.Quantity),
      deptLedgerNo: String(userData?.deptLedgerNo),
      PanelId: values?.Panel?.value,
    };
    let apiResp = await AddItemByItemIDPharmecy(payload);
    if (apiResp?.success) {
      if (apiResp?.data[0]?.TotalQty < Number(values?.Quantity)) {
        notify("Stock Not Available", "error");
        return 0;
      } else {
        let pendingQty = 0;
        let data = apiResp?.data?.map((val, index) => {
          let needToIssuQty = values?.Quantity;
          if (val?.ItemID === apiResp?.data[index - 1]?.ItemID) {
            val.IssueQuantity = 0;
            if (pendingQty > 0) {
              if (pendingQty > val?.AvlQty) {
                val.IssueQuantity = val?.AvlQty;
                pendingQty = pendingQty - val?.AvlQty;
              } else {
                val.IssueQuantity = pendingQty;
                pendingQty = 0;
              }
            }
          } else {
            if (needToIssuQty > val?.AvlQty) {
              val.IssueQuantity = val?.AvlQty;
              pendingQty = needToIssuQty - val?.AvlQty;
            } else {
              val.IssueQuantity = needToIssuQty;
              pendingQty = 0;
            }
          }
          if (val?.IssueQuantity !== 0) {
            addSingleItem(
              val?.ItemID,
              val?.IssueQuantity,
              val?.stockid,
              index === apiResp?.data?.length - 1 ? true : false
            );
          }
          return val;
        });
      }
    }
  };
  let medData = [...bodyData];

  const addSingleItem = async (
    ItemID,
    Quantity,
    stockid,
    PanelId,
    isPaymentControl = true,
    IndentNo = "",
    draftID = 0,
    patientMedicine = 0
  ) => {
    debugger

    let apiResp = await AddItemPharmecy(ItemID, Quantity, stockid, PanelId, 0, isCashPanel,
      selectedPackage?.length > 0 ? 1 : 0,);
    if (apiResp?.success && apiResp?.data?.length > 0) {
      const getDiscount = await GetDiscountWithCoPay(
        ItemID,
        values?.Panel?.value ? values?.Panel?.value : "1",
        SearchPatient?.patientDetail?.PatientTypeID
          ? SearchPatient?.patientDetail?.PatientTypeID
          : "1",
        ""
      );

      // to check duplicate item
      let isDuplicate = false;
      bodyData?.map((item) => {
        let duplicate = apiResp?.data?.find(
          (val) => val?.stockid === item?.stockid
        );
        if (duplicate) {
          isDuplicate = true;
        }
      });

      let data = [...apiResp?.data]?.map((val) => {
        val.Quantity = Quantity;
        val.isClinicalTrial = false;
        val.IndentNo = IndentNo;
        val.patientMedicine = patientMedicine;
        val.draftID = draftID;
        val.panelID = values?.Panel?.value ? values?.Panel?.value : 1;
        val.discountCoPay = getDiscount?.data;
        val.patientType = SearchPatient?.patientDetail?.PatientType;
        val.DisPer =
          SearchPatient?.patientDetail?.PatientType === "IPD"
            ? String(getDiscount?.data?.IPDPanelDiscPercent)
            : String(getDiscount?.data?.OPDPanelDiscPercent);
        val.MRP =
          values?.SellOn === "1"
            ? val?.MRP
            : val?.UnitPrice
              ? val?.UnitPrice
              : 0;
        val.grossAmount = val?.Quantity * val?.MRP;
        val.discountAmount = (
          (val?.Quantity * val?.MRP * val.DisPer) /
          100
        ).toFixed(ROUNDOFF_VALUE);
        let modifyData = handleCalculatePatientIssue(val);
        // medData.push(modifyData)
        return modifyData;
      });

      if (!isDuplicate) {
        medData = [...medData, ...data];
        const netData = isPaymentControl && handleCalculateBillAmount(medData);
        if (netData !== 0) {
          setBodyData(medData);
          setValues((val) => ({ ...val, Quantity: "" }));
          setBindDetails((val) => ({ ...val, value: "" }));
          focusInput(MedicineRef);
        }
      } else {
        notify(t("This Item Already Added In List"), "error");
      }
    } else {
      notify(apiResp?.message, "error");
    }
  };
  const AddItem = async () => {
    if (!values?.medicineName) {
      notify(t("Medicine Name Field Is Required"), "error");
      return 0;
    } else if (!values?.Quantity) {
      notify(t("Quantity Field Is Required"), "error");
      return 0;
    }
    if (values?.medicineName?.AvlQty < Number(values?.Quantity)) {
      addMoreItemByItemId();
    } else {
      debugger
      addSingleItem(
        values?.medicineName?.ItemID?.split("#")[0],
        values?.Quantity,
        values?.medicineName?.stockid,
        values?.Panel?.value
      );
    }
  };

  const handleCloseSearchPatient = async (value) => {
    setSearchPatient((val) => ({
      ...val,
      value: value?.PatientName,
      patientDetail: value,
    }));

    setValues((val) => ({
      ...val,
      Doctor: { value: value?.DoctorID },
      Panel: { value: value?.PanelID ? value?.PanelID : 1 },
      SearchTypeNumber: "",
    }));

    handleGetPharmacyPackageData(value);
    getPanelIdList(value?.PatientID);
    focusInput(MedicineRef);

    if (value?.PatientType === "OPD") {
      let patientDetail = await PatientSearchbyBarcode(value?.PatientID, 1);
      setValues((val) => ({
        ...val,
        patientAdvanceAmount: patientDetail?.OPDAdvanceAmount,
      }));
    }
  };

  const handleGetPharmacyPackageData = async (value) => {
    debugger
    try {
      const payload = {
        uhid: value?.PatientID,
        pName: "",
        billNo: "",
        fromDate: "",
        toDate: "",
        recieptNo: "",
        ipdNo: value?.IPDNo ? value?.IPDNo : "0",
      };
      const apiResp =  await PostIncludeBillApi(payload);


      if (apiResp?.success) {
        setPackageData(apiResp?.data);
      } else {
        setPackageData([]);
      }
      console.log(apiResp);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPackageData([]);
    }
  };

  const handleCustomInput = (index, name, value, type, max) => {
    if (type === "number") {
      if (!isNaN(value) && Number(value) <= max) {
        const data = [...bodyData];
        data[index][name] = value;
        let calculatedData = handleCalculatePatientIssue(data[index], name);
        data[index] = calculatedData;
        handleCalculateBillAmount(data);
        setBodyData(data);
      } else {
        return false;
      }
    } else {
      const data = [...bodyData];
      data[index][name] = value;
      name !== "isClinicalTrial" &&
        name !== "ClinicalRemark" &&
        handleCalculateBillAmount(data);
      setBodyData(data);
    }
  };

  const deleteRowData = (index) => {
    const data = [...bodyData];
    data.splice(index, 1);
    handleCalculateBillAmount(data);
    setBodyData(data);
  };
  const [paymentControlModeState, setPaymentControlModeState] =
    useState(PAYMENT_OBJECT);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [discounts, setDiscounts] = useState({
    discountApprovalList: [],
    discountReasonList: [],
  });

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
    }
  };
  useEffect(() => {
    GetDiscListAPI();
  }, []);

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
      discountIsDefault,
      coPayIsDefault,
      DepositedBy,
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
      discountIsDefault,
      coPayIsDefault,
      DepositedBy,
    };

    if (selectedPackage?.length > 0) {
      setData.autoPaymentMode = 4;
    }

    if (
      selectedPackage?.length > 0 &&
      setData?.minimumPayableAmount > selectedPackage[0]?.PharmacyAmt
    ) {
      notify("Your Package credit is Exhausted", "error");
      return 0;
    } else {
      setPaymentMethod([]);
      setPaymentControlModeState(setData);
    }
    return setData;
  };

  const handleCalculateBillAmount = (tableList) => {
    const data = calculateBillAmount(
      tableList,
      BindResource?.IsReceipt,
      values?.type === 2
        ? 0
        : values?.patientAdvanceAmount
          ? values?.patientAdvanceAmount
          : 0,
      0,
      SearchPatient?.patientDetail?.PatientType === "IPD" ||
        SearchPatient?.patientDetail?.PatientType === "EMG"
        ? 4
        : 1,
      0.0,
      Number(values?.Panel?.value) === 1 ? 1 : 0,
      0
    );
    return handlePaymentGateWay(data);
  };
  // Handle Payment End

  const handleOpenClinicalTrial = async (val, index) => {
    const apiResp = await PharmacyClinicalTrialAPI(
      `?ItemID=${bodyData[index]?.ItemID}&PatientId=${SearchPatient?.patientDetail?.PatientID}`
    );
    if (!apiResp?.success) {
      notify(apiResp?.message, "error");
      return false;
    }
    setModalData({
      visible: true,
      width: "50vw",
      label: (
        <span>
          {t("Clinical Trial Remarks")}({t("Item Name")} :{" "}
          <span style={{ color: "#004eff" }}>
            {" "}
            {apiResp?.data[0]?.TypeName}{" "}
          </span>{" "}
          ){" "}
        </span>
      ),
      footer: <></>,
      Component: <ClinicalTrialModal bodyData={apiResp?.data} />,
    });
  };

  const handleOpenIndent = async ({
    label,
    width,
    type,
    CallAPI,
    buttonName,
  }) => {
    if (type === "indent") {
      setSearchPatient((val) => ({ ...val, patientDetail: {} }));
    }

    setModalData({
      visible: true,
      type: type,
      width: width,
      label: label,
      buttonName: buttonName,
      CallAPI: CallAPI,
      // footer: <></>,
      Component: (
        <IndentReqModal
          department={department}
          type={type}
          setParentValues={setValues}
          setSearchPatient={setSearchPatient}
          SearchPatient={SearchPatient?.patientDetail}
          handleCustomInput={handleCustomInput}
          setModalData={setModalData}
        />
      ),
    });
  };

  const handleAddIndentItem = (data) => {
    if (data?.length) {
      if (data[0]?.draftDetailID) {
        if (data[0]?.PatientID !== "CASH002") {
          setSearchPatient((val) => ({
            ...val,
            value: data[0]?.PatientID,
            isCallhandleChange: true,
          }));
        } else {
          let { Address, Title, PName, Age, ContactNo, DoctorID, gender } =
            data[0];
          setValues((val) => ({
            ...val,
            Address: Address,
            type: { value: 2 },
            title: { value: Title },
            Name: PName.split(`${Title} `)[1],
            Age: Age.split(" ")[0],
            AgeType: { value: Age.split(" ")[1] },
            Gender: { value: gender },
            ContactNo: ContactNo,
            Doctor: { value: DoctorID },
          }));
          setSearchPatient((val) => ({ ...val, value: "", patientDetail: {} }));
        }
      }

      setBodyData([]);
      data?.map((val, index) => {
        addSingleItem(
          String(val?.ItemID),
          // changed by shiv sir
          val?.IssueQuantity || 0,
          val?.stockid || 1,
          val?.PanelID,
          index === data?.length - 1 ? true : false,
          val?.IndentNo,
          val?.draftDetailID,
          val?.patientMedicine
        );
      });
      setModalData({ visible: false });
    } else {
      notify(t("Please Select Atleast One Item"), "error");
      return 0;
    }
  };

  const DraftPharmecyAPI = async () => {
    const payload = DraftPharmecyAPIPayload(
      SearchPatient?.patientDetail,
      bodyData,
      values,
      BindResource
    );
    const apiResp = await DraftPharmecyAPICall(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      setBodyData([]);
      setValues(initialValue);
      setPaymentControlModeState(PAYMENT_OBJECT);
      setPaymentMethod([]);
      setSearchPatient((val) => ({ ...val, ["patientDetail"]: {}, value: "" }));
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const ErrorValidation = () => {
    let errors = {};
    if (!values?.Name) {
      errors.name = t("Name Field Is Required.");
    } else if (!values?.Age) {
      errors.Age = t("Age Field Is Required.");
    } else if (!values?.Gender?.value) {
      errors.Gender = t("Gender Field Is Required.");
    } else if (!values?.ContactNo) {
      errors.ContactNo = t("Contact No. Field Is Required.");
    } else if (!values?.Doctor) {
      errors.Doctor = t("Please Select A doctor.");
    }
    return errors;
  };
  const SavePharmecyAPI = async () => {
    if (selectedPackage?.length > 0 && paymentControlModeState?.netAmount > selectedPackage?.PharmacyAmt) {
      notify("Bill exceeds the allowed package amount", "warn");
      return;
    }
    if (!paymentControlModeState?.DepositedBy) {
      notify("Please Fill Deposited by", "warn");
      return;
    }
    let validationFields = Object.keys(ErrorValidation());
    if (values?.type?.value === 2 && validationFields?.length > 0) {
      notify(ErrorValidation()[validationFields[0]], "error");
      return 0;
    } else if (values?.type?.value === 1) {
      console.log("firstaaa", values);
      if (values?.Doctor?.value === "0") {
        notify(t("Please Select A doctor."), "error");
        return 0;
      } else if (!values?.Panel?.value) {
        notify(t("Please Select A Panel."), "error");
        return 0;
      }
    }

    const hashcode = await bindHashCode();
    let payload = SavePharmecyAPIPayload(
      SearchPatient?.patientDetail,
      hashcode?.data,
      bodyData,
      values,
      BindResource,
      paymentControlModeState,
      paymentMethod,
      selectedPackage
    );
    let apiResp = await SavePharmecyAPICall(payload);
    if (apiResp?.success) {
      const reportResp = await CommonReceiptPdf({
        ledgerTransactionNo: apiResp?.data?.ledTxnID,
        isBill: String(apiResp?.data?.isBill),
        receiptNo: "",
        duplicate: "0",
        type: "PHY",
        supplierID: "",
        billNo:
          apiResp?.data?.isEMGBilling === 1
            ? String(apiResp?.data?.emgBillNO)
            : "",
        isEMGBilling: String(apiResp?.data?.isEMGBilling ? 1 : ""),
        isOnlinePrint: "",
        isRefound: 0,
      });
      setPackageData([]);
      setSelectedPackage([])
      if (reportResp?.success) {
        RedirectURL(reportResp?.data?.pdfUrl);
      } else {
      }

      notify(apiResp?.message, "success");
      setBodyData([]);
      setValues(initialValue);
      setPaymentControlModeState(PAYMENT_OBJECT);
      setPaymentMethod([]);
      setSearchPatient((val) => ({ ...val, ["patientDetail"]: {}, value: "" }));
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const cellCss = (row, value) => {
    return row?.DrugCaregoryColor;
  };
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading isBreadcrumb={true} title={"Pharmacy Issue"} />
          {!Object?.keys(SearchPatient?.patientDetail)?.length && (
            <div className="row pt-2 px-2">
              <ReactSelect
                placeholderName={t("TYPE")}
                id="type"
                inputId="type"
                name="type"
                value={values?.type?.value}
                dynamicOptions={TYPE}
                searchable={true}
                removeIsClearable={true}
                handleChange={(name, e) => {
                  handleReactSelect(name, e);
                }}
                respclass={"col-xl-1 col-md-2 col-sm-4 col-12"}
              />

              {/* Walk in Patient start */}
              {values?.type?.value === 2 && (
                <>
                  <div className="col-xl-2 col-md-4 col-sm-4 col-12 d-flex">
                    <ReactSelect
                      placeholderName={t("Title")}
                      id="title"
                      name="title"
                      removeIsClearable={true}
                      value={values?.title?.value}
                      handleChange={(name, value) => {
                        setValues((val) => ({
                          ...val,
                          [name]: value,
                          Gender:
                            value?.extraColomn !== "UnKnown"
                              ? { value: value?.extraColomn }
                              : "",
                        }));
                      }}
                      dynamicOptions={filterByTypes(
                        CentreWiseCache,
                        [1],
                        ["TypeID"],
                        "TextField",
                        "ValueField",
                        "Department"
                      )}
                      searchable={true}
                      respclass="w-45"
                    />

                    <Input
                      type="text"
                      className="form-control required-fields"
                      inputRef={nameRef}
                      id="Name"
                      name="Name"
                      value={values?.Name ? values?.Name : ""}
                      onChange={handleChange}
                      lable={t("Name")}
                      placeholder=" "
                      respclass="w-75 ml-1"
                    />
                  </div>

                  <div className="col-xl-2 col-md-4 col-sm-4 col-12 d-flex">
                    <Input
                      type="text"
                      className="form-control required-fields"
                      id="Age"
                      name="Age"
                      value={values?.Age ? values?.Age : ""}
                      onChange={(e) => {
                        inputBoxValidation(AMOUNT_REGX(3), e, handleChange);
                      }}
                      lable={t("Age")}
                      placeholder=" "
                      respclass="w-45"
                    />

                    <ReactSelect
                      placeholderName={t("Age Type")}
                      id="AgeType"
                      name="AgeType"
                      value={values?.AgeType?.value}
                      removeIsClearable={true}
                      handleChange={handleReactSelect}
                      dynamicOptions={AGE_TYPE}
                      searchable={true}
                      respclass="w-75 ml-1"
                    />
                  </div>

                  <ReactSelect
                    placeholderName={t("Gender")}
                    id="Gender"
                    name="Gender"
                    value={values?.Gender?.value}
                    isDisabled={
                      values?.Gender === "Male" || values?.Gender === "Female"
                        ? true
                        : false
                    }
                    requiredClassName={`required-fields ${values?.Gender === "Male" || values?.Gender === "Female" ? "disable-focus" : ""}`}
                    removeIsClearable={true}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={filterByTypes(
                      CentreWiseCache,
                      [22],
                      ["TypeID"],
                      "TextField",
                      "ValueField"
                    )}
                    searchable={true}
                    respclass="col-xl-1 col-md-2 col-sm-4 col-12"
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="Address"
                    name="Address"
                    value={values?.Address ? values?.Address : ""}
                    onChange={handleChange}
                    lable={t("Address")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                  />
                  <Input
                    type="text"
                    className="form-control required-fields"
                    id="ContactNo"
                    name="ContactNo"
                    value={values?.ContactNo ? values?.ContactNo : ""}
                    onChange={(e) => {
                      inputBoxValidation(
                        MOBILE_NUMBER_VALIDATION_REGX,
                        e,
                        handleChange
                      );
                    }}
                    lable={t("ContactNo")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                  />

                  <div className="col-xl-2 col-md-6 col-sm-4 col-12">
                    <div className="d-flex">
                      <ReactSelect
                        placeholderName={t("Doctor")}
                        id="Doctor"
                        name="Doctor"
                        value={values?.Doctor?.value}
                        requiredClassName={"required-fields"}
                        handleChange={(name, e) => handleReactSelect(name, e)}
                        dynamicOptions={handleReactSelectDropDownOptions(
                          GetBindReferDoctorList,
                          "NAME",
                          "DoctorID"
                        )}
                        searchable={true}
                        respclass="w-100 pr-2"
                      />
                    </div>
                  </div>
                </>
              )}
              {values?.type?.value === 1 && (
                <div className="col-xl-5 col-md-5 col-sm-8 col-12 ">
                  <SearchItemEassyUI
                    onClick={handleCloseSearchPatient}
                    BindListAPI={getPatientDetail}
                    BindDetails={SearchPatient}
                    Head={BIND_TABLE_OLDPATIENTSEARCH_PHARMECY}
                    customInputRef={searchPatientRef}
                    isSelectFirst={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Registered Patient */}
          {values?.type?.value === 1 &&
            Object.keys(SearchPatient?.patientDetail)?.length > 0 && (
              <>
                <div className="row p-2">
                  <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                    <div className="row">
                      <div className="col-1">
                        <i
                          className="fa fa-search "
                          aria-hidden="true"
                          onClick={handlePatientSearchPage}
                          style={{
                            border: "1px solid #447dd5",
                            padding: "5px 3px",
                            borderRadius: "3px",
                            backgroundColor: "#447dd5",
                            color: "white",
                          }}
                        ></i>
                      </div>
                      <div className="col-11">
                        <LabeledInput
                          label={t("PatientName")}
                          value={SearchPatient?.patientDetail?.PName}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-1 col-md-4 col-sm-6 col-12 ">
                    <LabeledInput
                      className="viewIssue"
                      label={t("UHID")}
                      value={SearchPatient?.patientDetail?.PatientID}
                    />
                  </div>

                  <div className="col-xl-3 col-md-4 col-sm-4 col-12 pb-2 d-flex">
                    <div className="w-xl-50  w-md-100 w-100">
                      <LabeledInput
                        label={t("Age / Gender")}
                        value={SearchPatient?.patientDetail?.AgeGender}
                      />
                    </div>
                    <div className="w-xl-50  w-md-100 w-100 ml-3">
                      <LabeledInput
                        label={t("Address")}
                        value={
                          SearchPatient?.patientDetail?.Address?.length > 10
                            ? SearchPatient?.patientDetail?.Address.substring(
                              0,
                              20
                            ) + ".."
                            : SearchPatient?.patientDetail?.Address
                        }
                      />
                    </div>
                  </div>

                  <div className="col-xl-1 col-md-2 col-sm-4 col-12 pb-2">
                    <LabeledInput
                      label={t("ContactNo")}
                      value={SearchPatient?.patientDetail?.ContactNo}
                    />
                  </div>

                  <ReactSelect
                    placeholderName={t("Doctor")}
                    id="Doctor"
                    name="Doctor"
                    value={values?.Doctor?.value}
                    requiredClassName={"required-fields"}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={handleReactSelectDropDownOptions(
                      mainDoctorList,
                      "Name",
                      "DoctorID"
                    )}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />

                  <ReactSelect
                    placeholderName={t("Panel")}
                    id="Panel"
                    name="Panel"
                    value={values?.Panel?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={panelList}
                    searchable={true}
                    requiredClassName={"required-fields"}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />
                  <ReactSelect
                    placeholderName={t("Dis.Med.")}
                    id="DisMed"
                    name="DisMed"
                    value={values?.DisMed?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={DISMED}
                    removeIsClearable={true}
                    searchable={true}
                    requiredClassName={"required-fields"}
                    respclass="col-xl-1 col-md-2 col-sm-4 col-12"
                  />
                </div>
              </>
            )}
        </div>
      </div>

      {packageData?.length > 0 && (
        <div className="card mt-2">
          <Heading title={t("Package Details")} />
          <Tables
            thead={thead}
            tbody={packageData?.map((item, index) => ({
              select: (
                <Checkbox
                  className="mt-2"
                  disabled={bodyData?.length > 0 ? true : false}
                  checked={selectedPackage?.[0]?.BillNo === item?.BillNo}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      setIsChecked(true)
                      setSelectedPackage([item]);
                      setValues((val) => ({
                        ...val,
                        Doctor: { value: item?.doctorID },
                      }));
                    } else {
                      setIsChecked(false)
                      setSelectedPackage([]);
                      setValues((val) => ({
                        ...val,
                        Doctor: { value: "" },
                      }));
                    }
                  }}
                />
              ),
              Date: item?.BillDATE,
              BillNo: item?.BillNo,
              ReceiptNo: item?.ReceiptNo,
              pType: item?.TYPE,
              ipd: item?.IpdNo ? item?.IpdNo : "-" ,
              PName: item?.PName,
              PackageName: item?.PackageName,
              AmountPaid: item?.AmountPaid,
              NetAmount: item?.NetAmount,
              PharmacyAmt: item?.PharmacyAmt ? item?.PharmacyAmt : "0",
              UtilizePharmacyAmt: item?.UtilizePharmacyAmt
                ? item?.UtilizePharmacyAmt
                : "0",
            }))}
          />
        </div>
      )}

      <div className="patient_registration card mt-2">
        <div className="row p-2 ">
          <ReactSelect
            placeholderName={t("Sell On")}
            id="SellOn"
            name="SellOn"
            value={values?.SellOn?.value}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={SellOnOption}
            searchable={true}
            respclass="col-xl-1 col-md-2 col-sm-4  col-12"
          />

          <ReactSelect
            placeholderName={t("Search By")}
            id="SearchBy"
            name="SearchBy"
            value={values?.SearchBy?.value}
            handleChange={(name, e) => {
              handleReactSelect(name, e);
            }}
            dynamicOptions={SearchByOption}
            removeIsClearable={true}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
          />

          <div className="col-xl-5 col-md-6 col-sm-4 col-12">
            <SearchItemEassyUI
              onClick={hanldeCloseSearchMed}
              BindListAPI={BindListAPI}
              BindDetails={BindDetails}
              Head={BIND_TABLE_BY_MED_FIRST_NAME_PHARMECY}
              customInputRef={MedicineRef}
              cellCss={cellCss}
              selectedPackage={selectedPackage}
              isCashPanel={isCashPanel}
            />
          </div>

          <Input
            type="number"
            inputRef={quantityRef}
            className="form-control required-fields"
            id="Quantity"
            name="Quantity"
            value={values?.Quantity ? values?.Quantity : ""}
            onChange={handleChange}
            onKeyDown={onEnterAddItem}
            lable={t("Quantity")}
            placeholder=" "
            respclass="col-xl-1 col-md-2 col-sm-4  col-12"
          />

          <div className="col-xl-1 col-md-2 col-sm-4 col-4">
            <button
              className="btn  btn-success px-5"
              type="button"
              onClick={AddItem}
            >
              {t("Add")}
            </button>
          </div>
          <div className="col-xl-1 col-md-2 col-sm-4  col-4">
            <button
              className="btn  btn-success px-2"
              type="button"
              onClick={() => {
                handleOpenIndent({
                  label: t("Drafts"),
                  width: "90vw",
                  type: "draft",
                  buttonName: "Add",
                  CallAPI: handleAddIndentItem,
                });
              }}
            >
              {t("Pending Draft")}
            </button>
          </div>
          {console.log("valyes", values)}
          {values?.type?.value === 1 && (
            <div className="col-xl-1 col-md-2 col-sm-4 col-4">
              {SearchPatient?.patientDetail?.PatientType === "OPD" ? (
                <button
                  className="btn btn-sm btn-success "
                  type="button"
                  onClick={() => {
                    handleOpenIndent({
                      label: t("Pending Prescription"),
                      width: "90vw",
                      type: "prescription",
                      buttonName: "Add",
                      CallAPI: handleAddIndentItem,
                    });
                  }}
                >
                  <span className="mr-0">{t("Prescription")}</span>
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-success "
                  type="button"
                  onClick={() => {
                    handleOpenIndent({
                      label: t("Pending Indent`s"),
                      width: "90vw",
                      type: "indent",
                      buttonName: "Add",
                      CallAPI: handleAddIndentItem,
                    });
                  }}
                >
                  <span className="mr-0">{t("Pending Indents")}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <PatientIssueTable
        handleCustomInput={handleCustomInput}
        deleteRowData={deleteRowData}
        tbody={bodyData}
        handleOpenClinicalTrial={handleOpenClinicalTrial}
        ischecked={ischecked}
      />

      <PaymentGateway
        pkgDisable={selectedPackage?.length > 0 ? true : false}
        screenType={paymentControlModeState}
        setScreenType={setPaymentControlModeState}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        discounts={discounts}
        button={
          <div className="d-flex">
            <button className="button" onClick={DraftPharmecyAPI}>
              {t("Draft")}
            </button>
            <button className="button" onClick={SavePharmecyAPI}>
              {t("Bill")}
            </button>
          </div>
        }
      />

      {modalData?.visible && (
        <Modal
          visible={modalData?.visible}
          setVisible={() => {
            setModalData((val) => ({ ...val, visible: false }));
          }}
          modalData={modalData?.modalData}
          modalWidth={modalData?.width}
          Header={modalData?.label}
          buttonType="button"
          buttonName={modalData?.buttonName}
          footer={modalData?.footer}
          handleAPI={modalData?.CallAPI}
        >
          {modalData?.Component}
        </Modal>
      )}
    </>
  );
}
