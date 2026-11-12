import React from 'react'
import { useTranslation } from "react-i18next";
import i18n from "@app/utils/i18n";
import Input from "@app/components/formComponent/Input";
export default function DiscountReasonModel() {
  const [t] = useTranslation();

  return (
    <div className="row p-2">
    <Input
      type="text"
      className="form-control"
      id="ContactNo"
      name="ContactNo"
      lable={t("modalComponent.Utils.DiscountReasonModel.Discount_Reason")}
      placeholder=" "
      respclass="col-12"
    />
 
  </div>
  )
}
