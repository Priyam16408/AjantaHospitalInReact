import React, { useEffect } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { GetBindDoctorDept } from "../../../networkServices/opdserviceAPI";
import { Checkbox } from "primereact/checkbox";
import Tables from "../../../components/UI/customTable";
import {
  getAppointDetailsSearchApi,
  getPrescriptionPrintApi,
} from "../../../networkServices/DoctorApi";
import { notify } from "../../../utils/ustil2";
import { RedirectURL } from "../../../networkServices/PDFURL";

export default function PrescriptionMultiPrint() {
  const [doctorList, setDoctorList] = React.useState([]);
  const [formValues, setFormValue] = React.useState({
    PatientID: "",
    doctorID: "",
    fromDate: moment().format("DD-MMM-YYYY"),
    toDate: moment().format("DD-MMM-YYYY"),
  });
  const [selectedChecked, setSelectedChecked] = React.useState([]);
  const [prescriptionTableData, setPrescriptionTableData] = React.useState([]);

  const [t] = useTranslation();

  const handleReactSelect = (name, value) => {
    setFormValue({ ...formValues, [name]: value?.value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValues, [name]: value });
  };

  const handleChangeCheckbox = (item) => {
    setSelectedChecked((prev) => {
      const exists = prev.some(
        (obj) => obj.TransactionID === item.TransactionID
      );
      if (exists) {
        return prev.filter((obj) => obj.TransactionID !== item.TransactionID);
      } else {
        return [...prev, item];
      }
    });
  };

  console.log(selectedChecked);

  const getPrescriptionTableData = async () => {
    // if(!formValues?.PatientID){
    //   notify("UHID is required","error")
    //   return;
    // }
    if (!formValues?.fromDate === "") {
      notify("Please select from date", "error");
      return;
    }
    if (!formValues?.toDate === "") {
      notify("Please select to date", "error");
      return;
    }
    const payload = {
      fromDate: moment(formValues?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(formValues?.toDate).format("YYYY-MM-DD"),
      patientID: formValues?.PatientID,
      docID: formValues?.doctorID,
    };
    try {
      const data = await getAppointDetailsSearchApi(payload);
      setPrescriptionTableData(data?.data || []);
      if (data?.success) {
        notify("Data fetched successfully", "success");
        setSelectedChecked([])

      } else {
        notify("No data found", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = async () => {
    if (selectedChecked?.length > 0) {
      const payload = {
        labObservationRequest: selectedChecked.map((item) => ({
          pid: item.PatientID || "",
          transactionID: item.TransactionID || "",
          appID: item.App_ID || "",
          previewSetting: [],
        })),
      };

      try {
        const data = await getPrescriptionPrintApi(payload);
        console.log(data);
        if (data?.success) {
          RedirectURL(data?.data);
          setSelectedChecked([])
        } else {
          notify(data?.message, "error");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      notify("Please select at least one checkbox", "error");
    }
  };

  console.log(formValues, "formValues");
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
  return (
    <div>
      <div className="card patient_registration">
        <Heading title={t("Prescription Multi Print")} isBreadcrumb={false} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="PatientID"
            name="PatientID"
            onChange={handleChange}
            value={formValues?.PatientID}
            lable={t("PatientID")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 "
          />

          <ReactSelect
            placeholderName={t("Doctor")}
            searchableDoctorID={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            id={"doctorID"}
            name="doctorID"
            dynamicOptions={doctorList.map((doc) => ({
              label: doc.Name,
              value: doc.DoctorID,
            }))}
            value={formValues?.doctorID}
            handleChange={handleReactSelect}
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
            <div className="form-group">
              <DatePicker
                className="custom-calendar required-fields"
                id="fromDate"
                name="fromDate"
                lable={t("FromDate")}
                handleChange={handleChange}
                value={
                  formValues.fromDate
                    ? moment(formValues?.fromDate, "DD-MMM-YYYY").toDate()
                    : formValues?.fromDate
                }
              />
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
            <div className="form-group">
              <DatePicker
                className="custom-calendar required-fields"
                id="toDate"
                name="toDate"
                lable={t("ToDate")}
                handleChange={handleChange}
                value={
                  formValues.toDate
                    ? moment(formValues?.toDate, "DD-MMM-YYYY").toDate()
                    : formValues?.toDate
                }
              />
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
            <button
              className="btn btn-sm btn-success"
              onClick={() => getPrescriptionTableData()}
            >
              {t("Search")}
            </button>
            {selectedChecked?.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-success ml-2"
                onClick={() => handlePrint()}
              >
                {t("Print")}
              </button>
            )}
          </div>
        </div>
      </div>

      {prescriptionTableData?.length > 0 && (
        <div className="card mt-3">
          <Heading title={t("Prescription Table")} isBreadcrumb={false} />
          <Tables
            thead={[
              t("SNo"),
              t("Patient Name"),
              t("Doctor"),
              t("Appointment Date"),
              t("Time"),
              t("Action"),
            ]}
            tbody={prescriptionTableData.map((item, i) => ({
              SNo: i + 1,
              ItemName: item?.PName,
              DoctorName: item?.NAME,
              AppointmentDate: moment(item?.Date).format("DD-MMM-YYYY"),
              Time: moment(item?.Time, "HH:mm:ss").format("hh:mm A"),
              checkbox: (
                <Checkbox
                  className="d-flex align-items-center"
                  checked={selectedChecked?.some(
                    (obj) => obj?.TransactionID === item?.TransactionID
                  )}
                  onChange={(e) => handleChangeCheckbox(item)}
                />
              ),
            }))}
          />
        </div>
      )}
    </div>
  );
}
