import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";

import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  BindBloodAdd,
  BindBloodSave,
  BindComponent,
  BindOrganisation,
  BindRate,
} from "../../../networkServices/BloodBank/BloodBank";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { BindBloodGroup } from "../../../networkServices/BillingsApi";
import { notify } from "../../../utils/ustil2";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
const DirectBloodStock = () => {
  const [t] = useTranslation();

  const initialValue =
    // BillDate: moment(new Date()).toDate(),
    // BillNo: "",
    // toDate: "",
    // WayBillNo: "",
    // WayBillDate: moment(new Date()).toDate(),
    // Organisation: "",
    // Component: "",
    // BatchNo: "",
    // BagType: "",
    // BloodGroup: "",
    // Quantity: "",
    // ExpiryDate: moment(new Date()).toDate(),
    {
      BillNo: "",
      BillDate: moment(new Date()).toDate(),
      WayBillNo: "",
      WayBillDate: moment(new Date()).toDate(),
      Organisation: "",
      Component: "",
      BatchNo: "",
      BagType: "",
      BloodGroup: "0",
      Quantity: "",
      ExpiryDate: moment(new Date()).toDate(),
      OrganisationName: "",
      ComponentName: "",
      BloodGroupName: "",
    };
  const [values, setValues] = useState({ ...initialValue });
  console.log("Values", values);
  const [bindOrganisationData, setBindOrganisationData] = useState([]);
  const [bindComponent, setBindComponent] = useState([]);
  const [bindBloodGroup, setBindBloodGroup] = useState([]);
  const [tableResp, setTableResp] = useState([]);
  console.log("tableResp", tableResp);
  const [newData, setNewData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const BagTypeOption = [
    { label: "Select", value: "Select" },
    { label: "Single", value: "Single" },
    { label: "Double", value: "Double" },
    { label: "Triple", value: "Triple" },
    { label: "OK", value: "OK" },
  ];

  const TheadSearchTable = [
    { width: "5%", name: t("SNo") },
    { width: "25%", name: t("componnet Name") },
    { width: "25%", name: t("blood group") },
    { width: "15%", name: t("bag type") },
    { width: "10%", name: t("tube no. ") },
    { width: "5%", name: t("quantity") },
    { width: "7%", name: t("expirry dat") },
    { width: "8%", name: t("reject") },
  ];
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // function getDate(daysToAdd) {
  //   const today = new Date();
  //   const futureDate = new Date();
  //   futureDate.setDate(today.getDate() + daysToAdd);
  //   const day = String(futureDate.getDate()).padStart(2, '0');
  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   const month = monthNames[futureDate.getMonth()];
  //   const year = futureDate.getFullYear();
  //   return `${day}-${month}-${year}`;
  // }

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

  const handleBindAdd = async () => {
    if (
      values?.Organisation?.value === "" ||
      !values?.Component?.value ||
      !values?.BloodGroup?.value ||
      !values?.BagType?.value === 0 ||
      !values?.BatchNo
    ) {
      notify("Please Fill Required Fields", "error");
      return;
    }

    const formattedDate = moment(values?.fromDate).format("YYYY-MM-DD");
    const formattedExpiryDate = moment(values?.ExpiryDate).format("YYYY-MM-DD");

    try {
      const apiResp = await BindBloodAdd(values?.BatchNo);
      if (apiResp.message === "Tube No. Already Used") {
        notify("Batch No. Already Used", "error");
        return;
      } else notify(apiResp.message, "sucess");
    } catch (error) {
      notify(apiResp?.message, "error");
    }
    debugger;
    const rowData = {
      BillNo: values?.BillNo,
      BillDate: formattedDate,
      WayBillNo: values?.WayBillNo,
      WayBillDate: values?.WayBillDate,
      Organisation: values?.Organisation?.value,
      Component: values?.Component?.value,
      BatchNo: values?.BatchNo,
      BagType: values?.BagType?.value,
      BloodGroup: values?.BloodGroup?.value,
      Quantity: values?.Quantity,
      ExpiryDate: formattedExpiryDate,
      OrganisationName: values?.Organisation?.label,
      ComponentName: values?.Component?.label,
      BloodGroupName: values?.BloodGroup?.label,
    };
    setTableResp((prev) => [...prev, rowData]);
    setNewData((prev) => ({ ...prev, rowData }));
    setValues({ ...initialValue });
  };

  const handleBindSave = async () => {
    const formattedDate = moment(values?.fromDate).format("YYYY-MM-DD");
    const formattedExpiryDate = moment(values?.ExpiryDate).format("YYYY-MM-DD");
    debugger;
    const payload = tableResp.map((item) => ({
      billno: item?.BillNo || "",
      billDate: formattedDate,
      organisation: item?.OrganisationName || "",
      wayBillDate: formattedDate,
      waybillno: item?.WayBillNo || "",
      bagType: item?.BagType || "",
      bbTubeNo: item?.BatchNo || "",
      bloodGroup: item?.BloodGroupName || "",
      componentName: item?.ComponentName || "",
      componentID: item?.Component || "",
      expiryDate: formattedExpiryDate,
      initialCount: item?.Quantity || "",
    }));
    try {
      const apiResp = await BindBloodSave(payload);
      if (apiResp.success) {
        console.log("bloodAdd", apiResp.data);
        notify(apiResp.message, "success");
        setTableResp([]);
        setValues({ ...initialValue });
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading menu name data", "error");
    }
  };

  const handleDeleteRow = (indexToDelete) => {
    const updatedRows = tableResp.filter((_, index) => index !== indexToDelete);
    setTableResp(updatedRows);
    notify("Deleted successfully", "success");
  };

  const handleBindRate = async () => {
    try {
      const apiResp = await BindRate("1");
      if (apiResp.success) {
        // console.log('organisation Dta', apiResp.data)
        const mappedOptions = apiResp.data.map((item) => ({
          value: item.id,
          label: item.organisaction,
        }));
        // setBindOrganisationData(mappedOptions);
      } else notify(apiResp.message, "error");
    } catch (error) {
      notify("Error loading menu name data", "error");
    }
  };

  useEffect(() => {
    handleBindOrganisation();
    handleBindComponent();
    handleBindBloodGroup();
    handleBindRate();
    // handleBindAdd();
  }, []);

  return (
    <div className="card">
      <Heading title={t("Master")} isBreadcrumb={true} />

      <div className="row p-2">
        <Input
          type="number"
          className="form-control"
          id="BillNo"
          name="BillNo"
          value={values?.BillNo}
          onChange={handleChange}
          lable={t("Bill No")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <DatePicker
          id="BillDate"
          width
          name="BillDate"
          lable={t("Bill Date")}
          value={values?.BillDate || new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          className="custom-calendar"
          maxDate={values?.toDate}
        />
        <Input
          type="number"
          className="form-control"
          id="WayBillNo"
          name="WayBillNo"
          // value={values?.WayBillNo}
          onChange={handleChange}
          lable={t("Way Bill No:")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <DatePicker
          id="WayBillDate"
          width
          name="WayBillDate"
          lable={t("Way Bill Date")}
          value={values?.WayBillDate || new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          className="custom-calendar"
          maxDate={values?.toDate}
        />
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
          requiredClassName="required-fields"
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
          requiredClassName="required-fields"
        />
        <Input
          type="text"
          className="form-control required-fields"
          id="BatchNo"
          name="BatchNo"
          value={values?.BatchNo}
          onChange={handleChange}
          lable={t("Batch No.")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
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
          requiredClassName="required-fields"
        />

        <Input
          type="number"
          className="form-control"
          id="Quantity"
          name="Quantity"
          value={values?.Quantity?.value}
          onChange={handleChange}
          lable={t("Quantity")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("Bag Type")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="BagType"
          name="BagType"
          removeIsClearable={true}
          dynamicOptions={BagTypeOption}
          handleChange={handleSelect}
          requiredClassName="required-fields"
          value={values?.BagType?.value}
        />
        <DatePicker
          id="ExpiryDate"
          width
          name="ExpiryDate"
          lable={t("Expiry Date")}
          value={values?.ExpiryDate || new Date()}
          requiredClassName="required-fields"
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          className="custom-calendar"
          maxDate={values?.ExpiryDate}
        />
        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handleBindAdd}
        >
          {t("Add")}
        </button>
      </div>

      {tableResp.length > 0 && (
        <div className="card">
          <Tables
            thead={TheadSearchTable}
            tbody={tableResp?.map((val, index) => {
              console.log("Table row data:", val);
              return {
                sno: index + 1,
                componentName: val?.Component,
                BloodGroup: val?.BloodGroup,
                bagtype: val?.BagType,
                tubeNO: val?.BatchNo,
                quantity: val?.Quantity,
                expiryDate: val?.ExpiryDate,
                Edit: (
                  <i
                    className="fa fa-trash"
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteRow(index)}
                  />
                ),
              };
            })}
          />
          <div className="d-flex justify-content-end p-2">
            <button
              className="btn btn-sm btn-success py-0 px-1"
              onClick={handleBindSave}
              style={{ width: "60px" }}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectBloodStock;
