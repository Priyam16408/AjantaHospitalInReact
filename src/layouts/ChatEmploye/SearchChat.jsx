import React from "react";
import Input from "../../components/formComponent/Input";
import OnlineSection from "./OnlineSection";

const SearchChat = ({ chatData,handleUserSearch }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        position: "sticky",
        top: "0px",
        padding: "5px",
      }}
    >
      <div style={{ position: "relative" }}>
        <div className="d-flex">
          <Input
            type="text"
            onChange={handleUserSearch}
            className="form-control"
            respclass={"w-100"}
            placeholder={"Search"}

          />
          <div style={{ position: "absolute", right: "0px" }}>
            <label
              style={{
                border: "1px solid #ced4da",
                padding: "2px 5px",
                borderRadius: "3px",
              }}
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </label>
          </div>
        </div>
        {/* <div>
          <OnlineSection chatData={chatData} />
        </div> */}
      </div>
    </div>
  );
};

export default SearchChat;
