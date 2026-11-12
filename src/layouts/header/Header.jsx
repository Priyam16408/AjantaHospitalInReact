import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import NotificationsDropdown from "@app/layouts/header/notifications-dropdown/NotificationsDropdown";
import LanguagesDropdown from "@app/layouts/header/languages-dropdown/LanguagesDropdown";
import Themedropdown from "@app/layouts/header/Theme-dropdown";
import { toggleFullScreen } from "../../utils/helpers";
import SubMenuDropdown from "@app/layouts/header/submenu-dropdown/SubMenuDropdown";
import OverlayDropdown from "./overlay-dropdown";
import i18next from "i18next";
import i18n from "i18next";
import { useNavigate } from "react-router-dom";
// import { GetRoleListByEmployeeIDAndCentreID } from "../../store/reducers/getRoleListSlice";
// import getEmployewiseCentre from "../../store/reducers/common/getEmployewiseCentre";
import UserDropdown from "./user-dropdown/UserDropdown";
import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import {
  GetBindMenu,
  GetRoleListByEmployeeIDAndCentreID,
  getBindPanelList,
  getEmployeeWise,
  getNotification,
} from "../../store/reducers/common/CommonExportFunction";
import { logoutAction } from "../../store/reducers/AuthSlice/logoutSlice";
import { updateClaims } from "../../networkServices/HeaderApi";
import logoitdose from "../../assets/image/logoitdose.png";
import { getBindCategory } from "../../store/reducers/TokenManagementSlice/CommonExportFunction";
import SpeechToTextWithSpeechOutput from "../../components/SpeechToTextWithSpeechOutput";
import { GetLangaugeAPI } from "../../store/reducers/dashboardSlice/CommonFunction";

