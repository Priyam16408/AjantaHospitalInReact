import React from "react";
import { IoIosColorPalette } from "react-icons/io";
import { TbLanguage } from "react-icons/tb";
import { GoHome } from "react-icons/go";
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { MdOutlineDashboardCustomize } from "react-icons/md";

const HEADER_ICONS = [
  {
    icons: <IoIosColorPalette />,
    Component: "",
  },
  {
    icons: <TbLanguage />,
    Component: "",
  },
  {
    icons: <GoHome />,
    Component: "",
  },
  {
    icons: <CiSettings />,
    Component: "",
  },
  {
    icons: <IoIosNotificationsOutline />,
    Component: "",
  },
  {
    icons: <AiOutlineFullscreen />,
    Component: "",
  },
  {
    icons: <MdLogout />,
    Component: "",
  },

  {
    icons: <FaRegUserCircle />,
    Component: "",
  },
];

const SUBMENU = {
  "Out Patients": [
    {
      name: "Registration",
      url: "",
    },
    {
      name: "Out Patient Billing",
      url: "",
    },
    {
      name: "ACD",
      url: "",
    },
    {
      name: "Patient History",
      url: "",
    },
    {
      name: "Configure",
      url: "",
    },
    {
      name: "QMS",
      url: "",
    },
    {
      name: "Staff Dependents",
      url: "",
    },
    {
      name: "E.STagging",
      url: "",
    },
    {
      name: "Marketing",
      url: "",
    },
    {
      name: "Reports",
      url: "",
    },
  ],
  Emergency: [],
  "In-Patients": [],
  MMS: [],
  "Operation Theater": [],
  "MIS Reports": [],
  Physicians: [],
  Laboratory: [],
  "Adverse Events": [],
  "Donate Blood": [],
  Administration: [],
};

const Header1 = () => {
  return (
   <>
    <div style={{ position: "relative" }}>
      {/* <div className="header-container">
        <div className="container-fluid">
          <div className="icons-container">
            <div className="d-flex justify-content-end align-items-center">
              <ul className="d-flex justify-content-left align-items-center m-0 p-0">
                <li
                  className="list-group-item text-white p-1 m-1 "
                  style={{ background: "linear-gradient(#0daf84, #05dca4)", fontSize: "16px", fontWeight: "bold" }}
                >
                  <MdOutlineDashboardCustomize className="mx-1" />
                </li>
                <li
                  className="list-group-item text-white p-1 m-1 "
                >
                  <div className="search-container mt-1">
                    <input type="text" className="search-input" placeholder="Search..." />
                    <i className="fa fa-search search-icon"></i>
                  </div>
                </li>

                <li
                  className="list-group-item text-white p-1 mx-1 "
                  style={{ fontSize: "12px" }}
                >
                  <select className="input-text-center" style={{}}>
                    <option> Select Department or Centre</option>
                    <option> option 2 </option>
                  </select>
                </li>
              </ul>
              <ul className="d-flex justify-content-end align-items-center m-0 p-0">

                <li
                  className="list-group-item text-white p-1 mx-1 "
                  style={{ fontSize: "12px" }}
                >
                  Welcome Mr. Sahil Kumar (#1234)
                </li>
                {HEADER_ICONS.map((icons, index) => (
                  <li
                    className="list-group-item fs-5 text-white fw-semibold p-1 mx-1"
                    key={index}
                  >
                    {icons?.icons}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div> */}

      <div className="sub-header-container">
        <div className="sub-header ">
          <div className="container-fluid">
            <ul className="d-flex justify-content-end align-items-center m-0 p-0">
              {Object.keys(SUBMENU).map((ele, index) => (
                <li
                  className={`list-group-item  p-2 list-style ${index === 0 ? "active-sub-menu" : "text-white"
                    }`}
                  key={index}
                >
                  {ele}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="active-sub-menu-list-style" id="active-tab">
          <div className="container-fluid">
            <ul className="d-flex justify-content-start align-items-center m-0 p-0">
              {SUBMENU["Out Patients"].map((ele, index) => (
                <li
                  className={`list-group-item  py-1 px-3 ${index === 1 && "active-tab-menu"
                    }`}
                  key={index}
                >
                  {ele?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* <div className="img-conatiner">
        <div style={{ width: "70%", margin: "auto" }}>
          <img
            src="https://www.itdoseinfo.com/assets/img/logo/logo-itdose.png"
            className="img-fluid"
          />
        </div>
      </div> */}
    </div>
   </>
  );
};

export default Header1;
