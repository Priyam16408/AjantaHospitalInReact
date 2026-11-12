import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import {
  DoctorPrescriptionGetInvestigationManualEntriesbyDate,
  DoctorPrescriptionPrintCreateInvestigationManualEntries,
  DoctorPrescriptionPrintGetPatientManualEntry,
  GetInvestigationManualEntries,
} from "../../../networkServices/DoctorApi";
import DatePicker from "../../../components/formComponent/DatePicker";
import { notify } from "../../../utils/utils";
import InvestigationTable from "./InvestigationTables/InvestigationTable";
import OtherTable from "./InvestigationTables/OtherTable";
import { use } from "i18next";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import moment from "moment";


function InvestigationManualEntry(props) {
  const [inputs, setInputs] = useState([]);

  const [manualEntries, setManualEntries] = useState([]);

  const [otherTable, setOtherTable] = useState([]);
  const [callme, setCallme] = useState(false);

  const [porpsData, setPropsData] = useState(props);

  const [entryDate, setEntryDate] = useState({
    toDate: new Date(),
  });


  useEffect(() => {
    console.log(manualEntries, "manualEntries--------");
  }, [manualEntries]);
  function formatDateToYYYYMMDD(date) {
    if (!(date instanceof Date) || isNaN(date)) {
      throw new Error("Invalid Date object");
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0"); 

    return `${year}-${month}-${day}`;
  }

  const [t] = useTranslation();
  // console.log("🦁🐱THis props", porpsData.patientDetail.currentPatient)
  
  const handlechange = (e, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = e.target.value; // Update the value for the specific index or row 
    setInputs(updatedInputs);
  };


  const handleDate = (e) => {
    const { name, value } = e.target;
    setEntryDate((val) => ({ ...val, [name]: value }));
    getEntriesByDate(moment(value).format("YYYY-MM-DD"));
  };

  const getEntries = async () => {
    try {
      const response = await GetInvestigationManualEntries();
      console.log("the department respone is", response);
      if (response.success) {
        setManualEntries(response.data);
        setInputs(
          response.data.map((val, index) => {
            return val.DefaultValue;
          })
        );
        // console.log("😁😀got entires ", response.data)
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setManualEntries([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setManualEntries([]);
    }
  };


  useEffect(() => {console.log(inputs, "inputs--------------")},[inputs])

  const handleSaveEntries = async () => {
    const { App_ID, PatientID, TransactionID } =
      porpsData.patientDetail.currentPatient;



  //     const hasEmptyValue = inputs.some((input) => !input); 

  // if (hasEmptyValue) {
   
  //   notify("Please fill all the required values before saving", "error");
  //   return;
  // }

      let payload = manualEntries.map((val, index) => {
      return {
        itemID: val.ID || "",
        patientID: PatientID || "",
        transactionID: TransactionID || "",
        app_ID: App_ID || "",
        itemName: val.ItemName || "",
        value: inputs[index] || "",
        reportDate: entryDate?.toDate || "",
      };
    });

    try {
      const response = await DoctorPrescriptionPrintCreateInvestigationManualEntries(payload);
      // console.log("the department respone is", response);
      if (response.success) {
        setCallme(!callme);
      
        // console.log("😁😀got entires ", response.data)
        notify(response.message, "success");
        // getEntries();
      } 
      
      
      else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        // setManualEntries([]);
        // notify("",)
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      // setManualEntries([]);
    }
  };
 
 
 
 
 







  
  const getEntriesByDate = async (payload) => {
    console.log(payload,"dfgdgdfg---")
    try {
      const response =
        await DoctorPrescriptionGetInvestigationManualEntriesbyDate(payload);
      if (response.success) {
        console.log("😁😀got entires ", response.data);

        const value= response.data.map(item=>item.Value)
        setInputs(value);   
        

      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };




  
  useEffect(() => {
    getEntries();
  }, []);
  




  useEffect(() => {
    console.log("this is manual entry checking text area", manualEntries);
  }, [manualEntries]);

  return (
    <div className="m-2 spatient_registration_card" >
      <div className="patient_registration card">
        <Tables
          style={{ maxHeight: "21vh" }}
          thead={[
            { width: "0.5%", name: t("S.No") },
            { width: "5%", name: t("Display Name") },
            { width: "5%", name: t("Name") },
            { width: "5%", name: t("Value") },
          ]}
          tbody={manualEntries?.map((val, index) => ({
            sNo: index + 1,
            displayName: val.DisplayName || "",
            ItemName: val.ItemName || "",
            value: val.IsTextArea ? (
              <TextAreaInput
                rows={2}
                value={inputs[index] || ""} 
                onChange={(e) => handlechange(e, index)} 
                removeFormGroupClass={true}
              />
            ) : (
              <input
                type="text"
                className="table-input"
                value={inputs[index] || ""} 
                onChange={(e) => handlechange(e, index)} 
              />
            ),
          }))}
        />
        <div className="py-2 col-sm-12 d-flex justify-content-end align-items-center">
          <DatePicker
            className="custom-calendar"
            placeholder=""
            lable="To Date"
            respclass={"col-xl-2 col-md-3 col-sm-4"}
            name="toDate"
            id="toDate"
            // value={entryDate?.toDate}
            value={entryDate?.toDate ? moment(entryDate?.toDate).toDate() : ""}
            showTime
            hourFormat="12"
            handleChange={handleDate}
          />
          <button
            className="btn btn-sm btn-success m-2"
            type="button"
            onClick={() => {

              handleSaveEntries();
            }}
          >
            {t("Save")}
          </button>
        </div>
      </div>
      <div className="row mt-4 ">
        {/* <!-- Table 1 --> */}
        <div className="col-12 col-md-7">
          {/* <h1 className="mb-4">Patient Investigation Results</h1> Add header */}
          <InvestigationTable
            setOtherTable={setOtherTable}
            style={{ maxHeight: "45vh" }}
            porpsData={porpsData}
            callme={callme}
          />{" "}
          {/* Render the new table */}
        </div>
        <div className="col-12 col-md-5">
          <OtherTable otherTable={otherTable} /> {/* Render the new table */}
        </div>
      </div>
    </div>
  );
}

export default InvestigationManualEntry;
