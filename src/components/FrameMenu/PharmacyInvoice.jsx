import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { Pharmacy_Type } from "../../utils/constant";
import ReportsMultiSelect from "../ReportCommonComponents/ReportsMultiSelect";
import {
  BindPharmacySubcategory,
  PharmacyInvoiceReport,
} from "../../networkServices/pharmecy";
import { RedirectURL } from "../../networkServices/PDFURL";
import { notify } from "../../utils/utils";
import { useTranslation } from "react-i18next";

const PharmacyInvoice = ({ data }) => {
    const [t] = useTranslation();
  const [payload, setPayload] = useState({ type: "", subGroup: "" });
  const [subGroupId, setSubGroupId] = useState([]);

  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value || "" }));
  };

  const getBindPharmacySubcategory = async () => {
    try {
      const response = await BindPharmacySubcategory();
      setSubGroupId(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };
  const Report = async () => {
    const TransID = String(data?.transactionID) || "";
    const SubcategoryID = handlePayloadMultiSelect(payload?.subGroup) || "";
    const Type = String(payload?.type) || "";
    try {
      const response = await PharmacyInvoiceReport(
        TransID,
        SubcategoryID,
        Type
      );
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getBindPharmacySubcategory();
  }, []);
  return (
    <>
    <div className="card">
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Type")}
          id="type"
          name="type"
          label={t("Type")}
          value={payload?.type}
          handleChange={handleReactSelect}
          removeIsClearable={true}
          dynamicOptions={Pharmacy_Type}
          searchable={true}
          respclass="col-xl-2 col-sm-4 col-md-6 col-12"
        />
        <ReportsMultiSelect
          name="subGroup"
          placeholderName={t("Sub-Group")}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          values={payload}
          setValues={setPayload}
          dynamicOptions={subGroupId}
          labelKey="NAME"
          valueKey="SubCategoryID"
          requiredClassName={true}
        />
        <div className="col-sm-1">
          <button className="btn btn-sm btn-success" onClick={Report} type="button">
            {t("Report")}
          </button>
        </div>
      </div>
    </div>
  </>
  );
};

export default PharmacyInvoice;
