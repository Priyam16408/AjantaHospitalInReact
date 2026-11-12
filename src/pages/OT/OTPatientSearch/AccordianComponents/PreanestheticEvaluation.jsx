import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import CustomCheckboxHeading from "../../../../components/formComponent/CustomCheckboxHeading";
import TextAreaInput from "../../../../components/formComponent/TextAreaInput";
import { notify, SavePACPaload, UpdatePACPaload } from "../../../../utils/ustil2";
import { EditpacresultdetailAPI, GetpacresultdetailsAPI, RemovepacAPI, SaveOTPACAPI, UpdateOTPACAPI } from "../../../../networkServices/OT/otAPI";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import { GOBIMedicationsList } from "../../../../utils/constant";


const PreanestheticEvaluation = ({ data }) => {
  const [values, setValues] = useState({});
  const [t] = useTranslation()
  const handleChange = (e) => {
    const { value, name } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  }
  const [list, setList] = useState([])
  const [GOBIMedicationsAlcohol, setGOBIMedicationsAlcohol] = useState(GOBIMedicationsList)
  const handleSave = async () => {
    let payload = SavePACPaload(GOBIMedicationsAlcohol, values, data)
    let apiResp = await SaveOTPACAPI(payload)
    if (apiResp?.success) {
      Getpacresultdetails()
      notify(apiResp?.message)
    } else {
      notify(apiResp?.message, "error")
    }
  }
  const handleEditUpdate = async () => {
    let payload = UpdatePACPaload(GOBIMedicationsAlcohol, values, data)
    let apiResp = await UpdateOTPACAPI(payload)
    if (apiResp?.success) {
      Getpacresultdetails()
      setGOBIMedicationsAlcohol(GOBIMedicationsList)
      setValues({})
      notify(apiResp?.message)
    } else {
      notify(apiResp?.message, "error")
    }
  }

  async function Getpacresultdetails() {
    const apiResp = await GetpacresultdetailsAPI(data?.PatientID, data?.TransactionID,)
    if (apiResp?.success) {
      setList(apiResp?.data)
    } else {
      setList([])
    }
  }
  useEffect(() => {
    Getpacresultdetails()
  }, [])

  const handleRemove = async (id) => {
    const apiResponse = await RemovepacAPI(id)
    if (apiResponse?.success) {
      notify(apiResponse?.message, "success")
      Getpacresultdetails()
    } else {
      notify(apiResponse?.message, "error")
    }

  }
  const handlePrint = () => {

  }
  console.log("sasdds", GOBIMedicationsAlcohol)
  const handleEdit = async (value) => {
    const apiResp = await EditpacresultdetailAPI(value?.pacid)
    if (apiResp?.success && apiResp?.data?.length > 0) {
      const data = apiResp?.data[0]
      setValues((val) => ({ ...val, SURGICAL_ANESTHETIC: data?.SURGICAL_ANESTHETIC, pacid: value?.pacid }))
      let mappedData = GOBIMedicationsAlcohol?.map((val) => {
        const optionsData = val?.options?.map((item) => {
          // console.log(".........", item, data[val?.name])
          // console.log("llllllllllllllll", data[val?.name]?.split(","), item?.label)
          if (data[val?.name]?.split(",")?.find((v) => (v === item?.label))) {
            return { ...item, value: true }
          } else if (data[val?.name]?.split(",")?.find((v) => (v === item?.label) || ((v?.split("#")[0] === item?.label) && v?.split("#")?.length > 1))) {
            const inputValue = data[val?.name]?.split(",")?.find((v) => (v?.split("#")[0] === item?.label))
            return { ...item, value: true, inputValue: inputValue?.split("#")[1] }
          } else {
            return { ...item, value: false }
          }
        })
        return {
          ...val,
          options: optionsData
        }

      })
      setGOBIMedicationsAlcohol(mappedData)
    }
  }
  return (

    <>
      <div className="row p-2">

        <TextAreaInput
          lable={t("SURGICAL/ANESTHETIC HISTORY")}
          placeholder=""
          className="w-100 "
          id="SURGICAL_ANESTHETIC"
          rows={2}
          name="SURGICAL_ANESTHETIC"
          respclass="col-xl-6 col-md-12 col-sm-12 col-12"
          value={values?.SURGICAL_ANESTHETIC ? values?.SURGICAL_ANESTHETIC : ""}
          maxLength={200}
          onChange={handleChange}
        />

        {GOBIMedicationsAlcohol?.map((data, index) => (
          <CustomCheckboxHeading
            data={data}
            setValues={setValues}
            setList={setGOBIMedicationsAlcohol}
            list={GOBIMedicationsAlcohol}
            index={index}
            respclass="col-xl-6 col-md-12 col-sm-12 col-12"
          />
        ))}
        {values?.pacid ?
          <button button className="btn btn-sm btn-success px-3 ml-2" onClick={handleEditUpdate}>{t("Update")}</button> :
          <button className="btn btn-sm btn-success px-3 ml-2" onClick={handleSave}>{t("Save")}</button>}

      </div >
      {list?.length > 0 && <>
        <Heading title={t("PREANESTHETIC EVALUATION (DEPT OF ANAESTHESIOLOGY & ICU) Result")}></Heading>
        <Tables style={{ maxHeight: "15vh" }} thead={[{ name: "S.No.", width: "1%" }
          , { name: t("Patient Name"), width: "10%" }
          , { name: t("Entry Date"), width: "1%" }
          , { name: t("Entry BY"), width: "1%" }
          , { name: t("Action"), width: "1%" }
        ]} tbody={list?.map((val, index) => ({

          SNO: index + 1,
          PatientName: val?.patientname,
          EntryDate: val?.Entry_date,
          EntryBY: val?.Entry_by,
          Edit: <>
            <i className="fa fa-edit px-3 ml-2" onClick={() => handleEdit(val)}></i>
            <i className="fa fa-print px-3 ml-2" onClick={() => handlePrint(val)}></i>
            <i className="fa fa-trash text-danger px-3 ml-2" onClick={() => handleRemove(val?.pacid)}></i>
          </>,
        }))} />
      </>}
    </>
  );
};

export default PreanestheticEvaluation;
