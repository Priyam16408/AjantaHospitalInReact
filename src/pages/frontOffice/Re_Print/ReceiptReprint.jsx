


import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "@app/components/formComponent/Input";
import DatePicker from "@app/components/formComponent/DatePicker";
import { useFormik } from "formik";
import { RECEIPT_REPRINT_PAYLOAD, SEARCHBY } from "../../../utils/constant";
import { Tabfunctionality } from "../../../utils/helpers";
import { ReceiptDetailnew } from "../../../networkServices/opdserviceAPI";
import ReceiptReprintTable from "../../../components/UI/customTable/ReprintTable/ReceiptReprintTable";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { notify } from "../../../utils/utils";

const ReceiptReprint = () => {
  const { VITE_DATE_FORMAT } = import.meta.env; 
  const [t] = useTranslation();
  const [bodyData, setBodyData] = useState([]);



  const { handleChange, values, setFieldValue, handleSubmit } = useFormik({
    initialValues: RECEIPT_REPRINT_PAYLOAD,
    onSubmit: async (values, { resetForm }) => {
      SearchBillPrintAPI();
    },
  });
  

  
  const SearchBillPrintAPI = async () => {
     setBodyData([])
    const newValues = {
      ...values,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      receiptNo: values?.receiptNo,
      billNo: values?.billNo,
      patientName: values?.patientName,
      patientID: values?.patientID,
      rblCon: values?.rblCon.value?values?.rblCon.value:"1",
      PrintType: values?.PrintType,
    };
    try {
      const dataResponse = await ReceiptDetailnew(newValues);
      if (dataResponse?.success) {
        let data = dataResponse?.data?.map((val)=>{
          val.IsAllowedOriginalPrint= val.IsAllowedOriginalPrint==="true"?false:true
          val.IsAllowedOriginalPrintValue=false
          val.PrintType=values?.PrintType
          return val
        })
        setBodyData(data);
        // resetForm();
      }else{
        setBodyData([])
        notify(dataResponse?.message,"error")
      }
    } catch (error) {
      console.log(error);
    }
  };




  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
    SearchBillPrintAPI();
  };

  const handleCustomSelect = (index, name, value) => {
    const updatedData = bodyData?.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
console.log("updatedData",updatedData[index],value)
    setBodyData(updatedData)
  };

  return (
    <>
      <form
        className="card patient_registration border"
        onSubmit={handleSubmit}
      >
        <Heading
          title={t("Receipt_Reprint")}
          isBreadcrumb={true}
        />
        <div className="row  g-4 m-2">
          <ReactSelect
            placeholderName={t("SearchType")}
            id={"rblCon"}
            name={"rblCon"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={values?.rblCon}
            dynamicOptions={SEARCHBY}
            handleChange={handleReactSelect}
          />
          <Input
            type="text"
            className="form-control"
            id="patientID"
            name="patientID"
            onChange={handleChange}
            value={values?.patientID}
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control"
            id="patientName"
            name="patientName"
            onChange={handleChange}
            value={values?.patientName}
            lable={t("Patient Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />

          <Input
            type="text"
            className="form-control"
            id="billNo"
            name="billNo"
            onChange={handleChange}
            value={values?.billNo}
            lable={t("BillNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />

          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            handleChange={handleChange}
            value={
              values.fromDate
                ? moment(values?.fromDate, "DD-MMM-YYYY").toDate()
                : values?.fromDate
            }
            lable={t("FromDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            handleChange={handleChange}
            value={
              values.toDate
                ? moment(values?.toDate, "DD-MMM-YYYY").toDate()
                : values?.toDate
            }
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          />
          <Input
            type="text"
            className="form-control"
            id="receiptNo"
            name="receiptNo"
            onChange={handleChange}
            value={values?.receiptNo}
            lable={t("ReceiptNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />
          <div className="col-2">
            <button className="btn btn-sm btn-info px-3" onClick={handleSubmit}>
              {t("Search")}
            </button>
          </div>
        </div>
      </form>

      <div className="card patient_registration_card my-1 mt-2">
        <ReceiptReprintTable
          // THEAD={THEAD}
          handleSubmit={handleSubmit}
          tbody={bodyData}
          setBodyData={setBodyData}
          setFieldValue={setFieldValue}
          values={values}
          handleCustomSelect={handleCustomSelect}
        />
      </div>
    </>
  );
};

export default ReceiptReprint;


