import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import Heading from "../../../../components/UI/Heading";
import {
  EDPBindDischargeType,
  EDPBindProcessStep,
  EDPUpdateProcessStep,
} from "../../../../networkServices/EDP/govindedp";
import { handleReactSelectDropDownOptions } from "../../../../utils/utils";
import { notify } from "../../../../utils/ustil2";

const DischargeProcessSetting = ({ data }) => {
  const [t] = useTranslation();
  const [dropDownState, setDropDownState] = useState({
    DischargeProcessSetup: [],
  });
  const [values, setValues] = useState({});
  console.log("values", values);

  const fetchData = async () => {
    const response = await EDPBindProcessStep();

    if (response?.success) {
      let selectedValue = [];
      let data = response?.data?.map((val) => {
        const isColor = val?.ID?.split("#")[1] === "1";
        let returnData = {
          code: val?.ID,
          name: val?.Step,
          isColor: isColor,
        };
        if (val?.ID?.split("#")[1] === "1") {
          returnData.disabled = true;
        }
        if (val?.ID?.split("#")[2] === "1") {
          selectedValue.push(returnData);
        }
        return returnData;
      });
      setValues((val) => ({ ...val, DischargeProcessSetup: selectedValue }));

      setDropDownState((val) => ({
        ...val,
        DischargeProcessSetup: data,
      }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues((prev) => ({
      ...prev,
      [name]: selectedOptions,
    }));
  };

  const handleUpdate = async () => {
    const payloadItems = Object.entries(values).flatMap(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        // ;
        return val.map((item) => ({
          isactive: true,
          value: item.code,
        }));
      }
      return [];
    });

    const payload = {
      items: payloadItems,
    };

    console.log("Payload ", payload);

    const response = await EDPUpdateProcessStep(payload);

    if (response?.success) {
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        isMainHeading={{
          data: data === undefined ? 0 : 1,
          FrameMenuID: data?.FrameMenuID,
        }}
        isSlideScreen={false}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="DischargeProcessSetup"
          id="DischargeProcessSetup"
          placeholderName={t("Discharge Process Setup")}
          dynamicOptions={dropDownState?.DischargeProcessSetup}
          handleChange={handleMultiSelectChange}
          value={values?.DischargeProcessSetup}
          itemTemplate={(option) => {
         
              return <div style={{textWrap:"auto",backgroundColor:option?.isColor?"":"#77DD77" , color:option?.isColor?"":"#000000"}}>{option.name}{console.log("asdasd",option)}</div>;
           
          }}
        />
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={handleUpdate}
        >
          {t("Update")}
        </button>
      </div>
    </div>
  );
};

export default DischargeProcessSetting;
