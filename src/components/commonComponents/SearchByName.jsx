import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BindItemSurgery } from "../../networkServices/BillingsApi";
import { AutoComplete } from "primereact/autocomplete";

const SearchByName = ({ data, handleItemSelect, itemName }) => {
  const [t] = useTranslation();
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  const getbindIPDPatientDetails = async (value) => {
    const payLoadList = {
      itemName: value,
      row: 1000,
      referenceCode: String(data?.referenceCode),
      ipdCaseTypeID: 0,
      scheduleChargeID: String(data?.scheduleChargeID),
    };
    try {
      const response = await BindItemSurgery(payLoadList);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
  console.log(items);
  const search = async (event) => {
    const item = await getbindIPDPatientDetails(event?.query.trim());
    setItems(item);
  };

  const itemTemplate = (item) => {
    return (
      <div
        className="p-clearfix"
        // onClick={() => validateInvestigation(item, 0, 0, 1, 0)}
      >
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TypeName}{" "}
          <span style={{ fontWeight: "900", color: "black" }}>|</span>{" "}
          {item?.Department}
        </div>
      </div>
    );
  };

  const handleSelectRow = (e) => {
    const { value } = e;
    handleItemSelect(value?.TypeName, value?.ItemId);
    setValue(null);
  };

  return (
    <div className="row">
      <div className="col-12">
        <AutoComplete
          value={value ?? itemName?.label}
          suggestions={items}
          completeMethod={search}
          className="required-fields w-100"
          onSelect={(e) => handleSelectRow(e)}
          id="searchtest"
          onChange={(e) => {
            setValue(e?.value);
          }}
          itemTemplate={itemTemplate}
        />
        <label
          className="label lable truncate ml-3"
          style={{ fontSize: "5px !important" }}
        >
          Search Item
        </label>
      </div>
    </div>
  );
};

export default SearchByName;
