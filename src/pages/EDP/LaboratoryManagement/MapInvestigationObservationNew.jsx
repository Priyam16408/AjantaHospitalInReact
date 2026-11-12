import React, { useEffect, useState } from "react";

import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import EDPSeeMoreList from "../EDPSeeMoreList";
import SeeMoreSlideScreen from "../../../components/UI/SeeMoreSlideScreen";
import SlideScreen from "../../../components/front-office/SlideScreen";
import { AutoComplete } from "primereact/autocomplete";
import {
  BindInvestigationMaster,
  BindObservationInvestigation,
  GetObservationData,
  SaveObservationInvestigation,
  SaveObservationInvestigationMapping,
  RemoveObservationInvestigation,
  SaveObservationMap,
} from "../../../networkServices/EDP/edpApi";

function MapInvestigationObservationNew({ data }) {
  const [t] = useTranslation();
  const [observation, setObservation] = useState([]);
  const [modalData, setModalData] = useState({});
  const [seeMore, setSeeMore] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});
  const [ObservationData, setObservationData] = useState([]);
  const [values, setValues] = useState({ investigation: "", observation: "" });
  const [searchvalue, setSearchValue] = useState("");
  const [genericSuggestions, setGenericSuggestions] = useState([]);
  const [observationMappings, setObservationMappings] = useState([]);
  const [investigationList, setInvestigationList] = useState([]);
  const [investigationMasterList, setInvestigationMasterList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [renderComponent, setRenderComponent] = useState({
    name: null,
    component: null,
  });

  const theadObservation = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Parent ID") },
    { width: "15%", name: t("Observation Name") },
    { width: "10%", name: t("Prefix") },
    { width: "15%", name: t("Method") },
    { width: "15%", name: t("Header") },
    { width: "15%", name: t("Critical") },
    { width: "15%", name: t("Bold") },
    { width: "10%", name: t("UnderLine") },
    { width: "10%", name: t("NABL") },
    { width: "15%", name: t("Microscopy") },
    { width: "15%", name: t("Parent ID") },
    { width: "15%", name: t("Edit") },
    { width: "15%", name: t("Remove") },
  ];

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (ObservationData.length > 0) {
      const mappedData = ObservationData.map((val) => ({
        prefix: val.prefix || "",
        method: val.methodName || "",
        isHeader: false,
        isCritical: val.isCritical === "1",
        isBold: val.isBold === "True",
        isUnderLine: val.isUnderLine === "True",
        isMicroscopy: val.isMicroScopy === "1",
        isNabl: val.isNabl === "1",
        isComment: val.isComment === "True",
        parentId: val.parentID || "",
      }));
      setObservationMappings(mappedData);
    }
  }, [ObservationData]);

  const handleBindObservationInvestigation = async () => {
    try {
      const response = await BindObservationInvestigation();
      if (response.success) setObservation(response.data);
    } catch (error) {
      console.error("Error fetching observation data:", error);
    }
  };

  const handleGetObservationData = async (id) => {
    try {
      const res = await GetObservationData(id);
      if (res.success) {
        setObservationData(res.data);
        setObservationMappings(
          res.data.map(() => ({
            prefix: "",
            method: "",
            isCritical: false,
            isBold: false,
            isUnderLine: false,
            isNabl: false,
            isMicroscopy: false,
            isHeader: false,
            parentId: "",
            isComment: false,
          }))
        );
      }
    } catch (error) {
      console.error("Error getting observation data:", error);
    }
  };

 

  const handleSaveObservationInvestigationMapping = async () => {
    try {
      for (let i = 0; i < observationMappings.length; i++) {
        const row = observationMappings[i];
        console.log("the row data is", row);
        const payload = {
          investigationID: investigationList[0].VALUE,
          prifix: row.prefix || "",
          printOrder: i + 1,
          methodName: row.method || "",
          childFlag: 1,
          isCritical: row.isCritical ? 1 : 0,
          isBold: row.isBold ? 1 : 0,
          isUnderLine: row.isUnderLine ? 1 : 0,
          isNabl: row.isNabl ? 1 : 0,
          parentID: row.parentId || "",
          isMicroscopy: row.isMicroscopy ? 1 : 0,
          labObservationID: ObservationData[i]?.obsID,
          isComment: row.isComment ? 1 : 0,
          suffix: "",
        };
        const response = await SaveObservationInvestigationMapping(payload);
        notify(response?.message, "success");
      }
      handleBindObservationInvestigation();
    } catch (error) {
      notify("Error saving observation mappings", "error");
    }
  };

  const handleDelete = async (index) => {
    const obs = ObservationData[index];
    try {
      const payload = {
        investigationID: obs?.investigation_Id,
        labObservationId: obs?.obsID,
      };
      const resp = await RemoveObservationInvestigation(payload);
      notify(resp?.message, resp?.success ? "success" : "error");
      if (resp.success) handleGetObservationData(values.investigation?.value);
    } catch (error) {
      notify("Error deleting mapping", "error");
    }
  };
 
  

  // const handleChangeInput = (index, field, value) => {
  //   const newMappings = [...observationMappings];
  //   newMappings[index][field] = value;
  //   setObservationMappings(newMappings);
  // };

  // const handleCheckboxChange = (index, field) => {
  //   const newMappings = [...observationMappings];
  //   newMappings[index][field] = !newMappings[index][field];
  //   setObservationMappings(newMappings);
  // };

  const handleChangeInput = (index, field, value) => {
    const newMappings = [...observationMappings];
    newMappings[index][field] = value;
    setObservationMappings(newMappings);
  };

  const handleCheckboxChange = (index, field) => {
    const newMappings = [...observationMappings];
    newMappings[index][field] = !newMappings[index][field];
    setObservationMappings(newMappings);
  };

  const handleGenericSearch = async (event) => {
    const query = event?.query?.toLowerCase();
    const filtered = investigationMasterList?.filter((item) =>
      item?.Name?.toLowerCase()?.includes(query)
    );
    setGenericSuggestions(
      filtered?.map((ele) => ({ NAME: ele.Name, VALUE: ele.Investigation_id }))
    );
  };
  const [investigationId,setInvestigationId] = useState("");

  const handleGenericSelect = (e) => {
    const selected = e.value;
    if (!investigationList.some((item) => item.VALUE === selected.VALUE)) {
      setInvestigationList([...investigationList, selected]);
      handleGetObservationData(selected.VALUE);
      // handleSaveObservationMap(selected.VALUE);
      setInvestigationId(selected.VALUE)
    } else {
      notify("You have already selected this Investigation", "error");
    }
  };

  const handleRemoveInvestigation = (id) => {
    setInvestigationList(investigationList.filter((item) => item.VALUE !== id));
  };

  const handleHeadingData = () =>
    investigationList?.map((ele, i) => (
      <span key={ele.VALUE} className="ml-2">
        {ele.NAME}
        <i
          className="fa fa-times-circle text-danger pointer-cursor"
          onClick={() => handleRemoveInvestigation(ele.VALUE)}
        />
        {i < investigationList.length - 1 ? "," : ""}
      </span>
    ));


     const handleSaveObservationMap = async () => {
    try {
      const payload = {
        investigationID: investigationId,
        observationId: values?.observation?.value,
      };
      const response = await SaveObservationMap(payload);
      notify(response?.message,"success");
      handleGetObservationData(investigationId);
    } catch (error) {
       notify(response?.message,"error");
    }
  };
  useEffect(() => {
    handleBindObservationInvestigation();
    const fetchInvestigationMaster = async () => {
      const response = await BindInvestigationMaster();
      if (response?.success) setInvestigationMasterList(response.data);
    };
    fetchInvestigationMaster();
  }, []);

  return (
    <div className="spatient_registration_card card">
      <Heading
        title={data?.breadcrumb}
        data={data}
        isBreadcrumb={true}
        isSlideScreen={true}
        secondTitle={
          <EDPSeeMoreList
            ModalComponent={(name, component) => {
              setVisible(true);
              setRenderComponent({ name, component });
            }}
            setSeeMore={setSeeMore}
            data={{}}
            setVisible={() => setVisible(false)}
            handleBindFrameMenu={[]}
            openFirstItem={false}
            name={
              <button className="btn text-white">
                {t("New Investigation")}
              </button>
            }
            isRemoveSvg={true}
          />
        }
      />

      <div className="row p-2">
        <AutoComplete
          style={{ width: "100%" }}
          placeholder={t("Select Investigation")}
          value={searchvalue}
          suggestions={genericSuggestions}
          completeMethod={handleGenericSearch}
          className="col-xl-4 col-md-4 col-sm-4 col-12"
          onSelect={handleGenericSelect}
          onChange={(e) => setSearchValue(e?.value)}
          itemTemplate={(item) => (
            <div style={{ fontSize: "12px" }}>{item?.NAME}</div>
          )}
          field="NAME"
        />

        <ReactSelect
          placeholderName={t("Map Observation")}
          id="observation"
          searchable
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="observation"
          dynamicOptions={handleReactSelectDropDownOptions(
            observation,
            "ObsName",
            "LabObservation_ID"
          )}
          handleChange={handleSelect}
          value={values?.observation?.value || ""}
        />

        <button
          onClick={handleSaveObservationMap}
          className="btn btn-sm btn-success ms-auto ml-2"
        >
          {t("Map Observation")}
        </button>
      </div>

      {investigationList.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <Heading title={handleHeadingData()} isBreadcrumb={false} />
        </div>
      )}

      {ObservationData.length > 0 && (
        <>
          <Tables
            thead={theadObservation}
            tbody={ObservationData.map((val, index) => ({
              sno: index + 1,
              parentId: val?.obsID,
              ObservationName: val?.obsName,
              prefix: (
                <Input
                  type="text"
                  className="form-control"
                  disabled={observationMappings[index]?.isHeader}
                  value={observationMappings[index]?.prefix}
                  onChange={(e) =>
                    handleChangeInput(index, "prefix", e.target.value)
                  }
                />
              ),
              method: (
                <Input
                  type="text"
                  className="form-control"
                  disabled={observationMappings[index]?.isHeader}
                  value={observationMappings[index]?.method}
                  onChange={(e) =>
                    handleChangeInput(index, "method", e.target.value)
                  }
                />
              ),
              Header: (
                <input
                  type="checkbox"
                  checked={observationMappings[index]?.isHeader}
                  onChange={() => handleCheckboxChange(index, "isHeader")}
                />
              ),
              Critical: (
                <input
                  type="checkbox"
                  checked={observationMappings[index]?.isCritical}
                  onChange={() => handleCheckboxChange(index, "isCritical")}
                />
              ),
              Bold: (
                <input
                  type="checkbox"
                  checked={observationMappings[index]?.isBold}
                  onChange={() => handleCheckboxChange(index, "isBold")}
                />
              ),
              UnderLine: (
                <input
                  type="checkbox"
                  checked={observationMappings[index]?.isUnderLine}
                  onChange={() => handleCheckboxChange(index, "isUnderLine")}
                />
              ),
              Microscopy: (
                <input
                  type="checkbox"
                  checked={observationMappings[index]?.isMicroscopy}
                  onChange={() => handleCheckboxChange(index, "isMicroscopy")}
                />
              ),
              NABL: (
                <input
                  type="checkbox"
                  checked={observationMappings[index]?.isNabl}
                  onChange={() => handleCheckboxChange(index, "isNabl")}
                />
              ),
              parentID: (
                <Input
                  type="text"
                  className="form-control"
                  value={observationMappings[index]?.parentId}
                  onChange={(e) =>
                    handleChangeInput(index, "parentId", e.target.value)
                  }
                />
              ),
              edit: <i className="fa fa-edit p-1" />,
              delete: (
                <i
                  onClick={() => handleDelete(index)}
                  className="fa fa-trash p-1 text-danger"
                />
              ),
            }))}
            tableHeight="scrollView"
            style={{ height: "50vh", padding: "2px" }}
          />

          <div className="col-12 mt-1 mb-1">
            <button
              onClick={handleSaveObservationInvestigationMapping}
              className="btn btn-sm btn-success ms-auto ml-2"
              type="button"
            >
              {t("Save Mapping")}
            </button>
          </div>
        </>
      )}

      <SlideScreen
        visible={visible}
        setVisible={() => {
          setVisible(false);
          setRenderComponent({ name: null, component: null });
        }}
        Header={
          <SeeMoreSlideScreen
            name={renderComponent?.name}
            seeMore={seeMore}
            handleChangeComponent={(e) => {
              setVisible(true);
              setRenderComponent({ name: e?.label, component: e?.component });
            }}
          />
        }
      >
        {renderComponent?.component}
      </SlideScreen>
    </div>
  );
}

export default MapInvestigationObservationNew;
