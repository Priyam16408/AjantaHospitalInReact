import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import EDPSeeMoreList from "../EDPSeeMoreList";
import SlideScreen from "../../../components/front-office/SlideScreen";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";
import { EDPGetRole } from "../../../networkServices/EDP/govindedp";
import { reactSelectOptionList } from "../../../utils/utils";
import { BindFrameMenuByRoleID } from "../../../store/reducers/common/CommonExportFunction";
import { useSelector, useDispatch } from "react-redux";

const RoleManagerPrivledge = ({ data }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const initialValues = {};
  const [seeMore, setSeeMore] = useState([]);
  const [dropDownState, setDropDownState] = useState({
    Priviledge: [],
  });

  const [visible, setVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: null,
    component: null,
  });

  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };
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

  const PrivledgeResponse = async () => {
    const response = await EDPGetRole();
    const priviledge = reactSelectOptionList(response, "RoleName", "ID");
    setDropDownState({
      ...dropDownState,
      Priviledge: priviledge,
    });
  };

  const { BindFrameMenuByRoleIDS } = useSelector((state) => state?.CommonSlice);
  useEffect(() => {
    dispatch(BindFrameMenuByRoleID({ frameName: "EDP-ROLE" }));
  }, []);

  useEffect(() => {
    PrivledgeResponse();
  }, []);
  
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        frameName="EDP-ROLE"
        isBreadcrumb={true}
        secondTitle={
          <EDPSeeMoreList
            ModalComponent={ModalComponent}
            setSeeMore={setSeeMore}
            data={{ GenerateMenu: dropDownState?.Priviledge }}
            isRemoveSvg={true}
            setVisible={() => {
              setVisible(false);
            }}
            handleBindFrameMenu={[
              {
                FileName: "Add Centre",
                URL: "AddUpdateRole",
                FrameName: "EDP-Role",
                Description: "Add Role",
              },
            ]}
            openFirstItem={false}
            name={
              <button className="btn text-white"> {t("Create Role")} </button>
            }
          />
        }
      />
      <div className="row px-2 pt-2">
        <ReactSelect
          placeholderName={t("Priviledge")}
          name="Priviledge"
          value={values?.Priviledge?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Priviledge}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <EDPSeeMoreList
          ModalComponent={ModalComponent}
          setSeeMore={setSeeMore}
          data={{ ...values, GenerateMenu: dropDownState?.Priviledge }}
          setVisible={() => {
            setVisible(false);

          }}
          handleBindFrameMenu={BindFrameMenuByRoleIDS}
          openFirstItem={true}
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
      // bindFrameName="EDP-CENTRE"
      >
        {renderComponent?.component}
      </SlideScreen>
    </div>
  );
};

export default RoleManagerPrivledge;
