import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { t } from "i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  BindLeave,
  SaveDoctorLeave,
  UpdateDoctorLeave,
} from "../../../networkServices/DoctorApi";
import Tables from "../../../components/UI/customTable";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import moment from "moment";
import { notify } from "../../../utils/utils";
import { ToastContainer } from "react-toastify";
const DoctorLeave = (props) => {
  const { getDoctorID } = props;
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const thead = ["S.No", "Doctor Name", "Reason", "Date", "Active", "Actions"];
  const [btnValue, setBtnValue] = useState("Save");
  const [apiData, setApiData] = useState({
    getBindLeave: [],
  });
  // const [selectLeave, setSelectLeave] = useState("")
  // console.log(selectLeave);

  const valuesState = {
    doctorID: getDoctorID,
    fromDate: moment().format("YYYY-MM-DD"),
    isActive: "",
    reason: "",
    toDate: moment().format("YYYY-MM-DD"),
    leaveID: "",
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
      if (btnValue === "Save") {
        try {
          const res = await SaveDoctorLeave(
            {
              doctorID: values.doctorID,
              fromDate: moment(values.fromDate).format("YYYY-MM-DD"),
              isActive: values.isActive.value,
              reason: values.reason,
              toDate: moment(values.toDate).format("YYYY-MM-DD"),
            }
            // yyyy-mm-dd
          );
          if (res.success === true) {
            notify(res.message, "success");
            handleGetDoctorBindLeave();
            setBtnValue("Save");
            resetForm();
          }
          if (res.success === false) {
            notify(res.message, "error");
            handleGetDoctorBindLeave();
            setBtnValue("Save");
            resetForm();
          }
        } catch (error) {}
      } else if (btnValue === "Update") {
        try {
          const res = await UpdateDoctorLeave({
            doctorID: values.doctorID,
            fromDate: values.fromDate,
            isActive: values.isActive,
            leaveID: values.leaveID,
            reason: values.reason,
          });
          if (res.success) {
            notify(res.message, "success");
            handleGetDoctorBindLeave();
            setBtnValue("Save");
            resetForm();
            // resetForm({
            //   values: {
            //     ...valuesState,
            //     fromDate: moment().format("YYYY-MM-DD"), // Reset to current date
            //     toDate: moment().format("YYYY-MM-DD"),   // Reset to current date
            //     isActive: "",                            // Reset ReactSelect
            //   },
            // });
            // setSelectLeave("")
          }
        } catch (error) {}
      }
    },
  });

  const handleEditLeave = (item) => {
    //console.log(item);
    setBtnValue("Update");
    setValues({
      doctorID: item?.DoctorID,
      fromDate: moment(item.DATE).format("YYYY-MM-DD"),
      toDate: moment(item.DATE).format("YYYY-MM-DD"),
      // isActive:
      //   item.IsActive === "Yes"
      //     ? { label: "On Leave", value: "1" }
      //     : { label: "Revert Leave", value: "0" },
      isActive:
      item.IsActive === "Yes" ? "1":"0",
      leaveID: item?.ID,
      reason: item?.LeaveReason,
    });
  };

  const handleReactSelectChange = (name, e) => {
    setFieldValue("isActive", e);
    console.log(e);
    console.log(name);
    // setSelectLeave((prevState) => ({
    //   ...prevState,
    //   [name]: e?.value,
    // }));
    // console.log(name);
    // console.log(e);
  };

  const handleGetDoctorBindLeave = async () => {
    try {
      const res = await BindLeave(getDoctorID);
      console.log(res);
      setApiData((prev) => ({ ...prev, getBindLeave: res.data }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearForm = () => {
    resetForm();
    // resetForm({
    //   values: {
    //     ...valuesState,
    //     fromDate: moment().format("YYYY-MM-DD"), // Reset to current date
    //     toDate: moment().format("YYYY-MM-DD"),   // Reset to current date
    //     isActive: "",                            // Reset ReactSelect
    //   },
    // });
    // setSelectLeave({})
    setBtnValue("Save");
  };

  useEffect(() => {
    handleGetDoctorBindLeave();
  }, []);
  return (
    <>
      <div className="m-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Doctor Leave")}
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
              handleChange={handleReactSelectChange}
            />
            <Input
              type="text"
              className={`form-control`}
              id="Reason"
              lable={t("Reason")}
              placeholder=" "
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12  "
              name="reason"
              value={values.reason}
              onChange={handleChange}
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
              minDate={currentDate}
            />
            <DatePicker
              className="custom-calendar"
              id="DOB"
              name="toDate"
              lable={"To Date"}
              placeholder={VITE_DATE_FORMAT}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
              value={
                values.toDate
                  ? moment(values.toDate, "YYYY-MM-DD").toDate()
                  : null
              }
              handleChange={handleChange}
              minDate={currentDate}
            />
            <ReactSelect
              placeholderName={"Active Leave"}
              id={"ActiveLeave"}
              searchable={true}
              name={"isActive"}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                { label: "On Leave", value: "1" },
                { label: "Revert Leave", value: "0" },
              ]}
              value={values.isActive}
              handleChange={handleReactSelectChange}
              removeIsClearable={false}
            />

            <div className="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12">
              <button
                className="btn btn-sm custom-button w-100"
                // onClick={handleDeleteSelectedTemplate}
                type="submit"
              >
                {btnValue}
              </button>
            </div>
            {btnValue === "Update" && (
              <div className="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12">
                <button
                  className="btn btn-sm custom-button w-100"
                  onClick={handleClearForm}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            )}
            {/* <div className="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12">
              <button
                className="btn btn-sm custom-button w-100"
                // onClick={handleDeleteSelectedTemplate}
                type="submit"
              >
                {btnValue}
              </button>
            </div> */}
          </form>
        </div>
      </div>
      <div className="m-2 spatient_registration_card mt-4">
        <div className="patient_registration card">
          <Heading
            title={t("Leave List")}
            // isBreadcrumb={true}
          />

          <div>
            <Tables
              thead={thead}
              tbody={apiData.getBindLeave.map((item, index) => ({
                "S.No": index + 1,
                "Doctor Name": item?.DocName,
                Reason: item?.LeaveReason,
                Date: item?.DATE,
                Active: item?.IsActive,
                Actions: (
                  <>
                    <i
                      className="fa fa-edit "
                      style={{ padding: "5px" }}
                      onClick={() => handleEditLeave(item)}
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

export default DoctorLeave;
