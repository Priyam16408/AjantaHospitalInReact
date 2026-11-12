import { MultiSelect } from "primereact/multiselect";

const MultiSelectComp = (props) => {
  const {
    respclass,
    dynamicOptions,
    value,
    handleChange,
    name,
    placeholderName,
    requiredClassName,
    disabled,
    isRemoveTemplate,
    itemTemplate,
    overlayVisible,
    onToggle,
  } = props;

  const isMobile = window.innerWidth <= 768;

  const truncate = (str, maxLength) => {
    if (str?.length > maxLength) {
      return isMobile ? str : str?.substring(0, maxLength) + "...";
    }
    return str;
  };

  const customItemTemplate = (option) => {
    if (!isRemoveTemplate) {
      return <div>{truncate(option.name, 20)}</div>;
    } else {
      return <div style={{ textWrap: "auto" }}>{option.name}</div>;
    }
  };

  return (
    <div className={respclass}>
      <div className="form-controls mb-2">
        <div className="panel-hover-container">
          <span
            className={`panel-hover-label ${value && value.length ? "active" : ""}`}
          >
            {placeholderName}
          </span>

          <MultiSelect
            filter
            value={value}
            id="multiSelect"
            onChange={(e) => handleChange(name, e.value)}
            options={dynamicOptions}
            optionLabel="name"
            placeholder={!value || !value.length ? placeholderName : ""}
            maxSelectedLabels={3}
            className={`multiselect ${requiredClassName ? "required-fields" : ""}`}
            name={name}
            closeIcon
            itemTemplate={itemTemplate ? itemTemplate : customItemTemplate}
            disabled={disabled}
            {...(overlayVisible !== undefined && { overlayVisible })}
            {...(onToggle && {
              onOverlayHide: () => onToggle(false),
              onShow: () => onToggle(true),
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiSelectComp;