const Header = React.memo(() => {
  const [routeFlag, setRouteFlag] = useState(false);
  const localData = useLocalStorage("userData", "get"); // get Data from localStorage
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navbarVariant = useSelector((state) => state.ui.navbarVariant);
  const headerBorder = useSelector((state) => state.ui.headerBorder);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
    (state) => state?.CommonSlice
  );
  const [roll, setRoll] = useState({
    rollName: Number(localData?.defaultRole) || Number(GetRoleList[0]?.roleID),
  });
  const signout = useSelector((state) => state.logoutSlice);
  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  /**
   * Logout function to handle user logout API Implement.
   */

  const logOut = () => {
    dispatch(
      logoutAction({
        roleID: localData?.defaultRole,
        employeeID: localData?.employeeID,
        centreID: localData?.centreID,
      })
    );
    setRouteFlag(true);
    // localStorage.clear();
    // navigate("/login");
    // notify("Sucessfully logout", "success");
  };

  const handleUpdateClaims = async (roleID, centreID) => {
    const data = await updateClaims(String(roleID), String(centreID));

    if (data?.success) {
      useLocalStorage("userData", "set", data?.data?.loginResponse);
      useLocalStorage("token", "set", data?.data?.token);
    }
    return data;
  };

  const handleChangeCentre = async (e) => {
    const { value } = e;

    await handleUpdateClaims(localData?.defaultRole, value);

    window.location.reload();

    await useLocalStorage("userData", "set", {
      ...localData,
      defaultCentre: value,
    });

    await dispatch(
      GetRoleListByEmployeeIDAndCentreID({
        employeeID: localData?.employeeID,
        centreID: value,
      })
    );
  };

  /**
   * Make an API request for MasterPage/EmployeeWiseCentreList.
   *
   * @param {parametre} EmployeeID - The parametre for EmployeeID from localStorage
   * @param {API Implement Name} options - API for MasterPage/EmployeeWiseCentreList.
   */
  useEffect(() => {
    if (localData?.employeeID) {
      dispatch(getEmployeeWise({ employeeID: localData?.employeeID }));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getNotification({
        RoleID: localData?.defaultRole,
        EmployeeID: localData?.employeeID,
        CentreID: localData?.defaultCentre,
      })
    );
  }, []);

  // role bind
  const handleChangeRole = async (e) => {
    const { value } = e;
    console.log(value);
    try {
      const apiResp = await handleUpdateClaims(value, localData?.defaultCentre);
      await dispatch(
        GetBindMenu({
          RoleID: value,
        })
      );
      setRoll({ rollName: value });
      useLocalStorage("userData", "set", {
        ...localData,
        defaultRole: value,
        deptLedgerNo: apiResp?.data?.loginResponse?.deptLedgerNo,
        roleName: apiResp?.data?.loginResponse?.roleName,
      });
      // useLocalStorage("userData", "set", { ...localData, ...apiResp?.data?.loginResponse });
      // useLocalStorage("userData", "set", apiResp?.data?.loginResponse);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  // useEffect(() => {
  //   if (routeFlag && signout.success) {
  //     window, location.reload();
  //     navigate("/login");
  //   }
  // }, [signout.success]);

  let translation = {};
  const loadTranslations = async (lng, lngkey) => {
    try {
      const apiResp = await GetLangaugeAPI(lngkey);
      if (apiResp?.success) {
        apiResp?.data?.map((val) => {
          translation[val["FIELDNAME"]] = val["DISPLAYNAME"];
        });
      }
      i18n.addResourceBundle(lng, "translation", translation, true, true);
      i18n.changeLanguage(lng);
    } catch (error) {
      console.error(`Error fetching translations for ${lng}:`, error);
    }
  };

  useEffect(() => {
    dispatch(getBindCategory());
    loadTranslations(localData?.empLanguageCode, localData?.empLanguage);

    // Jha jha per All jaiga hard code common h
    // dispatch(
    //   GetBindAllDoctorConfirmation({
    //     Department: "All",
    //   })
    // )
    dispatch(
      getBindPanelList({
        PanelGroup: "ALL",
      })
    );
  }, []);
  return (
    <>
      <nav className={getContainerClasses()} style={{ position: "relative" }}>
        <ul className="navbar-nav">
          {["lg", "md"].includes(screenSize) ? (
            <div className="img-conatiner">
              <div style={{ width: "70%", margin: "auto" }}>
                <img src={logoitdose} className="img-fluid" />
              </div>
            </div>
          ) : (
            <li className="nav-item">
              <button
                onClick={handleToggleMenuSidebar}
                type="button"
                className="nav-link mobilerespBars"
              >
                <i className="fas fa-bars" />
              </button>
            </li>
          )}
        </ul>
        <ul className="navbar-nav ml-6"></ul>

        <ul className="navbar-nav ml-auto selectHRes">
          <li className="nav-item savetheme">
            <div type="button" className=" headerboxsize">
              <ReactSelectHead
                placeholderName="Select Centre"
                dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
                  return { label: ele.CentreName, value: ele.CentreID };
                })}
                searchable={true}
                value={Number(localData?.defaultCentre)}
                respclass="roll-off"
                handleChange={handleChangeCentre}
                plcN="center"
              />
            </div>
          </li>
          {console.log(GetRoleList)}
          {["lg", "md"].includes(screenSize) && (
            <li className="nav-item savetheme">
              <div type="button" className=" headerboxsize">
                <ReactSelectHead
                  placeholderName="Select Role"
                  dynamicOptions={GetRoleList?.map((ele) => {
                    return {
                      label: ele?.roleName,
                      value: ele?.roleID,
                    };
                  })}
                  searchable={true}
                  respclass="col-12 roll-off"
                  // value={Number(localData?.defaultRole)}
                  value={Number(roll?.rollName)}
                  handleChange={handleChangeRole}
                  //  respclass="roll-off"
                  plcN="center"
                />
              </div>
            </li>
          )}

          <li className="nav-item d-md-none">
            <div type="button">
              {/* <i className="fa fa-ellipsis-v" aria-hidden="true"></i> */}
              <SubMenuDropdown />
            </div>
          </li>
          <li className="nav-item position-relative d-none d-md-flex px-1">
            <Themedropdown />
          </li>
          {/* <li className="nav-item">
          <OverLay />
          </li> */}
          {/* <li className="nav-item">
            <button type="button" className="nav-link">
              <i className="fa fa-solid fa-star"></i>
            </button>
          </li> */}
          <li className="nav-item d-none d-md-flex px-1">
            <div type="button">
              <i
                className="fa fa-home text-white"
                aria-hidden="true"
                onClick={() => navigate("/dashboard")}
              ></i>
            </div>
          </li>
          <li className="nav-item d-none d-md-flex px-1">
            <NotificationsDropdown />
          </li>

          <li className="nav-item d-none d-md-flex pr-2 ">
            <div>
              {/* <OverLay /> */}
              <OverlayDropdown />
            </div>
          </li>
          <li className="nav-item d-none d-md-flex px-2">
            <div onClick={toggleFullScreen}>
              <i className="fa fa-arrows-alt text-white" aria-hidden="true"></i>
            </div>
          </li>

          <li className="nav-item d-none d-md-flex">
            <button type="button" className="nav-link">
              <SpeechToTextWithSpeechOutput />
              {/* <i className="fas fa-solid fa-microphone"></i> */}
            </button>
          </li>

          <li className="nav-item d-none d-md-flex ">
            <LanguagesDropdown />
          </li>

          <li className="nav-item d-none d-md-flex">
            <button type="button" className="nav-link d-flex">
              <UserDropdown
                setDropdownOpen={setDropdownOpen}
                dropdownOpen={dropdownOpen}
              />
              <label className="control-label ml-1 d-none d-lg-block text-white">
                {localData?.empName}
              </label>
            </button>
          </li>
          {/* <li className="nav-item">
          <button
            type="button"
            className="nav-link"
            onClick={handleToggleControlSidebar}
          >
            <i className="fas fa-th-large" />
          </button>
        </li> */}
          <li className="nav-item d-none d-md-flex">
            <button type="button" className="nav-link" onClick={logOut}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </li>
        </ul>
      </nav>
      {/* <Header1 /> */}
    </>
  );
});

export default Header;
