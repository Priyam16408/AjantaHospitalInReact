import React, { useEffect, useState } from 'react'
import Heading from '../../../../components/UI/Heading'
import ReactSelect from '../../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next';
import { EDPBindMappedBloodGroupAPI, EDPDeleteMapBloodBagAPI, EDPDeleteMapBloodGroupAPI, EDPLoadBloodGroupAPI, EDPSaveMapBloodBagTypeAPI, EDPSaveMapBloodGroupAPI } from '../../../../networkServices/EDP/edpApi';
import { handleReactSelectDropDownOptions } from '../../../../utils/utils';
import Tables from '../../../../components/UI/customTable';
import WrapTranslate from '../../../../components/WrapTranslate';
import { notify } from '../../../../utils/ustil2';

export default function BloodGroupCompatibilty({ data }) {

    const [values, setValues] = useState({});
    const [list, setList] = useState({ BloodBagList: [], ToComponent: [] })
    const [bodyData, setBodyData] = useState([])
    const [t] = useTranslation()
    const thead = [
        { name: "S.No.", width: "2%" }, { name: "From Blood Group" }, { name: "To Blood Group" }, { name: "Delete", width: "2%" }
    ]
    const handleSelect = (nane, value) => {
        if (nane === "FromBloodGroup") {
            bindMappedBloodGroupList(value.label)
        }
        setValues((val) => ({ ...val, [nane]: value }));
    }
    const handleMap = async () => {
        if(!values?.FromBloodGroup?.label || !values?.ToBloodGroup?.label){
            notify("Please Select Blood Group", "error")
            return
        }
        const paylaod = {
            "fromBG": String(values?.FromBloodGroup?.label?values?.FromBloodGroup?.label:""),
            "toBG": String(values?.ToBloodGroup?.label?values?.ToBloodGroup?.label:""),
        }
        let apiResp = await EDPSaveMapBloodGroupAPI(paylaod)
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            bindMappedBloodGroupList(values?.FromBloodGroup?.label)
        } else {
            notify(apiResp?.message, "error")
        }

    }
    const EDPLoadBloodGroup = async () => {
        let apiResp = await EDPLoadBloodGroupAPI()
        if (apiResp?.success) {
            setList((val) => ({ ...val, BloodGroupList: handleReactSelectDropDownOptions(apiResp?.data, "BloodGroup", "ID") }))
        }
    }



    const handleRemove = async (id) => {
        let apiResp = await EDPDeleteMapBloodGroupAPI(id)
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            bindMappedBloodGroupList(values?.FromBloodGroup?.label)
        } else {
            notify(apiResp?.message, "error")
        }
    }
    const bindMappedBloodGroupList = async (id) => {
        let apiResp = await EDPBindMappedBloodGroupAPI(id)
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
        }
    }
    useEffect(() => {
        EDPLoadBloodGroup()
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
                        placeholderName={t("From Blood Group")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="FromBloodGroup"
                        requiredClassName={"required-fields"}
                        removeIsClearable={true}
                        dynamicOptions={list?.BloodGroupList}
                        handleChange={handleSelect}
                        value={`${values?.FromBloodGroup?.value}`}
                    />
                    <ReactSelect
                        placeholderName={t("To Blood Group")}
                        searchable={true}
                        requiredClassName={"required-fields"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="ToBloodGroup"
                        removeIsClearable={true}
                        dynamicOptions={list?.BloodGroupList}
                        handleChange={handleSelect}
                        value={`${values?.ToBloodGroup?.value}`}
                    />
                    <button className="btn btn-sm btn-success px-4" type="button" onClick={handleMap}>
                        {t("Map")}
                    </button>

                </div>

                <Tables thead={WrapTranslate(thead, "name")} tbody={bodyData?.map((val, index) => ({
                    SNo: index + 1,
                    FromaBG: val?.FromaBG,
                    ToBG: val?.ToBG,
                    Delete: <i className='fa fa-trash text-danger' onClick={() => handleRemove(val?.ID)}></i>
                }))} />

            </div>
        </div>
    )
}
