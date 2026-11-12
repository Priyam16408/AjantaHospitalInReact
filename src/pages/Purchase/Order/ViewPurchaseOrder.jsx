import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import DatePicker from '../../../components/formComponent/DatePicker';
import ColorCodingSearch from '../../../components/commonComponents/ColorCodingSearch';
import { useDispatch } from 'react-redux';
import { GetBindAllDoctorConfirmation, GetBindDepartment, getBindPanelList } from '../../../store/reducers/common/CommonExportFunction';
import moment from 'moment';
import Heading from '../../../components/UI/Heading';
import { handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import {  PRBindEmployee, PRBindLedger, PurchaseBindCategory, PurchaseBindGetItems, PurchaseBindGetVendors, ViewPurchaseOrderSearchPO } from '../../../networkServices/Purchase';
import Modal from '../../../components/modalComponent/Modal';
import ViewPOTable from './ViewPOTable';
import { useSelector } from 'react-redux';
export default function ViewPurchaseOrder() {

    let [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [modalData, setModalData] = useState({ visible: false })
    const [alldata, setAllData] = useState([])
    const [dropDownState, setDropDownState] = useState({
        BindItems: [],
        raisedUser: [],
        BindStore: [],
         BindCategory: [],
    })
    console.log("alldata",alldata)
    const requestType = [
        { value: "0", label: "Normal" },
        { value: "1", label: "Urgent" },
        { value: "2", label: "Immediate" }
    ]

    const status = [
        // by tez sir
        { value: "All", label: "All" },
        { value: "Pending", label: "Pending" },
        { value: "Reject", label: "Reject" },
        { value: "Open", label: "Open" },
        { value: "Close", label: "Close" },
        { value: "Partial", label: "Partial" },
        // { value: "0", label: "All" },
        // { value: "1", label: "Pending" },
        // { value: "2", label: "Reject" },
        // { value: "3", label: "Open" },
        // { value: "4", label: "Close" },
        // { value: "5", label: "Partial" },
       
    ]

    const [values, setValues] = useState({
        center:{ value: "0", label: "ALL" },
        OrderNo: "",

        raisedUser: { value: "0", label: "All" },
        requestType: { value: "0", label: "Normal" },
        status: { value: "All", label: "All" },
        storeType: { name: 'Medical Store', categoryID: '8', configID: '28', label: 'Medical Store', value: 'STO00001' },
        // storeType: { value: "0", label: "Medical Store" },
       itemType: {label:"All",value:"0"},
        item: {},
    
           toDate: moment().format("YYYY-MM-DD"),
                fromDate: moment().format("YYYY-MM-DD"),
    });

 const renderAPI = async () => {
    try {
      const BindCategory = await PurchaseBindCategory();
      setDropDownState((val) => ({
        ...val,
        BindCategory: handleReactSelectDropDownOptions(
          BindCategory?.data,
          "Name",
          "CategoryID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
    const PRBindStore = async () => {
        try {
            const BindStore = await PRBindLedger();
            setDropDownState((val) => ({
                ...val,
                BindStore: handleReactSelectDropDownOptions(
                    BindStore?.data,
                    "LedgerName",
                    "LedgerNumber"
                ),
            }));
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
   const { GetEmployeeWiseCenter } = useSelector(
        (state) => state?.CommonSlice
    );
    const getItemApi = async () => {
        try {
            const BindItems = await PurchaseBindGetItems();
            if (BindItems?.success) {
                setDropDownState((val) => ({
                    ...val,
                    BindItems: handleReactSelectDropDownOptions(
                        BindItems?.data,
                        "ItemName",
                        "ItemID"
                    ),
                }));
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const GetPRBindEmployee = async () => {
        try {
            const raisedUser = await PRBindEmployee();
            if (raisedUser?.success) {
                setDropDownState((val) => ({
                    ...val,
                    raisedUser: handleReactSelectDropDownOptions(
                        raisedUser?.data,
                        "Name",
                        "EmployeeID"
                    ),
                }));

            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
   const renderGetVendorsAPI = async () => {
      try {
        const BindGetVendorsAPI = await PurchaseBindGetVendors();
        if (BindGetVendorsAPI?.success) {
          setDropDownState((val) => ({
            ...val,
            BindGetVendorsAPI: handleReactSelectDropDownOptions(
              BindGetVendorsAPI?.data,
              "LedgerName",
              "ID"
            ),
          }));
        }
      } catch (error) {
        console.log(error, "SomeThing Went Wrong");
      }
    };
  
    useEffect(() => {
        renderGetVendorsAPI();
        getItemApi()
        GetPRBindEmployee()
        PRBindStore()
        renderAPI()
    }, [])
    const dispatch = useDispatch()
    const handleSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
  const searchHandleChange = (e) => {
         const { name, value } = e.target;
         setValues((prevState) => ({
           ...prevState,
           [name]: moment(value).format("YYYY-MM-DD"),
         }));
       };
    useEffect(() => {
        dispatch(GetBindAllDoctorConfirmation({ Department: "All" }));
        dispatch(GetBindDepartment());
        dispatch(getBindPanelList());
    }, [dispatch]);

    const handleSearchViewReqDetails = async (item = "") => {
        
        if(!values?.category?.value){
            notify("Please Select Category","warn");
            return
        }
        try {
            let payloadData = 
            
            {
                "poNo":values?.OrderNo || "",
                "item": values?.item ? values?.item?.value : "",
                // "employee": String(values?.raisedUser?.value || "0"),
                "requestType":values?.requestType.value || "",
                "status":item?item: String(values?.status.value)|| "",
                "storeType":values?.storeType?.value|| "",
                "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
                "toDate":moment(values?.toDate).format("YYYY-MM-DD"),
                itemType:values?.itemType?.value|| "",
                "vendor": values?.supplier?.value|| "",
                "category": Number(values?.category?.value) || 0,
                  "subject": "",
                  "remark": "",
                  "autoPoOnly": false
              }

            let apiResp = await ViewPurchaseOrderSearchPO(payloadData);
            if (apiResp?.success) {
                setAllData(apiResp?.data)
            }
            else{
                notify(apiResp?.message,"error")
            }
           
        } catch (error) {
            console.log(error);
            notify(apiResp?.message, "error");
        }


    }

    const ViewThead = [
        { name: t("S.No."), width: "3%" },
        { name: t("PO No"), width: "7%" },
        { name: t("Narration"), width: "7%" },
        { name: t("Total Cost"), width: "10%" },       
        { name: t("Type"), width: "3%" },
        { name: t("Status"), width: "3%" },   
        { name: t("Raised Date"), width: "3%" },
        { name: t("Supplier"), width: "3%" },     
        { name: t("Remarks"), width: "3%" },
        { name: t("View"), width: "3%" },
    ];

    const handleCallViewMedReq = (item) => {
        
        handleSearchViewReqDetails(item);
    };

    return (
        <>
            <div className="m-2 spatient_registration_card card">
                <Heading
                    title={t("sampleCollectionManagement.sampleCollection.heading")}
                    isBreadcrumb={true}
                />
                <div className="row  p-2">
                     <ReactSelect
                                placeholderName={t("Category")}
                    
                                requiredClassName={"required-fields"}
                                searchable={true}
                                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                id={"category"}
                                name={"category"}
                                removeIsClearable={true}
                                handleChange={(name, e) => handleSelect(name, e)}
                                dynamicOptions={dropDownState?.BindCategory}
                                value={values?.category?.value}
                              />
                      {/* <ReactSelect
                                    placeholderName={t("Centre")}
                                    id={"center"}
                                    searchable={true}
                                    removeIsClearable={true}
                                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                    dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(GetEmployeeWiseCenter ? GetEmployeeWiseCenter : "", "CentreName", "CentreID")]}
                                    handleChange={handleSelect}
                                    value={`${values?.center?.value}`}
                                    name={"center"}
                                /> */}
                    <Input
                        type="text"
                        className="form-control"
                        id="OrderNo"
                        name="OrderNo"
                        value={values?.OrderNo ? values?.OrderNo : ""}
                        onChange={handleChange}
                        lable={t("Order No.")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />
<ReactSelect
                        placeholderName={t("Request Type")}
                        id={"requestType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={requestType}
                        handleChange={handleSelect}
                        value={`${values?.requestType?.value}`}
                        name={"requestType"}
                    />
                    <ReactSelect
                        placeholderName={t("Item Name")}
                        id={"item"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        // dynamicOptions={SampleCollected}
                        dynamicOptions={dropDownState?.BindItems}
                        handleChange={handleSelect}
                        value={`${values?.item?.value}`}
                        name={"item"}
                    />
                     <ReactSelect
                        placeholderName={t("Item Type")}
                        id={"itemType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={[
                            {label:"All",value:"0"},
                            {label:"Non-Free",value:"1"},
                            {label:"Free",value:"2"}
                        ]}
                        handleChange={handleSelect}
                        value={`${values?.itemType?.value}`}
                        name={"itemType"}
                    />
                     <ReactSelect
                                placeholderName={t("Supplier")}
                                searchable={true}
                                // requiredClassName={"required-fields"}
                                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                                id={"supplier"}
                                name={"supplier"}
                                removeIsClearable={true}
                                handleChange={(name, e) => handleSelect(name, e)}
                                dynamicOptions={dropDownState?.BindGetVendorsAPI}
                                value={values?.supplier}
                              />
                   
                    <ReactSelect
                        placeholderName={t("Status")}
                        id={"status"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={status}
                        handleChange={handleSelect}
                        value={`${values?.status?.value}`}
                        name={"status"}
                    />
                   
                    <ReactSelect
                        placeholderName={t("Store Type")}
                        id={"storeType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        // dynamicOptions={storeType}
                        dynamicOptions={dropDownState?.BindStore}
                        handleChange={handleSelect}
                        value={`${values?.storeType?.value}`}
                        name={"storeType"}
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
                    <div className=" col-xl-2 col-md-3 col-sm-6 col-12">
                        <button className="btn btn-sm btn-success" type="button" onClick={() => handleSearchViewReqDetails("")}>
                            {t("Search")}
                        </button>
                        {/* <button className="btn btn-sm btn-success ml-2" type="button"
                            onClick={handleClickReport}
                        >
                            
                            {t("Report")}
                        </button> */}
                    </div>

                </div>
                {modalData?.visible && (
                    <Modal
                        visible={modalData?.visible}
                        setVisible={() => { setModalData({ visible: false }) }}
                        modalData={modalData?.URL}
                        modalWidth={modalData?.width}
                        Header={modalData?.label}
                        buttonType="button"
                        footer={modalData?.footer}
                    >
                        {modalData?.Component}
                    </Modal>
                )}
             
            {
                alldata?.length > 0 &&
                <>
                   <Heading
                    title={t("Search Item")}
                    secondTitle={
                        <>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#09a115"}
                                    label={t("Open")}
                                    onClick={() => {
                                        handleCallViewMedReq("Open");
                                    }}
                                />
                            </span>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#9acd32"}
                                    label={t("Close")}
                                    onClick={() => {
                                        handleCallViewMedReq("Close");
                                    }}
                                />
                            </span>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#ffb6c1"}
                                    label={t("Reject")}
                                    onClick={() => {
                                        handleCallViewMedReq("Reject");
                                    }}
                                />
                            </span>
                            <span className="pointer-cursor">
                                {" "}
                                <ColorCodingSearch
                                    color={"#ffff00"}
                                    label={t("Pending")}
                                    onClick={() => {
                                        handleCallViewMedReq("Pending");
                                    }}
                                />
                            </span>

                        </>
                    }
                />
                <ViewPOTable
                    THEAD={ViewThead}
                    tbody={alldata}
                   
                />
</>
            }
               
            </div>
        </>
    )
}
