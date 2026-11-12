import React, { useState } from "react";
import CommonSearchComponent from "./CommonSearchComponent";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import store from "../../../store/store";
import { MRDMRDRequisitionSearch } from "../../../networkServices/MRDApi";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import moment from "moment";
import { notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import { TableListSVG } from "../../../components/SvgIcons";
import Modal from "../../../components/modalComponent/Modal";
import MRDFileRequestModal from "../../../components/modalComponent/Utils/MRDFileRequestModal";
import { useTranslation } from "react-i18next";

const DEFAULTALLOPTION = [
  {
    label: "All",
    value: "0",
  },
];

const MRD_FILE_STATUS = [
  { label: "Request", value: "0" },
  {
    label: "Return",
    value: "1",
  },
];


const FileRequisition = () => {
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
    fileType: "0",
  });

  const [tableData, setTableData] = useState([]);
  const [t] = useTranslation();
  const [modalRender, setModalRender] = useState({
    show: false,
    component: null,
    size: null,
    Header: null,
    footer: <></>,
  });

  const THEAD = [
    t("Select"),
    t("S.No"),
    t("PType"),
    t("IPD No."),
    t("UHID No."),
    t("Name"),
    t("Age/Sex"),
    t("Doctor Name"),
    t("Panel"),
    t("Admitted Date"),
    t("Discharge Date"),
    t("MRD File Receive Date"),
  ];

  const handleReactChange = (name, e, key) => {
    setPayload({ ...payload, [name]: e[key] });
  };

  const handleMRDMRDRequisitionSearch = async () => {
    store.dispatch(setLoading(true));
    try {
      const requestBody = {
        ageFrom: "",
        ageTo: "",
        deptId: "",
        dischargeType: "Normal",
        doctorId: String(payload?.doctorId),
        fromDate: moment(payload?.ucFromDate).format("DD-MMM-YYYY"),
        panelId: String(payload?.company),
        parentPanelId: "",
        patientId: String(payload?.pid),
        patientName: String(payload?.patientName),
        roomType: "",
        todate: moment(payload?.ucToDate).format("DD-MMM-YYYY"),
        transactionId: String(payload?.transactionNo),
        fileType: Number(payload?.fileType),
        pType: String(payload?.patientType),
        fileStatus: "",
      };

      const response = await MRDMRDRequisitionSearch({
        searchcateria: requestBody,
        isIgnore: Number(payload?.isIgnore),
        admittedDate: "",
        dischargeDate: "",
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

  const handleModalState = (item) => {
    item.fileType = payload?.fileType
    setModalRender({
      show: true,
      component: (
        <MRDFileRequestModal data={item} handleModalSave={handleModalSave} payloadData={payload} />
      ),
      Header: t("File Request"),
      size: "25vw",
      footer: <></>,
    });
  };

  const handleModalSave = () => {
    setModalRender({
      show: false,
      component: null,
      size: null,
      Header: null,
      footer: <></>,
    });
    handleMRDMRDRequisitionSearch();
  };

  const handleTableData = (tableData) => {
    return tableData?.map((row, index) => {
      const {
        type,
        TransNo,
        Patient_ID,
        NAME,
        AgeSex,
        Doctor,
        Company_Name,
        AdmissionDateTime,
        DischargeDateTime,
        FileEntryDateTime,
      } = row;
      return {
        Action: (
          <div onClick={() => handleModalState(row)}>
            <TableListSVG />
          </div>
        ),
        SNo: index + 1,
        type: type,
        TransNo: TransNo,
        Patient_ID: Patient_ID,
        NAME: NAME,
        AgeSex: AgeSex,
        Doctor: Doctor,
        Company_Name: Company_Name,
        AdmissionDateTime: AdmissionDateTime,
        DischargeDateTime: DischargeDateTime,
        FileEntryDateTime: FileEntryDateTime,
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
        handleSearchAPI={handleMRDMRDRequisitionSearch}
      >
        <ReactSelect
          placeholderName={t("MRD File")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id={"fileType"}
          removeIsClearable={true}
          name={"fileType"}
          handleChange={(name, e) => handleReactChange(name, e, "value")}
          dynamicOptions={MRD_FILE_STATUS}
          value={payload?.fileType}
        />
      </CommonSearchComponent>

      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Tables thead={THEAD} tbody={handleTableData(tableData)} />
        </div>
      </div>

      <Modal
        Header={modalRender?.Header}
        visible={modalRender?.show}
        modalWidth={modalRender?.size}
        setVisible={() => {
          setModalRender({
            show: false,
            component: null,
            size: null,
            Header: null,
            footer: <></>,
          });
        }}
        footer={modalRender?.footer}
      >
        {modalRender?.component}
      </Modal>
    </>
  );
};

export default FileRequisition;
