import React, { useState, Fragment } from "react";
import { Dropdown } from "react-bootstrap";
import Blank from "../../../pages/Blank";
import OverLay from "../../../components/modalComponent/OverLay";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import OPDServiceBooking from "../../../pages/frontOffice/OPD/OPDServiceBooking";

const OverlayDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("top");
  const show = (position) => {
    setPosition(position);
    setVisible(true);
  };
  const [t] = useTranslation();

  return (
    <>
      <Dropdown className="colortheme-button p-0">
        {/* <Dropdown.Toggle
          id="dropdown-basic"
          bsPrefix="custom-toggle"
          className="p-0"
        >
          <i
            className="fa fa-stethoscope"
            // onClick={() => show("top")}
            aria-hidden="true"
          ></i>
        </Dropdown.Toggle> */}

        <Dropdown.Menu className="p-0">
          {/* <Dropdown.Item onClick={() => show("top ")}>Component 1</Dropdown.Item> */}
          <ReactSelect
            placeholderName=''
            searchable={true}
            respclass="component_select"
            id="City"
            handleChange={() => show("top ")}
          />
        </Dropdown.Menu>

      </Dropdown>

      <OverLay
        visible={visible}
        setVisible={setVisible}
        position={position}
        setPosition={setPosition}
        Header={"Register/ Modify"}
      >
        <OPDServiceBooking/>
      </OverLay>
    </>
  );
};

export default OverlayDropdown;
