import React from "react";
import { ChatSVG } from "../../components/SvgIcons";

const ChatIconAndCount = ({onClick,Count}) => {
  return (
    <div className="chatMainbox" onClick={() => onClick(true)} style={{zIndex:"99999999"}}>
      <div className="chat-icon">
        <ChatSVG />
        <div className="countDiv">{Count>99?"99+":Count}</div>
      </div>
    </div>
  );
};

export default ChatIconAndCount;
