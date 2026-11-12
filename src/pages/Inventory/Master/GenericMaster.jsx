import React, { useEffect, useState } from "react";

import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Modal from "../../../components/modalComponent/Modal";
import EditGenericMasterModal from "../../../components/modalComponent/Utils/MedicalStore/EditGenericMasterModal";
import {
  AddNewGeneric,
  BindGeneric,
  BindItemIdList,
  BindUnitMaster,
  GenericDeleteitem,
  GenericReportList,
  ReportList,
  SaveGeneric,
  SaveGenericEdit,
  SearchGenericItem,
} from "../../../networkServices/InventoryApi";
import { notify } from "../../../utils/utils";
import ReportTypeModal from "../../../components/modalComponent/Utils/MedicalStore/ReportTypeModal";
import GenericDetailTable from "../../../components/UI/customTable/MedicalStore/GenericDetailTable";
import { exportToExcel } from "../../../utils/exportLibrary";
import { AutoComplete } from "primereact/autocomplete";
import { RedirectURL, RedirectURLReport } from "../../../networkServices/PDFURL";

const GenericMaster = () => {
  const [t] = useTranslation();
  const [handleModelData, setHandleModelData] = useState({});
  useEffect(() => {
    console.log("HandleModelData", handleModelData);
  }, [handleModelData]);
  const [modalData, setModalData] = useState({});
  const [bindGeneric, setBindGeneric] = useState([]);
  const [genericItem, setGenericItem] = useState([]);
  const [tableData, setTableData] = useState([]);
  console.log("tableData",tableData)
  const [errors, setErrors] = useState({});
  const [reportTypeMajor, setReportTypeMajor] = useState("2");
  useEffect(() => {
    console.log("ReportType changing", reportTypeMajor);
  } , [reportTypeMajor])
  const [unitMaster, setUnitMaster] = useState([]);
  const initialPayload = {
    newGeneric: "",
    Generic: "",
    Edit: "",
    Status: "1",
    item: "",
    GenericList: "",
    Strength: "",
    Unit: "",
    reportType: "2",
  };
  const [payload, setPayload] = useState({ ...initialPayload });
  useEffect(() => {
    console.log("Updated ReportType in payload:", payload.reportType);
  }, [payload.reportType]); // ✅ This confirms that reportType is updating correctly
  
  const [itemInputValue, setItemInputValue] = useState("");
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [genericListInputValue, setGenericListInputValue] = useState("");
  const [genericListSuggestions, setGenericListSuggestions] = useState([]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
  };

  const handleReactSelect = (name, value) => {
    setPayload((prev) => ({
      ...prev,
      [name]: value?.value || "",
    }));
  };

  const handleChangeModel = (data) => {
    setModalData(data);
    setPayload(data);
  };
  const handleModel = (
    label,
    width,
    type,
    isOpen,
    Component,
    handleInsertAPI,
    extrabutton
  ) => {
    setHandleModelData({
      label: label,
      width: width,
      type: type,
      isOpen: isOpen,
      Component: Component,
      handleInsertAPI: handleInsertAPI,
      extrabutton: extrabutton ? extrabutton : <></>,
    });
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  useEffect(() => {
    setHandleModelData((val) => ({ ...val, modalData: modalData }));
  }, [modalData]);

  const GetBindGeneric = async () => {
    try {
      const response = await BindGeneric();
      setBindGeneric(response?.data);
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  const GetSearchGenericItem = async () => {
    try {
      const response = await SearchGenericItem();
      setGenericItem(response?.data);
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  const getAddNewGeneric = async () => {
    try {
      const reqBody = {
        genericName: payload?.newGeneric,
        isActive: 0,
      };
      if (!payload?.newGeneric) {
        notify("Name is required", "error");
        return;
      }
      if (payload?.newGeneric.length < 3) {
        notify("Please enter at least 3 characters", "error");
        return;
      }
      const response = await AddNewGeneric(reqBody);
      if (response?.success) {
        notify(response?.message, "success");
        GetBindGeneric();
        setPayload({ newGeneric: "" });
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  const getBindUnitMaster = async () => {
    try {
      const response = await BindUnitMaster();
      setUnitMaster(response?.data);
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };

  // useEffect(()=>{
  //   console.log("reportTypeMajorreportTypeMajorreportTypeMajor" , reportTypeMajor)
  // },[reportTypeMajor])

  const ErrorSaveHandling = (payload) => {
    let errors = {};
    errors.id = [];
    if (!payload?.item) {
      errors.item = " Item Is Required";
      errors.id[errors.id?.length] = "item";
    }
    if (!payload?.GenericList) {
      errors.GenericList = "Generic List Is Required";
      errors.id[errors.id?.length] = "GenericList";
    }
    if (!payload?.Strength) {
      errors.Strength = "Strength Is Required";
      errors.id[errors.id?.length] = "Strength";
    }

    return errors;
  };
  const handleSaveGeneric = async () => {
    const customerrors = ErrorSaveHandling(payload);
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return false;
    }
    const itemlist = {
      genericName: String(payload?.newGeneric) || "",
      saltID: Number(payload?.GenericList) || 0,
      strength: String(payload?.Strength) || "",
      Unit: String(payload?.Unit) || "",
      itemID: Number(payload?.item) || 0,
      quantity: 0,
    };
    const requestbody = {
      itemList: [itemlist],
    };

    try {
      const response = await SaveGeneric(requestbody);
      // const tabresponse = await BindItemIdList(payload?.item);
      bindList(payload?.item)
      if (response?.success) {
        notify(response?.message, "success");
        await GetBindGeneric();
        // setTableData(tabresponse?.data);
        // setTableData([])
        setPayload({...initialPayload});
        setGenericListInputValue("")
        setItemInputValue("")
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };

  const ErrorHandling = (data) => {
    let errors = {};
    errors.id = [];
    if (!data?.Generic) {
      errors.Generic = " Generic Is Required";
      errors.id[errors.id?.length] = "Generic";
    }
    if (!data?.Edit) {
      errors.Edit = "Edit Is Required";
      errors.id[errors.id?.length] = "Edit";
    }

    return errors;
  };

  const handleSaveGenericEdit = async (data) => {
    console.log("Data in HandleSaveGenericEdit", data);
    const customerrors = ErrorHandling(data);
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return false;
    }
    console.log("Modaldata in handleSaveGenericEdit", modalData);

    try {
      const genericName = data?.Edit || "";
      const genericId = Number(data?.Generic) || 0;
      const isActive = Number(data?.Status) || 0;

      const response = await SaveGenericEdit({
        genericName,
        genericId,
        isActive,
      });

      if (response?.success) {
        notify(response?.message, "success");
        setHandleModelData((val) => ({ isOpen: false }));
        setPayload({});
      } else {
        notify(response?.message, "error"); // Changed from "message" to "error" for clarity
      }
      // }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };
  {console.log("first" ,reportTypeMajor)}
  const handleReportOpen = async () => {
    debugger
    try {
      // const genericName = "";
      console.log("reportTypeMajor", reportTypeMajor);
      const response = await GenericReportList({reportTypeMajor});

      if (response?.success) {
        console.log("pdfUrl", response?.data?.pdfUrl);
        if(reportType === 1){
          RedirectURL(response?.data?.pdfUrl);
        }else{
          exportToExcel(response?.data, "Exel");
        }
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error"); // Changed from "message" to "error" for clarity
      }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };

  useEffect(() => {
    GetBindGeneric();
    GetSearchGenericItem();
    getBindUnitMaster();
  }, []);

  const thead = [
    { name: t("S.No"), width: "3%" },
    t("Generic Name"),
    { name: t("Strength"), width: "1" },
    { name: t("Unit"), width: "1" },
    t("Delete"),
  ];
  const handleRemove = async (index, item) => {
    console.log(index), console.log(item);
    const itemId = item?.ItemID;
    const saltid = item?.ID;
    try {
      const response = await GenericDeleteitem(itemId, saltid);

      if (response?.success) {
        notify(response?.message, "success");
        setTableData((prevTableData) =>
          prevTableData.filter((_, i) => i !== index)
        );
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  const handleItemChange = (e) => {
    setItemInputValue(e.value);
    if (!e.value) {
      setPayload((prev) => ({
        ...prev,
        item: "",
      }));
    }
  };

  // useEffect(() => {
  //   const mappedGenericListSuggestions = (bindGeneric || []).map((ele) => ({
  //     NAME: ele.NAME,
  //     VALUE: ele.VALUE,
  //   }));
  //   setGenericListSuggestions(mappedGenericListSuggestions);
  // }, [bindGeneric]);

  // Effect to initialize suggestions for Item
  // useEffect(() => {
  //   const mappedItemSuggestions = (genericItem || []).map((ele) => ({
  //     NAME: ele.itemname,
  //     VALUE: ele.ItemID,
  //   }));
  //   setItemSuggestions(mappedItemSuggestions);
  // }, [genericItem]);

  // Search handler for Generic List
  const handleGenericListSearch = async (event) => {
    const query = { event };
    const filtered = await BindGeneric(query);
    setGenericListSuggestions(
      filtered?.data?.map((ele) => ({ NAME: ele.NAME, VALUE: ele.VALUE }))
    );
  };

  // Search handler for Item
  const handleItemSearch = async (event) => {
    // console.log("Event from HandleItemSearch", event);s
    // const query = event.query.toLowerCase();
    const query = { event };
    // console.log("")
    // console.log("Query",query?.event?.query?.trim());
    const filtered = await SearchGenericItem(query);
    // console.log("Filtered" , filtered)
    setItemSuggestions(
      filtered?.data?.map((ele) => ({ NAME: ele.itemname, VALUE: ele.ItemID }))
    );
    // console.log("filtered", itemSuggestions);
  };

  // Select handler for Generic List
  const handleGenericListSelect = (e) => {
    setPayload((prev) => ({
      ...prev,
      GenericList: e.value.VALUE,
    }));
    setGenericListInputValue(e.value.NAME);
  };


  const bindList=async(val)=>{
    
    try {
       const tabresponse = await BindItemIdList(val);
      if (tabresponse?.success) {

        setTableData(tabresponse?.data);
       
      }
    } catch (error) {
      console.log("error",error)
    }
  }

  // Select handler for Item
  const handleItemSelect = (e) => {
    debugger
    setPayload((prev) => ({
      ...prev,
      item: e.value.VALUE,
    }));
    setItemInputValue(e.value.NAME);


bindList(e?.value?.VALUE)




    
  };

  // Change handler for Generic List
  const handleGenericListChange = (e) => {
    setGenericListInputValue(e.value);
    if (!e.value) {
      setPayload((prev) => ({
        ...prev,
        GenericList: "",
      }));
    }
  };

  // Item template for both components
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix" style={{ width: "100%" }}>
        <div style={{ fontSize: "12px", width: "100%" }}>{item.NAME}</div>
      </div>
    );
  };

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields"
            id="newGeneric "
            name="newGeneric"
            onChange={handleChange}
            value={payload.newGeneric}
            lable={t("New Generic")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <div className="col-sm-1 d-flex justify-content-between">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={getAddNewGeneric}
            >
              {t("Save New Generic")}
            </button>
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={() =>
                handleModel(
                  t("Edit Generic Name"),
                  "50vw",
                  "EditGeneric",
                  true,
                  <EditGenericMasterModal
                    handleChangeModel={handleChangeModel}
                    payload={payload}
                    bindGeneric={bindGeneric}
                    errors={errors}
                    setErrors={setErrors}
                  />,
                  handleSaveGenericEdit
                )
              }
            >
              {t("Edit")}
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <Heading title={"Generic Item Details"} />
        <div className="row p-2">
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 pb-2">
            <AutoComplete
              style={{ width: "100%" }}
              placeholder={t("ItemName")}
              value={itemInputValue}
              suggestions={itemSuggestions}
              completeMethod={handleItemSearch}
              className={`required-fields ${errors?.item && "required-fields-active"}`}
              onSelect={handleItemSelect}
              id="item"
              inputId="item"
              onChange={(e) => handleItemChange(e)}
              itemTemplate={itemTemplate}
              dropdownStyle={{ width: "100%" }}
              panelClassName="autocomplete-panel"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              forceSelection
              field="NAME"
            />
            <label htmlFor={" "} className="lable searchtest">
             {t("Item Name")}
            </label>
          </div>
          <div className="col-xl-4 col-md-4 col-sm-4 col-12 pb-2">
            <AutoComplete
              style={{ width: "100%" }}
              placeholder={t("Generic List")}
              value={genericListInputValue}
              suggestions={genericListSuggestions}
              completeMethod={handleGenericListSearch}
              className={`required-fields ${errors?.GenericList && "required-fields-active"}`}
              onSelect={handleGenericListSelect}
              id="GenericList"
              inputId="GenericList"
              onChange={(e) => handleGenericListChange(e)}
              itemTemplate={itemTemplate}
              dropdownStyle={{ width: "100%" }}
              panelClassName="autocomplete-panel"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              forceSelection
              field="NAME"
            />
            <label htmlFor={"genericList"} className="lable searchtest">
             {t("Generic List")}
            </label>
          </div>
          <Input
            type="number"
            className={`required-fields form-control ${errors?.Strength && "required-fields-active"}`}
            id="Strength "
            name="Strength"
            onChange={handleChange}
            value={payload.Strength}
            lable={t("Strength")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Unit")}
            id={"Unit"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name={"Unit"}
            dynamicOptions={unitMaster?.map((ele) => ({
              label: ele?.UnitName,
              value: ele?.UnitName,
            }))}
            value={payload?.Unit}
            handleChange={handleReactSelect}
          />
          <div className="col-sm-1 d-flex justify-content-between">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleSaveGeneric}
            >
              {t("Save")}
            </button>
            
              <button
                className="btn btn-sm btn-success mx-1"
                onClick={() =>
                  handleModel(
                    "Select Report Type",
                    "30vw",
                    "reportType",
                    true,
                    <ReportTypeModal
                      handleChangeModel={handleChangeModel}
                      payload={payload}
                      setPayload={setPayload}
                      setReportTypeMajor={setReportTypeMajor}
                    />,
                    handleReportOpen
                  )
                }
              >
                {t("Report")}
              </button>
            
          </div>
        </div>
      </div>
      <div className="card">
        <GenericDetailTable
          thead={thead}
          tbody={tableData}
          handleRemove={handleRemove}
        />
      </div>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          modalData={handleModelData?.modalData}
          setModalData={setModalData}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  );
};

export default GenericMaster;
