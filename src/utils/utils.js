import { toast } from "react-toastify";
import { number, ROUNDOFF_VALUE } from "./constant";
import moment from "moment";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { updateFileClosed } from "../networkServices/DoctorApi";
import { pharmecyAddItem } from "../networkServices/pharmecy";
const isMobile = window.innerWidth <= 768;
// const ip = useLocalStorage("ip", "get");
const { pathname } = location;

const ip = localStorage.getItem("ip");
const userData = useLocalStorage("userData", "get");
export const notify = (message, type = "success") => {
  if (type === "success") {
    // toast.success(message,{duration: 70000});
    toast.success(message, { autoClose: 3000 });
  } else if (type === "warn") {
    toast.warn(message, { autoClose: 3000 });
  } else if (type === "error") {
    toast.error(message, { autoClose: 3000 });
  }
};

export const filterByType = (state, type, filterKey, labelKey, valueKey) => {
  if (state?.length)
    return state
      ?.filter((ele) => ele[filterKey] === type)
      ?.map((ele) => {
        return {
          label: ele?.[labelKey],
          value: ele?.[valueKey],
        };
      });
};

export const filterByTypes = (
  data,
  type,
  filterKeys,
  labelKey,
  valueKey,
  extraColomn
) => {
  //
  // ele[filterKeys[0]] === type[0] && ele[filterKeys[1]] === type[1]
  if (data?.length)
    return data
      ?.filter((ele) => {
        return filterKeys?.every((key, index) => {
          return typeof type[index] === "object"
            ? type[index]?.includes(ele[key])
            : ele[key] === type[index];
        });
      })
      ?.map((ele) => {
        return {
          label: ele?.[labelKey],
          value: ele?.[valueKey],
          extraColomn: ele?.[extraColomn],
        };
      });
  else {
    return [];
  }
};

export const BindStateByCountry = (
  state,
  type,
  filterKey,
  labelKey,
  valueKey,
  filterID,
  filterIDKey
) => {
  return state
    ?.filter((ele) => ele[filterKey] === type && ele[filterIDKey] === filterID)
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
      };
    });
};

export const BindDistrictByCountryByState = (
  state,
  type,
  filterKey,
  labelKey,
  valueKey,
  CountryID,
  StateID
) => {
  return state
    ?.filter(
      (ele) =>
        ele[filterKey] === type &&
        ele["StateID"] === parseInt(StateID) &&
        ele["CountryID"] === CountryID
    )
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
      };
    });
};

export const BindCityBystateByDistrict = (
  state,
  type,
  filterKey,
  labelKey,
  valueKey,
  stateID,
  districtID
) => {
  return state
    ?.filter(
      (ele) =>
        ele[filterKey] === type &&
        ele["StateID"] === stateID &&
        ele["DistrictID"] === districtID
    )
    ?.map((ele) => {
      return {
        label: ele?.[labelKey],
        value: ele?.[valueKey],
      };
    });
};

export const handleReactSelectDropDownOptions = (data, labelKey, valueKey) => {
  //
  // console.log("State" , state , labelKey , valueKey)
  const state = data ? data : [];
  return state?.map((ele, index) => {
    if (typeof ele === "object") {
      return {
        ...ele,
        label: ele[labelKey],
        value: ele[valueKey],
      };
    } else {
      return {
        label: ele,
        value: ele,
      };
    }
  });
};

export const WithoutObjecthandleReactSelectDropDownOptions = (state) => {
  return state?.map((ele, index) => {
    return {
      label: ele,
      value: ele,
    };
  });
};

export const ReactSelectisDefaultValue = (state, keyName) => {
  return state?.find((ele) => ele[keyName] === 1);
};

export const isArrayFunction = (params) => {
  return Array.isArray(params) ? params : [];
};

export function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

export const bindLabelValue = (label, value) => {
  //
  return { label: label ? label : " ", value: value ? value : " " };
};

export const handletab = (formRef) => {
  const handleTabKey = (event) => {
    if (event?.target?.type === "button") return false;
    if (event?.target?.type === "submit") return false;
    if (event?.key === "Tab" || event?.key === "Enter") {
      const allFields = Array.from(
        formRef.current.querySelectorAll("input,.custom_save_button")
      );

      let requiredFields = allFields?.filter((el) =>
        el.classList.contains("required-fields")
      );
      let optionalFields = allFields?.filter(
        (el) => !el.classList.contains("required-fields")
      );

      requiredFields = requiredFields?.filter(
        (el) => !el.classList.contains("disable-focus")
      );
      optionalFields = optionalFields?.filter(
        (el) => !el.classList.contains("disable-focus")
      );

      const currentElement = document?.activeElement;
      const currentIndex = allFields?.indexOf(currentElement);
      if (currentIndex !== -1) {
        event.preventDefault();

        let nextElement;

        if (requiredFields.includes(currentElement)) {
          // Move to the next required field
          let nextIndex =
            (requiredFields.indexOf(currentElement) + 1) %
            requiredFields.length;
          nextElement = requiredFields[nextIndex];
        } else {
          // Move to the next optional field
          let nextIndex =
            (optionalFields.indexOf(currentElement) + 1) %
            optionalFields.length;
          nextElement = optionalFields[nextIndex];
        }
        setTimeout(() => {
          if (event?.target?.role) {
            const inputElement = document.getElementById(
              `${event?.target?.id}`
            );
            if (inputElement) {
              inputElement.focus();
            }
          }
          if (nextElement) {
            nextElement.focus();
          }
        }, 100);
      }
    }
  };

  const form = formRef.current;
  form.addEventListener("keydown", handleTabKey);

  // return () => {
  //   form.removeEventListener("keydown", handleTabKey);
  // };
};

