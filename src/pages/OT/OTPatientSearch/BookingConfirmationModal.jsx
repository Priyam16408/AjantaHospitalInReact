import React, { useEffect } from 'react'
import LabeledInput from '../../../components/formComponent/LabeledInput'
import { useTranslation } from 'react-i18next'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { GetAdmitPatientDetailsAPI, MapIPDPatientIDList } from '../../../networkServices/OT/otAPI'
import { handleReactSelectDropDownOptions } from '../../../utils/utils'

export default function BookingConfirmationModal({ data, setModalData }) {
    const [t] = useTranslation()
    const [details, setDetails] = React.useState({ list: [], detail: {} });

    useEffect(() => {
        setModalData((val) => ({ ...val, modalData: {...data,...details?.detail, } }));
    }, [details?.detail])
    const bindIPDPatient = async () => {
        let apiResp = await MapIPDPatientIDList(data?.PatientID);
        if (apiResp?.success) {
            setDetails((val) => ({ ...val, list: handleReactSelectDropDownOptions(apiResp?.data, "PatientID", "TransactionID") }));
        } else {
            setDetails((val) => ({ ...val, list: [] }));
        }
    }
    console.log("details", details)
    const handleSelect = async (label, value) => {
        let apiResp = await GetAdmitPatientDetailsAPI(value?.value);
        if (apiResp?.success) {
            setDetails((val) => ({ ...val, detail: { ...apiResp?.data[0], [label]: value } }));
        } else {
            setDetails((val) => ({ ...val, detail: { [label]: value } }));
        }
    }

    useEffect(() => {
        bindIPDPatient()
    }, [])
    return (
        <div className='row p-2'>
            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("OT Number")} value={data?.OTNumber} />
            </div>

            <ReactSelect
                placeholderName={t("Map IPD Patient")}
                id={"MapIPDPatient"}
                searchable={true}
                // removeIsClearable={true}
                respclass="col-xl-3 col-md-4 col-sm-6 col-12 "
                dynamicOptions={details?.list}
                handleChange={handleSelect}
                value={`${details?.detail?.MapIPDPatient?.value}`}
                name={"MapIPDPatient"}
            />
            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("Patient Name")} value={details?.detail?.PatientName} />
            </div>
            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("Age")} value={details?.detail?.Age} />
            </div>
            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("Gender")} value={details?.detail?.Gender} />
            </div>
            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("Doctor")} value={details?.detail?.DoctorName} />
            </div>

            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("Ward/Room No")} value={details?.detail?.BedDetail} />
            </div>
            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("Contact")} value={details?.detail?.Phone} />
            </div>
            <div className='col-xl-3 col-md-4 col-sm-6 col-12 mb-2'>
                <LabeledInput label={t("Address")} value={details?.detail?.Address} />
            </div>

        </div>
    )
}
