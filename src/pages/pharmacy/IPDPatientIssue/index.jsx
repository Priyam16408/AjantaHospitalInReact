import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import DatePicker from '../../../components/formComponent/DatePicker';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Input from '../../../components/formComponent/Input';
import moment from 'moment';
import ColorCodingSearch from '../../../components/commonComponents/ColorCodingSearch';
import { useTranslation } from 'react-i18next';
import ViewPatientIssueTable from './ViewPatientIssueTable';

export default function index() {
  const [values, setValues] = useState({ FromDate: new Date(), DateTo: new Date() })
  const { VITE_DATE_FORMAT } = import.meta.env;

  const [t] = useTranslation()


  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
  }
  const handleReactSelect = async (name, value) => {
    setValues((val) => ({ ...val, [name]: value }))
  }

  const GetPatientIssueList = async (status = 'all') => {
    // let apiResp = await ViewEmgRequisition(data?.TID);
    // if (apiResp?.success) {
    //     let data = apiResp?.data?.map((val)=>{
    //         val.isopen=false
    //         val.SecondBodyDataList=[]
    //         return val;
    //     })
    //     setList((val) => ({ ...val, ViewEmgRequisitionList: data }))
    // } else {
    //     // notify(apiResp?.message, "error")
    // }
  }


  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading isBreadcrumb={true} title={"IPD Patient Issue - Medical Items"} />
          <div className="row p-2">
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id="FromDate"
              name="FromDate"
              value={values?.FromDate ? moment(values?.FromDate).toDate() : ""}
              maxDate={new Date()}
              handleChange={handleChange}
              lable={("From Date")}
              placeholder={VITE_DATE_FORMAT}
            />

            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id="DateTo"
              name="DateTo"
              value={values?.DateTo ? moment(values?.DateTo).toDate() : ""}
              // maxDate={new Date()}
              handleChange={handleChange}
              lable={("Date To")}
              placeholder={VITE_DATE_FORMAT}
            />

            <ReactSelect placeholderName={"From Department"}
              id="type"
              inputId="type"
              name="type"
              value={values?.type?.value}
              // dynamicOptions={TYPE}
              searchable={true}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactSelect(name, e)}
              respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
            />


            <Input
              type="text"
              className="form-control"
              id="RequisitionNumber"
              name="RequisitionNumber"
              value={values?.RequisitionNumber ? values?.RequisitionNumber : ""}
              onChange={handleChange}
              lable={"Requisition Number"}
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
              lable={"IPD No"}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            />

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
              id="UHID"
              name="UHID"
              value={values?.UHID ? values?.UHID : ""}
              onChange={handleChange}
              lable={"UHID"}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            />
            <div className="col-sm-1">
              <button className="btn btn-sm btn-success" type='button'>Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading isBreadcrumb={false} title={"Search Results"} secondTitle={<>
            <span className='pointer-cursor'> <ColorCodingSearch color={"rgb(196, 173, 233)"} label={t("Pending")} onClick={() => { GetPatientIssueList("Pending") }} /></span>
            <span className='pointer-cursor'>  <ColorCodingSearch color={"rgb(231, 175, 214)"} label={t("Issued")} onClick={() => { GetPatientIssueList("Issued") }} /></span>
            <span className='pointer-cursor'> <ColorCodingSearch color={"yellow"} label={t("Reject")} onClick={() => { GetPatientIssueList("Reject") }} /></span>
            <span className='pointer-cursor'> <ColorCodingSearch color={"rgb(160, 216, 160)"} label={t("Partial")} onClick={() => { GetPatientIssueList("Partial") }} /></span>
          </>} />

          <ViewPatientIssueTable tbody={[
            {name:"asd"}
            ]} />

        </div>
      </div>
    </>
  )
}
