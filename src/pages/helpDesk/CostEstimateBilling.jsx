import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import OverLay from "../../components/modalComponent/OverLay";
import { useEffect, useMemo, useState } from "react";

import {
  bindHashCode,
  GetBindDoctorDept,
  PatientSearchbyBarcode,
  SaveAdvanceAmount,
} from "../../networkServices/opdserviceAPI";
import {
  CostEstimateBillPayload,
  isChecked,
  PAYMENT_OBJECT,
} from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";

import ReactSelect from "../../components/formComponent/ReactSelect";
import Modal from "../../components/modalComponent/Modal";
import { useFormik } from "formik";
import PaymentGateway from "../../components/front-office/PaymentGateway";
import SearchComponentByUHIDMobileName from "../../components/commonComponents/SearchComponentByUHIDMobileName";  
import DetailsCardForDefaultValue from "../../components/commonComponents/DetailsCardForDefaultValue";
import {
  handleReactSelectDropDownOptions,
  notify,
  payloadSettlerForPaymentGateWay,
  saveOPDAdvancePayload,
} from "../../utils/utils";
import Heading from "../../components/UI/Heading";
import Index from "../frontOffice/PatientRegistration/Index";
import PatientBlackList from "../frontOffice/PatientRegistration/PatientBlackList";
import UploadViewDocument from "../frontOffice/OPD/UploadViewDocument";
import { Tabfunctionality } from "../../utils/helpers";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import SearchingCriteriaTable from "../../components/UI/customTable/helpDesk/CostEstimateBillingTable/SearchingCriteriaTable";
import {
  BindEstimationByDefault,
  BindIPDPackage,
  BindPredefinedEstimation,
  BindPreEstimateCost,
  BindRoomType,
  BindSurgery,
  SaveCostEstimation,
} from "../../networkServices/CostEstimateBillingAPI";
import AdditionalEstimationTable from "../../components/UI/customTable/helpDesk/CostEstimateBillingTable/AdditionalEstimationTable";
import LabeledInput from "../../components/formComponent/LabeledInput";
import PreEstimateBillingTable from "../../components/UI/customTable/helpDesk/CostEstimateBillingTable/PreEstimateBillingTable";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

