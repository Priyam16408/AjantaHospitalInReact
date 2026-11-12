import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import AppointmentPatientDetail from "../../../components/UI/customTable/doctorTable/ViewConsultationtable/AppointmentPatientDetail";
import Tables from "../../../components/UI/customTable";
import {
  GetBindAllDoctorConfirmation,
  GetBindDepartment,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useFormik } from "formik";
import {
  AUTOCOMPLETE_STATE,
  ViewConsultationPayload,
  VIEWSTATUS,
} from "../../../utils/constant";
import moment from "moment";
import {
  getDoctorNotes,
  getGetDoctor,
  getGetMolecular,
  getGetSignAndSymptoms,
  getListBindMenu,
  getProcedureItemSearch,
  getVaccinationStatus,
  LoadInvestigation,
  SearchChiefComplaintTemplate,
  SearchDietTemplate,
  SearchDoctorAdvoice,
  SearchGeneralExamination,
  SearchList,
  SearchPastHistory,
  SearchPersonalHistory,
  SearchPrescribeMedicine,
  SearchProvisionalDiagnosis,
  SearchTreatmentHistory,
  SystematicExamination,
  UpdateCall,
  UpdateIn,
  UpdateUncall,
} from "../../../networkServices/DoctorApi";
import PendingAppointmentPatientList from "../../../components/UI/customTable/doctorTable/ViewConsultationtable/PendingAppointmentPatientList";
import { filterByTypes, notify } from "../../../utils/utils";
// import audioFile from "../../../assets/Audio/notification.mp3";
import audioFile from "../../../assets/Audio/notification.mp3";
import audioFileOut from "../../../assets/Audio/notifyOut.mp3";
import DoneAppointmentDetail from "../../../components/UI/customTable/doctorTable/ViewConsultationtable/DoneAppointmentDetail";
import { SearchListData } from "../../../store/reducers/DoctorModule/VitalSign";
import { PatientSearchbyBarcode } from "../../../networkServices/opdserviceAPI";

