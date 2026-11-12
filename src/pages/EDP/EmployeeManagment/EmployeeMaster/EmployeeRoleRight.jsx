import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import Input from "../../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  EDPSearchEmpforCopyFromBind,
  handleSearchToBind,
} from "../../../../networkServices/EDP/edpApi";
import { notify } from "../../../../utils/utils";
import Tables from "../../../../components/UI/customTable";
import { SelectIconSVG } from "../../../../components/SvgIcons";

const EmployeeRoleRight = ({ department }) => {
  const [t] = useTranslation();

  const THEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t("Employee Name"), width: "10%" },
    { name: t("Address"), width: "10%" },
    { name: t("Contact") },
    { name: t("Active") },
    { name: t("Select") },
  ];

  const SECONDTHEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t("Employee Name"), width: "10%" },
    { name: t("Address"), width: "10%" },
    { name: t("Contact") },
    { name: t("Active") },
    { name: t("Select") },
  ];

  const [values, setValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [newTableData, setNewTable] = useState([]);
  const [selectedRows , setSelectedRows] = useState([]);

  const handleInputChange = (e, index, label) => {
    setValues((val) => ({ ...val, [label]: e.target.value }));
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSearch = async () => {
    const payloadToBe = {
      empName: values?.CopyFromEmployee ? values?.CopyFromEmployee : "", 
      department: values?.RDepartment?.value ? values?.RDepartment?.value : "0",
    };

    const response = await EDPSearchEmpforCopyFromBind(payloadToBe);

    if (response?.success === true) {
      // ;
      setTableData(response?.data);
    } else {
      notify("No Data Found", "error");
    }
  };

  const handleSearchToBindAPI = async () => {
    const data = await handleSearchToBind();
    if (data?.success == true) {
      setNewTable(data?.data);
      setTableData([]);
    } else {
      notify(data?.message, "error");
    }
  };

  const handleCheck = (e , ele ,  index) => {
    // const {checked} = e.target.checked;
    // 
    if(e.target.checked === true){
      // setSelectedRows(...selectedRows , newTableData[index]);
      setSelectedRows((selectedRows) => [ ...selectedRows , newTableData[index]]);
    }
  }
  return (
    // <div className="mt-2 card">
    <div className="row p-2">
      <Input
        type="CopyFromEmployee"
        className={"form-control required-fields"}
        lable={t("Copy From Employee")}
        placeholder=""
        id="CopyFromEmployee"
        name="CopyFromEmployee"
        onChange={(e) => handleInputChange(e, 0, "CopyFromEmployee")}
        value={values?.CopyFromEmployee}
        required={true}
        respclass="col-xl-6 col-md-4 col-sm-6 col-12"
      />
      <ReactSelect
        placeholderName={t("Department")}
        id="RDepartment"
        removeIsClearable={true}
        requiredClassName={"required-fields"}
        name="RDepartment"
        value={values?.RDepartment?.value}
        handleChange={(name, e) => handleReactSelect(name, e)}
        dynamicOptions={department}
        searchable={true}
        respclass="col-xl-6 col-md-4 col-sm-6 col-12"
      />
      <button
        className="btn btn-sm btn-success ml-2 px-3"
        onClick={handleSearch}
      >
        {t("Search")}
      </button>

      <div className="mt-2">
        {tableData?.length > 0 && (
          <>
            <Heading title={t("Copy From Employee Details")} />
            <Tables
              thead={THEAD}
              tbody={tableData?.map((ele, index) => ({
                SNo: index + 1,
                "Employee Name": ele?.NAME,
                Address: ele?.House_No,
                Contact: ele?.Mobile,
                Active: ele?.Active,
                Select: (
                  <button
                    onClick={handleSearchToBindAPI}
                    style={{ backgroundColor: "white" }}
                  >
                    <SelectIconSVG />
                  </button>
                ),
              }))}
              style={{ height: "40vh" }}
            />
          </>
        )}
      </div>
      <div className="mt-2 card">
        {newTableData?.length > 0 && (
          <>
            <Heading title={t("Employee Having Pending Role Right")} />
            <Tables
              thead={SECONDTHEAD}
              tbody={newTableData?.map((ele, index) => ({
                SNo: index + 1,
                "Employee Name": ele?.NAME,
                Address: ele?.House_No,
                Contact: ele?.Mobile,
                Active: ele?.Active,
                Select: (
                  <input type="checkbox" onClick={(e) => handleCheck(e , ele , index)}/>
                ),
              }))}
              style={{ height: "40vh" }}
            />
          </>
        )}
      </div>
    </div>
    // </div>
  );
};

export default EmployeeRoleRight;
