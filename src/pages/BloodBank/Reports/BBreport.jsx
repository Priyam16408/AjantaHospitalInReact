import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import Input from "../../../components/formComponent/Input";
import {
  BindBloodGroup,
  BindComponent,
  BloodBankBloodBankReportBloodCollectionReport,
  BloodBankBloodBankReportBloodCollectionSearch,
  BloodBankBloodBankReportBloodCrossMatchReport,
  BloodBankBloodBankReportBloodCurrentStockReport,
  BloodBankBloodBankReportBloodCurrentStockSearch,
  BloodBankBloodBankReportBloodGroupingReport,
  BloodBankBloodBankReportBloodGroupingSearch,
  BloodBankBloodBankReportComponentDetailReport,
  BloodBankBloodBankReportComponentDetailSearch,
  BloodBankBloodBankReportDiscardBloodReport,
  BloodBankBloodBankReportDiscardBloodSearch,
  BloodBankBloodBankReportDonorProcessBloodReport,
  BloodBankBloodBankReportDonorProcessSearch,
} from "../../../networkServices/BloodBank/BloodBank";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { getBindCenterAPI } from "../../../networkServices/EDP/karanedp";
import { RedirectURL } from "../../../networkServices/PDFURL";
import moment from "moment";
import { notify } from "../../../utils/ustil2";
import Tables from "../../../components/UI/customTable";

