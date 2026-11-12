import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  GetBindAllDoctorConfirmation,
  GetBindDepartment,
  getBindPanelList,
  GetBindSubCatgeory,
  getLoadOPDDiagnosisItems,
} from "../../../store/reducers/common/CommonExportFunction";
import { print_Type } from "../../../utils/constant";
import {
  BindSubcategory,
  ItemAnalysisDetail,
  RevenueAnalysisDetail,
  RoomType,
} from "../../../networkServices/BillingsApi";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { notify } from "../../../utils/utils";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";

export default function RevenueAnalysisReport() {
  const [t] = useTranslation();
  const [subItemCategory, setSubItemCategory] = useState([]);
  const dispatch = useDispatch();

  const {
    GetEmployeeWiseCenter,
    getBindPanelListData,
    // GetBindSubCatgeoryData,
    GetBindAllDoctorConfirmationData,
    getLoadOPDDiagnosisItemsData,
    GetDepartmentList,
  } = useSelector((state) => state.CommonSlice);

  const { getBindCategoryData } = useSelector(
    (state) => state.TokenManagementSlice
  );
  const [multiselectState, setMultiSelectState] = useState({
    getRoomTypeMulti: [],
  });

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    patientType: "",
    reportSubType: "",
    panel: [],
    doctor: [],
    subCategory: [],
    category: [],
    item: [],
    department: [],
    RoomType: [],
    reportType: 0,
    centre: [],
    printType: "",
    dateFilterType: "",
    UHID: "",
  };
  console.log(subItemCategory);
  const [values, setValues] = useState({ ...initialValues });

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };
  const handlePayloadMultiSelectNumbers = (data) => {
    return data?.map((items, _) => Number(items?.code));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "handlePayloadMultiSelectNumbers",
      handlePayloadMultiSelectNumbers(values?.doctor)
    );
    const requestBody = {
      centreID: handlePayloadMultiSelect(values?.centre) || "",
      itemID: handlePayloadMultiSelectNumbers(values?.item) || [],
      subCategoryID: handlePayloadMultiSelectNumbers(values?.subCategory) || [],
      doctorID: handlePayloadMultiSelectNumbers(values?.doctor) || [],
      panelID: handlePayloadMultiSelectNumbers(values?.panel) || [],
      fromDate: moment(values.fromDate).format("DD-MM-YYYY"),
      toDate: moment(values.toDate).format("DD-MM-YYYY"),
      uhid: String(values.UHID) || "",
      billDate: Number(values?.dateFilterType) || 0,
      reportType: Number(values?.reportSubType) || 1,
      report: String(values?.reportType) || "",
      viewType: Number(values?.patientType) || 0,
    };

    try {
      if (values?.centre == "") {
        notify("Centre is Required", "error");
      } else {
        const response = await ItemAnalysisDetail(requestBody);
        console.log("response",response)
        if (response?.data?.pdfUrl) {
          RedirectURL(response?.data?.pdfUrl);
        } else {
          notify(response?.message || "No Records Found", "error");
        }
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;

    // if (name === "reportType") {
    //   if (String(e?.value) === "7") {
    //     dispatch(GetBindAllDoctorConfirmation({ Department: "All" }));
    //     obj["speciality"] = [];
    //   }

    //   if (String(e?.value) === "8") {
    //     obj["doctor"] = [];
    //     dispatch(getBindSpeciality());
    //   }
    // }

    setValues(obj);
  };

  const getBindRoomType = async () => {
    try {
      const dataRes = await RoomType();
      setMultiSelectState((prevState) => ({
        ...prevState,
        getRoomTypeMulti: dataRes?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const getBindSubcategory = async () => {
    try {
      const dataRes = await BindSubcategory();
      setSubItemCategory(dataRes?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (values?.category?.length > 0)
      dispatch(
        GetBindSubCatgeory({
          Type: 1,
          CategoryID: handlePayloadMultiSelect(values?.category),
        })
      );
  }, [values?.category]);

  useEffect(() => {
    dispatch(
      getBindPanelList({
        PanelGroup: "ALL",
      })
    );
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
    dispatch(getLoadOPDDiagnosisItems());
    dispatch(GetBindDepartment());
    getBindRoomType();
    getBindSubcategory();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form className="row  p-2" onSubmit={handleSubmit}>
          <ReportsMultiSelect
            name="centre"
            placeholderName={t("Centre")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
          />

          <ReactSelect
            placeholderName={t("Date Filter Type")}
            id={"dateFilterType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: " Bill Date", value: "0" },
              { label: "Entry Date", value: "1" },
            ]}
            name="dateFilterType"
            handleChange={handleReactSelectChange}
            value={values.dateFilterType}
          />
{/* 
<ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}

            values={values}
            setValues={setValues}
           
            max={new Date()}
            min={values?.toDate}
          /> */}

<DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("FromDate")}
          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
          name="fromDate"
          id="fromDate"
          value={values?.fromDate}
          showTime
          hourFormat="12"
          handleChange={(date) => handleChange(date, "fromDate")}
        />

<DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("toDate")}
          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
          name="toDate"
          id="toDate"
          value={values?.toDate}
          showTime
          hourFormat="12"
          handleChange={(date) => handleChange(date, "toDate")}
        />
          {/* <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            min={values?.toDate}
        
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            
            min={values?.fromDate}
          /> */}

          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"patientType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "IPD", value: "0" },
              { label: "OPD", value: "1" },
            ]}
            name="patientType"
            handleChange={handleReactSelectChange}
            value={values.patientType}
          />

          <ReactSelect
            placeholderName={t("Report Type")}
            id="reportType"
            searchable
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              // { label: "Summarised", value: "0" },
              { label: "Detailed", value: "D" },
              { label: "Summarised-Itemwise", value: "SI" },
              { label: "Summarised", value: "S" },
            ]}
            value={values.reportType}
            name="reportType"
            removeIsClearable={true}
            handleChange={(name, e) => handleReactSelectChange(name, e)}
          />
          <ReactSelect
            placeholderName={t("Sub Type")}
            id={"reportSubType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Group Wise", value: "1" },
              { label: "Doctor Wise", value: "2" },

              { label: "Panel Wise", value: "3" },
            ]}
            name="reportSubType"
            handleChange={handleReactSelectChange}
            value={values.reportSubType}
          />

          <ReportsMultiSelect
            name="doctor"
            placeholderName={t("Doctors")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetBindAllDoctorConfirmationData}
            labelKey="Name"
            valueKey="DoctorID"
          />

          

          <ReportsMultiSelect
            name="subCategory"
            placeholderName={t("SubCategory")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={subItemCategory || []}
            labelKey="name"
            valueKey="subCategoryID"
          />

          <ReportsMultiSelect
            name="item"
            placeholderName={t("Item")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getLoadOPDDiagnosisItemsData}
            labelKey="typeName"
            valueKey="item_ID"
          />
         

          <ReportsMultiSelect
            name="panel"
            placeholderName={t("Panel")}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindPanelListData}
            labelKey="Company_Name"
            valueKey="PanelID"
          />
          <ReactSelect
            placeholderName={t("Print Type")}
            id={"printType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={print_Type?.map((item, index) => {
              return {
                value: item.ID,
                label: item.name,
              };
            })}
            name="printType"
            handleChange={handleReactSelectChange}
            value={values.printType}
          />
          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            onChange={handleChange}
            value={values.UHID}
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <div className="box-inner ">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="submit"
              onClick={handleSubmit}
            >
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
