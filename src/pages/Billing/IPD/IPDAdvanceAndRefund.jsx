import React, { useCallback, useEffect, useMemo, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DetailsCardForDefaultValue from "../../../components/commonComponents/DetailsCardForDefaultValue";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  AdvanceTypeOption,
  BillAccountOption,
  MOBILE_NUMBER_VALIDATION_REGX,
  PAYMENT_OBJECT,
  ROUNDOFF_VALUE,
} from "../../../utils/constant";
import Input from "../../../components/formComponent/Input";
import Modal from "../../../components/modalComponent/Modal";
import Button from "../../../components/formComponent/Button";
import PaymentGateway from "../../../components/front-office/PaymentGateway";
import IPDAdvanceSearchByPatient from "../../../components/commonComponents/IPDAdvanceSearchByPatient";
import {
  BillingSavePayload,
  calculateBillAmount,
  inputBoxValidation,
  notify,
} from "../../../utils/utils";
import { debounce } from "../../../networkServices/axiosInstance";
import {
  BillingSaveSaveServicesBilling,
  BindHospLedgerAccount,
  CommonReceiptPdf,
  GetApproval,
  getApproveBy,
  getCTBRequestDetail,
  GetDiscReason,
  GetPatientReceipt,
  SaveDiscReason,
  SaveIPDAdvance,
  SelectIPDDetail,
} from "../../../networkServices/BillingsApi";
import { bindHashCode } from "../../../networkServices/opdserviceAPI";
import moment from "moment";
import CTBModal from "../../../components/modalComponent/Utils/CTBModal";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { OpenPDFURL, RedirectURL } from "../../../networkServices/PDFURL";
import PatientAdvanceDetailTable from "../../../components/UI/customTable/billings/PatientAdvanceDetailTable";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { GetBindResourceList } from "../../../store/reducers/common/CommonExportFunction";
import { useLocation } from "react-router-dom";
const IPDAdmissionNew = ({ data }) => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [singlePatientData, setSinglePatientData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState([{PaymentMode:"Cash"}]);
  const [paientAdvanceDetails, setPaientAdvanceDetails] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const { BindResource } = useSelector((state) => state?.CommonSlice);
  const [paymentControlModeState, setPaymentControlModeState] =
    useState(PAYMENT_OBJECT);
    
  const initialState = {
    Type: "IPD",
    BillAccount:(singlePatientData?.dtAdjust?.[0]?.status==="OUT" && singlePatientData?.dtAdjust?.[0]?.billNo!=="")?"LSHHI12":"LSHHI11",
    // BillAccount: "LSHHI11",
    ReasonID: "",
    Approval: "",
    amount: "",
    // amount: "",
  };

  const [payload, setPayload] = useState({
    ...initialState,
  });
  const [CTBList, setCTBList] = useState([]);
  const [CTBSelectedList, setCTBSelectedList] = useState([]);
  const [dataFromChild, setDataFromChild] = useState(null);
  const [advanceReason, setAdvanceReason] = useState([]);
  const [approval, setApproval] = useState([]);
  const [billPay, setBillPay] = useState([]);
  useEffect(() => {
    dispatch(GetBindResourceList());
  }, []);
console.log(paymentMethod)
  const getBindCTBRequestDetail = async () => {
    try {
      const TID = singlePatientData?.dtAdjust?.[0]?.transactionID;

      const response = await GetApproval(TID);

      if (response?.success) {
        let data = response?.data?.map((val) => {
          val.isChecked = false;
          return val;
        });
        setCTBList(data);
      } else {
        setCTBList([]);
      }
    } catch (error) {
      console.error("Error fetching CBT request details:", error);
    }
  };

  const GetBindHospLedgerAccount = async () => {
    try {
      const response = await BindHospLedgerAccount();
      if (response?.success) {
        setBillPay(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching CBT request details:", error);
    }
  };

  useEffect(() => {
    if (payload?.Type === "CTB") {
      getBindCTBRequestDetail();
    }
    if (payload?.Type === "IPD") {
      GetBindHospLedgerAccount();
    }
  }, [payload?.Type]);

  const handleSinglePatientData = async (data) => {
    setDataFromChild(data);
    const { PatientID, TransactionID } = data;
    try {
      const data = await SelectIPDDetail(PatientID, TransactionID);
      setSinglePatientData(
        Array.isArray(data?.data) ? data?.data[0] : data?.data
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetPatientAdjustmentDetails = async () => {
    const TransactionID = singlePatientData?.dtAdjust?.[0]?.transactionID;
    try {
      const response = await GetPatientReceipt(TransactionID);

      setPaientAdvanceDetails(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendReset = () => {
    setSinglePatientData({});
    setPaymentControlModeState(PAYMENT_OBJECT);
    setPaymentMethod([]);
    // setPaientAdvanceDetails([]);
    setPayload(initialState);
  };

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
    };
    setPaymentMethod([]);
    setPaymentControlModeState(setData);
    handleGetPatientAdjustmentDetails();
  };
  console.log(CTBSelectedList);
  const handleBillingSaveSaveServicesBilling = async () => {
    const hashcode = await bindHashCode();
    try {
      // const requestBody = BillingSavePayload(
      //   singlePatientData,
      //   CTBSelectedList,
      //   paymentMethod,
      //   dataFromChild,
      //   CTBList,
      //   location,
      //   hashcode
      // );

      const data = {
        typeOfTnx: String(CTBSelectedList[0]?.TypeOfTnx) || "",
        grossAmount: Number(CTBSelectedList[0]?.GrossAmount) || 0,
        netAmount: Number(CTBSelectedList[0]?.NetAmount) || 0,
        discountOnTotal: 0,
        roundOff: Number(CTBSelectedList[0]?.RoundOff) || 0,
        patientID: String(CTBSelectedList[0]?.PatientId) || "",
        panelID: Number(CTBSelectedList[0]?.PanelID) || 0,
        transactionID: Number(CTBSelectedList[0]?.TransactionID) || 0,
        uniqueHash: String(hashcode?.data) || "",
        patientType: String(CTBSelectedList[0]?.Patient_Type) || "",
        discountApproveBy: String(CTBSelectedList[0]?.DiscountApprovedBy) || "",
        discountReason: String(CTBSelectedList[0]?.DiscountReason) || "",
      };
      const dataLTDList = CTBSelectedList?.map((ele) => ({
        entryDate: moment(new Date()).format("YYYY-MM-DD"),
        itemID: ele?.ItemID ? String(ele?.ItemID) : "",
        subCategoryID: ele?.SubCategoryID ? String(ele?.SubCategoryID) : "",
        rate: ele?.Rate ? String(ele?.Rate) : "",
        quantity: ele?.Quantity ? String(ele?.Quantity) : "",
        discountPercentage: ele?.DiscountPercentage
          ? Number(ele?.DiscountPercentage)
          : 0,
        isPayable: ele?.Ispayable ? Number(ele?.Ispayable) : 0,
        configID: ele?.ConfigID ? String(ele?.ConfigID) : "",
        coPayPercent: ele?.CoPayPercent ? String(ele?.CoPayPercent) : "",
        itemName: ele?.ItemName ? String(ele?.ItemName) : "",
        doctorID: ele?.DoctorID ? Number(ele?.DoctorID) : 0,
        ipdCaseTypeID: ele?.IPDCaseTypeID ? Number(ele?.IPDCaseTypeID) : 0,
        rateListID: ele?.RateListID ? Number(ele?.RateListID) : 0,
        rateItemCode: ele?.rateItemCode ? String(ele?.rateItemCode) : 0,
        roomID: ele?.RoomID ? Number(ele?.RoomID) : 0,
        typeOfTnx: ele?.TypeOfTnx ? String(ele?.TypeOfTnx) : "",
        igstPercent: ele?.IGSTPercent ? String(ele?.IGSTPercent) : "",
        cgstPercent: ele?.CGSTPercent ? String(ele?.CGSTPercent) : "",
        sgstPercent: ele?.SGSTPercent ? String(ele?.SGSTPercent) : "",
        hsnCode: "",
        gstType: ele?.GSTType ? String(ele?.GSTType) : "",
        pageName: location?.pathname ? String(location?.pathname) : "",
      }));
      const PLIList = CTBSelectedList?.map((ele) => ({
        isSampleCollected: String(ele?.IsSampleCollected) || "",
        investigation_ID: String(ele?.Investigtaion_ID) || "",
        remarks: String(ele?.Remark) || "",
        isUrgent: Number(ele?.IsUrgent) || 0,
        currentAge: String(ele?.CurrentAge) || "",
        isOutSource: Number(ele?.IsOutSource) || 0,
        outSourceLabID: Number(ele?.OutSourceLabID) || 0,
        scRequestdatetime: String(ele?.RequestDateTime) || "",
      }));

      const requestBody = {
        dataLT: data,
        dataLTD: dataLTDList,
        pli: PLIList,
        patientTypeID: "",
        membershipNo: "",
        ipAddress: ip,
      };

      const response = await BillingSaveSaveServicesBilling(requestBody);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  console.log("first BillAccount",payload?.BillAccount)
  const handleSaveAPI = async () => {
    try {
      const CTBReqNo =
        CTBSelectedList?.length > 0
          ? CTBSelectedList?.map((ele) => {
              return {
                ctbNo: ele?.RequestNo ? String(ele?.RequestNo) : "",
              };
            })
          : [{ ctbNo: "" }];

      const hashcode = await bindHashCode();
      const newPaymentMethod = paymentMethod.map((item) => {
        return {
          paymentModeID: parseInt(item?.PaymentModeID),
          paymentMode: String(item?.PaymentMode),
          s_Amount: String(item?.S_Amount),
          amount: parseInt(item?.Amount),
          s_Currency: String(item?.S_Currency),
          s_CountryID: String(item?.S_CountryID),
          refNo: String(item?.RefNo),
          bankName: String(item?.BankName),
          c_Factor: String(item?.C_Factor),
          s_Notation: String(item?.S_Notation),
          currencyRoundOff: String(item?.currencyRoundOff || "0"),
          swipeMachine: String(item?.swipeMachine || ""),
        };
      });
      const requestBody = {
        dataPaymentDetail: newPaymentMethod,
        dataCTB: CTBReqNo,
        amount: paymentMethod[0]?.Amount,
        hashCode: String(hashcode?.data),
        isRefund: Number(singlePatientData?.netAmount)?.toFixed(ROUNDOFF_VALUE)-singlePatientData?.paidAmt>=0? "0":"1",
        // isRefund: payload?.BillAccount ==="LSHHI7018"?"1":"0",
        // isRefund: String(singlePatientData?.isRefund),
        transactionNo: String(singlePatientData?.dtAdjust[0]?.transactionID),
        isAdmitted: true,
        totalPaidAmount: paymentMethod[0]?.S_Amount
          ? parseInt(paymentMethod[0]?.S_Amount)
          : 0,
        hospLedger: String(payload?.BillAccount),
        patientID: dataFromChild?.PatientID
          ? String(dataFromChild?.PatientID)
          : "",
        roomNo: dataFromChild?.roomno ? String(dataFromChild?.roomno) : "",
        doctorName: String(singlePatientData?.dt[0]?.doctorName),
        patientName: dataFromChild?.pname ? String(dataFromChild?.pname) : "",
        panelName: dataFromChild?.company_name
          ? String(dataFromChild?.company_name)
          : "",
        paymentRemarks: paymentMethod[0]?.PaymentRemarks,
        paymentReceivedFrom: "",
        panelID: dataFromChild?.PanelID ? String(dataFromChild?.PanelID) : "",
        isCTB: dataFromChild?.IsCTB ? String(dataFromChild?.IsCTB) : "",
        ipAddress: String(ip),
      };
      const response = await SaveIPDAdvance(requestBody);
      if (response?.success) {
        notify(response?.message, "success");
        sendReset();
        handleGetPatientAdjustmentDetails();
        handleBillingSaveSaveServicesBilling();
        const reportResp = await CommonReceiptPdf({
          ledgerTransactionNo: "",
          isBill: 0,
          receiptNo: String(response?.data),
          duplicate: "",
          type: "IPD",
          supplierID: "",
          billNo: "",
          isEMGBilling: "",
          isOnlinePrint: "",
          isRefound: 0,
        });
        if (reportResp?.success) {
          RedirectURL(reportResp?.data?.pdfUrl);
        } else {
          notify(reportResp?.data?.message, "error");
        }
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return (
    <>
      <div className="card patient_registration border">
        <Heading title={"Search Criteria"} isBreadcrumb={true} />
        {!data && Object.keys(singlePatientData)?.length === 0 ? (
          <IPDAdvanceSearchByPatient
            onClick={handleSinglePatientData}
            data={data}
          />
        ) : (
          <>
            <DetailCard
              singlePatientData={singlePatientData}
              handlePaymentGateWay={handlePaymentGateWay}
              sendReset={sendReset}
              data={data}
              payload={payload}
              setPayload={setPayload}
              CTBList={CTBList}
              CTBSelectedList={CTBSelectedList}
              setCTBSelectedList={setCTBSelectedList}
              setCTBList={setCTBList}
              dataFromChild={dataFromChild}
              advanceReason={advanceReason}
              approval={approval}
              setAdvanceReason={setAdvanceReason}
              setApproval={setApproval}
              handleGetPatientAdjustmentDetails={
                handleGetPatientAdjustmentDetails
              }
              GetBindHospLedgerAccount={GetBindHospLedgerAccount}
              billPay={billPay}
            />
          </>
        )}
      </div>
      <PaymentGateway
        screenType={paymentControlModeState}
        setScreenType={setPaymentControlModeState}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        button={
          <button className="button" onClick={handleSaveAPI}>
            save
          </button>
        }
      />
      {paientAdvanceDetails?.length > 0 && (
        <div className="card mt-2">
          <div className="row">
            <PatientAdvanceDetailTable tbody={paientAdvanceDetails} />
          </div>
        </div>
      )}
    </>
  );
};

export default IPDAdmissionNew;

const DetailCard = ({
  singlePatientData,
  handlePaymentGateWay,
  sendReset,
  data,
  payload,
  setPayload,
  CTBList,
  CTBSelectedList,
  setCTBSelectedList,
  setCTBList,
  dataFromChild,
  setAdvanceReason,
  setApproval,
  handleGetPatientAdjustmentDetails,
  GetBindHospLedgerAccount,
  billPay,
}) => {
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
  });

  const handleModel = (
    label,
    width,
    type,
    isOpen,
    Component,
    handleInsertAPI,
    extrabutton
  ) => {
    setHandleModelData({
      label: label,
      width: width,
      type: type,
      isOpen: isOpen,
      Component: Component,
      handleInsertAPI: handleInsertAPI,
      extrabutton: extrabutton ? extrabutton : <></>,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  useEffect(() => {
    setHandleModelData((val) => ({ ...val, modalData: modalData }));
  }, [modalData]);

  useEffect(()=>{
   let netAmt= Math.abs(Number(singlePatientData?.netAmount)?.toFixed(ROUNDOFF_VALUE)-singlePatientData?.paidAmt)
   if(netAmt){
    setTotalNetAmount(netAmt)
     debouncedCalculateAndHandlePayment(netAmt);
   }

  },[singlePatientData?.netAmount])
  const handleChangeModel = (data) => {
    setModalData(data);
  };

  const handleReactSelect = async (name, value) => {
    console.log(name);
    setPayload((prevData) => ({
      ...prevData,
      [name]: value?.value,
    }));
  };
  const handleReactSelectItem = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value }));
  };
  const handleReactSelectChange = async (name, selectedOption) => {
    if (name == "Type") {
      setTotalNetAmount(0);
      if (selectedOption?.value) {
        GetBindHospLedgerAccount();
      }
      await GetBindDiscReason(selectedOption?.value);
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: selectedOption?.value,
      }));
    } else {
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: selectedOption,
      }));
    }
  };

  const getBindApproveBy = async () => {
    try {
      const response = await getApproveBy();
      setApproval([response?.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAdvanceReason = async (data) => {
    try {
      const DiscReason = data?.advanceReason;
      const Type = payload?.Type;
      let insData = await SaveDiscReason(DiscReason, Type);
      if (insData?.success) {
        GetBindDiscReason(payload?.Type);
        setModalData({});
        setHandleModelData((val) => ({ ...val, isOpen: false }));
      }
    } catch (error) {
      console.error("Error creating advance reason:", error);
    }
  };

  const debouncedCalculateAndHandlePayment = useCallback(
    debounce((value) => {
      const data = calculateBillAmount(
        [
          {
            panelID: 1,
            grossAmount: Number(value),
            discountAmount: 0,
            PayableAmount: Number(value),
          },
        ],
        "1",
        0,

        1,
        1
      );

      handlePaymentGateWay(data);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
    if (name === amount) {
      handleGetPatientAdjustmentDetails();
    }
    debouncedCalculateAndHandlePayment(value);
  };

  const handleDataInDetailView = useMemo(() => {
    if (Object.keys(singlePatientData)?.length > 0) {
      const data = [];

      singlePatientData?.dtAdjust?.forEach((adjustItem, index) => {
        data.push(
          {
            label: t(`UHID`),
            value: adjustItem?.patientID ?? "",
          },
          {
            label: t(`Patient Name`),
            value: dataFromChild?.pname,
          },
          {
            label: t(`IPD No.`),
            value: dataFromChild?.IPDNo,
          },
          {
            label: t(`Age/Gender `),
            value: adjustItem?.currentAge ?? "",
          },
          {
            label: t(`Room`),
            value: dataFromChild?.roomno,
          },
          {
            label: t(`Address`),
            value: dataFromChild?.Address,
          },
          {
            label: t(`Status `),
            value: adjustItem?.status ?? "",
          }
        );
      });

      singlePatientData?.dt?.forEach((dtItem, index) => {
        data.push(
          {
            label: t(`Doctor `),
            value: dtItem?.doctorName ?? "",
          },
          {
            label: t(`Admission Date `),
            value:
              moment(dtItem?.dateOfAdmit).format("DD-MMM-YYYY hh:mm A") ?? "",
          },
          {
            label: t(`Discharge Date `),
            value:
              moment(dtItem?.dateOfDischarge).format("DD-MMM-YYYY hh:mm A") ??
              "",
          }
        );
      });
      singlePatientData?.dtAdjust?.forEach((adjustItem, index) => {
        data.push(
          {
            label: t("Main Panel"),
            value: dataFromChild?.company_name,
          },
          {
            label: t("Net Bill Amount"),
            value:
              Number(singlePatientData?.netAmount)?.toFixed(ROUNDOFF_VALUE) ?? "0.00",
              // Number(adjustItem?.s_Amount)?.toFixed(ROUNDOFF_VALUE) ?? "0.00",
          },
          {
            label: t("Total Paid Amount"),
            value: singlePatientData?.amountReceived ?? "0.00",
            // value: singlePatientData?.paidAmt ?? "0.00",
          },
          {
            label: t("Balance Amount"),
            value:
              Number(singlePatientData?.netAmount)?.toFixed(ROUNDOFF_VALUE)-singlePatientData?.paidAmt
          },
          //   value:
          //     Number(adjustItem?.s_Amount)?.toFixed(ROUNDOFF_VALUE) -
          //     singlePatientData?.paidAmt,
          // },
          {
            label: t("Round Off"),
            value:
              Number(adjustItem?.roundOff).toFixed(ROUNDOFF_VALUE) ?? "0.00",
          },
          {
            label: t("Panel Approved Amount"),
            value:
              Number(adjustItem?.panelApprovedAmt).toFixed(ROUNDOFF_VALUE) ??
              "0.00",
          },
          {
            label: t("Panel Payable Amount"),
            value: Number(singlePatientData?.panelAmountAllocation).toFixed(ROUNDOFF_VALUE),
            // value: Number(adjustItem?.panelPaybleAmt).toFixed(ROUNDOFF_VALUE),
          },
          {
            label: t("Panel Paid Amount"),
            value: Number(adjustItem?.panelPaidAmt).toFixed(ROUNDOFF_VALUE),
          },
          {
            label: t("Panel Balence Amount"),
            value:
              Number(adjustItem?.panelPaybleAmt).toFixed(ROUNDOFF_VALUE) -
              Number(adjustItem?.panelPaidAmt).toFixed(ROUNDOFF_VALUE),
          },
          {
            label: t("Patient Payable Amount"),
            value:
              Number(singlePatientData?.patientPaybleAmt).toFixed(ROUNDOFF_VALUE) ??
              "0.00",
            // value:
            //   Number(adjustItem?.patientPaybleAmt).toFixed(ROUNDOFF_VALUE) ??
            //   "0.00",
          },
          {
            label: t("Patient Paid Amount"),
            value:
              Number(singlePatientData?.paidAmt).toFixed(ROUNDOFF_VALUE) ??
              "0.00",
            // value:
            //   Number(adjustItem?.patientPaidAmt).toFixed(ROUNDOFF_VALUE) ??
            //   "0.00",
          },
          {
            label: t("Patient Balance Amount"),
            value:
              Number(adjustItem?.patientPaybleAmt).toFixed(ROUNDOFF_VALUE) -
              Number(adjustItem?.patientPaidAmt).toFixed(ROUNDOFF_VALUE)
                ? Number(adjustItem?.patientPaybleAmt).toFixed(ROUNDOFF_VALUE) -
                  Number(adjustItem?.patientPaidAmt).toFixed(ROUNDOFF_VALUE)
                : "0.00",
          }
        );
      });

      return data;
    } else {
      return [];
    }
  }, [singlePatientData]);

  const handleModalState = () => {
    setModalHandlerState({
      show: true,
      header: "CBT Details",
      size: "40vw",
      component: (
        <CTBModal tbody={CTBList} CTBList={CTBList} setCTBList={setCTBList} />
      ),
      footer: (
        <div>
          <div className="d-flex align-items-center justify-content-end">
            <div>
              <Button
                name={"Add"}
                className={"btn btn-sm btn-primary mx-1"}
                handleClick={handleAddAPI}
              />
            </div>
          </div>
        </div>
      ),
    });
  };
  const GetBindDiscReason = async (Type) => {
    try {
      const { data } = await GetDiscReason(Type);
      setAdvanceReason(data);
    } catch (error) {
      console.error("Error fetching discount reasons:", error);
    }
  };

  const commonFetchAllDropDown = async () => {
    try {
      const [discReasonResponse] = await Promise.all([
        GetDiscReason(payload?.Type),
      ]);
      return {
        discReasonResponse,
      };
    } catch (error) {
      console.log("Something went wrong during dropdown fetching:", error);
      return {};
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const responseDropdown = await commonFetchAllDropDown();
      if (responseDropdown.discReasonResponse) {
        setAdvanceReason(responseDropdown.discReasonResponse?.data);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    if (payload?.Type) {
      FetchAllDropDown();
    }
    getBindApproveBy();
  }, [payload?.Type]);

  const handleAddAPI = async () => {
    const newArr = CTBList.filter((ele) => ele?.isChecked === true);
    let totalAmount = 0;
    CTBList?.map((val) => {
      if (val?.isChecked) {
        totalAmount += val?.NetAmount;
      }
    });
    setTotalNetAmount(totalAmount);
    setCTBSelectedList(newArr);
    setModalHandlerState({
      show: false,
      component: null,
      size: null,
    });
    debouncedCalculateAndHandlePayment(totalAmount);
  };

  // function calculateTotalNetAmount(response) {
  //   if (!Array.isArray(CTBSelectedList)) return 0;

  //   return CTBSelectedList.filter((row) => row.isChecked).reduce(
  //     (total, row) => total + row.NetAmount,
  //     0
  //   );
  // }

  // Example usage

  // const totalNetAmount = calculateTotalNetAmount();
  return (
    <>
      <DetailsCardForDefaultValue
        singlePatientData={handleDataInDetailView}
        sendReset={sendReset}
        show={data}
      >
        {payload?.Type === "IPD" ? (
          <ReactSelect
            placeholderName={t("Payment Type")}
            handleChange={handleReactSelect}
            id={"BillAccount"}
            name={"BillAccount"}
            value={payload?.BillAccount}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={billPay.map((ele) => ({
              label: ele?.LedgerName,
              value: ele?.LedgerNumber,
            }))}
            searchable={true}
            // isDisabled={true}
          />
        ) : (
          ""
        )}
        <ReactSelect
          placeholderName={t("Advance Type")}
          id={"Type"}
          searchable={true}
          handleChange={handleReactSelectChange}
          value={payload?.Type}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={AdvanceTypeOption}
          name={"Type"}
        />
        <Input
          type="text"
          className="form-control"
          id="amount"
          name="amount"
          onChange={(e) => {
            handleChange(e, name);
            inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, () => {});
          }}
          // onKeyDown={(e) => {
          //   inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, () => {});
          // }}
          value={payload?.amount ? payload?.amount : totalNetAmount}
          lable={t("Amount")}
          placeholder=" "
          required={true}
          disabled={payload?.Type === "CTB" ? true : false}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
        />
        {console.log(payload?.Type)}
        {/* <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
          <div className="box-size">
            <div className="box-upper">
              <ReactSelect
                placeholderName={t("FrontOffice.OPD.OPDAdvance.label.Reason")}
                searchable={true}
                respclass=""
                id="ReasonID"
                name="ReasonID"
                handleChange={handleReactSelectItem}
                // handleChange={handleReactSelectChange}
                value={`${payload?.ReasonID}`}
                dynamicOptions={advanceReason?.map((item) => ({
                  label: item?.DiscountReason,
                  value: item?.ID,
                }))}
              />
            </div>
            <div className="box-inner">
              <button
                className="btn btn-sm btn-primary"
                type="button"
                onClick={() =>
                  handleModel(
                    "Reason Add Modal",
                    "20vw",
                    "Reason",
                    true,
                    <ReasonAddModal handleChangeModel={handleChangeModel} />,
                    handleCreateAdvanceReason
                  )
                }
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
              </button>
            </div>
          </div>
        </div>
        <ReactSelect
          placeholderName={t("Approval")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          id={"Approval"}
          name={"Approval"}
          value={payload?.Approval}
          dynamicOptions={approval.map((ele) => ({
            value: ele?.ApprovalType,
            label: ele?.ApprovalType,
          }))}
          handleChange={handleReactSelectItem}
        /> */}
     {payload?.Type === "CTB" && (
  <div 
    style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      width: '100%',   
    }} 
  >
    <Button
      name={t("CTB")}
      className="btn btn-sm btn-primary" 
      handleClick={() => handleModalState()}
    />
  </div>
)}

      </DetailsCardForDefaultValue>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          modalData={handleModelData?.modalData}
          setModalData={setModalData}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
      {modalHandlerState?.show && (
        <Modal
          visible={modalHandlerState?.show}
          setVisible={() =>
            setModalHandlerState({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
        >
          {modalHandlerState?.component}
        </Modal>
      )}
    </>
  );
};
