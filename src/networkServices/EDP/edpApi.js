import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import { apiUrls } from "../apiEndpoints";
import makeApiRequest from "../axiosInstance";


export const GetSubScreenMenuByRole = async (vSubMenuID, vIsFrameMenu) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.GetSubScreenMenuByRoleURL}?vSubMenuID=${vSubMenuID}&vIsFrameMenu=${vIsFrameMenu}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindAllCentre = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindAllCentre}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const CentreManagementSearch = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.CentreManagementSearchURL}`, {
      method: "get",
      // data:payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const LoadPrescriptionView = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPLoadPrescriptionViewURL}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const GetCategory = async () => {
  try {
    const url = `${apiUrls.GetCategory}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getSubCategory = async (payload) => {
  try {
    const url = `${apiUrls.GetSubCategory}?categoryID=${payload}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetDepartment = async (payload) => {
  try {
    const url = `${apiUrls.GetDepartment}`;
    const data = await makeApiRequest(url, {
      method: "GET",
      payload: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetGST = async () => {
  try {
    const url = `${apiUrls.GetGST}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const SaveItem = async (payload) => {
  try {
    const url = `${apiUrls.SaveItem}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const LoadItems = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const url = `${apiUrls.LoadItems}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

// Surgery Item Start
export const EDPanelMaster = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPanelMaster}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SearchSurgeryItem = async (searchParams) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.SearchSurgeryItem}?GroupID=${searchParams?.groupID}&PanelID=${searchParams?.panelID}`,
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

export const EDPSurgeryItem = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPSurgeryItem}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const EDPSaveSurgeryGrouping = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPSaveSurgeryGrouping}`, {
      method: "post",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SaveSurgeryGroupName = async (payload) => {
  // debugger
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveSurgeryGroupName}`, {
      method: "post",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

// Surgery Item END

export const ServicesRateSetup = async (CompanyName) => {
  console.log(CompanyName);

  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

      // data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetup}?CompanyName=${CompanyName}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveRateSchedule = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: payload,
  };
  try {
    const data = await makeApiRequest(`${apiUrls.SaveRateSchedule}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const UpdateRateSchedule = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: payload,
  };
  try {
    const data = await makeApiRequest(`${apiUrls.UpdateRateSchedule}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupCopyToIPD = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupCopyToIPD}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupCopyToOPD = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupCopyToOPD}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupCopyFromIPD = async (PanelID, FromCentreID) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupCopyFromIPD}?PanelID=${PanelID}&FromCentreID=${FromCentreID}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupCopyFromOPD = async (PanelID, FromCentreID) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(`${apiUrls.ServicesRateSetupCopyFromOPD}?PanelID=${PanelID}&FromCentreID=${FromCentreID}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupBindFromCentreIPD = async (params) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupBindFromCentreIPD}?PanelID=${params}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupBindFromCentreOPD = async (params) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(`${apiUrls.ServicesRateSetupBindFromCentreOPD}?PanelID=${params}`, options);
    store.dispatch(setLoading(false))
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupBindBindToCentreOPD = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupBindBindToCentreOPD}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupBindToCentreOPD = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupBindToCentreOPD}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const ServicesRateSetupBindToCentreIPD = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupBindToCentreIPD}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const handleSubCategoryRateListAPI = async () => {
  store.dispatch(setLoading(true));
  const options = {
    method: "get",
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.handleSubCategoryRateListURL}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const SaveEDPSetRateAPI = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "post",
    data: payload,
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.SaveEDPSetRateURL}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SetupBindDisplayName = async (type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesSetupBindDisplayName}`,
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
export const RateSetupLoadCategory = async (type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupLoadCategory}?Dept=1`,
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
export const RateSetupLoadSubCategory = async (ID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RateSetupLoadSubCategory}?CategoryID=${ID}`,
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
export const RateSetupBindCentre = async (ID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.ServicesRateSetupBindModelCentre}?PanelID=${ID}`,
      // `${apiUrls.RateSetupBindCentre}`,
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
export const RateSetupCaseTypeBind = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RateSetupCaseTypeBind}`,
      // `${apiUrls.RateSetupBindCentre}`,
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

export const ServicesSetupSaveDisplayName = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.ServicesSetupSaveDisplayName}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const RateSetupLoadRates = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.RateSetupLoadRates}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const ServicesSetupUpdateDisplayName = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload?.name,
    };
    const data = await makeApiRequest(
      `${apiUrls.ServicesSetupUpdateDisplayName}?ID=${payload?.ID}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindCategoryType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindCategoryType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const RateSetupLoadItems = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: payload,
  };
  try {
    const data = await makeApiRequest(`${apiUrls.RateSetupLoadItems}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const RateSetupSaveSetItemRate = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: payload,
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.RateSetupSaveSetItemRate}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SaveCategory = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveCategory}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindReturn = async (CategoryID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindReturn}?CategoryID=${CategoryID}`,
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

export const RateSetupLoadSubCategorySurgery = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RateSetupLoadSubCategorySurgery}`,
      // ${apiUrls.RateSetupBindCentre},
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

export const RateSetupLoadItemSurgery = async (ID, query) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RateSetupLoadItemSurgery}?SubcategoryID=${ID}&SearchName=${query}`,
      // ${apiUrls.RateSetupBindCentre},
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

export const EditCategory = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.EditCategory}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// CategoryMaster Controller End here

