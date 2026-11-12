import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import { apiUrls } from "../apiEndpoints";
import makeApiRequest from "../axiosInstance";

export const bindCentreCategoryAPI = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls.handleSavePanelCentreURL,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const RoleAndDepartmentSetUpAPI = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetRoleToEditAPI}?roleID=${payload}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const updateRoleEDPUpdateAPI = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "post",
      data:payload
    };
    const data = await makeApiRequest(
      `${apiUrls.updateRoleEDPUpdateURL}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const MenuSetupBindLoginTypeAPI = async () => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "get"
        };
    const data = await makeApiRequest(
      `${apiUrls.MenuSetupBindLoginTypeURL}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const MenuSetupBindAllMenuAPI = async (RoleID,Type) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "get"
        };
    const data = await makeApiRequest(
      `${apiUrls.MenuSetupBindAllMenuURL}?RoleID=${RoleID}&Type=${Type}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

