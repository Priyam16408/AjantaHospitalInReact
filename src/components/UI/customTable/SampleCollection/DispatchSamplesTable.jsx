import React, { useEffect, useState } from "react";
import Tables from "../../../UI/customTable/index";
import { useTranslation } from "react-i18next";

const index = ({ tbody, handleChangeCheckboxHeader, handleChangeCheckbox }) => {
    const isMobile = window.innerWidth <= 800;
    const [t] = useTranslation();
    const thead = [
        { width: "1%", name: t("sampleCollectionManagement.SampleTransfer.SNO") },
        t("sampleCollectionManagement.SampleTransfer.FromCentre"),
        t("sampleCollectionManagement.SampleTransfer.ToCenter"),
        t("sampleCollectionManagement.SampleTransfer.PatientName"),
        t("sampleCollectionManagement.SampleTransfer.UHID"),
        t("sampleCollectionManagement.SampleTransfer.BarcodeNo"),
        t("sampleCollectionManagement.SampleTransfer.TestName"),
        t("sampleCollectionManagement.SampleTransfer.TransferDate"),
        t("sampleCollectionManagement.SampleTransfer.TransferBy"),
        { width: "1%", name: isMobile ? t("sampleCollectionManagement.SampleTransfer.check") : <input type="checkbox" name='checkbox' style={{ "marginLeft": "3px" }} onChange={(e) => { handleChangeCheckboxHeader(e) }} /> }
    ]

    const [tbodyData, setTbodyData] = useState([])

    useEffect(() => {
        let data = []
        tbody?.map((val, index) => {
            let obj = {
                sno: index + 1,
                FromCentre: val?.FromCentre,
                ToCenter: val?.ToCenter,
                PName: val?.PName,
                UHID: val?.PatientID,
                BarcodeNo: val?.BarcodeNo,
                TestName: val?.TestName,
                TransferDate: val?.TransferDate,
                TransferedBy: val?.TransferedBy,
                Checked: <div >
                    <input type="checkbox" onChange={(e) => { handleChangeCheckbox(e, val, index) }} checked={val?.isChecked} />
                </div>
            }
            data.push(obj)
        })
        setTbodyData(data)
    }, [tbody])

    return (
        <>
            <Tables
                thead={thead}
                tbody={tbodyData}
                style={{maxHeight:"200px"}}
            // tableHeight={tableHeight}
            />
        </>
    );
};

export default index;