export const findSumBillAmount = (data, key) => {
  // ;
  const value = data?.reduce((acc, current) => acc + Number(current[key]), 0);
  return Number(value);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const calculateBillAmount = (
  data,
  isReceipt,
  patientAdvanceAmount,
  refund,
  autoPaymentMode,
  panelAdvanceAmount,
  coPayIsDefault,
  discountIsDefault
) => {
  const returnData = {};
  returnData.panelID = data[0]?.panelID;
  returnData.billAmount = findSumBillAmount(data, "grossAmount").toFixed(
    ROUNDOFF_VALUE
  );
  returnData.discountAmount = findSumBillAmount(data, "discountAmount").toFixed(
    ROUNDOFF_VALUE
  );
  returnData.isReceipt = isReceipt;
  returnData.patientAdvanceAmount = patientAdvanceAmount;
  returnData.autoPaymentMode = autoPaymentMode;
  returnData.minimumPayableAmount = Number(
    findSumBillAmount(data, "PayableAmount")
  ).toFixed(ROUNDOFF_VALUE);
  returnData.panelAdvanceAmount = panelAdvanceAmount;
  returnData.disableDiscount = returnData?.discountAmount > 0 ? true : false;
  returnData.refund = refund;
  returnData.constantMinimumPayableAmount = returnData?.minimumPayableAmount;
  returnData.coPayIsDefault = coPayIsDefault;
  returnData.discountIsDefault = discountIsDefault;
  returnData.discountReason = data[0]?.discountReason;
  returnData.discountApproveBy = data[0]?.discountApproveBy;

  return returnData;
};

export const PAYMENT_MODE_FLAG_ISREFUND = {
  all: 0,
  refund: 1,
  advance: 2,
  settlement: 3,
};

export const opdSettlementPaymentObj = (data) => {
  const returnData = {};
  const pending = Math.abs(data?.PendingAmt);
  returnData.panelID = data?.PanelID;
  returnData.grossAmount = pending;
  returnData.discountAmount = 0;
  returnData.PayableAmount = pending;
  returnData.minimumPayableAmount = pending;
  returnData.isRefund =
    data?.PendingAmt >= 0
      ? PAYMENT_MODE_FLAG_ISREFUND["settlement"]
      : PAYMENT_MODE_FLAG_ISREFUND["refund"];
  returnData.discountReason = "";
  returnData.discountApproveBy = "";
  return returnData;
};

export const parseSubCategoryString = (dataString) => {
  // Ensure dataString is a string
  // if (typeof dataString !== 'string') {
  //   return {};
  // }

  // Remove the curly braces and split by comma
  const parts = dataString.replace(/[{}]/g, "").split(", ");

  // Convert to key-value pairs
  const dataObject = {};
  parts.forEach((part) => {
    const [key, value] = part.split(" = ");
    if (key && value) {
      dataObject[key.trim()] = value.trim();
    }
  });

  return dataObject;
};

export const reactSelectOptionList = (data, labelKey, valueKey) => {
  return data?.map((ele) => {
    return {
      label: ele?.[labelKey],
      value: ele?.[valueKey],
    };
  });
};

export const AddInvestigation = (data) => {
  return {
    autoCompleteItemName: data?.Typename, //1
    item_ID: data?.ItemID,
    isadvance: data?.isadvance,
    isOutSource: data?.IsOutSource,
    itemCode: data?.ItemCode,
    type_ID: data?.Type_id, //2
    labType: data?.LabType,
    tnxType: data?.TnxType,
    subCategoryID: data?.SubCategoryID,
    sample: data?.Sample,
    typeName: data?.Typename, //3
    rateEditable: 0,
    isMobileBooking: 0,
    categoryid: data?.CategoryID,
    subCategory: data?.SubCategory,
    isSlotWisetoken: 0,
    appointmentID: data?.App_ID ? data?.App_ID : 0,
    gstType: data?.GstType, //4
    iGSTPercent: data?.IGSTPercent, //5
    cGSTPercent: data?.CGSTPercent, //6
    sGSTPercent: data?.SGSTPercent, //7
    gstPer: data?.GstPer, //8
    DoctorID: data?.DoctorID,
  };
};

export const removeBase64Data = (base64Img) => {
  // const prefixPattern = /^data:image\/[a-zA-Z]+;base64,/;
  const prefixPattern =
    /^data:(image\/[a-zA-Z]+|application\/pdf|audio\/[a-zA-Z]+|video\/[a-zA-Z]+|text\/[a-zA-Z]+|application\/[a-zA-Z]+);base64,/;
  return base64Img?.replace(prefixPattern, "");
};

export const inputBoxValidation = (regx, e, handleChange) => {
  const { value } = e.target;
  if (regx?.test(value)) {
    handleChange(e);
    return e;
  }
};

export const ageValidation = (regx, e, handleChange, AgeType) => {
  const { value } = e.target;
  if (AgeType === "YRS") {
    if (parseInt(value?.split(".")[1]) > 11) return false;
    if (regx?.test(value)) {
      handleChange(e);
    }
  } else if (AgeType === "MONTH(S)") {
    if (parseInt(value?.split(".")[1]) > 30) return false;
    if (parseInt(value) > 11) return false;
    if (regx?.test(value)) {
      handleChange(e);
    }
  } else if (AgeType === "DAYS(S)") {
    if (parseInt(value) > 30) return false;
    if (regx?.test(value)) {
      handleChange(e);
    }
  }
};

export const Register_Patient_TypeCasting = (
  relations,
  values,
  panelBodyData,
  isUpdate,
  panelDocumentData
) => {
  console.log("values?.documentIds", values?.documentIds);

  let requestBodyData = {};
  let patientMaster = {};
  let policyDetail = [];
  let documentIds = [];
  debugger
  values?.documentIds?.length > 0 &&
    values?.documentIds?.map((val) => {
      let obj = {};
      obj.idProofID = val?.name?.value ? val?.name?.value?.split("#")[0] : "";
      obj.idProofName = val?.name?.label;
      obj.idProofNumber = val?.id;
      documentIds.push(obj);
    });

  let documentsList = [];
  values?.documentsList?.length > 0 &&
    values?.documentsList?.map((val, _) => {
      if (val?.image) {
        let obj = {};
        obj.patientDocument = removeBase64Data(val?.image);
        obj.documentID = val?.DocumentID;
        documentsList.push(obj);
      }
    });
  let panelDocumentList = [];
  panelDocumentData?.length > 0 &&
    panelDocumentData?.map((val, _) => {
      if (val?.panelDocumentViewList?.length > 0) {
        val?.panelDocumentViewList?.map((subValue, subIndex) => {
          if (subValue?.image) {
            let obj = {
              panelDocument: removeBase64Data(subValue?.image),
              panelDocumentID: subValue?.DocumentID,
              panelID: val?.panelID,
            };
            panelDocumentList.push(obj);
          }
        });
      }
    });

  panelBodyData?.length > 0 &&
    panelBodyData?.map((val) => {
      let obj = {};
      obj.policyNo = val?.PolicyNo ?? "";
      obj.policyExpiry = val?.PolicyExpiry
        ? moment(val?.PolicyExpiry, "DD-MM-YYYY").format("YYYY-MM-DD")
        : "0001-01-01";
      obj.patientType = "OPD";
      obj.panel_ID = val?.PanelName?.value
        ? parseInt(val?.PanelName?.value)
        : 0;
      obj.pharmacyCreditLimitPercent = 0;
      obj.remarks = val?.ApprovalRemarks ?? "";
      obj.panelGroupID = parseInt(val?.PanelGroup?.value) ?? 0;
      obj.parentPanelID = parseInt(val?.ParentPanel?.value) ?? 0;
      obj.panelCroporateID = parseInt(val?.CorporareName?.value) ?? 0;
      obj.policyCardNo = val?.PolicyCardNo ?? "";
      obj.panelCardName = val?.PanelCardName ?? "";
      obj.polciyCardHolderRelation = val?.CardHolder?.value ?? "";
      obj.approvalAmount = val?.ApprovalAmount
        ? parseFloat(val?.ApprovalAmount)
        : 0.0;
      obj.approvalRemarks = val?.ApprovalRemarks ?? "";
      obj.isDefaultPanel = 0;
      policyDetail.push(obj);
    });
  patientMaster.patientID = isUpdate ? values?.Barcode : "";
  patientMaster.oldPatientID = "";
  patientMaster.title = values?.Title?.value
    ? values?.Title?.value
    : values?.Title ?? "";
  patientMaster.pFirstName = values?.PFirstName ?? "";
  patientMaster.pLastName = values?.PLastName ?? "";
  patientMaster.pName = `${values?.PFirstName ? values?.PFirstName : ""} ${values?.PLastName ? values?.PLastName : ""}`;
  patientMaster.age = `${values?.Age ? values?.Age : ""} ${values?.AgeType?.value ? values?.AgeType?.value : values?.AgeType ? values?.AgeType : ""}`;
  patientMaster.dob = values?.DOB
    ? moment(values?.DOB).format("YYYY-MM-DD")
    : "0001-01-01";
  patientMaster.gender = values?.Gender?.value
    ? values?.Gender?.value
    : values?.Gender ?? "";
  patientMaster.panelID = values?.PanelName?.value
    ? values?.PanelName?.value
    : 1;
  patientMaster.source = values?.source?.value ? values?.source?.value : "OPD";
  patientMaster.maritalStatus = values?.MaritalStatus?.value
    ? values?.MaritalStatus?.value
    : values?.MaritalStatus ?? "";
  patientMaster.mobile = values?.Mobile ?? "";
  patientMaster.email = values?.Email ?? "";
  patientMaster.patientRelationData = relations?.map((val) => {
    return {
      relationOf: val?.Relation,
      relationName: val?.RelationName,
      relationPhoneNo: val?.RelationPhone,
      isPersonal: val?.isPersonal ? 1 : 0,
    };
  });
  patientMaster.relation = values?.Relation?.value
    ? values?.Relation?.value
    : values?.Relation ?? "Self";
  patientMaster.relationName = values?.RelationName ?? "";
  patientMaster.relationPhoneNo = values?.RelationPhoneNo ?? "";

  patientMaster.house_No = values?.House_No ?? "";
  patientMaster.country = values?.countryID?.label
    ? values?.countryID?.label
    : values?.Country ?? "";
  patientMaster.countryID = values?.countryID?.value
    ? parseInt(values?.countryID?.value)
    : parseInt(values?.countryID) ?? 0;
  patientMaster.state = values?.StateID?.label
    ? values?.StateID?.label
    : values?.State ?? "";
  patientMaster.stateID = values?.StateID?.value
    ? parseInt(values?.StateID?.value)
    : parseInt(values?.StateID) ?? 0;
  patientMaster.district = values?.districtID?.label
    ? values?.districtID?.label
    : values?.District ?? "";
  patientMaster.districtID = values?.districtID?.value
    ? parseInt(values?.districtID?.value)
    : parseInt(values?.districtID) ?? 0;
  patientMaster.city = values?.cityID?.label
    ? values?.cityID?.label
    : values?.City ?? "";
  patientMaster.cityID = values?.cityID?.value
    ? parseInt(values?.cityID?.value)
    : parseInt(values?.cityID) ?? 0;
  patientMaster.taluka = "";
  patientMaster.talukaID = 0;
  patientMaster.place = values?.Place ?? "";
  patientMaster.landMark = "";
  patientMaster.occupation = "";
  patientMaster.base64PatientProfilePic = "";
  patientMaster.hospPatientType = values?.HospPatientType?.label
    ? values?.HospPatientType?.label
    : values?.HospPatientType?.toString() ?? "";
  patientMaster.patientType = values?.HospPatientType?.label
    ? values?.HospPatientType?.label
    : values?.patientType ?? "SELF";
  patientMaster.employeeReferenceID = values?.EmployeeReferenceID
    ? values?.EmployeeReferenceID
    : "";
  patientMaster.typeOfReference = values?.TypeOfReference?.value
    ? values?.TypeOfReference?.value
    : values?.TypeOfReference ?? "";

  patientMaster.patientTypeID = values?.HospPatientType?.value
    ? parseInt(values?.HospPatientType?.value)
    : parseInt(values?.HospPatientType)
      ? parseInt(values?.HospPatientType)
      : 0;
  patientMaster.patientIDProofs = documentIds ?? [];
  patientMaster.feesPaid = 0;
  patientMaster.religion = values?.Religion?.value
    ? values?.Religion?.value
    : values?.Religion ?? "";
  patientMaster.emergencyPhoneNo = values?.EmergencyPhoneNo ?? "";
  patientMaster.emergencyRelationOf = values?.EmergencyRelationOf?.value
    ? values?.EmergencyRelationOf?.value
    : values?.EmergencyRelationOf ?? "";
  patientMaster.emergencyFirstName = values?.EmergencyFirstName ?? "";
  patientMaster.emergencySecondName = values?.EmergencySecondName ?? "";
  patientMaster.emergencyAddress = values?.EmergencyAddress ?? "";
  patientMaster.placeOfBirth = values?.placeofBirth ?? "";
  patientMaster.occupation = values?.occupation ?? "";

  patientMaster.identificationMark = values?.IdentificationMark ?? "";
  patientMaster.identificationMarkSecond =
    values?.IdentificationMarkSecond ?? "";
  patientMaster.mlC_NO = values?.MLC_NO ?? "";
  patientMaster.mlC_Type = values?.MLC_Type
    ? values?.MLC_Type?.label
    : values?.MLC_Type ?? "";
  patientMaster.isInternational = values?.IsInternational?.value
    ? parseInt(values?.IsInternational?.value)
    : parseInt(values?.IsInternational) ?? 2;
  patientMaster.overSeaNumber = values?.InternationalNumber ?? "";
  patientMaster.passport_No = values?.Passport_No ?? "";
  patientMaster.ethenicGroup = "";
  patientMaster.isTranslatorRequired = "0";
  patientMaster.facialStatus = "";
  patientMaster.race = "";
  patientMaster.employement = "";
  patientMaster.monthlyIncome = 0;
  patientMaster.parmanentAddress = values?.parmanentAddress ?? "";
  patientMaster.languageSpoken = "";
  patientMaster.phoneSTDCODE = values?.Phone_STDCODE ?? "";
  patientMaster.residentialNumberSTDCODE =
    values?.ResidentialNumber_STDCODE ?? "";
  patientMaster.phone = values?.Phone ?? "";
  patientMaster.residentialNumber = values?.ResidentialNumber ?? "";
  patientMaster.locality = values?.Place ?? "";
  patientMaster.internationalCountryID = values?.InternationalCountryID?.value
    ? parseInt(values?.InternationalCountryID?.value)
    : parseInt(values?.InternationalCountryID)
      ? parseInt(values?.InternationalCountryID)
      : 0;
  patientMaster.internationalCountry = values?.InternationalCountryID?.label
    ? values?.InternationalCountryID?.label
    : values?.InternationalCountry ?? "";
  patientMaster.internationalNumber = values?.InternationalNumber ?? "";
  patientMaster.remark = "";
  patientMaster.ipAddress = ip;
  patientMaster.languageSpoken = "";
  patientMaster.patPhoto = values?.profileImage ? values?.profileImage : "";
  patientMaster.membership = values?.MemberShipCardNo
    ? values?.MemberShipCardNo
    : "";

  if (isUpdate) requestBodyData.emergencyNotify = "";
  if (isUpdate)
    requestBodyData.updateReasonRemarks = values?.updateReasonRemarks
      ? values?.updateReasonRemarks
      : "";
  if (isUpdate) requestBodyData.emergencyAddress = "";
  if (isUpdate) requestBodyData.emergencyAddressPhoneNo = "";
  if (isUpdate) requestBodyData.emergencyRelationShip = "";

  requestBodyData.patientMaster = patientMaster;
  requestBodyData.policyDetail = policyDetail;
  requestBodyData.patPhoto = values?.profileImage ? values?.profileImage : ""
    ? removeBase64Data(values?.profileImage)
    : "";
  requestBodyData.patDocument = documentsList;
  // requestBodyData.panelDocument = panelDocumentList;

  return requestBodyData;
};

export const payloadSettlerForPaymentGateWay = (paymentMethod, values, paymentControlModeState) => {
// export const payloadSettlerForPaymentGateWay = (paymentMethod, values, Remark) => {
  console.log("remaksssssssssssssssssss",Remark)
debugger
  const resultData = [];

  for (let i = 0; i < paymentMethod.length; i++) {
    debugger
    const {
      Amount,
      BankName,
      BaseCurrency,
      C_Factor,
      PaymentMode,
      PaymentModeID,
      PaymentRemarks,
      RefNo,
      S_Amount,
      S_CountryID,
      S_Currency,
      S_Notation,
      swipeMachine,
    } = paymentMethod[i];

    const data = {
      paymentModeID: Number(PaymentModeID),
      paymentMode: String(PaymentMode),
      amount: Number(Amount),
      // paymentRemarks: Remark ? String(Remark) : "",
      paymentRemarks: paymentControlModeState?.Remark ? String(paymentControlModeState?.Remark) : "",
      refNo: String(RefNo),
      bankName: String(BankName),
      c_Factor: Number(C_Factor),
      s_Amount: Number(S_Amount),
      s_CountryID: Number(S_CountryID),
      s_Currency: String(S_Currency),
      s_Notation: String(S_Notation),
      currencyRoundOff: 0,
      swipeMachine: String(swipeMachine),
      // {

      "isCMRFundAdvance": Number(values?.AdvanceType?.value ? values?.AdvanceType?.value : 0),
      "goNumber": String(values?.GoNumber ? values?.GoNumber : ""),
      "goDate": moment(values?.goDate).format("YYYY-MM-DD"),
      "igrsNumber": String(values?.IGRSNumber ? values?.IGRSNumber : ""),
      "estimateNo": String(values?.EstiMateNumber ? values?.EstiMateNumber : ""),
      // }
    };

    resultData.push(data);
  }

  return resultData;
};

export const payloadVitalSignChart = (payload) => {
  let obj = {
    id: payload?.ID ? payload?.ID : 0,
    date: moment(payload?.DATE).format("yyyy-MM-DD"),
    time: moment(payload?.Time).format("HH:mm"),
    temp: payload?.Temp ?? "",
    pulse: payload?.pulse ?? "",
    resp: payload?.resp ?? "",
    bp: payload?.BP ?? "",
    wound: payload?.wound ?? "",
    drains: payload?.drains ?? "",
    comments: payload?.Comments ?? "",
    transactionID: payload?.transactionID ?? "",
    patientID: payload?.patientID ?? "",
    isActive: true,
    bloodSugar: payload?.BloodSugar ?? "",
    weight: payload?.Weight ?? "",
    oxygen: payload?.SPO2 ?? "",
    pod: payload?.POD ?? "",
    height: payload?.Height ?? "",
    bmi: payload?.BMI ?? "",
    bsa: payload?.BSA ?? "",
  };
  return obj;
};

export const timeFormateDate = (time) => {
  const date = new Date();
  if (time) {
    const [hours, minutes, period] = time
      .match(/(\d+):(\d+)\s*(AM|PM)/i)
      .slice(1);
    date.setHours(
      period === "PM" && hours !== "12"
        ? +hours + 12
        : hours === "12" && period === "AM"
          ? 0
          : +hours
    );
    date.setMinutes(+minutes);
  }
  return date;
};

export const payloadDiscountOPD = (paymentControlModeState) => {
  const {
    discountAmount,
    refund,
    roundOff,
    netAmount,
    paidAmount,
    discountPercentage,
    discountReason,
    discountApproveBy,
    hashcode,
  } = paymentControlModeState;

  const data = {
    netAmount: Number(netAmount),
    discountReason: String(discountReason),
    discountApproveBy: String(discountApproveBy),
    discountOnTotal: Number(discountAmount),
    roundOff: Number(roundOff),
    adjustment: Number(paidAmount),
    paymentModeID: 0,
    discAmt: Number(discountAmount),
    discountPercentage: Number(discountPercentage),
    amount: 0,
  };

  const otherData = {
    hashCode: hashcode,
    amountPaid: String(paidAmount),
    patientID: String(paymentControlModeState?.PatientID),
    transactionID: String(paymentControlModeState?.TransactionID),
    ledgerTranNo: String(paymentControlModeState?.LedgerTransactionNo),
    naration: String(paymentControlModeState?.Remark), //remarks payment
    panelID: Number(paymentControlModeState?.PanelID),
    isRefund: String(refund) === "1" ? "1" : "0",
    netAmount: String(netAmount),
    advanceAmt: Number(paymentControlModeState?.AdvanceAmount),
    typeOfTnx: String(paymentControlModeState?.TypeOfTnx),
    feePaid: String(paymentControlModeState?.FeesPaid),
    isNewPatient: Number(paymentControlModeState?.IsNewPatient),
    centreId: Number(paymentControlModeState?.CentreID),
    ipAddress: ip,
  };

  return {
    dataOPDDiscount: [data],
    ...otherData,
  };
};

export const saveOPDAdvancePayload = (payload) => {
  console.log("payload", payload);
  const {
    PatientID,
    HospPatientType,
    paidAmount,
    hashcode,
    refund,
    ReasonID,
    DoctorID_Self,
    Age,
    PatientTypeID,
  } = payload;

  const data = {
    patientID: String(PatientID),
    hospPatientType: String(HospPatientType),
    advAmount: Number(paidAmount),
    uhashCode: String(hashcode),
    type: String(refund) === "1" ? "2" : "1",
    isAdvanceRoomBookingAmount: 0,
    advanceBookingId: 0,
    advanceReason: String(ReasonID?.label ?? ""),
    doctorID: String(
      payload?.Doctor?.DoctorID ? payload?.Doctor?.DoctorID : payload?.DoctorID
    ),
    // doctorID: String(DoctorID_Self),
    ipAddress: ip,
    age: String(Age),
    patientType_ID: Number(PatientTypeID),
  };

  return data;
};

export const handleSaveCreditDebitDetailsPayload = (payload) => {
  console.log(payload);

  const resultData = [];

  for (let i = 0; i < payload?.length; i++) {
    const {
      crdrNoteType,
      TransactionID,
      CreditAmt,
      panelID,
      Narration,
      ItemID,
      ItemName,
      Type,
      ID,
      LedgerTransactionNo,
      NetAmount,
    } = payload[i];

    const data = {
      crdr: ["1", "2"].includes(String(crdrNoteType?.value)) ? "CR" : "DR",
      transactionID: String(TransactionID),
      amount: Number(CreditAmt),
      ptTYPE: ["1"].includes(String(panelID?.value)) ? "PTNT" : "PAN",
      narration: String(Narration),
      itemID: String(ItemID),
      itemName: String(ItemName),
      type: String(Type),
      ledgerTnxID: Number(ID),
      ledgerTransactionNo: Number(LedgerTransactionNo),
      panelID: Number(panelID?.value),
      crdrNoteType: Number(crdrNoteType?.value),
      rate: Number(NetAmount),
      isDocCollect: 0,
      docCollectAmt: 0,
    };

    resultData.push(data);
  }

  return {
    creditDebitDetails: resultData,
  };
};

// export const handleSaveEstimateCostPayload = (payload) => {
//   console.log(payload);

//   const resultData = [];

//   for (let i = 0; i < payload?.length; i++) {
//     const {
//       crdrNoteType,
//       TransactionID,
//       CreditAmt,
//       panelID,
//       Narration,
//       ItemID,
//       ItemName,
//       Type,
//       ID,
//       LedgerTransactionNo,
//       NetAmount,
//     } = payload[i];

//     const data = {
//       crdr: ["1", "2"].includes(String(crdrNoteType?.value)) ? "CR" : "DR",
//       transactionID: String(TransactionID),
//       amount: Number(CreditAmt),
//       ptTYPE: ["1"].includes(String(panelID?.value)) ? "PTNT" : "PAN",
//       narration: String(Narration),
//       itemID: String(ItemID),
//       itemName: String(ItemName),
//       type: String(Type),
//       ledgerTnxID: Number(ID),
//       ledgerTransactionNo: Number(LedgerTransactionNo),
//       panelID: Number(panelID?.value),
//       crdrNoteType: Number(crdrNoteType?.value),
//       rate: Number(NetAmount),
//       isDocCollect: 0,
//       docCollectAmt: 0,
//     };

//     resultData.push(data);
//   }

//   return {
//     creditDebitDetails: resultData,
//   };
// };

const bookingDateAndTime = (AppointedDateTime) => {
  if (AppointedDateTime) {
    const datetime = AppointedDateTime.split("#");
    return {
      bookingDate: datetime[0],
      bookingTime: datetime[1],
    };
  } else {
    return {
      bookingDate: "0001-01-01",
      bookingTime: "00:00:00-00:00:00",
    };
  }
};

const ValidationOfOPDBookingSave = (ltd, paymentDetail, pmh) => {
  let response = {
    message: "",
    status: "",
  };

  if (!Number(pmh[0]?.doctorID)) {
    response.message = "Please Select Main Doctor";
    response.status = "error";

    return response;
  }

  console.log("ltdltdltd", ltd);
  // ltd validation

  if (ltd.length === 0) {
    response.message = "Please Add Atleast One Item";
    response.status = "error";
    return response;
  }

  if (
    ltd.some(
      (ele) =>
        Number(ele.rate) === 0 &&
        Number(ele?.isPackage) === 0 &&
        ele?.categoryID !== "1"
    )
  ) {
    response.message = "Zero Rate Items Are Not Allow";
    response.status = "error";

    return response;
  }

  if (
    ltd.some(
      (ele) => Number(ele.TnxTypeID) === 5 && ele?.appointmentDateTime === ""
    )
  ) {
    response.message = "Please Select Slot";
    response.status = "error";

    return response;
  }

  console.log("ltdltd", ltd);
  if (
    ltd.some((ele) =>
      ["0", ""].includes(String(ele.doctorID)) && Number(ele?.isPackage) === 0
        ? Number(ele?.tnxTypeID) !== 23
        : false
    )
  ) {
    response.message = "Please Select Performing Doctor";
    response.status = "error";

    return response;
  }

  if (
    ltd.some(
      (ele) =>
        String(ele?.tnxTypeID) === "5" &&
        Number(ele?.isPackage) === 0 &&
        String(ele?.appointmentDateTime) === "" &&
        Number(ele?.appointmentID) === 0
    )
  ) {
    response.message = "Please Select Doctor Appointment Slot";
    response.status = "error";

    return response;
  }

  if (ltd.every((ele) => Number(ele?.quantity) < 1)) {
    response.message = "Please Enter Valid Quantity";
    response.status = "error";

    return response;
  }

  // paymentMode Validation

  if (paymentDetail.length === 0) {
    response.message = "Please Add Atleast One Payment Mode";
    response.status = "error";

    return response;
  }

  // pmh validation;

  if (Number(pmh[0]?.patientPaybleAmt) > Number(pmh[0]?.patientPaidAmt)) {
    response.message = "Partial Payment Not Allowed";
    response.status = "error";

    return response;
  }

  if (Number(pmh[0]?.patientPaybleAmt) < Number(pmh[0]?.patientPaidAmt)) {
    response.message = "Can Not Collect More Than The PatientPayable Amount";
    response.status = "error";

    return response;
  }

  response = {};

  return response;
};

export const OPDServiceBookingPayload = (
  singlePatientData,
  payloadData,
  hashcode,
  testAddingTableState,
  paymentControlModeState,
  paymentMethod,
  pathname,
  selectedRelations,
  AppointmentFormattedString
) => {
  debugger
  const {
    PatientID,
    patientType,
    PatientTypeID,
    Relation,
    RelationName,
    RelationPhoneNo,
  } = singlePatientData;
  const { DoctorID, panelID, referDoctorID, proId, referalTypeID, MLC } =
    payloadData;
  const { ScheduleChargeID } = testAddingTableState[0];
  const {
    panelPayable,
    minimumPayableAmount,
    paidAmount,
    netAmount,
    billAmount,
    discountReason,
    discountApproveBy,
    discountAmount,
    roundOff,
    disableDiscount,
    DepositedBy,
    ReceivedFrom,
    DiscountReasons1,
    Remark,
  } = paymentControlModeState;

  const pmh = {
    patientID: String(PatientID),
      mobileNo:String(payloadData?.contactNo?payloadData?.contactNo:singlePatientData?.Mobile),
    doctorID: String(DoctorID),
    patient_type: String(patientType),
    purpose: "",
    panelID: Number(panelID?.PanelID),
    parentID:
      Number(panelID?.ParentPanelID) === 0
        ? Number(panelID?.PanelID)
        : Number(panelID?.ParentPanelID),
    referedBy: String(referDoctorID),
    hashCode: String(hashcode),
    scheduleChargeID: Number(ScheduleChargeID),
    patientTypeID: Number(PatientTypeID),
    panelPaybleAmt: Number(panelPayable),
    patientPaybleAmt: Number(minimumPayableAmount),
    panelPaidAmt: 0, // pyment mode id 8 base amount
    patientPaidAmt: Number(paidAmount) - Number(0),
    kinRelation: String(Relation),
    kinName: String(RelationName),
    kinPhone: String(RelationPhoneNo),
    cardNo: String(panelID?.PolicyCardNo),
    policyNo: String(panelID?.PolicyNo),
    expiryDate:
      String(panelID?.PolicyExpiry) === ""
        ? "0001-01-01"
        : String(panelID?.PolicyExpiry),
    cardHolderName: String(panelID?.PanelCardName),
    relationWith_holder: String(panelID?.PolciyCardHolderRelation),
    panelIgnoreReason: "",
    proId: Number(proId),
    isVisitClose: 1,
    typeOfReference: String(referalTypeID?.label),
    patient_Income: "0",
    occupation: "",
    education: "",
    triagingCode: 0,
    corporatePanelID: Number(panelID?.PanelCroporateID),
    referralTypeID: Number(referalTypeID?.value),
    occupationId: "0",
    educationID: "0",
    mlc: MLC ? Number(MLC) : 0,
  };

  const lt = {
    netAmount: Number(netAmount),
    grossAmount: Number(billAmount),
    discountType: String(discountReason ? discountReason : ""),
    discountReason: String(DiscountReasons1 ? DiscountReasons1 : ""),
    discountApproveBy: String(
      discountApproveBy?.label ? discountApproveBy?.label : ""
    ),
    discountOnTotal: Number(discountAmount),
    roundOff: Number(roundOff),
    uniqueHash: String(hashcode ? hashcode : ""),
    ipAddress: ip,
    adjustment: Number(paidAmount),
    govTaxPer: 0,
    govTaxAmount: 0,
    ipNo: "",
    fieldBoyID: 0,
    ReceivedFrom: ReceivedFrom,
    DepositedBy: DepositedBy,
  };

  const prh = selectedRelations?.map((val) => ({
    patientID: String(PatientID),
    relationOf: val?.RelationOf,
    relationName: val?.RelationName,
    relationPhone: String(val?.RelationPhoneNo),
  }));

  const ltd = [];
  const pt = [];

  for (let i = 0; i < testAddingTableState.length; i++) {
    const {
      ItemDisplayName,
      LabType,
      Type_ID,
      TnxTypeID,
      DoctorID,
      SubCategoryID,
      amount,
      Rate,
      defaultQty,
      discountAmount,
      salesID,
      val,
      ID,
      coPaymentPercent,
      IsPayable,
      IsPanelWiseDiscount,
      ItemCode,
      sampleType,
      CategoryID,
      AppointedDateTime,
      IsOutSource,
      GstType,
      ModalityID,
      appointmentID,
      GSTAmount,
      isMobileBooking,
      GstPer,
      typeOfApp,
      isSlotWiseToken,
      discountPercentage,
      presribedID,
      isUrgent,
      PackageTable,
      IsByPassDoctorSlot,
    } = testAddingTableState[i];

    const { bookingDate, bookingTime } = bookingDateAndTime(AppointedDateTime);
    debugger;
    const data = {
      itemName: String(ItemDisplayName),
      type: String(LabType),
      type_ID: String(Type_ID),
      doctorID:
        String(TnxTypeID) === "5"
          ? String(Type_ID)
          : String(DoctorID === "" ? "0" : DoctorID),
      subCategoryID: String(SubCategoryID),
      amount: Number(amount),
      rate: Number(Rate),
      quantity: Number(defaultQty),
      discountPercentage: Number(discountPercentage),
      discAmt: Number(discountAmount),
      docCollectAmt: 0,
      salesID: String(salesID),
      itemID: String(val),
      isPackage: 0,
      packageID: "0",
      discountReason: Number(discountAmount) > 0 ? String(discountReason) : "",
      tnxTypeID: TnxTypeID ? Number(TnxTypeID) : 0,
      rateListID: Number(ID),
      roundOff: 0,
      coPayPercent: Number(coPaymentPercent),
      isPayable: Number(IsPayable),
      isPanelWiseDisc: Number(IsPanelWiseDiscount),
      panelCurrencyCountryID: Number(panelID?.panelCurrencyCountryID),
      panelCurrencyFactor: Number(panelID?.panelCurrencyFactor),
      rateItemCode: String(ItemCode),
      sampleType: String(sampleType),
      categoryID: String(CategoryID),
      bookingDate: String(bookingDate),
      bookingTime: String(bookingTime),
      bookinginModality: ModalityID ? Number(ModalityID) : 0,
      appointmentNo: 0,
      isOutSource: Number(IsOutSource),
      gstType: String(GstType),
      igstPercent: Number(GstPer) ?? 0,
      igstAmt: String(GstType) === "IGST" ? Number(GSTAmount) : 0,
      cgstPercent: Number(GstPer) ? Number(GstPer / 2) : 0,
      cgstAmt: String(GstType) !== "IGST" ? Number(GSTAmount / 2) : 0,
      sgstPercent: Number(GstPer) ? Number(GstPer / 2) : 0,
      sgstAmt: String(GstType) !== "IGST" ? Number(GSTAmount / 2) : 0,
      typeOfApp: String(typeOfApp),
      remark: Remark, //remark
      isMobileBooking: Number(isMobileBooking),
      appointmentID: Number(appointmentID ? appointmentID : 0),
      isSlotWiseToken: Number(isSlotWiseToken),
      appointmentDateTime:
        IsByPassDoctorSlot === 1
          ? AppointmentFormattedString
          : AppointedDateTime
            ? String(AppointedDateTime)
            : "",
      isDocCollect: 0,
      isAdvance: 0,
      packageType: 0,
      investigation_ID: String(Type_ID),
    };

    ltd.push(data);

    for (let j = 0; j < PackageTable.length; j++) {
      // for (let j = 0; j < PackageTable.length; j++) {
      const {
        PackageType,
        Quantity,
        SubCategoryID,
        ItemID,
        Investigation_Id,
        IsOutSource,
        Item,
        DoctorID,
        Sample,
        CategoryID,
        AppointedDateTime,
        ModalityID,
        IsSlotWiseToken,
        PackageID,
        DoctorName,
      } = PackageTable[j];

      const { bookingDate, bookingTime } =
        bookingDateAndTime(AppointedDateTime);

      if (Number(PackageType) === 1) {
        // non-consulation
        const itemDetails = {
          itemName: String(Item), // not found
          type: String(""),
          type_ID: String(Investigation_Id),
          doctorID: String(DoctorID),
          subCategoryID: String(SubCategoryID),
          amount: Number(0),
          rate: Number(0),
          quantity: Number(Quantity),
          discountPercentage: Number(0),
          discAmt: Number(0),
          docCollectAmt: 0,
          salesID: String("0"),
          itemID: String(ItemID),
          isPackage: 1,
          packageID: String(PackageID),
          discountReason: String(""),
          tnxTypeID: Number(23),
          rateListID: Number(0),
          roundOff: 0,
          coPayPercent: Number(0),
          isPayable: Number(0),
          isPanelWiseDisc: Number(0),
          panelCurrencyCountryID: Number(panelID?.panelCurrencyCountryID),
          panelCurrencyFactor: Number(panelID?.panelCurrencyFactor),
          rateItemCode: String(""),
          sampleType: String(Sample),
          categoryID: String(CategoryID),
          bookingDate: String(bookingDate),
          bookingTime: String(bookingTime),
          bookinginModality: ModalityID ? Number(ModalityID) : 0,
          appointmentNo: 0,
          isOutSource: Number(IsOutSource),
          gstType: String(""),
          igstPercent: Number(0) ?? 0,
          igstAmt: Number(0),
          cgstPercent: Number(0),
          cgstAmt: Number(0),
          sgstPercent: Number(0),
          sgstAmt: Number(0),
          typeOfApp: String("0"),
          remark: String(""), //remark
          isMobileBooking: Number(0),
          appointmentID: Number(0),
          isSlotWiseToken: Number(IsSlotWiseToken),
          appointmentDateTime: AppointedDateTime
            ? String(AppointedDateTime)
            : "",
          isDocCollect: 0,
          isAdvance: 0,
          packageType: 1,
          investigation_ID: String(Investigation_Id),
        };

        ltd.push(itemDetails);
      }

      if (Number(PackageType) === 2) {
        // consulation
        const itemDetails = {
          // itemName: String(DoctorName), // not found
          itemName: String(Item), // not found
          type: String(""),
          type_ID: String(Investigation_Id),
          doctorID: String(Investigation_Id),
          // doctorID: String(DoctorID?DoctorID:""),
          subCategoryID: String(SubCategoryID),
          amount: Number(0),
          rate: Number(0),
          quantity: Number(Quantity),
          discountPercentage: Number(0),
          discAmt: Number(0),
          docCollectAmt: 0,
          salesID: String("0"),
          itemID: String(ItemID),
          isPackage: 1,
          packageID: String(PackageID),
          discountReason: String(""),
          tnxTypeID: Number(5),
          rateListID: Number(0),
          roundOff: 0,
          coPayPercent: Number(0),
          isPayable: Number(0),
          isPanelWiseDisc: Number(0),
          panelCurrencyCountryID: Number(panelID?.panelCurrencyCountryID),
          panelCurrencyFactor: Number(panelID?.panelCurrencyFactor),
          rateItemCode: String(""),
          sampleType: String(Sample),
          categoryID: String(CategoryID),
          bookingDate: String(bookingDate),
          bookingTime: String(bookingTime),
          bookinginModality: Number(0),
          appointmentNo: 0,
          isOutSource: Number(0),
          gstType: String(""),
          igstPercent: Number(0) ?? 0,
          igstAmt: Number(0),
          cgstPercent: Number(0),
          cgstAmt: Number(0),
          sgstPercent: Number(0),
          sgstAmt: Number(0),
          typeOfApp: String("2"),
          remark: String(""), //remark
          isMobileBooking: Number(0),
          appointmentID: Number(0),
          isSlotWiseToken: Number(IsSlotWiseToken),
          appointmentDateTime: AppointedDateTime
            ? String(AppointedDateTime)
            : "",
          isDocCollect: 0,
          isAdvance: 0,
          packageType: 2,
          investigation_ID: String(Investigation_Id),
        };

        ltd.push(itemDetails);
      }

      const secondData = {
        isUrgent: Number(0),
        patientTest_ID: String(0),
      };

      pt.push(secondData);
    }

    const secondData = {
      isUrgent: Number(isUrgent),
      patientTest_ID: String(presribedID),
    };

    pt.push(secondData);
  }

  const paymentDetail = payloadSettlerForPaymentGateWay(paymentMethod, Remark);

  const otherObject = {
    reportDispatchModeID: 0,
    directDiscountOnBill: discountAmount > 0 ? !disableDiscount : false,
    lastVisitID: "0",
    approvalRemark: String(panelID?.ApprovalRemarks),
    approvalAmount: String(panelID?.ApprovalAmount),
    isHelpDeskBilling: 0,
    helpDeskBookingCentreID: 0,
    pageURL: String(pathname),
  };

  const response = ValidationOfOPDBookingSave(ltd, paymentDetail, [pmh]);

  return {
    payload: {
      pmh,
      lt,
      ltd,
      pt,
      prh,
      paymentDetail,
      ...otherObject,
    },
    response: response,
  };
};

export const maxLengthChecker = (str, maxLength) => {
  return str.length > maxLength
    ? isMobile
      ? str
      : str.substring(0, maxLength) + "..."
    : str;
};

export const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
  }
  return colors;
};

