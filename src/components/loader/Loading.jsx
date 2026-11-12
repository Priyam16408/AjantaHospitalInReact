import React from "react";
import logoitdose from "../../assets/image/logoitdose.png";
const Loading = ({ loading }) => {
  // if (!loading) return null;

  return (
    <div className="loading-overlay">
      <img src={logoitdose} alt="itdose Logo" className="itdose-logo" />
      <div className="loadingio-spinner-spinner-nq4q5u6dq7r">
        <div className="ldio-x2uulkbinbj">
          {[...Array(21)].map((_, index) => (
            <div key={index}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
