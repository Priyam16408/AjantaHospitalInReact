import React, { useEffect, useState } from 'react'
import Heading from '../../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import { EDPBindBloodBankItemAPI, EDPBindComponentNameAPI, EDPBindDataOrganisationAPI, EDPSaveItemComponentAPI, EDPSaveOrganisationAPI } from '../../../../networkServices/EDP/edpApi';
import { handleReactSelectDropDownOptions } from '../../../../utils/utils';
import Tables from '../../../../components/UI/customTable';
import WrapTranslate from '../../../../components/WrapTranslate';
import { handleOrganisationPayload, notify } from '../../../../utils/ustil2';
import CustomSelect from '../../../../components/formComponent/CustomSelect';

export default function MapItemWithComponent({ data }) {

    const thead = [
        { "name": "S.No.", width: "2%" },
        { "name": "Item Name" },
        { "name": "Component Name", width: "25%" },
    ]
    const [bodyData, setBodyData] = useState([])
    const [nameList, setNameList] = useState([])
    const [t] = useTranslation()

    const BindData = async () => {
        let apiResp = await EDPBindBloodBankItemAPI()
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
        }
    }
    const bindComponentNameList = async (id) => {
        let apiResp = await EDPBindComponentNameAPI()
        if (apiResp?.success) {
            setNameList(handleReactSelectDropDownOptions(apiResp?.data, "ComponentName", "ID"))
        } else {
            setBodyData([])
        }
    }

    useEffect(() => {
        bindComponentNameList()
        BindData()
    }, [])
    const handleCustomInput = (index, name, value) => {
        const data = JSON.parse(JSON.stringify(bodyData));
        data[index][name] = value;
        setBodyData(data);
    };
    const handleClick = async () => {
        let payload = []
        bodyData.map((val, index) => {
            payload.push({
                "itemID": String(val?.ItemID),
                "componentID": String(val?.ComponentID),
            })
        })
        let apiResp = await EDPSaveItemComponentAPI(payload)
        if(apiResp?.success){
            notify(apiResp?.message, "success")
            BindData()
        }else{
            notify(apiResp?.message, "error")
        }
    }
    return (

        <div className="mt-2 spatient_registration_card">
            <div className="patient_registration card">
                <Heading
                    title={data?.breadcrumb}
                    data={data}
                    isSlideScreen={true}
                    isBreadcrumb={true}
                />

                <Tables style={{ maxHeight: "68vh" }} thead={WrapTranslate(thead, "name")} tbody={bodyData?.map((val, index) => ({
                    SNo: index + 1,
                    TypeName: val?.TypeName,
                    Address: <CustomSelect
                        placeHolder={t("Component Name")}
                        name="ComponentID"
                        onChange={(name, e) => { handleCustomInput(index, "ComponentID", e?.value) }}
                        isRemoveSearchable={true}
                        value={val?.ComponentID}
                        option={nameList}
                    />,
                }))} />

                <div className="mt-1 mb-1  text-right">
                    <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button " type="button" onClick={handleClick}>
                        {t("Save")}
                    </button>

                </div>

            </div>
        </div>
    )
}
