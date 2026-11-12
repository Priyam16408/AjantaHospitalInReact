import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../../../src/NotificationCard.css"; // create this for custom styles



const NotificationVisitCard = ({ data, cardHeading }) => {
  const [visible, setVisible] = useState(true);
  // useEffect(() => {
  //   if (lastVisit || lastService) {
  //     setVisible(true);
  //   }
  // }, [lastVisit, lastService]);

  // if (!visible) return null;

  return (
    <div className={`notify-card ${!visible ? "handle-close" : ""}`}>
      <div className="notify-header">
        <strong>Patient Last Visit</strong>
        <button className="notify-close text-center" onClick={() => setVisible(false)}>&times;</button>
      </div>
      <div className="notify-content">
        {data?.map((item,i) => (
          <div className="notify-item" key={i}>
            <label>{item?.label}</label>
            <span>{item?.value}</span>
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default NotificationVisitCard;

