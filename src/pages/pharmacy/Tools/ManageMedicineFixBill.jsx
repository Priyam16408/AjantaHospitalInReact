import React, { useState } from 'react'
import Input from '../../../components/formComponent/Input'
import Heading from '../../../components/UI/Heading'
import Tables from '../../../components/UI/customTable'
import { useTranslation } from 'react-i18next'
import LabeledInput from '../../../components/formComponent/LabeledInput'

export default function ManageMedicineFixBill() {
    const [values, setValues] = useState({})
    const [t] = useTranslation()
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={t("Search Criteria")} />
                    <div className="row p-2">
                        <Input
                            type="text"
                            className="form-control required-fields"
                            id="UHID"
                            name="UHID"
                            value={values?.UHID ? values?.UHID : ""}
                            onChange={handleChange}
                            lable={t("UHID")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />
                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success" type='button'>{t("Search")}</button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <Heading isBreadcrumb={false} title={t("Details")} />
                        <Tables
                            thead={["#", t("UHID"), t("Name"), t("Gender"), t("Panel"), t("Address")]}
                            tbody={[{ name: "asd" }]?.map((val, index) => ({
                                nns: "sdsd",
                                nnsd: "sdssdd",
                                dnns: "sdsasd",
                                dasnns: "sdsasd",
                            }))}
                        />
                    </div>

                    <div className=' p-2'>
                        <Heading isBreadcrumb={false} title={t("Insert Details")} />
                        <div className="row p-2">
                            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                <LabeledInput
                                    label={"Patient Name"}
                                    value={"Mayank"}
                                />
                            </div>
                            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                <LabeledInput
                                    label={"UHID"}
                                    value={"UHID"}
                                />
                            </div>
                            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                <LabeledInput
                                    label={"Address"}
                                    value={"Address"}
                                />
                            </div>
                            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                                <LabeledInput
                                    label={"Panel"}
                                    value={"Panel"}
                                />
                            </div>

                            <Input
                                type="text"
                                className="form-control required-fields"
                                id="ReferealNo"
                                name="ReferealNo"
                                value={values?.ReferealNo ? values?.ReferealNo : ""}
                                onChange={handleChange}
                                lable={t("Refereal No")}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control required-fields"
                                id="MaxBillNoAllow"
                                name="MaxBillNoAllow"
                                value={values?.MaxBillNoAllow ? values?.MaxBillNoAllow : ""}
                                onChange={handleChange}
                                lable={t("Max Bill No Allow")}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            />
                        </div>


                        <div className="mt-2  text-right">
                            <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields" type="button">
                                {t("Save")}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}
