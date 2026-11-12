import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import TimePicker from "../formComponent/TimePicker";
import Input from "../formComponent/Input";
import CustomSelect from "../formComponent/CustomSelect";
import {
  MedicineDetailsCancel,
  MedicineDetailsSave,
} from "../../networkServices/nursingWardAPI";
import {
  handleMedicineDetailsSavePayload,
  notify,
  WithoutObjecthandleReactSelectDropDownOptions,
} from "../../utils/utils";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import NestedRowTable from "../UI/customTable/NestedRowTable";
import DatePicker from "../formComponent/DatePicker";
const Nested = ({
  tbody,
  thead,
  tableHeight,
  setHandleModelData,
  setModalData,
  values,
  bindMedicationList,
  medicationAdmiTionList,
}) => {
  const localdata = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  // const [bodyData, setBodyData] = useState([]);

  // const [medicineValues, setMedicineValues] = useState({});

  // console.log("medicationAdmiTionList", medicationAdmiTionList)

  const handleClickEdit = (val, index, isopen) => {
    tbody[index]["isopen"] = !isopen;
    bindBodyData(tbody);
  };
console.log("tbodytbodytbodytbodytbody",tbody)
  const handleSaveAPI = async (data) => {
    try {
      // data.status = "Started"
      const payload = handleMedicineDetailsSavePayload(data);
      const response = await MedicineDetailsSave(payload);
      // console.log("re", response)
      if (response?.success) {
        bindMedicationList(values?.category?.value);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleSaveStartStopAPI = async (data, status) => {
    try {
      data.status = status;
      const payload = handleMedicineDetailsSavePayload(data);
      console.log("payload", payload);
      const response = await MedicineDetailsSave(payload);
      // console.log("re", response)
      if (response?.success) {
        bindMedicationList(values?.category?.value);
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const MEDICATION_TABLE_INPUT_FIELD = (addState, index) => {
    return {
      "S.No.": "*",
      DATE: (
        <div style={{ minWidth: "100px" }}>
          <DatePicker
            className="custom-calendar"
            respclass={"table-calender-height"}
            value={addState?.date ? addState?.date : new Date()}
            // respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            removeFormGroupClass={true}
            id="Date"
            name="date"
            placeholder={VITE_DATE_FORMAT}
            disable={addState?.STATUS !== "Running" ? true : false}
            showTime
            hourFormat="12"
            handleChange={(e) => handleChange(e, index)}
          />
        </div>
      ),
      Time: (
        <TimePicker
          placeholderName="Time"
          className="table-calender-height"
          value={addState?.time ? addState?.time : new Date()}
          id="Fromtime"
          name="time"
          handleChange={(e) => handleChange(e, index)}
        />
      ),

      Dose: (
        <Input
          type="number"
          className="table-input"
          name={"dose"}
          disabled={addState?.STATUS !== "Running" ? true : false}
          removeFormGroupClass={true}
          onChange={(e) => handleChange(e, index)}
          value={addState?.dose ? addState?.dose : ""}
        />
      ),
      Qty: (
        <Input
          type="number"
          className="table-input"
          name={"Qty"}
          disabled={addState?.STATUS !== "Running" ? true : false}
          removeFormGroupClass={true}
          onChange={(e) => handleChange(e, index)}
          value={addState?.Qty ? addState?.Qty : ""}
        />
      ),
      Route: (
        <CustomSelect
          option={WithoutObjecthandleReactSelectDropDownOptions(
            medicationAdmiTionList?.MedicineRoute
          )}
          placeHolder="Select Route"
          value={addState?.Route?.value}
          isDisable={addState?.STATUS !== "Running" ? true : false}
          name="Route"
          onChange={(name, e) => handleCustomSelect(index, name, e)}
        />
      ),
      Frequency: (
        <CustomSelect
          option={WithoutObjecthandleReactSelectDropDownOptions(
            medicationAdmiTionList?.MedicineFreQuency
          )}
          placeHolder="Select Frequency"
          value={addState?.Frequency?.value}
          isDisable={addState?.STATUS !== "Running" ? true : false}
          name="Frequency"
          onChange={(name, e) => handleCustomSelect(index, name, e)}
        />
      ),
      Remark: (
        <Input
          type="text"
          className="table-input"
          name={"Remark"}
          disabled={addState?.STATUS !== "Running" ? true : false}
          removeFormGroupClass={true}
          value={addState?.Remark ? addState?.Remark : ""}
          onChange={(e) => handleChange(e, index)}
        />
      ),
      EntryBy: <></>,
      entryDatetime: <></>,

      Save: (
        <>
          {/* {Number(localdata?.defaultRole) === 52 ?
                    <> */}

          {addState?.STATUS === "Running" &&
          Number(localdata?.defaultRole) !== 52 ? (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                handleSaveStartStopAPI(addState, "");
              }}
            >
              {t("NursingWard.MedicationAdministrationRecord.Save")}
            </button>
          ) : (
            ""
          )}

          {Number(localdata?.defaultRole) === 52 ? (
            <>
              {addState?.STATUS === "Running" ? (
                <button
                  className="btn btn-sm btn-primary ml-1 "
                  onClick={() => {
                    handleSaveStartStopAPI(addState, "Stopped");
                  }}
                >
                  {t("NursingWard.MedicationAdministrationRecord.Stop")}
                </button>
              ) : (
                addState?.STATUS === "Stopped" && (
                  <button
                    className="btn btn-sm btn-primary ml-1 "
                    onClick={() => {
                      handleSaveStartStopAPI(addState, "Started");
                    }}
                  >
                    {t("NursingWard.MedicationAdministrationRecord.Start")}
                  </button>
                )
              )}
            </>
          ) : (
            <></>
          )}

          {/* </> : <></>
                } */}
        </>
      ),
    };
  };

  const CancelComponentText = async (data) => {
    try {
      let payload = {
        id: data?.subListitem?.ID,
        transactionID: data?.subListitem?.TransactionID,
        indentNo: data?.subListitem?.IndentNo,
        itemID: data?.subListitem?.ItemID,
      };
      let apiResp = await MedicineDetailsCancel(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        bindMedicationList(values?.category?.value);
        setHandleModelData((val) => ({ ...val, isOpen: false }));
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {}
  };

  const handleCancelSubRow = (listval, index, subListitem, i) => {
    setModalData({
      listval: listval,
      index: index,
      subListitem: subListitem,
      i: i,
    });
    setHandleModelData({
      label: t(
        "NursingWard.MedicationAdministrationRecord.CancelMedicineDetails"
      ),
      buttonName: t("NursingWard.MedicationAdministrationRecord.Cancel"),
      width: "20vw",
      isOpen: true,
      Component: (
        <h3>
          {t("NursingWard.MedicationAdministrationRecord.CancelComponenttext")}
        </h3>
      ),
      handleInsertAPI: CancelComponentText,
      extrabutton: <></>,
      CancelbuttonName: t("NursingWard.MedicationAdministrationRecord.Close"),
    });
  };

  // const bindBodyData = (tbody) => {
  //   let list = [];
  //   tbody?.map((val, index) => {
  //     // let secondTbody = [];

  //     // let BindFirstRow = MEDICATION_TABLE_INPUT_FIELD(val, index);
  //     // secondTbody.push(BindFirstRow);

  //     // let obj = {};
  //     // obj.index =
  //     //   val?.BindMedicineList?.length > 0 ? (
  //     //     <span
  //     //       onClick={() => {
  //     //         handleClickEdit(val, index, val?.isopen);
  //     //       }}
  //     //     >
  //     //       {val?.isopen > 0 ? (
  //     //         <i className="fa fa-minus" aria-hidden="true"></i>
  //     //       ) : (
  //     //         <i className="fa fa-plus" aria-hidden="true"></i>
  //     //       )}
  //     //     </span>
  //     //   ) : (
  //     //     ""
  //     //   );
  //     obj.sno = index + 1;
  //     obj.Department = val?.DisplayName;
  //     obj.Quantity = val?.Qty;
  //     obj.Amount = val?.NetAmt;
  //     obj.View = <i className="fa fa-eye" aria-hidden="true"></i>;
  //     obj.Edit = (
  //       <i
  //         className="fa fa-edit"
  //         aria-hidden="true"
  //         //  onClick={() => { editMedicineDetail(val) }}
  //       ></i>
  //     );
  //     obj.ViewLog = <i className="fas fa-search" aria-hidden="true"></i>;
  //     obj.subRow = { subRowList: secondTbody, isopen: val?.isopen };
  //     list.push(obj);
  //   });
  //   setBodyData(list);
  // };
  // useEffect(() => {
  //   bindBodyData(tbody);
  // }, [tbody, medicationAdmiTionList]);

  const handleChange = (e, parentIndex) => {
    const { name, value } = e.target;
    const newTableData = [...tbody]; // Create a copy of the current data
    newTableData[parentIndex][name] = value; // Update the specific input field
    bindBodyData(newTableData); // Set the updated state
    // setMedicineValues(newTableData[parentIndex])
  };

  const handleCustomSelect = (parentIndex, name, value) => {
    const newTableData = [...tbody]; // Create a copy of the current data
    newTableData[parentIndex][name] = value; // Update the specific input field
    bindBodyData(newTableData); // Set the updated state
    // setMedicineValues(newTableData[parentIndex])
  };

  const getRowClass = (val) => {
    if (val?.STATUS === "Completed") {
      return "medicationTbaleRowColor";
    }
    if (val?.STATUS === "Stopped") {
      return "medicationTbaleRowColorStopped";
    }
    if (val?.STATUS === "Not Issued") {
      return "medicationTbaleRowColorNotIssued";
    }
    if (val?.STATUS === "Running") {
      return "medicationTbaleRowColorRunning";
    }
    if (val?.STATUS === "Today Medicine") {
      return "medicationTbaleRowColorTodayMedicine";
    }
  };

  return (
    <>
      <NestedRowTable
        thead={thead}
        tbody={tbody}
        tableHeight={tableHeight}
        getRowClass={getRowClass}
      />
    </>
  );
};

export default Nested;
