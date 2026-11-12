import React, { useEffect, useState, useCallback } from "react";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import Tables from "../../../../components/UI/customTable";
import Heading from "../../../../components/UI/Heading";
import {
  RateSetupBindCentre,
  RateSetupCaseTypeBind,
  RateSetupLoadCategory,
  RateSetupLoadItems,
  RateSetupLoadRates,
  RateSetupLoadSubCategory,
  RateSetupSaveSetItemRate,
} from "../../../../networkServices/EDP/edpApi";
import CustomSelect from "../../../../components/formComponent/CustomSelect";
import Modal from "../../../../components/modalComponent/Modal";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import SaveItem from "./SaveItem";
import { EDPSetItemRatePayload } from "../../../../utils/ustil2";

const SetItemRate = ({data}) => {
  const [modalData, setModalData] = useState({ visible: false });
  const userData = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const initialState = {
    type: {},
    Category: {},
    SubCategory: {},
    ItemName: "",
    LoadItem: {},
    department: { label: "OPD", value: "0" },
    panel: { label: "CASH", value: "1" },
    scheduleCharges: { label: "CASH", value: "1" },
    centre: {},
    CaseType: [],
    centres: [{ code: Number(userData?.centreID), name: userData?.centreName }],
    searchBy: { label: "By Initial Characters", value: "0" },
  };

  const [values, setValues] = useState({ ...initialState });
  console.log("asdasd", values);
  const [tableData, setTableData] = useState([]);
  console.log("tableData", tableData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleRowSelect = useCallback((rowData) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.some((item) => item === rowData)) {
        return prevSelectedRows.filter((item) => item !== rowData);
      } else {
        return [...prevSelectedRows, rowData];
      }
    });

    // Update table data with 'applyIPD' flag, using a functional update
    setTableData((prevTableData) => {
      return prevTableData.map((item) => {
        if (item === rowData) {
          return { ...item, applyIPD: !item.applyIPD }; // Toggle the flag
        }
        return item;
      });
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
  }, []);

  useEffect(() => {
    if (tableData.length > 0) {
      //Only execute effect if tableData is not empty
      const newTableData = tableData.map((item) => ({
        ...item,
        applyIPD: selectAll,
      }));
      setTableData(newTableData);

      if (selectAll) {
        setSelectedRows([...tableData]);
      } else {
        setSelectedRows([]);
      }
    }
  }, [selectAll]); //Remove tableData from dependency array

  const isRowSelected = (rowData) =>
    selectedRows.some((item) => item === rowData);
  const THEAD = [
    { name: t("S.No."), width: "1%" },
    { name: t("Category"), width: "10%" },
    { name: t("Sub Category"), width: "10%" },
    { name: t("Item Name"), width: "20%" },
    ...(values?.department?.value == "1"
      ? [
          {
            name: t("Room Type"),
            width: "10%",
          },
        ]
      : []),
    { name: t("Current Rate"), width: "10%" },
    { name: t("Currency"), width: "10%" },
    { name: t("Item Display Name"), width: "10%" },
    { name: t("Item Code"), width: "8%" },
    ...(values?.department?.value == "0"
      ? [
          {
            name: (
              <>
                IPD
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  style={{ marginLeft: "5px" }}
                />
              </>
            ),
            width: "2%",
          },
        ]
      : []),
  ];

  const Department = [
    { label: "OPD", value: "0" },
    { label: "IPD", value: "1" },
  ];

  const PanelItem = [
    { label: "CASH", value: "1" },
    { label: "CGHS", value: "90" },
  ];

  const [dropDownState, setDropDownState] = useState({
    GetCategory: [],
    GetSubCategory: [],
    GetLoadItem: [],
    GetCentreItem: [],
    GetCaseTypeBind: [],
    AvailableItems: [],
  });

  const GetCategoryAPI = async () => {
    try {
      const response = await RateSetupLoadCategory();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          GetCategory: handleReactSelectDropDownOptions(
            response?.data,
            "Name",
            "CategoryID"
          ),
        }));
        setValues((preV) => ({
          ...preV,
          Category: {
            label: response?.data[0]?.Name,
            value: response?.data[0]?.CategoryID,
          },
        }));
      }
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const GetSubCategoryAPI = async (ID) => {
    try {
      const response = await RateSetupLoadSubCategory(ID);
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          GetSubCategory: handleReactSelectDropDownOptions(
            response?.data,
            "Name",
            "SubCategoryID"
          ),
        }));
        setValues((preV) => ({
          ...preV,
          SubCategory: {
            label: response?.data[0]?.Name,
            value: response?.data[0]?.SubCategoryID,
          },
        }));
      }
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const handleShowItem = async () => {
    let CaseTypeID = values?.AvailableItems?.map((item) => {
      return item.code;
    }).join(",");
    const payload = {
      active: 1,
      itemID: String(CaseTypeID || ""),
      panelID: Number(values?.panel?.value || 0),
      scheduleChargeID: Number(values?.scheduleCharges?.value),
      centreID: Number(values?.centre?.value),
      dept: Number(values?.department?.value),
      roomType: "",
    };
    try {
      const response = await RateSetupLoadRates(payload);
      if (response?.success) {
        const initialData = response?.data.map((item) => ({
          ...item,
          applyIPD: false,
        }));
        setTableData(initialData);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getCentre = async (ID) => {
    try {
      const response = await RateSetupBindCentre(ID);
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          GetCentreItem: handleReactSelectDropDownOptions(
            response?.data,
            "CentreName",
            "CentreID"
          ),
        }));
        setValues((preV) => ({
          ...preV,
          centre: {
            label: response?.data[0]?.CentreName,
            value: response?.data[0]?.CentreID,
          },
        }));
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getCaseTypeBind = async () => {
    try {
      const response = await RateSetupCaseTypeBind();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          GetCaseTypeBind: handleReactSelectDropDownOptions(
            response?.data,
            "Name",
            "IPDCaseTypeID"
          ),
        }));
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleReactSelect = async (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
    if (label === "department") {
      setTableData([]);
    }
    if (label === "SubCategory") {
      let apiResp = await RateSetupLoadItems({
        categoryID: values?.Category?.value,
        subCategoryID: value?.value,
        itemName: values?.ItemName ? values?.ItemName : "",
        itemCode: values?.ItemCode ? values?.ItemCode : "",
      });
      if (apiResp?.success) {
        setDropDownState((val) => ({ ...val, AvailableItems: apiResp?.data }));
      } else {
        setDropDownState((val) => ({ ...val, AvailableItems: [] }));
      }
    }
  };

  const handleInputChange = (index, label, value) => {
    setTableData((prevTableData) => {
      const newData = [...prevTableData];
      newData[index] = { ...newData[index], [label]: value };
      return newData;
    });
  };

  const handleSaveItem = async () => {
    let payload = EDPSetItemRatePayload(values, tableData);
    let apiResp = await RateSetupSaveSetItemRate(payload);
    if (apiResp?.success) {
      notify(apiResp?.message);
      setValues(initialState);
      setTableData([]);
    } else {
      notify(apiResp?.message, "error");
    }
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({
      ...values,
      [name]: selectedOptions,
    });
  };

  useEffect(() => {
    GetCategoryAPI();
    getCaseTypeBind();
  }, []);

  useEffect(() => {
    if (values?.panel?.value) getCentre(values?.panel?.value);
  }, [values?.panel?.value]);

  useEffect(() => {
    if (values?.Category?.value) {
      GetSubCategoryAPI(values?.Category?.value);
    }
  }, [values?.Category?.value]);

  return (
    <div className="mt-2 card">
      <Heading
        title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Department")}
          name="department"
          id="department"
          value={values?.department?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={Department}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("Item Name")}
          placeholder=" "
          name="ItemName"
          onChange={(e) =>
            setValues((prev) => ({ ...prev, ItemName: e.target.value }))
          }
          value={values?.ItemName}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("Item Code")}
          placeholder=" "
          name="ItemCode"
          onChange={(e) =>
            setValues((prev) => ({ ...prev, ItemCode: e.target.value }))
          }
          value={values?.ItemCode}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Category")}
          name="Category"
          id="Category"
          value={values?.Category?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GetCategory}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          removeIsClearable={true}
        />

        <ReactSelect
          placeholderName={t("Search By")}
          name="searchBy"
          id="searchBy"
          value={values?.searchBy?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "By Initial Characters", value: "0" },
            { label: "By Middle Characters", value: "1" },
          ]}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Sub Category")}
          id="SubCategory"
          name="SubCategory"
          value={values?.SubCategory?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.GetSubCategory}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          removeIsClearable={true}
        />

        <MultiSelectComp
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="AvailableItems"
          id="AvailableItems"
          placeholderName={t("Available Items")}
          dynamicOptions={dropDownState?.AvailableItems?.map((ele) => ({
            code: ele?.ItemID,
            name: ele?.TypeName,
          }))}
          handleChange={handleMultiSelectChange}
          value={values?.AvailableItems}
        />

        <ReactSelect
          placeholderName={t("Panel")}
          name="panel"
          id="Panel"
          value={values?.panel?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={PanelItem}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />

        <ReactSelect
          placeholderName={t("Schedule Charges")}
          name="scheduleCharges"
          id="scheduleCharges"
          value={values?.scheduleCharges?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[{ label: "CASH", value: "1" }]}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />

        <MultiSelectComp
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          name="centres"
          id="centres"
          placeholderName={t("Centre")}
          dynamicOptions={dropDownState?.GetCentreItem?.map((ele) => ({
            code: ele?.value,
            name: ele?.label,
          }))}
          handleChange={handleMultiSelectChange}
          value={values?.centres}
        />

        {/* <ReactSelect
                    placeholderName={t("Centre")}
                    name="centre"
                    value={values?.centre?.value}
                    handleChange={(name, e) => handleReactSelect(name, e)}
                    dynamicOptions={dropDownState?.GetCentreItem}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                /> */}

        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={handleShowItem}
        >
          {t("Show Rates")}
        </button>
      </div>
      {tableData?.length > 0 && (
        <div className="card">
          <Heading title={t("RateList Details")} isBreadcrumb={false} />
          <Tables
            // isSearch={true}
            thead={THEAD}
            tbody={tableData?.map((val, index) => ({
              SNo: index + 1,
              Category: val?.CatName,
              SubCategory: val?.SubCatName,
              ItemName: val?.ItemName,
              ...(values?.department?.value == "1" && {
                Ipd: val?.RoomType,
              }),
              currencyRate: (
                <Input
                  type="number"
                  className={"table-input  form-fields"}
                  placeholder=" "
                  removeFormGroupClass={true}
                  name="Rate"
                  onChange={(e) =>
                    handleInputChange(index, "Rate", e.target.value)
                  } // Pass the index to handleInputChange
                  value={val?.Rate}
                  required={true}
                  respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                />
              ),
              Currency: (
                <CustomSelect
                  placeHolder={t("Currency")}
                  name="IsCurrent"
                  onChange={(selectedOption) =>
                    handleInputChange(index, "IsCurrent", selectedOption.value)
                  }
                  value={val?.IsCurrent}
                  option={[
                    { label: "INR", value: 1 },
                    { label: "USD", value: "USD" },
                  ]}
                />
              ),
              displayName: (
                <Input
                  type="text"
                  className={"table-input  form-fields"}
                  placeholder=" "
                  removeFormGroupClass={true}
                  name="ItemDisplayName"
                  onChange={(e) =>
                    handleInputChange(index, "ItemDisplayName", e.target.value)
                  }
                  value={val?.ItemDisplayName}
                  required={true}
                  respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                />
              ),
              itemCode: (
                <Input
                  type="text"
                  className={"table-input form-fields"}
                  placeholder=" "
                  name="ItemCode"
                  removeFormGroupClass={true}
                  onChange={(e) =>
                    handleInputChange(index, "ItemCode", e.target.value)
                  }
                  value={val?.ItemCode}
                  required={true}
                  respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                />
              ),
              ...(values?.department?.value == "0" && {
                Ipd: (
                  <input
                    type="checkbox"
                    checked={val.applyIPD || false} // Check if applyIPD is true for this row
                    onChange={() => handleRowSelect(val)} // Pass the entire row data to handleRowSelect
                  />
                ),
              }),
            }))}
          />
          <div className="p-2 d-flex justify-content-end">
            {values?.department?.value == "1" && (
              <div className="d-flex justify-content-center align-items-center gap-2 ">
                <span className="mr-2">{t("Set Rate To Room Types")}</span>
                <input type="checkbox" />
              </div>
            )}

            <button
              className=" btn btn-sm btn-success ml-2 px-3"
              onClick={handleSaveItem}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      )}

      <Modal
        visible={modalData?.visible}
        setVisible={() => {
          setModalData({ visible: false });
        }}
        modalData={modalData?.URL}
        modalWidth={modalData?.width}
        Header={modalData?.label}
        buttonType="button"
        footer={modalData?.footer}
      >
        {modalData?.Component}
      </Modal>
    </div>
  );
};

export default SetItemRate;
