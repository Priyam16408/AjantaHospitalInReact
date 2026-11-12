import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import LabeledInput from '../../../components/formComponent/LabeledInput';
import moment from 'moment';
import { BindVoucherBillingScreenControls, GetPendingCheque, SaveChequeDeposit } from '../../../networkServices/finance';
import Tables from '../../../components/UI/customTable';
import Input from '../../../components/formComponent/Input';

const ChequeDeposit = () => {
  const [t] = useTranslation();
  const [payload, setPayload] = useState({
    reciveDate: new Date(),
    chequeInHand: { label: "", value: "" },
    depositAccount: { label: "", value: "" },
    currency: { label: "", value: "" }
  })


  const { VITE_DATE_FORMAT } = import.meta.env;

  const handleChange = (e) => {
    setPayload((val) => ({ ...val, [e.target.name]: e.target.value }))
  }
  const handleReactChange = (name, e, key) => {
    setPayload((val) => ({ ...val, [name]: e }));
  };
  const [dropDownState, setDropDownState] = useState({

    BindBank: [],
    currency: [],

  });
  const [bindMapping, setBindMapping] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectItem, setSelectItem] = useState([]);

  
  const selectAllRef = useRef(null);
  const areAllSelected = selectedRows.length === bindMapping.length && bindMapping.length > 0;


  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.inderterminate = selectedRows.length > 0 && selectedRows.length < bindMapping.length;
    }
  }, [selectedRows, bindMapping.length])

  // Function to update selectItem based on selectedRows
  const updateSelectItem = (selectedIndices) => {
    const selectedValue = selectedIndices.map(index => bindMapping[index]?.val).filter(Boolean); // Ensure PurchaseRequestNo exists
    setSelectItem(selectedValue);
  };

  // Toggle individual row selection using index
  const handleRowSelect = (index) => {
    setSelectedRows((prevSelectedRows) => {
      let updatedSelectedRows;

      if (prevSelectedRows.includes(index)) {
        updatedSelectedRows = prevSelectedRows.filter((i) => i !== index); // Remove
      } else {
        updatedSelectedRows = [...prevSelectedRows, index]; // Add
      }
      return updatedSelectedRows;
    });
  };
  useEffect(() => {
    updateSelectItem(selectedRows)
  }, [selectedRows, bindMapping])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndices = bindMapping.map((_, index) => _);
      setSelectedRows(allIndices);
    } else {
      setSelectedRows([]);
    }
  };

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1)
    if (apiResp?.success) {
      const bankName = filterByTypes(apiResp?.data, [5], ["TypeID"], "TextField", "ValueField")

      const filteredBankName = await bankName
        .filter(item => item.label.toLowerCase().includes("banks accounts"))
        .slice(0, 2); // Limit to 2 records

      setDropDownState((val) => ({
        ...val,
        BindBank: handleReactSelectDropDownOptions(
          filteredBankName,
          "label",
          "value"
        ),
      }))


      const Currency = filterByTypes(apiResp?.data, [4], ["TypeID"], "TextField", "ValueField", "TypeCode")
      if (Currency?.length > 0) {
        setPayload((val)=>({...val,currency:{value:Currency[0]?.extraColomn},currencyName:Currency[0]?.extraColomn}))
        setDropDownState((val) => ({
          ...val,
          currency: handleReactSelectDropDownOptions(
            Currency,
            "label",
            "value"
          ),
        }))
      }

    } else {
      // setList([])
    }
  }

  useEffect(() => {
    bindListData()
  }, [])

  const handleSearch = async (recall) => {
    let data = {
      DepositDate: moment(payload.reciveDate).format("DD-MMM-YYYY") || "",
      CoaID: payload?.chequeInHand?.value || "",
      IsCheckDeposit: "0"
    }
    if (!data.CoaID) {
      notify("Please fill in required fields", "error");
      return
    }

    let apiRes = await GetPendingCheque(data);

    if (apiRes?.success) {
      setBindMapping(apiRes.data);
      setSelectedRows([]);
    } else {
      console.log(recall);

      if (recall) {
        // notify(apiRes.message, "error")
        setBindMapping([])
      } else {
        notify(apiRes.message, "error")
        setBindMapping([])
      }
    }
  }

  const handleSave = async (selectedRows) => {
    const formatedpayload = selectedRows.map(row => ({
      Chequedate: row.RefDate,
      Chequeno: row.RefNo,
      Depostbankcoa: payload?.depositAccount?.value || 0,
      Depositamount: row.BaseAmount,
      DocDate: "",
      DocNo: "",
      EntryDetailID: row.EntryDetailID,
      PartyName: row.PartyName,
      Remarks: row?.remarks || "",
      VoucherDate: row.VoucherDate,
      VoucherNo: row.VoucherNo
    }))
    console.log(formatedpayload);

    if (selectedRows.length === 0) {
      notify("Kindly Select At Least One Cheque", "error")
      return
    }

    let apiRes = await SaveChequeDeposit(formatedpayload);
    console.log(apiRes);

    if (apiRes?.success) {
      let recall;
      notify(`${apiRes?.message}`, "success")
      handleSearch(recall = true)
    } else {
      notify(apiRes?.message, "error")
    }

  }

  const handleInputChange = (e, index) => {
    const newData = [...bindMapping];
    newData[index].remarks = e.target.value;
    setBindMapping(newData);
  }

  const isMobile = window.innerWidth <= 800;
  const thead = [
    { name: t("S/No."), width: "1%" },
    { name: t("Cheque No"), width: "5%" },
    { name: t("Cheque Date"), width: "5%" },
    { name: t("Amount"), width: "5%" },
    { name: t("Amount Local"), width: "5%" },
    { name: t("Party Name"), width: "5%" },
    { name: t("Balance Type"), width: "5%" },
    { name: t("Bank Account"), width: "5%" },
    { name: t("Voucher No."), width: "5%" },
    { name: t("Voucher Date"), width: "5%" },
    { name: t("Remarks."), width: "10%" },
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
  ]
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading isBreadcrumb={true}
        // title={t("cheque Deposit")}
        />
      </div>
      <div className="patient_registration card">
      
        <div className='row p-2'>

          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Recived Date")}
            respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
            name="reciveDate"
            maxDate={new Date()}
            id="reciveDate"
            value={payload?.reciveDate ? moment(payload.reciveDate).toDate() : new Date}
            showTime
            hourFormat="12"
            handleChange={handleChange}
            inputClassName={"required-fields"}
          />

          <ReactSelect
            placeholderName={t("Cheque In Hand")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            requiredClassName="required-fields"
            id={"chequeInHand"}
            name={"chequeInHand"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            // dynamicOptions={dropDownState?.BindBank}
            dynamicOptions={[
              { value: "0", label: "Select" },
              ...handleReactSelectDropDownOptions(
                dropDownState?.BindBank,
                "label",
                "value"
              ),
            ]}
            value={payload?.chequeInHand?.value}
          />
          
          <LabeledInput className={"col-xl-2 col-md-3 col-sm-6 col-12"} label={t("Currency")} value={payload?.currencyName} />
          <div className='col-xl-2 col-md-3 col-sm-6 col-12'>

            <button
              className="btn btn-sm btn-primary ml-sm-2 ml-0 mt-sm-0 mt-1"
              type="submit"
              onClick={(recall) => { handleSearch(recall = false) }}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 patient_registration ">
        <div className=" spatient_registration_card">
          <Tables
            style={{ maxHeight: "45vh" }}
            thead={thead}
            tbody={
              bindMapping?.map((item, index) => ({
                "S/No.": index + 1,
                "Check No.": item?.RefNo,
                "Cheque Date.": item?.RefDate,
                "Amount.": item?.BaseAmount,
                "Amount Local": item?.BaseAmount,
                "Party Name": item?.PartyName,
                "Balance Type": item?.BalanceType,
                "BAnk Account": item?.AccountName,
                "Voucher No": item.VoucherNo,
                "Voucher Date": item?.VoucherDate,
                "Remarks": (
                  <Input
                    type="text"
                    className="table-input"
                    removeFormGroupClass={true}
                    // display={"right"}
                    name="remarks"
                    respclass="w-100"
                    value={item.remarks}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                ),
                "checkbox": (
                  <input
                    type='checkbox'
                    style={{ marginRight: "20px" }}
                    checked={selectedRows.includes(item)}
                    onChange={() => handleRowSelect(item)}
                  />
                ),
              }))
            }
          />
        </div>
        {bindMapping.length > 0 &&
          (
            <div className="patient_registration card">
              <div className="mt-2 spatient_registration_card d-flex flex-wrap">

                <LabeledInput className={"col-xl-2 col-md-3 col-sm-6 col-12"} label={t("Total")}
                  // value={selectedRows.BaseAmount} 
                  value={selectedRows.length > 0
                    ? selectedRows.reduce((total, row) => total + (row?.BaseAmount || 0), 0)
                    : 0
                  }
                />

                <ReactSelect
                  placeholderName={t("Deposit Account")}
                  searchable={true}
                  respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                  requiredClassName="required-fields"
                  id={"depositAccount"}
                  name={"depositAccount"}
                  removeIsClearable={true}
                  handleChange={(name, e) => handleReactChange(name, e)}
                  // dynamicOptions={dropDownState?.BindBank}
                  dynamicOptions={[
                    { value: "0", label: "Select" },
                    ...handleReactSelectDropDownOptions(
                      dropDownState?.BindBank,
                      "label",
                      "value"
                    ),
                  ]}
                  value={payload?.depositAccount?.value}
                />

                <ReactSelect
                  placeholderName={t("Currency")}
                  searchable={true}
                  respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                  requiredClassName="required-fields"
                  id={"currency"}
                  name={"currency"}
                  removeIsClearable={true}
                  handleChange={(name, e) => handleReactChange(name, e)}
                  // dynamicOptions={dropDownState?.BindBank}
                  dynamicOptions={[
                    { value: "0", label: "Select" },
                    ...handleReactSelectDropDownOptions(
                      dropDownState.currency,
                      "label",
                      "value"
                    ),
                  ]}
                  value={payload?.currency?.value}
                />
                <div className='col-xl-2 col-md-3 col-sm-6 col-12'>

                  <button
                    className="btn btn-sm btn-primary ml-sm-2 ml-0"
                    type="submit"
                    onClick={(e) => { handleSave(selectedRows) }}
                  >
                    {t("Save")}
                  </button>
                </div>

              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ChequeDeposit;