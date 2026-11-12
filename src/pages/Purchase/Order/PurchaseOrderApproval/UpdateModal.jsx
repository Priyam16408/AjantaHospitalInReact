import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import SaveButton from "@components/UI/SaveButton";
import CancelButton from '../../../../components/UI/CancelButton';
import { CancelPurchaseOrderItems, PurchaseOrderApprovalGetPurchaseOrderDetails, PurchaseOrderApprovalRejectPurchaseOrder, PurchaseOrderApprovalUpdatePurchaseOrder } from '../../../../networkServices/purchaseDepartment';
import { notify } from '../../../../utils/utils';
import Tables from '../../../../components/UI/customTable';
import { useLocalStorage } from '../../../../utils/hooks/useLocalStorage';
const UpdateModal = ({ handleClose, inputData, setTbodyPurchaseOrders }) => {
    const [t] = useTranslation();
    const [inputs, setInputs] = useState(inputData)
    const ip = useLocalStorage("ip", "get")
    const [tbodyItems, setTbodyItems] = useState([]);
    // const handlechange = (e) => {
    //     debugger
    //     setTbodyItems((val) => ({ ...val, [e.target.name]: e.target.value }))
    //     console.log(e.target.name, "✔✔🤦‍♀️", e.target.value)
    // }

    // console.log("inputDatainputData", inputData)


    const getPurchaseOrderDetails = async (purchaseOrderNumber) => {

        try {

            let apiResp = await PurchaseOrderApprovalGetPurchaseOrderDetails(purchaseOrderNumber);
            if (apiResp?.success) {
                // debugger
                setTbodyItems(apiResp.data)
                // setInputs(inputs?.quantity = apiResp.data[0]?.ApprovedQty)
                // setInputs((prev) => ({
                //     ...prev,
                //     quantity: apiResp.data[0]?.ApprovedQty,
                // }));

                console.log(apiResp.data)
            }
            else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.log(apiResp?.message);
            console.log(error);
            notify(apiResp?.message, "error");
        }


    }
    const CancelPurchaseOrder = async (item) => {
console.log("item",item)
debugger
      const payload={
  "purchaseOrderDetailID": String(item?.PurchaseOrderDetailID),
  "poNo": String(item?.PurchaseOrderNo),
  "itemID": String(item?.ItemID)
}

        try {

            let apiResp = await CancelPurchaseOrderItems(payload);
            if (apiResp?.success) {

               notify(apiResp?.message,"success")
                 handleClose();
            }
            else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.log(apiResp?.message);
            console.log(error);
            notify(apiResp?.message, "error");
        }


    }

    const orderQuantityUpdate = async () => {

        try {
            // let payload = [
            //     {
            //         "purchaseOrderDetailsID": tbodyItems[0]?.PurchaseOrderDetailID,
            //         "quantity": inputs?.quantity,
            //         "purchaseOrderNo": tbodyItems[0]?.PurchaseOrderNo,
            //         "ipAddress": ip
            //     }

            // ]

            let payload = tbodyItems?.map((item) => ({
                "purchaseOrderDetailsID": item?.PurchaseOrderDetailID,
                "quantity": item?.ApprovedQty,
                "purchaseOrderNo": item?.PurchaseOrderNo,
                "ipAddress": ip
            }))

            let apiResp = await PurchaseOrderApprovalUpdatePurchaseOrder(payload);
            if (apiResp?.success) {

                notify(apiResp?.message, "success");
                handleClose();
                // setTbodyItems(apiResp.data)
                console.log(apiResp.data)

            }
            else {
                notify(apiResp?.message, "error");
            }
        } catch (error) {
            console.log(apiResp?.message);
            console.log(error);
            notify(apiResp?.message, "error");
        }


    }

    useEffect(() => {
        getPurchaseOrderDetails(inputData?.PurchaseOrderNo)
    }, [])

    return (<>
        <div className="row p-2">
            <Tables
                thead={
                    ["S.no",
                        "Item Name",
                        "Unit Price",
                        "Amount",
                        "MRP",
                        "Quantity",
                        "Reject"
                    ]
                }
                tbody={
                    tbodyItems?.length> 0 &&
                    tbodyItems?.map((item, index) => ({
                        sNo: index + 1,
                        itemName: item?.ItemName,
                        UnitPrice: item?.BuyPrice,
                        Amount: item?.Amount,
                        MRP: item?.MRP?.toFixed(2),
                        quantiy: (
                            <Input
                                type="number"
                                className="table-input required-fields"
                                // id="quantity"
                                name="ApprovedQty"
                                disabled={true}
                                removeFormGroupClass={true}
                                value={Math.floor(item?.ApprovedQty)}
                                onChange={(e)=>{
                                        setTbodyItems((prev) => {
                                            const updatedItems = [...prev];
                                            updatedItems[index] = {
                                                ...updatedItems[index],
                                                ApprovedQty: e.target.value,
                                            };
                                            return updatedItems;
                                        });
                                }}

                                respclass=""
                            />
                        ),
                        reject: (
                            <span onClick={()=>CancelPurchaseOrder(item)}>
                                <i className="fa fa-trash text-danger" />
                            </span>
                        ),
                    }))
                }

            />
        </div>
        <div className="ftr_btn">
            <SaveButton btnName={"Save"}
                onClick={orderQuantityUpdate}
            />
            <CancelButton
                cancleBtnName={"Cancel"}
                onClick={() => handleClose()}
            />
        </div>

    </>
    )
}

export default UpdateModal;
