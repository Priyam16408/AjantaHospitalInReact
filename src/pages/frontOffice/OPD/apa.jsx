import React, { useState } from 'react'
import Heading from '../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../components/formComponent/ReactSelect';
import Tables from '../../components/UI/customTable';
import LabeledInput from '../../components/formComponent/LabeledInput';
import Input from '../../components/formComponent/Input';
import Button from '../../components/formComponent/Button';
import DatePicker from '../../components/formComponent/DatePicker';
import SearchingCriteriaTable from '../../components/UI/customTable/helpDesk/CostEstimateBillingTable/SearchingCriteriaTable';
import AdditionalEstimationTable from '../../components/UI/customTable/helpDesk/CostEstimateBillingTable/AdditionalEstimationTable';

export default function CostEstimateBilling() {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
   

    // Dynamically generate THEAD using bodyData keys
    // const THEAD = Object.keys(bodyData[0]).map((key) => {
    //     // Capitalize first letter and replace underscores with spaces
    //     return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
    // });

    return (
        <>
            <div className='card patient_registration border'>
                <Heading isBreadcrumb={true} />

                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">
                    <Input
                        type="text"
                        className="form-control"
                        id="Barcode"
                        name="Barcode"
                        lable={t("helpDesk.CostEstimateBilling.Barcode")}
                        placeholder=" "
                        required={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        id="UHID"
                        name="UHID"
                        lable={t("helpDesk.CostEstimateBilling.UHID")}
                        placeholder=" "
                        required={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />

                    <div className="col-xl-1 col-md-1 col-sm-2 col-2">
                        <Button name={t("helpDesk.CostEstimateBilling.Search")} type="button" className="btn btn-sm btn-primary" />
                    </div>

                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-4">
                        <Button name={t("helpDesk.CostEstimateBilling.Old_Patient_Search")} type="button" className="btn btn-sm btn-primary" />
                    </div>
                </div>
            </div>

            <div className='card patient_registration border'>
                <Heading title={t("helpDesk.CostEstimateBilling.Patient_Details")} />

                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">

                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.UHID")} value={"AM24-05210002"} />
                    </div>
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.Patient_Name")} value={"Mayank"} />
                    </div>
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.Age-Sex")} value={"26 YRS / Male"} />
                    </div>
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.Contact_No")} value={"9044890983"} />
                    </div>
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.Address")} value={"delhi Cuttack Cuttack"} />
                    </div>
                </div>

            </div>

            <div className='card patient_registration border'>
                <Heading title={t("helpDesk.CostEstimateBilling.Searching_Criteria_for_Estimation_Billing")} />

                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">

                    <ReactSelect
                        placeholderName={t("helpDesk.CostEstimateBilling.Panel")}
                        id={"Panel"}
                        searchable={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("helpDesk.CostEstimateBilling.Doctor")}
                        id={"Doctor"}
                        searchable={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("helpDesk.CostEstimateBilling.Room_Type")}
                        id={"Room_Type"}
                        searchable={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("helpDesk.CostEstimateBilling.Package")}
                        id={"Package"}
                        searchable={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("helpDesk.CostEstimateBilling.Surgery")}
                        id={"Surgery"}
                        searchable={true}
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                </div>
                <SearchingCriteriaTable/>
            </div>

            <div className="row">
                <div className="col-6">
                    <Heading title={t("helpDesk.CostEstimateBilling.Additional_Estimation_Billing")} />
                    <AdditionalEstimationTable/>
                </div>

                <div className="col-6">
                    <Heading title={t("helpDesk.CostEstimateBilling.Pre_Estimation_Billing")} />
                </div>

            </div>
            <div className='card patient_registration border'>
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.Additional_Estimate")} value={"0"} />
                    </div>
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.Pre_Estimate")} value={"0"} />
                    </div>
                    <div className="col-xl-2.5 col-md-3 col-sm-4 col-12 mb-2">
                        <LabeledInput label={t("helpDesk.CostEstimateBilling.Total_Estimate")} value={"0"} />
                    </div>
                </div>
            </div>

            <div className='card patient_registration border'>
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2">

                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                        id="Date_Procedure"
                        name="Date_Procedure"
                        lable={t("helpDesk.CostEstimateBilling.Date_Procedure")}
                        placeholder={VITE_DATE_FORMAT}
                    />

                    <Input
                        type="text"
                        className="form-control "
                        id="Length_Of_Stay"
                        name="Length_Of_Stay"
                        lable={t("helpDesk.CostEstimateBilling.Length_Of_Stay")}
                        placeholder=" "
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control "
                        id="Diagnosis"
                        name="Diagnosis"
                        lable={t("helpDesk.CostEstimateBilling.Diagnosis")}
                        placeholder=" "
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control "
                        id="Remarks"
                        name="Remarks"
                        lable={t("helpDesk.CostEstimateBilling.Remarks")}
                        placeholder=" "
                        respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
                    />
                </div>
                <div className="col-xl-2.5 col-md-3 col-sm-4 col-4 mb-2">
                    <Button name={t("helpDesk.CostEstimateBilling.btnName")} type="button" className="btn btn-sm btn-primary" />
                </div>
            </div>

        </>
    )
}
