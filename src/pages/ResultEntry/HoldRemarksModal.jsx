// // import React, { useEffect, useState } from "react";
// // import { useTranslation } from "react-i18next";
// // import TextAreaInput from "../../components/formComponent/TextAreaInput";
// // import ReactSelect from "../../components/formComponent/ReactSelect";
// // import { handleReactSelectDropDownOptions } from "../../utils/utils";
// // import { GetUnApproveReason, SaveSampleRejectReasonApi } from "../../networkServices/resultEntry";
// // import { notify } from "../../utils/ustil2";
// // export default function HoldRemarksModal({}) {

// //   const [t] = useTranslation();
// //   const [inputs, setInputs] = useState();
// //     const [isInput, setIsInput] = useState(false);
// //     const [newReason, setNewReason] = useState("");
// //   // const handlechange = (e) => {
// //   //   setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
// //   // };

// //   const handleChange = (e) => {
// //     setNewReason(e?.target?.value);
// //   };

// //   const handleReactSelect = (name, e) => {
// //     const selectedValue = e?.value;
// //     setInputs((val) => ({ ...val, [name]: selectedValue }));
// //     if (selectedValue === "Other") {
// //       setIsInput(true);
// //     } else {
// //       setIsInput(false);
// //       setNewReason("");
// //     }
// //   };

// //     const [reasons, setReasons] = useState([]);

// //      const handleGetReason = async () => {
// //         try {
// //           const response = await GetUnApproveReason();
// //           if (response?.success) {
// //             setReasons(response?.data);
// //           }
// //         } catch (error) {
// //           notify("Error fetching data", "error");
// //         }
// //       };

// //         const handleSaveRejectReason = async () => {
// //           let reasonToSave = "";
// //           if (inputs?.rejectreason === "Other") {
// //             if (!newReason.trim()) {
// //               notify("Please enter a reason", "error");
// //               return;
// //             }
// //             reasonToSave = newReason.trim();
// //           } else {
// //             if (!inputs?.rejectreason || inputs.rejectreason === "0") {
// //               notify("Please select a reason", "error");
// //               return;
// //             }
// //             reasonToSave = inputs.rejectreason;
// //           }

// //           const payload = {
// //             unApproveReason: reasonToSave,
// //           };

// //           try {
// //             const response = await SaveSampleRejectReasonApi(payload);
// //             if (response?.success) {
// //               notify("Reason saved successfully", "success");
// //               setIsInput(false);
// //               handleGetReason();
// //               notify("Hold Reason Add SuccessFully...","success");
// //               setNewReason("");
// //               setInputs((val) => ({ ...val, rejectreason: "" }));
// //             }
// //           } catch (error) {
// //             notify("Error saving reason", "error");
// //           }
// //         };

// //         useEffect(() => {
// //           handleGetReason();
// //         }, []);

// //   // useEffect(() => {
// //   //   handleChangeModel(inputs);
// //   // }, [inputs]);
// //   // console.log(inputs,"inputs----------")

// //   return (
// //     <>
// //       <div className="row p-2">

// //         {/* <TextAreaInput
// //           lable={t("holdRemarks")}
// //           className="w-100 required-fields"
// //           id="holdRemarks"
// //           rows={4}
// //           respclass="w-100"
// //           name="holdRemarks"
// //           value={inputs?.holdRemarks ? inputs?.holdRemarks : ""}
// //           onChange={handlechange}
// //           maxLength={1000}
// //         /> */}

// // <ReactSelect
// //           placeholderName={t("Select Reason . . .")}
// //           searchable={true}
// //           removeIsClearable={true}
// //           id="holdRemarks"
// //           name="rejectreason"
// //           value={inputs?.rejectreason || ""}
// //           handleChange={handleReactSelect}
// //           respclass="w-100"
// //           dynamicOptions={[
// //             { value: "0", label: "ALL" },
// //             ...handleReactSelectDropDownOptions(
// //               reasons,
// //               "UnapproveReason",
// //               "UnapproveReason"
// //             ),
// //             { value: "Other", label: "Other" },
// //           ]}
// //         />

// //       </div>

