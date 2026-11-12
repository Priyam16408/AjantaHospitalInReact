import DatePicker from "../formComponent/DatePicker";
import Input from "../formComponent/Input";
import TextAreaInput from "../formComponent/TextAreaInput";
import Heading from "../UI/Heading";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  GetNuclearMedicinesData,
  NuclearMedicineApi,
  UpdateNuclearMedTest,
} from "../../networkServices/dischargeSummaryAPI";
import { notify } from "../../utils/utils";
import moment from "moment";
import Tables from "../UI/customTable";

const NuclearMedicine = (props) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  // const [isEditing, setIsEditing] = useState(false)

  const [date, setDate] = useState(new Date());




  const [formValues, setFormValues] = useState({
    investigationDate: date,
    NeckScan: "",
    MetaStatsis: "",
    Tg: "",
    SCalcium: "",
    ChestXRay: "",
    isEditing: false,
    id: "",
  });

  const [tableDate, setTableData] = useState([]);

  console.log(formValues, "formValues");

  const handleChangeDate = (e)=>{
    const {value}= e.target 
    console.log(value ,"value-------")  
    setDate(value);
  }

  console.log(date,"dateeeeee")


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdateItem = (item) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      isEditing: true,
      NeckScan: item?.NeckScan,
      MetaStatsis: item?.MetaStatsis,
      Tg: item?.Tg,
      SCalcium: item?.SCalcium,
      ChestXRay: item?.ChestXRay,
      id: item?.ID,
    }));
  };

  // console.log(formValues, "formValues");

  const handleUpdateApi = async (e) => {
    try {
      e.preventDefault();
      const payload = [
        {
          patientID: props?.data?.patientID,
          transactionID: props?.data?.transactionID,
          investigationDate: moment(date).format("YYYY-MM-DD"),
          neckScan: formValues.NeckScan,
          metaStatsis: formValues.MetaStatsis,
          tg: formValues.Tg,
          chestXRay: formValues.ChestXRay,
          sCalcium: formValues.SCalcium,
          isActive: true,
          id: formValues.id,
        },
      ];

      const response = await UpdateNuclearMedTest(payload);
      if (response) {
        setTableData(response?.data);
        GetTableData();
        notify(response?.message, "success");
        setFormValues({
          investigationDate: date,
          NeckScan: "",
          MetaStatsis: "",
          Tg: "",
          SCalcium: "",
          ChestXRay: "",
          isEditing: false,
          id: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      notify("Something went wrong!", "error");
    }
  };
  const theadRequestDetails = [
    { width: "1%", name: t("S.no") },
    { width: "5%", name: t("NeckScan") },
    { width: "5%", name: t("MetaStatsis") },
    { width: "5%", name: t("Tg") },
    { width: "5%", name: t("SCalcium") },
    { width: "5%", name: t("CHEST X-RAY") },
    { width: "1%", name: t("Action") },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formValues.investigationDate ||
      !formValues.NeckScan ||
      !formValues.MetaStatsis ||
      !formValues.Tg ||
      !formValues.ChestXRay ||
      !formValues.SCalcium
    ) {
      notify("All fields are required!", "error");
      return;
    }

    const payload = [
      {
        patientID: props?.data?.patientID,
        transactionID: props?.data?.transactionID,
        investigationDate: moment(date).format("YYYY-MM-DD"),
        neckScan: formValues.NeckScan,
        metaStatsis: formValues.MetaStatsis,
        tg: formValues.Tg,
        chestXRay: formValues.ChestXRay,
        sCalcium: formValues.SCalcium,
        isActive: true,
      },
    ];

    try {
      const response = await NuclearMedicineApi(payload);
      notify(response.message, "success");

      GetTableData();
      setFormValues({
        investigationDate: date,
        NeckScan: "",
        MetaStatsis: "",
        Tg: "",
        SCalcium: "",
        ChestXRay: "",
        isEditing: false,
        id: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      notify("Something went wrong!", "error");
    }
  };

  const GetTableData = async () => {
    // debugger
    try {
      const response = await GetNuclearMedicinesData(moment(date).format("YYYY-MM-DD"));
      if (response) setTableData(response?.data);
      console.log(response, "toieopriewpro------");
    } catch (error) {
      console.error("Error submitting form:", error);
      notify("Something went wrong!", "error");
    }
  };

 
  useEffect(() => {
    GetTableData();
  }, [date]);

  

  return (
    <div>
      <div className="card">
        <Heading
          title={t(" Investigation Details (Nuclear Medicine)")}
          isBreadcrumb={false}
          className="text-center text-xl md:text-2xl"
        />

        <form onSubmit={formValues.isEditing ? handleUpdateApi : handleSubmit}>
          <div className="p-6">
            <div className="row d-flex mt-3 ml-1">
             
              <DatePicker
                className="custom-calendar"
                id="investigationDate"
                name="investigationDate"
                lable={t("Investigation Date")}
                placeholder={VITE_DATE_FORMAT}
                handleChange={(date) => handleChangeDate(date)}
                value={formValues.investigationDate}
              />
            </div>

            <div className="row d-flex">
              <div className="col-6 pt-2">
                <TextAreaInput
                  id="NeckScan"
                  name="NeckScan"
                  lable={"NeckScan"}
                  className="col-12 nuclear-textarea"
                  // rows={5}
                  onChange={handleChange}
                  value={formValues.NeckScan}
                />
              </div>

              <div className="col-6 pt-2">
                <TextAreaInput
                  id="MetaStatsis"
                  name="MetaStatsis"
                  lable={"MetaStatsis"}
                  className="col-12 nuclear-textarea"
                  rows={5}
                  onChange={handleChange}
                  value={formValues.MetaStatsis}
                />
              </div>
            </div>

            <div className="row d-flex">
              <div className="col-6">
                <Input
                  type="text"
                  name="Tg"
                  id="input-nuclear-tg"
                  className="form-control"
                  lable={"Tg"}
                  onChange={handleChange}
                  value={formValues.Tg}
                />
              </div>

              <div className="col-6">
                <Input
                  type="text"
                  name="SCalcium"
                  id="input-nuclear"
                  className="form-control"
                  lable={"S Calcium"}
                  onChange={handleChange}
                  value={formValues.SCalcium}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-12">
                <TextAreaInput
                  id="ChestXRay"
                  name="ChestXRay"
                  lable={t("Chest X-Ray")}
                  // removeFormGroupClass={true}
                  className="col-12 nuclear-textarea "
                  onChange={handleChange}
                  value={formValues.ChestXRay}

                  // placeholder={"Enter Chest X-Ray. . . "}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center border-t mb-3 mx-1">
            <button type="submit" className="btn btn-primary">
              {formValues.isEditing ? t("Update") : t("Save")}
            </button>
          </div>
        </form>
      </div>
      <div className="card">

        <Tables
          thead={theadRequestDetails}
          tbody={tableDate?.map((item, index) => {
            return {
              sno: index + 1,
              NeckScan: item?.NeckScan,
              MetaStatsis: item?.MetaStatsis,
              Tg: item?.Tg,
              SCalcium: item?.SCalcium,
              ChestXRay: item?.ChestXRay,
              Actions: (
                <>
                  <i
                    className="fa fa-edit "
                    style={{ padding: "5px" }}
                    onClick={() => handleUpdateItem(item)}
                  ></i>
                </>
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

export default NuclearMedicine;
