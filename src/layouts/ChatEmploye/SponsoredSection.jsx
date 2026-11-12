import React from "react";
import AvatorImg from "./AvatorImg";
import logoAadmiMan from "../../assets/image/logoAadmiMan.gif";
import { OnlineUserIconSVG } from "../../components/SvgIcons";

const SponsoredSection = ({ key, data, handleEmployeeWiseChat }) => {
  return (
    <div
      style={styles.container}
      key={key}
      onClick={() => handleEmployeeWiseChat(data)}
    >
      <AvatorImg
        imageUrl={data?.EmployeePhoto || logoAadmiMan}
        altText={""}
        className="mr-2"
      />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.name}>{data?.EmployeeName}</span>
          <span style={styles.date} >
            <span style={styles?.loginStatus}> {data?.LoginStatus === "Online" && <OnlineUserIconSVG />}
              <span className="ml-1 mt-1">{data?.LoginStatus}</span>
            </span>
            {data?.UnreadMessages !== 0 ?
              <span style={styles?.UnreadMessages}> {data?.UnreadMessages} </span>
              : <>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</>
            }
          </span>
        </div>


        <div style={styles.description} className="chatEmpDesignation">{data?.Designation}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "4px",
    border: "1px solid #ccc",
    maxWidth: "100%",
    cursor: "pointer",
  },

  content: {
    flex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
  },
  date: {
    fontSize: "10px",
    color: "#888",

  },

  description: {
    color: "#888",
  },
  UnreadMessages: {
    position: "relative",
    top: "15px",
    background: "#15c638",
    color: "white",
    borderRadius: "50px",
    padding: "1px 5px 2px 6px",
  },
  loginStatus: {
    position: "relative",
    right: "-15px",
    top: "-2px",
  }
};

export default SponsoredSection;
