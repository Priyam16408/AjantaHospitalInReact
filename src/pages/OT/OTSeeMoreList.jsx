import React, { Suspense, useCallback, useEffect } from "react";
import SeeMoreSlideScreen from "../../components/UI/SeeMoreSlideScreen";
import CentreDetails from "./OTPatientSearch/CentreDetails.jsx";
import Accordion from "../../components/UI/Accordion.jsx";
import { useTranslation } from "react-i18next";
// import CreateOTTAT from "./OTPatientSearch/FrameMenu/CreateOTTAT.jsx";
function EDPSeeMoreList({
  ModalComponent,
  setSeeMore,
  data,
  isShowPatient,
  handleBindFrameMenu,
  setVisible,
  openFirstItem,
  name,
  isRemoveSvg,
  minWidth,
}) {

  const componentMap = {
    
    CreateOTTAT: () => import("./OTPatientSearch/FrameMenu/CreateOTTAT.jsx"),
    CountSheet: () => import("./OTPatientSearch/FrameMenu/CountSheet.jsx"),
    FlowSheet: () => import("./OTPatientSearch/FrameMenu/FlowSheet.jsx"),
    PostAnesthesiaOrders: () =>
      import("./OTPatientSearch/FrameMenu/PostAnesthesiaOrders.jsx"),
    UploadOtImages: () =>
      import("./OTPatientSearch/FrameMenu/UploadOtImages.jsx"),
    OtNotes: () => import("./OTPatientSearch/FrameMenu/OtNotes.jsx"),
    OtProcedureTemplate: () =>
      import("./OTPatientSearch/FrameMenu/OtProcedureTemplate.jsx"),
    AnesthesiaNotes: () =>
      import("./OTPatientSearch/FrameMenu/AnesthesiaNotes.jsx"),
    OTtatAnalysis: () =>
      import("./OTPatientSearch/FrameMenu/OTtatAnalysis.jsx"),
    SurgerySafetyCheckList: () =>
      import("./OTPatientSearch/FrameMenu/SurgerySafetyCheckList.jsx"),
  };

  const [t] = useTranslation();

  const importComponent = (path, header) => {
    if (header) {
      const loader = componentMap[path];
      if (!loader) {
        return React.lazy(() =>
          Promise.resolve({
            default: () => <div>Component not found: {path}</div>,
          })
        );
      }
      return React.lazy(() =>
        loader()
          .then((module) => ({ default: module.default }))
          .catch(() => ({
            default: () => <div>Component not found: {path}</div>,
          }))
      );
    }
    // else {
    //   return React.lazy(() =>
    //     import(`./FrameMenu/${path}.jsx`)
    //       .then((module) => ({ default: module.default }))
    //       .catch(() => ({ default: () => <div>Component not found: {path}</div> }))
    //   );
    // }
  };
  function BillingSeeMoreList(handleBindFrameMenu, data) {
    let seeMore = [];
    for (let i = 0; i < handleBindFrameMenu?.length; i++) {
      const { URL, FileName, header, breadcrumb, FrameMenuID, vIsFrameMenu } =
        handleBindFrameMenu[i];
      const Component = importComponent(URL, header);
      const Obj = {
        name: FileName,
        component: (
          <div key={i}>
            <Suspense fallback={<div>Loading...</div>}>
              <Accordion
                title={t("Patient Details")}
                isBreadcrumb={false}
                defaultValue={true}
              >
                <CentreDetails data={data} />
              </Accordion>

              <Component
                data={{
                  ...data,
                  breadcrumb: breadcrumb,
                  FrameMenuID: FrameMenuID,
                  vIsFrameMenu: vIsFrameMenu,
                }}
                setActionType={() => {}}
                menuItemData={{ id: "1" }}
                toggleAction={() => {}}
                setVisible={setVisible}
              />
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
      <div style={{ position: "relative" }}>
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
