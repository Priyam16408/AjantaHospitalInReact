import React, { useState } from "react";
import DatePicker from "../../components/formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import Button from "../../components/formComponent/Button";
import { bindDietSchedularApi } from "../../networkServices/DietApi";
import moment from "moment";
import { notify } from "../../utils/ustil2";

function DietSchedular() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleCallDietSchedule = async () => {
    if (!selectedDate) {
      notify("error", "Please select a date");
      return;
    }
    const payload = {
      CurrentDate: moment(selectedDate).format("YYYY-MM-DD"),
    };
    try {
      const res = await bindDietSchedularApi(payload)
      if (res.success) {
        notify(res?.message, "success");
        setSelectedDate(new Date())
      } else {
        notify(res.message, "error");
      }
    } catch (error) {
      console.error("Error fetching diet schedule:", error);
      notify(error?.message, "error");
    }
  };

  return (
    <div className="mt-2 card">
      <Heading isBreadcrumb={true} />
      <div className="row p-2">
        <DatePicker
          id="fromDate"
          className="custom-calendar"
          name="fromDate"
          lable={t("FromDate")}
          value={new Date(selectedDate)}
          handleChange={handleChange}
          maxDate={new Date()}
          respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        />

        <Button name={"Diet Schedule"} className="btn btn-primary" handleClick={handleCallDietSchedule} />
      </div>
    </div>
  );
}

export default DietSchedular;
