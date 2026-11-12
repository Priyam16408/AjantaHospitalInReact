import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const SearchList = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchList}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const createDiagnosisTreatmentApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.createDiagnosisTreatment}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const GetAllEyeFrameByPatinetId = async (patientId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllEyeFrameByPatinetId}?patientId=${patientId}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const getAllVitalMasterApi = async (type) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.getAllVitalMaster}?type=${type}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetAllEyeFramePrintReport = async (patientId, transactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllEyeFramePrintReport}?patientId=${patientId}&transactionID=${transactionID}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const UpdateCall = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateCall}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const UpdateUncall = async (App_ID) => {
  try {
    const url = `${apiUrls.UpdateUncall}?App_ID=${App_ID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindTemplateContent = async (TemplateId) => {
  try {
    const url = `${apiUrls.BindTemplateContent}?TemplateId=${TemplateId}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const DeleteMedicineTemplate = async (Set_Id) => {
  try {
    const url = `${apiUrls.DeleteMedicineTemplate}?SetId=${Set_Id}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetMedicineTemplateDetails = async (Set_Id) => {
  try {
    const url = `${apiUrls.GetMedicineTemplateDetails}?SetId=${Set_Id}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const UpdateIn = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateIn}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const deleteDiagnosisTreatmentApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.deleteDiagnosisTreatment}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const LoadPrescriptionView = async (
  isIPDData,
  transactionID,
  PatientId
) => {
  try {
    const url = `${apiUrls.LoadPrescriptionView}?isIPDData=${(isIPDData = 0)}&transactionID=${transactionID}&PatientId=${PatientId}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchChiefComplaintTemplate = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchChiefComplaintTemplate}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchPastHistory = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchPastHistory}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPatientAllergiesDiagnosisAllByApi = async (id) => {
  try {
    const url = `${apiUrls.getPatientAllergiesDiagnosisAllById}?id=${id}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchTreatmentHistory = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchTreatmentHistory}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchPersonalHistory = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchPersonalHistory}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchGeneralExamination = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchGeneralExamination}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SystematicExamination = async (doctorID) => {
  try {
    const url = `${apiUrls.SystematicExamination}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchProvisionalDiagnosis = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchProvisionalDiagnosis}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchDoctorAdvoice = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchDoctorAdvoice}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const LoadInvestigation = async (payload) => {
  try {
    const url = `${apiUrls.LoadInvestigation}`;
    const data = await makeApiRequest(url, {
      method: "Post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchPrescribeMedicine = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchPrescribeMedicine}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchDietTemplate = async (doctorID) => {
  try {
    const url = `${apiUrls.SearchDietTemplate}?doctorID=${doctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const MedicineItemSearch = async (Prefix,DoctorID, IsPreload = 0,) => {
  try {
    const url = `${apiUrls.MedicineItemSearch}?Prefix=${Prefix}&DoctorId=${DoctorID}&IsPreload=${IsPreload}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Type-wise cache (1=Dose, 2=Time, 3=Duration, 4=Route, 5=Meal) - master data,
// har type browser session me sirf ek baar server se aayega
const MEDICINE_DOSE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const medicineDoseCache = new Map(); // type -> { time, data }
const medicineDoseInFlight = new Map(); // type -> Promise

let medicineDoseCacheGen = 0;

export const clearMedicineDoseCache = () => {
  medicineDoseCacheGen++;
  medicineDoseCache.clear();
  medicineDoseInFlight.clear();
};

export const GetMedicineDose = async (type) => {
  const key = String(type);
  const cached = medicineDoseCache.get(key);
  if (cached && Date.now() - cached.time < MEDICINE_DOSE_CACHE_TTL) {
    return cached.data;
  }
  if (medicineDoseInFlight.has(key)) {
    return medicineDoseInFlight.get(key);
  }
  const gen = medicineDoseCacheGen;
  const request = (async () => {
    try {
      const url = `${apiUrls.GetMedicineDose}?Type=${type}`;
      const data = await makeApiRequest(url, {
        method: "get",
      });
      // Backend error par bhi success=true + data=null bhejta hai, isliye sirf list cache karo
      if (
        gen === medicineDoseCacheGen &&
        data?.success &&
        Array.isArray(data?.data) &&
        data.data.length > 0
      ) {
        medicineDoseCache.set(key, { time: Date.now(), data });
      }
      return data;
    } finally {
      if (medicineDoseInFlight.get(key) === request) {
        medicineDoseInFlight.delete(key);
      }
    }
  })();
  medicineDoseInFlight.set(key, request);
  return request;
};
export const getListBindMenu = async (TID) => {
  try {
    const url = `${apiUrls.BindCPOEMenu}?TransactionID=${TID ? TID : 1}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
// export const updateFileClosed = async (AppID) => {

//   try {
//     const url = `${apiUrls.FileClose}?AppID=${AppID}`;
//     const data = await makeApiRequest(url, {
//       method: "get",
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const updateFileClosed = async (AppID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(
      `${apiUrls.FileClose}?AppID=${AppID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const updateFileOpen = async (AppID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(
      `${apiUrls.FileOpen}?AppID=${AppID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const getTemplateContentApi = async (templateId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(
      `${apiUrls.BindTemplateContent}?TemplateId=${templateId}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const saveTemplateAPI = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };

    const data = await makeApiRequest(`${apiUrls.SaveTemplate}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const holdAPI = async (AppID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(
      `${apiUrls.getHoldAPI}?AppID=${AppID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const setGetOutPatientAPI = async (AppID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(
      `${apiUrls.OutPatient}?App_ID=${AppID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getDoctorNotes = async (DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorNotes}?DoctorID=${DoctorID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getProcedureItemSearch = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.ProcedureItemSearch}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getGetSignAndSymptoms = async (DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetSignAndSymptoms}?DoctorID=${DoctorID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getVaccinationStatus = async (DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.VaccinationStatus}?DoctorID=${DoctorID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getGetMolecular = async (DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(`${apiUrls.GetMolecular}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getGetDoctor = async (transactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetDoctor}?transactionID=${transactionID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const BindConsentType = async (DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindConsentType}?DoctorID=${DoctorID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const BindTemplate = async (DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindTemplate}?DoctorID=${DoctorID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const BindPatientConsent = async (PatientID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindPatientConsent}?PatientID=${PatientID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SaveConsentType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveConsentType}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const DeleteSelectedTemplate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DeleteSelectedTemplate}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SavePatientConsent = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SavePatientConsent}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const ConsentFormPrint = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.ConsentFormBindPatientConsentReport}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SearchPatient = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchPatient}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SearchByICDDesc = async (params) => {
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchByICDDesc}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }

    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  }
};
export const SearchByICDCode = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchByICDCode}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const DiagnosisInformationSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DiagnosisInformationSave}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SaveMedicineTemplate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveMedicineTemplate}`,
      options
    );
    // Template save nayi Dose/Time/Duration/Route master me add kar sakta hai
    clearMedicineDoseCache();
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const ViewDischargeSummaryBind = async (PatientID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.ViewDischargeSummaryBind}?PatientID=${PatientID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SaveVitals = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveVitals}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SavePrescriptionForm = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SavePrescription}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const BindDetails = async (transactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindDetails}?TID=${transactionID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SaveSMS = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveSMS}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const sendEmail = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SendEmailToPatient}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const UpdateVitals = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateVitals}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const GetPatientDiagnosis = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetPatientDiagnosis}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const DeleteDiagnosis = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.DeleteDiagnosis}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const GetPrescription = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.GetPrescription}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SavePrescriptionDraft = async (params, loader) => {
  !loader && store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SavePrescriptionDraft}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    !loader && store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    !loader && store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const GetOldAppointentData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetOldAppointentData}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const SaveDoctorLeave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDoctorLeave}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const BindLeave = async (doctorID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindLeave}?doctorID=${doctorID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const UpdateDoctorLeave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateDoctorLeave}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const BindPendingPages = async ({ DoctorId, RoleID, departmentId }) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindPendingPages}?DoctorId=${DoctorId}&RoleID=${RoleID}&type=2&departmentId=${departmentId}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const BindAvailablePages = async ({
  DoctorId,
  RoleID,
  departmentId,
}) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindAvailablePages}?DoctorId=${DoctorId}&RoleID=${RoleID}&departmentId=${departmentId}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const MenuInsert = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.MenuInsert}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const MenuUpdate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.MenuUpdate}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SequenceUpdate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SequenceUpdate}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const SaveDoctorNA = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDoctorNA}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const BindDoctorNA = async (DoctorId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindDoctorNA}?DoctorId=${DoctorId}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const GetOpdPrintOptionsApi = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const data = await makeApiRequest(`${apiUrls.GetOpdPrintOptions}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const UpdateDoctorNA = async (NAID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateDoctorNA}?NAID=${NAID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const BindProMaster = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const data = await makeApiRequest(`${apiUrls.BindProMaster}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

// Get Top 5 Suggestions of Doctor Akhilesh

// export const DoctorPrescriptionGetTopSuggestion = async (payload) => {
//   store.dispatch(setLoading(true));

//   try {
//     const {doctorID,age,sex} = payload;
//     const options = {
//       method: "Get",
//     };
//     let url = `${apiUrls.DoctorPrescriptionPrintGetSuggestion}?doctorId=${doctorID}&age=${encodeURIComponent(age)}&sex=${sex}`
//     const data = await makeApiRequest(url, options);
//     if (data.status === true) {
//       notify(data.message, "success");
//     }
//     store.dispatch(setLoading(false));
//     return data;
//   } catch (error) {
//     store.dispatch(setLoading(false));
//     console.error("Error Add Expense", error);
//   }
// };

export const DoctorPrescriptionGetTopSuggestion = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    // const { doctorID, age, sex } = payload;
    // Remove space from age, e.g., "76 YRS" -> "76YRS"
    // const formattedAge = age.replace(/\s/g, '');

    const options = {
      method: "POST",
      data: payload,
    };

    let url = `${apiUrls.DoctorPrescriptionPrintGetSuggestion}`;

    const data = await makeApiRequest(url, options);

    if (data.status === true) {
      notify(data.message, "success");
    }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error fetching prescription suggestion", error);
  }
};

export const DoctorPrescriptionPrintPDF = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorPrescriptionPrint}`,
      options
    );
    if (data.status === true) {
      // notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error DoctorPrescriptionPrint", error);
  }
};

// Investigation Manual Entry

export const GetInvestigationManualEntries = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetInvestigationManualEntries}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Get Investigation Manual Entries", error);
  }
};

export const DoctorPrescriptionPrintCreateInvestigationManualEntries = async (
  params
) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorPrescriptionPrintCreateInvestigationManualEntries}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error(
      "Error DoctorPrescriptionPrintCreateInvestigationManualEntries",
      error
    );
  }
};

export const DoctorPrescriptionPrintGetPatientManualEntry = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorPrescriptionPrintGetPatientManualEntry}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorPrescriptionPrintGetPatientManualEntry", error);
  }
};

//UltraSound
export const DoctorPrescriptionPrintGetUltraSoundTest = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorPrescriptionPrintGetUltraSoundTest}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorPrescriptionPrintGet UltraSoundTest", error);
  }
};

export const DoctorPrescriptionPrintSaveUltraSound = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorPrescriptionPrintSaveUltraSound}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorPrescriptionPrint SaveUltraSound ", error);
  }
};

// child vaccination chart
export const PrescriptionAdviceGetChildVaccineChart = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.PrescriptionAdviceGetChildVaccineChart}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Prescription Advice GetChildVaccineChart", error);
  }
};

export const PrescriptionAdviceGetNewChildVaccineChart = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.PrescriptionAdviceGetNewChildVaccineChart}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Prescription Advice New GetChildVaccineChart", error);
  }
};

export const PrescriptionAdviceGiveVaccineToChild = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.PrescriptionAdviceGiveVaccineToChild}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

//Baby growth chart
export const DoctorAddBabyGrowth = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorAddBabyGrowth}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorAddBabyGrowth", error);
  }
};

export const DoctorUpdateBabyGrowth = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorUpdateBabyGrowth}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};

export const DoctorGetBabyGrowthRecords = async (PatientID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const url = `${apiUrls.DoctorGetBabyGrowthRecords}?&patientId=${PatientID}`;
    const data = await makeApiRequest(url, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Get Doctor Baby GrowthRecords", error);
  }
};

export const DoctorBindchartWeight = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    const { transactionId, PatientID, Gender, Type } = payload;
    const url = `${apiUrls.DoctorBindchartWeight}?transactionId=${transactionId}&PatientID=${PatientID}&Gender=${Gender}&Type=${Type}`;
    const data = await makeApiRequest(url, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Get Doctor BindchartWeight", error);
  }
};

export const DoctorPrescriptionGetInvestigationManualEntriesbyDate = async (
  date
) => {
  try {
    const url = `${apiUrls.DoctorPrescriptionPrintGetInvestigationManualEntriesbyDate}?date=${date}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const CommonAPIGetDoctorIDByEmployeeID = async () => {
  try {
    const url = `${apiUrls.CommonAPIGetDoctorIDByEmployeeID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PrescriptionAdviceDeleteTemplate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.DeleteTemplate}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};

//Doctor Prescription preview

export const DoctorUpdatePrescriptionview = async (params) => {
  try {
    const url = `${apiUrls.DoctorUpdatePrescriptionview}?IsPrescriptionView=${params}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const DoctorGetPrescriptionview = async () => {
  try {
    const url = `${apiUrls.DoctorGetPrescriptionview}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorDepartmentLitsApi = async (DoctorID) => {
  try {
    const url = `${apiUrls.getDoctorDepartments}`;
    const data = await makeApiRequest(`${url}?DoctorID=${DoctorID}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getLabRadiologyCategoryApi = async () => {
  try {
    const url = `${apiUrls.getLabRadiolozyCategory}`;
    const data = await makeApiRequest(`${url}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLabRadiologySubCategoryApi = async (categoryID) => {
  try {
    const url = `${apiUrls.getLabRadiolozySubCategory}`;
    const data = await makeApiRequest(`${url}?categoryId=${categoryID}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const DoctorSaveEyeForm = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.DoctorSaveEyeFrame}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const SaveDepartmentMapping = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.CreatDepartmentMapping}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};

export const getDepartmentMapping = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetDoctorDepartmentMapping}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const UpdateDepartmentMapping = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateIsdefaulDepartmentMapping}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const DoctorRealtedOpdReportsReport = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DoctorRealtedOpdReportsRefundReport}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};

export const getAppointDetailsSearchApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.getAppointDetailsSearch}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};

