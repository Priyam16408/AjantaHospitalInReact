import React, { useEffect, useRef, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import LabeledInput from '../../../components/formComponent/LabeledInput';
import moment from 'moment';
import { BindVoucherBillingScreenControls, GetDepositCheque, SaveChequeBounce, SaveChequeDeposit, SearchVoucher } from '../../../networkServices/finance';
import Tables from '../../../components/UI/customTable';
import Input from '../../../components/formComponent/Input';
import { ReprintSVG } from '../../../components/SvgIcons';
import { Navigate } from 'react-router-dom';

const ChequeBounce = () => {
    const [t] = useTranslation();
    const [payload, setPayload] = useState({
        depositDate: new Date(),
        depositBank: { label: "", value: "" },
        currency: { label: "", value: "" },
        voucherNo: "",
        chequeNo: "",
        searchVoucherNo: ""
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
    const [voucherTable, setVoucherTable] = useState([]);

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
                setPayload((val) => ({ ...val, currency: { value: Currency[0]?.extraColomn }, currencyName: Currency[0]?.extraColomn }))
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
            CheckqueNo: payload?.chequeNo,
            CoaID: payload?.depositBank?.value || "",
            DepositDate: moment(payload.depositDate).format("DD-MMM-YYYY") || "",
            VoucherNo: payload?.voucherNo
        }
        if (!data.CoaID) {
            notify("Please fill in required fields", "error");
            return
        }

        let apiRes = await GetDepositCheque(data);
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
            Chequeno: row?.RefNo,
            Chequedate: moment(new Date(row?.RefDate)).format("DD-MMM-YYYY"),
            Depostbankcoa: 0,
            Depostiamount: row?.BaseAmount || 0,
            PartyName: row.PartyName,
            EntryDetailID: row?.EntryDetailID || 0,
            Remarks: row?.remarks || "",
            VoucherDate: moment(new Date(row?.VoucherDate)).format("DD-MMM-YYYY"),
            VoucherNumber: row?.VoucherNo,
        }))

        if (selectedRows.length === 0) {
            notify("Kindly Select At Least One Cheque", "error")
            return
        }

        let apiRes = await SaveChequeBounce(formatedpayload);

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
        { name: t("Branch Centre"), width: "5%" },
        { name: t("Voucher No."), width: "5%" },
        { name: t("Voucher Date"), width: "5%" },
        { name: t("Cheque No"), width: "5%" },
        { name: t("Cheque Date"), width: "5%" },
        { name: t("Amount"), width: "5%" },
        { name: t("Amount Local"), width: "5%" },
        { name: t("Type"), width: "5%" },
        { name: t("Party Name"), width: "5%" },
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
    const Theading = [
        { name: t("S/No."), width: "1%" },
        { name: t("Voucher No."), width: "5%" },
        { name: t("Voucher Date"), width: "5%" },
        { name: t("Amount Local"), width: "5%" },
        { name: t("Entry Date"), width: "5%" },
        { name: t("Entry By"), width: "5%" },
        { name: t("Verify Status"), width: "5%" },
        { name: t("Auth. Status"), width: "5%" },
        { name: t("Audit. Status"), width: "5%" },
        { name: t("Verify"), width: "5%" },
        { name: t("Auth."), width: "5%" },
        { name: t("Print"), width: "5%" },

    ]
    const handleSearchVoucher = async () => {
        const apiRes = await SearchVoucher(1, payload.searchVoucherNo);
        console.log(apiRes);
        if (apiRes.success) {
            setVoucherTable(apiRes.data)
        } else {
            notify(apiRes?.message, "error");
        }
    }

    const CommonReceiptPdfAPI = (item, index) => {

    }
    const handleCall = () => {
        alert("call")
    }
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
                        lable={t("Deposit Date")}
                        respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
                        name="depositDate"
                        maxDate={new Date()}
                        id="depositDate"
                        value={payload?.depositDate ? moment(payload.depositDate).toDate() : new Date}
                        showTime
                        hourFormat="12"
                        handleChange={handleChange}
                        inputClassName={"required-fields"}
                    />

                    <ReactSelect
                        placeholderName={t("Deposit Bank")}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        id={"depositBank"}
                        name={"depositBank"}
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
                        value={payload?.depositBank?.value}
                    />



                    <LabeledInput className={"col-xl-2 col-md-3 col-sm-6 col-12 mb-2"} label={t("Currency")} value={payload.depositBank.value ? payload?.currencyName : ''} />
                    <Input
                        type="text"
                        className="form-control"
                        id="voucherNo"
                        name="voucherNo"
                        value={payload.voucherNo ? payload.voucherNo : ""}
                        onChange={handleChange}
                        lable={t("Voucher Number")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />

                    <Input
                        type="text"
                        className="form-control "
                        id="chequeNo"
                        name="chequeNo"
                        value={payload.chequeNo ? payload.chequeNo : ""}
                        onChange={handleChange}
                        lable={t("Cheque Number")}
                        placeholder=" "
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    />

                    <div className='col-xl-2 col-md-3 col-sm-6 col-12'>

                        <button
                            className="btn btn-sm btn-primary ml-sm-2 ml-0 px-3"
                            type="submit"
                            onClick={(recall) => { handleSearch(recall = false) }}
                        >
                            {t("Search")}
                        </button>
                    </div>
                </div>
            </div>
            {bindMapping.length > 0 &&
                (
                    <>
                        <div className="mt-2 patient_registration ">
                            <div className=" spatient_registration_card">
                                <Heading isBreadcrumb={false}
                                    title={t("search Result")}
                                />
                                <Tables
                                    style={{ maxHeight: "45vh" }}
                                    thead={thead}
                                    tbody={
                                        bindMapping?.map((item, index) => ({
                                            "S/No.": index + 1,
                                            "Branch Centre": item.BranchCentre,
                                            "Voucher No": item.VoucherNo,
                                            "Voucher Date": item?.VoucherDate,
                                            "Check No.": item?.RefNo,
                                            "Cheque Date.": item?.RefDate,
                                            "Amount.": item?.BaseAmount,
                                            "Amount Local": item?.BaseAmount,
                                            "Type": item?.BalanceType,
                                            "Party Name": item?.PartyName,
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
                                        <div className="my-2 spatient_registration_card d-flex flex-wrap justify-content-between ">

                                            <LabeledInput className={"col-xl-2 col-md-3 col-sm-6 col-12 mb-2"} label={t("Total")}
                                                // value={selectedRows.BaseAmount} 
                                                value={selectedRows.length > 0
                                                    ? selectedRows.reduce((total, row) => total + (row?.BaseAmount || 0), 0)
                                                    : 0
                                                }
                                            />

                                            <div className='col-xl-2 col-md-3 col-sm-6 col-12 text-right'>

                                                <button
                                                    className="btn btn-sm btn-primary ml-sm-2 ml-0 px-3"
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
                        <div className=" patient_registration card">
                            <div className="mt-2 spatient_registration_card">
                                <Heading isBreadcrumb={false}
                                    title={t("Voucher List")}
                                />
                                <div className='row p-2'>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        id="searchVoucherNo"
                                        name="searchVoucherNo"
                                        value={payload.searchVoucherNo ? payload.searchVoucherNo : ""}
                                        onChange={handleChange}
                                        lable={t("Voucher Number")}
                                        placeholder=" "
                                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                                    />

                                    <div className='col-xl-2 col-md-3 col-sm-6 col-12'>

                                        <button
                                            className="btn btn-sm btn-primary ml-sm-2 ml-0 px-3"
                                            type="submit"
                                            onClick={() => { handleSearchVoucher() }}
                                        >
                                            {t("Search")}
                                        </button>
                                    </div>
                                </div>
                                <Tables
                                    style={{ maxHeight: "45vh" }}
                                    thead={Theading}
                                    tbody={
                                        voucherTable?.map((item, index) => ({
                                            "S/No.": index + 1,
                                            "Voucher No": item.VoucherNo,
                                            "Voucher Date": item?.VoucherDate,
                                            "Amount Local": item?.VoucherAmount,
                                            "Entry Date": item?.EntryDate,
                                            "Entry By": item?.EntryBy,
                                            "Verify Status": item?.IsVerifyReviewed,
                                            "Auth. Status": item?.IsAuthReviewed,
                                            "Audit Status": item?.IsAudit,
                                            "Verify": "",
                                            "Auth": (
                                                // <Input
                                                //     type="text"
                                                //     className="table-input"
                                                //     removeFormGroupClass={true}
                                                //     // display={"right"}
                                                //     name="remarks"
                                                //     respclass="w-100"
                                                //     value={item.remarks}
                                                //     onChange={(e) => handleInputChange(e, index)}
                                                // />
                                                <strong onClick={handleCall}>Auth</strong>
                                            ),
                                            "print": (
                                                <div style={{ textAlign: "center" }} onClick={() => { CommonReceiptPdfAPI(item, index) }}>
                                                    <ReprintSVG />
                                                </div>
                                                // <input
                                                //     type='checkbox'
                                                //     style={{ marginRight: "20px" }}
                                                //     checked={selectedRows.includes(item)}
                                                //     onChange={() => handleRowSelect(item)}
                                                // />
                                            ),
                                        }))
                                    }
                                />


                            </div>
                        </div>
                    </>
                )}
        </div>
    )
}

export default ChequeBounce;