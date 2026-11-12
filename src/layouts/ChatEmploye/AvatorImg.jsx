import React from "react";
import "./Avator.css"; // Import the CSS file

const AvatorImg = ({ imageUrl, altText, className }) => {
  return <img className={`avatar ${className}`} src={imageUrl} alt={altText} />;
};

export default AvatorImg;
