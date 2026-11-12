import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../UI/customTable";
import CustomSelect from "../../../formComponent/CustomSelect";
import Input from "../../../formComponent/Input";
import {
  NoOfPrintsOption,
  PRESCRIBED_MEDICINE,
} from "../../../../utils/constant";
import { GetMedicineDose } from "../../../../networkServices/DoctorApi";
import { AutoComplete } from "primereact/autocomplete";
import { PharmacyBindDoseItem } from "../../../../networkServices/pharmecy";

const ViewItemLabelModal = ({
  viewDetails,
  setViewDetails,
  handleCustomSelect,
}) => {
  const [t] = useTranslation();

  const handleChangeCheckboxHeader = (e) => {
    let respData = viewDetails?.map((val) => {
      val.isChecked = e?.target?.checked;
      return val;
    });
    setViewDetails(respData);
  };
  const handleChangeCheckbox = (e, ele, index) => {
    let data = viewDetails.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setViewDetails(data);
  };
  const thead = [
    {
      name: (
        <input
          type="checkbox"
          name="checkbox"
          onChange={(e) => {
            handleChangeCheckboxHeader(e);
          }}
        />
      ),
      width: "1%",
    },
    { name: t("No. Of Print"), width: "1%" },
    { name: t("Item Name"), width: "10%" },
    { name: t("Dose"), width: "5%" },
    { name: t("Times"), width: "5%" },
    { name: t("Duration"), width: "4%" },
    { name: t("Caution"), width: "4%" },
    { name: t("Meals"), width: "2%" },
  ];

  const [items, setItems] = useState({
    Dose: [],
    Time: [],
    Duration: [],
    Meal: [],
    Route: [],
    Caution: [],
  });

  const [filteredItems, setFilteredItems] = useState({
    Dose: [],
    Time: [],
    Duration: [],
    Meal: [],
    Route: [],
    Caution: [],
  });

  // Fetch medicine dose data
  const handleGetMedicineDose = async () => {
    try {
      const Type = { Dose: 1, Time: 2, Duration: 3, Route: 4, Meal: 5 , Caution: 6};
      const fetchedData = {};
      const apiResp = await PharmacyBindDoseItem()
      console.log("APIRESP" , apiResp)
      for (const key in Type) {
        // const response = await GetMedicineDose(Type[key]);
        fetchedData[key] = apiResp?.data?.filter((val)=>val?.TYPE===key);
        // fetchedData[key] = response?.data;
      }
      console.log("fetchedData", fetchedData)
      setItems(fetchedData);
    } catch (error) {
      console.error("Error fetching medicine dose data:", error);
    }
  };

  // Search filter for autocomplete
  const searchStatic = (event, type) => {
    console.log("Items", items)
    const query = event.query.toLowerCase().trim();
    const filteredData = items[type]?.filter((ele) =>
      ele?.NAME?.toLowerCase().includes(query)
    );
    setFilteredItems((prev) => ({
      ...prev,
      [type]: filteredData,
    }));
  };

  // Template for AutoComplete items
  const StaticItemTemplate = (item) => (
    <div style={{ fontSize: "12px" }}>{item?.NAME}</div>
  );

  // Handle changes in table inputs
  const handleChange = (e, index) => {
    // console.log("handleChange", e, index);
    const { name, value } = e.target;
    console.log("Name" , "Value", name, value)
    setViewDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  // Handle item selection
  const onSelect = (e, category, index) => {
    const { value } = e;
    setViewDetails((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [category]: {
              value: value?.NAME || value?.Brand,
              ID: value?.ID || value?.ItemID,
            },
          }
          : item
      )
    );
  };

  useEffect(() => {
    handleGetMedicineDose();
  }, []);
  return (
    <Tables
      thead={thead}
      tbody={viewDetails.map((ele, index) => ({
        action: (
          <input
            type="checkbox"
            onChange={(e) => {
              handleChangeCheckbox(e, ele, index);
            }}
            checked={ele?.isChecked ? ele?.isChecked : false}
          />
        ),
        NoOFPrint: (
          <CustomSelect
            option={NoOfPrintsOption}
            placeHolder="Select"
            value={ele?.NoOfPrints}
            onChange={(name, e) => handleCustomSelect(index, name, e)}
            name="NoOfPrints"
          />
        ),
        TypeName: ele?.TypeName,
        Dose: (
          <AutoComplete
            suggestions={filteredItems["Dose"]}
            completeMethod={(e) => searchStatic(e, "Dose")}
            value={ele?.Dose?.value ? ele?.Dose?.value : ele?.Dose ? ele?.Dose : ""}
            onChange={(e) => handleChange(e, index)}
            name="Dose"
            className="w-100"
            onSelect={(e) => onSelect(e, "Dose", index)}
            itemTemplate={StaticItemTemplate}
          />
        ),
        Time: (
          <AutoComplete
            suggestions={filteredItems["Time"]}
            completeMethod={(e) => searchStatic(e, "Time")}
            // value={ele?.Time?.value ?? ""}
            value={ele?.Time?.value ? ele?.Time?.value : ele?.Time ? ele?.Time : ""}
            onChange={(e) => handleChange(e, index)}
            name="Time"
            className="w-100"
            onSelect={(e) => onSelect(e, "Time", index)}
            itemTemplate={StaticItemTemplate}
          />
        ),
        Duration: (
          <AutoComplete
            suggestions={filteredItems["Duration"]}
            completeMethod={(e) => searchStatic(e, "Duration")}
            // value={ele?.Duration?.value ?? ""}
            value={ele?.Duration?.value ? ele?.Duration?.value : ele?.Duration ? ele?.Duration : ""}
            onChange={(e) => handleChange(e, index)}
            name="Duration"
            className="w-100"
            onSelect={(e) => onSelect(e, "Duration", index)}
            itemTemplate={StaticItemTemplate}
          />
        ),
        Caution: (
          // <Input
          //   className="table-input"
          //   name="Caution"
          //   type="text"
          //   value={ele?.Caution ?? ""}
          //   onChange={(e) => handleChange(e, index)}
          // />
          <AutoComplete
            suggestions={filteredItems["Caution"]}
            completeMethod={(e) => searchStatic(e, "Caution")}
            // value={ele?.Duration?.value ?? ""}
            value={ele?.Caution?.value ? ele?.Caution?.value : ele?.Caution ? ele?.Caution : ""}
            onChange={(e) => handleChange(e, index)}
            name="Caution"
            className="w-100"
            onSelect={(e) => onSelect(e, "Caution", index)}
            itemTemplate={StaticItemTemplate}
          />
        ),
        Meals: (
          <AutoComplete
            suggestions={filteredItems["Meal"]}
            completeMethod={(e) => searchStatic(e, "Meal")}
            // value={ele?.Meal?.value ?? ""}
            value={ele?.Meal?.value ? ele?.Meal?.value : ele?.Meal ? ele?.Meal : ""}
            onChange={(e) => handleChange(e, index)}
            name="Meal"
            className="w-100"
            onSelect={(e) => onSelect(e, "Meal", index)}
            itemTemplate={StaticItemTemplate}
          />
        ),
      }))}
    />
  );
};

export default ViewItemLabelModal;
