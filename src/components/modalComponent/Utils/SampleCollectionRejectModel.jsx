import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { notify } from "../../../utils/utils";
import {
  getRejectReasonOptionsApi,
  SaveSampleRejectReasonApi,
} from "../../../networkServices/SampleCollectionAPI";

export default function SampleCollectionRejectModel({
  handleChangeModel,
  inputData,
}) {
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);
  const [reasons, setReasons] = useState([]);
  const [isInput, setIsInput] = useState(false);
  const [newReason, setNewReason] = useState("");

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);

  const handleReactSelect = (name, e) => {
    if (e?.value === "Other") {
      setIsInput(true);
    } else {
      setIsInput(false);
      setInputs((val) => ({ ...val, [name]: e?.value }));
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };  
  const handleGetReason = async () => {
    try {
      const response = await getRejectReasonOptionsApi();
      if (response?.success) {
        setReasons(response?.data);
      }
    } catch (error) {
      notify("Error fetching data", "error");
    }
  };



  useEffect(() => {
    handleGetReason();
  }, []);

  return (
    <>
      <div className="d-flex align-items-baseline w-100">
        <div className="row p-2 w-100">
          <ReactSelect
            placeholderName={t("Select Reason . . .")}
            searchable={true}
            removeIsClearable={true}
            id="rejectreason"
            name="rejectreason"
            value={inputs?.rejectreason ? inputs?.rejectreason : ""}
            handleChange={handleReactSelect}
            respclass="w-100 "
            dynamicOptions={[
              ...(reasons?.map((item) => ({
                label: item?.Reasion,
                value: item?.Reasion,
              })) || []),
              {
                label: "Other",
                value: "Other",
              },
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
                // value={newReason ? inputs?.newReason : ""}
                value={inputs?.newReason ? inputs?.newReason : ""}
                // onChange={(e) => setNewReason(e.target.value)}
                onChange={handleChange}
                maxLength={1000}
              />
              
              {/* <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveRejectReason}
                >
                  {t("Add New")}
                </button>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
