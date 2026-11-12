import React, { useEffect, useState } from 'react'
import Heading from '../../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import {  EDPLoadBagTypeAPI, EDPSaveBagTypeAPI, EDPUpdateBagTypeAPI } from '../../../../networkServices/EDP/edpApi';
import Tables from '../../../../components/UI/customTable';
import WrapTranslate from '../../../../components/WrapTranslate';
import { notify } from '../../../../utils/ustil2';
import Input from '../../../../components/formComponent/Input';
import CustomSelect from '../../../../components/formComponent/CustomSelect';

export default function BloodBagTypeMaster({ data }) {

    const [values, setValues] = useState({});
    const [bodyData, setBodyData] = useState([])
    const [t] = useTranslation()
    const thead = [
        { name: "S.No.", width: "2%" }, { name: "Bag Type Name" }, { name: "Status", width: "2%" }, { name: "Update", width: "2%" }
    ]
    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSave = async () => {
        const paylaod = {
            "id": 0,
            "isActive": 1,
            "bagTypeName": values?.BagTypeName?values?.BagTypeName:""
        }
        let apiResp = await EDPSaveBagTypeAPI(paylaod)
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            BindLoadBagType()
            setValues({})
        } else {
            notify(apiResp?.message, "error")
        }

    }
    const BindLoadBagType = async () => {
        let apiResp = await EDPLoadBagTypeAPI()
        if (apiResp?.success) {
            setBodyData(apiResp?.data?.data)
        } else {
            setBodyData([])
        }

    }


 
    const handleUpdate = async (value) => {
        const payload = {
            "id": Number(value?.ID?value?.ID:"0"),
            "bagTypeName": String(value?.BagType?value?.BagType:""),
            "activeStatus": Number(value?.ActiveStatus?value?.ActiveStatus:"")
          }
        let apiResp = await EDPUpdateBagTypeAPI(payload)
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            BindLoadBagType()
        } else {
            notify(apiResp?.message, "error")
        }
    }
    useEffect(() => {
        BindLoadBagType()

    }, [])


    const handleCustomInput = (index, name, value) => {
        const data = JSON.parse(JSON.stringify(bodyData));
        data[index][name] = value;
        setBodyData(data);
    };
    return (

        <div className="mt-2 spatient_registration_card">
            <div className="patient_registration card">
                <Heading
                    title={data?.breadcrumb}
                    data={data}
                    isSlideScreen={true}
                    isBreadcrumb={true}
                />

                <div className='row p-2'>

                    <Input
                        type="text"
                        className="form-control"
                        //id="creditlimitpercent"
                        name="BagTypeName"
                        value={values?.BagTypeName ? values?.BagTypeName : ""}
                        onChange={handleChange}
                        lable={t("Bag Type Name")}
                        placeholder=""
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <button className="btn btn-sm btn-success px-4" type="button" onClick={handleSave}>
                        {t("Save")}
                    </button>

                </div>
                {console.log("asd", bodyData)}
                <Tables thead={WrapTranslate(thead, "name")} tbody={bodyData?.map((val, index) => ({
                    SNo: index + 1,
                    BagType: <Input
                        type="text"
                        className="table-input"
                        respclass={"w-100"}
                        removeFormGroupClass={true}
                        name={"BagType"}
                        value={val?.BagType ? val?.BagType : ""}
                        onChange={(e) => { handleCustomInput(index, "BagType", e.target.value) }}
                    />,
                    IsActive: <CustomSelect
                        placeHolder={t("BRANCH CENTRE")}
                        name="IsActive"
                        onChange={(name, e) => { handleCustomInput(index, "IsActive", e?.value) }}
                        isRemoveSearchable={true}
                        value={`${val?.IsActive}`}
                        option={[{ label: "Yes", value: "1" }, { label: "No", value: "0" }]}
                    />,
                    Update: <button className='btn btn-sm btn-success tbl-btn' onClick={() => handleUpdate(val)}>{t("Update")}</button>
                }))} />

            </div>
        </div>
    )
}
