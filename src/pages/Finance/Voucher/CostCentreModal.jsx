import React, { useEffect, useState } from 'react'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import { useTranslation } from 'react-i18next'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import Input from '../../../components/formComponent/Input'
import WrapTranslate from '../../../components/WrapTranslate'
import Tables from '../../../components/UI/customTable'
import { filterByTypes, inputBoxValidation, notify } from '../../../utils/utils'
import { AMOUNT_REGX } from '../../../utils/constant'

export default function CostCentreModal({ inputs, setOldBodyData, tbody, list, setModalData }) {
    const [t] = useTranslation()
    const thead = [
        { name: "S.No.", width: "1%" },
        // { name: "Department" },
        { name: "Requirement Area" },
        { name: "Cost Centre" },
        { name: "Amount" },
        { name: "Delete", width: "1%" },
    ]

    const [values, setValues] = useState({})
    // { ...inputs, RemAmt: inputs?.ccList?.length > 0 ? 0 : inputs?.Amount }
    const [bodyData, setBodyData] = useState(inputs?.ccList)

    useEffect(() => {
        let ccAmount = inputs?.ccList?.reduce((intial, value) => {
            return intial + Number(value?.ccAmount)
        }, 0)
        setValues({ ...inputs, RemAmt: inputs?.Amount - ccAmount })
        setModalData((val) => ({ ...val, modalData: { ...inputs, RemAmt: inputs?.Amount - ccAmount } }))
    }, [])

    useEffect(() => {
        const newData = JSON.parse(JSON.stringify(tbody))
        newData[inputs.index]["ccList"] = bodyData
        setOldBodyData(newData)

    }, [bodyData?.length])

    const handleAdd = () => {
        if (!values?.RequirementArea?.value) {
            notify("Please Select Requirement Area", "error")
            return 0
        } else if (!values?.CostCentre?.value) {
            notify("Please Select Cost Centre", "error")
            return 0
        } else if (!values?.ccAmount) {
            notify("Amount Field is required", "error")
            return 0
        } else if (Number(values?.ccAmount) <= 0) {
            notify("Amount Should be greater than 0", "error")
            return 0
        }
        let remainingAmount = values?.RemAmt - (values?.ccAmount)
        if (remainingAmount < 0) {
            notify("You Can't Add More Than Cost Centre Amount", "error")
            return 0
        }
        const isDuplicate = bodyData?.find((val) => (val?.RequirementArea?.value === values?.RequirementArea?.value && val?.CostCentre?.value === values?.CostCentre?.value))
        if (isDuplicate) {
            notify("You Can't Add Duplicate Item", "error")
            return 0
        }
        setBodyData((val) => ([...val, values]))
        setValues({ ...inputs, RemAmt: remainingAmount })
        setModalData((val) => ({ ...val, modalData: { ...inputs, RemAmt: remainingAmount } }))
    }

    const hanldeDelete = (val, index) => {
        let remainingAmt = Number(values?.RemAmt ? values?.RemAmt : 0) + Number(bodyData[index]?.ccAmount ? bodyData[index]?.ccAmount : 0)
        setValues((val) => ({ ...val, RemAmt: remainingAmt }))
        setModalData((val) => ({ ...val, modalData: { ...inputs, RemAmt: remainingAmt } }))
        let data = bodyData?.filter((item, ind) => ind !== index)
        setBodyData(data)
    }

    const handleReactSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }))
    }
    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target?.value }))
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
                        <div className="col-xl-4 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("Department")} value={values?.Department?.label} />
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("A/C Name")} value={values?.TextField} />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("Cost Centre Amt")} value={`${values?.Amount ? values?.Amount : 0} ${values?.CurrencyCode} ${values?.balanceType?.value}`} />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                            <LabeledInput label={t("Rem Amt")} value={`${values?.RemAmt ? values?.RemAmt : 0} ${values?.CurrencyCode} ${values?.balanceType?.value}`} />
                        </div>

                        <ReactSelect
                            placeholderName={t("Requirement Area")}
                            id="RequirementArea"
                            name="RequirementArea"
                            requiredClassName={"required-fields"}
                            value={values?.RequirementArea?.value}
                            handleChange={(name, e) => handleReactSelect(name, e)}
                            removeIsClearable={true}
                            dynamicOptions={filterByTypes(list, [6, inputs?.Department?.value], ["TypeID", "DeptCode"], "TextField", "ValueField")}
                            searchable={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Cost Centre")}
                            id="CostCentre"
                            name="CostCentre"
                            requiredClassName={"required-fields"}
                            value={values?.CostCentre?.value}
                            handleChange={(name, e) => handleReactSelect(name, e)}
                            removeIsClearable={true}
                            dynamicOptions={filterByTypes(list, [7, inputs?.Department?.value, values?.RequirementArea?.value], ["TypeID", "DeptCode", "ReqAreaCode"], "TextField", "ValueField")}
                            searchable={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />
                        <div className='col-xl-4 col-md-4 col-sm-6 col-12'>
                            <div className='row'>

                                <Input
                                    type="text"
                                    className="form-control required-fields"
                                    id="ccAmount"
                                    name="ccAmount"
                                    value={values?.ccAmount ? values?.ccAmount : ""}
                                    // onChange={(e) => handleReactSelect("ccAmount", e.target.value)}
                                    // onChange={handleChange}
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
                    RequirementArea: val?.RequirementArea,
                    CostCentre: val?.CostCentre,
                    Amount: val?.ccAmount,
                    Delete: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { hanldeDelete(val, index) }}></i>,
                }))}
            />

        </>
    )
}
