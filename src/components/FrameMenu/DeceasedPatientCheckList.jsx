import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import LabeledInput from "../formComponent/LabeledInput";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import ReactSelect from "../formComponent/ReactSelect";
import Input from "../formComponent/Input";
import {
  NursingWardBindDeceasedPatientDetail,
  NursingWardDeceasedSaveCheckList,
  NursingWardDeceasedUpdateCheckList,
} from "../../networkServices/nursingWardAPI";
import {
  notify,
  NursingWardBindDeceasedPatientDetailModified,
  NursingWardDeceasedSaveCheckListPayload,
} from "../../utils/utils";
import { OpenPDFURL } from "../../networkServices/PDFURL";
import { PrintSVG } from "../SvgIcons";
const intialState = {
  nextOfKinInformed: 0,
  propertyReturn: 0,
  dentureinPlace: 0,
  jewelleryinPlace: 0,
  isWishbyRelative: 0,
  lastOffice: 0,
  readBackbyKin: 0,
  contactBy: "",
  timeofContact: new Date(),
  dateofContact: new Date(),
  typeOfJewellery: "",
  anyOtherWish: "",
  comments: "",
  createdBy: "",
  createdDate: "",
  id: "",
};

const YESANDNO = [
  {
    label: "YES",
    value: 1,
  },
  {
    label: "NO",
    value: 0,
  },
];

