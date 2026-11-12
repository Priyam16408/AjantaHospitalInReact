import React, { useEffect, useState } from 'react'
import Heading from '../../../../components/UI/Heading'
import ReactSelect from '../../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next';
import { EDPDeleteMapBloodBagAPI, EDPLoadBloodBagAPI, EDPLoadBloodComponentAPI, EDPMappedBloodBagAPI, EDPSaveMapBloodBagTypeAPI } from '../../../../networkServices/EDP/edpApi';
import { handleReactSelectDropDownOptions } from '../../../../utils/utils';
import Tables from '../../../../components/UI/customTable';
import WrapTranslate from '../../../../components/WrapTranslate';
import { notify } from '../../../../utils/ustil2';

export default function BloodBagMapping({ data }) {

    const [values, setValues] = useState({});
    const [list, setList] = useState({ BloodBagList: [], ToComponent: [] })
    const [bodyData, setBodyData] = useState([])
    const [t] = useTranslation()
    const thead = [
        { name: "S.No.", width: "2%" }, { name: "Blood Bag Type Name" }, { name: "Blood Component Name" }, { name: "Delete", width: "2%" }
    ]
    const handleSelect = (nane, value) => {
        if (nane === "BloodBagType") {
            BindMappedBloodBag(value.value)
        }
        setValues((val) => ({ ...val, [nane]: value }));
    }
    const handleMap = async () => {
        const paylaod = {
            "bloodBagID": Number(values?.BloodBagType.value),
            "bloodBagName": values?.BloodBagType.label,
            "componentID": String(values?.ToComponent.value),
            "componentName": values?.ToComponent.label
          }
        let apiResp = await EDPSaveMapBloodBagTypeAPI(paylaod)
        if(apiResp?.success){
            notify(apiResp?.message, "success")
            BindMappedBloodBag(values?.BloodBagType.value)
        }else{
            notify(apiResp?.message, "error")
        }

    }
    const EDPLoadBloodBag = async () => {
        let apiResp = await EDPLoadBloodBagAPI()
        if (apiResp?.success) {
            setList((val) => ({ ...val, BloodBagList: handleReactSelectDropDownOptions(apiResp?.data, "BagType", "ID") }))
        }
    }
    const BindEDPLoadBloodComponentAPI = async () => {
        let apiResp = await EDPLoadBloodComponentAPI()
        if (apiResp?.success) {
            setList((val) => ({ ...val, ToComponent: handleReactSelectDropDownOptions(apiResp?.data, "ComponentName", "ID") }))
        }
    }

    const BindMappedBloodBag = async (BagTypeID) => {
        let apiResp = await EDPMappedBloodBagAPI(BagTypeID)
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
        }
    }
    const handleRemove = async (id) => {
        let apiResp = await EDPDeleteMapBloodBagAPI(id)
        if(apiResp?.success){
            BindMappedBloodBag(values?.BloodBagType.value)
            notify(apiResp?.message, "success")
        }else{
            notify(apiResp?.message, "error")
        }
    }
    useEffect(() => {
        EDPLoadBloodBag()
        BindEDPLoadBloodComponentAPI()
    }, [])
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
                    <ReactSelect
                        placeholderName={t("Blood Bag Type")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="BloodBagType"
                        removeIsClearable={true}
                        dynamicOptions={list?.BloodBagList}
                        handleChange={handleSelect}
                        value={`${values?.BloodBagType?.value}`}
                    />
                    <ReactSelect
                        placeholderName={t("To Component")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="ToComponent"
                        removeIsClearable={true}
                        dynamicOptions={list?.ToComponent}
                        handleChange={handleSelect}
                        value={`${values?.ToComponent?.value}`}
                    />
                    <button className="btn btn-sm btn-success px-4" type="button" onClick={handleMap}>
                        {t("Map")}
                    </button>

                </div>

                <Tables thead={WrapTranslate(thead, "name")} tbody={bodyData?.map((val, index) => ({
                    SNo: index + 1,
                    BloodBagTypeName: val?.BagTypeName,
                    BloodComponentName: val?.ComponentName,
                    Delete: <i className='fa fa-trash text-danger' onClick={() => handleRemove(val?.ID)}></i>
                }))} />

            </div>
        </div>
    )
}
