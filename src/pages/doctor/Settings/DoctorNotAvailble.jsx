import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { t } from "i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import TimePicker from "../../../components/formComponent/TimePicker";
import { useSelector } from "react-redux";
import moment from "moment";
import { useFormik } from "formik";
import {
  BindDoctorNA,
  SaveDoctorNA,
  UpdateDoctorNA,
} from "../../../networkServices/DoctorApi";
import { notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
const DoctorNotAvailble = (props) => {
  const { getDoctorID } = props;

  const { VITE_DATE_FORMAT } = import.meta.env;
  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const [apiData, setAPiData] = useState({
    bindListNA: [],
  });
  const [btnValue, setBtnValue] = useState("Save");
  console.log(apiData);

  const [Time, setTime] = useState({
    startTime: new Date(),
    endTime: new Date(),
  });
  const valuesState = {
    doctorID: getDoctorID,
    fromDate: moment().format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    startTime: moment(Time.startTime).format("YYYY-MM-DD HH:mm:ss"), // Format as needed
    endTime: moment(Time.endTime).format("YYYY-MM-DD HH:mm:ss"), // Format as needed
  };
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((val) => ({ ...val, [name]: value }));
  };

  const {
    handleChange,
    values,
    setFieldValue,
    setValues,
    handleSubmit,
    errors,
    touched,
    validateForm,
    resetForm,
  } = useFormik({
    initialValues: valuesState,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("values", values);
      const newValues = {
        doctorID: getDoctorID,
        startTime: moment(Time.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(Time.endTime).format("YYYY-MM-DD HH:mm:ss"),
      };
      try {
        const response = await SaveDoctorNA(newValues);
        console.log(response);
        if (response.success === true) {
          notify(response.message, "success");
          notAvailableBindList();
        }
        if (response.success === false) {
          notify(response.message, "error");
          notAvailableBindList();
        }
      } catch (error) {}
    },
  });

  const notAvailableBindList = async () => {
    try {
      const response = await BindDoctorNA(getDoctorID);
      console.log(response);
      setAPiData((prev) => ({ ...prev, bindListNA: response.data }));
    } catch (error) {}
  };

  useEffect(() => {
    notAvailableBindList();
  }, []);

  const thead = [
    "S.No",
    "Doctor Name",
    "Day",
    "Start Time",
    "End Time",
    "DATE",
    "Active",
    "Action",
  ];

  const handleUpdateEdit = async (params) => {
    console.log(params);
    try {
      const resp = await UpdateDoctorNA(params.id);
      console.log(resp);
      if (resp.success === true) {
        notify(resp.message, "success");
        notAvailableBindList();
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="m-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Doctor Not Availble")}
            // isBreadcrumb={true}
          />
          <form className="row g-4 m-2" onSubmit={handleSubmit}>
            <ReactSelect
              placeholderName={"Doctor"}
              id={"Doctor"}
              searchable={true}
              name={"Doctor"}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              value={values.doctorID}
              dynamicOptions={GetBindAllDoctorConfirmationData?.map((ele) => {
                return {
                  label: ele?.Name,
                  value: ele?.DoctorID,
                };
              })}
              isDisabled={true}
              //   handleChange={handleReactSelectChange}
            />
            <DatePicker
              className="custom-calendar"
              id="DOB"
              name="fromDate"
              lable={"From Date"}
              placeholder={VITE_DATE_FORMAT}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
              value={
                values.fromDate
                  ? moment(values.fromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              handleChange={handleChange}
              disable={true}
              // minDate={currentDate}
            />
            <TimePicker
              placeholderName="Time"
              lable={t("Start Time")}
              id="time"
              name="startTime"
              value={Time.startTime ? Time.startTime : new Date()}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              handleChange={handleTimeChange}
            />
            <TimePicker
              placeholderName="Time"
              lable={t("End Time")}
              id="time"
              name="endTime"
              value={Time.endTime ? Time.endTime : new Date()}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              handleChange={handleTimeChange}
            />
            <div className="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12">
              <button
                className="btn btn-sm custom-button w-100"
                // onClick={handleDeleteSelectedTemplate}
                // type="submit"
              >
                {btnValue}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="m-2 spatient_registration_card mt-4">
        <div className="patient_registration card">
          <Heading
            title={t("Bind List")}
            // isBreadcrumb={true}
          />

          <div>
            <Tables
              thead={thead}
              tbody={apiData?.bindListNA?.map((item, index) => ({
                "S.No": index + 1,
                "Doctor Name": item?.DocName,
                Day: item?.Day,
                "Start Time": item?.StartTime,
                "End Time": item?.EndTime,
                DATE: item?.DATE,
                Active: item?.IsActive,
                // Active: item?.IsActive,
                Action: (
                  <>
                    <i
                      className="fa fa-trash text-danger text-center "
                      style={{ padding: "5px" }}
                      onClick={() => handleUpdateEdit(item)}
                    ></i>
                  </>
                ),
              }))}
              tableHeight={"tableHeight"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorNotAvailble;
