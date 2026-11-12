import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import Tables from '../../../components/UI/customTable'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import { useTranslation } from 'react-i18next'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import Modal from '../../../components/modalComponent/Modal'
import IndentModel from './IndentModel'

export default function PatientMedicineReturn() {
    const [t] = useTranslation()
    const [values, setValues] = useState({})
    const [modalData, setModalData] = useState({ visible: false })
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
    
    const indentModel = () => {
        setModalData({
            visible: true,
            width: "70vw",
            label: "Medicine Prescribed",
            footer: <></>,
            Component: <IndentModel/>
        })

    }

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Search Patient"} />
                    <div className="row p-2">
                        <Input
                            type="text"
                            className="form-control"
                            id="PatientName"
                            name="PatientName"
                            value={values?.PatientName ? values?.PatientName : ""}
                            onChange={handleChange}
                            lable={"Patient Name"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />

                        <Input
                            type="text"
                            className="form-control"
                            id="IPDNo"
                            name="IPDNo"
                            value={values?.IPDNo ? values?.IPDNo : ""}
                            onChange={handleChange}
                            lable={"IPD No."}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />
                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success" type='button'>Search</button>
                        </div>

                    </div>

                    <Tables
                        thead={["IPD No.", "Patient Name", "Address", "Select"]}
                        tbody={[{ name: "asd" }]?.map((val, index) => ({
                            nns: "sdsd",
                            nnsd: "sdssdd",
                            dnns: "sdsasd",
                            dasnns: "sdsasd",

                        }))}
                    />
                </div>
            </div>

            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Patient Information"} />
                    <div className="row p-2">
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
                            <LabeledInput
                                label={t("UHID")}
                                value={"UHID"}
                            />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
                            <LabeledInput
                                label={t("Patient Name")}
                                value={"Patient Name"}
                            />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
                            <LabeledInput
                                label={t("IPD No.")}
                                value={"IPD No."}
                            />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
                            <LabeledInput
                                label={t("Room No.")}
                                value={"Room No"}
                            />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
                            <LabeledInput
                                label={t("Doctor Name")}
                                value={"Doctor Name"}
                            />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
                            <LabeledInput
                                label={t("Panel")}
                                value={"Panel"}
                            />
                        </div>
                        <div className="col-xl-2 col-md-4 col-sm-4 col-12 mb-2">
                            <LabeledInput
                                label={t("Admission Date")}
                                value={"Admission Date"}
                            />
                        </div>

                        <ReactSelect
                            placeholderName={t("Item")}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            id="Item"
                            dynamicOptions={[]}
                            name="Item"
                        // value={`${values?.StateID}`}
                        // handleChange={handleReactSelect}
                        //tabIndex="-1"
                        />

                        <button className="btn btn-sm btn-primary" type="button">
                            Get Item
                        </button>

                        <button className="btn btn-sm btn-primary ml-2" type="button" onClick={indentModel}>
                            Indents <strong className='text-danger ml-2'>12</strong>
                        </button>

                    </div>
                </div>
            </div>

            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Issued Items"} />

                </div>
            </div>

            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Return Items"} />

                    <div className="row p-2">
                        <Input
                            type="text"
                            className="form-control"
                            id="IssueNo"
                            name="IssueNo"
                            value={values?.IssueNo ? values?.IssueNo : ""}
                            onChange={handleChange}
                            lable={"Issue No"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                        />

                        <ReactSelect
                            placeholderName={t("Item")}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            id="Item"
                            dynamicOptions={[{label:"Yes",value:true},{label:"No",value:false}]}
                            name="Item"
                        // value={`${values?.StateID}`}
                        // handleChange={handleReactSelect}
                        //tabIndex="-1"
                        />

                    </div>
                </div>
            </div>

            {modalData?.visible && (
                <Modal
                    visible={modalData?.visible}
                    setVisible={() => { setModalData({ visible: false }) }}
                    // modalData={modalData?.URL}
                    modalWidth={modalData?.width}
                    Header={modalData?.label}
                    buttonType="button"
                    footer={modalData?.footer}
                >
                    {modalData?.Component}
                </Modal>
            )}

        </>
    )
}
