import React, { useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "@app/components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import VitalExaminationModal from "../../../components/modalComponent/Utils/VitalExaminationModal";
import OverLay from "../../../components/modalComponent/OverLay";

const OpdTriageRoom = () => {
  const [t] = useTranslation();
  const [modalData, setModalData] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState({
    index: null,
    data: "",
  });
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("top");
  const show = (position) => {
    setPosition(position);
    setVisible(true);
  };
  const [bodyData, setBodyData] = useState([
    {
      "#": 1,

      input: (
        <input
          value={0}
          onChange={(e) => handleChange(e, index)}
          name="input"
        />
      ),

      Shortcuts: 1,
      "View Instruction": 1,
      "Is Critical": 1,
      "Triaging Code": 1,
      UHID: 1,
      "Patient Name": 1,
      Contact: 1,
      Sex: 1,
      "Appointment On": 1,
      Doctor: 1,
      Panel: 1,
      "Visit Type": 1,
      Check: (
        <>
          <div
            onClick={() => show("top")}
            // onClick={() => {
            //   setModalData(true);
            //   setSelectedRowIndex({
            //     ...selectedRowIndex,
            //     index: 1,
            //   });
            // }}
          >
            <i className="fa fa-check" aria-hidden="true"></i>
          </div>
        </>
      ),
    },
  ]);

  const THEAD = [
    t("#"),
    t("*"),
    t("Shortcuts"),
    t("View Instruction"),
    t("Is Critical"),
    t("Triaging Code"),
    t("UHID"),
    t("Patient Name"),
    t("Contact"),
    t("Sex"),
    t("Appointment On	"),
    t("Doctor"),
    t("Panel"),
    t("Visit Type"),
    t("@"),
    t("#"),
  ];

  const handleChange = (e, index) => {
  
    const { name, value } = e.target;
    const data = [...bodyData];
    data[index][name] = (
      <input
        value={value}
        onChange={(e) => handleChange(e, index)}
        name="input"
      />
    );
    setBodyData(data);
  };

  return (
    <>
      {/* {modalData && (
        <Modal visible={modalData} setVisible={setModalData}>
          {selectedRowIndex?.index !== null && <VitalExaminationModal />}
        </Modal>
      )} */}

      <OverLay
        visible={visible}
        setVisible={setVisible}
        position={position}
        setPosition={setPosition}
        Header={"Patient Details"}
      >
        <VitalExaminationModal />
      </OverLay>
      <div className="card patient_registration border">
        <Heading title={t("Search Patient")} />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 m-2">
          <Input
            type="text"
            className="form-control"
            id="BarcodeSearch"
            name="BarcodeSearch"
            lable={t("Barcode Search")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            lable={t("FrontOffice.Re_Print.label.UHID")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("App. No.")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="PatientName"
            name="patientname"
            lable={t("FrontOffice.Re_Print.label.Patient Name")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Doctor Group")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Status")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Clinic")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Doctor")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Panel")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="date"
            className="form-control"
            id="FromDate"
            name="fromdate"
            lable={t("FrontOffice.Re_Print.label.FromDate")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="date"
            className="form-control"
            id="ToDate"
            name="todate"
            lable={t("FrontOffice.Re_Print.label.ToDate")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Transfer To Doctor")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Triage Booking")}
            id={"Title"}
            searchable={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <div className="d-flex justify-content-between">
            <button className="btn btn-sm btn-info ">{t("Search")}</button>
            <button className="btn btn-sm btn-success ">{t("Transfer")}</button>
            <button className="btn btn-sm btn-info ">
              {t("Triage Booking")}
            </button>
          </div>
        </div>
        <div className="row m-2">
          <div className="col-sm-2 d-flex">
            <div className="statusConfirmed"></div>
            <label className="text-dark ml-2">Emergency</label>
          </div>
          <div className="col-sm-2 d-flex">
            <div className="statusRescheduled"></div>
            <label className="text-dark ml-2">Payment Pending</label>
          </div>
          <div className="col-sm-2 d-flex">
            <div className="statusPending"></div>
            <label className="text-dark ml-2">Admitted In Casulty</label>
          </div>
          <div className="col-sm-2 d-flex">
            <div className="statusAppointment"></div>
            <label className="text-dark ml-2">Triage Booking</label>
          </div>
          <div className="col-sm-2 d-flex">
            <div className="statusCanceled"></div>
            <label className="text-dark ml-2">Doctor OUT</label>
          </div>
          <div className="col-sm-2 d-flex">
            <div className="statusUnregistered"></div>
            <label className="text-dark ml-2">Doctor IN</label>
          </div>
        </div>
      </div>
      <div className="card">
        <Tables thead={THEAD} tbody={bodyData} />
      </div>
    </>
  );
};

export default OpdTriageRoom;
