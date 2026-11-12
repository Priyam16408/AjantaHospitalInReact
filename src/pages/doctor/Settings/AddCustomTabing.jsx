import React from 'react'
import Heading from '../../../components/UI/Heading'
import { t } from 'i18next'
import ReactSelect from '../../../components/formComponent/ReactSelect'

const AddCustomTabing = () => {
  return (
    <>
       <div className="m-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Doctor Choose Add Custom Tab UI")}
            // isBreadcrumb={true}
          />
          <div className="row g-4 m-2" >
          <ReactSelect
            placeholderName={"Choose Text Area"}
            id={"Type & Temp.Filter"}
            searchable={true}
            name={"typeTempFilter"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: "Input", value: "Input" },
              { label: "Text Area", value: "Text Area" },
              { label: "Select", value: "Select" },
            ]}
            // handleChange={handleReactSelectChange}
            // value={reactSelectState.typeTempFilter}
            // removeIsClearable={false}
            //   handleChange={handleReactSelectAppointmentChange}
            //   value={selectOPDRadio}
          />
          <ReactSelect
            placeholderName={"Choose Input Box"}
            id={"Type & Temp.Filter"}
            searchable={true}
            name={"typeTempFilter"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: "Input", value: "Input" },
              { label: "Text Area", value: "Text Area" },
              { label: "Select", value: "Select" },
            ]}
            // handleChange={handleReactSelectChange}
            // value={reactSelectState.typeTempFilter}
            // removeIsClearable={false}
            //   handleChange={handleReactSelectAppointmentChange}
            //   value={selectOPDRadio}
          />
          <ReactSelect
            placeholderName={"Choose Select"}
            id={"Type & Temp.Filter"}
            searchable={true}
            name={"typeTempFilter"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { label: "Input", value: "Input" },
              { label: "Text Area", value: "Text Area" },
              { label: "Select", value: "Select" },
            ]}
            // handleChange={handleReactSelectChange}
            // value={reactSelectState.typeTempFilter}
            // removeIsClearable={false}
            //   handleChange={handleReactSelectAppointmentChange}
            //   value={selectOPDRadio}
          />
           <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
              <button
                className="btn btn-sm custom-button w-100"
                // onClick={handleDeleteSelectedTemplate}
              >
               Save
              </button>
            </div>
          </div>
          </div>
          </div>

    </>
  )
}

export default AddCustomTabing