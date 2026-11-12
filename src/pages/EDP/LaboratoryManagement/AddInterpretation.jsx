import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import { formats, modules } from "../../../utils/constant";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  ManagementBindInvestigation,
  SaveInvestigation,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import FullTextEditor from "../../../utils/TextEditor";

function AddInterpretation({ data }) {
  const [bindInvestigation, setBindInvestigation] = useState([]);
  const [t] = useTranslation();
  const [values, setValues] = useState({
    investigation: "",
  });

  const [editorValue, setEditorValue] = useState("");
  const [Editable, setEditable] = useState(false)


  const handleEditorVal = (content) => {
    setEditorValue(content);
  };

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBindInvestigation = async () => {
    try {
      const response = await ManagementBindInvestigation();
      if (response.success) {
        setBindInvestigation(response.data);
        console.log("the response from api is", response);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindInvestigation([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindInvestigation([]);
    }
  };

  // SaveInvestigation

  const handleSaveInvestigation = async () => {
    if (!values?.investigation?.value) {
      notify("please select the Investigation", "error");
      return;
    }
    const payload = {
      invstigationID: values?.investigation?.value,
      interpretation: editorValue,
    };

    try {
      const apiResp = await SaveInvestigation(payload);
      if (apiResp.success) {
        notify("record save successFully...", "success");
        setEditorValue("");
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
    }
  };
  useEffect(() => {
    handleBindInvestigation();
  }, []);

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
            placeholderName={t("Select an Option")}
            id={"investigation"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="investigation"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                bindInvestigation,
                "Name",
                "Investigation_id"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.investigation?.value}`}
          />
        </div>
        <div>
          {/* <ReactQuill
            value={editorValue}
            onChange={handleEditorVal}
            modules={modules}
            formats={formats}
            style={{ height: "100%", width: "100%" }}
          /> */}
          <FullTextEditor
            value={editorValue}
            // value={getTest}
            setValue={handleEditorVal}
            EditTable={Editable}
            setEditTable={setEditable}
          />


          <div className="col-12 mt-2 mb-2 d-flex justify-content-end">
            <button
              onClick={handleSaveInvestigation}
              className="btn btn-sm btn-success ms-auto"
              type="button"
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddInterpretation;
