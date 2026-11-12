import React, { useCallback, useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../formComponent/ReactSelect";
import {
  BindEMRInvItemApi,
  BindEMRMedicine,
  DeleteEMRMedicine,
  DischargeSummaryBindConsultant,
  DischargeSummaryBindMeal,
  DischargeSummaryBindReportHeader,
  DischargeSummaryBindRoute,
  DischargeSummaryBindTime,
  DischargeSummaryBindTimeofNextDose,
  DischargeSummaryConsultantAdd,
  DischargeSummaryDeleteConsultant,
  DischargeSummaryDRHeader,
  DischargeSummaryEMRMedicine,
  DRDetailsGetDRDetails,
  SaveEMRInvItemApi,
} from "../../networkServices/dischargeSummaryAPI";
import {
  DischargeSummaryEMRMedicinePayload,
  notify,
  reactSelectOptionList,
} from "../../utils/utils";
import { GetBindDoctorDept } from "../../networkServices/opdserviceAPI";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Tables from "../UI/customTable";
import Input from "../formComponent/Input";
import CustomSelect from "../formComponent/CustomSelect";
import { DISCHARGESUMMARY_TYPE } from "../../utils/constant";
import store from "../../store/store";
import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import PatientDiagnosisInformation from "./PatientDiagnosisInformation";
import DischargeReport from "./DischargeReport";
import PageDisableOverlay from "../UI/PageDisableOverlay";
import { Table } from "react-bootstrap";
import { Checkbox } from "primereact/checkbox";
import { ClockSVG } from "../SvgIcons";

const DischargeSummary = ({ data }) => {
  const [t] = useTranslation();
  const THEADMEDICATIONDISCHARGEINSTRUCTIONS = [
    { name: t("Type"), width: "10%" },
    { name: t("Medicine Name"), width: "15%" },
    { name: t("Route"), width: "10%" },
    { name: t("Time of Next Dose"), width: "15%" },
    { name: t("Dose"), width: "10%" },
    { name: t("Frequency"), width: "10%" },
    { name: t("Duration"), width: "10%" },
    { name: t("Meal"), width: "10%" },
    { name: t("Remark"), width: "10%" },
    { name: t("Action"), width: "10%" },
  ];

  const InvestigationHeadData = [
    { name: t("S.No"), width: "1%" },

    { name: t("Department"), width: "5%" },
    { name: t("Investigation Name"), width: "5%" },
    { name: t("Date"), width: "5%" },
    { name: t("Remarks"), width: "5%" },
    { name: t("Action"), width: "1%" },
  ];
  const [investigationTableNumeric, setInvestigationTableNumeric] = useState(
    []
  );
  const [investigationTableText, setInvestigationTableText] = useState([]);

  const BindEMRInvItemTable = async () => {
    try {
      const payload = {
        tid: data?.transactionID,
        pid: data?.patientID,
        // pid: data?.patientID
      };
      console.log("Payload before API call:-----bbbb", payload);

      const response = await BindEMRInvItemApi(payload);

      // console.log("Full API Response: 🤐🥱", response);

      if (response?.success) {
        setInvestigationTableNumeric(
          response?.data.filter((fitem) => fitem?.ReportType === 1)
        );
        setInvestigationTableText(
          response?.data.filter(
            (fitem) => fitem?.ReportType === 3 || fitem?.ReportType === 5
          )
        );
        // setInvestigationTable(response?.data);
        console.log("Response Data:", response?.data);
      }
    } catch (error) {
      console.log("Error updating invoice:", error);
      // notify("Failed to update invoice.", "error");
    }
  };

  

  const SaveEMRInvItem = async () => {
  const numericInvs = investigationTableNumeric?.map((item) => ({
      // patientID: "AM24-05090001",
      patientID: data.patientID,
      transactionID: data.transactionID,
      investigation_ID: item.InvestigationID,
      labInvestigationIPD_ID: item.LabInvestigationIPD_ID,
      remarks: item.Remarks || "",
      test_ID: item.Test_ID,
      IsEnter: item.IsEnter,
    }));

  const textLabInvs = investigationTableText?.map((item) => ({
      // patientID: "AM24-05090001",
      patientID: data?.patientID,
      transactionID: data?.transactionID,
      investigation_ID: item.InvestigationID,
      labInvestigationIPD_ID: item.LabInvestigationIPD_ID,
      remarks: item.Remarks || "",
      test_ID: item.Test_ID,
      IsEnter: item.IsEnter,
    }));

  // Create final payload
  const payload = { numericInvs:numericInvs, textLabInvs: textLabInvs};

  // Check if payload is empty
  if (numericInvs.length === 0 && textLabInvs.length === 0) {
    notify("No items selected.", "error");
    return;
  }

  try {
    const response = await SaveEMRInvItemApi(payload);
    if(response?.success) { 
      BindEMRInvItemTable()
      notify(response?.message, response?.success ? "success" : "error");
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    notify("Failed to update invoice.", "error");
  }
};

  useEffect(() => {
    BindEMRInvItemTable();
  }, []);

  useEffect(() => {
    renderApiCalls();
    handleDRDetailsGetDRDetails(data);
  }, [data]);

  const THEAD = [
    "Drug Name",
    "Dose",
    "Route",
    "How Often",
    "Duration",
    "Time of Next Dose",
    "Meal",
    "Remarks",
    // "Edit",
    { name: "Remove", width: "1%" },
  ];

  const initialValues = {
    MedicationDischargeInstructions: {
      Type: null,
      MedicineName: null,
      Route: null,
      TimeOfNextDose: null,
      Dose: null,
      Times: null,
      Duration: null,
      Meal: null,
      Remark: null,
      isEdit: true,
    },
  };

  const ip = useLocalStorage("ip", "get");
  const [dropDownState, setDropDownState] = useState({
    bindReportHeader: [],
    BindDoctorDept: [],
    BindConsultant: [],
    BindRoute: [],
    BindTimeofNextDose: [],
    BindMeal: [],
    BindTime: [],
    BindEMRMedicineList: [],
  });

  const [state, setState] = useState({
    reportHeader: {},
  });

  const [pageTableData, setPageTableData] = useState({
    MedicationDischargeInstructions: [
      { ...initialValues?.MedicationDischargeInstructions },
    ],
    PatientDiagnosisInformation: [],
  });
  const [TableDataList, setDataList] = useState([]);
  const { transactionID } = data;

  const renderApiCalls = async () => {
    store.dispatch(setLoading(true));
    try {
      const [
        bindReportHeader,
        BindDoctorDept,
        BindConsultant,
        BindRoute,
        BindTimeofNextDose,
        BindMeal,
        BindTime,
        BindEMRMedicineList,
      ] = await Promise.all([
        await DischargeSummaryBindReportHeader(),
        await GetBindDoctorDept("ALL"),
        await DischargeSummaryBindConsultant(transactionID),
        await DischargeSummaryBindRoute(),
        await DischargeSummaryBindTimeofNextDose(),
        await DischargeSummaryBindMeal(),
        await DischargeSummaryBindTime(),
        await BindEMRMedicine(parseInt(transactionID)),
      ]);

      const reponseData = {
        bindReportHeader: reactSelectOptionList(
          bindReportHeader?.data,
          "Headername",
          "Headername"
        ),
        BindDoctorDept: reactSelectOptionList(
          BindDoctorDept?.data,
          "Name",
          "DoctorID"
        ),
        BindConsultant: BindConsultant?.data,
        BindRoute: reactSelectOptionList(
          BindRoute?.data,
          "Routename",
          "Routeid"
        ),
        BindTimeofNextDose: reactSelectOptionList(
          BindTimeofNextDose?.data,
          "NextDosename",
          "NextDoseid"
        ),
        BindMeal: reactSelectOptionList(BindMeal?.data, "Mealname", "Mealid"),
        BindTime: reactSelectOptionList(BindTime?.data, "NAME", "NAME"),
        BindEMRMedicineList: BindEMRMedicineList?.data,
      };

      setDropDownState(reponseData);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleDischargeSummaryConsultantAddPayload = (e) => {
    return {
      doctorID: String(e?.value),
      tid: String(transactionID),
      isMainDoctor: 0,
      doctorName: String(e?.label),
    };
  };

  const handlehandleDischargeSummaryDRHeaderPayload = (e) => {
    return {
      e,
      payload: {
        header: String(e?.label),
        tid: String(transactionID),
        ipAddress: String(ip),
      },
    };
  };

  const handleDischargeSummaryDeleteConsultant = async (items) => {
    try {
      const response = await DischargeSummaryDeleteConsultant({
        tid: String(transactionID),
        doctorID: String(items?.doctorID),
        master: 0,
      });
      notify(response?.message, response?.success ? "success" : "error");
      const BindConsultant =
        await DischargeSummaryBindConsultant(transactionID);
      setDropDownState({
        ...dropDownState,
        BindConsultant: BindConsultant?.data,
      });
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleDischargeSummaryConsultantAdd = async (payload) => {
    try {
      const response = await DischargeSummaryConsultantAdd(payload);
      const BindConsultant =
        await DischargeSummaryBindConsultant(transactionID);
      setDropDownState({
        ...dropDownState,
        BindConsultant: BindConsultant?.data,
      });
      return response;
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleDRDetailsGetDRDetails = async (data) => {
    // debugger
    try {
      const responsePayload = {
        transactionID: Number(data?.transactionID),
        patientId: String(data?.patientID),
        sex: String(data?.gender),
        isIPDData: 1,
        admissionType: "",
        status: String(data?.status),
      };

      const response = await DRDetailsGetDRDetails(responsePayload);
      const responseSet = {
        ...response?.data,
        label: response?.data?.header,
        value: response?.data?.header,
      };
      setState({ ...state, reportHeader: responseSet });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleDischargeSummaryDRHeader = async (payload) => {
    try {
      const response = await DischargeSummaryDRHeader(payload.payload);
      if (response?.success) {
        const responseSet = {
          ...response?.data,
          label: payload?.e.label,
          value: payload?.e.value,
        };
        setState({ ...state, reportHeader: responseSet });
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something went Wrong");
    }
  };

  const handleReactChange = async (
    name,
    e,
    apiCall,
    payloadFunction,
    settlerFuction
  ) => {
    try {
      const response = await apiCall(payloadFunction(e));
      // setState({ ...state, [name]: e });
      if (settlerFuction) settlerFuction;
      notify(response?.message, response?.success ? "success" : "error");
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleCustomSelectChange = (name, e, index) => {
    const data = [...pageTableData?.MedicationDischargeInstructions];
    data[index][name] = e?.value;

    setPageTableData({
      ...pageTableData,
      MedicationDischargeInstructions: data,
    });
  };

  const handleRowTable = (e, index) => {
    const { name, value } = e.target;

    // Instead of cloning the entire array, just clone the changed row
    const updatedRow = {
      ...pageTableData.MedicationDischargeInstructions[index],
      [name]: value,
    };

    // Update only the specific row in the state
    const updatedData = [...pageTableData.MedicationDischargeInstructions];
    updatedData[index] = updatedRow;

    setPageTableData((prevData) => ({
      ...prevData,
      MedicationDischargeInstructions: updatedData,
    }));
  };

  const handleSaveMedicationDischargeInstructions = async (
    MedicationDischargeInstructionspayload
  ) => {
    const requiredFields = [
      "MedicineName",
      "Dose",
      "TimeOfNextDose",
      "Duration",
    ];
    for (const field of requiredFields) {
      // if (!MedicationDischargeInstructionspayload[field] || MedicationDischargeInstructionspayload[field].trim() === "") {
      //   debugger;
      //   return notify(`The field "${field}" is required.`,"error");
      // }
      if (
        field === "TimeOfNextDose" &&
        (!MedicationDischargeInstructionspayload[field] ||
          isNaN(MedicationDischargeInstructionspayload[field]) ||
          parseInt(MedicationDischargeInstructionspayload[field], 10) <= 0)
      ) {
        return notify(
          `The field "${field}" must be a valid positive number.`,
          "error"
        );
        // return null; // Stop further processing
      } else if (
        field !== "TimeOfNextDose" &&
        (!MedicationDischargeInstructionspayload[field] ||
          MedicationDischargeInstructionspayload[field].trim() === "")
      ) {
        return notify(`The field "${field}" is required.`, "error");
        // return null; // Stop further processing
      }
    }
    try {
      const apiPayload = DischargeSummaryEMRMedicinePayload(
        MedicationDischargeInstructionspayload,
        transactionID
      );
      const response = await DischargeSummaryEMRMedicine(apiPayload);
      if (response.success) {
        const newResponse = await BindEMRMedicine(parseInt(transactionID));
        if (newResponse.success) {
          setDropDownState((prevState) => ({
            ...prevState,
            BindEMRMedicineList: newResponse.data,
          }));
          setPageTableData({
            MedicationDischargeInstructions: [
              { ...initialValues?.MedicationDischargeInstructions },
            ],
          });
        }
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const settlerMedicationDischargeInstructions = (item, index) => {
    const returnData = {
      Type: null,
      MedicineName: null,
      Route: null,
      TimeOfNextDose: null,
      Dose: null,
      Times: null,
      Duration: null,
      Meal: null,
      Remark: null,
      Action: null,
    };

    // type
    // const requiredFields = ["MedicineName", "Dose", "TimeOfNextDose", "Duration"];
    // for (const field of requiredFields) {
    //   if (!item[field] || item[field].trim() === "") {
    //     debugger;
    //     return notify(`The field "${field}" is required.`,"error");
    //   }
    // }

    returnData.Type = item?.isEdit ? (
      <CustomSelect
        option={DISCHARGESUMMARY_TYPE}
        placeHolder={"Select"}
        name="Type"
        value={item?.Type}
        onChange={(name, e) => handleCustomSelectChange(name, e, index)}
      />
    ) : (
      item?.Type
    );
    // medicine

    returnData.MedicineName = item?.isEdit ? (
      <Input
        type="text"
        className="table-input required-fields"
        removeFormGroupClass={true}
        key={`medicine-${index}`}
        name="MedicineName"
        value={item?.MedicineName ? item?.MedicineName : ""}
        onChange={(e) => handleRowTable(e, index)}
      />
    ) : (
      item?.MedicineName
    );

    // Route

    returnData.Route = item?.isEdit ? (
      <CustomSelect
        option={dropDownState?.BindRoute}
        placeHolder={"Select"}
        name="Route"
        value={item?.Route}
        onChange={(name, e) => handleCustomSelectChange(name, e, index)}
      />
    ) : (
      item?.Route
    );

    // TimeOfNextDose

    returnData.TimeOfNextDose = item?.isEdit ? (
      <CustomSelect
        className="required-fields"
        requiredClassName="required-fields"
        option={dropDownState?.BindTimeofNextDose}
        placeHolder={"Select"}
        name="TimeOfNextDose"
        value={item?.TimeOfNextDose}
        onChange={(name, e) => handleCustomSelectChange(name, e, index)}
      />
    ) : (
      item?.TimeOfNextDose
    );

    // Dose

    returnData.Dose = item?.isEdit ? (
      <Input
        type="text"
        className="table-input required-fields"
        removeFormGroupClass={true}
        key={`Dose-${index}`}
        name="Dose"
        value={item?.Dose ? item?.Dose : ""}
        onChange={(e) => handleRowTable(e, index)}
      />
    ) : (
      item?.Dose
    );

    // Times

    returnData.Times = item?.isEdit ? (
      <CustomSelect
        option={dropDownState?.BindTime}
        placeHolder={"Select"}
        name="Times"
        value={item?.Times}
        onChange={(name, e) => handleCustomSelectChange(name, e, index)}
      />
    ) : (
      item?.Times
    );

    // Duration

    returnData.Duration = item?.isEdit ? (
      <Input
        type="text"
        className="table-input required-fields"
        removeFormGroupClass={true}
        key={`Duration-${index}`}
        name="Duration"
        value={item?.Duration ? item?.Duration : ""}
        onChange={(e) => handleRowTable(e, index)}
      />
    ) : (
      item?.Duration
    );

    // Meal

    returnData.Meal = item?.isEdit ? (
      <CustomSelect
        option={dropDownState?.BindMeal}
        placeHolder={"Select"}
        name="Meal"
        value={item?.Meal}
        onChange={(name, e) => handleCustomSelectChange(name, e, index)}
      />
    ) : (
      item?.Meal
    );

    // Remarks

    returnData.Remark = item?.isEdit ? (
      <Input
        type="text"
        className="table-input"
        removeFormGroupClass={true}
        name="Remark"
        key={`Remark-${index}`}
        value={item?.Remark ? item?.Remark : ""}
        onChange={(e) => handleRowTable(e, index)}
      />
    ) : (
      item?.Remark
    );

    // Action

    returnData.Action = item?.isEdit ? (
      <button
        className="btn btn-sm btn-primary"
        onClick={() => handleSaveMedicationDischargeInstructions(item)}
      >
        {t("Add")}
      </button>
    ) : (
      ""
    );

    return returnData;
  };

  const handleTbody = (tableData) => {
    return tableData?.map((items, index) => {
      const {
        Type,
        MedicineName,
        Route,
        TimeOfNextDose,
        Dose,
        Times,
        Duration,
        Meal,
        Remark,
        Action,
      } = settlerMedicationDischargeInstructions(items, index);
      return {
        Type,
        MedicineName,
        Route,
        TimeOfNextDose,
        Dose,
        Times,
        Duration,
        Meal,
        Remark,
        Action,
      };
    });
  };

  const handleItemRemove = async (item) => {
    // setDropDownState((prevState) => ({
    //   ...prevState,
    //   BindEMRMedicineList: prevState.BindEMRMedicineList.filter((item) => item.ID !== id),
    // }));
    const payload = {
      medicineName: item.Medicine,
      Id: item.ID,
      TID: transactionID,
    };
    try {
      const response = await DeleteEMRMedicine(payload);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        const newResponse = await BindEMRMedicine(parseInt(transactionID));
        if (newResponse.success) {
          setDropDownState((prevState) => ({
            ...prevState,
            BindEMRMedicineList: newResponse.data,
          }));
        }
      }
    } catch (error) {
      // console.log("Error updating invoice:", error);
      notify("Failed to update invoice.", "error");
    }
  };

  // console.log(checkboxState,"checkboxState")

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading title={t("Discharge Details Entries")} isBreadcrumb={false} />

        <PageDisableOverlay
          isDisable={Boolean(
            Number(state?.reportHeader?.isDisChargeSummaryApproved)
          )}
        >
          <div className="row p-2">
            <div className="col-md-5">
              <CustomizeAutoCompelete label={t("DischargeType")} flex={true}>
                <ReactSelect
                  respclass={""}
                  lable={""}
                  name={"reportHeader"}
                  dynamicOptions={dropDownState?.bindReportHeader}
                  placeholderName={""}
                  handleChange={(name, e) =>
                    handleReactChange(
                      name,
                      e,
                      handleDischargeSummaryDRHeader,
                      handlehandleDischargeSummaryDRHeaderPayload,
                      handleDRDetailsGetDRDetails(data)
                    )
                  }
                  value={state?.reportHeader?.value}
                />
              </CustomizeAutoCompelete>

              <CustomizeAutoCompelete
                label={t("AddConsultant")}
                tags={dropDownState?.BindConsultant}
                renderKeyName={"Name"}
                bgColor={"#f0f0ff"}
                handleRemove={handleDischargeSummaryDeleteConsultant}
                flex={true}
              >
                <div style={{ minWidth: "200px" }}>
                  <ReactSelect
                    respclass={""}
                    lable={""}
                    dynamicOptions={dropDownState?.BindDoctorDept}
                    placeholderName={""}
                    handleChange={(name, e) =>
                      handleReactChange(
                        name,
                        e,
                        handleDischargeSummaryConsultantAdd,
                        handleDischargeSummaryConsultantAddPayload
                      )
                    }
                  />
                </div>
              </CustomizeAutoCompelete>
            </div>

            <div className="col-md-7">
              <CustomizeAutoCompelete label={t("PatientDiagnosisInformation")}>
              
                <PatientDiagnosisInformation
                  pageTableData={pageTableData}
                  setPageTableData={setPageTableData}
                  data={data}
                />
              </CustomizeAutoCompelete>
            </div>

            <div className="col-12">
              <CustomizeAutoCompelete
                label={t("MedicationDischargeInstructions")}
              >
                <div className="col-10 p-0 px-1">
                  <Tables
                    thead={THEADMEDICATIONDISCHARGEINSTRUCTIONS}
                    tbody={handleTbody(
                      pageTableData?.MedicationDischargeInstructions
                    )}
                  />
                  {dropDownState.BindEMRMedicineList.length > 0 ? (
                    <Tables
                      thead={THEAD}
                      tbody={dropDownState.BindEMRMedicineList.map(
                        (item, index) => ({
                          "Drug Name": item?.Medicine || "-",
                          Dose: item?.Dose || "-",
                          Route: item?.Route || "-",
                          "How Often": item?.time || "-",
                          Duration: item?.days || "-",
                          "Time of Next Dose": item?.Timefornxtdose || "-",
                          Meal: item?.Meal || "-",
                          Remarks: item?.Reason || "-",
                          Remove: (
                            <i
                              className="fa fa-trash text-danger text-center"
                              onClick={() => handleItemRemove(item)}
                            ></i>
                          ), // Add custom action
                        })
                      )}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </CustomizeAutoCompelete>
            </div>

            <div className="col-12">
              <CustomizeAutoCompelete
              // label={t("DischargeReport")}
              >
                <DischargeReport
                  data={{ ...state, transactionID }}
                  handleDRDetailsGetDRDetails={() =>
                    handleDRDetailsGetDRDetails(data)
                  }
                  patientData={{ data }}
                />
              </CustomizeAutoCompelete>
            </div>
          </div>
        </PageDisableOverlay>

        <div className="card mt-2">
          <div>
            <Heading
              title={t("Investigation Details Numeric (IPD)")}
              isBreadcrumb={false}
            />

            <Tables
              thead={InvestigationHeadData}
              tbody={investigationTableNumeric.map((item, index) => ({
                Sno: index + 1,
                Department: item?.Department,
                Investigationname: item?.Name,
                date: item?.Date,
                remarks: (
                  <>
                    <Input
                      type="text"
                      className="table-input "
                      removeFormGroupClass={true}
                      key={`remark-${index}`}
                      name={`remark-${index}`}
                      value={item?.Remarks}
                      onChange={(e) => {
                        const updatedData = [...investigationTableNumeric];
                        updatedData[index] = {
                          ...updatedData[index],
                          Remarks: e.target.value,
                        };
                        setInvestigationTableNumeric(updatedData);
                      }}
                    />
                  </>
                ),
                checkbox: (
                  <>
                    <>
                      <Checkbox
                        key={index}
                        id={`checkbox-${index}`}
                        className="mt-2"
                        name={`checkbox-${index}`}
                        onChange={(e) => {
                          const updatedData =
                            investigationTableNumeric[index]?.IsEnter === 1
                              ? 0
                              : 1;
                          setInvestigationTableNumeric((prev) => {
                            const newData = [...prev];
                            newData[index] = {
                              ...newData[index],
                              IsEnter: updatedData,
                            };
                            return newData;
                          });
                        }}
                        checked={item?.IsEnter === 1 ? true : false}
                      />
                    </>
                  </>
                ),
              }))}
            />
          </div>
          <div className="mt-4">
            <Heading
              title={t("Investigation Details Text (IPD)")}
              isBreadcrumb={false}
            />

            <Tables
              thead={InvestigationHeadData}
              tbody={investigationTableText?.map((item, index) => ({
                Sno: index + 1,
                Department: item?.Department,
                Investigationname: item?.Name,
                date: item?.Date,
                remarks: (
                  <>
                    <Input
                      type="text"
                      className="table-input "
                      removeFormGroupClass={true}
                      key={`remark-${index}`}
                      name={`remark-${index}`}
                      value={item?.Remarks}
                      onChange={(e) => {
                        const updatedData = [...investigationTableText];
                        updatedData[index] = {
                          ...updatedData[index],
                          Remarks: e.target.value,
                        };
                        setInvestigationTableText(updatedData);
                      }}
                    />
                  </>
                ),
                checkbox: (
                  <>
                    <Checkbox
                      key={index}
                      id={`checkbox-${index}`}
                      className="mt-2"
                      name={`checkbox-${index}`}
                      onChange={() => {
                        const updatedData =
                          investigationTableText[index]?.IsEnter === 1
                            ? 0
                            : 1;
                        setInvestigationTableText((prev) => {
                          const newData = [...prev];
                          newData[index] = {
                            ...newData[index],
                            IsEnter: updatedData,
                          };
                          return newData;
                        });
                      }}
                      checked={item?.IsEnter === 1 ? true : false}
                    />
                  </>
                ),
              }))}
            />
          </div>
          <div>
            <button
              className="btn btn-sm btn-success m-2"
              type="button"
              onClick={SaveEMRInvItem}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomizeAutoCompelete = ({
  children,
  label,
  tags,
  renderKeyName,
  bgColor,
  handleRemove,
  flex,
}) => {
  return (
    <div className="App py-1 mx-1">
      <div className="tag-input-container" style={{ position: "relative" }}>
        {label && (
          <label className={`col-sm-${flex ? 5 : 2} patientLabel m-0"`}>
            {label}
          </label>
        )}
        {tags &&
          tags?.map((items, i) => {
            return (
              <div className="tag " style={{ backgroundColor: bgColor }}>
                {items[renderKeyName]}
                <span
                  className="tag-close-icon"
                  onClick={() => handleRemove(items)}
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i>
                </span>
              </div>
            );
          })}
        {flex ? (
          <div style={{ flexGrow: 1 }} className="mx-1">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DischargeSummary;
