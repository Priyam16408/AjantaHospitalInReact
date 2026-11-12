import React, { useMemo } from "react";
import AvatorImg from "./AvatorImg";
import logoAadmiMan from "../../assets/image/logoAadmiMan.gif";

const OnlineSection = ({ chatData }) => {
  const handleFilterOnline = useMemo(() => {
    return chatData?.filter(
      (item, _) => item?.LoginStatus.toLowerCase() === "online"
    );
  }, [chatData?.length]);

  return (
    <div>
      {handleFilterOnline?.map((ele, index) => (
        <div key={index} className="online-List-chat">
          <div style={{ cursor: "pointer" }} className="active-status">
            <AvatorImg
              imageUrl={ele?.EmployeePhoto || logoAadmiMan}
              className={"m-2"}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnlineSection;
