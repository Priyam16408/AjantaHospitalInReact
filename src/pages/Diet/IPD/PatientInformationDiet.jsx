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
import {
  GetBindAllDoctorConfirmation,
  GetBindDepartment,
} from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  BindFloor,
  bindPanelRoleWisePanelGroupWise,
  PatientSearch,
  RoomType,
} from "../../../networkServices/BillingsApi";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import { dietPatientSearchApi } from "../../../networkServices/DietApi";

const PatientInFormationDiet = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const { GetDepartmentList, GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const [bodyData, setBodyData] = useState({
    SearchPatient: [],
    getRoomType: [],
    getBindFloor: [],
    getBindPanel: [],
  });


  const handleCommaSepratedData = (data) => {
    return data?.map((val) => val?.code).join(",");
  }
  // console.log(GetDepartmentList);
  const { handleChange, values, setFieldValue, handleSubmit, setValues } =
    useFormik({
      initialValues: PatientSearchPayload,
      onSubmit: async (values, { resetForm }, data) => {
        const newValues = {
          mrNo: values?.mrNo ? values?.mrNo : "",
          pName: values?.pName ? values?.pName : "",
          department: values?.department?.value
            ? `${values?.department?.value}`
            : "ALL",
          floor: handleCommaSepratedData(values?.floor),
          roomType: handleCommaSepratedData(values?.IPDCaseTypeID),

          ageFrom: values?.ageFrom ? values?.ageFrom : "",
          ddlAgeFrom: values?.ddlAgeFrom?.value
            ? values?.ddlAgeFrom?.value
            : "",
          ageTo: values?.ageTo ? values?.ageTo : "",
          ddlAgeTo: values?.ddlAgeTo?.value ? values?.ddlAgeTo?.value : "",
          ipdNo: values?.ipdNo ? values?.ipdNo : "",
          doctorID: values?.doctorID?.value
            ? `${values?.doctorID?.value}`
            : "0",
          panel: values?.panelID?.value ? `${values?.panelID?.value}` : "0",
          parentPanel: "0",
          fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
          toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
          admitDischarge: values?.admitDischarge?.value
            ? values?.admitDischarge?.value
            : "0",
          type: values?.OnlyPanelPatient === true ? "1" : "0",
          // id: values?.id ? values?.id : 0,
          id: values?.id?.value
            ? values?.id?.value
            : values?.id
              ? values?.id
              : 0,
          isPatientReceived: values?.id === 5 ? 1 : values?.id === 6 ? 0 : 2,
          visitDateFrom: "",
          visitDateTo: "",
          labNo: "",
          userType: "",
        };
        try {
          const dataRes = await dietPatientSearchApi(newValues);
          setBodyData((prevState) => ({
            ...prevState,
            SearchPatient: dataRes?.data,
          }));
     
        } catch (error) {
          console.error(error);
        }
      },
    });

  const handleMultiSelectChange = (name, selectedOptions) => {
    console.log(selectedOptions);
    setFieldValue(name, selectedOptions);
    // setFieldValue({ ...values, [name]: selectedOptions });
  };

  const TheadDepartmentWise = [
    t("Action"),
    t("Print"),
    t("Admit Date"),
    t("Dis. Date"),
    t("IPD No."),
    { name: t("Patient Name") },
    t("UHID"),
    t("Age/Gender"),
    t("Contact No."),
    t("Doctor"),
    t("Panel"),
    t("Room Name"),
    t("Relation"),
    t("Admitted By"),
  ];

  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
  };
  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localdata?.centreID,
      })
    );
    dispatch(GetBindDepartment());
  }, [dispatch]);

  const getBindPanelGroup = async () => {
    try {
      const dataRes = await bindPanelRoleWisePanelGroupWise();
      // console.log("ttriueu");
      setBodyData((prevState) => ({
        ...prevState,
        getBindPanel: dataRes?.data,
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
  const BindFloorApi = async () => {
    try {
      const dataRes = await BindFloor();
      setBodyData((prevState) => ({
        ...prevState,
        getBindFloor: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const bindAllAPI = async () => {
    await getBindRoomType();
    await BindFloorApi();
    await getBindPanelGroup();
  };
  useEffect(() => {
    bindAllAPI();
  }, []);
  const handleStatusClick = (id) => {
    setFieldValue("id", id);
    handleSubmit();
  };


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
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={Tabfunctionality}
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
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={Tabfunctionality}
            />

            <ReactSelect
              placeholderName={t("Panel")}
              id="panelID"
              inputId="panelID"
              name="panelID"
              value={values?.panelID?.value || "0"}
              handleChange={handleReactSelect}
              dynamicOptions={[
                { label: "ALL", value: "0" },
                ...(bodyData?.getBindPanel?.map((item) => ({
                  label: item?.company_Name,
                  value: item?.panelID,
                })) || []),
              ]}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <ReactSelect
              placeholderName={t(
                "Specialization"
              )}
              id={"department"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              name={"department"}
              dynamicOptions={[
                { label: "ALL", value: "ALL" },
                ...GetDepartmentList?.map((item) => {
                  return {
                    label: item?.Name,
                    value: item?.ID,
                  };
                }),
              ]}
              value={values?.department?.value}
              handleChange={handleReactSelect}
            />
            <ReactSelect
              placeholderName={t(
                "DoctorName"
              )}
              id={"doctorID"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
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
            <MultiSelectComp
              placeholderName={t("Floor")}
              id={"floor"}
              name="floor"
              value={values?.floor}
              handleChange={handleMultiSelectChange}
              dynamicOptions={bodyData?.getBindFloor?.map((item) => ({
                name: item?.name,
                code: item?.id,
              }))}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <MultiSelectComp
              placeholderName={t("Room_Type")}
              id="IPDCaseTypeID"
              name="IPDCaseTypeID"
              value={values?.IPDCaseTypeID}
              handleChange={handleMultiSelectChange}
              dynamicOptions={bodyData?.getRoomType?.map((item) => ({
                name: item?.Name,
                code: item?.IPDCaseTypeID,
              }))}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <div className="row">
                <Input
                  type="text"
                  className="form-control"
                  id="ageFrom"
                  name="ageFrom"
                  value={values?.ageFrom ? values?.ageFrom : ""}
                  onChange={handleChange}
                  lable={t("FromAge")}
                  placeholder=" "
                  respclass="col-md-6 col-7"
                  showTooltipCount={true}
                />
                <ReactSelect
                  placeholderName={t("Year")}
                  name="ddlAgeFrom"
                  value={`${values?.ddlAgeFrom?.value}`}
                  dynamicOptions={FromAgesTOAges}
                  handleChange={handleReactSelect}
                  searchable={true}
                  id={"ddlAgeFrom"}
                  respclass="col-md-6 col-5"
                />
              </div>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <div className="row">
                <Input
                  type="text"
                  className="form-control"
                  id="ageTo"
                  name="ageTo"
                  value={values?.ageTo ? values?.ageTo : ""}
                  onChange={handleChange}
                  lable={t("ToAge")}
                  placeholder=" "
                  respclass="col-md-6 col-7"
                  showTooltipCount={true}
                />
                <ReactSelect
                  placeholderName={t("Year")}
                  name="ddlAgeTo"
                  value={`${values?.ddlAgeTo?.value}`}
                  handleChange={handleReactSelect}
                  dynamicOptions={FromAgesTOAges}
                  searchable={true}
                  id={"ddlAgeTo"}
                  respclass="col-md-6 col-5"
                />
              </div>
            </div>

            <Input
              type="text"
              className="form-control"
              lable={t("IPD No")}
              placeholder=" "
              id="ipdNo"
              name="ipdNo"
              onChange={handleChange}
              value={values?.ipdNo}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={Tabfunctionality}
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              id="fromDate"
              name="fromDate"
              value={
                values.fromDate
                  ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                  : null
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
                  ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                  : null
              }
              handleChange={handleChange}
              lable={t("ToDate")}
              placeholder={VITE_DATE_FORMAT}
            />
            <ReactSelect
              placeholderName={t("STATUS")}
              name="admitDischarge"
              value={`${values?.admitDischarge?.value}`}
              handleChange={handleReactSelect}
              dynamicOptions={IPDPatientAdmisiion}
              searchable={true}
              id={"admitDischarge"}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
 
            <ReactSelect
              placeholderName={t("SearchBy")}
              name="id"
              handleChange={handleReactSelect}
              dynamicOptions={typeStatus?.map((item) => {
                return {
                  label: item?.label,
                  value: item?.value,
                };
              })}
              value={
                values?.status?.value
                  ? values?.status?.value
                  : values?.status
                    ? values?.status
                    : 0
              }
              searchable={true}
              id={"type"}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <div className="col-sm-2 d-flex justify-content-between">


              <div className="d-flex">
                <Input
                  type="checkbox"
                  placeholder=" "
                  className="mt-2"
                  name="OnlyPanelPatient"
                  onChange={handleChange}
                  checked={values?.OnlyPanelPatient === true ? "1" : "0"}
                  onKeyDown={Tabfunctionality}
                  respclass="col-md-1 col-1"
                />
                <label className="mt-2 ml-3">{t("Only Credit Patient")}</label>
              </div>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleStatusClick(0)}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card " style={{ borderRadius: "5px" }}>
          <Heading title={t("Patient Details")} secondTitle={<>
            <ColorCodingSearch color={"color-indicator-2-bg"} label={t("Patient Not Received")} onClick={() => handleStatusClick(6)} />
            <ColorCodingSearch color={"color-indicator-1-bg"} label={t("Zero Advance")}  onClick={() => handleStatusClick(3)} />
            <ColorCodingSearch color={"color-indicator-3-bg"} label={t("Above Threshold Limit")}  onClick={() => handleStatusClick(1)} />
            <ColorCodingSearch color={"color-indicator-10-bg"} label={t("Below Threshold Limit")}  onClick={() => handleStatusClick(2)} />
            <ColorCodingSearch color={"color-indicator-7-bg"} label={t("Credit Panel Limit Over")}  onClick={() => handleStatusClick(7)} />
          


          </>} />
          <PatientRegSearchTable
            THEAD={TheadDepartmentWise}
            tbody={bodyData?.SearchPatient}
            handleSubmit={handleSubmit}
            values={values?.id}
          />
        </div>
      </div>
    </>
  );
};

export default PatientInFormationDiet;
