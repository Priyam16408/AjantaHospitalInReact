import React, { useState } from "react";
import CommonSearchComponent from "./CommonSearchComponent";
import { MRDMRDSentfilestatus } from "../../../networkServices/MRDApi";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import { notify } from "../../../utils/utils";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const DEFAULTALLOPTION = [
  {
    label: "All",
    value: "0",
  },
];

const FILE_STATUS = [
  {
    label: "ALL",
    value: "2",
  },
  {
    label: "Not Received",
    value: "0",
  },
  {
    label: "Received",
    value: "1",
  },
];


const COLOR_STATUS = {
  0: "#f9f94bcc",
  1: "#6ff36fcf",
};

const FileSendToMRDStatusReport = () => {
  const [t]=useTranslation();
  const THEAD = [
    t("S.No."),
    t("Ptype"),
    t("IPDNo"),
    t("UHID No."),
    t("Name"),
    t("Age/Sex"),
    t("Contact"),
    t("Address"),
    t("Doctor Name"),
    t("Panel"),
  ];

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
    fileStatus: "2",
  });

  const [tableData, setTableData] = useState([]);

  const handleMRDMRDSentfilestatus = async () => {
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
        fileStatus: String(payload?.fileStatus),
      };

      const response = await MRDMRDSentfilestatus({
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

  const handleReactChange = (name, e, key) => {
    setPayload({ ...payload, [name]: e[key] });
  };

  const handleTableData = (tableData) => {
    return tableData?.map((row, index) => {
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
        MRD_IsFile,
      } = row;
      return {
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
        colorcode: COLOR_STATUS[Number(MRD_IsFile)],
      };
    });
  };

  return (
    <>
      <CommonSearchComponent
        HeadingName={t("File Send To MRD Status Report")}
        payload={payload}
        setPayload={setPayload}
        DEFAULTALLOPTION={DEFAULTALLOPTION}
        handleSearchAPI={handleMRDMRDSentfilestatus}
        colorCodeComponent={
          <>
            <ColorCodingSearch color={COLOR_STATUS[1]} label={t("Received")} />
            <ColorCodingSearch color={COLOR_STATUS[0]} label={t("Pending")} />
          </>
        }
      >
        <ReactSelect
          placeholderName={t("File Status")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id={"fileStatus"}
          removeIsClearable={true}
          name={"fileStatus"}
          handleChange={(name, e) => handleReactChange(name, e, "value")}
          dynamicOptions={FILE_STATUS}
          value={payload?.fileStatus}
        />
      </CommonSearchComponent>

      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Tables thead={THEAD} tbody={handleTableData(tableData)} />
        </div>
      </div>
    </>
  );
};

export default FileSendToMRDStatusReport;
