
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { ImCross } from "react-icons/im";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import { BindBranchCentre, BindHisDerpatments, BindMappingData, BindScreenControl, BindTransactionTypes, BindVoucherBillingScreenControls, ConSaveMapping, deleteChangeStatus, FinanceConsumptionSaveMapping, SaveMapping } from "../../../../networkServices/finance";
import CopyMapping from "./CopyMapping";
import Modal from "../../../../components/modalComponent/Modal";
import CancelButton from "../../../../components/UI/CancelButton";
const Consumption = () => {
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const [modalData, setModalData] = useState({ visible: false })
  const localData = useLocalStorage("userData", "get")
  const [tbodyData, setTbodyData] = useState([]);

  const [values, setValues] = useState({
    allCenter: {
      CentreID: 1,
      CentreName: "MOHANDAI OSWAL HOSPITAL",
      IsDefault: 0,
      label: "MOHANDAI OSWAL HOSPITAL", value: 1
    },
    department: "",
    transactionType: "",
    fDepartment: {},
    chartofAc:  {},
    storeType: { label: "Medical Items", value: "STO00001" },

  });

  const [dropDownState, setDropDownState] = useState({
    Department: [],
    GetBindAllCenter: [],
    TransactionType: [],
    FinalDepartment: [],
    ChartOfAccount: [],
  });
  const GetBindAllCenter = async () => {
    try {
      const GetBindAllCenter = await BindBranchCentre();
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
  const GetDepartment = async () => {
    try {
      const response = await BindHisDerpatments();
      setDropDownState((val) => ({
        ...val,
        Department: handleReactSelectDropDownOptions(
          response?.data,
          "RoleName",
          "DeptLedgerNo"
        ),
      }));
      setValues((preV) => ({
        ...preV,
        department: response?.data[0]
      }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const getTransactionType = async () => {
    try {
      const response = await BindTransactionTypes();
      setDropDownState((val) => ({
        ...val,
        TransactionType: handleReactSelectDropDownOptions(
          response?.data,
          "TransactionType",
          "TransactionTypeID"
        ),
      }));
      setValues((preV) => ({
        ...preV,
        transactionType: response.data[0]
      }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const FinDepartment = async () => {
    try {
      const response = await BindScreenControl();
      console.log("response",response)
      var responseData = response?.data?.filter((val) => val?.TypeID === 1 && val?.TypeCode == 'D');
      setDropDownState((val) => ({
        ...val,
        FinalDepartment: handleReactSelectDropDownOptions(
          responseData,
          "TextField",
          "DeptCode"
        ),
      }));
      // setValues((preV) => ({
      //   ...preV,
      //   fDepartment: response.data[0]
      // }))
      let responsechartOfAc = response?.data?.filter((val) => val?.TypeID === 2);
      setDropDownState((val) => ({
        ...val,
        ChartOfAccount: handleReactSelectDropDownOptions(
          responsechartOfAc,
          "TextField",
          "DeptCode"
        ),
      }));
      // setValues((preV) => ({
      //   ...preV,
      //   chartofAc: responsechartOfAc[0]
      // }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleBindMappingData = async () => {
    let apiResp = await BindMappingData()
    if (apiResp?.success) {
      setTbodyData(apiResp?.data);
    } else {

    }
  }
// console.log("values",values)

  // const handleSaveMapping = async () => {
  //   const payoload = {
  //     centreID: String(values?.allCenter?.CentreID),
  //     hisDepartment: String(values?.department?.DeptLedgerNo),
  //     transactionType: String(values?.transactionType?.TransactionTypeID),
  //     finDepartment: String(values?.fDepartment?.DeptCode),
  //     coaid: String(values?.chartofAc?.ValueField ||  values?.chartofAc?.DeptCode),
  //     storeType: String(values?.storeType?.value)
  //   }
  //   try {
  //     const apiResp = await FinanceConsumptionSaveMapping(payoload);
  //     if (apiResp.success) {
  //       notify(apiResp?.message, "success");
  //       handleBindMappingData()
  //     } else {
  //       notify(apiResp?.message, "error");
  //     }
  //   } catch (error) {
  //     notify("An error occurred while fetching data", "error");
  //   }
  // };

  const handleSaveMapping = async () => {
    // Extracting values
    const centreID = values?.allCenter?.CentreID;
    const hisDepartment = values?.department?.DeptLedgerNo;
    const transactionType = values?.transactionType?.TransactionTypeID;
    const finDepartment = values?.fDepartment?.DeptCode;
    const coaid = values?.chartofAc?.ValueField || values?.chartofAc?.DeptCode;
    const storeType = values?.storeType?.value;
  
    // Field-wise validation with specific error messages
    if (!centreID) {
      notify("Centre ID is required!", "error");
      return;
    }
    if (!hisDepartment) {
      notify("HIS Department is required!", "error");
      return;
    }
    if (!transactionType) {
      notify("Transaction Type is required!", "error");
      return;
    }
    if (!finDepartment) {
      notify("Finance Department is required!", "error");
      return;
    }
    if (!coaid) {
      notify("Chart of Accounts (COA) is required!", "error");
      return;
    }
    if (!storeType) {
      notify("Store Type is required!", "error");
      return;
    }
  
    const payload = {
      centreID: String(centreID),
      hisDepartment: String(hisDepartment),
      transactionType: String(transactionType),
      finDepartment: String(finDepartment),
      coaid: String(coaid),
      storeType: String(storeType)
    };
  
    try {
      const apiResp = await FinanceConsumptionSaveMapping(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleBindMappingData();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };
  


  const handleDelete = async (Id) => {

    const payoload = {
      ID: Id,

    }
    try {
      const apiResp = await deleteChangeStatus(payoload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleBindMappingData()
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };
  useEffect(() => {
    GetDepartment()
    GetBindAllCenter();
    getTransactionType()
    // bindListData()
    FinDepartment()
    handleBindMappingData();
  }, [])


  const handleReactChange = (name, e, key) => {
    console.log("name", name, e)
    setValues((val) => ({ ...val, [name]: e }));
  };
  const THEAD = [


    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("Transaction Type") },
    { width: "5%", name: t("Centre Name") },
    { width: "5%", name: t("HIS Department") },
    { width: "5%", name: t("Finance Department") },
    { width: "5%", name: t("Account Name") },
    { width: "5%", name: t("Store Type") },
    { width: "5%", name: t("Delete") },


  ];

  const handleClickMapping = () => {

    setModalData({
      visible: true,
      width: "50vw",
      Heading: "60vh",
      label: t("Select Report Type"),
      footer: <></>,
      Component: <CopyMapping
        //  valuesData={values}
        setModalData={setModalData}
      />,

    })

  }
  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Mapping Criteria")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            isDisabled={true}
            placeholderName={t("Centre")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={values?.allCenter?.value}
          />
          <ReactSelect
            placeholderName={t("HIS Department")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"department"}
            name={"department"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.Department}
            value={values?.department?.DeptLedgerNo}
          />
          <ReactSelect
            placeholderName={t("Transaction Type")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"transactionType"}
            name={"transactionType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.TransactionType}
            value={values?.transactionType?.TransactionTypeID}
          />



          <ReactSelect
            placeholderName={t("Fin Department")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"fDepartment"}
            name={"fDepartment"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            // dynamicOptions={dropDownState?.FinalDepartment}
            dynamicOptions= {[
              { label: "Select", DeptCode: "0" },
              ...(dropDownState?.FinalDepartment || [])
            ]}
            value={values?.fDepartment?.DeptCode}
          />
          <ReactSelect
            placeholderName={t("Chart of Account")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"chartofAc"}
            name={"chartofAc"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions= {[
              { label: "Select", DeptCode: "0" },
              ...(dropDownState?.ChartOfAccount || [])
            ]}
            // dynamicOptions={dropDownState?.ChartOfAccount}
            value={values?.chartofAc?.DeptCode}
          />
          <ReactSelect
            requiredClassName={"required-fields"}
            placeholderName={t("Store Type")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"storeType"}
            name={"storeType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "Medical Items", value: "STO00001" },
              { label: "General Items", value: "STO00002" },

            ]}
            value={values?.storeType?.value}

          />

          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12 "> */}
         
        </div>
        <div className="row mb-2 mr-2 d-flex justify-content-end">
            <button
              className="btn btn-sm btn-primary mr-1"
              onClick={handleSaveMapping}
            >
              {t("Save")}
            </button>
            <button
              className="btn btn-sm btn-primary mr-1"
              onClick={handleClickMapping}
            >
              {t("Copy Mapping")}
            </button>
          </div>
      </div>

      <div className="card">
        <div className=" mt-2 spatient_registration_card">
          <Heading title={t("Consumption/Adjustment(+)/Process(-) Mapping Details")} isBreadcrumb={false} />
          <Tables
            isSearch={true}


            thead={THEAD}
            tbody={tbodyData?.map((val, index) => ({

              sno: index + 1,
              TransactionType: val?.TransactionType,
              CentreName: val?.CentreName,
              hisDepartment: val?.RoleName,
              FinanceDepartment: val?.FinancDeparment,
              AccountName: val?.AccountName,
              StoreType: val?.StoreType,
              Delete: <span onClick={() => handleDelete(val?.ID)}>
                {/* <CancelButton onClick={()=>handleDelete(val?.ID)} />  */}
                <i className="fa fa-trash text-danger" /></span>,

            }))}

            style={{ maxHeight: "60vh" }}
          />
        </div>
      </div>
      {modalData?.visible && (
        <Modal
          visible={modalData?.visible}
          setVisible={() => { setModalData({ visible: false }) }}
          modalData={modalData?.URL}
          modalWidth={modalData?.width}
          Header={modalData?.label}
          buttonType="button"
          footer={modalData?.footer}
        >
          {modalData?.Component}
        </Modal>
      )}
    </div>

  )
}

export default Consumption