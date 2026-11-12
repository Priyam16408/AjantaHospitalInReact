import React, { useEffect, useState } from 'react'
import Input from '../../../components/formComponent/Input'
import { ViewPurchaseOrderAddRemark, ViewPurchaseOrderBindPORemark } from '../../../networkServices/Purchase'
import { notify } from '../../../utils/ustil2'
import Tables from '../../../components/UI/customTable'
import { useTranslation } from 'react-i18next'

const AddRemarks = ({val,setModalData}) => {
     let [t] = useTranslation()
     const [values,setValues]=useState({
        remarks:"",
        
      })
      
     const [tableData,setTableData]=useState([])
     console.log("tableData",tableData)
        const handleChange = (e) => {
        
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }))
    }
      const ViewThead = [
        { name: t("S.No."), width: "3%" },
        { name: t("PO No"), width: "7%" },
        { name: t("Remark"), width: "7%" },
        { name: t("EntryBy"), width: "7%" },
        { name: t("EntryDate"), width: "7%" },
      
    ];

    const addRemark = async (val) => {
        
        const payload={
      "pOrderNo": val?.PurchaseOrderNo,
      "remark": values?.remarks
    }
        try {
          const response = await ViewPurchaseOrderAddRemark(payload);
          if(response?.success){
            notify(response?.message,"success")
            setModalData((val) => ({ ...val, visible: false }))
          }
          else{
             notify(response?.message,"error")
          }
         
        } catch (error) {
          console.error(error);
        }
      };
    const getRemark = async (val) => {
debugger
        try {
          const response = await ViewPurchaseOrderBindPORemark(val?.PurchaseOrderNo);
          if(response?.success){
            setTableData(response?.data)
          
          }
          else{
             notify(response?.message,"error")
          }
         
        } catch (error) {
          console.error(error);
        }
      };
      useEffect(()=>{
getRemark(val)
      },[])
  return (
    <div> <Input
                        type="text"
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        value={values?.remarks}
                        onChange={handleChange}
                        lable={("Remarks")}
                        placeholder=" "
                        // respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                    />
                   <div className='d-flex  justify-content-end'>
                     <button
            className="btn btn-sm btn-success mx-1"
            onClick={()=>addRemark(val)}
          >
         {("Save")}
          </button>
            <button
            className="btn btn-sm btn-success mx-1"
            onClick={() => setModalData((val) => ({ ...val, visible: false }))}
          >
         {("Close")}
          </button>
                   </div> 
                 
                <div className='py-2'>
                        <Tables
  thead={ViewThead}

  tbody={
    tableData?.map((val,ind)=>({
 sn:ind+1,
    PurchaseOrderNo: val?.PurchaseOrderNo,
 
    Remark: val?.Remark,

    EntryBy: val?.EntryBy,
    EntryDate: val?.EntryDate,
    }))

}

/>
                </div>

                    </div>
  )
}

export default AddRemarks