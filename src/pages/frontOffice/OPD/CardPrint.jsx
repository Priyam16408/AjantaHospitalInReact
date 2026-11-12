import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "@app/components/UI/Heading";
import Input from "@app/components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import CardPrintTable from "../../../components/UI/customTable/frontofficetables/CardPrintTable";
import moment from "moment";
import { cardPrintSearch } from "../../../networkServices/cardPrint";

export default function CardPrint() {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [inputs, setInputs] = useState({ fromDate: moment(new Date()).toDate(), toDate: moment(new Date()).toDate(), patientID: "" })
  const [bodyData, setBodyData] = useState([])
  const handleChange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
  }


  const searchApiCall = async () => {
    let requestBody = { fromDate: moment(inputs?.fromDate).format('DD-MMMM-YYYY'), toDate: moment(inputs?.toDate).format('DD-MMMM-YYYY'), patientID: inputs?.patientID }

    try {
      let cardPrintList = await cardPrintSearch(requestBody)
      console.log("cardPrintList",cardPrintList)
      if (cardPrintList?.success && cardPrintList?.data?.length > 0) {
        let panelDetailTableData = []
        cardPrintList?.data?.map((obj, index) => {
          console.log("obj",obj)
          let panelItem = {}
          panelItem['S_no'] = index + 1
          panelItem["UHID"] = obj?.patientID
          panelItem["PatientName"] = obj?.pname
          panelItem["ContactNo"] = obj?.mobile
          panelItem["Sex"] = obj?.gender
          panelItem["ledgertransactionNo"] = obj?.ledgertransactionNo
          panelItem["DateEnrolled"] =  moment(obj?.dateEnrolled).format('DD-MMMM-YYYY') 
          // panelItem["DateEnrolled"] = obj?.dateEnrolled
          // panelItem["Photo"] = "photo"
          panelItem["PhotoBrowse"] = ""
          // panelItem["UploadPhoto"] = obj?.photoUpload
          // panelItem["ViewPhoto"] = 8
          panelItem["PrintCard"] = ""
          panelItem["PrintSticker"] = ""
          // panelItem["PrintLabRequestForm"] = ""
          panelDetailTableData.push(panelItem)
        });
        setBodyData(panelDetailTableData)
      }
    } catch (error) {

    }



  }
  return (
    <>
      <div className="card patient_registration border">
        <Heading title={t("Search_Criteria")} isBreadcrumb={true} secondTitle={
          <div className="d-flex">
            <div className="PhotoUploaded"></div>
            <span className="text-dark ml-2 mt-1 ">Photo Uploaded </span>
          </div>
        } />
        <div className="row  pt-2 pl-2 pr-2">
          <Input
            type="text"
            className="form-control"
            id="patientID"
            name="patientID"
            lable={t("UHID")}
            placeholder=" "
            value={inputs?.patientID}
            onChange={handleChange}
            required={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
          />

          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            value={moment(inputs?.fromDate).toDate()}
            handleChange={handleChange}
            lable={t("from Date")}
            placeholder={VITE_DATE_FORMAT}
          />

          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            value={moment(inputs?.toDate).toDate()}
            handleChange={handleChange}
            lable={t("to Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          
            <button className="btn btn-sm btn-info px-3 ml-2 mb-1" type="button" onClick={searchApiCall}>
              {" "}
              {t("search")}{" "}
            </button>
        


          {/* <div className="col-xl-2 col-md-3 col-sm-4 col-12 d-flex">
            <div className="PhotoUploaded"></div>
            <label className="text-dark ml-2">Photo Uploaded </label>
          </div> */}


        </div>


      </div>
      {bodyData?.length ? <CardPrintTable setBodyData={setBodyData} bodyData={bodyData} /> : ""}
    </>
  );
}
