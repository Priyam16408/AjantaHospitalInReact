import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";

const MapAccess = (data) => {
  console.log("Data" + JSON.stringify(data?.data?.values));
  const [t] = useTranslation();

  const isMobile = window.innerWidth <= 800;

  const [bodyData, setBodyData] = useState([]);

  const handleChangeCheckHead = (checked, name) => {
    let data = [...bodyData]?.map((val) => {
      val[name].isChecked = checked;
      return val;
    });
    setBodyData(data);
  };

  const THEAD = [
    { name: t("S.No."), width: "1%" },
    {
      name: isMobile ? (
        t("Map Centre")
      ) : (
        <>
          <input
            type="checkbox"
            id={`MapCentre`}
            className="CentreMasterCheckbox ml-3"
            onChange={(e) => {
              handleChangeCheckHead(e?.target?.checked, "MapCentre");
            }}
          />
          <label htmlFor={`MapCentre`} className="pointer-cursor">
            {" "}
            {t("Map Centre")}{" "}
          </label>
        </>
      ),
      width: "1%",
    },
    {
      name: isMobile ? (
        t("Map Lab Department")
      ) : (
        <>
          <input
            type="checkbox"
            id={`MLabDept`}
            className="CentreMasterCheckbox ml-3"
            onChange={(e) => {
              handleChangeCheckHead(e?.target?.checked, "MLabDept");
            }}
          />
          <label htmlFor={`MLabDept`} className="pointer-cursor">
            {" "}
            {t("Map Lab Department")}{" "}
          </label>
        </>
      ),
      width: "1%",
    },
    {
      name: isMobile ? (
        t("Map Role To Department Belong")
      ) : (
        <>
          <input
            type="checkbox"
            id={`MRDeptBelong`}
            className="CentreMasterCheckbox ml-3"
            onChange={(e) => {
              handleChangeCheckHead(e?.target?.checked, "MRDeptBelong");
            }}
          />
          <label htmlFor={`MRDeptBelong`} className="pointer-cursor">
            {" "}
            {t("Map Role To Department Belong")}{" "}
          </label>
        </>
      ),
      width: "1%",
    },
  ];

  const handleChangeCheckbox = (e, val, index, type) => {
    const updatedData = JSON.parse(JSON.stringify(bodyData));
    updatedData[index][type].isChecked = e.target.checked;
    setBodyData(updatedData);
  };

  // --------------------API CALLING TO BE DONE----------------------------------------

  // const GetEDPAllMappings = async () => {
  //   let apiResp = await EDPAllMappings(data?.CentreID);
  //   if (apiResp?.success) {
  //     const largestArray = Object.entries(apiResp?.data).reduce(
  //       (max, current) =>
  //         current[1]?.length > max[1]?.length ? current[1] : max
  //     );
  //     let data = largestArray?.map((val, index) => {
  //       return {
  //         roles: {
  //           ...apiResp?.data?.roles[index],
  //           isChecked: Boolean(apiResp?.data?.roles[index]?.MapID),
  //         },
  //         doctors: {
  //           ...apiResp?.data?.doctors[index],
  //           isChecked: Boolean(apiResp?.data?.doctors[index]?.MapID),
  //         },
  //         employees: {
  //           ...apiResp?.data?.employees[index],
  //           isChecked: Boolean(apiResp?.data?.employees[index]?.MapID),
  //         },
  //         panels: {
  //           ...apiResp?.data?.panels[index],
  //           isChecked: Boolean(apiResp?.data?.panels[index]?.MapID),
  //         },
  //       };
  //     });
  //     setBodyData(data);
  //   }
  // };
  // useEffect(() => {
  //   GetEDPAllMappings();
  // }, []);

  return (
    <div className="card">
      <Heading
        title={"Map Centre / Map Lab Dept. / Map Role to Department Belong"}
        isBreadcrumb={false}
      />
      <div className="row p-2"></div>
      <Tables
        thead={THEAD}
        isSearch={false}
        tbody={bodyData?.map((val, index) => ({
          Sno: index + 1,
          MapCentre: val?.MapCentre?.TextField && (
            <>
              {" "}
              <input
                type="checkbox"
                id={`MapCentre_${index}`}
                checked={val?.MapCentre?.isChecked}
                className="CentreMasterCheckbox"
                onChange={(e) => {
                  handleChangeCheckbox(e, val, index, "MapCentre");
                }}
              />
              <label htmlFor={`MapCentre_${index}`}>
                {" "}
                {val?.MapCentre?.TextField}{" "}
              </label>{" "}
            </>
          ),

          MLabDept: val?.MLabDept?.TextField && (
            <>
              <input
                type="checkbox"
                id={`MLabDept_${index}`}
                className="CentreMasterCheckbox"
                onChange={(e) => {
                  handleChangeCheckbox(e, val, index, "MLabDept");
                }}
                checked={val?.doctors?.isChecked}
              />{" "}
              <label htmlFor={`MLabDept_${index}`}>
                {" "}
                {val?.MLabDept?.TextField}{" "}
              </label>{" "}
            </>
          ),

          MRDeptBelong: val?.MRDeptBelong?.TextField && (
            <>
              <input
                type="checkbox"
                id={`MRDeptBelong_${index}`}
                className="CentreMasterCheckbox"
                onChange={(e) => {
                  handleChangeCheckbox(e, val, index, "MRDeptBelong");
                }}
                checked={val?.panels?.isChecked}
              />{" "}
              <label htmlFor={`MRDeptBelong_${index}`}>
                {" "}
                {val?.MRDeptBelong?.TextField}{" "}
              </label>{" "}
            </>
          ),
        }))}
        style={{ maxHeight: "65vh" }}
      />
      <div className="row p-2">
        <div className="col-2 text-center">
          <button
            className="btn btn-sm btn-primary px-3"
            // onClick={handleSaveRole}
          >
            {t("Save")}{" "}
          </button>
        </div>
        <div className="col-2 text-center">
          <button
            className="btn btn-sm btn-primary px-3"
            // onClick={handleSaveDoctor}
          >
            {t("Save")}
          </button>
        </div>
        <div className="col-2 text-center">
          <button className="btn btn-sm btn-primary px-3">{t("Save")} </button>
        </div>
      </div>
    </div>
  );
};

export default MapAccess;
