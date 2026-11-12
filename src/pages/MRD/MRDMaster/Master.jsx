import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DocumentMaster from "./DocumentMaster";
import MRDRoomCreate from "./MRDRoomCreate";
import MRDRackMaster from "./MRDRackMaster";

const MASTER_TYPE_OPTION = [
  { value: "Document", label: "Create Document Master" },
  { value: "Room", label: "Create Room Master" },
  { value: "Rack", label: "Create Rack Master" },
];

const Master = () => {
  const [t] = useTranslation();

  const [masterType, setMasterType] = useState(null);

  const handleReactChange = (name, e) => {
    setMasterType(e?.value);
  };

  const handleComponent = (name) => {
    switch (name) {
      case "Document":
        return <DocumentMaster />;
        break;
      case "Room":
        return <MRDRoomCreate />;
        break;
      case "Rack":
        return <MRDRackMaster />;
        break;
      default:
        null;
    }
  };

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("MRD Master")} isBreadcrumb={false} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("Master Type")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"masterType"}
              name={"masterType"}
              removeIsClearable={true}
              handleChange={handleReactChange}
              dynamicOptions={MASTER_TYPE_OPTION}
              value={masterType}
            />
          </div>
        </div>
      </div>

      {handleComponent(masterType)}
    </>
  );
};

export default Master;
