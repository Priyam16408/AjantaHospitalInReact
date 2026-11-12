import { AutoComplete } from "primereact/autocomplete";
import React, { useEffect, useState } from "react";
import { SearchByICDDesc } from "../../networkServices/DoctorApi";
import Tables from "../UI/customTable";
import {
  DischargeSummaryBindPatient,
  DischargeSummaryICDCodeRemove,
  DischargeSummaryICDDescriptionSave,
  DischargeSummaryICDMasterSave,
} from "../../networkServices/dischargeSummaryAPI";
import { notify } from "../../utils/utils";
import Modal from "../modalComponent/Modal";
import PatientDiagnosisInformationModal from "../modalComponent/Utils/PatientDiagnosisInformationModal";
import { useTranslation } from "react-i18next";


const PatientDiagnosisInformation = ({
  pageTableData,
  setPageTableData,
  data,
}) => {
 const [t] = useTranslation();


  const { transactionID, patientID } = data;
  const THEADPATIENTDIAGNOSISINFORMATION = [
    t("S.No."),
    t("Section"),
    t("Section Desc."),
    t("Sub Section"),
    t("Sub Section Desc."),
    t("ICD Code"),
    t("ICD Desc."),
    t("Remove"),
  ];
  
  const [suggestions, setSuggestions] = useState([]);
  const [renderModal, setRenderModal] = useState({
    header: null,
    component: null,
    modalWidth: null,
    show: false,
    footer: null,
  });
  const [searchByICD, setSearchByICD] = useState({
    searchByICDDecs: "",
  });

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

  const SearchByICDDescgetData = (event) => {
    const { query } = event;
    SearchByICDDescData(query);
  };

  const handleChangebySerachByICD = (e, name) => {
    const { value } = e;
    setSearchByICD((prev) => ({
      ...prev,
      [name]: typeof value === "object" ? "" : value,
    }));
  };

  const itemTemplate = (item) => (
    <div>
      <strong>{item.WHO_Full_Desc}</strong> ({item.ICD10_3_Code})
    </div>
  );

  const handleDischargeSummaryBindPatient = async (transactionID) => {
    try {
      const response = await DischargeSummaryBindPatient(transactionID);
      setPageTableData({
        ...pageTableData,
        PatientDiagnosisInformation: response?.data,
      });
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleDischargeSummaryICDDescriptionSave = async (item) => {
    try {
      const response = await DischargeSummaryICDDescriptionSave({
        icdDescription: [
          {
            codeID: String(item?.icd_id),
            tid: String(transactionID),
            patientID: String(patientID),
            icdCode: String(item?.ICD10_Code),
          },
        ],
      });

      notify(response?.message, response?.success ? "success" : "error");
      setSearchByICD({ ...searchByICD, searchByICDDecs: "" });
      handleDischargeSummaryBindPatient(transactionID);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleSelect = async (e) => {
    const selectedValue = e.value;
    handleDischargeSummaryICDDescriptionSave(selectedValue);
  };

  const handleDeleteDischargeSummaryICDCodeRemove = async (ID) => {
    try {
      const response = await DischargeSummaryICDCodeRemove({
        ipd: String(transactionID),
        args: String(ID),
      });
      notify(response?.message, response?.success ? "success" : "error");
      handleDischargeSummaryBindPatient(transactionID);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleSaveDischargeSummaryICDMasterSave = async (requestBody) => {
    debugger;
    try {
      const response = await DischargeSummaryICDMasterSave(requestBody);
      if (response?.success) {
        setRenderModal({
          header: null,
          modalWidth: null,
          footer: null,
          component: null,
          show: false,
        });
      }
     // await notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleDischargeSummaryICDDescriptionSave({
          icd_id: response?.data,
          ICD10_Code: requestBody?.diagnosisCode,
          
        });
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };
  const handleDischargeSummaryICDMasterCancle = async () => {
    debugger;
        setRenderModal({
          header: null,
          modalWidth: null,
          footer: null,
          component: null,
          show: false,
        });
  };

  const handleTbody = (tableData) => {
    return tableData?.map((items, index) => {
      return {
        Sno: index + 1,
        Section: items?.Group_Code,
        SectionDesc: items?.Group_Desc,
        subSection: items?.ICD10_3_Code,
        subSectionDesc: items?.ICD10_3_Code_Desc,
        icdCode: items?.ICD10_Code,
        icdDesc: items?.WHO_Full_Desc,
        Action: (
          <div
            className="text-center p-1"
            onClick={() => handleDeleteDischargeSummaryICDCodeRemove(items?.ID)}
          >
            <i className="fa fa-trash text-danger" />
          </div>
        ),
      };
    });
  };

  useEffect(() => {
    handleDischargeSummaryBindPatient(transactionID);
  }, []);


  return (
    <>
      <div className="col-sm-10">
        <div className="d-flex align-items-center">
          {/* <div style={{ cursor: "pointer" }}>
            <i
              className="pi pi-pen-to-square"
              onClick={() => {
                setRenderModal({
                  component: (
                    <PatientDiagnosisInformationModal
                      handleSubmit={handleSaveDischargeSummaryICDMasterSave}
                      handleCancle = {handleDischargeSummaryICDMasterCancle}
                    />
                  ),
                  header: "ICD Master ",
                  modalWidth: "50vw",
                  show: true,
                  footer: <></>,
                });
              }}
            />
          </div> */}
          <AutoComplete
            completeMethod={(e) => SearchByICDDescgetData(e)}
            className="tag-input w-100"
            value={searchByICD.searchByICDDecs}
            placeholder="Search By ICD Desc and press Enter"
            onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
            suggestions={suggestions}
            name={"searchByICDDecs"}
            onSelect={handleSelect}
            id="searchByICDDecs"
            // onKeyPress={handleKeyPress}
            itemTemplate={itemTemplate}
          />
        </div>
      </div>
      <div className="col-12 p-0 mt-1">
        <Tables
          thead={THEADPATIENTDIAGNOSISINFORMATION}
          tbody={handleTbody(pageTableData?.PatientDiagnosisInformation)}
          tableHeight={"scrollView"}
        />
      </div>

      {renderModal?.show && (
        <Modal
          Header={renderModal?.header}
          visible={renderModal?.show}
          setVisible={() => {
            setRenderModal({
              header: null,
              component: null,
              modalWidth: null,
              show: false,
            });
          }}
          footer={renderModal?.footer}
          modalWidth={renderModal?.modalWidth}
        >
          {renderModal?.component}
        </Modal>
      )}
    </>
  );
};

export default PatientDiagnosisInformation;
