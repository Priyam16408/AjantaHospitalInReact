import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import ReactSelect from "../formComponent/ReactSelect";
import Input from "../formComponent/Input";
import {
  NursingWardBindGraphTemp,
  NursingWardSerumBilirubinSave,
} from "../../networkServices/nursingWardAPI";
import {
  notify,
  NursingWardSerumBilirubinSavePayload,
  parseTimeString,
} from "../../utils/utils";

const initialValues = {
  gestationType: "",
  tid: "41",
  pid: "AM24-05100001",
  dob: new Date(),
  time: new Date(),
  babyBG: "",
  motherBG: "",
  directTest: "",
};

const GESTATION_DROPDOWN = [
  {
    label: "30 Weeks",
    value: "30",
  },
  {
    label: "35 Weeks",
    value: "35",
  },
  {
    label: ">=38 Weeks",
    value: "38",
  },
];

const NICUSerumBilirubinCharts = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const [payload, setPayload] = useState({
    ...initialValues,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelect = (name, e) => {
    setPayload({ ...payload, [name]: e?.value });
  };

  const handleNursingWardSerumBilirubinSave = async () => {
    try {
      const responsePayload = NursingWardSerumBilirubinSavePayload(payload);
      const response = await NursingWardSerumBilirubinSave(responsePayload);
      if (response?.success) {
        notify(response?.message, "success");
        handleNursingWardBindGraphTemp("41");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleNursingWardBindGraphTemp = async (transactionID) => {
    try {
      const response = await NursingWardBindGraphTemp(transactionID);

      if (response?.data?.length > 0) {
        const data = response?.data[0];

        const setResponse = {
          gestationType: String(data?.WeeksGestation),
          tid: payload?.tid,
          pid: payload?.pid,
          dob: new Date(data?.DateofBirth),
          time: parseTimeString(data?.TimeofBirth),
          babyBG: data?.BabyBloodGroup,
          motherBG: data?.MotherBloodGroup,
          directTest: data?.DirectTest,
        };

        setPayload(setResponse);
      } else {
        setPayload({ ...initialValues });
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  useEffect(() => {
    handleNursingWardBindGraphTemp("41");
  }, []);
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Baby Details")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            id="dob"
            name="dob"
            placeholder={VITE_DATE_FORMAT}
            value={payload?.dob}
            lable={t("DateofBirth")}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            handleChange={handleChange}
            showTime
            hourFormat="12"
          />
          <TimePicker
            placeholderName="Time"
            lable={t("TimeofBirth")}
            id="time"
            name="time"
            value={payload?.time}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t(
              "Gestation"
            )}
            className="form-control"
            id={"gestationType"}
            name={"gestationType"}
            searchable={true}
            dynamicOptions={GESTATION_DROPDOWN}
            value={payload?.gestationType}
            handleChange={handleReactSelect}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="directTest"
            name="directTest"
            lable={t(
              "DirectAntiglobulinTest"
            )}
            placeholder=" "
            value={payload?.directTest}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="babyBG"
            name="babyBG"
            lable={t("BabyBloodGroup")}
            value={payload?.babyBG}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="motherBG"
            name="motherBG"
            lable={t("MotherBloodGroup")}
            value={payload?.motherBG}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
        </div>
      </div>
      <div className="patient_registration card mt-1 p-1">
        <div className="text-right">
          <button
            className="btn btn-sm btn-primary mx-2"
            onClick={handleNursingWardSerumBilirubinSave}
          >
          {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NICUSerumBilirubinCharts;
