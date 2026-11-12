import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const BindPanelGroup = async () => {
  try {
    const url = `${apiUrls.BindPanelGroup}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PanelSearch = async (PanelGroup, Panel) => {
  try {
    const url = `${apiUrls.PanelSearch}?PanelGroup=${PanelGroup}&Panel=${Panel}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

