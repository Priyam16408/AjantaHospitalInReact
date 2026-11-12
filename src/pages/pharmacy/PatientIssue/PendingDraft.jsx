import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import { SelectIconSVG } from '../../../components/SvgIcons'

export default function PendingDraft({ bodyData, getPendingDraftList,SelectDroftItem }) {
    const [t] = useTranslation()

    const thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("UHID"), width: "1%" },
        { name: t("Patient Name"), width: "1%" },
        { name: t("Mobile"), width: "1%" },
        { name: t("Address"), width: "1%" },
        { name: t("Total Items"), width: "1%" },
        // { name: t("Select"), width: "1%" },
        { name: t("Delete"), width: "1%" },
    ]
    useEffect(() => {
        getPendingDraftList()
    }, [])
    return (
        <>
            <Tables
                thead={thead}
                tbody={bodyData?.map((val, index) => ({
                    sno: index + 1,
                    UHID: val?.PatientID,
                    PName: val?.PName,
                    ContactNo: val?.ContactNo,
                    Address: val?.Address,
                    TotalItems: val?.TotalItems,
                    // Select:<span onClick={() => { SelectDroftItem(val) }}><SelectIconSVG /></span>,
                    Delete: <i className="fa fa-trash text-danger text-center" aria-hidden="true"></i>,
                    
                }))}
                style={{ height: "20vh" }}
                getRowClick={SelectDroftItem}

            />
        </>
    )
}
