import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import TextAreaInput from "../formComponent/TextAreaInput";
import Tables from "../UI/customTable";
import {
  NursingWardBindDetails,
  NursingWardNursingDischargeDeleting,
  NursingWardNursingDischargeSave,
} from "../../networkServices/nursingWardAPI";
import { notify, NursingWardDischargePayload } from "../../utils/utils";

const NursesDischargeNote = ({data}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const {transactionID,patientID} = data

  // const NURSEDISCHARGETHEAD = [
  //   "S.No",
  //   "Date",
  //   "Discharge Advice",
  //   "Issue Items",
  //   "Next Visit",
  //   "Entry By",
  //   "Remove",
  // ];
  const NURSEDISCHARGETHEAD = [
    t("S.No"),
    t("Date"),
    t("Discharge Advice"),
    t("Issue Items"),
    t("Next Visit"),
    t("Entry By"),
    t("Remove"),
  ];
  

  const [payload, setPayload] = useState({
    Date: new Date(),
    nextVisit: new Date(),
    DisChargeAdvice: "",
    IssueItems: "",
    transactionID:String(transactionID),
    patientID:patientID
    
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleIndicator = (state) => {
    return (
      <div className="text-danger">
       {t("max 200 Charcter")} <span className="text-dark">{t("Remaining")} : </span>{" "}
        <span className="text-success">{Number(200 - state?.length)}</span>
      </div>
    );
  };

  const handleNursingWardBindDetails = async (transactionID) => {
    try {
      const data = await NursingWardBindDetails(transactionID);
      setTableData(data?.data);
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleTbody = (tbody) => {
    return tbody.map((items, index) => {
      return {
        SNO: index + 1,
        Date: items?.DATE,
        DischargeAdvice: items?.ProgressNote,
        IssueItems: items?.Issueitem,
        NextVisit: items?.NextVisit,
        EntryBy: items?.EntryBy,
        Remove: (
          <i
            className="fa fa-trash text-danger text-center"
            onClick={() => {
              handleRemove(items?.ID, items?.UserID);
            }}
          >
            
          </i>
        ),
      };
    });
  };

  const handleNursingWardNursingDischargeSave = async () => {
    try {
      const apiPayload = NursingWardDischargePayload(payload);
      const data = await NursingWardNursingDischargeSave(apiPayload);
      if (data?.success) {
        handleNursingWardBindDetails(String(transactionID));
        setPayload({
          Date: new Date(),
          nextVisit: new Date(),
          DisChargeAdvice: "",
          IssueItems: "",
        });
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleRemove = async (id, UserID) => {
    try {
      const data = await NursingWardNursingDischargeDeleting({
        userID: String(UserID),
        id: String(id),
      });
      if (data?.success) {
        handleNursingWardBindDetails(String(transactionID));
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      console.log("SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    handleNursingWardBindDetails(String(transactionID));
  }, []);
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Nurses Discharge Note")}
          isBreadcrumb={false}
        />

        <div className="row p-2">
          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <DatePicker
              className="custom-calendar"
              lable={t("Date")}
              respclass={"mb-2"}
              value={payload?.Date}
              maxDate={new Date()}
              removeFormGroupClass={true}
              id="Date"
              name="Date"
              placeholder={VITE_DATE_FORMAT}
              showTime
              hourFormat="12"
              handleChange={(e) => handleChange(e)}
            />

            <DatePicker
              className="custom-calendar"
              lable={t("Next Visit")}
              value={payload?.nextVisit}
              removeFormGroupClass={true}
              id="nextVisit"
              name="nextVisit"
              placeholder={VITE_DATE_FORMAT}
              minDate={new Date()}
              showTime
              hourFormat="12"
              handleChange={(e) => handleChange(e)}
            />

            <div className="my-2">
              <button
                className="btn btn-sm btn-success w-100"
                type="button"
                onClick={handleNursingWardNursingDischargeSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>

          <div className="col-xl-5 col-md-4 col-sm-4 col-12">
            <TextAreaInput
              lable={t("DisCharge Advice")}
              className="w-100"
              placeholder={""}
              id="DisChargeAdvice"
              rows={4}
              name="DisChargeAdvice"
              value={payload?.["DisChargeAdvice"]}
              onChange={(e) => handleChange(e)}
              maxLength={200}
            />
            {handleIndicator(payload?.["DisChargeAdvice"])}
          </div>
          <div className="col-xl-5 col-md-5 col-sm-4 col-12">
            <TextAreaInput
              lable={t("Issue Items")}
              placeholder=""
              className="w-100"
              name="IssueItems"
              value={payload?.["IssueItems"]}
              onChange={(e) => handleChange(e)}
              rows={4}
              maxLength={200}
            />
            {handleIndicator(payload?.["IssueItems"])}
          </div>
        </div>
      </div>

      <div className="patient_registration card">
        <Heading
          title={t("Details")}
          isBreadcrumb={false}
        />
        <Tables thead={NURSEDISCHARGETHEAD} tbody={handleTbody(tableData)} />
      </div>
    </div>
  );
};

export default NursesDischargeNote;
