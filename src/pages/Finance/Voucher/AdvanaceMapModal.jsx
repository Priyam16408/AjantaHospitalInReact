import React, { useEffect, useState } from 'react'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import { useTranslation } from 'react-i18next'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import Input from '../../../components/formComponent/Input'
import WrapTranslate from '../../../components/WrapTranslate'
import Tables from '../../../components/UI/customTable'
import { filterByTypes, handleReactSelectDropDownOptions, inputBoxValidation, notify } from '../../../utils/utils'
import { AMOUNT_REGX } from '../../../utils/constant'
import { getVoucherNoListAPI } from '../../../networkServices/finance'

export default function AdvanaceMapModal({ inputs, setOldBodyData, tbody, list, setModalData }) {
    const [t] = useTranslation()
    const thead = [
        { name: "S.No.", width: "1%" },
        // { name: "Department" },
        { name: "Voucher No" },
        { name: "Amount" },
        { name: "Delete", width: "1%" },
    ]

    const [values, setValues] = useState({ voucherList: [] })
    // { ...inputs, RemAmt: inputs?.mapList?.length > 0 ? 0 : inputs?.Amount }
    const [bodyData, setBodyData] = useState(inputs?.mapList)

    const getVoucherNoList = async (AccountID, Type) => {
        const apiResp = await getVoucherNoListAPI(AccountID, Type)
        if (apiResp?.success) {
            setValues((val) => ({ ...val, voucherList: apiResp?.data }))
        } else {

            setValues((val) => ({ ...val, voucherList: [] }))
        }

    }

    useEffect(() => {
        let advAmount = inputs?.mapList?.reduce((intial, value) => {
            return intial + Number(value?.advAmount)
        }, 0)
        setValues({ ...inputs, RemAmt: inputs?.Amount - advAmount })
        setModalData((val) => ({ ...val, modalData: { ...inputs, RemAmt: inputs?.Amount - advAmount } }))
        getVoucherNoList(inputs?.ValueField, inputs?.balanceType?.value)
    }, [])

    useEffect(() => {
        const newData = JSON.parse(JSON.stringify(tbody))
        newData[inputs.index]["mapList"] = bodyData
        setOldBodyData(newData)

    }, [bodyData?.length])

    const handleAdd = () => {
        if (!values?.VoucherNo?.value) {
            notify("Please Select Voucher No", "error")
            return 0
        } else if (!values?.advAmount) {
            notify("Amount Field is required", "error")
            return 0
        } else if (Number(values?.advAmount) <= 0) {
            notify("Amount Should be greater than 0", "error")
            return 0
        }
        let remainingAmount = values?.RemAmt - (values?.advAmount)
        if (remainingAmount < 0) {
            notify("You Can't Add More Than Cost Centre Amount", "error")
            return 0
        }
        const isDuplicate = bodyData?.find((val) => (val?.VoucherNo?.value === values?.VoucherNo?.value && val?.CostCentre?.value === values?.CostCentre?.value))
        if (isDuplicate) {
            notify("You Can't Add Duplicate Item", "error")
            return 0
        }
        setBodyData((val) => ([...val, values]))
        setValues({ ...inputs, RemAmt: remainingAmount, voucherList: values?.voucherList })
        setModalData((val) => ({ ...val, modalData: { ...inputs, RemAmt: remainingAmount } }))
    }

    const hanldeDelete = (val, index) => {
        let remainingAmt = Number(values?.RemAmt ? values?.RemAmt : 0) + Number(bodyData[index]?.advAmount ? bodyData[index]?.advAmount : 0)
        setValues((val) => ({ ...val, RemAmt: remainingAmt }))
        setModalData((val) => ({ ...val, modalData: { ...inputs, RemAmt: remainingAmt } }))
        let data = bodyData?.filter((item, ind) => ind !== index)
        setBodyData(data)
    }

    const handleReactSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }))
    }
    const handleChange = (e) => {
        if (!values?.VoucherNo?.ValueField) {
            notify("Please Select Voucher Number", "error")
            return 0
        }else{

            if(Number(values?.VoucherNo?.ValueField?.split("#")[1])>=Number(e?.target?.value)){
                setValues((prev) => ({ ...prev, [e.target.name]: e.target?.value }))
            }else{
                notify("Amount Can't Greater than Advance Amount", "error")
            }

        }

    }
    const onEnterAddItem = (e) => {
        if (e?.keyCode === 13) {
            handleAdd();
        }
    };



    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">

                    <div className="row p-2">
                        {/* <div className="col-xl-4 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("Department")} value={values?.Department?.label} />
                        </div> */}
                        <div className="col-xl-4 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("A/C Name")} value={values?.TextField} />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("Amount")} value={`${values?.Amount ? values?.Amount : 0} ${values?.CurrencyCode} ${values?.balanceType?.value}`} />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("Balance Amount")} value={`${values?.RemAmt ? values?.RemAmt : 0} ${values?.CurrencyCode} ${values?.balanceType?.value}`} />
                        </div>

                        <ReactSelect
                            placeholderName={t("Voucher No")}
                            id="VoucherNo"
                            name="VoucherNo"
                            requiredClassName={"required-fields"}
                            value={values?.VoucherNo?.value}
                            handleChange={(name, e) => handleReactSelect(name, e)}
                            removeIsClearable={true}
                            dynamicOptions={handleReactSelectDropDownOptions(values?.voucherList, "TextField", "ValueField")}
                            searchable={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />

                        <div className='col-xl-4 col-md-4 col-sm-6 col-12'>
                            <div className='row'>

                                <Input
                                    type="text"
                                    className="form-control required-fields"
                                    id="advAmount"
                                    name="advAmount"
                                    value={values?.advAmount ? values?.advAmount : ""}

                                    onChange={(e) => {
                                        inputBoxValidation(AMOUNT_REGX(8), e, handleChange);
                                    }}
                                    lable={t("Amount")}
                                    placeholder=" "
                                    respclass="col-8"
                                    onKeyDown={onEnterAddItem}
                                />
                                <div className="col-1">
                                    <button className="btn btn-sm btn-success px-3" type='button' onClick={handleAdd} >{t("Add")}</button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <Tables
                thead={WrapTranslate(thead, "name")}
                tbody={bodyData?.map((val, index) => ({
                    sno: index + 1,
                    VoucherNo: val?.VoucherNo,
                    Amount: val?.advAmount,
                    Delete: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { hanldeDelete(val, index) }}></i>,
                }))}
            />

        </>
    )
}
