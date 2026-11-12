import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
import { useTranslation } from "react-i18next";
import { PrescriptionAdviceGetNewChildVaccineChart } from "../../../networkServices/DoctorApi";
import UpdateGivenDateModal from "./NewChildVaccination/UpdateGivenDateModal";
import EditVaccinationStatusModal from "./NewChildVaccination/EditVaccinationStatusModal";

const NewChildVaccinationChart = ({ patientDetail }) => {
  const [t] = useTranslation();
  console.log(patientDetail);
  const [tableData, setTableData] = useState([]);

  const [handleModelData, setHandleModelData] = useState({});

  const chartHeading = [
    { width: "1%", name: t("Age") },
    { width: "5%", name: t("Vaccine Name") },
    { width: "5%", name: t("Due On") },
    { width: "5%", name: t("Given Date") },
    { width: "5%", name: t("Make") },
    { width: "1%", name: t("Remarks") },
  ];

  const getChildVaccination = async () => {
    let payload = {
      patientID: patientDetail?.PatientID || "",
      transactionID: patientDetail?.TransactionID || "",
      appID: patientDetail?.App_ID || "",
      type: "",
    };

    try {
      const response = await PrescriptionAdviceGetNewChildVaccineChart(payload);
      // console.log("the department respone is", response);
      if (response.success) {
        setTableData(response.data);
        // getTableHeaders(response.data)
        console.log("😁😀got entires ", response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setTableData([]);
    }
  };

  const handleClickReject = (Details) => {
    const { itemLabel, Component } = Details;

    setHandleModelData({
      isOpen: true,
      width: "80vw",
      label: "Edit Vaccination Status",
      // label: itemLabel,
      Component: Component,
    });
    console.log(Details);
  };

  const handleClose = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  useEffect(() => {
    getChildVaccination();
  }, []);

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={handleClose}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          footer={<></>}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="card patient_registration border mt-2">
        <Heading title={t("Vaccination Chart")} isBreadcrumb={false} />
        {/* {console.log("chartHeading", chartHeading)} */}
        <Tables
          thead={chartHeading}
          tbody={tableData?.map((item, index) => {
            return {
              Age: <strong>{item?.DispalyName}</strong>,
              "Vaccine Name": item?.VaccineName,
              "Due On": (
                <div className="p-1">
                  <span>Expected Date: {item?.ExpectedDate}</span>

                  <br />
                  <span
                    className={
                      Number(item?.SMS_Send) === 1
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    Reminder: {Number(item?.SMS_Send) === 1 ? "Yes" : "No"}
                  </span>
                </div>
              ),
              "Given Date": (
                <div
                  onDoubleClick={() => {
                    if (
                      Number(item?.VaccineStatus) === 1 ||
                      item?.ExpectedDate === null ||
                      item?.ExpectedDate === ""
                    ) {
                      return;
                    }
                    handleClickReject({
                      itemLabel: "Update Given Date",
                      Component: (
                        <EditVaccinationStatusModal/>
                        // <UpdateGivenDateModal
                        //   inputData={{
                        //     vaccinationMapId: item?.MappingID,
                        //     patientId: patientDetail?.PatientID || "",
                        //     transactionId:
                        //       patientDetail.currentPatient?.TransactionID || "",
                        //     dob: tableData[0]?.DOB || "",
                        //     dueDate: item?.ExpectedDate || "",
                        //     vaccineName: item?.VaccineName || "",
                        //     duration: item?.DispalyName || "",
                        //     DayMasterId: item?.DayMasterId || 0,
                        //   }}
                        //   handleClose={handleClose}
                        //   getChildVaccination={getChildVaccination}
                        // />
                      ),
                    });
                  }}
                >
                  <span> Given Date: {item?.GivenDate}</span>
                  <br />
                  <span
                    className={
                      Number(item?.VaccineStatus) === 1
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {" "}
                    Vaccination Status:{" "}
                    {Number(item?.VaccineStatus) === 1 ? "Done" : "Pending"}
                  </span>
                </div>
              ),
              Make: "",
              Remarks: item?.Remarks,
            };
          })}
        />
      </div>
    </>
  );
};

export default NewChildVaccinationChart;