export const removeDuplicateValues = (params) => {
  const ppp = new Set([...params]);
  const arrayFromSet = [...ppp];
  const convertObjectToArray = arrayFromSet.map((value) => value);
  return convertObjectToArray;
};

export const handlereferDocotorIDByReferalType = (
  referalTypeID,
  value,
  defaultValue
) => {
  const obj = {
    self: 4,
  };
  if (Number(referalTypeID) === obj["self"]) {
    return value;
  } else {
    return defaultValue;
  }
};

// const generateRandomColor = (numColors) => {
//   const r = Math.floor(Math.random() * 255);
//   const g = Math.floor(Math.random() * 255);
//   const b = Math.floor(Math.random() * 255);
//   return `rgba(${r}, ${g}, ${b}, 0.2)`;
// };

export const handleDiabeticChartSavePayload = (data) => {
  const {
    cbg,
    correction,
    date,
    doctorId,
    particularItem,
    patientID,
    time,
    transactionID,
  } = data;

  const returnData = {
    cbg: String(cbg),
    patientID: patientID,
    transactionID: transactionID,
    date: moment(date).format("DD-MMM-YYYY"),
    time: moment(time).format("hh:mm A"),
    particularItem: String(particularItem),
    correction: String(correction),
    doctorId: String(doctorId),
  };

  return returnData;
};

export const parseTimeString = (timeString) => {
  if (timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier.toLowerCase() === "pm" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier.toLowerCase() === "am" && hours === "12") {
      hours = "00";
    }

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date;
  } else {
    return "";
  }
};

export const handleDiabeticChartUpdatePayload = (data) => {
  const {
    cbg,
    correction,
    date,
    doctorId,
    particularItem,
    patientID,
    time,
    transactionID,
    ID,
  } = data;

  const returnData = {
    id: ID,
    cbg: String(cbg),
    patientID: patientID,
    transactionID: transactionID,
    date: moment(date).format("DD-MMM-YYYY"),
    time: moment(time).format("hh:mm A"),
    particularItem: String(particularItem),
    correction: String(correction),
    doctorId: String(doctorId),
  };

  return returnData;
};

export const NursingWardDischargePayload = (data) => {
  const {
    Date,
    nextVisit,
    DisChargeAdvice,
    IssueItems,
    transactionID,
    patientID,
  } = data;
  return {
    patientID: patientID,
    transactionID: transactionID,
    date: moment(Date).format("DD-MMM-YYYY"),
    note: DisChargeAdvice,
    issueItem: IssueItems,
    nextVisit: moment(nextVisit).format("DD-MMM-YYYY"),
  };
};

export const modifiedArray = (arr, joinType, returnKey) => {
  return arr.map((item) => item[returnKey]).join(joinType);
};

export const handleNursingWardNeedleInjurySavePayload = (data) => {
  const {
    sex,
    injuryID,
    injury,
    btnVal,
    pid,
    tid,
    nameId,
    name,
    date,
    time,
    age,
    Type,
    ward, //pass hogi props
    address,
    designation,
    incidentDate,
    incidentTime,
    reportingDate,
    reportingTime,
    procedure,
    activities,
    contamination,
    firstAid,
    glovesWorn,
    hepDate,
    tetanusDate,
    sourceofPatient,
    antiHCV,
    hbsAg,
  } = data;

  return {
    sex: String(sex),
    injuryID: String(injuryID),
    injury: modifiedArray(injury, "$", "name"),
    btnVal: String(btnVal),
    pid: String(pid),
    tid: String(tid),
    nameId: String(nameId),
    name: String(name),
    date: moment(date).format("DD-MMM-YYYY"),
    time: moment(time).format("hh:mm A"),
    age: `${String(age)} ${String(Type)}`,
    ward: String(ward),
    address: String(address),
    designation: String(designation),
    incidentDate: moment(incidentDate).format("DD-MMM-YYYY"),
    incidentTime: moment(incidentTime).format("hh:mm A"),
    reportingDate: moment(reportingDate).format("DD-MMM-YYYY"),
    reportingTime: moment(reportingTime).format("hh:mm A"),
    procedure: String(procedure),
    activities: String(activities),
    contamination: String(contamination),
    firstAid: String(firstAid),
    glovesWorn: String(glovesWorn),
    hepDate: moment(hepDate).format("DD-MMM-YYYY"),
    tetanusDate: moment(tetanusDate).format("DD-MMM-YYYY"),
    sourceofPatient: String(sourceofPatient),
    antiHCV: String(antiHCV),
    hbsAg: String(hbsAg),
  };
};

export const NursingWardSerumBilirubinSavePayload = (data) => {
  const { gestationType, tid, pid, dob, time, babyBG, motherBG, directTest } =
    data;

  return {
    gestationType: gestationType,
    tid: tid,
    pid: pid,
    dob: moment(dob).format("DD-MMM-YYYY"),
    time: moment(time).format("hh:mm A"),
    babyBG: String(babyBG),
    motherBG: String(motherBG),
    directTest: String(directTest),
  };
};

export const NursingWardSaveIntakePayload = (data, Date) => {
  const filterData = data.filter((ele) => ele?.isChecked === true);

  const returnData = [];
  for (let i = 0; i < filterData.length; i++) {
    const {
      Time_Label,
      Shift,
      Name,
      Solution,
      NGTOraSpDiet,
      VolNgt,
      OraSpDiet,
      NGT_Aspiration,
      Medication,
      More_drains,
      More_infusion_pumps,
      VolMedication,
      UrineVolumn,
      Other,
      RunningOutPut,
      SolVol,
    } = filterData[i];

    const val = {
      solution: String(Solution),
      ngtOraSpDiet: String(NGTOraSpDiet),
      volNgt: String(VolNgt),
      medication: String(Medication),
      volMedication: String(VolMedication),
      urineVolumn: String(UrineVolumn),
      other: String(Other),
      runningOutPut: String(RunningOutPut),
      time: String(Time_Label),
      date: String(moment(Date).format("DD-MMM-YYYY")),
      shift: String(Shift),
      createdBy: String(Name),
      solVol: String(SolVol),
      more_infusion_pumps: String(More_infusion_pumps),
      more_drains: String(More_drains),
      oraSpDiet: String(OraSpDiet),
      ngtAspiration: String(NGT_Aspiration),
    };

    returnData.push(val);
  }

  return returnData;
};

export function getLocalIP(callback) {
  const RTCPeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  const pc = new RTCPeerConnection({ iceServers: [] });
  const noop = () => { };
  const localIPs = {};
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/g;

  function handleCandidate(candidate) {
    const ipMatch = candidate.match(ipRegex);
    ipMatch &&
      ipMatch.forEach((ip) => {
        if (!localIPs[ip]) callback(ip);
        localIPs[ip] = true;
      });
  }

  pc.createDataChannel("");
  pc.createOffer()
    .then((sdp) => {
      sdp.sdp.split("\n").forEach((line) => {
        if (line.includes("candidate")) handleCandidate(line);
      });
      pc.setLocalDescription(sdp, noop, noop);
    })
    .catch((error) => console.error("Failed to create offer:", error));

  pc.onicecandidate = (ice) => {
    if (ice && ice.candidate && ice.candidate.candidate)
      handleCandidate(ice.candidate.candidate);
  };
}

export const focusInput = (id) => {
  // Using document.getElementById to focus on the input field
  const inputElement = document.getElementById(id);
  if (inputElement) {
    inputElement.focus();
  }
};

export const NursingWardSaveBabyChartPayload = (data) => {
  return {
    ...data,
    eddByDate: moment(data?.eddByDate).format("DD-MMM-YYYY"),
    bookingDate: moment(data?.bookingDate).format("DD-MMM-YYYY"),
    gestationDate: moment(data?.gestationDate).format("DD-MMM-YYYY"),
    date: moment(data?.date).format("DD-MMM-YYYY"),
  };
};

export const handleSetDataBabyChart = (response) => {
  const {
    TransactionID,
    BloodGroup,
    ObstetricHistory,
    FamilyHistory,
    MedicalHistory,
    LMP,
    EDDByDate,
    EDDByScan,
    AntenatalCare,
    BookingDate,
    SmokesPerDay,
    Alcohol,
    DurationOfLabourFirstStage,
    DurationOfLabourSecondStage,
    DurationOfLabourThirdStage,
    AntenatalProblemsAndDrugs,
    Amnio,
    Result,
    MembranesRuptured,
    AntenalSteroids,
    Placenta,
    DeliveryMode,
    Indication,
    LENGTH,
    OFC,
    GestationDate,
    GestationScan,
    Dubowitz,
    ApgarScoreFirst,
    ApgarScoreSecond,
    ApgarScoreThird,
    ColourFirst,
    ColourSecond,
    ColourThird,
    HeartRateFirst,
    HeartRateSecond,
    HeartRateThird,
    RespirationFirst,
    RespirationSecond,
    RespirationThird,
    ToneFirst,
    ToneSecond,
    ToneThird,
    ResponseFirst,
    ResponseSecond,
    ResponseThird,
    TotalFirst,
    TotalSecond,
    TotalThird,
    Resuscitation,
    VitaminKGiven,
    DATE,
    DrExamining,
    HeadSuturesFontanelles,
    Hips,
    Eyes,
    Genitalia,
    Ears,
    Testes,
    Palate,
    Spine,
    Neck,
    LowerLimbs,
    UpperLimbs,
    Skin,
    RSChest,
    Tone,
    CVS,
    Movement,
    Abdomen,
    Moro,
    FemoralPulses,
    Grasp,
    Anus,
    Suck,
    Comments,
  } = response;
  return {
    spine: String(Spine),
    membranesRuptured: String(MembranesRuptured),
    transactionID: String(TransactionID),
    bloodGroup: String(BloodGroup),
    obstetricHistory: String(ObstetricHistory),
    familyHistory: String(FamilyHistory),
    medicalHistory: String(MedicalHistory),
    lmp: String(LMP),
    eddByDate: new Date(EDDByDate),
    eddByScan: String(EDDByScan),
    antenatalCare: String(AntenatalCare),
    bookingDate: new Date(BookingDate),
    smokesPerDay: String(SmokesPerDay),
    alcohol: String(Alcohol),
    durationOfLabourFirstStage: String(DurationOfLabourFirstStage),
    durationOfLabourSecondStage: String(DurationOfLabourSecondStage),
    durationOfLabourThirdStage: String(DurationOfLabourThirdStage),
    antenatalProblemsAndDrugs: String(AntenatalProblemsAndDrugs),
    amnio: String(Amnio),
    result: String(Result),
    antenalSteroids: String(AntenalSteroids),
    placenta: String(Placenta),
    deliveryMode: String(DeliveryMode),
    indication: String(Indication),
    length: String(LENGTH),
    ofc: String(OFC),
    gestationDate: new Date(GestationDate),
    gestationScan: String(GestationScan),
    dubowitz: String(Dubowitz),
    apgarScoreFirst: String(ApgarScoreFirst),
    apgarScoreSecond: String(ApgarScoreSecond),
    apgarScoreThird: String(ApgarScoreThird),
    colourFirst: String(ColourFirst),
    colourSecond: String(ColourSecond),
    colourThird: String(ColourThird),
    heartRateFirst: String(HeartRateFirst),
    heartRateSecond: String(HeartRateSecond),
    heartRateThird: String(HeartRateThird),
    respirationFirst: String(RespirationFirst),
    respirationSecond: String(RespirationSecond),
    respirationThird: String(RespirationThird),
    toneFirst: String(ToneFirst),
    toneSecond: String(ToneSecond),
    toneThird: String(ToneThird),
    responseFirst: String(ResponseFirst),
    responseSecond: String(ResponseSecond),
    responseThird: String(ResponseThird),
    totalFirst: String(TotalFirst),
    totalSecond: String(TotalSecond),
    totalThird: String(TotalThird),
    resuscitation: String(Resuscitation),
    vitaminKGiven: String(VitaminKGiven),
    date: new Date(DATE),
    drExamining: String(DrExamining),
    headSuturesFontanelles: String(HeadSuturesFontanelles),
    hips: String(Hips),
    eyes: String(Eyes),
    genitalia: String(Genitalia),
    ears: String(Ears),
    testes: String(Testes),
    palate: String(Palate),
    neck: String(Neck),
    lowerLimbs: String(LowerLimbs),
    upperLimbs: String(UpperLimbs),
    skin: String(Skin),
    rsChest: String(RSChest),
    tone: String(Tone),
    cvs: String(CVS),
    movement: String(Movement),
    abdomen: String(Abdomen),
    moro: String(Moro),
    femoralPulses: String(FemoralPulses),
    grasp: String(Grasp),
    anus: String(Anus),
    suck: String(Suck),
    comments: String(Comments),
  };
};

export const NursingWardBindPatientDetailModifies = (response) => {
  const {
    ID,
    TransactionID,
    PatientID,
    IsAware,
    AwareRemarks,
    IsConsumables,
    ConsumablesRemarks,
    IsDrugsReturn,
    DrugsReturnRemarks,
    IsTTO,
    TTORemarks,
    IsEnsureDS,
    EnsureDSRemarks,
    IsSigned,
    SignedRemarks,
    IsRefferal,
    RefferalRemarks,
    IsVenflon,
    VenflonRemarks,
    IsWound,
    WoundRemarks,
    IsDischrageLog,
    DischargeLogRemarks,
    IsEnsureBilling,
    EnsureBillingRemarks,
    IsCheckout,
    CheckoutRemarks,
    CreateDate,
    IsEdit,
  } = response;

  return {
    isAware: Number(IsAware),
    isConsumables: Number(IsConsumables),
    isDrugsReturn: Number(IsDrugsReturn),
    isTTO: Number(IsTTO),
    isEnsureDS: Number(IsEnsureDS),
    isSigned: Number(IsSigned),
    isRefferal: Number(IsRefferal),
    isVenflon: Number(IsVenflon),
    isWound: Number(IsWound),
    isDischrageLog: Number(IsDischrageLog),
    isEnsureBilling: Number(IsEnsureBilling),
    isCheckout: Number(IsCheckout),
    awareRemarks: String(AwareRemarks),
    consumablesRemarks: String(ConsumablesRemarks),
    drugsReturnRemarks: String(DrugsReturnRemarks),
    ttoRemarks: String(TTORemarks),
    ensureDSRemarks: String(EnsureDSRemarks),
    signedRemarks: String(SignedRemarks),
    refferalRemarks: String(RefferalRemarks),
    venflonRemarks: String(VenflonRemarks),
    woundRemarks: String(WoundRemarks),
    dischargeLogRemarks: String(DischargeLogRemarks),
    ensureBillingRemarks: String(EnsureBillingRemarks),
    checkoutRemarks: String(CheckoutRemarks),
    createdDate: new Date(CreateDate),
    id: String(ID),
  };
};

export const NursingWardDeceasedSaveCheckListPayload = (response) => {
  return {
    ...response,
    dateofContact: moment(response?.dateofContact).format("DD-MMM-YYYY"),
    timeofContact: moment(response?.timeofContact).format("hh:mm A"),
  };
};

export const NursingWardSaveAssessMentRecordPayload = (response) => {
  return {
    ...response,
    date: moment(response?.date).format("DD-MMM-YYYY"),
    time: moment(response?.time).format("hh:mm A"),
  };
};

export const NursingWardSearchAssessmentDataSettler = (response) => {
  const {
    ID,
    Date: DATE,
    Time,
    Age_Text,
    Age_Value,
    MentalStatus_Text,
    MentalStatus_Value,
    Lengthofstay_Text,
    Lengthofstay_Value,
    Elimination_Text,
    Elimination_Value,
    Impairment_Text,
    Impairment_Value,
    BloodPressure_Text,
    BloodPressure_Value,
    G_Diagnosis_Text,
    G_Diagnosis_Value,
    G_History_Text,
    G_History_Value,
    G_LosswithoutHold_Text,
    G_LosswithoutHold_Value,
    G_LossStraight_Text,
    G_LossStraight_Value,
    G_Decreased_Text,
    G_Decreased_Value,
    G_Lurching_Text,
    G_Lurching_Value,
    G_UsesCane_Text,
    G_UsesCane_Value,
    G_Holds_Text,
    G_Holds_Value,
    G_Widebase_Text,
    G_Widebase_Value,
    M_Alcohol_Text,
    M_Alcohol_Value,
    M_Pos_Text,
    M_Pos_Value,
    M_Cardio_Text,
    M_Cardio_Value,
    M_Diuretics_Text,
    M_Diuretics_Value,
    M_Cath_Text,
    M_Cath_Value,
    M_Sedatives_Text,
    M_Sedatives_Value,
    M_Histamine_Text,
    M_Histamine_Value,
    M_Chemo_Text,
    M_Chemo_Value,
    M_Narco_Text,
    M_Narco_Value,
    M_HighRisk_Text,
    M_HishRisk_Value,
    CreateBy,
    CreateDate,
  } = response;

  return {
    time: parseTimeString(Time),
    date: new Date(DATE),
    ageValue: Age_Value,
    ageText: Age_Text,
    mentalStatusValue: MentalStatus_Value,
    mentalStatusText: MentalStatus_Text,
    lengthofStayValue: Lengthofstay_Value,
    lengthodStayText: Lengthofstay_Text,
    eliminationValue: Elimination_Value,
    eliminationText: Elimination_Text,
    impairmentValue: Impairment_Value,
    impairmentText: Impairment_Text,
    bloodPressueValue: BloodPressure_Value,
    bloodPressueText: BloodPressure_Text,
    g_Diagnosis_Value: G_Diagnosis_Value,
    g_Diagnosis_Text: G_Diagnosis_Text,
    g_History_Value: G_History_Value,
    g_History_Text: G_History_Text,
    g_LossWithoutHold_Value: G_LosswithoutHold_Value,
    g_LossWithoutHold_Text: G_LosswithoutHold_Text,
    g_LossStraight_Value: G_LossStraight_Value,
    g_LossStraight_Text: G_LossStraight_Text,
    g_Decreased_Value: G_Decreased_Value,
    g_Decreased_Text: G_Decreased_Text,
    g_Lurching_Value: G_Lurching_Value,
    g_Lurching_Text: G_Lurching_Text,
    g_UsesCane_Value: G_UsesCane_Value,
    g_UsesCane_Text: G_UsesCane_Text,
    g_Holds_Value: G_Holds_Value,
    g_Holds_Text: G_Holds_Text,
    g_WideBase_Value: G_Widebase_Value,
    g_WideBase_Text: G_Widebase_Text,
    m_Alcohol_Value: M_Alcohol_Value,
    m_Alcohol_Text: M_Alcohol_Text,
    m_Post_Value: M_Pos_Value,
    m_Post_Text: M_Pos_Text,
    m_Cardiovascular_Value: M_Cardio_Value,
    m_Cardiovascular_Text: M_Cardio_Text,
    m_Diuretics_Value: M_Diuretics_Value,
    m_Diuretics_Text: M_Diuretics_Text,
    m_Cathartics_Value: M_Cath_Value,
    m_Cathartics_Text: M_Cath_Text,
    m_Sedatives_Value: M_Sedatives_Value,
    m_Sedatives_Text: M_Sedatives_Text,
    m_Histamine_Value: M_Histamine_Value,
    m_Histamine_Text: M_Histamine_Text,
    m_Narcotics_Value: M_Narco_Value,
    m_Narcotics_Text: M_Narco_Text,
    m_Chemotherapy_Value: M_Chemo_Value,
    m_Chemotherapy_Text: M_Chemo_Text,
    totalRisk_Value: M_HishRisk_Value,
    totalRisk_Text: M_HighRisk_Text,
    createdBy: CreateBy,
    createdDate: CreateDate,
    id: ID,
  };
};

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result); // Resolve the promise with the Base64 string
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file); // Read the file as a Base64-encoded string
  });
}

