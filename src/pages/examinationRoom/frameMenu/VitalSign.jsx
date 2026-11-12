import React, { useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import DatePicker from "@app/components/formComponent/DatePicker";
import LabeledInput from "@app/components/formComponent/LabeledInput";
import noImange from "../../../assets/image/avatar.gif"




const VitalSign = () => {
  const [t] = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab((prevActiveTab) => (prevActiveTab === index ? null : index));
  };
  return (
    <>
      <div className="row p-2 mb-3">
        <div className="col-1">
          <div className="row">
            <div className="col-md-12 ">
              <img
                src={noImange}
                className="emp-img"
                alt="Responsive image"
              />
            </div>
          </div>
        </div>
        <div className="col-md-11 col-sm-12 mt-3">
          <div className="row">
            <div className="col-2 my-2">
              <LabeledInput label={"Patient Name"} value={"Priyam Singh "} />
            </div>
            <div className="col-1 my-2">
              <LabeledInput label={"Gender"} value={"Female"} />
            </div>
            <div className="col-1 my-2">
              <LabeledInput label={"Age"} value={"24"} />
            </div>
            <div className="col-2 my-2">
              <LabeledInput label={"App. Date/No"} value={"13/05/2024"} />
            </div>
            <div className="col-2 my-2">
              <LabeledInput label={"Corrent Doctor"} value={"Self"} />
            </div>
            <div className="col-1 my-2">
              <LabeledInput label={"UHID"} value={"pat/03/27"} />
            </div>
            <div className="col-1 my-2">
              <LabeledInput label={"Panel"} value={"xyz"} />
            </div>
            <div className="col-2 my-2">
              <LabeledInput
                label={"Purpose of Visit"}
                value={"Medical Checkup"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <button className="btn btn-sm btn-primary">
                Triage Room OUT
              </button>
            </div>
            <div className="col-sm-2">
              <button className="btn btn-sm btn-primary">Back to Search</button>
            </div>
          </div>
        </div>
      </div>
      <Heading title={t("Vital Examination")} />
      <div className="row">
        <div className="col-md-2">
          <div className="tabs">
            <button
              onClick={() => handleTabClick(0)}
              className={activeTab === 0 ? "active" : ""}
            >
              Others
            </button>
            {activeTab === 0 && (
              <ul className="tab-list">
                <li>Vital Sign</li>
                <li>Allergy</li>
                <li>others</li>
                <li>others</li>
              </ul>
            )}
            <br />
            <button
              onClick={() => handleTabClick(1)}
              className={activeTab === 1 ? "active" : ""}
            >
              Forms
            </button>
            {activeTab === 1 && (
              <ul className="tab-list">
                <li>Flowsheet</li>
              </ul>
            )}
          </div>
        </div>
        <div className="col-sm-10">
          <VitalSign />
        </div>
      </div>
    </>
  );
};

export default VitalSign;
