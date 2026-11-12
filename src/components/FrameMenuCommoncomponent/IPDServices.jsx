import { AutoComplete } from "primereact/autocomplete";
import React, { useEffect, useState } from "react";
import Input from "../formComponent/Input";
import DatePicker from "../formComponent/DatePicker";
import ReactSelect from "../formComponent/ReactSelect";
import { useSelector } from "react-redux";
import { Tabfunctionality } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import {
  BillingGetRateFromFollowedPanel,
  BindCategory,
  BindItem,
  PatientBillingGetDiscount,
  PatientBillingGetPackage,
} from "../../networkServices/BillingsApi";
import { handleReactSelectDropDownOptions } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { GetBindSubCatgeory } from "../../store/reducers/common/CommonExportFunction";
import AddItemTable from "../UI/customTable/billings/AddItemTable";
import moment from "moment";
import { ROUNDOFF_VALUE } from "../../utils/constant";


const IPDServices = ({
  pateintDetails,
  Authorization,
  handleSaveAddItemSuccessfully,
  GetBindBillDetails
}) => {
  const [t] = useTranslation();
  const THEADSERVICEDETAILS = [
    t("Date"),
    t("CPT Code"),
    t("SubCategory Name"),
    t("Service Name"),
    t("Doctor"),
    t("Sample Req. Date"),
    t("Sample Req. Time"),
    t("Rate"),
    t("Quantity"),
    t("Dis(%)"),
    t("Dis Amt"),
    t("Amount"),
    t("Pat. Payable"),
    t("Remark"),
    { name: "U", width: "0%" },
    { name: "R", width: "1%" },
  ];
  
  const { GetBindSubCatgeoryData } = useSelector((state) => state.CommonSlice);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const dispatch = useDispatch();
  const [dropDownState, setDropDownState] = useState([]);
  console.log("dropDownState",dropDownState)
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    Category: { lable: "All", value: "0" },
    SubCategory: { lable: "All", value: "0" },
    Quantity: "",
    fromDate: new Date(),
    toDate: new Date(),
    Remarks: "",
    doctorID: {},
    discount: "",
    amount: "",
    packageID:"0"
  });
 const [packageID, setPackageID] = useState("0");
 console.log("packageID",packageID)
  const [dropDownData, setDropDownData] = useState({
    category: [],
    subcategory: [],
  });

  const handleChange = (e) => {
    debugger
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderApiCall = async () => {
    try {
      const [Category] = await Promise.all([
        BindCategory(12),
        subCategoryBind(12, "0"),
      ]);

      setDropDownData({
        ...dropDownData,
        ["category"]: [
          { label: "All", value: "0" },
          ...handleReactSelectDropDownOptions(
            Category?.data,
            "name",
            "categoryID"
          ),
        ],
      });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const subCategoryBind = async (Type, CategoryID) => {
    try {
      await dispatch(GetBindSubCatgeory({ Type, CategoryID }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  
  const handleReactSelect = async (name, e) => {
    debugger
  if (name === "Category" && e) {
    await subCategoryBind("12", e.value);
  }
  setFormData({ ...formData, [name]: e || null });
};





  const handleBindItem = async (requestbody) => {
    try {
      const response = await BindItem(requestbody);
      return response?.data;
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const search = async (event) => {
    console.log("pateintDetails",pateintDetails)
    console.log("GetBindBillDetails")
    try {
      const item = await handleBindItem({
        scheduleChargeID: Number(pateintDetails?.ScheduleChargeID),
        panelID: Number(pateintDetails?.PanelID),
        ipdCaseTypeID: Number(pateintDetails?.IPDCaseTypeID),
        itemName: event?.query.trim(),
        categoryID: Number(formData?.Category?.value),
        subcategory: Number(formData?.SubCategory?.value),
        requestType: String(""),
        IsInternational:pateintDetails?.IsInternational?pateintDetails?.IsInternational:""
      });
      setItems(item);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const itemTemplate = (item) => {
    return (
      <div
        className="p-clearfix"
        // onClick={() => validateInvestigation(item, 0, 0, 1, 0)}
      >
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TypeName}
        </div>
      </div>
    );
  };

  const handlePatientBillingGetDiscount = async (payload) => {
    try {
      const response = await PatientBillingGetDiscount(payload);
      return response;
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleAddCountDateIteration = (formDate, toDate) => {
    const diffCount =
      toDate.startOf("day").diff(formDate.startOf("day"), "days") + 1;
    return diffCount;
  };

  const handleBillingGetRateFromFollowedPanel = async (
    ItemID,
    PanelID,
    IPDCaseTypeID,
    IsInternational
  ) => {
    debugger
    try {
      const response = await BillingGetRateFromFollowedPanel(
        ItemID,
        PanelID,
        IPDCaseTypeID,IsInternational
      );
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleAddItem = async (e) => {
    const { value } = e;
    try {
      const getDiscount = await handlePatientBillingGetDiscount({
        panelID: String(pateintDetails?.PanelID),
        itemID: String(value?.ItemID),
        patientTypeID: String(pateintDetails?.PatientTypeID),
        membershipNo: String(pateintDetails?.MemberShipCardNo),
      });
// debugger
      const GetRateFromFollowedPanel =
        await handleBillingGetRateFromFollowedPanel(
          value?.ItemID,
          pateintDetails?.PanelID,
          pateintDetails?.IPDCaseTypeID,
          pateintDetails?.IsInternational
        );

      const loopCount = handleAddCountDateIteration(
        moment(formData?.fromDate),
        moment(formData?.toDate)
      );
      const addTableData = [];
      for (let i = 0; i < loopCount; i++) {
        const currentDate = moment(formData?.fromDate);
        const newDate = currentDate.add(i, "days").format("DD-MMM-YYYY");

        const [reponseData] = getDiscount?.data;

        const addObj = {
          ...value,
          ...reponseData,

          ipdPanelDiscPercent: Number(reponseData?.ipdPanelDiscPercent).toFixed(
            ROUNDOFF_VALUE
          ),

          Date: newDate,

          ...pateintDetails,
        };

        addObj.quantity = 1;

        addObj.discountAmount =
          Number(addObj.Rate) *
          Number(1) *
          Number(addObj?.ipdPanelDiscPercent).toFixed(ROUNDOFF_VALUE) *
          0.01;

        addObj.amount =
          Number(value.Rate) * Number(addObj?.quantity) -
          addObj?.discountAmount;

        addObj.PatientPayable =
          Number(addObj.isPayble) === 1
            ? addObj.amount
            : Number(addObj.amount) *
              Number(addObj?.ipdCoPayPercent).toFixed(ROUNDOFF_VALUE) *
              0.01;

        addObj.sampleReqDate = new Date();
        addObj.sampleReqTime = new Date();
        addObj.remark = "";
        addObj.isUrgent = false;
        addObj.Payable = false;
        addTableData.push(addObj);
      }

      setTableData([...tableData, ...addTableData]);
      setValue("");
    } catch (error) {
      console.log(error, "SomThing Went Wrong");
    }
  };
 const handlePatientBillingGetPackage = async (TransactionID) => {
    try {
      const response = await PatientBillingGetPackage(TransactionID);
      console.log("packageID response",response)
      setDropDownState([
        { label: "No Package", value: "0" },
        ...handleReactSelectDropDownOptions(
          response?.data,
          "TypeName",
          "ItemID"
        ),
      ]);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    renderApiCall();
    handlePatientBillingGetPackage(pateintDetails?.TransactionID);
  }, []);

  return (
    <>
      <div className="row py-2">
        <ReactSelect
          placeholderName={t("Category")}
          id={"Category"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name={"Category"}
          dynamicOptions={dropDownData?.category}
          value={formData?.Category?.value}
          handleChange={handleReactSelect}
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          id={"SubCategory"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name={"SubCategory"}
          dynamicOptions={[
            { label: "All", value: "0" },
            ...GetBindSubCatgeoryData.map((item) => {
              return {
                label: item?.name,
                value: item?.subCategoryID,
              };
            }),
          ]}
          value={formData?.SubCategory?.value}
          handleChange={handleReactSelect}
        />
         <ReactSelect
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                placeholderName={"package"}
                    name={"packageID"}
                       id={"packageID"}
                dynamicOptions={dropDownState}
                value={packageID}
                // value={formData.packageID}
                removeIsClearable={true}
                    //  handleChange={handleChange}
                handleChange={(_, e) => setPackageID(e)}
                // handleChange={(_, e) => setPackageID(e?.value)}
              />
        
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          value={formData.fromDate}
          handleChange={handleChange}
          lable={t("FromDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        
        {/* </div>
          <div className="row py-2"> */}
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          value={formData.toDate}
          handleChange={handleChange}
          lable={t("ToDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <div
          className="col-xl-4 col-md-4 col-sm-6 col-12"
          style={{ position: "relative" }}
        >
          <AutoComplete
            value={value}
            suggestions={items}
            completeMethod={search}
            // ref={ref}
            className="w-100"
            onSelect={(e) => handleAddItem(e)}
            id="searchtest"
            onChange={(e) => {
              const data =
                typeof e.value === "object" ? e?.value?.TypeName : e.value;
              setValue(data);
            }}
            itemTemplate={itemTemplate}
          />
          <label htmlFor={"searchtest"} className="lable searchtest">
            {t("Search Test")}
          </label>
        </div>
      </div>
      <AddItemTable
        THEAD={THEADSERVICEDETAILS}
        tbody={tableData}
        setTableData={setTableData}
        pateintDetails={pateintDetails}
        Authorization={Authorization}
        handleSaveAddItemSuccessfully={handleSaveAddItemSuccessfully}
        GetBindBillDetails={GetBindBillDetails}
        packageID={packageID}
        // AddItemDetails={AddItemDetails}
      />
    </>
  );
};

export default IPDServices;
