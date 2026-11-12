import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import DatePicker from '../../../components/formComponent/DatePicker'
import moment from "moment";
import SaveButton from "@components/UI/SaveButton";
import { GetPORequest,  GetPurchaseRequestItems } from '../../../networkServices/Purchase';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/utils';
import CancelButton from '../../../components/UI/CancelButton';
import { useTranslation } from 'react-i18next';
import { GRNSameStateBuyierSupplier } from '../../../networkServices/InventoryApi';

const ViewPR = ({ storeType, handleClose,getData ,setIsFlag,setIsNormalPo}) => {
  let [t] = useTranslation()
  // const GetPurchaseReq = ({ values, onEdit}) => {
    const [tableData, setTableData] = useState([
      // { sn: 1 }
    ]);
  const [values, setValues] = useState({
    purchaseReqNo: "",
    fromDate: new Date(),
    toDate: new Date(),
  })
  const [selectedRows, setSelectedRows] = useState([]);
 
  const [selectedPRNOs, setSelectedPRNOs] = useState([]);
 
    const selectAllRef = useRef(null);
  const areAllSelected = selectedRows.length === tableData.length;
    useEffect(() => {
          if (selectAllRef.current) {
              selectAllRef.current.indeterminate =
                  selectedRows.length > 0 &&
                  selectedRows.length < tableData.length;
          }
      }, [selectedRows, tableData.length]);
  

 
  const GetPurchaseRequestAPI = async () => {
    let data = {
      fromDate: moment(values?.fromDate).format("YYYY-MMM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MMM-DD"),
      storeType: storeType.value

    }
    try {

      const response = await GetPORequest(data);
      if (response?.success) {
        setTableData(response.data);
        
      } else {
        setTableData([]);

        // notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

    const handleGRNSameStateBuyierSupplier = async (supplierID) => {
      
      try {
        const response = await GRNSameStateBuyierSupplier(supplierID)
        if(response.success){
          return true;
        }
        else{
          return false;
        }
      } catch (error) {
        return false;
        console.error("Something went wrong", error);
        
      }
    }
  const AddPurchaseOrder = async () => {

  let payload= selectedPRNOs


    try {

      const response = await GetPurchaseRequestItems(payload);

      if (response?.success) {
        // setTableData(response.data);
        // getData(response?.data)
        const updated=response.data?.map((prev)=>({
...prev,
// CGSTPercent:Number(prev?.GSTGroup)/2,
// SGSTPercent:Number(prev?.GSTGroup)/2,
        }))
        getData(updated)
        handleClose()
        setTableData([]);
        setIsFlag(true)
        setIsNormalPo(true)
      } else {
      
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
// const AddPurchaseOrder = async () => {
//   let payload = selectedPRNOs;

//   try {
//     const response = await GetPurchaseRequestItems(payload);

//     if (response?.success) {
//       const updated = await Promise.all(
//         response.data?.map(async (prev) => {
//           let isStateSupplier = false;
// debugger
//           try {
//             const result = await handleGRNSameStateBuyierSupplier("LSHHI1");
//             // const result = await handleGRNSameStateBuyierSupplier(prev?.supplierID);
//             // Assuming API returns something like { success: true, data: true }
//             if (result?.success) {
//               isStateSupplier = true;
//             }
//           } catch (e) {
//             console.warn(`VendorID ${prev?.VendorID} - Supplier check failed`, e);
//           }

//           return {
//             ...prev,
//             CGSTPercent: Number(prev?.GSTGroup) / 2,
//             SGSTPercent: Number(prev?.GSTGroup) / 2,
//             isStateSupplier,
//           };
//         })
//       );

//       getData(updated);
//       handleClose();
//       setTableData([]);
//       setIsFlag(true);
//     } else {
//       console.warn("API call succeeded but returned success: false");
//     }
//   } catch (error) {
//     console.error("Something went wrong:", error);
//   }
// };

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    const key = name || e.target.name;
    setValues({ ...values, [key]: value });
  };

  useEffect(() => {
    GetPurchaseRequestAPI();
  }, [values]);


  const handleRowSelect = (index) => {
    setSelectedRows((prevSelectedRows) => {
        let updatedSelectedRows;

        if (prevSelectedRows.includes(index)) {
          
            updatedSelectedRows = prevSelectedRows.filter((i) => i !== index);
        } else {
           
            updatedSelectedRows = [...prevSelectedRows, index];
        }

        setSelectedPRNOs(
            updatedSelectedRows.map((i) => tableData[i].PurchaseRequestNo)
        );

        return updatedSelectedRows;
    });
};
const handleSelectAll = (e) => {
  if (e.target.checked) {
      const allIndices = tableData.map((_, index) => index);
      const allPRNOs = tableData.map((row) => row.PurchaseRequestNo);
      setSelectedRows(allIndices);
      setSelectedPRNOs(allPRNOs);
  } else {
      setSelectedRows([]);
      setSelectedPRNOs([]);
  }

};

  const THEAD = [
    {
      width: "0.5%", name: <input type="checkbox"
          ref={selectAllRef} // Ref for indeterminate state
          checked={areAllSelected}
          onChange={handleSelectAll}
      />
  },

    { name: "#" },
    { name: t("Purchase Request No") },
    { name: t("Subject") },
    { name: t("Total Item") },
    { name: t("Request On") },
    { name: t("Raised By") },
    { name: t("Raised From") },
 
    // :<input type='checkbox'/>,
  ];


  return (
    <div className="patient_registration card">
      {/* <Heading title={"Search Purchase Request's"} isBreadcrumb={false} /> */}
      <div className="row p-2">
        <Input
          type="text"
          className="form-control "
          id="purchaseReqNo"
          lable="Purchase Req. No."
          placeholder=" "
          required={true}
          value={values?.purchaseReqNo}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="purchaseReqNo"
          onChange={handleChange}
        />
        <DatePicker
          className="custom-calendar"
          placeholder=""
          lable=  {t("FromDate") }
          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
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
          lable= {t("toDate") }
          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
          name="toDate"
          id="toDate"
          value={values?.toDate}
          showTime
          hourFormat="12"
          // handleChange={handleChange}
          handleChange={(date) => handleChange(date, "toDate")}
        />
      </div>
      
      {/* <div className="card"> */}
        <div className="p-2 mt-2 spatient_registration_card">
          {/* <Heading title={t("Purchase Request")} isBreadcrumb={false} /> */}
          <Tables
          
              thead={THEAD}
              tbody={tableData?.map((val, index) => ({
              checkbox: (
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleRowSelect(index)}
                />
              ),
              sno: index + 1,
              PurchaseRequestNo: val?.PurchaseRequestNo,
                Subject: val?.Subject,
                Quantity: val?.Quantity,
                RaisedDate: val?.RaisedDate,
                // Name: val?.Name,
                RaisedBy: val?.Name,
                RaisedFrom: val?.DepartMentName,

            }))}

            style={{ maxHeight: "23vh" }}
          />
         
        </div>
  
      {tableData.length > 0 ? <div className="py-2 col-sm-12 d-flex justify-content-end align-items-center  ">
            
            <button
              className="btn btn-sm btn-success m-2"
              type="button"
              onClick={() => AddPurchaseOrder()}
            >
              {t("Add To Purchase Request")}
            </button>


          </div> : ""}
     
    </div>
  )
}

export default ViewPR