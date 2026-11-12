import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import {
  MRDBindDocumentlist,
  MRDEditDcouementName,
  MRDSavedocument,
} from "../../../networkServices/MRDApi";
import {
  handleMultiSelectOptions,
  handleMultiSelectOptionsSelected,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const ACTION = [
  { label: "Add", value: "Save" },
  { label: "Edit", value: "Update" },
];

const APPLY_ON = [
  {
    label: "EMG",
    value: "EMG",
  },
  {
    label: "IPD",
    value: "IPD",
  },
  {
    label: "OPD",
    value: "OPD",
  },
];

const IS_ACTIVE_OPTION = [
  {
    label: "Yes",
    value: "1",
  },

  {
    label: "No",
    value: "0",
  },
];


const DocumentMaster = () => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");

  const [dropDownData, setDropDownState] = useState([]);

  const [payload, setPayload] = useState({
    documentName: "",
    sequenceName: "",
    patientType: [],
    saveType: "Save",
    isActive: "1",
    documentID: "0",
  });

  const handleReactChange = async (name, e, apiResponse) => {
    const obj = { ...payload };
    if (apiResponse) {
      const response = await apiResponse(e?.value);
      const { NAME, SequenceNo, patientType, Active } = response[0];
      obj["documentName"] = NAME;
      obj["isActive"] = Active.toLowerCase() === "yes" ? "1" : "0";
      obj["patientType"] = handleMultiSelectOptionsSelected(
        APPLY_ON,
        patientType,
        "name",
        "code",
        "value",
        "label"
      );
      obj["sequenceName"] = SequenceNo;
    }
    if (name === "saveType" && e?.value === "Save") {
      obj["documentID"] = "0";
      obj["documentName"] = "";
      obj["isActive"] = "1";
      obj["patientType"] = [];
      obj["sequenceName"] = "";
    }
    obj[name] = e?.value;
    setPayload(obj);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleMRDEditDcouementName = async (documentID) => {
    try {
      const response = await MRDEditDcouementName(documentID);
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDSavedocument = async () => {
    try {
      if (!payload?.documentName) {
        notify("Document Name Field Is Required", "error")
        return 0
      } else if (!payload?.sequenceName) {
        notify("Sequence Name Field Is Required", "error")
        return 0
      }else if (!payload?.patientType?.length>0) {
        notify("Patient Type Field Is Required", "error")
        return 0
      }

      const requestBody = {
        ...payload,
        patientType: payload?.patientType.map((row, _) => row?.code).join(","),
        IPAddress: String(ip),
      };
      const response = await MRDSavedocument(requestBody);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleMRDBindDocumentlist()
        setPayload({
          documentName: "",
          sequenceName: "",
          patientType: [],
          saveType: "Save",
          isActive: "1",
          documentID: "0",
        });
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindDocumentlist = async () => {
    try {
      const response = await MRDBindDocumentlist();
      setDropDownState(
        handleReactSelectDropDownOptions(response?.data, "NAME", "DocumentID")
      );
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    handleMRDBindDocumentlist();
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("DocumentMaster")} isBreadcrumb={false} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("Action")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"saveType"}
              name={"saveType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={ACTION}
              value={payload?.saveType}
            />
            {payload?.saveType === "Update" && (
              <ReactSelect
                placeholderName={t("Document Name")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                id={"documentID"}
                name={"documentID"}
                removeIsClearable={true}
                handleChange={(name, e) =>
                  handleReactChange(name, e, handleMRDEditDcouementName)
                }
                dynamicOptions={dropDownData}
                value={payload?.documentID}
              />
            )}
          </div>

          <div className="row p-2">
            <Input
              type="text"
              className="form-control required-fields"
              id="documentName"
              lable={t("DocumentName")}
              placeholder=" "
              required={true}
              value={payload?.documentName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="documentName"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control required-fields"
              id="sequenceName"
              lable={t("SequenceNo")}
              placeholder=" "
              required={true}
              value={payload?.sequenceName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="sequenceName"
              onChange={handleChange}
            />

            <ReportsMultiSelect
              dynamicOptions={APPLY_ON}
              labelKey={"label"}
              valueKey={"value"}
              name={"patientType"}
              values={payload}
              placeholderName={t("Patient Type")}
              requiredClassName={true}
              setValues={setPayload}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            />

            <ReactSelect
              placeholderName={t("IsActive")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"isActive"}
              name={"isActive"}
              removeIsClearable={true}
              handleChange={handleReactChange}
              dynamicOptions={IS_ACTIVE_OPTION}
              value={payload?.isActive}
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleMRDSavedocument}
              >
                {String(payload?.documentID) === "0" ? t("Save") : t("Update")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentMaster;
