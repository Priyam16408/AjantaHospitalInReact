import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  EDPPurchaseMangeApprBindEmployee,
  EDPPurchaseMangeApprBindListTable,
  EDPPurchaseMangeApprDelete,
  EDPPurchaseMangeApprSave,
} from "../../../../networkServices/EDP/govindedp";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import ExcelUploader from "../../../../components/Finance/ExcelUploader";
import { notify } from "../../../../utils/ustil2";
import Tables from "../../../../components/UI/customTable";
import {
  UploadFileIcon,
  UploadSuccessIcon,
} from "../../../../components/SvgIcons";
import BrowseButton from "../../../../components/formComponent/BrowseButton";

const ManagerApproval = () => {
  const [t] = useTranslation();
  const thead = [
    { name: t("S.No") },
    { name: t("Employee Name") },
    { name: t("Approval For") },
    { name: t("Action") },
  ];
  const [values, setValues] = useState();
  console.log("values", values);
  const [dropDownSate, setDropDownState] = useState({});
  const [tableData, setTableData] = useState([]);

  const bindTableData = async () => {
    const response = await EDPPurchaseMangeApprBindListTable();

    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const bindEmployees = async () => {
    const response = await EDPPurchaseMangeApprBindEmployee();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Employees: handleReactSelectDropDownOptions(
          response?.data,
          "NAME",
          "Employee_ID"
        ),
      }));
    }
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleDelete = async (item) => {
    const response = await EDPPurchaseMangeApprDelete(item?.ID);
    if (response?.success) {
      notify(response?.message, "success");
      bindTableData();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSave = async () => {
    if (!values?.EmployeeName) {
      notify("Please select Employee Name", "error");
      return;
    }
    if (!values?.ApprovalFor) {
      notify("Please select Approval For", "error");
      return;
    }
    if (!values?.DigitalSignature) {
      notify("Please upload Digital Signature", "error");
      return;
    }

    const payload = {
      employeeValue: values?.EmployeeName?.value,
      appForValue: values?.ApprovalFor?.value,
      fileUpload: values?.DigitalSignature,
    };

    const response = await EDPPurchaseMangeApprSave(payload);
    if (response?.success) {
      notify(response?.message, "success");
      bindTableData();
      setValues({
        ...values,
        DigitalSignature: "",
        EmployeeName: "",
        ApprovalFor: "",
      });
    } else {
      notify(response?.message, "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        notify("File size exceeds 5MB. Please choose a smaller file.", "error");
        return;
      }
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        setValues((val) => ({ ...val, [e?.target?.name]: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    bindEmployees();
    bindTableData();
  }, []);
  return (
    <div className="card">
      <Heading isBreadcrumb={true} isSlideScreen={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Approval For")}
          name="ApprovalFor"
          value={values?.ApprovalFor?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "Purchase Request", value: "PR" },
            { label: "Purchase Order", value: "PO" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          requiredClassName={"required-fields"}
        />
        <ReactSelect
          placeholderName={t("Employee Name")}
          name="EmployeeName"
          value={values?.EmployeeName?.value}
          handleChange={handleReactSelect}
          dynamicOptions={dropDownSate?.Employees}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          requiredClassName={"required-fields"}
        />
        <BrowseButton
          handleImageChange={handleImageChange}
          value={values?.DigitalSignature}
          className={"btn-primary"}
          name="DigitalSignature"
          label={t("Digital Signature")}
          accept={".jpg, .jpeg, .png"}
        />
        <button
          className="btn btn-primary btn-success ml-2"
          onClick={() => handleSave()}
        >
          {t("Add")}
        </button>
      </div>

      <Heading
        title={t("Approval List")}
        isSlideScreen={true}
        isBreadcrumb={false}
      />
      <Tables
        thead={thead}
        tbody={tableData?.map((item, index) => ({
          sno: index + 1,
          EmployeeName: item?.EmpName,
          ApprovalFor:
            item?.ApprovalFor === "PR" ? "Purchase Request" : "Purchase Order",
          Action: (
            <i className="fa fa-trash" onClick={() => handleDelete(item)}></i>
          ),
        }))}
      />
    </div>
  );
};

export default ManagerApproval;
