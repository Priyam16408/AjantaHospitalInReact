import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import Heading from "../UI/Heading";
import IntakeOuttakeTable from "../UI/customTable/IntakeOuttakeTable";
import {
  NursingWardBindData,
  NursingWardIntakeOutPutChartPrintAPI,
  NursingWardSaveIntake,
} from "../../networkServices/nursingWardAPI";
import moment from "moment";
import Input from "../formComponent/Input";
import { notify, NursingWardSaveIntakePayload } from "../../utils/utils";
import { PrintSVG } from "../SvgIcons";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";

// const THEAD = [
//   {
//     colSpan: "1",
//     name: "Time",
//   },
//   {
//     colSpan: "1",
//     name: "IVF Solution",
//   },

//   {
//     colSpan: "1",
//     name: "Vol(ml)",
//   },

//   {
//     colSpan: "1",
//     name: "NGT",
//   },
//   {
//     colSpan: "1",
//     name: "Oral",
//   },
//   {
//     colSpan: "1",
//     name: "Vol(ml)",
//   },
//   {
//     colSpan: "1",
//     name: "Medication",
//   },
//   {
//     colSpan: "1",
//     name: "Infusion Pumps",
//   },
//   {
//     colSpan: "1",
//     name: "Vol(ml)",
//   },
//   {
//     colSpan: "1",
//     name: "Urine(ml)",
//   },
//   {
//     colSpan: "1",
//     name: "Other",
//   },
//   {
//     colSpan: "1",
//     name: "Other 2",
//   },
//   {
//     colSpan: "1",
//     name: "Drains",
//   },
//   {
//     colSpan: "1",
//     name: "NGT Aspiration",
//   },
//   {
//     colSpan: "1",
//     name: "Created By",
//   },
//   {
//     colSpan: "1",
//     name: "select",
//   },
// ];

