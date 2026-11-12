import React, { useEffect } from "react";
import {
  BalanceTransaferControls,
  GetBalanceToTransafer,
  UploadBalanceTransfer,
} from "../../../../networkServices/InventoryApi";
import {
  filterByType,
  filterByTypes,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import { useTransition, useState } from "react";
import { useTranslation } from "react-i18next";
import { PurchaGetBindAllCenter } from "../../../../networkServices/Purchase";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import Tables from "../../../../components/UI/customTable";

const BalanceTransfer = () => {
  const [t] = useTranslation();

  const headData = [
    t("S.No."),
    t("COGID"),
    t("COG Name"),
    t("COAID"),
    t("A/C Name"),
    t("Closing Amount"),
    t("Opening Amount"),
    t("Diff."),
  ];

  const [values, setValues] = useState({
    allCenter: {
      CentreID: 1,
      CentreName: "MOHANDAI OSWAL HOSPITAL",
      IsDefault: 0,
      label: "MOHANDAI OSWAL HOSPITAL",
      value: 1,
    },
    filterType: {
      label: "",
      value: "",
    },
    currency: {
      label: "INR",
      value: "INR",
      extraColomn: "INR",
    },
    chartOfAC: "",
  });
  console.log("Values", values);

  const [dropDownState, setDropDownState] = useState({
    GetBindAllCenter: [],
    Currency: [],
    FYyear: [],
    COAWise: [],
    COGWise: [],
    previousFYEnd: [],
    previousFYStart: [],
    currentFYStart: [],
    currentFYEnd: [],
  });
  const [tableData, setTableData] = useState([]);
  console.log("tableData", tableData);

  const bindListData = async () => {
    const payloadToBe = {
      CentreID: values?.allCenter?.CentreID,
    };
    let apiResp = await BalanceTransaferControls(payloadToBe);
    console.log("ApieRes", apiResp);
    if (apiResp?.success) {
      const currency = filterByTypes(
        apiResp?.data,
        [1],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      //   console.log("Currency" , currency)
      const COGWise = filterByTypes(
        apiResp?.data,
        [3],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      const COAWise = filterByTypes(
        apiResp?.data,
        [4],
        ["TypeID"],
        "TextField",
        "ValueField"
      );

      const FYyear = apiResp?.data?.filter((item) => item?.TypeName === "FY");

      const currentFY = FYyear?.[0]; // Assuming the first FY entry is the latest
      const [currentFYStart, currentFYEnd] =
        currentFY?.TypeCode?.split("#") || [];

      // Extract Previous FY Start & End
      const [previousFYStart, previousFYEnd] =
        currentFY?.PreviousFyData?.split("#") || [];

      setDropDownState((val) => ({
        ...val,
        // BindEmplyee: BindEmplyee,
        Currency: currency,
        COGWise: COGWise,
        COAWise: COAWise,
        FYyear: FYyear.map((item) => ({
          label: item?.GroupCode,
          value: item?.ValueField,
        })),
        currentFYStart: currentFYStart,
        currentFYEnd: currentFYEnd,
        previousFYStart: previousFYStart,
        previousFYEnd: previousFYEnd,
      }));
    } else {
      // setList([])
    }
  };

  const handleReactChange = (name, e, key) => {
    setValues((val) => ({ ...val, [name]: e }));
  };

  const getPurchaGetBindAllCenterAPI = async () => {
    try {
      const GetBindAllCenter = await PurchaGetBindAllCenter();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: handleReactSelectDropDownOptions(
          GetBindAllCenter?.data,
          "CentreName",
          "CentreID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleSearch = async () => {
    if (!values?.fyYear?.value) {
      notify("Please Select Financial Year", "error");
      return;
    } else if (!values?.currency?.value) {
      notify("Please Select Currency", "error");
      return;
    } else if (!values?.allCenter?.CentreID) {
      notify("Please Select Center", "error");
      return;
    }

    const payloadtobe = {
      centreID: values?.allCenter?.CentreID,
      coaid: values?.filterType?.value === 1 ? values?.type?.value : "0",
      cogCode: values?.filterType?.value === 2 ? values?.type?.value : "0",
      currencyCode: values?.currency?.value,
      closingDate: dropDownState?.currentFYStart,
      fyID: Number(values?.fyYear?.value),
    };

    const data = await GetBalanceToTransafer(payloadtobe);

    if (data?.success) {
      // setList(data?.data);
      notify("Record Found", "success");
      setTableData(data?.data);
    }
  };

  const handleTransfer = async () => {
    // debugger;
    const payloadtobe = {
      centreID: values?.allCenter?.CentreID,
      currencyCode: values?.currency?.value,
      cogCode: "0",
      coaid: "0",
      fyID: values?.fyYear?.value,
      closingDate: dropDownState?.currentFYStart,
      crrEndDate: dropDownState?.currentFYEnd,
    };

    const data = await UploadBalanceTransfer(payloadtobe);
    if (data?.success === true) {
      notify(data?.message, "success");
    } else if (data?.success == false) {
      notify("No Data Found To Save", "error");
    }
  };

  useEffect(() => {
    getPurchaGetBindAllCenterAPI();
    bindListData();
  }, []);
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Auto Purchase Request Behalf Of Sales")}
          isBreadcrumb={true}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Center")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={values?.allCenter?.value}
          />
          <ReactSelect
            placeholderName={t("Currency")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"currency"}
            name={"currency"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.Currency}
            value={values?.currency?.value}
          />
          <ReactSelect
            placeholderName={t("Name")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"filterType"}
            name={"filterType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              {
                label: t("COA Wise"),
                value: 1,
              },
              {
                label: t("COG Wise"),
                value: 2,
              },
            ]}
            value={values?.filterType?.value}
          />
          <ReactSelect
            placeholderName={t("Type")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"type"}
            name={"type"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={
              values?.filterType?.value === 1
                ? dropDownState?.COAWise
                : dropDownState?.COGWise
            }
            value={values?.type?.value}
          />
          <ReactSelect
            placeholderName={t("Financial Year")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"fyYear"}
            name={"fyYear"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.FYyear}
            value={values?.fyYear?.value}
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
            <LabeledInput
              label={t("Curr. FY Start Date")}
              value={dropDownState?.currentFYStart}
            />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
            <LabeledInput
              label={t("Curr. FY End Date")}
              value={dropDownState?.currentFYEnd}
            />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
            <LabeledInput
              label={t("Prev. FY Start Date")}
              value={dropDownState?.previousFYStart}
            />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
            <LabeledInput
              label={t("Prev. FY End Date")}
              value={dropDownState?.currentFYEnd}
            />
          </div>
          {/* <button
            className="btn btn-sm btn-primary ml-2"
            onClick={() => handleSearch()}
          >
            {t("Search")}
          </button> */}
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-sm btn-primary ml-sm-2 ml-2 d-flex justify-content-end"
              type="submit"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      {tableData.length > 0 && (
        <div className="card">
          <Heading title={t("Balance Transfer")} isBreadcrumb={false} />
          <div>
            <div>
              <Tables
                style={{ maxHeight: "50vh" }}
                thead={headData}
                tbody={tableData?.map((ele, index) => ({
                  SNo: index + 1,
                  COGID: ele?.GroupCode,
                  GroupName: ele?.GroupName,
                  COAID: ele?.COAID,
                  AccountName: ele?.AccountName,
                  Closing: ele?.Closing == 0 ? "0.000" : ele?.Closing,
                  OpeningBalnce:
                    ele?.OpeningBalnce == 0 ? "0.000" : ele?.OpeningBalnce,
                  Diff:
                    ele?.Closing - ele?.OpeningBalnce === 0
                      ? "0.000"
                      : ele?.Closing - ele?.OpeningBalnce,
                }))}
              />
              {/* <button
                className="btn btn-sm btn-primary ml-2"
                type="Download"
                onClick={""}
              >
                {t("Balance Transfer")}
              </button> */}
              <div className="mt-2 p-2 d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-primary ml-sm-2 ml-0"
                  type="submit"
                  onClick={handleTransfer}
                >
                  {t("Balance Transfer")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceTransfer;
