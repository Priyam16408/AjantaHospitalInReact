import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";

export const getCollectionReportApi = async () => {
    try {
        const option = {
            method: "get",
        };
        const data = await makeApiRequest(
            `${apiUrls?.getCollectionReport}`,
            option
        );
        return data;
    } catch (error) {
        console.log(error, "SomeThing Went Wrong");
    }
}