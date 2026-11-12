
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const LoadCurrencyDetail = async () => {
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.LoadCurrencyDetail, options);
    return data;
  } catch (error) {
    console.error("Error loading currency detail:", error);
  }
};

export const BindPaymentModePanelWise = async ({ PanelID }) => {
  try {
    const options = {
      method: "GET",
    };

    const data = await makeApiRequest(
      `${apiUrls.PaymentControlBindPaymentModePanelWise}?PanelID=${PanelID}`,
      options
    );
    // const data = await axios.post(
    //   `http://10.0.2.110/HospediaAPI/api/v1${apiUrls.PaymentControlBindPaymentModePanelWise}`,
    //   { panelID: 1 }
    // );
    return data;
  } catch (error) {
    console.error("Error loading currency detail:", error);
  }
};

export const getBankMaster = async () => {
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(apiUrls.GetBankMaster, options);
    return data;
  } catch (error) {
    console.error("Error loading Bank Master:", error);
  }
};

// getConvertCurrency

export const getConvertCurrency = async (CountryID, Amount) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.getConvertCurrecncy}?CountryID=${CountryID}&Amount=${Amount}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error loading currency detail:", error);
  }
};

export const GetConversionFactor = async (CountryID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetConversionFactor}?CountryID=${CountryID}`,
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

// Bill Amount Function

export const BillAmount = async () => {};
