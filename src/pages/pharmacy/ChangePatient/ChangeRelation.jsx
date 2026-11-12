import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SaveButton from "@components/UI/SaveButton";
import CancelButton from "../../../components/UI/CancelButton";
import {
  filterByType,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  ChangePatientRelationDetail,
  OPDPatientRelationDetail,
} from "../../../networkServices/opdserviceAPI";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import { useSelector, useDispatch } from "react-redux";
import {
  CentreWiseCacheByCenterID,
  CentreWisePanelControlCache,
} from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

export default function ChangeRelation({
  handleClose,
  inputData,
  handleSearch,
}) {
  const localdata = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const { CentreWiseCache, CentreWisePanelControlCacheList } = useSelector(
    (state) => state.CommonSlice
  );
  const [t] = useTranslation();
  const [data, setData] = useState(inputData);
  const [responseData, setResposnseData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (CentreWiseCache?.length === 0) {
      dispatch(
        CentreWiseCacheByCenterID({
          centreID: localdata?.defaultCentre,
        })
      );
    }
    if (CentreWisePanelControlCacheList?.length === 0) {
      dispatch(
        CentreWisePanelControlCache({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  }, [dispatch]);

  const getData = async (PatientID) => {
    try {
      const response = await OPDPatientRelationDetail(PatientID);
      if (response?.success) {
        setResposnseData(response?.data);
      } else {
        handleClose();
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getData(data?.TransactionID || "");
  }, [data]);

  const handleCheckboxChange = (index) => {
    const updated = [...selectedRows];
    if (updated.includes(index)) {
      setSelectedRows(updated.filter((i) => i !== index));
    } else {
      setSelectedRows([...updated, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === responseData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(responseData.map((_, index) => index));
    }
  };
console.log("selectedRows",selectedRows)
  const HandleSave = async () => {
   if (selectedRows?.length === 0) {
    notify("Please select atleast one row", "warn");
    return;
}
    try {
      const payload = selectedRows.map((i) => {
        const val = responseData[i];
        return {
          patientID: String(val?.PatientID),
          patientRelationID: val?.PatientRelationID || "",
          relationOf: String(val?.RelationOf),
          relationName: String(val?.RelationName),
          relationPhone: String(val?.RelationPhone),
          transactionID: String(val?.TransactionId),
        };
      });

      const apiResp = await ChangePatientRelationDetail(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        handleClose();
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.log(error);
      notify("Something went wrong", "error");
    }
  };

  const handleCustomInput = async (ind, name, value) => {
    const updated = [...responseData];
    updated[ind][name] = name === "RelationOf" ? value?.value : value;
    setResposnseData(updated);
  };

  const THEAD = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length === responseData.length}
          onChange={handleSelectAll}
        />
      ),
      width: "1%",
    },
    { name: t("SNo"), width: "1%" },
    { name: t("RelationOf") },
    t("RelationName"),
    t("RelationPhone"),
  ];

  return (
    <div>
      <div className="container">
        <div className="row p-2">
          <Tables
            thead={THEAD}
            tbody={responseData?.map((val, ind) => ({
              "": (
                <input
                  type="checkbox"
                  checked={selectedRows.includes(ind)}
                  onChange={() => handleCheckboxChange(ind)}
                />
              ),
              Sno: ind + 1,
              RelationOf: (
                <ReactSelect
                  placeholderName={t("")}
                  id="RelationOf"
                  searchable={true}
                  name="RelationOf"
                  value={val?.RelationOf}
                  handleChange={(name, e) =>
                    handleCustomInput(ind, "RelationOf", e)
                  }
                  placeholder=" "
                  dynamicOptions={filterByType(
                    CentreWiseCache,
                    6,
                    "TypeID",
                    "TextField",
                    "ValueField"
                  )}
                />
              ),
              RelationName: (
                <div style={{ width: "100px" }}>
                  <Input
                    type="text"
                    className="table-input"
                    removeFormGroupClass={true}
                    name="RelationName"
                    placeholder=""
                    value={val.RelationName}
                    onChange={(e) =>
                      handleCustomInput(ind, "RelationName", e.target.value)
                    }
                  />
                </div>
              ),
              RelationPhone: (
                <div style={{ width: "70px" }}>
                  <Input
                    type="number"
                    className="table-input"
                    removeFormGroupClass={true}
                    name="RelationPhone"
                    placeholder=""
                    value={val.RelationPhone}
                    onChange={(e) =>
                      handleCustomInput(ind, "RelationPhone", e.target.value)
                    }
                  />
                </div>
              ),
            }))}
            tableHeight={"scrollView"}
          />
        </div>
      </div>
      <div className="ftr_btn">
        <SaveButton btnName={"Save"} onClick={HandleSave} />
        <CancelButton cancleBtnName={"Cancel"} onClick={() => handleClose()} />
      </div>
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import SaveButton from "@components/UI/SaveButton";
// import CancelButton from "../../../components/UI/CancelButton";
// import { filterByType, handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
// import Heading from "../../../components/UI/Heading";
// import ReactSelect from "../../../components/formComponent/ReactSelect";
// import {
//     ChangePatientRelationDetail,
//     OPDPatientRelationDetail,
// } from "../../../networkServices/opdserviceAPI";
// import Tables from "../../../components/UI/customTable";
// import Input from "../../../components/formComponent/Input";
// import { useSelector } from "react-redux";
// import { CentreWiseCacheByCenterID, CentreWisePanelControlCache } from "../../../store/reducers/common/CommonExportFunction";
// import { useDispatch } from "react-redux";
// import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

// export default function ChangeRelation({
//     handleClose,
//     inputData,
//     handleSearch,
// }) {
//     const localdata = useLocalStorage("userData", "get");
//     const dispatch = useDispatch();
//     const { CentreWiseCache,
//         CentreWisePanelControlCacheList, } = useSelector(
//             (state) => state.CommonSlice
//         );
//     const [t] = useTranslation();
//     const [data, setData] = useState(inputData);
//     const [responseData, setResposnseData] = useState([]);
//     useEffect(() => {
//         if (CentreWiseCache?.length === 0) {
//             dispatch(
//                 CentreWiseCacheByCenterID({
//                     centreID: localdata?.defaultCentre,
//                 })
//             );
//         }
//         if (CentreWisePanelControlCacheList?.length === 0) {
//             dispatch(
//                 CentreWisePanelControlCache({
//                     centreID: localdata?.defaultCentre,
//                 })
//             );
//         }
//     }, [dispatch]);

//     const getData = async (PatientID) => {

//         try {
//             const response = await OPDPatientRelationDetail(PatientID)
//             console.log("firstresponse", response);
//             if (response?.success) {
//                 setResposnseData(response?.data)
//             } else {
//                 notify(response?.message, "error")
//             }
//         } catch (error) {
//             console.log("error", error)
//         }
//     }

//     useEffect(() => {
//         getData("MOH/25/0000170")
//     }, [])
//     const HandleSave = async () => {
//         try {
//             let payload = responseData?.map((val) => ({

//                 "patientID": String(data?.PatientID),
//                 "patientRelationID": val?.PatientRelationID || "",
//                 "relationOf": String(val?.RelationOf),
//                 "relationName": String(val?.RelationName),
//                 "relationPhone": String(val?.RelationPhone),
//                 "transactionID": String(data?.TransactionID),

//             }))
//             let apiResp = await ChangePatientRelationDetail(payload);
//             if (apiResp?.success) {
//                 notify(apiResp?.message, "success");
//                 handleClose();
//                 handleSearch();
//             } else {
//                 notify(apiResp?.message, "error");
//             }
//         } catch (error) {
//             console.log(apiResp?.message);
//             console.log(error);
//             notify(apiResp?.message, "error");
//         }
//     };

//     const THEAD = [
//         { name: t("SNo"), width: "1%" },
//         { name: t("RelationOf") },
//         t("RelationName"),
//         t("RelationPhone"),

//     ];
//     const handleCustomInput = async (ind, name, value) => {
//         const updatedBodyData = [...responseData];
//         console.log("updatedBodyData", updatedBodyData)
//         console.log("value", value)
//         if (name === "RelationOf") {
//             updatedBodyData[ind]["RelationOf"] = value?.value
//             setResposnseData(updatedBodyData)
//         }
//         if (name === "RelationName") {
//             updatedBodyData[ind]["RelationName"] = value
//             setResposnseData(updatedBodyData)
//         }
//         if (name === "RelationPhone") {
//             updatedBodyData[ind]["RelationPhone"] = value
//             setResposnseData(updatedBodyData)
//         }

//     }
//     return (
//         <div>
//             <div className="container">
//                 <div className="row p-2">
//                     <Tables
//                         thead={THEAD}
//                         tbody={responseData?.map((val, ind) => ({

//                             Sno: ind + 1,
//                             RelationOf: (
//                                 <div>
//                                     <ReactSelect
//                                         placeholderName={t("")}
//                                         id="RelationOf"
//                                         searchable={true}
//                                         name="RelationOf"
//                                         value={val?.RelationOf}
                                       
//                                         handleChange={(name, e) => { handleCustomInput(ind, "RelationOf", e) }}
//                                         placeholder=" "
//                                         //   respclass="col-xl-2 col-md-3 col-sm-4 col-12"
//                                         dynamicOptions={filterByType(
//                                             CentreWiseCache,
//                                             6,
//                                             "TypeID",
//                                             "TextField",
//                                             "ValueField"
//                                         )}
//                                     />
//                                 </div>
//                             ),

//                             RelationName: <div style={{ width: "100px" }}>

//                                 <Input
//                                     type="text"
//                                     className="table-input"
//                                     removeFormGroupClass={true}
//                                     name="RelationName"
//                                     placeholder=""
//                                     value={val.RelationName}
//                                     onChange={(e) => handleCustomInput(ind, "RelationName", e.target.value)}
//                                 />
//                             </div>,
//                             RelationPhone: <div style={{ width: "70px" }}>

//                                 <Input
//                                     type="number"
//                                     className="table-input"
//                                     removeFormGroupClass={true}
//                                     name="RelationPhone"
//                                     placeholder=""
//                                     value={val.RelationPhone}
//                                     onChange={(e) => handleCustomInput(ind, "RelationPhone", e.target.value)}
//                                 />
//                             </div>,

//                         }))}
//                         tableHeight={"scrollView"}
//                     />


//                 </div>
//             </div>
//             <div className="ftr_btn">
//                 <SaveButton btnName={"Save"} onClick={HandleSave} />
//                 <CancelButton cancleBtnName={"Cancel"} onClick={() => handleClose()} />
//             </div>
//         </div>
//     );
// }
