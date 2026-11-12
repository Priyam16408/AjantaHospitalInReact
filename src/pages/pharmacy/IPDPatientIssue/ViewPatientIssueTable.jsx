import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NestedRowTable from "../../../components/UI/customTable/NestedRowTable";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { ReprintSVG } from "../../../components/SvgIcons";
import { OpenPDFURL } from "../../../networkServices/PDFURL";

const ViewPatientIssueTable = ({ tbody, tableHeight }) => {

    const localdata = useLocalStorage("userData", "get")
    const [t] = useTranslation();
    const [bodyData, setBodyData] = useState([])

    const thead = [
        { name: t("EmergencyModule.SNo"), width: "1%" },
        { name: t("UHID	"), width: "10%" },
        { name: t("Patient Name"), width: "10%" },
        { name: t("Requisition Date"), width: "10%" },
        { name: t("Requisition No."), width: "10%" },
        { name: t("From Department"), width: "10%" },
        { name: t("User"), width: "10%" },
        { name: t("Requisition Type"), width: "10%" },
        { name: t("View"), width: "10%" },
        { name: t("View Details"), width: "10%" },
        { name: t("Print Label"), width: "1%" },
    ]

    const seondThead = [
        { name: t("EmergencyModule.SNo"), width: "1%" },
        t("EmergencyModule.DepartmentFrom"),
        t("EmergencyModule.DepartmentTo"),
        { name: "Item Name", width: "1%" },
        { name: "Unit Type", width: "1%" },
        { name: t("EmergencyModule.RequestedQty"), width: "1%" },
        { name: t("EmergencyModule.ReceivedQty"), width: "1%" },
        { name: t("EmergencyModule.PendingQty"), width: "1%" },
        { name: t("EmergencyModule.RejectedQty"), width: "1%" },
        { name: "Narration", width: "1%" },
        { name: "Date", width: "1%" },

    ]

    const handleClickEdit = async (val, index, isopen) => {

        // let payload = {
        //     "indentNo": val?.IndentNo,
        //     "tid": val?.TransactionID,
        //     "commandName": "AView"
        // }

        // let apiResp = await MedicineRequisitionGrdRequsition_RowCommand(payload)
        // tbody[index]["isopen"] = !isopen
        // if (apiResp?.success) {
        //     tbody[index]["SecondBodyDataList"] = apiResp?.data
        // }
        // bindBodyData(tbody)
    }

    const handleClickReport = (val) => {
        // OpenPDFURL("ViewReqEmgPrint", val?.TransactionID);
    }



    const bindBodyData = (tbody) => {
        let list = []
        tbody?.map((val, index) => {
            let secondTbody = []

            val?.SecondBodyDataList?.length > 0 && val?.SecondBodyDataList?.map((item, i) => {
                let obj = {
                    sno: i + 1,
                    deptFrom: item?.deptFrom,
                    deptTo: item?.deptTo,
                    itemName: item?.itemName,
                    unitType: item?.unitType,
                    reqQty: item?.reqQty,
                    receiveQty: item?.receiveQty,
                    pendingQty: item?.reqQty,
                    rejectQty: item?.rejectQty,
                    Narration: item?.narration,
                    dtEntry: item?.dtEntry,

                }
                secondTbody.push(obj)
            })
            let obj = {}

            obj.sno = index + 1
            obj.dtentry = val?.dtentry,
                obj.IndentNo = val?.IndentNo,
                obj.Deptfrom = val?.Deptfrom,
                obj.EmpName = val?.EmpName,
                obj.EmpNamezx = val?.EmpName,
                obj.EcmpName = val?.EmpName,
                obj.EmpNeame = val?.EmpName,
                obj.EmpNamde = val?.EmpName,
                // obj.colorcode = "rgb(196, 173, 233)",

                obj.index = <span onClick={() => { handleClickEdit(val, index, val?.isopen) }}>
                    {val?.isopen > 0 ? <i className="fa fa-minus" aria-hidden="true"></i> : <i className="fa fa-plus" aria-hidden="true"></i>}
                </span>
            obj.print = <span onClick={() => { handleClickReport(val) }}><ReprintSVG /></span>,
                obj.subRow = { subRowList: secondTbody, isopen: val?.isopen }
            list.push(obj)
        })
        setBodyData(list)
    }
    useEffect(() => {
        bindBodyData(tbody)
    }, [tbody])




    const getRowClass = (val) => {
        if (val?.STATUS === "Completed") {
            return "medicationTbaleRowColor"
        }
        if (val?.STATUS === "Stopped") {
            return "medicationTbaleRowColorStopped"
        }
        if (val?.STATUS === "Not Issued") {
            return "medicationTbaleRowColorNotIssued"
        }
        if (val?.STATUS === "Running") {
            return "medicationTbaleRowColorRunning"
        }
        if (val?.STATUS === "Today Medicine") {
            return "medicationTbaleRowColorTodayMedicine"
        }
    };

    return (
        <>
            <NestedRowTable
                thead={thead}
                seondThead={seondThead}
                tbody={bodyData}
                // tableHeight={tableHeight}
                getRowClass={getRowClass}
            />


        </>
    );
};

export default ViewPatientIssueTable;
