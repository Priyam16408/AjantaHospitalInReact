import React, { useEffect, useRef, useState } from "react";
import "../OPD/NewChildVaccination/EditVaccinationStatusModal.css";
import Modal from "../../../components/modalComponent/Modal";
import EditVaccinationStatusModal from "./NewChildVaccination/EditVaccinationStatusModal";
import { useTranslation } from "react-i18next";
import {
  GetBindNewChildVaccineChart,
  GetBindPatentDOB,
  handleSaveOrUpdatePatientDOB,
} from "../../../networkServices/DoctorApi";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import { notify } from "../../../utils/ustil2";

const NewChildVaccinationChart = ({ patientDetail }) => {
  const [t] = useTranslation();
  const scrollRef = useRef(null);
  const [handleModelData, setHandleModelData] = useState({ isOpen: false });
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [dates, setDates] = useState({
    DOB: new Date(),
  });
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates((prev) => ({ ...prev, [name]: value }));
  };
  const [isDOBModalOpen, setIsDOBModalOpen] = useState(false);
  useEffect(() => {
    setIsDOBModalOpen(true);
  }, []);
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allSelected = vaccineOptions.map((v) => ({
        value: v.value,
        label: v.label,
      }));
      setSelectedCards(allSelected);
    } else {
      setSelectedCards([]);
    }
  };
  // const handleCardSelect = (value, label,vaccine) => {

  //   setSelectedCards((prev) => {
  //     const isAlreadySelected = prev.some((item) => item.value === value);
  //     if (isAlreadySelected) {
  //       return prev.filter((item) => item.value !== value.value);
  //     } else {
  //       return [...prev, { value: value, label: label,vaccine }];
  //     }
  //   });
  // };

  const handleCardSelect = (value, label, vaccine) => {
    setSelectedCards((prev) => {
      const isAlreadySelected = prev.some((item) => item.value === value);

      if (isAlreadySelected) {
        // REMOVE item correctly
        return prev.filter((item) => item.value !== value);
      } else {
        // ADD item
        return [...prev, { value, label, vaccine }];
      }
    });
  };

  const isAllSelected =
    vaccineOptions.length > 0 && selectedCards.length === vaccineOptions.length;

  const handleClick = (Details) => {
    setHandleModelData({
      isOpen: true,
      width: "80vw",
      label: Details.itemLabel,
      Component: Details.Component,
      Details: Details,
    });
  };

  const handleClose = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const getChildVaccination = async (item) => {
    // debugger;
    let payload = {
      patientID: patientDetail?.PatientID || "",
      transactionID: patientDetail?.TransactionID || "",
      appID: patientDetail?.App_ID || "",
      type: "",
      previewSetting: item?.vaccineList?.map((ele) => ({
        masterID: String(ele?.vaccineId) || "2",
        accordianName: ele?.vaccineName || "Birth",
        isChecked: 0,
      })),
    };

    try {
      const response = await GetBindNewChildVaccineChart(payload);
      if (response?.success) {
        setTableData(response.data);
        if (item) {
          // const labels = item?.VaccineName?.split(",") || [];
          // const values = item?.MappingID?.split(",") || [];
          const options = item?.vaccineList.map((label, index) => ({
            label: label?.vaccineName,
            value: label?.vaccineId,
            isGivenOrDue: Number(label?.isGivenOrDue),
            givenDate: label?.givenDate || "", // ✅ add
            dueDate: label?.dueDate || "",
            VaccineStatus: label?.vaccineStatus,
            cvsid: label?.cvsid,
            fullItem: item,
          }));
          setVaccineOptions(options);
          setSelectedCards([]);
        }
      } else {
        // setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // setTableData([]);
    }
  };

  const getDob = async () => {
    // debugger;
    try {
      const res = await GetBindPatentDOB(patientDetail?.PatientID);
      if (res?.success) {
        setDates((prev) => ({
          ...prev,
          DOB: res?.data?.[0]?.DOB ? new Date(res.data[0].DOB) : null,
          age: res?.data?.[0]?.Age,
        }));
      }
    } catch (error) {
      console.error("Error fetching DOB:", error);
    }
  };
  useEffect(() => {
    getChildVaccination();
    getDob();
  }, [patientDetail]);
  const calculateAge = (dob) => {
    if (!dob) return "";

    const today = moment();
    const birthDate = moment(dob);

    const years = today.diff(birthDate, "years");
    birthDate.add(years, "years");

    const months = today.diff(birthDate, "months");
    birthDate.add(months, "months");

    const days = today.diff(birthDate, "days");

    return `${years}Y ${months}M ${days}D`;
  };

  const handleDOBModalOpen = async () => {
    try {
      const calculatedAge = calculateAge(dates?.DOB);

      const payload = {
        patientId: patientDetail?.PatientID || "",
        age: calculatedAge,
        dob: dates?.DOB ? moment(dates.DOB).format("YYYY-MM-DDTHH:mm:ss") : "",
      };

      const res = await handleSaveOrUpdatePatientDOB(payload);

      if (res?.success) {
        notify(res?.message, "success");
        getChildVaccination();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(patientDetail, "patientDetail");
  return (
    <>
      {/* <div className="d-flex align-items-center age-wrapper">
        <button
          className="btn btn-light arrow-btn"
          onClick={() => scroll("prev")}
        >
          ‹
        </button>

        <div className="age-scroll" ref={scrollRef}>
          {tableData?.map((item, index) => (
            <div
              key={index}
              className="age-pill"
              onClick={() => getChildVaccination(item)}
            >
              <span className="dotss"></span>
              {item.dayName}
            </div>
          ))}
        </div>

        <button
          className="btn btn-light arrow-btn"
          onClick={() => scroll("next")}
        >
          ›
        </button>
      </div> */}
      <div className="d-flex align-items-center age-wrapper">
        <button
          className="btn btn-success btn-sm arrow-btn"
          onClick={() => scroll("prev")}
        >
          ‹
        </button>

        <div className="age-scroll" ref={scrollRef}>
          {tableData?.map((item, index) => (
            <div
              key={index}
              className={`age-pill ${activeIndex === index ? "active" : ""}`}
              onClick={() => {
                setActiveIndex(index);
                getChildVaccination(item);
              }}
            >
              <span className="dotss"></span>
              {item.dayName}
            </div>
          ))}
        </div>

        <button
          className="btn btn-success btn-sm arrow-btn"
          onClick={() => scroll("next")}
        >
          ›
        </button>
      </div>

      <div className="card p-2">
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            id="selectAll"
          />
          <label
            className="form-check-label fw-semibold ml-4"
            htmlFor="selectAll"
          >
            Select All
          </label>
        </div>

        <div className="row px-2">
          {vaccineOptions?.map((vaccine, index) => {
            {
              /* debugger */
            }
            const isSelected = selectedCards.some(
              (item) => item.value === vaccine.value,
            );
            return (
              <div className="col-sm-4 p-2" key={index}>
                <div
                  className={`vaccine-card ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    if (vaccine?.isGivenOrDue !== 1) {
                      handleCardSelect(vaccine.value, vaccine?.label, vaccine);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    border: isSelected
                      ? "1px solid #007bff"
                      : "1px solid #dee2e6",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="fw-semibold mb-1">{vaccine.label}</h6>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={vaccine?.isGivenOrDue === 1}
                      onChange={() =>
                        handleCardSelect(
                          vaccine?.value,
                          vaccine?.label,
                          vaccine,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="badge-box mt-2">
                      <small>
                        {vaccine?.isGivenOrDue === 1
                          ? `Given Date : ${vaccine?.givenDate || "--"}`
                          : `Due Date : ${vaccine?.givenDate || "--"}`}
                      </small>
                      <br />
                      {/* <small>Based On DOB</small> */}
                    </div>
                    <div className="badge-status mt-2">
                      <p className="mb-0">
                        Status :{" "}
                        {vaccine?.isGivenOrDue  === 1 ? "Done" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row d-flex justify-content-end mt-2">
        <div className="col-sm-2">
          <button
            className="btn rounded btn-primary w-100"
            disabled={selectedCards.length === 0}
            onClick={() => {
              handleClick({
                itemLabel: "Update Details",
                Component: (
                  <EditVaccinationStatusModal
                    handleClose={handleClose}
                    refreshData={() => getChildVaccination()}
                    isAllSelected={isAllSelected}
                    selectedCards={selectedCards}
                    data={dates}
                    patientDetail={patientDetail}
                    vaccineOptions={vaccineOptions}
                    getChildVaccination={getChildVaccination}
                  />
                ),
              });
            }}
          >
            Update
          </button>
        </div>
      </div>

      {handleModelData.isOpen && (
        <Modal
          visible={handleModelData.isOpen}
          setVisible={handleClose}
          modalWidth={handleModelData.width}
          Header={t(handleModelData.label)}
          footer={<></>}
        >
          {handleModelData.Component}
        </Modal>
      )}
      {isDOBModalOpen && (
        <Modal
          visible={isDOBModalOpen}
          setVisible={() => setIsDOBModalOpen(false)}
          modalWidth="400px"
          Header={t("Add Date of Birth")}
          footer={<></>}
        >
          <div className="row p-3">
            <DatePicker
              lable={t("Date of Birth")}
              name="DOB"
              value={dates?.DOB}
              showTime
              hourFormat="12"
              handleChange={handleDateChange}
              respclass="col-12"
            />
            <button
              className="btn btn-primary mt-3 w-100"
              onClick={() => {
                setIsDOBModalOpen(false);
                handleDOBModalOpen();
              }}
            >
              Save & Continue
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NewChildVaccinationChart;
