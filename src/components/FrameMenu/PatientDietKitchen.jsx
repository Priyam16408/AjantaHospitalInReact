import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useTranslation } from "react-i18next";
import Heading from "../UI/Heading";
import DatePicker from "../formComponent/DatePicker";
import Input from "../formComponent/Input";
import ReactSelect from "../formComponent/ReactSelect";
import TextAreaInput from "../formComponent/TextAreaInput";
import { Checkbox } from "primereact/checkbox";
import { notify } from '../../utils/ustil2';
import { getPatientKitchenDietListApi, getPatientKitchenDietTypeApi, SaveKitchenPatientDietApi } from '../../networkServices/DietApi';
import Tables from '../UI/customTable';

export default function PatientDietKitchen(props) {
    const { patientID, ipdno, transactionID, admitDate } = props?.data || {};
    const [dietList, setDietList] = useState([]);
    const [dietType, setDietType] = useState([]);
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;


    const THEAD = [
        { name: t("S.No"), width: "1%" },
        { name: t("Reg No"), width: "15%" },
        { name: t("IPD No"), width: "15%" },
        { name: t("Ward"), width: "10%" },
        { name: t("Diagnosis"), width: "10%" },
        { name: t("Diet"), width: "10%" },
        { name: t("Type of Diet"), width: "10%" },
        { name: t("Is Current"), width: "5%" },
        { name: t("Entry Date"), width: "10%" },
        { name: t("Edit"), width: "5%" },

    ]
    const [values, setValues] = useState({
        id: 0,
        entryDate: new Date(),
        newMasterDietID: '',
        newMasterName: '',
        diagnosis: "",
        diet: "",
        dietType: "",
        remarks: "",
        isCurrent: false,

    });
    const handleReactSelectChange = (name, val) => {
        setValues((prev) => ({
            ...prev,
            [name]: val,
        }));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "isCurrent") {
            setValues((prev) => ({
                ...prev,
                [name]: e.checked,
            }));
            return;
        }

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const handleGetPatientDietType = async () => {
        try {
            const response = await getPatientKitchenDietTypeApi();
            if (response?.success) {
                setDietType(response?.data?.map((item) => ({
                    label: item?.NAME,
                    value: item?.ID,
                })));
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleGetPatientDietList = async () => {
        try {
            const response = await getPatientKitchenDietListApi(transactionID);
            if (response?.success) {
                setDietList(response?.data);
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleSaveDiet = async (type1) => {
        const payload = {
            id: type1 === "edit" ? values?.id : 0,
            newMasterDietID: values.dietType?.value,
            newMasterName: values.dietType?.label,
            transactionID: transactionID || 0,
            patientID: patientID || "string",
            ipdno: ipdno || "string",
            entryDate: values.entryDate ? moment(values.entryDate).format("YYYY-MM-DD") : "",
            diagnosis: values.diagnosis,
            dietName: values.diet,
            typeOfDiet: values.dietType?.label || null,
            remark: values.remarks,
            isCurrent: values.isCurrent ? 1 : 0,

        }
        try {
            const response = await SaveKitchenPatientDietApi(payload);
            if (response?.success) {
                notify(response?.data?.message, "success");
                setValues({
                    entryDate: '',
                    diagnosis: "",
                    diet: "",
                    dietType: {
                        label: "",
                        value: "",
                    },
                    remarks: "",
                    isCurrent: false,
                });
                handleGetPatientDietList();
            } else {
                notify(response?.message || "Something went wrong", "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }

    }
    useEffect(() => {
        handleGetPatientDietType();
        handleGetPatientDietList();
    }, []);


    return (
        <div>
            <Heading title={"Diet Details"} isBreadcrumb={false} />
            <div className='card '>
                <div className="row p-2">
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="entryDate"
                        name="entryDate"
                        value={
                            values.entryDate
                                ? moment(values?.entryDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        minDate={moment(admitDate, "DD-MMM-YYYY h:mm A").toDate()}
                        handleChange={handleChange}
                        lable={t("Entry Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />

                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Diagnosis")}
                        placeholder=" "
                        id="diagnosis"
                        name="diagnosis"
                        onChange={handleChange}
                        value={values?.diagnosis || ""}
                        maxLength={200}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Diet")}
                        placeholder=" "
                        id="diet"
                        name="diet"
                        onChange={handleChange}
                        maxLength={200}
                        value={values?.diet || ""}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                        placeholderName={t("Type of Diet")}
                        name="dietType"
                        value={`${values?.dietType?.value}`}
                        handleChange={handleReactSelectChange}
                        dynamicOptions={dietType}
                        searchable={true}
                        id={"dietType"}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        removeIsClearable={true}
                    />
                    <TextAreaInput className='form-control' respclass="col-xl-2 col-md-4 col-sm-4 col-12" lable='Remarks' name="remarks" rows={3} value={values?.remarks} maxLength={500} onChange={handleChange} />
                    <div className='d-flex align-items-center col-xl-1 col-md-4 col-sm-4 col-6'>
                        <Checkbox type='checkbox' name='isCurrent' checked={values?.isCurrent} onChange={handleChange} />
                        <label className=''>{t("Is Current")}</label>
                    </div>

                    <button
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={() => handleSaveDiet(values.id ? "edit" : "new")}
                    >
                        {values?.id ? t("Update") : t("Save")}
                    </button>

                </div>
            </div>

            {dietList?.length > 0 && (
                <Tables
                    thead={THEAD}
                    tbody={dietList?.map((item, index) => ({
                        sno: index + 1,
                        regNo: item?.PatientID || "N/A",
                        ipdNo: item?.IPDNO,
                        ward: item?.Ward || "N/A",
                        diagnosis: item?.Diagnosis || "N/A",
                        diet: item?.DietName,
                        typeOfDiet: item?.TypeOfDiet || "N/A",
                        isCurrent: item?.IsCurrent ? "Yes" : "No",
                        entryDate: item?.EntryDate,
                        edit: (
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => {
                                    console.log(item, "item");
                                    debugger
                                    setValues({
                                        id: item?.ID,
                                        entryDate: item?.EntryDate ? moment(item?.entryDate).toDate() : '',
                                        diagnosis: item?.Diagnosis || "",
                                        diet: item?.DietName || "",
                                        dietType: {
                                            label: item?.NewMasterName || "",
                                            value: item?.NewMasterDietID || "",
                                        },
                                        remarks: item?.Remark || "",
                                        isCurrent: item?.IsCurrent,
                                    });
                                }}
                            >
                                {t("Edit")}
                            </button>
                        ),

                    }))}
                />

            )}


        </div>
    )
}
