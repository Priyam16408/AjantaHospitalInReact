import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import {
  BindObservationLabcomment,
  EditComment,
  EditTamplate,
  LoadComment,
  RejectComment,
  RejectTamplate,
  SaveComment,
  SaveTamplateInv,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import ReactQuill from "react-quill";
import FullTextEditor from "../../../utils/TextEditor";

function LabObservationComments({ data }) {
  const [editorValue, setEditorValue] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isDefaultTemplate, setIsDefaultTemplate] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [bindObservation, setBindObservation] = useState([]);
  const [bindTableData, setBindTableData] = useState([]);
  const [availableComments, setAvailableComments] = useState('')
  const [Editable, setEditable] = useState(false)

  const [t] = useTranslation();
  const [values, setValues] = useState({
    departmentName: "",
    category: "",
    description: "",
    searchdescription: "",
    availableComments: "",
  });

  const theadInv = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("Comments Name") },
    { width: "5%", name: t("Investigation") },
    { width: "5%", name: t("Edit") },
    { width: "5%", name: t("Reject") },
  ];
  const handleChange = (e) => {
    setAvailableComments(e.target.value)
    // setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setSelectedCommentId(null)
  };

  const handleEdit = async (commentId) => {
    try {
      debugger
      const response = await EditComment(commentId);
      if (response.success) {
        // console.log("the response from editApi is", response);
        // console.log(response.data[0].templateHead);
        // console.log(response.data[0].templateDescription);
        setSelectedCommentId(response.data[0].Comments_ID);
        setAvailableComments(response.data[0].Comments_Head);
        // setValues({ availableComments: response.data[0].Temp_Head });
        setEditorValue(response.data[0].Comments);
        // setCommentId(response?.data[0].Comments_ID);
      } else {
        notify(response.message, "error");
      }
    } catch (error) {
      notify("Error fetching template data", "error");
    }
  };

  const handleBindObservation = async () => {
    try {
      const response = await BindObservationLabcomment();
      if (response.success) {
        setBindObservation(response?.data);
        console.log("the response from the observation", response);
      } else {
        setBindObservation([]);
      }
    } catch (error) {
      setBindObservation([]);
    }
  };

  const ip = localStorage.getItem("ip");
  const handleLoadTamplate = async () => {
    try {
      const response = await LoadComment(values?.investigation?.value);
      if (response.success) {
        console.log("the response is from loadTemplate is", response);
        setBindTableData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        notify(response?.message, "error");
        setBindTableData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindTableData([]);
    }
  };

  const handleRejectTamplate = async (id) => {
    try {
      const response = await RejectComment(id);
      if (response.success) {
        notify(`${response?.message}`, "success");
        handleLoadTamplate();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleEditorVal = (content) => {
    setEditorValue(content);
  };

  const handleSaveTamplateInv = async () => {
    let payload = {
      btnType: "",
      labObservationID: String(values?.investigation?.value),
      commentsHead: availableComments,
      comments: editorValue,
      commentID: 0,
    };
    try {
      debugger
      const apiResp = await SaveComment(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setEditorValue("");
        setValues({
          availableComments: "",
        });
        handleLoadTamplate();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleSaveUpdateTamplate = async () => {
    console.log("the selectedCommentId id is", selectedCommentId);
    if (!selectedCommentId) {
      notify("No template selected for update", "error");
      return;
    }
    // const payload = {
    //   checkdefault: isDefaultTemplate ? 1 : 0,
    //   labInvesDescription: "save",
    //   investigationId: selectedCommentId,
    //   btnType: "Update",
    //   tamplateID: commentId,
    //   tamplateHead: values.availableComments,
    //   tamplateDescription: editorValue,
    // };
    const payload={
      btnType:"save",
      labObservationID: String(values?.investigation?.value),
      commentsHead: availableComments,
      comments: editorValue,
      commentID: selectedCommentId,
    }
    try {
      debugger
      const apiResp = await SaveComment(payload);
      if (apiResp.success) {
        notify(apiResp.message, "success");
        setSelectedCommentId(null);
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };
  useEffect(() => {
    handleBindObservation();
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
            placeholderName={t("Investigation")}
            id={"investigation"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="investigation"
            dynamicOptions={[
              ...handleReactSelectDropDownOptions(
                bindObservation,
                "NAME",
                "LabObservation_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.investigation?.value}`}
          />
        </div>
        {console.log(bindTableData)}

        {bindTableData.length > 0 && (
          <div className="col-xl-6 col-sm-12 p-2">
            <Tables
              thead={theadInv}
              tbody={bindTableData?.map((val, index) => ({
                sno: index + 1,
                test: val?.Investigation,
                Name: val?.Comments_Head,
                edit: (
                  <i
                    className="fa fa-edit"
                    onClick={() => handleEdit(val.Comments_ID)}
                  ></i>
                ),
                delete: (
                  <i
                    className="fa fa-trash text-danger"
                    onClick={() => handleRejectTamplate(val?.Comments_ID)}
                  ></i>
                ),
              }))}
              tableHeight={"scrollView"}
            />
          </div>
        )}
        <Heading title={t("Search")} isBreadcrumb={false} />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            id="availableComments"
            name="availableComments"
            value={availableComments}
            onChange={handleChange}
            label="Available Templates"
            placeholder="Enter template title"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />


          {/* <label className="ml-2">
            <input
              className="mt-2"
              type="checkbox"
              checked={isDefaultTemplate}
              onChange={(e) => setIsDefaultTemplate(e.target.checked)}
            />
            Set This Template as Default Template
          </label> */}
        </div>
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
          {!selectedCommentId ?
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

export default LabObservationComments;
