import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  LoadDepartmentSurgery,
  LoadSurgery,
  SaveDepartmentSurgery,
  SaveSurgeryMaster,
  UpdateSurgeryMaster,
} from "../../../networkServices/EDP/edpApi";
import Modal from "../../../components/modalComponent/Modal";
import DepartmentManagement from "./DepartmentManagement";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/utils";

const SurgeryMaster = ({ data }) => {
  const [t] = useTranslation();

  const initialState = {
    Edit: {
      label: "Add",
      value: "1",
    },
    Panel: {
      label: "Panel",
      value: "1",
    },
    department: { label: "All", value: "ALL" },
  };

  const [initialValue, setInitialValue] = useState({ ...initialState });
  const [departmentOptions, setDepartmentOptions] = useState([]);
  console.log("Mapped options:", departmentOptions);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const [loadSurerydata, setLoadSurgeryData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [hasDataBeenSaved, setHasDataBeenSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [values, setValues] = useState({
    Edit: initialState.Edit,
    SurgeryName: "",
    ItemCode: "",
    department: initialState.department,
  });
  console.log("Valu", values);

  const EditableOptions = [
    { label: "Add", value: "1" },
    { label: "Edit", value: "2" },
  ];

  const clearFormFields = () => {
    setValues((prev) => ({
      ...prev,
      SurgeryName: "",
      ItemCode: "",
      department: "",
    }));
  };

  const handleSelect = (name, value) => {
    console.log("handleSelect called with:", name, value);

    if (name === "Edit") {
      setValues({
        Edit: value,
        SurgeryName: "",
        ItemCode: "",
        department: "",
      });

      setInitialValue((prev) => ({
        ...prev,
        Edit: value,
      }));

      setIsEditing(false);
      setEditingItem(null);

      setShowTable(false);
      setLoadSurgeryData([]);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const EDPLoadDepartmentSurgery = async () => {
    try {
      const response = await LoadDepartmentSurgery();
      console.log("API data:", response?.data);

      if (response?.success && response?.data && Array.isArray(response.data)) {
        const options = response.data.map((item, index) => ({
          label: item.Name !== null && item.Name !== undefined ? item.Name : ``,
          value: item.Name !== null && item.Name !== undefined ? item.Name : ``,
        }));
        const finalOptions = [{ label: "All", value: "ALL" }, ...options];
        setDepartmentOptions(finalOptions);
      } else {
        console.log("Invalid API response structure:", response);
      }
    } catch (e) {
      console.log("Something Went Wrong", e);
    }
  };

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  const handleSaveresult = async (data) => {
    const payload = {
      department: data?.addnew,
    };
    let apiResp = await SaveDepartmentSurgery(payload);
    if (apiResp?.success) {
      setHandleModelData((val) => ({ ...val, isOpen: false }));
      handleGroupName();
      notify(apiResp?.message, "success");
    } else {
      console.log(apiResp?.message);
      notify(apiResp?.message, "error");
    }
  };

  const handleSurgeryMaster = async () => {
    if (!values.SurgeryName) {
      notify("Please enter Surgery Name", "error");
      return;
    }

    if (!values.department || !values.department.value) {
      notify("Please select a Department", "error");
      return;
    }

    let payload = {
      surgeryName: values?.SurgeryName,
      department: values?.department?.value,
      itemCode: values?.ItemCode,
    };
    let apiResp = await SaveSurgeryMaster(payload);
    if (apiResp?.success) {
      handleGroupName();
      notify(apiResp?.message, "success");

      setHasDataBeenSaved(true);
      clearFormFields();
    } else {
      console.log(apiResp?.message);
      notify(apiResp?.message, "error");
    }
  };

  const handleLoadSurgery = async () => {
    const payload = {
      Name: values?.SurgeryName ? values?.SurgeryName : "",
      department: values?.department?.value ? values?.department?.value : "ALL",
      itemCode: values?.ItemCode ? values?.ItemCode : "",
    };
    try {
      const apiResp = await LoadSurgery(payload);
      if (apiResp.success) {
        console.log("the apiresponse is in the table", apiResp.data);
        setLoadSurgeryData(apiResp.data);
        notify(apiResp?.message, "success");

        // Clear form fields after successful search
        clearFormFields();
      } else {
        notify(apiResp?.message, "error");
        setLoadSurgeryData([]);
      }
    } catch (error) {
      console.error("Error loading surgery data:", error);
      notify("An error occurred while loading surgery data", "error");
      setLoadSurgeryData([]);
    }
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditingItem(item);

    console.log("the item value is", item);

    // Find the matching department option
    const departmentOption = departmentOptions.find(
      (opt) =>
        // Try to match by different possible field names
        opt.value === item.DepartmentID ||
        opt.value === item.DEPARTMENTID ||
        opt.value === item.departmentId ||
        opt.label === item.Department
    );

    // Set values from the table row data
    setValues({
      ...values,
      SurgeryName: item.NAME || "",
      ItemCode: item.SurgeryCode || "",
      // department: item?.Department || "",
      department: {
        label: item?.Department || "",
        value: item?.Department || "",
      },
    });

    notify("You can now update this record", "info");
  };

  const handleUpdateSurgery = async () => {
    if (!values.SurgeryName) {
      notify("Please enter Surgery Name", "error");
      return;
    }

    if (!values.department || !values.department.value) {
      notify("Please select a Department", "error");
      return;
    }

    let payload = {
      surgeryName: values?.SurgeryName,
      surgeryID: editingItem?.Surgery_ID,
      groupID: editingItem?.GroupID || 10,
      departmentID: values?.department?.value,
      surgeryCode: values?.ItemCode,
      isActive: 1,
    };

    try {
      let apiResp = await UpdateSurgeryMaster(payload);
      if (apiResp?.success) {
        // notify(apiResp?.message, "success");
        handleLoadSurgery();
        setIsEditing(false);
      } else {
        console.log(apiResp?.message);
        notify(apiResp?.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      notify("An error occurred during update", "error");
    }
  };

  const handleAddDepartment = (item) => {
    setHandleModelData({
      label: t("Create Department"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <div>
          <DepartmentManagement
            inputData={item}
            handleChangeModel={handleChangeRejectModel}
          />
        </div>
      ),
      handleInsertAPI: handleSaveresult,
    });
  };

  const handleGroupName = () => {
    EDPLoadDepartmentSurgery();
  };

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      Edit: initialState.Edit,
    }));

    EDPLoadDepartmentSurgery();
  }, []);

  const isEditMode = values?.Edit?.value === "2";

  const THEAD = [
    { name: t("S.No"), width: "5%" },
    { name: t("Surgery Name"), width: "30%" },
    { name: t("CPT Code"), width: "20%" },
    { name: t("Department"), width: "25%" },
    { name: t("Status"), width: "15%" },
    { name: t("Action"), width: "5%" },
  ];

  useEffect(() => {
    if (typeof UpdateSurgeryMaster === "undefined") {
      window.UpdateSurgeryMaster = async (payload) => {
        console.log("Mocking update with payload:", payload);
        return {
          success: true,
          message: "Surgery updated successfully (mock)",
        };
      };
    }
  }, []);

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
        <div className="row px-2 pt-2">
          <ReactSelect
            placeholderName={t("Type")}
            removeIsClearable={true}
            name="Edit"
            value={values?.Edit}
            handleChange={handleSelect}
            dynamicOptions={EditableOptions}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            defaultValue={initialState.Edit}
          />

          <Input
            type="text"
            className="form-control"
            id="SurgeryName"
            name="SurgeryName"
            value={values.SurgeryName}
            onChange={handleChange}
            lable={t("Surgery Name")}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />

          <Input
            type="text"
            className="form-control"
            id="ItemCode"
            name="ItemCode"
            value={values.ItemCode}
            lable={isEditMode ? t("CPT Code") : t("Item Code")}
            onChange={handleChange}
            placeholder=" "
            respclass="col-xl-2.5 col-md-2 col-sm-4 col-12"
            style={{ width: "100%" }}
          />
          {console.log(
            "first",
            departmentOptions.find(
              (opt) => opt.value === values?.department?.value
            )
          )}
          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[...departmentOptions]}
            handleChange={handleSelect}
            value={
              departmentOptions.find(
                (opt) => opt.value === values?.department?.value
              )?.value
            }
            name={"department"}
          />

          {values?.Edit?.value === "1" && (
            <button
              className="btn btn-sm btn-primary"
              onClick={handleAddDepartment}
            >
              <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
            </button>
          )}

          {isEditMode ? (
            isEditing ? (
              <button
                className="btn btn-sm btn-primary py-1 px-2 ml-2 mt-1"
                style={{ width: "70px" }}
                onClick={handleUpdateSurgery}
              >
                {t("Update")}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-primary px-2 ml-2"
                style={{ width: "70px" }}
                onClick={handleLoadSurgery}
              >
                {t("View")}
              </button>
            )
          ) : (
            <button
              className="btn btn-sm btn-success px-2 ml-2"
              style={{ width: "70px" }}
              onClick={handleSurgeryMaster}
            >
              {t("Save")}
            </button>
          )}
        </div>

        {isEditMode && (
          <div className="px-2 pb-3 mt-3">
            {/* {loadSurerydata.length > 0 ? ( */}
            <Tables
              thead={THEAD}
              style={{ height: "content-fit" }}
              tbody={loadSurerydata.map((item, index) => ({
                SNo: index + 1,
                SurgeryName: item.NAME,
                CPTCode: item.SurgeryCode,
                Department: item.Department,
                Status: item.IsActive ? "Active" : "Inactive",
                Action: (
                  <i
                    className="fa fa-edit"
                    onClick={() => handleEditClick(item)}
                  ></i>
                ),
              }))}
            />
            {/* ) } */}
          </div>
        )}
      </div>
    </>
  );
};
export default SurgeryMaster;
