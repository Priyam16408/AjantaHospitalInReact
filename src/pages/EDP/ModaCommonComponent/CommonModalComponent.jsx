import React, { useState, useEffect } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";

const CommonModalComponent = ({ data = [], setData }) => {

  const [t] = useTranslation();
  const columns = 3;
  const [searchText, setSearchText] = useState("");
  const [selectedValues, setSelectedValues] = useState(
    data.filter((item) => item.isChecked).map((item) => item.value)
  );

  const [filteredData, setFilteredData] = useState(data);

  const itemsPerColumn = Math.ceil(filteredData.length / columns);

  const groupedData = Array.from({ length: columns }, (_, i) =>
    filteredData.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
  );

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredData(data);
    } else {
      const lowerSearch = searchText.toLowerCase();
      setFilteredData(
        data.filter((item) => item.label.toLowerCase().includes(lowerSearch))
      );
    }
  }, [searchText, data]);

  useEffect(() => {
    // Update the parent state with latest selection state
    const updatedData = data.map((item) => ({
      ...item,
      isChecked: selectedValues.includes(item.value),
    }));
    setData((val) => ({ ...val, modalData: updatedData }));

    // setData(updatedData);
  }, [selectedValues, data]);

  const handleCheckboxChange = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allValues = filteredData.map((item) => item.value);
      setSelectedValues(allValues);
    } else {
      setSelectedValues([]);
    }
  };

  const isAllSelected =
    filteredData.length > 0 && selectedValues.length === filteredData.length;

  return (
    <div className="p-3">
      {/* Search Box and Select All */}
      <div style={{ gap: "10px" }} className="d-flex align-items-centery ml-2">
        <div className="form-check d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="selectAll"
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <label className="form-check-label ml-2" htmlFor="selectAll">
            {t("Select All")}
          </label>
        </div>
      </div>

      {/* Checkboxes in Columns */}
      <div className="row" style={{ maxHeight: "500px", overflowY: "auto" }}>
        {groupedData.map((group, colIdx) => (
          <div className="col-md-4 mb-3" key={colIdx}>
            <div className="" style={{ borderRadius: "12px" }}>
              <div className="card-body p-2">
                {group.map((row, index) => (
                  <div
                    className="form-check d-flex align-items-center mb-2"
                    key={`${colIdx}_${index}`}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={row?.value}
                      id={`check_${colIdx}_${index}`}
                      checked={selectedValues.includes(row?.value)}
                      onChange={() => handleCheckboxChange(row?.value)}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor={`check_${colIdx}_${index}`}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginLeft: "6px",
                      }}
                    >
                      {row?.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonModalComponent;
