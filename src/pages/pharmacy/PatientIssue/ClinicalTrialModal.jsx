import React from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'

export default function ClinicalTrialModal({ bodyData }) {
    const [t] = useTranslation()
    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Date"), width: "1%" },
        { name: t("Remarks"), width: "1%" }
    ]

    return (
        <>
            <Tables
                thead={thead}
                tbody={bodyData?.length > 0 && bodyData?.map((val, index) => ({
                    sno: index + 1,
                    Date: val?.EntryDateTime,
                    Remarks: val?.Remarks,
                }))}

            />
        </>
    )
}
