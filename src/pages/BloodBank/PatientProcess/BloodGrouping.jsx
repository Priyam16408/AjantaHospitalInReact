import React, { useEffect, useState } from "react";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";

const BloodGrouping = ({ ele, setModalState }) => {
  const [t] = useTranslation();

  const initialValues = {
    antiA: "1",
    antiB: "1",
    AntiAB: "1",
    rh: "1",
    BloodAlloted: "1",
    BGGroup: "",
    Acell: "1",
    BCell: "1",
    OCell: "1",
    BloodAllotedAlt: "",
  };

  const [values, setValues] = useState({ ...initialValues });

  const investigation = [
    { value: "1", label: "N" },
    { value: "2", label: "P" },
  ];

  const bloodCollectionData = [
    {
      AntiA: "P",
      AntiB: "N",
      AntiAB: "P",
      RH: "P",
      BloodAlloted: "A+",
      BGGroup: "A",
      ACell: "N",
      BCell: "P",
      OCell: "N",
      BloodAllotedAlt: "A",
    },
    {
      AntiA: "P",
      AntiB: "N",
      AntiAB: "P",
      RH: "N",
      BloodAlloted: "A-",
      BGGroup: "A",
      ACell: "P",
      BCell: "P",
      OCell: "N",
      BloodAllotedAlt: "B",
    },
    {
      AntiA: "N",
      AntiB: "P",
      AntiAB: "P",
      RH: "P",
      BloodAlloted: "B+",
      BGGroup: "B",
      ACell: "P",
      BCell: "N",
      OCell: "P",
      BloodAllotedAlt: "AB",
    },
    {
      AntiA: "N",
      AntiB: "P",
      AntiAB: "P",
      RH: "N",
      BloodAlloted: "B-",
      BGGroup: "B",
      ACell: "P",
      BCell: "P",
      OCell: "P",
      BloodAllotedAlt: "O",
    },
    {
      AntiA: "P",
      AntiB: "P",
      AntiAB: "P",
      RH: "P",
      BloodAlloted: "AB+",
      BGGroup: "AB",
    },
    {
      AntiA: "P",
      AntiB: "P",
      AntiAB: "P",
      RH: "N",
      BloodAlloted: "AB-",
      BGGroup: "AB",
    },
    {
      AntiA: "N",
      AntiB: "N",
      AntiAB: "N",
      RH: "P",
      BloodAlloted: "O+",
      BGGroup: "O",
    },
    {
      AntiA: "N",
      AntiB: "N",
      AntiAB: "N",
      RH: "N",
      BloodAlloted: "O-",
      BGGroup: "O",
    },
  ];

  const theadbloodCollection = [
    { width: "8%", name: "AntiA" },
    { width: "8%", name: "AntiB" },
    { width: "8%", name: "AntiAB" },
    { width: "6%", name: "RH" },
    { width: "10%", name: "Blood Alloted" },
    { width: "8%", name: "BG Group" },
    { width: "8%", name: "A Cell" },
    { width: "8%", name: "B Cell" },
    { width: "8%", name: "O Cell" },
    { width: "10%", name: "Alt Blood Alloted" },
  ];
  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    setModalState((val) => ({ ...val, modalData: { ...values, ...ele } }));
  }, [values]);
  return (
    <div className="">
      <div className="row p-2">
        <LabeledInput
          label={"Collection ID"}
          value={ele?.CollectionID}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-1"}
        />
        <LabeledInput
          label={"Name"}
          value={ele?.PName}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-1"}
        />
        <LabeledInput
          label={"Blood Group(Screened)"}
          value={ele?.BloodGroup}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-1"}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("AntiA")}
            id={"antiA"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={investigation}
            respclass="col-lg-1-7 col-md-4 col-12 mb-2"
            handleChange={handleReactSelect}
            value={`${values?.antiA?.value}`}
            name={"antiA"}
          />

          <ReactSelect
            placeholderName={t("AntiB")}
            id={"antiB"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={investigation}
            respclass="col-lg-1-7 col-md-4 col-12 mb-2"
            handleChange={handleReactSelect}
            value={`${values?.antiB?.value}`}
            name={"antiB"}
          />

          <ReactSelect
            placeholderName={t("AntiAB")}
            id={"AntiAB"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={investigation}
            respclass="col-lg-1-7 col-md-4 col-12 mb-2"
            handleChange={handleReactSelect}
            value={`${values?.AntiAB?.value}`}
            name={"AntiAB"}
          />

          <ReactSelect
            placeholderName={t("RH")}
            id={"rh"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={investigation}
            respclass="col-lg-1-7 col-md-4 col-12 mb-2"
            handleChange={handleReactSelect}
            value={`${values?.rh?.value}`}
            name={"rh"}
          />

          <ReactSelect
            placeholderName={t("ACell")}
            id={"Acell"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={investigation}
            respclass="col-lg-1-7 col-md-4 col-12 mb-2"
            handleChange={handleReactSelect}
            value={`${values?.Acell?.value}`}
            name={"Acell"}
          />

          <ReactSelect
            placeholderName={t("BCell")}
            id={"Bcell"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={investigation}
            respclass="col-lg-1-7 col-md-4 col-12 mb-2"
            handleChange={handleReactSelect}
            value={`${values?.Bcell?.value}`}
            name={"Bcell"}
          />

          <ReactSelect
            placeholderName={t("OCell")}
            id={"Ocell"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={investigation}
            respclass="col-lg-1-7 col-md-4 col-12 mb-2"
            handleChange={handleReactSelect}
            value={`${values?.Ocell?.value}`}
            name={"Ocell"}
          />

          <div className="w-100 mt-2">
            <Tables
              thead={theadbloodCollection}
              tbody={bloodCollectionData.map((val, index) => ({
                // sno: index + 1,
                AntiA: val.AntiA,
                AntiB: val.AntiB,
                AntiAB: val.AntiAB,
                RH: val.RH,
                BloodAlloted: val.BloodAlloted,
                BGGroup: val.BGGroup || "",
                ACell: val.ACell || "",
                BCell: val.BCell || "",
                OCell: val.OCell || "",
                BloodAllotedAlt: val.BloodAllotedAlt || "",
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodGrouping;