const IntakeAndOutPutChart = ({ data }) => {

  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const { transactionID, patientID } = data;


const THEAD = [
  { colSpan: 1, name: t("Time") },
  { colSpan: 1, name: t("IVF Solution") },
  { colSpan: 1, name: t("Vol(ml)") },
  { colSpan: 1, name: t("NGT") },
  { colSpan: 1, name: t("Oral") },
  { colSpan: 1, name: t("Vol(ml)") },
  { colSpan: 1, name: t("Medication") },
  { colSpan: 1, name: t("Infusion Pumps") },
  { colSpan: 1, name: t("Vol(ml)") },
  { colSpan: 1, name: t("Urine(ml)") },
  { colSpan: 1, name: t("Other") },
  { colSpan: 1, name: t("Other 2") },
  { colSpan: 1, name: t("Drains") },
  { colSpan: 1, name: t("NGT Aspiration") },
  { colSpan: 1, name: t("Created By") },
  { colSpan: 1, name: t("Select") }
];

// const More_THEAD = [
//   {
//     colSpan: "1",
//     name: "",
//   },
//   {
//     colSpan: "7",
//     name: "Intake Chart",
//     className: "text-center-table",
//   },
//   {
//     colSpan: "6",
//     name: "OutPut Chart",
//     className: "text-center-table",
//   },
//   {
//     colSpan: "2",
//     name: "",
//   },
// ];

const More_THEAD = [
  { colSpan: 1, name: "" },
  { colSpan: 7, name: t("Intake Chart"), className: "text-center-table" },
  { colSpan: 6, name: t("Output Chart"), className: "text-center-table" },
  { colSpan: 2, name: "" },
];

// const TFooter = [
//   {
//     colSpan: "1",
//     name: "",
//   },
//   {
//     colSpan: "2",
//     name: "Total Intake",
//     className: "text-center-table",
//   },
//   {
//     colSpan: "5",
//     name: "",
//     className: "text-center-table",
//   },
//   {
//     colSpan: "2",
//     name: "Total OutPut",
//     className: "text-center-table",
//   },
//   {
//     colSpan: "5",
//     name: "",
//     className: "text-center-table",
//   },
// ];

const TFooter = [
  { colSpan: 1, name: "" },
  { colSpan: 2, name: t("Total Intake"), className: "text-center-table" },
  { colSpan: 5, name: "", className: "text-center-table" },
  { colSpan: 2, name: t("Total Output"), className: "text-center-table" },
  { colSpan: 5, name: "", className: "text-center-table" },
];

  const [payload, setPayload] = useState({
    Date: new Date(),
  });

  const [tableData, setTableData] = useState([]);
  const [footer, setFooter] = useState([...TFooter]);

  const handleNursingWardSaveIntake = async () => {
    try {
      const responseAPI = NursingWardSaveIntakePayload(
        tableData,
        moment(payload?.Date).format("DD-MMM-YYYY")
      );
      const data = await NursingWardSaveIntake({
        intake: responseAPI,
        pid: String(patientID),
        tid: String(transactionID),
      });

      if (data?.success) {
        notify(data?.message, "success");
        handleNursingWardBindData(transactionID);
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleNursingWardBindData = async (transactionID, Date) => {
    try {
      const response = await NursingWardBindData(
        String(transactionID),
        moment(Date).format("DD-MMM-YYYY")
      );

      if (response?.data?.length > 0) {
        const data = [];
        const responseAPI = response?.data;
        for (let i = 0; i < responseAPI.length; i++) {
          data.push({ ...responseAPI[i], isChecked: false });
          if (
            i > 0 &&
            responseAPI[i + 1]?.["Shift"] === "2" &&
            responseAPI[i + 1]?.["Shift"] !== responseAPI[i]?.["Shift"] &&
            i <= responseAPI?.length - 1
          ) {
            data.push({
              Time_Label: "Morning Sub/TA",
              Solution: "",
              SolVol: Number(responseAPI[i]?.MorningSolVol),
              NGTOraSpDiet: "",
              OraSpDiet: "",
              VolNgt: Number(responseAPI[i]?.MorningVolNgt),
              Medication: "",
              More_infusion_pumps: Number(
                responseAPI[i]?.TotalMorningMore_infusion_pumps
              ),
              VolMedication: Number(responseAPI[i]?.MorningVolMedication),
              UrineVolumn: Number(responseAPI[i]?.MorningUrineVolumn),
              Other: "",
              RunningOutPut: "",
              More_drains: Number(responseAPI[i]?.TotalEveningMore_drains),
              NGT_Aspiration: "",
              Name: "",
              Shift: "1",
            });
          }
        }

        const lastDataOfArray = responseAPI?.length - 1;

        data.push({
          Time_Label: "Evening Sub/TB",
          Solution: "",
          SolVol: Number(responseAPI[lastDataOfArray]?.EveningSolVol),
          NGTOraSpDiet: "",
          OraSpDiet: "",
          VolNgt: Number(responseAPI[lastDataOfArray]?.EveningVolNgt),
          Medication: "",
          More_infusion_pumps: Number(
            responseAPI[lastDataOfArray]?.TotalEveningMore_infusion_pumps
          ),
          VolMedication: Number(
            responseAPI[lastDataOfArray]?.EveningVolMedication
          ),
          UrineVolumn: Number(responseAPI[lastDataOfArray]?.EveningUrineVolumn),
          Other: "",
          RunningOutPut: "",
          More_drains: Number(
            responseAPI[lastDataOfArray]?.TotalEveningMore_drains
          ),
          NGT_Aspiration: "",
          Name: "",
          Shift: "2",
        });

        data.push({
          Time_Label: "Grand T",
          Solution: "",
          SolVol: Number(responseAPI[lastDataOfArray]?.TotalSolVol),
          NGTOraSpDiet: "",
          OraSpDiet: "",
          VolNgt: Number(responseAPI[lastDataOfArray]?.TotalVolNgt),
          Medication: "",
          More_infusion_pumps: Number(
            responseAPI[lastDataOfArray]?.TotalMore_infusion_pumps
          ),
          VolMedication: Number(
            responseAPI[lastDataOfArray]?.TotalVolMedication
          ),
          UrineVolumn: Number(responseAPI[lastDataOfArray]?.TotalUrineVol),
          Other: "",
          RunningOutPut: "",
          More_drains: Number(responseAPI[lastDataOfArray]?.TotalMore_drains),
          NGT_Aspiration: "",
          Name: "",
          Shift: "All",
        });

        // const footerData = [
        //   {
        //     colSpan: "1",
        //     name: "",
        //   },
        //   {
        //     colSpan: "2",
        //     name: "Total Intake",
        //     className: "text-center-table",
        //   },
        //   {
        //     colSpan: "5",
        //     name: Number(responseAPI[lastDataOfArray]?.TotalIntake),
        //     className: "text-center-table",
        //   },
        //   {
        //     colSpan: "2",
        //     name: "Total OutPut",
        //     className: "text-center-table",
        //   },
        //   {
        //     colSpan: "3",
        //     name: Number(responseAPI[lastDataOfArray]?.TotalVolMedication),
        //     className: "text-center-table",
        //   },
        // ];
        const footerData = [
          { colSpan: 1, name: "" },
          { colSpan: 2, name: t("Total Intake"), className: "text-center-table" },
          {
            colSpan: 5,
            name: Number(responseAPI[lastDataOfArray]?.TotalIntake) || 0,
            className: "text-center-table",
          },
          { colSpan: 2, name: t("Total Output"), className: "text-center-table" },
          {
            colSpan: 3,
            name: Number(responseAPI[lastDataOfArray]?.TotalVolMedication) || 0,
            className: "text-center-table",
          },
        ];
        setFooter(footerData);

        setTableData(data);
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === "number") {
      const decimalWithNegativeRegex = /^-?\d+(\.\d+)?$/;
      if (decimalWithNegativeRegex.test(value)) {
        const data = [...tableData];
        data[index][name] = value;
        setTableData(data);
      }
    } else {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    handleNursingWardBindData(transactionID, value);
  };

  const handleSelect = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  const HandleInputField = (value, name, maxLength, type, index, isDisable) => {
    return (
      <Input
        value={value}
        type="text"
        className="table-input"
        name={name}
        removeFormGroupClass={true}
        maxLength={maxLength}
        onChange={(e) => {
          handleChange(e, index, type);
        }}
        disabled={isDisable}
      />
    );
  };

  const handleTbody = (tableData) => {
    return tableData?.map((items, index) => {
      const {
        Time_Label,
        Solution,
        SolVol,
        NGTOraSpDiet,
        OraSpDiet,
        VolNgt,
        Medication,
        More_infusion_pumps,
        VolMedication,
        UrineVolumn,
        Other,
        RunningOutPut,
        More_drains,
        NGT_Aspiration,
        Name,
        isChecked,
      } = items;

      if (
        ["Morning Sub/TA", "Evening Sub/TB", "Grand T"].includes(Time_Label)
      ) {
        return {
          Time: (
            <div style={{ fontWeight: 900, padding: "7px 0px" }}>
              {Time_Label}
            </div>
          ),
          Solution,
          SolVol,
          NGTOraSpDiet,
          OraSpDiet,
          VolNgt,
          Medication,
          More_infusion_pumps,
          VolMedication,
          UrineVolumn,
          Other,
          RunningOutPut,
          More_drains,
          NGT_Aspiration,
          Name,
          Select: "",
        };
      } else {
        return {
          Time: Time_Label,
          IVFSolution: HandleInputField(
            Solution,
            "Solution",
            10,
            "text",
            index,
            Name
          ), //10 maxlength
          IVFSolutionVol: HandleInputField(
            SolVol,
            "SolVol",
            4,
            "number",
            index,
            Name
          ), //4 maxlength
          NGT: HandleInputField(
            NGTOraSpDiet,
            "NGTOraSpDiet",
            10,
            "text",
            index,
            Name
          ), //10 maxlength
          Oral: HandleInputField(
            OraSpDiet,
            "OraSpDiet",
            10,
            "text",
            index,
            Name
          ), //10 maxlength
          OralVol: HandleInputField(VolNgt, "VolNgt", 4, "number", index, Name), //4 maxlength
          Medication: HandleInputField(
            Medication,
            "Medication",
            10,
            "text",
            index,
            Name
          ), //10 maxlength
          InfusionPumps: HandleInputField(
            More_infusion_pumps,
            "More_infusion_pumps",
            10,
            "text",
            index,
            Name
          ), //10 maxlength
          InfusionPumpsVol: HandleInputField(
            VolMedication,
            "VolMedication",
            4,
            "number",
            index,
            Name
          ), //4 max
          Urine: HandleInputField(
            UrineVolumn,
            "UrineVolumn",
            10,
            "number",
            index,
            Name
          ), // 10 max
          Other: HandleInputField(Other, "Other", 10, "text", index, Name), //10 max
          Other2: HandleInputField(
            RunningOutPut,
            "RunningOutPut",
            10,
            "text",
            index,
            Name
          ), //10 max
          Drains: HandleInputField(
            More_drains,
            "More_drains",
            10,
            "text",
            index,
            Name
          ), //10max
          NGTAspiration: HandleInputField(
            NGT_Aspiration,
            "NGT_Aspiration",
            10,
            "text",
            index,
            Name
          ), //10 max
          CreatedBy: Name,
          Select: (
            <Input
              type="checkbox"
              checked={isChecked}
              name="isChecked"
              onChange={(e) => handleSelect(e, index)}
              disabled={Name}
            />
          ),
        };
      }
    });
  };

  const handlePrint = async() => {
    // OpenPDFURL(
    //   "NursingWardIntakeOutPutChartPrint",
    //   transactionID,
    //   moment(payload?.Date).format("DD-MMM-YYYY")
    // );
    
    let data = {
      "date": moment(payload?.Date).format("DD-MMM-YYYY"),
      "tid": transactionID
    }
    let apiResp = await NursingWardIntakeOutPutChartPrintAPI(data)
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }
  };

  useEffect(() => {
    handleNursingWardBindData(transactionID, payload?.Date);
  }, []);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Intake And OutPut Chart")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            id="Date"
            name="Date"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Date")}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            showTime
            value={payload?.Date}
            handleChange={handleDateChange}
            hourFormat="12"
          />
          <div onClick={handlePrint}>{PrintSVG()}</div>
        </div>
      </div>

      <div className="patient_registration card">
        <IntakeOuttakeTable
          THEAD={{ More_THEAD, THEAD }}
          Tbody={handleTbody(tableData)}
          footer={footer}
          dataTitle={"THEAD"}
        />
      </div>

      <div className="d-flex justify-content-center mt-2">
        <button
          className="btn btn-sm  btn-primary"
          onClick={handleNursingWardSaveIntake}
        >
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default IntakeAndOutPutChart;
