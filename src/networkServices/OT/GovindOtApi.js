import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import { apiUrls } from "../apiEndpoints";
import makeApiRequest from "../axiosInstance";

export const OTBindOTTATTypeAPI = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(`${apiUrls.OTBindOTTATTypeURL}`, {
            method: "get",
        });

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};