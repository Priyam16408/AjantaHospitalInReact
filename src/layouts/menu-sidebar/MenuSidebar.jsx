import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuItem from "@app/layouts/menu-sidebar/MenuItem.jsx";
import { Image } from "@profabric/react-components";
import styled from "styled-components";
import i18n from "@app/utils/i18n";
import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
import logo from "@app/assets/image/logo.png";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import DesktopMenuItem from "./DesktopMenuItem";
import { GetBindMenu } from "../../store/reducers/common/CommonExportFunction";
import { updateClaims } from "../../networkServices/HeaderApi";
// import { GetRoleListByEmployeeIDAndCentreID } from "../../store/reducers/common/getRoleListSlice";

const Version = import.meta.env.VITE_APP_VERSION;

export const MENU = {
  commonComponent: [
    {
      menuName: i18n.t("Dashboard"),
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          childrenName: i18n.t("Dashboard"),
          icon: "fas fa-regular fa-user",
          url: "/dashboard",
          breadcrumb: "Dashboard",
        },
      ],
    },
  ],
  frontOffice: [
    {
      name: i18n.t("Registration"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: i18n.t("Register_Modify"),
          icon: "fas fa-regular fa-user",
          path: "/DirectPatientReg",
          breadcrumb: "Registration / Register/ Modify",
        },
        {
          name: i18n.t("Patient_Black_List"),
          icon: "fas fa-regular fa-user",
          path: "/PatientBlackList",
          breadcrumb: "Registration / Patient Black List",
        },
      ],
    },

    {
      name: i18n.t("Sidebar.FrontOffice.OPD.OPD"),
      icon: "fas fa-regular fa-users",
      children: [
        {
          name: i18n.t("Sidebar.FrontOffice.OPD.OPD_servicebooking"),
          icon: "fas fa-regular fa-user",
          path: "/opd-servicebooking",
          breadcrumb: "OPD / OPD Service Booking",
        },
        {
          name: i18n.t("Sidebar.FrontOffice.OPD.Confirmation"),
          icon: "fas fa-regular fa-user",
          path: "/Confirmation",
          breadcrumb: "OPD / Confirmation",
        },
        // {
        //   name: i18n.t("Sidebar.FrontOffice.OPD.LabPackageInclude"),
        //   icon: "fas fa-regular fa-user",
        //   path: "/opd-lab-package-include",
        //   breadcrumb: "OPD / Lab Package Include",
        // },
        {
          name: i18n.t("Sidebar.FrontOffice.OPD.opd-setellment"),
          icon: "fas fa-regular fa-user",
          path: "/opd-setellment",
          breadcrumb: "OPD / OPD Setellment",
        },
        {
          name: i18n.t("Sidebar.FrontOffice.OPD.opd-refund"),
          icon: "fas fa-regular fa-user",
          path: "/opd-refund",
          breadcrumb: "OPD / OPD Refund",
        },
        {
          name: i18n.t("Sidebar.FrontOffice.OPD.opd-advance"),
          icon: "fas fa-regular fa-user",
          path: "/opd-advance",
          breadcrumb: "OPD / OPD Advance",
        },
        {
          name: i18n.t("Sidebar.FrontOffice.OPD.card-print"),
          icon: "fas fa-regular fa-user",
          path: "/card-print",
          breadcrumb: "OPD / Card Print",
        },
        {
          name: i18n.t("Sidebar.FrontOffice.OPD.Upload_View_Document"),
          icon: "fas fa-regular fa-user",
          path: "/Uploadpatientdocuments",
          breadcrumb: "OPD / Upload View Document",
        },
      ],
    },

    {
      name: i18n.t("Sidebar.FrontOffice.Reprint.Reprint"),
      icon: "fas fa-regular fa-receipt",
      children: [
        {
          name: i18n.t("Sidebar.FrontOffice.Reprint.Receipt-Re-Print"),
          icon: "fas fa-regular fa-receipt",
          path: "/ReceiptReprint",
          breadcrumb: "OPD / Receipt Re-Print",
        },
      ],
    },
    {
      name: i18n.t("Tools"),
      icon: "fas fa-regular fa-receipt",
      children: [
        {
          // name: i18n.t('Sidebar.FrontOffice.Reprint.Receipt-Re-Print'),
          name: "Debit Credit Note",
          icon: "fas fa-regular fa-receipt",
          path: "/DebitCreditNote",
          breadcrumb: "Tools / Debit Credit Note",
        },
        {
          // name: i18n.t('Sidebar.FrontOffice.Reprint.Receipt-Re-Print'),
          name: "Expence Voucher",
          icon: "fas fa-regular fa-receipt",
          path: "/expense-voucher",
          breadcrumb: "Tools / Expence Voucher",
        },
      ],
    },
    {
      name: "Reports",
      icon: "fas fa-regular fa-receipt",
      children: [
        {
          name: "Daily Collection",
          icon: "fas fa-regular fa-receipt",
          path: "/collection-report",
          breadcrumb: "Reports / Daily Collection",
        },
        {
          name: "Registration Detail",
          icon: "fas fa-regular fa-receipt",
          path: "/registration-report",
          breadcrumb: "Reports / Registration Detail",
        },
        {
          name: "OPD Balance/Advance Detail",
          icon: "fas fa-regular fa-receipt",
          path: "/opd-balance-advance-detail",
          breadcrumb: "Reports / OPD Balance/Advance Detail",
        },
        {
          name: "Refund Detail",
          icon: "fas fa-regular fa-receipt",
          path: "/refund-details",
          breadcrumb: "Refund Detail",
        },
        {
          name: "Patient Vise Search",
          icon: "fas fa-regular fa-receipt",
          path: "/patient-vise-search",
          breadcrumb: "Reports / Patient Vise Search",
        },
        {
          name: "OPD-Bill Register Report",
          icon: "fas fa-regular fa-receipt",
          path: "/opd-billregisterreport",
          breadcrumb: "Reports / OPD_Bill Register Report",
        },
      ],
    },
  ],
  helpDesk: [
    {
      name: "Help Desk",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          name: "Panel Detail",
          icon: "fas fa-regular fa-user",
          path: "/panel-detail",
          breadcrumb: "Help Desk / Panel Detail",
        },
        {
          name: "Doctor Timing",
          icon: "fas fa-regular fa-user",
          path: "/doctortiming",
          breadcrumb: "Help Desk / Doctor Timing",
        },
        {
          name: "OPD Package Detail",
          icon: "fas fa-regular fa-user",
          path: "/package-detail-opd",
          breadcrumb: "Help Desk / Doctor Timing",
        },
        {
          name: "Help Desk-IPD",
          icon: "fas fa-regular fa-user",
          path: "/help-deskipd",
          breadcrumb: "Help Desk / Help Desk-IPD",
        },
      ],
    },
    {
      name: " Estimate Billing ",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          name: "Surgery Estimate",
          icon: "fas fa-regular fa-user",
          path: "/cost-estimation-billing",
          breadcrumb: "Help Desk / Cost Estimation Billing",
        },
        {
          name: "Cost Estimation Re-print",
          icon: "fas fa-regular fa-user",
          path: "/cost-estimation-reprint",
          breadcrumb: "Help Desk / Cost Estimation Re-print",
        },
      ],
    },
  ],
  TokenManagement: [
    {
      name: "Token Management",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          name: "Exam Counter Master-----",
          icon: "fas fa-regular fa-user",
          path: "/exam-counter-master",
          breadcrumb: "Token Management / Exam Counter Master",
        },
        {
          name: "Reciept Token Master",
          icon: "fas fa-regular fa-user",
          path: "/token-generation-master",
          breadcrumb: "Token Management / Reciept Token Master",
        },

        {
          name: "Modality Master",
          icon: "fas fa-regular fa-user",
          path: "/modality-master",
          breadcrumb: "Token Management / Modality Master",
        },
        {
          name: "online Inv Slot Master",
          icon: "fas fa-regular fa-user",
          path: "/online-inv-slot-master",
          breadcrumb: "Token Management / Investigation Time Slot Master",
        },
        {
          name: "Sample Coll Room Master",
          icon: "fas fa-regular fa-user",
          path: "/samplecollroommaster",
          breadcrumb: "Token Management / Sample Collection Room Master",
        },
      ],
    },
  ],
  examinationRoom: [
    {
      name: "OPD",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          name: "Examination Room",
          icon: "fas fa-regular fa-user",
          path: "/vital-sign",
          breadcrumb: "Examination Room / OPD / Examination Room",
        },
      ],
    },
    {
      name: "Frame menu",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          name: "Vital Sign",
          icon: "fas fa-regular fa-user",
          path: "/vital-sign",
          breadcrumb: "Examination Room / Frame menu / Vital Examination ",
        },
        {
          name: "CPOE Folder",
          icon: "fas fa-regular fa-user",
          path: "/cpoe-folder",
          breadcrumb: "Examination Room / OPD / CPOE Folder",
        },
      ],
    },
    {
      name: "Reports",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          name: "Doctor Wise App Summary",
          icon: "fas fa-regular fa-user",
          path: "/doctorwiseappsummary",
          breadcrumb: "Examination Room / Doctor Wise App Summary",
        },
        {
          name: "Doctor Wise App Details",
          icon: "fas fa-regular fa-user",
          path: "/doctorwiseappdetails",
          breadcrumb: "Examination Room / Reports / Doctor Wise App Details",
        },
      ],
    },
   
  ],
  Billng: [
    {
      name: "IPD",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        {
          name: "IPDAdmissionNew",
          icon: "fas fa-regular fa-user",
          path: "/IPDAdmissionNew",
          breadcrumb: "Billing / IPD / IPDAdmissionNew",
        },
      ],
    },
    
    
   
  ],
};

