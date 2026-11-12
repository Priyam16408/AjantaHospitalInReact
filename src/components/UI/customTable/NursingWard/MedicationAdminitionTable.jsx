import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NestedRowTable from "../NestedRowTable";
import DatePicker from "../../../formComponent/DatePicker";
import TimePicker from "../../../formComponent/TimePicker";
import Input from "../../../formComponent/Input";
import CustomSelect from "../../../formComponent/CustomSelect";
import { MedicineDetailsCancel, MedicineDetailsSave, MedicineFreQuency, MedicineRoute, MedicineTimes } from "../../../../networkServices/nursingWardAPI";
import { handleMedicineDetailsSavePayload, notify, WithoutObjecthandleReactSelectDropDownOptions } from "../../../../utils/utils";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import moment from "moment";
const index = ({ tbody, thead, tableHeight, setTbody, editMedicineDetail, setHandleModelData, handleModelData, setModalData, values, bindMedicationList, medicationAdmiTionList }) => {

    const localdata = useLocalStorage("userData", "get")

    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;

    const [bodyData, setBodyData] = useState([])


    const seondThead = [
        { name: t("S.NO."), width: "1%" },
        { name: t("Schedule Date"), width: "2%" },
        { name: t("Schedule Time"), width: "2%" },
        t("Remark"),
        { name: t("No Need"), width: "1%" },
        t("Given By"),
        { name: t("Given Date"), width: "10%" },
        { name: t("Given Time"), width: "1%" },
        { name: t("Status"), width: "1%" },
        { name: t("Action"), width: "1%" },

    ]

    const handleClickEdit = (val, index, isopen) => {
        tbody[index]["isopen"] = !isopen
        bindBodyData(tbody)
    }


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
    const handleSaveStartStopAPI = async (data, status, subItem) => {
        try {
            data.status = status
            const payload = handleMedicineDetailsSavePayload(data, subItem);
            // console.log("valval",payload)
            const response = await MedicineDetailsSave(payload);
            console.log("re", response)
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
                // <div style={{ minWidth: "90px" }}>
                <DatePicker
                    className="custom-calendar"
                    respclass={"nested-Table-Inputswidth"}
                    value={addState?.date ? addState?.date : new Date()}
                    // respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    removeFormGroupClass={true}

                    id="Date"
                    name="date"
                    placeholder={VITE_DATE_FORMAT}
                    disable={(addState?.STATUS !== "Running") ? true : false}
                    showTime
                    hourFormat="12"
                    handleChange={(e) => handleChange(e, index)}
                />
                // </div>
            ),
            Time: (

                <TimePicker
                    placeholderName="Time"
                    className="table-calender-height"
                    value={addState?.time ? addState?.time : new Date()}
                    id="Fromtime"
                    name="time"
                    respclass={"nested-Table-Inputswidth"}
                    handleChange={(e) => handleChange(e, index)}
                />
            ),

            Dose: (
                <Input
                    type="number"
                    className="table-input"
                    name={"dose"}
                    respclass={"nested-Table-Inputswidth"}
                    disabled={(addState?.STATUS !== "Running") ? true : false}
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
                    respclass={"nested-Table-Inputswidth"}
                    disabled={(addState?.STATUS !== "Running") ? true : false}
                    removeFormGroupClass={true}
                    onChange={(e) => handleChange(e, index)}
                    value={addState?.Qty ? addState?.Qty : ""}
                />
            ),
            Route: (
                <CustomSelect
                    option={WithoutObjecthandleReactSelectDropDownOptions(medicationAdmiTionList?.MedicineRoute)}
                    placeHolder="Select Route"
                    value={addState?.Route?.value}
                    isDisable={(addState?.STATUS !== "Running") ? true : false}
                    name="Route"
                    onChange={(name, e) => handleCustomSelect(index, name, e)}
                />
            ),
            Frequency: (
                <CustomSelect
                    option={WithoutObjecthandleReactSelectDropDownOptions(medicationAdmiTionList?.MedicineFreQuency)}
                    placeHolder="Select Frequency"
                    value={addState?.Frequency?.value}
                    isDisable={(addState?.STATUS !== "Running") ? true : false}
                    name="Frequency"
                    onChange={(name, e) => handleCustomSelect(index, name, e)}
                />
            ),
            Remark: (
                <Input
                    type="text"
                    className="table-input"
                    name={"Remark"}
                    disabled={(addState?.STATUS !== "Running") ? true : false}
                    removeFormGroupClass={true}
                    respclass={"nested-Table-Inputswidth"}
                    value={addState?.Remark ? addState?.Remark : ""}
                    onChange={(e) => handleChange(e, index)}
                />
            ),
            "EntryBy": (
                <></>
            ),
            "entryDatetime": (
                <></>
            ),

            "Save": (<>
                {/* {Number(localdata?.defaultRole) === 52 ?
                    <> */}


                {addState?.STATUS === "Running" && Number(localdata?.defaultRole) !== 52 ?
                    <button className="btn btn-sm btn-primary" onClick={() => {
                        handleSaveStartStopAPI(addState, "");
                    }} >
                        {t("NursingWard.MedicationAdministrationRecord.Save")}
                    </button> :
                    ""}

                {Number(localdata?.defaultRole) === 52 ? <>
                    {addState?.STATUS === "Running" ? <button className="btn btn-sm btn-primary ml-1 " onClick={() => {
                        handleSaveStartStopAPI(addState, "Stopped");
                    }} >
                        {t("NursingWard.MedicationAdministrationRecord.Stop")}
                    </button> : (addState?.STATUS === "Stopped") && <button className="btn btn-sm btn-primary ml-1 " onClick={() => {
                        handleSaveStartStopAPI(addState, "Started")
                    }} >
                        {t("NursingWard.MedicationAdministrationRecord.Start")}
                    </button>}
                </> : <></>}

                {/* </> : <></>
                } */}
            </>
            ),



        };
    };


    const CancelComponentText = async (data) => {
        try {
            let payload = {
                "id": data?.subListitem?.ID,
                "transactionID": data?.subListitem?.TransactionID,
                "indentNo": data?.subListitem?.IndentNo,
                "itemID": data?.subListitem?.ItemID
            }
            let apiResp = await MedicineDetailsCancel(payload)
            if (apiResp?.success) {
                notify(apiResp?.message, "success");
                bindMedicationList(values?.category?.value);
                setHandleModelData((val) => ({ ...val, isOpen: false }));
            } else {
                notify(apiResp?.message, "error")

            }
        } catch (error) {

        }
    }

    const handleCancelSubRow = (listval, index, subListitem, i) => {
        setModalData({ listval: listval, index: index, subListitem: subListitem, i: i })
        setHandleModelData({
            label: t("NursingWard.MedicationAdministrationRecord.CancelMedicineDetails"),
            buttonName: t("NursingWard.MedicationAdministrationRecord.Cancel"),
            width: "20vw",
            isOpen: true,
            Component: <h3>{t("NursingWard.MedicationAdministrationRecord.CancelComponenttext")}</h3>,
            handleInsertAPI: CancelComponentText,
            extrabutton: <></>,
            CancelbuttonName: t("NursingWard.MedicationAdministrationRecord.Close")
        })
    }

    const getRowClass = (val, index) => {

        let status = tbody[index]["STATUS"]
        if (status === "Completed") {
            return "color-indicator-6-bg"
        }
        if (status === "Medicine Discontinued") {
            return "color-indicator-5-bg"
        }
        if (status === "Running") {
            return "color-indicator-4-bg"
        }
        if (status === "Requisition Done") {
            return "color-indicator-1-bg"
        }
        if (status === "Requisition Rejected") {
            return "color-indicator-3-bg"
        }
        if (status === "Pending Requisition") {
            return "color-indicator-2-bg"
        }

    };

    const handleSubRow = (val, index, subIndex) => {
        let data = tbody[index]["BindMedicineList"][subIndex]["MedicineStatusValue"]
        if (data === 1) {
            return "color-indicator-7-bg";
        } else if (data === 2) {
            return "color-indicator-9-bg";
        } else if (data === 3) {
            return "color-indicator-10-bg";
        } else if (data === 4) {
            return "color-indicator-11-bg";
        } else if (data === 5) {
            return "color-indicator-12-bg";
        } else if (data === 6) {
            return "color-indicator-8-bg";
        }
    }

    const bindBodyData = (tbody) => {
        let list = []
        tbody?.map((val, index) => {
            let secondTbody = []
            // val.GivenTime = val.GivenTime?val.GivenTime:new Date()

            // let BindFirstRow = MEDICATION_TABLE_INPUT_FIELD(val, index)
            // secondTbody.push(BindFirstRow)


            val?.BindMedicineList?.length > 0 && val?.BindMedicineList?.map((item, i) => {
                let obj = {
                    // rowColor: handleSubRowColor(item?.MedicineStatusValue),
                    sno: i + 1,
                    // ItemName: val?.ItemName,
                    ScheduleDate: item?.ScheduleDate,
                    ScheduleTime: item?.ScheduleTime,
                    // Dose: val?.Dose ? val?.Dose : "0",
                    // Qty: 1,
                    Remark: <Input
                        type="text"
                        className="table-input"
                        name={"Remark"}
                        disabled={(item?.IsSave === 0) ? true : false}
                        removeFormGroupClass={true}
                        respclass={"nested-Table-Inputswidth"}
                        value={item?.Remark ? item?.Remark : ""}
                        onChange={(e) => handleChange(e, index, i)}
                    />,
                    noNeed: item?.IsSave === 1 && <input type="checkbox" name="IsGiven" onChange={(e) => { handleChange(e, index, i, true) }} />,

                    GivenBy: item?.GivenBy,

                    DATE: item?.IsSave === 1 ? <DatePicker
                        // className="custom-calendar"
                        className="custom-calendar-table"
                        respclass={"nested-Table-Inputswidth"}
                        value={item?.GivenDateTime ? new Date(item?.GivenDateTime) : new Date()}
                        removeFormGroupClass={true}
                        id="GivenDateTime"
                        name="GivenDateTime"
                        placeholder={VITE_DATE_FORMAT}
                        showTime
                        hourFormat="12"
                        handleChange={(e) => handleChange(e, index, i)}
                    /> : item?.GivenDateTime && moment(item?.GivenDateTime).format("DD-MMM-YYYY"),
                    Time: item?.IsSave === 1 ? <TimePicker
                        placeholderName="Schedule Time"
                        className="table-calender-height"
                        value={item?.GivenTime ? new Date(item?.GivenTime) : new Date()}
                        id="Fromtime"
                        name="GivenTime"
                        respclass={"nested-Table-Inputswidth"}
                        handleChange={(e) => handleChange(e, index, i)}
                    /> : item?.GivenDateTime && moment(item?.GivenDateTime).format("hh:mm A"),
                    MedicineStatus: item?.MedicineStatus,
                    "Save": (<>

                        {(item?.IsSave === 1) || val?.STATUS === "Running" && Number(localdata?.defaultRole) !== 52 ?
                            <button className="btn btn-sm btn-primary" onClick={() => {
                                handleSaveStartStopAPI(val, "", item);
                            }} >
                                {/* {console.log("val?.GivenTime",item?.GivenTime)} */}
                                {t("Save")}
                            </button> :
                            ""}

                        {Number(localdata?.defaultRole) === 52 ? <>
                            {val?.STATUS === "Running" ? <button className="btn btn-sm btn-primary ml-1 " onClick={() => {
                                handleSaveStartStopAPI(val, "Stopped");
                            }} >
                                {t("NursingWard.MedicationAdministrationRecord.Stop")}
                            </button> : (val?.STATUS === "Stopped") && <button className="btn btn-sm btn-primary ml-1 " onClick={() => {
                                handleSaveStartStopAPI(val, "Started")
                            }} >
                                {t("NursingWard.MedicationAdministrationRecord.Start")}
                            </button>}
                        </> : <></>}

                        {/* </> : <></>
                        } */}
                    </>)
                    // Remove: Number(localdata?.defaultRole) !== 52 ? <i className="fa fa-trash text-danger text-center" aria-hidden="true" onClick={() => { handleCancelSubRow(val, index, item, i + 1) }}></i> : <></>,
                }
                secondTbody.push(obj)
            })
            let obj = {}
            obj.index = val?.BindMedicineList?.length > 0 ? <span onClick={() => { handleClickEdit(val, index, val?.isopen) }}>
                {val?.isopen > 0 ? <i className="fa fa-minus" aria-hidden="true"></i> : <i className="fa fa-plus" aria-hidden="true"></i>}
            </span> : ""
            // obj.colorcode = getRowClass(val),
            obj.sno = index + 1,
                obj.MedicineName = val?.ItemName
            obj.DATE = val?.DATE
            obj.OrderQty = val?.IssueQty
            obj.IssueQty = val?.ReceiveQty
            obj.GivenQty = val?.GivenQty ? val?.GivenQty : ""
            obj.RemainingQty = val?.RemainingQty
            obj.Dose = val?.Dose
            obj.Timing = val?.Timing
            obj.Route = val?.Route
            obj.Duration = val?.Duration
            obj.STATUS = val?.STATUS
            obj.EName = val?.EName
            obj.Edit = (localdata?.defaultRole === 52) ? <i className="fa fa-edit" aria-hidden="true" onClick={() => { editMedicineDetail(val) }}></i> : <></>
            obj.subRow = { subRowList: secondTbody, isopen: val?.isopen }
            list.push(obj)
        })
        setBodyData(list)
    }
    useEffect(() => {
        bindBodyData(tbody)
    }, [tbody, medicationAdmiTionList])


    const handleChange = (e, parentIndex, childIndex, checkedBox) => {
        const { name, value, checked } = e.target;
        const newTableData = [...tbody]; // Create a copy of the current data
        newTableData[parentIndex]["BindMedicineList"][childIndex][name] = checkedBox ? checked : value; // Update the specific input field
        console.log(newTableData[parentIndex]["BindMedicineList"])
        bindBodyData(newTableData); // Set the updated state
        // setMedicineValues(newTableData[parentIndex])

    };

    const handleCustomSelect = (parentIndex, name, value) => {
        const newTableData = [...tbody]; // Create a copy of the current data
        newTableData[parentIndex][name] = value; // Update the specific input field
        bindBodyData(newTableData); // Set the updated state
        // setMedicineValues(newTableData[parentIndex])
    };



    return (
        <>
            <NestedRowTable
                thead={thead}
                seondThead={seondThead}
                tbody={bodyData}
                tableHeight={tableHeight}
                getRowClass={getRowClass}
                handleSubRow={handleSubRow}
                SubtableClass={"medRecordNestedTable"}
            />


        </>
    );
};

export default index;
