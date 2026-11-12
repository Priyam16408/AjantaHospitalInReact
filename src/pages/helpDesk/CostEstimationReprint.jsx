import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import OverLay from "../../components/modalComponent/OverLay";
import { useEffect, useMemo, useState } from "react";
import { PatientSearchbyBarcode } from "../../networkServices/opdserviceAPI";
import { PATIENT_DETAILS } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Modal from "../../components/modalComponent/Modal";
import { useFormik } from "formik";
import SearchComponentByUHIDMobileName from "../../components/commonComponents/SearchComponentByUHIDMobileName";
import DetailsCardForDefaultValue from "../../components/commonComponents/DetailsCardForDefaultValue";
import Heading from "../../components/UI/Heading";
import Index from "../frontOffice/PatientRegistration/Index";
import PatientBlackList from "../frontOffice/PatientRegistration/PatientBlackList";
import UploadViewDocument from "../frontOffice/OPD/UploadViewDocument";
import { Tabfunctionality } from "../../utils/helpers";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import MultiSelectComp from "../../components/formComponent/MultiSelectComp";
import TimePicker from "../../components/formComponent/TimePicker";
import { GetBindAllDoctorConfirmation } from "../../store/reducers/common/CommonExportFunction";
import {
  AdmissionType,
  BillingCategory,
  BindRoomBed,
  RoomType,
} from "../../networkServices/BillingsApi";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
export default function CostEstimateBilling() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [singlePatientData, setSinglePatientData] = useState({});
  const [visible, setVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const [BodyData, setBodyData] = useState({
    doctorMulti: [],
    getAdmissionType: [],
    getRoomType: [],
    getBillingCategory: [],
    getBindRoomBed: [],
  });

  const handleSave = () => {};
  const { handleChange, values, setFieldValue, setValues, handleSubmit } =
    useFormik({
      initialValues: PATIENT_DETAILS,
      onSubmit: (values, { resetForm }) => {
        handleSave(values);
      },
    });

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
  }, [dispatch]);

  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.code);
    const selectedNames = selectedOptions
      .map((option) => option.name)
      .join(", ");
    setFieldValue(name, selectedNames);
    setBodyData((prev) => ({
      ...prev,
      [`${name}Multi`]: selectedValues,
    }));
  };
  const handleTimeChange = (e, timeType) => {
    const selectedTime = moment(e.target.value, "HH:mm:ss").format("HH:mm:ss");
    setFieldValue(timeType, selectedTime);
  };

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
  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
    switch (name) {
      case "roomType":
        getBindRoom({ caseType: value.value });
        break;

      default:
        break;
    }
  };
  const getBindAdmissionType = async () => {
    try {
      const dataRes = await AdmissionType();
      setBodyData((prevState) => ({
        ...prevState,
        getAdmissionType: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getBindRoomType = async () => {
    try {
      const dataRes = await RoomType();
      setBodyData((prevState) => ({
        ...prevState,
        getRoomType: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindRoom = async (params, pa) => {
    console.log(params);
    console.log(pa);

    const newPayload = {
      caseType: params.caseType,
      isDisIntimated: 0,
      type: "1",
      bookingDate: singlePatientData?.DateEnrolled || "",
    };
    try {
      const dataRes = await BindRoomBed(newPayload);
      setBodyData((prevState) => ({
        ...prevState,
        getBindRoomBed: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindBillingCategory = async () => {
    try {
      const dataRes = await BillingCategory();
      setBodyData((prevState) => ({
        ...prevState,
        getBillingCategory: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const bindAllAPI = async () => {
    await getBindAdmissionType();
    await getBindRoomType();
    await getBindBillingCategory();
  };

  useEffect(() => {
    bindAllAPI();
  }, []);
  console.log(singlePatientData);
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
                    " New Registration",
                    <Index
                      bindDetail={true}
                      bindDetailAPI={handleSinglePatientData}
                      setVisible={setVisible}
                    />
                  )
                }
              >
                {t("NewRegistration")}
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
              sendReset={sendReset}
            />
            <form
              className="patient_registration position-relative"
              onSubmit={handleSubmit}
            >
              <div className="card p-1">
                <div className="row">
                  <MultiSelectComp
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name="doctor"
                    id="doctor"
                    placeholderName={t("Doctor")}
                    dynamicOptions={GetBindAllDoctorConfirmationData?.map(
                      (item) => ({
                        name: item.Name,
                        code: item.DoctorID,
                      })
                    )}
                    handleChange={handleMultiSelectChange}
                    value={BodyData?.doctorMulti?.map((code) => ({
                      code,
                      name: GetBindAllDoctorConfirmationData?.find(
                        (item) => item.DoctorID === code
                      )?.Name,
                    }))}
                  />
                  {BodyData?.doctorMulti?.length > 0 && (
                    <div className="col-12 col-sm-10 col-md-10">
                      <div className="doctorBind">
                        <div className="doctorsName">
                          {BodyData?.doctorMulti
                            ?.map((code) => {
                              const doctorName =
                                GetBindAllDoctorConfirmationData?.find(
                                  (item) => item.DoctorID === code
                                )?.Name;
                              return doctorName ? doctorName : null;
                            })
                            .join("  ,  ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
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
                    lable={t("Admission Date")}
                    placeholder={VITE_DATE_FORMAT}
                  />
                  <TimePicker
                    placeholderName={t("Admission Time")}
                    lable={t("Admission Time")}
                    id="toTime"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    name="toTime"
                    value={new Date(`1970-01-01T00:00:00`)}
                    handleChange={(e) => handleTimeChange(e, "toTime")}
                  />
                  <ReactSelect
                    placeholderName={t("Admission Type")}
                    id={"ADMISSIONTYPE"}
                    name="ADMISSIONTYPE"
                    value={values?.ADMISSIONTYPE?.value}
                    handleChange={handleReactSelect}
                    dynamicOptions={BodyData?.getAdmissionType?.map((item) => ({
                      label: item?.ADMISSIONTYPE,
                      value: item?.ID,
                    }))}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />
                  <ReactSelect
                    placeholderName={t(
                      "Room_Type"
                    )}
                    id={"roomType"}
                    name="roomType"
                    value={values?.roomType?.value}
                    handleChange={handleReactSelect}
                    dynamicOptions={BodyData?.getRoomType?.map((item) => ({
                      label: item?.Name,
                      value: item?.IPDCaseTypeID,
                    }))}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />
                  <ReactSelect
                    placeholderName={t("Room/BedNo")}
                    id={"RoomBed"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                    name="RoomBed"
                    dynamicOptions={BodyData?.getBindRoomBed?.map((item) => ({
                      label: item?.Name,
                      value: item?.RoomId,
                    }))}
                    value={values?.RoomBed?.value}
                    handleChange={handleReactSelect}
                    requiredClassName="required-fields"
                  />
                  <ReactSelect
                    placeholderName={t("Billing Category")}
                    id={"BillingCategory"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                    name="BillingCategory"
                    dynamicOptions={BodyData?.getBillingCategory?.map(
                      (item) => ({
                        label: item?.Name,
                        value: item?.IPDCaseTypeID,
                      })
                    )}
                    value={values?.BillingCategory?.value}
                    handleChange={handleReactSelect}
                    requiredClassName="required-fields"
                  />

                  <ReactSelect
                    placeholderName={t("Refered Source")}
                    id={"DoctorID"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                    name="DoctorID"
                    // dynamicOptions={DropDownState?.getDoctorDeptWise}
                    // value={values?.DoctorID?.value}
                    // handleChange={handleReactSelect}
                    requiredClassName="required-fields"
                  />

                  <ReactSelect
                    placeholderName={t("Request Room")}
                    id={"DoctorID"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                    name="DoctorID"
                    // dynamicOptions={DropDownState?.getDoctorDeptWise}
                    // value={values?.DoctorID?.value}
                    // handleChange={handleReactSelect}
                    requiredClassName="required-fields"
                  />
                  <Input
                    type="number"
                    className="form-control"
                    id="limit"
                    name="limit"
                    // value={parseFloat(values?.limit)}
                    // onChange={handleChange}
                    lable={t("Visitor Card Qty")}
                    placeholder=""
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                  />
                  <Input
                    type="number"
                    className="form-control"
                    id="limit"
                    name="limit"
                    // value={parseFloat(values?.limit)}
                    // onChange={handleChange}
                    lable={t("Admission Reason")}
                    placeholder=""
                    respclass="col-xl-6 col-md-4 col-sm-4 col-12"
                    onKeyDown={Tabfunctionality}
                  />
                </div>
                <div className="row text-right">
                  <div className="col-sm-12">
                    <button
                      className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                      type="submit"
                    >
                      {t("Save")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
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
