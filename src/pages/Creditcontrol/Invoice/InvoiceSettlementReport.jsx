// import React from 'react'

// const InvoiceSettlementReport = () => {
//   return (
//     <div>InvoiceSettlementReport</div>
//   )
// }

// export default InvoiceSettlementReport


import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import DatePicker from '../../../components/formComponent/DatePicker'
import moment from "moment";
import Tables from '../../../components/UI/customTable';
import { GetPOByTermsandCondition, PurchaseOrderGetPOList, RNPOApprovalPOReport } from '../../../networkServices/Purchase';
import { useTranslation } from "react-i18next";
import { notify } from '../../../utils/utils';
import { RedirectURL } from '../../../networkServices/PDFURL';
import { CreditControlInvoiceSettlementPdf, CreditControlInvoiceSettlementReport } from '../../../networkServices/ReportsAPI';


const InvoiceSettlementReport = ({ onEdit,dataLoading,setTermsConditionsUpdateList }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [values, setValues] = useState({
    invoiceNo: "",
    // fromDate: new Date(),
    // toDate: new Date(),
  
       toDate: moment().format("YYYY-MM-DD"),
          fromDate: moment().format("YYYY-MM-DD"),
  })

    const [t] = useTranslation();
  
  const [tableData, setTableData] = useState([]);
  const OrderGetPOList = async () => {
    let data =
    {
  "fromDate":  moment(values?.fromDate).format("YYYY-MM-DD"),
  "toDate":  moment(values?.toDate).format("YYYY-MM-DD"),
  "panelInvoiceNo": values?.invoiceNo,
}
    try {

      const response = await CreditControlInvoiceSettlementReport(data);
      console.log("responseresponse",response)
      if (response?.success) {
        setTableData(response?.data);
      } else  {
        setTableData([]);
        // notify(response?.message, "error");
      }
    } catch (error) {
      setTableData([]);
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    const key = name || e.target.name;
    setValues({ ...values, [key]: value });
  };

    const searchHandleChange = (e) => {
      const { name, value } = e.target;
      setValues((prevState) => ({
        ...prevState,
        [name]: moment(value).format("YYYY-MM-DD"),
      }));
    };
  useEffect(() => {
    OrderGetPOList();
  }, [dataLoading]);
  const HandleSearch=()=>{
    OrderGetPOList();
  }

  const THEAD = [
    { name: t("S No."), width: "5%" },
    { name: t("Invoice No."), width: "10%" },
    { name: t("Invoice Amount"), width: "15%" },
    { name: t("Invoice Date"), width: "10%" },
    { name: t("Received Amount"), width: "10%" },
    { name: t("PatientType"), width: "10%" },
    { name: t("PanelName"), width: "10%" },
    
    { name: t("Action"), width: "1%" }
];



  const handlePrint = async(val, ind) => {
    
    const payload={
  "id": val?.ID
}
    try {
      const response=await CreditControlInvoiceSettlementPdf(payload)
      if(response?.success){
        RedirectURL(response?.data?.pdfUrl);
      }
      else{
        notify(response?.message,"error")
      }
    } catch (error) {
      console.log("error",error)
    }
   
    onEdit(val, ind)
  }

      const handlePOClick = async (currentPONumber) => {
         console.log("currentPONumber",currentPONumber)
          const values=  {
              poNumber:currentPONumber
              }
          try {
              const response = await RNPOApprovalPOReport(values)
              if (response?.success) {
                   RedirectURL(response?.data?.pdfUrl);
              }
          } catch (error) {
              console.error("Error fetching data:", error);
              notify(error?.message || "An error occurred during search.", "error");
          }
  
      };
  return (
    // <div className="patient_registration card p-2">
    //   <Heading title= {t("Invoice Settlement Report")} isBreadcrumb={false} />
     <div className="card patient_registration border">
            <Heading
              title={t("Invoice Settlement Report")}
              isBreadcrumb={true}
            />
      <div className="row p-2">
        <Input
          type="text"
          className="form-control "
          id="invoiceNo"
          lable={t("Invoice No.")}
          placeholder=" "
          required={true}
          value={values?.invoiceNo}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="invoiceNo"
          onChange={handleChange}
        />
        
<DatePicker
              className="custom-calendar"
              id="From Data"
              name="fromDate"
              lable={t("FromDate")}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              value={
                values.fromDate
                  ? moment(values.fromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={searchHandleChange}
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
                      maxDate={new Date()}
                      handleChange={searchHandleChange}
                      placeholder={VITE_DATE_FORMAT}
                      respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
         <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mr-1"
              onClick={() => HandleSearch()}
            >
              {t("Search")}
            </button>
           
          </div>
      </div>
      {
        tableData?.length>0 &&   <div className="patient_registration card">
         <Heading
              title={t("Invoice Settlement Report")}
              // isBreadcrumb={true}
            />
        <div className="row">
          
          <div className="col-12">
            <Tables
              thead={THEAD}
              handleDoubleClick={(rowData, rowIndex) => {
                handlePOClick(rowData?.PONo); // Example function
              }}
              tbody={tableData?.map((val, ind) => ({
                Sno: ind + 1,
                // PONo: <span onDoubleClick={()=>handlePOClick(val?.PONo)}>{val?.PONo}</span>,
                InvoiceNo: val?.InvoiceNo, 
                InvoiceAmount: val?.InvoiceAmount,
                InvoiceDate: val?.InvoiceDate,
                ReceivedAmount: val?.ReceivedAmount,
                PatientType: val?.PatientType,
               
                PanelName: val?.PanelName,
                btn: (
                  <i className={`fa fa-print ${val?.Status===3 ? "disable-reject" :""}`} 
                   onClick={() => handlePrint(val, ind)}
                   ></i>
                 
                ),
              }))}
              // tableHeight={"scrollView"}
            />
          </div>
        </div>
      </div>
      }
    
    </div>
  )
}

export default InvoiceSettlementReport