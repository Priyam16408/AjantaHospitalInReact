import React, { useState } from 'react'
import Tables from '../../../components/UI/customTable'

import { useTranslation } from 'react-i18next';

const ViewItem = ({data}) => {
   let [t] = useTranslation()
    const thead = [
        { name: t("PR No"), width: "3%" },
        { name: t("Item Name"), width: "7%" },
        { name: t("Available Qty"), width: "10%" },
        { name: t("Approved Qty"), width: "10%" },
        { name: t("Requested Qty"), width: "3%" },
        { name: t("Last Supplier Name"), width: "3%" },
        { name: t("Raised User"), width: "3%" },
        
      ];
  return (
    <div>
        <Tables 
        thead={thead}
        tbody={
          data.map((val,ind)=>(
            {
              "PR No.":val.PurchaseRequestNo,
              "Item Name":val.ItemName,
              "Available Qty":val.InHandQty?val.InHandQty:"0",
              "Approved Qty":val.ApprovedQty?val.ApprovedQty:"0",
              "Quantity":val.RequestedQty?val.RequestedQty:"0",
              "Last Supplier Name":val.LedgerName,
              "Raised User":val.RaisedUser ||"",
              colorcode: val?.PRDStatus===2 ? "#f88891" :"#59a259",
            }
          )
        )
        }colorcode
        />
    </div>
  )
}

export default ViewItem