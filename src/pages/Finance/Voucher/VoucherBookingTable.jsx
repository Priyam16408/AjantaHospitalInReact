import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import { filterByTypes, notify } from "../../../utils/utils";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import WrapTranslate from "../../../components/WrapTranslate";
import moment from "moment";
import { ROUNDOFF_VALUE } from "../../../utils/constant";
import Modal from "../../../components/modalComponent/Modal";
import CostCentreModal from "./CostCentreModal";
import AdvanaceMapModal from "./AdvanaceMapModal";

export default function VoucherBookingTable({ tbody, values, list, setOldBodyData }) {
    const [t] = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [modalData, setModalData] = useState({ visible: false });

    const [bodyData, setBodyData] = useState([])
    // const thead = [
    //     { name: "S.No.", width: "1%" },
    //     { name: "Chart Of Group", width: "9%" },
    //     { name: "A/C Name", width: "15%" },
    //     { name: "Branch Centre", width: "15%" },
    //     "Department",
    //     { name: "Amount", width: '5%' },
    //     { name: "Base Amt.", width: '5%' },

    //     "Bal. Type",
    //     { name: "Invoice No.", width: "8%" },
    //     { name: "Invoice Date", width: "9%" },
    //     { name: "Remarks", width: "10%" },
    //     { name: "CC", width: "1%" },
    // ]
    // if (values?.VoucherType?.value === "PB") {
    //     thead.splice(7, 0, "Tax Amt")
    //     thead.splice(13, 0, "Map Adv.")
    // }
    // if (["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value)) {
    //     thead.splice(8, 2, "Payment Mode", { name: "Ref No.", width: "8%" }, { name: "Ref Date", width: "9%" })
    //     thead.splice(12, 1)
    // }
    const thead = [
        { name: "S.No.", width: "1%" },
        { name: "Chart Of Group", width: "9%" },
        { name: "A/C Name", width: "15%" },
        { name: "Branch Centre", width: "15%" },
        "Department",
        { name: "Amount", width: "5%" },
        { name: "Base Amt.", width: "5%" },
        "Bal. Type",
        { name: "Invoice No.", width: "8%" },
        { name: "Invoice Date", width: "9%" },
        { name: "Remarks", width: "10%" },
        { name: "CC", width: "1%" },
    ];

    const voucherType = values?.VoucherType?.value;

    const modifications = {
        PB: [
            { index: 7, items: ["Tax Amt"] },
            { index: 13, items: ["Map Adv."] },
        ],
        PAYMENT_TYPES: [
            { index: 8, deleteCount: 2, items: ["Payment Mode", { name: "Ref No.", width: "8%" }, { name: "Ref Date", width: "9%" }] },
            { index: 12, deleteCount: 1 },
        ],
    };

    // Apply modifications based on Voucher Type
    if (modifications[voucherType]) {
        modifications[voucherType].forEach(({ index, deleteCount = 0, items = [] }) => {
            thead.splice(index, deleteCount, ...items);
        });
    }

    if (["BP", "CP", "BR", "CR", "CV", "BT"].includes(voucherType)) {
        modifications.PAYMENT_TYPES.forEach(({ index, deleteCount = 0, items = [] }) => {
            thead.splice(index, deleteCount, ...items);
        });
    }

    const handleAdjustMentDetail = (data, detail) => {
        let calAmount = { Cr: 0, Dr: 0 }
        if (detail?.isAccountType) {
            data.map((val, ind) => {
                if (!val?.isAccountType) {
                    calAmount[val?.balanceType?.value] += val?.Amount ? Number(val?.Amount) : 0
                }
            })
        }
        if (detail?.balanceType?.value === "Cr") {
            if (calAmount?.Dr - calAmount?.Cr >= 0) {
                data[0]["Amount"] = calAmount?.Dr - calAmount?.Cr
            } else {
                data[0]["Amount"] = 0
            }
        } else if (detail?.balanceType?.value === "Dr") {
            if (calAmount?.Cr - calAmount?.Dr >= 0) {
                data[0]["Amount"] = calAmount?.Cr - calAmount?.Dr
            } else {
                data[0]["Amount"] = 0
            }
        }
        setOldBodyData(data);
    }


    const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
        // debugger
        // debugger
        // console.log("index, name, value, type, max",index, name, value, type, max)
        if (type === "number") {
            if (!isNaN(value) && Number(value) <= max) {
                const data = JSON.parse(JSON.stringify(tbody));
                data[index][name] = value;
                let detail = data[0]
                if (detail?.isAccountType) {
                    handleAdjustMentDetail(data, detail)
                } else {
                    setOldBodyData(data);
                }
            }
        } else if (value?.length <= max || typeof (value) === "object") {
            const data = JSON.parse(JSON.stringify(tbody));
            let detail = data[0];
            data[index][name] = value;

            if (detail?.isAccountType && name === "balanceType") {
                handleAdjustMentDetail(data, detail)
            } else {
                setOldBodyData(data);
            }
        }
    };

    const handleCloseModal = (ele, data) => {
        if (data?.RemAmt === 0) {
            setModalData((val) => ({ ...val, visible: false }));
        } else {
            notify("Cost Centre Bifurcation Total should be equal to Cost Centre Amount", "error")
        }
    }
    const handleOpenCostCentre = (data, index) => {
        if (!data?.Department?.value) {
            notify("Please Select Department", "error")
            return 0
        } else if (!data?.Amount) {
            notify("Amount Field Is Required", "error")
            return 0
        }
        setModalData({
            visible: true,
            width: "60vw",
            label: t("Cost Centre"),
            handleCloseModal: handleCloseModal,
            buttonName: "Save",
            CallAPI: () => { },
            modalData: {},
            footer: <></>,
            Component: <CostCentreModal setModalData={setModalData} inputs={{ ...data, index: index }} setOldBodyData={setOldBodyData} tbody={tbody} list={list} />,
        });
    }
    const handleOpenAdvance = (data, index) => {
        if (!data?.Department?.value) {
            notify("Please Select Department", "error")
            return 0
        } 
        setModalData({
            visible: true,
            width: "60vw",
            label: t("Map Advance"),
            handleCloseModal: handleCloseModal,
            buttonName: "Save",
            CallAPI: () => { },
            modalData: {},
            footer: <></>,
            Component: <AdvanaceMapModal setModalData={setModalData} inputs={{ ...data, index: index }} setOldBodyData={setOldBodyData} tbody={tbody} list={list} />,
        });
    }

    const handleBodyData = (ele, index) => {
        let obj = {}

        obj.SrNo = index + 1
        obj.ChartOfGroup = <div style={{ whiteSpace: "normal" }}>{ele?.GroupName}</div>
        obj.AccountName = <div style={{ whiteSpace: "normal" }}>{ele?.AccountName}</div>
        obj.branchCentre = <div style={{ whiteSpace: "normal", width: "100%" }}><CustomSelect
            placeHolder={t("BRANCH CENTRE")}
            name="branchCentre"
            onChange={(name, e) => { handleCustomInput(index, "branchCentre", e) }}
            isRemoveSearchable={true}
            value={ele?.branchCentre?.value}
            option={filterByTypes(list, [14], ["TypeID"], "TextField", "ValueField")}
        /></div>
        obj.Department = <div style={{ whiteSpace: "normal", width: "100%" }}> <CustomSelect
            placeHolder={t("Department")}
            requiredClassName={"required-fields"}
            name="Department"
            onChange={(name, e) => { handleCustomInput(index, "Department", e) }}
            isRemoveSearchable={true}
            value={ele?.Department?.value}
            option={filterByTypes(list, [2], ["TypeID"], "TextField", "ValueField")}
        /></div>
        obj.Amount = !ele?.isAccountType ? <Input
            type="text"
            className="table-input required-fields"
            respclass={"w-100"}
            removeFormGroupClass={true}
            display={"right"}
            disabled={ele?.isAccountType ? true : false}
            name={"Amount"}
            value={ele?.Amount ? ele?.Amount : ""}
            onChange={(e) => { handleCustomInput(index, "Amount", e.target.value, "number", 1000000000) }}
        /> : <span className="text-right mt-2">{ele?.Amount ? ele?.Amount : "0.00"}</span>
        obj.locals = (values?.ConversionFactor * ele?.Amount) > 0 ? (values?.ConversionFactor * ele?.Amount).toFixed(ROUNDOFF_VALUE) : "0.00"
        if (values?.VoucherType?.value === "PB") {
            obj.TaxAmount = <Input
                type="number"
                className="table-input"
                respclass={"w-100"}
                removeFormGroupClass={true}
                display={"right"}
                name={"TaxAmount"}
                value={ele?.TaxAmount ? ele?.TaxAmount : ""}
                onChange={(e) => { handleCustomInput(index, "TaxAmount", e.target.value, "number", 1000000000) }}
            />
        }
        obj.balanceType = !ele?.isAccountType ? <CustomSelect
            placeHolder={t("Bal. Type")}
            name="balanceType"
            isDisable={ele?.isAccountType ? true : false}
            onChange={(name, e) => { handleCustomInput(index, "balanceType", e) }}
            isRemoveSearchable={true}
            value={ele?.balanceType?.value}
            option={[{ label: "Cr", value: "Cr" }, { label: "Dr", value: "Dr" }]}
        /> : <span>{ele?.balanceType?.value}</span>

        if (["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value)) {
            obj.PaymentMode = <CustomSelect
                placeHolder={t("Payment Mode")}
                requiredClassName={"required-fields"}
                name="PaymentMode"
                onChange={(name, e) => { handleCustomInput(index, "PaymentMode", e) }}
                isRemoveSearchable={true}
                value={ele?.PaymentMode?.value}
                option={filterByTypes(list, [10], ["TypeID"], "TextField", "ValueField")}
            />
            obj.Refnumber = <Input
                type="text"
                className="table-input required-fields"
                removeFormGroupClass={true}
                // display={"right"}
                respclass="w-100"
                name={"Refnumber"}
                value={ele?.Refnumber ? ele?.Refnumber : ""}
                onChange={(e) => { handleCustomInput(index, "Refnumber", e.target.value, "text", 100) }}
            />
            obj.RefDate = <DatePicker
                className="custom-calendar-table"
                id="RefDate"
                respclass="w-100"
                name="RefDate"
                inputClassName={"required-fields"}
                value={ele?.RefDate ? moment(ele?.RefDate).toDate() : new Date()}
                maxDate={new Date()}
                handleChange={(e) => handleCustomInput(index, "RefDate", e.target.value)}
                placeholder={VITE_DATE_FORMAT}
            />
        } else {
            obj.InvoiceNumber = <Input
                type="text"
                className="table-input required-fields"
                removeFormGroupClass={true}
                // display={"right"}
                respclass="w-100"
                name={"InvoiceNumber"}
                value={ele?.InvoiceNumber ? ele?.InvoiceNumber : ""}
                onChange={(e) => { handleCustomInput(index, "InvoiceNumber", e.target.value, "text", 100) }}
            />
            obj.InvoiceDate = <DatePicker
                className="custom-calendar-table"
                inputClassName={"required-fields"}
                id="InvoiceDate"
                respclass="w-100"
                name="InvoiceDate"
                value={ele?.InvoiceDate ? moment(ele?.InvoiceDate).toDate() : new Date()}
                maxDate={new Date()}
                handleChange={(e) => handleCustomInput(index, "InvoiceDate", e.target.value)}
                placeholder={VITE_DATE_FORMAT}
            />
        }

        obj.Remark = <Input
            type="text"
            className="table-input required-fields"
            removeFormGroupClass={true}
            respclass="w-100"
            name={"Remark"}
            value={ele?.Remark ? ele?.Remark : ""}
            onChange={(e) => { handleCustomInput(index, "Remark", e.target.value) }}
        />
        if (!["BP", "CP", "BR", "CR", "CV", "BT"].includes(values?.VoucherType?.value)) {
            obj.CostCentre = !ele?.isAccountType ? <button className="btn btn-sm btn-primary px-2 table-btn w-100" onClick={() => { handleOpenCostCentre(ele, index) }}>{t("cc")}</button> : ""
        }
        if (values?.VoucherType?.value === "PB") {
            obj.MapADV = ele?.isAccountType ? <button className="btn btn-sm btn-primary px-2 table-btn w-100" onClick={()=>{handleOpenAdvance(ele,index)}}>{t("Adv.")}</button> : ""
        }
        return obj

    }
    useEffect(() => {
        let data = []
        tbody?.map((ele, index) => {
            data.push(handleBodyData(ele, index))
        }
        )
        setBodyData(data)
    }, [tbody, values?.ConversionFactor])


    return (
        <>
            <Tables
                thead={WrapTranslate(thead, "name")}
                tbody={bodyData}
            />
            {modalData?.visible && (
                <Modal
                    visible={modalData?.visible}
                    setVisible={(ele, data) => {
                        modalData?.handleCloseModal(ele, data)
                    }}
                    modalData={modalData?.modalData}
                    modalWidth={modalData?.width}
                    Header={modalData?.label}
                    buttonType="button"
                    buttonName={modalData?.buttonName}
                    footer={modalData?.footer}
                    handleAPI={modalData?.CallAPI}
                >
                    {modalData?.Component}
                </Modal>
            )}
        </>
    )

}