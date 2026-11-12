import React from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import SaveButton from '../../../components/UI/SaveButton'
import CancelButton from '../../../components/UI/CancelButton'

export default function AddReferDoctor() {
    return (
        <>
            <div className="row p-2">
                <ReactSelect placeholderName={"Patient Type"}
                    id="type"
                    inputId="type"
                    name="type"
                    // value={values?.type}
                    // dynamicOptions={TYPE}
                    searchable={true}
                    removeIsClearable={true}
                    // handleChange={(name, e) => handleReactSelect(name, e)}
                    respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                />
            </div>

            <div className="ftr_btn">
                <SaveButton btnName={"Save"} onClick={() => { }} />
                <CancelButton
                    cancleBtnName={"Cancel"}
                    // onClick={() => { setModalData({ visible: false }) }}
                />
            </div>
        </>
    )
}
