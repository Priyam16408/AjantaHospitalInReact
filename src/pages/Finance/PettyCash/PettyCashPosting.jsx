import React, { useState, useEffect } from "react";
import Heading from "../../../components/UI/Heading";
// import {ReactSelect} from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
function PettyCashPosting() {
  const [t] = useTranslation();
  const [centerName, setCenterName] = useState([]);

  const [values, setValues] = useState({
    center: "",
    cashChart: "",
    currency: "",
  });

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const SearchCenterName = async () => {
    try {
      const response = await BindDepartmentCountDetail();
      if (response.success) {
        console.log("the department data is", response);
        setCenterName(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setCenterName([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setCenterName([]);
    }
  };

  useEffect(() => {
    SearchCenterName();
  }, []);

  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Petty Cash A/C")}
            id={"center"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                centerName,
                "Name",
                "ObservationType_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.center?.value}`}
            name={"center"}
          />

          <Input
            type="text"
            className="form-control"
            id="currency"
            placeholder=" "
            name="currency"
            value={values?.currency || ""}
            onChange={handleChange}
            lable={t("Currency")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="cashinhand"
            placeholder=" "
            name="cashinhand"
            value={values?.cashinhand || ""}
            onChange={handleChange}
            lable={t("Cash In Hand")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <DatePicker
            id="fromdate"
             className="custom-calendar"
            name="fromdate"
            lable={t("fromdate")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <DatePicker
            id="todate"
             className="custom-calendar"
            name="todate"
            lable={t("todate")}
            value={values?.todate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

     

          <Input
            type="text"
            className="form-control"
            id="entryNo"
            placeholder=" "
            name="entryNo"
            value={values?.EntryNo || ""}
            onChange={handleChange}
            lable={t("Entry No")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-lg btn-success"
              type="button"
              //   onClick={handleSearchSampleCollection}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PettyCashPosting;
