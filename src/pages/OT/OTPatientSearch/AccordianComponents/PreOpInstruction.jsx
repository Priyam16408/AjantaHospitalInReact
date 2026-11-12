import React, { useEffect, useState } from "react";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import Heading from "../../../../components/UI/Heading";
import TimePicker from "../../../../components/formComponent/TimePicker";
import DatePicker from "../../../../components/formComponent/DatePicker";
import moment from "moment";
import CustomCheckboxHeading from "../../../../components/formComponent/CustomCheckboxHeading";
import TextAreaInput from "../../../../components/formComponent/TextAreaInput";
import { AutoComplete } from "primereact/autocomplete";
import Tables from "../../../../components/UI/customTable";
import Accordion from "../../../../components/UI/Accordion";
import { notify, SavepreopinstructionPayload } from "../../../../utils/ustil2";
import { getEditpreopresultdetails, getpreopinstructionAPI, LoadAllOTItem, RemovepreopinstructionAPI, SavepreopinstructionAPI } from "../../../../networkServices/OT/otAPI";
import { timeFormateDate } from "../../../../utils/utils";
import { PreOpInstructionList } from "../../../../utils/constant";

const PreOpInstruction = ({ data }) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const intialvalue = {
    NPOFromTime: new Date(),
    NPOOnDate: new Date(),
    NEBULISATION_ON_DATE: new Date(),
    NEBULISATION_ON: "",
    NEBULISATION_ON_Time: new Date(),
    STOP_ORALFromDate: new Date(),
    stoP_ORAL_time: new Date(),
    stoP_ORAL_from_on: new Date(),
    tabOnDate: new Date(),
    tab_AT: new Date(),
    NEBULISATION_WITH: false
  }
  const [values, setValues] = useState(intialvalue);
  const [tabItemTableData, setTabItemTableData] = useState([]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "IsOther") {
      setValues((val) => ({ ...val, [name]: value, otherDeatails: "" }));
    } else {
      setValues((val) => ({ ...val, [name]: value }));
    }
  };

  const [GOBIMedicationsAlcohol, setGOBIMedicationsAlcohol] = useState(PreOpInstructionList)




  const [items, setItems] = useState([]);
  const search = async (event) => {
    if (event?.query?.length > 1) {

      let results = await LoadAllOTItem(event?.query)
      if (results?.success) {
        setItems(results?.data)
      }


    } else {
      setItems([]);
    }

  };

  const addTabItem = () => {
    if (tabItemTableData?.length > 0 && tabItemTableData?.find((item) => item?.ItemID === values?.item?.ItemID)) {
      notify("Item already added", "error")
      return
    } else if (!values?.item?.ItemID) {
      notify("Please Select Item", "error")
      return
    } else if (!values?.mg) {
      notify("Please Enter MG", "error")
      return
    }
    setTabItemTableData((val) => [...val, { ...values?.item, mg: values?.mg, tab_AT: values?.tab_AT, tabOnDate: values?.tabOnDate }])
    setValues((val) => ({ ...val, ["item"]: "", mg: "", tab_AT: new Date(), tabOnDate: new Date() }))
  }
  const removeTabItem = (index) => {
    setTabItemTableData((val) => val.filter((item, i) => i !== index))
  }

  const validateInvestigation = async (e) => {
    const { value } = e
    setValues((val) => ({ ...val, ["item"]: value }))
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.ItemName}
        </div>
      </div>
    );
  };

  const [listData, setListData] = useState({ preopinstruction: [] });
  const getpreopinstruction = async () => {
    const apiResp = await getpreopinstructionAPI(
      data?.PatientID,
      data?.TransactionID
    );
    if (apiResp?.success) {
      setListData((val) => ({ ...val, preopinstruction: apiResp?.data }));
    }
  };
  useEffect(() => {
    getpreopinstruction()
  }, [])
  const Savepreopinstruction = async () => {
    const payload = SavepreopinstructionPayload(values, data, tabItemTableData)
    const apiResponse = await SavepreopinstructionAPI(payload)
    if (apiResponse?.success) {
      notify(apiResponse?.message, "success");
      setValues(intialvalue);
      setGOBIMedicationsAlcohol(PreOpInstructionList);
      getpreopinstruction()
    } else {
      notify(apiResponse?.message, "error");
    }
  }

  const handleRemove = async (id) => {
    const apiResponse = await RemovepreopinstructionAPI(id)
    if (apiResponse?.success) {
      notify(apiResponse?.message, "success")
      getpreopinstruction()
    } else {
      notify(apiResponse?.message, "error")
    }

  }
  const handlePrint = (data) => {

  }

  const handleGetData = (index, keyname) => {
    const obj = { ...GOBIMedicationsAlcohol[index], options: GOBIMedicationsAlcohol[index]?.options?.map((val) => keyname?.split(",")?.find((item) => val?.label === item) ? { ...val, value: true } : { ...val, value: false }) }
    return obj
  }
  const handleEdit = async (data) => {
    let apiResp = await getEditpreopresultdetails(data?.preid)

    if (apiResp?.success && apiResp?.data?.length > 0) {

      // 


      const { IS_NPO_FROM, NPO_time, NPO_date, IS_APPLY_EMLA, IS_REMOVE_ALL, IS_SHIFT_OT, IS_NEBULISATION, NEBULISATION_date, NEBULISATION_time, NEBULISATION, IS_patient_can, IS_STOP_ORAL, STOP_ORAL_time, STOP_ORAL_from_on, STOP_ORAL_from_date, Other, MALAMPATTI_SCORE, TEETH, T_M_DISTANCE, ASA_CLASS, MOUTH_OPENING_ADEQATE, DENTURES, NCEK_MOVEMENTS, ALLERGIES, medicine_id } = apiResp?.data[0]

      if (medicine_id) {
        // debugger
        setTabItemTableData(apiResp?.data?.map((val) => ({
          ItemName: val?.medicine_name,
          ItemID: val?.medicine_id,
          mg: val?.medicine_dose,
          tab_AT: timeFormateDate(val?.medicine_time),
          tabOnDate: new Date(val?.medicine_date)
        })))
      }

      const malampattiScore = handleGetData(0, MALAMPATTI_SCORE)
      const teeth = handleGetData(1, TEETH)
      const t_M_DISTANCE = handleGetData(2, T_M_DISTANCE)
      const asaClass = handleGetData(3, ASA_CLASS)
      const mouthOpening = handleGetData(4, MOUTH_OPENING_ADEQATE)
      const denture = handleGetData(5, DENTURES)
      const ncetMovment = handleGetData(6, NCEK_MOVEMENTS)

      GOBIMedicationsAlcohol[0] = malampattiScore
      GOBIMedicationsAlcohol[1] = teeth
      GOBIMedicationsAlcohol[2] = t_M_DISTANCE
      GOBIMedicationsAlcohol[3] = asaClass
      GOBIMedicationsAlcohol[4] = mouthOpening,
        GOBIMedicationsAlcohol[5] = denture,
        GOBIMedicationsAlcohol[6] = ncetMovment,

        setValues({
          ...intialvalue,
          NPOFROM: IS_NPO_FROM,
          NPOFromTime: timeFormateDate(NPO_time),
          NPOOnDate: new Date(NPO_date),
          iS_APPLY_EMLA: IS_APPLY_EMLA,
          REMOVE_ALL: IS_REMOVE_ALL,
          SHIFT_TO_OT: IS_SHIFT_OT,
          NEBULISATION_WITH: IS_NEBULISATION,
          NEBULISATION_ON: NEBULISATION,
          nebulisatioN_date: new Date(NEBULISATION_date),
          nebulisatioN_time: timeFormateDate(NEBULISATION_time),
          isPatientCan: IS_patient_can,
          isStopOral: IS_STOP_ORAL,
          stoP_ORAL_time: timeFormateDate(STOP_ORAL_time),
          STOP_ORALFromDate: new Date(STOP_ORAL_from_date),
          stoP_ORAL_from_on: new Date(STOP_ORAL_from_on),
          otherDeatails: Other,
          IsOther: Other?.length > 0 ? true : false,
          malampattiScore: malampattiScore,
          asaClass: asaClass,
          neckMovements: ncetMovment,
          tmDistance: t_M_DISTANCE,
          dentures: denture,
          teeth: teeth,
          mouthOpening: mouthOpening,
          Allergies: ALLERGIES,
        })
      setGOBIMedicationsAlcohol(GOBIMedicationsAlcohol)
    }

  }
  return (
    <>
      <div className="row p-2">
        {GOBIMedicationsAlcohol?.map((data) => (
          <CustomCheckboxHeading
            data={data}
            setValues={setValues}
            values={values}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12 mb-2 "
          />
        ))}

        <TextAreaInput
          lable={t("Allergies")}
          placeholder=""
          className="w-100 "
          id="Allergies"
          rows={2}
          name="Allergies"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          value={values?.Allergies ? values?.Allergies : ""}
          maxLength={200}
          onChange={handleChange}
        />
      </div>
      <Heading title={t("Pre Op Instructions")} isBreadcrumb={false} />
      <div className="row p-2">
        <div className="col-xl-4 col-md-6 col-12 mb-2 ">
          <div className="d-flex mx-2 ">
            <input
              className="form-check-input table-checkbox ml-1"
              type="checkbox"
              name="NPOFROM"
              id="NPOFROM"
              checked={values?.NPOFROM ? values?.NPOFROM : false}
              onChange={(e) =>
                handleChange({
                  target: { value: e.target.checked, name: "NPOFROM" },
                })
              }
            />
            <label className="form-check-label ml-4" htmlFor={`NPOFROM`}>
              {t("NPO FROM")}
            </label>

            <TimePicker
              placeholderName=""
              lable={t("")}
              id="NPOFromTime"
              disable={!values?.NPOFROM}
              name="NPOFromTime"
              value={values?.NPOFromTime}
              respclass="col-xl-3 col-md-3 col-4"
              handleChange={handleChange}
            />
            {t("HRS.ON")}
            <DatePicker
              className="custom-calendar"
              id="NPOOnDate"
              name="NPOOnDate"
              disable={!values?.NPOFROM}
              placeholder={VITE_DATE_FORMAT}
              lable={t("")}
              value={values?.NPOOnDate}
              respclass={"col-xl-5 col-md-5 col-sm-4 col-4"}
              handleChange={handleChange}
            />
          </div>
          <div className="">
            {t(
              "6 HRS FOR SOUNDS & 3 HRS FOR LIQUIDS BEFORE PLANNED OPERATION TIME"
            )}
          </div>
        </div>

        <div className="col-xl-4 col-md-6 col-12 mb-2 ">
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="iS_APPLY_EMLA"
            id="iS_APPLY_EMLA"
            checked={values?.iS_APPLY_EMLA ? values?.iS_APPLY_EMLA : false}
            onChange={(e) =>
              handleChange({
                target: { value: e.target.checked, name: "iS_APPLY_EMLA" },
              })
            }
          />
          <label className="form-check-label ml-4" htmlFor={`iS_APPLY_EMLA`}>
            {t(
              "APPLY EMLA/PRILOX CREAM ON BOTH DORSUM OF 90 MIN BEFORE SHIFTING TO OT."
            )}
          </label>
        </div>

        <div className="col-xl-4 col-md-6 col-12 mb-2 ">
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="REMOVE_ALL"
            id="REMOVE_ALL"
            checked={values?.REMOVE_ALL ? values?.REMOVE_ALL : false}
            onChange={(e) =>
              handleChange({
                target: { value: e.target.checked, name: "REMOVE_ALL" },
              })
            }
          />
          <label className="form-check-label ml-4" htmlFor={`REMOVE_ALL`}>
            {t(
              "REMOVE ALL PIERCINGS,DENTURES REMOVABLE,NAIL POLISH,CONTACT LENSES.ETC."
            )}
          </label>
        </div>
        <div className="col-xl-4 col-md-6 col-12 mb-2 ">
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="SHIFT_TO_OT"
            id="SHIFT_TO_OT"
            checked={values?.SHIFT_TO_OT ? values?.SHIFT_TO_OT : false}
            onChange={(e) =>
              handleChange({
                target: { value: e.target.checked, name: "SHIFT_TO_OT" },
              })
            }
          />
          <label className="form-check-label ml-4" htmlFor={`SHIFT_TO_OT`}>
            {t("SHIFT TO OT.30 MINS BEFORE PLANNED OPRATION TIME.")}
          </label>
        </div>



        <div
          className="col-xl-8 col-md-12 col-12 mb-2 d-flex "
          style={{ flexWrap: "wrap" }}
        >
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="ItemTab"
            id="ItemTab"
            checked={values?.ItemTab ? values?.ItemTab : false}
            onChange={(e) => handleChange({ target: { value: e.target.checked, name: "ItemTab" } })}
          />
          <label
            className="form-check-label ml-4"
            htmlFor={`ItemTab`}
          >{t("TAB.")}
          </label>
          <AutoComplete

            value={values?.item?.ItemName ? values?.item?.ItemName : values?.item ? values?.item : ""}
            suggestions={items}
            completeMethod={(e) => { search(e) }}
            onChange={(e) => setValues({ ...values, item: e.value })}
            className="col-4 mb-2 "
            onSelect={(e) => validateInvestigation(e)}
            id="item"
            itemTemplate={itemTemplate}
            disabled={!values?.ItemTab}
          />

          <Input
            type="text"
            placeholder=" "
            className="form-control "
            name="mg"
            id={"Mg"}
            value={values?.mg ? values?.mg : ""}
            onChange={handleChange}
            lable={t("Mg")}
            disabled={!values?.ItemTab}

            respclass="col-xl-1 col-md-1 col-sm-1 col-2"
          />

          <TimePicker
            placeholderName=""
            lable={t("")}
            id="tab_AT"
            disable={!values?.ItemTab}
            name="tab_AT"
            value={values?.tab_AT}
            respclass="col-2 "
            handleChange={handleChange}
          />
          {t("HRS.ON")}
          <DatePicker
            className="custom-calendar"
            id="tabOnDate"
            disable={!values?.ItemTab}
            name="tabOnDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("")}
            value={values?.tabOnDate}
            respclass={"col-xl-2 col-md-3 col-sm-2 col-4"}
            handleChange={handleChange}
          />

          <button className="btn btn-primary" onClick={(e) => addTabItem(e)}> {t("Add")} </button>
          <div className="col-12">
            <Tables thead={[{ name: t("S.No.") },
            { name: t("Tab Name") },
            { name: t("Tab Dose") },
            { name: t("Time") },
            { name: t("Date") },
            { name: t("Remove") },]} tbody={tabItemTableData?.map((val, index) => ({
              sno: index + 1,
              tabName: val?.ItemName,
              tabDose: val?.mg,
              time: moment(val?.tab_AT).format("hh:mm A"),
              date: moment(val?.tabOnDate).format("YYYY-MM-DD"),
              remove: <i className="fa fa-trash text-danger text-center" onClick={() => removeTabItem(index)}></i>
            }))} />
          </div>
        </div>

        <div className="col-xl-4 col-md-6 col-12 mb-2 d-flex">
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="NEBULISATION_WITH"
            id="NEBULISATION_WITH"
            checked={
              values?.NEBULISATION_WITH ? values?.NEBULISATION_WITH : false
            }
            onChange={(e) =>
              handleChange({
                target: { value: e.target.checked, name: "NEBULISATION_WITH" },
              })
            }
          />
          <label
            className="form-check-label ml-4"
            htmlFor={`NEBULISATION_WITH`}
          >
            {t("NEBULISATION WITH")}
          </label>

          <Input
            type="text"
            placeholder=" "
            className="form-control "
            disabled={!values?.NEBULISATION_WITH}
            name="NEBULISATION_ON"
            // id={"NEBULISATION_ON"}
            value={values?.NEBULISATION_ON ? values?.NEBULISATION_ON : ""}
            onChange={handleChange}
            lable={t("")}
            respclass="col-2"
          />
          {t("ON")}
          <DatePicker
            className="custom-calendar"
            id="NEBULISATION_ON_DATE"
            name="tabOnDate"
            disable={!values?.NEBULISATION_WITH}
            placeholder={VITE_DATE_FORMAT}
            lable={t("")}
            value={values?.NEBULISATION_ON_DATE}
            respclass={"col-xl-4 col-md-4 col-sm-2 col-4"}
            handleChange={handleChange}
          />
          {t("At")}
          <TimePicker
            placeholderName=""
            lable={t("")}
            disable={!values?.NEBULISATION_WITH}
            id="NEBULISATION_ON_Time"
            name="NEBULISATION_ON_Time"
            value={values?.NEBULISATION_ON_Time}
            respclass="col-2 "
            handleChange={handleChange}
          />
          {t("HRS.")}
        </div>
        <div className="col-xl-4 col-md-6 col-12 mb-2 ">
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="isPatientCan"
            id="isPatientCan"
            checked={values?.isPatientCan ? values?.isPatientCan : false}
            onChange={(e) =>
              handleChange({
                target: { value: e.target.checked, name: "isPatientCan" },
              })
            }
          />
          <label className="form-check-label ml-4" htmlFor={`isPatientCan`}>
            {t("PATIENT CAN TAKE USUAL PREOP MEDICATIONS EXCEPT -")}
          </label>
        </div>

        <div
          className="col-xl-12 col-md-6 col-12 mb-2 d-flex"
          style={{ flexWrap: "wrap" }}
        >
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="isStopOral"
            id="isStopOral"
            checked={values?.isStopOral ? values?.isStopOral : false}
            onChange={(e) =>
              handleChange({
                target: { value: e.target.checked, name: "isStopOral" },
              })
            }
          />
          <label className="form-check-label ml-4" htmlFor={`isStopOral`}>
            {t(
              "STOP ORAL HYPOGLYCEMIC AGENTS FROM CONCERNED ANESTHESIOLOGIST.TREAT ACCORDINGLY"
            )}
          </label>

          <DatePicker
            className="custom-calendar"
            id="STOP_ORALFromDate"
            name="STOP_ORALFromDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("")}
            disable={!values?.isStopOral}
            value={values?.STOP_ORALFromDate}
            respclass={"col-xl-2 col-md-3 col-sm-2 col-4"}
            handleChange={handleChange}
          />
          {t("GRBS AT")}
          <TimePicker
            placeholderName=""
            lable={t("")}
            id="stoP_ORAL_time"
            disable={!values?.isStopOral}
            name="stoP_ORAL_time"
            value={values?.stoP_ORAL_time}
            respclass="col-2 "
            handleChange={handleChange}
          />
          {t(".HRS ON")}
          <DatePicker
            className="custom-calendar"
            id="stoP_ORAL_from_on"
            name="stoP_ORAL_from_on"
            disable={!values?.isStopOral}
            placeholder={VITE_DATE_FORMAT}
            lable={t("")}
            value={values?.stoP_ORAL_from_on}
            respclass={"col-xl-2 col-md-3 col-sm-2 col-4"}
            handleChange={handleChange}
          />
          {t("AND INFORMATION")}
        </div>

        <div className="col-xl-4 col-md-6 col-12 mb-2 d-flex ">
          <input
            className="form-check-input table-checkbox ml-1"
            type="checkbox"
            name="IsOther"
            id="IsOther"
            checked={values?.IsOther ? values?.IsOther : false}
            onChange={(e) =>
              handleChange({
                target: { value: e.target.checked, name: "IsOther" },
              })
            }
          />
          <label className="form-check-label ml-4" htmlFor={`IsOther`}>
            {t("Other")}
          </label>

          <Input
            type="text"
            placeholder=" "
            className="form-control "
            name="otherDeatails"
            disabled={!values?.IsOther}
            // id={"NEBULISATION_ON"}
            value={values?.otherDeatails ? values?.otherDeatails : ""}
            onChange={handleChange}
            lable={t("")}
            respclass="col-4"
          />
        </div>
        <button className="btn btn-primary ml-3" onClick={Savepreopinstruction}>
          {" "}
          {t("Save")}
        </button>
      </div>
      {listData?.preopinstruction?.length > 0 && (
        <>
          <Heading title={t("PRE OP Instructions Result")} isBreadcrumb={false} />
          <Tables thead={[
            { name: t("S.No."), width: "1%" },
            { name: t("Patient Name"), width: "1%" },
            { name: t("Entry Date"), width: "1%" },
            { name: t("Entry BY"), width: "1%" },
            { name: t("Edit	"), width: "1%" },
            { name: t("Print"), width: "1%" },
            { name: t("Remove"), width: "1%" }
          ]} tbody={listData?.preopinstruction?.map((val, index) => ({
            sno: index + 1,
            patientname: val?.patientname,
            Entry_date: val?.Entry_date,
            Entry_by: val?.Entry_by,
            Edit: <i className="fa fa-edit p-1" onClick={() => handleEdit(val)} />,
            Print: <i className="fa fa-print p-1" onClick={() => handlePrint(val)} />,
            Remove: <i className="fa fa-trash text-danger text-center" onClick={() => handleRemove(val?.preid)} />
          }))}
            style={{ maxHeight: "25vh" }}
          />
        </>
      )}



    </>

    // </div>
  );
};

export default PreOpInstruction;