const DeceasedPatientCheckList = ({ data }) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  console.log(data);

  const { transactionID, patientID } = data;

  const [payload, setPayload] = useState({
    ...intialState,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleRelectChange = (name, e) => {
    setPayload({ ...payload, [name]: e?.value });
  };

  const handleNursingWardBindDeceasedPatientDetail = async (transactionID) => {
    try {
      const responseAPI =
        await NursingWardBindDeceasedPatientDetail(transactionID);

      if (responseAPI?.data?.length > 0) {
        const modified = NursingWardBindDeceasedPatientDetailModified(
          responseAPI?.data[0]
        );

        setPayload(modified);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNursingWardDeceasedUpdateCheckList = async () => {
    try {
      const payloadResponse = NursingWardDeceasedSaveCheckListPayload(payload);
      const response = await NursingWardDeceasedUpdateCheckList({
        tid: String(transactionID),
        pid: String(patientID),
        listDTOs: [payloadResponse],
      });

      if (response?.success) {
        notify(response?.message, "success");
        handleNursingWardBindDeceasedPatientDetail(transactionID);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleNursingWardDeceasedSaveCheckList = async () => {
    try {
      const payloadResponse = NursingWardDeceasedSaveCheckListPayload(payload);
      const response = await NursingWardDeceasedSaveCheckList({
        tid: String(transactionID),
        pid: String(patientID),
        listDTOs: [payloadResponse],
      });

      if (response?.success) {
        notify(response?.message, "success");
        handleNursingWardBindDeceasedPatientDetail(transactionID);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handlePrint = () => {
    OpenPDFURL("NursingWardDeceasedPrint", transactionID);
  };

  useEffect(() => {
    handleNursingWardBindDeceasedPatientDetail(transactionID);
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Deceased Patient CheckList")}
            isBreadcrumb={false}
          />
          <div className="row p-2">
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={t("UHID")}
                value={payload?.PatientID}
                className={"mb-2"}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={t("IPD No.")}
                value={payload?.IPDNO}
                className={"mb-2"}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={t("Patient Name")}
                value={payload?.Pname}
                className={"mb-2"}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={t("DateOfBirth")}
                value={payload?.DOB}
                className={"mb-2"}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={t("Address")}
                value={payload?.address}
                className={"mb-2"}
              />
            </div>
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput
                label={t("Religion")}
                value={payload?.Religion}
                className={"mb-2"}
              />
            </div>

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("DateOfDeath")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              showTime
              value={payload?.DateofDeath}
              disable={true}
              //   value={payload?.Date}
              hourFormat="12"
            />

            <TimePicker
              placeholderName="Time"
              lable={t("TimeOfDeath")}
              disable={true}
              value={payload?.TimeofDeath}
              // value={payload?.time}
              // handleChange={handleChange}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />

            <ReactSelect
              placeholderName={t(
                "NextofKinInformed"
              )}
              className="form-control"
              id={"nextOfKinInformed"}
              name={"nextOfKinInformed"}
              searchable={true}
              dynamicOptions={YESANDNO}
              value={payload?.nextOfKinInformed}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              handleChange={handleRelectChange}
            />

            <Input
              type="text"
              className="form-control"
              id="contactBy"
              name="contactBy"
              lable={t("ContactedBy")}
              placeholder=" "
              value={payload?.contactBy}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
            />

            <TimePicker
              placeholderName="Time"
              id="timeofContact"
              name="timeofContact"
              lable={t("TimeContacted")}
              value={payload?.timeofContact}
              handleChange={handleChange}
              // value={payload?.time}
              // handleChange={handleChange}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              id="dateofContact"
              name="dateofContact"
              lable={t("DateContacted")}
              value={payload?.dateofContact}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              showTime
              handleChange={handleChange}
              //   value={payload?.Date}
              hourFormat="12"
            />

            <ReactSelect
              placeholderName={t(
                "PatientPropertyReturned"
              )}
              className="form-control"
              id={"propertyReturn"}
              name={"propertyReturn"}
              dynamicOptions={YESANDNO}
              searchable={true}
              handleChange={handleRelectChange}
              removeIsClearable={true}
              value={payload?.propertyReturn}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />

            <ReactSelect
              placeholderName={t(
                "DenturesInPlace"
              )}
              className="form-control"
              id={"dentureinPlace"}
              name={"dentureinPlace"}
              searchable={true}
              dynamicOptions={YESANDNO}
              removeIsClearable={true}
              value={payload?.dentureinPlace}
              handleChange={handleRelectChange}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />

            <ReactSelect
              placeholderName={t(
                "JewelleryInPlace"
              )}
              className="form-control"
              id={"jewelleryinPlace"}
              name={"jewelleryinPlace"}
              searchable={true}
              dynamicOptions={YESANDNO}
              value={payload?.jewelleryinPlace}
              removeIsClearable={true}
              handleChange={handleRelectChange}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              id="typeOfJewellery"
              name="typeOfJewellery"
              lable={t("TypeofJewellery")}
              placeholder=" "
              value={payload?.typeOfJewellery}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
              // onChange={handleChange}
            />

            <ReactSelect
              placeholderName={t(
                "religiousleader"
              )}
              className="form-control"
              id={"isWishbyRelative"}
              name={"isWishbyRelative"}
              dynamicOptions={YESANDNO}
              searchable={true}
              value={payload?.isWishbyRelative}
              removeIsClearable={true}
              handleChange={handleRelectChange}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              id="anyOtherWish"
              name="anyOtherWish"
              lable={t("Anyotherwishes")}
              placeholder=" "
              value={payload?.anyOtherWish}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
              // onChange={handleChange}
            />

            <ReactSelect
              placeholderName={t(
                "Lastoffice"
              )}
              className="form-control"
              id={"lastOffice"}
              name={"lastOffice"}
              searchable={true}
              dynamicOptions={YESANDNO}
              value={payload?.lastOffice}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              handleChange={handleRelectChange}
            />

            <ReactSelect
              placeholderName={t(
                "kinandfamily"
              )}
              className="form-control"
              id={"readBackbyKin"}
              name={"readBackbyKin"}
              dynamicOptions={YESANDNO}
              searchable={true}
              value={payload?.readBackbyKin}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              handleChange={handleRelectChange}
            />

            <Input
              type="text"
              className="form-control"
              id="comments"
              name="comments"
              lable={t("comments")}
              placeholder=" "
              value={payload?.comments}
              // value={payload?.directTest}
              respclass="col-xl-8 col-md-12 col-sm-12 col-12"
              onChange={handleChange}
              // onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="footer-dyamic-component">
        {payload?.id ? (
          <button
            className="btn btn-primary btn-sm mx-2"
            onClick={handleNursingWardDeceasedUpdateCheckList}
          >
           {t("Update")}
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm mx-2"
            onClick={handleNursingWardDeceasedSaveCheckList}
          >
            {t("Save")}
          </button>
        )}

        <span onClick={handlePrint}>
          {PrintSVG()}
        </span>
      </div>
    </>
  );
};

export default DeceasedPatientCheckList;
