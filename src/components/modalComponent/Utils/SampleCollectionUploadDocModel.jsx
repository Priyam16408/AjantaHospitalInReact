import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import LabeledInput from "../../formComponent/LabeledInput";
import Tables from "../../UI/customTable";
import { bindSampleColleDocumentList, handleOpenDocumentAPI } from "../../../networkServices/nursingWardAPI";
import moment from "moment";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { notify } from "../../../utils/utils";

export default function SampleCollectionUploadDocModel({ handleChangeModel, inputData }) {

  const [tBody, setTbody] = useState([])
  const getDocList = async () => {
    let apiResp = await bindSampleColleDocumentList(inputData?.transactionID)
    if (apiResp?.success) {
      setTbody(apiResp?.data)
    }
  }

  useEffect(() => {
    getDocList()
  }, [])


  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);
  const handlechange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const handlechangeDocument = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setInputs((val) => ({ ...val, document: reader.result }))
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);

  const thead = [
    { width: "1%", name: t("View") },
    // { width: "1%", name: t("NursingWard.SampleCollection.Download") },
    t("Updated Date"),
    t("NursingWard.SampleCollection.UploadedBY")
  ]

  const handleOpenDocument = async (Index) => {
    console.log(tBody[Index]?.FileUrl)
    let apiResp = await handleOpenDocumentAPI(tBody[Index]?.FileUrl)
    if (apiResp?.success) {
      RedirectURL(response?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }
  }

  return (
    <>
      <div className="row p-2">
        <LabeledInput
          label={t("UHID")}
          value={inputData?.patientID}
          className={"col-6 mb-2"}
        />
        <LabeledInput
          label={t("PatientName")}
          value={inputData?.pName}
          className={"col-6 mb-2"}
        />
        <Input
          type="text"
          className="form-control required-fields"
          id="DocumentType"
          name="DocumentType"
          lable={t("DocumentType")}
          placeholder=" "
          respclass="col-6 mb-2"
          onChange={handlechange}
        />

        <div className="col-6 mb-2">
          <input type="file" name="document" id="" onChange={handlechangeDocument} />
        </div>

      </div>
      <Tables
        thead={thead}
        tbody={tBody?.map((val, index) => ({
          view: <i className="fa fa-eye" onClick={() => { handleOpenDocument(index) }}></i>,
          asa: moment(val?.Updatedate).format("YYYY-MMM-DD"),
          UploadedBy: <>{val?.UploadedBy}</>,
        }))}
      // tableHeight={"nurse-assignment-table-height"}
      />
    </>

  );
}
