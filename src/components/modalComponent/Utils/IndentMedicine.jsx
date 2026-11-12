import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { INDENTOPTIONS } from "../../../utils/constant";
import {
  LoadIndentMedicine,
  LoadMedicineSet,
} from "../../../networkServices/BillingsApi";

const IndentMedicine = ({ pateintDetails }) => {
  const [t] = useTranslation();
  const [MedicineSet, setMedicineSet] = useState([]);
  const [IndentSet, setIndentSet] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    MedicineType: "Prescribe Set",
    MedicineIndent: "",
    PrescribeSet: "",
  });

  // Effect for triggering API call when MedicineType changes
  useEffect(() => {
    if (payload.MedicineType === "Prescribe Set") {
      handleLoadMedicineSet();
    } else if (payload.MedicineType === "Indent Medicine") {
      handleLoadIndentMedicine();
    }
  }, [payload.MedicineType]);

  const handleLoadMedicineSet = async () => {
    try {
      const response = await LoadMedicineSet(pateintDetails?.DoctorID);
      setMedicineSet(response?.data);
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleLoadIndentMedicine = async () => {
    // const TID = 23;
    const TID = pateintDetails?.TransactionID;
    try {
      const response = await LoadIndentMedicine(TID);
      setIndentSet(response?.data);
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };
  const handleLoadMedSetItems = async (SetID) => {
    try {
      const response = await LoadMedSetItems(SetID);
      setTableData(response?.data);
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  // Handle ReactSelect changes
  const handleReactSelect = (name, value) => {
    console.log(value)
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value?.label,
    }));
    handleLoadMedSetItems;
  };

  return (
    <>
      <div className="row p-1">
        <ReactSelect
          placeholderName={t("Billing.MedicineRequisition.Type")}
          searchable={true}
          respclass="col-xl-6 col-md-6 col-sm-6 col-12"
          id={"MedicineType"}
          name={"MedicineType"}
          dynamicOptions={INDENTOPTIONS}
          value={payload?.MedicineType}
          handleChange={handleReactSelect}
        />

        {payload?.MedicineType === "Prescribe Set" && (
          <ReactSelect
            placeholderName={t("Billing.MedicineRequisition.Medicine")}
            searchable={true}
            respclass="col-xl-6 col-md-6 col-sm-6 col-12"
            id={"PrescribeSet"}
            name={"PrescribeSet"}
            value={payload?.PrescribeSet}
            handleChange={handleReactSelect}
            // dynamicOptions can be populated from the API response if needed
          />
        )}

        {payload?.MedicineType === "Indent Medicine" && (
          <ReactSelect
            placeholderName={t("Billing.MedicineRequisition.IndentMedicine")}
            searchable={true}
            respclass="col-xl-6 col-md-6 col-sm-6 col-12"
            id={"MedicineIndent"}
            name={"MedicineIndent"}
            value={payload?.MedicineIndent}
            handleChange={handleReactSelect}
            dynamicOptions={IndentSet.map((ele) => ({
              label: ele?.dtEntry,
            }))}
          />
        )}
      </div>
    </>
  );
};

export default IndentMedicine;
