import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import {
  NursingWardPatientDocumentDetail,
  NursingWardSaveViewUploadDocument,
} from "../../networkServices/nursingWardAPI";
import moment from "moment";
import Tables from "../UI/customTable";
import {
  getBase64,
  notify,
  NursingPatientTableDataModifiedDocument,
  NursingWardSaveViewUploadDocumentPayload,
} from "../../utils/utils";

const UploadPatientDocuments = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const { transactionID, patientID } = data;

  const [payload, setPayload] = useState({
    date: new Date(),
    uploadDate: new Date(),
  });

  
const THEAD = [
  t("SNo"),
   t("Upload Date"),
   t("Form Name"),
   t("Choose File"),
   t("Remarks"),
   t("View"),
 ];
 
  const handleNursingWardPatientDocumentDetail = async (
    transactionID,
    DocumentDate
  ) => {
    try {
      const responseData = await NursingWardPatientDocumentDetail(
        transactionID,
        moment(DocumentDate).format("YYYY-MM-DD")
      );

      const reponseModified = await NursingPatientTableDataModifiedDocument(
        responseData?.data
      ); 
      
      setTableData(reponseModified);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const ip = localStorage.getItem("ip");

  const handleNursingWardSaveViewUploadDocument = async () => { 
    try {
      const response = NursingWardSaveViewUploadDocumentPayload(tableData);

      console.log("the response is 👍👍👍👍",response);
      const apiResponse = await NursingWardSaveViewUploadDocument({
        transactionID: String(transactionID),
        uploadDate: String(moment(payload?.uploadDate).format("YYYY-MM-DD")),
        ipAddress: ip,
        documents: response,
      });

      if (apiResponse?.success) {
        notify(apiResponse?.message, "success");
        handleNursingWardPatientDocumentDetail(transactionID, payload?.date);
      } else {
        notify(apiResponse?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleImage = async (e, index) => {
    const { name, files } = e.target;
    const base64 = await getBase64(files[0]);
    const data = [...tableData];

    data[index][name] = base64.split(",")[1];
    setTableData(data);
  };

  console.log(tableData);


  const handleRemarkChange = (index, newRemark) => {
  const updatedData = [...tableData];
  updatedData[index].Remark = newRemark;
  setTableData(updatedData);
};

// const handleViewDocument = (url) => {
//   // if (!url) return;
//   console.log("url",url);
//   window.open(url, "_blank"); // Open in a new tab
// };


const handleViewDocument = (base64Data) => {
  if (!base64Data) return;

  // Detect file type from Base64 length or customize based on your metadata
  let fileType = "image/jpeg"; // Change to 'application/pdf' or detect based on file name/mime type
  let base64Prefix = base64Data.startsWith("data:")
    ? base64Data
    : `data:${fileType};base64,${base64Data}`;

  // Open in new tab using iframe (better for large content)
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head><title>Document Preview</title></head>
        <body style="margin:0">
          <iframe src="${base64Prefix}" frameborder="0" style="width:100vw; height:100vh;" allowfullscreen></iframe>
        </body>
      </html>
    `);
  } else {
    alert("Please enable pop-ups to view the document.");
  }
};


  const handletableChange = (tableData) => {
    
    return tableData?.map((items, index) => {
      console.log(items?.DocumentData,"the items data iS");
      const { Name, Visible, Remark, URL, ImageName, DocumentDate } = items;
      // console.log("items-----",items, "-------item 🐱‍🚀🐱‍🚀🐱‍🚀");
      return {
        "S.NO": index + 1,
        DocumentDate: DocumentDate ? DocumentDate : "",
        Name: Name ? Name : "",
        ImageName: (
          <div>
          <input
            type="file"
            name="URL"
            onChange={(e) => handleImage(e, index)}
          />
          
          
          {items?.ImageName && (
            <div>
              <span>{ImageName}</span>
            </div>
          )}
        </div>
        
        ),
        // ImageName:ImageName?ImageName:"",
        Remark:   <input
    key={index}
    className="form-control"
    value={items.Remark || ""}
    onChange={(e) => handleRemarkChange(index, e.target.value)}
  />,
        Visible: <div  onClick={() => handleViewDocument(items.DocumentData)}> {t("View")} </div>,
      };
    });
  };

  useEffect(() => {
    handleNursingWardPatientDocumentDetail(transactionID, payload?.date);
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Upload Patient Documents")}
            isBreadcrumb={false}
          />

          <div className="row p-2">
            <DatePicker
              className="custom-calendar"
              id="reportingDate"
              name="reportingDate"
              placeholder={VITE_DATE_FORMAT}
              lable={t("Date of Reporting")}
              showTime
              hourFormat="12"
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              value={payload?.date}
            />

            <div className="col-12">
              <Tables thead={THEAD} tbody={handletableChange(tableData)} />
            </div>

            <div className="col-12 mt-2">
              <div className="d-flex justify-content-end">
                <DatePicker
                  className="custom-calendar"
                  id="reportingDate"
                  name="reportingDate"
                  placeholder={VITE_DATE_FORMAT}
                  lable={t("Date of Reporting")}
                  showTime
                  value={payload?.uploadDate}
                  hourFormat="12"
                />

                <div className="mx-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleNursingWardSaveViewUploadDocument}
                  >
                    {t("Upload")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPatientDocuments;
