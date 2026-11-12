import React, { useEffect, useState } from "react";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import DatePicker from "../../../../components/formComponent/DatePicker";
import moment from "moment";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
// import { BreadCrumb } from "primereact/breadcrumb";
import Input from "../../../../components/formComponent/Input";
import { Tabfunctionality } from "../../../../utils/helpers";
import { MOBILE_NUMBER_VALIDATION_REGX } from "../../../../utils/constant";
import { filterByTypes, inputBoxValidation, notify } from "../../../../utils/utils";
import ViewVoucher from "./ViewVoucher";

import { BindVoucherBillingScreenControls, SearchForBoucherPostingBatch } from "../../../../networkServices/finance";
// import { AutoComplete } from "primereact/autocomplete";
import ColorCodingSearch from "../../../../components/commonComponents/ColorCodingSearch";

const VoucherBatch = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;

  const [t] = useTranslation();
  // const [values, setValues] = useState();
  // const [isVisisble, setIsVisible] = useState(false);
  const [SelectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedCurrencyName, setSelectedCurrencyName] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [reload, setReload] = useState(false);
  
  const [values, setValues] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    currency: "",
    department: { label: "All", value: "0" },
    projectName: { label: "All", value: "0" },
    voucherType: { label: "All", value: "0" },
    accountName: { label: "All", value: "0" },
    entryBy: { label: "All", value: "0" },
    amount: "",
    verifiedBy: { label: "All", value: "0" },
    status: {
      value: "0",
      label: "NO",
    },
    invoiceNo: "",
    symbol: {
      value: 1,
      label: ">="
    },
    type: {
      value: 1,
      label: "Verify",
    },
    voucherNo: ""
  });

  const [DropDownState, setDropDownState] = useState({
    country: [],
    project: [],
    department: [],
    employee: [],
    accountName: [],
    projectName: [],
    VoucherType: [],

  });



  const handleInputChangeCurrency = (e, index, field) => {
    setSelectedCurrency(index?.value);
    setSelectedCurrencyName(index?.label);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: moment(value).format("YYYY-MM-DD"),
    }));
  };

  const handleSearch = async (isShowTost=true) => {
    const payload = {
      currency: String(values?.currency?.value),
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      department: String(values?.department?.value || values?.department),
      project: String(values?.projectName?.value || values?.projectName),
      voucherType: String(values?.voucherType?.value || values?.voucherType),
      entryBy: String(values?.entryBy?.value || values?.entryBy),
      verifiedBy: String(values?.verifiedBy?.value || values?.verifiedBy),
      accountName: String(values?.accountName?.value || values?.accountName),
      amount: String(values?.amount || "0"),
      amountSearchType: String(values?.symbol?.value || "1"),
      type: String(values?.type?.value || ""),
      status: String(values?.status?.value || ""),
      billNo: String(values?.invoiceNo || ""),
      voucherNo: String(values?.voucherNo || "")
    }
    try {

      const response = await SearchForBoucherPostingBatch(payload)
      if (response?.success) {
        setTableData(response?.data)
    //  notify(response?.message,"success")
      }
      else{
        setTableData([])
        isShowTost && notify(response?.message,"error")
      }
    } catch (error) {
console.log("error",error)
    }
   


  };
 
  const handleReactChange = (name, e, key) => {
    setValues((val) => ({ ...val, [name]: e }));

  };
  
