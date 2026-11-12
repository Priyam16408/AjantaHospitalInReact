import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import { exportToExcel } from "../../../utils/exportLibrary";

import {
  SaveVendor,
  SearchVendor,
  VendorReportList,
} from "../../../networkServices/InventoryApi";
import VendorDetailTable from "../../../components/UI/customTable/MedicalStore/VendorDetailTable";
import Modal from "../../../components/modalComponent/Modal";
import ViewVendorMasterModal from "../../../components/modalComponent/Utils/MedicalStore/ViewVendorMasterModal";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { notify } from "../../../utils/utils";

const VendorDetail = () => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    console.log("TableData", tableData);
  }, [tableData]);
  const [errors, setErrors] = useState({});
  const [ReportVisible, setReportVisible] = useState(false);
  const initialPayload = {
    SupplierName: "",
    SupplierType: "GENERAL",
    Category: "Medical Item",
    SupplierCode: "",
    Name: "",
    Address1: "",
    Address2: "",
    Address3: "",
    PostalCode: "",
    CreditDays: "",
    City: "",
    Country: "",
    ContactPerson: "",
    TelephoneNo: "",
    EMail: "",
    GSTIN: "",
    AccountNo: "",
    PaymentType: "CASH",
    BankName: "",
    ShipmentDetail: "",
    TINNo: "",
    PanNo: "",
    State: "",
    IsInsuranceProvider: 0,
    isAssetActive: "",
    SupplierCurrency: "",
    DLNo: "",
    // termsList: [
    //   {
    //     termsId: 0,
    //     termsName: "",
    //   },
    // ],
    termsList: [],
  };

  const [payload, setPayload] = useState({ ...initialPayload });
  useEffect(() => {
    console.log("TABULAR DATA", tableData);
  }, [tableData]);
  const [selectedIds, setSelectedIds] = useState([]);
  useEffect(() => {
    console.log("SELECTED IDS FROM USEEFFECT", selectedIds);
  }, [selectedIds]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("name", name, "value", value, "type", type, "checked", checked);
    setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
  };

  //   const handeAdd = (item, termsListData) => {
  //     console.log("Before Update - selectedIds:", selectedIds);
  //     console.log("Received termsListData:", termsListData);

  //     if (!termsListData || termsListData.length === 0) {
  //         console.warn("⚠️ termsListData is empty, selectedIds will not be updated!");
  //         return;
  //     }

  //     setSelectedIds(termsListData);
  //     console.log("After Update - selectedIds:", selectedIds);

  //     setPayload(item);
  // };

  // const handeAdd = (item, termsListData) => {
  //   console.log("Before Update - selectedIds:", selectedIds);
  //   console.log("Received termsListData:", termsListData);

  //   // Retain previous selectedIds if no new termsListData is provided
  //   const updatedIds =
  //     termsListData && termsListData.length > 0 ? termsListData : selectedIds;

  //   setSelectedIds(updatedIds);
  //   console.log("After Update - selectedIds:", selectedIds);

  //   setPayload(item);
  // };

  const handeAdd = (item, termsListData) => {
    console.log("Before Update - selectedIds:", selectedIds);
    console.log("Received termsListData:", termsListData);

    if (termsListData && termsListData.length > 0) {
      setSelectedIds([...termsListData]); // Ensure direct update
    }

    setPayload(item);
  };

  // Ensure selectedIds updates are logged
  useEffect(() => {
    console.log("Updated selectedIds:", selectedIds);
  }, [selectedIds]);

  const handleSearch = async () => {
    const suppliername = payload?.SupplierName
      ? String(payload?.SupplierName)
      : "";
    try {
      if (payload?.SupplierName === "") {
        notify("Supplier Name is required", "error");
      } else {
        const response = await SearchVendor(suppliername);
        console.log("RESPONSE FROM SUPPLIER", response);
        // //debugger
        if (response.success) {
          setTableData(response?.data);
          notify(response.message, "success");
          // console.log("Data after save" , data)
        } else {
          notify(response.message, "error");
        }
      }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };

  const handleReport = async () => {
    const suppliername = {
      supplierName: payload?.SupplierName || "",
    };

    try {
      const response = await VendorReportList(suppliername);
      if (response?.success && response.data.length > 0) {
        exportToExcel(
          ExceldataFormatter(response.data),
          "Supplier Master List"
        );
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error"); // Fixed error message type
      }
    } catch (error) {
      notify("Something Went Wrong", "error");
    }
  };

  const ExceldataFormatter = (DataList) => {
    const HardCopy = JSON.parse(JSON.stringify(DataList));

    return HardCopy?.map((ele) => {
      return { ...ele };
    });
  };

  const thead = [
    { name: t("S.No."), width: "3%" },
    t("Supplier Type"),
    t("Category"),
    t("Name"),
    t("GST No"),
    t("Address1"),
    t("Address2"),
    t("Address3"),
    { name: t("City"), width: "5%" },
    { name: t("Country"), width: "5%" },
    { name: t("Mobile Number"), width: "5%" },
    { name: t("Edit"), width: "5%" },
  ];

  const handleCancle = () => {
    setReportVisible(false);
  };
  const handleSaveManufacture = async (data) => {
    // debugger;
    console.log("Before Saving - selectedIds:", selectedIds);
    // useEffect(() => {
    //   console.log("Updated selectedIds:", selectedIds);
    // }, [selectedIds]);

    // if (!selectedIds || selectedIds.length === 0) {
    //   console.error("selectedIds is empty before saving! Fixing...");
    //   return;
    // }
    try {
      const Itempayload = {
        supplierName: payload.Name,
        storeID: "",
        contactPerson: payload.ContactPerson || "",
        address1: payload.Address1 || "",
        address2: payload.Address2 || "",
        address3: payload.Address3 || "",
        country: String(payload?.Country),
        city: payload.City || "",
        area: "",
        pin: payload.PostalCode || "",
        telephone: payload.TelephoneNo || "",
        fax: "",
        mobile: payload.TelephoneNo || "",
        drugLicence: payload.DLNo || "",
        vatNo: payload.TINNo,
        tinNo: payload.TINNo || "",
        vendorCode: payload?.SupplierCode || "",
        vendorType: payload?.SupplierType || "",
        vendorCategory: payload?.Category || "",
        bank: payload.BankName,
        accountNo: payload.AccountNo || "",
        paymentMode: payload.PaymentType || "",
        shipmentDetail: payload.ShipmentDetail || "",
        email: payload?.EMail,
        lastUpdatedBy: "",
        updateDate: "", //2025-01-07T06:40:20.192Z,
        ipAddress: "",
        creditDays: payload.CreditDays || "",
        supplierTypeID: 0,
        isActive: 1,
        venGSTINNo: payload.GSTIN,
        deptLedgerNo: "",
        stateID: payload?.State || 0,
        countryID: payload?.Country,
        isAsset: payload?.isAssetActive === 1 ? true : false,
        coA_ID: 0,
        vatType: "",
        currency: payload?.SupplierCurrency || "",
        isInsurance: payload?.IsInsuranceProvider === 1 ? true : false,
        dlNo: payload.DLNo || "",
        panNo: payload.PanNo || "",
        termsList: selectedIds,
      };
      console.log("Final Payload Before Save:", Itempayload);

      // Validate the Name field
      if (!payload?.Name) {
        notify("Name is required", "error");
        return;
      }

      if (payload?.Name.length < 2) {
        notify("Please enter at least 3 characters", "error");
        return;
      }
      if (!payload?.TelephoneNo) {
        notify("Telephone No. is required", "error");
        return;
      }
      // if (!payload?.City) {
      //   notify("City is required", "error");
      //   return;
      // }

      if (!payload?.City) {
        notify("City is required", "error");
        return;
      }

      // Save manufacture data
      const response = await SaveVendor(Itempayload);

      if (response?.success) {
        notify(response?.message, "success");
        setReportVisible(false);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      notify("An unexpected error occurred. Please try again later.", "error");
    }
  };

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="SupplierName "
            name="SupplierName"
            onChange={handleChange}
            value={payload.SupplierName}
            lable={t("Supplier Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div className=" ">
            <button
              className="btn btn-sm btn-success mx-1 ml-2"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={() => {
                setReportVisible({
                  ReportVisible: true,
                  showData: {},
                });
              }}
            >
              {t("Add New")}
            </button>
            <button
              className="btn btn-sm btn-success mx-1"
              // onClick={handleReport}
              onClick={handleReport}
            >
              {t("Report")}
            </button>
          </div>
        </div>
      </div>
      {console.log("TableData?.details", tableData?.details?.length)}
      {tableData?.details?.length > 0 && (
        <div className="card">
          {console.log("first", tableData?.data)}
          <Heading title={t("Item Details")} />
          <div className="row">
            <VendorDetailTable
              thead={thead}
              tbody={tableData}
              setTableData={setTableData}
              ip={ip}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      )}
      {ReportVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={ReportVisible}
          setVisible={setReportVisible}
          Header={t("Add New Supplier")}
          footer={
            <>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={handleSaveManufacture}
              >
                {t("Save")}
              </button>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={handleCancle}
              >
                {t("Cancel")}
              </button>
            </>
          }
        >
          <ViewVendorMasterModal
            handeAdd={handeAdd}
            payload1={payload}
            setPayload1={payload}
            errors={errors}
            setErrors={setErrors}
            setTableData={setTableData}
          />
        </Modal>
      )}
    </>
  );
};

export default VendorDetail;
