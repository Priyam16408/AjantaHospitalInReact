import React, { useEffect } from "react";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { useTranslation } from "react-i18next";

export default function TextAreaModal({ handleChangeModel,handleSaveButton }) {
  const {t } = useTranslation();
  const [newReason, setNewReason] = React.useState();

  useEffect(() => {
    handleChangeModel((prev) => ({
      ...prev,
      insufficientRemarks: newReason,
    }));
  }, [newReason]);
  return (
    <div>
      <TextAreaInput
        placeholder={t("Enter Reason . . .")}
        className="w-100 required-fields mt-2"
        id="newReason"
        rows={4}
        respclass="w-100"
        name="newReason"
        value={newReason ? newReason : ""}
        onChange={(e) => setNewReason(e.target.value)}
        maxLength={1000}
      />
    </div>
  );
}
