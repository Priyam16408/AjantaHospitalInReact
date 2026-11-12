import React, { useEffect, useState } from "react";
import { Tabfunctionality } from "../../../../utils/helpers";
import Heading from "../../../../components/UI/Heading";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import { notify } from "../../../../utils/utils";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import VoucherMasterTable from "./VoucherMasterTable";
import { FinanceBindVoucherTypeMaster, FinanceDeActiveVoucherTypeMaster, FinanceSaveVoucherTypeMaster } from "../../../../networkServices/finance";

const Vouchermaster = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const [bindVoucherData, setBindVoucherData] = useState([]);
  const [values, setValues] = useState({
    voucherType: "",
    voucherName: "",
    fullName: "",
    autoVerify: { label: "No", value: "0" },
    autoAuth: { label: "No", value: "0" },
  });


  const handleReactChange = (name, e) => {
    setValues((prevValues) => ({ ...prevValues, [name]: e }));
  };

  const handleInputChange = (name, event) => {
    setValues((prevValues) => ({ ...prevValues, [name]: event.target.value }));
  };

  const bindVoucher = async () => {
    const response = await FinanceBindVoucherTypeMaster();
    console.log("Voucher response", response.data);
    if (response?.success) {
      setBindVoucherData(response?.data);
    }
  };

  useEffect(() => {
    bindVoucher();
  }, []);

  const handleSaveVoucherType = async () => {
    console.log("values",values)
    if (!values?.voucherType || !values?.fullName || !values?.voucherName || !values?.autoVerify.value || !values?.autoAuth.value) {
      notify("Please fill all required fields.", "error");
      return;
    }
    const payload = {
      "voucherType": values?.voucherType,
      "fullName": values?.fullName,
      "voucherName": values?.voucherName,
      "savetype":isEdit?"Update": "Save",
      "id": isEdit?values?.ID: "",
      "isAutoVerifyHISData": values?.autoVerify.value,
      "isAutoAuthByHISData": values?.autoAuth.value
    }
    try {
      const response = await FinanceSaveVoucherTypeMaster(payload)
      console.log("response",response)
      if (response?.success) {
        notify(response.message, "Success")
        console.log("response.message",response.message)
        bindVoucher()
        setValues((preV)=>({
          ...preV,
          voucherType: "",
          voucherName: "",
          fullName: "",
          ID:"",
          autoVerify: { label: "No", value: "0" },
          autoAuth: { label: "No", value: "0" },
        }))
        setIsEdit(false)
      } else {
        notify(response.message, "error")
      }
    } catch (error) {
      console.error("Error saving voucher type:", error);
      notify("An error occurred while saving.", "error");

    }
  }

  const handleDeactive=async(val)=>{
    console.log("val",val)
    
    const payload={
      "id":String(val?.VoucherTypeID),
      "active":String(val?.IsActive)
    }
const response= await FinanceDeActiveVoucherTypeMaster(payload)
if(response?.success){
  bindVoucher()
  notify(response?.message,"success")
}
else{
  notify(response?.message,"error")
}
  }

  const handleEdit = (val) => {
    console.log("val", val)
    setIsEdit(true)
    setValues((prev) => (
      {
        ...prev,
        ID:val?.VoucherTypeID,
        voucherType: val?.TransactionType,
        voucherName: val?.VoucherName,
        fullName: val?.VoucherFullName,
        autoVerify: val?.IsAutoVerifyHISData === "No" ? { label: "No", value: "0" } : { label: "Yes", value: "1" },
        autoAuth: val?.IsAutoAuthByHISData === "No" ? { label: "No", value: "0" } : { label: "Yes", value: "1" },
      }
    ))
  }
  const handleCencel = () => {
    setIsEdit(false)
    setValues({
      voucherType: "",
      voucherName: "",
      fullName: "",
      autoVerify: { label: "No", value: "0" },
      autoAuth: { label: "No", value: "0" },
    })

  }

  return (
    <div className="card border">
      <Heading title={"Voucher Master"} isBreadcrumb={false} />
      <div className="row p-2">
        <Input
          type="text"
          maxLength="5"
          className="form-control required-fields"
          lable={t("Voucher Type")}
          placeholder=" "
          id="voucherType"
          name="voucherType"
          value={values?.voucherType}
          onChange={(e) => handleInputChange("voucherType", e)}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          onKeyDown={Tabfunctionality}
        />
        <Input
          type="text"
          className="form-control required-fields"
          lable={t("Voucher Name")}
          placeholder=" "
          id="voucherName"
          name="voucherName"
          value={values?.voucherName}
          onChange={(e) => handleInputChange("voucherName", e)}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          onKeyDown={Tabfunctionality}
        />
        <Input
          type="text"
          className="form-control required-fields"
          lable={t("Full Name")}
          placeholder=" "
          id="fullName"
          name="fullName"
          value={values?.fullName}
          onChange={(e) => handleInputChange("fullName", e)}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          onKeyDown={Tabfunctionality}
        />
        <ReactSelect
          placeholderName={t("Auto Verify HIS Data")}
          searchable={true}
          id="autoVerify"
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={[
            {
              label: "No", value: "0"

            },
            {
              label: "Yes", value: "1"

            },
          ]}
          name="autoVerify"
          value={values?.autoVerify?.value}
          handleChange={(name, e) => handleReactChange(name, e)}
        />
        <ReactSelect
          placeholderName={t("Auto Auth HIS Data")}
          searchable={true}
          id="autoAuth"
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          dynamicOptions={[
            {
              label: "No", value: "0"

            },
            {
              label: "Yes", value: "1"

            },
          ]}
          name="autoAuth"
          value={values?.autoAuth?.value}
          handleChange={(name, e) => handleReactChange(name, e)}
        />


<div className="col-xl-2 col-md-3 col-sm-6 col-12">
  
{
          isEdit ? (
            <>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSaveVoucherType}
              >
                {t("Update")}
              </button>
              <button
                className="btn btn-sm btn-primary ml-2"
                onClick={handleCencel}
              >
                {t("Cancel")}
              </button>
            </>

          )
            :
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSaveVoucherType}
            >
              {t("Save")}
            </button>
        }
</div>
      </div>
      <Heading title={"Voucher Type Details"} isBreadcrumb={false} />
      <VoucherMasterTable bindVoucherData={bindVoucherData} onEdit={handleEdit} handleDeactive={handleDeactive} />
    </div>
  );
};

export default Vouchermaster;