useEffect(()=>{
  
  if(values?.type?.value && values?.status?.value)
  handleSearch(false)
},[values?.type,values?.status,reload])



  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1);
    if (apiResp?.success) {
      const department = filterByTypes(
        apiResp?.data,
        [2],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      const country = filterByTypes(
        apiResp?.data,
        [4],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      const project = filterByTypes(
        apiResp?.data,
        [3],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      const employee = filterByTypes(
        apiResp?.data,
        [11],
        ["TypeID"],
        "TextField",
        "ValueField",
        "Type"
      );

      const AccountName = filterByTypes(
        apiResp?.data,
        [5],
        ["TypeID"],
        "TextField",
        "ValueField",
        "Type"
      )
      const VoucherType = filterByTypes(
        apiResp?.data,
        [1],
        ["TypeID"],
        "TextField",
        "ValueField",
        "Type"
      )

      if (project?.length === 1) {
        setValues((val) => ({
          ...val,
          ProjectName: { value: project[0]["value"] },
        }));
      }
      if (country?.length > 0) {
        console.log("project", country);
        setSelectedCurrency(country[0]["value"]);
        setValues((val) => ({
          ...val,
          currency: { value: country[0]["extraColomn"] },
        }));
      }
      setDropDownState((val) => ({
        ...val,
        currency: country,

        employee: employee,
        accountName: AccountName,
        department: department,
        projectName: project,
        VoucherType: VoucherType,
      }));
    }
  };

  // console.log("values", values);
  // const search = async (event, index, name, type) => {
  //   // let shallowCopyData = JSON.parse(JSON.stringify(tbody));
  //   // shallowCopyData[index][name] = event?.query;

  //   let listData = filterByTypes(
  //     list,
  //     [type],
  //     ["TypeID"],
  //     "TextField",
  //     "ValueField"
  //   );
  //   const results = listData?.filter((obj) =>
  //     Object.values(obj)?.some(
  //       (value) =>
  //         typeof value === "string" &&
  //         value?.toLowerCase()?.includes(event?.query.toLowerCase())
  //     )
  //   );

  //   if (results) {
  //     setItems(results);
  //   } else {
  //     setItems([]);
  //   }
  // };

  useEffect(() => {
    bindListData();
  }, []);

  return (
    <>
      <div className="card border">
        <Heading title={"Voucher Posting Batch"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Currency")}
            id={"currency"}
            searchable={true}
            name={"currency"}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            // style={{ width: "100px" }}
            dynamicOptions={DropDownState?.currency}
            // dynamicOptions={values}
            handleChange={(val, e) =>
              handleInputChangeCurrency(val, e, "currency")
            }

            value={
              SelectedCurrency ? SelectedCurrency : values?.currency?.value
            }
            removeIsClearable={false}
            requiredClassName="required-fields"
          />

          <DatePicker
            className="custom-calendar"
            id="From Data"
            name="fromDate"
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            value={
              values.fromDate
                ? moment(values.fromDate, "YYYY-MM-DD").toDate()
                : null
            }
            maxDate={new Date()}
            handleChange={searchHandleChange}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            value={
              values.toDate
                ? moment(values.toDate, "YYYY-MM-DD").toDate()
                : null
            }
            maxDate={new Date()}
            handleChange={searchHandleChange}
            placeholder={VITE_DATE_FORMAT}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            name="department"
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.department]}
            requiredClassName="required-fields"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.department?.value}
          />
          <ReactSelect
            placeholderName={t("Project Name")}
            id={"ProjectName"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.projectName]}
            name="projectName"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.projectName?.value}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("Voucher Type")}
            id={"voucherType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"

            dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.VoucherType]}
            requiredClassName="required-fields"
            name="voucherType"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.voucherType?.value}
          />

          <ReactSelect
            placeholderName={t("Account Name")}
            id={"accountName"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            requiredClassName="required-fields"
            dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.accountName]}
            name="accountName"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.accountName?.value}
          />
          <ReactSelect
            placeholderName={t("Entry By")}
            id={"entryBy"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            requiredClassName="required-fields"
            dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.employee]}
            name="entryBy"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.entryBy?.value}
          />
          <ReactSelect
            placeholderName={t("Verified By")}
            id={"verifiedBy"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            requiredClassName="required-fields"
            dynamicOptions={[{ label: "All", value: "0" }, ...DropDownState?.employee]}

            name="verifiedBy"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.verifiedBy?.value}
          />

          <Input
            type="text"
            className="form-control required-fields"
            lable={t("Amount")}
            placeholder=" "
            id="amount"
            name="amount"
            value={values?.amount}
            onChange={handleChange}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            onKeyDown={Tabfunctionality}
          />
          <ReactSelect
            // placeholderName={t("Verified By")}
            id={"symbol"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            //   dynamicOptions={DropDownState?.binddepartment}
            dynamicOptions={[
              {
                value: 1,
                label: ">=",
              },
              {
                value: 2,
                label: "<=",
              },
              {
                value: 3,
                label: "=",
              },
            ]}
            name="symbol"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.symbol?.value || "1"}
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            //   dynamicOptions={DropDownState?.binddepartment}
            dynamicOptions={[
              {
                value: 1,
                label: "Verify",
              },
              {
                value: 2,
                label: "Authorize",
              },
            ]}
            name="type"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.type?.value}
          />
          <ReactSelect
            placeholderName={t("Status")}
            id={"status"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            //   dynamicOptions={DropDownState?.binddepartment}
            dynamicOptions={[
              {
                value: "1",
                label: "YES",
              },
              {
                value: "0",
                label: "NO",
              },
            ]}
            name="status"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.status?.value}
          />
          <Input
            type="text"
            className="form-control required-fields"
            lable={t("Invoice No.")}
            placeholder=" "
            id="invoiceNo"
            name="invoiceNo"
            // value={values?.invoiceNo}
            // onChange={handleChange}
            // onChange={(e) => {
            //   inputBoxValidation(
            //     MOBILE_NUMBER_VALIDATION_REGX,
            //     e,
            //     handleChange
            //   );
            // }}
            value={values?.invoiceNo}
            onChange={handleChange}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            // respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            onKeyDown={Tabfunctionality}
          />
          <Input
            type="text"
            className="form-control required-fields"
            lable={t("Voucher No.")}
            placeholder=" "
            id="voucherNo"
            name="voucherNo"

            // onChange={(e) => {
            //   inputBoxValidation(
            //     MOBILE_NUMBER_VALIDATION_REGX,
            //     e,
            //     handleChange
            //   );
            // }}
            value={values?.voucherNo}
            onChange={handleChange}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            onKeyDown={Tabfunctionality}
          />
          <button
            className="btn btn-sm btn-success mx-1"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
        </div>
      </div>
      
      {
        tableData?.length>0 &&
        <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            isBreadcrumb={false}
            title={t("BillDetails")}
            secondTitle={
              <>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#EAED9D"}
                    label={t("Pending Verify")}
                    // onClick={() => {
                    //   handleCallViewMedReq("Pending Verify");
                    // }}
                  />
                </span>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#ADED9D"}
                    label={t("Verify")}
                    // onClick={() => {
                    //   handleCallViewMedReq("Verify");
                    // }}
                  />
                </span>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#9DE9ED"}
                    label={t("Authorized")}
                    // onClick={() => {
                    //   handleCallViewMedReq("Authorized");
                    // }}
                  />
                </span>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#EBC864"}
                    label={t("Audit Done")}
                    // onClick={() => {
                    //   handleCallViewMedReq("REAudit DoneJECT");
                    // }}
                  />
                </span>
                <span className="pointer-cursor">
                  {" "}
                  <ColorCodingSearch
                    color={"#ED9DEB"}
                    label={t("Reviewed")}
                    // onClick={() => {
                    //   handleCallViewMedReq("Reviewed");
                    // }}
                  />
                </span>
              </>
            }
          />
          {/* {

            console.log("values values",values)
          } */}
          <ViewVoucher
           data={tableData} 
           values={values}
           setReload={setReload}
           />
        </div>
        </div>
      }
  
    </>
  );
};

export default VoucherBatch;
