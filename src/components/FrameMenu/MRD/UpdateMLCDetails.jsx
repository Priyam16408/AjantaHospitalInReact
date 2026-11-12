import React, { useEffect, useState } from "react";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../formComponent/DatePicker";
import TimePicker from "../../formComponent/TimePicker";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import {
  MRDBindDetails,
  MRDMLCDetailUpdate,
} from "../../../networkServices/MRDApi";
import moment from "moment";
import { notify, parseTimeString } from "../../../utils/utils";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";

const MLCTYPEOPTIONS = [
  { value: "Select", label: "Select" },
  { value: "0", label: "RTA" },
  { value: "Poisoining", label: "Poisoning" },
  { value: "Burns", label: "Burns" },
  { value: "Hanging", label: "Hanging" },
  { value: "Assaults", label: "Assaults" },
];

const UpdateMLCDetails = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const [payload, setPayload] = useState({
    accidentDate: new Date(),
    mlcTime: new Date(),
    accLocation: "",
    mlcNo: "",
    mlcType: "Select",
    pcNo: "",
    others: "",
    broughtby: "",
  });

  const handleMRDMLCDetailUpdate = async () => {
    store.dispatch(setLoading(true));
    try {
      const response = await MRDMLCDetailUpdate({
        ...payload,
        accidentDate: moment(payload?.accidentDate).format("DD-MM-YYYY"),
        mlcTime: moment(payload?.accidentDate).format("hh:mm"),
        tid: String(data?.transactionID),
      });

      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) handleMRDBindDetails(data?.transactionID);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelectChange = (name, e) => {
    setPayload({
      ...payload,
      [name]: e?.value,
    });
  };

  const handleMRDBindDetails = async (TID) => {
    try {
      const response = await MRDBindDetails(TID);

      if (response?.success) {
        const res = response?.data[0];
        const obj = {
          accidentDate: new Date(res?.Acc_date),
          mlcTime: new Date(parseTimeString(res?.Acc_time)),
          accLocation: res?.Acc_location,
          mlcNo: res?.MLC_NO,
          mlcType: res?.MLC_Type,
          pcNo: res?.Acc_PCNo,
          others: res?.Cas_reason,
          broughtby: res?.BroughtBy,
        };
        setPayload(obj);
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    handleMRDBindDetails(data?.transactionID);
  }, [data]);

  return (
    <div>
      <Heading title={t("Update MLC Details")} isBreadcrumb={false} />
      <div className="card  patient_registration_card ">
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("MLC Date")}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            name="accidentDate"
            id="accidentDate"
            value={payload?.accidentDate}
            showTime
            hourFormat="12"
            handleChange={handleChange}
          />

          <TimePicker
            placeholderName="Time"
            lable={t("MLC Time")}
            id="mlcTime"
            name="mlcTime"
            value={payload?.mlcTime}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleChange}
          />

          <Input
            type="text"
            name="mlcNo"
            onChange={handleChange}
            id="mlcNo"
            lable={t("MLC No")}
            value={payload?.mlcNo}
            placeholder=""
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            className={`form-control`}
          />

          <ReactSelect
            searchable={true}
            name={"mlcType"}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            dynamicOptions={MLCTYPEOPTIONS}
            placeholderName={"MLC Type"}
            handleChange={handleReactSelectChange}
            value={payload?.mlcType}
            removeIsClearable={true}
          />

          <Input
            type="text"
            name="pcNo"
            onChange={handleChange}
            id="pcNo"
            lable={t("PC No.")}
            placeholder=""
            value={payload?.pcNo}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            className={`form-control`}
          />

          <Input
            type="text"
            name="accLocation"
            onChange={handleChange}
            id="accLocation"
            lable={t("Location")}
            placeholder=""
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            className={`form-control`}
            value={payload?.accLocation}
          />

          <Input
            type="text"
            name="broughtby"
            onChange={handleChange}
            id="broughtby"
            lable={t("Brought By")}
            placeholder=""
            value={payload?.broughtby}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            className={`form-control`}
          />

          <Input
            type="text"
            name="others"
            value={payload?.others}
            onChange={handleChange}
            id="others"
            lable={t("Others")}
            placeholder=""
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            className={`form-control`}
          />

          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleMRDMLCDetailUpdate}
            >
              Update MLC Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMLCDetails;
