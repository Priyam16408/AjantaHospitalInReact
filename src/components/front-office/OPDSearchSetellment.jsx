import React, { useState } from "react";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import { Tabfunctionality } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import TestAddingTable from "../UI/customTable/frontofficetables/TestAddingTable";
export default function OPDSearchSetellment() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  return (
    <>
      <div className="row p-2">
        <div className="col-12 ">
          <div className="row">
            <Input
              type="text"
              className="form-control "
              id="Barcode"
              name="barcode"
              lable={t("FrontOffice.OPD.OPDSetellment.label.Barcode/UHID")}
              placeholder=" "
              //   required={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={Tabfunctionality}
            />

            <Input
              type="text"
              className="form-control "
              id="Visit_ID"
              name="barcode"
              lable={t("FrontOffice.OPD.OPDSetellment.label.Bill_No")}
              placeholder=" "
              //   required={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              onKeyDown={Tabfunctionality}
            />

            <ReactSelect
              placeholderName={t("FrontOffice.OPD.OPDSetellment.label.Panel")}
              id={"Title"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              // className={"required-fields"}
              // required={true}
              onKeyDown={Tabfunctionality}
            />

            <Input
              type="number"
              className="form-control"
              id="Mobile_No"
              name="MobileNo"
              lable={t("FrontOffice.OPD.OPDSetellment.label.Mobile_No")}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              id="DOB"
              name="DOB"
              lable={t("FrontOffice.OPD.OPDSetellment.label.FromDate")}
              placeholder={VITE_DATE_FORMAT}
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              id="DOB"
              name="DOB"
              lable={t("FrontOffice.OPD.OPDSetellment.label.ToDate")}
              placeholder={VITE_DATE_FORMAT}
            />
            <ReactSelect
              placeholderName={"Center"}
              id={"Title"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
              // className={"required-fields"}
              // required={true}
              onKeyDown={Tabfunctionality}
            />

            <button className="btn btn-sm btn-primary">Search</button>
          </div>
        </div>
      </div>
      <TestAddingTable />
    </>
  );
}
