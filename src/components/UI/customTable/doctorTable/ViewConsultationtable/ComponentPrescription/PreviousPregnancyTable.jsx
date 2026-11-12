import React, { useEffect, useState } from "react";
import Tables from "../../..";
import Input from "../../../../../formComponent/Input";
import { t } from "i18next";
import { use } from "react";

const PreviousPregnancyTable = ({
  loadSaveData,
  setPreviousPregnancyData,
  patientDetail,
  disabled,
}) => {
  // State to manage table data

  console.log(
    "loadSaveData detailsOfPrevious",
    loadSaveData?.detailsOfPrevious
  );

  const [data, setData] = useState([
    {
      id: 1, // Unique identifier for each row
      parityAbortion: "",
      modeIndicationLSCS: "",
      sex: "",
      age: "",
      weight: "",
      conditionOfBaby: "",
    },
  ]);

 
const handleChange = (index, field, value) => {
    if (field === "age") {
        const numericValue = Number(value);
        if (numericValue > 150) return; 
    }
    if (field === "weight") {
        const numericValue = Number(value);
        if (numericValue > 635) return;
    }
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
};


  const handleDeleteRow = (index) => {
    if (data.length === 1) {
      return setData([
        {
          id: 1, 
          parityAbortion: "",
          modeIndicationLSCS: "",
          sex: "",
          age: "",
          weight: "",
          conditionOfBaby: "",
        },
      ]);
    }
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      const newRow = {
        id: data.length + 1,
        parityAbortion: "",
        modeIndicationLSCS: "",
        sex: "",
        age: "",
        weight: "",
        conditionOfBaby: "",
      };
      const updatedData = [...data, newRow];
      setData(updatedData);
    }
  };

  // Table headers
  // const TableHead = [
  //     "Sr.No.",
  //     "Parity/Abortion",
  //     "Mode & Indication if LSCS",
  //     "Sex",
  //     "Age",
  //     "Weight",
  //     "Condition of Baby Postnatal",
  // ];

  const TableHead = [
    { width: "1%", name: t("Sr.No.") },
    { width: "5%", name: t("Parity/Abortion") },
    { width: "5%", name: t("Mode & Indication if LSCS") },
    { width: "5%", name: t("Sex") },
    { width: "5%", name: t("Age") },
    { width: "5%", name: t("Weight") },
    { width: "5%", name: t("Condition of Baby Postnatal") },
  ];

  // useEffect(() => {
  //     if (loadSaveData && patientDetail) {
  //         let payload = data.map((item, index) => {
  //             return {
  //                 patientId: patientDetail?.currentPatient?.PatientID || "",
  //                 transactionId: patientDetail?.currentPatient?.TransactionID || "",
  //                 parity: item?.parityAbortion || "",
  //                 mode: item?.modeIndicationLSCS || "",
  //                 babySex: item?.sex || "",
  //                 babyAge: item?.age || "",
  //                 babyWeight: item?.weight || "",
  //                 conditionOfBabyPostnatal: item?.conditionOfBaby || "",
  //                 entryDate: new Date(),
  //             };
  //         });
  //         setPreviousPregnancyData(payload);
  //         // You can now use the `payload` array for further processing
  //         console.log(payload);
  //     }
  // }, [loadSaveData, patientDetail, data]); // Add dependencies here
  useEffect(() => {
    if (loadSaveData && patientDetail) {
      const hasData = data.some(
        (row) =>
          row.parityAbortion !== "" ||
          row.modeIndicationLSCS !== "" ||
          row.sex !== "" ||
          row.age !== "" ||
          row.weight !== "" ||
          row.conditionOfBaby !== ""
      );

      let payload;
      if (!hasData) {
        payload = []; 
      } else {
        payload = data.map((item, index) => {
          return {
            patientId: patientDetail?.currentPatient?.PatientID || "",
            transactionId: patientDetail?.currentPatient?.TransactionID || "",
            parity: item?.parityAbortion || "",
            mode: item?.modeIndicationLSCS || "",
            babySex: item?.sex || "",
            babyAge: item?.age || "",
            babyWeight: item?.weight || "",
            conditionOfBabyPostnatal: item?.conditionOfBaby || "",
            entryDate: new Date(),
          };
        });
      }

      setPreviousPregnancyData(payload);
      console.log(payload);
    }
  }, [loadSaveData, patientDetail, data]); 

  useEffect(() => {
    if (
      loadSaveData?.detailsOfPrevious === "" ||
      loadSaveData?.detailsOfPrevious === null ||
      loadSaveData?.detailsOfPrevious === undefined ||
      loadSaveData?.detailsOfPrevious.length === 0
    ) {
      setData([
        {
          id: 1, 
          parityAbortion: "",
          modeIndicationLSCS: "",
          sex: "",
          age: "",
          weight: "",
          conditionOfBaby: "",
        },
      ]);
    } else if (loadSaveData?.detailsOfPrevious.length === 1) {
      let tempData = loadSaveData?.detailsOfPrevious?.map((item, index) => {
        return {
          id: index + 1, 
          parityAbortion: item?.parity,
          modeIndicationLSCS: item?.mode,
          sex: item?.babySex,
          age: item?.babyAge,
          weight: item?.babyWeight,
          conditionOfBaby: item?.conditionOfBabyPostnatal,
        };
      });
      tempData.push({
        id: 2, 
        parityAbortion: "",
        modeIndicationLSCS: "",
        sex: "",
        age: "",
        weight: "",
        conditionOfBaby: "",
      });
      setData(tempData);
    } else {
      let tempData = loadSaveData?.detailsOfPrevious?.map((item, index) => {
        return {
          id: index + 1, 
          parityAbortion: item?.parity,
          modeIndicationLSCS: item?.mode,
          sex: item?.babySex,
          age: item?.babyAge,
          weight: item?.babyWeight,
          conditionOfBaby: item?.conditionOfBabyPostnatal,
        };
      });
      setData(tempData);
    }
  }, [loadSaveData]);

  return (
    <div className="mt-2">
      <p className="col-sm-12 background-theme-color theme-color font-weight-bold">
        {t("Details of Previous Pregnancy")}
      </p>
      <Tables
        thead={TableHead}
        tbody={data.map((row, index) => ({
          "Sr.No.": (
            <span className="d-flex justify-items-center align-items-center ">
              <i
                className="pi pi-trash mx-auto"
                aria-hidden="true"
                onClick={() => handleDeleteRow(index)}
              ></i>
            </span>
          ),
          "Parity/Abortion": (
            <Input
              disabled={disabled}
              type="text"
              className="table-input"
              removeFormGroupClass={true}
              name="parityAbortion"
              maxLength={20}
              value={row.parityAbortion}
              onChange={(e) =>
                handleChange(index, "parityAbortion", e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ),
          "Mode & Indication if LSCS": (
            <Input
              disabled={disabled}
              type="text"
              className="table-input"
              removeFormGroupClass={true}
              name="modeIndicationLSCS"
              value={row.modeIndicationLSCS}
              onChange={(e) =>
                handleChange(index, "modeIndicationLSCS", e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={20}
            />
          ),
          Gender: (
            <Input
              disabled={disabled}
              type="text"
              className="table-input"
              removeFormGroupClass={true}
              name="sex"
              value={row.sex}
              onChange={(e) => handleChange(index, "sex", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={20}
            />
          ),
          Age: (
            <Input
              disabled={disabled}
              type="text"
              className="table-input"
              removeFormGroupClass={true}
              name="age"
              value={row.age}
              onChange={(e) => handleChange(index, "age", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={150}
            />
          ),
          Weight: (
            <Input
              disabled={disabled}
              type="text"
              className="table-input"
              removeFormGroupClass={true}
              name="weight"
              value={row.weight}
              onChange={(e) => handleChange(index, "weight", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              max={635}
            />
          ),
          "Condition of Baby Postnatal": (
            <Input
              disabled={disabled}
              type="text"
              className="table-input"
              removeFormGroupClass={true}
              name="conditionOfBaby"
              value={row.conditionOfBaby}
              onChange={(e) =>
                handleChange(index, "conditionOfBaby", e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={20}
            />
          ),
        }))}
      />
    </div>
  );
};

export default PreviousPregnancyTable;
