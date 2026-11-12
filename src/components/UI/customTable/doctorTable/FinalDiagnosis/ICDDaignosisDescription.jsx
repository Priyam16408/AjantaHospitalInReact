import React, { useState } from 'react'
import Tables from '../..';
import { useTranslation } from 'react-i18next';

const ICDDaignosisDescription = ({tbody,handleDelete}) => {
    const [t] = useTranslation();

    const THEAD = [
      t("S.No."),
      t("Sub Section"),
      t("Sub Section Desc.		"),
      t("ICD Code"),
      t("ICD Desc."),
      t("Romove"),
    ];
  
  
    return (
      <>
        <Tables
          thead={THEAD}
          tbody={tbody.map((ele,index)=>({
            "S.No.":index+1,
            "Sub Section":ele.Group_Desc,
            "Sub Section Code.":ele.Group_Code,
            "ICD Code":ele.ICD10_3_Code,
            "ICD Desc.":ele.ICD10_3_Code_Desc,
            "Romove":(
              <>
              <i className='fa fa-trash text-danger text-center' style={{color:"red", padding:"6px"}} onClick={()=>handleDelete(ele)}></i>
              </>
            ),
          }))}
          tableHeight={"tableHeight"}
        />
      </>
    );
  };
export default ICDDaignosisDescription