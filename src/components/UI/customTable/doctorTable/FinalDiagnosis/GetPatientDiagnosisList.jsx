import React, { useState } from 'react'
import Tables from '../..';
import { useTranslation } from 'react-i18next';

const GetPatientDiagnosisList = (props) => {
  const {tbody,handleDelete} = props
    const {t} = useTranslation();

    const THEAD = [
      t("S.No."),
      t("Section"),
      t("SectionDesc"),
      t("Subsection"),
      t("ICDCode"),
      t("ICDDesc"),
      t("Remove"),
    ];
  
    return (
      <>
        <Tables
          thead={THEAD}
          tbody={tbody.map((ele,index)=>({
            "S.No.":index+1,
            "Section":ele.Group_Code,
            "Section Desc.":ele.Group_Desc,
            // "Sub Section.":ele.ICD10_3_Code,
            "Sub Section":ele.WHO_Full_Desc,
            "ICD Code.":ele.ICD10_Code,
            "ICD Desc.":ele.ICD10_3_Code_Desc,
            "Romove":(
              <>
              <i className='fa fa-trash text-danger text-center' onClick={()=> handleDelete(ele)} style={{color:"red", padding:"5px"}}  ></i>
              </>
            ),
          }))}
          tableHeight={"tableHeight"}
        />
      </>
    );
  };
export default GetPatientDiagnosisList