// SubCategoryMaster Controller Start here

export const BindCategoryy = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindCategoryy}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const LoadDisplayName = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(`${apiUrls.LoadDisplayName}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveSubCategory = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveSubCategory}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const SaveDepartment = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDepartment}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const UpdateItem = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateItem}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// EMPLOYEE MANAGMENT

export const EdpSearchEmployee = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const url = `${apiUrls.EdpSearchEmployee}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPLoadPrescriptionView = async () => {
  try {
    const url = `${apiUrls.EDPLoadPrescriptionView}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindPayrollDepartment = async () => {
  try {
    const url = `${apiUrls.BindPayrollDepartment}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EPDsaveEmployee = async (payload) => {
  try {
    const url = `${apiUrls.EPDsaveEmployee}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPBindPayrollDesignation = async () => {
  try {
    const url = `${apiUrls.EDPBindPayrollDesignation}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindEmployeeGroup = async () => {
  try {
    const url = `${apiUrls.BindEmployeeGroup}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindUserType = async () => {
  try {
    const url = `${apiUrls.BindUserType}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindQualification = async () => {
  try {
    const url = `${apiUrls.BindQualification}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BloodBank = async () => {
  try {
    const url = `${apiUrls.BloodBank}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindTitleWithGender = async () => {
  try {
    const url = `${apiUrls.BindTitleWithGender}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPGetEmployee = async (empID) => {
  try {
    const url = `${apiUrls.EDPGetEmployee}?empId=${empID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPupdateEmployee = async (payload) => {
  try {
    const url = `${apiUrls.EDPupdateEmployee}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const bindCenterAPI = async (empID, deptId) => {
  // debugger
  try {
    const url = `${apiUrls.EDPGetCenter}?empID=${empID}&CenterId=${deptId}`;
    const data = await makeApiRequest(url, {
      method: "GET",
      // data:payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPgetSetCentre = async (empID) => {
  // debugger
  try {
    const url = `${apiUrls.EDPgetSetCentre}?employeeId=${empID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPGetUserAccess = async (empID) => {
  // debugger
  try {
    const url = `${apiUrls.EDPGetUserAccess}?empID=${empID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPSaveUserRoles = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSaveUserRoles}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetRoleWisePages = async (empID) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPGetRoleWisePages}?empID=${empID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPSearchEmpforCopyFromBind = async (payloadToBe) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSearchEmpforCopyFromBind}?empName=${payloadToBe?.empName ? payloadToBe?.empName : ""}&department=${payloadToBe?.department}`;
    const data = await makeApiRequest(url, {
      method: "GET",
      // data:payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const handleSearchToBind = async (payloadToBe) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSearchEmpforCopyToBind}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPUpdateCentre = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPUpdateCentre}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPGetCenter = async (empID) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPGetCenter}?empId=${empID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPResetPassword = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPResetPassword}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPSavePageAccess = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSavePageAccess}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPGetDeptWiseAuth = async (empID, centreID) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPGetDeptWiseAuth}?empId=${empID}&centreID=${centreID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPBindUserGroup = async () => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPBindUserGroup}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPSaveUserAuth = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSaveUserAuth}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPLoadEmployee = async (isActive) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPLoadEmployee}?isActive=${isActive}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPLoadDoctor = async (isActive) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPLoadDoctor}?isActive=${isActive}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
};

export const EDPSaveUserGroup = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSaveUserGroup}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPCommonMasterBindUserType = async () => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPCommonMasterBindUserType}`;
    const data = await makeApiRequest(url, {
      method: "get",
      // data:payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPEmployeeSetUpSaveUserType = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPEmployeeSetUpSaveUserType}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPBindDesignationtableinMaster = async () => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPBindDesignationtableinMaster}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPBindGrade = async () => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPBindGrade}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPSaveDesignation = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSaveDesignation}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPBindJobType = async () => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPBindJobType}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPSaveJobType = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSaveJobType}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPSaveSurgeryType = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSaveSurgeryType}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPSearchSurgeryType = async () => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPSearchSurgeryType}`;
    const data = await makeApiRequest(url, {
      method: "GET",
      // data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
export const EDPUpdateSurgeryType = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPUpdateSurgeryType}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}
// Centre MAnagement API STart 
export const handleSaveUpdateCentreAPI = async (payload, type) => {
  store.dispatch(setLoading(true));
  let url = type === "save" ? apiUrls.SaveCentreEDP : apiUrls.UpdateCentreEDP;
  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(url, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPAllMappings = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPAllMappingsURL}?CenterId=${payload}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const handleSaveCentreAccessAPI = async (payload, url) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls[url],
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
// export const handleSaveDoctorCentreAPI = async (payload) => {
//   store.dispatch(setLoading(true));

//   try {
//     const options = {
//       method: "POST",
//       data: payload,
//     };
//     const data = await makeApiRequest(
//       apiUrls.SavesDoctorMappingsDetailsURL,
//       options
//     );
//     store.dispatch(setLoading(false));
//     return data;
//   } catch (error) {
//     store.dispatch(setLoading(false));
//     console.error("Error Found", error);
//   }
// };
export const CentreWiseItemSearch = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.CentreWiseItemSearchURL, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const CentreWiseItemSave = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.CentreWiseItemSaveURL, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// Centre MAnagement API ENd

// BindGrid
export const BindGrid = async (CategoryID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindGrid}?CategoryID=${CategoryID}`,
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

export const EditSaveSubCategory = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.EditSaveSubCategory}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// Labortary management Controller Start here

export const ManagementBindInvestigation = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.ManagementBindInvestigation}`,
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

export const SaveInvestigation = async (params) => {
  console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveInvestigation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindCategorylabortarymanagment = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindCategorylabortarymanagment}`,
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

export const SaveObservation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveObservation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindObservationType = async (flag, SearchName) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindObservationType}?Flag=${flag}&SearchName=${SearchName}`,
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

export const UpdateObservation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateObservation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const UpdateObservationHelp = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateObservationHelp}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// Observation Controller Start here

export const BindInvestigationHelp = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.BindInvestigationHelp}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const BindHelp = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.BindHelp}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const BindMapping = async (Name, id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindMapping}?Name=${Name}&LabObservationID=${id}`,
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

export const RemoveObservationHelp = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RemoveObservationHelp}?ID=${id}`,
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

export const SaveObservationHelp = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveObservationHelp}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const AddObservationHelp = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.AddObservationHelp}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const RateSetupLoadRatesSurgery = async (payload) => {
  store.dispatch(setLoading(true));
  const options = {
    method: "Post",
    data: payload,
  };
  try {
    const data = await makeApiRequest(
      `${apiUrls.RateSetupLoadRatesSurgery}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

// BindInvestigationMaster

export const BindInvestigationMaster = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.BindInvestigationMaster}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const BindObservationInvestigation = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindObservationInvestigation}`,
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

// SaveObservationInvestigation

export const SaveObservationInvestigation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveObservationInvestigation}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveNewObservation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveNewObservation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// GetObservationData

export const GetObservationData = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetObservationData}?InvestigationID=${id}`,
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

// RemoveObservationInvestigation

export const RemoveObservationInvestigation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.RemoveObservationInvestigation}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveObservationInvestigationMapping = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveObservationInvestigationMapping}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// BindInvestigationOrder
export const BindInvestigationOrder = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindInvestigationOrder}?ObservationTypeID=${id}`,
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

// BindinvestigationLabOutSource

export const BindinvestigationLabOutSource = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindinvestigationLabOutSource}`,
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

export const LoadHeadDepartment = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.LoadHeadDepartment}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SaveInvestigationOrder = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveInvestigationOrder}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// BindinvestigationTamplate

export const BindinvestigationTamplate = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.BindinvestigationTamplate}`, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const LoadTamplate = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.LoadTamplate}?InvestigationID=${id}`,
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

export const RejectTamplate = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RejectTamplate}?TamplateID=${id}`,
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
export const RejectComment = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RejectComment}?CommentID=${id}`,
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

export const SaveTamplateInv = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveTamplateInv}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// SaveUpdateTamplate

export const SaveUpdateTamplate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveUpdateTamplate}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// EditTamplate

export const EditTamplate = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.EditTamplate}?TamplateID=${id}`,
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

export const EditComment = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.EditComment}?CommentID=${id}`,
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

export const BindGroupSurgery = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.BindGroupSurgery}`, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

// BindObservationLabcomment

export const BindObservationLabcomment = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.BindObservationLabcomment}`, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SaveComment = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveComment}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// LoadComment

export const LoadComment = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.LoadComment}?LabObservationID=${id}`,
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

// Manage Approval Controller start here

export const BindDoctor = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindDoctorApproval}`,
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


export const BindEmployeeApproval = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindEmployeeApproval}`,
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

// BindRoleApproval

export const BindRoleApproval = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindRoleApproval}`,
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




export const SaveManageApproval = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveManageApproval}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// BindDetailApproval

export const EDPActDeactEmpSave = async (payload) => {
  // debugger
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.EDPActDeactEmpSave}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  }
}





export const BindDetailApproval = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindDetailApproval}`,
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

// RemoveSignApproval

export const RemoveSignApproval = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RemoveSignApproval}?ID=${id}`,
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

// manageDeliveryBindCentre


export const manageDeliveryBindCentre = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.manageDeliveryBindCentre}`,
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

// GetDeliveryDays

export const GetDeliveryDays = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.GetDeliveryDays}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// SaveInvDeliveryDays


export const SaveInvDeliveryDays = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveInvDeliveryDays}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// SaveOutSourceLab



export const SaveOutSourceLab = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveOutSourceLab}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const UpdateOutSourceLab = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateOutSourceLab}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
//Surgery Master Api

export const LoadDepartmentSurgery = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.LoadDepartmentSurgery}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};


