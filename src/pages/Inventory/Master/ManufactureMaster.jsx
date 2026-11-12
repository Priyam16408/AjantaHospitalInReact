import React, { useCallback, useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import {
  ManufactureReportList,
  MasterSearchItem,
  SaveManufacture,
} from "../../../networkServices/InventoryApi";
import ManufactureDetailTable from "../../../components/UI/customTable/MedicalStore/ManufactureDetailTable";
import Modal from "../../../components/modalComponent/Modal";
import ViewManufactureMasterModal from "../../../components/modalComponent/Utils/MedicalStore/ViewManufactureMasterModal";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { filterByTypes, notify } from "../../../utils/utils";
import { exportToExcel } from "../../../utils/exportLibrary";
import IconsColor from "../../../utils/IconsColor";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  CentreWiseCacheByCenterID,
  CentreWisePanelControlCache,
} from "../../../store/reducers/common/CommonExportFunction";

const ManufactureMaster = () => {
  const [t] = useTranslation();
  const localdata = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [ReportVisible, setReportVisible] = useState(false);
  const dispatch = useDispatch();
  const initialPayload = {
    Name: "",
    manufactureCode: "",
    Address1: "",
    Address2: "",
    Address3: "",
    PostalCode: "",
    City: "",
    State:"",
    District:"",
    Country: "",
    ContactPerson: "",
    TelephoneNo: "",
    Fax: "",
    EMail: "",
    GSTIN: "",
    isAssetActive: 0,
    // isActive:0,
    isAsset:0,
    ManufacturerName: "",
    StateID:0,
    countryID:0,
    DistrictID:0,
    CityID:0,

  };
  const { BindResource } = useSelector((state) => state?.CommonSlice);

  const CentreWiseCacheByCenterIDAPI = async () => {
    let data = await dispatch(CentreWiseCacheByCenterID({}));
    if (data?.payload?.success) {
      let countryCode = filterByTypes(
        data?.payload?.data,
        [7, BindResource?.BaseCurrencyID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField",
        "STD_CODE"
      );
      let defaultState = filterByTypes(
        data?.payload?.data,
        [8, BindResource?.DefaultStateID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField"
      );
      let defaultDistrict = filterByTypes(
        data?.payload?.data,
        [9, BindResource?.DefaultDistrictID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField"
      );
      let defaultCity = filterByTypes(
        data?.payload?.data,
        [10, BindResource?.DefaultCityID],
        ["TypeID", "ValueField"],
        "TextField",
        "ValueField"
      );
      setValues((val) => ({
        ...val,
        District: values?.District
          ? values?.District
          : defaultDistrict?.length > 0 && defaultDistrict[0]?.label,
        State: values?.State
          ? values?.State
          : defaultState?.length > 0 && defaultState[0]?.label,
        City: values?.City
          ? values?.City
          : defaultCity?.length > 0 && defaultCity[0]?.label,
        Phone_STDCODE: values?.Phone_STDCODE
          ? values?.Phone_STDCODE
          : countryCode?.length
            ? countryCode[0]?.extraColomn
            : "+91",
      }));
    }
  };
  const [payload, setPayload] = useState({ ...initialPayload });

  const { CentreWiseCache, CentreWisePanelControlCacheList } = useSelector(
    (state) => state.CommonSlice
  );


  useEffect(() => {
    if (CentreWiseCache?.length === 0) {
      CentreWiseCacheByCenterIDAPI();
    }
    if (CentreWisePanelControlCacheList?.length === 0) {
      dispatch(
        CentreWisePanelControlCache({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
  };

  const handeAdd = useCallback((item) => {
    console.log("first", item);
    setPayload(item);
  },[]);

  console.log(payload);

  const handleSearch = async () => {
    const manufactureName = payload?.ManufacturerName
      ? String(payload?.ManufacturerName)
      : "";
    try {
      if (payload?.ManufacturerName === "") {
        notify("Manufacturer Name is required", "error");
        return
      } else {
        const response = await MasterSearchItem({ manufactureName });
        const data = response?.data?.map((ele) => ({
          ...ele,
          isAssetActive: 0,
        }));

        if (response?.success && response?.data?.length > 0) {
          notify(response?.message, "success");
          setTableData(data);
        } else {
          notify(response?.message, "error");
          setTableData([]);
        }
      }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  console.log("TABLEDAT", tableData);

  const handleReport = async () => {
    // debugger
    const manufactureName = payload?.ManufacturerName
      ? String(payload?.ManufacturerName)
      : "";
    try {
      const response = await ManufactureReportList({ manufactureName });
      if (response?.success) {
        exportToExcel(response?.data, "Exel");
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };

  const thead = [
    { name: t("S.No."), width: "3%" },
    t("Name"),
    t("Address1"),
    t("Address2"),
    { name: t("Postal Code"), width: "5%" },
    { name: t("City"), width: "5%" },
    { name: t("ContactPerson"), width: "5%" },
    { name: t("TelephoneNo"), width: "5%" },
    { name: t("Fax"), width: "5%" },
    { name: t("Email"), width: "5%" },
    { name: t("Status"), width: "5%" },
    { name: t("User Name"), width: "5%" },
    { name: t("Is Asset"), width: "5%" },
    { name: t("Edit"), width: "5%" },
  ];

  const handleCancle = () => {
    setReportVisible(false);
  };

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!payload?.Name) {
      errors.Name = " Name Is Required";
      errors.id[errors.id?.length] = "Name";
    }
    if (!payload?.TelephoneNo) {
      errors.TelephoneNo = "TelephoneNo Is Required";
      errors.id[errors.id?.length] = "TelephoneNo";
    }

    return errors;
  };

  const handleSaveManufacture = async () => {
    // debugger
    const customerrors = ErrorHandling();
    console.log("Custom Errors", customerrors);
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return false;
    }
    try {
      console.log("Payload fo ItemPayload" , payload)
      const Itempayload = {
        Name:payload?.Name || "",
        manufactureId: 0,
        manufactureName: payload?.Name || "",
        contactPerson: payload?.ContactPerson || "",
        address: payload?.Address1 || "",
        address2: payload?.Address2 || "",
        address3: payload?.Address3 || "",
        phone: payload?.TelephoneNo || "",
        mobile: "",
        fax: payload?.Fax || "",
        email: payload?.EMail || "",
        gstinNo: payload?.GSTIN || "",
        country: payload?.Country || "",
        city: payload?.City || "",
        pinCode: payload?.PostalCode || "",
        dlNo: "",
        tinNo: "",
        isActive: 1,
        manufactureCode: payload?.manufactureCode || "",
        ipAddress: ip,
        isAsset: payload?.isAssetActive || 0,
      };
      console.log("Payload while saving the data",Itempayload);

      const response = await SaveManufacture(Itempayload);
      if (response?.success) {
        notify(response?.message, "success");
        setPayload(initialPayload);
        setReportVisible(false);
        // handleSearch();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      notify("An unexpected error occurred. Please try again later.", "error");
    }
  };

  const ExceldataFormatter = (tableData) => {
    const HardCopy = JSON.parse(JSON.stringify(tableData));
    // debugger;
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      return { ...ele };
    });

    return modifiedResponseData;
  };

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="ManufacturerName "
            name="ManufacturerName"
            onChange={handleChange}
            value={payload.ManufacturerName}
            lable={t("Manufacturer Name")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <div className="col-sm-1 d-flex">
            <button
              className="btn btn-sm btn-success mx-1 px-3"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
            <button
              className="btn btn-sm btn-success mx-1 px-3"
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
              className="btn btn-sm btn-success mx-1 px-3"
              // onClick={() => {
              //   setReportVisible({
              //     ReportVisible: true,
              //     showData: {},
              //   });
              // }}
              // onClick={() =>
              //   exportToExcel(ExceldataFormatter(tableData), "Excel")
              // }

              onClick={handleReport}
            >
              {t("Report")}
            </button>
            {/* {tableData?.length > 0 && (
              <span
                className={`pointer-cursor`}
                onClick={() =>
                  exportToExcel(ExceldataFormatter(tableData), "Excel")
                }
              >
                <IconsColor ColorCode={"Excel"} />
              </span>
            )} */}
            {/* <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleReport}
            >
              Report
            </button> */}
          </div>
        </div>
      </div>
      {console.log("Tableasdlfaksdjf", tableData)}
      {tableData?.length > 0 && (
        <div className="card mt-2">
          <Heading title={"Item Details"} />
          <div className="row">
            <ManufactureDetailTable
              thead={thead}
              tbody={tableData}
              setTableData={setTableData}
              ip={ip}
              handleSearch={handleSearch}
              CentreWiseCache={CentreWiseCache}
            />
          </div>
        </div>
      )}
      {ReportVisible && (
        <Modal
          modalWidth={"1000px"}
          visible={ReportVisible}
          setVisible={setReportVisible}
          Header={t("Add New Manufacture")}
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
                {t("Cancle")}
              </button>
            </>
          }
        >
          {console.log("payload before sending" , CentreWiseCache)}
          <ViewManufactureMasterModal
            CentreWiseCache={CentreWiseCache}
            handeAdd={handeAdd}
            payload1={payload}
            errors={errors}
            setErrors={setErrors}
          />
        </Modal>
      )}
    </>
  );
};

export default ManufactureMaster;
