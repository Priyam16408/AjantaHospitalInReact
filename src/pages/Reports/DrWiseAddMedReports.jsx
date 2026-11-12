import React, { useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import { notify } from "../../utils/utils";
import { GetDoctorAddedMedicineListApi } from "../../networkServices/DoctorApi";
import { exportToExcel } from "../../utils/exportLibrary";

function DrWiseAddMedReports() {
  const [t] = useTranslation();

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSearch = async () => {
    const fromDate = moment(values?.fromDate).format("DD-MM-YYYY");
    const toDate = moment(values?.toDate).format("DD-MM-YYYY");
    
    try {
      const response = await GetDoctorAddedMedicineListApi(fromDate, toDate);
      
      if (response) {
        exportToExcel(response?.data,"Dr Wise Medicine Added Reports");
        notify(response?.message || "Report loaded successfully", "success");
      } else {
        notify(response?.message || "No records found or invalid response", "error");
      }
    } catch (error) {
      console.error("Error fetching doctor added medicine report:", error);
      notify("An error occurred while fetching report data", "error");
    }
  };

  return (
    <>
      <div className=" spatient_registration_card card">
        <Heading
          title={t("Dr wise medicine added reports")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <DatePicker
            id="fromDate"
            name="fromDate"
            lable={t("From Date")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={values?.toDate}
          />

          <DatePicker
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            value={values?.toDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
            minDate={values?.fromDate}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSearch}
            >
              {t("Report")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DrWiseAddMedReports;
