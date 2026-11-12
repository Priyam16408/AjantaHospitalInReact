import React, { useEffect, useState } from 'react'
import Heading from '../../UI/Heading'
import { useTranslation } from 'react-i18next'
import { AMOUNT_REGX, BIND_TABLE_BY_MED_FIRST_NAME, EMGMED_REQUISION_TYPE, EMGVISITTYPE } from '../../../utils/constant'
import ReactSelect from '../../formComponent/ReactSelect'
import { BindItemMedicine, BindSubcategoryMedReq, getEmergencyPatientDetailsAPI, GetTimeRouteDurationMedReq, GetUrgencyLevelsReq, SaveEMGMedReq, shiftEmergencyBedAPI, ViewEmgRequisition } from '../../../networkServices/Emergency'
import { filterByTypes, handleReactSelectDropDownOptions, inputBoxValidation, notify, payloadEmgMedicineReq } from '../../../utils/utils'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { GetAllDoctor } from '../../../store/reducers/common/CommonExportFunction'
import { useDispatch } from 'react-redux'
import ViewRequisitionTable from "@components/UI/customTable/Emergency/ViewRequisitionTable.jsx";

import Input from '../../formComponent/Input'
import TextAreaInput from '../../formComponent/TextAreaInput'
import SearchItemEassyUI from '../../commonComponents/SearchItemEassyUI'
import { BindStoreDepartment } from '../../../networkServices/BillingsApi'
import Tables from '../../UI/customTable'
import MedicineSetModel from '../../modalComponent/Utils/Emergency/MedicineSetModel'
import Modal from '../../modalComponent/Modal'
import ColorCodingSearch from '../../commonComponents/ColorCodingSearch'


