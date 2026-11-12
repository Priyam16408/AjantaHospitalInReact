import React, { useEffect, useState } from 'react'
import DatePicker from '../../formComponent/DatePicker'
import Heading from '../../UI/Heading';
import Input from '../../formComponent/Input';
import {  getBloodBankList, getBloodBankLoadItems, getBloodGroupList, getEmergencyPatientDetailsAPI, GetEmergencyRate, getEmgBindBloodCategory, handleBloodBankSaveAPI, handleSaveDialysisAPI, UpdateBloodgroupAPI } from '../../../networkServices/Emergency';
import { BloodBankSavePayloadEMG, handleReactSelectDropDownOptions, inputBoxValidation, notify, reactSelectOptionList, SaveDialysisPayload } from '../../../utils/utils';
import Tables from '../../UI/customTable';
import ReactSelect from '../../formComponent/ReactSelect';
import { GetAllDoctor } from '../../../store/reducers/common/CommonExportFunction';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ViewBloodBankTable from "../../UI/customTable/Emergency/ViewBloodBankTable"
import TimePicker from '../../formComponent/TimePicker';
import { AMOUNT_REGX } from '../../../utils/constant';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function BloodBankServices({ data }) {

    const thead = [
        { name: "S.No.", width: "1%" },
        "SubCategory",
        "Item",
        "Qty",
        "ReserveDate",
        "ReserveTime",
        "Doctor",
        { name: "Remove", width: "1%" },
    ]

    const { VITE_DATE_FORMAT } = import.meta.env;
    let initialItem = { ReserveDate: new Date(), Time: new Date() }
    const {t} =useTranslation()
    const [values, setValues] = useState(initialItem)
    const [serviceItemsList, setServiceItemsList] = useState([])
    const [emgPatientDetail, setEmgPatientDetail] = useState({})
    const [list, setList] = useState({ category: [], BloodGroup: [], BloodBankList: [],bloodGroupList:[] })
    const dispatch = useDispatch()
    const handleChange = (e) => {
        const { name, value } = e.target
        setValues((val) => ({ ...val, [name]: value }))
    }

    const handleReactSelect = async (name, value) => {
        setValues(() => ({ ...values, [name]: value }))
    }

    const { GetAllDoctorList } = useSelector((state) => state?.CommonSlice);

    // BloodBank/BindRequestDetails

    const getApiList = async () => {
        const [category, BloodGroup, BloodBankLoadItemList, patientDetail,bloodGroupList] = await Promise.all([
            getEmgBindBloodCategory(),
            getBloodGroupList(),
            getBloodBankLoadItems(),
            getEmergencyPatientDetailsAPI(data?.EmergencyNo),
            getBloodBankList(data?.TID)
        ]);


        if (category?.success) setList((val) => ({ ...val, category: handleReactSelectDropDownOptions(category?.data, "name", "categoryID") }))
        if (bloodGroupList?.success) setList((val) => ({ ...val, bloodGroupList: bloodGroupList?.data}))
        if (BloodBankLoadItemList?.success) setList((val) => ({ ...val, BloodBankList: handleReactSelectDropDownOptions(BloodBankLoadItemList?.data, "TypeName", "ItemID") }))
        if (BloodGroup?.success) setList((val) => ({ ...val, BloodGroup: handleReactSelectDropDownOptions(BloodGroup?.data, "BloodGroup", "id") }))

        if (patientDetail?.success) setEmgPatientDetail(patientDetail?.data)
    }

    useEffect(() => {
        dispatch(GetAllDoctor());
        getApiList()
    }, [])

  
    const handleValidation = () => {
        let errors = {}
        if (!values?.SearchBloodBankByWord?.value) {
            errors.SearchBloodBankByWord = "Please Select Blood Bank."
        } else if (!values?.Doctor?.value) {
            errors.Doctor = "Please Select Doctor."
        } else if (!values?.Quantity) {
            errors.Quantity = "Quantity Field Is Required."
        }
        let data = serviceItemsList?.find((val) => { return val?.SearchBloodBankByWord?.value === values?.SearchBloodBankByWord?.value })
        if (data) {
            errors.Duplicate = "This Item Already Added Please Select Another Item."
        }
        return errors
    }



    const UpdateBloodGroup = async () => {
        debugger
        let apiResp = await UpdateBloodgroupAPI(values?.BloodGroup?.label, data?.patientID)
        if (apiResp?.success) {
            notify(apiResp?.message, "success")
        } else {
            notify(apiResp?.message, "error")
        }
    }

    const handleSelectItem = async () => {

        const customerrors = handleValidation();
        if (Object.keys(customerrors)?.length > 0) {
            notify(Object.values(customerrors)[0], "error");
            return 0
        }
        const params = `itemID=26152&refID=1&centreID=2`
        let data = await GetEmergencyRate(params)

        values.rate = data?.data
        setServiceItemsList((val) => ([...val, values]))
        setValues(initialItem)
    }

    const handleRemoveItem = (index) => {
        let data = serviceItemsList?.filter((val, i) => { return i !== index })
        setServiceItemsList(data)
    }

    const handleBloodBankSave = async () => {
        let payload = BloodBankSavePayloadEMG(serviceItemsList, emgPatientDetail)
        let apiResp = await handleBloodBankSaveAPI(payload)
        if(apiResp?.success){
            notify(apiResp?.message,"success")
            let bloodbankList = await getBloodBankList(data?.TID)
            bloodbankList?.success && setList((val)=>({...val,bloodGroupList:bloodbankList?.data}))
            setServiceItemsList([])
        }else{
            notify(apiResp?.message,"error")
        }

    }

    return (
        <>
            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("BloodGroup")}</div>} />
                    <div className='row p-2'>
                        <ReactSelect
                            placeholderName={t("BloodGroup")}
                            className="form-control"
                            id={"BloodGroup"}
                            name="BloodGroup"
                            dynamicOptions={list?.BloodGroup}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.BloodGroup?.value}
                            handleChange={handleReactSelect}
                        />
                        <div className=" text-right pb-1">
                            <button className=" btn-primary btn-sm px-2 ml-1 custom_save_button" type="button" onClick={UpdateBloodGroup} >
                                {t('UpdateBloodGroup')}
                            </button>
                        </div>

                    </div>
                    <Heading title={<div>{t("BloodBankServices")}</div>} />
                    <div className="row p-2">

                        <ReactSelect
                            placeholderName={t("Category")}
                            id="Category"
                            inputId="Category"
                            name="Category"
                            value={values?.Category?.value}
                            handleChange={handleReactSelect}
                            dynamicOptions={list?.category}
                            searchable={true}
                            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
                        />



                        <ReactSelect
                            placeholderName={t("SearchBloodBankByWord")}
                            className="form-control"
                            id={"SearchBloodBankByWord"}
                            name="SearchBloodBankByWord"
                            dynamicOptions={list?.BloodBankList}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.SearchBloodBankByWord?.value}
                            handleChange={handleReactSelect}
                            requiredClassName={"required-fields"}

                        />

                        <ReactSelect
                            placeholderName={t("Doctor")}
                            className="form-control"
                            id={"Doctor"}
                            name="Doctor"
                            dynamicOptions={handleReactSelectDropDownOptions(
                                GetAllDoctorList,
                                "Name",
                                "DoctorID"
                            )}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            requiredClassName={"required-fields"}
                            value={values?.Doctor?.value}
                            handleChange={handleReactSelect}
                        />



                        <DatePicker
                            className={`custom-calendar `}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            id="Date"
                            name="ReserveDate"
                            // inputClassName={"required-fields"}
                            value={values?.ReserveDate ? values?.ReserveDate : new Date()}
                            handleChange={handleChange}
                            minDate={new Date(emgPatientDetail?.InDateTime)}
                            lable={t("ReserveDate")}
                            placeholder={VITE_DATE_FORMAT}
                        />

                        <TimePicker
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholderName="Time"
                            lable={t("TimeOfIncident")}
                            id="Time"
                            name="Time"
                            value={values?.Time ? values?.Time : new Date()}
                            handleChange={handleChange}
                        />

                        <Input
                            type="text"
                            className="form-control required-fields"
                            id="Quantity"
                            name="Quantity"
                            value={values?.Quantity ? values?.Quantity : ""}
                            // onChange={handleChange}
                            lable={t("Quantity")}
                            onChange={(e) => { inputBoxValidation(AMOUNT_REGX(5), e, handleChange) }}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />



                        <div className=" text-right pb-1">
                            <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button" type="button" onClick={handleSelectItem} >
                               {t("Add")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {serviceItemsList?.length > 0 &&
                <div className="card patient_registration border mt-2">
                    <div className="card card_background">
                        <Heading title={<div>Service Items </div>} />

                        <Tables
                            thead={thead}
                            // tbody={[{ name: "as" }]}
                            tbody={serviceItemsList?.map((val, index) => ({
                                Index: index + 1,
                                Category: val?.Category?.label,
                                SearchBloodBankByWord: val?.SearchBloodBankByWord?.label,
                                Quantity: val?.Quantity,
                                ReserveDate: moment(val?.ReserveDate).format("DD-MMM-YYYY"),
                                Time: moment(val?.Time).format("hh:mm A"),
                                Doctor: val?.Doctor?.label,
                                Remove: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { handleRemoveItem(index) }}></i>,
                            }))}
                        />
                        <div className="mt-2  text-right pb-1">
                            <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields" type="button" onClick={handleBloodBankSave}>
                               {t("Save")}
                            </button>
                        </div>
                    </div>
                </div>
            }


            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>Blood Bank Services View </div>} />

                    <ViewBloodBankTable tbody={list?.bloodGroupList} />
                </div>
            </div>


        </>
    )
}
