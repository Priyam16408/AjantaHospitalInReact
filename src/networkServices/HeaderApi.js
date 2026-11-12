import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const updateClaims = async (RoleID, CenterID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data:{RoleID:RoleID,CenterID:CenterID}
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateCliam}`, options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const updateTheme = async (param) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: param
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateUserTheme}`, options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const updateUserDetail = async (param, employeeID) => {
  store.dispatch(setLoading(true));
  const formData = new FormData()
  formData.append("EmailId", param?.EmailId);
  formData.append("MobileNo", param?.MobileNo);
  formData.append("EmployeeID", employeeID);
  formData.append("Photo", param?.preview);
  try {
    const options = {
      method: "post",
      data: formData
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateEmployeeProfile}`, options, 'multipart/form-data'
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const updateSignatureApi = async (param, employeeID) => {
  store.dispatch(setLoading(true));
  const formData = new FormData()
  formData.append("EmailId", param?.EmailId);
  formData.append("MobileNo", param?.MobileNo);
  formData.append("EmployeeID", employeeID);
  formData.append("Photo", param?.preview);
  formData.append("EmployeeSignature", param?.EmployeeSignature);
  try {
    const options = {
      method: "post",
      data: formData
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateEmployeeProfile}`, options, 'multipart/form-data'
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const updatePassword = async (param) => {
  store.dispatch(setLoading(true));
  console.log("param", param)
  try {
    const options = {
      method: "post",
      data: { Oldpassword: param?.Oldpassword, password: param?.NewPassword, ConfirmPassword: param?.ConfirmPassword }
    };
    const data = await makeApiRequest(
      `${apiUrls.ChangePassword}`, options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
