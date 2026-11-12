import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadItems } from "../../networkServices/BillingsApi";
import { AutoComplete } from "primereact/autocomplete";

const SearchBloodBank = ({
  data,
  handleItemSelect,
  itemName,
  pateintDetails,
  payload,
  AddRowData,
}) => {
  const [t] = useTranslation();
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  console.log(payload);
  const getbindIPDPatientDetails = async () => {
    try {
      const response = await LoadItems();
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (event) => {
    const item = await getbindIPDPatientDetails(event?.query.trim());
    setItems(item);
  };
  console.log(items);
  const itemTemplate = (item) => {
    return (
      <div
        className="p-clearfix"
        // onClick={() => validateInvestigation(item, 0, 0, 1, 0)}
      >
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TypeName}
        </div>
      </div>
    );
  };

  const handleSelectRow = (e) => {
    const { value } = e;
    console.log(value);
    handleItemSelect(value?.TypeName, value?.ItemID, value);
    setValue(null);
  };
  const handlePressKey = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      AddRowData();
    }
  };

 
  return (
    <div className="row">
      <div className="col-12">
        <AutoComplete
          value={value ?? itemName?.label}
          suggestions={items}
          completeMethod={search}
          // ref={ref}
          className="required-fields w-100"
          onSelect={(e) => handleSelectRow(e)}
          id="searchtest"
          onChange={(e) => {
            setValue(e?.value);
          }}
          itemTemplate={itemTemplate}
          onKeyPress={handlePressKey}
        />
        <label
          // htmlFor={id}
          className="label lable truncate ml-3 p-1"
          style={{ fontSize: "5px !important" }}
        >
          {t("Search Item")}
        </label>
      </div>
    </div>
  );
};

export default SearchBloodBank;
