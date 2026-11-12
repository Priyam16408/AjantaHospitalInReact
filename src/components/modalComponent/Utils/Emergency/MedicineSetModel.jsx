import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import { MEDICINE_SET_INDENT_TYPE } from '../../../../utils/constant';
import ReactSelect from '../../../formComponent/ReactSelect';
import Tables from '../../../UI/customTable';
import { SearchPrescribeMedicine } from '../../../../networkServices/DoctorApi';
import { filterByTypes, handleReactSelectDropDownOptions } from '../../../../utils/utils';
import CancelButton from '../../../UI/CancelButton';
import SaveButton from "@components/UI/SaveButton";
import { LoadMedSetIndentMedAPI } from '../../../../networkServices/Emergency';

export default function MedicineSetModel({ data, dropdownList, setParentTbody, setHandleModelData }) {
  const [t] = useTranslation();
  const thead = [
    { name: t("#"), width: "1%" },
    { name: t("EmergencyModule.Select"), width: "1%" },
    t("EmergencyModule.MedicineName"),
    t("EmergencyModule.Quantity"),
    t("EmergencyModule.Dose"),
    t("EmergencyModule.Time"),
    t("EmergencyModule.Duration"),
    t("EmergencyModule.Route"),
  ]

  const [tBody, setTbody] = useState([]);
  const [medicineSetList, setMedicineSetList] = useState([]);
  const [values, setValues] = useState({ type: { value: "Set" } });

  const hanldeSelect = async (name, value) => {
    setValues((val) => ({ ...val, [name]: value }))
    if (name === 'type') {
      setValues((val) => ({ ...val, ["MedicineSet"]: null }))
      setTbody([])
      if (value?.value === "Set") {
        MedicineSetSearch()
      } else {
        LoadMedSetIndentMed()
      }
    }
    if (name === "MedicineSet") {
      value?.valueField?.map((val) => {
        val.IsChecked = true;
      })
      setTbody(value?.valueField)
    }
  }


  const MedicineSetSearch = async () => {
    const apiResp = await SearchPrescribeMedicine(data?.DoctorID);
    if (apiResp?.success) {
      setMedicineSetList(handleReactSelectDropDownOptions(apiResp?.data, "tempName", "id"))
    } else {
      setMedicineSetList([])
    }
  }

  const LoadMedSetIndentMed = async () => {
    const apiResp = await LoadMedSetIndentMedAPI(data?.TID);
    if (apiResp?.success) {
      setMedicineSetList(handleReactSelectDropDownOptions(apiResp?.data, "dtEntry", "indentNo"))
    } else {
      setMedicineSetList([])
    }
  }

  useEffect(() => {
    MedicineSetSearch()
  }, [])

  const handleCustomInput = (index, name, value, type, max) => {
    if (type === "number") {
      if (!isNaN(value) && Number(value) <= max) {
        const data = [...tBody];
        data[index][name] = value;
        setTbody(data);
      } else {
        return false
      }
    } else {
      const data = [...tBody];
      data[index][name] = value;
      setTbody(data);
    }

  };

  const handleCustomSelect = (index, name, value) => {
    const lableList = JSON.parse(JSON.stringify(tBody));
    lableList[index][name] = value;
    setTbody(lableList);
  }


  console.log("tBodytBody", tBody)
  const handleSaveMedSet = () => {
    let bodyList = tBody?.filter((item) => item?.IsChecked === true)?.map((val) => ({
      code: 2,
      medicineName: { ItemName: val?.name, ItemID: `${val?.itemID}#####` },
      Dose: val?.dose,
      Times: { label: val?.times?.label ? val?.times?.label : val?.times },
      Duration: { label: val?.duration?.label ? val?.duration?.label : val?.duration },
      Route: { label: val?.route?.label ? val?.route?.label : val?.route },
      Doctor: { label: data?.Doctor },
      Quantity: val?.quantity,
      Remaks: val?.remarks,
      medSet: true
    }))
    setParentTbody((item) => ([...item, ...bodyList]))
    setHandleModelData((val) => ({ ...val, isOpen: false }))
  }

  return (<>
    <div className="row">

      <ReactSelect
        placeholderName={t("EmergencyModule.Type")}
        className="form-control"
        id={"type"}
        name="type"
        dynamicOptions={MEDICINE_SET_INDENT_TYPE}
        searchable={true}
        respclass="col-xl-3 col-md-4 col-sm-6 col-12"
        value={`${values?.type?.value}`}
        handleChange={(name, value) => { hanldeSelect(name, value) }}
      />
      {console.log("values?.MedicineSet", values?.MedicineSet)}
      <ReactSelect
        placeholderName={t("EmergencyModule.MedicineSet")}
        className="form-control"
        id={"MedicineSet"}
        name="MedicineSet"
        dynamicOptions={medicineSetList}
        searchable={true}
        respclass="col-xl-3 col-md-4 col-sm-6 col-12"
        value={`${values?.MedicineSet?.value ? values?.MedicineSet?.value : ""}`}
        handleChange={(name, value) => { hanldeSelect(name, value) }}
      />
    </div>


    <Tables
      thead={thead}
      tbody={tBody?.map((val, index) => ({
        SNO: index + 1,
        medicineName: <input
          type="checkbox"
          name="IsChecked"
          checked={val?.IsChecked}
          onChange={(e) => { handleCustomInput(index, "IsChecked", e.target.checked, "text", 100) }}

        />,
        MedName: val?.name,
        quantity: <Input
          type="text"
          className="table-input"
          removeFormGroupClass={true}
          display={"right"}
          name={"quantity"}
          value={val?.quantity}
          onChange={(e) => { handleCustomInput(index, "quantity", e.target.value, "number", 100) }}
        />,
        dose: <Input
          type="text"
          className="table-input"
          removeFormGroupClass={true}
          // display={"right"}
          name={"dose"}
          value={val?.dose}
          onChange={(e) => { handleCustomInput(index, "dose", e.target.value, "text", 100) }}
        />,
        times: <ReactSelect
          id={"times"}
          value={val?.times?.value ? val?.times?.value : val?.times}
          handleChange={(name, e) => handleCustomSelect(index, name, e)}
          searchable={true}
          name={"times"}
          dynamicOptions={filterByTypes(
            dropdownList?.GetTimeRouteDurationList,
            ["Time"],
            ["TYPE"],
            "NAME",
            "NAME",
            "SequenceNo"
          )}
          removeIsClearable={true}
          respclass="mt-1"
        />,
        duration: <ReactSelect
          // placeholderName={t("NursingWard.SampleCollection.doctorlist")}
          id={"duration"}
          value={val?.duration?.value ? val?.duration?.value : val?.duration}
          handleChange={(name, e) => handleCustomSelect(index, name, e)}
          searchable={true}
          name={"duration"}
          dynamicOptions={filterByTypes(
            dropdownList?.GetTimeRouteDurationList,
            ["Duration"],
            ["TYPE"],
            "NAME",
            "SequenceNo"
          )}
          removeIsClearable={true}
          respclass="mt-1"
        />,
        route: <ReactSelect
          id={"route"}
          value={val?.route?.value ? val?.route?.value : val?.route}
          handleChange={(name, e) => handleCustomSelect(index, name, e)}
          searchable={true}
          name={"route"}
          dynamicOptions={filterByTypes(
            dropdownList?.GetTimeRouteDurationList,
            ["Route"],
            ["TYPE"],
            "NAME",
            "SequenceNo"
          )}
          removeIsClearable={true}
          respclass="mt-1"
        />,
        // duration: val?.duration,
        // route: val?.route,

      }))}
    />
    <>
      <div className="ftr_btn">
        <SaveButton btnName={t("Add")} onClick={handleSaveMedSet} />
        <CancelButton
          cancleBtnName={"Cancel"}
          onClick={() => setHandleModelData((val) => ({ ...val, isOpen: false }))}
        />
      </div>
    </>
  </>
  )
}
