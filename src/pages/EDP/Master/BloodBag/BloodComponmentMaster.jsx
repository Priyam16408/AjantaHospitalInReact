import React, { useEffect, useState } from 'react'
import Heading from '../../../../components/UI/Heading'
import ReactSelect from '../../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next';
import { EDPBloodComponmentSearchAPI, EDPDeleteMapBloodBagAPI, EDPLoadBagTypeAPI, EDPLoadBloodBagAPI, EDPLoadBloodComponentAPI, EDPMappedBloodBagAPI, EDPSaveBagTypeAPI, EDPSaveBloodComponmentAPI, EDPSaveMapBloodBagTypeAPI, EDPUpdateBagTypeAPI, EDPUpdateBloodComponmentAPI } from '../../../../networkServices/EDP/edpApi';
import { handleReactSelectDropDownOptions, inputBoxValidation } from '../../../../utils/utils';
import Tables from '../../../../components/UI/customTable';
import WrapTranslate from '../../../../components/WrapTranslate';
import { notify } from '../../../../utils/ustil2';
import Input from '../../../../components/formComponent/Input';
import { AMOUNT_REGX, MOBILE_NUMBER_VALIDATION_REGX } from '../../../../utils/constant';

export default function BloodComponmentMaster({ data }) {
    const initialValue = { IsComponment: { value: "1" }, IsCrossMatch: { value: "1" }, IsActive: { value: "1" }, type: "save" }
    const [values, setValues] = useState(initialValue);
    const [bodyData, setBodyData] = useState([])
    const [t] = useTranslation()
    const thead = [
        { "name": "S.No." },
        { "name": "Component Name" },
        { "name": "Component Alias" },
        { "name": "Is Component" },
        { "name": "Rate" },
        { "name": "Expiry Days" },
        { "name": "Is CrossMatch Apply" },
        { "name": "CrossMatch Validity Days" },
        { "name": "Entry By" },
        { "name": "Entry Date" },
        { "name": "Edit" }
    ]
    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    }
    const errorValidtion = () => {
        if (!values?.ComponmentName) {
            notify("Componment Name is required", "error");
            return 0
        } else if (!values?.ExpiryDays) {
            notify("Expiry Days is required", "error");
            return 0
        } else if (!values?.Rate) {
            notify("Rate is required", "error");
            return 0
        } else if (!values?.CrossMatchValid) {
            notify("CrossMatch Valid is required", "error");
            return 0
        }
        return 1
    }
    const handleSave = async () => {
        if (!errorValidtion()) {
            return 0
        }
        const paylaod = {
            "id": values?.ID ? values?.ID : 0,
            "componmentName": String(values?.ComponmentName),
            "componentAlias": String(values?.ComponmentAlias),
            "activeStatus": Number(values?.IsActive?.value),
            "iscomponent": Number(values?.IsComponment?.value),
            "crossmatch": Number(values?.IsCrossMatch?.value),
            "expiryDays": String(values?.ExpiryDays),
            "rate": Number(values?.Rate),
            "crossMatchValiditydays": Number(values?.CrossMatchValid),
        }
        let apiResp = {}
        if (values?.ID) {
            apiResp = await EDPUpdateBloodComponmentAPI(paylaod)
        } else {
            apiResp = await EDPSaveBloodComponmentAPI(paylaod)
        }
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
            BindLoadBagType()
            setValues(initialValue)
        } else {
            notify(apiResp?.message, "error")
        }

    }
    const BindTabelData = async () => {
        let apiResp = await EDPBloodComponmentSearchAPI()
        if (apiResp?.success) {
            setBodyData(apiResp?.data)
        } else {
            setBodyData([])
        }

    }



    const handleUpdate = async (value) => {
        console.log("Asdasd", value)
        setValues({
            ComponmentName: value?.ComponentName,
            ComponmentAlias: value?.AliasName,
            IsComponment: { value: value?.isComponent },
            ExpiryDays: value?.dtExpiry,
            Rate: value?.Amount,
            IsCrossMatch: { value: value?.isCrosschargesapply },
            CrossMatchValid: value?.CrossmatchValidity,
            IsActive: { value: value?.Active },
            type: "edit",
            ID: value?.ID
        })
    }
    useEffect(() => {
        BindTabelData()
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

                    <Input
                        type="text"
                        className="form-control required-fields"
                        name="ComponmentName"
                        value={values?.ComponmentName ? values?.ComponmentName : ""}
                        onChange={handleChange}
                        lable={t("Componment Name")}
                        placeholder=""
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control "
                        name="ComponmentAlias"
                        value={values?.ComponmentAlias ? values?.ComponmentAlias : ""}
                        onChange={handleChange}
                        lable={t("Componment Alias")}
                        placeholder=""
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Is Componment")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="IsComponment"
                        removeIsClearable={true}
                        dynamicOptions={[{ label: "Yes", value: "1" }, { label: "No", value: "0" }]}
                        handleChange={handleSelect}
                        value={`${values?.IsComponment?.value}`}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        name="ExpiryDays"
                        value={values?.ExpiryDays ? values?.ExpiryDays : ""}
                        onChange={(e) => { inputBoxValidation(AMOUNT_REGX(4), e, handleChange) }}
                        lable={t("Expiry Days")}
                        placeholder=""
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        name="Rate"
                        value={values?.Rate ? values?.Rate : ""}
                        onChange={(e) => { inputBoxValidation(AMOUNT_REGX(8), e, handleChange) }}
                        lable={t("Rate")}
                        placeholder=""
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Is CrossMatch")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="IsCrossMatch"
                        removeIsClearable={true}
                        dynamicOptions={[{ label: "Yes", value: "1" }, { label: "No", value: "0" }]}
                        handleChange={handleSelect}
                        value={`${values?.IsCrossMatch?.value}`}
                    />
                    <Input
                        type="text"
                        className="form-control required-fields"
                        name="CrossMatchValid"
                        value={values?.CrossMatchValid ? values?.CrossMatchValid : ""}
                        onChange={(e) => { inputBoxValidation(AMOUNT_REGX(4), e, handleChange) }}
                        lable={t("CrossMatch Validity Days")}
                        placeholder=""
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />

                    <ReactSelect
                        placeholderName={t("Is Active")}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        name="IsActive"
                        removeIsClearable={true}
                        dynamicOptions={[{ label: "Yes", value: "1" }, { label: "No", value: "0" }]}
                        handleChange={handleSelect}
                        value={`${values?.IsActive?.value}`}
                    />


                    <button className="btn btn-sm btn-success px-4" type="button" onClick={handleSave}>
                        {t(values?.type === "save" ? "Save" : "Update")}
                    </button>

                </div>

                <Tables thead={WrapTranslate(thead, "name")} tbody={bodyData?.map((val, index) => ({
                    SNo: index + 1,
                    ComponentName: val?.ComponentName,
                    AliasName: val?.AliasName,
                    isComponent: val?.isComponent,
                    Amount: val?.Amount,
                    dtExpiry: val?.dtExpiry,
                    isCrosschargesapply: val?.isCrosschargesapply,
                    CrossmatchValidity: val?.CrossmatchValidity,
                    EmployeeName: val?.EmployeeName,
                    EntryDate: val?.EntryDate,
                    Update: <span className='fa fa-edit' onClick={() => handleUpdate(val)}></span>
                }))} />

            </div>
        </div>
    )
}
