import React from 'react'
import Input from "@app/components/formComponent/Input";
import ReactSelect from '../../formComponent/ReactSelect';
import { useTranslation } from 'react-i18next';

export default function OldPatientSearch() {
    const [t] = useTranslation();
    return (
        <>
            <div className='row'>

                <div className="col-md-12 col-sm-12 ">
                    <div className="row">

                        <Input
                            type="text"
                            className="form-control "
                            id="OUHID"
                            name="barcode"
                            lable={t("FrontOffice.OPD.patientRegistration.UHID")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        // onKeyDown={Tabfunctionality}
                        />


                        <Input
                            type="text"
                            className="form-control "
                            id="IPD_No"
                            name="IPD_No"
                            lable={t("FrontOffice.OPD.patientRegistration.IPD_No")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"

                        />

                        <Input
                            type="text"
                            className="form-control "
                            id="OFirst_Name"
                            name="First_Name"
                            lable={t("FrontOffice.OPD.patientRegistration.First_Name")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        // onKeyDown={Tabfunctionality}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="OLast_Name"
                            name="Last_Name"
                            lable={t("FrontOffice.OPD.patientRegistration.Last_Name")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />

                        <Input
                            type="text"
                            className="form-control "
                            id="OContact_No"
                            name="Contact_No"
                            lable={t("FrontOffice.OPD.patientRegistration.Contact_No")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />

                        <Input
                            type="text"
                            className="form-control"
                            id="OAddress"
                            name="Address"
                            lable={t("FrontOffice.OPD.patientRegistration.Address")}
                            placeholder=" "
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />


                        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
                            <div className="row">
                                <ReactSelect
                                    placeholderName={t("FrontOffice.OPD.patientRegistration.Relation")}
                                    id="ORelation"
                                    searchable={true}
                                    respclass="col-5"
                                />

                                <Input
                                    type="text"
                                    className="form-control"
                                    id="ORelation_Name"
                                    name="Relation_Name"
                                    lable={t("FrontOffice.OPD.patientRegistration.Relation_Name")}
                                    placeholder=" "
                                    respclass="col-7"
                                />
                                {/* <Input
                                    type="text"
                                    className="form-control"
                                    id="First_Name"
                                    name="barcode"
                                    lable={t("FrontOffice.OPD.patientRegistration.First_Name")}
                                    placeholder=" "
                                    respclass="col-7"
                                /> */}
                            </div>
                        </div>

                        {/* <ReactSelect
                            placeholderName={t("FrontOffice.OPD.patientRegistration.Relation")}
                            id="ORelation"
                            searchable={true}
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />

                        <Input
                            type="text"
                            className="form-control"
                            id="ORelation_Name"
                            name="Relation_Name"
                            lable={t("FrontOffice.OPD.patientRegistration.Relation_Name")}
                            placeholder=" "
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        /> */}

                        <Input
                            type="date"
                            className="form-control"
                            id="ODOB"
                            name="Relation_Name"
                            lable={t("FrontOffice.OPD.patientRegistration.DOB")}
                            placeholder=" "
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />
                        <Input
                            type="date"
                            className="form-control"
                            id="OFromDate"
                            name="fromDate"
                            lable={t("FrontOffice.OPD.patientRegistration.fromDate")}
                            placeholder=" "
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />
                        <Input
                            type="date"
                            className="form-control"
                            id="OToDate"
                            name="toDate"
                            lable={t("FrontOffice.OPD.patientRegistration.toDate")}
                            placeholder=" "
                            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                        />







                    </div>
                </div>

            </div>
        </>
    )
}
