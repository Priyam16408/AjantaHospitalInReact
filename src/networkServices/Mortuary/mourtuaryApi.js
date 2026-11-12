import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import { apiUrls } from "../apiEndpoints";
import makeApiRequest from "../axiosInstance";


export const MortuaryGetSerachDeathPerson = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(`${apiUrls.MortuaryGetSerachDeathPerson}?MRNo=${payload?.MRNo}&IPDNo=${payload?.IPDNo}&FirstName=${payload?.FirstName}&LastName=${payload?.LastName}&FromDate=${payload?.FromDate}&ToData=${payload?.ToDate}`, {
            method: "get",
        });

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const MortuarygetReligion = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(`${apiUrls.MortuarygetReligion}`, {
            method: "GET",
        });

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const bindFreezerList = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(`${apiUrls.MortuaryBindFreezerList}?status=${payload?.status}&muslim=${payload?.muslim}`, {
            method: "GET",
        });

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const MortuaryBindPatientType = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(`${apiUrls.MortuaryBindPatientType}`, {
            method: "GET",
        });

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const serachReceivedCorpse = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(`${apiUrls.serachReceivedCorpse}`, {
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
export const SearchCorpseDetails = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(`${apiUrls.SearchCorpse}`, {
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