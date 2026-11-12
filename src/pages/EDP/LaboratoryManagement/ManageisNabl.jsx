import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {} from "../../../networkServices/EDP/edpApi";
import Input from "../../../components/formComponent/Input";
import {
  // BindInvestigations,
  GetNablInvestigations,
  LoadHeadDepartment,
  manageDeliveryBindCentre,
  SaveIsNABLInv,
} from "../../../networkServices/EDP/karanedp";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import { BindInvestigation } from "../../../networkServices/opdserviceAPI";


function ManageisNabl() { 
  const [t] = useTranslation(); 
  const isMobile = window.innerWidth <= 800;
  const [values, setValues] = useState({
    centre: "",
    SubCategory: "",
    testName: "",
    SearchByName:""
  });
  const [investigation, setInvestigation] = useState([]);
  const [bindCentre, setBindCentre] = useState([]);
  const [loadDepartment, setloadDepartment] = useState([]);
  const [bindNabData,setBindNabdata] = useState([]);
  
    const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  

  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);
    const updatedData = bindNabData.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setBindNabdata(updatedData);
  };

  // Handle tbody checkbox
  const handleChangeCheckbox = (e, index) => {
    const updatedData = [...bindNabData];
    updatedData[index].isChecked = e.target.checked;
    setBindNabdata(updatedData);
    const allChecked = updatedData.every((item) => item.isChecked);
    setIsHeaderChecked(allChecked);
  };

  const SearchByName = [
    { value: "0", label: "By First Name" },
    { value: "1", label: "In Between" },
  ];

  const Thead = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Sub category")},
    { width: "15%", name: t("Item Name") },
    { width: "15%", name: t("DayType") },
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
  ]

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlemanageDeliveryBindCentre = async () => {
    try {
      const response = await manageDeliveryBindCentre();
      if (response.success) {
        setBindCentre(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindCentre([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindCentre([]);
    }
  };

  const handleBindInvestigations = async () => {
    try {
      const response = await BindInvestigation(values?.centre?.value);
      if (response.success) {
        console.log("the department data is", response);
        setInvestigation(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response 
        );
        setInvestigation([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setInvestigation([]);
    }
  };

  const handleLoadHeadDepartment = async () => {
    try {
      const response = await LoadHeadDepartment(values?.centre);
      if (response.success) {
        console.log("the department data is", response);
        setloadDepartment(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setloadDepartment([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setloadDepartment([]);
    }
  };

  // GetNablInvestigations 

   

  const handleGetNablInvestigations = async () => {
    try {
      const response = await GetNablInvestigations(values?.SubCategory?.value);
      if (response.success) {
        setBindNabdata(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindNabdata([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindNabdata([]);
    }
  };
  

  // SaveIsNABLInv       
    const handleSaveIsNABLInv = async () => { 
      const anyChecked = bindNabData.some((item) => item.isChecked);
       
      if (!anyChecked) {
        notify("Kindly select at least one data", "error");
        return;
      }
    
      console.log("the data is anyChecked", anyChecked);
    
      // Prepare a single object with a key `data` containing selected items
      const selectedItems = bindNabData
        .filter(val => val?.isChecked)
        .map(val => ({
          centreID: val?.Type_ID,
          subCategoryID: val?.SubCategoryID,
          investigation_ID: val?.Type_ID,
          isNABL: val?.isNABL
        }));
      const payloadObject = {
        data: selectedItems
      };
    
      try {
        const ReciveResp = await SaveIsNABLInv(payloadObject);
        if (ReciveResp.success) {
          notify(`${ReciveResp?.message}`, "success");
          handleGetNablInvestigations();
        } else {
          notify(ReciveResp?.message, "error");
        }
      } catch (error) {
        console.log("Error while saving NABL data:", error);
      }
    };


  useEffect(() => {
    handlemanageDeliveryBindCentre();
    handleLoadHeadDepartment(); 
  }, []);

  useEffect(()=>{
    handleGetNablInvestigations();
  },[values?.SubCategory?.value])
  useEffect(() => {
    handleBindInvestigations();
  }, [values?.centre?.value]);

  return (
    <div className="card">
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Centre")}
          id={"centre"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="centre"
          dynamicOptions={[
            // { value: "0", label: "ALL" },
            ...handleReactSelectDropDownOptions(
              bindCentre,
              "CentreName",
              "CentreID"
            ),
          ]}
          handleChange={handleSelect}
          value={`${values?.centre?.value}`}
        />

        {/* loadDepartment */}

        <ReactSelect
          placeholderName={t("Sub Category")}
          id={"SubCategory"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="SubCategory"
          dynamicOptions={[
            // { value: "0", label: "ALL" },
            ...handleReactSelectDropDownOptions(
              loadDepartment,
              "Name",
              "ObservationType_ID"
            ),
          ]}
          handleChange={handleSelect}
          value={`${values?.SubCategory?.value}`}
        />


        <Input
          type="text"
          className="form-control"
          id="testName"
          placeholder=" "
          name="testName"
          value={values?.testName || ""}
          onChange={handleChange}
          lable={t("Test Name")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <ReactSelect
          placeholderName={t("Search By Name")}
          id={"SearchByName"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="SearchByName"
          dynamicOptions={SearchByName}
          handleChange={handleSelect}
          value={`${values?.SearchByName?.value}`}
        />
      </div>

      {bindNabData.length > 0 && (
        <>
          <div className="card">
            <Tables
              thead={Thead}
              tbody={bindNabData?.map((val, index) => ({
                sno: index + 1,
                subCategotu:val?.DeptName,
                itemName:val?.InvName,
                daybl:val?.isNABL,
                checkbox: (
                  <input
                    type="checkbox"
                    checked={val.isChecked}
                    onChange={(e) => handleChangeCheckbox(e, index)}
                  />
                ),

              }))}
              tableHeight={"scrollView"}
              style={{ height: "70vh", padding: "2px" }}
            />
         
          </div>

          <div className="col-sm-2 col-xl-1 d-flex">
            <button
              className="btn btn-sm btn-success"
              type="button" 
              onClick={handleSaveIsNABLInv}
            >
              {t("Save")}
            </button>
          </div>

          </>
          
        )}
           
    </div>
  );
}

export default ManageisNabl;