const EmergencyNote = ({data}) => {
  const [items, setItems] = useState(AUTOCOMPLETE_STATE);

  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const [active, setActive] = useState(true);
  const [calledPatient, setCalledPatient] = useState("UnCall");
  const [bodyData, setBodyData] = useState({
    SearchViewConsultaionList: [],
    DoneAppointmentListList: [],
  });

  let audio = new Audio(audioFile);
  let audioFileP = new Audio(audioFileOut);

  const handleStartAudioPatientComing = (params) => {
    if (params.IsCall === 1) {
      audioFileP.play();
    } else {
      audio.play();
    }
  };
  const { GetDepartmentList, GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );
  const { handleChange, values, setFieldValue, handleSubmit } = useFormik({
    initialValues: ViewConsultationPayload,
    onSubmit: async (values, { resetForm }) => {
      SearchOPDBillsCallAPI();
    },
  });
  console.log("newValues",data)
  const newValues = {
    mrNo: data?.PatientID,
    pName: data?.Name,
    appNo: data?.App_ID,
    docDepartment: values?.docDepartment ? values?.docDepartment?.value : "",
    doctorID: data?.DoctorID ? values?.doctorID : "",
    status: values?.status ? values?.status?.value : "",
    // fromDate: "01-Aug-2024",
    fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
    toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
  };
  // Get the search API for patient
  const SearchOPDBillsCallAPI = async () => {
    try {
      const dataRes = await SearchList(newValues);
      if (dataRes?.success) {
        setBodyData((prevState) => ({
          ...prevState,
          SearchViewConsultaionList: dataRes?.data.pendingAppointmentList,
          DoneAppointmentListList: dataRes?.data?.viewedAppointmentList,
        }));
      } else {
        notify(dataRes?.message, 'error')
        setBodyData({
          SearchViewConsultaionList: [],
          DoneAppointmentListList: [],
        })
      }

    } catch (error) {
      console.error(error);
    }
  };

  const getUpdateCallAPI = async (items) => {
    const newValues = {
      app_ID: `${items?.App_ID}`,
      doctorID: items?.DoctorID,
    };

    try {
      const dataRes = await UpdateCall(newValues);
      if (dataRes.success) {
        notify(dataRes.message, "success");
      }else{
        notify(dataRes.message, "error");
      }
      SearchOPDBillsCallAPI();
    } catch (error) {
      console.error(error);
    }
  };

  const getUpdateUncall = async (items) => {
    try {
      const response = await UpdateUncall(items?.App_ID);

      if (response.success) {
        notify(response.message, "success");
      }

      SearchOPDBillsCallAPI(); // Get The API list for searching...
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUpdateInAPI = async (item, index, listType) => {
    console.log("ASd",item)
    const newValues = {
      app_ID: `${item?.App_ID}`,
      doctorID: item?.DoctorID,
    };

    try {
      const dataRes = await UpdateIn(newValues);
      if (dataRes?.success) {
        notify(dataRes?.message, "success")
        SearchOPDBillsCallAPI();
        setSelectedIndex({ index, listType });
        setActive(false);
      } else {
        notify(dataRes?.message, "error")
      }

    } catch (error) {
      console.error(error);
    }
  };

 




  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
  };

  // const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState({
    index: null,
    listType: null,
  });


  const [getDoctorID, setDoctorID] = useState(null);
  const [docterError, setDoctorError] = useState();
  const [getUser, setGetUser] = useState({  
    TransactionID:data?.transactionID,
    MRNo:data?.PatientID,
    App_ID:Number(data?.App_ID),
    PatientID:data?.PatientID,
  });


  const checkGetDoctorIDForTransationID = async (item, index) => {
    try {
      const response = await getGetDoctor(item?.TransactionID);
      if (response.success === true) {
        setDoctorID(response.data);
        item.DoctorID = response.data;
        fetchAllApiData(item);
      } else if (response.success === false) {
        fetchAllApiData(item);
        const doctorIDFromBodyData = getUser?.DoctorID;
        setDoctorID(doctorIDFromBodyData);
      }

      if (response.success === false) {
        setDoctorError(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (getUser?.TransactionID) {
      checkGetDoctorIDForTransationID(getUser);
    }
  }, [getUser?.TransactionID]);
  const [getCall, setCall] = useState();
  const handleCallButtonClick = (items) => {
    if (items.IsCall === 1) {
      handleStartAudioPatientComing(items);
      getUpdateUncall(items);
      // dispatch(SearchListData(newValues)); 
    } else {
      handleStartAudioPatientComing(items);
      getUpdateCallAPI(items);
      // dispatch(SearchListData(newValues));
    }
  };


  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localData?.centreID,
      })
    );
    dispatch(GetBindDepartment());
  }, [dispatch]);

  const handleSearchChiefComplaintTemplate = async (doctorID) => {
    try {
      const response = await SearchChiefComplaintTemplate(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchPastHistory = async (doctorID) => {
    try {
      const response = await SearchPastHistory(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchTreatmentHistory = async (doctorID) => {
    try {
      const response = await SearchTreatmentHistory(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchPersonalHistory = async (doctorID) => {
    try {
      const response = await SearchPersonalHistory(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchGeneralExamination = async (doctorID) => {
    try {
      const response = await SearchGeneralExamination(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSystematicExamination = async (doctorID) => {
    try {
      const response = await SystematicExamination(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchProvisionalDiagnosis = async (doctorID) => {
    try {
      const response = await SearchProvisionalDiagnosis(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchDoctorAdvoice = async (doctorID) => {
    try {
      const response = await SearchDoctorAdvoice(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLoadInvestigation = async (serachInvestigationPayload) => {
    try {
      const response = await LoadInvestigation(serachInvestigationPayload);
      const nameChangeResponse = response?.data?.map((ele) => {

        return {
          ID: ele?.newItemID,
          ValueField: ele?.typeName,
          value: ele?.itemID,
          TemplateName: ele?.typeName,
          AllItemData: ele?.newItemID,
        };
      });
      return nameChangeResponse;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchPrescribeMedicine = async (doctorID) => {
    try {
      const response = await SearchPrescribeMedicine(doctorID);
      const nameChangeResponse = response?.data?.map((ele) => {
        return {
          ID: ele?.id,
          ValueField: ele?.valueField.map((item, index) => {
            return {
              TemplateID: ele?.id,
              Name: {
                value: item?.name,
                ID: item?.itemID,
                isDisable: true,
                AllItemData: ele,
              },
              Dose: {
                value: item?.dose,
              },
              Time: {
                value: item?.times,
              },
              Duration: {
                value: item?.duration,
              },
              Route: {
                value: item?.route,
              },
              Remarks: {
                value: item?.remarks,
              },
              AllItemListData: {
                value: ele,
              },
            };
          }),
          TemplateName: ele?.tempName,
          templateFor: ele?.templateFor,
          // AllItemData:ele
        };
      });
      setItems((val) => ({ ...val, ['Prescribed Medicine']: nameChangeResponse }));
      return nameChangeResponse;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchDietTemplate = async (doctorID) => {
    try {
      const response = await SearchDietTemplate(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleGetDoctorNotes = async (doctorID) => {
    try {
      const response = await getDoctorNotes(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlegetProcedureItemSearch = async (doctorID) => {
    try {
      const response = await getProcedureItemSearch();
      const nameChangeResponse = response?.data?.map((ele) => {
        return {
          ID: ele?.NewItemID,
          ValueField: ele?.TypeName,
          value: ele?.NewItemID,
          TemplateName: ele?.TypeName,
          AllItemData: ele,
        };
      });

      return nameChangeResponse;
      // return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlegetgetGetSignAndSymptoms = async (doctorID) => {
    try {
      const response = await getGetSignAndSymptoms(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlegetVaccinationStatus = async (doctorID) => {
    try {
      const response = await getVaccinationStatus(doctorID);
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlegetgetGetMolecular = async (doctorID) => {
    try {
      const response = await getGetMolecular();
      return response?.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllApiData = async (details) => {
    const serachInvestigationPayload = {
      type: "1",
      categoryID: "0",
      subCategoryID: "0",
      isIPDData: Number(0),
      transactionId: String(details?.TransactionID),
      appID: String(details?.App_ID),
    };
    const response = await Promise.all([
      handleSearchChiefComplaintTemplate(details?.DoctorID),
      handleSearchPastHistory(details?.DoctorID),
      handleSearchTreatmentHistory(details?.DoctorID),
      handleSearchPersonalHistory(details?.DoctorID),
      handleSearchGeneralExamination(details?.DoctorID),
      //  await  handleSystematicExamination(payload),
      handleSearchProvisionalDiagnosis(details?.DoctorID),
      handleSearchDoctorAdvoice(details?.DoctorID),
      handleSearchDietTemplate(details?.DoctorID),
      handleLoadInvestigation(serachInvestigationPayload),
      handleSearchPrescribeMedicine(details?.DoctorID),
      handleGetDoctorNotes(details?.DoctorID),
      handlegetProcedureItemSearch(),
      handlegetgetGetSignAndSymptoms(details?.DoctorID),
      handlegetVaccinationStatus(details?.DoctorID),
      // await handlegetgetGetMolecular(),
    ]);

    const setData = { ...AUTOCOMPLETE_STATE };
    setData["Chief Complaint"] = response[0];
    setData["Past History"] = response[1];
    setData["Treatment History"] = response[2];
    setData["Personal/Occupational History"] = response[3];
    setData["General Examination"] = response[4];
    setData["Provisional Diagnosis"] = response[5];
    setData["Doctor Advice"] = response[6];
    setData["Diet"] = response[7];
    setData["Investigation(Lab & Radio)"] = response[8];
    setData["Prescribed Medicine"] = response[9];
    setData["Doctor Notes"] = response[10];
    setData["Prescribed Procedure"] = response[11];
    setData["Sign & Symptoms"] = response[12];
    setData["Vaccination Status"] = response[13];
    // setData["Molecular Allergies"] = response[14];
    setItems(setData);
  };
  const isMobile = window.innerWidth > 1000;
  return (
    <div>

        <AppointmentPatientDetail
          setActive={setActive}
          isDesktop = {isMobile}
          type = {"Emergency"}
          selectedIndex={0}
          calledPatient={calledPatient}
          getUpdateInAPI={getUpdateInAPI}
          handleSearchPrescribeMedicine={handleSearchPrescribeMedicine}
          TotaltableData={
            selectedIndex.listType === "Pending"
              ? bodyData?.SearchViewConsultaionList
              : bodyData?.DoneAppointmentListList
          }
          handleCallButtonClick={handleCallButtonClick}
          SearchOPDBillsCallAPI={SearchOPDBillsCallAPI}
          getDoctorID={getDoctorID}
          items={items}
          setItems={setItems}
          fetchAllApiData={fetchAllApiData}
          checkGetDoctorIDForTransationID={checkGetDoctorIDForTransationID}
          getUser={getUser}
          docterError={docterError}
          getCall={getCall}
        />
     
    </div>
  );
};

export default EmergencyNote;
