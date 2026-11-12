import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  notify,
} from "../../../utils/utils";

import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import { BillGenerationSearchDetail, PharmacyBillReturnCredit } from "../../../networkServices/pharmecy";

const CashToCredit = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();
 
  const [bindMapping, setBindMapping] = useState([
    
  ]);
  const localData = useLocalStorage("userData", "get");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectItem, setSelectItem] = useState([]);
  const selectAllRef = useRef(null);
console.log("selectedRows",selectedRows)
console.log("selectItem",selectItem)
  const areAllSelected =
    selectedRows.length === bindMapping.length && bindMapping.length > 0;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRows.length > 0 && selectedRows.length < bindMapping.length;
    }
  }, [selectedRows, bindMapping.length]);

  useEffect(() => {
    updateSelectItem(selectedRows);
  }, [selectedRows, bindMapping]);

  // Toggle individual row selection using index
  const handleRowSelect = (index) => {
    setSelectedRows((prevSelectedRows) => {
      let updatedSelectedRows;
      if (prevSelectedRows.includes(index)) {
        updatedSelectedRows = prevSelectedRows.filter((i) => i !== index);
      } else {
        updatedSelectedRows = [...prevSelectedRows, index];
      }
      return updatedSelectedRows;
    });
  };

  // Function to update selectItem based on selectedRows
  // const updateSelectItem = (selectedIndices) => {
  //   const selectedValue = selectedIndices
  //     .map((index) => bindMapping[index]?.val)
  //     .filter(Boolean); // Ensure PurchaseRequestNo exists
  //   setSelectItem(selectedValue);
  // };

  // Function to update selectItem based on selectedRows
const updateSelectItem = (selectedIndices) => {
  const selectedValues = selectedIndices
    .map((index) => bindMapping[index])
    .filter(Boolean); // Ensure item exists
  setSelectItem(selectedValues);
};

  // Toggle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndices = bindMapping.map((_, index) => index);
      setSelectedRows(allIndices);
    } else {
      setSelectedRows([]);
    }
  };

  const [values, setValues] = useState({
    ipdno:""

  });


  const HandleSearch = async () => {
    if (!values?.ipdno) {
      notify("IPDNO is required!", "warn");
      return;
    }

    try {
    
      const response = await BillGenerationSearchDetail(values?.ipdno);
      if (response?.success) {
        
        setBindMapping(response?.data);

        // **Important:** Set initial selected rows based on IsActive property
        const initiallySelectedRows = response?.data
          .map((val, index) => (val?.IsActive === 1 ? index : null)) // Modified condition here
          .filter((index) => index !== null);

        setSelectedRows(initiallySelectedRows);
      }else{
        notify(response?.message,"error")
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (e) => {
  
    const {name,value}=e.target
    setValues((val) => ({ ...val, [name]: value }));
  };

//   const handleSubmit=()=>{
//     const payload={
//       "ipAddress": ip,
//       "transactionID": bindMapping[0]?.TransactionID,
//       "pharmacyBillReturnCredit": [
//         {
//           "ledgerTransactionNo": "2331"
//         }
//       ],
//       "pageURL": "Return/Credit"
//     }
//     try {
//        const response=PharmacyBillReturnCredit(payload)
//        if(response?.success){
// notify(response?.message,"success")
//        }
//        else{
//         console.log("error",error)
//        }
//     } catch (error) {
//       console.log("error",error)
//     }
//   }
const handleSubmit = async () => {
  if (selectItem.length === 0) {
    notify("Please select at least one row", "warn");
    return;
  }

  const payload = {
    ipAddress: ip,
    transactionID: bindMapping[0]?.TransactionID,
    pharmacyBillReturnCredit: selectItem.map((item) => ({
      ledgerTransactionNo: item?.LedgertransactionNo ,
    })),
    pageURL: "Return/Credit",
  };

  try {
    const response = await PharmacyBillReturnCredit(payload);
    if (response?.success) {
      notify(response?.message, "success");
    } else {
      console.log("error", response);
    }
  } catch (error) {
    console.log("error", error);
  }
};

  const isMobile = window.innerWidth <= 800;
 
  const THEAD = [
    {
      width: "0.5%",
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          ref={selectAllRef} // Ref for indeterminate state
          checked={areAllSelected}
          onChange={handleSelectAll}
          className="ml-1"
        />
      ),
    },

    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("Patient Name") },
    { width: "5%", name: t("Receipt No.") },
    { width: "5%", name: t("Bill No.") },
    { width: "5%", name: t("Bill Date") },
    { width: "5%", name: t("Amount") },
  ];

  console.log("bindMapping",bindMapping)
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Cash To Credit")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
                  <Input
          
                    type="text"
                    className="form-control required-fields"
                    id={t("ipdno")}
                  
                    lable={t("IPD NO.")}
                    // placeholder=" "
                    value={values?.ipdno}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="ipdno"
                    onChange={handleReactChange}
                  />
          <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mr-1"
              onClick={HandleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>

  {
   bindMapping?.length>0 &&   
       <div className="card">
    <div className=" mt-2 spatient_registration_card">
      <Heading title={t("Patient Details")} isBreadcrumb={false} />
      <Tables
        isSearch={true}
        thead={THEAD}
        tbody={bindMapping?.map((val, index) => ({
          checkbox: (
            <input
              type="checkbox" b  
              checked={selectedRows.includes(index)}
              // onChange={() => handleRowSelect(val)}
              onChange={() => handleRowSelect(index)} 
            />
          ),
          sno: index + 1, 
           EntryPNameDate: val?.PName,
          ReceiptNo: val?.ReceiptNo,     
          BillNo: val?.BillNo,
          BillDate: val?.BillDate,
          NetAmount: val?.NetAmount,
          // House_No: val?.House_No,
        }))}
        style={{ maxHeight: "50vh" }}
      />
      {/* {bindMapping.length > 0 && ( */}
        <div
          className="p-2"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            className="btn btn-sm btn-primary mr-1"
            onClick={handleSubmit}
          >
            {t("Cash To Credit")}
          </button>
        </div>
      {/* )} */}
    </div>
  </div>
  }

    </div>
  );
};

export default CashToCredit;