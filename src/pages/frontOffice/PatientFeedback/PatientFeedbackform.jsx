
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import Heading from "../../../components/UI/Heading";
import { notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import {
  SavePatientFeedBack,
  SearchPatientFeedBack,
} from "../../../networkServices/edpApi";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";

export default function PatientFeedbackform() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [bindDetails, setBindDetails] = useState([]);
  let [t] = useTranslation();

  const TYPE = [
    { value: "1", label: "UHID" },
    { value: "2", label: "IPDNo" },
  ];

  const [values, setValues] = useState({
    ipdno: "",
    uhid: "",
    date: moment().format("YYYY-MM-DD"),
    // comments: "",
    type: { value: "1", label: "UHID" },
  });

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
    setBindDetails([])
  };

  console.log(values);

  const handleRatingChange = (rowIndex, selectedOption) => {
    setBindDetails((prevDetails) =>
      prevDetails.map((item, index) => {
        if (index !== rowIndex) return item;

        return {
          ...item,
          isFetched: false, // Mark user interaction
          VeryGood10: selectedOption === "VeryGood10" ? 1 : 0,
          Good7: selectedOption === "Good7" ? 1 : 0,
          Average5: selectedOption === "Average5" ? 1 : 0,
          Poor2: selectedOption === "Poor2" ? 1 : 0,
          VeryPoor0: selectedOption === "VeryPoor0" ? 1 : 0,
        };
      })
    );
  };

  const handleRemarkChange = (rowIndex, newRemark) => {
    debugger
    setBindDetails((prevDetails) =>
      prevDetails.map((item, index) =>
        index === rowIndex ? { ...item, Remark: newRemark } : item
      )
    );
  };

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: moment(value).format("YYYY-MM-DD"),
    }));
  };

  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const feedbackdetail = bindDetails
        .filter(
          (item) =>
            item.VeryGood10 === 1 ||
            item.Good7 === 1 ||
            item.Average5 === 1 ||
            item.Poor2 === 1 ||
            item.VeryPoor0 === 1
        ) // ✅ Include only rows with a rating selected
        .map((item) => {
          const selectedRatingKey = [
            "VeryGood10",
            "Good7",
            "Average5",
            "Poor2",
            "VeryPoor0",
          ].find((key) => item[key] === 1);

          return {
            questionID: item.QuestionID,
            [selectedRatingKey]: 1, // ✅ Only send the selected rating
            Remark: item.Remark || "",

            isFeedBack: 1,
          };
        });

      const payload = {
        patientID: values?.type?.value === '1' ? values.uhid : values.ipdno,
        entryFeedBackDate: moment(values.date).format("YYYY-MM-DD"),
        feedbackdetail,
        comment: values?.comments || "",
        type: values?.type?.value
      };
      debugger
      const response = await SavePatientFeedBack(payload);
      if (response.success) {
        handleSearch();
        setBindDetails([]);
        setValues((preV)=>({
          ...preV,
comments:"",

        }))
    // setBindDetails([])
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const handleSearch = async () => {
    debugger
    if (values?.type?.value == '1' && !values?.uhid) {
      notify("Please fill UHID", "error");
      return;
    }
    if (values?.type?.value == '2' && !values?.ipdno) {
      notify("Please fill IPDNO", "error");
      return;
    }
    try {
      let payload = {
        PID: values?.type?.value === '1' ? String(values?.uhid) : String(values?.ipdno),
        Date: moment(values?.date).format("YYYY-MM-DD"),
        Type: values?.type?.value
      };

      const response = await SearchPatientFeedBack(payload);
      if (response.success) {
        const enhancedData = response.data.map((item) => ({
          ...item,
          isFetched: true, // 🛡️ Mark fetched rows for disabling
        }));
        setBindDetails(enhancedData);
        // setValues((val) => ({...val, "comments": response.data[0].COMMENT}))
    } else {
      notify(response?.message, "error");
      setBindDetails([])
    }
  } catch (error) {
    console.error("Error ", error);
  }
};

return (
  <>
    <div className=" spatient_registration_card card">
      <Heading title={t("Search Criteria")} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Type")}
          id={"type"}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6  col-12"
          dynamicOptions={TYPE}
          handleChange={handleSelect}
          value={`${values?.type?.value}`}
          name={"type"}
        />
        {values?.type?.value === '1' ?
          <Input
            type="text"
            className="form-control required-fields"
            id="uhid"
            name="uhid"
            lable={t("uhid")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6  col-12"
            value={values?.uhid}
            onChange={handleChange}
          />
          :
          <Input
            type="text"
            className="form-control required-fields"
            id="ipdno"
            name="ipdno"
            lable={t("ipdno")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6  col-12"
            value={values?.ipdno}
            onChange={handleChange}
          />
        }
        <DatePicker
          className="custom-calendar"
          id="Data"
          name="date"
          lable={t("date")}
          placeholder={VITE_DATE_FORMAT}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          value={
            values.date ? moment(values.date, "YYYY-MM-DD").toDate() : null
          }
          maxDate={new Date()}
          handleChange={searchHandleChange}
        />
        <div className=" col-sm-2 col-xl-2">
          <button
            className="btn btn-sm btn-success"
            type="button"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
        </div>
      </div>
    </div>
    {console.log(bindDetails)
    }
    {bindDetails?.length > 0 && (
      <div className="card">
        <Heading title={t("Department details")} isBreadcrumb={false} />
        <div className="">
          <Tables
            thead={[
              { width: "1%", name: t("SNo") },
              { width: "10%", name: t("Department") },
              { width: "10%", name: t("Question") },
              { width: "1%", name: t("VeryGood (10)") },
              { width: "1%", name: t("Good (7)") },
              { width: "1%", name: t("Average (5)") },
              { width: "1%", name: t("Poor (2)") },
              { width: "1%", name: t("VeryPoor (0)") },
              { width: "10%", name: t("Remark") },
            ]}
            
            tbody={bindDetails?.map((val, index) => {
              const isRowDisabled =
                val.isFetched &&
                (val.VeryGood10 === 1 ||
                  val.Good7 === 1 ||
                  val.Average5 === 1 ||
                  val.Poor2 === 1 ||
                  val.VeryPoor0 === 1);

              return {
                sno: index + 1,
                Department: val.DepartmentName,
                Question: val.Question || "",
                VeryGood10: (
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="checkbox"
                      // className="form-check-input"
                      className=" table-checkbox"
                      name={`rating-${index}`}
                      checked={val.VeryGood10 === 1}
                      onChange={() => handleRatingChange(index, "VeryGood10")}
                      disabled={isRowDisabled}
                    />
                  </div>
                ),
                Good7: (
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="checkbox"
                      // className="form-check-input"
                      className=" table-checkbox"
                      name={`rating-${index}`}
                      checked={val.Good7 === 1}
                      onChange={() => handleRatingChange(index, "Good7")}
                      disabled={isRowDisabled}
                    />
                  </div>
                ),
                Average5: (
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="checkbox"
                      // className="form-check-input"
                      className=" table-checkbox"
                      name={`rating-${index}`}
                      checked={val.Average5 === 1}
                      onChange={() => handleRatingChange(index, "Average5")}
                      disabled={isRowDisabled}
                    />
                  </div>
                ),
                Poor2: (
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="checkbox"
                      // className="form-check-input"
                      className=" table-checkbox"
                      name={`rating-${index}`}
                      checked={val.Poor2 === 1}
                      onChange={() => handleRatingChange(index, "Poor2")}
                      disabled={isRowDisabled}
                    />
                  </div>
                ),
                VeryPoor0: (
                  <div className="d-flex justify-content-center align-items-center">
                    <input
                      type="checkbox"
                      // className="form-check-input"
                      className="table-checkbox"
                      name={`rating-${index}`}
                      checked={val.VeryPoor0 === 1}
                      onChange={() => handleRatingChange(index, "VeryPoor0")}
                      disabled={isRowDisabled}
                    />
                  </div>
                ),
                Remark: (
                  <Input
                    type="text"
                    className="table-input"
                    removeFormGroupClass={true}
                    value={val.Remark}
                    // value={val.Remark}
                    onChange={(e) =>
                      handleRemarkChange(index, e.target.value)
                    }
                    placeholder={t("Enter remark")}
                    name={`remark-${val.QuestionID || index}`}
                    disabled={isRowDisabled}
                  />
                ),
              };
            })}
          />

          <div className="p-2 row flex justify-content-end mr-2">
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <TextAreaInput
                id="comments"
                lable={t("Comments")}

                className="w-1/2 h-24"
                name="comments"
                value={values?.comments}
                onChange={handleChange}
                placeholder=" "
              />
            </div>
            <div>
              <button
                className="btn btn-sm btn-success px-3"
                type="button"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
}