const StyledBrandImage = styled(Image)`
  float: left;
  line-height: 0.8;
  margin: -1px 8px 0 6px;
  opacity: 0.8;
  --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23) !important;
`;

const StyledUserImage = styled(Image)`
  --pf-box-shadow: 0 3px 6px #00000029, 0 3px 6px #0000003b !important;
`;

const MenuSidebar = () => {
  const localData = useLocalStorage("userData", "get"); // get Data from localStorage
  const dispatch = useDispatch();
  const sidebarSkin = useSelector((state) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state) => state.ui.menuChildIndent);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const { GetMenuList, GetRoleList } = useSelector(
    (state) => state.CommonSlice
  );
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const navigate= useNavigate()
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    if (value) {
      const filtered = [...MENU["commonComponent"], ...GetMenuList]
        .map((category) => {
          const filteredChildren = category.children.filter((child) =>
            child.childrenName.toLowerCase().includes(value)
          );

          if (filteredChildren.length > 0) {
            return {
              ...category,
              children: filteredChildren,
            };
          }
          return null;
        })
        .filter((category) => category !== null);

      setFilteredData(filtered);
    } else {
      setFilteredData([...MENU["commonComponent"], ...GetMenuList]);
    }
  };

  const handleUpdateClaims = async (roleID, centreID) => {
    const data = await updateClaims(String(roleID), String(centreID));

    if (data?.success) {
      // useLocalStorage("userData", "set", data?.data?.loginResponse);
      useLocalStorage("token", "set", data?.data?.token);
      return data
    }
  };
    // role bind
    const handleChangeRole = async (e) => {
      const { value } = e;
      // useLocalStorage("userData", "set", { ...localData, defaultRole: value });
      try {
        let apiResp = await handleUpdateClaims(value, localData?.defaultCentre);
        await dispatch(
          GetBindMenu({
            RoleID: value,
          })
        );
      //  useLocalStorage("userData", "set", { ...localData, defaultRole: value });
      useLocalStorage("userData", "set", { ...localData, defaultRole: value, deptLedgerNo: apiResp?.data?.loginResponse?.deptLedgerNo,roleName:apiResp?.data?.loginResponse?.roleName });
        navigate("/dashboard");
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };


  useEffect(() => {
    if (GetMenuList?.length > 0) {
      setFilteredData([...MENU["commonComponent"], ...GetMenuList]);
    }
  }, [GetMenuList]);


  return ["lg", "md"].includes(screenSize) ? (
    <DesktopMenuItem filteredData={filteredData} />
  ) : (
    <aside className={`main-sidebar sidebar_border ${sidebarSkin}`}>
      <Link to="#" className="brand-link">
        <StyledBrandImage
          className="logoStyle"
          src={logo}
          alt="AdminLTE Logo"
          width={33}
          height={30}
          rounded
        />
        <span className="brand-text font-weight-bold ml-3 mt-3">{Version}</span>
      </Link>
      <div className="sidebar">
        <div className="row mt-3  bindrole">
          <ReactSelectHead
            placeholderName="Select Role"
            dynamicOptions={GetRoleList?.map((ele) => {
              return {
                label: ele?.roleName,
                value: ele?.roleID,
              };
            })}
            searchable={true}
            respclass="col-12"
            value={Number(localData?.defaultRole)}
            handleChange={handleChangeRole}
          />
        </div>
        <div className="row bindrole">
          <div className="col-12">
            <input
              type="text"
              className="form-control search_Items"
              id="search"
              name="search"
              label=""
              value={query}
              onChange={handleSearch}
              placeholder="Search"
              respclass="col-12"
            />
            <i className="fa fa-search search_icon" aria-hidden="true"></i>
          </div>
        </div>

        <nav className="mt-2">
          <ul
            className={`nav  nav-sidebar flex-column${
              menuItemFlat ? " nav-flat" : ""
            }${menuChildIndent ? " nav-child-indent" : ""}`}
            role="menu"
          >
            {filteredData?.map((menuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
                isSearched={Boolean(query)}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
