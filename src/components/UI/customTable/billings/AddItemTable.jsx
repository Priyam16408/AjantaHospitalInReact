import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "..";
import Input from "../../../formComponent/Input";
import CustomSelect from "../../../formComponent/CustomSelect";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { GetAllDoctor } from "../../../../store/reducers/common/CommonExportFunction";
import DatePicker from "../../../formComponent/DatePicker";
import TimePicker from "../../../formComponent/TimePicker";
import { AMOUNT_REGX, ROUNDOFF_VALUE } from "../../../../utils/constant";
import {
  findSumBillAmount,
  handleReactSelectDropDownOptions,
  handleRequestBodyBillingSaveSaveServicesBilling,
  notify,
  reactSelectOptionList,
} from "../../../../utils/utils";
import { BillingSaveSaveServicesBilling, PatientBillingGetPackage } from "../../../../networkServices/BillingsApi";
import { useLocation } from "react-router-dom";
import {
  BindDisApprovalList,
  bindHashCode,
  GetDiscReasonList,
} from "../../../../networkServices/opdserviceAPI";
import ReactSelect from "../../../formComponent/ReactSelect";
import TimeInputPicker from "../../../formComponent/CustomTimePicker/TimeInputPicker";

const AddItemTable = (props) => {
  const {
    THEAD,
    tbody,
    setTableData,
    Authorization,
    pateintDetails,
    handleSaveAddItemSuccessfully,
    GetBindBillDetails,
    packageID
  } = props;
  console.log("packageID",packageID)
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { GetAllDoctorList } = useSelector((state) => state?.CommonSlice);
  const dispatch = useDispatch();
  //  const [packageID, setPackageID] = useState("0");
      const [dropDownState, setDropDownState] = useState([]);
      // console.log("dropDownState",dropDownState)
  const { IsDiscount, IsRate } = Authorization;
  const location = useLocation();
  const [discounts, setDiscounts] = useState({
    discountApprovalList: [],
    discountReasonList: [],
  });

  const [values, setValues] = useState({
    discountReason: "",
    discountApproveBy: "",
  });
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const [t] = useTranslation();
 const handlePatientBillingGetPackage = async (TransactionID) => {
  debugger
    try {
      const response = await PatientBillingGetPackage(TransactionID);
      console.log("firstresponse",response)
      setDropDownState([
        { label: "No Package", value: "0" },
        ...handleReactSelectDropDownOptions(
          response?.data,
          "TypeName",
          "ItemID"
        ),
      ]);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const handleCalulateOfTableData = (modifiedData, name) => {
    if (!["sampleReqDate", "remark"].includes(name)) {
      if (name !== "discountAmount") {
        modifiedData.discountAmount = Number(
          Number(modifiedData.Rate) *
            Number(modifiedData?.quantity) *
            Number(modifiedData?.ipdPanelDiscPercent) *
            0.01
        ).toFixed(ROUNDOFF_VALUE);
      }

      if (name !== "ipdPanelDiscPercent") {
        modifiedData.ipdPanelDiscPercent = Number(
          Number(Number(modifiedData.discountAmount) * 100) /
            (Number(modifiedData.Rate) * Number(modifiedData?.quantity))
        ).toFixed(ROUNDOFF_VALUE);
      }

      modifiedData.amount =
        Number(modifiedData?.Rate) * Number(modifiedData?.quantity) -
        Number(modifiedData?.discountAmount);

      modifiedData.PatientPayable =
        Number(modifiedData.isPayble) === 1
          ? modifiedData.amount
          : Number(modifiedData.amount) *
            Number(modifiedData?.ipdCoPayPercent).toFixed(ROUNDOFF_VALUE) *
            0.01;
    }

    return modifiedData;
  };

  const handleDeleteItem = (index) => {
    const data = tbody.filter((_, inx) => index !== inx);
    setTableData(data);
    notify("Successfully Removed Item", "success");
  };

  const handleCheckData = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tbody];
    data[index][name] = checked;
    setTableData(data);
  };

  const handleChange = (e, index, ...rest) => {
    const { name, value } = e.target;
    if (rest?.length > 0 && rest.some((element) => element === false)) {
      return;
    }
    const data = [...tbody];
    const modifiedData = { ...data[index] };
    modifiedData[name] = value;
    const resultData = handleCalulateOfTableData(modifiedData, name);
    data[index] = resultData;
    setTableData(data);
  };

  const handleTableData = (tableData) => {
    const reponse = tableData.map((item, index) => {
      return {
        date: item?.Date,
        CPT: item?.ItemCode,
        SubCategoryName: item?.SubCategoryName,
        itemName: item?.TypeName,
        Doctor: (
          <CustomSelect
            placeHolder={"Select Doctor"}
            value={item?.DoctorID}
            option={GetAllDoctorList}
          />
        ),
        SampleReqDate: (
          <DatePicker
            className="custom-calendar w-100"
            respclass={"table-calender-height"}
            value={item?.sampleReqDate}
            removeFormGroupClass={true}
            id="sampleReqDate"
            name="sampleReqDate"
            placeholder={VITE_DATE_FORMAT}
            showTime
            hourFormat="12"
            disable={![3].includes(Number(item?.ConfigID))}
            handleChange={(e) => handleChange(e, index)}
          />
        ),
        SampleReqTime: (
          <TimePicker
            removeFormControl={true}
            className={"table-time"}
            value={item?.sampleReqTime}
          />
        ),
       
        rate: (
          <Input
            type="number"
            className="table-input"
            removeFormGroupClass={true}
            display={"right"}
            name={"Rate"}
            value={Number(item?.Rate) || 0}
            disabled={!Boolean(IsRate)}
            onChange={(e) =>
              handleChange(e, index, AMOUNT_REGX(8).test(e?.target?.value))
            }
          />
        ),
        Quantity: (
          <Input
            type="number"
            className="table-input"
            removeFormGroupClass={true}
            display={"right"}
            name={"quantity"}
            value={Number(item?.quantity) || 0}
            disabled={[1, 3].includes(Number(item?.ConfigID))}
            onChange={(e) =>
              handleChange(e, index, AMOUNT_REGX(3).test(e?.target?.value))
            }
          />
        ),
        discountPer: (
          <Input
            type="number"
            className="table-input"
            removeFormGroupClass={true}
            value={item?.ipdPanelDiscPercent || 0}
            name={"ipdPanelDiscPercent"}
            disabled={!Boolean(IsDiscount)}
            display={"right"}
            maxLength={"3"}
            onChange={(e) =>
              handleChange(
                e,
                index,
                AMOUNT_REGX(3).test(e?.target?.value),
                Number(e?.target?.value) <= 100
              )
            }
          />
        ),
        discountAmt: (
          <Input
            type="number"
            className="table-input"
            removeFormGroupClass={true}
            value={item?.discountAmount || 0}
            name={"discountAmount"}
            disabled={!Boolean(IsDiscount)}
            display={"right"}
            onChange={(e) =>
              handleChange(
                e,
                index,
                AMOUNT_REGX(8).test(e?.target?.value),
                Number(e?.target?.value) <= item?.Rate
              )
            }
          />
        ),
        Amount: <div className="text-right">{String(item?.amount)}</div>,
        Payable: (
          <div className="text-right">
            {Number(item?.PatientPayable).toFixed(ROUNDOFF_VALUE)}
          </div>
        ),
        Remark: (
          <Input
            type="text"
            className="table-input"
            removeFormGroupClass={true}
            name={"remark"}
            value={item?.remark}
            onChange={(e) => handleChange(e, index)}
          />
        ),
        urgent: (
          <input
            type="checkbox"
            checked={item?.isUrgent}
            name="isUrgent"
            onChange={(e) => handleCheckData(e, index)}
          />
        ),
        Remove: (
          <i
            className="fa fa-trash text-danger"
            onClick={() => handleDeleteItem(index)}
          />
        ),
      };
    });

    const obj = {
      date: null,
      CPT: null,
      itemName: null,
      Doctor: null,
      SampleReqDate: null,
      SampleReqTime: null,
      rate: (
        <div className="text-right py-1">
          {findSumBillAmount(tableData, "Rate").toFixed(ROUNDOFF_VALUE)}
        </div>
      ),
      Quantity: null,
      discountPer: null,
      discountAmt: null,
      Amount: (
        <div className="text-right py-1">
          {findSumBillAmount(tableData, "amount").toFixed(ROUNDOFF_VALUE)}
        </div>
      ),
      Payable: (
        <div className="text-right">
          {findSumBillAmount(tableData, "PatientPayable").toFixed(
            ROUNDOFF_VALUE
          )}
        </div>
      ),
      Remark: null,
      urgent: null,
      Remove: null,
      colorcode: "#cfcfcf",
    };

    reponse.push(obj);
    return reponse;
  };

  const GetDiscListAPI = async () => {
    try {
      const [discountReasonListRes, discountApprovalListRes] =
        await Promise.all([
          GetDiscReasonList("OPD"),
          BindDisApprovalList("HOSPITAL", "1"),
        ]);

      setDiscounts({
        ...discounts,
        discountApprovalList: discountApprovalListRes?.data,
        discountReasonList: discountReasonListRes?.data,
      });
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };
  console.log("tbody",tbody)
  const handleBillingSaveSaveServicesBilling = async () => {
    
    // debugger
    // if(!values?.discountReason?.value){
    //   notify("Please select Discount Reason","warn");
    //   return
    // }
    // if(!values?.discountApproveBy?.value){
    //   notify("Please select Approved By ","warn");
    //   return
    // }
    // debugger
    // if(tbody.some((val)=>val?.ipdPanelDiscPercent)){
    //   if(!values?.discountReason){
    //          notify("Please Select Discount","warn")
    //          return
    //   }
    // }
    
    try {
      const hashcode = await bindHashCode();
      const requestBody = handleRequestBodyBillingSaveSaveServicesBilling(
        tbody,
        pateintDetails,
        location,
        hashcode?.data,
        values,
        packageID
      );
      console.log("requestBody",requestBody)
if(requestBody?.dataLT?.discountOnTotal){
  if(!values?.discountReason?.value){
      notify("Please select Discount Reason","warn");
      return
    }
    if(!values?.discountApproveBy?.value){
      notify("Please select Approved By ","warn");
      return
    }
}
debugger
      const response = await BillingSaveSaveServicesBilling({
        ...requestBody,
      });

      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleSaveAddItemSuccessfully();
        GetBindBillDetails();
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    dispatch(GetAllDoctor());
    GetDiscListAPI();
      handlePatientBillingGetPackage(pateintDetails?.TransactionID);
  }, []);

  console.log(discounts, "sjcsbcjkb");

  return (
    <>
      <Tables
        thead={THEAD}
        tbody={handleTableData(tbody)}
        style={{ maxHeight: "300px" }}
        // tableHeight={"tableHeight"}
        // style={{ maxHeight: "auto" }}
      />
      {/* <TimeInputPicker /> */}
      <div className="d-flex aling-items-center justify-content-end mt-2">
         {/* <ReactSelect
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        placeholderName={"package"}
                            name={"packageID"}
                               id={"packageID"}
                        dynamicOptions={dropDownState}
                        value={packageID}
                        // value={packageID.packageID}
                        // value={values.ItemID}
                        removeIsClearable={true}
                            //  handleChange={handleChange}
                        handleChange={(_, e) => setPackageID(e?.value)}
                      /> */}
        <ReactSelect
          placeholderName={t("Discount Reason")}
          id={"SR"}
          searchable={true}
          respclass={"col-md-2 mx-2"}
          dynamicOptions={reactSelectOptionList(
            discounts?.discountReasonList,
            "DiscountReason",
            "ID"
          )}
          name="discountReason"
          handleChange={handleSelect}
          requiredClassName={
            findSumBillAmount(tbody, "discountAmount") > 0
              ? "required-fields"
              : ""
          }
          value={`${values?.discountReason?.value}`}
          removeIsClearable={true}
        />

        <ReactSelect
          placeholderName={t("Approved By")}
          id={"AB"}
          searchable={true}
          respclass={"col-md-2 mx-2"}
          dynamicOptions={reactSelectOptionList(
            discounts?.discountApprovalList,
            "ApprovalType",
            "ID"
          )}
          handleChange={handleSelect}
          name="discountApproveBy"
          value={`${values?.discountApproveBy?.value}`}
          requiredClassName={
            findSumBillAmount(tbody, "discountAmount") > 0
              ? "required-fields"
              : ""
          }
          removeIsClearable={true}
        />
        <button
          className="btn btn-sm btn-primary"
          onClick={handleBillingSaveSaveServicesBilling}
        >
          {t("Save")}
        </button>
      </div>
    </>
  );
};

export default AddItemTable;
