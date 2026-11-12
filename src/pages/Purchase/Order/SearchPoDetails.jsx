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


const SearchPoDetails = ({ onEdit,dataLoading,setTermsConditionsUpdateList }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [payload, setPayload] = useState({
    PONo: "",
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
      "poNo":payload?.PONo,
      "fromDate": moment(payload?.fromDate).format("DD-MMM-YYYY"),
      "toDate": moment(payload?.toDate).format("DD-MMM-YYYY"),
      "searchType": false,
    
    }
    try {

      const response = await PurchaseOrderGetPOList(data);
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
    setPayload({ ...payload, [key]: value });
  };

    const searchHandleChange = (e) => {
      const { name, value } = e.target;
      setPayload((prevState) => ({
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
    { name: t("PO No."), width: "10%" },
    { name: t("Supplier"), width: "15%" },
    { name: t("Raised Date"), width: "10%" },
    { name: t("Type"), width: "10%" },
    { name: t("Total Cost"), width: "10%" },
    { name: t("Status"), width: "10%" },
    { name: t("Subject"), width: "20%" },
    { name: t("Edit"), width: "1%" }
];

  const getTermsConditionUpdate = async(PO)=>{
debugger
    try {
      const response = await GetPOByTermsandCondition(PO)
      if(response?.success){
        setTermsConditionsUpdateList(response?.data)
      }
      else{
        setTermsConditionsUpdateList([])
      }

    } catch (error) {
      console.log(error,"error")
    }
  }

  const handleEdit = (val, ind) => {
    debugger
    getTermsConditionUpdate(val?.PONo)
    onEdit(val, ind)
  }

      const handlePOClick = async (currentPONumber) => {
         console.log("currentPONumber",currentPONumber)
          const payload=  {
              poNumber:currentPONumber
              }
          try {
              const response = await RNPOApprovalPOReport(payload)
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
          id="PONo"
          lable={t("PONumber")}
          placeholder=" "
          required={true}
          value={payload?.PONo}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="PONo"
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
                payload.fromDate
                  ? moment(payload.fromDate, "YYYY-MM-DD").toDate()
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
                        payload.toDate
                          ? moment(payload.toDate, "YYYY-MM-DD").toDate()
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
      <div className="patient_registration card">
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
                PONo: val?.PONo, 
                Supplier: val?.VendorName,
                RaisedDate: val?.RaisedDate,
                Type: val?.Type,
                TotalCost: val?.NetTotal?val?.NetTotal:"0",
                Status: (
                  <div

                  style={{ color: val?.StatusDisplay === "Reject" ? "red" : "inherit" ,fontWeight:"bold"}}>
                    {val?.StatusDisplay}
                  </div>
                ),
                Narration: val?.Subject,
                btn: (
                  <i className={`fa fa-edit ${val?.Status===3 ? "disable-reject" :""}`} 
                   onClick={() => handleEdit(val, ind)}
                   ></i>
                 
                ),
              }))}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPoDetails