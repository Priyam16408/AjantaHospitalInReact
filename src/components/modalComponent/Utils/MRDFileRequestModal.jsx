import React, { useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { MRDSaveMRDRequisition, MRDSaveMRDReturnFile } from "../../../networkServices/MRDApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { notify } from "../../../utils/utils";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";


const DAYS_DROPDOWN = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
  { label: "13", value: "13" },
  { label: "14", value: "14" },
  { label: "15", value: "15" },
  { label: "16", value: "16" },
  { label: "17", value: "17" },
  { label: "18", value: "18" },
  { label: "19", value: "19" },
  { label: "20", value: "20" },
  { label: "21", value: "21" },
  { label: "22", value: "22" },
  { label: "23", value: "23" },
  { label: "24", value: "24" },
  { label: "25", value: "25" },
  { label: "26", value: "26" },
  { label: "27", value: "27" },
  { label: "28", value: "28" },
  { label: "29", value: "29" },
  { label: "30", value: "30" },
  { label: "31", value: "31" },
];

const TIME_DROPDOWN = [
  { label: "00", value: "00" },
  { label: "01", value: "01" },
  { label: "02", value: "02" },
  { label: "03", value: "03" },
  { label: "04", value: "04" },
  { label: "05", value: "05" },
  { label: "06", value: "06" },
  { label: "07", value: "07" },
  { label: "08", value: "08" },
  { label: "09", value: "09" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
  { label: "13", value: "13" },
  { label: "14", value: "14" },
  { label: "15", value: "15" },
  { label: "16", value: "16" },
  { label: "17", value: "17" },
  { label: "18", value: "18" },
  { label: "19", value: "19" },
  { label: "20", value: "20" },
  { label: "21", value: "21" },
  { label: "22", value: "22" },
  { label: "23", value: "23" },
];

const MRDFileRequestModal = ({ data, handleModalSave, payloadData }) => {
  console.log("datadatadata", data)

  const [t] = useTranslation();
  const INPUT_CHECKBOX = [
    {
      label: t("Soft Copy"),
      name: "softCopy",
      secondName: "hardCopy",
    },
    {
      label: t("Hard Copy"),
      name: "hardCopy",
      secondName: "softCopy",
    },
  ];

  const ip = useLocalStorage("ip", "get");

  const [payload, setPayload] = useState({
    hardCopy: 0,
    softCopy: 1,
    returnDays: "1",
    returnHours: "00",
    remarks: "",
  });

  const handleChecked = (e, secondName) => {
    const { name, checked } = e.target;
    setPayload({
      ...payload,
      [name]: Number(checked),
      [secondName]: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactChange = (name, e, key) => {
    setPayload({
      ...payload,
      [name]: e?.[key],
    });
  };

  const handleMRDSaveMRDRequisition = async () => {
    store.dispatch(setLoading(true));
    // console.log("data0000000000000000000000000000000",payloadData)
    // debugger
    if (payloadData?.fileType === "1") {
      try {
        const requestBody = {
          mrNo: String(data?.Patient_ID),
          mrdFileID: String(data?.FileID),
          hardCopy: String(payload?.hardCopy),
          ipdno: String(data?.Transaction_ID),
          returnDays: String(payload?.returnDays),
          returnHours: String(payload?.returnHours),
          remarks: String(payload?.remarks),
        };
        const response = await MRDSaveMRDReturnFile(requestBody);
        notify(response?.message, response?.success ? "success" : "error");
        if (response?.success) handleModalSave();
      } catch (error) {
        console.log(error, "SomeThing Went Wrong");
      } finally {
        store.dispatch(setLoading(false));
      }
    }
   else{
    try {
      const requestBody = {
        mrNo: String(data?.Patient_ID),
        ipdno: String(data?.Transaction_ID),
        mrdFileID: String(data?.FileID),
        hardCopy: String(payload?.hardCopy),
        softCopy: String(payload?.softCopy),
        returnDays: String(payload?.returnDays),
        returnHours: String(payload?.returnHours),
        remarks: String(payload?.remarks),
        ipAddress: String(ip),
      };
      const response = await MRDSaveMRDRequisition(requestBody);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) handleModalSave();
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div
          className="pt-3 pb-2 pr-2 pl-2 form-group"
          style={{
            border: "1px solid #ced4da",
            borderRadius: "4px",
            position: "relative",
          }}
        >
          <label className="label" style={{ position: "absolute" }}>
            {t("Document Type")}
          </label>
          <div className="row">
            {INPUT_CHECKBOX?.map((row, index) => (
              <div className="col-6" key={index}>
                <input
                  type="checkbox"
                  name={row?.name}
                  id={row?.name}
                  className="mx-1"
                  checked={payload[row?.name]}
                  onChange={(e) => handleChecked(e, row?.secondName)}
                  disabled={data?.IsIssued==="1"?true:false}
                />
                <label htmlFor={row?.name} className="m-0">
                  {row?.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div
          className="pt-3 pb-2 pr-2 pl-2 form-group"
          style={{
            border: "1px solid #ced4da",
            borderRadius: "4px",
            position: "relative",
          }}
        >
          <label className="label" style={{ position: "absolute" }}>
            {t("Average Return Time")}
          </label>
          <div className="row">
            <ReactSelect
              placeholderName={t("Days")}
              searchable={true}
              respclass="col-6"
              id={"returnDays"}
              name={"returnDays"}
              isDisabled={data?.IsIssued==="1"?true:false}
              removeIsClearable={true}
              requiredClassName={"required-fields"}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={DAYS_DROPDOWN}
              value={payload?.returnDays}
            />

            <ReactSelect
              placeholderName={t("Hours")}
              searchable={true}
              respclass="col-6"
              id={"returnHours"}
              name={"returnHours"}
              removeIsClearable={true}
              isDisabled={data?.IsIssued==="1"?true:false}
              handleChange={(name, e) => handleReactChange(name, e, "value")}
              dynamicOptions={TIME_DROPDOWN}
              value={payload?.returnHours}
            />
          </div>
        </div>
      </div>

      <TextAreaInput
        respclass={"col-12"}
        rows={3}
        lable={t("Remarks")}
        name={"remarks"}
        className={"required-fields"}
        value={payload?.remarks}
        onChange={handleChange}
      />

      <div className="col-12 d-flex align-items-center justify-content-end">
        <button
          className="btn btn-sm btn-primary"
          onClick={handleMRDSaveMRDRequisition}
        >
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default MRDFileRequestModal;
