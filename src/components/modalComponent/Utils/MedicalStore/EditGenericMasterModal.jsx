import React, { useEffect, useState } from "react";
import ReactSelect from "../../../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../formComponent/Input";
import { GenericStatusOptions } from "../../../../utils/constant";
import { AutoComplete } from "primereact/autocomplete";
import { BindGeneric } from "../../../../networkServices/InventoryApi";

const EditGenericMasterModal = ({
  handleChangeModel,
  payload,
  bindGeneric,
  errors,
  setErrors,
}) => {
  const [genericInputValue, setGenericInputValue] = useState("");
  const [genericSuggestions, setGenericSuggestions] = useState([]);

  const [t] = useTranslation();
  const [values, setValues] = useState(payload);
  useEffect(() => {
    const mappedSuggestions = (bindGeneric || []).map((ele) => ({
      NAME: ele.NAME,
      VALUE: ele.VALUE,
    }));
    setGenericSuggestions(mappedSuggestions);
  }, [bindGeneric]);
  const handleGenericSearch = async (event) => {
    const query = { event };
    const filtered = await BindGeneric(query);
    setGenericSuggestions(
      filtered?.data?.map((ele) => ({ NAME: ele.NAME, VALUE: ele.VALUE }))
    );
  };
  const handleGenericSelect = (e) => {
    setValues((prev) => ({
      ...prev,
      Generic: e.value.VALUE,
      Edit: e.value.NAME, // Pre-filling Edit field
    }));
    setGenericInputValue(e.value.NAME);
  };
  console.log("Values after handleSavGeneric" , values)
  const handleGenericChange = (e) => {
    setGenericInputValue(e.value);
    if (!e.value) {
      setValues((prev) => ({
        ...prev,
        Generic: "",
        Edit: "",
      }));
    }
  };

  console.log("HandleGenericChANGE" , values)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleReactSelect = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value?.value || "",
      ...(name === "Generic" && { Edit: value?.label || "" }),
    }));
  };

  useEffect(() => {
    handleChangeModel(values);
  }, [values]);

  return (
    <>
      <div className="row">
        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
          <AutoComplete
            style={{ width: "100%" }}
            placeholder={t("Generic")}
            value={genericInputValue}
            suggestions={genericSuggestions}
            completeMethod={handleGenericSearch}
            className={`required-fields ${errors?.Generic && "required-fields-active"}`}
            onSelect={handleGenericSelect}
            onChange={handleGenericChange}
            itemTemplate={(item) => (
              <div style={{ fontSize: "12px", width: "100%" }}>{item.NAME}</div>
            )}
            field="NAME"
          />
        </div>

        <Input
          type="text"
          className={`form-control required-fields ${errors?.Edit && "required-fields-active"}`}
          id="Edit"
          name="Edit"
          onChange={handleChange}
          value={values?.Edit || ""}
          lable={t("Edit")}
          placeholder=" "
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Status")}
          id={"Status"}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
          name={"Status"}
          dynamicOptions={GenericStatusOptions}
          value={values?.Status}
          handleChange={handleReactSelect}
        />
      </div>
    </>
  );
};

export default EditGenericMasterModal;