export default function CostEstimateBilling() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const ip = useLocalStorage("ip", "get");
  const [singlePatientData, setSinglePatientData] = useState({});
  const [visible, setVisible] = useState(false);
  const [BillNo, setBillNo] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPreEstimationAmount, setTotalPreEstimationAmount] = useState(0);
  const { BindResource, getBindPanelListData } = useSelector(
    (state) => state.CommonSlice
  );
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentControlModeState, setPaymentControlModeState] =
    useState(PAYMENT_OBJECT);
  const [DropDownState, setDropDownState] = useState({
    getDoctorDeptWise: [],
    getRoomType: [],
    getBindIPDPackage: [],
    getBindSurgeryList: [],
    SearchList: [],
    PreEstimateCost: [],
    EstimationByDefault: [],
  });

  const SearchCostEstimateBilling = async () => {
    const newValues = {
      // ...values,
      packageID: values?.packageID?.value ? values?.packageID?.value : "0",
      surgeryID: values?.surgeryID?.value ? values?.surgeryID?.value : "0",
      panelID: parseFloat(values?.PanelID?.value)
        ? parseFloat(values?.PanelID?.value)
        : "0",
      doctorID: values?.DoctorID?.value ? values?.DoctorID?.value : "0",
      icdCode: values?.icdCode,
      roomType: values?.roomType?.value ? values?.roomType?.value : "0",
      limit: parseFloat(values?.limit),
      fromDate: moment(values?.fromDate).format("YYYY-MMM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MMM-DD"),
    };

    try {
      if (!parseInt(newValues?.limit)) {
        notify("Please Enter Limit", "error");
      }
      {
        const dataRes = await BindPredefinedEstimation(newValues);
        setDropDownState((prevState) => ({
          ...prevState,
          SearchList: dataRes.data,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBindPreEstimateCost = async (patientBill) => {
    try {
      const Transaction = DropDownState?.SearchList?.find((val) => {
        return val?.BillNo === patientBill?.BillNo;
      });
      console.log("Transaction", Transaction?.BillNo);
      const dataRes = await BindPreEstimateCost(Transaction?.TransactionID);
      if (dataRes?.data) {
        setDropDownState((prevState) => ({
          ...prevState,
          PreEstimateCost: dataRes.data,
        }));
      } else {
        console.log("No data received");
      }
      setBillNo(Transaction);
    } catch (error) {
      console.error("Error fetching PreEstimateCost:", error);
    }
  };

  const getBindEstimationByDefault = async () => {
    try {
      const dataRes = await BindEstimationByDefault();

      if (dataRes?.data) {
        setDropDownState((prevState) => ({
          ...prevState,
          EstimationByDefault: dataRes.data,
        }));
      } else {
        console.log("No data received");
      }
    } catch (error) {
      console.error("Error fetching PreEstimateCost:", error);
    }
  };

  const { values, setFieldValue, handleChange, setValues, handleSubmit } =
    useFormik({
      initialValues: CostEstimateBillPayload,
      onSubmit: (values, { resetForm }) => {
        SearchCostEstimateBilling();
      },
    });

  const handleSaveEstimateCost = async () => {
    const requestData = {
      patientId: singlePatientData?.PatientID,
      preEstimateAmount: parseInt(totalPreEstimationAmount),
      preEstimateBillNo: BillNo?.BillNo,
      preEstimateTransactionID: "",
      additionalAmount: parseInt(totalAmount),
      totalEstimate: parseInt(totalAmount + totalPreEstimationAmount),
      patientName: singlePatientData?.PName,
      age: singlePatientData?.Age,
      gender: singlePatientData?.Gender,
      contactNo: singlePatientData?.Mobile,
      address: singlePatientData?.House_No,
      dateProcedure: moment(values?.dateProcedure).format("YYYY-MMM-DD"),
      diagnosis: values?.diagnosis,
      lengthOfStay: parseInt(values?.lengthOfStay),
      remarks: values?.remarks,
      departmentName: "ICU",
      quantity: 1,
      amount: 600,
      isPreDefined: 0,
      categoryId: "2",
      ipAddress: ip,
    };

    try {
      const response = await SaveCostEstimation(requestData);
      notify("Data Successfully Saved");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleDoctorDeptWise = async (Department) => {
    console.log("Department", Department);
    try {
      const data = await GetBindDoctorDept(Department);
      return data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const response = await Promise.all([
        handleDoctorDeptWise(values?.DepartmentID),
      ]);
      const responseDropdown = {
        getDoctorDeptWise: handleReactSelectDropDownOptions(
          response[0],
          "Name",
          "DoctorID"
        ),
      };
      setDropDownState(responseDropdown);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(singlePatientData);
  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
  };

  const getBindRoomType = async () => {
    try {
      const dataRes = await BindRoomType();
      setDropDownState((prevState) => ({
        ...prevState,
        getRoomType: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindIPDPackages = async () => {
    try {
      const dataRes = await BindIPDPackage();
      setDropDownState((prevState) => ({
        ...prevState,
        getBindIPDPackage: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindSurgery = async () => {
    try {
      const dataRes = await BindSurgery();
      setDropDownState((prevState) => ({
        ...prevState,
        getBindSurgeryList: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const bindAllAPI = async () => {
    await FetchAllDropDown();
    await getBindRoomType();
    await getBindIPDPackages();
    await getBindSurgery();
    await getBindEstimationByDefault();
  };

  useEffect(() => {
    bindAllAPI();
  }, []);

  const sendReset = () => {
    setSinglePatientData({});
    setPaymentControlModeState(PAYMENT_OBJECT);
    setPaymentMethod([]);
  };

  const handleTypeDropwn = () => {
    setPaymentControlModeState(PAYMENT_OBJECT);
    setPaymentMethod([]);
  };

  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
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

  const handleSinglePatientData = async (data) => {
    const { MRNo } = data;
    try {
      const data = await PatientSearchbyBarcode(MRNo, 1);
      setSinglePatientData(
        Array.isArray(data?.data) ? data?.data[0] : data?.data
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveOPDAdvance = async () => {
    try {
      const hashcode = await bindHashCode();
      const data = await SaveAdvanceAmount({
        dataPaymentDetail: payloadSettlerForPaymentGateWay(paymentMethod),
        ...saveOPDAdvancePayload({
          ...singlePatientData,
          hashcode: hashcode?.data,
          ...paymentControlModeState,
          ...values,
          ...BindResource,
        }),
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handlePreEstimationCheck = (e, index) => {
    const { name, type, checked, value } = e.target;

    if (index >= 0) {
      const dataAmount = [...DropDownState?.PreEstimateCost];
      dataAmount[index][name] =
        type === "checkbox" ? (checked ? "1" : "0") : value;
      setDropDownState((prevState) => ({
        ...prevState,
        PreEstimateCost: dataAmount,
      }));
      calculatePreEstimateTotalAmount(dataAmount);
    } else {
      const dataAmount = DropDownState?.PreEstimateCost?.map((ele) => ({
        ...ele,
        [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
      }));

      setDropDownState((prevState) => ({
        ...prevState,
        PreEstimateCost: dataAmount,
      }));
      calculatePreEstimateTotalAmount(dataAmount);
    }
  };
  const handleCheck = (e, index) => {
    const { name, type, checked, value } = e.target;

    if (index >= 0) {
      const data = [...DropDownState?.EstimationByDefault];
      data[index][name] = type === "checkbox" ? (checked ? "1" : "0") : value;

      setDropDownState((prevState) => ({
        ...prevState,
        EstimationByDefault: data,
      }));
      calculateTotalAmount(data);
    } else {
      const data = DropDownState?.EstimationByDefault?.map((ele) => ({
        ...ele,
        [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
      }));

      setDropDownState((prevState) => ({
        ...prevState,
        EstimationByDefault: data,
      }));
      calculateTotalAmount(data);
    }
  };

  const calculateTotalAmount = (data) => {
    const total = data
      .filter((item) => item.isChecked === "1")
      .reduce((sum, item) => sum + (parseFloat(item.Amount) || 0), 0);

    setTotalAmount(total);
  };
  const calculatePreEstimateTotalAmount = (dataAmount) => {
    const total = dataAmount
      .filter((item) => item.isItemChecked === "1")
      .reduce((sum, item) => sum + (parseFloat(item?.NetAmt) || 0), 0);

    setTotalPreEstimationAmount(total);
    console.log(total);
  };

  console.log("totalAmount", DropDownState?.PreEstimateCost);
  const PreAddHEAD = [
    t("S_No"),
    {name:<input
      type="checkbox"
      name={"isItemChecked"}
      onChange={handlePreEstimationCheck}
      checked={
        DropDownState?.PreEstimateCost?.length > 0
          ? isChecked(
              "isItemChecked",
              DropDownState?.PreEstimateCost,
              "1"
            ).includes(false)
            ? false
            : true
          : false
      }
    />},
    t("Department"),
    t("Qty"),
    t("Amount"),
  ];
  const THEAD = [
    t("S_No"),
    t("Room Type"),
    t("Doctor Name"),
    t("Panel Name"),
    t("Bill No."),
    t("Bill Date"),
    t("Bill Amount"),
  ];
  const AddHEAD = [
    t("S_No"),
    {name:<input
      type="checkbox"
      name={"isChecked"}
      onChange={handleCheck}
      checked={
        DropDownState?.EstimationByDefault?.length > 0
          ? isChecked(
              "isChecked",
              DropDownState?.EstimationByDefault,
              "1"
            ).includes(false)
            ? false
            : true
          : false
      }
    />},
    t("Department"),
    t("Remarks"),
    t("Amount"),
  ];

  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={"Search Criteria"}
          isBreadcrumb={true}
          secondTitle={
            <>
              <button
                className="btn btn-xs text-white"
                onClick={() =>
                  ModalComponent(
                    t("New Registration"),
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

        {Object.keys(singlePatientData)?.length === 0 ? (
          <SearchComponentByUHIDMobileName onClick={handleSinglePatientData} />
        ) : (
          <>
            <DetailCard
              ModalComponent={ModalComponent}
              singlePatientData={singlePatientData}
              values={values}
              setValues={setValues}
              setFieldValue={setFieldValue}
              handlePaymentGateWay={handlePaymentGateWay}
              handleTypeDropwn={handleTypeDropwn}
              sendReset={sendReset}
            />
            <div className="card patient_registration border">
              <Heading
                title={t(
                  "Searching_Criteria_for_Estimation_Billing"
                )}
              />

              <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">
                <ReactSelect
                  placeholderName={t("ConpanyName")}
                  id={"PanelID"}
                  name={"PanelID"}
                  dynamicOptions={getBindPanelListData?.map((item) => ({
                    label: item?.Company_Name,
                    value: item?.PanelID,
                  }))}
                  handleChange={handleReactSelect}
                  value={parseFloat(values?.PanelID?.value)}
                  searchable={true}
                  respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                />
                <ReactSelect
                  placeholderName={t("Doctor")}
                  id={"DoctorID"}
                  searchable={true}
                  dynamicOptions={DropDownState?.getDoctorDeptWise}
                  respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                  name="DoctorID"
                  value={values?.DoctorID?.value}
                  requiredClassName="required-fields"
                  handleChange={handleReactSelect}
                />
                <ReactSelect
                  placeholderName={t("Room_Type")}
                  id={"roomType"}
                  name="roomType"
                  value={values?.roomType?.value}
                  handleChange={handleReactSelect}
                  dynamicOptions={DropDownState?.getRoomType?.map((item) => ({
                    label: item?.Name,
                    value: item?.IPDCaseTypeID,
                  }))}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
                <ReactSelect
                  placeholderName={t("Package")}
                  id={"packageID"}
                  name={"packageID"}
                  value={values?.packageID?.value}
                  handleChange={handleReactSelect}
                  dynamicOptions={DropDownState?.getBindIPDPackage?.map(
                    (item) => ({
                      label: item?.PackageName,
                      value: item?.ItemID,
                    })
                  )}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
                <ReactSelect
                  placeholderName={t("Surgery")}
                  id={"surgeryID"}
                  name="surgeryID"
                  value={values?.surgeryID?.value}
                  handleChange={handleReactSelect}
                  dynamicOptions={DropDownState?.getBindSurgeryList?.map(
                    (item) => ({
                      label: item?.Name,
                      value: item?.Surgery_ID,
                    })
                  )}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                />
                <Input
                  type="text"
                  className="form-control"
                  id="icdCode"
                  name="icdCode"
                  value={values?.icdCode}
                  onChange={handleChange}
                  lable={t("ICD Code")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                />
                <DatePicker
                  className="custom-calendar"
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  id="fromDate"
                  name="fromDate"
                  // value={moment(values?.fromDate).format("DD-MM-YYYY")}
                  value={
                    values.fromDate
                      ? moment(values?.fromDate, "YYYY-MMM-DD").toDate()
                      : values?.fromDate
                  }
                  handleChange={handleChange}
                  lable={t("FromDate")}
                  placeholder={VITE_DATE_FORMAT}
                />
                <DatePicker
                  className="custom-calendar"
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  id="toDate"
                  name="toDate"
                  value={
                    values.toDate
                      ? moment(values?.toDate, "YYYY-MMM-DD").toDate()
                      : values?.toDate
                  }
                  handleChange={handleChange}
                  lable={t("ToDate")}
                  placeholder={VITE_DATE_FORMAT}
                />
                <Input
                  type="number"
                  className="form-control"
                  id="limit"
                  name="limit"
                  value={parseFloat(values?.limit)}
                  onChange={handleChange}
                  lable={t("No. Of Bill")}
                  placeholder=""
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  onKeyDown={Tabfunctionality}
                />
                <div className="col-sm-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSubmit}
                  >
                    {t("Search")}
                  </button>
                </div>
              </div>
              <SearchingCriteriaTable
                thead={THEAD}
                tbody={DropDownState?.SearchList}
                getBindPreEstimateCost={getBindPreEstimateCost}
              />
            </div>
            <div className="card patient_registration border">
              <div className="row">
                <div className="col-6">
                  <Heading
                    title={t(
                      "Additional_Estimation_Billing"
                    )}
                  />
                  <AdditionalEstimationTable
                    thead={AddHEAD}
                    tbody={DropDownState?.EstimationByDefault}
                    // tbody={tableData}
                    handleCheck={handleCheck}
                  />
                </div>

                <div className="col-6">
                  <Heading
                    title={t(
                      "Pre_Estimation_Billing"
                    )}
                    secondTitle={<span>{t("Bill No.")}{BillNo?.BillNo}</span>}
                  />
                  <PreEstimateBillingTable
                    thead={PreAddHEAD}
                    tbody={DropDownState?.PreEstimateCost}
                    handlePreEstimationCheck={handlePreEstimationCheck}
                  />
                </div>
              </div>
            </div>
            <div className="card patient_registration border">
              <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2 d-flex justify-content-center">
                <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                  <LabeledInput
                    label={t(
                      "Additional_Estimate"
                    )}
                    value={totalAmount}
                  />
                </div>
                <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                  <LabeledInput
                    label={t("Pre_Estimate")}
                    value={totalPreEstimationAmount}
                  />
                </div>
                <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                  <LabeledInput
                    label={t("Total_Estimate")}
                    value={totalAmount + totalPreEstimationAmount}
                  />
                </div>
              </div>
            </div>

            <div className="card patient_registration border">
              <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">
                <DatePicker
                  className="custom-calendar"
                  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  id="dateProcedure"
                  name="dateProcedure"
                  value={
                    values.fromDate
                      ? moment(values?.dateProcedure, "YYYY-MMM-DD").toDate()
                      : values?.fromDate
                  }
                  handleChange={handleChange}
                  lable={t("Date Procedure")}
                  placeholder={VITE_DATE_FORMAT}
                />

                <Input
                  type="text"
                  className="form-control "
                  id="lengthOfStay"
                  name="lengthOfStay"
                  value={values?.lengthOfStay}
                  onChange={handleChange}
                  lable={t("Length_Of_Stay")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                />
                <Input
                  type="text"
                  className="form-control "
                  id="diagnosis"
                  name="diagnosis"
                  value={values?.diagnosis}
                  onChange={handleChange}
                  lable={t("Diagnosis")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                />
                <Input
                  type="text"
                  className="form-control "
                  id="remarks"
                  name="remarks"
                  value={values?.remarks}
                  onChange={handleChange}
                  lable={t("Remarks")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                />
                <div className="col-xl-2 col-md-3 col-sm-4 col-4 mb-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSaveEstimateCost}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <PaymentGateway
        screenType={paymentControlModeState}
        setScreenType={setPaymentControlModeState}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        button={
          <button className="button" onClick={handleSaveOPDAdvance}>
            {values?.Type?.label === "Advance"
              ? t("Advance")
              : t("FrontOffice.OPD.OPDAdvance.label.Refund")}
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
    </>
  );
}

const DetailCard = ({ ModalComponent, singlePatientData, sendReset }) => {
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const SEEMOREDETAILS = [
    {
      name: "Edit Demographic Details",
      component: <Index data={singlePatientData} />,
    },
    {
      name: "View Documents",
      component: <UploadViewDocument />,
    },
    {
      name: "View Prescriptions",
      component: "",
    },
    {
      name: "OLD Dischanrge Summary",
      component: "",
    },
    {
      name: "Lab Reports",
      component: "",
    },
    {
      name: "Blacklist Patient",
      component: <PatientBlackList />,
    },
    {
      name: "Card Print",
      component: "",
    },
    {
      name: "Stricker Print",
      component: "",
    },
    {
      name: "Last 5 Visit History",
      component: "",
    },
  ];

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };
  useEffect(() => {
    setHandleModelData((val) => ({ ...val, modalData: modalData }));
  }, [modalData]);

  const handleDataInDetailView = useMemo(() => {
    const data = [
      {
        label: t("PatientId"),
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
        label: t("OutStanding"),
        value: singlePatientData?.Outstanding ?? "0",
      },
      {
        label: t("AvailableAmt"),
        value: singlePatientData.OPDAdvanceAmount,
      },
    ];

    return data;
  }, [singlePatientData]);

  return (
    <>
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

      <DetailsCardForDefaultValue
        singlePatientData={handleDataInDetailView}
        seeMore={SEEMOREDETAILS}
        ModalComponent={ModalComponent}
        sendReset={sendReset}
      />
    </>
  );
};
