import React, { useState, useEffect } from "react";
import Heading from "../../../../components/UI/Heading";
// import {ReactSelect} from "../../../components/formComponent/ReactSelect";
import {

  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Tables from "../../../../components/UI/customTable";
import { CancelSVG } from "../../../../components/SvgIcons";
import { BindBranchCentre, BindScreenControl, FinanceCostBindMapping, FinanceCostChangeStatus, FinanceCostLoadGroupRecords, FinanceCostSaveMapping, FinanceFinanceAccount } from "../../../../networkServices/finance";
import { ImCross } from "react-icons/im";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
function CostCentreMapping() {
    const localData = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const [bindData, setBindData] = useState([])
  const [values, setValues] = useState({
    center: {value:localData?.defaultCentre},
    fDepartment: {},
    costCentre:{},
    chartAc:{},
    requirement :{}

  });
  const [dropDownState, setDropDownState] = useState({
    getDepartment: [],
    GetBindAllCenter: [],
    getCostCentre:[],
    getChartOFAC:[],
    GetRequirement:[]
  })

  const handleReactChange = (name, e, key) => {
    setValues((val) => ({ ...val, [name]: e }));
  };

  const THEAD = [
    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("Centre Name") },
    { width: "5%", name: t("Department") },
    { width: "5%", name: t("Cost Centre") },
    { width: "5%", name: t("Chart Of A/C") },
    { width: "5%", name: t("Date") },
    { width: "5%", name: t("Cancel") },
  ];


  const getMappingData = async () => {
    try {
      const response = await FinanceCostBindMapping()
      if (response?.success) {
        setBindData(response?.data)
      }
      else {
        console.log(response?.message, "error")
      }
    } catch (error) {

    }
  }
  const handleSaveMapping = async () => {
    if (!values?.fDepartment?.value) {
      notify("Department is required.", "error");
      return;
    }
    if (!values?.requirement?.value) {
      notify("Requirement is required.", "error");
      return;
    }
  
    if (!values?.costCentre?.value) {
      notify("Cost Centre is required.", "error");
      return;
    }
    if (!values?.chartAc?.value) {
      notify("Chart of Accounts is required.", "error");
      return;
    }
 
    const payload = {
      "cid": String(values?.center?.value),
      "did": String(values?.fDepartment?.value),
      "rid": String(values?.requirement?.value ), 
      "ccid": String(values?.costCentre?.value),
      "fid": String(values?.chartAc?.value)
    };
  
    try {
      const apiResp = await FinanceCostSaveMapping(payload);

  
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        getMappingData()
        setValues({})
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify(error.message, "error");
    }
  };
  
  const GetBindAllCenter = async () => {
    try {
      const response = await BindBranchCentre();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: handleReactSelectDropDownOptions(
          response?.data,
          "CentreName",
          "CentreID"
        ),
      }));

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const CostLoadGroupRecords = async () => {
    try {
      const response = await FinanceCostLoadGroupRecords();
      const filterRes=response?.data?.filter((val)=>val?.Type=="C")
      setDropDownState((val) => ({
        ...val,
        getCostCentre: handleReactSelectDropDownOptions(
          filterRes,
         
          "Description",
          "DescriptionCode"
        ),
      }));
     
      const filterReq=response?.data?.filter((val)=>val?.Type=="R")
      setDropDownState((val) => ({
        ...val,
        GetRequirement: handleReactSelectDropDownOptions(
          filterReq,
          "Description",
          "DescriptionCode"
        ),
      }));

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const FinanceAccount = async () => {
    try {
      const response = await FinanceFinanceAccount();
      
      if(response?.success){
        setDropDownState((val) => ({
          ...val,
          getChartOFAC: handleReactSelectDropDownOptions(
            // filterRes,
            response?.data,
            "AccountName",
            "COAID"
          ),
        }));

      }
      
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const FinDepartment = async () => {
    try {
      const response = await BindScreenControl();
     if(response?.success){
      var responseData = response?.data?.filter((val) => val?.TypeID === 1 && val?.TypeCode == 'D');
      setDropDownState((val) => ({
        ...val,
        getDepartment: handleReactSelectDropDownOptions(
          responseData,
          "TextField",
          "DeptCode"
        ),
      }));
     }

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const handleChaneMapping=async(val)=>{
    
    const payload={
      "additionalProp1": val?.ID
    }
    try {
      const response= await FinanceCostChangeStatus(payload)
      if(response?.success){
        getMappingData()
     
        notify(response?.message,"success")
      }
      else{
        notify(response?.message,"error")
      }
    } catch (error) {
      console.log("error",error)
    }
  }

  useEffect(() => {
    GetBindAllCenter()
    FinDepartment()
    getMappingData()
    CostLoadGroupRecords()
    FinanceAccount()
  }, [])
  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("Department/Requirements Area")}
          isBreadcrumb={false}
        />

        <div className="row p-2">
          <ReactSelect
          isDisabled={true}
            placeholderName={t("Centre Name")}
            // requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"center"}
            name={"center"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetBindAllCenter}
            value={values?.center?.value || values?.center?.CentreID}
          />
          <ReactSelect
            placeholderName={t("Department")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"fDepartment"}
            name={"fDepartment"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.getDepartment}
            value={values?.fDepartment?.value}
          />
          <ReactSelect
            placeholderName={t("Requirement Area")}
            requiredClassName={"required-fields"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"requirement"}
            name={"requirement"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={dropDownState?.GetRequirement}
            value={values?.requirement?.value }
          />

          <ReactSelect
            placeholderName={t("Cost Centre")}
            id={"costCentre"}
            name={"costCentre"}
            searchable={true}
            requiredClassName={"required-fields"}
            removeIsClearable={true}
            dynamicOptions={dropDownState?.getCostCentre}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
           
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.costCentre?.value }
          
          />
          <ReactSelect
            placeholderName={t("Chart Of A/C")}
            id={"chartAc"}
            requiredClassName={"required-fields"}
            searchable={true}
            removeIsClearable={true}
            dynamicOptions={dropDownState?.getChartOFAC}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            handleChange={(name, e) => handleReactChange(name, e)}
            value={values?.chartAc?.value }
            name={"chartAc"}
          />


          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-lg btn-success"
              type="button"
              onClick={handleSaveMapping}
            >
              {t("Save")}
            </button>
          </div>
        </div>

        <Heading title={t("Cost Centre Mapping")} isBreadcrumb={false} />
        <div className="card">
          <Tables
            thead={THEAD}
            tbody={bindData?.map((val, index) => ({
              sno: index + 1,
              centreName: val.CName,
              Department: val.DName,
              CostCentre: val.CCName,
              ChartOfAC: val.FName,
              date: val.EntryDate,
              Cancel:
                (
                  <span
                    onClick={() =>
                      handleChaneMapping(val)
                    }
                  >
                    <i className="fa fa-trash text-danger" />
                  </span>
                ) 
            }))}
            style={{ maxHeight: "50vh", padding: "2px" }}
          />
        </div>

      </div>
    </>
  );
}

export default CostCentreMapping;
