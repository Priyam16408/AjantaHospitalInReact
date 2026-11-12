import React, { useEffect, useRef, useState } from "react";
import Tables from "../..";
import { AutoComplete } from "primereact/autocomplete";
import {
  GetMedicineDose,
  MedicineItemSearch,
} from "../../../../../networkServices/DoctorApi";
import Input from "../../../../formComponent/Input";
import { PRESCRIBED_MEDICINE } from "../../../../../utils/constant";
import { use } from "i18next";

function PrescribedMedicineTable({ tags, setTags, type, presTable, setPresTable, isDesktop, isShowFirst, apiData }) {



  const [medicineData, setMedicineData] = useState([]);
  const KEYS_NAME = "Prescribed Medicine";
  const doseAutoCompleteRefs = useRef([]);
  const timeAutoCompleteRefs = useRef([]);
  const durationAutoCompleteRefs = useRef([]);
  const mealAutoCompleteRefs = useRef([]);
  const routeAutoCompleteRefs = useRef([]);


  const [items, setItems] = useState({
    Name: [],
    Dose: [],
    Time: [],
    Duration: [],
    Meal: [],
    Route: [],
    AllItemListData: [],
  });

  const transformAndSetData = (medicines) => {

    if (!medicines) {
      return
    }
    else {
      const transformedData = medicines.map((med) => ({
        ItemCode: "",
        Typename: med.medicineName,
        ItemID: med.medicine_ID,
        MedicineType: "",
        Dose: med.dose,
        Duration: med.noOfDays,
        Route: med.route,
        Times: med.noTimesDay,
        Brand: med.medicineName,
        Generic: "",
      }));

      setMedicineData(transformedData);
    }
  };

  useEffect(() => {
    transformAndSetData(apiData?.[0]?.medicines);
  }, [apiData])




  const [filteredItems, setFilteredItems] = useState({
    Dose: [],
    Time: [],
    Duration: [],
    Meal: [],
    Route: [],
  });


  const autoCompleteRefs = useRef([]);
  const shouldShowAllFields = import.meta.env.VITE_APP_FIELD_VISIBILITY === "true";

const allFields = ["Dose", "Time", "Duration", "Meal", "Route", "Quantity"];
const hiddenFieldsWhenFalse = ["Route", "Quantity"]; 

const visibleFields = shouldShowAllFields
  ? allFields
  : allFields.filter((field) => !hiddenFieldsWhenFalse.includes(field));

// Update table header
let Thead = ["S.No.", { name: "Name", width: "25%" }, ...visibleFields];

// if (type === "FromPage" && !isDesktop) {
//   Thead.push("Remarks");
// }

  



  // const handleFocus = async (refs, index, type) => {
  //   // Fetch suggestions
  //   await searchStatic({ query: "" }, type);
  
  //   // Open dropdown
  //   if (refs.current[index]) {
  //     refs.current[index].show();
  //   }
  
  //   // ✅ If user focuses Dose field on the last row, add a new row
  //   if (type === "Name" && index === tags[KEYS_NAME].length - 1) {
  //     const updatedRows = [...tags[KEYS_NAME], PRESCRIBED_MEDICINE];
  //     setTags({
  //       ...tags,
  //       [KEYS_NAME]: updatedRows,
  //     });
  //   }
  // };
  

  const handleFocus = async (refs, index, type) => {
    await searchStatic({ query: "" }, type);
  
    if (refs.current[index]) {
      refs.current[index].show();
    }
  
    if (type === "Name" && index === tags[KEYS_NAME].length - 1) {
      const updatedRows = [...tags[KEYS_NAME], PRESCRIBED_MEDICINE];
      setTags({
        ...tags,
        [KEYS_NAME]: updatedRows,
      });
    }
  };
  
  // let Thead = isDesktop ? ["S.No.", "Name", "Dose"] : ["S.No.", { name: "Name", width: "25%" }, "Dose", "Time", "Duration", "Meal", "Route","Quantity"]


  const handleMedicineItemSearch = async (prefix) => {
    try {
      const response = await MedicineItemSearch(prefix);
      return response?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleAPICalls = async (prefix, name) => {
    const apis = {
      Name: await handleMedicineItemSearch(prefix),
    };

    return apis[name];
  };

  const search = async (event, name) => {
    const item = await handleAPICalls(event?.query.trim(), name);
    setItems({ ...items, [name]: item });
  };


  const searchStatic = (event, type) => {
    const { query } = event;

    // If the query is empty, return all suggestions
    const data = items[type].filter((ele) => {
      if (!query) return true; // Return all items if query is empty
      return ele?.Text.toLowerCase().trim().includes(query.toLowerCase().trim());
    });

    const uniqueMap = new Map();
    data.forEach((item) => {
      const key = item?.Text?.toLowerCase().trim();
      if (key && !uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    const uniqueData = Array.from(uniqueMap.values());    
    console.log(uniqueData);
    
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

    const length = Object.keys(returnData);
    for (let i = 0; i < length.length; i++) {
      try {
        const data = await GetMedicineDose(Type[length[i]]);
        returnData[length[i]] = data?.data;
      } catch (error) {
        console.log(error, "error");
      }
    }
    setItems({ ...items, ...returnData });
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.Typename}
        </div>
      </div>
    );
  };

  // const StaticItemTemplate = (item) => {
  //   return (
  //     <div className="p-clearfix">
  //       <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
  //         {item?.Text}
  //       </div>
  //     </div>
  //   );
  // };
  const StaticItemTemplate = (item) => {
    // Split the dose data at '#' and take the first part
    const doseValue = item?.Text.split('#')[0];
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {doseValue}
        </div>
      </div>
    );
  };

  const handleChange = (e, index) => {
    const { value, name } = e.target;
    const data = JSON.parse(JSON.stringify(tags[KEYS_NAME]));
    data[index][name] = { value };

    setTags({
      ...tags,
      [KEYS_NAME]: data,
    });
  };

  const HandleRow = (name) => {
    const data = JSON.parse(JSON.stringify(tags[KEYS_NAME]));
    if (name === "Name") {
      return [...data, PRESCRIBED_MEDICINE];
    } else {
      return data;
    }
  };

  // const handleKeyPress = (e, category, index) => {
  //   if (e.key === "Enter" && tags[KEYS_NAME][category]?.value) {
  //     const data = HandleRow(category);
  //     data[index][category] = { value: inputValue[category] };

  //     setTags({
  //       ...tags,
  //       [KEYS_NAME]: data, // Ensure it's an array
  //     });
  //   }
  // };

  const handleRemove = (index) => {
    const data = [...tags[KEYS_NAME]];
    const returnData = data.filter((_, inx) => index !== inx);
    setTags({
      ...tags,
      [KEYS_NAME]: returnData,
    });
  };
  const handleRemove1 = (index) => {
    console.log(index);

    const data = presTable;
    const returnData = data.filter((_, inx) => index !== inx);
    setPresTable(returnData);
  };

  
  // const onSelect = (e, category, index) => {
  //   const { value } = e;

  //   // Split the value at '#' and take the first part (if applicable)
  //   const selectedValue = value?.Text ? value.Text.split('#')[0] : value;

  //   const data = HandleRow(category);

  //   if (category === "Name") {
  //     data[index][category] = {
  //       value: value?.Brand,
  //       ID: value?.ItemID,
  //       isDisable: true,
  //     };
  //     data[index]["Dose"] = { value: value?.Dose };
  //     data[index]["Time"] = { value: value?.Times };
  //     data[index]["Duration"] = { value: value?.Duration };
  //     data[index]["Route"] = { value: value?.Route };
  //     data[index]["AllItemListData"] = { value: value || "" };
  //   } else {
  //     // Use the selectedValue (without the '#' part) for other categories like Dose
  //     data[index][category] = { value: selectedValue, ID: value?.ID };
  //   }

  //   setTags({
  //     ...tags,
  //     [KEYS_NAME]: data, 
  //   });

  //   // Close the dropdown after selection
  //   setTimeout(() => {
  //     if (category === "Name" && autoCompleteRefs.current[index]) {
  //       autoCompleteRefs.current[index].hide();
  //     } else if (category === "Dose" && doseAutoCompleteRefs.current[index]) {
  //       doseAutoCompleteRefs.current[index].hide();
  //     } else if (category === "Time" && timeAutoCompleteRefs.current[index]) {
  //       timeAutoCompleteRefs.current[index].hide();
  //     } else if (category === "Duration" && durationAutoCompleteRefs.current[index]) {
  //       durationAutoCompleteRefs.current[index].hide();
  //     } else if (category === "Meal" && mealAutoCompleteRefs.current[index]) {
  //       mealAutoCompleteRefs.current[index].hide();
  //     } else if (category === "Route" && routeAutoCompleteRefs.current[index]) {
  //       routeAutoCompleteRefs.current[index].hide();
  //     }
  //   }, 0); // Use a minimal delay to ensure state is updated
  // };

  const onSelect = (e, category, index) => {
    const { value } = e;
      const selectedValue = value?.Text ? value.Text.split('#')[0] : value;
      const data = JSON.parse(JSON.stringify(tags[KEYS_NAME]));
  
    if (category === "Name") {
      data[index][category] = {
        value: value?.Brand,
        ID: value?.ItemID,
        isDisable: true,
      };
      data[index]["Dose"] = { value: value?.Dose };
      data[index["Time"]] = { value: value?.Times };
      data[index["Duration"]] = { value: value?.Duration };
      data[index["Route"]] = { value: value?.Route };
      data[index]["AllItemListData"] = { value: value || "" };
    } else {
      data[index][category] = { value: selectedValue, ID: value?.ID };
    }
  
    setTags({
      ...tags,
      [KEYS_NAME]: data,
    });
  
    // Close the dropdown after selection
    setTimeout(() => {
      if (category === "Name" && autoCompleteRefs.current[index]) {
        autoCompleteRefs.current[index].hide();
      } else if (category === "Dose" && doseAutoCompleteRefs.current[index]) {
        doseAutoCompleteRefs.current[index].hide();
      } else if (category === "Time" && timeAutoCompleteRefs.current[index]) {
        timeAutoCompleteRefs.current[index].hide();
      } else if (category === "Duration" && durationAutoCompleteRefs.current[index]) {
        durationAutoCompleteRefs.current[index].hide();
      } else if (category === "Meal" && mealAutoCompleteRefs.current[index]) {
        mealAutoCompleteRefs.current[index].hide();
      } else if (category === "Route" && routeAutoCompleteRefs.current[index]) {
        routeAutoCompleteRefs.current[index].hide();
      }
    }, 0);
  };
  
  const handleRemarksChange = (e, index) => {
    const { name, value } = e.target;
    const data = HandleRow(name);
    data[index][name] = { value };

    setTags({
      ...tags,
      [KEYS_NAME]: data, 
    });
  };

  const handleKeyPress = (e, category, index) => {
    if (e.key === "Enter" && tags[KEYS_NAME][index][category]?.value) {
      const data = HandleRow(category);
      data[index][category] = { ...data[index][category], isDisable: true };

      setTags({
        ...tags,
        [KEYS_NAME]: data, // Ensure it's an array
      });
    }
  };

  const settleValue = (item, index) => {
    //console.log(item);

    const returnObject = {
      SNo: null,
      Name: null,
      Dose: null,
      Time: null,
      Duration: null,
      Meal: null,
      Route: null,
      Remarks: null,
      Quantity: null,
    };

    returnObject.SNo = (
      <>
        {tags[KEYS_NAME].length !== index + 1 ? (
          <div
            className=""
            style={{ borderRadius: "25px", padding: "1px 10px" }}
            onClick={() => handleRemove(index)}
          >
            <div className="d-flex  align-items-center justify-content-between">
              <div
              >
                <i className="pi pi-trash" aria-hidden="true"></i>
              </div>
              {/* <div>{index + 1}</div> */}
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
    
    // name

    returnObject.Name = (
      //  <div className=""> 
      <>

        <AutoComplete
          ref={(el) => (autoCompleteRefs.current[index] = el)} // Assign ref to specific row
          suggestions={items["Name"]}
          completeMethod={(e) => search(e, "Name")}
          value={item["Name"]?.value ?? item.Name ?? ""}
          placeholder="Type and Press Enter"
          className="w-100"
          disabled={item["Name"]?.isDisable}
          onChange={(e) => handleChange(e, index)}
          name={"Name"}
          onSelect={(e) => onSelect(e, "Name", index)}
          onKeyPress={(e) => handleKeyPress(e, "Name", index)}
          onFocus={() => handleFocus(autoCompleteRefs,index,"Name")} // Pass index to open the correct dropdown
          id={`searchtest-${index}`} // Unique ID per row
          itemTemplate={itemTemplate}
        />
      </>
    );


        // Dose Field
        returnObject.Dose = (
          <AutoComplete
            ref={(el) => (doseAutoCompleteRefs.current[index] = el)} // Assign ref for Dose
            suggestions={filteredItems["Dose"]}
            completeMethod={(e) => searchStatic(e, "Dose")}
            value={item["Dose"]?.value ?? item.Dose ?? ""}
            placeholder="Type and Press Enter"
            onChange={(e) => handleChange(e, index)}
            className="w-100"
            name={"Dose"}
            onSelect={(e) => onSelect(e, "Dose", index)}
            onFocus={() => handleFocus(doseAutoCompleteRefs, index, "Dose")}
            id={`dose-search-${index}`}
            itemTemplate={StaticItemTemplate}
          />
        );
    
        // Time Field
        returnObject.Time = (
          <AutoComplete
            ref={(el) => (timeAutoCompleteRefs.current[index] = el)} // Assign ref for Time
            suggestions={filteredItems["Time"]}
            completeMethod={(e) => searchStatic(e, "Time")}
            value={item["Time"]?.value ?? item.Time ?? ""}
            placeholder="Type and Press Enter"
            onChange={(e) => handleChange(e, index)}
            className="w-100"
            name={"Time"}
            onSelect={(e) => onSelect(e, "Time", index)}
            onFocus={() => handleFocus(timeAutoCompleteRefs, index, "Time")}
            id={`time-search-${index}`}
            itemTemplate={StaticItemTemplate}
          />
        );
    
        // Duration Field
        returnObject.Duration = (
          <AutoComplete
            ref={(el) => (durationAutoCompleteRefs.current[index] = el)} // Assign ref for Duration
            suggestions={filteredItems["Duration"]}
            completeMethod={(e) => searchStatic(e, "Duration")}
            value={item["Duration"]?.value ?? item.Duration ?? ""}
            placeholder="Type and Press Enter"
            onChange={(e) => handleChange(e, index)}
            className="w-100"
            name={"Duration"}
            onSelect={(e) => onSelect(e, "Duration", index)}
            onFocus={() => handleFocus(durationAutoCompleteRefs, index, "Duration")}
            id={`duration-search-${index}`}
            itemTemplate={StaticItemTemplate}
          />
        );
    
        // Meal Field
        returnObject.Meal = (
          <AutoComplete
            ref={(el) => (mealAutoCompleteRefs.current[index] = el)} // Assign ref for Meal
            suggestions={filteredItems["Meal"]}
            completeMethod={(e) => searchStatic(e, "Meal")}
            value={item["Meal"]?.value ?? item.Meal ?? ""}
            placeholder="Type and Press Enter"
            onChange={(e) => handleChange(e, index)}
            className="w-100"
            name={"Meal"}
            onSelect={(e) => onSelect(e, "Meal", index)}
            onFocus={() => handleFocus(mealAutoCompleteRefs, index, "Meal")}
            id={`meal-search-${index}`}
            itemTemplate={StaticItemTemplate}
          />
        );
    
        // Route Field
        returnObject.Route = (
          <AutoComplete
            ref={(el) => (routeAutoCompleteRefs.current[index] = el)} // Assign ref for Route
            suggestions={filteredItems["Route"]}
            completeMethod={(e) => searchStatic(e, "Route")}
            value={item["Route"]?.value ?? item.Route ?? ""}
            placeholder="Type and Press Enter"
            onChange={(e) => handleChange(e, index)}
            className="w-100"
            name={"Route"}
            onSelect={(e) => onSelect(e, "Route", index)}
            onFocus={() => handleFocus(routeAutoCompleteRefs, index, "Route")}
            id={`route-search-${index}`}
            itemTemplate={StaticItemTemplate}
          />
        );
    


    const remarksValue =
      typeof item["Remarks"]?.value === 'string'
        ? item["Remarks"]?.value
        : (typeof item.Remarks === 'string' ? item.Remarks : "");

    // Remarks
    returnObject.Remarks = (
      <>
        <Input
          type="text"
          className="table-input"
          placeholder={"Type"}
          value={remarksValue}
          respclass={"w-100"}
          // value={item["Ramarks"]?.value ?? item.remarks ?? ""}

          // value={  item["Remarks"]?.value ?? item?.Remarks}
          name="Remarks"
          onChange={(e) => handleRemarksChange(e, index)}
        />
      </>
    );

    // debugger

    // const quantityValue =
    //   typeof item["Quantity"]?.value === 'string'
    //     ? item["Quantity"]?.value
    //     : (typeof item.Quantity === 'string' ? item.Quantity : "");

    const quantityRaw = item?.Quantity?.value ?? item?.Quantity;
    const quantityValue =
      typeof quantityRaw === 'number'
        ? quantityRaw
        : typeof quantityRaw === 'string' && !isNaN(Number(quantityRaw))
          ? Number(quantityRaw)
          : ""; // fallback to empty string for controlled input

    // qunatity
    returnObject.Quantity = (
      <>
        <Input
          type="number"
          className="table-input"
          placeholder={"Type"}
          value={quantityValue}
          respclass={"w-100"}
          name="Quantity"
          onChange={(e) => handleRemarksChange(e, index)}
          min={0}
        />
      </>
    );

    return returnObject;
  };


  // const handleTabody = () => {
  //   return tags[KEYS_NAME]?.map((item, index) => {
  //     const { SNo, Name, Dose, Time, Duration, Meal, Route, Remarks, Quantity } = settleValue(item, index);

  //     let returnData = {
  //       SNo,
  //       Name,
  //       Dose,
  //       Time,
  //       Duration,
  //       Meal,
  //       Route,
  //       Quantity
  //     };

  //     isDesktop && ["Time", "Duration", "Meal", "Route"]?.forEach(key => delete returnData[key])

  //     if ((type === "FromPage" && !isDesktop)) {
  //       returnData.Remarks = Remarks;
  //     }
  //     return returnData;
  //   });
  // };


// Update table body
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
      const timeData = await GetMedicineDose(2); // Example API call for Time
      const durationData = await GetMedicineDose(3); // Example API call for Duration
      const mealData = await GetMedicineDose(5); // Example API call for Meal
      const routeData = await GetMedicineDose(4); // Example API call for Route

      setItems((prevItems) => ({
        ...prevItems,
        Time: timeData?.data || [],
        Duration: durationData?.data || [],
        Meal: mealData?.data || [],
        Route: routeData?.data || [],
      }));
    };

    fetchInitialData();
  }, []);

  return (
    <div className="w-100">
      <Tables
        thead={(type === "FromPage" && !isDesktop) ? [...Thead, "Remarks"] : Thead}
        tbody={handleTabody()}
        // tbody={isShowFirst ? handleTabody()?.filter((val, index) => ((index !== handleTabody()?.length - 1))) :isDesktop? handleTabody()?.filter((val, index) => ((index === handleTabody()?.length - 1))):handleTabody()}
        WWW={"auto"}
      />

    </div>
  );
}

export default PrescribedMedicineTable;

