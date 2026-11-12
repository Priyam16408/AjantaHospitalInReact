import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";

const CreateDoc = ({values , setValues}) => {
  const [t] = useTranslation();

  const [payload, setPayload] = useState(values);
  const handleInputChange = (e, index, label) => {
    setPayload((val) => ({ ...val, [label]: e.target.value }));
  };

  useEffect(() => {
    setValues((val) => ({ ...val, modalData: payload }));
    // setValues(payload);
  },[payload]);
  return (
    <div>
      <Input
        type="docName"
        className={"form-control required-fields"}
        lable={t("Document Name")}
        placeholder=" "
        id="docName"
        name="docName"
        onChange={(e) => handleInputChange(e, 0, "docName")}
        value={payload?.docName}
        required={true}
        respclass="col-12"
      />
    </div>
  );
};

export default CreateDoc;
