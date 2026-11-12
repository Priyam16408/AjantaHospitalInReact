import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  BindConsentType,
  BindPatientConsent,
  BindTemplate,
  DeleteSelectedTemplate,
  getGetDoctor,
  getTemplateContentApi,
  SaveConsentType,
  SavePatientConsent,
  BindTemplateContent
} from "../../../networkServices/DoctorApi";
import ConsentFormTable from "../../../components/UI/customTable/doctorTable/ConsentForm/ConsentFormTable";
import Modal from "../../../components/modalComponent/Modal";
import { notify } from "../../../utils/utils";
import ReactQuill from "react-quill";
import { ToastContainer } from "react-toastify";
import Heading from "../../../components/UI/Heading";
import { formats, modules } from "../../../utils/constant";
import Accordion from "@app/components/UI/Accordion";
import FullTextEditor from "../../../utils/TextEditor";
const ConcetForm = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { patientDetail, toggleAction, setActionType } = props;
  const [btnValue, setBtnValue] = useState("Save");
  const [getDoctorID, setgetDoctorID] = useState();
  const [typeName, setTypeName] = useState();
  const [editorValue, setEditorValue] = useState("");
  const [editData, setEditData] = useState({});

  const bindDoctor = async () => {
    const apiResp = await getGetDoctor(patientDetail?.TransactionID);
    if (apiResp?.success) {
      setgetDoctorID(apiResp?.data);
    } else {
      setgetDoctorID(patientDetail?.DoctorID);
    }
  };

  // Handle editor value change
  const handleChange = (value) => {
    setEditorValue(value);
  };
  const [apiData, setApiData] = useState({
    getBindConsentTypeAPI: [],
    getBindTemplateAPI: [],
    getBindPatientConsentAPI: [],
  });
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
  });

  const [reactSelectState, setReactSelectState] = useState({
    typeTempFilter: "Self",
    type: "",
    template: "",
  });
  console.log(reactSelectState);

  const fetchContent = async () => {
    console.log("call");

    const resp = await BindTemplateContent(reactSelectState.template)
    console.log(resp);

  }

  useEffect(() => {
    if (reactSelectState.typeTempFilter === 'all') {
      fetchContent()
    }

  }, [reactSelectState.typeTempFilter])

  const [templateName, setTemplateName] = useState("");
  const [isCheckSaveTemplate, setIsCheckSaveTemplate] = useState("");
  const [Editable, setEditable] = useState(false)


  const handleCheckedSaveTemplate = (e) => {
    setIsCheckSaveTemplate(e.target.checked);
  };

  const handleOpenModal = () => {
    setModalData((prev) => ({
      ...prev,
      visible: true,
      size: "40vw",
      Header: "Create New Type",
    }));
  };

  const handleReactSelectChange = async (name, e) => {
    console.log(name);
    console.log(e);
    switch (e?.value) {
      case "All":
        const apiRes = await BindTemplate("0");
        setApiData((prev) => ({ ...prev, getBindTemplateAPI: apiRes.data }));
        break;
      case "Self":
        const apiRes1 = await BindTemplate(getDoctorID);
        setApiData((prev) => ({ ...prev, getBindTemplateAPI: apiRes1.data }));
        break;

      default:
        break;
    }
    setReactSelectState((prevState) => ({
      ...prevState,
      [name]: e?.value,
    }));
  };

  // child to parent

  useImperativeHandle(ref, () => ({
    callChildFunction: handleclickSavePatientConsent,
    callChildFunctionUpdated: handelEditSaveData,
  }));

  const handleGetTemplateContent = async (item) => {
    console.log(item, "item?.Template_ID);");
    try {
      const apiRes = await getTemplateContentApi(item);
      console.log(apiRes);
      if (apiRes.success) {
        setEditorValue(apiRes?.data?.Template_Desc);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // API Implement ==================================================================================
  const handleclickSavePatientConsent = async () => {
    console.log("first", getDoctorID, patientDetail);
    // debugger
    setActionType("ConsentForm");
    try {
      const apiRes = await SavePatientConsent({
        type: 1,
        consentId: 0,
        transactionId: patientDetail?.currentPatient?.TransactionID,
        patientID: patientDetail?.currentPatient?.PatientID,
        typeID: Number(reactSelectState.type), // pouchna h
        content: editorValue,
        templateName: isCheckSaveTemplate ? templateName : "", //
        isSaveAsTemplate: "1", //
        doctorID: getDoctorID,
        appID: patientDetail?.currentPatient?.App_ID,
      });
      console.log(apiRes);
      if (apiRes.success) {
        notify(apiRes.message, "success");
        setEditorValue("");
        setReactSelectState((prev) => ({
          ...prev,
          template: "",
          type: "",
          typeTempFilter: "",
        }));
        setTemplateName("");
        BindConsentTypeAPI();
        BindTemplateAPI();
        BindPatientConsentAPI();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelEditSaveData = async () => {
    debugger;
    try {
      const apiRes = await SavePatientConsent({
        type: 2,
        consentId: editData.consentId,
        transactionId: patientDetail?.currentPatient?.TransactionID,
        patientID: editData?.patientID,
        typeID: String(reactSelectState.type), // pouchna h
        content: editorValue,
        templateName: "", //
        isSaveAsTemplate: editData.isSaveAsTemplate, //
        doctorID: getDoctorID,
        appID: editData.appID,
      });
      console.log(apiRes);
      if (apiRes.success) {
        notify(apiRes.message, "success");
        setEditorValue("");
        setReactSelectState((prev) => ({
          ...prev,
          template: "",
          type: "",
          typeTempFilter: "",
        }));
        setTemplateName("");
        BindConsentTypeAPI();
        BindTemplateAPI();
        BindPatientConsentAPI();
        toggleAction("Save");
        setBtnValue("Save");
        setActionType("ConsentForm");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditPatient = (item, Update) => {
    //console.log(item);
    toggleAction();
    // debugger
    setActionType("Update");
    setBtnValue("Update");
    const newEditValues = {
      type: 2,
      consentId: item.ID,
      transactionId: patientDetail?.currentPatient?.TransactionID,
      patientID: item?.PatientID,
      typeID: item.TypeID, // pouchna h
      content: item.Content,
      templateName: "", //
      isSaveAsTemplate: "0", //
      doctorID: getDoctorID,
      appID: patientDetail?.currentPatient?.App_ID,
      buttonNameUpdate: "Update",
    };
    setEditData(newEditValues);
    setEditorValue(newEditValues.content);
    setReactSelectState((prev) => ({ ...prev, type: newEditValues.typeID }));

    // try {
    //   const apiRes = await SavePatientConsent({
    //     type: newEditValues.type,
    //     consentId: newEditValues.consentId,
    //     transactionId: patientDetail?.currentPatient?.TransactionID,
    //     patientID: newEditValues?.patientID,
    //     typeID: String(reactSelectState.type), // pouchna h
    //     content: editorValue,
    //     templateName: "", //
    //     isSaveAsTemplate: newEditValues.isSaveAsTemplate, //
    //     doctorID: getDoctorID,
    //     appID: newEditValues.appID,
    //   });
    //   console.log(apiRes);
    //   if (apiRes.success) {
    //     notify(apiRes.message, "success");
    //     setEditorValue("");
    //     setReactSelectState((prev) => ({
    //       ...prev,
    //       template: "",
    //       type: "",
    //       typeTempFilter: "",
    //     }));
    //     setTemplateName("");
    //     BindConsentTypeAPI();
    //     BindTemplateAPI();
    //     BindPatientConsentAPI();
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const handleSaveTypeName = async () => {
    try {
      const apiRes = await SaveConsentType({
        type: 1,
        typeID: "",
        typeName: typeName,
        doctorID: getDoctorID,
      });
      if (apiRes.success === true) {
        notify(apiRes.message, "success");
        setModalData((prev) => ({ ...prev, visible: false }));
        BindConsentTypeAPI();
      }
    } catch (error) { }
  };
  const handleDeleteSelectedTemplate = async () => {
    try {
      const apiRes = await DeleteSelectedTemplate({
        templateId: reactSelectState.template,
        doctorID: getDoctorID,
      });
      console.log(apiRes);
      if (apiRes.success === true) {
        notify(apiRes.message, "success");
        BindConsentTypeAPI();
        BindTemplateAPI();
        setReactSelectState((prevState) => ({ ...prevState, template: "" }));
      }
    } catch (error) { }
  };
  const BindConsentTypeAPI = async () => {
    try {
      const apiRes = await BindConsentType(getDoctorID);
      setApiData((prev) => ({ ...prev, getBindConsentTypeAPI: apiRes.data }));
    } catch (error) {
      console.log(error);
    }
  };
  const BindTemplateAPI = async () => {
    try {
      const apiRes = await BindTemplate(getDoctorID);
      setApiData((prev) => ({ ...prev, getBindTemplateAPI: apiRes.data }));
    } catch (error) {
      console.log(error);
    }
  };
  const BindPatientConsentAPI = async () => {
    try {
      const apiRes = await BindPatientConsent(
        patientDetail?.currentPatient?.PatientID
      );
      // const apiRes = await BindPatientConsent("AM24-05090001");
      setApiData((prev) => ({
        ...prev,
        getBindPatientConsentAPI: apiRes.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSavePatientConsentDelete = async (item, index) => {
    try {
      const apiRes = await SavePatientConsent({
        type: 3,
        consentId: item.ID,
        transactionId: patientDetail?.currentPatient?.TransactionID,
        patientID: patientDetail?.currentPatient?.PatientID,
        typeID: String(reactSelectState.type) || "0", // pouchna h
        content: item?.Content,
        templateName: "", //
        isSaveAsTemplate: "0", //
        doctorID: getDoctorID,
        appID: patientDetail?.currentPatient?.App_ID,
      });
      if (apiRes.success) {
        notify(apiRes.message, "success");
        BindPatientConsentAPI();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    bindDoctor();
  }, []);

  useEffect(() => {
    if (getDoctorID) {
      BindConsentTypeAPI();
      BindTemplateAPI();
      BindPatientConsentAPI();
    }
  }, [getDoctorID]);
  console.log(reactSelectState);

  useEffect(() => {
    if (reactSelectState?.template) {
      handleGetTemplateContent(reactSelectState.template);
    }
  }, [reactSelectState?.template]);

  return (
    <>
      <div className="">
        <div className="m-2 spatient_registration_card">
          <div className="patient_registration card">
            <Heading title={t("Consent Form Master")} />
            <div className="row g-4 m-2">
              <ReactSelect
                placeholderName={"Type & Temp.Filter"}
                id={"Type & Temp.Filter"}
                searchable={true}
                name={"typeTempFilter"}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={[
                  { label: "Self", value: "Self" },
                  { label: "All", value: "All" },
                ]}
                handleChange={handleReactSelectChange}
                value={reactSelectState.typeTempFilter}
              />
              <ReactSelect
                placeholderName={"Type"}
                id={"Type"}
                searchable={true}
                name={"type"}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={apiData.getBindConsentTypeAPI.map((item) => {
                  return {
                    value: item?.ID,
                    label: item?.Name,
                  };
                })}
                handleChange={handleReactSelectChange}
                value={reactSelectState.type}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleOpenModal}
                type="button"
              >
                <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
              </button>
              <ReactSelect
                placeholderName={"Template"}
                id={"Template"}
                searchable={true}
                name={"template"}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={apiData.getBindTemplateAPI
                  ?.filter((val) => val.Template_Name !== "")
                  ?.map((item) => {
                    return {
                      value: item?.Template_ID,
                      label: item?.Template_Name,
                    };
                  })}
                handleChange={handleReactSelectChange}
                value={reactSelectState.template}
              />
              {reactSelectState.template && (
                <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                  <button
                    className="btn btn-sm custom-button w-100"
                    onClick={handleDeleteSelectedTemplate}
                  >
                    Delete Selected Template
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="m-2 spatient_registration_card">
          <div className="patient_registration card">
            <Heading title={t("Content")} />
            {/* <ReactQuill
              value={editorValue}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              style={{
                marginBottom: "10px",
                height: "180px",
              }}
            /> */}
            <FullTextEditor
              value={editorValue}
              // value={getTest}
              setValue={handleChange}
              EditTable={Editable}
              setEditTable={setEditable}
            />
          </div>
        </div>

        <div className="m-2 spatient_registration_card">
          <div className="patient_registration card">
            <Heading title={t("Save Template")} />
            <div className="d-flex" style={{ marginBottom: "10px" }}>
              <Input
                type="text"
                className={`form-control ${isCheckSaveTemplate ? "required-fields" : ""}`}
                id="TemplateName"
                lable={t("Template Name")}
                placeholder=" "
                required={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 mt-2 "
                name="appointmentNo"
                onChange={(e) => setTemplateName(e.target.value)}
                value={templateName}
              />

              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <input
                  type="checkbox"
                  id="drink"
                  style={{
                    padding: 0,
                    height: "19px",
                  }}
                  checked={isCheckSaveTemplate}
                  onChange={handleCheckedSaveTemplate}
                />
                <label htmlFor="drink" className="m-2 DangerSign">
                  {t("Save As Template")}
                </label>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 d-flex align-items-center">
                <button
                  className="btn btn-sm custom-button w-100"
                  onClick={
                    btnValue === "Save"
                      ? handleclickSavePatientConsent
                      : handelEditSaveData
                  }
                >
                  {btnValue}
                </button>
              </div>
            </div>
          </div>
        </div>

        <ConsentFormTable
          tbody={apiData.getBindPatientConsentAPI}
          handleSavePatientConsentDelete={handleSavePatientConsentDelete}
          handleEditPatient={handleEditPatient}
        />
      </div>
      {modalData.visible && (
        <Modal
          visible={modalData.visible}
          Header={modalData.Header}
          modalWidth={modalData?.size}
          onHide={modalData?.setVisible}
          handleAPI={handleSaveTypeName}
          setVisible={() => {
            setModalData((val) => ({ ...val, visible: false }));
          }}
        >
          <Input
            type="text"
            className="form-control"
            id="TypeName"
            lable={t("Type Name")}
            placeholder=" "
            required={true}
            respclass="col-xl-12 col-md-4 col-sm-4 col-sm-4 col-12 w1"
            name="appointmentNo"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
          />
        </Modal>
      )}
    </>
  );
});

export default ConcetForm;
