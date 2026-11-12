import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import OverLay from "../../../components/modalComponent/OverLay";
import Index from "../PatientRegistration/Index";
import { useCallback, useEffect, useMemo, useState } from "react";
import PatientBlackList from "../PatientRegistration/PatientBlackList";

import {
  bindHashCode,
  bindPanelByPatientID,
  CommonAPIBindOPDAdvanceMaster,
  GetBindDoctorDept,
  PatientSearchbyBarcode,
  SaveAdvanceAmount,
} from "../../../networkServices/opdserviceAPI";
import {
  MOBILE_NUMBER_VALIDATION_REGX,
  PAYMENT_OBJECT,
  Type_list,
  number,
} from "../../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateAdvanceReason,
  GetAdvanceReason,
  GetBindDepartment,
  GetBindReferDoctor,
  GetBindReferalType,
} from "../../../store/reducers/common/CommonExportFunction";
import UploadViewDocument from "../OPD/UploadViewDocument";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReasonAddModal from "../../../components/modalComponent/Utils/ReasonAddModal";
import Modal from "../../../components/modalComponent/Modal";
import { useFormik } from "formik";
import PaymentGateway from "../../../components/front-office/PaymentGateway";
import SearchComponentByUHIDMobileName from "../../../components/commonComponents/SearchComponentByUHIDMobileName";
import DetailsCardForDefaultValue from "../../../components/commonComponents/DetailsCardForDefaultValue";
import {
  calculateBillAmount,
  handleReactSelectDropDownOptions,
  inputBoxValidation,
  notify,
  payloadSettlerForPaymentGateWay,
  PAYMENT_MODE_FLAG_ISREFUND,
  saveOPDAdvancePayload,
} from "../../../utils/utils";
import { debounce } from "../../../networkServices/axiosInstance";
import { OpenPDFURL, RedirectURL } from "../../../networkServices/PDFURL";
import { CommonReceiptPdf } from "../../../networkServices/BillingsApi";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";

