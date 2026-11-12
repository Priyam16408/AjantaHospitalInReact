import React, { useEffect, useState } from "react";
import DatePicker from "../../../components/formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import moment from "moment/moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { BindConsignmentVendorList, ConsignmentReturnPrint, ConsignmentReturnSearchList, SaveConsignmentItemReturnList } from "../../../networkServices/InventoryApi";
import { Table } from "react-bootstrap";
import ConsignmentReturnTable from "../../../components/UI/customTable/MedicalStore/ConsignmentReturnTable";
import { notify } from "../../../utils/utils";
import { RedirectURL } from "../../../networkServices/PDFURL";

const ConsignmentReturn = () => {
    const location = useLocation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const localData = useLocalStorage("userData", "get");
    // const dispatch = useDispatch();
    const [t] = useTranslation();

    const initialValues = {
        ExpiryFrom: new Date(),
        ExpiryTo: new Date(),
        VendorName: { value: "", label: "" },
    };
    const [values, setValues] = useState({ ...initialValues });
    const [DropDownState, setDropDownState] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [list, setList] = useState([]);


    useEffect(() => {
        fetchVendorList();
    }, [])
    const fetchVendorList = async () => {
        try {
            const response = await BindConsignmentVendorList();
            if (response?.success && response?.data) {
                const formattedData = response.data.map((item) => ({
                    value: item.LedgerNumber,
                    label: item.LedgerName,
                }));

                setDropDownState(formattedData);
                if (formattedData.length > 0) {
                    setValues((prev) => ({
                        ...prev,
                        VendorName: {
                            value: formattedData[0].value,
                            label: formattedData[0].label
                        },
                    }));
                } else {
                    setValues((prev) => ({
                        ...prev,
                        VendorName: { value: "", label: "" },
                    }));
                }

            }
        } catch (error) {
            console.error("Error fetching vendor list: ", error);
        }
    };

    const handleReactSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setValues((val) => ({ ...val, [name]: value }));

    };
    const handleSearch = async () => {
        console.log("Searching for:", { AllDataList: values });
        const payload = {
            vendorID: values?.VendorName?.value,
            fromDate: moment(values.ExpiryFrom, "YYYY-MM-DD").format("DD-MMM-YYYY"),
            toDate: moment(values.ExpiryTo, "YYYY-MM-DD").format("DD-MMM-YYYY")
        };
        try {
            const response = await ConsignmentReturnSearchList(payload);
            if (response?.success === "success") {
                notify(response?.message, "success");
                console.log("DataList for:", response.data);
                setTableData(response.data);
            }else{
                notify(response?.message, "error");
            }
        }
        catch (error) {
            console.error("Something went wrong", error);
        }
    };
    const THEAD = [
        { name: "S.No.", width: "1%" },
        { name: "Select", width: "1%" },
        "Consign No",
        "Consign Date",
        "Expiry Date",
        "ItemName",
        "Open Qty",
        "Issued Qty",
        "Returned Qty",
        "Balance Qty",
        "Return Qty",
        "Reason",
        "GetPassNO"
    ];
    const handleChangeindex = (e, index) => {
        const { value } = e.target;
        // debugger;
        const updatedValue =
            value > tableData[index].BalanceQty ? tableData[index].BalanceQty : value;
        setTableData((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, ReturnQty: updatedValue } : item
            )
        );
    };
    const handleChangeindexString = (e, index, name) => {
        const { value } = e.target;

        setTableData((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const handleChangeCheckbox = (e, ele, index) => {
        let data = tableData.map((val, i) => {
            // debugger;
            if (i === index) {
                val.isChecked = e?.target?.checked;
                val.IssueQty = "0.0"
            }
            return val;
        });
        setTableData(data);
        // if (!e?.target?.checked) {
        //     AddRowData(data);
        // }
    };
    const SaveAddRowData = async () => {
        // debugger;
        // const checkedRows = JSON.parse(JSON.stringify(tableData)).filter((row) => row.isChecked === true && parseInt(row?.ReturnQty) > 0);
        //    const invalidRows = JSON.parse(JSON.stringify(tableData)).filter((row) => row.isChecked === true && parseInt(row?.ReturnQty) < 0);
        //     if (invalidRows.length > 0 ||invalidRows.length == 0)  {
        //         notify("Return Quantity cannot be less than 0.","error");
        //     }
        const invalidRows = JSON.parse(JSON.stringify(tableData)).filter((row) => {
            const returnQty = parseInt(row?.ReturnQty);

            // Check for invalid conditions: ReturnQty is undefined, NaN, or less than 0
            return row.isChecked === true && (isNaN(returnQty) || returnQty < 0);
        });
        if (invalidRows.length > 0) {
            notify("Return Quantity cannot be undefined or less than 0.", "error");
        }
        else {
            const checkedRows = JSON.parse(JSON.stringify(tableData)).filter((row) => row.isChecked === true && parseInt(row?.ReturnQty) > 0);

            setList(checkedRows);
            const payload = {
                itemsList: checkedRows.map(item => ({
                    gatePassno: item.GetPassNO || "",
                    Reason: item.Reason || "",
                    ID: item.ID,
                    BatchNumber: item.BatchNumber || "",
                    UnitPrice: item.UnitPrice,
                    Rate: item.Rate,
                    MRP: item.MRP,
                    ItemID: item.ItemID,
                    VendorLedgerNo: item.VendorLedgerNo,
                    returnQuantity: item.ReturnQty,
                    ConsignmentNo: item.ConsignmentNo,
                    availQty: item.BalanceQty,
                }))
            };
            try {
                const response = await SaveConsignmentItemReturnList(payload);
                if (response?.success) {
                    if (response.data != []) {
                        const payload1 = {
                            ReturnID: response.data,
                        }
                        const response1 = await ConsignmentReturnPrint(payload1);
                        if (response1?.success) {
                            RedirectURL(response1?.data?.pdfUrl);
                        }
                    }
                    notify(response.message, "success");
                    setTableData([]);
                }
            } catch (error) {
                notify("Error fetching item names: ", "error");
            }
        }
    };
    return (
        <>
            <div className="card patient_registration border">
                <Heading title={"Admitted Patients"} isBreadcrumb={true} />

                <div className="row p-2">
                    <ReactSelect
                        placeholderName={t("Vendor Name")}
                        id={"VendorName"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        dynamicOptions={DropDownState}
                        name="VendorName"
                        handleChange={handleReactSelect}
                        value={values?.VendorName?.value}
                        requiredClassName="required-fields"
                    />
                    <DatePicker
                        className={`custom-calendar required-fields`}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="ExpiryFrom"
                        name="ExpiryFrom"
                        value={
                            values.ExpiryFrom
                                ? moment(values?.ExpiryFrom, "YYYY-MM-DD").toDate()
                                : null
                        }
                        lable={t("Expiry From")}
                        handleChange={handleChange}

                        placeholder={VITE_DATE_FORMAT}
                    />
                    <DatePicker
                        className={`custom-calendar required-fields`}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="ExpiryTo"
                        name="ExpiryTo"
                        value={
                            values.ExpiryTo
                                ? moment(values?.ExpiryTo, "YYYY-MM-DD").toDate()
                                : null
                        }
                        lable={t("Expiry To")}
                        handleChange={handleChange}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <div className="col-sm-1 ">
                        <button className="btn btn-sm btn-success" onClick={handleSearch}
                        > {t("Search")}</button>
                    </div>
                </div>
                {tableData.length > 0 ? <div className="card">
                    <ConsignmentReturnTable
                        thead={THEAD}
                        tbody={tableData}
                        handleChangeindex={handleChangeindex}
                        handleChangeCheckbox={handleChangeCheckbox}
                        handleChangeindexString={handleChangeindexString}
                    />
                    <div className="col-12  text-right" style={{ padding: "4px 8px 9px 2px" }}>
                        <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields" type="button" onClick={() => { SaveAddRowData() }}
                        >
                            {t("EmergencyModule.Save")}
                        </button>
                    </div>
                </div> : <></>}

            </div>
        </>
    );



};

export default ConsignmentReturn;