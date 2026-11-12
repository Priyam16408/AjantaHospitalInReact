import React, { useEffect, useState } from "react";
import SubmenuComponent from "./SubmenuComponent";
import Themedropdown from "@app/layouts/header/Theme-dropdown";
import { toggleFullScreen } from "../../../utils/helpers";
import LanguagesDropdown from "@app/layouts/header/languages-dropdown/LanguagesDropdown";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/utils";
import UserDropdown from "../user-dropdown/UserDropdown";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { SplitButton } from "primereact/splitbutton";
import SlotModal from "../../../components/modalComponent/Utils/SlotModal";
import Modal from "../../../components/modalComponent/Modal";
import ForgetPasswordForm from "../../../components/ResponsiveHeaderIcon/ForgetPasswordForm";
import ViewProfile from "../../../components/ResponsiveHeaderIcon/ViewProfile";
import ChangePasswordModel from "../../../components/modalComponent/Utils/ChangePasswordModel";
import { updatePassword } from "../../../networkServices/HeaderApi";
import { useTranslation } from "react-i18next";
const SubMenuDropdown = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const localData = useLocalStorage("userData", "get"); // get Data from localStorage
  const [modalData, setModalData] = useState({
    isShow: false,
    headerName: "",
    component: ""
  });
  const [t]=useTranslation()
  const navigate = useNavigate();
  const toggleSidebar = () => {
    console.log("sadas");
    setIsSidebarOpen((prev) => !isSidebarOpen);
  };
  const [handleModelData, setHandleModelData] = useState({})
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
    notify("Sucessfully logout", "success");
  };

  const updatePasswordApi = async (password) => {
    const apiResponse = await updatePassword(password)
    if (apiResponse?.success) {
      notify(apiResponse?.message, "success")
      setIsOpen()
    } else {
      notify(apiResponse?.message, "error")
    }
    if (apiResponse?.status === 400 && Object.keys(apiResponse?.data?.errors)?.length > 0) {
      let errormessage = apiResponse?.data?.errors?.ConfirmPassword?.length > 0 && apiResponse?.data?.errors?.ConfirmPassword[0];
      apiResponse?.data?.errors?.Password?.length > 0 ? errormessage = apiResponse?.data?.errors?.Password[0] : "";
      apiResponse?.data?.errors?.OldPassword?.length > 0 ? errormessage = apiResponse?.data?.errors?.OldPassword[0] : "";
      notify(errormessage, "error")
    }
  }

  const handleOpenModal = (itemName, headerName, component) => {
    setHandleModelData({
      label: t('header.user.change_password'),
      width: "60vw",
      isOpen: true,
      Component: component,
      handleInsertAPI: updatePasswordApi,
      buttonName: "Update Password"
    });
    // setModalData((prev) => ({ ...prev, isShow: true, headerName: headerName, component: component }));
  };
  const handleClodeModal = () => {
    setModalData((prev) => ({ ...prev, isShow: false }));
  };

  const handleChangeModel = (data) => {
    setModalData(data);
  };
 
  const items = [
    {
      label: localData?.empName,
      icon: <img src={`${localData?.employeePhoto}`} alt="Option 1" style={{ width: '16px', height: '16px' }} />,
      command: () => { }, // Empty command for "Home" if you don't need any specific action
    },
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {navigate("/dashboard");}, // Empty command for "Home" if you don't need any specific action
    },

    {
      label: "Notifications",
      icon: "pi pi-bell",
      command: () => { }, // Empty command for "Notifications" if you don't need any specific action
    },
    // {
    //   label: "Change Password",
    //   icon: "pi pi-pencil",
    //   command: () => { handleOpenModal("password", "Update Password", <ChangePasswordModel handleChangeModel={handleChangeModel}/>) },
    // },
    // {
    //   label: "View Profile",
    //   icon: "pi pi-verified",
    //   command: () => { handleOpenModal("ViewProfile", "View Profile", <ViewProfile />) },
    // },
    {
      label: "Full screen",
      icon: "pi pi-arrows-alt",
      command: toggleFullScreen,
    },
    {
      label: "Profile Edit",
      icon: "pi pi-pen-to-square",
      command:  ()=>{ setDropdownOpen(true)},
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: logOut,
    },
  ];

  const [localImag,setLocalImage]=useState()
  useEffect(()=>{
    setLocalImage(localData?.employeePhoto)
  },[])
  // console.log("Ssss",localImag)
  return (
    <div>
      <UserDropdown setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} isMobile={true} setLocalImage={setLocalImage}/>
      <div className="mobileResp">
        {/* <span
        className="pi pi-cog"
        onClick={toggleSidebar}
        style={{color:"#fff" , fontSize:"2.5rem", position:"relative", zIndex:"10"}}
      ></span> */}
        {/* <span className="pi pi-home"  style={{color:"#fff" , fontSize:"2.5rem" }}></span> */}
        {/* <span className="pi pi-arrows-alt"  style={{color:"#fff" , fontSize:"2.5rem" }}></span> */}

        <div type="button">
          <Themedropdown />
        </div>
        <div type="button">
          <LanguagesDropdown />
        </div>

        <SplitButton  model={items}
          dropdownIcon={<img src={`${localImag}`} alt="dropdown icon"  className="mobileViewUserIcon" onClick={()=>{setDropdownOpen(false)}}/>}

        />
        {/* <span className="pi pi-user"  style={{color:"#fff" , fontSize:"2.5rem" }}></span> */}
        {/* <span className="pi pi-bell"  style={{color:"#fff" , fontSize:"2.5rem" }}></span> */}
        {/* <label className="control-label text-white ml-4" onClick={logOut}>Logout</label> */}
      </div>

      <SubmenuComponent isOpen={isSidebarOpen} onClose={toggleSidebar}>
        <ul className="navbar-nav d-block sidebarmobile">
          <li className="nav-item">
            <button type="button" className="nav-link ">
              <i className="fa fa-solid fa-star  text-white"></i>
              <label className="control-label text-white ml-4" onClick={logOut}>
                Logout
              </label>
            </button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-link">
              <i className="fa fa-home text-white" aria-hidden="true"></i>
              <label className="control-label text-white ml-4">Home</label>
            </button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-link ">
              <i className="fa fa-bell text-white" aria-hidden="true"></i>
              <label className="control-label text-white ml-4">
                Notifications
              </label>
            </button>
          </li>

          <li className="nav-item ">
            <button type="button" className="nav-link p-0 possition-relative">
              {/* <i className="fa fa-solid fa-user text-white"></i> */}
              <UserDropdown />
              <label className="control-label text-white ml-4 user_label">
                {localData?.empName}
              </label>
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-link"
              onClick={toggleFullScreen}
            >
              <i className="fa fa-arrows-alt text-white" aria-hidden="true"></i>{" "}
              <label className="control-label text-white ml-4">
                FullScreen
              </label>
            </button>
          </li>
          {/* <li className="nav-item">
            <button type="button" className="nav-link" onClick={logOut}>
              <i className="fas fa-sign-out-alt text-white"></i>
              <label className="control-label text-white ml-4">Logout</label>
            </button>
          </li> */}
          <li className="nav-item">
            <button
              type="button"
              className="nav-link d-flex justify-content-space-between p-0"
            >
              <LanguagesDropdown />
              <label className="control-label text-white">Languages</label>
            </button>
          </li>

          {/* <li className="nav-item theme_dropdown">
            <Themedropdown />
            <label className="control-label text-white">Languages</label>
          </li> */}
        </ul>
      </SubmenuComponent>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          buttonName={handleModelData?.buttonName}
          // buttons={handleModelData?.extrabutton}
          modalData={modalData}
          setModalData={setModalData}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      {/* {modalData.isShow && (
        <Modal
          visible={modalData}
          setVisible={setModalData}
          modalWidth="95vw"
          Header={modalData.headerName}
          footer={
            <>
              <div>
                <button className="modalConfirmButton">Update</button>
                <button className="modalCancelButton" onClick={handleClodeModal}>Cancel</button>
              </div>
            </>
          }
        >
          <div>
            {modalData.component}
          </div>
        </Modal>
      )} */}
    </div>
  );
};

export default SubMenuDropdown;
