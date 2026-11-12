import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import { PatientFeedBackReportApi } from "../../../networkServices/cardPrint";

import ReactSelect from "../../../components/formComponent/ReactSelect";
import { BindEmployeeFeedBack, OPDAdvancCRMFundReport } from "../../../networkServices/edpApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { notify } from "../../../utils/ustil2";
// import { GetAllDoctor, GetBindAllDoctorConfirmation } from "../../../store/reducers/common/CommonExportFunction";
import { GetAllDoctor } from '../../../store/reducers/common/CommonExportFunction';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { exportToExcel } from "../../../utils/exportLibrary";
export default function CmrReport() {
  const [t] = useTranslation();
  const dispatch = useDispatch()
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [values, setValues] = useState({
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    ReportName: {
                    label:"CMR Fund Utilization Detailed Report",value:"1"
                },
    patientID: "",
    Doctor: {},
    
  });
  const [dropDownState, setDropDownState] = useState({
    BindDoctor: [],
  });
  const { GetAllDoctorList } = useSelector((state) => state?.CommonSlice);
  console.log("useSelector ",useSelector)
  const [bodyData, setBodyData] = useState([]);

  const TYPE = [
    { value: "1", label: "UHID" },
    { value: "2", label: "IPDNo" },
  ];

  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };
const handleReactSelect = async (name, value) => {
        setValues(() => ({ ...values, [name]: value }))
    }
  const getBindEmployeeFeedBack = async () => {
    try {
      const response = await BindEmployeeFeedBack();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          BindEMP: handleReactSelectDropDownOptions(
            response?.data,
            "NAME",
            "EmployeeID"
          ),
        }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
   
      dispatch(GetAllDoctor());
    getBindEmployeeFeedBack();
  }, []);
  const searchApiCall = async () => {

    if(!values.ReportName?.value){
      notify("Plese Report Name  ","warn")
      return;
    }
const payload={
  "patientid":values?.patientID || "",
  "doctorID":values?.Doctor?.value || "",
  "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
  "toDate": moment(values?.toDate).format("YYYY-MM-DD"),
  "reportType": values?.ReportName?.value || "",
  "advType": 0
}

    try {
      let res = await OPDAdvancCRMFundReport(payload);
      console.log("res", res);
      if (res?.success) {
        exportToExcel(res?.data, "Excel");
        // setBodyData(res?.data);
      } else {
        notify(res?.message, "error");
        setBodyData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
    // console.log("name",name,value)
    // if(name==="centreId"){
    //     getBindEmplyee(value?.value)
    // }
  };

  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("Search_Criteria")}
          isBreadcrumb={true}
        // secondTitle={
        //   <div className="d-flex">
        //     <div className="PhotoUploaded"></div>
        //     <span className="text-dark ml-2 mt-1 ">Patient Feedback Report </span>
        //   </div>
        // }
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Report Name")}
            id={"ReportName"}
            searchable={true}
            removeIsClearable={false}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
                {
                    label:"CMR Fund Utilization Detailed Report",value:"1"
                },
                {
                    label:"CMR Datewise Report",value:"2"
                },
                {
                    label:"CMR Billwise Report",value:"3"
                },
                {
                    label:"CMR Estimate Report",value:"4"
                },
            ]}
            handleChange={handleSelect}
            value={`${values?.ReportName?.value}`}
            name={"ReportName"}
          />
        
            <Input
              type="text"
              className="form-control"
              id="patientID"
              name="patientID"
              lable={t("UHID")}
              placeholder=" "
              value={values?.patientID}
              onChange={handleChange}
              required={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />
           
           {/* <ReactSelect
            placeholderName={t("Doctor Name")}
            id={"Doctor"}
            searchable={true}
            removeIsClearable={false}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
                {
                    label:"CMR Fund Utilization Detailed Report",value:"0"
                },
                {
                    label:"CMR Datewise Report",value:"1"
                },
                {
                    label:"CMR Billwise Report",value:"2"
                },
                {
                    label:"CMR Estimate Report",value:"1"
                },
            ]}
            handleChange={handleSelect}
            value={`${values?.Doctor?.value}`}
            name={"Doctor"}
          /> */}

          <ReactSelect
                                     placeholderName={t("Doctor")}
                                     className="form-control"
                                     id={"Doctor"}
                                     name="Doctor"
                                     dynamicOptions={handleReactSelectDropDownOptions(
                                         GetAllDoctorList,
                                         "Name",
                                         "DoctorID"
                                     )}
                                     searchable={true}
                                     respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                                    //  requiredClassName={"required-fields"}
                                     value={values?.Doctor?.value}
                                     handleChange={handleReactSelect}
                                 />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            value={moment(values?.fromDate).toDate()}
            handleChange={handleChange}
            lable={t("fromDate")}
            placeholder={VITE_DATE_FORMAT}
          />

          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            value={moment(values?.toDate).toDate()}
            handleChange={handleChange}
            lable={t("toDate")}
            placeholder={VITE_DATE_FORMAT}
          />
         
          <button
            className="btn btn-sm btn-info ml-2"
            type="button"
            onClick={searchApiCall}
          >
            {t("search")}
          </button>
        </div>
      </div>

      
    </>
  );
}
