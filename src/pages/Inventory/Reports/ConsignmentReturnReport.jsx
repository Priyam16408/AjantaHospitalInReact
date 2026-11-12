import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { BindSupplier } from "../../../networkServices/BillingsApi";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const ConsignmentReturnReport = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const initialState = {
    ConsignmentNo: "",
    ReturnNo: "",
    fromDate: new Date(),
    toDate: new Date(),
    SupplierID: "",
  };
  const localdata = useLocalStorage("userData", "get");
  const [payload, setPayload] = useState({ ...initialState });
  console.log("Payload", payload);

  const handleChange = (e) => {
    const [value, name] = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setPayload((val) => ({ ...val, [label]: value }));
  };
  const handleReactSelect = (name, value) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value?.value,
    }));
  };
  const [supplier, setSupplier] = useState([]);
  const getBindSupplier = async () => {
    try {
      const response = await BindSupplier();
      setSupplier(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = async () => {
    const TransNo = payload?.IPDNo ? payload?.IPDNo : "";
    const PatientName = payload?.pName ? payload?.pName : "";
    const Dept = localdata?.deptLedgerNo;
    try {
      const response = await consignmentReturnSearch(
        TransNo,
        PatientName,
        Dept
      );
      setTableData(response?.data || []);
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  useEffect(() => {
    getBindSupplier();
  }, []);
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            id="ConsignmentNo"
            name="ConsignmentNo"
            value={payload?.ConsignmentNo}
            onChange={(e) => handleInputChange(e, 0, "ConsignmentNo")}
            lable={t("Consignment No.")}
            placeholder=" "
            respclass="col-xl-2 col-sm-6 col-md-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="ReturnNo"
            name="ReturnNo"
            value={payload?.ReturnNo}
            // onChange={handleChange}
            onChange={(e) => handleInputChange(e, 0, "ReturnNo")}
            lable={t("Return No.")}
            placeholder=" "
            respclass="col-xl-2 col-sm-6 col-md-4 col-12"
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={payload}
            setValues={setPayload}
            max={payload?.toDate}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={payload}
            setValues={setPayload}
            max={new Date()}
            min={payload?.fromDate}
          />
          <ReactSelect
            placeholderName={t("Supplier")}
            id={"SupplierID"}
            searchable={true}
            respclass="col-xl-2 col-sm-6 col-md-4 col-12"
            name={"SupplierID"}
            dynamicOptions={supplier?.map((ele) => ({
              label: ele?.LedgerName,
              value: ele?.LedgerNumber,
            }))}
            value={payload?.SupplierID}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Item")}
            id={"itemID"}
            searchable={true}
            respclass="col-xl-2 col-sm-6 col-md-4 col-12"
            name={"itemID"}
            dynamicOptions={supplier?.map((ele) => ({
              label: ele?.LedgerName,
              value: ele?.LedgerNumber,
            }))}
            value={payload?.itemID}
            handleChange={handleReactSelect}
          />
          <div className="col-sm-1">
            <button className="btn btn-sm btn-success" onClick={handleSearch}>
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsignmentReturnReport;
