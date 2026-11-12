import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import DatePicker from '../../../components/formComponent/DatePicker'
import moment from "moment";
import SaveButton from "@components/UI/SaveButton";

import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/utils';
import { GetPurchaseRequest, PReqGetPRDetailsReport } from '../../../networkServices/Purchase';
import { useTranslation } from 'react-i18next';
import { RedirectURL } from '../../../networkServices/PDFURL';

const GetPurchaseReq = ({onEdit,loading}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
   let [t] = useTranslation()
  // const GetPurchaseReq = ({ values, onEdit}) => {
    const [tableData, setTableData] = useState([
      // { sn: 1 }
    ]);
  const [values, setValues] = useState({
    purchaseReqNo: "",
    // fromDate: new Date(),
    // toDate: new Date(),
     toDate: moment().format("YYYY-MM-DD"),
        fromDate: moment().format("YYYY-MM-DD"),
  })
  

  const StorePurchaseRequest = async () => {

  let payload=  {
    "purchaseRequestNo":values?.purchaseReqNo,
    "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
    "toDate": moment(values?.toDate).format("YYYY-MM-DD"),
  }
  //  console.log("payload",payload)

    try {

      const response = await GetPurchaseRequest(payload);
    
      if (response?.success) {
        // setTableData(response.data);
        setTableData(response?.data)
       
      } else {
      

        // notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    const key = name || e.target.name;
    setValues({ ...values, [key]: value });
  };

  useEffect(() => {
    StorePurchaseRequest();
  }, [values,loading]);

  const THEAD = [
    { name: t("#"), width: "0.5%" },
    { name: t("Purchase Request No."), width: "15%" },
    { name: t("Subject"), width: "20%" },
    { name: t("Request On"), width: "15%" },
    { name: t("Requisition By"), width: "15%" },
    { name: t("Type"), width: "10%" },
    { name: t("Status"), width: "10%" },
    { name: t("Edit"), width: "10%" }
];


  const handleEdit=()=>{
alert("Not working ")
  }

   const handlePRClick = async (currentPRNo) => {
          const payload=  {
                PrNumber:currentPRNo
                }
    
            try {
                const response = await PReqGetPRDetailsReport(payload)
                if (response?.success) {
                
                    RedirectURL(response?.data?.pdfUrl);
    
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                notify(error?.message || "An error occurred during search.", "error");
            }
    
        };

  return (
    <div className="patient_registration card">
      
      <Heading title= {t("Search PO Details")} isBreadcrumb={false} />
      <div className="row p-2">
        <Input
          type="text"
          className="form-control "
          id="purchaseReqNo"
          lable={t("Purchase Req. No.")}

          placeholder=" "
          required={true}
          value={values?.purchaseReqNo}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="purchaseReqNo"
          onChange={handleChange}
        />
        {/* <DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("FromDate")}
          respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          name="fromDate"
          id="fromDate"
          value={values?.fromDate}
          showTime
          hourFormat="12"
          // handleChange={handleChange}
          handleChange={(date) => handleChange(date, "fromDate")}
        />
        <DatePicker
          className="custom-calendar"
          placeholder=""
          lable= {t("ToDate")}
          respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          name="toDate"
          id="toDate"
          value={values?.toDate}
          showTime
          hourFormat="12"
          // handleChange={handleChange}
          handleChange={(date) => handleChange(date, "toDate")}
        /> */}
        <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            value={values?.fromDate ? moment(values?.fromDate).toDate() : ""}
            maxDate={new Date()}
            handleChange={handleChange}
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
          />
        <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            value={values?.toDate ? moment(values?.toDate).toDate() : ""}
            maxDate={new Date()}
            handleChange={handleChange}
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
          />
         {/* <DatePicker
                      className="custom-calendar"
                      id="From Data"
                      name="fromDate"
                      lable={t("FromDate")}
                      placeholder=""
                      respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                      value={
                        values.fromDate
                          ? moment(values.fromDate, "YYYY-MM-DD").toDate()
                          : null
                      }
                      handleChange={handleChange}
                    />
                    <DatePicker
                      className="custom-calendar"
                      id="DOB"
                      name="toDate"
                      lable={t("To Date")}
                      value={
                        values.toDate
                          ? moment(values.toDate, "YYYY-MM-DD").toDate()
                          : null
                      }
                      handleChange={handleChange}
                      placeholder=""
                      respclass="col-xl-2 col-md-2 col-sm-6 col-12"
                    /> */}
        
      </div>
      
        <div className="p-2 mt-2 spatient_registration_card">
          <Tables
            handleDoubleClick={(rowData, rowIndex) => {
              handlePRClick(rowData?.PurchaseRequestNo); // Example function
            }}
              thead={THEAD}
              tbody={tableData?.map((val, index) => ({
             
              sno: index + 1,
              PurchaseRequestNo: val?.PurchaseRequestNo,
                Subject: val?.Subject,
                // Quantity: val?.Quantity,
                RaisedDate: val?.RaisedDate,
                // Name: val?.Name,
                RaisedBy: val?.Name,
                Type: val?.Type,
                Status: <span style={{fontWeight:"bold"}}>{val?.STATUS}</span>,
                btn: val?.STATUS ==="Pending"?(
                  <i className="fa fa-edit" 
                  //  onClick={() => handleEdit(val, index)}
                   onClick={() => onEdit(val, index)}
                   ></i>
                 
                ) :"",

            }))}

            style={{ maxHeight: "23vh" }}
          />
         
        </div>
      
    </div>
  )
}

export default GetPurchaseReq