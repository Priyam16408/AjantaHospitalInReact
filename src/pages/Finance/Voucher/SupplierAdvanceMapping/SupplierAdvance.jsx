import React, { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import {
  filterByTypes,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  POApprovalMasterBindEmployee,
  PurchaGetBindAllCenter,
  PurchaGetDepartMent,
  PurchaGetItemsByCategory,
  PurchaGetSubCategoryByCategory,
} from "../../../../networkServices/Purchase";

import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import Input from "../../../../components/formComponent/Input";
import { BindVoucherBillingScreenControls, SupplierBindBackendData, SaveMapAdvanceWithPurchase } from "../../../../networkServices/finance";
import DatePicker from "../../../../components/formComponent/DatePicker";
import moment from "moment";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
const SupplierAdvance = () => {
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const localData = useLocalStorage("userData", "get");
  const [tbodyData, setTbodyData] = useState([]);
  const [advanceVoucher, setAdvanceVoucher] = useState([]);
  const [voucherDetail, setVoucherDetails] = useState([])
  const [values, setValues] = useState({
    allCenter: {
      CentreID: 1,
      CentreName: "MOHANDAI OSWAL HOSPITAL",
      IsDefault: 0,
      label: "MOHANDAI OSWAL HOSPITAL",
      value: 1,
    },
    currency: "",
    chartOfAC: "",
    fromDate: new Date(),
    toDate: new Date(),
  });

  const [dropDownState, setDropDownState] = useState({
    GetBindAllCenter: [],
    BindVoucherList: [],
    Currency: [],
    chartOfAC: []
  });


  const [selectedRows, setSelectedRows] = useState([]);
  const selectAllRef = useRef(null);
  const areAllSelected = selectedRows.length === tbodyData.length && tbodyData.length > 0;
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndices = tbodyData.map((_, index) => _);
      setSelectedRows(allIndices);
    } else {
      setSelectedRows([]);
    }
  };

  const getPurchaGetBindAllCenterAPI = async () => {
    try {
      const GetBindAllCenter = await PurchaGetBindAllCenter();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: handleReactSelectDropDownOptions(
          GetBindAllCenter?.data,
          "CentreName",
          "CentreID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1);
    if (apiResp?.success) {
      const BindEmplyee = filterByTypes(
        apiResp?.data,
        [11],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      const BindAccount = filterByTypes(
        apiResp?.data,
        [5],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      const filteredAcName = await BindAccount
        .filter(item => item.label.toLowerCase().includes("suppliers"));


      const currencyDetails = filterByTypes(
        apiResp?.data,
        [4],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      setDropDownState((val) => ({
        ...val,
        // BindEmplyee: BindEmplyee,
        Currency: currencyDetails,
        chartOfAC: filteredAcName,
      }));
    } else {
      // setList([])
    }
  };

  useEffect(() => {
    bindListData();
  }, []);

  useEffect(() => {
    getPurchaGetBindAllCenterAPI();

    // getItemsBySubCategory(values?.category?.value);
  }, []);

  const handleReactChange = (name, e, key) => {
    setValues((val) => ({ ...val, [name]: e }));
  };
  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
  }


  const handleSearch = async (type) => {

    let payload = {
      Type: type,
      COAID: values?.chartOfAC?.value || 0,
      centreID: values?.allCenter?.CentreID || 0,
      currencyCode: values?.currency?.value || null,
      filterType: values?.userType?.value || 0,
      filterValue: values?.conversionFactor || "",
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY") || "",
      toDate: moment(values?.toDate).format("DD-MMM-YYYY") || "",
      voucherNo: values?.advanceVoucher?.value || "",
    }


    if (!payload.COAID || !payload.currencyCode) {
      notify("Please fill the Required fields", "error");
      return
    }
    let apiRes = await SupplierBindBackendData(payload);

    if (apiRes?.success) {

      if (type === 4) {
        setAdvanceVoucher(apiRes.data)
        setDropDownState((val) => ({
          ...val,
          BindVoucherList: handleReactSelectDropDownOptions(
            apiRes?.data,
            "TextField",
            "VoucherNo"
          ),
        }))
        handleSearch(2)
      }
      else {
        setTbodyData(apiRes?.data)
      }

    } else {
      notify(apiRes.message, "error")
      setTbodyData([])
    }
  }

  const voucherSearch = async (type, VNo) => {
    let payload = {
      Type: type,
      COAID: values?.chartOfAC?.value || 0,
      centreID: values?.allCenter?.CentreID || 0,
      CurrencyCode: values?.currency?.value || "INR",
      filterType: values?.userType?.value || 0,
      filterValue: values?.conversionFactor || "",
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY") || "",
      toDate: moment(values?.toDate).format("DD-MMM-YYYY") || "",
      voucherNo: !VNo ? values?.advanceVoucher?.value : VNo,
    }
    if (!payload.voucherNo) {
      notify("Please select Voucher", "error")
      return
    }
    let apiRes = await SupplierBindBackendData(payload);
    if (apiRes?.success) {
      setVoucherDetails(apiRes.data)
    } else {
      notify(apiRes.message, "error");
    }
  }


  const isMobile = window.innerWidth <= 800;
  const THEAD = [
    { width: "1%", name: t("SNo") },
    {
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          style={{ marginRight: "20px" }}
          ref={selectAllRef}
          checked={areAllSelected}
          onChange={handleSelectAll}
        />
      ),
      width: "1%",
    },
    { width: "5%", name: t("Voucher No") },
    { width: "5%", name: t("Voucher Date") },
    { width: "5%", name: t("GRN No") },
    { width: "5%", name: t("Account") },
    { width: "5%", name: t("Pending") },
    { width: "5%", name: t("Adjustment") },
  ];
  const VDTHead = [
    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("Branch Center") },
    { width: "5%", name: t("Account(Dept.)") },
    { width: "5%", name: t("Amount") },
    { width: "5%", name: t("Amount(L)") },
    { width: "5%", name: t("Type") },
    { width: "5%", name: t("Currency") },
    { width: "5%", name: t("C.F.") },
    { width: "5%", name: t("Narration") },

  ]
  const { VITE_DATE_FORMAT } = import.meta.env;


  const handleRowSelect = (row) => {
    setSelectedRows((prevSelectedRows) => {
      const isAlreadySelected = prevSelectedRows.includes(row);

      if (isAlreadySelected) {
        // If unchecked, remove its adjustment value
        setAdjustmentValues((prev) => {
          const updatedValues = { ...prev };
          delete updatedValues[tbodyData.indexOf(row)];
          return updatedValues;
        });

        return prevSelectedRows.filter((selectedRow) => selectedRow !== row);
      } else {
        return [...prevSelectedRows, row];
      }
    });
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.inderterminate = selectedRows.length > 0 && selectedRows.length < tbodyData.length;
    }
  }, [selectedRows, tbodyData.length])


  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(selectedRows?.reduce((total, row) => total + (row?.BalanceAmount || 0), 0));
  }, [selectedRows]);
  const [adjustmentValues, setAdjustmentValues] = useState({});

  const handleAdjustmentChange = (index, value) => {
    let inputValue = value.trim();
    let newValue = inputValue === "" ? 0 : Number(inputValue);

    // Ensure the value is within allowed limits
    if (isNaN(newValue) || newValue < 0) {
      newValue = 0;
    } else if (newValue > tbodyData[index].Amount) {
      newValue = tbodyData[index].Amount;
    }

    setAdjustmentValues((prev) => ({
      ...prev,
      [index]: newValue,
    }));
  };

  const pendingAdvance = values?.advanceVoucher
    ? values.advanceVoucher.Balance - selectedRows.reduce((sum, row, index) => sum + (adjustmentValues[index] >= 0 ? adjustmentValues[index] : row?.BalanceAmount), 0)
    : 0 - totalAmount;
  const totalAdjustment = selectedRows.length > 0
    ? selectedRows.reduce((sum, row, index) => sum + (adjustmentValues[index] >= 0 ? adjustmentValues[index] : row?.BalanceAmount), 0)
    : 0;

  const handleSave = async (e) => {
    e.preventDefault()

    if (!values?.advanceVoucher) {
      notify("Please select an Advanced Voucher", "error");
      return;
    }

    if (!selectedRows.length) {
      notify("Please select at least one Un-Adjusted Voucher", "error");
      return;
    }

    const advanceVoucherData = {
      entryDetailID: values.advanceVoucher.EntryDetailID, // Access EntryDetailID directly
      adjustmentAmount: totalAdjustment, // Assuming there's only one adjustment value for this
    };
    console.log(adjustmentValues, selectedRows);

    // Second array: From `selectedRows`
    const selectedRowsList = selectedRows?.map((row, index) => ({
      entryDetailID: row.EntryDetailID,
      adjustmentAmount: adjustmentValues[index] ?? totalAdjustment, // Ensure default value
    }));
    selectedRowsList.push(advanceVoucherData);
    // console.log(selectedRowsList);

    let apiRes = await SaveMapAdvanceWithPurchase(selectedRowsList);
    if (apiRes.success) {
      notify(apiRes.message, "success")
      handleSearch(4)
    }
  }

  console.log(values?.advanceVoucher?.value);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Auto Purchase Request Behalf Of Sales")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Center")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={values?.allCenter?.value}
          />

          <ReactSelect
            placeholderName={t("Currency")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
            id={"currency"}
            name={"currency"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.Currency}
            value={values?.currency?.value}
          />

          <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex ">
            <ReactSelect
              // requiredClassName={"required-fields"}
              placeholderName={t("HIS Departmen")}
              searchable={true}
              respclass="w-50 mr-2"
              // respclass="w-50"
              id={"userType"}
              name={"userType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={[
                { label: "Voucher No.", value: "1" },
                { label: "GRN No.", value: "3" },
              ]}
              value={values?.userType?.value}
            />
            <Input
              type="text"
              className="form-control "
              id="conversionFactor"
              name="conversionFactor"
              value={values?.conversionFactor}
              onChange={handleChange}
              lable={t("Conversion Factor")}
              placeholder=" "
              respclass="w-50"
            />
          </div>

          <ReactSelect
            placeholderName={t("Chart Of A/C")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"chartOfAC"}
            name={"chartOfAC"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.chartOfAC}
            value={values?.chartOfAC?.value}
          />

          {/* <Input
            type="text"
            className="form-control "
            id="chartOfAC"
            name="chartOfAC"
            value={values?.chartOfAC}
            onChange={handleChange}
            lable={t("Chart Of A/C")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          /> */}

          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("From Date")}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            name="fromDate"
            id="fromDate"
            maxDate={new Date()}
            value={values?.fromDate ? moment(values.fromDate).toDate() : new Date}
            showTime
            hourFormat="12"
            handleChange={(date) => handleChange(date, "fromDate")}
          />
          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("To Date")}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            name="toDate"
            id="toDate"
            maxDate={new Date()}
            value={values?.toDate ? moment(values.toDate).toDate() : new Date}
            showTime
            hourFormat="12"
            handleChange={(date) => handleChange(date, "toDate")}
          />

          {/* <ReactSelect
            placeholderName={t("Fin. Department")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={values?.allCenter?.value}
          /> */}
          {/* <ReactSelect
            // requiredClassName={"required-fields"}
            placeholderName={t("Chart of Account")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"userType"}
            name={"userType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "Entry By", value: "1" },
              { label: "Verify By", value: "2" },
              { label: "Auth By", value: "3" },
              { label: "Audit By", value: "4" },
              { label: "Reconsile Verify By", value: "5" },
              { label: "Reconsile Auth By", value: "6" },
            ]}
            value={values?.userType?.value}

          /> */}
          {/* {console.log("dropDownState?.BindEmplyee", dropDownState?.BindEmplyee)}
          <ReactSelect
            placeholderName={t("Store Type")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"employee"}
            name={"employee"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.BindEmplyee}
            value={values?.employee?.value}
          /> */}
          <div className="px-xl-0 px-2 text-right">
            <button
              className="btn btn-sm btn-primary mr-1 "
              onClick={() => { handleSearch(4) }}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      {dropDownState.BindVoucherList.length > 0 && tbodyData.length > 0 &&
        <div className="card">
          <div className=" mt-2 spatient_registration_card">
            <Heading title={t("Un-Adjusted Voucher List")} secondTitle={<>Total Voucher's: {tbodyData.length}</>} isBreadcrumb={false} />
            <Tables
              thead={THEAD}
              tbody={tbodyData?.map((val, index) => {
                const isSelected = selectedRows?.includes(val);
                return {
                  sno: index + 1,
                  "checkbox": (
                    <input
                      type='checkbox'
                      style={{ marginRight: "20px" }}
                      checked={isSelected}
                      onChange={() => handleRowSelect(val)}
                    />
                  ),
                  "Voucher No": (<span onClick={() => { voucherSearch(3, val?.VoucherNo.toString()) }}>{val.VoucherNo}</span>),
                  "Voucher Date": val.VoucherDate,
                  "GRN No": "",
                  "Amount": val.Amount,
                  "Pendeing": val.BalanceAmount,
                  "Adjustment": (
                    <Input
                      className="table-input"
                      name="Adjustment"
                      removeFormGroupClass={true}
                      type="text"
                      disabled={!isSelected}
                      onChange={(e) => handleAdjustmentChange(index, e.target.value)}
                      value={isSelected ? adjustmentValues[index] ?? val.BalanceAmount : 0}

                    // onChange={(e) => handleAdjustmentChange(index, e.target.value)}
                    // value={isSelected ? adjustmentValues[index] || val.Amount : 0}
                    />
                  ),
                }
              })}
              style={{ maxHeight: "23vh" }}
            />
          </div>

          <div className="mt-2 spatient_registration_card d-sm-flex flex-wrap align-items-center">
            <ReactSelect
              placeholderName={t("Advance Voucher")}
              searchable={true}
              requiredClassName={"required-fields"}
              respclass="col-xl-2 col-md-2 col-sm-6 col-12"
              id={"advanceVoucher"}
              name={"advanceVoucher"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={dropDownState?.BindVoucherList}
              value={values?.advanceVoucher?.value}
            />
            <LabeledInput className={"col-xl-1 col-md-2 col-sm-6 col-12 p-2"} label={t("Payment Mode")} value={values?.advanceVoucher?.PaymentMode} />
            <LabeledInput className={"col-xl-1 col-md-2 col-sm-6 col-12 p-2"} label={t("Amount")} value={values?.advanceVoucher ? `${values?.advanceVoucher?.Balance} ${values?.advanceVoucher?.CurrencyCode}` : ''} />
            <LabeledInput className={"col-xl-2 col-md-2 col-sm-6 col-12 p-2"} label={t("Ref No")} value={values?.advanceVoucher?.RefNo} />
            <LabeledInput className={"col-xl-2 col-md-2 col-sm-6 col-12 p-2"} label={t("Total Adjustment")}
              value={
                totalAdjustment
              }
            />


            <LabeledInput className={"col-xl-2 col-md-2 col-sm-6 col-12  p-2 text-red"} label={t("Pending Advance")}
              value={pendingAdvance}
            />

            <div className="py-2 text-right">
              <button
                className="btn btn-sm btn-primary mr-1"
                onClick={() => { voucherSearch(3, null) }}
              >
                {t("Search")}
              </button>
            </div>

          </div>
          <div className="my-2 spatient_registration_card">
            <div className="row px-2">


            </div>
          </div>
          <Heading title={t("Voucher Detail's")} secondTitle={<>{values?.advanceVoucher ? values?.advanceVoucher?.value : ''}</>} isBreadcrumb={false} />
          {voucherDetail.length > 0 &&
            <>
              <Tables
                thead={VDTHead}
                tbody={voucherDetail?.map((val, index) => {
                  return {
                    sno: index + 1,
                    "Branch Center": val?.BranchCentre,
                    "Account(Dept.)": val?.AccountName,
                    "Amount": val?.AmountBase,
                    "Amount(L)": val?.AmountSpecific,
                    "Type": val?.BalType,
                    "Currency": val?.CurrencyCode,
                    "C.F": val?.TransCurrFactor,
                    "Narration": val?.Remarks,

                  }
                })}
              />

              <LabeledInput label={t("Voucher Amount")} className={"w-100"} value={voucherDetail?.length > 0 ? `${voucherDetail[0].AmountBase}` : ''} />
            </>
          }
          <div className="px-xl-0 my-2 px-2 text-right">
            <button
              className="btn btn-sm btn-primary mr-1"
              disabled={pendingAdvance < 0}
              onClick={(e) => { handleSave(e) }}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default SupplierAdvance;
