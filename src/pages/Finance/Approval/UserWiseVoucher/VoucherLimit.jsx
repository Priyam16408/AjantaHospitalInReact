import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  filterByTypes,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { PurchaGetBindAllCenter } from "../../../../networkServices/Purchase";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import Input from "../../../../components/formComponent/Input";
import {
  BindVoucherBillingScreenControls,
  LimitBindMapping,
  VoucherLimitSaveMapping,
} from "../../../../networkServices/finance";
import VoucherTable from "./VoucherTable";
import { Tooltip } from "primereact/tooltip";

const VoucherLimit = () => {
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();
  const [bindMapping, setBindMapping] = useState([]);
  const localData = useLocalStorage("userData", "get");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectItem, setSelectItem] = useState([]);
  const [amountLimits, setAmountLimits] = useState({});
  const [select, setSelect] = useState([]);
  const selectAllRef = useRef(null);

  const areAllSelected =
    selectedRows.length === bindMapping.length && bindMapping.length > 0;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRows.length > 0 && selectedRows.length < bindMapping.length;
    }
  }, [selectedRows, bindMapping.length]);

  useEffect(() => {
    updateSelectItem(selectedRows);
  }, [selectedRows, bindMapping]);

  // Toggle individual row selection using index
  const handleRowSelect = (index) => {
    setSelectedRows((prevSelectedRows) => {
      let updatedSelectedRows;
      if (prevSelectedRows.includes(index)) {
        updatedSelectedRows = prevSelectedRows.filter((i) => i !== index);
      } else {
        updatedSelectedRows = [...prevSelectedRows, index];
      }
      return updatedSelectedRows;
    });
  };

  // Function to update selectItem based on selectedRows
  const updateSelectItem = (selectedIndices) => {
    const selectedValue = selectedIndices
      .map((index) => bindMapping[index]?.val)
      .filter(Boolean); // Ensure PurchaseRequestNo exists
    setSelectItem(selectedValue);
  };

  // Toggle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndices = bindMapping.map((_, index) => index);
      setSelectedRows(allIndices);
    } else {
      setSelectedRows([]);
    }
  };

  const [values, setValues] = useState({
    userType: {},
    employee: {},
    allCenter: {
      CentreID: 1,
      CentreName: "MOHANDAI OSWAL HOSPITAL",
      IsDefault: 0,
      label: "MOHANDAI OSWAL HOSPITAL",
      value: 1,
    },
  });

  const [dropDownState, setDropDownState] = useState({
    GetDepartMent: [],
    GetBindAllCenter: [],
    BindEmplyee: [],
  });

  const ApprovalLimitBindMapping = async () => {
    const centreID = String(values?.allCenter?.value);

    const userType = values?.userType?.value;
    const eid = values?.employee?.value;
    if (!centreID) {
      notify("Center is required!", "error");
      return;
    }

    if (!userType) {
      notify("userType is required!", "error");
      return;
    }
    if (!eid) {
      notify("Employee is required!", "error");
      return;
    }
    try {
      const payload = {
        centreID: centreID,
        eid: eid,
        userType: userType,
      };
      const response = await LimitBindMapping(payload);
      if (response?.success) {
        setBindMapping(response?.data);

        // **Important:** Set initial selected rows based on IsActive property
        const initiallySelectedRows = response?.data
          .map((val, index) => (val?.IsActive === 1 ? index : null)) // Modified condition here
          .filter((index) => index !== null);

        setSelectedRows(initiallySelectedRows);
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const BindMapping = async () => {
    try {
      const payload = {
        centreID: Number(values?.allCenter?.value),
        employeeID: String(values?.employee?.value || ""),
        utid: String(values?.userType?.value),
        vmappingList: select.map((val) => ({
          centreID: Number(values?.allCenter?.value),
          employeeID: String(val?.EmployeeID || ""),
          userType: String(values?.userType?.value),
          voucherTypeID: String(val?.VoucherTypeID),
          amountLimit: String(val?.AmountLimit),
        })),
      };
      const response = await VoucherLimitSaveMapping(payload);
      if (response?.success) {
        notify(response?.message, "success");
        setBindMapping([]);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const getPurchaGetBindAllCenterAPI = async () => {
    try {
      const GetBindAllCenter = await PurchaGetBindAllCenter();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: handleReactSelectDropDownOptions(
          GetBindAllCenter?.data,
          "CentreName",
          "CentreID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1);
    if (apiResp?.success) {
      const BindEmplyee = filterByTypes(
        apiResp?.data,
        [11],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      setDropDownState((val) => ({
        ...val,
        BindEmplyee: BindEmplyee,
      }));
    } else {
      // setList([])
    }
  };

  useEffect(() => {
    getPurchaGetBindAllCenterAPI();
    bindListData();
  }, []);

  const handleReactChange = (name, e, key) => {
    // console.log("e",e)
    setValues((val) => ({ ...val, [name]: e }));

    // if(name== "userType" || name=="employee"){
    //   ApprovalLimitBindMapping()
    // }
  };

  useEffect(() => {
    if (values?.userType?.value && values?.employee?.value)
      ApprovalLimitBindMapping();
  }, [values?.userType, values?.employee]);
  // Handle amount limit change for each voucher
  const handleAmountLimitChange = (index, value) => {
    setAmountLimits((prevLimits) => ({
      ...prevLimits,
      [index]: value,
    }));
  };

  useEffect(() => {
    // Log the selected items and their amount limits whenever selectedRows change
    const selectedData = selectedRows.map((index) => ({
      ...bindMapping[index],
      AmountLimit: amountLimits[index] || bindMapping[index]?.AmountLimit || 0,
    }));
    setSelect(selectedData);
    console.log("Selected Items with Amount Limits:", selectedData);
  }, [selectedRows, amountLimits, bindMapping]);
  console.log("selectedData", select);
  const isMobile = window.innerWidth <= 800;
 

  const handleChangeHead = (e) => {
    const { name, value } = e?.target
    let updatedtbl = bindMapping?.map((val) => {
      val[name] = value
      return val
    })
    setBindMapping(updatedtbl)
  }
  const THEAD = [
    {
      width: "0.5%",
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          ref={selectAllRef} // Ref for indeterminate state
          checked={areAllSelected}
          onChange={handleSelectAll}
          className="ml-1"
        />
      ),
    },

    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("Voucher Code") },
    { width: "5%", name: t("Voucher List") },
    // { width: "5%", name: t("Amount Limit") },
    {
         width: "3%",
         name: isMobile ? t("Amount Limit") :
           <>
             <Tooltip
               target={`#AmountLimit`}
               position="top"
               content={t("AmountLimit")}
               event="focus"
               className="ToolTipCustom"
             />
             <input
               type="number"
               style={{textAlign:"start"}}
               className="table-input"
               id="AmountLimit"
               placeholder={t("Amount Limit")}
               name="AmountLimit"
               onChange={handleChangeHead}
             />
           </>
         ,
       },
    { width: "5%", name: t("Entry Date") },
    { width: "5%", name: t("Entry By") },
  ];

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Auto Purchase Request Behalf Of Sales")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            requiredClassName="required-fields"
            placeholderName={t("Center To")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={values?.allCenter?.value}
          />
          <ReactSelect
            placeholderName={t("User Type")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"userType"}
            name={"userType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "Entry By", value: "E" },
              { label: "Verify By", value: "V" },
              { label: "Auth By", value: "A" },
              { label: "Audit By", value: "AU" },
              { label: "Reconsile Verify By", value: "RV" },
              { label: "Reconsile Auth By", value: "RA" },
            ]}
            requiredClassName="required-fields"
            value={values?.userType?.value}
          />

          <ReactSelect
            requiredClassName="required-fields"
            placeholderName={t("Employee")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"employee"}
            name={"employee"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.BindEmplyee}
            // dynamicOptions={[{label:"Select",value:"0"},...dropDownState?.BindEmplyee]}
            value={values?.employee?.value}
          />
          {/* <div className="col-xl-2 col-md-3 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mr-1"
              onClick={ApprovalLimitBindMapping}
            >
              {t("Search")}
            </button>
          </div> */}
        </div>
      </div>

  {
    bindMapping?.length>0 ?       <div className="card">
    <div className=" mt-2 spatient_registration_card">
      <Heading title={t("Voucher Mapping")} isBreadcrumb={false} />
      <Tables
        isSearch={true}
        thead={THEAD}
        tbody={bindMapping?.map((val, index) => ({
          checkbox: (
            <input
              type="checkbox" b  
              checked={selectedRows.includes(index)}
              onChange={() => handleRowSelect(index)}
            />
          ),
          sno: index + 1, 
          VoucherCode: val?.VoucherCode,      
          VoucherList: val?.VoucherName,
          AmountLimit: (
            <Input
              className="table-input"
              name="Remarks"
              removeFormGroupClass={true}
              type="number"
              value={
                amountLimits[index] !== undefined
                  ? amountLimits[index]
                  : val?.AmountLimit
                    ? val?.AmountLimit
                    : "0"
              }
              onChange={(e) =>
                handleAmountLimitChange(index, e.target.value)
              }
            />
          ),
          EntryDate: val?.LastUpdatedDate,
          EntryBy: val?.LastUpdatedBy,
        }))}
        style={{ maxHeight: "50vh" }}
      />
      {bindMapping.length > 0 && (
        <div
          className="p-2"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            className="btn btn-sm btn-primary mr-1"
            onClick={BindMapping}
          >
            {t("Save")}
          </button>
        </div>
      )}
    </div>
  </div>:""
  }
      {/* <VoucherTable/> */}
    </div>
  );
};

export default VoucherLimit;

// import React, { useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { filterByTypes, handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
// import ReactSelect from "../../../../components/formComponent/ReactSelect";
// import { PurchaGetBindAllCenter } from "../../../../networkServices/Purchase";
// import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
// import Heading from "../../../../components/UI/Heading";
// import Tables from "../../../../components/UI/customTable";
// import Input from "../../../../components/formComponent/Input";
// import { BindVoucherBillingScreenControls, LimitBindMapping, VoucherLimitSaveMapping } from "../../../../networkServices/finance";
// import VoucherTable from "./VoucherTable";

// const VoucherLimit = () => {
//   const ip = useLocalStorage("ip", "get");
//   const [t] = useTranslation();
//   const [bindMapping, setBindMapping] = useState([]);
//   const localData = useLocalStorage("userData", "get");
//   // const [selectedRows, setSelectedRows] = useState([]); // Indices of selected rows
//   const [selectedRows, setSelectedRows] = useState(() => {
//     return bindMapping // assuming `data` is your array of rows
//       .map((val, index) => (val?.IsActive ? index : null))
//       .filter((index) => index !== null);
//   });
//   const [selectItem, setSelectItem] = useState([]); // Array of PurchaseRequestNo values
//   const [amountLimits, setAmountLimits] = useState({}); // Store amount limits for each voucher
//   const [select, setSelect] = useState([])
//   const selectAllRef = useRef(null);

//   const areAllSelected = selectedRows.length === bindMapping.length && bindMapping.length > 0; // Added check for empty array

//   useEffect(() => {
//     if (selectAllRef.current) {
//       selectAllRef.current.indeterminate = selectedRows.length > 0 && selectedRows.length < bindMapping.length;
//     }
//   }, [selectedRows, bindMapping.length]);

//   // Function to update selectItem based on selectedRows
//   const updateSelectItem = (selectedIndices) => {
//     const selectedValue = selectedIndices.map(index => bindMapping[index]?.val).filter(Boolean); // Ensure PurchaseRequestNo exists
//     setSelectItem(selectedValue);
//   };

//   // Toggle individual row selection using index
//   // const handleRowSelect = (index) => {
//   //   setSelectedRows((prevSelectedRows) => {
//   //     let updatedSelectedRows;

//   //     if (prevSelectedRows.includes(index)) {
//   //       updatedSelectedRows = prevSelectedRows.filter((i) => i !== index); // Remove
//   //     } else {
//   //       updatedSelectedRows = [...prevSelectedRows, index]; // Add
//   //     }
//   //     return updatedSelectedRows;
//   //   });
//   // };
//   const handleRowSelect = (index) => {
//   setSelectedRows((prevSelectedRows) => {
//     let updatedSelectedRows;
//     if (prevSelectedRows.includes(index)) {
//       updatedSelectedRows = prevSelectedRows.filter((i) => i !== index); // Remove
//     } else {
//       updatedSelectedRows = [...prevSelectedRows, index]; // Add
//     }
//     return updatedSelectedRows;
//   });
// };

//   useEffect(() => {
//     updateSelectItem(selectedRows)
//   }, [selectedRows, bindMapping])

//   // Toggle "Select All" checkbox
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const allIndices = bindMapping.map((_, index) => index);
//       setSelectedRows(allIndices);
//     } else {
//       setSelectedRows([]);
//     }
//   };
//   console.log("selectItem", selectItem)

//   const [values, setValues] = useState({
//     userType: { label: "Entry By", value: "1" },
//     employee: {label:"Select",value:"0"},
//     allCenter: {
//       CentreID: 1,
//       CentreName: "MOHANDAI OSWAL HOSPITAL",
//       IsDefault: 0,
//       label: "MOHANDAI OSWAL HOSPITAL", value: 1
//     },

//   });

//   const [dropDownState, setDropDownState] = useState({
//     GetDepartMent: [],
//     GetBindAllCenter: [],
//     BindEmplyee: []
//   });

//   console.log("values",values)
//   const ApprovalLimitBindMapping = async () => {

//     try {
//       const payload = {
//         "centreID": String(values?.allCenter?.value),
//         "eid": values?.employee?.value,
//         "userType": values?.userType?.value
//       }
//       const response = await LimitBindMapping(payload);
//       if (response?.success) {
//         setBindMapping(response?.data)
//         setSelectedRows([])
//       }

//     } catch (error) {
//       console.log(error, "SomeThing Went Wrong");
//     }
//   };
//   console.log("values", values)
//   const BindMapping = async () => {

//     try {
//       const payload = {
//         "centreID": Number(values?.allCenter?.value),
//         "employeeID": String(values?.employee?.value ||""),
//         "utid": String(values?.userType?.value),
//         "vmappingList": select.map((val) => (
//           {

//             "centreID": Number(values?.allCenter?.value),
//             "employeeID": String(val?.EmployeeID ||""),
//             "userType": String(values?.userType?.value),
//             "voucherTypeID": String(val?.VoucherTypeID),
//             "amountLimit": String(val?.AmountLimit)
//           }
//         ))
//       }
//       const response = await VoucherLimitSaveMapping(payload);
//       if (response?.success) {
//         notify(response?.message, "Success")
//         setBindMapping([])
//       } else {
//         notify(response?.message, "error")
//       }

//     } catch (error) {
//       console.log(error, "SomeThing Went Wrong");
//     }
//   };
//   const getPurchaGetBindAllCenterAPI = async () => {
//     try {
//       const GetBindAllCenter = await PurchaGetBindAllCenter();
//       setDropDownState((val) => ({
//         ...val,
//         GetBindAllCenter: handleReactSelectDropDownOptions(
//           GetBindAllCenter?.data,
//           "CentreName",
//           "CentreID"
//         ),
//       }));
//     } catch (error) {
//       console.log(error, "SomeThing Went Wrong");
//     }
//   };

//   const bindListData = async () => {
//     let apiResp = await BindVoucherBillingScreenControls(1)
//     if (apiResp?.success) {
//       const BindEmplyee = filterByTypes(apiResp?.data, [11], ["TypeID"], "TextField", "ValueField")
//       setDropDownState((val) => ({
//         ...val,
//         BindEmplyee: BindEmplyee,
//       }));
//     } else {
//       // setList([])
//     }
//   }

//   useEffect(() => {
//     getPurchaGetBindAllCenterAPI();
//     bindListData()
//   }, []);

//   const handleReactChange = (name, e, key) => {

//     setValues((val) => ({ ...val, [name]: e }));

//   };

//   // Handle amount limit change for each voucher
//   const handleAmountLimitChange = (index, value) => {
//     setAmountLimits(prevLimits => ({
//       ...prevLimits,
//       [index]: value
//     }));
//   };

//   useEffect(() => {
//     // Log the selected items and their amount limits whenever selectedRows change
//     const selectedData = selectedRows.map(index => ({
//       ...bindMapping[index],
//       AmountLimit: amountLimits[index] || bindMapping[index]?.AmountLimit || 0
//     }));
//     setSelect(selectedData)
//     console.log("Selected Items with Amount Limits:", selectedData);
//   }, [selectedRows, amountLimits, bindMapping]);
//   console.log("selectedData", select)

//   const THEAD = [

//     {
//       width: "0.5%", name: <input type="checkbox"
//         ref={selectAllRef} // Ref for indeterminate state
//         checked={areAllSelected}
//         onChange={handleSelectAll}
//       />
//     },

//     { width: "1%", name: t("SNo") },
//     { width: "5%", name: t("Voucher Code") },
//     { width: "5%", name: t("Voucher List") },
//     { width: "5%", name: t("Amount Limit") },
//     { width: "5%", name: t("Entry Date") },
//     { width: "5%", name: t("Entry By") },

//   ];

//   return (
//     <div className="mt-2 spatient_registration_card">
//       <div className="patient_registration card">
//         <Heading
//           title={t("Auto Purchase Request Behalf Of Sales")}
//           isBreadcrumb={false}
//         />
//         <div className="row p-2">
//           <ReactSelect
//             placeholderName={t("Center To")}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-6 col-12"
//             id={"allCenter"}
//             name={"allCenter"}
//             removeIsClearable={true}
//             handleChange={(name, e) => handleReactChange(name, e)}
//             dynamicOptions={dropDownState?.GetBindAllCenter}
//             value={values?.allCenter?.value}
//           />
//           <ReactSelect
//             placeholderName={t("User Type")}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-6 col-12"
//             id={"userType"}
//             name={"userType"}
//             removeIsClearable={true}
//             handleChange={(name, e) => handleReactChange(name, e)}
//             dynamicOptions={[
//               { label: "Select", value: "0" },
//               { label: "Entry By", value: "E" },
//               { label: "Verify By", value: "V" },
//               { label: "Auth By", value: "A" },
//               { label: "Audit By", value: "AU" },
//               { label: "Reconsile Verify By", value: "RV" },
//               { label: "Reconsile Auth By", value: "RA" },
//             ]}
//             value={values?.userType?.value}

//           />

//           <ReactSelect
//             placeholderName={t("Employee")}
//             searchable={true}
//             respclass="col-xl-2 col-md-3 col-sm-6 col-12"
//             id={"employee"}
//             name={"employee"}
//             removeIsClearable={true}
//             handleChange={(name, e) => handleReactChange(name, e)}
//             dynamicOptions={[{label:"Select",value:"0"},...dropDownState?.BindEmplyee]}
//             value={values?.employee?.value}
//           />
//           <div className="col-xl-2 col-md-3 col-sm-6 col-12">
//             <button
//               className="btn btn-sm btn-primary mr-1"
//               onClick={ApprovalLimitBindMapping}
//             >
//               {t("Search")}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="card">
//         <div className=" mt-2 spatient_registration_card">
//           <Heading title={t("Voucher Mapping")} isBreadcrumb={false} />
//           <Tables
//             isSearch={true}
//             thead={THEAD}
//             tbody={bindMapping?.map((val, index) => ({
//               checkbox: (
//                 <input
//                 type="checkbox"
//                 checked={selectedRows.includes(index)} // Use state to control it
//                 onChange={() => handleRowSelect(index)}
//               />
//                 // <input
//                 //   type="checkbox"
//                 //   checked={val?.IsActive}
//                 //   // checked={selectedRows.includes(index)}
//                 //   onChange={() => handleRowSelect(index)}
//                 // />
//               ),
//               sno: index + 1,
//               VoucherCode: val?.VoucherCode,
//               VoucherList: val?.VoucherName,
//               AmountLimit: <Input
//                 className="table-input"
//                 name="Remarks"
//                 removeFormGroupClass={true}
//                 type="text"
//                 value={amountLimits[index] !== undefined ? amountLimits[index] : val?.AmountLimit ? val?.AmountLimit : "0"}
//                 onChange={(e) => handleAmountLimitChange(index, e.target.value)}
//               />,
//               EntryDate: val?.LastUpdatedDate,
//               EntryBy: val?.LastUpdatedBy,

//             }))}

//             style={{ maxHeight: "50vh" }}
//           />
//           {
//             bindMapping.length > 0 &&
//             <div className="p-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
//               <button
//                 className="btn btn-sm btn-primary mr-1"
//                 onClick={BindMapping}
//               >
//                 {t("Save")}
//               </button>

//             </div>
//           }

//         </div>

//       </div>
// {/* <VoucherTable/> */}
//     </div>
//   )
// }

// export default VoucherLimit
