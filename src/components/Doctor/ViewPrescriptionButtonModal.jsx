import { useEffect, useState } from "react";
import DoctorPrescriptionModalPrint from "../../pages/Purchase/Order/PurchaseOrderApproval/DoctorPrescriptionModalPrint";
import {
  DoctorPrescriptionPrintPDF,
  GetOpdPrintOptionsApi,
} from "../../networkServices/DoctorApi";
import { notify } from "../../utils/utils";

export default function ViewPrescriptionButtonModal({
  prescriptionOptions,
  patientDetail,
  closeModal,
  setHandleModelData,
  handleModelData,
  setIsVisibleOldPrescription,
}) {
  const [prescriptions, setPrescriptions] = useState(prescriptionOptions);
  const [apiData, setApiData] = useState([]);
  const baseurl = import.meta.env.VITE_APP_REACT_APP_BASE_URL;
  const [isApiDataLoaded, setIsApiDataLoaded] = useState(false);

  // useEffect(() => {
  //   if (isApiDataLoaded) {
  //     const newPrescriptionOptions = prescriptions.map((item) => {
  //       const matchingApiItem = apiData.find(
  //         (apiItem) => apiItem.ID === item.ID
  //       );

  //       return {
  //         ...item,
  //         IsChecked: matchingApiItem ? matchingApiItem.IsChecked : 1,
  //       };
  //     });

  //     setPrescriptions(newPrescriptionOptions);
  //   }

  //   handleGetPrintOptions();
  //   // return () => {
  //   //   setMappedData({});
  //   // };
  // }, [isApiDataLoaded]);

  // const handleGetPrintOptions = async () => {
  //   try {
  //     const res = await GetOpdPrintOptionsApi();
  //     if (res?.success) {
  //       setIsApiDataLoaded(true);
  //       res?.data?.length > 0 && setApiData(res?.data);
  //     } else {
  //       notify("Failed to load the preview", "error");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     notify("Failed to load the preview", "error");
  //   }
  // };

useEffect(() => {
  handleGetPrintOptions();
}, []);

const handleGetPrintOptions = async () => {
  try {
    const res = await GetOpdPrintOptionsApi();
    if (res?.success) {
      const updatedPrescriptions = prescriptions.map((item) => ({
        ...item,
        IsChecked: 1,
      }));

      setPrescriptions(updatedPrescriptions);
      setApiData(res.data);
      setTimeout(() => {
        DoctorPrescriptionPrint();
        closeModal();
      }, 100);
    } else {
      notify("Failed to load the preview", "error");
    }
  } catch (error) {
    console.log(error);
    notify("Failed to load the preview", "error");
  }
};



  const handleCheckboxChange = (e, i) => {
    const updatedValue = [...prescriptions];
    updatedValue[i]["IsChecked"] = e.target.checked ? 1 : 0;
    setPrescriptions(updatedValue);
  };

  const DoctorPrescriptionPrint = async () => {
    if (handleModelData?.isOpen) {
      return;
    }
    // `

    try {
      let payload = {
        pid: patientDetail?.PatientID,
        transactionID: patientDetail?.TransactionID,
        appID: patientDetail?.App_ID,
        previewSetting: prescriptions?.map((item) => {
          return {
            MasterId: item?.ID,
            IsChecked: 1,
            AccordianName: item?.AccordianName,
          };
        }),
      };

      let apiResp = await DoctorPrescriptionPrintPDF(payload);

      if (apiResp?.success && apiResp?.data) {
        let pdfUrl = apiResp?.data;
        let isPrint;
        if (pdfUrl?.toLowerCase().endsWith(".html")) {
          window.open(pdfUrl, "_blank");
          return;
        } else if (pdfUrl && pdfUrl.startsWith("https://")) {
          pdfUrl = pdfUrl;
        } else {
          pdfUrl = `${baseurl}/${apiResp?.data}`;
        }

        setHandleModelData({
          isOpen: true,
          width: "100vw",
          label: "Doctor Prescription",
          Component: (
            <DoctorPrescriptionModalPrint url={pdfUrl} isPrint={isPrint} />
          ),
        });
      }
    } catch (error) {
      console.log(error);
      notify("Failed to load the preview", "error");
    }
  };



  return (
    <>
      <h2 className="mb-2 text-center default-font-size">
        Your prescription has been successfully saved.
      </h2>
      <div
        style={{
          maxHeight: "310px",
          overflowY: "auto",
          borderTop: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h3 className="font-weight-bold pt-2">Print Options</h3>
        <ul
          className="d-flex flex-wrap"
          style={{ listStyle: "none", paddingLeft: 0, gap: "5px" }}
        >
          {prescriptions?.map((item, index) => (
            <li
              key={item?.ID}
              className="d-flex align-items-center w-100"
              style={{ gap: "5px" }}
            >
              <input
                type="checkbox"
                className="theme-color background-theme-color doc-checkbox"
                checked={item["IsChecked"] === 1 ? true : false}
                onChange={(e) => handleCheckboxChange(e, index)}
              />
              <label className="py-1 px-2 ml-1 rounded mb-0 theme-color background-theme-color">
                {item?.AccordianName}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="d-flex justify-content-end pt-2">
        <button
          className="btn btn-success"
          onClick={() => {
            DoctorPrescriptionPrint();
            closeModal();
          }}
        >
          Preview
        </button>

        <button className="btn btn-secondary ml-3" onClick={closeModal}>
          close
        </button>
      </div>
    </>
  );
}
