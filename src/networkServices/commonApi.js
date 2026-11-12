import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";

export const GetBindAllCenter = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetBindAllCenter}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
export const ReportAIChatPdfAPI = async (payload) => {
    try {
      const option = {
        method: "post",
        data:payload
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.ReportAIChatPdf}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };