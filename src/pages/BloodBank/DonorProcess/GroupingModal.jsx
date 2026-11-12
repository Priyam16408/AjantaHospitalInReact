import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";

export default function GroupingModal({ handleChangeModel, inputData }) {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    antiA: { value: "1", label: "N" },
    antiB: { value: "1", label: "N" },
    AntiAB: { value: "1", label: "N" },
    rh: { value: "1", label: "N" },
    Acell: { value: "1", label: "N" },
    Bcell: { value: "1", label: "N" },
    Ocell: { value: "1", label: "N" },
  });
  console.log("the inputData data is in modal", inputData);

  useEffect(() => {
    handleChangeModel(values);
  }, [values]);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const investigation = [
    { value: "1", label: "N" },
    { value: "2", label: "P" },
  ];

  const DonationCompleted = [
    { value: "select", label: "select" },
    { value: "0", label: "No" },
    { value: "1", label: "Yes" },
  ];

  const bloodCollectionData = [
  {
    AntiA: 'P', AntiB: 'N', AntiAB: 'P', RH: 'P', BloodAlloted: 'A+',
    BGGroup: 'A', ACell: 'N', BCell: 'P', OCell: 'N', BloodAllotedAlt: 'A'
  },
  {
    AntiA: 'P', AntiB: 'N', AntiAB: 'P', RH: 'N', BloodAlloted: 'A-',
    BGGroup: 'A', ACell: 'P', BCell: 'P', OCell: 'N', BloodAllotedAlt: 'B'
  },
  {
    AntiA: 'N', AntiB: 'P', AntiAB: 'P', RH: 'P', BloodAlloted: 'B+',
    BGGroup: 'B', ACell: 'P', BCell: 'N', OCell: 'P', BloodAllotedAlt: 'AB'
  },
  {
    AntiA: 'N', AntiB: 'P', AntiAB: 'P', RH: 'N', BloodAlloted: 'B-',
    BGGroup: 'B', ACell: 'P', BCell: 'P', OCell: 'P', BloodAllotedAlt: 'O'
  },
  {
    AntiA: 'P', AntiB: 'P', AntiAB: 'P', RH: 'P', BloodAlloted: 'AB+',
    BGGroup: 'AB'
  },
  {
    AntiA: 'P', AntiB: 'P', AntiAB: 'P', RH: 'N', BloodAlloted: 'AB-',
    BGGroup: 'AB'
  },
  {
    AntiA: 'N', AntiB: 'N', AntiAB: 'N', RH: 'P', BloodAlloted: 'O+',
    BGGroup: 'O'
  },
  {
    AntiA: 'N', AntiB: 'N', AntiAB: 'N', RH: 'N', BloodAlloted: 'O-',
    BGGroup: 'O'
  },
];

const theadbloodCollection = [
  { width: "5%", name: "S.No" },
  { width: "8%", name: "AntiA" },
  { width: "8%", name: "AntiB" },
  { width: "8%", name: "AntiAB" },
  { width: "6%", name: "RH" },
  { width: "10%", name: "Blood Alloted" },
  { width: "8%", name: "BG Group" },
  { width: "8%", name: "A Cell" },
  { width: "8%", name: "B Cell" },
  { width: "8%", name: "O Cell" },
  { width: "10%", name: "Alt Blood Alloted" }
];
  console.log("the inputdata is", inputData);

  return (
    <>
      <div className="d-flex align-items-baseline w-100 mb-2">
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 w-100">
          {/* Static Input Fields */}
          <div className="col mb-1 ">
            <LabeledInput
              label={t("Collection ID")}
              value={inputData?.Bloodcollection_id}
            />
          </div>
          <div className="col mb-1">
            <LabeledInput label={t("Name")} value={inputData?.name} />
          </div>
          <div className="col mb-1">
            <LabeledInput
              label={t("Blood Group (Screened")}
              value={inputData?.BloodGroup}
            />
          </div>
        </div>
      </div>

      <Heading title={t("Investigation")} isBreadcrumb={false} />
    <div className="d-flex flex-wrap w-100 mt-2">

        <ReactSelect
          placeholderName={t("ANTIA")}
          id={"antiA"}
          searchable={true}
          removeIsClearable={true}
          dynamicOptions={investigation}
        respclass="col-lg-1-7 col-md-4 col-12 mb-2"

          handleChange={handleSelect}
          value={`${values?.antiA?.value}`}
          name={"antiA"}
        />

        <ReactSelect
          placeholderName={t("ANTIB")}
          id={"antiB"}
          searchable={true}
          removeIsClearable={true}
          dynamicOptions={investigation}

          respclass="col-lg-1-7 col-md-4 col-12 mb-2"
        
          handleChange={handleSelect}
          value={`${values?.antiB?.value}`}
          name={"antiB"}
        />

        <ReactSelect
          placeholderName={t("ANTIAB")}
          id={"AntiAB"}
          searchable={true}
          removeIsClearable={true}
          dynamicOptions={investigation}
          respclass="col-lg-1-7 col-md-4 col-12 mb-2"
        
          handleChange={handleSelect}
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
        
          handleChange={handleSelect}
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
        
          handleChange={handleSelect}
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
        
          handleChange={handleSelect}
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
        
          handleChange={handleSelect}
          value={`${values?.Ocell?.value}`}
          name={"Ocell"}
        />
      </div>

            <div className="w-100 mt-2">
      <Tables 
  thead={theadbloodCollection}
  tbody={bloodCollectionData.map((val, index) => ({
    sno: index + 1,
    AntiA: val.AntiA,
    AntiB: val.AntiB,
    AntiAB: val.AntiAB,
    RH: val.RH,
    BloodAlloted: val.BloodAlloted,
    BGGroup: val.BGGroup || '',
    ACell: val.ACell || '',
    BCell: val.BCell || '',
    OCell: val.OCell || '',
    BloodAllotedAlt: val.BloodAllotedAlt || ''
  }))}
  
/>
</div>
            
    </>
  );
}
