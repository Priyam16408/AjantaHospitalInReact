import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; 
import TextAreaInput from "../../components/formComponent/TextAreaInput";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../utils/utils";
import { GetUnApproveReason, SaveSampleRejectReasonApi } from "../../networkServices/resultEntry";
export default function ResultModelHoldModal({ handleChangeModel, inputData }) {



  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);
  
    const [isInput, setIsInput] = useState(false);
    const [newReason, setNewReason] = useState("");
  // const handlechange = (e) => {
  //   setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  // };


  const handleChange = (e) => {
    setNewReason(e?.target?.value);
  };

  
    const [reasons, setReasons] = useState([]);

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

        const handleSaveRejectReason = async () => {
          let reasonToSave = "";
      
          if (inputs?.rejectreason === "Other") {
            if (!newReason.trim()) {
              notify("Please enter a reason", "error");
              return;
            }
            reasonToSave = newReason.trim();
          } else {
            if (!inputs?.rejectreason || inputs.rejectreason === "0") {
              notify("Please select a reason", "error");
              return;
            }
            reasonToSave = inputs.rejectreason;
          }
      
          const payload = {
            unApproveReason: reasonToSave,
          };
      
          try {
            const response = await SaveSampleRejectReasonApi(payload);
            if (response?.success) {
              notify("Reason saved successfully", "success");
              handleGetReason();
              setIsInput(false);
              setNewReason("");
              setInputs((val) => ({ ...val, rejectreason: "" }));
            }
          } catch (error) {
            notify("Error saving reason", "error");
          }
        };
      
        useEffect(() => {
          handleGetReason();
        }, []);

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);
  console.log(inputs,"inputs----------")



  return (
    <>
      <div className="row p-2">

        {/* <TextAreaInput
          lable={t("holdRemarks")}
          className="w-100 required-fields"
          id="holdRemarks"
          rows={4}
          respclass="w-100"
          name="holdRemarks"
          value={inputs?.holdRemarks ? inputs?.holdRemarks : ""}
          onChange={handlechange}
          maxLength={1000}
        /> */}

<ReactSelect
          placeholderName={t("Select Reason . . .")}
          searchable={true}
          removeIsClearable={true}
          id="holdRemarks"
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


      </div>

      
      {isInput && (
          <div className="w-100">
            <TextAreaInput
              placeholder={t("Enter Reason . . .")}
              className="w-100 required-fields mt-2"
              id="newReason"
              rows={4}
              respclass="w-100"
              name="newReason"
              value={newReason}
              onChange={handleChange}
              maxLength={1000}
            />
            <div className="d-flex justify-content-end mt-2">
              <button
                className="btn btn-primary"
                onClick={handleSaveRejectReason}
              >
                {t("Add New")}
              </button>
            </div>
          </div>
        )}

    </>

  );
}

