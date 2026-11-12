
import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { BindVoucherBillingScreenControls, FinanceSaveVoucher, FinanceSearchVoucher, GetCurrencyConversionFactorAPI, GetPeriodClosed, LoadCentreChartOfAccountAPI, SearchVoucher } from "../../../networkServices/finance";
import { filterByTypes, handleReactSelectDropDownOptions, inputBoxValidation, notify } from "../../../utils/utils";
// import VoucherBookingTable from "./VoucherBookingTable";
import { AutoComplete } from "primereact/autocomplete";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { FinanceSaveVoucherPayload } from "../../../utils/ustil2";
import BrowseButton from "../../../components/formComponent/BrowseButton";
import Modal from "../../../components/modalComponent/Modal";
import WrapTranslate from "../../../components/WrapTranslate";
import { Tooltip } from "primereact/tooltip";
import { PurchaGetDepartMent } from "../../../networkServices/Purchase";
// import ReplicateVoucherHistoryModal from "./ReplicateVoucherHistoryModal";


function Department () {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation()
  const userData = useLocalStorage("userData", "get")
  const newSession = useLocalStorage("newSession", "get")
  const [items, setItems] = useState([]);
  const [amounts, setAmounts] = useState({})
  let initialValues = { VoucherDate: newSession ? newSession : new Date(), ChartOfGroup: { value: "0" }, voucherType: {} }
  const [values, setValues] = useState(initialValues)
  console.log("Values" , values)

  const [list, setList] = useState([])
  const [bodyData, setBodyData] = useState([])
  console.log("BodyDATA" , bodyData)
  const [voucherList, setVoucherList] = useState([{
    sn:1
  }])
  const [modalData, setModalData] = useState({ visible: false });

  
    const [dropDownState, setDropDownState] = useState({
      GetDepartMent: [],
     
    });
  const voucherHead = [
    { name: "S/No." },
    { name: "Voucher No" },
    { name: "Voucher Date" },
    { name: "Amount Local" },
    { name: "Entry Date" },
    { name: "Entry By" },
    { name: "View" },
    { name: "Edit" },
    { name: "Review Resolved" },
    { name: "Print" },
    { name: "Attach" }
  ]


  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }))
    if (label === "Currency") {
      GetCurrencyConversionFactor(value?.value, moment(values?.VoucherDate).format("DD-MMM-YYYY"))
    }
  }
 

  const handleChange = (e) => {
    const { value, name } = e?.target
    setValues((val) => ({ ...val, [name]: value }))
  }
  const handleSelectDate = (e) => {
    GetCurrencyConversionFactor(values?.Currency?.value, moment(e?.value).format("DD-MMM-YYYY"))
  }

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1)
    if (apiResp?.success) {
      const country = filterByTypes(apiResp?.data, [4], ["TypeID"], "TextField", "ValueField", "TypeCode")
      const project = filterByTypes(apiResp?.data, [3], ["TypeID"], "TextField", "ValueField", "TypeCode")
      if (project?.length === 1) {
        setValues((val) => ({ ...val, ProjectName: { value: project[0]['value'] } }))
      }
      if (country?.length > 0) {
        setValues((val) => ({ ...val, Currency: { value: country[0]['extraColomn'] } }))
        await GetCurrencyConversionFactor(country[0]['extraColomn'], moment(values?.VoucherDate ? values?.VoucherDate : new Date()).format("DD-MMM-YYYY"))
      }
      setList(apiResp?.data)
    } else {
      setList([])
    }
  }
  useEffect(() => {
    bindListData()
  }, [])

  useEffect(() => {
    let data = bodyData.reduce((accumulator, currentType) => {
      if (currentType.balanceType?.value === 'Dr') {
        accumulator["Dr Amount"] += currentType?.Amount ? Number(currentType?.Amount) : 0;
        accumulator["Dr Local Amount"] += (values?.ConversionFactor * currentType?.Amount) > 0 ? Number(values?.ConversionFactor * currentType?.Amount) : 0
      } else if (currentType.balanceType?.value === 'Cr') {
        accumulator["Cr Amount"] += currentType?.Amount ? Number(currentType?.Amount) : 0;
        accumulator["Cr Local Amount"] += (values?.ConversionFactor * currentType?.Amount) > 0 ? Number(values?.ConversionFactor * currentType?.Amount) : 0
      }
      return accumulator;
    }, { "Cr Amount": 0, "Dr Amount": 0, "Cr Local Amount": 0, "Dr Local Amount": 0 });

    data["Diff Amount"] = data["Cr Amount"] - data["Dr Amount"]
    data["Diff Local Amount"] = data["Cr Local Amount"] - data["Dr Local Amount"]
    setAmounts({
      "Amount (Dr)": data["Dr Amount"],
      "Amount (Cr)": data["Cr Amount"],
      "Diff Amount": Math.abs(data["Cr Amount"] - data["Dr Amount"]),
      "Base Amount (Cr)": data["Cr Local Amount"],
      "Base Amount (Dr)": data["Dr Local Amount"],
      "Diff Base Amount": Math.abs(data["Diff Local Amount"]),
    })

  }, [bodyData, values?.ConversionFactor])

  const search = async (event, name) => {
    if (event?.query?.length > 0) {
      const payload = {
        "groupCode": String(values?.ChartOfGroup?.value),
        "accountTypeID": 0,
        "currencyCode": String(values?.Currency?.value),
        "accountName": String(event?.query),
        "voucherType": String(values?.VoucherType?.value)
      }
      let results = await LoadCentreChartOfAccountAPI(payload)
      if (results?.success) {
        // console.log("values?.VoucherType?.extraColomn", values?.VoucherType?.extraColomn?.split("#"))
        let filterData = []
        let type = values?.VoucherType?.extraColomn?.split("#")[0]
        if (name === "AccountType") {
          filterData = results?.data?.filter((val) => val?.balanceType === type)
        } else {
          filterData = results?.data?.filter((val) => val?.balanceType !== type)
        }
        setItems(filterData);
      } else 
      {
        setItems([])
      }
    } else {
      setItems([])
    }
  };
  const validateInvestigation = async (e, name) => {
    // if (!values?.VoucherType?.value) {
    //   notify("Please Select Voucher Type", "error")
    //   return 0
    // }
    // if (["PB", "BP", "BR", "CR", "CP", "SV"]?.includes(values?.VoucherType?.value) && values?.VoucherType?.extraColomn !== "All" && name === "AccountName" && !values?.AccountTypeValue) {
    //   notify(`Please Select ${t(values?.VoucherType?.extraColomn?.split("#")[1])}`, "error")
    //   return 0
    // }
    // const { value } = e;
  
    // if (["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value)) {
    //   value.RefDate = new Date();
    // }else{
    //   value.InvoiceDate = new Date();
    // }

    // value.branchCentre = { value: userData?.defaultCentre }
    // value.balanceType = { value: value?.balanceType }
    // value.ccList = []
    // value.mapList = []
   
    if (name === "AccountType") {
      value.isAccountType = true
      setValues((val) => ({ ...val, ["AccountTypeValue"]: value }))
      
    } else {
    
      setValues((val) => ({ ...val, [name]: "" }))
    }
    setBodyData((val) => ([...val, value]))
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix"
      >
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TextField}
        </div>
      </div>
    );
  };

  const GetCurrencyConversionFactor = async (currencyCode, voucherDate) => {
    let periodClose = await GetPeriodClosed(moment(voucherDate).format("DD-MMM-YYYY"))
    if (periodClose?.success) {
      let apiResp = await GetCurrencyConversionFactorAPI(currencyCode, voucherDate)
      if (apiResp?.success) {
        setValues((val) => ({ ...val, ConversionFactor: apiResp?.data, Actual: apiResp?.data }))
      }
    } else {
      notify(periodClose?.data, "error")
    }

  }

  // const handleValidation = () => {

  //   let error = {}
  //   bodyData.map((val, index) => {
  //     console.log("vv", val)
  //     if (!val?.Department?.value) {
  //       error[`Department${index}`] = `Please Select Department In Row ${index + 1}`
  //     } else if (!val?.isAccountType && !val?.Amount) {
  //       error[`Amount${index}`] = `Please Enter Amount In Row ${index + 1}`
  //     } else if (["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value)) {
  //       if (!val?.PaymentMode?.value) {
  //         error[`PaymentMode${index}`] = `Please Select Payment Mode In Row ${index + 1}`
  //       } else if (!val?.Refnumber) {
  //         error[`Refnumber${index}`] = `Please Enter Reference number In Row ${index + 1}`
  //       }
  //     } else if (!["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value) && !val?.InvoiceNumber) {
  //       error[`InvoiceNumber${index}`] = `Please Enter Invoice Number In Row ${index + 1}`
  //     } else if (!val?.Remark) {
  //       error[`Remark${index}`] = `Please Enter Remark In Row ${index + 1}`
  //     }


  //   })

  //   return error

  // }

  const handleSave = async () => {
    let errors = handleValidation()
    if (Object.keys(errors).length > 0) {
      notify(Object.values(errors)[0], "error")
      return 0
    }

    if (amounts['Amount (Cr)'] - amounts['Amount (Dr)'] !== 0) {
      notify("Dr and Cr Amount should be equal", "error")
      return 0
    } else if (amounts['Base Amount (Cr)'] - amounts['Base Amount (Dr)'] !== 0) {
      notify("Dr and Cr Base Amount should be equal", "error")
      return 0
    } else if (values?.ConversionFactor <= 0) {
      notify("Conversion Factor should be greater than 0", "error")
      return 0
    }



    const payload = FinanceSaveVoucherPayload(bodyData, amounts, values);
    let apiResp = await FinanceSaveVoucher(payload)
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      setBodyData([]);
      setValues((val) => ({ ...initialValues, Currency: values?.Currency, ConversionFactor: values?.ConversionFactor, Actual: values?.Actual, voucherNumber: apiResp?.data }))
      setModalData({
        visible: true,
        width: "25vw",
        label: t("Voucher Number"),
        CallAPI: () => { },
        footer: <></>,
        Component: <h1 className="text-center  PatientUHID" > <span className="text-red PatientUHID"> {apiResp?.data} </span> </h1>,
      });


    } else {
      notify(apiResp?.message, "error");
    }
  }

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setValues((val) => ({ ...val, documentBase64: base64String }))
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  const handleSelectVoucher = async (value , isEdit = false) => {
    let apiResp = await SearchVoucher(2, value?.VoucherNo)
    let ccResp = await SearchVoucher(3, value?.VoucherNo)

    if (apiResp?.success) {
      setModalData({ visible: false })


      let data = apiResp?.data?.map((val, index) => {
        if (index === 0) {
          setValues((item) => ({ ...item, VoucherType: { value: val?.VoucherType } , isEdit: isEdit , VoucherNumber: value?.VoucherNo }))
        }
        let ccList = []
        if (ccResp?.success) {
          ccList = ccResp?.data?.map((item) => {
            return {
              SerialNo: item?.SerialNo,
              RequirementArea: item?.ReqAreaName,
              CostCentre: item?.CostCentreName,
              ccAmount: item?.Amount
            }
          })
        }

        let conditionalData = {}
        if (["BP", "CP", "BR", "CR", "CV", "BT"].includes(val?.VoucherType)) {
          conditionalData = {
            PaymentMode: { value: String(val?.PaymentModeID), label: val?.PaymentMode },
            Refnumber: val?.RefNo ? val?.RefNo : "",
            RefDate: val?.RefDate ? new Date(val?.RefDate) : new Date()
          }
        } else {
          conditionalData = {
            InvoiceNumber: val?.DocumentNo ? val?.DocumentNo : "",
            InvoiceDate: val?.DocumentDate ? new Date(val?.DocumentDate) : new Date(),
          }

        }

        let ccListDetail = ccList?.filter((item) => item?.SerialNo === index + 1)
        return {
          GroupName: val?.ChartOfGroup,
          AccountName: val?.AccountName,
          ValueField:val?.COAID,
          branchCentre: { value: String(val?.BranchCentreID) },
          Department: { value: val?.DepartmentCode,label:val?.DepartmentName},
          
          isAccountType: false,
          Amount: val?.AmountSpecific,
          TaxAmount: val?.VatAmt,
          balanceType: { value: val?.BalType },

          ...conditionalData,


          PaymentMode: { value: String(val?.PaymentModeID), label: val?.PaymentMode },
          Refnumber: val?.RefNo ? val?.RefNo : "",
          RefDate: val?.RefDate ? new Date(val?.RefDate) : new Date(),
          Remark: val?.Remarks,
          CurrencyCode: values?.Currency?.value ? values?.Currency?.value : "",
          TextField: val?.AccountName,
          ccList: ccListDetail ? ccListDetail : [],
        

        }
      })
      setBodyData(data)
    } else {
      notify(apiResp?.message, "error")
      setVoucherList([])
    }

  }
  const ReplicateModalOpen = () => {
    setBodyData([])
    setModalData({
      visible: true,
      width: "70vw",
      label: t("Voucher`s History"),
      // buttonName: buttonName,
      CallAPI: () => { },
      footer: <></>,
      Component: (""
        // <ReplicateVoucherHistoryModal handleSelectVoucher={handleSelectVoucher} />
      ),
    });

  }


  const handleSearchVoucherList = async (e) => {

    let apiResp = await SearchVoucher(1, values?.VoucherNo)
    if (apiResp?.success) {
      setVoucherList(apiResp?.data)
    } else {
      notify(apiResp?.message, "error")
      setVoucherList([])
    }

  }

  const HandleView = (value, index) => {
    return <> <Tooltip
      target={`#icon-${index}`}
      content={`Verify By :${value?.VerifiedBy}\nVerify Date :${value?.VerifyDate}\nVerify Remark :${value?.VerifyRemark}\nAuth By :${value?.AuthBy}\nAuth Date :${value?.AuthDate}\nAuth Remark :${value?.AuthRemark}\nReview By :${value?.ReviewBy}\nReview Date :${value?.ReviewDate}\nReview Remark :${value?.ReviewRemarks}\nReview Resolved By :${value?.ReviewResolvedBy}\nReview Resolved Date :${value?.ReviewResolvedDate}\nReview Resolved Remark :${value?.ReviewResolvedRemarks}`}
      event="hover"
      position="top"
    /> <strong id={`icon-${index}`} className="cursor-pointer text-danger" > {t("View")}</strong></>
  }
  const handleEdit = async (ele) => {
    
    handleSelectVoucher(ele , true);
    };

   const renderPurchaGetDepartMentAPI = async () => {
      try {
        const GetDepartMent = await PurchaGetDepartMent();
        if (GetDepartMent?.success) {
          setDropDownState((val) => ({
            ...val,
            GetDepartMent: handleReactSelectDropDownOptions(
              GetDepartMent?.data,
              "RoleName",
              "DeptLedgerNo"
            ),
          }));
        }
      } catch (error) {
        console.log(error, "SomeThing Went Wrong");
      }
    };
    useEffect(()=>{
      renderPurchaGetDepartMentAPI()
    },[])

  return (<>
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
           <ReactSelect
            placeholderName={t("Department")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"departmentTo"}
            name={"departmentTo"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={dropDownState?.GetDepartMent}
            value={values?.departmentTo?.value}
          />
         
          <div className="col-xl-4 col-md-8 col-sm-6 col-12">

            <AutoComplete
              value={values?.AccountName?.TextField ? values?.AccountName?.TextField : values?.AccountName}
              suggestions={items}
              completeMethod={(e) => { search(e, "AccountName") }}
              onChange={(e) => setValues({ ...values, AccountName: e.value })}
              className="w-100"
              onSelect={(e) => validateInvestigation(e, "AccountName")}
              id="AccountName"
              itemTemplate={itemTemplate}
              onBlur={() => { setValues((prev) => ({ ...prev, AccountType: "", AccountName: "" })) }}

            />
            <label
              className="label lable truncate ml-3 p-1"
              style={{ fontSize: "5px !important" }}
            >
              {t("Account Name")}

            </label>
          </div>
          <Input
                type="number"
                className="form-control "
                id="MinimumQty"
                lable="Minimum Qty"
                placeholder=" "
                required={true}
                value={values?.MinimumQty}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="MinimumQty"
                onChange={handleChange}
              />
          <Input
                type="number"
                className="form-control "
                id="RiderQty"
                lable="Rider Qty"
                placeholder=" "
                required={true}
                value={values?.RiderQty}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="RiderQty"
                onChange={handleChange}
              />
 <button
                className="btn btn-sm btn-primary mx-1 mb-1"
                // onClick={handleGetAutoPurchaseRequestItems}
              >
                {t("Save")}
              </button>
        </div>


      </div>
    </div>

    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading isBreadcrumb={false} title={t("Voucher List")} secondTitle={
          <button className="btn btn-sm btn-primary " type="button" style={{ backgroundColor: "#61368b" }} onClick={ReplicateModalOpen}>
            {t("Replicate")}
          </button>
        } />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control "
            id="VoucherNo"
            name="VoucherNo"
            value={values?.VoucherNo ? values?.VoucherNo : ""}
            onChange={handleChange}
            lable={t("Voucher No.")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
            <button className="btn btn-sm btn-primary  w-100   " type="button" onClick={handleSearchVoucherList}>
              {t("Search")}
            </button>
          </div>

         

        </div>
        <Tables
          thead={WrapTranslate(voucherHead, "name")}
          tbody={voucherList?.map((val, index) => ({
            Sno: index + 1,
            VoucherNo: val?.VoucherNo,
            VoucherDate: val?.VoucherDate,
            VoucherAmount: val?.VoucherAmount,
            // Voucher: val?.VoucherAmount,
            EntryDate: val?.EntryDate,
            EntryBy: val?.EntryBy,
            View: HandleView(val, index),
            Edit: <i className="fa fa-edit" aria-hidden="true" onClick={() => { handleEdit(val, index) }}></i>,
            review: "Review",
            Print: <i className='pi pi-print'></i>,
          }))}
        />
      </div>
    </div>

    

  </>
  );



}

export default Department ;
