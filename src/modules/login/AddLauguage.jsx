import React, { useState } from 'react'
import Heading from '../../components/UI/Heading'
import Input from '../../components/formComponent/Input';
import { notify } from '../../utils/utils';
import { handleSaveLanguage } from '../../store/reducers/dashboardSlice/CommonFunction';

export default function AddLauguage() {

    const [values, setValues] = useState({})
    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target?.value }))
    }

    const handleSave = async () => {
        let payload = {
            "id": 0,
            "hindi": values?.hindi?values?.hindi:"",
            "english": values?.english?values?.english:"",
            "french": values?.french?values?.french:"",
            "german": values?.german?values?.german:"",
            "italy": values?.italy?values?.italy:"",
        }
        setValues({})
        let apiResp = await handleSaveLanguage(payload)
        if (apiResp?.success) {
            notify(apiResp?.message)
        } else {
            notify(apiResp?.message, "error")

        }

    }
    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading
                        title={("Add Laguage")}
                        isBreadcrumb={false}
                    />

                    <div className='row m-2'>


                        <Input
                            type="text"
                            className="form-control"
                            id="english"
                            name="english"
                            value={values?.english ? values?.english : ""}
                            onChange={handleChange}
                            lable={"English"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="hindi"
                            name="hindi"
                            value={values?.hindi ? values?.hindi : ""}
                            onChange={handleChange}
                            lable={"Hindi"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="french"
                            name="french"
                            value={values?.french ? values?.french : ""}
                            onChange={handleChange}
                            lable={"French"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="german"
                            name="german"
                            value={values?.german ? values?.german : ""}
                            onChange={handleChange}
                            lable={"German"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="italy"
                            name="italy"
                            value={values?.italy ? values?.italy : ""}
                            onChange={handleChange}
                            lable={"Italy"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        />

                        <button className='btn btn-success' onClick={handleSave} type='button'> Save </button>

                    </div>

                </div>
            </div>
        </>
    )
}
