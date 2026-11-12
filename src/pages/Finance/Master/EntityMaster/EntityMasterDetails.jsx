import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../../components/UI/customTable";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
const EntityMasterDetails = ({bindAllIntity,onEdit}) => {
  
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const THEADData= [
    t("S.No."),
    t("Type"),
    t("Code"),
    t("Description"),
    t("Employee Dept"),
    t("Doctor Dept"),
    t("Created By"),
    t("Created Date"),
    t("Status"),
    t("Edit"),
  ];

  const handleEdit = (val) => {
    console.log("val",val)
    if(onEdit){
      onEdit(val)
    }

  };

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("Entity Master Details")} isBreadcrumb={false} />
          {/* <div className="row px-2"> */}
              <Tables thead={THEADData}
              //  tbody={tbody} 
               tbody={
                bindAllIntity?.map((val, index) => (
                   {
                    SNo: index + 1,
                    Type: val?.TypeName,
                    Code: val?.CODE,
                    Description: val?.Description,
                    EmployeeDept: val?.HREmployeeDeptName,
                    DoctorDept: val?.DoctorDept,
                    Createdby:val?.EntryBy,
                    CreatedDate: val?.EntryDate,
                    Status: val?.Active,
                   
                    Edit: <i className="fa fa-edit" onClick={() => handleEdit(val)}></i>,
                  }
                ))
               } 
               style={{ maxHeight: "60vh" }}
               />
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default EntityMasterDetails;
