import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../UI/Heading";
import VitalSign from "./VitalSign";
import LabeledInput from "../../formComponent/LabeledInput";
import noImange from "../../../assets/image/avatar.gif"


const VitalExaminationModal = () => {
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
          {/* <table className="vitalTable">
            <tbody>
              <tr>
                <td className="vital_item">Patient Name :</td>
                <td className="blue_theme .nav-item">sjdhuejo</td>
                <td className="vital_item">Gender :</td>
                <td className="blue_theme .nav-item">Female</td>
                <td className="vital_item">Age :</td>
                <td className="blue_theme .nav-item">22</td>
                <td className="vital_item">App. Date/No :</td>
                <td className="blue_theme .nav-item">10/05/2024</td>
              </tr>
              <tr>
                <td className="vital_item">Corrent Doctor :</td>
                <td className="blue_theme .nav-item">kjhjda</td>
                <td className="vital_item">UHID:</td>
                <td className="blue_theme .nav-item">dfhkf/00/22</td>
                <td className="vital_item">Panel :</td>
                <td className="blue_theme .nav-item">asz/004/333</td>
                <td className="vital_item">Purpose of Visit :</td>
                <td className="blue_theme .nav-item">sdfdf</td>
              </tr>
            </tbody>
          </table> */}
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

export default VitalExaminationModal;
