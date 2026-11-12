import React, { useEffect, useState, useCallback, useRef } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import {
  getIncludeBillApi,
  SaveLabPackageDetailsApi,
} from "../../../networkServices/BillingsApi";
import Tables from "../../../components/UI/customTable";
import {
  AddItemPharmecy,
  calculateBillAmount,
  handleCalculatePatientIssue,
  notify,
} from "../../../utils/utils";
import { AutoComplete } from "primereact/autocomplete";
import {
  GetBindDoctorDept,
  GetBindLabInvestigationRate,
  GetDiscountWithCoPay,
  GetLoadOPD_All_ItemsLabAutoComplete,
  SavePharmacyIssueApi,
} from "../../../networkServices/opdserviceAPI";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  CashPanel,
  DraftPharmecyAPIPayload,
  SavePharmecyAPIPayload,
} from "../../../utils/ustil2";
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
import { PharmacyMedicineItemSearch } from "../../../networkServices/pharmecy";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import PatientIssueTable from "../../pharmacy/PatientIssue/PatientIssueTable";
import { useSelector } from "react-redux";

function PharmacyIssuePackage() {
  const { t } = useTranslation();
  const SellOnOption = [
    { label: t("MRP"), value: "0" },
    { label: t("Rate"), value: "1" },
  ];

  const SearchByOption = [
    { label: t("Item Name"), value: "1" },
    { label: t("With Generic"), value: "2" },
    { label: t("Barcode"), value: "3" },
    { label: t("Generic"), value: "4" },
  ];

  let initialValue = {
    type: { value: 2 },
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

  const MedicineRef = useRef(null);
  const quantityRef = useRef(null);

  const [billData, setBillData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [value, setValue] = useState("");
  const [values, setValues] = useState(initialValue);
  const [bodyData, setBodyData] = useState([]);
  const [modalData, setModalData] = useState({ visible: false });
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentControlModeState, setPaymentControlModeState] =
    useState(PAYMENT_OBJECT);
  const { GetBindReferDoctorList, CentreWiseCache, BindResource } = useSelector(
    (state) => state.CommonSlice
  );

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

  const fetchBillData = async () => {
    if (search.trim().length <= 1) {
      notify("Bill No is required", "error");
      return;
    }

    try {
      const response = await getIncludeBillApi(search);
      if (response?.success) {
        setBillData(response.data || []);
      } else {
        setBillData([]);
        notify(response?.message || response?.data?.message, "error");
        console.log(response);
      }
    } catch (err) {
      console.error(err?.response);

      notify("Something went wrong!", "error");
    }
  };

  const focusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const hanldeCloseSearchMed = (value) => {
    // debugger
    console.log("Selected medicine:", value);

    setValues((val) => ({ ...val, medicineName: value }));
    setBindDetails((val) => ({ ...val, value: value?.ItemName }));
    focusInput(quantityRef);
  };

  let userData = useLocalStorage("userData", "get");

  const BindListAPI = async (itemName, BindDetails) => {
    let payload = {
      cmd: "item",
      type: BindDetails?.searchBy === "4" ? "2" : "1",
      // deptLedgerNo: userData?.deptLedgerNo,
      deptLedgerNo: "LSHHI17",
      q: itemName,
      page: "1",
      rows: 20,
      sort: "ItemName",
      order: "asc",
      isWithAlternate: BindDetails?.searchBy === "2" ? true : false,
      isBarCodeScan: BindDetails?.searchBy === "3" ? true : false,
    };
    try {
      let apiResp = await PharmacyMedicineItemSearch(payload);
      return apiResp;
    } catch (error) {}
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

  const getLtdPayload = () =>
    selectedPackages?.map((item) => ({
      itemName: item.value.typeName || "",
      type: item.value.type_ID || "",
      type_ID: item.value.type_ID || "",
      doctorID: item.DoctorID || "1",
      subCategoryID: item.value.subCategoryID || "0",
      amount: item.price.Rate || 0,
      rate: item.price.Rate || 0,
      quantity: 1,
      discountPercentage: 0,
      discAmt: 0,
      docCollectAmt: 0,
      salesID: "0",
      itemID: item.value.item_ID || "",
      isPackage: 1,
      packageID: "41",
      discountReason: "",
      tnxTypeID: item.value.tnxType || "0",
      rateListID: 0,
      roundOff: 0,
      coPayPercent: 0,
      isPayable: 0,
      isPanelWiseDisc: 0,
      panelCurrencyCountryID: 14,
      panelCurrencyFactor: 1,
      rateItemCode: item.price.ItemCode || "",
      sampleType: item.value.sample || "",
      categoryID: item.value.categoryid || "0",
      bookingDate: "0001-01-01",
      bookingTime: "00:00:00-00:00:00",
      bookinginModality: 1,
      appointmentNo: 0,
      isOutSource: item.value.isOutSource || 0,
      gstType: item.value.gstType || "",
      igstPercent: item.value.igstPercent || 0,
      igstAmt: 0,
      cgstPercent: item.value.cgstPercent || 0,
      cgstAmt: 0,
      sgstPercent: item.value.sgstPercent || 0,
      sgstAmt: 0,
      typeOfApp: "0",
      remark: "",
      isMobileBooking: 0,
      appointmentID: 0,
      isSlotWiseToken: item.value.isSlotWisetoken || 0,
      appointmentDateTime: "",
      isDocCollect: 0,
      isAdvance: item.value.isadvance || 0,
      packageType: 1,
      investigation_ID: item.value.type_ID || "",
    })) || [];

  const payload = {
    patientID: selectedItems?.[0]?.PatientID,
    transactionID: selectedItems?.[0]?.TransactionID,
    billNO: selectedItems?.[0]?.BillNo,
    doctorID: selectedItems?.[0]?.DoctorID,
    ledgerTransactionNo: selectedItems?.[0]?.LedgerTransactionNo,
    panelID: selectedItems?.[0]?.PanelID,
    ltd: getLtdPayload(),
    pt: Array(3).fill({ isUrgent: 0, patientTest_ID: "0" }),
    roundOff: 0,
    govTaxPer: 0,
    pageURL: "/opd-Lab Package Include",
    ipAddress: "",
    reportDispatchModeID: 0,
    isHelpDeskBilling: 0,
    helpDeskBookingCentreID: 0,
    scheduleChargeID: 0,
    referedBy: "",
  };
  console.log(payload, "get get get get ");
  const addMoreItemByItemId = async () => {
    const payload = {
      itemID: String(values?.medicineName?.ItemID?.split("#")[0]),
      qty: String(values?.Quantity),
      // deptLedgerNo: String(userData?.deptLedgerNo),
      deptLedgerNo: "LSHHI17",
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

        // let pendingQty = Number(values?.Quantity ? values?.Quantity : 0)
        // apiResp?.data?.map((val, index) => {
        //     if (pendingQty <= val?.AvlQty) {
        //         addSingleItem(val?.ItemID, pendingQty, val?.stockid, (index === apiResp?.data?.length - 1) ? true : false)
        //         pendingQty = 0
        //     } else {
        //         addSingleItem(val?.ItemID, val?.AvlQty, val?.stockid, (index === apiResp?.data?.length - 1) ? true : false)
        //         pendingQty -= val?.AvlQty
        //     }
        // })
      }
    }
  };
  console.log("API Payload", payload);

  const AddItem = async () => {
    // debugger
    if (!values?.medicineName) {
      notify(t("Medicine Name Field Is Required"), "error");
      console.log("values?.medicineNam🤩e", values?.medicineName);
      return 0;
    } else if (!values?.Quantity) {
      notify(t("Quantity Field Is Required"), "error");
      return 0;
    }
    if (values?.medicineName?.AvlQty < Number(values?.Quantity)) {
      addMoreItemByItemId();
    } else {
      await addSingleItem(
        values?.medicineName?.ItemID?.split("#")[0],
        values?.Quantity,
        values?.medicineName?.stockid
      );

      console.log("value selected in hanldeCloseSearchMed---", value);
    }
  };

  const onEnterAddItem = (e) => {
    if (e?.keyCode === 13) {
      AddItem();
    }
  };

  // const handleAddIndentItem = (data) => {
  //   if (data?.length) {
  //     // data[0]?.Age    means that draft case
  //     if (data[0]?.draftDetailID) {
  //       if (data[0]?.PatientID !== "CASH002") {
  //         setSearchPatient((val) => ({
  //           ...val,
  //           value: data[0]?.PatientID,
  //           isCallhandleChange: true,
  //         }));
  //       } else {
  //         let { Address, Title, PName, Age, ContactNo, DoctorID, gender } =
  //           data[0];
  //         setValues((val) => ({
  //           ...val,
  //           Address: Address,
  //           type: { value: 2 },
  //           title: { value: Title },
  //           Name: PName.split(`${Title} `)[1],
  //           Age: Age.split(" ")[0],
  //           AgeType: { value: Age.split(" ")[1] },
  //           Gender: { value: gender },
  //           ContactNo: ContactNo,
  //           Doctor: { value: DoctorID },
  //         }));
  //         setSearchPatient((val) => ({ ...val, value: "", patientDetail: {} }));
  //       }
  //     }

  //     setBodyData([]);
  //     data?.map((val, index) => {
  //       addSingleItem(
  //         String(val?.ItemID),
  //         val?.IssueQuantity,
  //         val?.stockid,
  //         index === data?.length - 1 ? true : false,
  //         val?.IndentNo,
  //         val?.draftDetailID,
  //         val?.patientMedicine
  //       );
  //     });
  //     setModalData({ visible: false });
  //   } else {
  //     notify(t("Please Select Atleast One Item"), "error");
  //     return 0;
  //   }
  // };

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
    handlePaymentGateWay(data);
  };

  const addSingleItem = async (
    ItemID,
    Quantity,
    stockid,
    isPaymentControl = true,
    IndentNo = "",
    draftID = 0,
    patientMedicine = 0
  ) => {
    let apiResp = await AddItemPharmecy(ItemID, Quantity, stockid, 0);
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
        // let medData = [...data];
        // setBodyData(medData);
        let medData = [...bodyData];
        medData = [...medData, ...data];
        setBodyData(medData);

        isPaymentControl && handleCalculateBillAmount(medData);
        setValues((val) => ({ ...val, Quantity: "" }));
        setBindDetails((val) => ({ ...val, value: "" }));
        focusInput(MedicineRef);
      } else {
        notify(t("This Item Already Added In List"), "error");
      }
    } else {
      notify(apiResp?.message, "error");
    }
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
  };

  const handleReactSelect = async (name, value) => {
    if (name === "SearchBy") {
      setBindDetails((val) => ({ ...val, searchBy: value?.value }));
    }
    if (name === "type") {
      setSearchPatient((val) => ({ ...val, patientDetail: {} }));
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  // const handleOpenIndent = async ({
  //   label,
  //   width,
  //   type,
  //   CallAPI,
  //   buttonName,
  // }) => {
  //   if (type === "indent") {
  //     setSearchPatient((val) => ({ ...val, patientDetail: {} }));
  //   }

  //   setModalData({
  //     visible: true,
  //     type: type,
  //     width: width,
  //     label: label,
  //     buttonName: buttonName,
  //     CallAPI: CallAPI,
  //     // footer: <></>,
  //     Component: (
  //       <IndentReqModal
  //         department={department}
  //         type={type}
  //         setParentValues={setValues}
  //         setSearchPatient={setSearchPatient}
  //         SearchPatient={SearchPatient?.patientDetail}
  //         handleCustomInput={handleCustomInput}
  //         setModalData={setModalData}
  //       />
  //     ),
  //   });
  // };

  const handleSavePackage = async () => {
    if (selectedPackages.some((pkg) => !pkg.DoctorID)) {
      notify("Please select a doctor for all items!", "error");
      return;
    }
    try {
      const response = await SaveLabPackageDetailsApi(payload);
      if (response?.success) {
        notify("Package saved successfully", "success");
        setSelectedPackages([]);
        setBillData([]);
        setSelectedItems([]);
        setPackageData([]);
      } else {
        notify(response?.message, "warn");
      }
    } catch (error) {
      console.error(error);
      notify(error?.message, "error");
    }
  };

  useEffect(() => {
    const fetchDoctorList = async () => {
      try {
        const data = await GetBindDoctorDept("ALL");
        setDoctorList(data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctorList();
  }, []);

  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };
  console.log(bodyData, "body data ----------------------------");

  // const SavePharmacyIssueData = async () => {
  //   const payloadSave = {
  //     billNo: selectedItems?.[0]?.BillNo,
  //     patientID: selectedItems?.[0]?.PatientID,
  //     pharmacydetail: [
  //       {
  //         ledgerTransactionNo: selectedItems?.[0]?.LedgerTransactionNo,
  //         tid: selectedItems[0]?.TransactionID,
  //         itemId:value.item_ID || "",
  //         rate: ,
  //         amount: 0,
  //         quantity: 0,
  //         stockID: "string",
  //         disper: 0,
  //         disAmt: 0,
  //         subcategoryID: "string",
  //         entryDate: "string",
  //         configID: 0,
  //         totalDisAmt: 0,
  //         totalNetAmt: 0,
  //         ipaddress: "string",
  //         centreID: 0,
  //         ipdCaseTypeId: 0,
  //         type: "string",
  //         medExpiryDate: "string",
  //         isExpirable: 0,
  //         batchNumber: "string",
  //         storeLedgerNo: "string",
  //         unitPrice: 0,
  //         purTaxper: 0,
  //         purTaxAmt: 0,
  //         typeOftnx: "string",
  //         hsnCode: "string",
  //         igstPer: 0,
  //         igstAmt: 0,
  //         sgstPer: 0,
  //         sgstAmt: 0,
  //         cgstPer: 0,
  //         cgstAmt: 0,
  //         gstType: "string",
  //       },
  //     ],
  //   };
  //   console.log("😀🙄😶😶", payloadSave, "hereh herhe rehr ehr ehr eh ");

  //   try {
  //     const response = await SavePharmacyIssueApi(payloadSave);
  //     if (response?.success) {
  //       notify("Package saved successfully", "success");
  //       console.log("API Response data----", response?.data);
  //     } else {
  //       notify(response?.message, "error");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     notify(error?.message, "error");
  //   }
  // };

  const SavePharmacyIssueData = async () => {
    if (!bodyData?.length || !selectedItems?.length) {
      notify("No item or patient selected", "error");
      return;
    }

    const pharmacydetail = bodyData.map((item) => ({
      ledgerTransactionNo: String(selectedItems[0]?.LedgerTransactionNo || ""),
      tid: String(selectedItems[0]?.TransactionID || "0"),
      itemId: item?.ItemID || "",
      rate: item?.MRP || 0,
      amount: item?.netAmount || 0,
      quantity: Number(item?.Quantity) || 0,
      stockID: item?.stockid || "",
      disper: Number(item?.DisPer) || 0,
      disAmt: Number(item?.discountAmount) || 0,
      subcategoryID: String(item?.SubCategoryID) || "",
      entryDate: new Date().toISOString(),
      configID: item?.ConfigID || 0,
      totalDisAmt: Number(item?.discountAmount) || 0,
      totalNetAmt: item?.netAmount || 0,
      ipaddress: "",
      centreID: item?.centreID || 0,
      ipdCaseTypeId: item?.ipdCaseTypeId || 0,
      // type:Number(item?.type) || 0,
      // type:item.value.type_ID
      // medExpiryDate: item?.MedExpiryDate || "",
      itemName: item?.ItemName || "",
      isExpirable: item?.IsExpirable || 0,
      batchNumber: item?.BatchNumber || "",
      storeLedgerNo: item?.StoreLedgerNo || "",
      unitPrice: item?.UnitPrice || 0,
      purTaxper: item?.PurTaxPer || 0,
      purTaxAmt: item?.PurTaxAmt || 0,
      typeOftnx: item?.typeOftnx || "Issue",
      hsnCode: item?.HSNCode || "",
      igstPer: item?.IGSTPer || 0,
      igstAmt: item?.IGSTAmt || 0,
      sgstPer: item?.SGSTPer || 0,
      sgstAmt: item?.SGSTAmt || 0,
      cgstPer: item?.CGSTPer || 0,
      cgstAmt: item?.CGSTAmt || 0,
      gstType: item?.GSTType || "",
    }));

    const payloadSave = {
      billNo: selectedItems?.[0]?.BillNo,
      patientID: selectedItems?.[0]?.PatientID,
      pharmacydetail,
    };

    console.log("💊 Final Payload  🙄🙄🙄🙄🥱🥱", payloadSave);

    try {
      const response = await SavePharmacyIssueApi(payloadSave);
      if (response?.success) {
        notify("Pharmacy issue saved successfully", "success");
      } else {
        notify(response?.message || "Failed to save", "error");
      }
    } catch (error) {
      console.error(error);
      notify("Something went wrong", "error");
    }
  };

  return (
    <div>
      <div className="card">
        <Heading title="Search Criteria" isBreadcrumb />
        <div className="col-xl-6 col-md-4 col-sm-6 col-12">
          <div
            className="d-flex justify-content-start  pt-2"
            style={{ position: "relative" }}
          >
            <Input
              type="text"
              className="form-control"
              lable={t("Enter Bill No")}
              respclass={"w-100"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ position: "absolute", right: "0px" }}>
              <label
                style={{
                  border: "1px solid #ced4da",
                  padding: "2px 5px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
                onClick={() => fetchBillData()}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </label>
            </div>
          </div>
        </div>
      </div>

      {billData?.length > 0 && (
        <div className="card mt-3">
          <Heading title={t("Package Details")} />
          <Tables
            thead={[
              t("Patient Name"),
              t("Payment Mode"),
              t("Receipt No"),
              t("Bill No"),
              t("Package Name"),
              t("Amount Paid"),
              t("Net Amount"),
              t("Date"),
              t("Action"),
            ]}
            tbody={billData.map((item, index) => ({
              PName: item?.PName,
              PaymentMode: item?.PaymentMode,
              ReceiptNo: item?.ReceiptNo,
              BillNo: item?.BillNo,
              PackageName: item?.PackageName,
              AmountPaid: item?.AmountPaid,
              NetAmount: item?.NetAmount,
              Date: item?.DATE,
              button: (
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedItems([item])}
                >
                  <i className="fa fa-plus"></i>
                </button>
              ),
            }))}
          />
        </div>
      )}

      {selectedItems?.length > 0 && (
        <div className="card mt-1">
          {/* <div className="col-xl-5 col-md-5 col-sm-4 col-12 p-2">
            <div
              className="form-group w-100 mb-0"
              style={{ position: "relative" }}
            >
              <AutoComplete
                value={value}
                suggestions={packageData}
                completeMethod={searchTest}
                className="w-100"
                onChange={(e) => setValue(e.value)}
                onSelect={handleSelectItem}
                field="label"
                placeholder={t("Type to search...")}
              />

              <label htmlFor={"searchtest"} className="lable searchtest">
                {t("Search Test")}
              </label>
            </div>
          </div> */}
          <div className="patient_registration card">
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

              <div className="col-xl-5 col-md-5 col-sm-12 col-12">
                <SearchItemEassyUI
                  onClick={hanldeCloseSearchMed}
                  BindListAPI={BindListAPI}
                  BindDetails={BindDetails}
                  Head={BIND_TABLE_BY_MED_FIRST_NAME_PHARMECY}
                  customInputRef={MedicineRef}
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

              {/* <div className="col-xl-1 col-md-2 col-sm-4 col-4">
                <button
                  className="btn  btn-success px-5"
                  type="button"
                  onClick={SavePharmacyIssueData}
                >
                  {t("Save")}
                </button>
              </div> */}

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

              <PatientIssueTable
                handleCustomInput={handleCustomInput}
                deleteRowData={deleteRowData}
                tbody={bodyData}
                handleOpenClinicalTrial={handleOpenClinicalTrial}
              />
              {bodyData?.length > 0 && (
                <div className="d-flex justify-content-end m-2">
                  <button
                    className="btn btn-primary"
                    onClick={SavePharmacyIssueData}
                  >
                    {t("Save")}
                  </button>
                </div>
              )}

              {console.log("valyes", values)}
              {/* {values?.type?.value === 1 && (
                <div className="col-xl-1 col-md-2 col-sm-4 col-4">
                  {console.log(
                    "SearchPatient?.patientDetail?.PatientType------",
                    SearchPatient?.patientDetail?.PatientType
                  )}
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
              )} */}
            </div>
          </div>
        </div>
      )}

      {/* {selectedPackages?.length > 0 && (
        <div className="card mt-3">
          <Heading title={t("Item Details")} isBreadcrumb={false} />
          <Tables
            thead={[
              t("SNo"),
              t("ItemName"),
              t("Doctor"),
              t("Rate"),
              t("Qty"),
              t("Action"),
            ]}
            tbody={selectedPackages.map((item, i) => ({
              SNo: i + 1,
              ItemName: item?.price?.ItemDisplayName,
              Doctor: (
                <ReactSelect
                  dynamicOptions={doctorList.map((doc) => ({
                    label: doc.Name,
                    value: doc.DoctorID,
                  }))}
                  value={
                    doctorList.find((doc) => doc.DoctorID === item.DoctorID) ||
                    " "
                  }
                  handleChange={(name, e) => {
                    setSelectedPackages((prev) => {
                      const data = [...prev];
                      data[i].DoctorID = e.value;

                      return data;
                    });
                  }}
                />
              ),
              Rate: item?.price?.Rate,
              Qty: "1",
              button: (
                <button
                  className="btn btn-danger"
                  id="trash-icon"
                  onClick={() =>
                    setSelectedPackages(
                      selectedPackages.filter((_, index) => index !== i)
                    )
                  }
                >
                  <i className="fa fa-trash"></i>
                </button>
              ),
            }))}
          />

         
        </div>
      )} */}
    </div>
  );
}

export default PharmacyIssuePackage;
