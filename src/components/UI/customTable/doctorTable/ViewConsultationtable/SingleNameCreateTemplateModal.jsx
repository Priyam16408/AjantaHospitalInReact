import React, { useEffect, useRef, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import Input from "../../../../formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../..";

const SingleNameCreateTemplateModal = ({
  selectedAccordion,
  searchData,
  handleChangeModel,
  editData,
}) => {
  const [templateName, setTemplateName] = useState("");
  const [tags, setTags] = useState([
    { Name: { value: "" }, ID: null, AllItemData: null },
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const { t } = useTranslation();
  const inputRefs = useRef([]);

  const handleTemplateNameChange = (e) => {
    setTemplateName(e.target.value);
  };

useEffect(() => {
  const lastIndex = tags.length - 1;
  const lastItem = tags[lastIndex];

  if (lastItem?.Name?.value === "") {
    const focusInput = () => {
      const nextAutoComplete = inputRefs.current[lastIndex];
      if (nextAutoComplete?.focus) {
        nextAutoComplete.focus();
      } else {
        setTimeout(focusInput, 50); 
      }
    };

    focusInput();
  }
}, [tags]);



  const handleSearch = (e) => {
    const query = e.query.trim().toLowerCase();
    const searchArray = searchData[selectedAccordion.DisplayName] || [];

    if (query && Array.isArray(searchArray)) {
      const filtered = searchArray.filter(
        (item) =>
          item?.TemplateName?.toLowerCase()?.includes(query) ||
          item?.AllItemData?.TypeName?.toLowerCase()?.includes(query)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleChange = (e, index) => {
    const updated = [...tags];
    updated[index].Name = { value: e.target.value };
    updated[index].ID = null;
    updated[index].AllItemData = null;
    setTags(updated);
  };

  const hasEmptyRow = (arr) =>
    arr.some((item) => item?.Name?.value?.trim() === "");

  const handleSelect = (e, index) => {
    const selectedItem = e.value;

    const updated = [...tags];
    updated[index] = {
      Name: { value: selectedItem.TemplateName },
      ID: selectedItem.ID,
      AllItemData: selectedItem.AllItemData,
    };

    if (!hasEmptyRow(updated)) {
      updated.push({ Name: { value: "" }, ID: null, AllItemData: null });
    }

    setTags(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const updated = [...tags];
      if (!hasEmptyRow(updated)) {
        updated.push({ Name: { value: "" }, ID: null, AllItemData: null });
        setTags(updated);
      }
      e.preventDefault();
    }
  };

  let Thead = [
    { name: "S.No.", width: "10%" },
    { name: "Name", width: "60%" },
    { name: "Action", width: "10%" },
  ];
  const deleteItem = (index) => {
    if (tags?.length > 1) {
      const updatedTags = tags?.filter((_, i) => i !== index);
      setTags(updatedTags);
    }
  };

  useEffect(() => {
    handleChangeModel((prev) => ({
      ...prev,
      tagsData: tags,
      templateName: templateName,
      templateId: selectedAccordion?.templateData?.ID,
    }));
  }, [tags, templateName]);

  useEffect(() => {
    if (editData) {
      setTemplateName(editData.templateName || "");
      setTags(
        editData.tagsData?.length > 0
          ? [...editData.tagsData]
          : [{ Name: { value: "" }, ID: null, AllItemData: null }]
      );
    }
  }, [editData]);

  return (
    <div>
      <div className="mb-3">
        <Input
          type="text"
          className="form-control"
          value={selectedAccordion?.DisplayName}
          lable={selectedAccordion?.DisplayName}
          placeholder=" "
          disabled={true}
        />
        <Input
          type="text"
          className="form-control"
          id="template Name"
          name={"templateName"}
          value={templateName}
          onChange={handleTemplateNameChange}
          lable={t("Template Name")}
          disabled={editData?.templateName ? true : false}
          placeholder=" "
        />
      </div>

      <Tables
        thead={Thead}
        tbody={tags?.map((item, index) => ({
          SNo: index + 1,
          input: (
            <AutoComplete
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              value={item?.Name?.value}
              suggestions={suggestions}
              completeMethod={handleSearch}
              field="TemplateName"
              onKeyPress={handleKeyPress}
              onChange={(e) => handleChange(e, index)}
              onSelect={(e) => handleSelect(e, index)}
              className="w-100"
            />
          ),
          icon:
            tags.length > 1 ? (
              <button
                className="btn hover-icon"
                onClick={() => deleteItem(index)}
              >
                <i className="fa fa-trash text-danger "></i>
              </button>
            ) : null,
        }))}
      />
    </div>
  );
};

export default SingleNameCreateTemplateModal;
