import React, { useState } from 'react'
import Tables from '../..';
import { useTranslation } from 'react-i18next';
import Heading from '../../../Heading';
import { ConsentFormPrint } from '../../../../../networkServices/DoctorApi';
import { RedirectURL } from '../../../../../networkServices/PDFURL';
import { notify } from '../../../../../utils/utils';

const ConsentFormTable = (props) => {
    const {tbody,handleSavePatientConsentDelete,handleEditPatient} = props
    const [t] = useTranslation();

    const THEAD = [
      t("S.No.		"),
      t("UHID"),
      t("Patient Name		"),
      t("Date		"),
      t("Type		"),
      t("Actions	"),
      // t("Reject"),
      // t("Print"),
    ];
      console.log("tbodytbody",tbody)

      const printConsentForm = async(param) => {
        try {
          let payload = {
             "TemplateId":param
          }
          let res = await ConsentFormPrint(payload)

          if(res?.success){
            // console.log("res",res)
            RedirectURL(res?.data)
          }
          console.log("res",res)
          
        } catch (error) {
          console.log("error",error)
          notify(error?.message,"error")
          
        }
      }
   
    return (
      <>

      {tbody.length > 0 && <>
        <Heading
          title={t("Consent Details")}
          // isBreadcrumb={true}
        />
        <Tables
          thead={THEAD}
          tbody={tbody.map((item,index)=>({
            "S.No.":index+1,
            UHID:item?.PatientID,
            "Patient Name":item?.PatientName,
            Date:item?.EntryDate,
            Type:item?.ConsentType,
            Actions: (
                <div style={{
                  display:"flex",
                  // justifyContent:"center",
                  gap:"10px",
                  padding:"6px "
                }}>
                 {/* <button
                className="btn btn-sm custom-button "
                onClick={()=>handleEditPatient(item)}
              > */}

                <i className=' fa fa-edit ' onClick={()=>handleEditPatient(item)}></i>
              {/* </button> */}
              {/* <button
                className="btn btn-sm custom-button "
                 */}
              {/* > */}

                <i className='fa fa-trash text-danger text-center' onClick={()=>handleSavePatientConsentDelete(item)}></i>
              {/* </button> */}
              {/* <button
                className="btn btn-sm custom-button "
              > */}
               <i className='pi pi-print' onClick={()=>{
                console.log("item",item)
                printConsentForm(item?.ID)
               }}></i>
              {/* </button> */}
                </div>
            ),
           
          }))}
          tableHeight={"tableHeight"}
        />
      </>}
       
      </>
    );
  };
export default ConsentFormTable