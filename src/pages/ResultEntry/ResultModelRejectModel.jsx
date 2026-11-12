// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next"; 
// import TextAreaInput from "../../components/formComponent/TextAreaInput";
// export default function ResultModelRejectModel({ handleChangeModel, inputData }) {



//   const [t] = useTranslation();
//   const [inputs, setInputs] = useState(inputData);
//   const handlechange = (e) => {
//     setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
//   };


//   useEffect(() => {
//     handleChangeModel(inputs);
//   }, [inputs]);



//   return (
//     <>
//       <div className="row p-2">

//         <TextAreaInput
//           lable={t("RejectReason")}
//           className="w-100 required-fields"
//           id="RejectReason"
//           rows={4}
//           respclass="w-100"
//           name="RejectReason"
//           value={inputs?.RejectReason ? inputs?.RejectReason : ""}
//           onChange={handlechange}
//           maxLength={1000}
//         />


//       </div>

//     </>

//   );
// }

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import { GetholdReason, GetUnApproveReason} from "../../networkServices/resultEntry";
import ReactSelect from "../../components/formComponent/ReactSelect";
import TextAreaInput from "../../components/formComponent/TextAreaInput";
import { notify } from "../../utils/ustil2";
import { handleReactSelectDropDownOptions } from "../../utils/utils";

export default function ResultModelRejectModel({
  handleChangeModel, inputData 
}) {
  const [t] = useTranslation();
  
  // Safe initial state: if inputData is missing, fallback to empty object
  const [inputs, setInputs] = useState(() => ({
    rejectreason: inputData?.rejectreason || "",
  }));
  
  const [reasons, setReasons] = useState([]);
  const [isInput, setIsInput] = useState(false);
  const [newReason, setNewReason] = useState("");

 const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };  

  const handleReactSelect = (name, e) => {
    const selectedValue = e?.value;

    if (selectedValue === "Other") {
      setIsInput(true);
    } else {
          setInputs((val) => ({ ...val, [name]: selectedValue }));
      setIsInput(false);
    }
  };

  const handleGetReason = async () => {
    try {
      const response = await GetUnApproveReason();
      if (response?.success) {
        setReasons(response?.data);
      }
    } catch (error) {
      notify("Error fetching data", "error");
    }
  }; 
  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs, handleChangeModel]);

 

  useEffect(() => {
    handleGetReason();
  }, []);

  return (
    <div className="d-flex align-items-baseline w-100">
      <div className="row p-2 w-100">
        <ReactSelect
          placeholderName={t("Select Reason . . .")}
          searchable={true}
          removeIsClearable={true}
          id="rejectreason"
          name="rejectreason"
          value={inputs?.rejectreason || ""}
          handleChange={handleReactSelect}
          respclass="w-100"
          dynamicOptions={[
            { value: "0", label: "ALL" },
            ...handleReactSelectDropDownOptions(
              reasons,
              "UnapproveReason",
              "UnapproveReason"
            ),
            { value: "Other", label: "Other" },   
          ]}
        />

        {isInput && (
          <div className="w-100">
            <TextAreaInput
              placeholder={t("Enter Reason . . .")}
              className="w-100 required-fields mt-2"
              id="newReason"
              rows={4}
              respclass="w-100"
              name="newReason"
                value={inputs?.newReason ? inputs?.newReason : ""}
              onChange={handleChange}
              maxLength={1000}
            /> 
          </div>
        )} 
      </div>
    </div>
  );
}
