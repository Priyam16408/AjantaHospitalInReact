 
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";

export default function OtBookingApprovalModal({
  handleChangeModel,
  inputData,
}) {
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);  

  const [values,setValues] = useState({
    UHID:"",
    department:{label:"",value:""}
  })

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);

 
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };  
 

 

  return (
    <>
      <div className="">
        <div className="row p-2 w-100">
      
          
          {/* <Input
            type="text"
            placeholder=""
            className="form-control"
            id="UHID"
            name="UHID"
            value={inputs?.UHID || ""}
            onChange={handleChange}
            lable={t("UHID")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
          /> */}
           <div className="col-xl-6 col-md-4 col-sm-4 col-12">
                <LabeledInput label={t("Ot Number")} value={inputData?.OTNumber} />
              </div>

          <ReactSelect
            placeholderName={t("Equipment")}
            id={"Equipment"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-6 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={[
            //   { value: "0", label: "ALL" },
            //   ...handleReactSelectDropDownOptions(
            //     departmentData,
            //     "Name",
            //     "ObservationType_ID"
            //   ),
            // ]}
            // handleChange={handleSelect}
            value={`${inputs?.Equipment?.value}`}
            name={"Equipment"}
          />


              <Input
            type="number"
            placeholder=""
            className="form-control"
            id="qunatity"
            name="qunatity"
            value={inputs?.qunatity || ""}
            onChange={handleChange}
            lable={t("Quantity")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
          />
       
              <TextAreaInput
                placeholder={""}
                lable={t("Enter Reason")}
                className="w-100 h-24"
                id="newReason"
                rows={4}
                respclass="col-xl-6 col-md-4 col-sm-4 col-sm-4 col-12"
                name="newReason"

                // value={newReason ? inputs?.newReason : ""}
                value={inputs?.newReason ? inputs?.newReason : ""}
                // onChange={(e) => setNewReason(e.target.value)}
                onChange={handleChange}
                maxLength={1000}
              /> 
        </div>
      </div>
    </>
  );
}