export const getPrescriptionPrintApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.getPrescriptionPrint}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};

export const getInvestigationFavoriteTemplateApi = async (id) => {
  try {
    const url = `${apiUrls.getInvestigationFavrateTemplates}`;
    const data = await makeApiRequest(`${url}?AccordianId=${id}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getInvestigationFavoriteTemplateDetailsApi = async (id) => {
  try {
    const url = `${apiUrls.getInvestigationFavrateTemplatesDetails}`;
    const data = await makeApiRequest(`${url}?ID=${id}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveInvestigationFavoriteTemplateApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.saveInvestigationFavrateTemplates}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const getDeleteActionTemplate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.DeleteActionTemplate}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const GetEditTemplate = async (id, templateFor) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    // const { id, templateFor } = payload;
    const url = `${apiUrls.GetEditTemplate}?id=${id}&templateFor=${templateFor}`;
    const data = await makeApiRequest(url, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Get Doctor BindchartWeight", error);
  }
};

export const GetBindDoctorPrescriptionSuggestion = async (params) => {
  try {
    const url = `${apiUrls.GetDoctorPrescriptionSuggestion}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: params,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetBindNewChildVaccineChart = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetNewChildVaccineChart}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const handleSaveOrUpdatePatientDOB = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveOrUpdatePatientDOB}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const GetBindPatentDOB = async (PatientID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
    };
    // const { id, templateFor } = payload;
    const url = `${apiUrls.GetPatentDOB}?PatientID=${PatientID}`;
    const data = await makeApiRequest(url, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Get Doctor BindchartWeight", error);
  }
};

export const SaveUpdateVaccineBrandName = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveOrUpdateVaccineBrandName}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const GetBindVaccineBrand = async () => {
  try {
    const url = `${apiUrls.GetVaccineBrand}`;
    const data = await makeApiRequest(`${url}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetBindBabyGrowthNew = async (patientId) => {
  try {
    const url = `${apiUrls.GetBabyGrowthNew}`;
    const data = await makeApiRequest(`${url}?patientId=${patientId}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const InsertBabyGrowthNewSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.InsertBabyGrowthNew}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const handleUpdateBabyGrowthNew = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateBabyGrowthNew}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};
export const handleSaveBabyGrowthChart = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveBabyGrowthChart}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error DoctorUpdateBabyGrowth", error);
  }
};

export const GetBindBabyGrowthChart = async (PatientId) => {
  try {
    const url = `${apiUrls.GetBabyGrowthChart}`;
    const data = await makeApiRequest(`${url}?PatientId=${PatientId}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getChildVaccinationStatusApi = async (PatientId) => {
  try {
    const url = `${apiUrls.getChildVaccinationStatus}`;
    const data = await makeApiRequest(`${url}?PatientId=${PatientId}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const GetGrowthChartPrintPdfApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetGrowthChartPrintPdf}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const SaveMidParentalDetailApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveMidParentalDetail}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetGrowthProfileApi = async (PatientId) => {
  try {
    const url = `${apiUrls.GetGrowthProfile}`;
    const data = await makeApiRequest(`${url}?PatientId=${PatientId}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetWhoGrowthStandardApi = async (Gender) => {
  try {
    const url = `${apiUrls.GetWhoGrowthStandard}`;
    const data = await makeApiRequest(`${url}?Gender=${Gender}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetDoctorAddedMedicineListApi = async (fromDate, ToDate, ReportType = "0") => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetDoctorAddedMedicineList}?fromDate=${fromDate}&ToDate=${ToDate}&ReportType=${ReportType}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error in GetDoctorAddedMedicineListApi:", error);
  }
};