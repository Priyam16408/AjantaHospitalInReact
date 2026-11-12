import React, { useState } from 'react'
import Accordion from "@app/components/UI/Accordion";
import { useTranslation } from 'react-i18next';
import Heading from '@app/components/UI/Heading';
import Input from "@app/components/formComponent/Input";
import ReactSelect from '@app/components/formComponent/ReactSelect';
import TestAddingTable from '../../../components/UI/customTable/frontofficetables/TestAddingTable';
import PaymentGateway from '../../../components/front-office/PaymentGateway';
import LabeledInput from '../../../components/formComponent/LabeledInput';

export default function OPDRefund() {
    const [t] = useTranslation();
    const [state, setd] = useState()
    return (
        <>
            <div className="card patient_registration border">
                <Heading title={t("FrontOffice.OPD.OPDRefund.Patient_Details")}
                    isBreadcrumb={true}
                />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 ml-2 mt-2">
                    <Input
                        type="text"
                        className="form-control"
                        id="ReceiptNo"
                        name="receiptno"
                        lable={t("FrontOffice.OPD.OPDRefund.ReceiptNo")}
                        placeholder=" "
                        required={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
                        <button className="btn btn-sm btn-info "> {t("FrontOffice.OPD.search")} </button>
                    </div>
                </div>
            </div>
            <div className="card patient_registration border">
                <Heading title={t("FrontOffice.OPD.OPDRefund.Patient_Details")} />
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 ml-2 mt-2">
                    <div className='col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2'>
                    <LabeledInput label={t("FrontOffice.OPD.patientRegistration.UHID")} value={"226503"} />
                    </div>

                    <div className='col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2'>
                        <LabeledInput label={t("FrontOffice.OPD.OPDRefund.Patient_Name")} value={"Mayank"} />
                    </div>

                    <div className='col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2'>
                    <LabeledInput label={t("FrontOffice.OPD.OPDRefund.Age")} value={"25.2 YRS"} />
                    </div>

                    <div className='col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2'>
                    <LabeledInput label={t("FrontOffice.OPD.OPDRefund.Amount")} value={"17000"} />
                    </div>

                    <div className='col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2'>
                    <LabeledInput label={t("FrontOffice.OPD.OPDRefund.Doctor")} value={"Abhay"} />
                    </div>

                    <div className='col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2'>

                    <LabeledInput label={t("FrontOffice.OPD.OPDRefund.IPD_No")} value={"457"} />
                        
                    </div>



                </div>
            </div>

            <div className="card patient_registration border">
                <Heading title={t("FrontOffice.OPD.OPDRefund.Prescribed_Items")} />
                <TestAddingTable />
                <PaymentGateway />
            </div>
        </>
    )
}
