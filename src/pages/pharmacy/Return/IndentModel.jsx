import React from 'react'
import Input from '../../../components/formComponent/Input'
import Heading from '../../../components/UI/Heading'

export default function IndentModel() {
    return (<>
        <div className="row p-2">
            <Input
                type="text"
                className="form-control"
                id="IndentNo"
                name="IndentNo"
                // value={values?.PatientName ? values?.PatientName : ""}
                // onChange={handleChange}
                lable={"IndentNo"}
                placeholder=" "
                respclass=" col-md-4 col-sm-4 col-sm-4 col-12"
            />
            <div className="col-sm-1">
                <button className="btn btn-sm btn-success" type='button'>View</button>
            </div>

        </div>
        <Heading isBreadcrumb={false} title={"Indent Detail"} />
    </>
    )
}