// //       {isInput && (
// //           <div className="w-100">
// //             <TextAreaInput
// //               placeholder={t("Enter Reason . . .")}
// //               className="w-100 required-fields mt-2"
// //               id="newReason"
// //               rows={4}
// //               respclass="w-100"
// //               name="newReason"
// //               value={newReason}
// //               onChange={handleChange}
// //               maxLength={1000}
// //             />
// //             {/* <div className="d-flex justify-content-end mt-2">
// //               <button
// //                 className="btn btn-primary"
// //                 onClick={handleSaveRejectReason}
// //               >
// //                 {t("Add New")}
// //               </button>
// //             </div> */}
// //           </div>
// //         )}

// //     </>

// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// // import {
// //   getRejectReasonOptionsApi,
// //   SaveSampleRejectReasonApi,
// // } from "../../../networkServices/SampleCollectionAPI";
// import ReactSelect from "../../components/formComponent/ReactSelect";
// import TextAreaInput from "../../components/formComponent/TextAreaInput";
// import { notify } from "../../utils/ustil2";
// import { GetholdReason } from "../../networkServices/resultEntry";
// import { handleReactSelectDropDownOptions } from "../../utils/utils";

// export default function HoldRemarksModal({ handleChangeModel, inputData }) {
//   const [t] = useTranslation();
//   const [inputs, setInputs] = useState(inputData);
//   const [reasons, setReasons] = useState([]);
//   const [isInput, setIsInput] = useState(false);

//   useEffect(() => {
//     handleChangeModel(inputs);
//   }, [inputs]);

//   const handleReactSelect = (name, e) => {
//     if (e?.value === "Other") {
//       setIsInput(true);
//     } else {
//       setIsInput(false);
//       setInputs((val) => ({ ...val, [name]: e?.value }));
//     }
//   };

//   const handleChange = (e) => {
//     setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleGetReason = async () => {
//     try {
//       const response = await GetholdReason();
//       if (response?.success) {
//         setReasons(response?.data);
//         console.log("the data in the hold reason api is", response);
//       }
//     } catch (error) {
//       notify("Error fetching data", "error");
//     }
//   };
  
//   // const handleSaveRejectReason = async () => {
//   //   if (!newReason) {
//   //     notify("Please enter a reason", "error");
//   //     return;
//   //   }
//   //   const payload = {
//   //     reasion: newReason,
//   //   };
//   //   try {
//   //     const response = await SaveSampleRejectReasonApi(payload);
//   //     if (response?.success) {
//   //       notify("Reason saved successfully", "success");
//   //       handleGetReason();
//   //       setIsInput(false);
//   //     }
//   //   } catch (error) {
//   //     notify("Error fetching data", "error");
//   //   }
//   // };

//   useEffect(() => {
//     handleGetReason();
//   }, []);

//   return (
//     <>
//       <div className="d-flex align-items-baseline w-100">
//         <div className="row p-2 w-100">
//           <ReactSelect
//             placeholderName={t("Select Reason . . .")}
//             searchable={true}
//             removeIsClearable={true}
//             id="rejectreason"
//             name="rejectreason"
//             value={inputs?.rejectreason ? inputs?.rejectreason : ""}
//             handleChange={handleReactSelect}
//             respclass="w-100 "
//             // dynamicOptions={[
//             //   ...(reasons?.map((item) => ({
//             //     label: item?.Reasion,
//             //     value: item?.Reasion,
//             //   })) || []),
//             //   {
//             //     label: "Other",
//             //     value: "Other",
//             //   },
//             // ]}
//             dynamicOptions={[
//               { value: "0", label: "ALL" },
//               ...handleReactSelectDropDownOptions(
//                 reasons,
//                 "UnHoldReason",
//                 "ID" 
//               ),
//             ]}
//           />
//           {isInput && (
//             <div className="w-100">
//               <TextAreaInput
//                 placeholder={t("Enter Reason . . .")}
//                 className="w-100 required-fields mt-2"
//                 id="newReason"
//                 rows={4}
//                 respclass="w-100"
//                 name="newReason"
//                 // value={newReason ? inputs?.newReason : ""}
//                 value={inputs?.newReason ? inputs?.newReason : ""}
//                 // onChange={(e) => setNewReason(e.target.value)}
//                 onChange={handleChange}
//                 maxLength={1000}
//               />
//               {/* <div className="d-flex justify-content-end">
//                 <button
//                   className="btn btn-primary"
//                   onClick={handleSaveRejectReason}
//                 >
//                   {t("Add New")}
//                 </button>
//               </div> */}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next"; 
// import TextAreaInput from "../../components/formComponent/TextAreaInput";
// export default function HoldRemarksModal({ handleChangeModel, inputData }) {



