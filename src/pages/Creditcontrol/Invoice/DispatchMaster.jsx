import React, { useCallback, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useSelector } from "react-redux";
import {
  handleCreditControlSaveDispatchRequestBody,
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
} from "../../../utils/utils";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import {
  CreditControlSaveDispatch,
  CreditControlSearch,
} from "../../../networkServices/creditControl";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { Tooltip } from "primereact/tooltip";

const TYPE_DROPDOWN = [
  {
    label: "OPD",
    value: "OPD",
  },

  {
    label: "Emergency",
    value: "EMG",
  },

  {
    label: "IPD",
    value: "IPD",
  },
];

const DISPATCH = [
  {
    label: "Dispatched",
    value: "0",
  },
  {
    label: "NotDispatched",
    value: "1",
  },
];

const intialState = {
  billFromDate: new Date(),
  billToDate: new Date(),
  patientID: "",
  claimNo: "",
  policyNo: "",
  ipdNo: "",
  docketNo: "",
  dispatchNo: "",
  dispatchDate: "",
  panelID: "",
  type: "OPD",
  status: "1",
  cashCredit: "1",
  isCoverNote: 0,
  chkDispatchDate: false,
  DispatchDate: new Date(),
};

const DispatchMaster = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  let ip = useLocalStorage("ip", "get");

  const { getBindPanelListData } = useSelector((state) => state?.CommonSlice);



  const [payload, setPayload] = useState({
    ...intialState,
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelect = (name, e) => {
    // console.log("panelID", e)
    if (name === "panelID") {
      setPayload({
        ...payload,
        [name]: e?.value,
        isCoverNote: e?.CoverNote,
      });
    } else {
      setPayload({
        ...payload,
        [name]: e?.value,
      });
    }
  };

  const handleCreditControlSearch = async () => {
    if(!payload?.panelID){
      notify("Panel is required!","error")
      return
    }
    try {
      const response = await CreditControlSearch({
        ...payload,
        billFromDate: moment(payload?.billFromDate).format("DD-MMM-YYYY"),
        billToDate: moment(payload?.billToDate).format("DD-MMM-YYYY"),
      });

      if (response?.success) {
        const ObjData = {
          DocketNo: "",
          CourierComp: "",
          Remarks: "",
          colorcode: "#FBD6C9",
        };

        // const tableDataResponse = response?.data;
        // tableDataResponse.unshift({ ...ObjData });
        setTableData(response?.data);
      } else {
        setTableData([]);
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("SomeThing Went Wrong");
    }
  };

const handleTableRowChange = (e, index) => {
  const { name, value, type, checked } = e.target;
  const data = [...tableData];
  const isCheckbox = type === "checkbox";
  const newValue = isCheckbox ? checked : value;

  if (typeof index === "number") {
    data[index][name] = newValue;
  } else {
    // ✅ No index — update ALL rows
    data.forEach((row) => {
      row[name] = newValue;
    });
  }

  setTableData(data);
};



  const isMobile = window.innerWidth <= 800;
  const handleChangeHead = (e) => {
    const { name, value } = e?.target
    let updatedtbl = tableData?.map((val) => {
      val[name] = value
      return val
    })
    setTableData(updatedtbl)
  }
  let THEAD = [
    t("S.No."),
    {
      name: isMobile ? "Checkbox" : <input
        type="checkbox"
        name={"isChecked"}
        onChange={(e) => handleTableRowChange(e)}
        checked={tableData.every(
          (items, _) => items?.isChecked
        )}
      />
    },
    t("Dispatch Date"),
    t("UHID"),
    t("Patient Name"),
    t("Bill No."),
    t("Bill Date"),
    t("Bill Amt"),
    t("Panel Payable"),
    t("Panel Paid"),
    t("Panel Balance"),
    {
      width: "5%",
      name: isMobile ? t("Docket No.") :
        <>
          <Tooltip
            target={`#DocketNo`}
            position="top"
            content={t("Docket No.")}
            event="focus"
            className="ToolTipCustom"
          />
          <input
            type="text"
            className="table-input"
            id="DocketNo"
            placeholder={t("Docket No.")}
            name="DocketNo"
            onChange={handleChangeHead}
          />
        </>
      ,
    },
    t("Dispatch No."),
    {
      width: "5%",
      name: isMobile ? t("Courier") : <>
        <Tooltip
          target={`#Courier`}
          position="top"
          content={t("Courier")}
          event="focus"
          className="ToolTipCustom"
        />
        <input
          type="text"
          name="CourierComp"
          id="Courier"
          className="table-input"
          placeholder={t("Courier")}
          onChange={handleChangeHead}
        />
      </>,
    },
    {
      width: "5%",
      name: isMobile ? t("Remark") : <>
        <Tooltip
          target={`#Remark`}
          position="top"
          content={t("Remark")}
          event="focus"
          className="ToolTipCustom"
        />
        <input
          type="text"
          className="table-input"
          placeholder={t("Remark")}
          id="Remark"
          name="Remarks"
          onChange={handleChangeHead}
        />
      </>,
    },

  ];

  if (payload?.isCoverNote === 1) {
    THEAD.splice(2, 0,
      t("Cover Note No."),
      t("Cover Note Date"),)
  }
  if (payload?.type === "IPD") {
    let index = THEAD.findIndex((val) => val === t("Patient Name")) + 1
    THEAD.splice(index, 0, t("IPD No."), t("Addmission Date"), t("Discharge Date"))
  }

  const settleData = (items, index) => {
    const returnData = {
      SNO: null,
      isChecked: null,
      DispatchDate: null,
      UHID: null,
      PatientName: null,
      Panel: null,
      BillNo: null,
      BillDate: null,
      OPDAmount: null,
      IPDAmount: null,
      NetBillAmt: null,
      PanelPaybleAmt: null,
      PanelPaidAmt: null,
      PanelBalanceAmt: null,
      DocketNo: null,
      DispatchNo: null,
      Courier: null,
      Remarks: null,
      colorcode: null,
    };

    // index

    returnData.SNO = index + 1;

    // checkbox
    returnData.isChecked = (
      <input
        type="checkbox"
        checked={items?.isChecked}
        name="isChecked"
        onChange={(e) => handleTableRowChange(e, index)}
      />
    );


    if (payload?.isCoverNote === 1) {
      returnData.CoverNoteNo = items?.CoverNoteNo;
      returnData.CoverNoteDate = items?.CoverNoteDate;
    }

    // DispatchDate

    returnData.DispatchDate = items?.DispatchDate;

    // UHID

    returnData.UHID = items?.PatientID;


    // PatientName

    returnData.PatientName = items?.PatientName;

    if (payload?.type === "IPD") {
      returnData.TransNo = items?.TransNo;
      returnData.DateOfAdmit = items?.DateOfAdmit;
      returnData.DateOfDischarge = items?.DateOfDischarge;
    }


    // Bill No.
    returnData.BillNo = items?.BillNo;

    // BillDate
    returnData.BillDate = items?.BillDate;
    // NetBillAmt

    returnData.NetBillAmt = items?.NetBillAmt;

    // PanelAmt

    returnData.PanelPaybleAmt = items?.PanelAmt;

    // PanelPaidAmt

    returnData.PanelPaidAmt = items?.PanelPaidAmt;

    //PanelBalanceAmt
    returnData.PanelBalanceAmt = items?.OutStanding

    // DocketNo

    returnData.DocketNo = (
      <Input
        type="text"
        className="table-input"
        name={"DocketNo"}
        removeFormGroupClass={true}
        onChange={(e) => handleTableRowChange(e, index)}
        value={items?.DocketNo ?? ""}
      />
    );

    // DispatchNo

    returnData.DispatchNo = items?.Dispatch_No;

    // Courier

    returnData.Courier = (
      <Input
        type="text"
        className="table-input"
        removeFormGroupClass={true}
        name="CourierComp"
        onChange={(e) => handleTableRowChange(e, index)}
        value={items?.CourierComp ?? ""}
      />
    );

    // Remarks

    returnData.Remarks = (
      <Input
        type="text"
        className="table-input"
        name="Remarks"
        removeFormGroupClass={true}
        onChange={(e) => handleTableRowChange(e, index)}
        value={items?.Remarks ?? ""}
      />
    );

    returnData.colorcode = items?.colorcode
      ? items?.colorcode
      : items?.Dispatch_No !== ""
        ? "lightgreen"
        : "#FFB6C1";
    console.log("indexindex", Object?.keys(returnData)?.length)
    return returnData;
  };


  const handleSetData = (bodydata) => {
    let arrData = []
    bodydata.map((items, index) => {
      let returnData = {}


      returnData.SNO = index + 1;

      // checkbox
      returnData.isChecked = (
        <input
          type="checkbox"
          checked={items?.isChecked}
          name="isChecked"
          onChange={(e) => handleTableRowChange(e, index)}
        />
      );


      if (payload?.isCoverNote === 1) {
        returnData.CoverNoteNo = items?.CoverNoteNo;
        returnData.CoverNoteDate = items?.CoverNoteDate;
      }

      // DispatchDate

      returnData.DispatchDate = items?.DispatchDate;

      // UHID

      returnData.UHID = items?.PatientID;


      // PatientName

      returnData.PatientName = items?.PatientName;

      if (payload?.type === "IPD") {
        returnData.TransNo = items?.TransNo;
        returnData.DateOfAdmit = items?.DateOfAdmit;
        returnData.DateOfDischarge = items?.DateOfDischarge;
      }


      // Bill No.
      returnData.BillNo = items?.BillNo;

      // BillDate
      returnData.BillDate = items?.BillDate;
      // NetBillAmt

      returnData.NetBillAmt = items?.NetBillAmt;

      // PanelAmt

      returnData.PanelPaybleAmt = items?.PanelAmt;

      // PanelPaidAmt

      returnData.PanelPaidAmt = items?.PanelPaidAmt;

      //PanelBalanceAmt
      returnData.PanelBalanceAmt = items?.OutStanding

      // DocketNo

      returnData.DocketNo = (
        <Input
          type="text"
          className="table-input"
          name={"DocketNo"}
          removeFormGroupClass={true}
          onChange={(e) => handleTableRowChange(e, index)}
          value={items?.DocketNo ?? ""}
        />
      );

      // DispatchNo

      returnData.DispatchNo = items?.Dispatch_No;

      // Courier

      returnData.Courier = (
        <Input
          type="text"
          className="table-input"
          removeFormGroupClass={true}
          name="CourierComp"
          onChange={(e) => handleTableRowChange(e, index)}
          value={items?.CourierComp ?? ""}
        />
      );

      // Remarks

      returnData.Remarks = (
        <Input
          type="text"
          className="table-input"
          name="Remarks"
          removeFormGroupClass={true}
          onChange={(e) => handleTableRowChange(e, index)}
          value={items?.Remarks ?? ""}
        />
      );

      returnData.colorcode = items?.colorcode
        ? items?.colorcode
        : items?.Dispatch_No !== ""
          ? "lightgreen"
          : "#FFB6C1";
      arrData.push(returnData)
    })
    return arrData
  }

  // const handleTableChange = useCallback(
  //   (tableData) => {
  //     return tableData?.map((items, index) => {
  //       const {
  //         SNO,
  //         isChecked,
  //         DispatchDate,
  //         UHID,
  //         PatientName,
  //         Panel,
  //         BillNo,
  //         BillDate,
  //         OPDAmount,
  //         IPDAmount,
  //         NetBillAmt,
  //         PanelPaybleAmt,
  //         PanelPaidAmt,
  //         PanelBalanceAmt,
  //         DocketNo,
  //         DispatchNo,
  //         Courier,
  //         Remarks,
  //         colorcode,
  //         CoverNoteNo,
  //         CoverNoteDate
  //       } = settleData(items, index);
  //   //      if (payload?.isCoverNote === 1) {
  //   //   returnData.CoverNoteNo = items?.CoverNoteNo;
  //   //   returnData.CoverNoteDate = items?.CoverNoteDate;
  //   // }
  //       return {
  //         SNO,
  //         isChecked,
  //         DispatchDate,
  //         UHID,
  //         PatientName,
  //         Panel,
  //         BillNo,
  //         BillDate,
  //         OPDAmount,
  //         IPDAmount,
  //         NetBillAmt,
  //         PanelPaybleAmt,
  //         PanelPaidAmt,
  //         PanelBalanceAmt,
  //         DocketNo,
  //         DispatchNo,
  //         Courier,
  //         Remarks,
  //         colorcode,
  //       };
  //     });
  //   },
  //   [tableData]
  // );

  const handleCreditControlSaveDispatch = async () => {
    try {
      const requestBody = handleCreditControlSaveDispatchRequestBody(
        tableData,
        ip,
        payload?.DispatchDate
      );
      const response = await CreditControlSaveDispatch(requestBody);

      if (response?.success) {
        notify(response?.message, "success");
        handleCreditControlSearch();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("HeadingName")}
          isBreadcrumb={true}
        />

        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            id="billFromDate"
            name="billFromDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("BillDateFrom")}
            showTime
            hourFormat="12"
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            value={payload?.billFromDate}
            handleChange={handleChange}
          />

          <DatePicker
            className="custom-calendar"
            id="billToDate"
            name="billToDate"
            placeholder={VITE_DATE_FORMAT}
            lable={t("BillDateTo")}
            showTime
            hourFormat="12"
            value={payload?.billToDate}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            handleChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="patientID"
            name="patientID"
            lable={t("UHID")}
            placeholder=" "
            value={payload?.patientID}
            // value={payload?.contactBy}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="ipdNo"
            name="ipdNo"
            lable={t("IPD/EMGNo")}
            placeholder=" "
            value={payload?.ipdNo}
            // value={payload?.contactBy}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="docketNo"
            name="docketNo"
            lable={t("DocketNo")}
            placeholder=" "
            value={payload?.docketNo}
            // value={payload?.contactBy}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onChange={handleChange}
          />

          <ReactSelect
            placeholderName={t("Panel")}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12 required-fields"
            id={"panelID"}
            name="panelID"
            value={payload?.panelID}
            dynamicOptions={handleReactSelectDropDownOptions(
              getBindPanelListData,
              "Company_Name",
              "PanelID"
            )}
            handleChange={handleReactSelect}
          />

          <Input
            type="text"
            className="form-control"
            id="dispatchNo"
            name="dispatchNo"
            lable={t("DispatchNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={payload?.dispatchNo}
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="policyNo"
            name="policyNo"
            lable={t("PolicyNo")}
            placeholder=" "
            value={payload?.policyNo}
            // value={payload?.contactBy}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onChange={handleChange}
          />

          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <div className="d-flex">
              <input
                type="checkbox"
                className="mr-2"
                name="chkDispatchDate"
                value={payload?.chkDispatchDate}
                onChange={handleChange}
              />
              <DatePicker
                className="custom-calendar"
                id="dispatchDate"
                name="dispatchDate"
                placeholder={VITE_DATE_FORMAT}
                lable={t("DispatchDate")}
                showTime
                value={payload?.dispatchDate}
                hourFormat="12"
                respclass={"w-100"}
                handleChange={handleChange}
              />
            </div>
          </div>

          <ReactSelect
            placeholderName={t("Type")}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id={"type"}
            name="type"
            dynamicOptions={TYPE_DROPDOWN}
            value={payload?.type}
            handleChange={handleReactSelect}
          // value={payload?.vitaminKGiven}
          // removeIsClearable={true}
          // dynamicOptions={YESNODROPDOWN}
          // handleChange={handleReactSelect}
          />

          <ReactSelect
            placeholderName={t("Status")}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id={"status"}
            name="status"
            dynamicOptions={DISPATCH}
            value={payload?.status}
            handleChange={handleReactSelect}
          // value={payload?.vitaminKGiven}
          // removeIsClearable={true}
          // dynamicOptions={YESNODROPDOWN}
          // handleChange={handleReactSelect}
          />

          <Input
            type="text"
            className="form-control"
            id="claimNo"
            name="claimNo"
            lable={t("ClaimNo")}
            placeholder=" "
            value={payload?.claimNo}
            // value={payload?.contactBy}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            onChange={handleChange}
          />

          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-between">
                <ColorCodingSearch label={"Dispatched"} color="lightgreen" />
                <ColorCodingSearch label={"Not-Dispatched"} color="#FFB6C1" />
              </div>

              <div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleCreditControlSearch}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {tableData?.length > 0 && (
        <div className="patient_registration card mt-2">
          <Heading
            title={t("SearchResult")}
            isBreadcrumb={false}
          />
          <div className="row ">
            <div className="col-12">
              {/* <Tables thead={THEAD} tbody={handleTableChange(tableData)} tableHeight={"scrollView"} /> */}
              <Tables thead={THEAD} tbody={handleSetData(tableData)} tableHeight={"scrollView"} />
            </div>

            <div className="col-12 mt-2">
              <div className="d-flex aling-items-center justify-content-end">
                <div className="d-flex aling-items-center">
                  <DatePicker
                    className="custom-calendar"
                    id="DispatchDate"
                    name="DispatchDate"
                    placeholder={VITE_DATE_FORMAT}
                    lable={t(
                      "DispatchDate"
                    )}
                    showTime
                    hourFormat="12"
                    value={payload?.DispatchDate}
                    handleChange={handleChange}
                  />

                  <button
                    className="btn btn-sm btn-primary ml-2"
                    onClick={handleCreditControlSaveDispatch}
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchMaster;
