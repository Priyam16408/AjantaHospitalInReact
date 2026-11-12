import React from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import SampleCollRoomMasterTable from "../../components/UI/customTable/TokenManagement/SampleCollRoomMasterTable";

const SampleCollRoomMaster = () => {
  const [t] = useTranslation();
  return (
    <>
      <div className="card pt-2 ">
        <form className="patient_registration">
          <Heading isBreadcrumb={true} />
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
            <ReactSelect
              placeholderName={t("Centre")}
              id={"Centre"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <Input
              type="text"
              className="form-control"
              id="RoomName"
              name="RoomName"
              lable={t("RoomName")}
              placeholder=" "
              required={true}
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
            />
            <ReactSelect
              placeholderName={t("RoomType")}
              id={"RoomType"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <div className="col-xl-1 col-md-2 col-sm-6 col-12">
              <button className="btn btn-sm btn-primary ml-2" type="button">
                {t("Save")}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="pt-1">
        <form className="patient_registration card">
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
            <ReactSelect
              placeholderName={t("RoomName")}
              id={"RoomName"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("TokenGroup")}
              id={"TokenGroup"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <div className="col-xl-1.5 col-md-2 col-sm-6 col-12">
              <button className="btn btn-sm btn-primary ml-2" type="button">
                {t("SaveMapping")}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="pt-1 spatient_registration_card">
        <form className="patient_registration card">
          <SampleCollRoomMasterTable />
        </form>
      </div>
    </>
  );
};

export default SampleCollRoomMaster;
