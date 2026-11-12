import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const BindDepartmentResultEntryLab = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindDepartmentResultEntryLab}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindTestResultEntryLab = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindTestResultEntryLab}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// BindApprovedBy  (To Bind Doctor)
 
// export const BindApprovedBy = async (params) => {
//   store.dispatch(setLoading(true));
//   try {
//     const options = {
//       method: "get",
//       // data: params,
//     };
//     const data = await makeApiRequest(`${apiUrls.BindApprovedBy}`, options);
//     store.dispatch(setLoading(false));
//     return data;
//   } catch (error) {
//     store.dispatch(setLoading(false));
//     console.error("Error Found", error); 
//   }
// };


export const BindApprovedBy = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindApprovedBy}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error); 
  }
};
// BindApprovedBy  (To Bind Machine)

export const BindMachine = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindMachine}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


 


export const TestResultEntryLab = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.TestResultEntryLab}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const ProvisionalTatReport = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.ProvisionalTatReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SearchResultEntryLab = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SearchResultEntryLab}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const UpdateSerialMarkViewLab = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateSerialMarkViewLab}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const LabObservationSearch = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.LabObservationSearch}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetPatientInvsetigationsNameOnly = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetPatientInvsetigationsNameOnly}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveResultEntryLabdata = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveResultEntryLab}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindAttachmentLab = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindAttachmentLab}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const LabSampleRejection = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.LabSampleRejection}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// BindLabReport

// export const BindTestDDLlab = async (params) => {
//   store.dispatch(setLoading(true));
//   try {
//     const options = {
//       method: "get",
//       // data: params,
//     };
//     const data = await makeApiRequest(`${apiUrls.BindTestDdlLab}`, options);
//     store.dispatch(setLoading(false));
//     return data;
//   } catch (error) {
//     store.dispatch(setLoading(false));
//     console.error("Error Found", error);
//   }
// };

export const BindTestDDLlab = async (params) => {
  store.dispatch(setLoading(true));

  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.BindTestDdlLab}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// Getpatient_labobservation_opd_text


export const Getpatientlabobservationopdtext = async (params) => {
  store.dispatch(setLoading(true));

  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.Getpatientlabobservationopdtext}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


 
 

export const BindSampleinfo = async (params) => {
  store.dispatch(setLoading(true));

  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.BindSampleinfo}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindLabReport = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(apiUrls.BindLabReport, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
 
// BindPatientDetails

export const BindPatientDetails = async (params) => {
  store.dispatch(setLoading(true));

  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.BindPatientDetails}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindPatientDetailsImage = async (params) => {
  store.dispatch(setLoading(true));

  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.BindPatientDetailsImage}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// BindAttachment


export const BindAttachment = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(
      apiUrls.BindAttachment,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindAttachmentPdf = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(
      apiUrls.BindAttachmentPdf,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
// export const BindPatientDetailsImage = async (params) => {
//   store.dispatch(setLoading(true));
//   try {
//     const options = {
//       method: "Get",
//       data: params,
//     };
//     const data = await makeApiRequest(
//       apiUrls.BindPatientDetailsImage,
//       options
//     );
//     return data;
//   } catch (error) {
//     console.error("Error Add Expense", error);
//   } finally {
//     store.dispatch(setLoading(false));
//   }
// };

export const BindlabOutSource = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.BindlabOutSource}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// MachineResultEntry Culture controllers start here

export const PatientSearchMachineResults = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(
      apiUrls.PatientSearchMachineResult,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const CultureLabObservationSearchs = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.CultureLabObservationSearch}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveCultureObservationOpdDatas = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveLabObservationOpdData}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const GetReportPrintCulture = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(apiUrls.GetReportPrintCulture, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};






export const helpMenu = async (params) => {
  store.dispatch(setLoading(true));

  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.helpMenu}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// BindDoctor


export const BindDoctor = async (params) => {
  store.dispatch(setLoading(true));

  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.BindDoctor}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




//  Get Bind Comment List  

export const GetCommentsDropdown = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetCommentsDropdown}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const saveSaveLabTemplateAndCommentApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.saveSaveLabTemplateAndComment}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// CommentlabObservation
// export const CommentlabObservation = async (params) => {
//   store.dispatch(setLoading(true));
//   try {
//     const options = {
//       method: "POST",
//       data: params,
//     };
//     const data = await makeApiRequest(
//       `${apiUrls.CommentlabObservation}`,
//       options
//     );
//     store.dispatch(setLoading(false));
//     return data;
//   } catch (error) {
//     store.dispatch(setLoading(false));
//     console.error("Error Found", error);
//   }
// };


export const CommentlabObservation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.CommentlabObservation}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// HoverHeaderresultEntry



export const HoverHeaderresultEntry = async (params) => {
  store.dispatch(setLoading(true));
  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.HoverHeaderresultEntry}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// HoverDeltaCheck
export const HoverDeltaCheck = async (params) => {
  store.dispatch(setLoading(false));
  try {
    // Construct the URL with query parameters
    const query = new URLSearchParams(params).toString();

    const urlWithParams = `${apiUrls.HoverDeltaCheck}?${query}`;

    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(urlWithParams, options);

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



// Result Entry Culture 


export const BindOrganism = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindOrganism}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// BindobsAntibiotic


export const BindobsAntibiotic = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BindobsAntibiotic}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// GetUnApproveReason


export const GetUnApproveReason = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetUnApproveReason}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// SaveSampleRejectReasonApi



export const SaveSampleRejectReasonApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveSampleRejectReasonApi}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



 


export const GetholdReason = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.holdReason}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// SaveUnHoldReason



export const SaveUnHoldReason = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveUnHoldReason}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const updateLabBloodGroupApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.updateLabBloodGroup}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

 


export const GetRadiologyAndDoctor = async (roleId) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetRadiologyAndDoctor}?roleId=${roleId}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const getPatientBloodDetailsApi = async (patientID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.getPatientBloodDetails}?PatientID=${patientID}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const getBindDefaultMachineApi = async (testId) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.getDefaultMachine}?TestId=${testId}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};


export const GetAmendmentReportsByTestId = async (testId) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetAmendmentReportsByTestId}?TestID=${testId}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

