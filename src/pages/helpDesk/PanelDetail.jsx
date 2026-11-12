import React, { useEffect, useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import PanelDetailTable from "../../components/UI/customTable/helpDesk/panelDetail/index";
import {
  BindPanelGroup,
  PanelSearch,
} from "../../networkServices/PanelDetailApi";
import { getBindPanelList } from "../../store/reducers/common/CommonExportFunction";
import { useDispatch, useSelector } from "react-redux";
const PanelDetail = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { getBindPanelListData } = useSelector((state) => state.CommonSlice);
  const [panelGroup, setPanelGroup] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [bodyData, setBodyData] = useState({
    PanelID: "",
    PanelGroupID: "",
  });

  const getBindPanelGroup = async () => {
    try {
      const dataRes = await BindPanelGroup();
      const options = dataRes.data.map((item) => ({
        value: item.PanelGroupID,
        label: item.PanelGroup,
      }));
      setPanelGroup(options);
    } catch (error) {
      console.error(error);
    }
  };

  const searchPanelDetail = async () => {
    try {
      const PanelGroup = bodyData?.PanelID?.value;
      const Panel = bodyData?.PanelGroupID?.label;
      const dataRes = await PanelSearch(Panel, PanelGroup);
      setTableData(dataRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(tableData);

  const handleReactSelect = (name, value) => {
    setBodyData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const THEAD = [
    t("S.No."),
    t("Company Name"),
    t("Address"),
    t("RefRate(IPD)Company"),
    t("RefRate(OPD)Company"),
    t("Contact Person"),
    t("From Date"),
    t("To Date"),
    t("Credit Limit"),
  ];

  useEffect( () => {
    getBindPanelGroup();
    dispatch(getBindPanelList());
  }, []);
  return (
    <>
      <form className="patient_registration card">
        <Heading
          title={t("HeadingName")}
          isBreadcrumb={true}
        />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("ConpanyName")}
            id={"PanelID"}
            name={"PanelID"}
            dynamicOptions={getBindPanelListData?.map((item) => ({
              label: item.Company_Name,
              value: item.PanelID,
            }))}
            handleChange={handleReactSelect}
            value={bodyData?.PanelID?.value}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("GroupType")}
            id={"PanelGroupID"}
            name="PanelGroupID"
            value={bodyData?.PanelGroupID?.value}
            handleChange={handleReactSelect}
            dynamicOptions={panelGroup}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          />
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={searchPanelDetail}
          >
            {t("Search")}
          </button>
        </div>

        <PanelDetailTable thead={THEAD} tbody={tableData} />
      </form>
    </>
  );
};

export default PanelDetail;