// export const NursingWardSaveViewUploadDocumentPayload = (response) => {
//   return response.map((items, index) => {
//     const { ID, Name, Remark, URL } = items;
//     return {
//       masterID: String(ID),
//       name: String(Name),
//       fileName: String(Name),
//       remark: String(Remark),
//       file: String(URL),
//     };
//   });
// };
export const NursingWardSaveViewUploadDocumentPayload = (response) => {
  console.log(response, "the response form")
  return response.map((items, index) => {
    const { ID, Name, Remark, URL } = items;
    return {
      masterID: String(ID),
      name: String(Name),
      fileName: String(Name),
      remark: String(Remark),
      file: URL,
    };
  });
};

// export const NursingWardSaveViewUploadDocumentPayload = (response) => {
//   return response.map((items, index) => {
//     const { ID, Name, Remark, URL } = items;

//     return {
//       masterID: String(ID),
//       name: Name || "Unknown File", // ✅ Provide default name if missing
//       fileName: Name || "Unknown File", // ✅ Default name for file
//       remark: Remark ? String(Remark) : "", // ✅ Empty string if undefined
//       file: URL ? URL : "", // ✅ Ensure file is not "undefined"
//     };
//   });
// };

export const NursingWardBabyFeedingModifiedObject = (items) => {
  const {
    ID,
    Time_Label,
    Shift,
    Name,
    DATE,
    Infusion,
    NGTOral,
    NGTOnly,
    Drugs,
    Urine,
    Bowel,
    Temp,
    Remarks,
    IsInfusionEdit,
    IsNgtOralEdit,
    IsNGTOnlyEdit,
    IsDrugsEdit,
    IsUrineEdit,
    IsBowelEdit,
    IsTempEdit,
    IsRemarksEdit,
    IsSelect,
    CreatedDate,
  } = items;
  return {
    infusion: String(Infusion),
    ngtOral: String(NGTOral),
    ngtOnly: String(NGTOnly),
    drugs: String(Drugs),
    urine: String(Urine),
    bowel: String(Bowel),
    temp: String(Temp),
    remarks: String(Remarks),
    time: String(Time_Label),
    date: String(DATE),
    shift: String(Shift),
    createdBy: String(Name),
    createdDate: String(CreatedDate),
    id: String(ID),
    IsInfusionEdit,
    IsNgtOralEdit,
    IsNGTOnlyEdit,
    IsDrugsEdit,
    IsUrineEdit,
    IsBowelEdit,
    IsTempEdit,
    IsRemarksEdit,
    IsSelect,
    Name,
    IsChecked: 0,
  };
};

export const NursingWardBindDeceasedPatientDetailModified = (data) => {
  const {
    PatientID,
    Pname,
    IPDNO,
    DOB,
    address,
    Religion,
    DateofDeath,
    TimeofDeath,
    NextOfKinInformed,
    ContactBy,
    TimeofContact,
    DateofContact,
    PropertyReturn,
    DentureinPlace,
    JewelleryinPlace,
    TypeOfJewellery,
    IsWishbyRelative,
    AnyOtherWish,
    LastOffice,
    ReadBackbyKin,
    Comments,
    ID,
    CreateDate,
    IsEdit,
  } = data;

  return {
    nextOfKinInformed: NextOfKinInformed ? Number(NextOfKinInformed) : 0,
    propertyReturn: PropertyReturn ? Number(PropertyReturn) : 0,
    dentureinPlace: DentureinPlace ? Number(DentureinPlace) : 0,
    jewelleryinPlace: JewelleryinPlace ? Number(JewelleryinPlace) : 0,
    isWishbyRelative: IsWishbyRelative ? Number(IsWishbyRelative) : 0,
    lastOffice: LastOffice ? Number(LastOffice) : 0,
    readBackbyKin: ReadBackbyKin ? Number(ReadBackbyKin) : 0,
    contactBy: ContactBy ? String(ContactBy) : "",
    timeofContact: TimeofContact ? parseTimeString(TimeofContact) : new Date(),
    dateofContact: DateofContact ? new Date(DateofContact) : new Date(),
    typeOfJewellery: TypeOfJewellery ? String(TypeOfJewellery) : "",
    anyOtherWish: AnyOtherWish ? String(AnyOtherWish) : "",
    comments: Comments ? String(Comments) : "",
    createdBy: "",
    createdDate: "",
    id: ID ? String(ID) : "",
    PatientID,
    Pname,
    IPDNO,
    DOB,
    address,
    Religion,
    DateofDeath: DateofDeath ? new Date(DateofDeath) : null,
    TimeofDeath: TimeofDeath ? parseTimeString(TimeofDeath) : "",
  };
};

export const NursingPatientTableDataModifiedDocument = (response) => {
  return response?.map((items) => {
    const {
      id,
      name,
      imageName,
      remark,
      url,
      status,
      visible,
      documentDate,
      documentData,
    } = items;
    return {
      ID: id,
      Name: name,
      ImageName: imageName,
      Remark: remark,
      URL: url,
      Status: status,
      Visible: visible,
      DocumentDate: documentDate,
      DocumentData: documentData,
    };
  });
};

const handledoctsData = (state) => {
  return state?.map((items, _) => {
    return {
      doctorID: items?.code,
      doctorName: items?.name,
    };
  });
};

export const handleSaveIPDAdmissionPayload = (
  hashcode,
  singlePatientData,
  payloadData,
  ip,
  location,
  selectedRelations
) => {
  const { pathname } = location;
  const requestData = {
    doctors: handledoctsData(payloadData?.DoctorID) || [],


    "prh": selectedRelations?.map((item) => (
      {
        "patientID": singlePatientData?.PatientID || "",
        "relationOf": item?.RelationOf || "",
        "relationName": item?.RelationName || "",
        "relationPhone": item?.RelationPhoneNo || "",
        "isPersonal": 1
      }
    )),
    pip: {
      ipdCaseTypeID: payloadData?.IPDCaseTypeID || "",
      roomID: payloadData?.RoomBed || "",
      ipdCaseTypeID_Bill: payloadData?.BillingCategory || "",
      panelID: parseInt(payloadData?.panelID?.PanelID) || 0,
    },
    pmh: {
      "consultationDoctorID": payloadData?.ConsultingDoctor?.DoctorID || 0,
      "consultationDoctorName": payloadData?.ConsultingDoctor?.label || "",
      "admittedBy": payloadData?.admittedBy || "",
      "mlc": Number(payloadData?.MLC),
      "tpaId": payloadData?.TPA?.value || 0,
      "tpaName": payloadData?.TPA?.label || "",
      patientID: singlePatientData?.PatientID || "",
      doctorID: payloadData?.DoctorID[0]?.code || "",
      patient_type: singlePatientData?.patientType || "",
      purpose: "",
      panelID: payloadData?.panelID?.value || 0,
      parentID: singlePatientData?.ParentID,
      referedBy: "",
      hashCode: String(hashcode),
      scheduleChargeID: 0,
      patientTypeID: singlePatientData?.PatientTypeID,
      panelPaybleAmt: 0,
      patientPaybleAmt: 0,
      panelPaidAmt: 0,
      patientPaidAmt: 0,
      kinRelation: singlePatientData?.Relation,
      kinName: singlePatientData?.RelationName,
      kinPhone: singlePatientData?.RelationPhoneNo,
      cardNo: "",
      policyNo: singlePatientData?.PolicyNo,
      expiryDate: singlePatientData?.ExpiryDate,
      cardHolderName: singlePatientData?.CardHolderName,
      relationWith_holder: "",
      panelIgnoreReason: "",
      proId: 0,
      isVisitClose: 0,
      typeOfReference: "",
      patient_Income: singlePatientData?.Patient_Income,
      occupation: singlePatientData?.Occupation,
      education: singlePatientData?.EducationID,
      triagingCode: 0,
      corporatePanelID: 0,
      referralTypeID: payloadData?.referalTypeID?.ReferalTypeID || 0,
      occupationId: singlePatientData?.Occupation,
      educationID: singlePatientData?.EducationID,
      time: payloadData?.time,
      dateOfVisit: payloadData?.dateOfVisit,
      feesPaid: 0,
      source: payloadData?.ReferedSource,
      hospPatientType: singlePatientData?.HospPatientType,
      employeeDependentName: "",
      dependentRelation: "",
      admission_Type: payloadData?.admissionType || "",
      treatment: payloadData?.treatment || "",
      mlC_NO: singlePatientData?.MLC_NO,
      mlC_Type: singlePatientData?.MLC_Type,
      isBirthDetail: "",
      motherTID: "",
      typeOfDelivery: "",
      deliveryWeeks: "",
      weight: "",
      height: "",
      admissionReason: payloadData?.admissionReason || "",
      birthIgnoreReason: "",
      referenceCode: payloadData?.panelID?.ReferenceCode || "",
      creditLimitType: "",
      creditLimitPanel: 0,
      isRoomRequest: 0,
      requestedRoomType: payloadData?.requestedRoomType || "",
      dateOfDischarge: "",
      timeOfDischarge: "",
      ecsh: payloadData?.ECHS || "",
      approvalDays: Number(payloadData?.isApporvaldays) || 0,
      diagnosis: String(payloadData?.diagnosis) || "",
      isInformedWard: payloadData?.Informedward === "yes" ? 1 : 0,
      transactionID: "",
    },
    isAdvance: 0,
    isAdmissionAgainstAdvanceBooking: 0,
    advanceID: 0,
    sendApprovalEmail: true,
    approvalAmount: "",
    approvalRemark: "",
    ipAddress: ip,
    pageURL: String(pathname),
  };

  return requestData;
};
export const handleUpdateIPDAdmissionPayload = (
  // hashcode,
  singlePatientData,
  payloadData,
  updataDataList,
  selectedRelations
  // ip,
  // location
) => {
  const requestData = {
    "consultationDoctorID": payloadData?.ConsultingDoctor?.DoctorID || 0,
    "consultationDoctorName": payloadData?.ConsultingDoctor?.label || "",
    "mlc": Number(payloadData?.MLC),
    "tpaId": payloadData?.TPA?.value || 0,
    "tpaName": payloadData?.TPA?.label || "",
    "admittedBy": payloadData?.admittedBy || "",
    "prh": selectedRelations?.map((item) => (
      {
        "patientID": singlePatientData?.PatientID || "",
        "relationOf": item?.RelationOf || "",
        "relationName": item?.RelationName || "",
        "relationPhone": item?.RelationPhoneNo || "",
        "isPersonal": 1
      }
    )),
    doctors: handledoctsData(payloadData?.DoctorID) || [],
    transactionID: parseInt(updataDataList?.transactionID),
    doctorID: singlePatientData?.DoctorID,
    doctorID1: updataDataList?.firstDocID,
    isMultipleDoctor: payloadData?.DoctorID > 1 ? 1 : 0,
    mlC_NO: updataDataList?.mlC_NO,
    mlC_Type: updataDataList?.mlC_Type,
    admission_Type: payloadData?.admissionType || "",
    treatment: payloadData?.treatment || "",
    ecsh: payloadData?.ECHS || "",
    approvalDays: Number(payloadData?.isApporvaldays) || 0,
    diagnosis: String(payloadData?.diagnosis) || "",
    isInformedWard: payloadData?.Informedward === "yes" ? 1 : 0,
    source: String(payloadData?.ReferedSource),
    proId: parseInt(updataDataList?.proID),
    admissionReason: String(payloadData?.admissionReason) || "",
    kinName: String(updataDataList?.kinName),
    kinRelation: String(updataDataList?.kinRelation),
    kinPhone: String(updataDataList?.kinPhone),
    consultant_Name: String(updataDataList?.firstDoc),
    requestedRoomType: String(payloadData?.requestedRoomType) || "",
    isRoomRequest: 0,
    timeOfAdmit: updataDataList?.timeOfAdmit,
    referralTypeID: parseInt(payloadData?.referalTypeID?.value),
    referedBy: updataDataList?.referedBy,
    ipdCaseTypeID_Bill: String(payloadData?.BillingCategory) || "",
    ipdCaseTypeID: parseInt(payloadData?.IPDCaseTypeID) || "",
    roomID: parseInt(payloadData?.RoomBed) || "",
  };

  return requestData;
};

// credit control

// disptach

export const handleCreditControlSaveDispatchRequestBody = (
  res,
  ip,
  DispatchDate
) => {
  const response = [...res];
  // response.shift();
  const isCheckedData = response?.filter((ele) => ele?.isChecked);

  let returnData = [];
  if (isCheckedData?.length > 0) {
    for (let i = 0; i < isCheckedData?.length; i++) {
      const {
        TYPE,
        TransactionID,
        AdmitDateTime,
        DischargeDateTime,
        PatientName,
        PanelID,
        Company_Name,
        OPDBillAmount,
        PanelAmt,
        DocketNo,
        Remarks,
        ValidityDay,
        DispatchDayID,
        CourierComp,
        Ref1,
        Ref2,
        PatientID,
        Dispatch_No,
        panelinvoiceno,
        LedgerTransactionNO,
        BillDate,
        BillNo,
        GrossAmount,
        discAmt,
        PolicyNo,
        CardNo,
        CoverNoteNo,
        CoverNoteDate,
        PanelPaidAmt,
        PatientPaybleAmt,
        PatientPaidAmt,
        OutStanding,
        NetBillAmt,
        IPDBillAmount,
        DateOfAdmit,
      } = isCheckedData[i];
      returnData.push({
        type: String(TYPE),
        transactionID: String(TransactionID),
        dateOfAdmission: String(DateOfAdmit),
        dateOfDischarge: String(DischargeDateTime),
        pName: String(PatientName),
        panelID: String(PanelID),
        panelName: String(Company_Name),
        billAmount: String(NetBillAmt),
        panelAmt: Number(PanelAmt),
        dispatchDate: moment(DispatchDate).format("DD-MMM-YYYY"),
        docketNo: String(DocketNo),
        remarks: String(Remarks),
        dispatchDayValidity: Number(ValidityDay),
        // dispatchDayID: Number(DispatchDayID),//by shiv sir 
        dispatchDayID: 0,
        courierComp: String(CourierComp),
        ref1: String(Ref1),
        ref2: String(Ref2),
        patientID: String(PatientID),
        dispatchNo: String(Dispatch_No),
        panelInvoiceNo: String(panelinvoiceno),
        ledgerTransactionNO: String(LedgerTransactionNO),
        billDate: String(BillDate),
        billNo: String(BillNo),
        grossAmount: Number(GrossAmount),
        discAmt: Number(discAmt),
        policyNo: String(PolicyNo),
        cardNo: String(CardNo),
        ipAddress: String(ip), // bhejuga
        coverNoteNo: String(CoverNoteNo),
        coverNoteDate: String(CoverNoteDate),
        panelPaidAmt: Number(PanelPaidAmt),
        patientPayableAmt: Number(PatientPaybleAmt),
        patientPaidAmt: Number(PatientPaidAmt),
        outStanding: Number(OutStanding),
        opdNetAmount: Number(OPDBillAmount),
        ipdNetAmount: Number(IPDBillAmount),
        userID: "",
        centreID: 0,
      });
    }
  }

  return returnData;
};

export const patientSearchPayload = (values) => {
  const newValues = {
    mrNo: values?.mrNo ? values?.mrNo : "",
    pName: values?.pName ? values?.pName : "",
    department: values?.department?.value
      ? `${values?.department?.value}`
      : "ALL",
    floor: handleCommaSepratedData(values?.floor),
    roomType: handleCommaSepratedData(values?.IPDCaseTypeID),

    ageFrom: values?.ageFrom ? values?.ageFrom : "",
    ddlAgeFrom: values?.ddlAgeFrom?.value ? values?.ddlAgeFrom?.value : "",
    ageTo: values?.ageTo ? values?.ageTo : "",
    ddlAgeTo: values?.ddlAgeTo?.value ? values?.ddlAgeTo?.value : "",
    ipdNo: values?.ipdNo ? values?.ipdNo : "",
    doctorID: values?.doctorID?.value ? `${values?.doctorID?.value}` : "0",
    panel: values?.panelID?.value ? `${values?.panelID?.value}` : "0",
    parentPanel: "0",
    fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
    toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
    admitDischarge: values?.admitDischarge?.value
      ? values?.admitDischarge?.value
      : "0",
    type: values?.OnlyPanelPatient === true ? "1" : "0",
    id: values?.id?.value ? values?.id?.value : values?.id ? values?.id : "0",
    isPatientReceived: values?.id === 5 ? 1 : values?.id === 6 ? 0 : 2,
  };
  return newValues;
};

const handleConsciousnessLebelValue = (data, name, value) => {
  let payData;
  if (name !== null) {
    payData = data?.filter((val) => val?.name === name);
    if (payData?.length > 0) {
      return payData[0]?.name;
    } else {
      return "";
    }
  } else if (value !== null) {
    payData = data?.filter((val) => val?.code === value);
    if (payData?.length > 0) {
      return payData[0]?.code?.split("#")[0];
    } else {
      return "";
    }
  } else {
    return "";
  }
};

export const savePEWSChartPayload = (payload) => {
  let data = [
    {
      id: payload?.ID ? payload?.ID : 0,
      signatureName: "",
      signatureNameOfStaffNurseTakingVitals: "",
      temperatureValue: payload?.Temperature?.extraColomn
        ? payload?.Temperature?.extraColomn
        : "",
      temperatureText: payload?.Temperature?.label
        ? payload?.Temperature?.label
        : "",
      inspiredValue: payload?.InspiredO?.extraColomn
        ? payload?.InspiredO?.extraColomn
        : "",
      inspiredText: payload?.InspiredO?.label ? payload?.InspiredO?.label : "",
      alertText: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        "Alert",
        null
      ),
      alertValue: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        null,
        "0#Alert"
      ),
      verbalText: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        "Verbal",
        null
      ),
      verbalValue: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        null,
        "3#Verbal"
      ),
      painText: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        "Pain",
        null
      ),
      painValue: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        null,
        "3#Pain"
      ),
      unresponsiveText: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        "Unresponsive",
        null
      ),
      unresponsiveValue: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        null,
        "3#Unresponsive"
      ),
      confusedText: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        "Confused",
        null
      ),
      confusedvalue: handleConsciousnessLebelValue(
        payload?.LevelofConsciousness,
        null,
        "1#Confused"
      ),
      transactionID: payload?.transactionID,
      date: moment(payload?.DATE).format("DD-MMM-yyyy"),
      time: moment(payload?.TIME).format("hh:mm A"),
      weight: payload?.Weight,
      bmi: payload?.BMI,
      capillaryBloodGlucose: payload?.CapillaryBloodGlucose,
      respiratoryRateValue: payload?.RespiratoryRate?.extraColomn
        ? payload?.RespiratoryRate?.extraColomn
        : "",
      respiratoryRateText: payload?.RespiratoryRate?.label
        ? payload?.RespiratoryRate?.label
        : "",
      oxygenSaturationValue: payload?.OxygenSaturation?.extraColomn
        ? payload?.OxygenSaturation?.extraColomn
        : "",
      oxygenSaturationText: payload?.OxygenSaturation?.label
        ? payload?.OxygenSaturation?.label
        : "",
      oxygenDeviceValue: payload?.OxygenDeviceFMNCVenturi?.extraColomn
        ? payload?.OxygenDeviceFMNCVenturi?.extraColomn
        : "",
      oxygenDeviceText: payload?.OxygenDeviceFMNCVenturi?.label
        ? payload?.OxygenDeviceFMNCVenturi?.label
        : "",
      bloodPressureValue: payload?.BloodPressure?.extraColomn
        ? payload?.BloodPressure?.extraColomn
        : "",
      bloodPressureText: payload?.BloodPressure?.label
        ? payload?.BloodPressure?.label
        : "",
      heartRateValue: payload?.HeartRate?.extraColomn
        ? payload?.HeartRate?.extraColomn
        : "",
      heartRateText: payload?.HeartRate?.label ? payload?.HeartRate?.label : "",
      pewsScore: "4",
      painScore: payload?.PainScore?.label ? payload?.PainScore?.label : "",
      bowelsOpenedValue: payload?.Bowelsopened?.extraColomn
        ? payload?.Bowelsopened?.extraColomn
        : "",
      bowelsOpenedText: payload?.Bowelsopened?.label
        ? payload?.Bowelsopened?.label
        : "",
      nauseaAndVomitingScoreValue: payload?.NauseaAndVomitingScore?.extracolomn
        ? payload?.NauseaAndVomitingScore?.extraColomn
        : "",
      nauseaAndVomitingScoreText: payload?.NauseaAndVomitingScore?.label
        ? payload?.NauseaAndVomitingScore?.label
        : "",
      urineOutputValue: payload?.UrineOutput?.extraColomn
        ? payload?.UrineOutput?.extraColomn
        : "",
      urineOutputText: payload?.UrineOutput?.label
        ? payload?.UrineOutput?.label
        : "",
      visualInfusionPhlebitisValue: payload?.VisualInfusionPhlebitis
        ?.extraColomn
        ? payload?.VisualInfusionPhlebitis?.extraColomn
        : "",
      visualInfusionPhlebitisText: payload?.VisualInfusionPhlebitis?.label
        ? payload?.VisualInfusionPhlebitis?.label
        : "",
      otherComments: "",
    },
  ];

  return data;
};

