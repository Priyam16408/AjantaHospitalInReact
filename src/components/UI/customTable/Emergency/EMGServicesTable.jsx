import React, { useEffect, useState } from "react";
import Tables from "../index";
import { useTranslation } from "react-i18next";
import { CancelSVG, TempRoomOut } from "../../../SvgIcons";
import Input from "../../../formComponent/Input";
import ReactSelect from "../../../formComponent/ReactSelect";
import CustomSelect from "../../../formComponent/CustomSelect";
import moment from "moment";
import { useSelector } from "react-redux";
import { GetAllDoctor } from "../../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { findSumBillAmount, reactSelectOptionList } from "../../../../utils/utils";
import { BindDisApprovalList, GetDiscReasonList } from "../../../../networkServices/opdserviceAPI";
import { ROUNDOFF_VALUE } from "../../../../utils/constant";

const index = ({ tbody, deleteRowData, handleCustomInput, handleChangeReactSelect, values, handleSave }) => {
    const [bodyData, setBodyData] = useState([])
    const dispatch = useDispatch()
    const [discounts, setDiscounts] = useState({
        discountApprovalList: [],
        discountReasonList: [],
    });
    const [t] = useTranslation();
    const thead = [
        t("Date"),
        t("ItemName"),
        t("CPTCode"),
        t("Doctor"),
        { name: t("Rate"), width: "5%" },
        t("Qty"),
        t("Discount"),
        t("DisAmt"),
        t("Amount"),
        t("PatPayable"),
        t("Remarks"),
        { name: t("IsUrgent"), width: "1%" },
        { name: t("Reject"), width: "1%" },
    ]

    const { GetAllDoctorList } = useSelector((state) => state?.CommonSlice);


    useEffect(() => {
        let data = tbody?.map((ele, index) => ({
            // SrNo: index + 1,
            DATE: moment(ele?.DATE).format("DD-MMM-YYYY"),
            ItemName: ele?.autoCompleteItemName,
            itemCode: ele?.itemCode,
            doctor: <CustomSelect
                placeHolder={t("Doctor")}
                name="doctor"
                onChange={(name, e) => { handleCustomInput(index, "doctor", e) }}
                value={ele?.doctor?.value}
                option={GetAllDoctorList}
            />
            ,

            Rate: <Input
                type="text"
                className="table-input"
                id="Rate"
                name="Rate"
                value={ele?.Rate ? ele?.Rate : ""}
                onChange={(e) => { handleCustomInput(index, "Rate", e.target.value, "number", 100000) }}
                lable={t("Rate")}
                placeholder=" "
                respclass="mt-1"
                removeFormGroupClass={true}
                disabled={ele?.rateEditable}
            />,
            Qty: <Input
                type="text"
                className="table-input"
                id="Qty"
                name="Qty"
                value={ele?.Qty ? ele?.Qty : ""}
                onChange={(e) => { handleCustomInput(index, "Qty", e.target.value, "number", 20) }}
                lable={t("Qty")}
                placeholder=" "
                respclass="mt-1"
                removeFormGroupClass={true}
            />,
            Discount: <>

                <Input
                    type="text"
                    className="table-input"
                    removeFormGroupClass={true}
                    display={"right"}
                    name={"Discount"}
                    value={ele?.Discount}
                    onChange={(e) => { handleCustomInput(index, "Discount", e.target.value, "number", 100) }}
                />
            </>,
            discountAmount:
                Number(ele.Rate) *
                Number(ele?.Qty) *
                Number(ele?.Discount).toFixed(ROUNDOFF_VALUE) *
                0.01,

            Amount: Number(ele.Rate) * Number(ele?.Qty) - Number(ele.Rate) *
                Number(ele?.Qty) *
                Number(ele?.Discount).toFixed(ROUNDOFF_VALUE) *
                0.01,
            PatPayable: Number(ele.Rate) *
                Number(ele?.Qty) - Number(ele.Rate) *
                Number(ele?.Qty) *
                Number(ele?.Discount).toFixed(ROUNDOFF_VALUE) *
                0.01,
            Remarks: <Input
                type="text"
                className="table-input"
                id="Remarks"
                name="Remarks"
                value={ele?.Remarks ? ele?.Remarks : ""}
                onChange={(e) => { handleCustomInput(index, "Remarks", e.target.value) }}
                lable={t("Remarks")}
                placeholder=" "
                respclass="mt-1"
                removeFormGroupClass={true}
            />,
            IsUrgent: (ele?.categoryid==="3" || ele?.categoryid==="7")&& <input type="checkbox" onChange={(e) => { handleCustomInput(index, "IsUrgent", e?.target?.checked) }} checked={ele?.IsUrgent} />,
            Reject: <span onClick={() => { deleteRowData(index) }}><i className="fa fa-trash text-danger"></i></span>
        }))
        setBodyData(data)
    }, [tbody])

    const handleClassOnRow = (val, name) => {
        let data = tbody?.find((item) => { return item?.PatientID === val?.UHID })
        if (data?.Status === "Call" && name === "Patient Name") {
            return "blink-text text-danger"
        }
    }

    const getRowClass = (val) => {
        let data = tbody?.find((item) => { return item?.PatientID === val?.UHID })

        if (data?.IsEmergency === "1") {
            return "statusEmergency"
        }
        if (val?.IsPaid === 0) {
            return "statusIsPaid"
        }
        if (val?.Status === "Out") {
            return "statusDocOut"
        }
        if (val?.Status === "IN") {
            return "statusDoCIN"
        }
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
    useEffect(() => {
        dispatch(GetAllDoctor());
        GetDiscListAPI();
        dispatch(GetAllDoctor());
    }, []);

    let totalItemCount = { DATE: null, ItemName: null, itemCode: null, doctor: null, Rate: 0.00, Qty: false, Discount: false, discountAmount: 0.00, Amount: 0.00, PatPayable: 0.00, Remarks: null, IsUrgent: null, Reject: null, colorcode: "lightgray" }
    bodyData?.map((val) => {
        totalItemCount.Rate += Number(val?.Rate?.props?.value ? val?.Rate?.props?.value : 0)
        totalItemCount.discountAmount += Number(val?.discountAmount ? val?.discountAmount : 0)
        totalItemCount.Amount += Number(val?.Amount ? val?.Amount : 0)
        totalItemCount.PatPayable += Number(val?.PatPayable ? val?.PatPayable : 0)
    })


    return (
        <>
            <Tables
                thead={thead}
                tbody={[...bodyData, totalItemCount]}
                getRowClass={getRowClass}
                // style={{ height: "60vh" }}
                handleClassOnRow={handleClassOnRow}
            />

            {bodyData?.length > 0 &&
                <div className="d-flex aling-items-center justify-content-end mt-2">
                    <ReactSelect
                        placeholderName={"Discount Reason"}
                        id={"SR"}
                        searchable={true}
                        respclass={"col-md-2 mx-2"}
                        dynamicOptions={reactSelectOptionList(
                            discounts?.discountReasonList,
                            "DiscountReason",
                            "ID"
                        )}
                        handleChange={handleChangeReactSelect}
                        value={values?.discountReason?.value}
                        name="discountReason"
                        requiredClassName={
                            findSumBillAmount(bodyData, "discountAmount") > 0
                                ? "required-fields"
                                : ""
                        }
                        removeIsClearable={true}
                    />

                    <ReactSelect
                        placeholderName={"Approved By"}
                        id={"AB"}
                        searchable={true}
                        respclass={"col-md-2 mx-2"}
                        handleChange={handleChangeReactSelect}
                        value={values?.discountApproveBy?.value}
                        dynamicOptions={reactSelectOptionList(
                            discounts?.discountApprovalList,
                            "ApprovalType",
                            "ID"
                        )}
                        name="discountApproveBy"
                        requiredClassName={
                            findSumBillAmount(bodyData, "discountAmount") > 0
                                ? "required-fields"
                                : ""
                        }
                        removeIsClearable={true}
                    />
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                            handleSave({
                                Rate: tbody?.find((val) => val?.Rate === 0), discountAmount: findSumBillAmount(bodyData, "discountAmount") > 0,
                                discountReason: values?.discountReason?.value,
                                discountApproveBy: values?.discountApproveBy?.value
                            })
                        }}
                    // onClick={handleSave({})}
                    >
                        {t("Save")}
                    </button>
                </div>
            }

        </>
    );
};

export default index;
