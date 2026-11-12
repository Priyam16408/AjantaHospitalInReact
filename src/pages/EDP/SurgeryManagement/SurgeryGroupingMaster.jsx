import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import {
  BindGroupSurgery,
  BindPayrollDepartment,
  EDPanelMaster,
  EDPSaveSurgeryGrouping,
  EDPSurgeryItem,
  SaveSurgeryGroupName,
  SearchSurgeryItem,
} from "../../../networkServices/EDP/edpApi";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Modal from "../../../components/modalComponent/Modal";
import GroupingManagemnt from "./GroupingManagemnt";

const SurgeryGroupingMaster = ({ data }) => {
  const [t] = useTranslation();

  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);
  // const [showTable, setShowTable] = useState(true); // NT

  const [isHeaderChecked, setIsHeaderChecked] = useState(false);

  const initialState = {
    Edit: {
      label: "New",
      value: "1",
    },

    Panel: {
      label: "Panel",
      value: "1",
    },
    Category: {
      configID: "",
      categoryName: "",
      categoryID: "",
      label: "",
      value: "",
    },
    ItemName: "",
    // empName: "",
    Department: {
      Dept_ID: 0,
      Dept_Name: "",
      label: "",
      value: 0,
    },
    Group: "",
  };
  const [dropDownState, setDropDownState] = useState({
    Department: [],
    Panel: [],
  });
  const [values, setValues] = useState({ ...initialState });

  const [ratelist, setRateList] = useState(0.0);

  const [modalData, setModalData] = useState({});
  const [bindGroup, setBindGroup] = useState([]);

  const isMobile = window.innerWidth <= 800;

  const [handleModelData, setHandleModelData] = useState({});

  useEffect(() => {
    bindDepartment();
    EDPanelMasterApi();
    EDPSurgeryItemApi();
  }, []);

  const EditableOptions = [
    { label: "New", value: "1" },
    { label: "Edit", value: "2" },
  ];

  const handleReactSelect = async (label, value) => {
    if (label === "Edit") {
      setValues(initialState);
      if (value.value === "1") {
        EDPSurgeryItemApi();
      } else {
        setTableData([]);
      }
    }

    setValues((val) => ({ ...val, [label]: value }));
    if (label === "Category") {
      await GetSubCategoryAPI(value?.value);
    }
  };

  const EDPanelMasterApi = async () => {
    try {
      const PanelMaster = await EDPanelMaster();
      setDropDownState((val) => ({
        ...val,
        Panel: handleReactSelectDropDownOptions(
          PanelMaster?.data,
          "Company_Name",
          "PanelID"
        ),
      }));
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const EDPSurgeryItemApi = async () => {
    try {
      const SurgeryMaster = await EDPSurgeryItem();
      // console.log('surgerymaster ' , SurgeryMaster)
      if (SurgeryMaster?.success) {
        setTableData(SurgeryMaster?.data);
      } else {
        notify(SurgeryMaster?.message, "error");
      }
    } catch (e) {
      console.log("something went wrong");
    }
  };

  const handleSearch = async () => {
    try {
      const searchParams = {
        panelID: values?.Panel?.value,
        groupID: values?.Group?.value,
      };
      const searchResults = await SearchSurgeryItem(searchParams);
      if (searchResults?.success) {
        setTableData(searchResults?.data);
        notify("Search completed successfully", "success");
      } else {
        notify(searchResults?.message || "No results found", "warning");
      }
    } catch (error) {
      console.error("Search Error:", error);
      notify("Error during search", "error");
    }
  };

  const handleSave = async () => {
    const anyChecked = tableData.some((item) => item.isChecked);

    if (!anyChecked) {
      notify("Kindly select at least one Checkbox", "error");
      return;
    }
    ;
    const dataItems = tableData
      ?.filter((val) => val?.isChecked)
      ?.map((val) => ({
        groupID: values?.Group?.GroupID || 0,
        itemID: val?.ItemID,
        itemName: val?.TypeName,
        rate: parseInt(val?.Rate),
        groupName: values?.Group?.GroupName || 0,
        scaleOfCost: val?.ScaleOfCost,
        typeID: val?.Type_ID,
      }));

    const payload = {
      saveType: "Update",
      panelID: values?.Panel?.PanelID || 0,
      dataItem: dataItems,
    };

    try {
      const ReciveResp = await EDPSaveSurgeryGrouping(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        setValues({ ...initialState });

        const resetTableData = tableData.map((item) => ({
          ...item,
          isChecked: false,
          Rate: "",
        }));

        setTableData(resetTableData);
        setIsHeaderChecked(false);
        setRateList(0.0);
      } else {
        notify(ReciveResp?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
      console.error("Save Error:", error);
    }
  };

  const bindDepartment = async () => {
    const data = await BindPayrollDepartment();

    if (data?.success) {
      setDropDownState((val) => ({
        ...val,
        Department: handleReactSelectDropDownOptions(
          data?.data,
          "Dept_Name",
          "Dept_ID"
        ),
      }));
    }
  };
  console.log("Values", values);
  const handleAPI = (data) => {
    console.log("fdata", data);
  };

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };
  const handleInputChange = (e, index, label) => {
    const updatedData = [...tableData];

    const inputValue = e.target.value === "" ? 0 : Number(e.target.value);
    updatedData[index].Rate = inputValue;
    setTableData(updatedData);

    const totalRate = updatedData.reduce((sum, item) => {
      const rate = item.Rate ? Number(item.Rate) : 0;
      return sum + rate;
    }, 0);

    setRateList(parseFloat(totalRate).toFixed(2));
  };
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleSaveresult = async (data) => {
    let payload = {
      groupName: data?.addnew,
    };

    let apiResp = await SaveSurgeryGroupName(payload);
    if (apiResp?.success) {
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      handleGroupName();
      notify(apiResp?.message, "success");
    } else {
      console.log(apiResp?.message);
      notify(apiResp?.message, "error");
    }
  };

  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);

    const updatedData = tableData.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setTableData(updatedData);
  };

  const handleChangeCheckbox = (e, index) => {
    const updatedData = [...tableData];
    updatedData[index].isChecked = e.target.checked;
    setTableData(updatedData);
    const allChecked = updatedData.every((item) => item.isChecked);
    setIsHeaderChecked(allChecked);
  };

  const handleGroupName = async () => {
    try {
      const response = await BindGroupSurgery();
      if (response.success) {
        console.log("the department data is", response);
        setBindGroup(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleClickReject = (item) => {
    setHandleModelData({
      label: t("Create New Group"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <GroupingManagemnt
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: handleSaveresult,
      extrabutton: <></>,
    });
  };

  useEffect(() => {
    const totalRate = tableData.reduce(
      (sum, item) => sum + (Number(item.Rate) || 0),
      0
    );
    setRateList(parseFloat(totalRate).toFixed(2));
  }, [tableData]);

  const THEAD = [
    { name: t("S.No"), width: "1%" },
    {
      width: "5%",
      name: isMobile ? (
        t("checkbox")
      ) : (
        <input
          type="checkbox"
          checked={isHeaderChecked}
          onChange={handleChangeCheckboxHeader}
        />
      ),
    },
    { name: t("Type Name"), width: "20%" },
    { name: t("Scale of Cost"), width: "9%" },
    { name: t("Rate"), width: "9%" },
    { name: t("Final Rate"), width: "9%" },
  ];

  useEffect(() => {
    handleGroupName();
  }, []);

  const isEditMode = values?.Edit?.value === "2";

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
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
            placeholderName={t("Type")}
            removeIsClearable={true}
            name="Edit"
            value={values?.Edit?.value}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={EditableOptions}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <ReactSelect
            placeholderName={t("Panel")}
            removeIsClearable={true}
            name="Panel"
            value={values?.Panel?.value}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={dropDownState?.Panel}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <ReactSelect
            placeholderName={t("Group")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="Group"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                bindGroup,
                "GroupName",
                "GroupID"
              ),
            ]}
            name="Group"
            value={`${values?.Group}`}
            handleChange={handleReactSelect}
          />

          <div className="d-flex align-items-center">
            {isEditMode ? (
              <button
                className="btn btn-sm btn-primary ml-2 px-4"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-success ml-2 px-3"
                onClick={() => {
                  handleClickReject();
                }}
              >
                {t("New")}
              </button>
            )}
          </div>
        </div>

        {tableData?.length > 0 && (
          <>
            {/* <div className="w-70"> */}
            <Tables
              thead={THEAD}
              style={{ height: "content-fit" }}
              tbody={tableData.map((elem, index) => ({
                SNo: index + 1,
                checkbox: (
                  <input
                    type="checkbox"
                    checked={elem.isChecked}
                    onChange={(e) => handleChangeCheckbox(e, index)}
                    disabled={
                      values?.status?.value === "Y" ||
                      values?.status?.value === "R"
                    }
                  />
                ),
                TypeName: elem?.TypeName,
                scaleCost: elem?.ScaleOfCost,
                rate: (
                  <Input
                    type="number"
                    className="table-input"
                    respclass={"w-100"}
                    removeFormGroupClass={true}
                    display={"right"}
                    placeholder={"0"}
                    name={"Rate"}
                    value={elem?.Rate ? elem?.Rate : ""}
                    onChange={(e) => handleInputChange(e, index, "Rate")}
                  />
                ),
                finalRate: elem?.Rate ? elem?.Rate : "0",
              }))}
            />
            {/* </div> */}

            <div className="container-fluid  p-2">
              <div className="row justify-content-end">
                <div className="col-md-1 ">
                  <LabeledInput
                    label={"Total Rate"}
                    value={ratelist}
                    className="w-100 mt-2"
                  />
                </div>
                <div className="col-md-1 ">
                  <LabeledInput
                    label={"Final Rate"}
                    value={ratelist}
                    className="w-100 mt-2"
                  />
                </div>

                <button
                  className="btn btn-primary px-04 py-2 mt-2 mr-2 justify-content-end"
                  type="button"
                  onClick={handleSave}
                >
                  {t("Save")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SurgeryGroupingMaster;