export const handleMedicineDetailsSavePayload = (payload, subItem) => {
  if (!payload?.date) {
    payload.date = new Date();
  }
  if (!payload?.time) {
    payload.time = new Date();
  }

  let data = {
    id: 0,
    transactionID: payload?.tid,
    IsGiven: subItem?.IsGiven ? 2 : 1,
    PatientMedicineReqID: subItem?.PatientMedicineReqID,
    indentNo: payload?.IndentNo ? payload?.IndentNo : "",
    itemID: payload?.ItemID ? payload?.ItemID : "",
    itemName: payload?.ItemName ? payload?.ItemName : "",
    issueDate: payload?.DATE
      ? moment(payload?.DATE, "DD-MMM-YY hh:mm A").format("YYYY-MM-DD")
      : "",
    date: subItem?.GivenDateTime
      ? moment(subItem?.GivenDateTime).format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD"),
    time: subItem?.GivenTime
      ? moment(subItem?.GivenTime).format("HH:mm")
      : moment(new Date()).format("HH:mm"),
    dose: payload?.dose ? payload?.dose : "",
    statusType: payload?.STATUS ? payload?.STATUS : "",
    remark: payload?.Remark ? payload?.Remark : "",
    // qty: payload?.dose ? Number(payload?.dose) : 1,
    qty: 1,
    // qty: payload?.Qty ? Number(payload?.Qty) : 1,
    // frequency: payload?.Frequency?.value ? payload?.Frequency?.value : "",
    frequency: payload?.Timing ? payload?.Timing : "",
    route: payload?.Route ? payload?.Route : "",
    status: payload?.status ? payload?.status : "",
    // Stopped Started
    // "isChecked": true,
    // "isCancel": ""
  };

  return data;
};
export const DischargeSummaryEMRMedicinePayload = (item, transactionID) => {
  console.log(item, transactionID);
  return {
    tid: String(transactionID),
    header: "medice",
    medicine: String(item?.MedicineName),
    route: "df",
    timefornxtdose: String(item?.TimeOfNextDose),
    dose: String(item?.Dose),
    time: String(item?.Times),
    days: String(item?.Duration),
    script: "",
    reason: "",
    id: "",
    meal: "besore",
  };
};

export const handleDischargeSummarySaveEMRHeaderTablePayload = (response) => {
  return response?.map((row, index) => {
    return {
      sNo: String(index),
      headerID: String(row?.Header_ID),
      headerName: String(row?.HeaderName),
      sequenceNo: String(row?.SeqNo),
      active: String(row?.IsActive),
    };
  });
};

export const DischargeSummarySaveSetHeaderDeptWisePayload = (response) => {
  return response?.map((row, _) => {
    return {
      header_Id: String(row?.header_id),
      headerName: String(row?.HeaderName),
      seqNo: String(row?.SeqNo),
      checked:
        typeof row?.chk === "string"
          ? row?.chk === "false"
            ? false
            : true
          : row?.chk,
    };
  });
};

// export const SaveIPDAdvance = (
//   singlePatientData,
//   payloa,
//   testAddingTableState,
//   paymentControlModeState,
//   paymentMethod,
//   pathname
// ) => {

// };

export const SendPanelApprovalBillingPayload = (data, panelDetail) => {
  return {
    panelApprovalDetails: {
      transactionID: data?.transactionID ? data?.transactionID : "",
      patientID: data?.patientID ? data?.patientID : "",
      panelID: panelDetail?.PanelID ? panelDetail?.PanelID : "",
      panelDocuments: [],
      approvalAmount: panelDetail?.approvalAmount
        ? panelDetail?.approvalAmount
        : "0",
      approvalRemark: panelDetail?.ApprovalRemarks
        ? panelDetail?.ApprovalRemarks
        : "",
      nicNumber: "",
      policyNumber: panelDetail?.PolicyNo ? panelDetail?.PolicyNo : "",
      policyCardNumber: panelDetail?.PolicyCardNo
        ? panelDetail?.PolicyCardNo
        : "",
      policyExpiryDate: panelDetail?.PolicyExpiry
        ? panelDetail?.PolicyExpiry
        : "",
      attachCostEstimation: panelDetail?.attachCostEstimation
        ? panelDetail?.attachCostEstimation
        : false,
      nameOnCard: panelDetail?.PanelCardName ? panelDetail?.PanelCardName : "",
      cardHolderRelation: panelDetail?.PolciyCardHolderRelation
        ? panelDetail?.PolciyCardHolderRelation
        : "",
      ignorePolicy: false,
      ignorePolicyReason: "",
    },
    isAdvanceRoomBooking: false,
  };
};

export const handleSaveSurgeryPayload = (items, payload) => {
  console.log(items);
  console.log(payload);
  const requestData = {
    details: [
      {
        surDate: "2024-09-23T14:07:09.303Z",
        ipdCaseTypeID: parseInt(items?.dt[0]?.ipdCaseTypeID),
        ipAddress: ip,
        roomID: 0,
      },
    ],
    gvSurgeryDetail: [
      {
        surgeryName: "string",
        surgeryCode: "string",
        surgeryID: "string",
        department: "string",
        rate: 0,
        reducePerOn: 0,
        calReducePerOn: 0,
        newRate: 0,
        remark: "string",
        bookingType: "string",
        bookingID: "string",
      },
    ],
    approveBy: "string",
    narration: "string",
    ledgerTnxNo: "string",
    ipdCaseTypeID: "string",
    patientTypeID: "string",
    ipAddress: "string",
    surDate: "2024-09-23T14:07:09.303Z",
    rateType: 0,
    surgeryCalculate: 0,
    surgeryItem: "string",
    totalBill_Amt: "string",
    panelID: "string",
    code: "string",
  };

  return requestData;
};
export const handleRequestBodyBillingSaveSaveServicesBilling = (
  tableData,
  pateintDetails,
  location,
  hashcode,
  values,
  packageID
) => {
  const { pathname } = location;
  const ip = useLocalStorage("ip", "get");
  console.log(tableData);

  const dataLT = {};

  dataLT.typeOfTnx = "IPD-Billing";
  dataLT.grossAmount = findSumBillAmount(tableData, "Rate");
  dataLT.netAmount = Number(findSumBillAmount(tableData, "amount"));
  dataLT.discountOnTotal = Number(
    findSumBillAmount(tableData, "discountAmount")
  );
  dataLT.roundOff = Number(
    dataLT.netAmount -
    (
      parseFloat(dataLT.grossAmount) - parseFloat(dataLT.discountOnTotal)
    ).toFixed(ROUNDOFF_VALUE)
  );
  dataLT.patientID = String(pateintDetails?.PatientID);
  dataLT.transactionID = Number(pateintDetails?.TransactionID);
  dataLT.uniqueHash = String(hashcode);
  dataLT.patientType = String(pateintDetails?.PatientType);
  dataLT.discountApproveBy = values?.discountApproveBy?.value || "";
  dataLT.discountReason = values?.discountReason?.value || "";
  dataLT.PanelID = Number(pateintDetails?.PanelID);

  // dataLTD

  const dataLTD = [];
  const pli = [];

  for (let i = 0; i < tableData.length; i++) {
    const insertObj = {};
    const {
      Date: date,
      ItemID,
      SubCategoryID,
      Rate,
      quantity,
      ipdPanelDiscPercent,
      ConfigID,
      ipdCoPayPercent,
      TypeName,
      ItemCode,
      DoctorID,
      isPayble,
      RoomID,
      RateListID,
      IGSTPercent,
      CGSTPercent,
      SGSTPercent,
      HSNCode,
      GSTType,
      TYPE,
      Type_ID,
      remark,
      isUrgent,
      Age,
      IsOutSource,
      OutSourceLabID,
      sampleReqDate,
      sampleReqTime,
      HospitalAmt,
      PharmacyAmt,
    } = tableData[i];

    insertObj.hospitalAmt = (HospitalAmt);
    insertObj.pharmacyAmt = (PharmacyAmt);
    insertObj.entryDate = date;
    insertObj.itemID = String(ItemID);
    insertObj.subCategoryID = String(SubCategoryID);
    insertObj.rate = String(Rate);
    insertObj.quantity = String(quantity);
    insertObj.discountPercentage = Number(ipdPanelDiscPercent) || 0;
    insertObj.isPayable = Number(isPayble);
    insertObj.configID = String(ConfigID);
    insertObj.coPayPercent = String(ipdCoPayPercent);
    insertObj.itemName = `${TypeName} ${ItemCode && `(${ItemCode})`}`;
    insertObj.doctorID = DoctorID;
    insertObj.ipdCaseTypeID = Number(pateintDetails?.IPDCaseTypeID);
    insertObj.rateListID = Number(RateListID);
    insertObj.rateItemCode = String(ItemCode);
    insertObj.roomID = Number(RoomID);
    insertObj.typeOfTnx =
      String(ConfigID) === "1"
        ? "IPD-Doc-Billing"
        : String(ConfigID) === "2"
          ? "IPD-Room_Shift"
          : String(ConfigID) === "3"
            ? "IPD-Lab"
            : "IPD-Billing";
    insertObj.igstPercent = String(IGSTPercent);
    insertObj.cgstPercent = String(CGSTPercent);
    insertObj.sgstPercent = String(SGSTPercent);
    insertObj.hsnCode = String(HSNCode);
    insertObj.gstType = String(GSTType);
    insertObj.pageName = String(pathname);

    dataLTD.push(insertObj);

    if (String(ConfigID) === "3") {
      const pliInsertObj = {};

      pliInsertObj.isSampleCollected = String(TYPE) === "R" ? "N" : "Y";
      pliInsertObj.investigation_ID = String(Type_ID);
      pliInsertObj.remarks = String(remark);
      pliInsertObj.isUrgent = Number(isUrgent);
      pliInsertObj.currentAge = String(Age);
      pliInsertObj.isOutSource = Number(IsOutSource);
      pliInsertObj.outSourceLabID = Number(OutSourceLabID);
      pliInsertObj.scRequestdatetime = `${moment(sampleReqDate).format("DD-MMM-YYYY")} ${moment(sampleReqTime).format("hh:mm:ss A")}`;
      pli.push(pliInsertObj);
    }
  }

  return {
    dataLT,
    dataLTD,
    pli,
    patientTypeID: String(pateintDetails?.PatientTypeID),
    membershipNo: String(pateintDetails?.MemberShipCardNo),
    ipAddress: String(ip),
  "ledgerTnxID": packageID?.LedgerTnxRefID?packageID?.LedgerTnxRefID:0,
  "packageItemId":  String(packageID?.ItemID?packageID?.ItemID:"0"),
// ledgerTnxID
    
  };
};
// export const handleRequestBodyBillingSaveSaveServicesBilling = (
//   tableData,
//   pateintDetails,
//   location,
//   hashcode,
//   values
// ) => {
//   const { pathname } = location;
//   const ip = useLocalStorage("ip", "get");
//   console.log(tableData);

//   const dataLT = {};

//   dataLT.typeOfTnx = "IPD-Billing";
//   dataLT.grossAmount = findSumBillAmount(tableData, "Rate");
//   dataLT.netAmount = Number(findSumBillAmount(tableData, "amount"));
//   dataLT.discountOnTotal = Number(
//     findSumBillAmount(tableData, "discountAmount")
//   );
//   dataLT.roundOff = Number(
//     dataLT.netAmount -
//     (
//       parseFloat(dataLT.grossAmount) - parseFloat(dataLT.discountOnTotal)
//     ).toFixed(ROUNDOFF_VALUE)
//   );
//   dataLT.patientID = String(pateintDetails?.PatientID);
//   dataLT.transactionID = Number(pateintDetails?.TransactionID);
//   dataLT.uniqueHash = String(hashcode);
//   dataLT.patientType = String(pateintDetails?.PatientType);
//   dataLT.discountApproveBy = values?.discountApproveBy?.value || "";
//   dataLT.discountReason = values?.discountReason?.value || "";
//   dataLT.PanelID = Number(pateintDetails?.PanelID);

//   // dataLTD

//   const dataLTD = [];
//   const pli = [];

//   for (let i = 0; i < tableData.length; i++) {
//     const insertObj = {};
//     const {
//       Date: date,
//       ItemID,
//       SubCategoryID,
//       Rate,
//       quantity,
//       ipdPanelDiscPercent,
//       ConfigID,
//       ipdCoPayPercent,
//       TypeName,
//       ItemCode,
//       DoctorID,
//       isPayble,
//       RoomID,
//       RateListID,
//       IGSTPercent,
//       CGSTPercent,
//       SGSTPercent,
//       HSNCode,
//       GSTType,
//       TYPE,
//       Type_ID,
//       remark,
//       isUrgent,
//       Age,
//       IsOutSource,
//       OutSourceLabID,
//       sampleReqDate,
//       sampleReqTime,
//     } = tableData[i];

//     insertObj.entryDate = date;
//     insertObj.itemID = String(ItemID);
//     insertObj.subCategoryID = String(SubCategoryID);
//     insertObj.rate = String(Rate);
//     insertObj.quantity = String(quantity);
//     insertObj.discountPercentage = Number(ipdPanelDiscPercent) || 0;
//     insertObj.isPayable = Number(isPayble);
//     insertObj.configID = String(ConfigID);
//     insertObj.coPayPercent = String(ipdCoPayPercent);
//     insertObj.itemName = `${TypeName} ${ItemCode && `(${ItemCode})`}`;
//     insertObj.doctorID = DoctorID;
//     insertObj.ipdCaseTypeID = Number(pateintDetails?.IPDCaseTypeID);
//     insertObj.rateListID = Number(RateListID);
//     insertObj.rateItemCode = String(ItemCode);
//     insertObj.roomID = Number(RoomID);
//     insertObj.typeOfTnx =
//       String(ConfigID) === "1"
//         ? "IPD-Doc-Billing"
//         : String(ConfigID) === "2"
//           ? "IPD-Room_Shift"
//           : String(ConfigID) === "3"
//             ? "IPD-Lab"
//             : "IPD-Billing";
//     insertObj.igstPercent = String(IGSTPercent);
//     insertObj.cgstPercent = String(CGSTPercent);
//     insertObj.sgstPercent = String(SGSTPercent);
//     insertObj.hsnCode = String(HSNCode);
//     insertObj.gstType = String(GSTType);
//     insertObj.pageName = String(pathname);

//     dataLTD.push(insertObj);

//     if (String(ConfigID) === "3") {
//       const pliInsertObj = {};

//       pliInsertObj.isSampleCollected = String(TYPE) === "R" ? "N" : "Y";
//       pliInsertObj.investigation_ID = String(Type_ID);
//       pliInsertObj.remarks = String(remark);
//       pliInsertObj.isUrgent = Number(isUrgent);
//       pliInsertObj.currentAge = String(Age);
//       pliInsertObj.isOutSource = Number(IsOutSource);
//       pliInsertObj.outSourceLabID = Number(OutSourceLabID);
//       pliInsertObj.scRequestdatetime = `${moment(sampleReqDate).format("DD-MMM-YYYY")} ${moment(sampleReqTime).format("hh:mm:ss A")}`;
//       pli.push(pliInsertObj);
//     }
//   }

//   return {
//     dataLT,
//     dataLTD,
//     pli,
//     patientTypeID: String(pateintDetails?.PatientTypeID),
//     membershipNo: String(pateintDetails?.MemberShipCardNo),
//     ipAddress: String(ip),
//   };
// };

export const SaveMedicalIssuePayload = (
  ItemIndexValue,
  payload,
  tableData,
  data
) => {
  const itemList = tableData?.map((ele) => ({
    itemID: ItemIndexValue?.ItemID ? Number(ItemIndexValue?.ItemID) : 0,
    dose: ele?.Dose ? String(ele?.Dose) : "",
    time: ele?.Times ? String(ele?.Times) : "",
    duration: ele?.Duration ? String(ele?.Duration) : "",
    durationValue: "",
    route: ele?.Route ? String(ele?.Route) : "",
    meal: ele?.Meals ? String(ele?.Meals) : "",
    tid: data?.transactionID ? Number(data?.transactionID) : "",
    pid: data?.patientID ? String(data?.patientID) : "",
    doc: "",
    lnxNo: "0",
    medicineName: ele?.itemName ? String(ele?.itemName) : "",
    dept: ele?.department ? String(ele?.department) : "",
    quantity: ele?.Quantity ? Number(ele?.Quantity) : "",
    unitType: "",
    indentType: ele?.RequestType?.value ? String(ele?.RequestType?.value) : "",
    doctorID: ele?.DoctorID ? Number(ele?.DoctorID) : "",
    ipdCaseTypeID: data?.ipdCaseTypeID ? Number(data?.ipdCaseTypeID) : "",
    room_ID: 0,
    ledgerTransactionNo: "",
    isAdvance: 0,
    rate: ItemIndexValue?.Rate ? Number(ItemIndexValue?.Rate) : 0,
    discAmt: 0,
    discountPercentage: 0,
    amount: 0,
    subCategoryID: ele?.SubCategoryID?.value
      ? Number(ele?.SubCategoryID?.value)
      : "",
    itemName: ele?.itemName ? String(ele?.itemName) : "",
    type: ele?.Type ? String(ele?.Type) : "",
    typeID: 0,
    tnxTypeID: 0,
    sampleType: ItemIndexValue?.SampleTypeName
      ? String(ItemIndexValue?.SampleTypeName)
      : "",
    rateListID: 0,
    isOutSource: 0,
    rateItemCode: "",
    isCancel: 0,
    pageURL: String(pathname),
    patient_Type: data?.patientType ? String(data?.patientType) : "",
    panelID: data?.panelID ? String(data?.panelID) : "",
    coPayPercent: 0,
    remark: ele?.Remarks ? String(ele?.Remarks) : "",
    isUrgent: ele?.RequestType?.value === 1 ? 0 : 1,
    transNo: data?.ipdno ? String(data?.ipdno) : "",
  }));

  const medicalRequisitionRequestBody = {
    data: itemList,
    isDischargeMedicine: payload?.isDischargeMedicine,
  };
  return medicalRequisitionRequestBody;
};
export const SaveServicePayload = (location, addList, data) => {
  const InvestigationitemList = addList?.map((ele) => ({
    ledgerTransactionNo: 0,
    isAdvance: 0,
    itemID: ele?.ItemID ? Number(ele?.ItemID) : 0,
    rate: ele?.Rate ? Number(ele?.Rate) : 0,
    quantity: ele?.Quantity ? Number(ele?.Quantity) : 0,
    discAmt: (Number(ele?.Rate) * Number(ele?.DiscountPer)) / 100,
    amount: Number(ele?.Quantity) * Number(ele?.Rate),
    discountPercentage: ele?.DiscountPer ? Number(ele?.DiscountPer) : 0,
    subCategoryID: ele?.SubCategoryID ? Number(ele?.SubCategoryID) : 0,
    tid: data?.transactionID ? Number(data?.transactionID) : 0,
    itemName: ele?.itemName ? String(ele?.itemName) : "",
    doctorID: ele?.DoctorID ? Number(ele?.DoctorID) : 0,
    type: ele?.Type ? String(ele?.Type) : "",
    typeID: ele?.Type_ID ? Number(ele?.Type_ID) : 0,
    tnxTypeID: Number(ele?.tnxTypeID),
    sampleType: ele?.SampleTypeName ? String(ele?.SampleTypeName) : "",
    rateListID: ele?.RateListID ? Number(ele?.RateListID) : 0,
    isOutSource: ele?.IsOutSource ? Number(ele?.IsOutSource) : 0,
    rateItemCode: "",
    coPayPercent: 0,
    ipdCaseTypeID: data?.ipdCaseTypeID ? Number(data?.ipdCaseTypeID) : 0,
    roomID: data?.roomId ? Number(data?.roomId) : 0,
    remark: ele?.Remarks ? String(ele?.Remarks) : "",
    isUrgent: ele?.RequestType?.value === 1 ? 0 : 1,
    isCancel: 0,
    pageURL: String(pathname),
    patientId: data?.patientID ? String(data?.patientID) : "",
    patient_Type: data?.patientType ? String(data?.patientType) : "",
    panelID: data?.panelID ? String(data?.panelID) : "",
    transNo: data?.ipdno ? String(data?.ipdno) : "",
    dept: String(data?.department),
  }));
  console.log(InvestigationitemList);
  const investigationRequisitionRequestBody = {
    requisition: InvestigationitemList,
  };

  return investigationRequisitionRequestBody;
};