export default function OPDAdvance() {

  const [t] = useTranslation();
  const [singlePatientData, setSinglePatientData] = useState({});
  const [visible, setVisible] = useState(false);

  const { BindResource } = useSelector((state) => state.CommonSlice);

  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentControlModeState, setPaymentControlModeState] =
    useState(PAYMENT_OBJECT);
  // const [advanceOptions, setAdvanceOptions] = useState([]);

  const Reason_list = {
    Reason: "",
    Type: "0",
    amount: null,
  };

  // advanceOptions.forEach(option => {
  //   Reason_list[option.TYPE] = 0;
  // });

  console.log(Reason_list, "Reason_list");

  const { values, setFieldValue, handleChange, setValues } = useFormik({
    initialValues: Reason_list,
    onSubmit: (values, { resetForm }) => {
      console.log("reasonValues", values);
    },
  });

  const sendReset = () => {
    setSinglePatientData({});
    setValues(Reason_list);
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
      if (!paymentControlModeState?.DepositedBy) {
        notify("Deposited By is required", "error");
        return;
      } else if (paymentMethod?.length === 0) {
        notify("Payment Mode is required", "error");
        return;
      }
      // if (values?.Type?.value === 1) {
      //   let totalAdvanceAmount = 0;

      //   advanceOptions?.forEach((item) => {
      //     const value = parseFloat(values[item?.TYPE]) || 0;
      //     totalAdvanceAmount += value;
      //   });

      //   const totalAmount = parseFloat(values?.amount) || 0;

      //   if (totalAdvanceAmount !== totalAmount) {
      //     notify(
      //       `${t("Sum of all advance amounts must be equal to")} ${totalAmount}`,
      //       "error"
      //     );
      //     return;
      //   }
      // }

      const hashcode = await bindHashCode();
      debugger
      const data = await SaveAdvanceAmount({

        dataPaymentDetail: payloadSettlerForPaymentGateWay(paymentMethod, values,paymentControlModeState),

        ...saveOPDAdvancePayload({
          ...singlePatientData,
          hashcode: hashcode?.data,
          ...paymentControlModeState,
          ...values,
          ...BindResource,
        }),
      });

      if (data?.success) {
        notify(data?.message, "success");
        sendReset();
        const reportResp = await CommonReceiptPdf({
          ledgerTransactionNo: data?.data?.ledgerTransactionNo,
          isBill: 0,
          receiptNo: "",
          duplicate: "",
          type: "OPD",
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
        // OpenPDFURL("OPDSericeReceipt", data?.data?.ledgerTransactionNo, "opd");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleBindOPDAdvanceMaster = async () => {
    // debugger
    try {
      const response = await CommonAPIBindOPDAdvanceMaster();

      if (response?.success) {
        setAdvanceOptions(response?.data);
      } else {
        setAdvanceOptions([]);
      }
    } catch (error) {
      console.log(error);
      setAdvanceOptions([]);
    }
  };

  // useEffect(() => {
  //   handleBindOPDAdvanceMaster();
  // }, []);

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
          <DetailCard
            ModalComponent={ModalComponent}
            singlePatientData={singlePatientData}
            values={values}
            setValues={setValues}
            setFieldValue={setFieldValue}
            setVisible={setVisible}
            handlePaymentGateWay={handlePaymentGateWay}
            handleTypeDropwn={handleTypeDropwn}
            bindDetailAPI={handleSinglePatientData}
            sendReset={sendReset}
          // advanceOptions={advanceOptions}
          />
        )}
      </div>

      <PaymentGateway
        screenType={paymentControlModeState}
        setScreenType={setPaymentControlModeState}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        button={
          <button className="button" onClick={handleSaveOPDAdvance}>
            {Number(values?.Type?.value) === 1 ? t("Advance") : t("Refund")}
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

const DetailCard = ({
  ModalComponent,
  singlePatientData,
  values,
  setValues,
  setFieldValue,
  handlePaymentGateWay,
  handleTypeDropwn,
  sendReset,
  bindDetailAPI,
  setVisible,
  // advanceOptions
}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const { ReasonWiseCache } = useSelector((state) => state.CommonSlice);
  const [DropDownState, setDropDownState] = useState({
    getDoctorDeptWise: [],
  });
  useEffect(() => {
    setValues((val) => ({
      ...val,
      Type: { value: 1 },
      Doctor: singlePatientData?.DoctorID,
      goDate: new Date(),
      AdvanceType: { label: "OPD Advance", value: "0" }
    }));
  }, []);

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

  const handleChangeModel = (data) => {
    setModalData(data);
  };
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

  const handleSelect = (name, value) => {
    setFieldValue(name, value);
  };

  const handleCreateAdvanceReason = async (data) => {
    let insData = await dispatch(CreateAdvanceReason(data));
    if (insData?.payload?.success) {
      dispatch(GetAdvanceReason());
      setModalData({});
      setHandleModelData((val) => ({ ...val, isOpen: false }));
    }
  };

  const debouncedCalculateAndHandlePayment = useCallback(
    debounce((value, values) => {
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
        values?.Type?.value === 1
          ? PAYMENT_MODE_FLAG_ISREFUND["advance"]
          : PAYMENT_MODE_FLAG_ISREFUND["refund"],
        0,
        0.0,
        1,
        1
      );

      handlePaymentGateWay(data);
    }, 300),
    []
  );

  const handleDoctorDeptWise = async (Department) => {
    try {
      const response = await GetBindDoctorDept("All");
      if (response?.success) {
        setDropDownState((preV) => ({
          ...preV,
          getDoctorDeptWise: handleReactSelectDropDownOptions(
            response?.data,
            "Name",
            "DoctorID"
          ),
        }));
      }
      // return data?.data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleDoctorDeptWise();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    debouncedCalculateAndHandlePayment(value, values);
    // const data = calculateBillAmount(
    //   [
    //     {
    //       panelID: 1,
    //       grossAmount: Number(value),
    //       discountAmount: 0,
    //       PayableAmount: Number(value),
    //     },
    //   ],
    //   "1",
    //   0,
    //   values?.Type?.value === 1
    //     ? PAYMENT_MODE_FLAG_ISREFUND["advance"]
    //     : PAYMENT_MODE_FLAG_ISREFUND["refund"],
    //   0,
    //   0.0,
    //   1,
    //   1
    // );

    // handlePaymentGateWay(data);
  };

  useEffect(() => {
    dispatch(GetBindReferDoctor());
    dispatch(GetBindReferalType());
    dispatch(GetBindDepartment());
    dispatch(GetAdvanceReason());
  }, []);

  const handleDataInDetailView = useMemo(() => {
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
        value: singlePatientData?.Outstanding ?? "0",
      },
      {
        label: t("AvailableAmt"),
        value: singlePatientData.OPDAdvanceAmount,
      },
    ];

    return data;
  }, [singlePatientData]);
  const handleInputChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    const key = name || e.target.name;
    setValues({ ...values, [key]: value });
  };
  const compareOPDAdvanceAmount = (e, handleChange) => {
    if (values?.Type?.label === "Refund") {
      if (
        e.target.value <= parseInt(singlePatientData.OPDAdvanceAmount)
          ? parseInt(singlePatientData.OPDAdvanceAmount)
          : 0
      )
        handleChange(e);
    } else {
      handleChange(e);
    }
  };
  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: moment(value).format("YYYY-MM-DD"),
    }));
  };
  const handleBindPanelByPatientID = async () => {
    try {
      const data = await bindPanelByPatientID(singlePatientData?.PatientID);
      return data.data;
    } catch (error) {
      console.log(error);
    }
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
          modalData={handleModelData?.modalData}
          setModalData={setModalData}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <DetailsCardForDefaultValue
        singlePatientData={handleDataInDetailView}
        PatientRegistrationArg={PatientRegistrationArg}
        seeMore={SEEMOREDETAILS}
        ModalComponent={ModalComponent}
        sendReset={sendReset}
      >
        <>

          <ReactSelect
            placeholderName={t("Doctor")}
            id={"Doctor"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={DropDownState?.getDoctorDeptWise}
            name="Doctor"
            // value={76}
            value={values?.Doctor}
            // handleChange={handleReactSelectChange}
            handleChange={(name, value) => {
              setValues((val) => ({ ...val, [name]: value }));
              // handleTypeDropwn();
            }}
          />
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12"> */}
          <ReactSelect
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName={t("Advance Type")}
            searchable={true}

            id="AdvanceType"
            name="AdvanceType"
            handleChange={handleSelect}
            value={`${values?.AdvanceType?.value}`}
            dynamicOptions={[
              { label: "OPD Advance ", value: "0" },
              { label: "CMR Fund", value: "1" },
            ]}
          />
          {/* </div> */}
           <ReactSelect
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName={t("Type")}
                id="Type"
                name="Type"
                searchable={true}
                // handleChange={handleSelect}
                handleChange={(name, value) => {
                  setValues((val) => ({ ...val, [name]: value, amount: 0 }));
                  handleTypeDropwn();
                }}
                value={values?.Type?.value}
                dynamicOptions={Type_list}
              />
              <Input
                type="text"
                className="form-control"
                id="amount"
                name="amount"
                onChange={(e) => {
                  compareOPDAdvanceAmount(e, handleChange);
                  inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, () => { });
                }}
                value={values?.amount}
                lable={t("Amount")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              />





              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <div className="box-size">
                  <div className="box-upper">
                    <ReactSelect
                      placeholderName={t("Reason")}
                      searchable={true}
                      respclass=""
                      id="Reason"
                      name="ReasonID"
                      handleChange={handleSelect}
                      value={`${values?.ID}`}
                      dynamicOptions={ReasonWiseCache}
                    />
                    {
                      console.log("values", values)
                    }
                  </div>
                  <div className="box-inner">
                    <button
                      className="btn btn-sm btn-primary"
                      type="button"
                      onClick={() =>
                        handleModel(
                          t("Reason Add Modal"),
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
          {
            values?.AdvanceType?.value === "1" && <>


              <Input
                type="text"
                className="form-control"
                id="IGRSNumber"
                name="IGRSNumber"
                onChange={handleInputChange}
                // onChange={(e) => {
                //   compareOPDAdvanceAmount(e, handleChange);
                //   // inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, () => {});
                // }}
                value={values?.IGRSNumber}
                lable={t("IGRS Number")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              />

              <Input
                type="text"
                className="form-control"
                id="EstiMateNumber"
                name="EstiMateNumber"
                onChange={handleInputChange}
                // onChange={(e) => {
                //   compareOPDAdvanceAmount(e, handleChange);
                //   // inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, () => {});
                // }}
                value={values?.EstiMateNumber}
                lable={t("EstiMate No.")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              />
              <Input
                type="text"
                className="form-control"
                id="GoNumber"
                name="GoNumber"
                onChange={handleInputChange}
                // onChange={(e) => {
                //   compareOPDAdvanceAmount(e, handleChange);
                //   // inputBoxValidation(MOBILE_NUMBER_VALIDATION_REGX, e, () => {});
                // }}
                value={values?.GoNumber}
                lable={t("Go Number")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              />
              <DatePicker
                className="custom-calendar"
                id="goDate"
                name="goDate"
                lable={t("Go Date")}
                placeholder={VITE_DATE_FORMAT}
                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                value={
                  values.goDate
                    ? moment(values.goDate, "YYYY-MM-DD").toDate()
                    : null
                }
                maxDate={new Date()}
                handleChange={searchHandleChange}
              />
             
            </>
          }

        </>
      </DetailsCardForDefaultValue>
    </>
  );
};
