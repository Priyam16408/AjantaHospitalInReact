import React, { useEffect, useState, useRef } from "react";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import DatePicker from "../../../../components/formComponent/DatePicker";
import moment from "moment";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import Input from "../../../../components/formComponent/Input";
import { Tabfunctionality } from "../../../../utils/helpers";
import { filterByTypes, notify } from "../../../../utils/utils";
import { BindVoucherBillingScreenControls, FinanceBindAuditBackendData, FinanceSaveVoucherAudit, SearchForBoucherPostingBatch } from "../../../../networkServices/finance";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";

import Tables from "../../../../components/UI/customTable";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";

const Audit = () => {
    const userData = useLocalStorage("userData", "get")
    const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [t] = useTranslation();
    const [SelectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedCurrencyName, setSelectedCurrencyName] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [tableVlues, setTableValues] = useState([]);
    const [reload, setReload] = useState(false);
    const [viewData, setViewData] = useState([])
    const [values, setValues] = useState({
        // BranchCentre: []
        BranchCentre: [{ code: Number(userData?.defaultCentre ? userData?.defaultCentre : 0), name: userData?.centreName }],
        fromDate: new Date(),
        toDate: new Date(),
        currency: {},
        // currency: { label: "INR", value: "INR" },
        department: { label: "All", value: "0" },
        projectName: { label: "All", value: "0" },
        voucherType: { label: "All", value: "0" },
        accountName: { label: "All", value: "0" },
        createdBy: { label: "All", value: "0" },
        authBy: { label: "All", value: "0" },
        verifyBy: { label: "All", value: "0" },
        amount: "",
        filterType: { label: "Voucher Date", value: "1" },
        status: {
            value: "0",
            label: "NO",
        },
        invoiceNo: "",
        symbol: {
            value: 3,
            label: ">=",
        },
        auditStatus: {
            value: "0",
            label: "Audit Not Done",
        },
        voucherNo: ""
    });

    const [DropDownState, setDropDownState] = useState({
        country: [],
        project: [],
        department: [],
        employee: [],
        accountName: [],
        projectName: [],
        VoucherType: [],

    });

    const handleMultiSelectChange = (name, selectedOptions) => {
        setValues({
            ...values,
            [name]: selectedOptions,
        });
    };

    const handleInputChangeCurrency = (e, index, field) => {
        setSelectedCurrency(index?.value);
        setSelectedCurrencyName(index?.label);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };
    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };

    const handleSearch = async (VoucherNo) => {
        // console.log("VoucherNoVoucherNoVoucherNoVoucherNo",VoucherNo)
// if(VoucherNo===false){
//     return
// }
        let centreID = values?.BranchCentre?.map((item) => {
            return item.code
        }).join(",")

        const payload =
        {

            "filterType": VoucherNo ? 3 : 2,
            "dateFilterType": Number(values?.filterType?.value || ""),
            "centreID": Number(centreID),
            "voucherNo": VoucherNo ? VoucherNo : "",
            "currencyCode": String(values?.currency?.value),
            "voucherType": String(values?.voucherType?.value || ""),
            "fromDate": moment(values?.fromDate).format("YYYY-MMM-DD"),
            "toDate": moment(values?.toDate).format("YYYY-MMM-DD"),
            "createdBy": String(values?.createdBy?.value || ""),
            "verifyBy": String(values?.verifyBy?.value || ""),
            "authBy": String(values?.authBy?.value || ""),
            "deparmentCode": String(values?.department?.value || ""),
            "specificAmount": Number(values?.amount || 0),
            "amountCategory": String(values?.symbol?.value || ""),
            "auditStatus": Number(values?.auditStatus?.value || ""),
            "branchCentreID": String(centreID),
        }

        try {

            const response = await FinanceBindAuditBackendData(payload)
            if (response?.success) {
                setTableValues(response?.data)
            }
            else {
                notify(response?.message,"error")
                setTableValues([])

            }
        } catch (error) {
            console.log("error", error)
        }
    };
    // console.log("selectedRows", selectedRows)
    const handleAudit = async () => {
        if (!selectedRows?.length > 0) {
            notify("Please select at least one item", "error");
            return
        }
        const payload = selectedRows.map((val) => (
            {
                "voucherNo": String(val?.VoucherNo),
                "entryStatus": 1,
                "auditRemark": String(val?.AuditRemark),
                "auditType": "A"

            }
        ))

        try {
            const response = await FinanceSaveVoucherAudit(payload)
            if (response?.success) {
                notify(response?.message, "success")
                handleSearch()
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    const handleFurtherQuery = async () => {
        if (!selectedRows?.length > 0) {
            notify("Please select at least one item", "error");
            return
        }
        const payload = selectedRows.map((val) => (
            {
                "voucherNo": String(val?.VoucherNo),
                "entryStatus": 0,
                "auditRemark": String(val?.AuditRemark),
                "auditType": "F"

            }
        ))

        try {
            const response = await FinanceSaveVoucherAudit(payload)
            if (response?.success) {
                notify(response?.message, "success")
                handleSearch()
            }
            else {
                notify(response?.message, "error")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleView = async (VoucherNo) => {

        let centreID = values?.BranchCentre?.map((item) => {
            return item.code
        }).join(",")

        const payload =
        {
            "filterType": VoucherNo ? 3 : 2,
            "dateFilterType": Number(values?.filterType?.value || ""),
            "centreID": Number(centreID),
            "voucherNo": VoucherNo ? VoucherNo : "",
            "currencyCode": String(values?.currency?.value),
            "voucherType": String(values?.voucherType?.value || ""),
            "fromDate": moment(values?.fromDate).format("YYYY-MMM-DD"),
            "toDate": moment(values?.toDate).format("YYYY-MMM-DD"),
            "createdBy": String(values?.createdBy?.value || ""),
            "verifyBy": String(values?.verifyBy?.value || ""),
            "authBy": String(values?.authBy?.value || ""),
            "deparmentCode": String(values?.department?.value || ""),
            "specificAmount": Number(values?.amount || 0),
            "amountCategory": String(values?.symbol?.value || ""),
            "auditStatus": Number(values?.auditStatus?.value || ""),
            "branchCentreID": String(centreID),
        }

        try {

            const response = await FinanceBindAuditBackendData(payload)
            if (response?.success) {
                setViewData(response?.data)
            }
            else {
                setTableValues([])

            }
        } catch (error) {
            console.log("error", error)
        }
    };


    const handleReactChange = (name, e, key) => {
        setValues((val) => ({ ...val, [name]: e }));

    };

    useEffect(() => {

        if (values?.auditStatus?.value)
            handleSearch(false)
    }, [values?.auditStatus, values?.status])

    const handleRowSelect = (val) => {
        setSelectedRows((prevSelectedRows) => {
            let updatedSelectedRows;

            if (prevSelectedRows.includes(val)) {
                updatedSelectedRows = prevSelectedRows.filter((item) => item !== val); // Remove value
            } else {
                updatedSelectedRows = [...prevSelectedRows, val]; // Add value
            }

            return updatedSelectedRows;
        });
    };

    // Handle "Select All" functionality
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allVoucherNos = tableVlues.map((val) => val); // Store all VoucherNos
            setSelectedRows(allVoucherNos);
        } else {
            setSelectedRows([]);
        }
    };

    const selectAllRef = useRef(null);
    const areAllSelected = selectedRows?.length === tableVlues?.length && tableVlues?.length > 0;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = selectedRows.length > 0 && selectedRows.length < tableVlues.length;
        }
    }, [selectedRows, tableVlues?.length]);


    const bindListData = async () => {
        let apiResp = await BindVoucherBillingScreenControls(1);
        if (apiResp?.success) {
            const department = filterByTypes(
                apiResp?.data,
                [2],
                ["TypeID"],
                "TextField",
                "ValueField",
                "TypeCode"
            );
            const country = filterByTypes(
                apiResp?.data,
                [4],
                ["TypeID"],
                "TextField",
                "ValueField",
                "TypeCode"
            );
            const project = filterByTypes(
                apiResp?.data,
                [3],
                ["TypeID"],
                "TextField",
                "ValueField",
                "TypeCode"
            );
            const employee = filterByTypes(
                apiResp?.data,
                [11],
                ["TypeID"],
                "TextField",
                "ValueField",
                "Type"
            );

            const AccountName = filterByTypes(
                apiResp?.data,
                [5],
                ["TypeID"],
                "TextField",
                "ValueField",
                "Type"
            )
            const VoucherType = filterByTypes(
                apiResp?.data,
                [1],
                ["TypeID"],
                "TextField",
                "ValueField",
                "Type"
            )

            if (project?.length === 1) {
                setValues((val) => ({
                    ...val,
                    ProjectName: { value: project[0]["value"] },
                }));
            }
            if (country?.length > 0) {
                console.log("project", country);
                setSelectedCurrency(country[0]["value"]);
                setValues((val) => ({
                    ...val,
                    currency: { value: country[0]["extraColomn"] },
                }));
            }
            setDropDownState((val) => ({
                ...val,
                currency: country,

                employee: employee,
                accountName: AccountName,
                department: department,
                projectName: project,
                VoucherType: VoucherType,
            }));
        }
    };


    useEffect(() => {
        bindListData();
    }, []);
    const isMobile = window.innerWidth <= 800;

    const thead = [
        { name: t("S.No."), width: "1%" },
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
        { name: t("Voucher No."), width: "5%" },
        { name: t("Voucher Date"), width: "5%" },
        { name: t("Audit Remark"), width: "10%" },
    ];
    const thead2 = [
        { name: t("S.No."), width: "4px" },

        { name: t("Branch Centre"), width: "2%" },
        { name: t("Account Name"), width: "5%" },

        { name: t("Amount"), width: "3%" },
        { name: t("Amount(L)"), width: "10%" },
        { name: t("Type"), width: "10%" },
        { name: t("Curr."), width: "10%" },
        { name: t("C.F."), width: "10%" },
        { name: t("Narration"), width: "10%" },
        { name: t("Ref.No."), width: "10%" },
        { name: t("Ref.Date"), width: "10%" },

    ];
    return (
        <>
            <div className="card border">
                <Heading title={t("Voucher Posting Batch")} isBreadcrumb={false} />
                <div className="row p-2">
                    <MultiSelectComp

                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        name="BranchCentre"
                        id="BranchCentre"
                        placeholderName={t("Branch Centre")}
                        dynamicOptions={GetEmployeeWiseCenter?.map((ele) => ({
                            code: ele?.CentreID,
                            name: ele?.CentreName,
                        }))}
                        handleChange={handleMultiSelectChange}
                        value={values?.BranchCentre}
                        requiredClassName={`required-fields`}
                    />
                    <ReactSelect
                        placeholderName={t("Currency")}
                        id={"currency"}
                        searchable={true}
                        name={"currency"}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={DropDownState?.currency}
                        handleChange={(val, e) =>
                            handleInputChangeCurrency(val, e, "currency")
                        }

                        value={
                            SelectedCurrency ? SelectedCurrency : values?.currency?.value
                        }
                        removeIsClearable={false}
                        requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("Voucher Type")}
                        id={"voucherType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"

                        dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.VoucherType]}
                        requiredClassName="required-fields"
                        name="voucherType"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.voucherType?.value}
                    />
                    <ReactSelect
                        placeholderName={t("Filter Type")}
                        id={"filterType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        dynamicOptions={[{ label: "Voucher Date", value: "1" }, { label: "Posting Date", value: "2" }]}

                        name="filterType"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.filterType?.value}
                    />
                    <DatePicker
                        className="custom-calendar"
                        id="From Data"
                        name="fromDate"
                        lable={t("From Date")}
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
                        id="toDate"
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
                    <ReactSelect
                        placeholderName={t("Created By")}
                        id={"createdBy"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.employee]}
                        name="createdBy"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.createdBy?.value}
                    />
                    <ReactSelect
                        placeholderName={t("Verify By")}
                        id={"verifyBy"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.employee]}
                        name="verifyBy"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.verifyBy?.value}
                    />
                    <ReactSelect
                        placeholderName={t("Auth By")}
                        id={"authBy"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.employee]}
                        name="authBy"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.authBy?.value}
                    />
                    <ReactSelect
                        placeholderName={t("Department")}
                        id={"department"}
                        searchable={true}
                        name="department"
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.department]}
                        requiredClassName="required-fields"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.department?.value}
                    />
                    <ReactSelect
                        placeholderName={t("Project Name")}
                        id={"ProjectName"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.projectName]}
                        name="projectName"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.projectName?.value}
                        requiredClassName="required-fields"
                    />


                    <ReactSelect
                        placeholderName={t("Account Name")}
                        id={"accountName"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.accountName]}
                        name="accountName"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.accountName?.value}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        lable={t("Amount")}
                        placeholder=" "
                        id="amount"
                        name="amount"
                        value={values?.amount}
                        onChange={handleChange}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        onKeyDown={Tabfunctionality}
                    />
                    <ReactSelect
 placeholderName={t("")}
                        id={"symbol"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"

                        dynamicOptions={[
                            {
                                value: 3,
                                label: ">=",
                            },
                            {
                                value: 1,
                                label: "<=",
                            },
                            {
                                value: 2,
                                label: "=",
                            },
                        ]}
                        name="symbol"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.symbol?.value || "1"}
                    />
                    <ReactSelect
                        placeholderName={t("Audit Status")}
                        id={"auditStatus"}
                        searchable={true}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"

                        dynamicOptions={[
                            {
                                value: "0",
                                label: "Audit Not Done",
                            },
                            {
                                value: "1",
                                label: "Audit Done",
                            },
                            {
                                value: "2",
                                label: "Further Query",
                            },
                        ]}
                        name="auditStatus"
                        handleChange={(name, e) => handleReactChange(name, e)}
                        value={values?.auditStatus?.value}
                    />

                    <button
                        className="btn btn-sm btn-success mx-1"
                        onClick={() => handleSearch("")}
                    >
                        {t("Search")}
                    </button>
                </div>
            </div>
            {
                tableVlues?.length > 0 &&
                <div className="mt-2 spatient_registration_card">
                    <div className="patient_registration card row">

                        <div className="row p-2 g-2">

                            <div className="col-md-4 col-12 border">
                                <Heading
                                    isBreadcrumb={false}
                                    title={t("Voucher List")}
                                    secondTitle={t(`Total Voucher's : ${tableVlues?.length || "0"}`)}

                                />

                                <Tables
                                    style={{ maxHeight: "45vh" }}
                                    thead={thead}

                                    tbody={

                                        tableVlues?.map((val, index) => ({
                                            id: 1 + index,
                                            checkbox: (
                                                <input
                                                    type='checkbox'
                                                    style={{ marginRight: "20px" }}
                                                    checked={selectedRows.includes(val)}
                                                    onChange={() => handleRowSelect(val)}
                                                />
                                            ),
                                            voucherNo: <span style={{ color: "blue" }} onClick={() => handleView(val?.VoucherNo)}>{val?.VoucherNo}</span>,
                                            voucherDate: val?.VoucherDate,

                                            AuditRemark: (
                                                <Input
                                                    type="text"
                                                    className="table-input"
                                                    name="narration" // Unique name
                                                    value={val?.narration} // Default empty string agar value na ho
                                                    removeFormGroupClass={true}
                                                    respclass="mt-1"
                                                    onChange={(e) => handleCustomInput(index, "narration", e.target.value)}
                                                />
                                            ),

                                        }))}

                                />
                                <div className=" row p-2">
                                    <button
                                        className="btn btn-sm btn-success mx-1"
                                        onClick={() => handleAudit("")}
                                    >
                                        {t("Audit Done")}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-success mx-1"
                                        // onClick={() => handleSearch("")}
                                        onClick={() => handleFurtherQuery("")}
                                    >
                                        {t("Further Query")}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-8 col-12 border ">
                                <Heading
                                    isBreadcrumb={false}
                                    title={t("Voucher Detail`s")} />

                                <Tables
                                    style={{ maxHeight: "45vh" }}
                                    thead={thead2}
                                    tbody={viewData?.map((val, index) => ({
                                        id: 1 + index,
                                        Branch: val?.BranchCentreName,
                                        Account: val?.AccountName,
                                        Amount: val?.AmountBase,
                                        Amountl: val?.AmountSpecific,
                                        Type: val?.BalType,
                                        Curr: val?.CurrencyCode,
                                        cf: val?.TransCurrFactor,
                                        Narration: val?.Remarks,
                                        Refno: val?.RefNo,
                                        Refdate: val?.RefDate,
                                    }))}

                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    );
};

export default Audit;
