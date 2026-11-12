import React, { useCallback, useEffect, useRef, useState } from "react";
import Tables from "../..";
import { AutoComplete } from "primereact/autocomplete";
import {
  GetMedicineDose,
  MedicineItemSearch,
} from "../../../../../networkServices/DoctorApi";
import Input from "../../../../formComponent/Input";
import { PRESCRIBED_MEDICINE } from "../../../../../utils/constant";
import { FileOpenIcon } from "../../../../SvgIcons";

function PrescribedMedicineTable({
  DoctorID,
  tags,
  setTags,
  type,
  presTable,
  setPresTable,
  isDesktop,
  isShowFirst,
  apiData,
}) {
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  // debugger
  const [editingCell, setEditingCell] = useState({ row: null, field: null });
  const [editingGenericIndex, setEditingGenericIndex] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [medicineData, setMedicineData] = useState([]);
  const KEYS_NAME = "Prescribed Medicine";
  const autoCompleteRefs = useRef([]);
  const doseAutoCompleteRefs = useRef([]);
  const timeAutoCompleteRefs = useRef([]);
  const durationAutoCompleteRefs = useRef([]);
  const mealAutoCompleteRefs = useRef([]);
  const routeAutoCompleteRefs = useRef([]);
  const headerAutoCompleteRefs = useRef({});
  const itemsRef = useRef({ Name: [] });
  const searchCache = useRef({});
  const [items, setItems] = useState({
    Name: [],
    Dose: [],
    Time: [],
    Duration: [],
    Meal: [],
    Route: [],
    AllItemListData: [],
  });

  const [headerSelected, setHeaderSelected] = useState({
    Time: null,
    Meal: null,
    Duration: null,
    Route: null,
    Remarks: null,
  });

  const transformAndSetData = (medicines) => {
    if (!medicines) {
      return;
    } else {
      const transformedData = medicines?.[0]?.medicines?.map((med) => ({
        ItemCode: "",
        Typename: med.medicineName,
        ItemID: med.medicine_ID,
        MedicineType: "",
        Dose: { value: med.dose },
        Duration: { value: med.noOfDays },
        Meal: { value: med.meal },
        Route: { value: med.route },
        Times: { value: med.noTimesDay },
        Brand: med.medicineName,
        Generic: med?.composition?.trim() ? med.composition : med?.generic,
        value: med.medicineName,
      }));

      setMedicineData(transformedData);
    }
  };

  useEffect(() => {
    if (apiData) {
      transformAndSetData(apiData
      );
    }
  }, [apiData]);

  const [filteredItems, setFilteredItems] = useState({
    Name: [],
    Dose: [],
    Time: [],
    Duration: [],
    Meal: [],
    Route: [],
  });
  const [newSearchItems, setNewSearchItems] = useState({
    Name: [],
    Dose: [],
    Time: [],
    Duration: [],
    Meal: [],
    Route: [],
  });

  const shouldShowAllFields =
    import.meta.env.VITE_APP_FIELD_VISIBILITY === "true";

  const allFields = [
    "Time",
    "Meal",
    "Duration",
    // "Route",
    // "Quantity",
    "Remarks",
  ];
  const hiddenFieldsWhenFalse = ["Route", "Quantity"];

  const visibleFields = shouldShowAllFields
    ? allFields
    : allFields.filter((field) => !hiddenFieldsWhenFalse.includes(field));

  let Thead = [
    { name: "S.No.", width: "3%" },
    { name: "Name", width: "35%" },

    ...visibleFields,
  ];

  const calculateQuantity = (duration, times) => {
    const days = parseInt(duration?.Factor);
    const perDay = parseInt(times?.Factor);
    return days * perDay;
  };
  const flattenTags = (arr) =>
    arr.map((row) => (Array.isArray(row) ? row[0] : row));

  // Shallow-copies (and flattens) the rows instead of JSON deep-cloning the whole
  // table on every keystroke. Handlers replace whole field objects, never mutate them.
  const cloneRows = (rows) =>
    (rows || []).map((row) => ({ ...(Array.isArray(row) ? row[0] : row) }));

  const savePresetToLocalStorage = (medicineID, fields) => {
    if (!DoctorID || !medicineID) return;
    try {
      const presetKey = `doctor_medicine_presets_${DoctorID}`;
      const existingPresets = JSON.parse(localStorage.getItem(presetKey) || "{}");
      existingPresets[medicineID] = {
        ...(existingPresets[medicineID] || {}),
        ...fields,
      };
      localStorage.setItem(presetKey, JSON.stringify(existingPresets));
    } catch (err) {
      console.error("Error saving medicine preset:", err);
    }
  };

  const onHeaderSelect = (e, category) => {
    const { value } = e;
    const selectedValue = value?.HindiText || (value?.Text ? value.Text.split("#")[0] : value);
    const newHeaderValue = {
      value: selectedValue,
      ID: value?.ID,
      Factor: value?.Factor,
    };

    setHeaderSelected((prev) => ({
      ...prev,
      [category]: newHeaderValue,
    }));

    const blankUpdatedRow = tags[KEYS_NAME].map((row) => {
      const hasMedicineID =
        (row?.AllItemListData && row.AllItemListData.medicine_ID) ||
        (row?.Name && row.Name.ID);

      if (!hasMedicineID) {
        return row;
      }

      return {
        ...row,
        [category]: newHeaderValue,
        Quantity: row.Quantity?.isManual
          ? row.Quantity
          : category === "Duration" && row.Time
            ? { value: calculateQuantity(newHeaderValue, row.Time) }
            : category === "Time" && row.Duration
              ? { value: calculateQuantity(row.Duration, newHeaderValue) }
              : row.Quantity,
      };
    });

    setTags({
      ...tags,
      [KEYS_NAME]: flattenTags(blankUpdatedRow),
    });

    if (DoctorID) {
      blankUpdatedRow.forEach((row) => {
        const medicineID = row?.Name?.ID || row?.AllItemListData?.medicine_ID;
        if (medicineID) {
          savePresetToLocalStorage(medicineID, {
            [category]: row[category]
          });
        }
      });
    }

    const sequence = ["Dose", "Time", "Meal", "Duration", "Route"];
    const nextIndex = sequence.indexOf(category) + 1;
    const nextField = sequence[nextIndex];

    setTimeout(() => {
      if (nextField && headerAutoCompleteRefs.current[nextField]) {
        headerAutoCompleteRefs.current[nextField].focus();
        headerAutoCompleteRefs.current[nextField].show();
      }
    }, 50);

    setHeaderSelected((prev) => ({
      ...prev,
      [category]: null,
    }));
  };

  const handleHeaderRemarksChange = (e) => {
    const { value, name } = e.target;
    const newHeaderValue = { value };

    setHeaderSelected((prev) => ({
      ...prev,
      [name]: newHeaderValue,
    }));

    const updatedTags = tags[KEYS_NAME].map((row) => {
      const hasMedicineID =
        (row?.AllItemListData && row.AllItemListData.medicine_ID) ||
        (row?.Name && row.Name.ID);

      if (!hasMedicineID) {
        return row;
      }

      return {
        ...row,
        [name]: newHeaderValue,
      };
    });

    setTags({
      ...tags,
      [KEYS_NAME]: flattenTags(updatedTags),
    });

    if (DoctorID) {
      updatedTags.forEach((row) => {
        const medicineID = row?.Name?.ID || row?.AllItemListData?.medicine_ID;
        if (medicineID) {
          savePresetToLocalStorage(medicineID, {
            [name]: row[name]
          });
        }
      });
    }
  };

  const getRefCollection = (field) => {
    switch (field) {
      case "Dose":
        return doseAutoCompleteRefs;
      case "Time":
        return timeAutoCompleteRefs;
      case "Duration":
        return durationAutoCompleteRefs;
      case "Meal":
        return mealAutoCompleteRefs;
      case "Route":
        return routeAutoCompleteRefs;
      default:
        return null;
    }
  };
  const StaticItemTemplate = (item) => {
    const doseValue = item?.Text ? item.Text.split("#")[0] : item;
    return (
      <div
        className="d-flex align-items-center py-2 px-1"
        style={{
          fontSize: "12px",
          color: "#333",
          fontFamily: "inherit"
        }}
      >
        <i className="pi pi-angle-right mr-2" style={{ fontSize: "10px", color: "#888" }}></i>
        <span style={{ fontWeight: "500" }}>{doseValue}</span>
      </div>
    );
  };
  const renderHeaderAutoField = (field) => {
    const refCollection = getRefCollection(field);

    return (
      <>
        <AutoComplete
          ref={(el) => (headerAutoCompleteRefs.current[field] = el)}
          suggestions={Array.isArray(filteredItems[field]) ? filteredItems[field] : []}
          completeMethod={(e) => searchStatic(e, field)}
          value={headerSelected[field]?.value || ""}
          className="w-100"
          name={field}
          panelStyle={{ borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}
          onChange={(e) => {
            const val = e.target.value;
            setHeaderSelected((prev) => ({
              ...prev,
              [field]: { value: val },
            }));
            const blankUpdatedRow = tags[KEYS_NAME].map((row) => {
              const hasMedicineID =
                (row?.AllItemListData && row.AllItemListData.medicine_ID) ||
                (row?.Name && row.Name.ID);

              if (!hasMedicineID) {
                return row;
              }

              const newHeaderValue = { value: val };

              return {
                ...row,
                [field]: newHeaderValue,
                Quantity: row.Quantity?.isManual
                  ? row.Quantity
                  : field === "Duration" && row.Time
                    ? { value: calculateQuantity(newHeaderValue, row.Time) }
                    : field === "Time" && row.Duration
                      ? { value: calculateQuantity(row.Duration, newHeaderValue) }
                      : row.Quantity,
              };
            });

            setTags({
              ...tags,
              [KEYS_NAME]: flattenTags(blankUpdatedRow),
            });

            if (DoctorID) {
              blankUpdatedRow.forEach((row) => {
                const medicineID = row?.Name?.ID || row?.AllItemListData?.medicine_ID;
                if (medicineID) {
                  savePresetToLocalStorage(medicineID, {
                    [field]: row[field]
                  });
                }
              });
            }
          }}
          onSelect={(e) => onHeaderSelect(e, field)}
          onFocus={() => {
            handleFocus(refCollection, -1, field);
          }}
          onBlur={() => {
            setTimeout(() => {
              setHeaderSelected((prev) => ({
                ...prev,
                [field]: null,
              }));
            }, 250);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setTimeout(() => {
                setHeaderSelected((prev) => ({
                  ...prev,
                  [field]: null,
                }));
              }, 250);
            }
          }}
          itemTemplate={StaticItemTemplate}
        />
      </>
    );
  };

  const theadCustomStyle = [
    { name: "S.No.", style: { textAlign: "center" }, width: "3%" },
    { name: "Name", style: { textAlign: "left" }, width: "25%" },
    ...visibleFields.map((field) => {
      if (field === "Remarks") {
        return {
          name: (
            <span className="w-100">
              <div>{field}</div>
              <input
                type="text"
                className="table-input"
                respclass="w-100"
                name="Remarks"
                value={headerSelected.Remarks?.value || ""}
                onChange={handleHeaderRemarksChange}
                onBlur={() => {
                  setTimeout(() => {
                    setHeaderSelected((prev) => ({
                      ...prev,
                      Remarks: null,
                    }));
                  }, 250);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setTimeout(() => {
                      setHeaderSelected((prev) => ({
                        ...prev,
                        Remarks: null,
                      }));
                    }, 250);
                  }
                }}
              />
            </span>
          ),
          width: "15%",
        };
      }
      // if (field === "Quantity") {
      //   return { name: "Quantity", width: "7%" };
      // }
      return {
        name: (
          <>
            <div>{field}</div>
            {renderHeaderAutoField(field)}
          </>
        ),
        width: "10%",
      };
    }),
  ];
  const handleFocus = (refs, index, type) => {
    if (type === "Name") {
      // Medicine suggestions come from the typed search only - nothing on focus.
      return;
    }
    searchStatic({ query: "" }, type);
    if (index === -1) {
      headerAutoCompleteRefs.current[type]?.show();
    } else {
      refs.current[index]?.show();
    }
  };
  const handleMedicineItemSearch = async (prefix) => {
    const cacheKey = `${prefix}_${DoctorID}`;
    if (searchCache.current[cacheKey]) {
      return searchCache.current[cacheKey];
    }
    try {
      const response = await MedicineItemSearch(prefix, DoctorID);
      const data = response?.data || [];
      searchCache.current[cacheKey] = data;
      return data;
    } catch {
      return [];
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query, name) => {
      if (!query) return;
      const item = await handleAPICalls(query.trim(), name);
      const slicedItems = Array.isArray(item) ? item.slice(0, 20) : [];
      setNewSearchItems((prev) => ({
        ...prev,
        [name]: slicedItems,
      }));
      setFilteredItems((prev) => ({
        ...prev,
        [name]: slicedItems,
      }));
    }, 150),
    []
  );

  const search = (event, name) => {
    const query = event?.query?.trim();
    if (!query) {
      setFilteredItems((prev) => ({
        ...prev,
        [name]: [],
      }));
      return;
    }

    debouncedSearch(query, name);
  };

  const handleAPICalls = async (prefix, name) => {
    const apis = {
      Name: await handleMedicineItemSearch(prefix),
    };
    return apis[name];
  };

  const searchStatic = (event, type) => {
    const { query } = event;
    const data = items[type].filter((ele) => {
      if (!query) return true;
      return ele?.Text.toLowerCase()
        .trim()
        .includes(query.toLowerCase().trim());
    });

    const uniqueMap = new Map();
    data.forEach((item) => {
      const key = item?.Text?.toLowerCase().trim();
      if (key && !uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    const uniqueData = Array.from(uniqueMap.values());
    setFilteredItems({
      ...filteredItems,
      [type]: uniqueData,
    });
  };

  const handleGetMedicineDose = async () => {
    const returnData = {
      Dose: [],
      Time: [],
      Duration: [],
      Route: [],
      Meal: [],
    };

    const Type = {
      Dose: 1,
      Time: 2,
      Duration: 3,
      Route: 4,
      Meal: 5,
    };

    const length = Object.keys(returnData).length;
    const keys = Object.keys(returnData);
    for (let i = 0; i < length; i++) {
      try {
        const data = await GetMedicineDose(Type[keys[i]]);
        returnData[keys[i]] = data?.data;
      } catch (error) {
        console.log(error, "error");
      }
    }
    setItems({ ...items, ...returnData });
  };

  const itemTemplate = (item) => {
    const brandName = item?.Brand || item?.Typename || item?.TypeName || item?.ItemName || item?.medicineName || "";
    const genericName = item?.composition?.trim() ? item.composition : (item?.Generic || item?.generic);

    return (
      <div
        className="d-flex align-items-center py-2 px-1"
        style={{
          borderBottom: "1px solid #f1f3f5",
          width: "100%"
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center mr-3"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            background: "#edf2f7",
            color: "#4a5568",
            flexShrink: 0
          }}
        >
          <i className="pi pi-info-circle" style={{ fontSize: "13px" }}></i>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#2d3748",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {brandName}
          </span>
          {genericName && (
            <span
              style={{
                fontSize: "10px",
                color: "#718096",
                textTransform: "uppercase",
                marginTop: "2px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              Composition: {genericName}
            </span>
          )}
        </div>
      </div>
    );
  };

  const safeText = (val) => {
    if (val == null) return "";
    if (typeof val === "object") return val.value || val.Text || "";
    return val;
  };
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const getDropRowIndex = (e) => {
    const tr = e.target?.closest?.("tbody > tr");
    if (!tr || !tr.parentElement) return null;
    const rowIndex = Array.prototype.indexOf.call(tr.parentElement.children, tr);
    const lastIndex = (tags?.[KEYS_NAME]?.length || 0) - 1;
    if (rowIndex < 0 || rowIndex >= lastIndex) return null;
    return rowIndex;
  };

  const handleMedicineDrop = (toIndex) => {
    const fromIndex = dragIndexRef.current;
    dragIndexRef.current = null;
    setDragOverIndex(null);
    if (fromIndex === null || fromIndex === toIndex) return;
    setTags((prev) => {
      const data = cloneRows(prev[KEYS_NAME]);
      const lastIndex = data.length - 1; // blank entry row
      if (
        fromIndex >= lastIndex ||
        toIndex >= lastIndex ||
        !data[fromIndex] ||
        !data[toIndex]
      ) {
        return prev;
      }
      const [moved] = data.splice(fromIndex, 1);
      data.splice(toIndex, 0, moved);
      return { ...prev, [KEYS_NAME]: data };
    });
  };

  const clearDependentFields = (index) => {
    setTags((prev) => {
      const data = cloneRows(prev[KEYS_NAME]);
      if (!data[index]) return prev;

      ["Dose", "Time", "Duration", "Meal", "Route", "Quantity"].forEach(
        (field) => {
          data[index][field] = { value: "" };
        }
      );

      return { ...prev, [KEYS_NAME]: data };
    });
  };
  const handleChange = (e, index) => {
    const { value, name } = e.target;
    setTags((prev) => {
    const data = cloneRows(prev[KEYS_NAME]);
    if (!data[index]) return prev;

    if (name === "Quantity") {
      data[index][name] = { value, isManual: true };
    } else {
      if (typeof value === "object" && value !== null) {
        if (name === "Name") {
          const medId = value?.ItemID || value?.medicine_ID || value?.ID;
          const presetKey = `doctor_medicine_presets_${DoctorID}`;
          let preset = null;
          if (medId && DoctorID) {
            try {
              const presets = JSON.parse(localStorage.getItem(presetKey) || "{}");
              if (presets[medId]) {
                preset = presets[medId];
              }
            } catch (err) {
              console.error(err);
            }
          }

          data[index]["Name"] = {
            value: getVal(value?.Brand || value?.Typename || value?.TypeName || value?.ItemName || value?.medicineName),
            ID: value?.ItemID || value?.medicine_ID || value?.ID,
            isDisable: true,
            Typename: value?.Typename || value?.Brand,
            Generic: value?.composition?.trim() ? value.composition : (value?.Generic || value?.generic),
          };
          data[index]["Dose"] = preset?.Dose !== undefined ? preset.Dose : { value: getVal(value?.Dose) };
          data[index]["Time"] = preset?.Time !== undefined ? preset.Time : { value: getVal(value?.Times) };
          data[index]["Duration"] = preset?.Duration !== undefined ? preset.Duration : { value: getVal(value?.Duration) };
          data[index]["Route"] = preset?.Route !== undefined ? preset.Route : { value: getVal(value?.Route) };
          data[index]["Meal"] = preset?.Meal !== undefined ? preset.Meal : { value: getVal(value?.Meal) };
          data[index]["Remarks"] = preset?.Remarks !== undefined ? preset.Remarks : { value: (data[index]["Remarks"]?.value || "") };
          data[index]["AllItemListData"] = value;

          if (data[index]["Time"] && data[index]["Duration"] && !data[index]["Quantity"]?.isManual) {
            const qty = calculateQuantity(data[index]["Duration"], data[index]["Time"]);
            if (!isNaN(qty)) {
              data[index]["Quantity"] = { value: qty };
            }
          }
        } else {
          data[index][name] = {
            value: getVal(value?.HindiText || value?.Text || ""),
            ID: value?.ID,
            Factor: value?.Factor,
          };

          const medicineID = data[index]?.Name?.ID || data[index]?.AllItemListData?.medicine_ID || data[index]?.AllItemListData?.ItemID || data[index]?.AllItemListData?.ID;
          if (medicineID && DoctorID) {
            savePresetToLocalStorage(medicineID, {
              [name]: data[index][name]
            });
          }
        }
      } else {
        data[index][name] = { value };

        const medicineID = data[index]?.Name?.ID || data[index]?.AllItemListData?.medicine_ID || data[index]?.AllItemListData?.ItemID || data[index]?.AllItemListData?.ID;
        if (medicineID && DoctorID) {
          savePresetToLocalStorage(medicineID, {
            [name]: data[index][name]
          });
        }
      }

      if (
        (name === "Duration" || name === "Time") &&
        !data[index]["Quantity"]?.isManual
      ) {
        const duration = data[index]["Duration"];
        const times = data[index]["Time"];
        if (duration && times) {
          data[index]["Quantity"] = {
            value: calculateQuantity(duration, times),
          };
        }
      }
    }
    if (index === data.length - 1) {
      data.push({ ...PRESCRIBED_MEDICINE });
    }
    return { ...prev, [KEYS_NAME]: data };
    });
  };

  const HandleRow = () => {
    return JSON.parse(JSON.stringify(tags[KEYS_NAME]));
  };

  const handleRemove = (index) => {
    const data = [...tags[KEYS_NAME]];
    const returnData = data.filter((_, inx) => index !== inx);
    setTags({
      ...tags,
      [KEYS_NAME]: returnData,
    });
  };

  const handleRemove1 = (index) => {
    const data = presTable;
    const returnData = data.filter((_, inx) => index !== inx);
    setPresTable(returnData);
  };
  const getVal = (v) => {
    if (v == null) return "";
    if (typeof v === "object" && "value" in v) return v.value;
    return v;
  };
  const onSelect = (e, category, index) => {
    const value = e?.value;
    setTags((prev) => {
    const data = cloneRows(prev[KEYS_NAME]);
    if (!data[index]) return prev;

    if (category === "Name") {
      const medId = value?.ItemID || value?.medicine_ID || value?.ID;
      const presetKey = `doctor_medicine_presets_${DoctorID}`;
      let preset = null;
      if (medId && DoctorID) {
        try {
          const presets = JSON.parse(localStorage.getItem(presetKey) || "{}");
          if (presets[medId]) {
            preset = presets[medId];
          }
        } catch (err) {
          console.error(err);
        }
      }

      data[index]["Name"] = {
        value: getVal(value?.Brand || value?.Typename || value?.TypeName || value?.ItemName || value?.medicineName),
        ID: value?.ItemID || value?.medicine_ID || value?.ID,
        isDisable: true,
        Typename: value?.Typename || value?.Brand,
        Generic: value?.composition?.trim() ? value.composition : (value?.Generic || value?.generic),
      };

      data[index]["Dose"] = preset?.Dose !== undefined ? preset.Dose : { value: getVal(value?.Dose) };
      data[index]["Time"] = preset?.Time !== undefined ? preset.Time : { value: getVal(value?.Times) };
      data[index]["Duration"] = preset?.Duration !== undefined ? preset.Duration : { value: getVal(value?.Duration) };
      data[index]["Route"] = preset?.Route !== undefined ? preset.Route : { value: getVal(value?.Route) };
      data[index]["Meal"] = preset?.Meal !== undefined ? preset.Meal : { value: getVal(value?.Meal) };
      data[index]["Remarks"] = preset?.Remarks !== undefined ? preset.Remarks : { value: (data[index]["Remarks"]?.value || "") };

      data[index]["AllItemListData"] = value;

      if (data[index]["Time"] && data[index]["Duration"] && !data[index]["Quantity"]?.isManual) {
        const qty = calculateQuantity(data[index]["Duration"], data[index]["Time"]);
        if (!isNaN(qty)) {
          data[index]["Quantity"] = { value: qty };
        }
      }

      if (index === data.length - 1) {
        data.push({ ...PRESCRIBED_MEDICINE });
      }
    } else {
      data[index][category] = {
        value: getVal(value?.HindiText || value?.Text || ""),
        ID: value?.ID,
        Factor: value?.Factor,
      };

      const medicineID = data[index]?.Name?.ID || data[index]?.AllItemListData?.medicine_ID || data[index]?.AllItemListData?.ItemID || data[index]?.AllItemListData?.ID;
      if (medicineID && DoctorID) {
        savePresetToLocalStorage(medicineID, {
          [category]: data[index][category]
        });
      }
    }

    return { ...prev, [KEYS_NAME]: data };
    });

    setEditingCell({ row: null, field: null });
  };

  const handleRemarksChange = (e, index) => {
    const { name, value } = e.target;
    setTags((prev) => {
      const data = cloneRows(prev[KEYS_NAME]);
      if (!data[index]) return prev;
      data[index][name] = { value };

      const medicineID = data[index]?.Name?.ID || data[index]?.AllItemListData?.medicine_ID || data[index]?.AllItemListData?.ItemID || data[index]?.AllItemListData?.ID;
      if (medicineID && DoctorID) {
        savePresetToLocalStorage(medicineID, {
          [name]: data[index][name]
        });
      }

      return { ...prev, [KEYS_NAME]: data };
    });
  };
  const handleKeyPress = (e, category, index) => {
    if (e.key !== "Enter") return;
    if (!tags?.[KEYS_NAME]?.[index]?.[category]?.value) return;

    setTags((prev) => {
      const data = cloneRows(prev[KEYS_NAME]);
      if (!data[index]?.[category]?.value) return prev;
      data[index][category] = {
        ...data[index][category],
        isDisable: true,
      };
      return { ...prev, [KEYS_NAME]: data };
    });

    setEditingCell({ row: null, field: null });
  };

  // const handleKeyPress = (e, category, index) => {
  //   if (e.key === "Enter" && tags[KEYS_NAME][index][category]?.value) {
  //     const data = HandleRow(category);
  //     data[index][category] = { ...data[index][category], isDisable: true };

  //     setTags({
  //       ...tags,
  //       [KEYS_NAME]: data,
  //     });
  //   }
  // };
  const handleGenericChange = (value, index) => {
    setTags((prev) => {
      const data = cloneRows(prev[KEYS_NAME]);
      if (!data[index]) return prev;
      data[index].Name = { ...(data[index].Name || {}), Generic: value };
      return { ...prev, [KEYS_NAME]: data };
    });
  };

  const settleValue = (item, index) => {
    const fields = ["Dose", "Time", "Duration", "Meal", "Route"];
    const itemName = safeText(item?.Name?.value || item?.Name);
    const renderAutoField = (field, refCollection, fieldItems, template) => {
      const isNameSelected = !!item?.Name?.ID;
      const isEditing =
        field === "Duration"
          ? selectedDuration
          : editingCell.row === index && editingCell.field === field;
      const fieldValue = safeText(item?.[field]);
      const id = fieldItems?.find((ele) => {
        const val = ele?.HindiText;
        return val === fieldValue;
      })?.ID;
      if (isEditing || !fieldValue || !id) {
        return (
          <>
            <AutoComplete
              ref={(el) => (refCollection.current[index] = el)}
              suggestions={fieldItems}
              completeMethod={(e) => searchStatic(e, field)}
              value={fieldValue}
              placeholder="Type and press Enter"
              className="w-100"
              name={field}
              panelStyle={{ borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}
              onChange={(e) => handleChange(e, index)}
              onSelect={(e) => onSelect(e, field, index)}
              onFocus={() => {
                if (field === "Duration") setSelectedDuration(true);
                handleFocus(refCollection, index, field);
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (field === "Duration") setSelectedDuration(false);
                  else setEditingCell({ row: null, field: null });
                }, 150);
              }}
              itemTemplate={template}
            />
          </>
        );
      }

      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (field === "Duration") {
              setSelectedDuration(true);
              setEditingCell({ row: index, field });
              setTimeout(() => {
                if (durationAutoCompleteRefs.current[index]) {
                  durationAutoCompleteRefs.current[index].show();
                }
              }, 50);
            } else {
              setEditingCell({ row: index, field });
              const refMap = {
                Dose: doseAutoCompleteRefs,
                Time: timeAutoCompleteRefs,
                Meal: mealAutoCompleteRefs,
                Route: routeAutoCompleteRefs,
              };

              const refCollection = refMap[field];
              setTimeout(() => {
                if (refCollection && refCollection.current[index]) {
                  refCollection.current[index].show();
                }
              }, 50);
            }
          }}
          style={{
            cursor: "pointer",
            display: "inline-block",
            width: "100%",
            minHeight: "24px",
            whiteSpace: "normal",
          }}
        >
          {fieldValue}
        </span>
      );
    };

    const renderNameField = () => {
      const isEditing =
        editingCell.row === index && editingCell.field === "Name";
      const fieldValue = safeText(item?.Name?.value || item?.Name);

      if (isEditing || !item?.Name?.ID) {
        return (
          <>
            <AutoComplete
              ref={(el) => (autoCompleteRefs.current[index] = el)}
              suggestions={
                Array.isArray(filteredItems["Name"])
                  ? filteredItems["Name"]
                  : []
              }
              completeMethod={(e) => search(e, "Name")}
              value={fieldValue}
              placeholder="Type and Press Enter"
              className="w-100"
              name="Name"
              panelStyle={{ minWidth: "350px", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}
              onChange={(e) => handleChange(e, index)}
              onSelect={(e) => onSelect(e, "Name", index)}
              onKeyPress={(e) => handleKeyPress(e, "Name", index)}
              onFocus={() => handleFocus(autoCompleteRefs, index, "Name")}
              onBlur={() => {
                setTimeout(
                  () => setEditingCell({ row: null, field: null }),
                  250
                );
              }}
              itemTemplate={itemTemplate}
              id={`searchtest-${index}`}
            />
            {item?.Name?.value && (
              <div>
                {editingGenericIndex === index ? (
                  <input
                    type="text"
                    value={item?.Name?.Generic || ""}
                    onChange={(e) => handleGenericChange(e.target.value, index)}
                    onBlur={() => setEditingGenericIndex(null)}
                    autoFocus
                    className="table-input"
                    respclass="w-100"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      border: "1px solid #ccc",
                      background: "#fff",
                      padding: "2px 4px",
                      color: "#526a97f6 ",
                      textTransform: "uppercase",
                    }}
                  />
                ) : (
                  <span onClick={() => setEditingGenericIndex(index)}>
                    {(
                      <span
                        style={{
                          display: "flex",
                        }}
                      >
                        <i
                          className="pi pi-pen-to-square mr-2"
                          aria-hidden="true"
                          style={{
                            fontSize: "5px",
                            fontWeight: "bold",
                            color: "#526a97f6 ",
                          }}
                        ></i>
                        <span
                          style={{
                            fontSize: "14px !important",
                            color: "black",
                            fontWeight: "bold",
                            display: "inline-block",
                            maxWidth: "100%",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            color: "#526a97f6 ",
                            textTransform: "uppercase",
                          }}
                        >
                          {item?.Name?.Generic ??
                            item?.Name?.composition ??
                            item?.AllItemListData?.Generic}
                        </span>
                      </span>
                    ) || (
                        <>
                          <i
                            className="pi pi-pen-to-square"
                            aria-hidden="true"
                            style={{
                              fontSize: "5px",
                              fontWeight: "bold",
                              color: "#526a97f6 ",
                            }}
                          ></i>
                        </>
                      )}
                  </span>
                )}
              </div>
            )}
          </>
        );
      }
      return (
        <div>
          <span
            onClick={() => {
              setEditingCell({ row: index, field: "Name" });
              setTimeout(() => {
                if (autoCompleteRefs.current[index]) {
                  autoCompleteRefs.current[index].focus();
                  autoCompleteRefs.current[index].show();
                }
              }, 50);
            }}
            style={{
              cursor: "pointer",
              display: "inline-block",
              width: "100%",
              minHeight: "24px",
              whiteSpace: "normal",
            }}
          >
            <span isDisable style={{ color: "#000000", fontWeight: "600" }}>
              {item?.Name?.value}
            </span>
            <br />
          </span>
          <div>
            {editingGenericIndex === index && item?.Name?.value ? (
              <input
                type="text"
                value={item?.Name?.Generic || ""}
                onChange={(e) => handleGenericChange(e.target.value, index)}
                onBlur={() => setEditingGenericIndex(null)}
                autoFocus
                className="table-input"
                respclass="w-100"
                style={{
                  fontSize: "9px !important",
                  width: "100%",
                  border: "1px solid #ccc",
                  background: "#fff",
                  padding: "2px 4px",
                  color: "#526a97f6 ",
                  textTransform: "uppercase",
                }}
              />
            ) : (
              <span onClick={() => setEditingGenericIndex(index)}>
                {(
                  <span
                    style={{
                      display: "flex",
                    }}
                  >
                    <i
                      className="pi pi-pen-to-square mr-2"
                      aria-hidden="true"
                      style={{
                        fontSize: "9px",
                        fontWeight: "bold",
                        color: "#526a97f6 ",
                      }}
                    ></i>
                    <span
                      className="fontColors"
                      style={{
                        fontSize: "14px !important",
                        color: "#526a97f6 ",
                        fontWeight: "bold",
                        display: "inline-block",
                        maxWidth: "100%",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        textTransform: "uppercase",
                      }}
                    >
                      {item?.Name?.Generic ??
                        item?.Name?.composition ??
                        item?.AllItemListData?.Generic}
                    </span>
                  </span>
                ) || (
                    <>
                      <i
                        className="pi pi-pen-to-square"
                        aria-hidden="true"
                        style={{
                          fontSize: "9px",
                          fontWeight: "bold",
                          color: "#526a97f6 ",
                        }}
                      ></i>
                    </>
                  )}
              </span>
            )}
          </div>
        </div>
      );
    };

    const isLastBlankRow = tags[KEYS_NAME].length === index + 1;
    const returnObject = {
      SNo: (
        <div
          className="d-flex align-items-center"
          style={{
            minHeight: "28px",
            outline:
              dragOverIndex === index && dragIndexRef.current !== index
                ? "2px dashed #0d6efd"
                : "none",
          }}
        >
          {!isLastBlankRow && (
            <>
              <span
                draggable
                title="Drag to reorder"
                style={{ cursor: "grab", padding: "1px 4px" }}
                onDragStart={(e) => {
                  dragIndexRef.current = index;
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(index));
                }}
                onDragEnd={() => {
                  dragIndexRef.current = null;
                  setDragOverIndex(null);
                }}
              >
                <i className="pi pi-bars" aria-hidden="true"></i>
              </span>
              <div
                style={{
                  borderRadius: "25px",
                  padding: "1px 10px",
                  cursor: "pointer",
                }}
                onClick={() => handleRemove(index)}
              >
                <i className="pi pi-trash" aria-hidden="true"></i>
              </div>
            </>
          )}
        </div>
      ),
      Name: renderNameField(),
    };

    returnObject.Time = renderAutoField(
      "Time",
      timeAutoCompleteRefs,
      Array.isArray(filteredItems["Time"]) ? filteredItems["Time"] : [],
      // filteredItems["Time"],
      StaticItemTemplate
    );
    returnObject.Duration = renderAutoField(
      "Duration",
      durationAutoCompleteRefs,
      Array.isArray(filteredItems["Duration"]) ? filteredItems["Duration"] : [],
      // filteredItems["Duration"],
      StaticItemTemplate
    );
    returnObject.Meal = renderAutoField(
      "Meal",
      mealAutoCompleteRefs,
      Array.isArray(filteredItems["Meal"]) ? filteredItems["Meal"] : [],
      // filteredItems["Meal"],
      StaticItemTemplate
    );
    // returnObject.Route = renderAutoField(
    //   "Route",
    //   routeAutoCompleteRefs,
    //   filteredItems["Route"],
    //   StaticItemTemplate
    // );

    returnObject.Remarks = (
      <Input
        type="text"
        className="table-input"
        placeholder="Type"
        value={safeText(item?.Remarks)}
        respclass="w-100"
        name="Remarks"
        onChange={(e) => handleRemarksChange(e, index)}
      />
    );

    returnObject.Quantity = (
      <Input
        type="number"
        className="table-input"
        placeholder="Type"
        value={safeText(item?.Quantity)}
        respclass="w-100"
        name="Quantity"
        onChange={(e) => handleChange(e, index)}
        min={0}
      />
    );

    return returnObject;
  };

  const handleTabody = () => {
    return tags[KEYS_NAME]?.map((item, index) => {
      const values = settleValue(item, index);
      let row = {
        SNo: values.SNo,
        Name: values.Name,
      };
      visibleFields.forEach((field) => {
        if (values[field]) {
          row[field] = values[field];
        }
      });

      if (type === "FromPage" && !isDesktop) {
        row.Remarks = values.Remarks;
      }

      return row;
    });
  };

  useEffect(() => {
    handleGetMedicineDose();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const timeData = await GetMedicineDose(2);
      const durationData = await GetMedicineDose(3);
      const mealData = await GetMedicineDose(5);
      const routeData = await GetMedicineDose(4);
      const doseData = await GetMedicineDose(1);

      setItems((prevItems) => ({
        ...prevItems,
        Dose: doseData?.data || [],
        Time: timeData?.data || [],
        Duration: durationData?.data || [],
        Meal: mealData?.data || [],
        Route: routeData?.data || [],
      }));
    };

    fetchInitialData();
  }, []);

  return (
    <div
      className="w-100"
      onDragOver={(e) => {
        if (dragIndexRef.current === null) return;
        const toIndex = getDropRowIndex(e);
        if (toIndex === null) return;
        e.preventDefault();
        if (dragOverIndex !== toIndex) setDragOverIndex(toIndex);
      }}
      onDrop={(e) => {
        if (dragIndexRef.current === null) return;
        e.preventDefault();
        const toIndex = getDropRowIndex(e);
        if (toIndex === null) {
          dragIndexRef.current = null;
          setDragOverIndex(null);
          return;
        }
        handleMedicineDrop(toIndex);
      }}
    >
      <Tables
        thead={theadCustomStyle}
        tbody={handleTabody()}
        tableHeight={"tableHeight scrollView"}
        style={{ height: "auto" }}
      />
    </div>
  );
}

export default PrescribedMedicineTable;