export const IsDisabledDoctorReportField = (value, key) => {
  if (
    (key === "Doctor" || key === "VisitType" || key === "AppStatus") &&
    value === "APPSTR"
  ) {
    return false;
  } else if (
    (key === "Doctor" ||
      key === "DoctorGroup" ||
      key === "VisitType" ||
      key === "AppStatus" ||
      key === "AppType" ||
      key === "Type" ||
      key === "IncludePackage") &&
    value === "DAPPDRPT"
  ) {
    return false;
  } else if (
    (key === "DoctorGroup" || key === "IncludePackage") &&
    value === "DAPPSRPT"
  ) {
    return false;
  } else if (key === "AmountType" && value === "BSSRPT") {
    return false;
  } else if (
    (key === "PatientType" || key === "ReferalDoctor" || key === "UHID") &&
    value === "DRFFR"
  ) {
    return false;
  } else if (
    (key === "UHID" || key === "IPDNo" || key === "ReferalPro") &&
    value === "PROR"
  ) {
    return false;
  } else if (
    (key === "Doctor" || key === "Department" || key === "ReportTypeFormat") &&
    value === "DCR"
  ) {
    return false;
  } else {
    return true;
  }
};

export const handleSaveBloodBankPayload = (
  tableData,
  data,
  payload,
  location,
  ip,
  ItemIndexValue,
  localdata
) => {
  console.log(tableData);
  console.log(data);
  const splitItemID = ItemIndexValue?.ItemID?.split("#");

  const dtItem = tableData.map((item) => ({
    itemID: Number(splitItemID[0]) || 0,
    categoryID: Number(item?.Category) || 0,
    rate: 0,
    quantity: Number(item?.Quantity) || 0,
    date: String(data?.admitDate) || "",
    tnxTypeID: 0,
    subCategoryID: Number(ItemIndexValue?.SubCategoryID) || 0,
    configID: 0,
    ledgerTransactionNo: 0,
    toDate: String(item?.ReserveDate) || "",
    doctorID: Number(item?.DoctorID) || 0,
    docCharges: 0,
    rateListID: 0,
    ipAddress: String(ip) || "",
    pageUrl: String(pathname),
    itemCode: 0,
    itemName: String(item?.itemName) || "",
    scheduleChargeID: String(item?.scheduleChargeID) || "",
    roomID: Number(data?.roomId) || 0,
    patientType: String(data?.patientType) || "",
    pid: String(data?.patientID) || "",
    panelID: String(data?.panelID) || 0,
    tid: Number(data?.transactionID) || 0,
    ipdCaseTypeID: Number(item?.ipdCaseTypeID) || 0,
    referenceCode: String(data?.referenceCode) || "",
    time: String(item?.Time) || "",
    transNo: String(data?.ipdno) || "",
    amount: 0,
    discountPercentage: 0,
    discAmt: 0,
    typeID: Number(ItemIndexValue[3]) || 0,
    sampleType: "",
    type: "",
    isOutSource: 0,
    rateItemCode: "",
    remark: "",
    coPayPercent: 0,
    isCancel: 0,
    isUrgent: 0,
    isAdvance: 0,
    emergencyNo: "",
    deptLedgerNo: String(localdata?.deptLedgerNo) || "",
  }));

  return { dtItem: dtItem };
};

export const handleActiveInputVoiceToText = (activeInput) => {
  if (
    activeInput === "Allergies" ||
    activeInput === "ConfidentialData" ||
    activeInput === "Remarks" ||
    activeInput === "ImpressionDiagnosis" ||
    activeInput === "CVS" ||
    activeInput === "General" ||
    activeInput === "PA" ||
    activeInput === "RS" ||
    activeInput === "RS" ||
    activeInput === "ENT" ||
    activeInput === "CNS"
  ) {
    return true;
  } else {
    return false;
  }
};

export const handleMultiSelectOptions = (state, label, value) => {
  return state?.map((item, _) => {
    return {
      name: item[label],
      code: item[value],
    };
  });
};

export const MRDPatientSearchMRDRecievedPayload = async (data) => {
  const response = data?.filter((items, _) => items?.chkBox);
  if (response?.length > 0) {
    return response?.map((items, _) => {
      return {
        chkBox: Boolean(items?.chkBox),
        transactionID: String(items?.transactionID),
      };
    });
  } else {
    notify("Please Select One", "error");
    return [];
  }
};

export const MRDFileRegisterSavePayload = (
  patientDetails,
  tableData,
  dtfileno
) => {
  console.log(patientDetails, tableData);

  let docsg = [];
  let fileNo = "";
  tableData?.map((val) => {
    if (
      val?.a === "true" ||
      val?.b === "true" ||
      val?.c === "true" ||
      val?.d === "true"
    ) {
      let obj = {
        status1: val?.a === "true" ? true : false,
        status2: val?.b === "true" ? true : false,
        status3: val?.c === "true" ? true : false,
        status4: val?.d === "true" ? true : false,
        qty: val?.docQty ? val?.docQty : "",
        docID: val?.documentID ? val?.documentID : "",
        fileDetID: val?.fileDetID ? val?.fileDetID : "",
      };
      fileNo += val?.fileDetID ? val?.fileDetID : "";
      docsg.push(obj);
    }
  });

  const { type, transactionID, patientID } = patientDetails;
  const data = {
    type: String(type),
    // counter: "",
    tid: String(transactionID),
    pid: String(patientID),
    fileNo: dtfileno?.fileid ? dtfileno?.fileid : "",
    // ddlFileNo: true,
    // remarks: "",
    // cmbAlmirah: false,
    // additional: "string",
    // room: "string",
    // almirah: "string",
    // shelf: "string",
    dataList: {
      billNo: patientDetails?.billNo ? patientDetails?.billNo : "",
      type: type,
    },
    docsg: docsg,
  };
  return data;
};

export const MRDSaveSentFilePayload = (tableData) => {
  const obj = {
    ageFrom: "",
    ageTo: "",
    deptId: "",
    dischargeType: "",
    doctorId: "",
    fromDate: "",
    panelId: "",
    parentPanelId: "",
    patientId: "",
    patientName: "",
    roomType: "",
    todate: "",
    transactionId: "",
    fileType: 0,
    pType: "",
    fileStatus: "",
  };

  const tableDataChecked = tableData?.filter((ele, _) => ele?.isChecked);

  return tableDataChecked.map((row, _) => {
    const { PatientID, TransactionID } = row;
    return {
      ...obj,
      patientId: String(PatientID),
      transactionId: String(TransactionID),
    };
  });
};

export const EmgPatientSaveReg = (payloadData, singlePatientData, hashcode) => {
  // console.log("a",payloadData,hashcode)
  // console.log("singlePatientData",singlePatientData)

  return {
    pmh: {
      patientID: singlePatientData?.PatientID
        ? singlePatientData?.PatientID
        : "",
      doctorID: payloadData?.DoctorID ? payloadData?.DoctorID?.toString() : "",
      patient_type: singlePatientData?.patientType
        ? singlePatientData?.patientType
        : "",
      purpose: "",
      panelID: payloadData?.panelID?.PanelID
        ? payloadData?.panelID?.PanelID
        : 0,
      parentID: payloadData?.panelID?.ParentPanelID
        ? payloadData?.panelID?.ParentPanelID
        : 0,
      referedBy: payloadData?.referDoctorID
        ? payloadData?.referDoctorID.toString()
        : "",
      // refer doctor ID
      hashCode: hashcode ? hashcode : "",
      // hashcode api opd service booking
      scheduleChargeID: 1,
      // check from ipd
      patientTypeID: singlePatientData?.PatientTypeID
        ? singlePatientData?.PatientTypeID
        : 0,
      panelPaybleAmt: 1.0,
      patientPaybleAmt: 1.0,
      panelPaidAmt: 1.0,
      patientPaidAmt: 1.0,
      kinRelation: singlePatientData?.Relation
        ? singlePatientData?.Relation
        : "",
      kinName: singlePatientData?.RelationName
        ? singlePatientData?.RelationName
        : "",
      kinPhone: singlePatientData?.RelationPhoneNo
        ? singlePatientData?.RelationPhoneNo
        : "",
      cardNo: singlePatientData?.CardNo ? singlePatientData?.CardNo : "",
      policyNo: singlePatientData?.PolicyNo ? singlePatientData?.PolicyNo : "",
      expiryDate: payloadData?.panelID?.PolicyExpiry
        ? moment(payloadData?.panelID?.PolicyExpiry, "DD-MMM-YYYY").format(
          "YYYY-MM-DD"
        )
        : "0001-01-01",
      cardHolderName: singlePatientData?.CardHolderName
        ? singlePatientData?.CardHolderName
        : "",
      relationWith_holder: payloadData?.panelID?.PolciyCardHolderRelation
        ? payloadData?.panelID?.PolciyCardHolderRelation
        : "",
      //card holder relation Seft ,other
      panelIgnoreReason: "",
      // blanck
      proId: payloadData?.proId ? payloadData?.proId : 0,
      isVisitClose: 1,
      typeOfReference: singlePatientData?.TypeOfReference
        ? singlePatientData?.TypeOfReference
        : "",
      patient_Income: singlePatientData?.Patient_Income
        ? singlePatientData?.Patient_Income
        : "",
      occupation: singlePatientData?.Occupation
        ? singlePatientData?.Occupation
        : "",
      education: "",
      // blank
      triagingCode: payloadData?.TriageCode?.value
        ? Number(payloadData?.TriageCode?.value)
        : 0,
      // bind triagcode from patient search
      corporatePanelID: payloadData?.panelID?.PanelCroporateID
        ? payloadData?.panelID?.PanelCroporateID
        : 0,
      referralTypeID: payloadData?.panelID?.referalTypeID?.value
        ? Number(payloadData?.panelID?.referalTypeID?.value)
        : 0,
      // refertype id
      occupationId: "",
      // blank
      educationID: "",
      // blank
      feesPaid: 0.0,
      source: "Emergency",
      employeeDependentName: payloadData?.panelID?.PanelCardName
        ? payloadData?.panelID?.PanelCardName
        : "",
      // name on card on panelID
      dependentRelation: payloadData?.panelID?.PolciyCardHolderRelation
        ? payloadData?.panelID?.PolciyCardHolderRelation
        : "",
      // card holder relation
      admission_Type: "Emergency",
      mlC_NO: singlePatientData?.MLC_NO ? singlePatientData?.MLC_NO : "",
      mlC_Type: singlePatientData?.MLC_Type ? singlePatientData?.MLC_Type : "",
    },
    roomType: payloadData?.RoomType?.value
      ? payloadData?.RoomType?.value.toString()
      : "",
    roomNo: payloadData?.RoomBedNo?.value
      ? Number(payloadData?.RoomBedNo?.value)
      : 0,
    patientFullName: singlePatientData?.PName ?? "",
    ipAddress: ip,
    pageURL: String(pathname),
  };
};

export const BillingSavePayload = (
  singlePatientData,
  BindResource,
  CTBSelectedList,
  paymentMethod,
  dataFromChild,
  CTBList,
  location,
  hashcode
) => {
  console.log("singlePatientData", singlePatientData);
  console.log("BindResource", BindResource);
  console.log("CTBSelectedList", CTBSelectedList);
  console.log("paymentMethod", paymentMethod);
  console.log("dataFromChild", dataFromChild);
  console.log("CTBList", CTBList);
  const data = {
    typeOfTnx: String(CTBSelectedList[0]?.TypeOfTnx),
    grossAmount: Number(CTBSelectedList[0]?.GrossAmount),
    netAmount: Number(CTBSelectedList[0]?.NetAmount),
    discountOnTotal: 0,
    roundOff: Number(CTBSelectedList[0]?.RoundOff),
    patientID: String(CTBSelectedList[0]?.PatientId),
    panelID: Number(CTBSelectedList[0]?.PanelID),
    transactionID: Number(CTBSelectedList[0]?.TransactionID),
    uniqueHash: String(hashcode?.data),
    patientType: String(CTBSelectedList[0]?.Patient_Type) || "",
    discountApproveBy: String(CTBSelectedList[0]?.DiscountApprovedBy) || "",
    discountReason: String(CTBSelectedList[0]?.DiscountReason) || "",
  };
  const dataLTDList = CTBSelectedList?.map((ele) => ({
    entryDate: moment(new Date()).format("YYYY-MM-DD"),
    itemID: String(ele?.ItemID),
    subCategoryID: String(ele?.SubCategoryID),
    rate: String(ele?.Rate),
    quantity: String(ele?.Quantity),
    discountPercentage: Number(ele?.DiscountPercentage),
    isPayable: Number(ele?.Ispayable),
    configID: String(ele?.ConfigID),
    coPayPercent: String(ele?.CoPayPercent),
    itemName: String(ele?.ItemName),
    doctorID: Number(ele?.DoctorID),
    ipdCaseTypeID: Number(ele?.IPDCaseTypeID),
    rateListID: Number(ele?.RateListID),
    rateItemCode: String(ele?.rateItemCode),
    roomID: Number(ele?.RoomID),
    typeOfTnx: String(ele?.TypeOfTnx),
    igstPercent: String(ele?.IGSTPercent),
    cgstPercent: String(ele?.CGSTPercent),
    sgstPercent: String(ele?.SGSTPercent),
    hsnCode: "",
    gstType: String(ele?.GSTType),
    pageName: location?.pathname ? String(location?.pathname) : "",
  }));
  const PLIList = CTBSelectedList?.map((ele) => ({
    isSampleCollected: String(ele?.IsSampleCollected),
    investigation_ID: String(ele?.Investigtaion_ID),
    remarks: String(ele?.Remark),
    isUrgent: Number(ele?.IsUrgent),
    currentAge: String(ele?.CurrentAge),
    isOutSource: Number(ele?.IsOutSource),
    outSourceLabID: Number(ele?.OutSourceLabID),
    scRequestdatetime: String(ele?.RequestDateTime),
  }));

  const requestBodys = {
    dataLT: data,
    dataLTD: dataLTDList,
    pli: PLIList,
    patientTypeID: "",
    membershipNo: "",
    ipAddress: ip,
  };

  return { ...requestBodys };
};

export const handleMultiSelectOptionsSelected = (
  state,
  SelectedData,
  returnLabel,
  returnValue,
  checkvalue,
  checklabel
) => {
  const splitData = SelectedData.split(",");

  const returnArray = [];

  for (let i = 0; i < splitData.length; i++) {
    const data = splitData[i];

    const matchData = state?.find((ele, _) => ele[checkvalue] === data);
    returnArray.push({
      [returnLabel]: matchData[checklabel],
      [returnValue]: matchData[checkvalue],
    });
  }

  return returnArray;
};

export const SaveEmgServicePayload = (payload, pDetail, values) => {
  let itemDetailList = [];
  let ptDetailList = [];
  console.log("ASDddddssssssssssssssssssss", payload, pDetail);
  payload?.map((val) => {
    let amount = Number(val?.Rate) * Number(val?.Qty);

    ptDetailList.push({
      patientTest_ID: "0",
      isUrgent: Number(val?.IsUrgent),
    });
    let itemDetails = {
      itemName: val?.autoCompleteItemName,
      type: val?.labType ? val?.labType : "",
      type_ID: val?.type_ID,
      doctorID: String(val?.doctor?.value ? val?.doctor?.value : ""),
      subCategoryID: String(val?.subCategoryID ? val?.subCategoryID : ""),
      amount: amount,
      rate: Number(val?.Rate),
      quantity: Number(val?.Qty),
      discAmt: amount * Number(val?.Discount).toFixed(ROUNDOFF_VALUE) * 0.01,
      discountPercentage: Number(val?.Discount),
      docCollectAmt: 0,
      salesID: "",
      itemID: String(val?.item_ID),
      isPackage: 0,
      packageID: "0",
      discountReason: values?.discountReason?.value
        ? values?.discountReason?.value
        : "",
      tnxTypeID: Number(val?.tnxType ? val?.tnxType : 0),
      rateListID: val?.ID ? val?.ID : 0,
      roundOff: 0,
      coPayPercent: Number(val?.OPDCoPayPercent ? val?.OPDCoPayPercent : 0),
      isPayable: Number(val?.IsPayble ? val?.IsPayble : 0),
      isPanelWiseDisc:
        Number(val?.OPDPanelDiscPercent ? val?.OPDPanelDiscPercent : 0) > 0
          ? 1
          : 0,
      panelCurrencyCountryID: 1,
      // API end
      panelCurrencyFactor: 1.2,
      // API end
      rateItemCode: String(val?.ItemCode ? val?.ItemCode : ""),
      sampleType: String(val?.sample ? val?.sample : ""),
      categoryID: String(val?.Category?.value),
      bookingDate: moment(val?.DATE, "DD-MMM-YYYY").format("YYYY-MM-DD"),
      bookingTime: moment().format("hh:mm A"),
      bookinginModality: 0,
      // Done
      appointmentNo: 0,
      // Done
      isOutSource: val?.isOutSource ? Number(val?.isOutSource) : 0,
      gstType: val?.gstType ? val?.gstType : "",
      igstPercent: Number(val?.igstPercent ? val?.igstPercent : "0"),
      igstAmt:
        amount -
        amount * (Number(val?.igstPercent ? val?.igstPercent : 0) / 100),
      cgstPercent: Number(val?.cgstPercent),
      cgstAmt:
        amount -
        amount * (Number(val?.cgstPercent ? val?.cgstPercent : 0) / 100),
      sgstPercent: Number(val?.sgstPercent),
      sgstAmt:
        amount -
        amount * (Number(val?.sgstPercent ? val?.sgstPercent : 0) / 100),
      typeOfApp: "",
      // Done,
      remark: String(val?.Remarks ? val?.Remarks : ""),
      isMobileBooking: 0,
      // Done
      appointmentID: 0,
      // Done
      isSlotWiseToken: 0,
      // Done
      appointmentDateTime: "",
      // Done
      isDocCollect: 0,
      // Done
      isAdvance: Number(val?.isadvance ? val?.isadvance : "0"),
      // Done
      packageType: 0,
      // Done
      investigation_ID: val?.labType === "LAB" ? val?.type_ID : "0",
      //
      ledgerTransactionNo: String(pDetail?.LTnxNo ? pDetail?.LTnxNo : 0),
      transactionID: String(pDetail?.TID ? pDetail?.TID : 0),
      ipdCaseTypeID: pDetail?.IPDCaseTypeID,
      //getEmergencyPatientDetail
      roomID: Number(pDetail?.RoomId ? pDetail?.RoomId : 0),
      entryDate: "",
      ipAddress: ip,
      pageName: "ServicePage",
    };
    itemDetailList.push(itemDetails);
  });
  let data = {
    ltd: itemDetailList,
    pt: ptDetailList,
    currentAge: pDetail?.AgeSex?.split("/")[0]
      ? pDetail?.AgeSex?.split("/")[0]
      : "",
    pid: pDetail?.patientID ? pDetail?.patientID : "",
  };

  return data;
};
export const handleCalculateSettlementInvoice = (obj, ConversionFactor) => {
  const {
    ReceivedAmount,
    PreTDSAmount,
    PreWriteOffAmount,
    PrededucationAmt,
    PanelPaybleAmt,
    CurrentReceiveAMt,
    CurrentTDSAmt,
    CurrentWriteOffAmt,
    CurrentDeductionAmt,
  } = obj;

  const PreviousAmt =
    Number(ReceivedAmount) +
    Number(PreTDSAmount) +
    Number(PreWriteOffAmount) +
    Number(PrededucationAmt);

  const CurrentBalanceAmt =
    (Number(CurrentReceiveAMt) +
      Number(CurrentTDSAmt) +
      Number(CurrentWriteOffAmt) +
      Number(CurrentDeductionAmt)) *
    ConversionFactor;

  const calculateBalanceAmount =
    Number(PanelPaybleAmt) - Number(PreviousAmt) - Number(CurrentBalanceAmt);

  const BalanceBase = Number(calculateBalanceAmount).toFixed(ROUNDOFF_VALUE);

  const BalanceSpecific = Number(
    Number(BalanceBase) / Number(ConversionFactor)
  ).toFixed(ROUNDOFF_VALUE);

  return { BalanceBase, BalanceSpecific };
};