export default function EMGMedicineRequisition({ data }) {

    const [t] = useTranslation()
    const thead = [
        { name: t("EmergencyModule.Code"), width: "1%" },
        t("EmergencyModule.ItemName"),
        t("EmergencyModule.Dose"),
        t("EmergencyModule.Time"),
        t("EmergencyModule.Duration"),
        t("EmergencyModule.Route"),
        t("EmergencyModule.DoctorName"),
        t("EmergencyModule.Quantity"),
        t("EmergencyModule.Remarks"),
        { name: t("EmergencyModule.Remove"), width: "1%" },
    ]
    const initialValue = { Room: data?.Room, type: { value: "0" }, RequisitionType: { value: "0" }, SubGroup: { value: "0" } }
    const [values, setValues] = useState(initialValue)
    const [handleModelData, setHandleModelData] = useState({});
    const [tBody, setTbody] = useState([]);
    const dispatch = useDispatch()
    const { GetAllDoctorList } = useSelector((state) => state?.CommonSlice);
    const [list, setList] = useState({ RequisitionType: [], BindSubcategoryList: [], GetTimeRouteDurationList: [], BindStoreDepartmentList: [], ViewEmgRequisitionList: [] })

    const [BindDetails, setBindDetails] = useState({
        label: "ByFirstName",
        className: "required-fields",
        value: ""
    })

    const handleCallViewMedReq = async (status='all') => {
        let apiResp = await ViewEmgRequisition(data?.TID);
        if (apiResp?.success) {
            let data = apiResp?.data?.map((val)=>{
                val.isopen=false
                val.SecondBodyDataList=[]
                return val;
            })
            setList((val) => ({ ...val, ViewEmgRequisitionList: data }))
        } else {
            // notify(apiResp?.message, "error")
        }
    }

    const BindApisList = async () => {
        try {
            const [GetUrgencyLevelsList, BindSubcategoryList, GetTimeRouteDurationList, BindStoreDepartmentList, ] = await Promise.all([
                GetUrgencyLevelsReq(),
                BindSubcategoryMedReq(),
                GetTimeRouteDurationMedReq(),
                BindStoreDepartment(),
                // ViewEmgRequisition(data?.TID)
            ]);

            setList((val) => ({
                ...val,
                RequisitionType: [{ value: "0", label: "ALL" }, ...GetUrgencyLevelsList?.data],
                BindSubcategoryList: [{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(BindSubcategoryList?.data, "name", "subCategoryID")],
                GetTimeRouteDurationList: [{ value: "0", label: "ALL" }, ...GetTimeRouteDurationList?.data],
                BindStoreDepartmentList: handleReactSelectDropDownOptions(BindStoreDepartmentList?.data, "LedgerName", "LedgerNumber"),
            }))

        } catch (error) {

        }
    }

    useEffect(() => {
        dispatch(GetAllDoctor());
        handleCallViewMedReq()
        BindApisList()
    }, [])

    let ip = useLocalStorage("ip", "get");
    const location = useLocation();
    const [patientDetail,setPatientDetail] = useState(data)

    const ShiftRoom = async () => {
        let payload = {
            "tid": String(data?.TID),
            "ltnxNo": String(data?.LTnxNo),
            "oldRoomId": String(data?.RoomId),
            "newRoomType": String(values?.RoomName?.value),
            "newRoomId": Number(values?.BedNo?.value),
            "doctorId": String(data?.DoctorID),
            "panelId": String(data?.PanelID),
            "pageURL": location.pathname,
            "ipAddress": ip
        }
        let apiResp = await shiftEmergencyBedAPI(payload)
        notify(apiResp?.message, apiResp?.success ? "success" : "error")
        if (apiResp?.success) {
            setValues({ Room: apiResp?.data?.Room })
        }
    }

    const hanldeSelect = async (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }

    const BindListAPI = async (itemName) => {
        let payload = {
            "type": values?.type?.value ? Number(values?.type?.value) : 0,
            "deptLedgerNo": values?.Department?.value ? values?.Department?.value : "0",
            "subcategoryID": values?.SubGroup?.value ? values?.SubGroup?.value : "0",
            "itemName": itemName ? itemName : "",
            "canIndentMedicalItems": 0,
            "canIndentMedicalConsumables": 0,
            "panelID": data?.PanelID ? data?.PanelID : 0,
            "rows": 50
        }
        try {
            let apiResp = await BindItemMedicine(payload)
            return apiResp
        } catch (error) {

        }
    }

    const hanldeCloseSearchMed = (value) => {
        setValues((val) => ({ ...val, medicineName: value }))
        setBindDetails((val) => ({ ...val, value: value?.ItemName }))
    }

    const AddItem = () => {
        if (!values?.Department) {
            notify("Department field is required", "error")
        } else if (!values?.medicineName) {
            notify("Medicine Name field is required", "error")
        } else if (!values?.Quantity) {
            notify("Quantity field is required", "error")
        } else if (!values?.Doctor) {
            notify("Doctor field is required", "error")
        } else {
            setTbody((val) => ([...val, values]))
            setValues(initialValue)
            setBindDetails((val) => ({ ...val, value: "" }))
        }
    }

    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e?.target?.name]: e?.target?.value }))
    }
    const handleCustomInput = (index, name, value, type, max) => {
        if (type === "number") {
            if (!isNaN(value) && Number(value) <= max) {
                const data = [...tBody];
                data[index][name] = value;
                setTbody(data);
            } else {
                return false
            }
        } else {
            const data = [...tBody];
            data[index][name] = value;
            setTbody(data);
        }

    };
    const handleMedRemove = (index) => {
        let newTbody = JSON.parse(JSON.stringify(tBody))
        newTbody.splice(index, 1)
        setTbody(newTbody);
    }

    const handleModel = (
        label,
        width,
        Component,
        // footer,
    ) => {
        setHandleModelData({
            label: label,
            width: width,
            isOpen: true,
            Component: Component,
            // footer: footer,

        });
    };

    const handleMedSave = async () => {
        let payload = payloadEmgMedicineReq(tBody, patientDetail);
        let apiResp = await SaveEMGMedReq(payload)
        if (apiResp?.success) {
           await handleCallViewMedReq()
            notify(apiResp?.message, "success")
            setTbody([])
        } else {
            notify(apiResp?.message, "error")
        }
    }

  
    const getEmergencyPatientDetails = async () => {

        let apiResp = await getEmergencyPatientDetailsAPI(data?.EmergencyNo)
        if (apiResp?.success) {
            setPatientDetail((val) => ({ ...val, ...apiResp?.data }))
        }
    }

    useEffect(() => {
        getEmergencyPatientDetails()
    }, [])

    return (
        <>
            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading title={<div>{t("PatientOrderSet")}</div>} />
                    <div className="row p-2">
                        <ReactSelect
                            placeholderName={t("Type")}
                            className="form-control"
                            id={"type"}
                            name="type"
                            dynamicOptions={EMGMED_REQUISION_TYPE}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={`${values?.type?.value}`}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <ReactSelect
                            placeholderName={t("RequisitionType")}
                            className="form-control"
                            id={"RequisitionType"}
                            removeIsClearable={true}
                            name="RequisitionType"
                            dynamicOptions={list?.RequisitionType}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.RequisitionType?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <ReactSelect
                            placeholderName={t("Department")}
                            className="form-control"
                            id={"Department"}
                            removeIsClearable={true}
                            name="Department"
                            dynamicOptions={list?.BindStoreDepartmentList}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            requiredClassName={"required-fields"}
                            value={values?.Department?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <ReactSelect
                            placeholderName={t("SubGroup")}
                            className="form-control"
                            id={"SubGroup"}
                            removeIsClearable={true}
                            name="SubGroup"
                            dynamicOptions={list?.BindSubcategoryList}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.SubGroup?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <div className='col-xl-4 col-md-4 col-sm-6 col-12'>
                            <SearchItemEassyUI onClick={hanldeCloseSearchMed} BindListAPI={BindListAPI} BindDetails={BindDetails} Head={BIND_TABLE_BY_MED_FIRST_NAME}/>
                        </div>

                        <Input
                            type="text"
                            className="form-control required-fields"
                            id="Quantity"
                            name="Quantity"
                            value={values?.Quantity ? values?.Quantity : ""}
                            onChange={(e) => { inputBoxValidation(AMOUNT_REGX(3), e, handleChange) }}
                            lable={t("Quantity")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />

                        <ReactSelect
                            placeholderName={t("Times")}
                            className="form-control"
                            id={"Times"}
                            name="Times"
                            dynamicOptions={filterByTypes(
                                list?.GetTimeRouteDurationList,
                                ["Time"],
                                ["TYPE"],
                                "NAME",
                                "SequenceNo"
                            )}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            // requiredClassName={"required-fields"}
                            value={values?.Times?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />
                        <ReactSelect
                            placeholderName={t("Duration")}
                            className="form-control"
                            id={"Duration"}
                            name="Duration"
                            // dynamicOptions={filterByTypes}
                            dynamicOptions={filterByTypes(
                                list?.GetTimeRouteDurationList,
                                ["Duration"],
                                ["TYPE"],
                                "NAME",
                                "SequenceNo"
                            )?.reverse()}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.Duration?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />
                        <ReactSelect
                            placeholderName={t("Route")}
                            className="form-control"
                            id={"Route"}
                            name="Route"
                            dynamicOptions={filterByTypes(
                                list?.GetTimeRouteDurationList,
                                ["Route"],
                                ["TYPE"],
                                "NAME",
                                "SequenceNo"
                            )}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            value={values?.Route?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <Input
                            type="text"
                            className="form-control "
                            id="Dose"
                            name="Dose"
                            value={values?.Dose ? values?.Dose : ""}
                            onChange={handleChange}
                            lable={t("Dose")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "
                        />


                        <ReactSelect
                            placeholderName={t("Doctor")}
                            className="form-control"
                            id={"Doctor"}
                            name="Doctor"
                            dynamicOptions={handleReactSelectDropDownOptions(GetAllDoctorList, "Name", "DoctorID")}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            requiredClassName={"required-fields"}
                            value={values?.Doctor?.value}
                            handleChange={(name, value) => { hanldeSelect(name, value) }}
                        />

                        <TextAreaInput
                            type="text"
                            className={`form-textarea `}
                            id="Remaks"
                            name="Remaks"
                            rows={2}
                            value={values?.Remaks ? values?.Remaks : ""}
                            onChange={handleChange}
                            lable={t("Remaks")}
                            placeholder=" "
                            respclass=" col-sm-6 col-12"
                        />

                        <div className=' col-md-2 col-sm-4 col-4 d-flex justify-content-center align-items-center text-center'>
                            <button type='button' className='btn btn-sm btn-primary' onClick={AddItem}>
                                {t("AddItem")}
                            </button>
                        </div>
                        <div className=' col-md-2 col-sm-4 col-4 d-flex justify-content-center align-items-center  text-center'>
                            <button type='button' className='btn btn-sm btn-primary' onClick={() =>
                                handleModel(
                                    "MedicineSetHeading",
                                    "50vw",
                                    <MedicineSetModel
                                        // handleChangeModel={handleChangeModel}
                                        data={data}
                                        dropdownList={list}
                                        setParentTbody={setTbody}
                                        setHandleModelData={setHandleModelData}
                                    />,
                                  
                                    // handleStateInsertAPI
                                )
                            }>
                                {t("MedicineSet")}
                            </button>
                        </div>
                        <div className='col-md-2 col-sm-4 col-4 d-flex justify-content-center align-items-center  text-center'>
                            <button type='button' className='btn btn-sm btn-primary' onClick={ShiftRoom}>
                                {t("PrescriptionMedicine")}
                            </button>
                        </div>

                    </div>

                    {tBody?.length > 0 && <>
                        <Tables
                            thead={thead}
                            tbody={tBody?.map((val, index) => ({
                                code: index+1,
                                medicineName: val?.medicineName?.ItemName,
                                Dose: val?.Dose,
                                Times: val?.Times?.label,
                                Duration: val?.Duration?.label,
                                Route: val?.Route?.label,
                                Doctor: val?.Doctor?.label,
                                Quantity: val?.medSet ? val?.Quantity : <Input
                                    type="text"
                                    className="table-input"
                                    removeFormGroupClass={true}
                                    display={"right"}
                                    name={"Quantity"}
                                    value={val?.Quantity}
                                    onChange={(e) => { handleCustomInput(index, "Quantity", e.target.value, "number", 1000) }}
                                />,
                                Remaks: val?.Remaks,
                                Remove: <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { handleMedRemove(index) }}></i>,
                            }))}
                        />
                        <div className="mt-2  text-right pb-1">
                            <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields" type="button" onClick={handleMedSave}>
                                {t("Save")}
                            </button>
                        </div>
                    </>
                    }


                </div>
            </div>

            <div className="card patient_registration border mt-2">
                <div className="card card_background">
                    <Heading
                        title={t("ViewRequisition")}
                        isBreadcrumb={false}
                        secondTitle={<>
                           <span className='pointer-cursor'> <ColorCodingSearch color={"rgb(196, 173, 233)"} label={t("Pending")} onClick={() => { handleCallViewMedReq("Pending") }} /></span>
                           <span className='pointer-cursor'>  <ColorCodingSearch color={"rgb(231, 175, 214)"} label={t("Closed")} onClick={() => { handleCallViewMedReq("Closed")}} /></span>
                           <span className='pointer-cursor'> <ColorCodingSearch color={"yellow"} label={t("Reject")} onClick={() => {handleCallViewMedReq("Reject") }} /></span>
                           <span className='pointer-cursor'> <ColorCodingSearch color={"rgb(160, 216, 160)"} label={t("Partial")} onClick={() => {handleCallViewMedReq("Partial") }} /></span>
                        </>}
                    />

                    <ViewRequisitionTable tbody={list?.ViewEmgRequisitionList} />
                </div>
            </div>
            {handleModelData?.isOpen && (
                <Modal
                    visible={handleModelData?.isOpen}
                    setVisible={() => { setHandleModelData((val) => ({ ...val, isOpen: false })) }}
                    modalWidth={handleModelData?.width}
                    Header={t(handleModelData?.label)}
                    footer={<></>}

                // buttons={handleModelData?.extrabutton}
                // modalData={handleModelData?.modalData}
                // setModalData={setModalData}
                // handleAPI={handleModelData?.handleInsertAPI}
                >
                    {handleModelData?.Component}
                </Modal>
            )}
        </>
    )
}
