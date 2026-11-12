import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import { addWindowClass, removeWindowClass } from "@app/utils/helpers";
import Header from "@app/layouts/header/Header";
import MenuSidebar from "@app/layouts/menu-sidebar/MenuSidebar";
import Footer from "@app/layouts/footer/Footer";
import ChatEmploye from "@app/layouts/ChatEmploye";
// import ChatbotUI from "../chatGpt/ChatbotUI";

const Index = (props) => {
  const dispatch = useDispatch();
  const menuSidebarCollapsed = useSelector(
    (state) => state.ui.menuSidebarCollapsed
  );
  const controlSidebarCollapsed = useSelector(
    (state) => state.ui.controlSidebarCollapsed
  );
  const screenSize = useSelector((state) => state.ui.screenSize);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  useEffect(() => {
    removeWindowClass("register-page");
    removeWindowClass("login-page");
    removeWindowClass("hold-transition");
    // addWindowClass("sidebar-mini");
    // return () => {
    //   removeWindowClass("sidebar-mini");
    // };
  }, []);

  useEffect(() => {
    removeWindowClass("sidebar-closed");
    removeWindowClass("sidebar-collapse");
    removeWindowClass("sidebar-open");
    if (menuSidebarCollapsed && screenSize === "lg") {
      addWindowClass("sidebar-collapse");
    } else if (menuSidebarCollapsed && screenSize === "xs") {
      addWindowClass("sidebar-open");
    } else if (menuSidebarCollapsed && screenSize === "sm") {
      addWindowClass("sidebar-open");
    } else if (!menuSidebarCollapsed && screenSize !== "lg") {
      addWindowClass("sidebar-closed");
      addWindowClass("sidebar-collapse");
    }
  }, [screenSize, menuSidebarCollapsed]);

  useEffect(() => {
    if (controlSidebarCollapsed) {
      removeWindowClass("control-sidebar-slide-open");
    } else {
      addWindowClass("control-sidebar-slide-open");
    }
  }, [screenSize, controlSidebarCollapsed]);

  const getAppTemplate = useCallback(() => {
    return (
      <>
        <div id="main-header">
          <div className="header-fixed">
            <Header />
          </div>

          <MenuSidebar />

          {/* <Breadcrumb path={location?.pathname}/> */}
        </div>

        <div className="p-1 content-wrapper" id="page-data">
          {props.children}
        </div>
        {/* <ChatEmploye /> */}
        {/* <ChatbotUI /> */}
        <Footer />

        {/* <ControlSidebar /> */}
        <div
          id="sidebar-overlay"
          role="presentation"
          onClick={handleToggleMenuSidebar}
          onKeyDown={() => {}}
        />
      </>
    );
  }, [props.children]);

  return <div className="wrapper">{getAppTemplate()}</div>;
};

export default Index;
