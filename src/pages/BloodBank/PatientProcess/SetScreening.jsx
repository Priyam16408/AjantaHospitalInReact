import React, { useEffect, useState } from "react";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import { BloodBankCheckPatientValidTime } from "../../../networkServices/BloodBank/BloodBank";

const SetScreening = ({ ele, setModalState }) => {
  console.log("first", ele);
  const [t] = useTranslation();
  const [values, setValues] = useState({});
  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const getData = async () => {
    const data = await BloodBankCheckPatientValidTime(ele?.Grouping_Id);
    if (data?.success) {
      const row = data?.data[0];
      
      setValues({
        CellI: { label: `${row.Cell1}+`, value: `${row.Cell1}` },
        CellII: { label: `${row.Cell2}+`, value: `${row.Cell2}` },
        CellIII: { label: `${row.Cell3}+`, value: `${row.Cell3}` },
        overAllResult: { label: row.Result, value: row.Result },
        remark: row.Remarks || "",
        EntryDateTime: row?.EntryDateTime,
        isExist: row?.isExist,
        isValid: row?.isValid,
        isEdit: row?.isValid === 1 ? 1 : 0,
      });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };
  useEffect(() => {
    setModalState((val) => ({ ...val, modalData: { ...values, ...ele } }));
  }, [values]);

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="">
      <div className="row p-2">
        <LabeledInput
          label={"UHID"}
          value={ele?.PatientID}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"IPD No."}
          value={ele?.IPDNo}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"Patient Name"}
          value={ele?.Pname}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"Component"}
          value={ele?.ItemName}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"Blood Group"}
          value={ele?.BloodGroup}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"Entry Date Time"}
          value={ele?.dtEntry}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <ReactSelect
          placeholderName={t("Cell I")}
          name="CellI"
          value={values?.CellI?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "0", value: "0" },
            { label: "1+", value: "1" },
            { label: "2+", value: "2" },
            { label: "3+", value: "3" },
            { label: "4+", value: "4" },
          ]}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Cell II")}
          name="CellII"
          value={values?.CellII?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "0", value: "0" },
            { label: "1+", value: "1" },
            { label: "2+", value: "2" },
            { label: "3+", value: "3" },
            { label: "4+", value: "4" },
          ]}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Cell III")}
          name="CellIII"
          value={values?.CellIII?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "0", value: "0" },
            { label: "1+", value: "1" },
            { label: "2+", value: "2" },
            { label: "3+", value: "3" },
            { label: "4+", value: "4" },
          ]}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Over All Result")}
          name="overAllResult"
          value={values?.overAllResult?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "N", value: "N" },
            { label: "P", value: "P" },
          ]}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <TextAreaInput
          type="text"
          className={`form-textarea textAreaHeight`}
          id="remark"
          name="remark"
          value={values?.remark ? values?.remark : ""}
          onChange={handleChange}
          lable={t("Remark")}
          placeholder=" "
          respclass="col-xl-8 col-md-4 col-sm-6 col-12"
          rows={1}
        />
      </div>
    </div>
  );
};

export default SetScreening;
