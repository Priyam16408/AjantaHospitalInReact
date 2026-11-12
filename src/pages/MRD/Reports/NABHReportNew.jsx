import React, { useEffect, useState } from "react";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { BindNABH, PrintNBHReport } from "../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { RedirectURL } from "../../../networkServices/PDFURL";

const NABHReportNew = () => {
  const [t] = useTranslation();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    ReportType:"",
  };
    const [dropDownState, setDropDownState] = useState([]);
  useEffect(() => {
   BindNABHList();
   }, []);
  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  };
  const BindNABHList = async () => {
    try {
      const response = await BindNABH();
      if(response?.success){
      setDropDownState(handleReactSelectDropDownOptions(response?.data,"VALUE","Lable"))
      }
      else{
        setDropDownState([])

      }
      return response;

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const SaveData = async () => {
    console.log("New Data.................",values)
    const payload ={
      rbtActiveVal: values.ReportType,
      fromDate:  moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values.toDate).format("DD-MMM-YYYY")
    }
     const response =  await PrintNBHReport(payload);
     if (response.success){
     RedirectURL(response?.data);
     }
     else{
      notify(response.message,"error");
     }

  };
    return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
        {/* <ReportsMultiSelect
            name="panel"
            placeholderName="Panel"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindPanelListData}
            labelKey="Company_Name"
            valueKey="PanelID"
          /> */}
          <ReactSelect
            placeholderName={t("Report List")}
            id={"ReportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={dropDownState}
            name="ReportType"
            handleChange={handleReactSelectChange}
            value={values.ReportType}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            min={values?.fromDate}
          />
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success mx-1" onClick={SaveData}>Search</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NABHReportNew;
