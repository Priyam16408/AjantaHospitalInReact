import React, { useEffect, useState } from "react";
import DatePicker from "../../../../../formComponent/DatePicker";
import LabeledInput from "../../../../../formComponent/LabeledInput";
import Input from "../../../../../formComponent/Input";
import TextAreaInput from "../../../../../formComponent/TextAreaInput";
import { useLocalStorage } from "../../../../../../utils/hooks/useLocalStorage";
import moment from "moment";

const MenstrualAndObstetric = ({
  loadSaveData,
  setPregnancyDetails,
  patientDetail,
  disabled,
  isPregnancy,
}) => {
  const { employeeID } = useLocalStorage("userData", "get");

  const { pregnancyBasicDetails } = loadSaveData;

  const [values, setValues] = useState({
    LMPDate: "",
    EDDDate: "",
    currentPregnancyDate: "",
    gestationalAge: 0,
    isDelivered: 0,
    Gravida: "",
    Para: "",
    Live: "",
    Abortion: "",
    Other: "",
    CorrectEDD: "",
    days: "",
    weeks: "",
  });
  // debugger
  useEffect(() => {
    console.log("pregnancyBasicDetails?.lmp", pregnancyBasicDetails?.lmp);
    if (loadSaveData && patientDetail) {
      const lmpDate = pregnancyBasicDetails?.lmp
        ? moment(pregnancyBasicDetails?.lmp, "DD-MMM-YYYY").toDate()
        : null;
      const currentDate = new Date();
      setValues({
        LMPDate: pregnancyBasicDetails?.lmp
          ? moment(new Date(pregnancyBasicDetails?.lmp)).format("DD-MMM-YYYY")
          : "",
        EDDDate: pregnancyBasicDetails?.edd
          ? moment(new Date(pregnancyBasicDetails?.edd)).format("DD-MMM-YYYY")
          : "",
        currentPregnancyDate: pregnancyBasicDetails?.currentPregnancy
          ? moment(new Date(pregnancyBasicDetails?.currentPregnancy)).format(
              "DD-MMM-YYYY"
            )
          : "",
        // gestationalAge: pregnancyBasicDetails?.ga || 0,
        gestationalAge: lmpDate
          ? calculateGestationalAge(lmpDate, currentDate)
          : 0,
        isDelivered: pregnancyBasicDetails?.status || 0,
        patientId: patientDetail?.currentPatient?.PatientID || "",
        transactionId: patientDetail?.currentPatient?.TransactionID || "",
        entryDate: new Date(),
        isActive: 1,
        entryBy: employeeID,
        Gravida: pregnancyBasicDetails?.gravida || "",
        Para: pregnancyBasicDetails?.para || "",
        Live: pregnancyBasicDetails?.live || "",
        Abortion: pregnancyBasicDetails?.abortion || "",
        Other: pregnancyBasicDetails?.other || "",
        CorrectEDD: pregnancyBasicDetails?.correctedEdd
          ? new Date(pregnancyBasicDetails?.correctedEdd)
          : "",
        days: "",
        weeks: "",

        // CorrectEDD: new Date() || "",
      });
    }

    console.log("this lmp mynk", pregnancyBasicDetails?.lmp);
  }, [loadSaveData]);

  useEffect(() => {
    let PregnancyPayload = {
      patientId: values?.patientId || "",
      transactionId: values?.transactionId || "",
      lmp: values?.LMPDate || "",
      edd: values?.EDDDate || "",
      currentPregnancy: values?.currentPregnancyDate || "",
      entryDate: values?.entryDate || new Date(),
      isActive: 1,
      entryBy: employeeID,
      status: Number(values?.isDelivered),
      ga: values?.gestationalAge
        ? Number(Number(values.gestationalAge).toFixed(2))
        : 0,

      // ga: Number(values?.gestationalAge).toFixed(2),
      // ga: values?.gestationalAge,
      gravida: values?.Gravida,
      para: values?.Para,
      live: values?.Live,
      abortion: values?.Abortion,
      other: values?.Other,
      correctedEdd: values?.CorrectEDD || "",
      days: `${Math.floor(values?.gestationalAge % 7 || 0)}` || "",
      weeks: `${Math.floor(values?.gestationalAge / 7 || 0)}` || "",
    };
    setPregnancyDetails(PregnancyPayload);
    console.log(values?.CorrectEDD);
  }, [values]);

  //   const calculateGestationalAge = (startDate, currentDate) => {
  //     const diffInMilliseconds = currentDate - startDate;
  //     const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  //     return Math.floor(diffInDays / 7);
  //   };

  const calculateGestationalAge = (startDate, currentDate) => {
    const diffInMilliseconds = currentDate - startDate;
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    return diffInDays;
  };

  // const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     const newDate = new Date(value);

  //     // If isPregnancy is 0, allow only LMPDate to be updated and skip calculations
  //     if (loadSaveData?.vitalSign?.isPregnancy === 0) {
  //         if (name === "LMPDate") {
  //             setValues((prevValues) => ({
  //                 ...prevValues,
  //                 LMPDate: newDate
  //             }));
  //         }
  //         console.log("Skipping calculations because isPregnancy is 0");
  //         return;
  //     }

  //     setValues((prevValues) => {
  //         let updatedValues = { ...prevValues, [name]: newDate };

  //         if (name === "LMPDate") {
  //             const eddDate = new Date(newDate);
  //             eddDate.setDate(eddDate.getDate() + 280);
  //             updatedValues.EDDDate = eddDate;
  //             updatedValues.gestationalAge = calculateGestationalAge(newDate, new Date());
  //         }

  //         if (name === "EDDDate") {
  //             const lmpDate = new Date(newDate);
  //             lmpDate.setDate(lmpDate.getDate() - 280);
  //             updatedValues.LMPDate = lmpDate;
  //             updatedValues.gestationalAge = calculateGestationalAge(lmpDate, new Date());
  //         }

  //         if (name === "CorrectEDD") {
  //             const correctedLmpDate = new Date(newDate);
  //             correctedLmpDate.setDate(correctedLmpDate.getDate() - 280);
  //             updatedValues.LMPDate = correctedLmpDate;
  //             updatedValues.gestationalAge = calculateGestationalAge(correctedLmpDate, new Date());
  //         }

  //         return updatedValues;
  //     });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!value) {
      console.error("Invalid date input:", value);
      return;
    }

    const newDate = moment(value, "YYYY-MM-DD", true); // Ensure correct format
    if (!newDate.isValid()) {
      console.error("Invalid date detected:", value);
      return;
    }

    setValues((prevValues) => {
      let updatedValues = {
        ...prevValues,
        [name]: newDate.format("YYYY-MM-DD"),
      };

      if (loadSaveData?.vitalSign?.isPregnancy === 0) {
        if (name === "LMPDate") {
          updatedValues.LMPDate = newDate.format("YYYY-MM-DD");
        }
        return updatedValues;
      }

      if (name === "LMPDate") {
        const eddDate = newDate.clone().add(280, "days");
        updatedValues.EDDDate = eddDate.format("YYYY-MM-DD");
        updatedValues.gestationalAge = calculateGestationalAge(
          newDate.toDate(),
          new Date()
        );
      }

      if (name === "EDDDate") {
        const lmpDate = newDate.clone().subtract(280, "days");
        updatedValues.LMPDate = lmpDate.format("YYYY-MM-DD");
        updatedValues.gestationalAge = calculateGestationalAge(
          lmpDate.toDate(),
          new Date()
        );
      }

      if (name === "CorrectEDD") {
        const correctedLmpDate = newDate.clone().subtract(280, "days");
        updatedValues.LMPDate = correctedLmpDate.format("YYYY-MM-DD");
        updatedValues.gestationalAge = calculateGestationalAge(
          correctedLmpDate.toDate(),
          new Date()
        );
      }

      return updatedValues;
    });
  };

  console.log(values, "updatedValues   = ");

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className="my-2 d-flex w-100 flex-wrap justify-content-evenly">
      <div className="mb-1 d-flex w-100 flex-wrap">
        <div className="flex-grow-1  ">
          <DatePicker
            placeholderText="dd-mm-yyyy"
            lable="LMP Date"
            name="LMPDate"
            id="LMPDate"
            // value={values?.LMPDate?.length>0?new Date(values?.LMPDate):""}
            value={values?.LMPDate ? moment(values?.LMPDate).toDate() : ""}
            showTime
            hourFormat="12"
            handleChange={handleChange}
            className="  col-12"
            onChange={handleChange}
            disable={disabled}
          />
        </div>
        {(loadSaveData?.vitalSign?.isPregnancy == 1 ||
          loadSaveData?.vitalSign === null) && (
          <div className="flex-grow-1  ">
            <DatePicker
              disable={disabled}
              placeholder=""
              lable="EDD Date"
              name="EDDDate"
              id="EDDDate"
              value={values?.EDDDate ? moment(values?.EDDDate).toDate() : ""}
              showTime
              hourFormat="12"
              handleChange={handleChange}
              className="  col-12" // flex-grow-1 makes it expand, me-2 adds margin between the two
              onChange={handleChange}
            />
          </div>
        )}
      </div>
      {console.log(
        "loadSaveData?.vitalSign?.isPregnancy",
        loadSaveData?.vitalSign?.isPregnancy == 1 ||
          loadSaveData?.vitalSign === null
      )}
      {(loadSaveData?.vitalSign?.isPregnancy == 1 ||
        loadSaveData?.vitalSign === null) && (
        <>
          <div className="mb-1 d-flex w-100 flex-wrap">
            <div className="flex-grow-1">
              <DatePicker
                disable={disabled}
                placeholder=""
                name="CorrectEDD"
                id="CorrectEDD"
                value={
                  values?.CorrectEDD ? moment(values?.CorrectEDD).toDate() : ""
                }
                showTime
                hourFormat="12"
                handleChange={handleChange}
                className="col-12" // flex-grow-1 makes it expand, me-2 adds margin between the two
                // onChange={handleChange}
                lable="Corrected EDD Date"
                // className="col-12" // flex-grow-1 makes it expand, me-2 adds margin between the two
                // onChange={handleChange}
              />
            </div>
            <div className="flex-grow-1  ">
              <DatePicker
                disable={disabled}
                placeholder=""
                lable="Current Pregnancy Date" // Corrected to "lable"
                name="currentPregnancyDate"
                id="currentPregnancyDate"
                value={
                  values?.currentPregnancyDate
                    ? moment(values?.currentPregnancyDate).toDate()
                    : ""
                }
                showTime
                hourFormat="12"
                handleChange={handleChange}
                className="col-12" // flex-grow-1 makes it expand, me-2 adds margin between the two
                // onChange={handleChange}
              />
            </div>
          </div>
          <div className=" mb-1 d-flex w-100 flex-wrap flex">
            {/* <div className="col-2">
                            <LabeledInput
                                label={"G.Age (weeks)"}
                                value={values?.gestationalAge}
                                className="col-12 px-0" // flex-grow-1 makes it expand, me-2 adds margin between the two
                            />
                        </div> */}
            <div className="col-2">
              <LabeledInput
                label={"G.A(weeks)"}
                value={`${Math.floor(values?.gestationalAge / 7 || 0)}  Weeks`}
                className="col-12 px-0"
              />
            </div>
            <div className="col-2">
              <LabeledInput
                label={"G.A(Days)"}
                value={`${Math.floor(values?.gestationalAge % 7 || 0)}  Days`}
                className="col-12 px-0"
              />
            </div>
            <div className="d-flex flex-wrap col-8">
              <TextAreaInput
                disabled={disabled}
                id={"Gravida"}
                lable={"Gravida"}
                // className="col-3 col-md-3 col-sm-3"
                value={values?.Gravida}
                name={"Gravida"}
                respclass={"col-3 col-md-3 col-sm-3"}
                rows={1}
                onChange={handleChangeInput}
                disable={disabled}
              />
              <TextAreaInput
                disabled={disabled}
                id={"Para"}
                lable={"Para"}
                // className="col-3 col-md-3 col-sm-3"
                respclass={"col-3 col-md-3 col-sm-3"}
                name={"Para"}
                value={values?.Para}
                onChange={handleChangeInput}
                rows={1}
              />

              <TextAreaInput
                disabled={disabled}
                id={"Live"}
                lable={"Live"}
                // className="col-3 col-md-3 col-sm-3"
                respclass={"col-3 col-md-3 col-sm-3"}
                name={"Live"}
                value={values?.Live}
                rows={1}
                onChange={handleChangeInput}
              />

              <TextAreaInput
                disabled={disabled}
                id={"Abortion"}
                lable={"Abortion"}
                // className="col-3 col-md-3 col-sm-3"
                respclass={"col-3 col-md-3 col-sm-3 pr-0"}
                name={"Abortion"}
                value={values?.Abortion}
                rows={1}
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div className="mb-1 d-flex w-100 flex-wrap justify-content-center px-2">
            <div className="flex-grow-1  ">
              <textarea
                disabled={disabled}
                id={""}
                className="col-11"
                placeholder="Other If Applicable"
                onChange={handleChangeInput}
                // value={prisciptionForm.ConfidentialData}
                // onFocus={handleInputFocus}
                name="Other"
              />
            </div>
            <div className="flex-grow-1  d-flex justify-content-center align-items-center">
              <input
                disabled={disabled}
                type="checkbox"
                // checked={false}
                checked={values?.isDelivered === 1 ? true : false}
                onChange={(e) => {
                  if (values?.isDelivered) {
                    setValues((prev) => {
                      return {
                        ...prev,
                        isDelivered: 0,
                      };
                    });
                  } else {
                    setValues((prev) => {
                      return {
                        ...prev,
                        isDelivered: 1,
                      };
                    });
                  }
                }}
                // readOnly // Automatically updated
              />
              <span className="font-weight-bold ml-2">: Is Delivered</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MenstrualAndObstetric;
