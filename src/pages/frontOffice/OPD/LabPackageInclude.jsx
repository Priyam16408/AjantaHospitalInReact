import React, { useEffect, useState, useCallback } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import {
  getIncludeBillApi,
  PostIncludeBillApi,
  SaveLabPackageDetailsApi,
} from "../../../networkServices/BillingsApi";
import Tables from "../../../components/UI/customTable";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { AutoComplete } from "primereact/autocomplete";
import {
  GetBindDoctorDept,
  GetBindLabInvestigationRate,
  GetLoadOPD_All_ItemsLabAutoComplete,
  GetOpdPackageDetail,
  PackageDetail,
} from "../../../networkServices/opdserviceAPI";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { SEARCHBY } from "../../../utils/constant";
import { Tabfunctionality } from "../../../utils/helpers";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import View_Opd_package_report from "./View_Opd_package_report";
import Modal from "../../../components/modalComponent/Modal";

function LabPackageInclude() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { t } = useTranslation();
  const [billData, setBillData] = useState([]);
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState({ visible: false })
  const [selectedItems, setSelectedItems] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [subPackageDetails, setSubPackageDetails] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [doctorList, setDoctorList] = useState([]);
  const [value, setValue] = useState("");
  const [formValue, setFormValue] = useState({
    rblCon: {},
    patientID: "",
    patientName: "",
    billNo: "",
    fromDate: new Date(),
    toDate: new Date(),
    receiptNo: "",
  })
  const [dropDownState, setDropDownState] = useState({
    GetSearchby: [],

  })
  const fetchBillData = async () => {
    // if (search.trim().length <= 1) {
    //   notify("Bill No is required", "error");
    //   return;
    // }
    const payload = {
      "uhid": formValue?.patientID,
      "pName": formValue?.patientName,
      "billNo": formValue?.billNo,
      "fromDate": moment(formValue?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(formValue?.toDate).format("YYYY-MM-DD"),
      "recieptNo": formValue?.receiptNo,
      "ipdNo": "0"
    }

    try {
      const response = await PostIncludeBillApi(payload);
      // const response = await getIncludeBillApi(search);
      if (response?.success) {
        setBillData(response.data || []);
        setSelectedItems([])
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

  const GetSEARCHBYList = () => {

    setDropDownState((val) => ({
      ...val,
      GetSearchby: handleReactSelectDropDownOptions(
        SEARCHBY,
        "label",
        "value"
      ),
    }));



  };
  useEffect(() => {
    GetSEARCHBYList()
  }, [SEARCHBY])

  const getLtdPayload = () =>
    selectedPackages?.map((item) => ({
      itemName: item.value.typeName || "",
      type: item.value.type_ID || "",
      type_ID: item.value.type_ID || "",
      doctorID: item.DoctorID || "",
      // doctorID: item.DoctorID || "1",
      subCategoryID: item.value.subCategoryID || "0",
      amount: item?.value?.Rate || 0,
      rate: item?.value?.Rate || 0,
      quantity: 1,
      discountPercentage: 0,
      discAmt: 0,
      docCollectAmt: 0,
      salesID: "0",
      itemID: item.value.item_ID || "",
      isPackage: 1,
      packageID: selectedItems[0]?.PackageID || "",
      // packageID: "41",
      discountReason: "",
      tnxTypeID: item.value.tnxType || "0",
      rateListID: 0,
      roundOff: 0,
      coPayPercent: 0,
      isPayable: 0,
      isPanelWiseDisc: 0,
      panelCurrencyCountryID: 14,
      panelCurrencyFactor: 1,
      rateItemCode: item?.price?.ItemCode || "",
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
console.log("selectedItems?.[0]",selectedItems?.[0])
  const payload = {
    // patientID: selectedItems?.PatientID,
    // transactionID: selectedItems?.TransactionID,
    // billNO: selectedItems?.BillNo,
    // doctorID: selectedItems?.DoctorID,
    // ledgerTransactionNo:selectedItems?.LedgerTransactionNo,
    // panelID: selectedItems?.PanelID,
    packageID: selectedItems?.[0]?.PackageID || 0,
    balanceAmt:Number(selectedItems?.[0]?.BalanceAmt?selectedItems?.[0]?.BalanceAmt:0),
    "patient_type": "string",
    patientID: selectedItems?.[0]?.PatientID || "",
    transactionID: selectedItems?.[0]?.TransactionID || "",
    billNO: selectedItems?.[0]?.BillNo || "",
    doctorID: selectedItems?.[0]?.doctorID || "",
    ledgerTransactionNo: selectedItems?.[0]?.LedgerTransactionNo || "",
    panelID: selectedItems?.[0]?.PanelID || 0,
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

  const searchTest = async (event) => {
    
    debugger
    try {
      const items = await GetLoadOPD_All_ItemsLabAutoComplete({
        searchType: 1,
        prefix: event?.query.trim(),
        type: "all",
        PanelID: selectedItems?.[0]?.PanelID || 1,
      });

      setPackageData(
        items?.data?.map((i) => ({
          label: i.autoCompleteItemName,
          value: i,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  




  const categoryTotals = {};

  selectedPackages.forEach(pkg => {
    const { categoryid, subCategoryID, Rate } = pkg.value;

    const match = subPackageDetails.find(detail => {
      if (detail.SubCategoryID === 0) {
        return detail.CategoryID === categoryid;
      } else {
        return (
          detail.CategoryID === categoryid &&
          detail.SubCategoryID === subCategoryID
        );
      }
    });

    if (match) {
      if (!categoryTotals[categoryid]) {
        categoryTotals[categoryid] = 0;
      }
      categoryTotals[categoryid] += Rate;
    }
  });

  const getPackageDetail = async (item) => {
    try {
      const response = await PackageDetail(item?.LedgerTransactionNo)
      if (response?.success) {
        handleClickView(response?.data)
      }
    } catch (error) {
      console?.log("error", error)
    }
  }

  const handleClickView = (details) => {

    setModalData({
      visible: true,
      width: "60vw",
      Heading: "60vh",
      label: t("Package Details"),
      footer: <></>,
      Component: <View_Opd_package_report details={details} setModalData={setModalData} />,

    })

  }
  console.log("subPackageDetailssubPackageDetails", subPackageDetails)
  const handleSelectItem = async (e) => {
    const newItem = e?.value;
    const res = await GetBindLabInvestigationRate(
      selectedItems?.[0]?.PanelID,
      newItem?.value?.item_ID,
      newItem?.value?.categoryid,
      selectedItems?.[0]?.IsInternational,
      "",
      "",
      selectedItems?.[0]?.panelCurrencyFactor
    );
    const index = subPackageDetails?.findIndex((val) => (val?.CategoryID === newItem?.value?.categoryid))

    if (index !== -1) {
      const data = JSON.parse(JSON.stringify(subPackageDetails))
      if (data[index]["NewAmount"] >= newItem?.value?.Rate) {
        data[index]["NewAmount"] = data[index]["NewAmount"] - newItem?.value?.Rate
        setSubPackageDetails(data)
        setSelectedPackages((prev) => [
          ...prev,
          { ...newItem, price: res.data, DoctorID: selectedItems?.[0]?.doctorID },
        ]);
        setValue("")
      } else {
        notify("Item Can't be added", "error");
      }
    } else {
      if (remainingAmount >= res?.data?.Rate) {
         setSelectedPackages((prev) => [
          ...prev,
          { ...newItem, price: res.data, DoctorID: selectedItems?.[0]?.doctorID },
        ]);
        setValue("")
        setRemainingAmount(remainingAmount - res?.data?.Rate)
      }else{
        notify("Item Can't be added", "error");
      }
    }
    // setSelectedPackages((prev) => [
    //           ...prev,
    //           { ...newItem, price: res.data, DoctorID: selectedItems?.[0]?.doctorID },
    //         ]);
    // subPackageDetails


  }
  const handleReactSelect = (name, value) => {


    setFormValue((val) => ({ ...val, [name]: value }))

  };
  //   const handleChange=(e)=>{
  // const {name,vale}=e.target

  //   }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((val) => ({ ...val, [name]: value }))
  }

  const handleSavePackage = async () => {

    if ((selectedPackages.some((pkg) => !pkg.DoctorID))) {
      // if (selectedPackages.some((pkg) => !pkg.DoctorID) || (selectedPackages.some((pkg) => !pkg.doctorID))) {
      notify("Please select a doctor for all items!", "error");
      return;
    }

    try {
      const response = await SaveLabPackageDetailsApi(payload);
      if (response?.success) {
        notify("Package saved successfully", "success");
        setSelectedPackages([]);
        setBillData([]);
        setSelectedItems([])
        // setSelectedItems([]);
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



  const handleGetOpdPackageDetail = async (packageId, LedgerTransactionNo,HospitalAmt) => {
    setValue("")
    try {
      const response = await GetOpdPackageDetail(packageId, LedgerTransactionNo)
      if (response?.success) {
        setSubPackageDetails(response?.data);
        debugger
        const netAmount = response?.data?.reduce((acc, current) => {
          return acc += current["NewAmount"]
        }, 0)
        setRemainingAmount(HospitalAmt - netAmount)

      }


    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {modalData?.visible && (
        <Modal
          visible={modalData?.visible}
          setVisible={() => { setModalData({ visible: false }) }}
          modalData={modalData?.URL}
          modalWidth={modalData?.width}
          Header={modalData?.label}
          buttonType="button"
          footer={modalData?.footer}
        >
          {modalData?.Component}
        </Modal>
      )}
      <div className="card">
        {/* <Heading title="Search Criteria" isBreadcrumb />
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
        </div> */}
        {/* <div
        className="card patient_registration border"
     
      > */}
        <Heading
          title={t("Receipt_Reprint")}
          isBreadcrumb={true}
        />

        <div className="row px-2 pt-2">
          {/* <ReactSelect
            placeholderName={t("SearchType")}
            id={"rblCon"}
            name={"rblCon"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formValue?.rblCon}
            dynamicOptions={dropDownState?.GetSearchby}
            // dynamicOptions={SEARCHBY}
            handleChange={handleReactSelect}
          /> */}
          <Input
            type="text"
            className="form-control"
            id="patientID"
            name="patientID"
            onChange={handleChange}
            value={formValue?.patientID}
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="patientName"
            name="patientName"
            onChange={handleChange}
            value={formValue?.patientName}
            lable={t("PatientName")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />

          <Input
            type="text"
            className="form-control"
            id="billNo"
            name="billNo"
            onChange={handleChange}
            value={formValue?.billNo}
            lable={t("BillNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="receiptNo"
            name="receiptNo"
            onChange={handleChange}
            value={formValue?.receiptNo}
            lable={t("ReceiptNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />

          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            handleChange={handleChange}
            value={
              formValue.fromDate
                ? moment(formValue?.fromDate, "DD-MMM-YYYY").toDate()
                : formValue?.fromDate
            }
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            handleChange={handleChange}
            value={
              formValue.toDate
                ? moment(formValue?.toDate, "DD-MMM-YYYY").toDate()
                : formValue?.toDate
            }
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          />

        </div>
        <div className="text-right mr-1 mb-1">
          <button className="btn btn-sm btn-info px-3" onClick={() => fetchBillData()}>
            {t("Search")}
          </button>
        </div>
      </div>
      {/* </div> */}


      {
        selectedItems?.length > 0 ? (
          <>

            {selectedItems?.length > 0 && (
              // <div className="card mt-1 row">
              <>
              <div className="card mt-1">
                <Heading
                  title={t("Patient Details")}
                  isBreadcrumb={false}
                />
                <div className="row  g-4 m-2">
                  <DatePicker
                    className="custom-calendar"
                    id="fromDate"
                    name="fromDate"
                    handleChange={handleChange}
                    value={
                      selectedItems?.[0].BillDATE
                        ? moment(selectedItems?.[0]?.BillDATE, "DD-MMM-YYYY").toDate()
                        : selectedItems?.[0]?.BillDATE
                    }
                    // value={selectedItems?.[0]?.BillDATE}
                    lable={t("Date")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                    disable={true}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="receiptNo"
                    name="receiptNo"
                    // onChange={handleChange}
                    value={selectedItems?.[0]?.BillNo}
                    lable={t("BillNo")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                    disabled={true}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    // id="receiptNo"
                    // name="receiptNo"
                    // onChange={handleChange}
                    // value={"dsd"}
                    value={selectedItems?.[0]?.PName}
                    lable={t("Patient's Name")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    // onKeyDown={Tabfunctionality}
                    disabled={true}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="receiptNo"
                    name="receiptNo"
                    // onChange={handleChange}
                    value={selectedItems?.[0]?.PackageName}
                    lable={t("PackageName")}
                    disabled={true}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="receiptNo"
                    name="receiptNo"
                    // onChange={handleChange}
                    value={selectedItems?.[0]?.AmountPaid}
                    lable={t("Amount Paid")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                    disabled={true}
                  />


                  <Input
                    type="text"
                    className="form-control"
                    id="receiptNo"
                    name="receiptNo"
                    // onChange={handleChange}
                    value={selectedItems?.[0]?.UtilizeHospitalAmt}
                    lable={t("Utilize Amt")}
                    disabled={true}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="receiptNo"
                    name="receiptNo"
                    // onChange={handleChange}
                    value={selectedItems?.[0]?.HospitalAmt}
                    lable={t("Balance Amt")}
                    disabled={true}
                    placeholder=" "
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                  />

                  <div className="col-xl-6 col-md-9 col-sm-8 col-12 ">


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
                </div>
              </div>
              <div className="card mt-2">
                <Heading title={t("Package Details")} isBreadcrumb={false} />
                {console.log("selectedPackages", selectedPackages)}
                <Tables
                  thead={[
                    t("SNo"),
                    t("Category"),
                    t("Sub-Category"),
                    t("ItemName"),
                   
                    t("Total Amount"),
                    t("UtilizedAmt"),
                    t("Balance"),
                   
                  ]}
                  tbody={subPackageDetails.map((item, i) => ({
                    SNo: i + 1,
                    category: item?.CategoryName || "",
                    SubCategory: item?.SubCategoryName || "",
                    ItemName: item?.ItemName,
                   
                    Amount: item?.Amount|| "0.00",
                    UtilizedAmt: item?.UtilizedAmt|| "0.00",
                    NewAmount: item?.NewAmount|| "0.00",
                  
                  }))}
                />
               
              </div>
              </>
            )}

            {selectedPackages?.length > 0 && (
              <div className="card mt-2">
                <Heading title={t("Item Details")} isBreadcrumb={false} />
                {console.log("selectedPackages", selectedPackages)}
                <Tables
                  thead={[
                    t("SNo"),
                    t("Category"),
                    t("Sub-Category"),
                    t("ItemName"),
                    t("Doctor"),
                    t("Rate"),
                    t("Qty"),
                    t("Action"),
                  ]}
                  tbody={selectedPackages.map((item, i) => ({
                    SNo: i + 1,
                    category: item?.value?.Category || "",
                    SubCategory: item?.value?.SubCategory || "",
                    ItemName: item?.price?.ItemDisplayName,
                    Doctor: (

                      <CustomSelect
                        option={handleReactSelectDropDownOptions(doctorList, "Name", "DoctorID")}
                        value={item?.DoctorID}
                        placeHolder={t("Doctor")}
                        onChange={(name, selectedOption) => {
                          setSelectedPackages((prev) => {
                            const updated = [...prev];
                            updated[i].DoctorID = selectedOption?.value || null;
                            return updated;
                          });
                        }}
                      />

                    ),
                    Rate: item?.price?.Rate?item?.price?.Rate:"0.00",
                    Qty: "1",
                    button: (

                      <i className="fa fa-trash"
                        style={{ color: "red" }}
                        onClick={() =>
                          setSelectedPackages(
                            selectedPackages.filter((_, index) => index !== i)
                          )
                        }
                      ></i>
                    ),
                  }))}
                />
                <div className="d-flex justify-content-end m-2">
                  <button className="btn btn-primary" onClick={handleSavePackage}>
                    {t("Save")}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (<>
          {billData?.length > 0 && (
            <div className="card mt-1">
              <Heading title={t("Package Details")} />
              <Tables
                thead={[
                  t("Date"),
                  t("Bill No"),
                  {name:t("Receipt No"), width: "2%"},
                  t("PatientID"),
                  t("PName"),
                  t("Package Name"),
                  // t("PaymentMode"),
                  t("Paid Amount"),
                  t("Package Amount"),
                  t("Hospital Amt"),
                  t("UtilizeHospital Amt"),
                  t("Action"),
                ]}
                tbody={billData.map((item, index) => ({
                  Date: item?.BillDATE,
                  BillNo: item?.BillNo,
                  ReceiptNo: item?.ReceiptNo,
                  PatientID: item?.PatientID,
                  PName: item?.PName,
                  PackageName: item?.PackageName,
                  // PaymentMode: item?.PaymentMode,



                  AmountPaid: item?.AmountPaid?item?.AmountPaid:"0.00",
                  NetAmount: item?.NetAmount?item?.NetAmount:"0.00",
                  HospitalAmt: item?.HospitalAmt?item?.HospitalAmt:"0.00",
                  UtilizeHospitalAmt: item?.UtilizeHospitalAmt?item?.UtilizeHospitalAmt:"0.00",

                  button: (
                    <div className="gap-2 ">
                      <i className="fa fa-eye mr-3" onClick={() => getPackageDetail(item)}></i>

                      <i className="fa fa-plus " onClick={() => {
                        handleGetOpdPackageDetail(item?.PackageID, item?.LedgerTransactionNo,item?.HospitalAmt)
                        setSelectedItems([item])
                      }}></i>

                      {/* <button
                      className="btn btn-primary mr-3"
                      // onClick={() => setSelectedItems(item)}
                      onClick={() => {
                        handleGetOpdPackageDetail(item?.PackageID, item?.LedgerTransactionNo)
                        setSelectedItems([item])
                      }}
                    >
                      <i className="fa fa-plus"></i>
                    </button> */}
                      {/* <button
                      className="btn btn-primary"
                      onClick={() => getPackageDetail(item)}
                      // onClick={() => {
                      //   handleGetOpdPackageDetail(item?.PackageID, item?.LedgerTransactionNo)
                      //   setSelectedItems([item])
                      // }}
                    >
                      <i className="fa fa-eye" ></i>
                    </button> */}
                    </div>
                  ),
                }))}
                style={{ maxHeight: "57vh" }}
              />
            </div>
          )}
        </>)
      }

      {/* {billData?.length > 0 &&  (
        <div className="card mt-3">
          <Heading title={t("Package Details")} />
          <Tables
            thead={[
              t("Date"),
               t("BillNo"),
                 t("ReceiptNo"),
                  t("PName"),
               t("PackageName"),
             
             
              // t("PaymentMode"),
              
             
              
              t("Paid Amount"),
              t("Package Amount"),
              
              t("Action"),
            ]}
            tbody={billData.map((item, index) => ({
               Date: item?.BillDATE,
                BillNo: item?.BillNo,
                ReceiptNo: item?.ReceiptNo,
              PName: item?.PName,
                 PackageName: item?.PackageName,
              // PaymentMode: item?.PaymentMode,
              
            
             
              AmountPaid: item?.AmountPaid,
              NetAmount: item?.NetAmount,
             
              button: (
                <button
                  className="btn btn-primary"
                  // onClick={() => setSelectedItems(item)}
                  onClick={() => setSelectedItems([item])}
                >
                  <i className="fa fa-plus"></i>
                </button>
              ),
            }))}
          />
        </div>
      )}
{console.log("selectedItems",selectedItems)}
      {selectedItems?.length>0 && (
        // <div className="card mt-1 row">
             <div className="row  g-4 m-2">
           <Input
            type="text"
            className="form-control"
            id="receiptNo"
            name="receiptNo"
            // onChange={handleChange}
            value={selectedItems?.[0]?.BillNo}
            lable={t("BillNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
             disabled={true}
          />
           <Input
            type="text"
            className="form-control"
            // id="receiptNo"
            // name="receiptNo"
            // onChange={handleChange}
            // value={"dsd"}
            value={selectedItems?.[0]?.pName}
            lable={t("Patient's Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            // onKeyDown={Tabfunctionality}
             disabled={true}
          />
           <Input
            type="text"
            className="form-control"
            id="receiptNo"
            name="receiptNo"
            // onChange={handleChange}
            value={selectedItems?.[0]?.AmountPaid}
            lable={t("Amount Paid")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
             disabled={true}
          />
          
           <Input
            type="text"
            className="form-control"
            id="receiptNo"
            name="receiptNo"
            // onChange={handleChange}
            value={selectedItems?.[0]?.PackageName}
            lable={t("PackageName")}
            disabled={true}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <div className="col-xl-5 col-md-5 col-sm-4 col-12 p-2">
          
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
          </div>
        </div>
      )}

      {selectedPackages?.length > 0 && (
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
          <div className="d-flex justify-content-end m-2">
            <button className="btn btn-primary" onClick={handleSavePackage}>
              {t("Save")}
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default LabPackageInclude;
