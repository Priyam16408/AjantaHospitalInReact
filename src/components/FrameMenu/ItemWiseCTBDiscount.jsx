import React, { useEffect, useState } from 'react';

import moment from "moment";

import { useTranslation } from "react-i18next";


import { useDispatch } from 'react-redux';

import Modal from '../modalComponent/Modal';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import TextAreaInput from '../formComponent/TextAreaInput';
import ReactSelect from '../formComponent/ReactSelect';
import { setLoading } from '../../store/reducers/loadingSlice/loadingSlice';
import Nested from './Nested';
import {  BillingCTBDetail, BillingIPDGetCTBDetails, BillingIPDSaveCTBDetail, GetDiscReason } from '../../networkServices/BillingsApi';
import { handleReactSelectDropDownOptions, notify  } from '../../utils/utils';
import DatePicker from '../formComponent/DatePicker';
import Input from '../formComponent/Input';
import Heading from '../UI/Heading';


const ItemWiseCTBDiscount = ({data}) => {
  
    const { VITE_DATE_FORMAT } = import.meta.env;
     
    const dispatch = useDispatch();
    const [payload, setPayload] = useState({
        billNo: "",
        toDate: moment().format("YYYY-MM-DD"),
        fromDate: moment().format("YYYY-MM-DD"),
    });
  const [dropDownState, setDropDownState] = useState({
    DiscountReason: [],
})
 const ip = useLocalStorage("ip", "get");
console.log("dropDownState",dropDownState)
    // FIX 1: Initialize state with empty strings to avoid uncontrolled/controlled input warnings
    const [getData,setGetData]=useState({
        rate:"",
        DiscountPercentage:"",
        Quantity:"",
        DiscAmt:"",
        DiscountReason:{},
        DiscEditReason:""
    })
    console.log("getData",getData)
    const { t } = useTranslation();
    const [modalData, setModalData] = useState({ visible: false })
    const [tableData, setTableData] = useState([]);
    const [subTableData, setSubTableData] = useState([]);

    const handleChange = (e, name) => {
        const value = e.target ? e.target.value : e;
        const key = name || e.target.name;
        setPayload({ ...payload, [key]: value });
    };
   const handleChangenew = (e, name) => {
  const key = name || e.target.name;
  const value = e.target ? e.target.value : e;

  setGetData((prev) => {
    let updated = { ...prev, [key]: value };

    if (key === "DiscAmt") {
      const rateAmt = Number(prev?.rate || 0);
      updated.DiscountPercentage = rateAmt ? (value * 100) / rateAmt : 0;
    }

    if (key === "DiscountPercentage") {
      const rateAmt = Number(prev?.rate || 0);
      updated.DiscAmt = (rateAmt * value) / 100;
    }

    // if (key === "DiscAmt") {
    //   const gross = Number(prev?.GrossAmount || 0);
    //   updated.DiscountPercentage = gross ? (value * 100) / gross : 0;
    // }

    // if (key === "DiscountPercentage") {
    //   const gross = Number(prev?.GrossAmount || 0);
    //   updated.DiscAmt = (gross * value) / 100;
    // }

    return updated;
  });
};

//     const handleChangenew = (e, name) => {
//          const key = name || e.target.name;
//         const value = e.target ? e.target.value : e;
//         if(name==="DiscAmt"){
//             setGetData((preV)=>({
// ...preV,
// DiscountPercentage:(value*100)/getData?.GrossAmount
//             }))
//         }
//         if(name==="DiscountPercentage"){
//             setGetData((preV)=>({
// ...preV,
// DiscAmt:(getData?.GrossAmount*value)/100
//             }))
//         }
        
       

//         setGetData(prev => ({
//             ...prev,
//             [key]: value
//         }));
//     };
//     const handleReactChange = (name, e) => {
//     setGetData({
//       ...payload,
//       [name]: e.value,
//     });
//   };
  const handleReactChange = (name, e) => {

    setGetData((val) => ({ ...val, [name]: e }));
   
  };
    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };

     const GetBindDiscReason = async () => {
        try {
          const response = await GetDiscReason("OPD");
if(response?.success){
 setDropDownState((val) => ({
        ...val,
        DiscountReason: handleReactSelectDropDownOptions(
          response?.data,
          "DiscountReason",
          "ID"
        ),
      }));
}
else{
    console.log("error",response?.error)
}
        //   setAdvanceReason(data);
        } catch (error) {
          console.error("Error fetching discount reasons:", error);
        }
      };
      useEffect(()=>{
GetBindDiscReason()
      },[])
    const HandleSearch = async () => {
        let payloadData = {
            "ctbNo": payload?.CTBno,
            "transactionID": data?.transactionID,
            "fromDate": moment(payload?.fromDate).format("YYYY-MM-DD"),
            "toDate": moment(payload?.toDate).format("YYYY-MM-DD"),
        };
        try {
            dispatch(setLoading(true));
            const response = await BillingCTBDetail(payloadData);
            if (response?.success) {
                setTableData(response?.data);
                setSubTableData([]);
            } else {
                setTableData([]);
                notify(response?.message,"success")
            }
        } catch (error) {
            setTableData([]);
            console.log(error, "SomeThing Went Wrong");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const THEAD = [
        { name: "Action", width: "5%" },
        { name: t("S No."), width: "5%" },
        { name: t("CTB No"), width: "10%" },
        { name: t("Date"), width: "15%" },
        { name: t("IPD No."), width: "10%" },
        { name: t("ReciptNo"), width: "10%" },
        { name: t("EmployeeName"), width: "10%" },
    ];

    const handleMini = (indexToToggle) => {
        const updatedSubTableData = [...subTableData];
        if (updatedSubTableData[indexToToggle]) {
            updatedSubTableData[indexToToggle].isopen = !updatedSubTableData[indexToToggle].isopen;
            setSubTableData(updatedSubTableData);
        }
    };

    const handleBillingShowItemDetails = async (item, index) => {
        if (subTableData[index]?.subRowList) {
            handleMini(index);
            return;
        }

        dispatch(setLoading(true));
        let LedgerTransactionNO = item?.LedgerTransactionNO;
        
        try {
            const response = await BillingIPDGetCTBDetails(LedgerTransactionNO);

            const tableDataMain = [...subTableData];
            while (tableDataMain.length <= index) {
                tableDataMain.push(undefined);
            }
            
            tableDataMain[index] = {
                subRowList: response?.data || [],
                isopen: true,
            };

            setSubTableData(tableDataMain);
            notify(response?.message, response?.success ? "success" : "error");
        } catch (error) {
            console.log(error, "Something Went Wrong");
            notify("Error fetching item details.", "error");
        } finally {
            dispatch(setLoading(false));
        }
    };

    // FIX 2: Refactor handleEdit to only manage state, not create components.
    const handleEdit=(data)=>{
        // 1. Set the initial data for the form fields
        setGetData({
            rate: data?.rate,
            DiscountPercentage: data?.DiscountPercentage,
            Quantity: data?.Quantity,
            DiscAmt: data?.DiscAmt,
            NetAmount: data?.NetAmount,
            // GrossAmount: data?.GrossAmount,
            LedgerTnxID: data?.LedgerTnxID,
           
            Id: data?.Id,
        });

        // 2. Set the modal to be visible and configure its properties
        setModalData({
            visible: true,
            width: "60vw",
            label: t("Edit Item Details"),
            // Don't set the component here. We will render it directly.
        });
    };

    const handleUpdateItem = async() => {
        if(!getData?.DiscountReason){
            notify("Please Select Disc. Reason","warn");
            return
        }
        if(!getData?.DiscEditReason){
            notify("Please Fill for Disc. Reason","warn");
            return
        }
        const payload={
  "disper":String(getData?.DiscountPercentage) || "",
  "rate": String(getData?.rate) || "",
  "disAmt": String(getData?.DiscAmt) || "",
  "qty": String(getData?.Quantity) || "",
  "editReason": String(getData?.DiscEditReason) || "",
  "disReason": String(getData?.DiscountReason?.value) || "",
  "ltdNo": String(getData?.LedgerTnxID) || "",
  "ipAddress": ip ,
  "id": String(getData?.Id) || "",
}
        try {
            const response =await BillingIPDSaveCTBDetail(payload)
            if(response?.success){
                notify(response?.message,"success")
                 setModalData({ visible: false });
                 setGetData([])
            }
            else{
                  notify(response?.message,"error")
            }
        } catch (error) {
            console.log("error",error)
        }
       
       

        // You might want to refresh the table data here by calling HandleSearch() again
    }

    const handleDepartmentSubRow = (allSubRowData = [], inx) => {
        const currentSubRow = allSubRowData[inx];

        if (!currentSubRow || !currentSubRow.isopen) {
            return { subRowList: [], isopen: false };
        }

        const tableResponse = currentSubRow.subRowList?.map((row, index) => {
            return {
                Item: row?.ItemName,
                IssueDate: row?.ItemID,
                Rate: <div className="">{row?.rate}</div>,
                Quantity: <div className="">{row?.Quantity}</div>,
                DiscPer: <div className="">{row?.DiscPer}</div>,
                DiscAmt: <div className="">{row?.DiscAmt}</div>,
                Amount: <div className="">{row?.NetItemAmt}</div>,
                UserName: <div className="">{row?.UserName}</div>,
                Edit: <div className="text-primary" style={{cursor:'pointer'}} onClick={()=>handleEdit(row)}><i className="fa fa-edit py-1 " aria-hidden="true"></i></div>,
            };
        });

        return {
            subRowList: tableResponse,
            isopen: currentSubRow.isopen,
            secondThead: [
                t("Item Name"), t("Date"), t("Rate"), t("Quantity"),
                t("Disc. %"), t("Disc.Amt."), t("Net Amt."),
                t("UserName"), t("Edit"),
            ],
        };
    };
    
    const handleDepartmentTable = (data) => {
        return data?.map((item, index) => {
            const isSubRowOpen = subTableData[index]?.isopen === true;
            return {
                Action: (
                    <div
                        onClick={() => isSubRowOpen ? handleMini(index) : handleBillingShowItemDetails(item, index)}
                        className="text-center"
                        style={{ cursor: 'pointer' }}
                    >
                        {isSubRowOpen ? (
                             <i className="fa fa-minus py-1 " aria-hidden="true"></i>
                        ) : (
                             <i className="fa fa-plus py-1 " aria-hidden="true"></i>
                        )}
                    </div>
                ),
                sno: index + 1,
                CTBNo: item?.CTBNo,
                DATE:item?.DATE,
                IPDNo:item?.IPDNo,
                ReciptNo: item?.ReciptNo,
                EmployeeName: item?.EmployeeName,
                subRow: handleDepartmentSubRow(subTableData, index),
            };
        });
    };

    return (
        <>
            {/* FIX 3: Define the Modal and its content here in the main render body */}
            {modalData?.visible && (
                <Modal
                    visible={modalData.visible}
                    setVisible={() => { setModalData({ visible: false }) }}
                    modalWidth={modalData.width}
                    Header={modalData.label} // Use the label from modalData for the header
                    // Add a footer with Save and Cancel buttons
                    footer={
                        <div className='d-flex justify-content-end'>
                            <button className="btn btn-sm btn-primary" onClick={handleUpdateItem}>{t("Update")}</button>
                            <button className="btn btn-sm  btn-primary mx-2" onClick={() => setModalData({ visible: false })}>{t("Cancel")}</button>

                        </div>
                    }
                >
                    {/* The modal's content is now created here, so it always gets the latest `getData` state */}
                    <div className="row p-3">
                        <Input
                            type="text"
                            className="form-control "
                            id="rate"
                            lable={t("Rate")}
                            placeholder=" "
                            required={true}
                            value={getData.rate}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                            name="rate"
                            onChange={handleChangenew}
                            disabled={true}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="Quantity"
                            lable={t("Qty.")}
                            placeholder=" "
                            required={true}
                            value={getData.Quantity}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                            name="Quantity"
                            onChange={handleChangenew}
                                     disabled={true}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="DiscountPercentage"
                            lable={t("Disc. %")}
                            placeholder=" "
                            required={true}
                            value={getData.DiscountPercentage}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                            name="DiscountPercentage"
                            onChange={handleChangenew}
                        />
                        
                        <Input
                            type="text"
                            className="form-control "
                            id="DiscAmt"
                            lable={t("Disc. Amt.")}
                            placeholder=" "
                            required={true}
                            value={getData.DiscAmt}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                            name="DiscAmt"
                            onChange={handleChangenew}
                        />
                       
                        <ReactSelect
                                    placeholderName={t("Discount Resion")}
                        
                                    requiredClassName={"required-fields"}
                                    searchable={true}
                                     respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                                    id={"DiscountReason"}
                                    name={"DiscountReason"}
                                    removeIsClearable={true}
                             handleChange={(name, e) => handleReactChange(name, e)}
                                    // handleChange={(name, e) => handleChangenew(name, e)}
                                    dynamicOptions={dropDownState?.DiscountReason}
                                    value={getData.DiscountReason?.value}
                                  />
                                  <TextAreaInput
                                              type="text"
                                              name="DiscEditReason"
                                              rows={2}
                                              value={getData?.DiscEditReason}
                                              onChange={handleChangenew}
                                              lable={t("Disc Edit Reason")}
                                              placeholder=" "
                                              respclass=" col-sm-6 col-12"
                                      
                                               className="form-control required-fields"
                                            />
                    </div>
                </Modal>
            )}
       
            <div className="patient_registration card">
                <Heading title={t("Item Wise CTB Discount")} isBreadcrumb={false} />
                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control "
                        id="CTBno"
                        lable={t("CTB No.")}
                        placeholder=" "
                        required={true}
                        value={payload?.CTBno}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        name="CTBno"
                        onChange={handleChange}
                    />

                    <DatePicker
                        className="custom-calendar"
                        id="From Data"
                        name="fromDate"
                        lable={t("From Date")}
                        placeholder={VITE_DATE_FORMAT}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        value={payload.fromDate ? moment(payload.fromDate, "YYYY-MM-DD").toDate() : null}
                        maxDate={new Date()}
                        handleChange={searchHandleChange}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="DOB"
                        name="toDate"
                        lable={t("To Date")}
                        value={payload.toDate ? moment(payload.toDate, "YYYY-MM-DD").toDate() : null}
                        maxDate={new Date()}
                        handleChange={searchHandleChange}
                        placeholder={VITE_DATE_FORMAT}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
                    <div className="col-xl-2 col-md-3 col-sm-6 col-12 d-flex ">
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={HandleSearch}
                        >
                            {t("Search")}
                        </button>
                    </div>
                </div>
                <div className="patient_registration card">
                    <div className="row p-2">
                        <Nested
                            thead={THEAD}
                            tbody={handleDepartmentTable(tableData)}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ItemWiseCTBDiscount;
