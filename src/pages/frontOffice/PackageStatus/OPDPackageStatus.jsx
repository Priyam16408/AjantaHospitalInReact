import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Input from "@app/components/formComponent/Input";
import DatePicker from "@app/components/formComponent/DatePicker";
import { getBindPanelList } from "../../../store/reducers/common/CommonExportFunction";
import {
  PACKAGE_STATUS_PAYLOAD,
  PackageStatus,
  RECEIPT_REPRINT_PAYLOAD,
  SEARCHBY,
  statusType,
} from "../../../utils/constant";
import { Tabfunctionality } from "../../../utils/helpers";
import { ReceiptDetailnew } from "../../../networkServices/opdserviceAPI";
import ReceiptReprintTable from "../../../components/UI/customTable/ReprintTable/ReceiptReprintTable";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { notify } from "../../../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import OPDPackageStatusTable from "./OPDPackageStatusTable";

const OPDPackageStatus = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [formValues, setFormValues] = useState(PACKAGE_STATUS_PAYLOAD);
  const [bodyData, setBodyData] = useState([]);
  const [panelData, setPanelData] = useState([]);

  const THEAD = [
    t("Reg.No."),
    t("Patient_Name"),
    t("Address"),
    t("Receipt No"),
    t("Bill_No"),
    t("Date"),
    t("Transaction_Type"),
    t("Amount"),
    t("Close"),
    t("Summary"),
    t("EsiOPDBill"),
  ];

  const dispatch = useDispatch();

  const { getBindPanelListData } = useSelector((state) => state.CommonSlice);
  console.log("getBindPanelListData", getBindPanelListData);

  useEffect(() => {
    dispatch(getBindPanelList({ PanelGroup: "ALL" }));
  }, []);

  const formattedPanelList = getBindPanelListData?.map((item) => ({
    label: item.Company_Name,
    value: item.PanelID,
  }));
   
  console.log("formValues", formValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setFieldValue = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    SearchBillPrintAPI();
  };

  console.log(bodyData, "bodyData");

  const SearchBillPrintAPI = async () => {
    const newValues = {
      ...formValues,
      fromDate: moment(formValues?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(formValues?.toDate).format("DD-MMM-YYYY"),
      receiptNo: formValues?.receiptNo,
      billNo: formValues?.billNo,
      patientName: formValues?.patientName,
      patientID: formValues?.patientID,
      rblCon: formValues?.rblCon?.value,
      PrintType: formValues?.PrintType,
    }
    
    try {
      const dataResponse = await ReceiptDetailnew(newValues);
      if (dataResponse?.success) {
        let data = dataResponse?.data?.map((val) => {
          val.IsAllowedOriginalPrint =
            val.IsAllowedOriginalPrint === "true" ? false : true;
          val.IsAllowedOriginalPrintValue = false;
          val.PrintType = formValues?.PrintType;
          return val;
        });
        setBodyData(data);
      } else {
        notify(dataResponse?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
    SearchBillPrintAPI();
  };

  const handleCustomSelect = (index, name, value) => {
    const updatedData = bodyData?.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    console.log("updatedData", updatedData[index], value);
    setBodyData(updatedData);
  };

  return (
    <>





    
      <form
        className="card patient_registration border"
        onSubmit={handleSubmit}
      >
        <div className="py-2">
          <Heading title={t("OPD PACKAGE STATUS ")} />
        </div>

        <div className="row  g-4 m-2">
          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            handleChange={handleChange}
            value={
              formValues.fromDate
                ? moment(formValues?.fromDate, "DD-MMM-YYYY").toDate()
                : formValues?.fromDate
            }
            lable={t("FromDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            handleChange={handleChange}
            value={
              formValues.toDate
                ? moment(formValues?.toDate, "DD-MMM-YYYY").toDate()
                : formValues?.toDate
            }
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
          />
          <ReactSelect
            placeholderName={t("Package Status")}
            id={"packageStatus"}
            name={"packageStatus"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formValues?.packageStatus}
            dynamicOptions={PackageStatus}
            handleChange={handleReactSelect}
          />

          <ReactSelect
            placeholderName={t("Statustype")}
            id={"Statustype"}
            name={"Statustype"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formValues?.Statustype}
            dynamicOptions={statusType}
            handleChange={handleReactSelect}
          />

          <ReactSelect
            placeholderName={t("Panel")}
            id={"Panel"}
            name={"Panel"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            value={formValues.Panel}
            dynamicOptions={formattedPanelList}
            handleChange={handleReactSelect}
          />

          <Input
            type="text"
            className="form-control"
            id="registerNo"
            name="registerNo"
            onChange={handleChange}
            value={formValues?.registerNo}
            lable={t("Registration")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onKeyDown={Tabfunctionality}
          />

          <div className="col-2 mt-2">
            <button className="btn btn-sm btn-info" onClick={handleSubmit}>
              {t("Search")}
            </button>
            <button className="btn btn-sm btn-info mx-3" onClick={handleSubmit}>
              {t("Report")}
            </button>
          </div>
        </div>
      </form>

      <div className="card patient_registration_card my-1 mt-2">
        <OPDPackageStatusTable
          THEAD={THEAD}
          tbody={bodyData}
          setBodyData={setBodyData}
          setFieldValue={setFieldValue}
          values={formValues}
          handleCustomSelect={handleCustomSelect}
        />
      </div>




      
    </>
  );
};





export default OPDPackageStatus;
