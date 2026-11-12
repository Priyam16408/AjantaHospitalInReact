import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Loading from "../../../components/loader/Loading";
import Input from "../../../components/formComponent/Input";
import axios from "axios";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import {
  BindInvestigationsdata,
  formulamasterDelete,
  formulamasterSaveFormula,
  GetFormula,
  LoadObservations,
} from "../../../networkServices/EDP/karanedp";
import Heading from "../../../components/UI/Heading";

const FormulaMaster = ({ data }) => {
  const [Investigation, setInvestigation] = useState([]);
  const [observationData, setObservationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    investigation: "",
  });
  const { t } = useTranslation();
  const [load, setLoad] = useState({
    deleteLoad: false,
    saveLoad: false,
  });
  const [splitData, setSplitData] = useState({
    value: "",
    TestID: "",
  });
  const [splitLeft, setSplitLeft] = useState({
    Left: [],
    Right: "",
  });
  console.log(splitData);
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    console.log(value);
    handleLoadObservations(value?.value);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const findvalue = observationData.find((ele) => ele.TestID == value);
    console.log(findvalue, value);
    setSplitData({
      ...splitData,
      value: findvalue?.TestName,
      TestID: findvalue?.TestID,
    });
  };

  const handleGetNablInvestigations = async () => {
    try {
      const response = await BindInvestigationsdata(0);
      if (response.success) {
        setInvestigation(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setInvestigation([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setInvestigation([]);
    }
  };

  const handleLoadObservations = async (value) => {
    try {
      const response = await LoadObservations(value);
      if (response.success) {
        const data = response?.data;
        const finalData = data?.map((ele) => {
          return {
            ...ele,
            TestName: ele?.name + "#" + ele?.labobservation_id,
            TestID: ele?.labobservation_id,
          };
        });
        setObservationData(finalData);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setObservationData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setObservationData([]);
    }
  };

  const handleChangeRight = (e) => {
    const { name, value } = e.target;
    setSplitLeft({
      ...splitLeft,
      [name]: value,
    });
  };

  console.log(splitLeft);

  const handleGetFormula = async () => {
    try {
      // const response = await GetFormula(splitData?.TestID);
      const response = await LoadObservations(values?.investigation?.value);
      if (response.success) {
        return response?.data;
        // setObservationData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setObservationData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setObservationData([]);
    }
  };

  // const handleEvent = async (name) => {
  //   if (splitData.TestID !== "") {
  //     const data = splitData.value.split("#");

  //     if (name === "Left") {
  //       const getResponse = await handleGetFormula(splitData?.TestID);
  //       console.log(getResponse)
  //       if (getResponse.length > 0) {
  //         setSplitLeft({
  //           ...splitLeft,
  //           [name]: data,
  //           Right: getResponse[0]?.formula,
  //         });
  //       } else {
  //         setSplitLeft({
  //           ...splitLeft,
  //           [name]: data,
  //         });
  //       }
  //     }
  //     if (name === "Right") {
  //       setSplitLeft({
  //         ...splitLeft,
  //         [name]:
  //           splitLeft?.Right !== ""
  //             ? `${splitLeft?.Right}${data[1]}&`
  //             : `${data[1]}&`,
  //       });
  //     }
  //   }
  // };

  const handleEvent = (name) => {
    if (splitData.TestID !== "") {
      const data = splitData.value.split("#");
      if (name === "Left") {
        handleGetFormula().then((res) => {
          if (res.length > 0) {
            setSplitLeft({
              ...splitLeft,
              [name]: data,
              Right: res?.[0]?.formula,
            });
          } else {
            setSplitLeft({
              ...splitLeft,
              [name]: data,
            });
          }
        });
      }
      if (name === "Right") {
        setSplitLeft({
          ...splitLeft,
          [name]:
            splitLeft?.Right !== ""
              ? `${splitLeft?.Right}${data[1]}&`
              : ` ${data[1]}&,`,
        });
      }
    }
  };

  const handleSubmit = async () => {
    const payload = {
      formula: splitLeft?.Right,
      formulaText: "formula",
      labObservationID: splitLeft?.Left[1],
    };

    try {
      const apiResp = await formulamasterSaveFormula(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setSplitData({
          value: "",
          TestID: "",
        });
        setSplitLeft({
          ...splitLeft,
          Right: "",
        });
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const apiResp = await formulamasterDelete(splitLeft?.Left[1]);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setSplitData({
          value: "",
          TestID: "",
        });
        setSplitLeft({
          ...splitLeft,
          Right: "",
        });
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  // GetFormula

  useEffect(() => {
    handleGetNablInvestigations();
  }, []);
  useEffect(() => {
    // handleGetFormula();
  }, [values?.investigation?.value]);
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row pt-2 pl-2 pr-2 mt-1">
        <div className="col-sm-3">
          <ReactSelect
            placeholderName={t("Investigation")}
            id={"investigation"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-8 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              ...handleReactSelectDropDownOptions(
                Investigation,
                "Name",
                "Investigation_Id"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.investigation?.value}`}
            name={"investigation"}
          />
          {loading ? (
            <div className="mt-3">
              <Loading />
            </div>
          ) : (
            <select
              multiple
              className="form-control formula-tag"
              onChange={handleChange}
            >
              {observationData.map((ele, index) => (
                <option key={index} value={ele?.TestID} className="p-2">
                  {ele?.TestName}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="col-sm-1 center">
          <button
            className="btn btn-block btn-info btn-sm"
            onClick={() => handleEvent("Left")}
          >
            {t("Left")}
          </button>
        </div>
        <div className="col-sm-1 center">
          <button
            className="btn btn-block btn-info btn-sm"
            onClick={() => handleEvent("Right")}
          >
            {t("Right")}
          </button>
        </div>
        <div className="col-sm-2">
          <Input
            className="form-control ui-autocomplete-input input-sm"
            value={splitLeft?.Left[0]}
            readOnly
          />
          <Input
            className="form-control ui-autocomplete-input input-sm"
            value={splitLeft?.Left[1]}
            readOnly
          />
        </div>
        <div className="col-sm-1 ">
          <div className="pi pi-equals"></div>
        </div>
        <div className="col-sm-3">
          <input
            className="form-control ui-autocomplete-input formula-tag"
            style={{ height: "100px !important" }}
            value={splitLeft?.Right}
            name="Right"
            type="text"
            onChange={handleChangeRight}
          />
        </div>
      </div>
      <div className="row pt-2 pl-2 pr-2 mt-1">
        {load?.saveLoad ? (
          <Loading />
        ) : (
          <div className="col-sm-1 mb-1">
            <button
              className="btn btn-block btn-success btn-sm"
              onClick={handleSubmit}
            >
              {t("Save")}
            </button>
          </div>
        )}
        {load?.deleteLoad ? (
          <Loading />
        ) : (
          <div className="col-sm-1 mb-1">
            <button
              className="btn btn-block btn-danger btn-sm"
              onClick={handleDelete}
            >
              {t("Delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaMaster;
