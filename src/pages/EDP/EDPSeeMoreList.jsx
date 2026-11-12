import React, { Suspense, useCallback, useEffect } from "react";
import SeeMoreSlideScreen from "../../components/UI/SeeMoreSlideScreen";

// import RoleManagerPrivledge from "./RoleManagment/RoleManagerPrivledge";
// import CentreManagement from "./CentreManagement/Index.jsx";
// import ActivateDeactivate from "./EmployeeManagment/ActiveDeactivateEmployee/ActivateDeactivate";
function 
EDPSeeMoreList({ ModalComponent, setSeeMore, data, isShowPatient, handleBindFrameMenu, setVisible, openFirstItem, name, isRemoveSvg, minWidth }) {

  const componentMap = {

    CopyRate: () => import ("./RateManagement/CopyRates.jsx"),
    EditDoctor: () => import ("../EDP/DoctorManagement/DoctorReg.jsx"),
    Specialization: () => import ("../EDP/DoctorManagement/Specialization.jsx"),
    Department: () => import ("../EDP/DoctorManagement/Department.jsx"),
    ReferDoctorMaster: () => import ("./DoctorManagement/ReferDoctorMaster.jsx"),
    OPDVisitConfiguration: () => import ("./DoctorManagement/OPDVisitConfiguration.jsx"),
    PanelDocumentMaster: () => import ("./panelManagement/PanelDocumentMaster.jsx"),
    // CentreManagement: () => import('./CentreManagement/Index.jsx'),
    CreatePanel: () => import("./panelManagement/CreatePanel.jsx"),
    CreateLab: () => import('./LaboratoryManagement/CreateLab.jsx'),
    DoctorReg: () => import('./DoctorManagement/DoctorReg.jsx'),
    RoleManagerPrivledge: () => import('./RoleManagment/RoleManagerPrivledge.jsx'),
    EmployeeMaster: () => import('./EmployeeManagment/EmployeeMaster/EmployeeMaster.jsx'),
    PanelMaster: () => import('./panelManagement/PanelMaster'),
    ItemMaster: () => import('./ItemManagment/ItemMaster.jsx'),
    CommonMasterForm: () => import('./EmployeeManagment/CommonMasterForm/CommonMasterForm.jsx'),
    ActivateDeactivate: () => import('./EmployeeManagment/ActiveDeactivateEmployee/ActivateDeactivate.jsx'),
    ThresholdMaster: () => import('./BasicMaster/ThresholdMaster.jsx'),
    ProMaster: () => import('./BasicMaster/ProMaster.jsx'),
    CategoryMaster: () => import('./ItemManagment/CategoryMaster.jsx'),
    SubCategoryMaster: () => import('./ItemManagment/SubCategoryMaster.jsx'),
    DisplayNameMaster: () => import('./DisplayMaster/DisplayNameMaster.jsx'),
    IPDpkgMasterMain: () => import('./PackageManagment/IPDpkgMasterMain.jsx'),
    OPDpkgMasterMain: () => import('./PackageManagment/OPDpkgMasterMain.jsx'),
    SurgeryGroupingMaster: () => import('./SurgeryManagement/SurgeryGroupingMaster.jsx'),
    NewSurgeryType: () => import('./SurgeryManagement/NewSurgeryType.jsx'),
    SurgeryMaster: () => import('./SurgeryManagement/SurgeryMaster.jsx'),
    MapInvestigationObservationNew: () => import('./LaboratoryManagement/MapInvestigationObservationNew.jsx'),
    ObservationType: () => import('./LaboratoryManagement/ObservationType.jsx'),
    FormulaMaster: () => import('./LaboratoryManagement/FormulaMaster.jsx'),
    InvTemplate: () => import('./LaboratoryManagement/InvTemplate.jsx'),
    AddInterpretation: () => import('./LaboratoryManagement/AddInterpretation.jsx'),
    LabobservationHelp: () => import('./LaboratoryManagement/LabobservationHelp.jsx'),
    InvestigationSequence: () => import('./LaboratoryManagement/InvestigationSequence.jsx'),
    LabObservationComments: () => import('./LaboratoryManagement/LabObservationComments.jsx'),
    ManageApproval: () => import('./LaboratoryManagement/ManageApproval.jsx'),
    SampleTypeMaster: () => import('./LaboratoryManagement/SampleTypeMaster.jsx'),
    CreateItemMaster: () => import('./ItemManagment/CreateItemMaster.jsx'),
  };

  const importComponent = (path, header) => {
    
    if (header) {
      const loader = componentMap[path];
      if (!loader) {
        return React.lazy(() => Promise.resolve({ default: () => <div>Component not found: {path}</div> }));
      }
      return React.lazy(() =>
        loader()
          .then((module) => ({ default: module.default }))
          .catch(() => ({ default: () => <div>Component not found: {path}</div> }))
      );
      // return React.lazy(() =>
      //   import(path)
      //     .then((module) => ({ default: module.default }))
      //     .catch(() => ({ default: () => <div>Component not found: {path}</div> }))
      // );
    } else {
      return React.lazy(() =>
        import(`./FrameMenu/${path}.jsx`)
          .then((module) => ({ default: module.default }))
          .catch(() => ({ default: () => <div>Component not found: {path}</div> }))
      );
    }
  };
  function BillingSeeMoreList(handleBindFrameMenu, data) {
    let seeMore = [];
    for (let i = 0; i < handleBindFrameMenu?.length; i++) {
      const { URL, FileName, header,breadcrumb,FrameMenuID,vIsFrameMenu } = handleBindFrameMenu[i];
      const Component = importComponent(URL, header);
      const Obj = {
        name: FileName,
        component: (
          <div key={i}>
            <Suspense fallback={<div>Loading...</div>}>
              {/* <CenterDetails data={data} /> */}

              <Component data={{...data,breadcrumb:breadcrumb,FrameMenuID:FrameMenuID,vIsFrameMenu:vIsFrameMenu}} setActionType={() => { }} menuItemData={{ id: "1" }} toggleAction={() => { }} setVisible={setVisible} />
            </Suspense>
          </div>
        ),
      };
      seeMore.push(Obj);
    }
    return seeMore;
  }
  const handleComponentRender = async (data, items) => {
    const componentData = BillingSeeMoreList([items], data);
    ModalComponent(componentData[0]?.name, componentData[0]?.component);
    const forsetSeeMore = BillingSeeMoreList(handleBindFrameMenu, data);
    setSeeMore(forsetSeeMore);
  };



  const handleBindFrameMenuByRoleIDS = useCallback(
    (dataBind) => {
      return dataBind?.map((items, _) => {
        return {
          ...items,
          name: items?.FileName,
        };
      });
    },
    [handleBindFrameMenu]
  );

  return (
    <>
      <div style={{ position: "relative", }}>
        <SeeMoreSlideScreen
          seeMore={handleBindFrameMenuByRoleIDS(handleBindFrameMenu)}
          handleChangeComponent={(item) => handleComponentRender(data, item)}
          data={data}
          openFirstItem={openFirstItem}
          name={name}
          isRemoveSvg={isRemoveSvg}
          minWidth={minWidth}
        />
      </div>
    </>
  );
}

export default EDPSeeMoreList;
