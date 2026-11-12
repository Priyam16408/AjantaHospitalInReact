import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  BindComponent,
  BindOrganisation,
  EDPBBStockSearch,
  EDPBBStockViewDetail,
} from "../../../networkServices/BloodBank/BloodBank";
import { BindBloodGroup } from "../../../networkServices/BillingsApi";
import { notify } from "../../../utils/ustil2";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";


const ViewBBstock = () => {
  const [t] = useTranslation();

  const initialValue = {};
  const [values, setValues] = useState({ ...initialValue });
  const [tableData, setTableData] = useState([]);
  const [searchTableData, setSearchTableDate] = useState([]);
  const [bindOrganisationData, setBindOrganisationData] = useState([]);
  const [bindComponent, setBindComponent] = useState([]);
  const [bindBloodGroup, setBindBloodGroup] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const TheadSearchTable = [
    { width: "5%", name: t("SNo") },
    { width: "25%", name: t("Collection ID") },
    { width: "25%", name: t("Organization") },
    { width: "15%", name: t("Bill No.") },
    { width: "10%", name: t("Bill Date ") },
    { width: "5%", name: t("Created Date") },
    { width: "7%", name: t("Created By") },
    { width: "8%", name: t("Details") },
  ];

  const searchTableThead = [
    { name: t("SNo") },
    { name: t("Component Name") },
    { name: t("Blood Group") },
    { name: t("Bag Number") },
    { name: t("Rate") },
    { name: t("Entry Date") },
    { name: t("Expiry Date") },
  ];
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBindOrganisation = async () => {
    try {
      const apiResp = await BindOrganisation();
      if (apiResp.success) {
        // console.log('organisation Dta', apiResp.data)
        const mappedOptions = apiResp.data.map((item) => ({
          value: item.id,
          label: item.organisaction,
        }));
        setBindOrganisationData(mappedOptions);
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading menu name data", "error");
    }
  };
  const handleBindComponent = async () => {
    try {
      const apiResp = await BindComponent();
      if (apiResp.success) {
        console.log("Compoennt Dta", apiResp.data);
        const mappedOptions = apiResp.data.map((item) => ({
          value: item.id,
          label: item.ComponentName,
        }));
        setBindComponent(mappedOptions);
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading menu name data", "error");
    }
  };
  const handleBindBloodGroup = async () => {
    try {
      const apiResp = await BindBloodGroup();
      if (apiResp.success) {
        // console.log('blodGroup Dta', apiResp.data)
        const mappedOptions = apiResp.data.map((item) => ({
          value: item.id,
          label: item.bloodgroup,
        }));
        setBindBloodGroup(mappedOptions);
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading menu name data", "error");
    }
  };

  const handleSearch = async () => {
    const payload = {
      organisation: values?.Organisation?.value || "All",
      bloodGroup: values?.BloodGroup?.value || "All",
      componentName: values?.Component?.value || "All",
      bbTubeNo: values?.BagNo || "",
      fromDate: moment(values?.FromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.ToDate).format("YYYY-MM-DD"),
    };
    const response = await EDPBBStockSearch(payload);
    if (response?.success) {
      setTableData(response?.data);
      setSearchTableDate([]);
    } else {
      notify(response?.message, "error");
      setTableData([]);
      setSearchTableDate([]);
    }
  };

  const handleSearhItem = async (index, val) => {
    debugger;
    const response = await EDPBBStockViewDetail("BBD25105");

    if (response?.success) {
      setSearchTableDate(response?.data);
    } else {
      notify(response?.message, "error");
      setSearchTableDate([]);
    }
  };

  useEffect(() => {
    handleBindOrganisation();
    handleBindComponent();
    handleBindBloodGroup();
  }, []);

  return (
    <div className="mt-2 card">
      <Heading title={t("Blood Record Search")} isBreadcrumb={true} />

      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Organisation")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="Organisation"
          name="Organisation"
          removeIsClearable={true}
          dynamicOptions={bindOrganisationData}
          handleChange={handleSelect}
          value={values?.Organisation?.value}
          requiredClassName=""
        />
        <ReactSelect
          placeholderName={t("Component")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="Component"
          name="Component"
          removeIsClearable={true}
          dynamicOptions={bindComponent}
          // dynamicOptions={[...handleReactSelectDropDownOptions(bindComponent, "label", "value")]}
          handleChange={handleSelect}
          value={values?.Component?.value}
          requiredClassName=""
        />
        <ReactSelect
          placeholderName={t("Blood Group")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="BloodGroup"
          name="BloodGroup"
          removeIsClearable={true}
          dynamicOptions={bindBloodGroup}
          handleChange={handleSelect}
          value={values?.BloodGroup?.value}
          requiredClassName=""
        />
        <Input
          type="number"
          className="form-control"
          id="BagNo"
          name="BagNo"
          value={values?.BagNo}
          onChange={handleChange}
          lable={t("Bag No")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <DatePicker
          id="FromDate"
          width
          name="FromDate"
          lable={t("From Date")}
          value={values?.FromDate || new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          className="custom-calendar"
          maxDate={values?.FromDate}
        />
        <DatePicker
          id="ToDate"
          width
          name="ToDate"
          lable={t("To Date")}
          value={values?.ToDate || new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          className="custom-calendar"
          maxDate={values?.ToDate}
        />

        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handleSearch}
        >
          {t("Search")}
        </button>
      </div>

      {tableData.length > 0 && (
        <div className="card">
          <Heading
            title={t("Blood Record Search Results")}
            isBreadcrumb={false}
          />
          <Tables
            thead={TheadSearchTable}
            tbody={tableData?.map((val, index) => {
              return {
                sno: index + 1,
                collectionId: val?.bb_directstockID,
                org: val?.Organisation,
                BillNo: val?.Bill_no,
                BillDate: val?.billdate,
                CreatedDate: val?.CreatedDate,
                CreatedBy: val?.CreatedBy,
                Detail: (
                  <i
                    className="fa fa-search"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSearhItem(index, val)}
                  />
                ),
              };
            })}
          />
        </div>
      )}
      {searchTableData.length > 0 && (
        <div className="card mt-2">
          <Heading title={t("Blood Record Details")} isBreadcrumb={false} />
          <Tables
            thead={searchTableThead}
            tbody={searchTableData?.map((val, index) => {
              return {
                sno: index + 1,
                component: val?.ComponentName,
                BloodGroup: val?.BloodGroup,
                Bagno: val?.BBtubeno,
                Rate: val?.Rate ? val?.Rate : "0.0000",
                EntryDate: val?.Entrydate,
                ExpiryDate: val?.expirydate,
              };
            })}
          />
        </div>
      )}
    </div>
  );
};

export default ViewBBstock;