//   const [t] = useTranslation();
//   const [inputs, setInputs] = useState(inputData);
//   const handlechange = (e) => {
//     setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
//   };


//   useEffect(() => {
//     handleChangeModel(inputs);
//   }, [inputs]);



//   return (
//     <>
//       <div className="row p-2">

//         <TextAreaInput
//           lable={t("RejectReason")}
//           className="w-100 required-fields"
//           id="RejectReason"
//           rows={4}
//           respclass="w-100"
//           name="RejectReason"
//           value={inputs?.RejectReason ? inputs?.RejectReason : ""}
//           onChange={handlechange}
//           maxLength={1000}
//         />


//       </div>

//     </>

//   );
// }

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import { GetholdReason} from "../../networkServices/resultEntry";
import ReactSelect from "../../components/formComponent/ReactSelect";
import TextAreaInput from "../../components/formComponent/TextAreaInput";
import { notify } from "../../utils/ustil2";
import { handleReactSelectDropDownOptions } from "../../utils/utils";

export default function HoldRemarksModal({
  handleChangeModel, inputData 
}) {
  const [t] = useTranslation();
  
  // Safe initial state: if inputData is missing, fallback to empty object
 
  
    const [inputs, setInputs] = useState(inputData);
  const [reasons, setReasons] = useState([]);
  const [isInput, setIsInput] = useState(false);
  const [newReason, setNewReason] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };  
  const handleReactSelect = (name, e) => {
    const selectedValue = e?.value;
    if (selectedValue === "Other") {
      setIsInput(true);
    } else {
      setInputs((val) => ({ ...val, [name]: selectedValue }));
      setIsInput(false);
      setNewReason("");  
    }
  };
  console.log(inputs)

  const handleGetReason = async () => {
    try {
      const response = await GetholdReason();
      if (response?.success) {
        setReasons(response?.data);
      }
    } catch (error) {
      notify("Error fetching data", "error");
    }
  }; 
  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs, handleChangeModel]);

 

  useEffect(() => {
    handleGetReason();
  }, []);

  return (
    <div className="d-flex align-items-baseline w-100">
      <div className="row p-2 w-100">
        <ReactSelect
          placeholderName={t("Select Reason . . .")}
          searchable={true}
          removeIsClearable={true}
          id="rejectreason"
          name="rejectreason"
          value={inputs?.rejectreason || ""}
          handleChange={handleReactSelect}
          respclass="w-100"
          dynamicOptions={[
            { value: "0", label: "ALL" },
            ...handleReactSelectDropDownOptions(
              reasons,
              "UnHoldReason",
              "UnHoldReason"
            ),
            { value: "Other", label: "Other" },   
          ]}
        />

        {/* {isInput && (
          <div className="w-100">
            <TextAreaInput
              placeholder={t("Enter Reason . . .")}
              className="w-100 required-fields mt-2"
              id="newReason"
              rows={4}
              respclass="w-100"
              name="newReason"
              value={newReason}
              onChange={handleChange}
              maxLength={1000}
            /> 
          </div>
        )}  */}
          {isInput && (
            <div className="w-100">
              <TextAreaInput
                placeholder={t("Enter Reason . . .")}
                className="w-100 required-fields mt-2"
                id="newReason"
                rows={4}
                respclass="w-100"
                name="newReason"
                // value={newReason ? inputs?.newReason : ""}
                value={inputs?.newReason ? inputs?.newReason : ""}
                // onChange={(e) => setNewReason(e.target.value)}
                onChange={handleChange}
                maxLength={1000}
              />
              
              {/* <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveRejectReason}
                >
                  {t("Add New")}
                </button>
              </div> */}
            </div>
          )}
      </div>
    </div>
  );
}