const handleCalculationData = (item, PanelPaybleAmt, currencyFactor, data) => {
  // Helper function for simplifying percentage calculations
  const handleSimplifying = (key) => {
    // Using parseFloat for safety
    return (Number(key) / parseFloat(PanelPaybleAmt)) * 100;
  };

  // Calculate specific percentages
  const ReceiveAmtSpecificPercentage = handleSimplifying(
    data?.CurrentReceiveAMt
  );
  const TDSSpecificPercentage = handleSimplifying(data?.CurrentTDSAmt);
  const WriteOffAmtSpecificPercentage = handleSimplifying(
    data?.CurrentWriteOffAmt
  );
  const AcceptableDeductionSpecificPercentage = handleSimplifying(
    data?.CurrentDeductionAmt
  );

  // Function to calculate specific amounts based on outstanding amount
  const handleOutstandingAmount = (percentage) => {
    // Calculate the outstanding amount while minimizing floating-point issues
    const outstandingAmount = (percentage * item?.OutStanding) / 100;

    // Round to 2 decimal places using toFixed and parseFloat
    return parseFloat(outstandingAmount.toFixed(2));
  };

  // Calculating specific amounts
  item.ReceiveAmtSpecific = handleOutstandingAmount(
    ReceiveAmtSpecificPercentage
  );
  item.TDSSpecific = handleOutstandingAmount(TDSSpecificPercentage);
  item.WriteOffAmtSpecific = handleOutstandingAmount(
    WriteOffAmtSpecificPercentage
  );
  item.AcceptableDeductionSpecific = handleOutstandingAmount(
    AcceptableDeductionSpecificPercentage
  );

  item.ReceiveAmt = item.ReceiveAmtSpecific * currencyFactor;

  item.TDSAmt = item.TDSSpecific * currencyFactor;

  item.WriteOffAmt = item.WriteOffAmt * currencyFactor;

  item.AcceptableDeduction = item.AcceptableDeduction * currencyFactor;

  return item;
};

export const handleTableDisdustionData = (
  tableData,
  PanelPaybleAmt,
  currencyFactor,
  data
) => {
  return tableData?.map((item, _) => {
    if (item?.isChecked) {
      const response = handleCalculationData(
        {
          ...item,
        },
        PanelPaybleAmt,
        currencyFactor,
        data
      );
      return { ...response };
    } else {
      return item;
    }
  });
};

export const SaveCreateRequisitionPayload = (
  ItemNameList,
  values,
  localData
) => {
  console.log("LocalData", values);
  let indexItem = [];
  ItemNameList?.map((val, index) => {
    if (val?.ItemId > 0) {
      indexItem.push(val);
    }
  });

  const itemDetails = indexItem?.map((val) => ({
    itemName: String(val?.value),
    itemID: String(val?.ItemId),
    netQuantity: Number(val?.Quantity),
    purchaseUnit: String(val?.Unit),
    remarks: String(val?.Remarks ? val?.Remarks : ""),
  }));
  let data = {
    itemDetails: itemDetails,
    storeId: String(values?.StoreType),
    narration: String(values?.Narration),
    requestType: String(values?.RequisitionType),
    purchaseRequestNo: "",
    deptLedgerNo: String(localData?.deptLedgerNo),
    toDeptLedgerNo: String(values?.Department),
  };

  return data;
};
export const SaveConsumeItemsPayload = (payload, tableData) => {
  console.log(payload);
  console.log(tableData);

  const itemDetails = tableData?.map((val) => ({
    stockID: String(val?.stockid),
    itemID: Number(val?.ItemID),
    itemName: String(val?.ItemName),
    batchNumber: String(val?.BatchNumber),
    expiry: val?.MedExpiryDate,
    subCategory: Number(val?.SubCategoryID),
    unitType: 10,
    unitPrice: Number(val?.UnitPrice),
    mrp: val?.MRP,
    qty: Number(val?.AvlQty),
    issueQty: 10,
    amount: 10,
    isExpirable: 10,
    purTaxPer: 10,
    saleTaxPer: 10,
  }));

  const data = {
    remarks: String(payload?.Remarks),
    ipAddress: ip,
    storeType: Numbber(payload?.StoreType),
    dtItem: itemDetails,
  };

  return data;
};

export const payloadEmgMedicineReq = (payload, data) => {
  let setPayload = [];
  payload?.map((val) => {
    let obj = {
      itemID: String(val?.medicineName?.ItemID?.split("#")[0]),
      dose: String(val?.Dose ? val?.Dose : ""),
      time: String(val?.Times?.label ? val?.Times?.label : ""),
      duration: String(val?.Duration?.label ? val?.Duration?.label : "0"),
      route: String(val?.Route?.label ? val?.Route?.label : ""),
      tid: String(data?.TID),
      pid: data?.patientID ? data?.patientID : "",
      doc: "",
      lnxNo: String(data?.LTnxNo),
      medicineName: String(
        val?.medicineName?.ItemName ? val?.medicineName?.ItemName : ""
      ),
      dept: String(val?.Department?.value ? val?.Department?.value : ""),
      quantity: String(val?.Quantity ? val?.Quantity : 0),
      unitType: String(
        val?.medicineName?.ItemID?.split("#")[3]
          ? val?.medicineName?.ItemID?.split("#")[3]
          : 0
      ),
      indentType: String(
        val?.RequisitionType?.label ? val?.RequisitionType?.label : ""
      ),
      doctorID: String(data?.DoctorID ? data?.DoctorID : 0),
      ipdCaseType_ID: String(data?.ipdCaseType_ID ? data?.ipdCaseType_ID : ""),
      // billing page
      room_ID: String(data?.RoomId),
      prescribeID: String(userData?.employeeID),
      IsDischargeMedicine: 0,
    };
    setPayload.push(obj);
  });

  return setPayload;
};

export const SaveDialysisPayload = (value, patientDetail) => {
  // console.log("value?.saveType", value, patientDetail)
  let payload = {
    did: value?.UID ? value?.UID : "",
    saveType: value?.saveType,
    patientId: patientDetail?.PatientID ? patientDetail?.PatientID : "",
    transactionId: patientDetail?.TID ? patientDetail?.TID : "",
    entryDate: moment(value?.entryDate).format("DD-MMM-YYYY"),
    // "29-Oct-2024"
    dialysisNo: value?.Dialysis_NO ? value?.Dialysis_NO : "",
    dialyzerReUse: value?.Dialyzer_Reuse ? value?.Dialyzer_Reuse : "",
    weightPre: "",
    weightPost: "",
    weightGain: "",
    tempPre: "",
    tempPost: "",
    bpPre: "",
    bpPost: "",
    hemparinAdministered: value?.Hemparn_administered
      ? value?.Hemparn_administered
      : "",
    durationOfHd: value?.Duration_Ofhd ? value?.Duration_Ofhd : "",
    ufrTmp: value?.ufr_tmp ? value?.ufr_tmp : "",
    venousPressure: value?.Venous_pressure ? value?.Venous_pressure : "",
    bloodFlow: value?.Blood_flow ? value?.Blood_flow : "",
    emergencyNo: patientDetail?.EmergencyNo ? patientDetail?.EmergencyNo : "",
    miscellaneous: value?.miscellaneous ? value?.miscellaneous : "",
  };

  return payload;
};

export const BloodBankSavePayloadEMG = (data, pDetail) => {
  console.log("data", data);
  console.log("pDetail", pDetail);

  let list = [];
  data?.map((val) => {
    let obj = {
      itemID:
        val?.SearchBloodBankByWord?.value?.split("#")[0] &&
        Number(val?.SearchBloodBankByWord?.value?.split("#")[0]),
      categoryID: Number(val?.SearchBloodBankByWord?.CategoryID),
      rate: Number(val?.rate?.rate),
      quantity: Number(val?.Quantity ? val?.Quantity : 0),
      date: moment(val?.ReserveDate).format("DD-MM-YYYY"),
      tnxTypeID: Number(val?.SearchBloodBankByWord?.TnxTypeId),
      subCategoryID: Number(val?.SearchBloodBankByWord?.SubCategoryID),
      configID: Number(val?.SearchBloodBankByWord?.SubCategoryID),
      ledgerTransactionNo: Number(pDetail?.LTnxNo ? pDetail?.LTnxNo : 0),
      toDate: moment(val?.ReserveDate).format("DD-MM-YYYY"),
      doctorID: Number(val?.Doctor?.value ? val?.Doctor?.value : 0),
      docCharges: 0,
      rateListID: Number(val?.rate?.id),
      ipAddress: ip,
      pageUrl: String(pathname),
      itemCode: Number(val?.rate?.itemCode),
      itemName: val?.SearchBloodBankByWord?.label,
      scheduleChargeID: String(val?.rate?.scheduleChargeID),
      roomID: Number(pDetail?.RoomId),
      patientType: "EMG",
      pid: pDetail?.PatientID,
      panelID: Number(pDetail?.PanelID ? pDetail?.PanelID : 0),
      tid: Number(pDetail?.TID ? pDetail?.TID : 0),
      ipdCaseTypeID: Number(
        pDetail?.IPDCaseTypeID ? pDetail?.IPDCaseTypeID : 0
      ),
      referenceCode: pDetail?.ReferenceCodeOPD,
      time: moment(val?.Time).format("hh:mm A"),
      transNo: pDetail?.EmergencyNo ? pDetail?.EmergencyNo : "0",
      amount: Number(val?.rate?.rate) * Number(val?.Quantity),
      discountPercentage: 0,
      discAmt: 0,
      typeID: Number(
        val?.SearchBloodBankByWord?.value?.split("#")[3]
          ? val?.SearchBloodBankByWord?.value?.split("#")[3]
          : 0
      ),
      sampleType: "EMG",
      type: "EMG",
      isOutSource: 0,
      rateItemCode: val?.rate?.itemCode,
      remark: "",
      coPayPercent: 0,
      isCancel: 0,
      isUrgent: 0,
      isAdvance: 0,
      emergencyNo: pDetail?.EmergencyNo ? pDetail?.EmergencyNo : "",
      deptLedgerNo: String(userData?.deptLedgerNo),
    };
    list.push(obj);
  });
  let payload = {
    dtItem: list,
  };
  return payload;
};

export const SaveObjerrvationResutlEntry = (
  searchdata,
  tabledata,
  resultStatus,
  holdReason,
  IsCriticalRadiology,
  base64 = ""
) => {
  const finalData = [...tabledata];
  const finalDataReportType = finalData?.filter((ele) => ele?.reportType == 5);
  console.log(tabledata, "tableData in ");
  let list = [];
  tabledata?.map((val) => {
    let obj = {
      ...val,
      valueDLC: val.Value,
      Value: val.Value,
      MachineID: "",
      id: val.id || "",
      inV_PrintSeparate: val.inV_PrintSeparate || "",
      obS_PrintSeparate: val.obS_PrintSeparate || "",
      labInvestigation_ID: val.labInvestigation_ID || "",
      investigation_ID: val.investigation_ID || "",
      pliid: val.pliid || "",
      result_Flag: val.result_Flag || "",
      isHold: val.isHold || "",
      machinename: val.machinename || "",
      machineID1: val.machineID1 || "",
      machineID2: "",
      machineID3: "",
      defaultValue: val.defaultValue || "",
      reading1: val.reading1 || "",
      reading2: val.reading2 || "",
      reading3: val.reading3 || "",
      investigation_ID1: "",
      defaultReading: val.defaultReading || "",
      rangetype: val.rangetype || "",
      reportType: val.reportType || "",
      parentID: val.parentID || "",
      child_Flag: val.child_Flag || "",
      formula: val.formula || "",
      print_Sequence: val.print_Sequence || "",
      isMultiChild: val.isMultiChild || "",
      // IsCriticalRadiology: val?.IsCriticalRadiology === "Yes" ? 1 : 0,
      help: val.help || "",
      isComment: val.isComment || "",
      resultRequired: val.resultRequired || "",
      isPartial_Result: val.isPartial_Result || "",
      dlcCheck: val.dlcCheck || "",
      gender: val.gender || "",
      ageInDays: val.ageInDays || "",
      inv: val.inv || "",
      isreflex: val.isReflex || "",
      isAmr: val.isAmr || "",
      amrMin: val.amrMin || "",
      amrMax: val.amrMax || "",
      autoMin: "",
      autoMax: "",
      reflexMin: val.reflexMin || "",
      reflexMax: val.reflexMax || "",
      holdObsId: val.holdObsId || "",
      barcodeNo: val.barcodeNo || "",
      testName: val.testName || "",
      isPackage: val.isPackage || "",
      showAbnormalAlert: val.showAbnormalAlert || "",
      showDeltaReport: val.showDeltaReport || "",
      requiredField: val.requiredField || "",
      subCategoryID: val.subCategoryID || "",
      value1: val.value1 || "",
      manualValue: val.manualValue || "",
      labNo: val.labNo || "",
      labObservation_ID: val.labObservation_ID || "",
      test_ID: val.test_ID || "",
      result_Date: "",
      result_Time: "",
      description: val.description || "",
      minValue: val.minValue || "",
      maxValue: val.maxValue || "",
      labObservationName: val.labObservationName || "",
      priorty: val.priorty || "",
      invPriorty: "",
      readingFormat: val.readingFormat || "",
      displayReading: val.displayReading || "",
      organismID: "",
      isOrganism: "",
      paramEnteredBy: "",
      paramEnteredByName: "",
      macReading: "",
      dtMacEntry: val.dtMacEntry || "",
      machineID: val.machineID || "",
      method: val?.method,
      printMethod: val.printMethod || "",
      ledgerTransactionNo: val.ledgertransactionNo || "",
      isCommentField: "",
      resultRequiredField: "",
      minCritical: val.minCritical || "",
      maxCritical: val.maxCritical || "",
      approved: val.approved || "",
      approvedBy: val.approvedBy || 0,
      approvedDate: "",
      approvedName: "",
      resultEnteredBy: "",
      resultEnteredDate: "",
      resultEnteredName: "",
      abnormalValue: val.abnormalValue || "",
      isBold: val.isBold || "",
      isUnderLine: val.isUnderLine || "",
      isMic: val.isMic || "",
      printSeparate: "",
      updateID: "",
      updateName: "",
      updatedate: "",
      flag: val.flag || "",
      isrerun: val.isrerun || "",
      pliIsReRun: val.pliIsReRun || "",
      saveInv: "true",
    };
    list.push(obj);
  });
  const finalList = list?.filter((ele) => ele?.isChecked);
  let payload = {
    resultStatus: resultStatus,
    IsCriticalRadiology: IsCriticalRadiology,
    approvedBy: tabledata[0]?.DoctorId || tabledata[2]?.pDoctorID, // tabledata[0]?.DoctorId || "11",
    approvalName: "",
    holdRemarks: holdReason || "",
    criticalSave: "",
    notApprovalComment: "",
    macValue: "",
    machineID_Manual: "0",
    findingValue: finalDataReportType[0]?.findingValue ?? "",
    mobileApproved: 0,
    isDefaultSign: "",
    mobileEMINo: "",
    mobileNo: "",
    mobileLatitude: "",
    mobileLongitude: "",
    ipAddress: ip,
    datas: finalList,
    markAsView: tabledata[0].MarkAsView,
    ApprovedBy1: Number(
      tabledata[0]?.ApprovedBy1 || tabledata[2]?.approvedBy1 || 0
    ),
    ApprovedBy2: Number(
      tabledata[0]?.ApprovedBy2 || tabledata[2]?.approvedBy2 || 0
    ),
    report: base64,
    Template_Desc: "",
    Temp_Head: finalDataReportType[0]?.newTemplate ?? "",
    Template_ID: "",
    TemplateType: tabledata[0]?.isNewTemplate,
  };
  return payload;
};

export const SaveNotApprovedResutlEntry = (
  base64 = "",
  tabledata,
  resultStatus,
  holdReason,
  IsCriticalRadiology
) => {
  const finalData = [...tabledata];
  const finalDataReportType = finalData?.filter((ele) => ele?.reportType == 5);
  console.log(tabledata, "tableData in ");
  let list = [];
  tabledata?.map((val) => {
    let obj = {
      ...val,
      valueDLC: val.Value,
      Value: val.Value,
      MachineID: "",
      id: val.id || "",
      inV_PrintSeparate: val.inV_PrintSeparate || "",
      obS_PrintSeparate: val.obS_PrintSeparate || "",
      labInvestigation_ID: val.labInvestigation_ID || "",
      investigation_ID: val.investigation_ID || "",
      pliid: val.pliid || "",
      result_Flag: val.result_Flag || "",
      isHold: val.isHold || "",
      machinename: val.machinename || "",
      machineID1: val.machineID1 || "",
      machineID2: "",
      machineID3: "",
      defaultValue: val.defaultValue || "",
      reading1: val.reading1 || "",
      reading2: val.reading2 || "",
      reading3: val.reading3 || "",
      investigation_ID1: "",
      defaultReading: val.defaultReading || "",
      rangetype: val.rangetype || "",
      reportType: val.reportType || "",
      parentID: val.parentID || "",
      child_Flag: val.child_Flag || "",
      formula: val.formula || "",
      print_Sequence: val.print_Sequence || "",
      isMultiChild: val.isMultiChild || "",
      // IsCriticalRadiology: val?.IsCriticalRadiology === "Yes" ? 1 : 0,
      help: val.help || "",
      isComment: val.isComment || "",
      resultRequired: val.resultRequired || "",
      isPartial_Result: val.isPartial_Result || "",
      dlcCheck: val.dlcCheck || "",
      gender: val.gender || "",
      ageInDays: val.ageInDays || "",
      inv: val.inv || "",
      isreflex: val.isReflex || "",
      isAmr: val.isAmr || "",
      amrMin: val.amrMin || "",
      amrMax: val.amrMax || "",
      autoMin: "",
      autoMax: "",
      reflexMin: val.reflexMin || "",
      reflexMax: val.reflexMax || "",
      holdObsId: val.holdObsId || "",
      barcodeNo: val.barcodeNo || "",
      testName: val.testName || "",
      isPackage: val.isPackage || "",
      showAbnormalAlert: val.showAbnormalAlert || "",
      showDeltaReport: val.showDeltaReport || "",
      requiredField: val.requiredField || "",
      subCategoryID: val.subCategoryID || "",
      value1: val.value1 || "",
      manualValue: val.manualValue || "",
      labNo: val.labNo || "",
      labObservation_ID: val.labObservation_ID || "",
      test_ID: val.test_ID || "",
      result_Date: "",
      result_Time: "",
      description: val.description || "",
      minValue: val.minValue || "",
      maxValue: val.maxValue || "",
      labObservationName: val.labObservationName || "",
      priorty: val.priorty || "",
      invPriorty: "",
      readingFormat: val.readingFormat || "",
      displayReading: val.displayReading || "",
      organismID: "",
      isOrganism: "",
      paramEnteredBy: "",
      paramEnteredByName: "",
      macReading: "",
      dtMacEntry: val.dtMacEntry || "",
      machineID: val.machineID || "",
      method: val?.method,
      printMethod: val.printMethod || "",
      ledgerTransactionNo: val.ledgertransactionNo || "",
      isCommentField: "",
      resultRequiredField: "",
      minCritical: val.minCritical || "",
      maxCritical: val.maxCritical || "",
      approved: val.approved || "",
      approvedBy: val.approvedBy || 0,
      approvedDate: "",
      approvedName: "",
      resultEnteredBy: "",
      resultEnteredDate: "",
      resultEnteredName: "",
      abnormalValue: val.abnormalValue || "",
      isBold: val.isBold || "",
      isUnderLine: val.isUnderLine || "",
      isMic: val.isMic || "",
      printSeparate: "",
      updateID: "",
      updateName: "",
      updatedate: "",
      flag: val.flag || "",
      isrerun: val.isrerun || "",
      pliIsReRun: val.pliIsReRun || "",
      saveInv: "true",
    };
    list.push(obj);
  });
  const finalList = list?.filter((ele) => ele?.isChecked);
  let payload = {
    resultStatus: resultStatus,
    IsCriticalRadiology: IsCriticalRadiology,
    approvedBy: tabledata[0]?.DoctorId || tabledata[2]?.pDoctorID, // tabledata[0]?.DoctorId || "11",
    approvalName: "",
    holdRemarks: holdReason || "",
    criticalSave: "",
    notApprovalComment: "",
    macValue: "",
    machineID_Manual: "0",
    findingValue: finalDataReportType[0]?.findingValue ?? "",
    mobileApproved: 0,
    isDefaultSign: "",
    mobileEMINo: "",
    mobileNo: "",
    mobileLatitude: "",
    mobileLongitude: "",
    ipAddress: ip,
    datas: finalList,
    markAsView: tabledata[0].MarkAsView,
    ApprovedBy1: Number(
      tabledata[0]?.ApprovedBy1 || tabledata[2]?.approvedBy1 || 0
    ), // tabledata[0]?.ApprovedBy1 ?? 0,
    ApprovedBy2: Number(
      tabledata[0]?.ApprovedBy2 || tabledata[2]?.approvedBy2 || 0
    ),
    report: base64,
    Template_Desc: "",
    Temp_Head: finalDataReportType[0]?.newTemplate ?? "",
    Template_ID: "",
    TemplateType: tabledata[0]?.isNewTemplate,
  };
  return payload;
};

