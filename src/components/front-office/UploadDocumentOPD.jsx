import React from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DocumentUploadTable from "../UI/customTable/DocumentUploadTable";

function UploadDocumentOPD() {
  const [t] = useTranslation();
  return (
    <div className="">
      {/* <Heading
        title={t("FrontOffice.PatientRegistration.DocumentUpload.PageName")}
      /> */}

      <DocumentUploadTable />
    </div>
  );
}

export default UploadDocumentOPD;
