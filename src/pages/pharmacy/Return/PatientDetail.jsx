import React from 'react'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next'

export default function PatientDetail({ patientDetail }) {
    const [t] = useTranslation()
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading isBreadcrumb={false} title={"Patient Detail"} />
                    <div className="row p-2">
                        <div className="col-xl-2 col-md-2 col-sm-4 col-12 pb-2">
                            <LabeledInput
                                label={t("UHID")}
                                value={patientDetail?.PatientID}
                            />
                        </div>

                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("PatientName")}
                                value={patientDetail?.Pname}
                            />
                        </div>

                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Age")}
                                value={patientDetail?.Age}
                            />
                        </div>
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Contact No")}
                                value={patientDetail?.contactno}
                            />
                        </div>


                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Address")}
                                value={patientDetail?.Address}
                            />
                        </div>

                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Payment Status")}
                                value={patientDetail?.PaymentMode}
                            />
                        </div>
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("IPDNo")}
                                value={patientDetail?.IPNo}
                            />
                        </div>
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("EMG No")}
                                value={patientDetail?.IPNo}
                            />
                        </div>
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Patient Type")}
                                value={patientDetail?.Patient_Type}
                            />
                        </div>
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Net Amt")}
                                value={patientDetail?.Netamount}
                            />
                        </div>
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Amount Paid")}
                                value={patientDetail?.Adjustment}
                            />
                        </div>
                        <div className='col-xl-2 col-md-2 col-sm-4 col-12 pb-2'>
                            <LabeledInput
                                label={t("Balance")}
                                value={patientDetail?.Netamount - patientDetail?.Adjustment}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
