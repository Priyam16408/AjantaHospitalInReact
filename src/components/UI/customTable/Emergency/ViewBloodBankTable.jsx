import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NestedRowTable from "../NestedRowTable";
import { BindItemStockDetailView, MedicineRequisitionGrdRequsition_RowCommand } from "../../../../networkServices/Emergency";
import moment from "moment";

const index = ({ tbody, tableHeight }) => {


    const [t] = useTranslation();
    const [bodyData, setBodyData] = useState([])

    const thead = [
        { name: "S.No.", width: "1%" },
        "Doctor",
        "BloodGroup",
        "Component",
        "ReqQty",
        "Issue Qty",
        "RejectQty",
        "PenQty",
        "Cross Matched Qty",
        "ReserveDate",
        "View",
    ]

    const seondThead = [
        { name: t("SNo"), width: "1%" }
    ]

    const handleClickEdit = async (val, index, isopen) => {
        let apiResp = await BindItemStockDetailView(val?.ServiceID)
        // console.log("BindItemStockDetailURL",apiResp)
        tbody[index]["isopen"] = !isopen
        if (apiResp?.success) {
            // tbody[index]["SecondBodyDataList"] = apiResp?.data
            tbody[index]["SecondBodyDataList"] = []
        }
        bindBodyData(tbody)
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
                }
                secondTbody.push(obj)
            })
            let obj = {}

            obj.sno = index + 1
            obj.Dname = val?.Dname,
                obj.BloodGroup = val?.BloodGroup,
                obj.ItemName = val?.ItemName,
                obj.Quantity = val?.RejectQty?val?.Quantity:"0",
                obj.IssueQty = val?.IssueQty?val?.IssueQty:"0",
                obj.RejectQty = val?.RejectQty?val?.RejectQty:"0",
                obj.PendingQuantity = val?.PendingQuantity?val?.PendingQuantity:"0",
                obj.EmName = val?.CrossMatchQty?val?.CrossMatchQty:"0",
                obj.print = moment(val?.ReserveDate).format("YYYY-MMM-DD"),

                obj.index = <span onClick={() => { handleClickEdit(val, index, val?.isopen) }}>
                    {val?.isopen > 0 ? <i className="fa fa-minus" aria-hidden="true"></i> : <i className="fa fa-plus" aria-hidden="true"></i>}
                </span>
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

    };

    return (
        <>
            <NestedRowTable
                thead={thead}
                seondThead={seondThead}
                tbody={bodyData}
                tableHeight={tableHeight}
                getRowClass={getRowClass}
            />


        </>
    );
};

export default index;
