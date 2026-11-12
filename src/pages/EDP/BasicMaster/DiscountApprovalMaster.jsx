import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import { notify } from "../../../utils/utils";
import {
  BindDiscountApproval,
  SaveApprovalType,
  UpdateApprovalType,
} from "../../../networkServices/EDP/pragyaedp";

const DiscountApprovalMaster = ({ data }) => {
  const [t] = useTranslation();

  const THEAD = [
    { name: "S.No.", width: "5%" },
    { name: "Name", width: "50%" },
    { name: "Active", width: "30%" },
  ];

  const initialValues = {
    selectType: {
      label: "New",
      value: "1",
    },
    status: { label: "Active", value: "1" },
    PackageName: "",
    subCategory: null,
  };

  const selectTypeData = [
    { label: "Active", value: "1" },
    { label: "DeActive", value: "0" },
    { label: "Both", value: "2" },
  ];

  const [tableData, setTableData] = useState([]);
  const [values, setValues] = useState({ ...initialValues });
  console.log("Values", values);
  const [showTable, setShowTable] = useState(false);

  const handleReactSelect = (label, value) => {
    if (label === "selectType") {
      setTableData([]);
      setShowTable(false);
    }
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputTableChange = (e, index, label) => {
    const updatedData = [...tableData];
    updatedData[index][label] = e.target.value;
    setTableData(updatedData);
  };

  const handleCustomReactSelect = (index, name, value) => {
    const updatedData = [...tableData];
    updatedData[index][name] = value?.value;
    setTableData(updatedData);
  };

  const handleApprovalSave = async () => {
    let payload = {
      approvalType: String(values?.PackageName),
    };
    try {
      let apiResp = await SaveApprovalType(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        setValues({
          ...values,
          PackageName: "",
        });
      } else {
        notify(apiResp?.message || "Save failed", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      notify("An error occurred during save", "error");
    }
  };

  const handleBindApproval = async () => {
    try {
      if (!values?.PackageName) {
        notify("Please enter Package Name", "error");
        return;
      }
      const apiResp = await BindDiscountApproval(
        values?.PackageName,
        values?.status?.value
      );
      if (apiResp.success) {
        setTableData(apiResp?.data || []);
        setShowTable(true);
        // notify(apiResp?.message, "success");
      } else {
        notify(apiResp?.message, "error");
        setTableData([]);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error loading search data:", error);
      notify("An error occurred while searching", "error");
      setTableData([]);
      setShowTable(false);
    }
  };

  const handleUpdateApproval = async () => {
    const payload = tableData.map((ele) => ({
      approvalType: ele?.ApprovalType,
      isActive: ele?.Active,
      id: ele?.ID,
    }));

    try {
      const apiResp = await UpdateApprovalType(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        handleBindApproval();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      notify("An error occurred during update", "error");
    }
  };

  return (
    <div className="card">
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
          name="selectType"
          value={values?.selectType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "New", value: "1" },
            { label: "Edit", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Name")}
          placeholder=" "
          name="PackageName"
          onChange={(e) => handleInputChange(e, 0, "PackageName")}
          value={values?.PackageName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {values?.selectType?.value === "0" && (
          <ReactSelect
            placeholderName={t("Status")}
            name="status"
            value={values?.status?.value}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={selectTypeData}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        )}

        {values?.selectType?.value === "1" ? (
          <button
            className="btn btn-sm btn-success py-1 px-2"
            style={{ width: "70px" }}
            onClick={handleApprovalSave}
          >
            {t("Save")}
          </button>
        ) : (
          <button
            className="btn btn-sm btn-success py-1 px-2"
            style={{ width: "70px" }}
            onClick={handleBindApproval}
          >
            {t("Search")}
          </button>
        )}
      </div>

      {showTable && tableData?.length > 0 && (
        <div className="card">
          <Tables
            thead={THEAD}
            tbody={tableData?.map((ele, index) => ({
              Sno: index + 1,
              Name: (
                <Input
                  type="text"
                  className="table-input"
                  respclass={"w-100"}
                  removeFormGroupClass={true}
                  display={"right"}
                  placeholder={""}
                  name={"ApprovalType"}
                  value={ele?.ApprovalType}
                  onChange={(e) =>
                    handleInputTableChange(e, index, "ApprovalType")
                  }
                />
              ),
              IsActive: (
                <CustomSelect
                  option={[
                    { label: "Active", value: "1" },
                    { label: "Deactive", value: "0" },
                  ]}
                  placeHolder={t("IsActive")}
                  value={ele?.Active == 1 ? "1" : "0"}
                  isRemoveSearchable={true}
                  name="Active"
                  onChange={(name, e) =>
                    handleCustomReactSelect(index, name, e)
                  }
                />
              ),
            }))}
          />
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleUpdateApproval}
            >
              {t("Update")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountApprovalMaster;
