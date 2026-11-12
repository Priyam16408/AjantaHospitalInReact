import React, { useEffect, useState } from "react";
import {
  EDPBindDesignation,
  EDPBindDesignationDocumentMap,
  EDPBindDocumentForMap,
  EDPDeleteDocumentMap,
  EDPSaveDesigDocMap,
} from "../../../../networkServices/EDP/govindedp";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import Heading from "../../../../components/UI/Heading";
import Tables from "../../../../components/UI/customTable";
import { CrossIconSVG, SelectIconSVG } from "../../../../components/SvgIcons";

const DesignationDocumentMaster = () => {
  const [t] = useTranslation();

  const [DropDownState, setDropDownState] = useState({
    Designation: [],
  });

  const initialValues = {};

  const THEAD = [
    { name: "S.No." },
    { name: "Designation Name" },
    { name: "Document Name" },
    { name: "Delete" },
  ];

  const [tableData, setTableData] = useState([]);
  const [values, setValues] = useState();
  console.log("values", values);

  const EDPBindDesignationDocumentMapAPI = async () => {
    const response = await EDPBindDesignationDocumentMap();

    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };
  const EDPBindDesignationAPI = async (deptID) => {
    const response = await EDPBindDesignation();

    if (response?.success) {
      setDropDownState((prev) => ({
        ...prev,
        Designation: handleReactSelectDropDownOptions(
          response?.data,
          "Designation_Name",
          "Des_ID"
        ),
      }));
      // setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };
  const EDPBindDocumentForMapAPI = async (deptID) => {
    const response = await EDPBindDocumentForMap();

    if (response?.success) {
      setDropDownState((prev) => ({
        ...prev,
        DocumentType: handleReactSelectDropDownOptions(
          response?.data,
          "Doc_Name",
          "DocID"
        ),
      }));
      // setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleMap = async () => {
    ;

    if (!values?.Designation?.Des_ID && !values?.Document?.DocID) {
      notify("Please enter required Fields", "error");
      return;
    }
    console.log("payload", values);
    const payload = {
      desigID: values?.Designation?.Des_ID,
      docID: values?.Document?.DocID,
    };

    const response = await EDPSaveDesigDocMap(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      EDPBindDesignationDocumentMapAPI();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleDelete = async (ele) => {
    ;
    const payload = {
      additionalProp1: ele?.MapDocID,
    };

    const response = await EDPDeleteDocumentMap(payload);

    if (response?.success) {
      notify(response?.message, "success");
      EDPBindDesignationDocumentMapAPI();
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    EDPBindDesignationAPI();
    EDPBindDocumentForMapAPI();
    EDPBindDesignationDocumentMapAPI();
  }, []);
  return (
    <>
      <ReactSelect
        placeholderName={t("Designation")}
        name="Designation"
        value={values?.Designation?.value}
        handleChange={(name, e) => handleReactSelect(name, e)}
        dynamicOptions={DropDownState?.Designation}
        searchable={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />
      <ReactSelect
        placeholderName={t("Document")}
        name="Document"
        value={values?.Document?.value}
        requiredClassName={"required-fields"}
        handleChange={(name, e) => handleReactSelect(name, e)}
        dynamicOptions={DropDownState?.DocumentType}
        searchable={true}
        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
      />
      <button className="btn btn-sm btn-success ml-2 px-3" onClick={handleMap}>
        {values?.isEdit === 1 ? t("Update") : t("Map")}
      </button>
      <button
        className=" btn btn-sm btn-success ml-2 px-3"
        onClick={() => {
          setValues(initialValues);
        }}
      >
        {t("Reset")}
      </button>
      <div className="col-12 pt-2">
        <Heading title={t("Job Type Master Details")} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            Designation_Name: ele?.Designation_Name,
            Doc_Name: ele?.Doc_Name,
            Delete: (
              <div onClick={() => handleDelete(ele)}>
                <CrossIconSVG />
              </div>
            ),
          }))}
        />
      </div>
    </>
  );
};

export default DesignationDocumentMaster;
