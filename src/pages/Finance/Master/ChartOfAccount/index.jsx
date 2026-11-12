import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  filterByTypes,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import AccountTypeModel from "../../../../components/modalComponent/Utils/AccountTypeModel";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Modal from "../../../../components/modalComponent/Modal";
import Input from "../../../../components/formComponent/Input";
import {
  BindVoucherBillingScreenControls,
  BindCOGBankDetails,
  bindCOGGroupsBackendData,
  ActionChartOfAccount,
  SaveNewAccountType,
  SaveChartOfAccount,
  handlbindCOGGroupsBackendData,
  Bindglobalresources,
} from "../../../../networkServices/finance";
import { FaTrash } from "react-icons/fa";
import Tables from "../../../../components/UI/customTable";

const index = () => {
  const [t] = useTranslation();
  const userData = useLocalStorage("userData", "get");
  const [tableFilterData, setTableFilterData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [bankAPIdata, setBankApiData] = useState([]);
  const [storeCoid, setStoreCoid] = useState("");
  const [globalResources, setGlopbalResources] = useState([]);

  const [values, setValues] = useState({
    acType: { label: "", value: "" },
    cogName: { label: "", value: "" },
    acountName: "",
    currency: { label: "", value: "" },
    tradeType: { label: "", value: "" },
    acountNumber: "",
    bank: { label: "", value: "" },
    branch: { label: "", value: "" },
    bankAddress: "",
    branchCode: "",
    swiftBranchCode: "",
    filter: "",
    perfferedBank: "",
    IsPreferredForPayment: 0,
    IsBank: 0,
  });

  const TradeType = [
    { value: "0", label: "Select" },
    { value: "1", label: "Trade" },
    { value: "2", label: "Non Trade" },
    { value: "3", label: "Other" },
  ];

  const [AddBankData, setAddBankData] = useState([]);
  console.log(AddBankData?.length);

  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const handleModel = (
    label,
    width,
    type,
    isOpen,
    Component,
    handleInsertAPI
  ) => {
    setHandleModelData({
      label: label,
      width: width,
      type: type,
      isOpen: isOpen,
      Component: Component,
      handleInsertAPI,
    });
  };
  const handleReactChange = (name, e, key) => {
    setValues((val) => ({ ...val, [name]: e }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };
  const handleChangeModel = (data) => {
    setModalData(data);
  };
  const handleReferenceTypeAPI = async (data) => {
    let insData = await dispatch(ReferenceTypeInsert(data));
    if (insData?.payload?.status) {
      setModalData({});
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      dispatch(
        CentreWiseCacheByCenterID({
          centreID: userData?.defaultCentre,
        })
      );
    }
  };
  const [dropDownState, setDropDownState] = useState({
    BindBank: [],
    BindBranch: [],
  });

  const handleDeleteBank = (index) => {
    setAddBankData(AddBankData.filter((_, i) => i !== index));
  };

  const theadFilterTable = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("A/c Type") },

    { width: "5%", name: t(" COG Code") },
    { width: "5%", name: t("COG Name") },
    { width: "5%", name: t("Account Name") },
    { width: "5%", name: t("Pre.For Pay") },

    { width: "5%", name: t("IsBank") },
    { width: "5%", name: t("Currency") },

    { width: "5%", name: t("Trade Type") },
    { width: "5%", name: t(" Entry By") },

    { width: "5%", name: t("Entry Date Time") },
    { width: "5%", name: t("Bank A/C") },

    { width: "5%", name: t("Active") },
    { width: "5%", name: t("Action") },
  ];

  const theadAddBank = [
    { width: "5%", name: t("Bank Account") },
    { width: "5%", name: t("Bank Name") },
    { width: "5%", name: t("Branch Name") },
    { width: "5%", name: t("Bank Address") },
    { width: "5%", name: t("Branch Code") },
    { width: "5%", name: t("Swift Code") },
    { width: "5%", name: t("Delete") },
  ];

  const handleBindFilterData = async (ind) => {
    const onedata = updateData[ind];
    console.log(onedata, "the one data is");
    let apiResp = await bindCOGGroupsBackendData();

    if (apiResp?.success) {
      const filteredData = apiResp?.data?.filter(
        (val) => val?.AccountTypeID === Number(values?.filter?.value)
      );
      setTableFilterData(filteredData);
    } else {
      console.log("Some error occurred");
    }
  };

  const bindCOGBankData = async () => {
    let apiResp = await BindCOGBankDetails();
    if (apiResp.success) {
      const BindCOGName = filterByTypes(
        apiResp?.data,
        [1],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      const BindAcountType = filterByTypes(
        apiResp?.data,
        [2],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      const BindCurrency = filterByTypes(
        apiResp?.data,
        [3],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      const BindBank = filterByTypes(
        apiResp?.data,
        [4],
        ["TypeID"],
        "TextField",
        "ValueField"
      );
      const BindBranch = filterByTypes(
        apiResp?.data,
        [5],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      setDropDownState((val) => ({
        BindAcountType: BindAcountType,
        BindCOGName: BindCOGName,
        BindCurrency: BindCurrency,
        BindBank: BindBank,
        BindBranch: BindBranch,
      }));
    }
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    if (
      !values.acountNumber ||
      !values.bank ||
      !values.branch ||
      !values?.bankAddress ||
      !values?.swiftBranchCode
    ) {
      notify("Please fill in required fields", "error");
      return;
    }

    setAddBankData((prevData) => [
      ...prevData,
      {
        BankAccount: values.acountNumber,
        BankName: values?.bank,
        BranchName: values?.branch,
        BankAddress: values.bankAddress,
        BranchCode: values.branchCode,
        SwiftCode: values.swiftBranchCode,
      },
    ]);

    // Clear input fields
    // setValues({
    //   accountNumber: "",
    //   bank: "",
    //   branch: "",
    //   bankAddress: "",
    //   branchCode: "",
    //   swiftBranchCode: "",
    // });
  };

  console.log("the bank data is", AddBankData);

  // const [addBankData, setAddBankData] = useState([]);

  const combinedBankData = [...bankAPIdata, ...AddBankData];
  console.log("the both state data is", AddBankData, bankAPIdata);

  console.log("the combinedBankData data is", combinedBankData);

  const handleSaveNewAccountType = async (data) => {
    let payload = {
      accountType: data?.AccountOfReference,
    };
    let apiResp = await SaveNewAccountType(payload);

    if (apiResp?.success) {
      notify(`${apiResp?.message}`, "success");
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      bindCOGBankData();
    } else {
      console.log("Some error occurred");
      notify(`${apiResp?.message}`, "error");
    }
  };

  const handleBindglobalresources = async () => {
    let apiResp = await Bindglobalresources();

    if (apiResp?.success) {
      console.log("the api response inside", apiResp);
      const data = apiResp?.data?.map((val) => {
        return val?.Value;
      });
      setGlopbalResources(data);

      let checkboxLogic = data?.filter((val) => val === "1");
      console.log("the checkBox logic", checkboxLogic);
      console.log("the globalResources value is in", data);
    } else {
      console.log("Some error occurred");
      notify(`${apiResp?.message}`, "error");
    }
  };

  // const handleBindglobalresources = ()=> async ()=>{
  //   debugger
  //   let apires = await Bindglobalresources();
  //   console.log("out side the console",apires);
  //   if(apires?.success){
  //     console.log("the api response inside",apires);

  //   }
  // }
  const handleShowTable = async (CoaId) => {
    let payloaddata = {
      filterType: "3",
      coaID: CoaId,
      // coaName: coaName,
    };
    let apiResp = await handlbindCOGGroupsBackendData(payloaddata);
    console.log(apiResp?.data);
    console.log("the coid is", CoaId);

    if (apiResp?.success) {
      setBankApiData(apiResp?.data);
    } else {
      console.log("Some error occurred");
    }
  };
  const [oneData, setOnedata] = useState([]);

  const handleUpdateData = async (filterType, CoaId, coaName, id) => {
    console.log("the bankpi data is", bankAPIdata);
    const fetchOneData = tableFilterData[id];
    setOnedata(fetchOneData);
    console.log("the fetch one data is", fetchOneData);
    // bankAPIdata
    let payload = {
      filterType: filterType,
      coaID: CoaId,
      coaName: coaName,
    };
    setStoreCoid(CoaId);
    handleShowTable(CoaId);
    // setBankApiData("");
    // handleShowTable();

    let apiResp = await bindCOGGroupsBackendData(payload);

    if (apiResp?.success) {
      const filteredData = apiResp?.data?.filter(
        (val) => val?.AccountTypeID === Number(values?.filter?.value)
      );
      setValues((val) => ({
        ...val,
        TypeOfReference: { value: String(filteredData[id]?.AccountTypeID) },
        cogName: { value: String(filteredData[id]?.GroupCode) },
        acountName: fetchOneData?.AccountName,
        currency: { value: String(filteredData[id]?.CurrencyCode) },
        tradeType: { value: String(filteredData[id]?.TradeTypeID) },
      }));
      setUpdateData(filteredData);
    } else {
      console.log("Some error occurred");
    }
  };

  console.log("the one data value is", oneData);

  useEffect(() => {
    // bindListData()
    bindCOGBankData();
    handleBindFilterData();
    handleBindglobalresources();
  }, [values?.filter?.value]);

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleActionChartOfAccount = async (coaid, isAvtive) => {
    let payload = {
      coaid: coaid,
      isActive: isAvtive,
    };
    let apiResp = await ActionChartOfAccount(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      handleBindFilterData();
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const handleSaveChartOfAccount = async (isUpdate, coaID) => {
    console.log("the combinedBankData data is in api", combinedBankData);
    let payload = {
      accountTypeID: values?.TypeOfReference?.value || "",
      accountName: values?.acountName || "",
      groupCode: values?.cogName?.value || "",
      currencyCode: values?.currency?.value || "",
      isPreferredForPayment: values?.IsPreferredForPayment,
      isBank: values?.IsBank,
      tradeTypeID: values?.tradeType?.value || "",
      tradeType: "",
      isUpdate: isUpdate,
      coaid: storeCoid || 0,

      bankData: combinedBankData.map((bank) => ({
        bankAccount: bank.BankAccount || "",
        bankCode: bank?.BankName?.value || "",
        branchCode: bank?.BranchName?.value || "",
        bankAddress: bank.BankAddress || "",
        bankBranchCode: bank.BankBranchCode || "",
        swiftCode: bank.SwiftCode || "",
      })),
    };

    try {
      const apiResp = await SaveChartOfAccount(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        bindCOGBankData();
        handleBindFilterData();
        setValues({});
        setAddBankData([]);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      IsPreferredForPayment: oneData?.IsPreferredForPayment === 1 ? 1 : 0,
      IsBank: oneData?.IsBank === 1 ? 1 : 0,
    }));
  }, [oneData]);

  // Handle checkbox changes
  const handleCheckboxChange = (field) => {
    setValues((prev) => ({
      ...prev,
      [field]: prev[field] === 1 ? 0 : 1,
    }));
  };

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div>
          <div className="patient_registration card">
            <Heading
              title={t("Chart of Account Detail")}
              isBreadcrumb={false}
            />
            <div className="row p-2">
              <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                <div className="d-flex">
                  <ReactSelect
                    placeholderName={t("Account Type")}
                    id="ReferenceType"
                    searchable={true}
                    respclass="w-100 pr-2"
                    name="TypeOfReference"
                    value={values?.TypeOfReference?.value}
                    handleChange={(name, e) => handleReactChange(name, e)}
                    dynamicOptions={dropDownState?.BindAcountType}
                    requiredClassName={`required-fields`}
                  />

                  <div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        handleModel(
                          t("Add Account Type"),
                          "20vw",
                          "AccountType",
                          true,
                          <AccountTypeModel
                            handleChangeModel={handleChangeModel}
                            inputData={{
                              userID: userData?.employeeID,
                            }}
                          />,
                          // handleReferenceTypeAPI
                          // onClick={() => setIsFalse(!isFalse)}
                          handleSaveNewAccountType
                        )
                      }
                      type="button"
                    >
                      <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                    </button>
                  </div>
                </div>
              </div>
              <ReactSelect
                placeholderName={t("COG Name")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                id={"cogName"}
                name={"cogName"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={dropDownState?.BindCOGName}
                value={values?.cogName?.value}
                requiredClassName={`required-fields`}
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="AC_Name"
                name="acountName"
                value={values?.acountName ? values?.acountName : ""}
                onChange={handleChange}
                lable={t("Acount Name")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <ReactSelect
                placeholderName={t("Currency")}
                searchable={true}
                respclass="col-xl-1 col-md-4 col-sm-6 col-12"
                id={"currency"}
                name={"currency"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={dropDownState?.BindCurrency}
                value={values?.currency?.value}
                requiredClassName={`required-fields`}
              />
              <ReactSelect
                placeholderName={t("Trade Type")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                id={"tradeType"}
                name={"tradeType"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={TradeType}
                value={values?.tradeType?.value}
                requiredClassName={`required-fields`}
              />
              {values?.cogName?.value === "1002004" && (
                <div className="d-flex">
                  <div className="d-flex m-2">
                    <input
                      type="checkbox"
                      name="IsPreferredForPayment"
                      checked={values.IsPreferredForPayment === 1}
                      onChange={() =>
                        handleCheckboxChange("IsPreferredForPayment")
                      }
                    />
                    <label className="ml-1">Preferred For Payment</label>
                  </div>
                  <div className="d-flex m-2">
                    <input
                      type="checkbox"
                      name="IsBank"
                      checked={values.IsBank === 1}
                      onChange={() => handleCheckboxChange("IsBank")}
                    />
                    <label className="ml-1">Is Bank</label>
                  </div>
                </div>
              )}
              {/* {values?.cogName?.value === "1002004" ? (
                <div className="d-flex">
                  <div className="d-flex m-2">
                    <input
                      type="checkbox"
                      name="isPreferredForPayment" 
                    />
                    <label className="ml-1">Preferred For Payment</label>
                  </div>
                  <div className="d-flex m-2">
                    <input
                      type="checkbox"
                      name="IsBank" 
                    />
                    <label className="ml-1">Is Bank</label>
                  </div>
                </div>
              ) : (
                ""
              )} */}
            </div>
          </div>
          <div className="patient_registration card">
            <Heading
              title={t("Bank Detail")}
              // isBreadcrumb={false}
            />
            <div className="row p-2">
              <Input
                type="text"
                className="form-control required-fields"
                id="AC_Number"
                name="acountNumber"
                value={values?.acountNumber ? values?.acountNumber : ""}
                onChange={handleChange}
                lable={t("Bank A/C")}
                placeholder=""
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />

              <ReactSelect
                placeholderName={t("Bank")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                requiredClassName="required-fields"
                id={"bank"}
                name={"bank"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={[
                  { value: "0", label: "Select" },
                  ...handleReactSelectDropDownOptions(
                    dropDownState?.BindBank,
                    "label",
                    "value"
                  ),
                ]}
                value={values?.bank?.value}
              />

              <ReactSelect
                placeholderName={t("Branch")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                id={"branch"}
                name={"branch"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={[
                  { value: "0", label: "Select" },
                  ...handleReactSelectDropDownOptions(
                    dropDownState?.BindBranch,
                    "label",
                    "value"
                  ),
                ]}
                requiredClassName="required-fields"
                value={values?.branch?.value}
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="BankAddress"
                name="bankAddress"
                value={values?.bankAddress ? values?.bankAddress : ""}
                onChange={handleChange}
                lable={t("Bank Address")}
                placeholder=""
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="BranchCode"
                name="branchCode"
                value={values?.branchCode ? values?.branchCode : ""}
                onChange={handleChange}
                lable={t("Branch Code")}
                placeholder=""
                respclass="col-xl-1 col-md-3 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="SwiftBranchCode"
                name="swiftBranchCode"
                value={values?.swiftBranchCode ? values?.swiftBranchCode : ""}
                onChange={handleChange}
                lable={t("Swift Code/Branch BIC")}
                placeholder=""
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              {/* <div className="col-xl-12 col-md-4 col-sm-6 col-12 d-flex justify-content-end mt-2"> */}
              <button
                className="btn btn-lg btn-primary"
                onClick={handleAddBank}
              >
                {t("Add")}
              </button>
              {/* </div> */}
            </div>

            {combinedBankData.length > 0 && (
              <div className="">
                <Tables
                  thead={theadAddBank}
                  tbody={combinedBankData?.map((val, index) => ({
                    BankAccount: val.BankAccount,
                    BankName: val.BankName,
                    BranchName: val.BranchName,
                    BankAddress: val.BankAddress,
                    BranchCode: val.BranchCode,
                    SwiftCode: val.SwiftCode,
                    Delete: (
                      <span
                        onClick={() => handleDeleteBank(index)}
                        style={{ color: "red", fontSize: "25px" }}
                      >
                        <FaTrash />
                      </span>
                    ),
                  }))}
                  tableHeight={"scrollView"}
                  style={{ padding: "2px" }}
                />
              </div>
            )}
          </div>
          <div className="mt-2 d-flex justify-content-end">
            {updateData?.length > 0 ? (
              <button
                className="btn btn-sm btn-primary mr-1"
                onClick={() => handleSaveChartOfAccount(1)}
              >
                {t("Update")}
              </button>
            ) : (
              <button
                onClick={() => handleSaveChartOfAccount(0)}
                className="btn btn-lg  px-5 btn-primary mr-1 text-bold "
              >
                {t("Save")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 patient_registration card">
          <Heading
            title={t("Bank Detail")}
            secondTitle={
              <>
                <ReactSelect
                  id="filter"
                  placeholderName={t("Filter")}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
                  name="filter"
                  value={values?.filter?.value}
                  handleChange={(name, e) => handleReactChange(name, e)}
                  dynamicOptions={dropDownState?.BindAcountType?.filter(
                    (val, ind) => val?.value !== "1"
                  )}
                  requiredClassName={`required-fields`}
                />
              </>
            }
            // isBreadcrumb={false}
          />
          {/* <div className="row p-2"> */}
          {/* <ReactSelect
              placeholderName={t("Filter")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"filter"}
              name={"filter"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              // dynamicOptions={dropDownState?.GetBindAllCenter}
              value={values?.filter?.value}
            /> */}

          {/* <div className="w-100 d-flex justify-content-end mt-2">
              <ReactSelect
                id="filter"
                placeholderName={t("Filter")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                name="filter"
                value={values?.filter?.value}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={dropDownState?.BindAcountType?.filter(
                  (val, ind) => val?.value !== "1"
                )}
                requiredClassName={`required-fields`}
              />
            </div> */}
          {tableFilterData.length > 0 && (
            <div className="">
              <Tables
                thead={theadFilterTable}
                tbody={tableFilterData?.map((val, index) => ({
                  sno: index + 1,
                  AcType: val?.AccountTypeName,
                  GogCode: val?.GroupCode,
                  GogName: val?.GroupName,
                  Accountname: (
                    <span
                      onDoubleClick={() => {
                        handleUpdateData("3", val?.COAID, "", index);
                      }}
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      {val?.AccountName}
                    </span>
                  ),
                  PrePay: val?.IsPreferredForPayment == 1 ? "Yes" : "No",
                  IsBank: val?.IsBank == 1 ? "Yes" : "No",
                  Currency: val?.CurrencyCode,
                  TradeType: val?.TradeType,
                  EntryBy: val?.EntryBy,
                  EntryDate: val?.EntryDate,
                  TimeBank: "",
                  Active: val?.IsActive == 1 ? "Yes" : "No",
                  Action:
                    val?.IsActive == 1 && val?.AccountTypeID > Number(6) ? (
                      <span
                        onClick={() =>
                          handleActionChartOfAccount(val?.COAID, "0")
                        }
                        style={{ color: "red", fontWeight: "bold" }}
                      >
                        De-Active
                      </span>
                    ) : (
                      <span
                        onClick={() =>
                          handleActionChartOfAccount(val?.COAID, "1")
                        }
                        style={{ color: "red", fontWeight: "bold" }}
                      >
                        Active
                      </span>
                    ),
                }))}
                tableHeight={"scrollView"}
                isSearch={true}
                style={{ height: "60vh", padding: "2px" }}
              />
            </div>
          )}
          {/* </div> */}
        </div>
      </div>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          handleAPI={handleModelData?.handleInsertAPI}
          setModalData={setModalData}
          modalData={modalData}
        >
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  );
};

export default index;
