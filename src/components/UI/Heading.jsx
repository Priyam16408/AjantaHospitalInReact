import React, { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { PageIconSVG } from "../SvgIcons";
import { GetSubScreenMenuByRole } from "../../networkServices/EDP/edpApi";
import { useSelector } from "react-redux";
import EDPSeeMoreList from "../../pages/EDP/EDPSeeMoreList";
import SlideScreen from "../front-office/SlideScreen";
import SeeMoreSlideScreen from "./SeeMoreSlideScreen";
import { BindFrameMenuByRoleID } from "../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";

function Heading({ title, onClick, secondTitle, isBreadcrumb, ReactSelectPageWise, ReactSelectPageWise1, removeSecondHeadAlignClass, isSlideScreen, frameName,data }) {
  const location = useLocation();

  const { GetMenuList } = useSelector((state) => state?.CommonSlice);

  const findChildByUrl = (menuArray, url) => {
    for (let menu of menuArray) {
      for (let child of menu.children) {
        if (child.url === url) {
          return child;
        }
      }
    }
    return null;
  };

  const [list, setList] = useState([])
  const bindGetSubScreenMenuByRole = async (result, vIsFrameMenu) => {
    let apiResp = await GetSubScreenMenuByRole(result?.subMenuID, vIsFrameMenu ? vIsFrameMenu : 0)
    if (apiResp?.success) {
      setList(apiResp?.data)
    } else {
      setList([])
    }
  }

  useEffect(() => {
    const result = findChildByUrl(GetMenuList, location?.pathname);
    if (result?.isShowSubMenu === 1) {
      // debugger
      bindGetSubScreenMenuByRole(data?.FrameMenuID ? { subMenuID: data?.FrameMenuID } : result, (data === undefined || data?.vIsFrameMenu === 0) ? 0 : 1)
    }
  }, [data?.FrameMenuID, GetMenuList?.length])


  const [visible, setVisible] = useState(false);
  const [seeMore, setSeeMore] = useState([]);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
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
  const dispatch = useDispatch()
  return (
    <>
      <div className="card card_background">
        <div className="card-header" onClick={onClick}>
          <h4 className="card-title w-100 d-md-flex align-items-center justify-content-between">

            {isBreadcrumb ? (
              <Breadcrumb path={isSlideScreen ? title : ""} />
            ) : (
              <>
                <div className=""><label className="text-nowrap m-0"> {title} </label> </div>
              </>
            )}




            {secondTitle &&
              <div className={`mr-3 d-flex color-code-search-resp align-items-center  justify-content-start ${!removeSecondHeadAlignClass && "justify-content-md-end"} overflow-auto w-md-50  w-100`}>{ReactSelectPageWise &&
                {/* <div className=" mr-3 w" style={{width:"1%"}}>{ReactSelectPageWise}</div> */ }

              }
                {secondTitle}
              </div>}
            {(list?.length > 0 && isBreadcrumb) &&
              <div className="mr-3">
                <EDPSeeMoreList
                  ModalComponent={ModalComponent}
                  setSeeMore={setSeeMore}
                  data={{}}
                  // isRemoveSvg={true}
                  minWidth="150px"

                  setVisible={() => { setVisible(false) }}
                  handleBindFrameMenu={list?.map((val) => ({
                    "FileName": val?.ChildrenName,
                    "header": true, // TO open any url file compoenent
                    "URL": val?.Url,
                    "breadcrumb": val?.breadcrumb,
                    FrameMenuID: val?.SubScreenFileMasterID,
                    vIsFrameMenu: 0


                  }))}
                />
              </div>
            }

          </h4>
        </div>

      </div>
      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
          frameName ? dispatch(BindFrameMenuByRoleID({ frameName: frameName })) : "";
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
}

export default Heading;