export const purchaseSaveQuotation = (selectItems) => {
  // let setPayload = [
  let setPayload = selectItems.map((selectItem) => ({
    itemId: String(selectItem?.itemId),
    fromDate: selectItem?.fromDate,
    toDate: selectItem?.toDate,
    subcategoryID: selectItem.subcategoryID,
    vendorID: selectItem.vendorID,
    vendorName: selectItem.vendorName,
    itemName: selectItem.itemName,
    rate: selectItem?.rate,
    taxGroupID: selectItem?.taxGroupID,
    taxGroupName: selectItem?.taxGroupName,
    discountPercent: selectItem?.discountPercent || 0,
    discountAmount: selectItem?.discountAmount || 0,
    deal1: selectItem?.deal1 || 0,
    deal2: selectItem?.deal2 || 0,
    taxCalculatedOn: selectItem?.taxCalculatedOn,
    mrp: selectItem?.mrp,
    hsnCode: selectItem?.hsnCode,
    remarks: selectItem?.remarks,
    manufacturerID: selectItem?.manufacturerID,
    manufacturer: selectItem?.manufacturer,
    categoryID: selectItem?.categoryID,
    gstType: selectItem?.gstType,
    igstPercent: selectItem?.igstPercent,
    cgstPercent: selectItem?.cgstPercent,
    sgstPercent: selectItem?.sgstPercent,
    // const userData = useLocalStorage("userData", "get");
    // const ip = useLocalStorage("ip", "get");
    ipAddress: selectItem?.ipAddress,
    centreID: selectItem?.categoryID,
    deals: Number(selectItem?.deal1) + Number(selectItem?.deal2),
    currencyFactor: selectItem?.currencyFactor,
    currencyCountryID: selectItem?.currencyCountryID,
    IsDefault: selectItem?.isActive,
    taxAmount: selectItem?.taxAmount,
    unitPrice: selectItem?.unitPrice,
    isActive: selectItem?.isActive,
    profit: selectItem?.profit,
    netAmount: selectItem?.netAmount,
    grossAmount: selectItem?.grossAmount,
    totalTaxPercent: selectItem?.totalTaxPercent,
    userID: selectItem?.userID,
    userName: selectItem?.userName,
    storeType: selectItem?.storeType,
    departmentLedgerNo: selectItem?.departmentLedgerNo,
    hospitalID: selectItem?.hospitalID,
    unit: selectItem?.unit,
    minimumToleranceQty: selectItem?.minimumToleranceQty || 0,
    maximumToleranceQty: selectItem?.maximumToleranceQty || 0,
    minimumToleranceRate: selectItem?.minimumToleranceRate || 0,
    maximumToleranceRate: selectItem?.maximumToleranceRate || 0,
    currencyNotation: selectItem?.currencyNotation,
  }));
  // ];

  //  ];

  return setPayload;
};

// export const purchaseSaveQuotation = (payload, details, selectedDetails) => {
//   let setPayload = [
//     {
//       itemId: selectedDetails?.ItemId,
//       fromDate: payload?.FromDate,
//       toDate: payload?.ToDate,
//       subcategoryID: details.subCategories.CategoryID,
//       vendorID: details.supplier.ID,
//       vendorName: details.supplier.LedgerName,
//       itemName: selectedDetails.TypeName,
//       rate: payload?.rate,
//       taxGroupID: payload?.GSTGroup.id,
//       taxGroupName: payload?.GSTGroup.TaxGroup,
//       discountPercent: payload?.DiscountPercent || 0,
//       discountAmount: payload?.DiscountAmount || 0,
//       deal1: payload?.isdeal1 || 0,
//       deal2: payload?.isdeal2 || 0,
//       taxCalculatedOn: payload?.TaxCalculatedOn?.value,
//       mrp: payload?.mrp,
//       hsnCode: payload?.HSNCode,
//       remarks: payload?.Remaks,
//       manufacturerID: details?.manufacturer?.ManufactureID,
//       manufacturer: details?.manufacturer?.Name,
//       categoryID: details?.category?.CategoryID,
//       gstType: payload?.GSTGroup.TaxGroup,
//       igstPercent: payload?.GSTGroup?.IGSTPer,
//       cgstPercent: payload?.GSTGroup?.CGSTPer,
//       sgstPercent: payload?.GSTGroup?.SGSTPer,
//       // const userData = useLocalStorage("userData", "get");
//       // const ip = useLocalStorage("ip", "get");
//       ipAddress: ip,
//       centreID: userData?.centreID,
//       deals: Number(payload?.isdeal1) + Number(payload?.isdeal2),
//       currencyFactor: payload?.currrency?.currencyFactor?.[0],
//       currencyCountryID: payload?.currrency?.currencyCountryID?.[0],
//       IsDefault: payload?.IsDefault?.value,
//       taxAmount: 0,
//       unitPrice: 0,
//       isActive: 0,
//       profit: 0,
//       netAmount: 0,
//       grossAmount: 0,
//       totalTaxPercent: 0,
//       userID: "",
//       userName: "",
//       storeType: "",
//       departmentLedgerNo: "",
//       hospitalID: "",
//       unit: "",
//       minimumToleranceQty: 0,
//       maximumToleranceQty: 0,
//       minimumToleranceRate: 0,
//       maximumToleranceRate: 0,
//       currencyNotation: "",
//     },
//   ];

//   //  ];

//   return setPayload;
// };

export const SaveLabObservationCultureOpdData = (
  tabledata,
  resultStatus,
  entry,
  pdata,
  reportType,
  status
) => {
  let list = [];
  const singleArrayOfObjects = entry?.reduce((acc, arr) => acc.concat(arr), []);
  const finalOrg = singleArrayOfObjects?.map((ele) => {
    return {
      ...ele,
      testid: pdata?.Test_ID,
      EnzymeId: "",
      IPAddress: ip ? ip : "",
      Enzymename: "",
      EnzymeUnit: "",
      OrganismID: ele?.obid,
      Reporttype: reportType,
      Enzymevalue: "",
      Antibioticid: ele?.id,
      OrganismName: ele?.OrganismNameDisplayname,
      AntibioticName: ele?.name,
      OrganismGroupID: ele?.colonycount,
      labobservation: pdata?.Test_ID,
      OrganismGroupName: ele?.colonycountcomment,
      labobservation_name: "",
      LabObservationComment: "",
      labobservation_id: "",
      AntibioticInterpreatation: ele.AntiBioticInterpreatation,
      MIC: ele?.mic,
      unit: "",
    };
  });
  tabledata?.map((val) => {
    let obj = {
      ...val,
      LabNo: val?.labNo ?? "",
      AgeInDays: val?.ageInDays ?? "",
      incubationdate: val?.incubationDate ?? "",
      incubationtime: val?.incubationTime ?? "",
      mystatus: val?.myStatus ?? "",
      BarcodeNo: val?.barcodeNo ?? "",
      TestName: val?.testName ?? "",
      Dept_Sequence: val?.dept_Sequence ?? "",
      Dept: val?.dept ?? "",
      INV_PrintSeparate: val?.inV_PrintSeparate ?? "",
      OBS_PrintSeparate: val?.obS_PrintSeparate ?? "",
      description: val?.description ?? "",
      IsSampleCollected: val?.isSampleCollected ?? "",
      LabInvestigation_ID: val?.labInvestigationID ?? "",
      Investigation_ID: val?.investigationID ?? "",
      PLIID: val?.pliid ?? "",
      Test_ID: val?.testID,
      Result_Flag: val?.result_Flag ?? "",
      Approved: val?.approved ?? "",
      isHold: val?.isHold ?? "",
      Flag: val?.flag ?? "",
      Value: val?.value ?? "",
      MacReading: val?.macReading ?? "",
      MachineID: val?.machineID ?? "",
      machinename: val?.machineName ?? "",
      MachineID1: val?.machineID1 ?? "",
      MachineID2: val?.machineID2 ?? "",
      MachineID3: val?.machineID3 ?? "",
      dtMacEntry: val?.dtMacEntry ?? "",
      DefaultValue: val?.defaultValue ?? "",
      ID: val?.labObservationID ?? "",
      LabObservation_ID: val?.labObservationID ?? "",
      Reading1: val?.reading1 ?? "",
      Reading2: val?.reading2 ?? "",
      Reading3: val?.reading3 ?? "",
      LabObservationName: val?.labObservationName ?? "Comments",
      MinValue: val?.minValue ?? "",
      MaxValue: val?.maxValue ?? "",
      DisplayReading: val?.displayReading ?? "",
      DefaultReading: val?.defaultReading ?? "",
      rangetype: val?.rangeType ?? "",
      ReadingFormat: val?.readingFormat ?? "",
      AbnormalValue: val?.abnormalValue ?? "",
      IsBold: val?.isBold ?? "",
      IsUnderLine: val?.isUnderline ?? "",
      Priorty: val?.priority ?? "",
      ReportType: val?.reportType ?? "",
      ParentID: val?.parentID ?? "",
      Child_Flag: val?.childFlag ?? "",
      Formula: val?.formula ?? "",
      Method: val?.method ?? "",
      PrintMethod: val?.printMethod ?? 0,
      Print_Sequence: "",
      IsMultiChild: val?.isMultiChild ?? "",
      IsCriticalRadiology: val?.IsCriticalRadiology?.value == "Yes" ? "1" : "0",
      MinCritical: val?.minCritical ?? "",
      MaxCritical: val?.maxCritical ?? "",
      Help: val?.help ?? "",
      IsMic: val?.isMic ?? "",
      IsComment: val?.isComment ?? "",
      ResultRequired: val?.resultRequired ?? "",
      isPartial_Result: val?.isPartialResult ?? "",
      DLCCheck: val?.dlcCheck ?? "",
      isAmr: val?.isAmr ?? "",
      Isreflex: val?.isReflex ?? "",
      AmrMin: val?.amrMin ?? "",
      AmrMax: val?.amrMax ?? "",
      ReflexMin: val?.reflexMin ?? "",
      ReflexMax: val?.reflexMax ?? "",
      HoldObsId: val?.holdObsId ?? "",
      IsAttached: val?.isAttached ?? "",
      Status: val?.status ?? "",
      micro: val?.micro ?? "",
      DeptName: val?.deptName ?? "",
      InvName: val?.invName ?? "",
      Inv: val?.inv ?? "2",
    };
    list.push(obj);
  });

  let payload = {
    reportnumber: resultStatus?.reportType?.value,
    resultStatus: status,
    holdRemarks: "",
    ipAddress: ip,
    data: list,
    antibioticdata: finalOrg,
  };

  return payload;
};

export const purchaseQuotationAdd = (
  selectedDetails,
  payload,
  details,
  currencyDetails
) => {
  console.log("selectedDetailsselectedDetailsselectedDetails", selectedDetails);
  console.log("detailsdetailsdetailsdetails", details);
  console.log("Payload", payload);
  console.log("currencyDetails", currencyDetails);

  let setPayload = {
    itemId: selectedDetails?.ItemId,
    fromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
    toDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
    subcategoryID: details.subCategories.CategoryID,
    vendorID: details.supplier.ID,
    vendorName: details.supplier.LedgerName,
    itemName: selectedDetails.TypeName,
    unit: selectedDetails?.majorUnit,
    //done
    // payload?.currrency?.currencyFactor?.[0]
    // rate: payload?.rate,
    rate:
      Number(payload?.rate) / Number(payload?.currrency?.currencyFactor?.[0]),
    taxGroupID: payload?.GSTGroup.id,
    taxGroupName: payload?.GSTGroup.TaxGroupLabel,

    discountPercent: Number(payload?.DiscountPercent) || 0,
    discountAmount:
      Number(payload?.DiscountAmount) /
      Number(payload?.currrency?.currencyFactor?.[0]) || 0,

    deal1: Number(payload?.isdeal1) || 0,
    deal2: Number(payload?.isdeal2) || 0,
    taxCalculatedOn: payload?.TaxCalculatedOn?.value,
    isActive: payload?.IsDefault?.value === "True" ? 1 : 0,
    mrp: Number(payload?.mrp) / Number(payload?.currrency?.currencyFactor?.[0]),
    hsnCode: payload?.HSNCode,
    remarks: payload?.Remaks,
    manufacturerID: details?.manufacturer?.ManufactureID,
    manufacturer: details?.manufacturer?.Name,
    categoryID: details?.category?.CategoryID,
    totalTaxPercent: Number(payload?.VatPersentage) || 0,
    minimumToleranceQty: payload?.minimumToleranceQty || 0,
    maximumToleranceQty: payload?.maximumToleranceQty || 0,
    minimumToleranceRate:
      Number(payload?.minimumToleranceRate) /
      Number(payload?.currrency?.currencyFactor?.[0]) || 0,
    maximumToleranceRate:
      Number(payload?.maximumToleranceRate) /
      Number(payload?.currrency?.currencyFactor?.[0]) || 0,
    currencyNotation: payload?.currrency?.currencyFactor?.[0],
    currencyCountryID: currencyDetails?.currencyCountryID?.[0],
    gstType: payload?.GSTGroup?.TaxGroup.toUpperCase(), // toUpperCase
    igstPercent: payload?.GSTGroup?.IGSTPer,
    cgstPercent: payload?.GSTGroup?.CGSTPer,
    sgstPercent:
      Number(payload?.GSTGroup?.SGSTPer) + Number(payload?.GSTGroup?.UTGSTPer),
    deals: Number(payload?.isdeal1) + Number(payload?.isdeal2),
    currencyFactor: currencyDetails?.currrency?.[0],

    ipAddress: ip,
    // centreID: userData?.centreID,

    // currencyFactor: payload?.currrency?.currencyFactor?.[0],
    // currencyCountryID: payload?.currrency?.currencyCountryID?.[0],
    // IsDefault: payload?.IsDefault?.value,
    taxAmount: 0,
    unitPrice: 0,

    profit: 0,
    netAmount: 896,
    grossAmount: 0,

    userID: "",
    userName: "",
    storeType: details?.category?.value,
    departmentLedgerNo: "",
    hospitalID: "",
  };

  return setPayload;
};

export const handleMRDFileIssueSavePayload = (
  data,
  patientDetails,
  pDetail
) => {
  let docsLists = [];
  patientDetails?.fileList?.map((val) => {
    let obj = {
      issueStatus: true,
      fileID: String(val?.FileID),
      fileDetID: String(val?.FileDetID),
      docID: String(val?.DocumentID),
    };
    docsLists.push(obj);
  });
  {
    console.log("data?.IssuedTo", data?.IssuedTo);
  }
  let payload = {
    pid: String(pDetail?.PatientID),
    tid: String(pDetail?.transactionID),
    requestID: String(pDetail?.MRDRequisitionID),
    days: String(data?.ReturnTimeDays?.value),
    hours: String(data?.ReturnTimeHrs?.value),
    hardCopy: Boolean(data?.hardCopy),
    softCopy: Boolean(data?.softCopy),
    issueTypeValue: String(data?.Type?.value),
    issueTypeText: String(data?.Type?.value),
    issueToValue: String(
      data?.IssuedTo?.value ? data?.IssuedTo?.value : data?.IssuedTo
    ),
    issueToText: String(
      data?.IssuedTo?.value ? data?.IssuedTo?.label : data?.IssuedTo
    ),
    dept: String(
      data?.Department?.label ? data?.Department?.label : data?.Department
    ),
    entryDate1: moment(data?.IssueDate).format("DD-MMM-YYYY"),
    entryTime1: moment(data?.IssueTime).format("hh:mm A"),
    remarks: String(data?.Remarks),
    ipAddress: ip,
    type: String(pDetail?.type ? pDetail?.type : ""),
    rmID: String(patientDetails?.BindFileDetail[0]?.RmID),
    almID: String(patientDetails?.BindFileDetail[0]?.AlmID),
    shelf: String(patientDetails?.BindFileDetail[0]?.ShelfNo),
    shelfid: String(patientDetails?.BindFileDetail[0]?.ShelfNo),
    fileID: String(data?.FileNo?.value),
    docsLists: docsLists,
  };
  return payload;
};
export const handleMRDFFileReturnSavePayload = (
  data,
  patientDetails,
  pDetail
) => {
  let docsLists = [];
  // Map the `returnDocuments` list
  patientDetails?.fileList?.map((val) => {
    let obj = {
      returnStatus: true,
      fileIssueID: String(val?.FileID),
      issueDate: moment(data?.IssueDate).format("DD-MMM-YYYY"),
    };
    docsLists.push(obj);
  });
  // Construct the payload
  let payload = {
    patientID: String(pDetail?.PatientID),
    requestID: String(pDetail?.MRDRequisitionID),
    entryDate1: moment(data?.IssueDate).format("DD-MMM-YYYY"),
    entryTime1: moment(data?.IssueDate).format("HH:mm:ss"),
    counter: "",
    tid: String(pDetail?.transactionID),
    fileNo: "",
    roomID: String(patientDetails?.BindFileDetail[0]?.RmID || "none"),
    almID: String(patientDetails?.BindFileDetail[0]?.AlmID),
    shelfNo: String(patientDetails?.BindFileDetail[0]?.ShelfNo),
    additionalNo: 0,
    fileID: String(data?.FileNo?.value),
    hardCopyChecked: Boolean(data?.hardCopy),
    remarks: String(data?.Remarks),
    returnDocuments: docsLists,
    getFileReceiveQuery: {
      billNo: String(pDetail?.BillNo),
      dateOfDischarge: moment(data?.DischargeDate).format("DD-MMM-YYYY"),
    },
  };

  return payload;
};

export const handleVoiceMicrophone = (message) => {
  const utterance = new SpeechSynthesisUtterance(message);
  const voices = window.speechSynthesis.getVoices();
  let femaleVoice = voices.find((voice) =>
    voice.name.toLowerCase().includes("female")
  );
  if (!femaleVoice) {
    femaleVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("en_us")
    );
  }
  utterance.voice = femaleVoice;
  window.speechSynthesis.speak(utterance);
};

export const AddItemPharmecy = async (
  ItemID,
  tranferQty = 0,
  stockID,
  PanelId,
  patientMedicine,
  isCashPanel,
  isPackage
) => {
  const userData = useLocalStorage("userData", "get");
  
  let payload = {
    itemID: String(ItemID),
    tranferQty: Number(tranferQty),
    stockID: String(stockID),
    patientMedicine: String(patientMedicine),
    deptLedgerNo: String(userData?.deptLedgerNo),
    PanelId: PanelId || 0,
    isCashPanel: isCashPanel,
    isPackage: isPackage

    // deptLedgerNo: "LSHHI17",
  };
  let apiResp = await pharmecyAddItem(payload);
  return apiResp;
};

export const handleCalculatePatientIssue = (data, name) => {
  data.grossAmount = data?.Quantity * data?.MRP;
  console.log("datadata", data);
  if (name === "DisPer" || name === "Quantity") {
    data.discountAmount = ((data?.grossAmount * data["DisPer"]) / 100).toFixed(
      ROUNDOFF_VALUE
    );
  } else if (name === "discountAmount") {
    data.DisPer = ((data[name] * 100) / data?.grossAmount).toFixed(
      ROUNDOFF_VALUE
    );
  }
  data.Amount = data.grossAmount - data?.discountAmount;
  data.TaxAmount =
    ((data.Amount * 100) / (100 + data?.PurTaxPer)) * (data?.PurTaxPer * 0.01);
  data.PayableAmount =
    Number(data.discountCoPay?.IsPayble) === 1
      ? data.Amount
      : 0.01 *
      data?.Amount *
      (data.patientType === "IPD"
        ? data.discountCoPay?.IPDCoPayPercent
        : data.discountCoPay?.OPDCoPayPercent);
  return data;
};
export const handleCalculatePatientReturn = (data, name) => {
  data.grossAmount = data?.returnQty * data?.MRP;
  data.discountAmount = (
    (data?.grossAmount * data?.DiscountPercentage) /
    100
  ).toFixed(ROUNDOFF_VALUE);

  data.Amount = data.grossAmount - data?.discountAmount;
  data.TaxAmount =
    ((data.Amount * 100) / (100 + data?.SaleTaxPercent)) *
    (data?.SaleTaxPercent * 0.01);
  // data.PayableAmount = (data.discountCoPay?.IsPayble === "1") ? data.Amount : 0.01 * data?.Amount * (data.patientType === "IPD" ? data.discountCoPay?.IPDCoPayPercent : data.discountCoPay?.OPDCoPayPercent)
  data.PayableAmount = data?.Amount;
  return data;
};

export const getDateWithTime = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") {
    return null;
  }

  const cleanTime = timeStr.trim(); // remove extra whitespace

  if (!moment(cleanTime, "HH:mm:ss", true).isValid()) {
    console.error("Invalid time format. Expected HH:mm:ss", cleanTime);
    return null;
  }

  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  const dateTime = moment().set({
    hour: hours,
    minute: minutes,
    second: seconds,
    millisecond: 0,
  });

  return dateTime.toDate();
};
const debounceMap = {};

export const createDebouncedCallback = (key, func, delay = 500) => {
  if (!debounceMap[key]) {
    debounceMap[key] = {
      timer: null,
      callback: (...args) => {
        clearTimeout(debounceMap[key].timer);
        debounceMap[key].timer = setTimeout(() => {
          func(...args);
        }, delay);
      },
    };
  }

  return debounceMap[key].callback;
};
