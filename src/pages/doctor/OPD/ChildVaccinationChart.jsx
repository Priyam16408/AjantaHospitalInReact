import React, { useEffect, useState } from "react";
import { PrescriptionAdviceGetChildVaccineChart } from "../../../networkServices/DoctorApi";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/modalComponent/Modal";
import UpdateGivenDateModal from "./ChildVaccination/UpdateGivenDateModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ChildVaccinationChart = ({ patientDetail }) => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [chartHeading, setChartHeading] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});
  const [containerWidth, setContainerWidth] = useState(0);

  // container width for responsiveness
  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector(".table-responsive-container");
      if (container) setContainerWidth(container.offsetWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getTableHeaders = (data) => {
    if (!data.length) return [];
    const allKeys = Object.keys(data[0]);
    const excludedKeys = ["DOB", "KeyDescription", "VaccineName"];
    const filteredKeys = allKeys.filter((key) => !excludedKeys.includes(key));

    const formattedKeys = filteredKeys.map((key) =>
      key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    );

    setChartHeading(["Vaccine Name", ...formattedKeys]);
  };

  const getChildVaccination = async () => {
    const payload = {
      patientID: patientDetail?.PatientID || "",
    };

    try {
      const response = await PrescriptionAdviceGetChildVaccineChart(payload);
      if (response.success) {
        setTableData(response.data);
        getTableHeaders(response.data);
      } else {
        console.error("API returned success as false:", response);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
    }
  };

  const handleClickReject = (Details) => {
    const { itemLabel, Component } = Details;
    setHandleModelData({
      isOpen: true,
      width: "20vw",
      label: itemLabel,
      Component: Component,
    });
  };

  const handleClose = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  useEffect(() => {
    getChildVaccination();
  }, []);

  const isDateMoreThanTwoWeeksFuture = (dateString) => {
    if (!dateString) return false;
    const expectedDate = new Date(dateString);
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return expectedDate > twoWeeksFromNow;
  };

  // Column width styles
  const getColumnStyle = (header) => {
    if (header.includes("Remarks")) {
      return { minWidth: "200px", maxWidth: "250px", whiteSpace: "normal" };
    }
    return { minWidth: "150px", maxWidth: "200px" ,};
  };

  // render vaccine cell (frozen first column)
  const vaccineTemplate = (rowData) => {
    return (
      <div
        className="py-3 text-center font-bold"
        style={{
          background: "#dc3545",
          color:"#ffff",
          position: "sticky",
          left: 0,
          zIndex: 2,
        }}
      >
        {rowData.VaccineName}
      </div>
    );
  };

  // render dynamic columns
  const dynamicColumns = chartHeading.slice(1).map((header) => {
    return (
      <Column
        key={header}
        header={header}
        style={getColumnStyle(header)}
        body={(rowData, { rowIndex }) => {
          const fieldKey = header.replace(/ /g, "_");
          const value = rowData[fieldKey] || "######";

          if (
            value === "######" ||
            !value.includes("#") ||
            value.split("#")[3] === ""
          ) {
            return <span>-</span>;
          }

          const parts = value.split("#");
          const expectedDate = parts[3] || "";
          const vaccineName = parts[0] || "";
          const duration = parts[1] || "";
          const mappingID = parts[2] || "";
          const givenDate =
            parts[5] === "######" || !parts[5] ? "" : parts[5];
          const remarksAdded = parts[8] || "";
          const vaccinationStatus = parts[6];
          const isDone = vaccinationStatus === "1";
          const isTooFarInFuture = isDateMoreThanTwoWeeksFuture(expectedDate);

          const statusText =
            vaccinationStatus === "0"
              ? "Pending"
              : vaccinationStatus === "1"
              ? "Done"
              : vaccinationStatus === "2"
              ? "Cancel"
              : "";

          const reminder =
            parts[7] === "1" ? "Yes" : parts[7] === "0" ? "No" : "";

          return (
            <div
              className={`px-1 ${isDone ? "bg-success" : ""}`}
              style={{ cursor: "pointer" }}
              onDoubleClick={() => {
                if (expectedDate && !isDone && !isTooFarInFuture) {
                  handleClickReject({
                    itemLabel: "Update Vaccination Given Date",
                    Component: (
                      <UpdateGivenDateModal
                        inputData={{
                          vaccinationMapId: mappingID,
                          patientId: patientDetail?.PatientID || "",
                          transactionId:
                            patientDetail.currentPatient?.TransactionID || "",
                          dob: rowData.DOB || "",
                          dueDate: expectedDate || "",
                          vaccineName: vaccineName || "",
                          duration: duration || "",
                          givenDate: givenDate || "",
                        }}
                        handleClose={handleClose}
                        getChildVaccination={getChildVaccination}
                      />
                    ),
                  });
                }
              }}
            >
              <div>Expected Date: {expectedDate || "-"}</div>
              <div>Given Date: {givenDate || "-"}</div>
              <div>Status: {statusText || "-"}</div>
              <div>Reminder: {reminder || "-"}</div>
              {remarksAdded && (
                <div style={{ wordBreak: "break-word" }}>
                  Remarks: {remarksAdded}
                </div>
              )}
            </div>
          );
        }}
      />
    );
  });

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={handleClose}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType="button"
          footer={<></>}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="card patient_registration border mt-2">
        <Heading title={t("Vaccination Chart")} isBreadcrumb={false} />

        <div className="table-responsive-container" style={{ overflowX: "auto" }}>
          <DataTable
            value={tableData}
            scrollable
            scrollHeight="455px"
            frozenWidth="100px"
            // className="mt-2"
          >
            {/* Frozen Vaccine Name column */}
            <Column
              field="VaccineName"
              header="Vaccine Name"
              body={vaccineTemplate}
              frozen
              style={{ minWidth: "150px" }}
            />
            {dynamicColumns}
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default ChildVaccinationChart;
