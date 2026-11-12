import React, { useState } from "react";
import {
  MRDSaveSentFile,
  MRDSearchPatient,
} from "../../../networkServices/MRDApi";
import { MRDSaveSentFilePayload, notify } from "../../../utils/utils";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import CommonSearchComponent from "./CommonSearchComponent";
import { useTranslation } from "react-i18next";

const DEFAULTALLOPTION = [
  {
    label: "All",
    value: "0",
  },
];

const FileSendToMRD = () => {
  const [tableData, setTableData] = useState([]);
  const [t] = useTranslation()

  const [payload, setPayload] = useState({
    patientType: "IPD",
    pid: "",
    patientName: "",
    transactionNo: "",
    doctorId: "0",
    company: "Select",
    ucFromDate: new Date(),
    ucToDate: new Date(),
    isIgnore: 0,
  });

  const handleAllItemChecked = (e) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data.forEach((ele, _) => {
      ele[name] = checked;
    });
    setTableData(data);
  };

  const THEAD = [
    {
      name: <input
        type="checkbox"
        name="isChecked"
        checked={tableData?.every((ele, _) => ele?.isChecked)}
        onChange={handleAllItemChecked}
      />
    },
    t("S.No."),
    t("Ptype"),
    t("IPDNo"),
    t("UHID No."),
    t("Name"),
    t("Age/Sex"),
    t("Contact"),
    t("Address"),
    t("Doctor Name"),
    t("Panel")
  ];

  const handleMRDSaveSentFile = async () => {
    try {
      const requestBody = MRDSaveSentFilePayload(tableData);
      const response = await MRDSaveSentFile(requestBody);
      notify(response?.message, response?.success ? "success" : "error");

      if (response?.success) {
        handleSearchPatient();
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleSearchPatient = async () => {
    store.dispatch(setLoading(true));
    try {
      const requestBody = {
        ageFrom: "",
        ageTo: "",
        deptId: "",
        dischargeType: "ALL",
        doctorId: String(payload?.doctorId),
        fromDate: moment(payload?.ucFromDate).format("DD-MMM-YYYY"),
        panelId: String(payload?.company),
        parentPanelId: "Select",
        patientId: String(payload?.pid),
        patientName: String(payload?.patientName),
        roomType: "0",
        todate: moment(payload?.ucToDate).format("DD-MMM-YYYY"),
        transactionId: String(payload?.transactionNo),
        fileType: 0,
        pType: String(payload?.patientType),
        fileStatus: "",
      };

      const response = await MRDSearchPatient({
        searchCateria: requestBody,
        isIgnore: Number(payload?.isIgnore),
      });

      setTableData(response?.data);
      if (response?.success) {
        return;
      }

      notify(response?.message, "error");
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleCheckedItem = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  const handleTableData = (tableData) => {
    return tableData.map((row, index) => {
      const {
        type,
        TransNo,
        PatientID,
        Pname,
        Age,
        Mobile,
        Address,
        DoctorName,
        Panel,
        isChecked,
      } = row;
      return {
        isChecked: (
          <input
            type="checkbox"
            name="isChecked"
            checked={isChecked}
            onChange={(e) => handleCheckedItem(e, index)}
          />
        ),
        SNO: <div className="p-1">{index + 1}</div>,
        type: type,
        TransNo: TransNo,
        PatientID: PatientID,
        Pname: Pname,
        Age: Age,
        Mobile: Mobile,
        Address: Address,
        DoctorName: DoctorName,
        Panel: Panel,
      };
    });
  };

  return (
    <>
      <CommonSearchComponent
        HeadingName={t("FILE SENT TO MRD")}
        payload={payload}
        setPayload={setPayload}
        DEFAULTALLOPTION={DEFAULTALLOPTION}
        handleSearchAPI={handleSearchPatient}
      />
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Tables thead={THEAD} tbody={handleTableData(tableData)} />
          {tableData?.some((row, _) => row?.isChecked) && (
            <div className="d-flex align-items-end justify-content-end p-2">
              <button
                // className="btn btn-sm btn-primary"
                className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                onClick={handleMRDSaveSentFile}
              >
                {t("Send To MRD")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileSendToMRD;