//Surgery 


export const SaveDepartmentSurgery = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDepartmentSurgery}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const SaveSurgeryMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveSurgeryMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const LoadSurgery = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.LoadSurgery}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const UpdateSurgeryMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateSurgeryMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindPanelGroupAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindPanelGroupURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindPaymentModeAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindPaymentModeURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindPanelsAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindPanelsURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindPanelCurrencyAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindPanelCurrencyURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindCurrencyDetailsAPI = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindCurrencyDetailsURL}?CountryID=${params}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const handlePanelSave = async (data) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: data
    };
    const data = await makeApiRequest(`${apiUrls.EDPSavePanelURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindPanelDetailsAPI = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get"
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindPanelDetailsURL}?panelName=${params}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindCategoryListAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get"
    };
    const data = await makeApiRequest(`${apiUrls.EDPCategoryMasterURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const getBindSubCategoryListAPI = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get"
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindPanelsubcatagoryURL}?subCatagory=${params}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const ServiceOfferedListAPI = async (categoryID, subCategoryID, panelID, operationType) => {
  // debugger
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPServiceOfferedListURL}?categoryID=${categoryID}&subCategoryID=${subCategoryID}&panelID=${panelID}&operationType=${operationType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const getBindReduceitemdetails = async (reduceType, panelid) => {
  // debugger
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindReduceitemdetailsURL}?reduceType=${reduceType}&panelid=${panelid}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPLoadBloodBagAPI = async () => {
  // debugger
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPLoadBloodBagURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPLoadBloodComponentAPI = async () => {
  // debugger
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPLoadBloodComponentURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPMappedBloodBagAPI = async (BagTypeID) => {
  // debugger
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindMappedBloodBagURL}?BagTypeID=${BagTypeID}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPDeleteMapBloodBagAPI = async (ID) => {
  // debugger
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "delete",
    };
    const data = await makeApiRequest(`${apiUrls.EDPDeleteMapBloodBagURL}?ID=${ID}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPSaveMapBloodBagTypeAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.EDPSaveMapBloodBagTypeURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPLoadBagTypeAPI = async () => {

  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get"
    };
    const data = await makeApiRequest(`${apiUrls.EDPLoadBagTypeURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPSaveBagTypeAPI = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.EDPSaveBagTypeURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPUpdateBagTypeAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.EDPUpdateBagTypeURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBloodComponmentSearchAPI = async (get) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBloodComponmentSearchURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPSaveBloodComponmentAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.EDPSaveBloodComponmentURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPUpdateBloodComponmentAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.EDPUpdateBloodComponmentURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPLoadBloodGroupAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get"
    };
    const data = await makeApiRequest(`${apiUrls.EDPLoadBloodGroupURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindMappedBloodGroupAPI = async (params) => {
  store.dispatch(setLoading(true));
  const FromBG = encodeURIComponent(params);
  try {
    const options = {
      method: "get"
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindMappedBloodGroupURL}?FromBG=${FromBG}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const EDPSaveMapBloodGroupAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.EDPSaveMapBloodGroupURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPDeleteMapBloodGroupAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "delete",
    };
    const data = await makeApiRequest(`${apiUrls.EDPDeleteMapBloodGroupURL}?ID=${payload}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindDataOrganisationAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindDataOrganisationURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPValidateOrganisationAPI = async (Organisation) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
    };
    const data = await makeApiRequest(`${apiUrls.EDPValidateOrganisationURL}?Organisation=${Organisation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPSaveOrganisationAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.EDPSaveOrganisationURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBloodBankMasterUpdateOrganisationAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.EDPBloodBankMasterUpdateOrganisation}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindBloodBankItemAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindBloodBankItemURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindComponentNameAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindComponentNameURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPSaveItemComponentAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.EDPSaveItemComponentURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindPackageAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindPackageURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindCategoryAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindCategoryURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindSubCategoryAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindSubCategoryURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPBindDocSpecializationAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPBindDocSpecializationURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPSaveORUpdateDocSpecializationURL = async (payload, url) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(apiUrls[url], options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPGetDoctorVisitDetailAPI = async (doctorID, centreID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.EDPGetDoctorVisitDetailURL}?doctorID=${doctorID}&centreID=${centreID}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const EDPOPDVisitConfigSaveAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload
    };
    const data = await makeApiRequest(`${apiUrls.EDPOPDVisitConfigSaveURL}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// SaveObservationMap


 

export const SaveObservationMap = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveObservationMap}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// BindDoctorDetail


export const BindDoctorDetail = async (doctorId) => {
  store.dispatch(setLoading(true));
  try { 
    const data = await makeApiRequest(`${apiUrls.BindDoctorDetail}?docID=${doctorId}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};




