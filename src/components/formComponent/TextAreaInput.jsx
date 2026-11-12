import React from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";

function TextAreaInput({
  name,
  className,
  respclass,
  id,
  lable,
  value,
  rows,
  maxLength,
  onChange,
  disabled,
  readOnly,
  defaultValue,
  placeholder,
  removeFormGroupClass,
  onFocus,
  showTooltipCount,
}) {
  const [t] = useTranslation();

  return (
    <>
      <Tooltip
        target={`#${id}`}
        position="top"
        content={
          t(lable) +
          ` ${showTooltipCount ? "Count : " + (value?.length ? value?.length : "0") : ""}`
        }
        event="focus"
        className="ToolTipCustom"
      />


      <div className={respclass}  >
        <div className={removeFormGroupClass ? "" : "form-group"}>
          <textarea
            disabled={disabled}
            className={`${className} form-textarea`}
            placeholder={placeholder}
            id={id}
            name={name}
            value={value}
            rows={rows}
            maxLength={maxLength}
            onFocus={onFocus}
            onChange={onChange}
          ></textarea>
          <label htmlFor={id} className="lable truncate">
            {lable}
          </label>
        </div>
      </div>
    </>
  );
}

export default TextAreaInput;
