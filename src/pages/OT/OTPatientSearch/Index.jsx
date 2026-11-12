import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useFormik } from "formik";
import { Tabfunctionality } from "../../../utils/helpers";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import PatientRegSearchTable from "../../../components/UI/customTable/billings/PatientRegSearchTable";
import { useTranslation } from "react-i18next";
import {
  FromAgesTOAges,
  IPDPatientAdmisiion,
  PatientSearchPayload,
  typeStatus,
} from "../../../utils/constant";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useDispatch, useSelector } from "react-redux";
import { GetBindAllDoctorConfirmation } from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import OTSearchTable from "./OTSearchTable";
import {
  BindOTdetails,
  OTBindOTTATTypeAPI,
  OTGetOTPatientSearchData,
} from "../../../networkServices/OT/otAPI";
import { notify } from "../../../utils/ustil2";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";

const Index = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const [dropDownSate, setDropDownState] = useState({
    OT: [],
  });
  const { GetDepartmentList, GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const initialValues = {
    mrNo: "",
    pName: "",
    department: { value: "", label: "" },
    ipdNo: "",
    OTBookingNo: "",
    doctorID: { value: "0", label: "" },
    OT: { value: "0", label: "" },
    fromDate: new Date(),
    toDate: new Date(),
    Received: { value: "2" },
  };
  const [bodyData, setBodyData] = useState([]);
  const [values, setValues] = useState(initialValues);

  const TheadDepartmentWise = [
    { name: t("S/No."), width: "1%" },
    { name: t("Select") },
    { name: t("UHID") },
    { name: t("IPD No.") },
    { name: t("Patient Name") },
    { name: t("Age/Sex") },
    { name: t("OT Booking No.") },
    { name: t("OT Name") },
    { name: t("Doctor Name") },
    { name: t("OT Date") },
    { name: t("OT Timing") },
    { name: t("Confirmed Date") },
  ];

  const handleReactSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localdata?.centreID,
      })
    );
    bindOTType();
  }, [dispatch]);

  const bindOTType = async () => {
    let apiResp = await OTBindOTTATTypeAPI();
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = async (isMap, isReceived) => {
    const payload = {
      uhid: String(values?.mrNo) ? String(values?.mrNo) : "",
      ipdNo: String(values?.ipdNo) || "",
      patientName: String(values?.pName) || "",
      doctorID: String(values?.doctorID?.value) || "0",
      bookingOTNo: String(values?.OTBookingNo) || "",
      otid: Number(values?.OT?.value) || 0,
      fromDate: String(moment(values?.fromDate).format("DD-MMM-YYYY")),
      toDate: String(moment(values?.toDate).format("DD-MMM-YYYY")),
      isReceived: isReceived !== undefined && isReceived !== null? isReceived: Number(values?.Received?.value) || 0,
      isMap: isMap || 0,
    };

    const response = await OTGetOTPatientSearchData(payload);

    if (response?.success) {
      setBodyData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const bindOTdata = async () => {
    const response = await BindOTdetails();
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        OT: handleReactSelectDropDownOptions(response?.data, "Name", "ID"),
      }));
    }
  };

  useEffect(() => {
    bindOTdata();
  }, []);
  return (
    <>
      <div className="card patient_registration border">
        <Heading title={t("Admitted Patients")} isBreadcrumb={true} />
        <div className="p-2">
          <div className="row">
            <Input
              type="text"
              className="form-control"
              lable={t("UHID")}
              placeholder=" "
              id="mrNo"
              name="mrNo"
              onChange={handleChange}
              value={values?.mrNo}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <Input
              type="text"
              className="form-control"
              lable={t("PatientName")}
              placeholder=" "
              id="pName"
              name="pName"
              onChange={handleChange}
              value={values?.pName}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              placeholderName={t("Doctor")}
              id={"doctorID"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name={"doctorID"}
              dynamicOptions={[
                { label: "All", value: "0" },
                ...GetBindAllDoctorConfirmationData.map((item) => {
                  return {
                    label: item?.Name,
                    value: item?.DoctorID,
                  };
                }),
              ]}
              value={values?.doctorID?.value}
              handleChange={handleReactSelect}
            />

            <Input
              type="text"
              className="form-control"
              lable={t("OT Booking No.")}
              placeholder=" "
              id="OTBookingNo"
              name="OTBookingNo"
              onChange={handleChange}
              value={values?.OTBookingNo}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("OT")}
              id={"OT"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name={"OT"}
              dynamicOptions={dropDownSate?.OT}
              value={values?.OT?.value}
              handleChange={handleReactSelect}
            />

            <Input
              type="text"
              className="form-control"
              lable={t("IPD No.")}
              placeholder=" "
              id="IPDNo"
              name="IPDNo"
              onChange={handleChange}
              value={values?.IPDNo}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id="fromDate"
              name="fromDate"
              value={values.fromDate}
              handleChange={handleChange}
              lable={t("From Date")}
              placeholder={VITE_DATE_FORMAT}
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id="toDate"
              name="toDate"
              value={values.toDate}
              handleChange={handleChange}
              lable={t("To Date")}
              placeholder={VITE_DATE_FORMAT}
            />
            <ReactSelect
              placeholderName={t("Received")}
              id={"Received"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name={"Received"}
              dynamicOptions={[
                { label: "All", value: "2" },
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              value={values?.Received?.value}
              handleChange={handleReactSelect}
            />

            <button
              className="btn btn-sm btn-success ml-2 px-3"
              onClick={() => handleSearch()}
            >
              {t("Search")}
            </button>

          </div>
        </div>
      </div>

      <div className="mt-2 spatient_registration_card">
        <div
          className="patient_registration card "
          style={{ borderRadius: "5px" }}
        >
          <Heading
            title={t("Patient Details")}
            secondTitle={
              <>
                <ColorCodingSearch
                  color={"color-indicator-2-bg"}
                  label={t("Patient Not Received")}
                  onClick={() => handleSearch(0, 0)}
                />
                <ColorCodingSearch
                  color={"color-indicator-1-bg"}
                  label={t("Patient Received")}
                  onClick={() => handleSearch(0, 1)}
                />
                <ColorCodingSearch
                  color={"color-indicator-3-bg"}
                  label={t("IPD Not Map")}
                  onClick={() => handleSearch(1, 2)}
                />
              </>
            }
          />

          <OTSearchTable
            THEAD={TheadDepartmentWise}
            tbody={bodyData}
            handleSearch={handleSearch}
            values={values?.id}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
