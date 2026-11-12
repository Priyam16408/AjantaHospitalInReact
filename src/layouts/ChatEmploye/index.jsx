import React, { useEffect, useState } from "react";
import ChatIconAndCount from "./ChatIconAndCount";
import SlideChatBox from "./SlideChatBox";
import { ChatHubChatTicket } from "../../networkServices/chatAPI";

const index = () => {
  const [showChatBox, setShowChatBox] = useState(false);
  const [unReadMessageCount, setUnReadMessageCount] = useState(0);

  const getUserListData = async () => {
    const requestBody = {
      type: 3,
      toEmployeeID: "",
      startLimit: 0,
      endLimit: 0,
    };
    const response = await ChatHubChatTicket(requestBody);
    if (response?.success) {
      setUnReadMessageCount(response?.data[0]?.UnreadMessage)
    } else {
      setUnReadMessageCount(0)
    }
  }


  useEffect(() => {
    getUserListData()
  }, [])

  const handleShowChatBoxState = (request) => {
    setShowChatBox(request);
  };

  return (
    <div id="main-chat-section">
      {showChatBox ? (
        <SlideChatBox
          toggleChat={handleShowChatBoxState}
          isOpen={showChatBox}
        />
      ) : (
        <ChatIconAndCount onClick={handleShowChatBoxState} Count={unReadMessageCount}/>
      )}
    </div>
  );
};

export default index;
