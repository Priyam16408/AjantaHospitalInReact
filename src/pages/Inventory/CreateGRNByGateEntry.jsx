import React, { useState } from 'react'
import Heading from '../../components/UI/Heading';
import ReactSelect from '../../components/formComponent/ReactSelect';
import DatePicker from '../../components/formComponent/DatePicker';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Input from "../../components/formComponent/Input";
import { GateEntryGRNPost, GateEntryGRNUnPost, GateEntryPostToGRN, GateEntryReport, GateEntryViewDetailGRNItem, SearchGateEntryItem } from '../../networkServices/InventoryApi';
import { notify } from '../../utils/ustil2';
import Tables from '../../components/UI/customTable';
import { RedirectURL } from '../../networkServices/PDFURL';



const CreateGRNByGateEntry = () => {

    const [tableData, setTableData] = useState([]);
    const [tableData2, setTableData2] = useState([]);
    const [payload, setPayload] = useState(
        {
            "gateNo": "",
            "fromDate": new Date(),
            "toDate": new Date(),
            "storeType": ""
        }
    );
    const [t] = useTranslation();

    const THEAD1 = [
        t("S.No"),
        t("Gate Entry No"),
        t("GRN No."),
        t("GRN Amount"),
        t("Gross Amount"),
        t("Invoice"),
        t("Post to GRN"),
        t("Action"),
        t("View"),
        t("Re-Print")
    ]
    const THEAD2 = [
        t("S.No"),
        t("GRN No."),
        t("Item Name"),
        t("Item Id"),
        t("Quantity"),
        t("Rate"),
        t("Net Amtount")
    ]

    const handlePostToGRN = async (val) => {    

        try {
            let newPayload = {
                "gateNo": val?.GateNo
            }
            const response = await GateEntryPostToGRN(newPayload);

            if (response?.success) {
                notify(response?.message, "success");
                handleSearch();
            }
            else {
                notify(response?.message, "error");
            }
            
        } catch (error) {
            console.log("error", error);
            
        }
    }

    const viewDetails = async (val) => {

        try {
            // debugger
            const response = await GateEntryViewDetailGRNItem(val);

            if (response?.success) {
                setTableData2(response?.data);
                // notify(response?.message, "success");
            }
            else {
                notify(response?.message, "error");
            }


        } catch (error) {
            console.log("error", error);

        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        // 
        setPayload(
            (prev) => ({
                ...prev,
                [name]: value,
            })
        );
    }

    const handleReactSelect = (name, e) => {

        // 
        setPayload({ ...payload, [name]: e?.value });
    };

    const handleSearch = async () => {

        try {
            // 
            let newPayload = {
                "gateNo": payload?.gateNo,
                "storeType": payload?.storeType,
                "fromDate": moment(payload.fromDate).format("YYYY-MM-DD"),
                "toDate": moment(payload.toDate).format("YYYY-MM-DD"),
            }

            const response = await SearchGateEntryItem(newPayload);

            if (response?.success && response?.data.length > 0) {
                setTableData(response?.data);
                // notify(response?.message, "success");
            } else {
                setTableData([])
                notify(response?.message, "error");
            }

        } catch (error) {
            console.log("error", error);

        }
    }

    const handleGRNPost = async (val) => {
        try {

            let newPayload = {
                "gateNo": val?.GateNo
            }
            const response = await GateEntryGRNPost(newPayload);

            if (response?.success) {
                notify(response?.message, "success");
                handleSearch();
            }

        } catch (error) {
            console.log("error", error);

        }
    }
    const handleGRNunPost = async (val) => {
        try {
            let newPayload = {
                "gateNo": val?.GateNo
            }
            const response = await GateEntryGRNUnPost(newPayload);

            if (response?.success) {
                notify(response?.message, "success");
                handleSearch();
            }

        } catch (error) {
            console.log("error", error);

        }
    }
    const Reprint = async (GateNO) => {
        const newPayload = {
            gateNo: GateNO,
        };
        try {

            const response = await GateEntryReport(newPayload);
            if (response?.success) {
                RedirectURL(response?.data?.pdfUrl)
                notify(response?.message, "success");
            }
            // console.log("Response",response);
        } catch (error) {
            console.error("Something went wrong", error);
            setValues((val) => ({ ...val, GRNItemListdata: [] }));
        }
    };





    return (
        <div>
            <div className="card mt-2">
                <Heading title={"Create GRN By Gate Entry"} isBreadcrumb={true} />
            </div>
            <div className="card patient_registration border">
                <div className="row p-2">
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Gate Entry No.")}
                        placeholder=" "
                        id="gateNo"
                        name="gateNo"
                        value={payload?.gateNo}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        onChange={handleChange}
                        // onKeyDown={Tabfunctionality}
                        requiredClassName="required-fields"
                    />
                    <ReactSelect
                        placeholderName={t("Store Type")}
                        id={"storeType"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        dynamicOptions={[
                            { label: " Medical Store", value: "STO00001" },
                            { label: "General Store", value: "STO00002" },
                        ]}
                        name="storeType"
                        handleChange={handleReactSelect}

                        requiredClassName="required-fields"
                        value={payload?.storeType}
                    />
                    <DatePicker
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        id="fromDate"
                        className="custom-calendar"
                        name="fromDate"
                        lable={t("From Date")}
                        handleChange={(date) => handleChange(date)}
                        value={payload?.fromDate}
                    />
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        id="toDate"
                        name="toDate"
                        lable={("To Date")}
                        handleChange={(date) => handleChange(date)}
                        value={payload?.toDate}
                    />
                    <button className="btn btn-primary "
                        onClick={handleSearch}
                    >
                        {t("Search")}
                    </button>
                </div>
                <div className="table-responsive ">
                    {/* {console.log("values?.itemsvalues?.items", values?.items)} */}
                    <Tables
                        thead={THEAD1}
                        tbody={tableData?.map((ele, index) => ({
                            sno: index + 1,
                            GateNo: ele?.GateEntryNo,
                            GRNno: ele?.GRNno,
                            GrnAmt: ele?.GrnAmt,
                            GrossAmount: ele?.GrossAmount,
                            InvoiceNo: ele?.InvoiceNo,
                            postToGrn: <button className="btn btn-primary btn-sm mx-1 px-2"
                                onClick={() => handlePostToGRN(ele)}
                                disabled={ele?.GRNno ? true : false}
                                
                            >
                                {t("Post to GRN")}
                            </button>,
                            post: (
                                ele?.IsPost === 0 ? <button className="btn btn-primary btn-sm mx-1 px-2"
                                    onClick={() => handleGRNPost(ele)}
                                >
                                    {t("Post")}
                                </button>
                                    :
                                    <button className="btn btn-primary btn-sm mx-1 px-2"

                                        onClick={() => handleGRNunPost(ele)}
                                    >
                                        {t("UNPost")}
                                    </button>

                            ),
                            view: <i
                                className="fa fa-eye"
                                aria-hidden="true"
                                onClick={() => viewDetails(ele?.GateNo)}
                            ></i>,
                            "Re-Print": (
                                <i
                                    className="fa fa-print"
                                    aria-hidden="true"
                                    onClick={() => Reprint(ele?.GateNo)}
                                ></i>
                            ),

                        }))}
                        tableHeight="tableHeight"
                        style={{ maxHeight: "auto" }}
                    />
                </div>

            </div>

            <div className="card patient_registration mt-4  ">
                <div className="table-responsive ">
                    <Tables
                        thead={THEAD2}
                        tbody={tableData2?.map((ele, index) => ({
                            sno: index + 1,
                            GRNno: ele?.BillNo,
                            ItemName: ele?.ItemName,
                            ItemID: ele?.ItemID,
                            Quantity: ele?.Quantity,
                            Rate: ele?.Rate,
                            NetItemAmt: ele?.NetItemAmt,
                        }))}
                        tableHeight="tableHeight"
                        style={{ maxHeight: "auto" }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CreateGRNByGateEntry;