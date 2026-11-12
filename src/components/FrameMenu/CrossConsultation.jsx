import React from 'react'
import ReactSelect from '../formComponent/ReactSelect'
import Heading from '../UI/Heading'
import TextAreaInput from '../formComponent/TextAreaInput'
import { useTranslation } from 'react-i18next'
import { notify } from '../../utils/ustil2'
import { saveNursingWardCrossConsultationsApi } from '../../networkServices/nursingWardAPI'
import { useSelector } from 'react-redux'
import { use } from 'react'

const CrossConsultation = (props) => {
    const { ipdno, transactionID, patientID } = props?.data || {};
    const { GetBindAllDoctorConfirmationData } = useSelector(
        (state) => state.CommonSlice
    );

    const { t } = useTranslation();
    const [values, setValues] = React.useState({
        doctor: "",
        comment: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }

    const handleSave = async () => {
        const payload = {
            id: 0,
            patientID: patientID || 0,
            transactionId: transactionID || 0,
            ipdNo: ipdno || "",
            description:values?.comment || "",
            roleID: '',
            doctorID: values?.doctor?.value || "",
            doctorName: values?.doctor?.label || "",
        }
        try {
            const response = await saveNursingWardCrossConsultationsApi(payload);
            if (response?.success) {
                notify(response?.message);
                setValues({
                    doctor: "",
                    comment: "",
                });
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message || "Error saving Cross Consultation", "error");

        }
    }


    // useEffect(() => {
    //     if (GetBindAllDoctorConfirmationData?.length > 0) { 
    //         const doctorOptions = GetBindAllDoctorConfirmationData.map((doctor) => ({
    //             value: doctor?.id,
    //             label: `${doctor?.firstName} ${doctor?.lastName}`,
    //         }));
    //         setValues((prev) => ({ ...prev, doctor: doctorOptions[0] }));
    //     }
    // }, [GetBindAllDoctorConfirmationData]);

    return (
        <>
            <Heading isBreadcrumb={true} />
            <div className='card '>
                <div className="row p-2">
                    <ReactSelect
                        className="form-control"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        lable={t("Doctor")}
                        name="doctor"
                        id="doctor"
                        value={values?.doctor}
                        dynamicOptions={[
                            ...GetBindAllDoctorConfirmationData.map((item) => {
                                return {
                                    label: item?.Name,
                                    value: item?.DoctorID,
                                };
                            }),
                        ]} handleChange={(name, val) => setValues((prev) => ({ ...prev, doctor: val }))}
                        placeholder={t("Select Doctor")}
                        removeIsClearable={true}

                    />
                    <TextAreaInput className='form-control' respclass="col-xl-2 col-md-4 col-sm-4 col-12" lable='Comment' name="comment" rows={3} value={values?.comment} maxLength={500} onChange={handleChange} />
                    <button className='btn btn-primary' onClick={handleSave}>{t("Save")}</button>
                </div>
            </div>
        </>
    )
}

export default CrossConsultation