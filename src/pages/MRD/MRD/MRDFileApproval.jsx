import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  MRDApprovedRequisition,
  MRDBindPatientType,
  MRDSearchMRDRequisition,
} from "../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { TableListSVG } from "../../../components/SvgIcons";
import Modal from "../../../components/modalComponent/Modal";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const STATUS_DROPDOWN = [
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Approved",
    value: "1",
  },
  {
    label: "Rejected",
    value: "3",
  },
];

const FILE_TYPE_DROPDOWN = [
  {
    label: "Sent",
    value: "0",
  },
  {
    label: "Return",
    value: "1",
  },
];

const MRDFileApproval = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const ip = useLocalStorage("ip", "get");

  const [dropDownState, setDropDownState] = useState({
    BindPatientType: [],
  });

  const [payload, setPayload] = useState({
    mrNo: "",
    pName: "",
    ipdNo: "",
    fromDate: new Date(),
    toDate: new Date(),
    mrdFileNo: "",
    status: "0",
    returnStatus: "0",
    pType: "IPD",
  });

  const THEAD = [
    t("Approve"),
     t("Reject"),
     t("Patient Type"),
     t("UHID"),
     t("IPD No"),
     t("Patient Name"),
     t("Gender / DOB"),
     t("Requested Department"),
     t("RequestedBy"),
     t("RequestedDate"),
   ];
   
  const [tableData, setTableData] = useState([]);

  const [modalState, setModalState] = useState({
    show: false,
    component: null,
    size: null,
    footer: null,
    header: null,
  });

  const handleMRDBindPatientType = async () => {
    try {
      const response = await MRDBindPatientType();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const renderAPI = async () => {
    try {
      const [BindPatientType] = await Promise.all([handleMRDBindPatientType()]);
      const dropDownData = {
        BindPatientType: [
          ...handleReactSelectDropDownOptions(
            BindPatientType?.data,
            "PType",
            "PType"
          ),
        ],
      };
      setDropDownState(dropDownData);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e, key) => {
    setPayload({
      ...payload,
      [name]: e?.[key],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleMRDSearchMRDRequisition = async (isMessage=true) => {
    try {
      const response = await MRDSearchMRDRequisition({
        ...payload,
        fromDate: moment(payload?.fromDate).format("DD-MM-YYYY"),
        toDate: moment(payload?.toDate).format("DD-MM-YYYY"),
        // fromDate: moment(payload?.fromDate).format("DD-MM-YYYY"),
        // fromDate: moment(payload?.fromDate).format("DD-MM-YYYY"),
      });

      if (!response?.success && isMessage) {
        notify(response?.message, "error");
      }

      setTableData(response?.data);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleModalState = (show, component, size, header, footer) => {
    setModalState({
      show: show,
      size: size,
      component: component,
      header: header,
      footer: footer,
    });
  };

  const handleMRDApprovedRequisition = async (row, status) => {
    debugger;
    try {
      const requestBody = {
        requestID: String(row?.MRDRequisitionID),
        status: String(status),
        reason: String(row?.Remarks),
        returnStatus: "0",
        ipAddress: String(ip),
      };
      const response = await MRDApprovedRequisition(requestBody);

      notify(response?.message, response?.success ? "success" : "error");

      if (response?.success) {
        setModalState(false, null, null, null, null);
        handleMRDSearchMRDRequisition(false);
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleTableData = (tableData) => {

    return tableData?.map((row, index) => {
      const {
        IsApproved,
        IsIssue,
        Rejected,
        type,
        PatientID,
        TransNo,
        PatientName,
        DOB,
        Gender,
        DeptName,
        RequestedBy,
        RequestedDate,
      } = row;
      return {
        Approve: (
          row?.Status!=="1" &&
          <div
            onClick={() =>
              handleModalState(
                true,
                <label className="ml-5">
                  User Remark :{row?.Remarks} <br /> <span className="text-danger"> 
                    Are you want to approve this ?
                  </span>
                </label>,
                "20vw",
                t("Confrim"),
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    onClick={() => handleMRDApprovedRequisition(row, 1)}
                  >
                    {t("Yes")}
                  </button>
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    onClick={() => setModalState(false, null, null, null, null)}
                  >
                    {t("NO")}
                  </button>
                </div>
              )
            }
          >
           
            <TableListSVG />
          </div>
        ),
        Reject: (
          <div onClick={() => { }}>
            <TableListSVG />
          </div>
        ),
        type: type,
        PatientID: PatientID,
        TransNo: TransNo,
        PatientName: PatientName,
        DOBGender: DOB + "/" + Gender,
        DeptName: DeptName,
        RequestedBy: RequestedBy,
        RequestedDate: RequestedDate,
      };
    });
  };

  useEffect(() => {
    renderAPI();
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("MRD File Approval")} isBreadcrumb={false} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("PatientType")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"pType"}
              name={"pType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={dropDownState?.BindPatientType}
              value={payload?.pType}
            />

            <Input
              type="text"
              className="form-control"
              id="mrNo"
              lable={t("UHID")}
              placeholder=" "
              required={true}
              value={payload?.mrNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="mrNo"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="pName"
              lable={t("PatientName")}
              placeholder=" "
              required={true}
              value={payload?.pName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="pName"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="ipdNo"
              lable={t("IPDNo")}
              placeholder=" "
              required={true}
              value={payload?.ipdNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="ipdNo"
              onChange={handleChange}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("FromDate")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              name="fromDate"
              id="fromDate"
              value={payload?.fromDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("ToDate")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              name="toDate"
              id="toDate"
              value={payload?.toDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="mrdFileNo"
              lable={t("MRD File No")}
              placeholder=" "
              required={true}
              value={payload?.mrdFileNo}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="mrdFileNo"
              onChange={handleChange}
            />

            <ReactSelect
              placeholderName={t("Status")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"status"}
              name={"status"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={STATUS_DROPDOWN}
              value={payload?.status}
            />

            <ReactSelect
              placeholderName={t("File Type")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"returnStatus"}
              name={"returnStatus"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={FILE_TYPE_DROPDOWN}
              value={payload?.returnStatus}
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <button
                className="btn btn-sm btn-primary mx-1"
                onClick={handleMRDSearchMRDRequisition}
              >
                {t("Search")}
              </button>
              <button className="btn btn-sm btn-primary mx-1">{t("Clear")}</button>
            </div>
          </div>
        </div>

        <div className="patient_registration card">
          <div className="row">
            <div className="col-12">
              <Tables thead={THEAD} tbody={handleTableData(tableData)} />
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={modalState?.show}
        setVisible={() =>
          setModalState({
            show: false,
            component: null,
            size: null,
            footer: null,
            header: null,
          })
        }
        Header={modalState?.header}
        footer={modalState?.footer}
        modalWidth={modalState?.size}
      >
        {modalState?.component}
      </Modal>
    </>
  );
};

export default MRDFileApproval;
