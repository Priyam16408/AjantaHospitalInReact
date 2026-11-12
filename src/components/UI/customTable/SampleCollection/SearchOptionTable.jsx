import React, { useEffect, useState } from "react";
import Tables from "../../../UI/customTable/index";
import { useTranslation } from "react-i18next";

const index = ({ tbody, handleChangeCheckboxHeader, handleChangeCheckbox }) => {
    const isMobile = window.innerWidth <= 800;
    const [t] = useTranslation();
    // sampleCollectionManagement.SampleTransfer
    const thead = [
        { width: "1%", name: t("SNO") },
        t("SampleCollectionDate"),
        t("BarcodeNo"),
        t("PatientName"),
        t("UHID"),
        t("TestName"),
        { width: "1%", name: isMobile ? t("check") : <input type="checkbox" name='checkbox' style={{ "marginLeft": "3px" }} onChange={(e) => { handleChangeCheckboxHeader(e) }} /> }
    ]

    const [tbodyData, setTbodyData] = useState([])

    useEffect(() => {
        let data = []
        tbody?.map((val, index) => {
            console.log("aaaaaaaaaaaaaaa", val)
            let obj = {
                sno: index + 1,
                CollDate: val?.CollDate,
                BarcodeNo: val?.BarcodeNo,
                PatientName: val?.PatientName,
                UHID: val?.PatientID,
                TestName: val?.TestName,
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
