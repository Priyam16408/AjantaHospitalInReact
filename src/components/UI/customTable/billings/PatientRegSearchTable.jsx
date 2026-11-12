import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../Heading";
import Tables from "..";
import PatientDetailCard from "../../../commonComponents/PatientDetailCard";
import { BindFrameMenuByRoleID } from "../../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";

import SlideScreen from "../../../front-office/SlideScreen";

import SeeMoreSlideScreen from "../../SeeMoreSlideScreen";
import ReportCard from "../../../commonComponents/ReportCard";

const PatientRegSearchTable = (props) => {
  const isMobile = window.innerWidth <= 768;
  const { THEAD, tbody, handleSubmit, values } = props;
  const [t] = useTranslation();
  const [visible, setVisible] = useState(false);
  const [seeMore, setSeeMore] = useState([]);
  const dispatch = useDispatch();
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  // console.log(renderComponent);
  
  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        BindFrameMenuByRoleID({
          frameName: "IPD",
        })
      );
    };
    fetchData();
  }, [dispatch]);

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };

  const getRowClass = (val) => {
    let newtbody = tbody?.find((item) => item?.patientID === val?.patientID);
    if (newtbody?.isPatientReceived === "0") {
      return "color-indicator-2-bg";
    } else if (
      newtbody?.creditPanelLimitOver === "1" &&
      newtbody?.isCreditPanelApproval === "1"
    ) {
      return "color-indicator-7-bg";
    } 
    else if (newtbody?.amtpaid === "1") {
      return "color-indicator-3-bg";
    }
    else if (newtbody?.mlc === "1") {
      return "color-indicator-23-bg";
    } 
     else if (newtbody?.amtpaid === "0") {
      return "color-indicator-1-bg";
    } else {
      return "color-indicator-10-bg";
    }
  };

  // };

   console.log(tbody,"item")
  return (
    <>
      {tbody?.length > 0 && (
        <>
        
          <Tables
            thead={THEAD}
            tbody={tbody?.map((item, index) => ({
              actions: (
                <PatientDetailCard
                  ModalComponent={ModalComponent}
                  setSeeMore={setSeeMore}
                  data={item}
                  handleSubmit={handleSubmit}
                />
              ),
              ReportType: (
                <ReportCard
                  ModalComponent={ModalComponent}
                  setSeeMore={setSeeMore}
                  data={item}
                  handleSubmit={handleSubmit}
                />
              ),
              admitDate: item?.admitDate,
              dischargeDate: item?.dischargeDate,
              ipdno: item?.ipdno,
              pName: item?.pName,
              patientID: item?.patientID,
              ageSex: item?.ageSex,
              mobile: item?.mobile,
              dName: item?.dName,
              company_Name: item?.company_Name,
              rName: item?.roomName,
              relation: item?.relation,
              admittedBy: item?.admittedBy,
            }))}
            tableHeight={"scrollView"}
            style={!isMobile ? { height: "44vh" } : {}}
            getRowClass={getRowClass}
            isSearch={true}
          />
        </>
      )}
      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
          setRenderComponent({
            name: null,
            component: null,
          });
        }}
        Header={
          <SeeMoreSlideScreen
            name={t(renderComponent?.name)}
            seeMore={seeMore}
            handleChangeComponent={handleChangeComponent}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
    </>
  );
};

export default PatientRegSearchTable;
