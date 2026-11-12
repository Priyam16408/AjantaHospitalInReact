import React from "react";
import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";

const VitalSign = () => {
  const [t] = useTranslation();
  return (
    <>
      <div className="row mt-3">
        <Input
          type="date"
          className="form-control"
          id="Date"
          name="Date"
          lable={t("Date")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          // onKeyDown={Tabfunctionality}
        />
        <Input
          type="time"
          className="form-control"
          id="time"
          name="time"
          lable={t("Time")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          // onKeyDown={Tabfunctionality}
        />
        <Input
          type="number"
          className="form-control"
          id="BP"
          name="BP"
          lable={t("BP")}
          placeholder=" "
          required={true}
          respclass="col-xl-1 col-md-1 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">
          mm/hg
        </span>
        <Input
          type="number"
          className="form-control"
          id="Pulse"
          name="Pulse"
          lable={t("Pulse")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">bpm</span>
        <Input
          type="number"
          className="form-control"
          id="Resp"
          name="Resp"
          lable={t("Resp")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">
          /min
        </span>
       
        <Input
          type="number"
          className="form-control"
          id="HT"
          name="HT"
          lable={t("HT.")}
          placeholder=" "
          required={true}
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
          // onKeyDown={Tabfunctionality}
        />
        <ReactSelect
          placeholderName={t("CM")}
          id={"CM"}
          searchable={true}
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
        />
         <ReactSelect
          placeholderName={t("Blood Group")}
          id={"BloodGroup"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
        />
        
        <Input
          type="number"
          className="form-control"
          id="IBW"
          name="IBW"
          lable={t("IBW")}
          placeholder=" "
          required={true}
          respclass="col-xl-1 col-md-1 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">kg</span>
       
        <Input
          type="number"
          className="form-control"
          id="SittingHeight"
          name="SittingHeight"
          lable={t("Sitting Height")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">/cm</span>
        <Input
          type="number"
          className="form-control"
          id="ArmSpan"
          name="ArmSpan"
          lable={t("Arm Span")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">/cm</span>
        
       <Input
          type="number"
          className="form-control"
          id="Temp"
          name="Temp"
          lable={t("Temp.")}
          placeholder=" "
          required={true}
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
          // onKeyDown={Tabfunctionality}
        />
        <ReactSelect
          placeholderName={t("C")}
          id={"c"}
          searchable={true}
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
        />
        <Input
          type="text"
          className="form-control"
          id="GCS"
          name="GCS"
          lable={t("GCS")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-12"
          // onKeyDown={Tabfunctionality}
        />
        
        <Input
          type="number"
          className="form-control"
          id="BloodGlucose"
          name="BloodGlucose"
          lable={t("Blood Glucose")}
          placeholder=" "
          required={true}
          respclass="col-xl-1 col-md-1 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">
          mmol/l
        </span>
       
        <Input
          type="number"
          className="form-control"
          id="SPO2"
          name="SPO2"
          lable={t("SPO2")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-10"
          // onKeyDown={Tabfunctionality}
        />
        <span className="col-xl-1 col-md-1 col-sm-1 col-1 vital_item">%</span>
        
        <Input
          type="text"
          className="form-control"
          id="Remarks"
          name="Remarks"
          lable={t("Remark..")}
          placeholder=" "
          required={true}
          respclass="col-xl-3 col-md-3 col-sm-4 col-12"
          // onKeyDown={Tabfunctionality}
        />
        <Input
          type="number"
          className="form-control"
          id="WT"
          name="WT"
          lable={t("WT.")}
          placeholder=" "
          required={true}
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
          // onKeyDown={Tabfunctionality}
        />
        <ReactSelect
          placeholderName={t("KG")}
          id={"KG"}
          searchable={true}
          respclass="col-xl-1 col-md-1 col-sm-6 col-12"
        />
        <Input
          type="number"
          className="form-control"
          id="PainScore"
          name="PainScore"
          lable={t("Pain Score")}
          placeholder=" "
          required={true}
          respclass="col-xl-2 col-md-2 col-sm-4 col-12"
          // onKeyDown={Tabfunctionality}
        />
        
        <ReactSelect
          placeholderName={t("MUAC")}
          id={"MUAC"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
        />
      </div>
      <div className="row">
        <label className="m-2 ">{t("Danger Sign")} :</label>

        <input type="checkbox" id="drink" />
        <label htmlFor="drink" className="m-2 DangerSign">
          {t("Unable to drink or Breastfeed")}
        </label>
        <input type="checkbox" id="VomitEverything" />
        <label htmlFor="VomitEverything" className="m-2 DangerSign">
          {t("Vomit Everything")}
        </label>
        <input type="checkbox" id="LetharsicIllness" />
        <label htmlFor="LetharsicIllness" className="m-2 DangerSign">
          {t("Had a convulsions in this illness")}
        </label>
        <input type="checkbox" id="LetharsicUnconsious" />
        <label htmlFor="LetharsicUnconsious" className="m-2 DangerSign">
          {t("Is Letharsic or Unconsious")}
        </label>
        <input type="checkbox" id="ConvulsingNow" />
        <label htmlFor="ConvulsingNow" className="m-2 DangerSign">
          {t("Is Convulsing now")}
        </label>
      </div>
      <div className="row">
        <ReactSelect
          placeholderName={t("Alcohol")}
          id={"Alcohol"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Smoking")}
          id={"Smoking"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Diabetes")}
          id={"Diabetes"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
        />
      </div>
    </>
  );
};

export default VitalSign;
