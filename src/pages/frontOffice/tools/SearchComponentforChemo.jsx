import React, { useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { Oldpatientsearch } from "../../../networkServices/opdserviceAPI";
import { BIND_TABLE_CHEMOPATIENTSEARCH, BIND_TABLE_OLDPATIENTSEARCH } from "../../../utils/constant";
import { debounce, focusInput } from "../../../utils/utils";
import EasyUI from "../../../components/EasyUI/EasyUI";
import Input from "../../../components/formComponent/Input";
import { BillingToolChemoPatientDetail } from "../../../networkServices/Tools";
import BindTableDetails from "./BindTableDetails";

const SearchComponentforChemo = ({ onClick,data }) => {
  const [t] = useTranslation();
  const [getOldPatientData, setGetOldPatientData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleOldPatientSearch = async (value) => {
    try {
      const data = await BillingToolChemoPatientDetail(value);
    //   const data = await Oldpatientsearch(value);
      if(data?.data?.length===1){
        onClick(data?.data[0])
      }
      setGetOldPatientData(data?.data);
      setSelectedIndex(null); 
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedHandleOldPatientSearch = useCallback(
    debounce(handleOldPatientSearch, 300),
    []
  );

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length > 2) {
      debouncedHandleOldPatientSearch(value);
    } else {
      setGetOldPatientData([]);
    }
    setValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex !== null && getOldPatientData[selectedIndex]) {
        onClick(getOldPatientData[selectedIndex]);
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

  useEffect(() => {
    // Optionally focus on input when component mounts
    focusInput("UHIDPatientNameMobileno");
  }, []); // Empty dependency array to run only on mount

  return (
    <>
    <div className="row pt-2 pl-2 pr-2">
      <div className="col-xl-6 col-md-4 col-sm-6 col-12">
        <div style={{ position: "relative" }}>
          <div className="d-flex">
            <Input
              type="text"
              className="form-control"
              id="UHIDPatientNameMobileno"
              removeFormGroupClass={false}
              name="barcode"
              lable={t(
                "UHID/Patient Name/Mobile no."
              )}
              required={true}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Add keydown event handler
              inputRef={inputRef}
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
                onClick={() => inputRef.current.focus()}
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
                dataColoum={BIND_TABLE_CHEMOPATIENTSEARCH}
                onClick={onClick}
                selectedIndex={selectedIndex} // Pass selected index
              />
            </div>
          )}
        </div>
      </div>
     
    </div>
     <BindTableDetails 
   
      />
    </>
  );
};

export default SearchComponentforChemo;
