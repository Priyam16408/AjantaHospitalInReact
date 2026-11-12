import React, { useEffect, useRef, useState } from "react";
import Input from "../../../../formComponent/Input";
import {
  PrescriptionAdviceDeleteTemplate,
  DeleteMedicineTemplate,
  getDeleteActionTemplate,
} from "../../../../../networkServices/DoctorApi";
import { notify } from "../../../../../utils/utils";

const Favorite = ({
  data,
  name,
  handleChange,
  refresh,
  handleGetInvestigationTemplate,
  Id,
  favTempData,
  patientDetails,
  labCategoryIds,
  tags,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("bottom");
  const [isFavorite, setIsFavorite] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [starLoading, setStarLoading] = useState(false);
  const [baseFilteredData, setBaseFilteredData] = useState([]);
  const ref = useRef();
  const triggerRef = useRef();

  const isTemplateActive = (template) => {
    const activeTags = tags?.[name] || [];
    return activeTags.some(
      (tag) =>
        (tag?.isDefaultTemplate &&
          Number(tag?.isDefaultTemplate) === Number(template?.ID)) ||
        (tag?.TemplateID &&
          Number(tag?.TemplateID) === Number(template?.ID)) ||
        (tag?.ID && Number(tag?.ID) === Number(template?.ID)) ||
        (tag?.templateId && Number(tag?.templateId) === Number(template?.ID)) ||
        (tag?.ValueField && tag?.ValueField === template?.ValueField) ||
        (tag?.ValueField && tag?.ValueField === template?.TemplateName) ||
        (tag?.TemplateName && tag?.TemplateName === template?.TemplateName) ||
        (tag?.TypeName && tag?.TypeName === template?.TypeName)
    );
  };

  const handleClickOutside = (event) => {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      !triggerRef.current.contains(event.target)
    ) {
      setVisible(false);
    }
  };

  const checkPosition = () => {
    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      if (spaceBelow < 250 && spaceAbove > 250) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
      setFilteredData(baseFilteredData);
      return;
    }
    const searched = baseFilteredData?.filter(
      (item) =>
        item?.TemplateName?.toLowerCase()?.includes(query) ||
        item?.TypeName?.toLowerCase()?.includes(query)
    );
    setFilteredData(searched);
  };

  const deleteTemplate = async (items, name) => {
    if (name === "Prescribed Medicine") {
      try {
        const response = await DeleteMedicineTemplate(items.ID);
        if (response?.success) {
          refresh?.((prev) => !prev);
          notify(response.message, "success");
        } else {
          console.error(
            "API returned success as false or invalid response:",
            response
          );
        }
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    } else {
      try {
        let payload = {
          id: items?.ID,
          templateFor: items?.templateFor,
        };
        const response = await PrescriptionAdviceDeleteTemplate(payload);
        if (response.success) {
          notify(response?.message, "success");
          handleGetInvestigationTemplate?.(Id);
        } else {
          console.error(
            "API returned success as false or invalid response:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    }
  };
  const deleteOthersTemplate = async (items) => {
    try {
      const payload = {
        id: Number(items?.ID),
        valueField: String(items?.ValueField),
        templateName: String(items?.TemplateName),
        doctorID: "",
        templateFor: Number(items?.templateFor),
      };
      const response = await getDeleteActionTemplate(payload);
      if (response.success) {
        notify(response?.message, "success");
        handleGetInvestigationTemplate?.(items?.ID, items?.templateFor);
        refresh?.((prev) => !prev);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const onStarClick = async () => {
    setStarLoading(true);

    if (!isFavorite) {
      setIsFavorite(true);
      await handleGetInvestigationTemplate(Id);
    } else {
      setIsFavorite(false);
    }

    setStarLoading(false);
  };

  useEffect(() => {
    const sourceData = isFavorite ? favTempData : data;
    if (!sourceData) return;
    const shouldFilterByCategory = name === "Investigation(Lab & Radio)";
    const filtered = sourceData?.filter((ele) => {
      const matchesCategory =
        !shouldFilterByCategory ||
        !labCategoryIds.categoryId ||
        ele?.categoryID == labCategoryIds.categoryId;
      const matchesSubCategory =
        !shouldFilterByCategory ||
        !labCategoryIds.subCategoryId ||
        ele?.subCategoryID == labCategoryIds.subCategoryId;
      return matchesCategory && matchesSubCategory;
    });
    setBaseFilteredData(filtered);
    setFilteredData(filtered);
  }, [data, favTempData, labCategoryIds, name, isFavorite]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", checkPosition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", checkPosition);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      checkPosition();
    }
  }, [visible]);

  return (
    <div>
      <div
        className="px-1"
        style={{ cursor: "pointer" }}
        onClick={() => setVisible(!visible)}
        ref={triggerRef}
      >
        <i className="pi pi-folder-open"></i>
      </div>
      {visible && (
        <div
          ref={ref}
          style={{
            position: "absolute",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px black",
            background: "white",
            width: "50%",
            padding: "5px",
            zIndex: 10,
            // top: position === "bottom" ? "32px" : "auto",
            // bottom: position === "top" ? "32px" : "auto",
          }}
        >
          <div className="d-flex align-items-baseline">
            {(name === "Investigation(Lab & Radio)" ||
              name === "Prescribed Procedure") && (
              <div className="px-1" style={{ cursor: "pointer" }}>
                <i
                  className={`pi pi-star-fill font-size16 ${isFavorite ? "text-primary" : "text-secondary"} ${starLoading ? "pi-spin" : ""}`}
                  style={{
                    pointerEvents: starLoading ? "none" : "auto",
                  }}
                  onClick={!starLoading ? onStarClick : null}
                ></i>
              </div>
            )}
            <div
              style={{ fontSize: "13px !important", flexGrow: "1" }}
              className="mb-2"
            >
              <Input
                placeholder={" "}
                className="form-control"
                lable={name}
                id={"name"}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div
            style={{
              maxHeight: "250px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            {!filteredData?.length > 0 ? (
              "No Data Found"
            ) : (
              <>
                {filteredData?.map((items, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="mx-1 d-flex justify-content-between"
                      >
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            id={items?.TemplateName}
                            className="mx-1"
                            name="isChecked"
                            checked={isTemplateActive(items)}
                            onChange={(e) =>
                              handleChange(
                                e,
                                index,
                                name,
                                items,
                                name,
                                isFavorite
                              )
                            }
                          />
                          <label
                            className="m-0"
                            htmlFor={items?.TemplateName}
                            style={{ cursor: "pointer", fontWeight: "500" }}
                            onDoubleClick={() => {
                              if (patientDetails) {
                                patientDetails({
                                  ID: Id,
                                  DisplayName: name,
                                  isEdit: true,
                                  templateData: items,
                                });
                              }
                            }}
                          >
                            {items?.TemplateName}
                          </label>
                        </div>
                        {patientDetails && (
                          <>
                            {name === "Prescribed Medicine" ? (
                              <div className="d-flex">
                                <span
                                  onClick={() => {
                                    patientDetails({
                                      ID: Id,
                                      DisplayName: name,
                                      AccordianName: name,
                                      isEdit: true,
                                      templateData: items,
                                    });
                                  }}
                                  className="flex-end hover-icon"
                                >
                                  <i className="fa fa-pen text-primary pr-3" />
                                </span>
                                <span
                                  onClick={() => {
                                    deleteTemplate(items, name);
                                  }}
                                  className="flex-end hover-icon"
                                >
                                  <i className="fa fa-trash text-danger" />
                                </span>
                              </div>
                            ) : items?.IsTemplate ? (
                              <>
                                <div className="d-flex">
                                  <span
                                    onClick={() => {
                                      patientDetails({
                                        ID: Id,
                                        DisplayName: name,
                                        isEdit: true,
                                        templateData: items,
                                      });
                                    }}
                                    className="flex-end hover-icon"
                                  >
                                    <i className="fa fa-pen text-primary pr-3" />
                                  </span>
                                  <span
                                    onClick={() => {
                                      deleteTemplate(items, name);
                                    }}
                                    className="flex-end hover-icon"
                                  >
                                    <i className="fa fa-trash text-danger" />
                                  </span>
                                </div>
                              </>
                            ) : !(Id === 2 || Id === 3) ? (
                              <div className="d-flex">
                                <span
                                  onClick={() => {
                                    patientDetails({
                                      ID: Id,
                                      DisplayName: name,
                                      isEdit: true,
                                      templateData: items,
                                    });
                                  }}
                                  className="flex-end hover-icon"
                                >
                                  <i className="fa fa-pen text-primary pr-3" />
                                </span>
                                <span
                                  onClick={() => {
                                    deleteOthersTemplate(items, name);
                                  }}
                                  className="flex-end hover-icon"
                                >
                                  <i className="fa fa-trash text-danger" />
                                </span>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorite;
