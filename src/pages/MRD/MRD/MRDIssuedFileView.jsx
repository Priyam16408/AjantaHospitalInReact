import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import { MRDSearchIssueFile } from "../../../networkServices/MRDApi";
import { notify } from "../../../utils/utils";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
import MrdDocumentViewModal from "../../../components/modalComponent/Utils/MRDDocumentViewModal";


const MRDIssuedFileView = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const [payload, setPayload] = useState({
    mrno: "",
    pname: "",
    ipdNo: "",
    fromDate: new Date(),
    toDate: new Date(),
    mrdFileNo: "",
  });
 
  const [tableData, setTableData] = useState([]);

  const [renderModal, setRenderModal] = useState({
    show: false,
    header: null,
    component: null,
    size: null,
    footer: null,
  });
  const THEAD = [
    t("S.No"),
    t("File ID"),
    t("UHID"),
    t("Patient Name"),
    t("Issue To"),
    t("Issue To Department"),
    t("Issue Date"),
    t("View"),
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleModalState = (show, header, component, size, footer) => {
    setRenderModal({
      show,
      header,
      component,
      size,
      footer,
    });
  };

  const handleTableData = (tableData) => {
    return tableData?.data?.map((row, index) => {
      const {
        fileid,
        patient_id,
        patientName,
        issuename,
        Department,
        IssueDate,
      } = row;
      return {
        SNo: index + 1,
        fileid: fileid,
        patient_id: patient_id,
        patientName: patientName,
        issuename: issuename,
        Department: Department,
        IssueDate: moment(IssueDate).format("DD-MM-YYYY hh:mm a"),
        view: (
          <i
            className="fa fa-search p-1"
            onClick={() =>
              handleModalState(
                true,
               t( "VIEW UPLOADED DOCUMENT"),
                <MrdDocumentViewModal data={row} />,
                "50vw",
                <></>
              )
            }
          />
        ),
      };
    });
  };

  const handleMRDSearchIssueFile = async () => {
    try {
      const response = await MRDSearchIssueFile({
        ...payload,
        fromDate: moment(payload?.fromDate).format("DD-MM-YYYY"),
        toDate: moment(payload?.toDate).format("DD-MM-YYYY"),
      });

      if (!response?.success) {
        notify(response?.message, "error");
      }

      setTableData(response);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("MRD File Approval")} isBreadcrumb={false} />
          <div className="row p-2">
            <Input
              type="text"
              className="form-control"
              id="mrno"
              lable={t("UHID")}
              placeholder=" "
              required={true}
              value={payload?.mrno}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="mrno"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="pname"
              lable={t("PatientName")}
              placeholder=" "
              required={true}
              value={payload?.pname}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="pname"
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

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <button
                className="btn btn-sm btn-primary mx-1"
                onClick={handleMRDSearchIssueFile}
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
        visible={renderModal?.show}
        modalWidth={renderModal?.size}
        Header={renderModal?.header}
        footer={renderModal?.footer}
        setVisible={() => handleModalState(false, null, null, null, null)}
      >
        {renderModal?.component}
      </Modal>
    </>
  );
};

export default MRDIssuedFileView;
