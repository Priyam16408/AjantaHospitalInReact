import React, { useCallback, useEffect, useRef, useState } from "react";
import EasyUI from "../EasyUI/EasyUI";
import { useTranslation } from "react-i18next";
import Input from "../formComponent/Input";
import { Oldpatientsearch } from "../../networkServices/opdserviceAPI";
import { BIND_TABLE_BY_MED_FIRST_NAME, BIND_TABLE_OLDPATIENTSEARCH } from "../../utils/constant";
import { debounce, focusInput } from "../../utils/utils";

const SearchItemEassyUI = ({ onClick, BindListAPI, BindDetails, Head, customInputRef, isSelectFirst ,cellCss,selectedPackage,isCashPanel }) => {

  console.log(selectedPackage,"lere")
  const [t] = useTranslation();
  const [getOldPatientData, setGetOldPatientData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const handleOldPatientSearch = async (value, BindDetails) => {
    try {
      // debugger
      const data = await BindListAPI(value, BindDetails,selectedPackage,isCashPanel);
      if (data?.data?.length === 1 && isSelectFirst) {
        onClick(data?.data[0])
      }
      setGetOldPatientData(data?.data);
      setSelectedIndex(null); // Reset the selected index on new search
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setValue(BindDetails?.value)
    if (BindDetails?.value && BindDetails?.isCallhandleChange) {
      handleChange({ target: { value: BindDetails?.value } })
    }
  }, [BindDetails?.value])

  const handleOnClick = (details) => {
    onClick(details)
    setGetOldPatientData([])
  }

  const debouncedHandleOldPatientSearch = useCallback(
    debounce(handleOldPatientSearch, 300),
    [selectedPackage,isCashPanel]
  );

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      debouncedHandleOldPatientSearch(value, BindDetails);
    } else {
      setGetOldPatientData([]);
    }
    setValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex !== null && getOldPatientData[selectedIndex]) {
        setValue(getOldPatientData[selectedIndex]?.ItemName)
        onClick(getOldPatientData[selectedIndex]);
        setGetOldPatientData([])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex =
          prevIndex === null
            ? 0
            : Math.min(prevIndex + 1, getOldPatientData.length - 1);
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex =
          prevIndex === null
            ? getOldPatientData.length - 1
            : Math.max(prevIndex - 1, 0);
        return newIndex;
      });
    }
  };

  // useEffect(() => {
  //   // Optionally focus on input when component mounts
  //   focusInput("UHIDPatientNameMobileno");
  // }, []); // Empty dependency array to run only on mount

  return (
    <div className="row   pr-2">
      <div className="col-12">
        <div style={{ position: "relative" }}>
          <div className="d-flex">
            <Input
              type="text"
              className={`form-control ${BindDetails?.className}`}
              id={`${BindDetails?.id ? BindDetails?.id : 'UHIDPatientNameMobileno'}`}
              removeFormGroupClass={false}
              name="barcode"
              lable={t(BindDetails?.label)}
              required={true}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Add keydown event handler
              inputRef={customInputRef ? customInputRef : inputRef}
              value={value}
              respclass={"w-100"}
            />
            <div style={{ position: "absolute", right: "0px" }}>
              <label
                style={{
                  border: "1px solid #ced4da",
                  padding: "2px 5px",
                  borderRadius: "3px",
                }}
                onClick={() => inputRef?.current?.focus()}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </label>
            </div>
          </div>

          {getOldPatientData?.length > 0 && (
            <div
              style={{
                position: "absolute",
                zIndex: 99,
                width: "100%",
                top: "25px",
              }}
            >
              <EasyUI
                dataBind={getOldPatientData}
                dataColoum={Head}
                onClick={handleOnClick}
                selectedIndex={selectedIndex} // Pass selected index
                cellCss={cellCss}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchItemEassyUI;
