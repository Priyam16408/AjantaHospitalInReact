import React, { useState } from "react";
import "./Accordion.css"; // Import your CSS file for styling
import Heading from "./Heading";

const Accordion = ({ title, children, defaultValue ,isBreadcrumb}) => {
  const [isOpen, setIsOpen] = useState(defaultValue); // State variable to track accordion open/close state

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`card  patient_registration_card ${isOpen ? "open" : ""}`}
    >
      <Heading title={title} onClick={toggleAccordion} isBreadcrumb={isBreadcrumb}/>
      <div className={`collapse ${isOpen ? "show" : ""}`}>{children} </div>
    </div>
  );
};

export default Accordion;
