import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  EDPanelMaster,
  handleSubCategoryRateListAPI,
  SaveEDPSetRateAPI,
  ServicesRateSetupBindFromCentreIPD,
  ServicesRateSetupBindFromCentreOPD,
  ServicesRateSetupBindToCentreIPD,
  ServicesRateSetupBindToCentreOPD,
  ServicesRateSetupCopyFromIPD,
  ServicesRateSetupCopyFromOPD,
  ServicesRateSetupCopyToIPD,
  ServicesRateSetupCopyToOPD,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";
import Input from "../../../components/formComponent/Input";
import { SaveEDPSetRatePayload } from "../../../utils/ustil2";
import EDPSeeMoreList from "../EDPSeeMoreList";
import SlideScreen from "../../../components/front-office/SlideScreen";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";

export default function CopyRates({ data }) {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    type: { value: "OPD" },
    Panel: { value: "1" },
  });
  const [seeMore, setSeeMore] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });
  const [visible, setVisible] = useState(false);

  const [list, setList] = useState({
    panelList: [],
    copyCentre: [],
    copyFrom: [],
  });
  const isMobile = window.innerWidth <= 800;

  const handleChangeHead = (e) => {
    let data = [...bodyData]?.map((val) => {
      val.isChecked = e.target.checked;
      return val;
    });
    setBodyData(data);
  };

  const thead = [
    { name: t("Sub Category Name") },
    { name: t("Type"), width: "1%" },
    { name: t("IPD %"), width: "5%" },

    {
      width: "1%",
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          name="checkbox"
          style={{ marginLeft: "3px" }}
          onChange={(e) => {
            handleChangeHead(e);
          }}
        />
      ),
    },
  ];

  const getListDataAPI = async () => {
    try {
      Promise.all([
        EDPanelMaster(),
        // ServicesRateSetupCopyToIPD(),
        // ServicesRateSetupCopyToOPD(),
        // ServicesRateSetupCopyFromOPD(),
        // ServicesRateSetupCopyFromIPD(),
        // ServicesRateSetupBindFromCentreIPD(),
        // ServicesRateSetupBindFromCentreOPD(),
        // ServicesRateSetupBindToCentreOPD(),
        // ServicesRateSetupBindToCentreIPD(),
      ]).then(([panelList]) => {
        setList((val) => ({
          ...val,
          panelList: handleReactSelectDropDownOptions(
            panelList?.data,
            "Company_Name",
            "PanelID"
          ),
        }));
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const FromCentreOPD = async (panelID) => {
    try {
      let data = {};
      if (values?.type?.value === "OPD") {
        data = await ServicesRateSetupBindFromCentreOPD(panelID);
      } else {
        data = await ServicesRateSetupBindFromCentreIPD(panelID);
      }
      if (data?.success) {
        setList((val) => ({
          ...val,
          copyCentre: handleReactSelectDropDownOptions(
            data?.data,
            "CentreName",
            "CentreID"
          ),
        }));
      } else {
        setList((val) => ({ ...val, copyCentre: [] }));
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleSubCategoryRateList = async () => {
    let apiResp = await handleSubCategoryRateListAPI();
    if (apiResp?.success) {
      let data = apiResp?.data?.map((val) => {
        val.ipdType = { value: "+" };
        val.isChecked = false;
        return val;
      });
      setBodyData(data);
    } else {
      setBodyData([]);
    }
  };

  useEffect(() => {
    getListDataAPI();
    handleSubCategoryRateList();
  }, []);

  useEffect(() => {
    if (values?.Panel?.value) {
      FromCentreOPD(values?.Panel?.value);
    }
  }, [values?.type?.value]);

  const BindCopyFromList = async (PanelID, FromCentreID) => {
    try {
      let data = {};
      if (values?.type?.value === "OPD") {
        data = await ServicesRateSetupCopyFromOPD(PanelID, FromCentreID);
      } else {
        data = await ServicesRateSetupCopyFromIPD(PanelID, FromCentreID);
      }
      if (data?.success) {
        setList((val) => ({
          ...val,
          copyFrom: handleReactSelectDropDownOptions(
            data?.data,
            "NAME",
            "ScheduleChargeID"
          ),
        }));
      } else {
        setList((val) => ({ ...val, copyFrom: [] }));
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    if (values?.Panel?.value && values?.CopyFromCentre?.value) {
      BindCopyFromList(values?.Panel?.value, values?.CopyFromCentre?.value);
    }
  }, [
    values?.Panel?.value,
    values?.CopyFromCentre?.value,
    values?.type?.value,
  ]);

  const handleReactChange = async (name, e) => {
    if (name === "Panel") {
      await FromCentreOPD(e?.value);
      setValues((val) => ({ ...val, CopyToCentre: {}, CopyFromCentre: {} }));
    }
    if (name === "CopyFromCentre") {
      setValues((val) => ({
        ...val,
        CopyToCentre: {},
        CopyTo: {},
        CopyFrom: {},
      }));
    }
    setValues((val) => ({ ...val, [name]: e }));
  };

  const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
    if (type === "number") {
      if (!isNaN(value) && Number(value) <= max) {
        const data = JSON.parse(JSON.stringify(bodyData));
        data[index][name] = value;
        setBodyData(data);
      }
    } else if (value?.length <= max || typeof value === "object") {
      const data = JSON.parse(JSON.stringify(bodyData));
      data[index][name] = value;
      setBodyData(data);
    }
  };

  const SaveSetRate = async () => {
    if (!values?.CopyFromCentre?.value) {
      notify("Please Select Copy From Centre ", "error");
      return 0;
    } else if (!values?.CopyToCentre?.value) {
      notify("Please Select Copy To Centre ", "error");
      return 0;
    } else if (!values?.CopyFrom?.value) {
      notify("Please Select Copy From ", "error");
      return 0;
    } else if (!values?.CopyTo?.value) {
      notify("Please Select Copy To ", "error");
      return 0;
    }
    const payload = SaveEDPSetRatePayload(values, bodyData);
    let apiResp = await SaveEDPSetRateAPI(payload);
    if (apiResp?.success) {
      handleSubCategoryRateList();
      notify(apiResp?.message, "success");
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const handleChangeCheckbox = (e, index) => {
    let data = [...bodyData];
    data[index]["isChecked"] = e.target?.checked;
    setBodyData(data);
  };

  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  const handleChangeComponent = (e) => {
    ModalComponent(e?.label, e?.component);
  };

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
          secondTitle={
            <>
              <EDPSeeMoreList
                ModalComponent={ModalComponent}
                setSeeMore={setSeeMore}
                data={{}}
                isRemoveSvg={true}
                setVisible={() => {
                  setVisible(false);
                }}
                handleBindFrameMenu={[
                  {
                    FileName: "Copy Rates",
                    URL: "CopyRate",
                    FrameName: "Copy Rates",
                    Description: "Copy Rates",
                    header: true,
                  },
                ]}
                openFirstItem={false}
                name={
                  <button className="btn text-white">
                    {" "}
                    {t("Create Item")}{" "}
                  </button>
                }
              />
            </>
          }
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Type")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            fid={"type"}
            name={"type"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={[
              { label: "Create/Copy Rate for OPD", value: "OPD" },
              { label: "Create/Copy Rate for IPD", value: "IPD" },
            ]}
            value={values?.type?.value}
          />
          <ReactSelect
            placeholderName={t("Panel")}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"Panel"}
            name={"Panel"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={list?.panelList}
            value={values?.Panel?.value}
          />
          <ReactSelect
            placeholderName={t("Copy From Centre")}
            requiredClassName="required-fields"
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"CopyFromCentre"}
            name={"CopyFromCentre"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={list?.copyCentre}
            value={values?.CopyFromCentre?.value}
          />

          <ReactSelect
            placeholderName={t("Copy To Centre")}
            requiredClassName="required-fields"
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"CopyToCentre"}
            name={"CopyToCentre"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={list?.copyCentre?.filter(
              (i) => i?.value !== values?.CopyFromCentre?.value
            )}
            value={values?.CopyToCentre?.value}
          />

          <ReactSelect
            placeholderName={t("Copy From")}
            requiredClassName="required-fields"
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"CopyFrom"}
            name={"CopyFrom"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={list?.copyFrom}
            value={values?.CopyFrom?.value}
          />
          <ReactSelect
            placeholderName={t("Copy To")}
            requiredClassName="required-fields"
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id={"CopyTo"}
            name={"CopyTo"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e)}
            dynamicOptions={list?.copyFrom?.filter(
              (i) => i?.value !== values?.CopyFrom?.value
            )}
            value={values?.CopyTo?.value}
          />
        </div>

        <Heading title={t("Set Rates")} isBreadcrumb={false} />
        <Tables
          thead={thead}
          tbody={bodyData?.map((val, index) => ({
            NAME: val?.DisplayName,
            ipdType: (
              <>
                <CustomSelect
                  placeHolder={t("Type")}
                  requiredClassName="w-50"
                  name="ipdType"
                  onChange={(name, e) => {
                    handleCustomInput(index, "ipdType", e);
                  }}
                  isRemoveSearchable={true}
                  value={val?.ipdType?.value}
                  option={[
                    { label: "+", value: "+" },
                    { label: "-", value: "-" },
                  ]}
                />
              </>
            ),
            ipdPer: (
              <>
                <Input
                  type="text"
                  className="table-input"
                  respclass={"w-100"}
                  removeFormGroupClass={true}
                  display={"right"}
                  name={"ipdPer"}
                  value={val?.ipdPer ? val?.ipdPer : ""}
                  onChange={(e) => {
                    handleCustomInput(
                      index,
                      "ipdPer",
                      e.target.value,
                      "number",
                      100
                    );
                  }}
                />
              </>
            ),
            check: (
              <>
                <input
                  type="checkbox"
                  checked={val?.isChecked}
                  onChange={(e) => {
                    handleChangeCheckbox(e, index);
                  }}
                />
              </>
            ),
          }))}
          style={{ maxHeight: "54vh" }}
        />
        <div className="p-2 text-right">
          <button
            className="btn btn-sm btn-success px-4"
            type="button"
            onClick={SaveSetRate}
          >
            {t("save")}
          </button>
        </div>
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
    </div>
  );
}
