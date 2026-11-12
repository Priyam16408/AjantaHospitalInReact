import React, { useMemo, useState } from "react";
import DatePicker from "../../formComponent/DatePicker";
import Button from "../../formComponent/Button";
import { BindInvestigation } from "../../../networkServices/opdserviceAPI";
import Tables from "../../UI/customTable";
import moment from "moment/moment";
import ColorCodingSearch from "../../commonComponents/ColorCodingSearch"
import { useTranslation } from "react-i18next";

function CPOEModal({ singlePatientData, handlegetCheckedData }) {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation()
  const [payload, setPayload] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    tableData: [],
  });

  const handleBindInvestigation = async (payload) => {
    try {
      const data = await BindInvestigation(payload);
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleBindInvestigationOnCLick = async () => {
    const response = await handleBindInvestigation({
      patientId: singlePatientData?.PatientID,
      fromDate: moment(payload?.fromDate).format("DD-MM-YYYY"),
      toDate: moment(payload?.toDate).format("DD-MM-YYYY"),
      condition: "CPOE Prescription",
    });

    setPayload({ ...payload, tableData: response });
  };

  const handleChecked = (e, index) => {
    const { name, checked } = e.target;
    const tableData = [...payload?.tableData];
    tableData[index][name] = checked;
    handlegetCheckedData(tableData);
    setPayload({ ...payload, tableData });
  };

  const settleValue = (row, index) => {
    const tableData = {
      All: null,
      SNo: null,
      Type: null,
      ItemName: null,
      Quantity: null,
      OutSource: null,
      Remarks: null,
    };

    // All

    tableData.All = (
      <input
        type="checkbox"
        checked={row?.isChecked}
        name="isChecked"
        onChange={(e) => {
          handleChecked(e, index);
        }}
        disabled={row?.IsOutSource === 1}
      />
    );

    // SNo
    tableData.SNo = <div>{index + 1}</div>;

    // Type
    tableData.Type = <div>{row?.LabType}</div>;

    // ItemName
    tableData.ItemName = <div>{row?.Typename}</div>;

    // Quantity
    tableData.Quantity = <div>{row?.Quantity}</div>;

    // OutSource

    tableData.OutSource = <div>{row?.IsOutSource === 0 ? "No" : "Yes"}</div>;

    // Remarks

    tableData.Remarks = <div>{row?.Remarks}</div>;

    return tableData;
  };

  const tableBody = useMemo(() => {
    return payload?.tableData?.map((row, index) => {
      const { All, SNo, Type, ItemName, Quantity, OutSource, Remarks } =
        settleValue({ ...row, isChecked: row?.isChecked ?? false }, index);
      return {
        All,
        SNo,
        Type,
        ItemName,
        Quantity,
        OutSource,
        Remarks,
      };
    });
  }, [payload?.tableData]);

  const handleChange = (e) => {
    const { checked } = e?.target
    let list = payload?.tableData?.map((val) => {
      
      if(!val?.IsOutSource){
        val.isChecked = checked
        return val
      }
      else{
        val.isChecked = false
        return val
      }
        
    })
    setPayload((val) => ({ ...val, ['tableData']: list }))
    handlegetCheckedData(list);
  }
  const THEAD = [
    {
      name: <>
        <input type="checkbox" onChange={handleChange} />
      </>
    },
    t("S.no"),
    t("Type"),
    t("Item Name"),
    t("Quantity"),
    t("OutSource"),
    t("Remarks")
  ];

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const getRowClass = (val, index) => {
    if (payload?.tableData[index]?.IsIssue === 1) {
      return "statusDocOut"
    }
  }

  return (
    <div>
      <div className="row">
        <DatePicker
          className="custom-calendar"
          id="DOB"
          name="fromDate"
          lable={t("fromDate")}
          placeholder={VITE_DATE_FORMAT}
          respclass={"col-xl-3 col-md-4 col-sm-6 col-12"}
          value={payload?.fromDate}
          handleChange={searchHandleChange}
        />
        <DatePicker
          className="custom-calendar"
          id="toDate"
          name="toDate"
          lable={t("toDate")}
          placeholder={VITE_DATE_FORMAT}
          respclass={"col-xl-3 col-md-4 col-sm-6 col-12"}
          value={payload?.toDate}
          handleChange={searchHandleChange}
        />

        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
          <div className="form-group">
            <Button
              name={t("Search")}
              className={"btn btn-sm  btn-primary"}
              handleClick={handleBindInvestigationOnCLick}
            />
          </div>
        </div>
        <ColorCodingSearch color={"#c6eea7"} label={t("Done Investigation")} />

      </div>
      {tableBody.length > 0 && (
        <div>
          <Tables thead={THEAD} tbody={tableBody} getRowClass={getRowClass} />
        </div>
      )}
    </div>
  );
}

export default CPOEModal;
