import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import { apiUrls } from "../apiEndpoints";
import makeApiRequest from "../axiosInstance";

export const SaveBank = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveBank}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const BindBank = async (name, type) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindBank}?BankName=${name}&Type=${type}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const SaveCountryMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveCountryMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const LoadCountry = async (name, type) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.LoadCountry}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const UpdateCountryMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateCountryMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const LoadCountryByID = async (countryid) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.LoadCountryByID}?CountryID=${countryid}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const SaveApprovalType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveApprovalType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const BindDiscountApproval = async (approvalType, Type) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindDiscountApproval}?ApprovalType=${approvalType}&Type=${Type}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const UpdateApprovalType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateApprovalType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const BindCentre = async (roleID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.EDPRoleBindCentre}?roleID=${roleID}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const GetFloorByCentre = async (countryid) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.GetFloorByCentre}?cid=${countryid}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const GetRoomByFloor = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.GetRoomByFloor}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const MapRoleToRoom = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.MapRoleToRoom}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BindDocumentName = async (Type, userId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindDocumentName}?type=${Type}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const SaveDocumentMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDocumentMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const UpdateDocumentMaster = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateDocumentMaster}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const SearchRoomData = async (Type) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.SearchRoomData}?casetype=${Type}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const SaveRoomData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveRoomData}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const RoomBindCentre = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.RoomBindCentre}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const InsertNewRoomType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.InsertNewRoomType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const InsertRoomDatalog = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.InsertRoomDatalog}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


// SearchRoomData

// SearchRoomById


export const SearchRoomById = async (roomId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.SearchRoomById}?id=${roomId}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


//diet //compoenntMaster
export const DietComponentBindGrid = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.DietComponentBindGrid}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const DietComponentMasterSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.DietComponentMasterSave}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const DietComponentMasterUpdate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.DietComponentMasterUpdate}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

//dietTypeMaster

export const DietBindDetails = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.DietBindDetails}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveDietType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDietType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const UpdateDietType = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateDietType}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

//subDietTypeMaster

export const SubDietBindGrid = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.SubDietBindGrid}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SubDietTypeSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SubDietTypeSave}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const SubDietTypeUpdate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SubDietTypeUpdate}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const GetDietType = async (Id) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.GetDietType}?id=${Id}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetMapSubDiet = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.GetMapSubDiet}?DietId=${payload}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const MapSubDietSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.MapSubDietSave}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const BindTimingGrid = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindTimingGrid}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const SaveDietTiming = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDietTiming}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const UpdateDietTiming = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateDietTiming}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const BindGridDietMenu = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindGridDietMenu}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const DietMenuSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.DietMenuSave}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const DietMenuUpdate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.DietMenuUpdate}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const Diettiming = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.Diettiming}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const BindSubMenu = async (DietId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindSubMenu}?DietId=${DietId}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const MenuName = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.MenuName}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const MapDietSearch = async (SubDietID, DietID, DietTimeID, DietmenuID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.MapDietSearch}?subDietid=${SubDietID}&dietid=${DietID}&dietimeid=${DietTimeID}&dietmenuid=${DietmenuID}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const MapDietSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.MapDietSave}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const BindWard = async (DietTiming) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindWard}?DietId=${DietTiming|| 0}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const DietIssueBindGrid = async (DietTiming, Ward, Floor, Date) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.DietIssueBindGrid}?DietTiming=${DietTiming}&Ward=${Ward}&Floor=${Floor}&Date=${Date}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const DietRequestSearch = async (IPDCaseTypeID, DietTiming, DietDate, Floor) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.DietRequestSearch}?IPDCaseTypeID=${IPDCaseTypeID}&DietTiming=${DietTiming}&DietDate=${DietDate}&Floor=${Floor}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const BindDietType = async (dietTiming) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindDietType}?dietTiming=${dietTiming}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const BindSubDietType = async (dietTiming, DietID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.BindSubDietType}?dietTiming=${dietTiming}&DietID=${DietID}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const DietBindMenu = async (dietTiming, dietID, subDietID, date) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",

    };
    const data = await makeApiRequest(
      `${apiUrls.DietBindMenu}?dietTiming=${dietTiming}&dietID=${dietID}&subDietID=${subDietID}&date=${date}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const GetComponent = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetComponent}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const DietSaveComponent = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.DietSaveComponent}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};




export const ReceivedDiet = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.ReceivedDiet}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

