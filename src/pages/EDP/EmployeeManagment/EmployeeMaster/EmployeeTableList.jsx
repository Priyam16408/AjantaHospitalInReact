import React, { useEffect } from "react";
import Tables from "../../../../components/UI/customTable";
import SlideScreen from "../../../../components/front-office/SlideScreen";
import SeeMoreSlideScreen from "../../../../components/UI/SeeMoreSlideScreen";

import { useState } from "react";
import { BindFrameMenuByRoleID } from "../../../../store/reducers/common/CommonExportFunction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import EDPSeeMoreList from "../../EDPSeeMoreList";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { EDPGetEmployee } from "../../../../networkServices/EDP/edpApi";
const EmployeeTableList = ({ tableData, setTableData, list }) => {
  console.log("TableData", tableData);
  //
  const [t] = useTranslation();
  const THEAD = [
    { name: t("Select"), width: "2%" },
    { name: t("S.No."), width: "1%" },
    { name: t("Employee Name"), width: "10%" },
    { name: t("Address"), width: "10%" },
    { name: t("Contact"), width: "10%" },
    { name: t("Active"), width: "5%" },
  ];
  const [visible, setVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: null,
    component: null,
  });
  const dispatch = useDispatch();
  const [seeMore, setSeeMore] = useState([]);
  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };
  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  // const GetEmpyInfo = async () => {
  //   const data = await EDPGetEmployee(tableData[0]?.);
  // };

  const { BindFrameMenuByRoleIDS } = useSelector((state) => state?.CommonSlice);
  useEffect(() => {
    dispatch(BindFrameMenuByRoleID({ frameName: "EDP-EMPLOYEE" }));
  }, []);

  return (
    <>
      <div>
        <Tables
          thead={THEAD}
          tbody={tableData.map((ele, index) => ({
            Select: (
              <>
                {console.log("ele from empTable", ele)}
                <EDPSeeMoreList
                  ModalComponent={ModalComponent}
                  setSeeMore={setSeeMore}
                  data={{ ...ele, list: list }}
                  setVisible={() => {
                    // EmergencyPatientSearch()
                    setVisible(false);
                  }}
                  handleBindFrameMenu={BindFrameMenuByRoleIDS}
                  isShowPatient={true}
                />
              </>
            ),
            Sno: index + 1,
            EmployeeName: ele?.NAME,
            Address: ele?.House_No,
            Contact: ele?.Mobile,
            Active: ele?.Active,
          }))}
          style={{ minHeight: "10vw", maxHeight: "68vw" }}
        />
      </div>

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
            name={renderComponent?.name}
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

export default EmployeeTableList;
