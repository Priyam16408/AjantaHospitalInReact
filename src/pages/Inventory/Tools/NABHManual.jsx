import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from '../../../components/UI/customTable'
import Heading from "../../../components/UI/Heading";
import { notify } from "../../../utils/utils";
import { GetDrugFormularyPdf, NabhManualGetNabhDetail, NabhManualGetNabhpdf } from "../../../networkServices/InventoryApi";

const NABHManual = () => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([{
   
  }])

  const getItems = async () => {
    try {
      const response = await NabhManualGetNabhDetail();
      if (response.success) {
        setTableData(response.data)
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      notify(apiResp?.message, "error");
    }
  };


  useEffect(() => {
    getItems()
  }, [])

  const THEAD = [
    { name: t("S.No."), width: "0.2%" },
    { name: t("NABHMANUAL")},
    { name: t("Download"), width: "5%" },
  ]

  const HandlePrint = async (ID) => {
    try {
      const response = await NabhManualGetNabhpdf(ID);
  
      if (response.success && response.data) {
        const base64Data = response.data;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const pdfURL = URL.createObjectURL(blob);
        window.open(pdfURL, "_blank");
        notify("success", "PDF opened successfully");
        getItems();
  
      } else {
        notify(response?.message || "Failed to load PDF", "error");
      }
    } catch (error) {
      console.error("Error fetching PDF data:", error);
      notify("Error fetching PDF", "error");
    }
  };
  

  return (
    <div className="m-2 spatient_registration_card card">
      <Heading title={t("Nabh Manual")} isBreadcrumb={false} />
      <div className="patient_registration card">
        <div className="row">
          <div className="col-12">
            <Tables
              thead={THEAD}
              tbody={tableData?.map((val, ind) => ({
                Sno: ind + 1,
                title: val?.FileName,
                download: <span onClick={() => HandlePrint(val.ID)}><i className="fa fa-print text-print" /></span>
                ,
              }))}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NABHManual