import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { AutoComplete } from "primereact/autocomplete";
import {
  DeleteDiagnosis,
  DiagnosisInformationSave,
  GetPatientDiagnosis,
  SearchByICDCode,
  SearchByICDDesc,
} from "../../../networkServices/DoctorApi";
import Modal from "../../../components/modalComponent/Modal";
import PatientDaignosisInformationModal from "../../../pages/doctor/OPD/PatientDaignosisInformationModal";
import ICDDaignosisDescription from "../../../components/UI/customTable/doctorTable/FinalDiagnosis/ICDDaignosisDescription";
import { notify } from "../../../utils/utils";
import Heading from "../../../components/UI/Heading";
import GetPatientDiagnosisList from "../../../components/UI/customTable/doctorTable/FinalDiagnosis/GetPatientDiagnosisList";
import { useTranslation } from "react-i18next";

const FinalDiagnosis = forwardRef((props, ref) => {
  const { data } = props;
  const { t } = useTranslation();
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
  });
  const [searchByICD, setSearchByICD] = useState({
    searchByICDDecs: "",
  });
  const [apiData, setApiData] = useState({
    GetPatientDiagnosisData: [],
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedICDData, setSelectedICDData] = useState([]);
  console.log(selectedICDData);

  const [error, setError] = useState(""); // Error state to handle duplicate entries

  const handleOpenModal = () => {
    setModalData((prev) => ({ ...prev, visible: true, size: "80vw" }));
  };

  const SearchByICDDescData = async (query) => {
    try {
      const apiRes = await SearchByICDDesc({
        prefixText: query,
        count: 10,
      });

      const suggestionData = apiRes?.data?.map((item) => ({
        WHO_Full_Desc: item?.WHO_Full_Desc,
        ICD10_3_Code: item?.ICD10_3_Code,
        ...item, // Include the entire object for later use
      }));

      setSuggestions(suggestionData);
    } catch (error) {
      console.error(error);
    }
  };

  const itemTemplate = (item) => (
    <div>
      <strong>{item.WHO_Full_Desc}</strong> ({item.ICD10_3_Code})
    </div>
  );

  const SearchByICDDescgetData = (event) => {
    const { query } = event;
    SearchByICDDescData(query);
  };

  const handleChangebySerachByICD = (e, name) => {
    const { value } = e;
    setSearchByICD((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelect = (e) => {
    const selectedValue = e.value;
    const isDuplicate = selectedICDData.some(
      (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
    );

    if (!isDuplicate) {
      setSelectedICDData((prev) => [...prev, selectedValue]);
      setSearchByICD({ searchByICDDecs: "" }); // Clear the input
      setError(""); // Clear any previous error
    } else {
      const errorMessage = "This ICD code has already been added.";
      setError(errorMessage); // Set the error state
      setSearchByICD({ searchByICDDecs: "" }); // Clear the input
      notify(errorMessage, "error"); // Notify the user
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      const selectedValue = suggestions[0];
      const isDuplicate = selectedICDData.some(
        (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
      );

      if (!isDuplicate) {
        setSelectedICDData((prev) => [...prev, selectedValue]);
        setSearchByICD({ searchByICDDecs: "" }); // Clear the input
        setError(""); // Clear any previous error
      } else {
        const errorMessage = "This ICD code has already been added.";
        setError(errorMessage); // Set the error state
        setSearchByICD({ searchByICDDecs: "" }); // Clear the input
        notify(errorMessage, "error"); // Notify the user
      }
    }
  };

  const handleDelete = (item) => {
    //console.log(item);
    const delItem = selectedICDData.filter((val) => val.id !== item.id);
    setSelectedICDData(delItem);
  };

  useImperativeHandle(ref, () => ({
    callChildFunctionSaveDiagnosisInformationSave: saveDiagnosisInformationSave,
  }));

  const saveDiagnosisInformationSave = async () => {
    // toggleAction("SaveDiagnosis")
    // debugger
    // setActionType("SaveDiagnosis")
    const newPayload = {
      diagnosisInformation: selectedICDData.map((ele) => ({
        icd_id: ele.icd_id,
        transactionID: data?.TID,
        icD_Code: ele.ICD10_Code,
        patientID: data?.PatientID,
        whoFullDesc: ele.WHO_Full_Desc,
        isActive: 1,
        isOT: 0,
      })),
    };

    try {
      const res = await DiagnosisInformationSave(newPayload);
      if (res.success) {
        notify(res.message, "success");
        setSelectedICDData([]);
        getGetPatientDiagnosisAPI();
      }
      console.log(res);
    } catch (error) {}
  };

  const getGetPatientDiagnosisAPI = async () => {
    try {
      const res = await GetPatientDiagnosis({
        patientID: data?.PatientID,
        transactionID: data?.TID,
        appID: data?.App_ID,
        Type: "emg",
      });
      setApiData((prev) => ({ ...prev, GetPatientDiagnosisData: res.data }));
      console.log(res);
    } catch (error) {}
  };

  useEffect(() => {
    getGetPatientDiagnosisAPI();
  }, []);

  const handleDeleteGetRow = async (item) => {

    try {
      const res = await DeleteDiagnosis({
        icd_id: item?.icd_id,
        patientID: data?.PatientID,
        transactionID: data?.TID,
        appID: data?.App_ID,
      });

      if (res.success) {
        notify(res.message, "success");
        getGetPatientDiagnosisAPI();
      }
    } catch (error) {}
  };

  const handleAPI = (data) => {
    console.log("handleAPI", data);
  };
  return (
    <>
      <div className="m-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={"Patient Diagnosis Information ( with ICD Codes )"}
          />
          <div className="row g-4 m-2 align-items-center">
            <AutoComplete
              completeMethod={(e) => SearchByICDDescgetData(e)}
              className="tag-input"
              value={searchByICD.searchByICDDecs}
              placeholder="Search By ICD Desc and press Enter"
              onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
              suggestions={suggestions}
              name={"searchByICDDecs"}
              onSelect={handleSelect}
              id="searchByICDDecs"
              onKeyPress={handleKeyPress}
              itemTemplate={itemTemplate}
            />

            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <button
                className="btn btn-sm custom-button w-100"
                onClick={handleOpenModal}
              >
                {t("Create new ICD Code")}
              </button>
            </div>
            <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 d-flex align-items-center">
              <button
                className="btn btn-sm custom-button w-100"
                onClick={saveDiagnosisInformationSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalData.visible && (
        <Modal
          visible={modalData.visible}
          Header={t("Patient Diagnosis Information ( with ICD Codes )")}
          modalWidth={modalData?.size}
          onHide={modalData?.setVisible}
          setVisible={() => {
            setModalData((val) => ({ ...val, visible: false }));
          }}
          handleAPI={handleAPI}
        >
          <PatientDaignosisInformationModal />
        </Modal>
      )}
      <ICDDaignosisDescription
        tbody={selectedICDData}
        handleDelete={handleDelete}
      />

      <GetPatientDiagnosisList
        tbody={apiData.GetPatientDiagnosisData}
        handleDelete={handleDeleteGetRow}
      />
    </>
  );
});

export default FinalDiagnosis;