const BBreport = () => {
  const [t] = useTranslation();
  const initialValues = {
    BagNo: "",
    CollFromDate: new Date(),
    CollToDate: new Date(),
    CollectionID: "",
    DiscFromDate: new Date(),
    DiscToDate: new Date(),
    DonorID: "",
    DonorName: "",
    UHID: "",
    ipdNo: "",
    reportName: { label: "Blood Issue Detail", value: "0" },
    Type: { label: "ALL", value: "ALL" },
    Report: { label: "Issue", value: "1" },
    IssueFromDate: new Date(),
    IssueToDate: new Date(),
    FromDate: new Date(),
    ToDate: new Date(),
    componentName: "",
  };
  const [values, setValues] = useState({ ...initialValues });
  const [bloodGroupingTableData, setBloodGroupingTableData] = useState([]);
  const [bloodCollectionTableData, setBloodCollectionTableData] = useState([]);
  const [bloodCurrentStockTableData, setBloodCurrentStockTableData] = useState(
    []
  );
  const [donorProcessTableData, setDonorProcessTableData] = useState([]);
  const [componentDetailTableData, setComponentDeatailTableData] = useState([]);

  const [dropDownState, setDropDownState] = useState({});

  const GroupingReportThead = [
    { name: "S.No." },
    { name: "Collection ID" },
    { name: "AnitA" },
    { name: "AnitB" },
    { name: "AnitAB" },
    { name: "RH" },
    { name: "Tested BG" },
    { name: "ACell" },
    { name: "BCell" },
    { name: "OCell" },
    { name: "Serum's BG" },
    { name: "Created Date" },
  ];
  const CollectionReportThead = [
    { name: "S.No." },
    { name: "Donor ID" },
    { name: "Collection ID" },
    { name: "Name" },
    { name: "Tube No." },
    { name: "Volume" },
    { name: "Collection Date" },
    { name: "Blood Group" },
  ];
  const CurrentStockReportThead = [
    { name: "S.No.", width: "1%" },
    { name: "Centre Name" },
    { name: "Collection ID" },
    { name: "Component Name" },
    { name: "Tube No." },
    { name: "Entry Date" },
    { name: "Expiry Date" },
  ];
  const DonorRecordReportThead = [
    { name: "S.No." },
    { name: "Collection Date" },
    { name: "Expiry Date" },
    { name: "Prep. Date" },
    { name: "Donor Name" },
    { name: "Relation" },
    { name: "Contact No." },
    { name: "Address" },
    { name: "Age" },
    { name: "Sex" },
    { name: "Blood Group" },
    // { name: "Qty" },
    { name: "HIV12" },
    { name: "HBsAg" },
    { name: "HCV" },
    { name: "VDRL" },
    { name: "MP" },
    { name: "IrgAntibodies" },
    { name: "Component Name" },
    { name: "Issue Voucher" },
    { name: "Patient Name" },
    { name: "Issue Date" },
  ];

  const BloodComponentReportThead = [
    { name: "S.No." },
    { name: "Collection ID" },
    { name: "Component Name" },
    { name: "Bag Type" },
    { name: "Created By" },
    { name: "Created Date" },
  ];

  const TypeOptions = [
    { label: "OPD", value: "OPD" },
    { label: "IPD", value: "IPD" },
    { label: "EMG", value: "EMG" },
    { label: "ALL", value: "ALL" },
  ];
  const StoreTypeOptions = [
    { label: "Medical Store", value: "STO00001" },
    { label: "General Store", value: "STO00002" },
  ];
  const ReportTypeOptions = [
    { label: "PDF", value: "PDF" },
    { label: "Excel", value: "Excel" },
  ];
  const ReportOptions = [
    { label: "Issue", value: "1" },
    { label: "Return", value: "2" },
    { label: "All", value: "3" },
  ];

  const handleReactSelect = (name, value) => {
    if (name === "reportName") {
      setValues(initialValues);
      setBloodGroupingTableData([]);
      setBloodCollectionTableData([]);
      setBloodCurrentStockTableData([]);
      setComponentDeatailTableData([]);
      setDonorProcessTableData([]);

      setValues((val) => {
        return {
          ...val,
          [name]: value,
        };
      });
    }
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };
  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const getBindBloodGroup = async () => {
    try {
      const data = await BindBloodGroup();
      return data?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const handleBindComponent = async () => {
    try {
      const apiResp = await BindComponent();
      return apiResp?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const handlegetBindCenterAPI = async () => {
    try {
      const response = await getBindCenterAPI();
      return response?.data;
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const FetchAllDropdown = async () => {
    try {
      const [bloodGroupData, componentData, bindCenterData] = await Promise.all(
        [getBindBloodGroup(), handleBindComponent(), handlegetBindCenterAPI()]
      );

      const dropDownData = {
        bloodGroup: handleReactSelectDropDownOptions(
          bloodGroupData,
          "bloodgroup",
          "id"
        ),
        component: handleReactSelectDropDownOptions(
          componentData,
          "ComponentName",
          "id"
        ),
        bindCenter: handleReactSelectDropDownOptions(
          bindCenterData,
          "CentreName",
          "CentreID"
        ),
      };

      setDropDownState(dropDownData);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const handleReport = async () => {
    if (values?.reportName?.value === "0") {
      // const payload = {
      //   bloodCollectionID: values?.CollectionID,
      //   datefrom: moment(values?.FromDate).format("DD-MMM-YYYY"),
      //   dateTo: moment(values?.ToDate).format("DD-MMM-YYYY"),
      // };
      // const response =
      //   await BloodBankBloodBankReportBloodGroupingSearch(payload); //pending
      // RedirectURL(response?.data);
    } else if (values?.reportName?.value === "1") {
      const payload = {
        bloodCollectionID: values?.CollectionID,
        datefrom: moment(values?.FromDate).format("DD-MMM-YYYY"),
        dateTo: moment(values?.ToDate).format("DD-MMM-YYYY"),
      };
      const response =
        await BloodBankBloodBankReportBloodGroupingReport(payload);
      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "2") {
      const payload = {
        donorId: values?.DonorID ? values?.DonorID : "",
        collectionID: values?.CollectionID ? values?.CollectionID : "",
        name: values?.donorName ? values?.donorName : "",
        bloodgroup: values?.bloodGroup?.value ? values?.bloodGroup?.value : "",
        datefrom: moment(values?.FromDate).format("DD-MMM-YYYY") || new Date(),
        dateTo: moment(values?.ToDate).format("DD-MMM-YYYY") || new Date(),
      };
      const response =
        await BloodBankBloodBankReportBloodCollectionReport(payload);

      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "3") {
      if (!values?.Center) {
        notify("Please select center", "error");
        return;
      }
      const payload = {
        collectionID: values?.CollectionID,
        bagType: "All",
        tubeNo: values?.BagNo,
        componentName: values?.componentName?.value ?? "",
        chkDate: false,
        collectionFrom: moment(values?.CollFromDate).format("DD-MMM-YYYY"),
        collectionTo: moment(values?.CollToDate).format("DD-MMM-YYYY"),
        centerDtos:
          values?.Center?.map((item) => ({
            center: String(item?.code),
          })) ?? [],
      };

      const response =
        await BloodBankBloodBankReportBloodCurrentStockReport(payload);
      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "4") {
      const payload = {
        centreId: values?.Center?.map((item) => item?.code),
        fromDate: moment(values?.DiscFromDate).format("DD-MMM-YYYY"),
        toDate: moment(values?.DiscToDate).format("DD-MMM-YYYY"),
      };
      const response =
        await BloodBankBloodBankReportDiscardBloodReport(payload);
      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "5") {
      const payload = {
        donorId: values?.DonorID,
        name: values?.DonorName,
        bloodgroup: values?.BloodGroup?.value ?? "All",
        datefrom: moment(values?.FromDate).format("DD-MMM-YYYY"),
        dateTo: moment(values?.ToDate).format("DD-MMM-YYYY"),
      };

      const response =
        await BloodBankBloodBankReportDonorProcessBloodReport(payload);
      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "6") {
      const payload = {
        collectionID: values?.CollectionID,
        collectionFrom: moment(values?.CollFromDate).format("YYYY-MM-DD"),
        collectionTo: moment(values?.CollToDate).format("YYYY-MM-DD"),
      };
      const response =
        await BloodBankBloodBankReportComponentDetailReport(payload);
      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "8") {
      const payload = {
        uhid: values?.UHID,
        ipdNo: values?.ipdNo,
        name: values?.Name,
        bloodGroup: values?.BloodGroup?.value ?? 0,
        datefrom: moment(values?.FromDate).format("DD-MMM-YYYY"),
        dateTo: moment(values?.ToDate).format("DD-MMM-YYYY"),
      };

      const response =
        await BloodBankBloodBankReportBloodCrossMatchReport(payload);
      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    }
  };

  const handleSearch = async () => {
    if (values?.reportName?.value === "1") {
      const payload = {
        bloodCollectionID: values?.CollectionID,
        datefrom: moment(values?.FromDate).format("DD-MMM-YYYY"),
        dateTo: moment(values?.ToDate).format("DD-MMM-YYYY"),
      };
      const response =
        await BloodBankBloodBankReportBloodGroupingSearch(payload);
      if (response?.success) {
        setBloodGroupingTableData(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "2") {
      const payload = {
        donorId: values?.DonorID,
        collectionID: values?.CollectionID,
        name: values?.DonorName,
        bloodgroup: values?.BloodGroup?.label ?? "",
        datefrom: moment(values?.FromDate).format("DD-MMM-YYYY"),
        dateTo: moment(values?.ToDate).format("DD-MMM-YYYY"),
      };
      const response =
        await BloodBankBloodBankReportBloodCollectionSearch(payload);
      if (response?.success) {
        setBloodCollectionTableData(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "3") {
      if (values?.Center?.length === 0) {
        return notify("Please select center", "error");
      }
      const payload = {
        collectionID: values?.CollectionID,
        bagType: "All",
        tubeNo: values?.BagNo,
        componentName: values?.componentName?.value ?? "",
        chkDate: false,
        collectionFrom: moment(values?.CollFromDate).format("DD-MMM-YYYY"),
        collectionTo: moment(values?.CollToDate).format("DD-MMM-YYYY"),
        centerDtos:
          values?.Center?.map((item) => ({
            center: String(item?.code),
          })) ?? [],
      };
      const response =
        await BloodBankBloodBankReportBloodCurrentStockSearch(payload);
      if (response?.success) {
        setBloodCurrentStockTableData(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "4") {
      const payload = {
        centreId: values?.Center?.map((item) => item?.code),
        fromDate: moment(values?.FromDate).format("DD-MMM-YYYY"),
        toDate: moment(values?.ToDate).format("DD-MMM-YYYY"),
      };
      const response =
        await BloodBankBloodBankReportDiscardBloodSearch(payload);
      if (response?.success) {
        // setDiscardz
      }
    } else if (values?.reportName?.value === "5") {
      const payload = {
        donorId: values?.DonorID,
        name: values?.DonorName,
        bloodgroup: values?.BloodGroup?.label ?? "All",
        datefrom: moment(values?.FromDate).format("DD-MMM-YYYY"),
        dateTo: moment(values?.ToDate).format("DD-MMM-YYYY"),
      };
      const response =
        await BloodBankBloodBankReportDonorProcessSearch(payload);
      if (response?.success) {
        setDonorProcessTableData(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } else if (values?.reportName?.value === "6") {
      const payload = {
        collectionID: values?.CollectionID,
        collectionFrom: moment(values?.CollFromDate).format("YYYY-MM-DD"),
        collectionTo: moment(values?.CollToDate).format("YYYY-MM-DD"),
      };
      const response =
        await BloodBankBloodBankReportComponentDetailSearch(payload);
      if (response?.success) {
        setComponentDeatailTableData(response?.data);
      } else {
        notify(response?.message, "error");
      }
    }
  };

  useEffect(() => {
    FetchAllDropdown();
  }, []);

  return (
    <div className="mt-2 card">
      <Heading title={"Blood Bank Report"} isBreadcrumb={true} />
      <Heading title={values?.reportName?.label} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Report Name")}
          name="reportName"
          value={values?.reportName?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Blood Issue Detail", value: "0" },
            { label: "Blood Grouping Detail", value: "1" },
            { label: "Blood Collection Detail", value: "2" },
            { label: "Blood Current Stock", value: "3" },
            { label: "Blood Discarded Details", value: "4" },
            { label: "Blood Donor Record", value: "5" },
            { label: "Component Detail", value: "6" },
            { label: "Cross Match Report", value: "8" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {["0", "3"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Component Name")}
            name="componentName"
            value={values?.componentName?.value}
            handleChange={handleReactSelect}
            dynamicOptions={[
              { label: "ALL", value: "all" },
              ...(dropDownState?.component || []),
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {["0"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="Type"
            name="Type"
            removeIsClearable={true}
            dynamicOptions={TypeOptions}
            handleChange={handleReactSelect}
            value={values?.Type?.value}
          />
        )}
        {["0"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Report")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="Report"
            name="Report"
            removeIsClearable={true}
            dynamicOptions={ReportOptions}
            handleChange={handleReactSelect}
            value={values?.Report?.value}
          />
        )}
        {["0"].includes(values?.reportName?.value) && (
          <>
            <DatePicker
              id="IssueFromDate"
              width
              name="IssueFromDate"
              lable={t("Issue From Date")}
              value={values?.IssueFromDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
              maxDate={values?.toDate}
            />
            <DatePicker
              id="IssueToDate"
              width
              name="IssueToDate"
              lable={t("Issue To Date")}
              value={values?.IssueToDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
            />
          </>
        )}
        {["0", "4", "3", "9", "10"].includes(values?.reportName?.value) && (
          <MultiSelectComp
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="Center"
            id="Center"
            placeholderName={t("Center")}
            dynamicOptions={dropDownState?.bindCenter?.map((ele, i) => ({
              name: ele?.CentreName,
              code: ele?.CentreID,
            }))}
            handleChange={handleMultiSelectChange}
            value={values?.Center}
          />
        )}
        {["1", "2", "3", "6"].includes(values?.reportName?.value) && (
          <Input
            type="number"
            className={"form-control "}
            lable={t("Collection ID")}
            placeholder=" "
            name="CollectionID"
            onChange={(e) => handleInputChange(e, 0, "CollectionID")}
            value={values?.CollectionID}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {["1", "2", "5", "7", "8", "10"].includes(
          values?.reportName?.value
        ) && (
          <>
            <DatePicker
              id="FromDate"
              width
              name="FromDate"
              lable={t("From Date")}
              value={values?.FromDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
              maxDate={values?.toDate}
            />
            <DatePicker
              id="ToDate"
              width
              name="ToDate"
              lable={t("To Date")}
              value={values?.ToDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
            />
          </>
        )}
        {["2", "5", "7"].includes(values?.reportName?.value) && (
          <Input
            type="number"
            className={"form-control "}
            lable={t("Donor ID")}
            placeholder=" "
            name="DonorID"
            onChange={(e) => handleInputChange(e, 0, "DonorID")}
            value={values?.DonorID}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {values?.reportName?.value === "3" && (
          <Input
            type="text"
            className={"form-control "}
            lable={t("Bag No.")}
            placeholder=" "
            name="BagNo"
            onChange={(e) => handleInputChange(e, 0, "BagNo")}
            value={values?.BagNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {["2", "5", "7"].includes(values?.reportName?.value) && (
          <Input
            type="text"
            className={"form-control "}
            lable={t("Donor Name")}
            placeholder=" "
            name="DonorName"
            onChange={(e) => handleInputChange(e, 0, "DonorName")}
            value={values?.DonorName}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {values?.reportName?.value === "8" && (
          <Input
            type="text"
            className={"form-control "}
            lable={t("UHID")}
            placeholder=" "
            name="UHID"
            onChange={(e) => handleInputChange(e, 0, "UHID")}
            value={values?.UHID}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {values?.reportName?.value === "8" && (
          <Input
            type="text"
            className={"form-control "}
            lable={t("IPD No.")}
            placeholder=" "
            name="ipdNo"
            onChange={(e) => handleInputChange(e, 0, "ipdNo")}
            value={values?.ipdNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {values?.reportName?.value === "8" && (
          <Input
            type="text"
            className={"form-control "}
            lable={t("Name")}
            placeholder=" "
            name="Name"
            onChange={(e) => handleInputChange(e, 0, "Name")}
            value={values?.Name}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}
        {["2", "5", "7", "8"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Blood Group")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="BloodGroup"
            name="BloodGroup"
            removeIsClearable={true}
            dynamicOptions={dropDownState?.bloodGroup}
            handleChange={handleReactSelect}
            value={values?.BloodGroup?.value}
          />
        )}
        {["9", "10"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Store Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="StoreType"
            name="StoreType"
            removeIsClearable={true}
            dynamicOptions={StoreTypeOptions}
            handleChange={handleReactSelect}
            value={values?.StoreType?.value}
          />
        )}
        {["9", "10"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Department")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="department"
            name="department"
            removeIsClearable={true}
            dynamicOptions={[]}
            handleChange={handleReactSelect}
            value={values?.department?.value}
          />
        )}
        {["9", "10"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Report Format")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="reportFormat"
            name="reportFormat"
            removeIsClearable={true}
            dynamicOptions={ReportTypeOptions}
            handleChange={handleReactSelect}
            value={values?.reportFormat?.value}
          />
        )}
        {["9", "10"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Groups")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="groups"
            name="groups"
            removeIsClearable={true}
            dynamicOptions={[]}
            handleChange={handleReactSelect}
            value={values?.groups?.value}
          />
        )}
        {["9", "10"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Sub Groups")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="subGroups"
            name="subGroups"
            removeIsClearable={true}
            dynamicOptions={[]}
            handleChange={handleReactSelect}
            value={values?.subGroups?.value}
          />
        )}
        {["9", "10"].includes(values?.reportName?.value) && (
          <ReactSelect
            placeholderName={t("Items")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="Items"
            name="Items"
            removeIsClearable={true}
            dynamicOptions={[]}
            handleChange={handleReactSelect}
            value={values?.Items?.value}
          />
        )}
        {values?.reportName?.value === "9" && (
          <ReactSelect
            placeholderName={t("Report Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="reportDataType"
            name="reportDataType"
            removeIsClearable={true}
            dynamicOptions={[
              { label: "Detail", value: "Detail" },
              { label: "Summary", value: "Summary" },
            ]}
            handleChange={handleReactSelect}
            value={values?.reportDataType?.value}
          />
        )}
        {values?.reportName?.value === "10" && (
          <ReactSelect
            placeholderName={t("Consume Type")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="consumeType"
            name="consumeType"
            removeIsClearable={true}
            dynamicOptions={[
              { label: "ALL", value: "0" },
              { label: "Consume", value: "C" },
              { label: "Gather", value: "G" },
            ]}
            handleChange={handleReactSelect}
            value={values?.consumeType?.value}
          />
        )}
        {values?.reportName?.value === "9" && (
          <ReactSelect
            placeholderName={t("Include Zero Stock")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="includeZeroStock"
            name="includeZeroStock"
            removeIsClearable={true}
            dynamicOptions={[
              {
                label: "Yes",
                value: "1",
              },
              {
                label: "No",
                value: "0",
              },
            ]}
            handleChange={handleReactSelect}
            value={values?.includeZeroStock?.value}
          />
        )}
        {["3", "6"].includes(values?.reportName?.value) && (
          <>
            <DatePicker
              id="CollFromDate"
              width
              name="CollFromDate"
              lable={t("Collection From Date")}
              value={values?.CollFromDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
              maxDate={values?.toDate}
            />
            <DatePicker
              id="CollToDate"
              width
              name="CollToDate"
              lable={t("Collection To Date")}
              value={values?.CollToDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
            />
          </>
        )}
        {values?.reportName?.value === "4" && (
          <>
            <DatePicker
              id="DiscFromDate"
              width
              name="DiscFromDate"
              lable={t("Disc. From Date")}
              value={values?.DiscFromDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
              maxDate={values?.toDate}
            />
            <DatePicker
              id="DiscToDate"
              width
              name="DiscToDate"
              lable={t("Disc. To Date")}
              value={values?.DiscToDate || new Date()}
              handleChange={handleChange}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              className="custom-calendar"
            />
          </>
        )}
        {["1", "2", "3", "4", "5", "6", "7"].includes(
          values?.reportName?.value
        ) && (
          <button className="btn btn-success ml-2" onClick={handleSearch}>
            {t("Search")}
          </button>
        )}
        <button className="btn btn-success ml-2 mb-2" onClick={handleReport}>
          {t("Report")}
        </button>
        {bloodGroupingTableData?.length > 0 && (
          <Tables
            thead={GroupingReportThead}
            tbody={bloodGroupingTableData?.map((ele, i) => {
              return {
                SrNo: i + 1,
                collectionID: ele?.bloodCollection_Id,
                antiA: ele?.antiA,
                antiB: ele?.antiB,
                antiAB: ele?.antiAB,
                rh: ele?.rh,
                bloodTested: ele?.bloodTested,
                aCell: ele?.aCell,
                bCell: ele?.bCell,
                oCell: ele?.oCell,
                bloodGroupAlloted: ele?.bloodGroupAlloted,
                createdDate: ele?.createdDate,
              };
            })}
          />
        )}
        {bloodCollectionTableData?.length > 0 && (
          <Tables
            thead={CollectionReportThead}
            tbody={bloodCollectionTableData?.map((ele, i) => {
              return {
                SrNo: i + 1,
                visitor_ID: ele?.visitor_ID,
                bloodCollection_ID: ele?.bloodCollection_ID,
                name: ele?.name,
                bbtubeno: ele?.bbtubeno,
                volume: ele?.volume,
                collecteddate: ele?.collecteddate,
                bloodGroup: ele?.bloodGroup,
              };
            })}
          />
        )}
        {bloodCurrentStockTableData?.length > 0 && (
          <Tables
            thead={CurrentStockReportThead}
            tbody={bloodCurrentStockTableData?.map((ele, i) => {
              return {
                SrNo: i + 1,
                centreName: ele?.centreName,
                bloodCollection_Id: ele?.bloodCollection_Id,
                componentName: ele?.componentName,
                bbTubeNo: ele?.bbTubeNo,
                entryDate: ele?.entryDate,
                expiryDate: ele?.expiryDate,
              };
            })}
            style={{ width: "100%" }}
          />
        )}
        {donorProcessTableData?.length > 0 && (
          <Tables
            thead={DonorRecordReportThead}
            tbody={donorProcessTableData?.map((ele, i) => {
              return {
                SrNo: i + 1,
                collectedDate: ele?.collectedDate,
                expiryDate: ele?.expiryDate,
                prepareDate: ele?.prepareDate,
                donorName: ele?.donorName,
                relationName: ele?.relationName,
                mobileNo: ele?.mobileNo,
                address: ele?.address,
                age: ele?.age,
                gender: ele?.gender,
                bloodGroup: ele?.bloodGroup,
                // qty: ele?.qty,
                hiV12: ele?.hiV12,
                hBsAg: ele?.hBsAg,
                hcv: ele?.hcv,
                vdrl: ele?.vdrl,
                mp: ele?.mp,
                irgAntibodies: ele?.irgAntibodies,
                componentName: ele?.componentName,
                issueVoucher: ele?.issueVoucher,
                patientName: ele?.patientName,
                issueDate: ele?.issueDate,
              };
            })}
            tableHeight={"scrollView"}
          />
        )}
        {componentDetailTableData?.length > 0 && (
          <Tables
            thead={BloodComponentReportThead}
            tbody={componentDetailTableData?.map((ele, i) => {
              return {
                SrNo: i + 1,
                bloodCollection_Id: ele?.bloodCollection_Id,
                componentName: ele?.componentName,
                bagType: ele?.bagType,
                name: ele?.name,
                createdDate: ele?.createdDate,
              };
            })}
            style={{ width: "100%" }}
          />
        )}
      </div>
    </div>
  );
};

export default BBreport;
