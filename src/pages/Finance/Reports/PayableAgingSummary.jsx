import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { PaybleAgingSummary } from '../../../networkServices/finance';
import { useSelector } from 'react-redux';
import Heading from '../../../components/UI/Heading';
import MultiSelectComp from '../../../components/formComponent/MultiSelectComp';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { filterByTypes, handleReactSelectDropDownOptions, notify } from '../../../utils/utils';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';


import { BindPayableGroup, BindReportControlsAPI, GetGLReport } from '../../../networkServices/finance';
import Tables from '../../../components/UI/customTable';
import { ExcelIconSVG, PDFIconSVG } from '../../../components/SvgIcons';

import { exportHtmlToPDFNoPrint, exportToExcel } from '../../../utils/exportLibrary';
import { transformDataInTranslate } from '../../../components/WrapTranslate';
import PayableTablePDF from './PayableTablePDF';
import { AutoComplete } from 'primereact/autocomplete';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';

const PayableAgingSummary = () => {
  const userData = useLocalStorage("userData", "get")

  const [t] = useTranslation()
  const [payloadData, setPayloadData] = useState({
    Currency: {
      label: "INR", value: "INR"
    },
    // BranchCentre: {

    // label: "All", value: "0"
    // },
    BranchCentre: [{ code: Number(userData?.defaultCentre ? userData?.defaultCentre : 0), name: userData?.centreName }],
    TradeType: {
      label: "All", value: "0"
    },
    AgeingType: {
      label: "Day Basis", value: "1"
    },
    COG: {
      label: "All", value: "0"
    },
    fromDate: new Date,
    toDate: new Date,
  });

  const thead = [
    { width: "1%", name: t("S.No") },
    { width: "5%", name: t("Trade Type") },
    { width: "5%", name: t("A/C Name") },
    { width: "2%", name: t("Total Inv Amt") },
    { width: "2%", name: t("Adjusted Amt") },
    { width: "2%", name: t("Pending Amount") },
    { width: "2%", name: payloadData?.AgeingType?.label == 'Day Basis' ? t("0-30") : t("1 Year") },
    { width: "2%", name: payloadData?.AgeingType?.label == 'Day Basis' ? t("31-60") : t("2 Year") },
    { width: "2%", name: payloadData?.AgeingType?.label == 'Day Basis' ? t("61-90") : t("3 Year") },
    { width: "2%", name: payloadData?.AgeingType?.label == 'Day Basis' ? t("91-120") : t("4 Year") },
    { width: "2%", name: payloadData?.AgeingType?.label == 'Day Basis' ? t("121-180") : t("5 Year") },
    { width: "2%", name: payloadData?.AgeingType?.label == 'Day Basis' ? t("Above 180") : t("5 Year Above") },

  ]
  const [bindpayble, SetBindPayable] = useState([
  ]);
  const [reportControlList, setReportControlList] = useState([])
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [tbodyData, setTbodyData] = useState([])
  const getBindReportControls = async () => {
    let apiResp = await BindReportControlsAPI()
    if (apiResp?.success) {

      setReportControlList(apiResp?.data)
    } else {
      setReportControlList([])
    }
  }

  console.log(bindpayble);


  const getBindPayableGroup = async () => {
    const apiResp = await BindPayableGroup()
    if (apiResp?.success) {

      SetBindPayable(apiResp?.data)
    } else {
      SetBindPayable([])
    }
  }



  useEffect(() => {
    getBindReportControls()
    getBindPayableGroup()
  }, [])
  const handleMultiSelectChange = (name, selectedOptions) => {
    setPayloadData({
      ...payloadData,
      [name]: selectedOptions,
    });
  };
  const handleChange = (e) => {
    setPayloadData((val) => ({ ...val, [e.target.name]: e.target.value }))
  }
  console.log(payloadData);
  
  const handleSearch = async () => {
    let missingFields = [];
    if (!payloadData?.ChartOfAC?.value) missingFields.push("Chart Of A/C");
    if (!payloadData?.Currency?.value) missingFields.push("Currency");
    if (!payloadData?.BranchCentre?.[0].name) missingFields.push("BranchCentre");


    if (missingFields.length > 0) {
      notify(` ${missingFields[0]} is Required`, "error");
      return;
    }
    let data = {
      ACFilterType: 4,
      ACFilterValue: payloadData?.ChartOfAC?.value || '',
      // CentreID:  String(payloadData.BranchCentre ? payloadData?.BranchCentre?.value : ""),
      CentreID: String(payloadData?.BranchCentre[0]?.code || ""),
      CurrencyCode: payloadData?.Currency?.value || "",
      AsOnDate: moment(payloadData?.AsOnDate).format("DD-MMM-YYYY") || '',
      AgeingType: Number(payloadData?.AgeingType?.value) || 0,
      TradeType: payloadData?.TradeType?.value || 0,
      DateFilterType: payloadData?.DateFilterType?.value || 0,
      COGCode: payloadData?.COG?.value || "",
      ReportName: "Payable Aging Summary",
    };

    let apiResp = await PaybleAgingSummary(data)
    if (apiResp.success) {
      setTbodyData(apiResp.data)
    } else {
      setTbodyData([])
      notify(apiResp?.message, "error")
    }
  }

  const getTotalRow = (data) => {

    if (!data || data.length === 0) return [];

    return data.reduce(
      (acc, val) => {
        acc["S.No"] = " ",
          acc["Trade Type"] = ''
        acc["Total Inv Amt"] = (parseFloat(acc["Total Inv Amt"] || 0) + parseFloat(val?.SpecificAmountDisplay ?? 0)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        acc["Adjusted Amt"] = (parseFloat(acc["Adjusted Amt"] || 0) + parseFloat(val?.AdjustmentSpecificAmountDisplay ?? 0)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        acc["Pending Amount"] = (parseFloat(acc["Pending Amount"] || 0) + parseFloat(val?.PendingSpecificAmountDisplay ?? 0)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        acc["1 Year"] = (parseFloat(acc["1 Year"] || 0) + parseFloat(val?.Section1 ?? 0)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        acc["2 Year"] = (parseFloat(acc["2 Year"] || 0) + parseFloat(val?.Section2 ?? 0)).toFixed(2);
        acc["3 Year"] = (parseFloat(acc["3 Year"] || 0) + parseFloat(val?.Section3 ?? 0)).toFixed(2);
        acc["4 Year"] = (parseFloat(acc["4 Year"] || 0) + parseFloat(val?.Section4 ?? 0)).toFixed(2);
        acc["5 Year"] = (parseFloat(acc["5 Year"] || 0) + parseFloat(val?.Section5 ?? 0)).toFixed(2);
        acc["5 Year Above"] = (parseFloat(acc["5 Year Above"] || 0) + parseFloat(val?.Section6 ?? 0)).toFixed(2);

        return acc;
      },
      {
        "S.No": " ",
        "Trade Type": "",
        "A/C Name": "Total:",
        "Total Inv Amt": "0.00",
        "Adjusted Amt": "0.00",
        "Pending Amount": "0.00",
        "1 Year": "0.00",
        "2 Year": "0.00",
        "3 Year": "0.00",
        "4 Year": "0.00",
        "5 Year": "0.00",
        "5 Year Above": "0.00",
        "colorcode": "color-indicator-5-bg"
      }
    );
  };

  const updatedTbodyData = [...tbodyData, getTotalRow(tbodyData)];

  const getRowClass = (val, index) => {
    let type = updatedTbodyData[index].colorcode
    if (type) {
      return type;
    } else {
      return;
    }
  }

  const handleExportExcel = async (tableData) => {
    let result = [];
    console.log(tableData);

    tableData?.map((val, index) => {
      let isLastRow = index === tableData.length - 1; // Check if it's the last row
      let currentSNo = isLastRow ? "" : String(index + 1);
      result.push({
        "S.No": currentSNo,
        "Trade Type": val["Trade Type"] || val.TradeType,
        "A/C Name": val["A/C Name"] || val.AccountName,
        "Total Inv Amt": val["Total Inv Amt"] || val.SpecificAmountDisplay.toFixed(2).toLocaleString(),
        "Adjusted Amt": val["Adjusted Amt"] || val.AdjustmentSpecificAmountDisplay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        "Pending Amount": val["Pending Amount"] || val.PendingSpecificAmountDisplay.toFixed(2),
        "1 Year": val["1 Year"] || val.Section1.toFixed(2),
        "2 Year": val["2 Year"] || val.Section2.toFixed(2),
        "3 Year": val["3 Year"] || val.Section3.toFixed(2),
        "4 Year": val["4 Year"] || val.Section4.toFixed(2),
        "5 Year": val["5 Year"] || val.Section5.toFixed(2),
        "5 Year Above": val["5 Year Above"] || val.Section6.toFixed(2),
      })
    })

    if (result) {
      exportToExcel(transformDataInTranslate(result, t), "Payable Agieing Summary");
    } else {
      notify("no Data Found", "error");
    }
  };

  const validateInvestigation = async (e, name) => {

    const { value } = e;

    if (name === "ChartOfAC") {
      value.isAccountType = true
      setPayloadData((val) => ({ ...val, ["ChartOfAC"]: value }))

    } else {


      setPayloadData((val) => ({ ...val, [name]: "" }))
    }
  };
  const [items, setItems] = useState([]);
  console.log(payloadData);

  const search = async (event, name) => {
    if (event?.query?.length > 0) {

      const results = filterByTypes(
        reportControlList,
        [4],
        ["TypeID"],
        "TextField",
        "ValueField"
      );

      if (results && results.length > 0) {
        let filterData = results.filter((val) =>
          val?.label?.toLowerCase().includes(event?.query.toLowerCase())
        );
        setItems(filterData);
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix"
      >
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.label}
        </div>
      </div>
    );
  };
  const handleExportPDF = () => {
    exportHtmlToPDFNoPrint("printSection", "Payable Ageing Report", "1000px", "landscape")
  }

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        {/* <Heading isBreadcrumb={true} /> */}
        <div className="row p-2">
          {/* <ReactSelect
            placeholderName={t("Branch Centre")}
            id="BranchCentre"
            name="BranchCentre"
            requiredClassName={`required-fields`}
            value={payloadData?.BranchCentre?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...GetEmployeeWiseCenter?.map((ele) => ({
                value: ele?.CentreID,
                label: ele?.CentreName,
              }))
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />

*/}

          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="BranchCentre"
            id="BranchCentre"
            placeholderName={t("Branch Centre")}
            // dynamicOptions={[]}
            dynamicOptions={GetEmployeeWiseCenter?.map((ele) => ({
              code: ele?.CentreID,
              name: ele?.CentreName,
            }))}
            handleChange={handleMultiSelectChange}
            value={payloadData?.BranchCentre}
            requiredClassName={`required-fields`}
          />


          <ReactSelect
            placeholderName={t("Currency")}
            id="Currency"
            name="Currency"
            requiredClassName={`required-fields`}
            value={payloadData?.Currency?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            dynamicOptions={filterByTypes(
              reportControlList,
              [1],
              ["TypeID"],
              "TextField",
              "ValueField",
            )}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <div className="col-xl-4 col-md-6 col-sm-6 col-12">
            <AutoComplete
              value={payloadData?.ChartOfAC?.label ? payloadData?.ChartOfAC?.label : payloadData?.ChartOfAC}
              suggestions={items}
              completeMethod={(e) => { search(e, "ChartOfAC") }}
              onChange={(e) => setPayloadData({ ...payloadData, ChartOfAC: e.value })}
              className="w-100 required-fields"
              onSelect={(e) => validateInvestigation(e, "ChartOfAC")}
              id="ChartOfAC"
              itemTemplate={itemTemplate}
            />
            <label
              className="label lable truncate ml-3 p-1"
              style={{ fontSize: "5px !important" }}
            >
              {t("Chart Of A/C")}

            </label>
          </div>

          {/* <ReactSelect
            placeholderName={t("Chart Of Account")}
            id="ChartOfAC"
            name="ChartOfAC"
            requiredClassName={`required-fields`}
            value={payloadData?.ChartOfAC?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            dynamicOptions={filterByTypes(
              reportControlList?.filter(option => option?.TextField?.toLowerCase().includes("abc")),
              [4],
              ["TypeID"],
              "TextField",
              "ValueField",
            )}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          /> */}
          <ReactSelect
            placeholderName={t("Ageing Type")}
            id="AgeingType"
            name="AgeingType"
            value={payloadData?.AgeingType?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            dynamicOptions={[
              { label: "Day Basis", value: "1" },
              { label: "Yearly Basis", value: "2" }
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Date Type")}
            id="DateType"
            name="DateType"
            value={payloadData?.DateType?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            dynamicOptions={[
              { label: "Voucher Date", value: "1" },
              { label: "Bill Date", value: "2" }
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Trade Type")}
            id="TradeType"
            name="TradeType"
            value={payloadData?.TradeType?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            dynamicOptions={[
              { label: "All", value: "0" },
              { label: "Trade", value: "1" },
              { label: "Non Trade", value: "2" },
              { label: "Other", value: "3" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <DatePicker
            requiredClassName={`required-fields`}

            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("As On")}
            respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
            id="AsOnDate"
            name="AsOnDate"
            maxDate={new Date()}
            value={payloadData?.AsOnDate ? moment(payloadData.AsOnDate).toDate() : new Date}
            showTime
            hourFormat="12"
            handleChange={(date) => handleChange(date, "toDate")}
          />

          <ReactSelect
            placeholderName={t("Chart Of Group")}
            id="COG"
            name="COG"
            value={payloadData?.COG?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            // dynamicOptions={[
            //   { label: "All", value: "0" },
            //   { label: "Suppliers", value: "2001001001" },
            //   { label: "Tax Payable", value: "2001001002" },
            // ]}
            dynamicOptions={[{ value: "0", label: "ALL" }, ...handleReactSelectDropDownOptions(bindpayble, "GroupName", "GroupCode")]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <div className="col-xl-1 col-md-1 col-sm-2 col-3  mb-2">
            <button className="btn btn-sm btn-primary  w-100   " onClick={handleSearch} type="button" >
              {t("Search")}
            </button>
          </div>
        </div>
        {tbodyData?.length > 0 &&
          <div id='printSection'>
            <Heading title={payloadData?.BranchCentre[0] ? payloadData?.BranchCentre[0].name : ""}
              secondTitle={(<>
                {/* <div className="p-8">
                  <PayableTablePDF
                    theadData={thead}
                    tableData={updatedTbodyData}
                    filename={"Payable Ageing Summary"}
                    heading={"Payable Ageing Summary"}
                  />
                </div> */}
                <span onClick={handleExportPDF} className='no-print'>
                  <PDFIconSVG />
                </span>

                <span onClick={() => handleExportExcel(updatedTbodyData)} className='no-print'>
                  <ExcelIconSVG />{" "}
                </span>

              </>)} />

            <Tables
              thead={thead}
              tbody={updatedTbodyData?.map((val, index) => {
                return {
                  "S.No": val["S.No"] ? val["S.No"] : index + 1,
                  "Trade Type": val["Trade Type"] || val.TradeType,
                  "A/C Name": val["A/C Name"] || val.AccountName,
                  "Total Inv Amt": val["Total Inv Amt"] || val.SpecificAmountDisplay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "Adjusted Amt": val["Adjusted Amt"] || val.AdjustmentSpecificAmountDisplay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "Pending Amount": val["Pending Amount"] || val.PendingSpecificAmountDisplay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "1 Year": val["1 Year"] || val.Section1.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  "2 Year": val["2 Year"] || val.Section2.toFixed(2),
                  "3 Year": val["3 Year"] || val.Section3.toFixed(2),
                  "4 Year": val["4 Year"] || val.Section4.toFixed(2),
                  "5 Year": val["5 Year"] || val.Section5.toFixed(2),
                  "5 Year Above": val["5 Year Above"] || val.Section6.toFixed(2),
                }
              })}
              getRowClass={getRowClass}
            />
          </div>}
      </div>
    </div>
  )
}

export default PayableAgingSummary;