import React from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";

const DoctorwiseAppsummary = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const records = [
    { id: 1, name: "Alice Johnson", label: "Software Engineer" },
    { id: 2, name: "Bob Smith", label: "Data Scientist" },
    { id: 3, name: "Charlie Brown", label: "Product Manager" },
    { id: 4, name: "David Wilson", label: "UX Designer" },
    { id: 5, name: "Eva Davis", label: "Marketing Specialist" },
    { id: 6, name: "Frank Miller", label: "Sales Executive" },
    { id: 7, name: "Grace Lee", label: "Human Resources" },
    { id: 8, name: "Hannah White", label: "Project Coordinator" },
    { id: 9, name: "Ian Clark", label: "Business Analyst" },
    { id: 10, name: "Jane Thompson", label: "Customer Support" },
    { id: 11, name: "Kevin Martinez", label: "Operations Manager" },
    { id: 12, name: "Laura Taylor", label: "Financial Analyst" },
    { id: 13, name: "Michael Anderson", label: "Network Administrator" },
    { id: 14, name: "Nina Harris", label: "Content Writer" },
    { id: 15, name: "Oscar Roberts", label: "Graphic Designer" },
    { id: 16, name: "Paula Moore", label: "Technical Support" },
    { id: 17, name: "Quincy Young", label: "Quality Assurance" },
    { id: 18, name: "Rachel King", label: "Legal Advisor" },
  ];
  return (
    <>
      <div className="m-2 spatient_registration_card">
        <form className="patient_registration card">
          <Heading isBreadcrumb={true} />
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
              id="fromDate"
              name="fromDate"
              lable={t("fromDate")}
              placeholder={VITE_DATE_FORMAT}
              showTime={true}
              hourFormat="12"
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2.5s col-md-3 col-sm-4 col-12"
              id="toDate"
              name="toDate"
              lable={t("toDate")}
              placeholder={VITE_DATE_FORMAT}
              showTime={true}
              hourFormat="12"
            />
            <ReactSelect
              placeholderName={t("DoctorGroup")}
              id={"DoctorGroup"}
              searchable={true}
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />
            <Input
              type="checkbox"
              className="custom_checkbox"
              id="IncludePackage"
              name="IncludePackage"
              lable={t("IncludePackage")}
              placeholder=" "
              required={true}
              respclass="col-xl-2 col-md-2 col-sm-3 col-4"
            />
          </div>
          <div className="row p-2">
            <Input
              type="checkbox"
              className="custom_checkbox"
              id="Centre"
              name="Centre"
              lable={t("Centre")}
              placeholder=" "
              required={true}
              respclass="col-xl-1 col-md-2 col-sm-3 col-4"
            />

            {records?.map((data) => {
              if (data?.id < 8) {
                return (
                  <>
                    <Input
                      type="checkbox"
                      className="custom_checkbox"
                      id={data?.name}
                      name={data?.name}
                      lable={t(data?.name)}
                      placeholder=" "
                      required={true}
                      respclass="col-xl-1 col-md-2 col-sm-3 col-4"
                    />
                  </>
                );
              }
            })}
          </div>
          <div className="box-inner text-center mb-2">
            <button className="btn btn-sm btn-primary" type="button">
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DoctorwiseAppsummary;
