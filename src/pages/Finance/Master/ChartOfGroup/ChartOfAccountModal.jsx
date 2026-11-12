import React from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../../components/UI/customTable'

export default function ChartOfAccountModal({ bodyData }) {
    const [t] = useTranslation()
    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("COG Code"), width: "15%" },
        { name: t("COG Name") },
        { name: t("Account Name") },
        { name: t("Active"), width: "1%" }
    ]
    return (
        <>
            {bodyData?.length > 0 &&
                <Tables thead={thead} tbody={bodyData?.map((val, index) => ({
                    sno: index + 1,
                    GroupCode: val?.GroupCode,
                    GroupName: val?.GroupName,
                    AccountName: val?.AccountName,
                    IsActiveDisplay: val?.IsActiveDisplay,
                }))} style={{ maxHeight: "60vh" }} />
            }
        </>
    )
}
