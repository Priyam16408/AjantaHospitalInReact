import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const BindOPDPackage = async () => {
  try {
    const url = `${apiUrls.BindOPDPackage}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PackageDetail = async (PackageID) => {
  try {
    const url = `${apiUrls.PackageDetail}?PackageID=${PackageID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindPackageRate = async (
  PackageID,
  PanelID,
  panelCurrencyFactor
) => {
  try {
    const url = `${apiUrls.BindPackageRate}?PackageID=${PackageID}&PanelID=${PanelID}&panelCurrencyFactor=${panelCurrencyFactor}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
