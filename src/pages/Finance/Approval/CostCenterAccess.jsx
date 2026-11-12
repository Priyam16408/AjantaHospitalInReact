import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  bindCCMappingBackendData,
  BindVoucherBillingScreenControls,
  SaveCostCentreemployeeMapping,
} from "../../../networkServices/finance";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
const CostCenterAccess = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    allCenter: "",
    department: "",
    requestArea: "",
    employee: "",
  });
  
  const isMobile = window.innerWidth <= 800;

  // const localData = useLocalStorage("userData", "get")
  const [selectedRows, setSelectedRows] = useState([]);
  const [tbodyData, setTbodyData] = useState([]); 
    const [isHeaderChecked, setIsHeaderChecked] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value || new Date(),
    }));
  };

  const [center, setBindeCenter] = useState([]);
  const [department, setDepartmentData] = useState([]);
  const [employess, setEmployee] = useState([]);
  const [requestArea, setRequestArea] = useState([]);

  const handleSelect = (name, value) => {
    if(name==="department"){
        setValues((prev) => ({ ...prev, [name]: value,requestArea:{value:""} }));
        setTbodyData([]);
        
    }else{
        setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);

    const updatedData = tbodyData.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setTbodyData(updatedData);
  };

  const THEAD = [
    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("Cost Center Code") },
    { width: "5%", name: t("Cost Center Name") },
    {
        width: "5%",
        name: isMobile ? (
          t("NursingWard.NurseAssignment.check")
        ) : (
          <input
            type="checkbox"
            checked={isHeaderChecked}
            onChange={handleChangeCheckboxHeader}
          />
        ),
      },
  ];

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1);
    if (apiResp?.success) {
      const data = apiResp?.data?.filter((val, ind) => {
        return val.TypeID == 14 && val.TypeCode === val.ValueField;
      });
      setBindeCenter(data);
    } else {
      // setList([])
    }
  };

  const handlebindCCMappingBackendData = async () => {
    let payload = {
      filterType: 1,
      centreID: values?.allCenter?.value,
      deptCode: "",
      reqAreaCode: "",
      employeeID: "",
    };
    let apiResp = await bindCCMappingBackendData(payload);

    if (apiResp?.success) {
      console.log("The api bindCCMappingBackendData is", apiResp);
      const data = apiResp?.data?.filter((val, ind) => {
        return val.TypeID == 2 && val.CentreID == values?.allCenter?.value;
      });

      const employee = apiResp?.data?.filter((val, ind) => {
        return val.TypeID == 1 && val.CentreID == values?.allCenter?.value;
      });

      const requirementArea = apiResp?.data?.filter((val, ind) => {
        return (
          val.TypeID == 3 &&
          val.CentreID == values?.allCenter?.value &&
          val.DeptCode == values?.department?.value
        );
      });
      console.log("the requrirment area", requirementArea);

      setDepartmentData(data);
      setEmployee(employee);
      setRequestArea(requirementArea);

      // return i.TypeID == 2 && i.CentreID == selectedCentreID
    } else {
      // setList([])
    }
  };

  const tablebindCCMappingBackendData = async () => {
    let payload = {
      filterType: 2,
      centreID: values?.allCenter?.value,
      deptCode: values?.department?.value,
      reqAreaCode: values?.requestArea?.value,
      employeeID: values?.employee?.value,
    };
    let apiResp = await bindCCMappingBackendData(payload);

    if (apiResp?.success) {
      console.log("The api bindCCMappingBackendData is", apiResp);
      setTbodyData(apiResp?.data);
      // return i.TypeID == 2 && i.CentreID == selectedCentreID
    } else {
      // setList([])
    }
  };
  //   bindCCMappingBackendData

  //   SaveCostCentreemployeeMapping

 
  const handleChangeCheckbox = (e, index) => {
    const updatedData = [...tbodyData];
    updatedData[index].isChecked = e.target.checked;
    setTbodyData(updatedData);
    const allChecked = updatedData.every((item) => item.isChecked);
    setIsHeaderChecked(allChecked);
  };
  useEffect(() => {
    bindListData();
    handlebindCCMappingBackendData();
  }, [values?.allCenter?.value, values?.department?.value]);


  const handleSaveCostCentreemployeeMapping = async () => {
    const anyChecked = tbodyData.some((item) => item.isChecked);
    if (!anyChecked) {
      notify("Kindly select The data", "error");
      return;
    }
  
    // Construct the payload with the correct format
    let RecPayload = tbodyData
      .filter((val) => val?.isChecked)
      .map((val) => ({
        centreID: values?.allCenter?.value || 0,
        employeeID: values?.employee?.value || "string",
        deptCode: values?.department?.value || "string",
        reqAreaCode: values?.requestArea?.value || "string",
        costCentreDetails: [
          {
            centreID: val?.CentreID || 0,
            employeeID: val?.EmployeeID || "string",
            deptCode: val?.DeptCode || "string",
            reqAreaCode: val?.ReqAreaCode || "string",
            costCentreCode: val?.CostCentreCode || "string"
          }
        ]
      }));
  
    try {
      const ReciveResp = await SaveCostCentreemployeeMapping(...RecPayload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success"); 
        tablebindCCMappingBackendData();
      } else {
        notify("Some Error Occurs", "error");
      }
    } catch (error) {
      notify("Kindly select at least one Data", "error");
    }
  };
  
  useEffect(() => {
    tablebindCCMappingBackendData();
  }, [values?.employee?.value]);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Auto Purchase Request Behalf Of Sales")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Center To")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"allCenter"}
            name={"allCenter"}
            removeIsClearable={true}
            dynamicOptions={[
              // { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                center,
                "TextField",
                "ValueField"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.allCenter?.value}`}
          />

          <ReactSelect
            placeholderName={t("Department")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"department"}
            name={"department"}
            removeIsClearable={true}
            dynamicOptions={[
              // { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                department,
                "TextField",
                "ValueField"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
          />

          <ReactSelect
            placeholderName={t("Request Area")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"requestArea"}
            name={"requestArea"}
            removeIsClearable={true}
            dynamicOptions={[
              // { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                requestArea,
                "TextField",
                "ValueField"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.requestArea?.value}`}
          />

          <ReactSelect
            placeholderName={t("Employee")}
            searchable={true}
            requiredClassName={"required-fields"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"employee"}
            name={"employee"}
            removeIsClearable={true}
            dynamicOptions={[
              // { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                employess,
                "TextField",
                "ValueField"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.employee?.value}`}
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary mr-1"
              onClick={handleSaveCostCentreemployeeMapping}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
     {
      tbodyData?.length>0?    <div className="card">
      <div className=" mt-2 spatient_registration_card">
        <Heading title={t("Cost Center List")} isBreadcrumb={false} />
        <Tables
          thead={THEAD}
          tbody={tbodyData?.map((val, index) => ({
            sno: index + 1,
            costcentercode: val.CostCentreCode,
            constcentername: val.CostCentre,
          //   checkbox: (
          //     <>
          //       <input
          //         type="checkbox"
          //         checked={selectedRows.includes(index)}
          //         onChange={() => handleRowSelect(index)}
          //       />
          //     </>
          //   ),

          isChecked: (
              <input
                type="checkbox"
                checked={val.isChecked}
                onChange={(e) => handleChangeCheckbox(e, index)}
                disabled={values?.status?.value === "Y" || values?.status?.value === "R"}
              />
            ),
          }))}
          style={{ maxHeight: "23vh" }}
        />
      </div>
    </div> :""
     }
    </div>
  );
};

export default CostCenterAccess;
