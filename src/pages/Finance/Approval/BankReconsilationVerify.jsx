import React, { useEffect, useState, useRef } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import DatePicker from '../../../components/formComponent/DatePicker';
import { handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import LabeledInput from '../../../components/formComponent/LabeledInput';
import { PurchaGetBindAllCenter } from '../../../networkServices/Purchase';
import { BindReconciliationBank, BindReconciliationVerifyDetails, SearchReconcileDetails } from '../../../networkServices/finance';
import moment from 'moment';
import Tables from '../../../components/UI/customTable';
import Modal from '../../../components/modalComponent/Modal';
import Input from '../../../components/formComponent/Input';
const BankReconsilationVerify = () => {
    const { t } = useTranslation();
    const handleReactChange = (name, e, key) => {
        setPayload((val) => ({ ...val, [name]: e }));
    };
    const handleChange = (e) => {
        setPayload((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    const [dropDownState, setDropDownState] = useState({
        GetBindAllCenter: [],
        BindBank: [],
        BindStatus: [
            { label: "Pending", value: "0" },
            { label: "Verify", value: "1" },
            { label: "Authorized", value: "2" }
        ]
    });

    const [payload, setPayload] = useState({
        userType: { label: "Entry By", value: "1" },
        brvFromDate: new Date(),
        brvToDate: new Date(),
        allCenter: {
            CentreID: 1,
            CentreName: "MOHANDAI OSWAL HOSPITAL",
            IsDefault: 0,
            label: "MOHANDAI OSWAL HOSPITAL", value: 1
        },
        status: { label: "", value: "" },
        bank: { label: "", value: "" }
    });

    const [bindMapping, setBindMapping] = useState([])
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectItem, setSelectItem] = useState([]);
    const [modalState, setModalState] = useState({
        show: false,
        name: null,
        component: null,
        size: null,
        footer: null,
    });

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
    const getBindReconciliationBankApi = async () => {
        try {
            const GetBindBank = await BindReconciliationBank();

            setDropDownState((val) => ({
                ...val,
                BindBank: handleReactSelectDropDownOptions(
                    GetBindBank?.data,
                    "TextField",
                    "ValueField"
                )
            }))
        } catch (err) {
            console.log(err, "somthing get wronge");

        }
    }
    useEffect(() => {
        getPurchaGetBindAllCenterAPI()
        getBindReconciliationBankApi()
    }, [])
    const { VITE_DATE_FORMAT } = import.meta.env;
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
    // const [tableData, setTableData] = useState(
    //     bindMapping.map(item => ({
    //         ...item,
    //         remarks: "" // Add a field for remarks
    //     }))
    // );

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
            const allIndices = bindMapping.map((_, index) => index);
            setSelectedRows(allIndices);
        } else {
            setSelectedRows([]);
        }
    };
    const isMobile = window.innerWidth <= 800;
    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Cheque No."), width: "5%" },
        { name: t("Cheque Date."), width: "5%" },
        { name: t("Cheque Amount."), width: "5%" },
        { name: t("Cheque Status."), width: "5%" },
        { name: t("Voucher No."), width: "5%" },
        { name: t("Voucher Date."), width: "5%" },
        { name: t("Remarks."), width: "5%" },
        {
            name: isMobile ? (
                t("check")
            ) : (
                <input
                    type="checkbox"
                    style={{ marginRight: "20px" }}
                    // name="isAssetActive"
                    // id="isAssetActive"
                    // onChange={handleChange}
                    // checked={bindMapping?.isChecked}
                    ref={selectAllRef}
                    checked={areAllSelected}
                    onChange={handleSelectAll}
                />
            ),
            width: "1%",
        },
        { name: t("Details."), width: "5%" },
    ]
    const handleSearch = async () => {
        let data = {
            FromDate: moment(payload.brvFromDate).format("DD-MMM-YYYY") || "",
            ToDate: moment(payload.brvToDate).format("DD-MMM-YYYY") || "",
            BankCoaID: payload?.bank?.value?.toString() || "",
            Status: payload?.status?.value || "",
            CentreID: payload?.allCenter?.CentreID?.toString() || "",
        }
        if (!data.Status || !data.CentreID) {
            notify("Please fill in required fields", "error");
            return;
        }
        try {
            const apiRes = await BindReconciliationVerifyDetails(data);
            if (apiRes?.success) {
                // setBindMapping(apiRes.data)
                setBindMapping(apiRes.data.map(newItem => {
                    // const oldItem = tableData.find(item => item.PaymentModeID === newItem.PaymentModeID);
                    return {
                        ...newItem,
                        remarks: "" // Preserve remarks
                    };
                }));
                setSelectedRows([])
            } else {
                notify(apiRes?.message, "error")
                setBindMapping([])
            }
        } catch (error) {
            notify("An error occurred while fetching data", "error");
        }
        console.log(data);

    }

    const handleModalState = (show, name, component, size, footer) => {
        setModalState({
            show: show,
            name: name,
            component: component,
            size: size,
            footer: footer,
        })
    }
    const handleTableDetails = async (ele, i) => {
        try {

            let payload = ele.EntryDetailID
            const apiResmodel = await SearchReconcileDetails(payload)
            console.log(apiResmodel.data);
            if (apiResmodel.success) {
                handleModalState(
                    true,
                    "Details",
                    <>
                        <div className='row '>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Reconsiled By")} value={""} />
                            </div>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Reconsiled Date")} value={apiResmodel?.data[0].Reconciliationdate} />
                            </div>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Reconsiled Remarks")} value={apiResmodel?.data[0].ReconciliationRemark} />
                            </div>
                        </div>
                        <div className='row '>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Verified By")} value={apiResmodel?.data[0].ReonciliationVerifiedby} />
                            </div>

                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Verified Date")} value={apiResmodel?.data[0].ReonciliationVerifiedDateTime} />
                            </div>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Verified Remarks")} value={apiResmodel?.data[0].ReonciliationVerifiedRemarks} />
                            </div>
                        </div>
                        <div className='row '>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Auth By")} value={apiResmodel?.data[0].ReonciliationAuthby} />
                            </div>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Auth Date")} value={apiResmodel?.data[0].ReonciliationAuthDateTime} />
                            </div>
                            <div className="p-2 col-md-4 col-sm-6">
                                <LabeledInput label={t("Auth Remarks")} value={apiResmodel?.data[0].ReonciliationAuthRemarks} />
                            </div>

                        </div>
                    </>,
                    "80vw",
                    <>
                    </>
                )
            }
        } catch (error) {
            console.log(error, "Something went wrong");

        }

    }
    const handleInputChange = (e, index) => {
        // console.log(e.target.value);
        const newData = [...bindMapping];
        newData[index].remarks = e.target.value;
        setBindMapping(newData);
    }

    const handleSave = () => {
        const selectedData = bindMapping.filter((_, index) => selectedRows.includes(index));
        console.log("Saving Data:", selectedData);
    }
    return (
        <div className="mt-2 spatient_registration_card">
            <div className="patient_registration card">
                <Heading
                    title={t("Bank Reconsilation Verify")}
                    isBreadcrumb={false}
                />

                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Center To")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        id={"allCenter"}
                        name={"allCenter"}
                        removeIsClearable={true}
                        handleChange={(name, e) => handleReactChange(name, e)}
                        dynamicOptions={dropDownState?.GetBindAllCenter}
                        value={payload?.allCenter?.value}
                        requiredClassName={`required-fields`}
                    />
                    <DatePicker
                        className="custom-calendar"
                        placeholder={VITE_DATE_FORMAT}
                        lable={t("FromDate")}
                        respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                        name="brvFromDate"
                        maxDate={new Date()}
                        id="brvFromDate"
                        value={payload?.brvFromDate ? moment(payload.brvFromDate).toDate() : new Date}
                        showTime
                        hourFormat="12"
                        handleChange={handleChange}
                        inputClassName={"required-fields"}
                    />

                    <DatePicker
                        className="custom-calendar "
                        placeholder={VITE_DATE_FORMAT}
                        lable={t("ToDate")}
                        respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                        name="brvToDate"
                        id="brvToDate"
                        value={payload?.brvToDate ? moment(payload.brvToDate).toDate() : new Date}
                        maxDate={new Date()}
                        showTime
                        hourFormat="12"
                        handleChange={handleChange}
                        inputClassName={"required-fields"}
                    />
                    <ReactSelect
                        placeholderName={t("Status")}
                        searchable={true}
                        respclass="col-xl-1 col-md-4 col-sm-6 col-12"
                        id={"status"}
                        name={"status"}
                        removeIsClearable={true}
                        handleChange={(name, e) => handleReactChange(name, e)}
                        dynamicOptions={dropDownState?.BindStatus}
                        value={payload?.status?.value}
                        requiredClassName={`required-fields`}
                    />
                    <ReactSelect
                        placeholderName={t("Bank Name")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        requiredClassName="required-fields"
                        id={"bank"}
                        name={"bank"}
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
                        value={payload?.bank?.value}
                    />

                    <div className="col-xl-1 col-sm-6 col-md-4 col-12 mb-2 d-flex flex-wrap">
                        <LabeledInput className={"w-100 my-sm-0 my-1"} label={t("Currency")} value={"INR"} />
                    </div>


                    <div className="col-sm-1 col-2 mt-sm-0 mt-1">
                        <button
                            className="btn btn-sm btn-primary ml-sm-2 ml-0"
                            type="submit"
                            onClick={handleSearch}
                        >
                            {t("Search")}
                        </button>
                    </div>
                    <div className="col-sm-1 col-2 mt-sm-0 mt-1">
                        <button
                            className="btn btn-sm btn-primary ml-sm-2 mr-0"
                            type="submit"
                            onClick={handleSave}
                        >
                            {t("Save")}
                        </button>
                    </div>

                </div>
                <div className="m-2 d-flex justify-content-end">

                </div>
            </div>
            <div className="patient_registration">
                <div className="mt-2 spatient_registration_card">
                    <Tables
                        style={{ maxHeight: "45vh" }}
                        thead={thead}
                        tbody={bindMapping?.map((item, index) => ({
                            "S.No.": item?.PaymentModeID,
                            "Check No.": item?.ChequeNo,
                            "Cheque Date.": item?.ChequeDate,
                            "Cheque Amount.": item?.SpecificAmount,
                            "Cheque Status.": item?.cheque_status,
                            "Voucher No.": item?.VoucherNo,
                            "Voucher Date": item?.VoucherDate,
                            "Remarks": (
                                <Input
                                    type="text"
                                    className="table-input"
                                    removeFormGroupClass={true}
                                    // display={"right"}
                                    name="remarks"
                                    respclass=""
                                    value={item.remarks}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                            ),
                            "checkbox": (
                                <input
                                    type='checkbox'
                                    style={{ marginRight: "20px" }}
                                    checked={selectedRows.includes(index)}
                                    onChange={() => handleRowSelect(index)}
                                />
                            ),
                            "details": (
                                <button
                                    className='btn btn-sm btn-primary'
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleTableDetails(item, index)}
                                >Details
                                </button>
                            )

                        }))}
                    />
                </div>
            </div>

            <Modal
                Header={modalState?.name}
                modalWidth={modalState?.size}
                visible={modalState?.show}
                setVisible={() => {
                    handleModalState(false, null, null, null, <></>);
                }}
                footer={modalState?.footer}
            >
                {modalState?.component}
            </Modal>
        </div>
    )
}

export default BankReconsilationVerify;