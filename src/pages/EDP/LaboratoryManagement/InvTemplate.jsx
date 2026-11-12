import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import {
  BindCategorylabortarymanagment,
  BindinvestigationTamplate,
  BindObservationType,
  EditTamplate,
  LoadHeadDepartment,
  LoadTamplate,
  RejectTamplate,
  SaveObservation,
  SaveTamplateInv,
  SaveUpdateTamplate,
  UpdateObservation,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import ReactQuill from "react-quill";
import { formats, modules } from "../../../utils/constant";
import FullTextEditor from "../../../utils/TextEditor";

function InvTemplate({ data }) {
  const [bindInvestigation, setBindInvestigation] = useState([]);
  const [Invdata, setInvdata] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [isDefaultTemplate, setIsDefaultTemplate] = useState(false);
  const [Editable, setEditable] = useState(false)

  const [templateId, setTemplateId] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState('')
  const [t] = useTranslation();
  const [values, setValues] = useState({
    department: { value: "0", label: "ALL" },
    category: "",
    description: "",
    searchdescription: "",
    // availableTemplates: "",
  });

  const theadInv = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("Tempelate Name") },
    { width: "5%", name: t("Investigation") },
    { width: "5%", name: t("Edit") },
    { width: "5%", name: t("Reject") },
  ];
  // const handleChange = (e) => {
  //   setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };
  const handleChange = (e) => {
    setAvailableTemplates(e.target.value);
  };
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setSelectedTemplateId(null)
  };

  const handleEdit = async (templateId) => {
    try {
      const response = await EditTamplate(templateId);
      if (response.success) {
        //     console.log("the response from editApi is", response);
        //     console.log(response.data[0].templateHead);
        //     console.log(response.data[0].templateDescription);
        setSelectedTemplateId(response.data[0].Investigation_ID);
        setAvailableTemplates(response.data[0].Temp_Head);
        // setValues({ availableTemplates: response.data[0].Temp_Head });
        setEditorValue(response.data[0].Template_Desc);
        setTemplateId(response?.data[0].Template_ID);
      } else {
        notify(response.message, "error");
      }
    } catch (error) {
      notify("Error fetching template data", "error");
    }
  };

  // BindCategorylabortarymanagment

  const handleBindDepartment = async () => {
    try {
      const response = await LoadHeadDepartment();
      if (response.success) {
        setDepartmentData(response?.data);
        console.log("the department from api is work", response);
      } else {
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setDepartmentData([]);
    }
  };

  const handleBindCategory = async () => {
    try {
      const response = await BindinvestigationTamplate();
      if (response.success) {
        setBindInvestigation(response?.data);
        console.log("the bind investigation is", response);
        console.log("the response from api is work", response);
      } else {
        setBindInvestigation([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindInvestigation([]);
    }
  };
  const ip = localStorage.getItem("ip");

  const handleLoadTamplate = async () => {
    try {
      const response = await LoadTamplate(values?.investigation?.value);
      if (response.success) {
        console.log("the response is from loadTemplate is", response);
        setInvdata(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        notify(response?.message, "error");
        setInvdata([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setInvdata([]);
    }
  };

  const handleRejectTamplate = async (id) => {
    try {
      const response = await RejectTamplate(id);
      if (response.success) {
        notify(`${response?.message}`, "success");
        handleLoadTamplate();
        setAvailableTemplates('');
        setEditorValue('')
        setSelectedTemplateId(null)
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  //   const handleInputChange = (e, index, field) => {
  //     const { value } = e.target;
  //     const updatedData = [...observationData];
  //     updatedData[index][field] = value;
  //     setObservationData(updatedData);
  //   };
  const handleEditorVal = (content) => {
    setEditorValue(content);
  };

  // const handleEdit = async (index) => {
  //   const Name = observationData[index].Name;
  //   const printSequence = observationData[index].PrintSequence;
  //   const observationId = observationData[index].ObservationType_ID;

  //   const payload = {
  //     observationTypeID: observationId,
  //     description: "",
  //     name: Name,
  //     flag: true,
  //     printSequence: Number(printSequence),
  //     groupID: 0,
  //     active: true,
  //     logo: "",
  //   };

  //   try {
  //     const apiResp = await UpdateObservation(payload);
  //     if (apiResp.success) {
  //       notify("Data edited successfully...", "success");

  //     } else {
  //       notify("Some error occurred", "error");
  //     }
  //   } catch (error) {
  //     notify("An error occurred while saving data", "error");
  //   }
  // };

  const handleSaveTamplateInv = async () => {
    if(!values?.investigation?.value){
      notify("Please select Invetigation","warn")
      return;
    }
    if(!availableTemplates){
      notify("Enter Template title","warn")
      return;
    }
    const payload = {
      labInvesDescription: "",
      checkdefault: isDefaultTemplate ? 1 : 0,
      investigationId: values?.investigation?.value,
      tamplateID: templateId ? templateId : 0,
      btnType: "save",
      tamplateHead: availableTemplates,
      tamplateDescription: editorValue,
    };

    try {
      const apiResp = await SaveTamplateInv(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setEditorValue("");
        setAvailableTemplates("");
        handleLoadTamplate();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  // const handleSaveUpdateTamplate = async () => {
  //   const payload = {
  //     tamplateHead: "dfg",
  //     tamplateDescription: "update",
  //   };
  //   try {
  //     const apiResp = await SaveUpdateTamplate(payload);
  //     if (apiResp.success) {
  //       notify(apiResp?.message, "success");
  //       handleLoadTamplate();
  //     } else {
  //       notify(apiResp?.message, "error");
  //     }
  //   } catch (error) {
  //     notify("An error occurred while saving data", "error");
  //   }
  // };

  const handleSaveUpdateTamplate = async () => {
    console.log("the selectedTemplateId id is", selectedTemplateId);
    if (!selectedTemplateId) {
      notify("No template selected for update", "error");
      return;
    }
    const payload = {
      checkdefault: isDefaultTemplate ? 1 : 0,
      labInvesDescription: "update",
      investigationId: selectedTemplateId,
      btnType: "Update",
      tamplateID: templateId,
      tamplateHead: availableTemplates,
      tamplateDescription: editorValue,
    };
    try {
      const apiResp = await SaveTamplateInv(payload);
      if (apiResp.success) {
        notify(apiResp.message, "success");
        setSelectedTemplateId(null);
        handleLoadTamplate();
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };
  useEffect(() => {
    handleBindCategory();
    handleBindDepartment();
  }, []);

  useEffect(() => {
    handleLoadTamplate();
  }, [values?.investigation?.value]);
  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={data?.breadcrumb}
          // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
          data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="department"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                departmentData,
                "Name",
                "ObservationType_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
          />

          <ReactSelect
            placeholderName={t("Investigation")}
            id={"investigation"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="investigation"
            dynamicOptions={[
              // { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                bindInvestigation,
                "Name",
                "Investigation_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.investigation?.value}`}
          />
        </div>

        {Invdata.length > 0 && (
          <div className="col-xl-6 col-sm-12 p-2">
            <Tables
              thead={theadInv}
              tbody={Invdata?.map((val, index) => ({
                sno: index + 1,
                test: val?.Temp_Head,
                Investigation: val?.Investigation,
                edit: (
                  <i
                    className="fa fa-edit"
                    onClick={() => handleEdit(val.Template_ID)}
                  ></i>
                ),
                delete: (
                  <i
                    className="fa fa-trash text-danger"
                    onClick={() => handleRejectTamplate(val?.Template_ID)}
                  ></i>
                ),
              }))}
              tableHeight={"scrollView"}
            // style={{ height: "60vh", padding: "2px" }}
            />
          </div>
        )}

        <Heading
          title={data?.breadcrumb}
          // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
          data={data}
          isSlideScreen={true}
          isBreadcrumb={false}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          {/* <Input
            type="text"
            className="form-control"
            id="availableTemplates"
            name="availableTemplates"
            value={values?.availableTemplates}
            onChange={handleChange}
            lable={t("Available Templates")}
            placeholder=""
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> */}

          <Input
            type="text"
            className="form-control"
            id="availableTemplates"
            name="availableTemplates"
            value={availableTemplates}
            onChange={(handleChange)}
            label="Available Templates"
            placeholder="Enter template title"
            respclass="col-xl-2 col-md-4 col-sm-4 col-6"
          />

          <div className="col-6 col-lg-6">
            <label
              className="d-flex align-items-center ml-3"
              style={{ cursor: "pointer" }}
            >
            <input
              className="mr-1"
              type="checkbox"
              checked={isDefaultTemplate}
              onChange={(e) => setIsDefaultTemplate(e.target.checked)}
            />
              {t("Set This Template as Default Template")}
            </label>
          </div>

          {/* <label className="ml-2">
            <input
              className="mt-2"
              type="checkbox"
              checked={isDefaultTemplate}
              onChange={(e) => setIsDefaultTemplate(e.target.checked)}
            />
            {t("Set This Template as Default Template")}
          </label> */}
        </div>
        {/* <ReactQuill
          value={editorValue}
          onChange={handleEditorVal}
          modules={modules}
          formats={formats}
          style={{ height: "100%", width: "100%" }}
        /> */}
        {/* <ReactQuill
          value={editorValue}
          onChange={handleEditorVal}
          modules={{ toolbar: true }}
          formats={["bold", "italic", "underline"]}
          style={{ height: "100%", width: "100%" }}
        /> */}

        <FullTextEditor
          value={editorValue}
          // value={getTest}
          setValue={handleEditorVal}
          EditTable={Editable}
          setEditTable={setEditable}
        />
        <div className="col-sm-12 col-xl-12 d-flex justify-content-end">
          {!selectedTemplateId ?
            <button
              className="btn btn-lg btn-success mt-2 mb-2"
              type="button"
              onClick={handleSaveTamplateInv}
            >
              {t("Save")}
            </button>
            :
            <button
              className="btn btn-lg btn-success mt-2 mb-2"
              type="button"
              onClick={handleSaveUpdateTamplate}
            >
              {t("Update")}
            </button>
          }
        </div>
      </div>
    </>
  );
}

export default InvTemplate;
