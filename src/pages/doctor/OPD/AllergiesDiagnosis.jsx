import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../components/UI/Heading';
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import Input from '../../../components/formComponent/Input';
import { createDiagnosisTreatmentApi, deleteDiagnosisTreatmentApi, getPatientAllergiesDiagnosisAllByApi } from '../../../networkServices/DoctorApi';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';

const AllergiesDiagnosis = forwardRef((props) => {
    const { t } = useTranslation()
    const { TransactionID, PatientID } = props?.patientDetail;
    const THEAD = [
        { name: t("S.No"), width: "1%" },
        { name: t("Allergy"), width: "10%" },
        { name: t("Diagnosis"), width: "10%" },
        { name: t("Action"), width: "1%" },
    ]
    const initialData={
        id:0,
        allergies:"",
        diagnosis:"",
        diagnosisList:[]
    }
    const [inputs, setInputs] = useState(initialData);
    const [list, setList] = useState([])
    const hasPrescriptionForm = Object.keys(inputs).length > 0;

    const handleChange = (e) => {
        const { value, name } = e.target;
        setInputs((val) => ({ ...val, [name]: value }));

    };


    const handleDiagnosisKeyDown = (e) => {
        if (e.key === "Enter") {
            const newItem = inputs?.diagnosis.trim();
            if (!newItem) return;
            const existing = inputs?.diagnosisList || [];
            if (existing.includes(newItem)) return; // prevent duplicate

            const updatedList = [...existing, newItem];
            setInputs((prev) => (
                {
                    ...prev,
                    diagnosis: '',
                    diagnosisList: updatedList,
                }));
        }
    };


    const removeTagprisciptionForm = (key, index = null) => {

        const updatedInputs = { ...inputs };
        if (key === "diagnosis" && index !== null && Array.isArray(inputs?.diagnosisList)) {
            const updatedList = inputs?.diagnosisList?.filter((_, i) => i !== index);
            setInputs((prev) => ({
                ...prev,
                diagnosis: updatedList,
                diagnosisList: updatedList,
            }));
            return;
        } else {
            delete updatedInputs[key]
            updatedInputs[key] = ''
        }

        setInputs(updatedInputs);
    };

    const getList = async () => {
        try {
            const resp = await getPatientAllergiesDiagnosisAllByApi(props?.patientDetail?.TransactionID)
            if (resp?.success) {
                setList(resp?.data);
            } else {
                notify(resp?.message || "Something went wrong");
                setList([])
                setInputs(initialData)
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }
    const handleSaveAllergies = async (type) => {
        const payload = {
            id: type === 'Edit' ? inputs?.id : 0,
            allergy: inputs?.allergies,
            diagnosis: (inputs.diagnosisList || []).join(', '),
            type: "",
            transactionID: TransactionID,
            patientId: PatientID
        }
        try {
            const resp = await createDiagnosisTreatmentApi(payload)
            if (resp?.success) {
                notify(resp?.message, "success")
                getList()
                setInputs(initialData)
            } else {
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteDiagnosisTreatmentApi({ "id": id });
            if (response?.success) {
                notify(response?.message, "success")
                getList()
                setInputs(initialData)
            } else {
                notify(response?.message, "error")
                getList()
                setInputs(initialData)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getList()
    }, [])

    return (
        <div className=''>
            <div className="m-2 spatient_registration_card">
                <div className="patient_registration card">
                    <Heading
                        title={t("Allergies Diagnonosis")}
                        isBreadcrumb={false}
                    />
                    <div className="row g-4 m-2">

                        <TextAreaInput
                            type="text"
                            className="form-control "
                            id="allergies"
                            lable={t("Allergies")}
                            //  onFocus={(e) => handleInputFocus(e, "Allergies")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-3 col-md-4 col-sm-4 col-sm-4 col-12"
                            name="allergies"
                            value={inputs?.allergies}
                            onChange={handleChange}

                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="diagnosis"
                            lable={t("Diagnosis")}
                            placeholder=" "
                            required={true}
                            respclass="col-xl-3 col-md-4 col-sm-4 col-12"
                            name="diagnosis"
                            value={inputs?.diagnosis} // local input state
                            onChange={handleChange}
                            onKeyDown={handleDiagnosisKeyDown}
                        />
                        <div className=" col-sm-2 col-xl-2">
                            <button className="btn btn-sm btn-success" type="button" onClick={() => handleSaveAllergies(inputs?.id ? "Edit" : "new")}>
                                {inputs?.id ? t("Update") : t("Save")}
                            </button>
                        </div>

                        {hasPrescriptionForm && (
                            <div className=''>
                                {/* {inputs?.allergies && (
                                    <div>
                                        <strong className="hover_effect">{t('Allergies')} :</strong>
                                        <span
                                            className="tag hover_effect"
                                            style={{
                                                backgroundColor: '#F5EDED',
                                                display: 'inline-table',
                                                marginLeft: '6px',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            <span className="pl-1">{inputs?.allergies}</span>
                                            <span
                                                className="tag-close-icon"
                                                onClick={() => removeTagprisciptionForm('allergies')}
                                                style={{ marginLeft: '6px', cursor: 'pointer' }}
                                            >
                                                <i className="fa fa-times-circle" aria-hidden="true"></i>
                                            </span>
                                        </span>
                                    </div>
                                )} */}
                                {inputs?.diagnosisList?.length > 0 && (
                                    <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
                                        <strong className="hover_effect">{t('Diagnosis')} :</strong>

                                        {inputs?.diagnosisList?.map((item, index) => (
                                            <span
                                                key={`diagnosis-${index}`}
                                                className="tag hover_effect"
                                                style={{
                                                    backgroundColor: '#F5EDED',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    marginRight: '6px',
                                                }}
                                            >
                                                <span className="pl-1">{item}</span>
                                                <span
                                                    className="tag-close-icon"
                                                    onClick={() => removeTagprisciptionForm('diagnosis', index)}
                                                    style={{ marginLeft: '6px', cursor: 'pointer' }}
                                                >
                                                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}

                            </div>
                        )}
                    </div>

                </div>
                {list?.length > 0 && (
                    <Tables
                        thead={THEAD}
                        tbody={list?.map((item, index) => ({
                            SNo: index + 1,
                            Allergy: item?.Allergy,
                            diagnosis: item?.Diagnosis,
                            edit: (
                                <div className='d-flex'>
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => {
                                            setInputs({
                                                id: item?.Id,
                                                allergies: item?.Allergy || "",
                                                diagnosis: item?.Diagnosis || "",
                                                diagnosisList: typeof item?.Diagnosis === "string" ? item?.Diagnosis.split(",") : '',
                                            });
                                        }}
                                    >
                                        {t("Edit")}
                                    </button>
                                    <button
                                        className="btn btn-primary ml-2"
                                        type="button"
                                        onClick={() => {
                                            handleDelete(item?.Id)
                                        }}
                                    >
                                        {t("Delete")}
                                    </button>
                                </div>
                            ),
                        })

                        )}
                    />
                )}
            </div>
        </div>
    )
});

export default AllergiesDiagnosis;