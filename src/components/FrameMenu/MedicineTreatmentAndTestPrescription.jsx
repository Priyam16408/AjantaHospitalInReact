import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading'
import DatePicker from '../formComponent/DatePicker'
import { useTranslation } from 'react-i18next';
import TimeInputPicker from '../formComponent/CustomTimePicker/TimeInputPicker';
import ReactSelect from '../formComponent/ReactSelect';
import TextAreaInput from '../formComponent/TextAreaInput';
import Input from '../formComponent/Input';
import { getMedicineTreatmentAndPrescriptionApi, saveMedicineTreatmentAndPrescriptionApi } from '../../networkServices/nursingWardAPI';
import moment from 'moment';
import { notify } from '../../utils/ustil2';
import Tables from '../UI/customTable';

const THEAD = [
    { name: "S.No", width: "1%" },
    { name: "Type", width: "5%" },
    { name: "Comment", width: "10%" },
    { name: "Time", width: "5%" },
    { name: "Date", width: "5%" },
    { name: "Prescription", width: "15%" },
    { name: "Action", width: "5%" },
];
const MedicineTreatmentAndTestPrescription = (props) => {
    const { ipdno, transactionID } = props?.data || {};
    const { t } = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [tableData, setTableData] = useState([]);
    const [values, setValues] = useState({
        entryDate: null,
        type: "",
        time: "",
        comment: "",
        prescription: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }
    console.log(values, "values");
    const handleGetTableData = async () => {
        try {
            const response = await getMedicineTreatmentAndPrescriptionApi(transactionID);
            if (response?.success) {
                setTableData(response?.data);
            } else {
                notify(response?.message || "Something went wrong");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }

    const handleSaveDiet = async () => {
        const payload = {
            id: values?.id ? values?.id : 0,
            "type": values?.type || "",
            "ipdNo": ipdno || "",
            "prescription": values.prescription || "",
            "transactionId": transactionID || 0,
            "comments": values.comment || "",
            "date": values.entryDate ? moment(values.entryDate).format("YYYY-MM-DD") : "",
            "time": values.time || "",
        }
        try {
            const response = await saveMedicineTreatmentAndPrescriptionApi(payload);
            if (response?.success) {
                notify(response?.message, "success");
                setValues({
                    entryDate: new Date(),
                    type: "",
                    time: "",
                    comment: "",
                    prescription: "",
                });
                handleGetTableData();
            } else {
                notify(response?.message || "Something went wrong", "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }

    }


    useEffect(() => {
        handleGetTableData();
    }, [transactionID]);

    return (
        <>
            <Heading title={"Medicine Treatment And Test"} isBreadcrumb={false} />
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
                        handleChange={handleChange}
                        lable={t("Entry Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <TimeInputPicker
                        name="time"
                        lable="Entry Time"
                        id="time"
                        value={values.time}
                        onChange={handleChange}
                        wrapperClass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Comment")}
                        placeholder=" "
                        id="comment"
                        name="comment"
                        onChange={handleChange}
                        value={values?.comment || ""}
                        maxLength={200}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <ReactSelect
                        className="form-control"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        lable={t("Type")}
                        name="type"
                        id="type"
                        value={values?.type}
                        dynamicOptions={[
                            { value: 1, label: "Medicine/Treatment" },
                            { value: 0, label: "Test/Prescription" }
                        ]}
                        handleChange={(name, val) => setValues((prev) => ({ ...prev, type: val.value }))}
                        placeholder={t("Select Type")}
                        removeIsClearable={true}

                    />
                    <TextAreaInput className='form-control' respclass="col-xl-2 col-md-4 col-sm-4 col-12" lable='Prescription' name="prescription" rows={3} value={values?.prescription} maxLength={500} onChange={handleChange} />
                    <button className='btn btn-primary' onClick={() => handleSaveDiet()}>{values?.id ? t("Update") : t("Save")}</button>
                </div>
            </div>


            {tableData?.length > 0 && (
                <Tables
                    thead={THEAD}
                    tbody={tableData?.map((item, index) => ({
                        sno: index + 1,
                        type: item?.TYPE === 1 ? "Medicine/Treatment" : "Test/Prescription",
                        comment: item?.Comments || "N/A",
                        time: item?.TIME || "N/A",
                        date: item?.DATE ? moment(item?.DATE).format(VITE_DATE_FORMAT) : "N/A",
                        prescription: item?.Prescription || "N/A",

                        edit: (
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => {
                                    console.log(item, "item");
                                    setValues({
                                        id: item?.ID,
                                        entryDate: item?.DATE ? moment(item?.DATE).toDate() : '',
                                        comment: item?.Comments || "",
                                        prescription: item?.Prescription || "",
                                        time: item?.TIME || "",
                                        type: String(item?.TYPE),
                                    });
                                }}
                            >
                                {t("Edit")}
                            </button>
                        ),

                    }))}
                />

            )}
        </>
    )
}

export default MedicineTreatmentAndTestPrescription