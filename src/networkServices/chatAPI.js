import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const ChatHubChatTicket = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.ChatHubChatTicket, options);
    return data;
  } catch (error) {
    console.error("Error Found", error);
  }
};

export const ChatHubSaveChat = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.ChatHubSaveChat, options);
    return data;
  } catch (error) {
    console.error("Error Found", error);
  }
};
