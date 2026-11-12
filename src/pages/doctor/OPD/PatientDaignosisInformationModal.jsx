
import { t } from 'i18next'
import React from 'react'
import Input from '../../../components/formComponent/Input'
import ICDDaignosisDescription from '../../../components/UI/customTable/doctorTable/FinalDiagnosis/ICDDaignosisDescription'
import Heading from '../../../components/UI/Heading'

const PatientDaignosisInformationModal = () => {
  return (
    <>
    <div className="m-2 spatient_registration_card">
    
    <div className="patient_registration card">

    <Heading
      title={t("ICS Master")}
      // isBreadcrumb={true}
    />
    
          <div className="row g-4 m-2 align-items-center">
        <Input
          type="text"
          className="form-control"
          id="SectionCode"
          lable={t("Section Code")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 w1"
          name="appointmentNo"
        />

        
        <Input
          type="text"
          className="form-control"
          id="SectionDesc"
          lable={t("Section Desc.")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 w1"
          name="appointmentNo"
        />
        <Input
          type="text"
          className="form-control"
          id="SubSectionCode"
          lable={t("Sub Section Code")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 w1"
          name="appointmentNo"
        />
        <Input
          type="text"
          className="form-control"
          id="SubSectionDesc"
          lable={t("Sub Section Desc.")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 w1"
          name="appointmentNo"
        />
        <Input
          type="text"
          className="form-control"
          id="ICDCode"
          lable={t("ICD Code")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 w1"
          name="appointmentNo"
        />
        <Input
          type="text"
          className="form-control"
          id="ICDDesc"
          lable={t("ICD Desc.")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 w1"
          name="appointmentNo"
        />

   
      
      </div>
      </div></div>
    </>
  )
}

export default PatientDaignosisInformationModal