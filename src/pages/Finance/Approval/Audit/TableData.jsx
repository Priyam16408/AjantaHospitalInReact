import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import Tables from "../../../../components/UI/customTable";
import Input from "../../../../components/formComponent/Input";
import Modal from "../../../../components/modalComponent/Modal";

import {  FinanceUpdateStatusBulk, SearchVoucher, UpdateVoucherPostingReview } from "../../../../networkServices/finance";
import { notify } from '../../../../utils/utils';
import Heading from '../../../../components/UI/Heading';

const TableData = ({tableVlues}) => {


  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([])
  const [t] = useTranslation();

  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });

  useEffect(() => {
    setTableData(tableVlues)
  }, [tableVlues])
  const handleCustomInput = (index, name, value) => {

    const updatedBodyData = [...tableData];
    updatedBodyData[index][name] = value;

    setTableData(updatedBodyData);
  };
  const handleReview = async () => {
    setReload(true)
    const payload = {
      "updatBulkData": selectedRows?.map((val, ind) => (
        {
          voucherNo: String(val?.VoucherNo),
          remark: String(val?.narration || ""),
          type:1,
          status:0
          // type:Number (values?.type?.value),
          // status: Number(values?.status?.value)
        }
      )),
      "reviewType": "0"
    }
    try {
      const response = await UpdateVoucherPostingReview(payload)
      if (response?.success) {
        setReload(false)
        notify(response?.message, "success")
      }
    } catch (error) {
      console.log("error", error)
    }
  };

  const handleVerify = async () => {
    setReload(true)
  const payload = selectedRows?.map((val) => {
    return {
      voucherNo: String(val?.VoucherNo || ""), // Fix bitwise OR issue
      remark: String(val?.narration || ""),
      // type:Number (values?.type?.value),
      //     status: Number(values?.status?.value)
      type:1,
          status: 1
    };
  });

    try {
      const response = await FinanceUpdateStatusBulk(payload)
      if (response?.success) {
        setReload(false)
        notify(response?.message, "success")
        setSelectedRows([]);
      }
    } catch (error) {
      console.log("error", error)
    }
  };
  const handleAuthorize = async () => {
    setReload(true)
  const payload = selectedRows?.map((val) => {
    return {
      voucherNo: String(val?.VoucherNo || ""), // Fix bitwise OR issue
      remark: String(val?.narration || ""),
      type:2,
          status: 1
      // type:Number (values?.type?.value),
      //     status: Number(values?.status?.value)
    };
  });
  

    try {
      const response = await FinanceUpdateStatusBulk(payload)
      if (response?.success) {
        setReload(false)
        notify(response?.message, "success")
        setSelectedRows([]);
      }
    } catch (error) {
      console.log("error", error)
    }
  };
  const handleUnVerify = async () => {
    setReload(true)
  const payload = selectedRows?.map((val) => {
    return {
      voucherNo: String(val?.VoucherNo || ""), // Fix bitwise OR issue
      remark: String(val?.narration || ""),
      // type:Number (values?.type?.value),
      //     status: Number(values?.status?.value)
      type:1,
      status:0
    };
  });

  
    try {
      const response = await FinanceUpdateStatusBulk(payload)
      if (response?.success) {
        setReload(false)
        notify(response?.message, "success")
        setSelectedRows([]);
      }
    } catch (error) {
      console.log("error", error)
    }
  };


  const handleCancel = async () => {
// done
setReload(true)
    const payload = selectedRows?.map((val, ind) => (
      {
        "voucherNo": String(val?.VoucherNo),
        "remark": String(val?.narration),
        "type": 0,
        "status": 1
      }
    ))

    try {
      const response = await FinanceUpdateStatusBulk(payload)
      if (response?.success) {
        setReload(false)
        notify(response?.message, "success")
        setSelectedRows([]);
      }
    } catch (error) {
      console.log("error", error)
    }
  };



  // Handle individual row selection
  const handleRowSelect = (val) => {
    setSelectedRows((prevSelectedRows) => {
      let updatedSelectedRows;

      if (prevSelectedRows.includes(val)) {
        updatedSelectedRows = prevSelectedRows.filter((item) => item !== val); // Remove value
      } else {
        updatedSelectedRows = [...prevSelectedRows, val]; // Add value
      }

      return updatedSelectedRows;
    });
  };

  // Handle "Select All" functionality
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allVoucherNos = tableData.map((val) => val); // Store all VoucherNos
      setSelectedRows(allVoucherNos);
    } else {
      setSelectedRows([]);
    }
  };

  const selectAllRef = useRef(null);
  const areAllSelected = selectedRows?.length === tableData?.length && tableData?.length > 0;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedRows.length > 0 && selectedRows.length < tableData.length;
    }
  }, [selectedRows, tableData?.length]);

  const isMobile = window.innerWidth <= 800;

  const thead = [
    { name: t("S.No."), width: "1%" },
    {
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          style={{ marginRight: "20px" }}
          ref={selectAllRef}
          checked={areAllSelected}
          onChange={handleSelectAll}
        />
      ),
      width: "1%",
    },
    { name: t("Voucher No."), width: "5%" },
    { name: t("Voucher Date"), width: "5%" },
  
    { name: t("Audit Remark"), width: "10%" },
   
  ];

  const handleView = async (VoucherNo) => {
    try {
      const response = await SearchVoucher( 2,VoucherNo );
      if (response?.success && response?.data) {
        console.log("Response Data:", response.data);
      
      }
    } catch (error) {
      console.error("Error fetching voucher details:", error);
    }
  };

  const getRowClass = (val) => {

    // if (val?.AppStatus === "True") {
      return val?.ParticularStatusColor
    // }
  };
  return (
    <>
      {modalData?.visible && (
        <Modal
          visible={modalData.visible}
          Header={"Details"}
          modalWidth={"90vw"}
          onHide={() => setModalData({ ...modalData, visible: false })}
          setVisible={() => setModalData({ ...modalData, visible: false })}
          footer={modalData?.footer}
        >
          {modalData?.Component}
        </Modal>
      )}
     









     <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card row">
        <Heading
            isBreadcrumb={false}
            title={t("View")}/>
        
          <div className="row p-2 g-2">
           <div className="col-md-6 col-12 border">
           <Tables
            style={{ maxHeight: "45vh" }}
            thead={thead}
            tbody={tableData?.map((val, index) => ({
              id: 1 + index,
              checkbox: (
                <input
                  type='checkbox'
                  style={{ marginRight: "20px" }}
                  checked={selectedRows.includes(val)} // Check by value, not index
                  onChange={() => handleRowSelect(val)} // Pass full row data (val), not index
                />
              ),
              voucherNo: val?.VoucherNo,
              voucherDate: val?.VoucherDate,
           
              AuditRemark: (
                <Input
                  type="text"
                  className="table-input"
                  name="narration" // Unique name
                  value={val?.narration} // Default empty string agar value na ho
                  removeFormGroupClass={true}
                  respclass="mt-1"
                  onChange={(e) => handleCustomInput(index, "narration", e.target.value)}
                />
              ),

            }))}

          />
           </div>
            <div className="col-md-6 col-12 border ">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, velit.
           </div>
          </div>
        </div>
        </div>








     
         
       {
//        ( values.type?.value===2 &&  values?.status?.value==="1" )?(""):(
//         <div className={"col-12 mt-2 mb-2 text-right"}>
//         {
//   values.type?.value === 2 && values?.status?.value === "0" ? (
//     <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleAuthorize}>
//       {t("Authorize")}
//     </button>
//   ) : values.type?.value === 1 && values?.status?.value === "0" ? (
//     <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleVerify}>
//       {t("Verify")}
//     </button>
//   ) : values.type?.value === 1 && values?.status?.value === "1" ? (
//     <button className="btn btn-primary btn-sm px-4 ml-1" onClick={handleUnVerify}>
//       {t("Un Verify")}
//     </button>
//   ) : null
// }

         
//           <button
//             className="btn btn-primary btn-sm px-4 ml-1"
//             onClick={handleReview}
//           >
//             {t("Review")}
//           </button>
//           <button
//             className="btn btn-primary btn-sm px-4 ml-1"
//             onClick={handleCancel}
//           >
//             {t("Voucher Cancel")}
//           </button>
//         </div>
//        )
       }

    


    </>
  );
};

export default TableData;
