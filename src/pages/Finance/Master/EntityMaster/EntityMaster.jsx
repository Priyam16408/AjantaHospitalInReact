import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import { useEffect } from "react";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import Input from "../../../../components/formComponent/Input";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import EntityMasterDetails from "./EntityMasterDetails";
import { BindMasterCreation, FinanceBindDoctorDepartment, FinanceBindHREmployeeDepartment, FinanceLoadType, FinanceSaveMasterCreation } from "../../../../networkServices/finance";



const EntityMaster = () => {
  const IS_ACTIVE_OPTION = [
    {
      label: "Yes",
      value: "1",
    },

    {
      label: "No",
      value: "0",
    },
  ];
  const [isEdit, setIsEdit] = useState(false)
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [dropDownData, setDropDownState] = useState({
    LoadTypes: [],
    EmployeeDepartment:[],
    DoctorDepartment:[]

  });
  const [bindAllIntity, setBindAllIndity] = useState([])

  const [values, setValues] = useState({
    entityTypes: "",
    description: "",
    bindDoctor:"",
    employee:"",
    isActive: {
      label: "Yes",
      value: "1",
    },

  });

  console.log("values", values)
  const FinanceLoadTypes = async () => {
    try {
      const response = await FinanceLoadType();

      setDropDownState((val) => ({
        ...val,
        LoadTypes: handleReactSelectDropDownOptions(
          response?.data,
          "TypeName",
          "TypeCode"
        ),
      }));

      // setValues((preV) => ({
      //   ...preV,
      //   entityTypes: response?.data[0]
      // }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const BindHREmployeeDepartment = async () => {
    try {
      const response = await FinanceBindHREmployeeDepartment();

      setDropDownState((val) => ({
        ...val,
        EmployeeDepartment: handleReactSelectDropDownOptions(
          response?.data,
          "Dept_Name",
          "Dept_ID"
        ),
      }));

      // setValues((preV) => ({
      //   ...preV,
      //   entityTypes: response?.data[0]
      // }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const BindDoctorDepartment = async () => {
    try {
      const response = await FinanceBindDoctorDepartment();

      setDropDownState((val) => ({
        ...val,
        DoctorDepartment: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "ID"
        ),
      }));

      // setValues((preV) => ({
      //   ...preV,
      //   entityTypes: response?.data[0]
      // }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const FinanceBindMasterCreation = async () => {
    try {
      const response = await BindMasterCreation();
      if (response?.success) {
        setBindAllIndity(response?.data)
      }
     
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e, key) => {
    setValues((val) => ({ ...val, [name]: e }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };


  const handleSaveCreation = async () => {
    if (!values?.entityTypes?.TypeCode) {
      notify("Type is Required", "error")    
      return
    }
    if (!values?.description) {
     
      notify("Description is Required", "error")
      return
    }
    // debugger
    if(values?.entityTypes?.value=="D" || values?.entityTypes?.TypeCode=="D" ){
      if ( !values?.employee) {
      // if (!values?.employee?.value || !values?.employee) {

        notify("Employee Dept is Required", "error")
        return
      }
      if (!values?.bindDoctor) {
      // if (!values?.bindDoctor?.value) {
        console.log("Doctor Dept is Required")
        notify("Doctor Dept is Required", "error")
        return
      }
    }
    const payload = {
      "type": values?.entityTypes.TypeCode,
      "desc": values?.description,
      "savetype": isEdit?"Update":"Save",
      "isActive": values?.isActive?.value,
      "id": isEdit?String(values?.ID):"",
      "hrEmployeeDeptID": Number(values?.employee?.value || values?.employee),
      "doctorDeptID": Number(values?.bindDoctor?.value || values?.bindDoctor)
    }

    try {
      const response = await FinanceSaveMasterCreation(payload);

      if (response?.success) {
        notify(response?.message, response?.success ? "success" : "error");
        setValues((preV)=>(
          {
...preV,
entityTypes: "",
description: "",
bindDoctor:"",
employee:"",
id: "",
isActive: {
  label: "Yes",
  value: "1",
},
          }
        ))
setIsEdit(false)
FinanceBindMasterCreation()

      }

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    FinanceLoadTypes()
    FinanceBindMasterCreation()
    BindHREmployeeDepartment()
    BindDoctorDepartment()
  }, []);

  const handleEdit = (val) => {

    setIsEdit(true)
    setValues((preV) => (
      {
        ...preV,
        description: val?.Description,
        // isActive: val?.isActive,
        ID:val?.ID,
        bindDoctor:val?.DoctorDeptID,
        employee:val?.HREmployeeDeptID,
        // entityTypes:val?.Type
        entityTypes: {
          TypeCode: val?.Type,
          // TypeName: "Department"
        },
        isActive: val?.IsActive == 1 
  ? { label: "Yes", value: "1" } 
  : { label: "No", value: "0" }

      }
    ))
  }
  const handleCencel = () => {
    setIsEdit(false)
    setValues({
      entityTypes: "",
      description: "",
      isActive: {
        label: "Yes",
        value: "1",
      }
    })

  }
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("Entity Master")} isBreadcrumb={false} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("Type")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"entityTypes"}
              name={"entityTypes"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={dropDownData?.LoadTypes}
              requiredClassName="required-fields"
              value={values?.entityTypes?.TypeCode}
            />


            <Input
              type="text"
              className="form-control required-fields"
              id="description"
              lable={t("Description")}
              placeholder=" "
              required={true}
              value={values?.description}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              name="description"
              onChange={handleChange}
            />

            <ReactSelect
              placeholderName={t("IsActive")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id={"isActive"}
              name={"isActive"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={IS_ACTIVE_OPTION}
              value={values?.isActive?.value}
            />
            {
             values?.entityTypes?.TypeCode=="D" && (<>
                <ReactSelect
                placeholderName={t("Employee Dep")}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                id={"employee"}
                name={"employee"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={dropDownData?.EmployeeDepartment}
                requiredClassName="required-fields"
                value={values?.employee}
              />
                <ReactSelect
                placeholderName={t("Doctor Dept")}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                id={"bindDoctor"}
                name={"bindDoctor"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={dropDownData?.DoctorDepartment}
                requiredClassName="required-fields"
                value={values?.bindDoctor}
              />
              </>
              )
            }
            <div className="col-xl-2 col-md-3 col-sm-6 col-12">
              
              {
                isEdit ? (
                  <>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={handleSaveCreation}
                    >
                      {t("Update")}
                    </button>
                    <button
                      className="btn btn-sm btn-primary ml-2"
                      onClick={handleCencel}
                    >
                      {t("Cancel")}
                    </button>
                  </>

                )
                  :
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSaveCreation}
                  >
                    {t("Save")}
                  </button>
              }
            </div>
          </div>
        </div>
      </div>
      <EntityMasterDetails bindAllIntity={bindAllIntity} onEdit={handleEdit} />
    </>
  );
};

export default EntityMaster;
