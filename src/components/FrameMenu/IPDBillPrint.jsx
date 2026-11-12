import React, { useState } from "react";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import { IPDBillPrints } from "../../networkServices/ReportsAPI";
import { RedirectURL } from "../../networkServices/PDFURL";
import store from "../../../src/store/store";
import ReportsMultiSelect from "../ReportCommonComponents/ReportsMultiSelect";
import { notify } from "../../utils/ustil2";

const IPDBillPrint = ({ data }) => {
  const [t] = useTranslation();

  const [values, setValues] = useState({
    billType: "SUM",
    currency: "0",
    showReceipt: true,
    type: []
  });

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };
  const handlePrint = async () => {

    try {
      const response = await IPDBillPrints({
        TransactionID: parseInt(data.transactionID),
        Duplicate: 1,
        BillType: values.billType,
        IsBaseCurrency: parseInt(values.currency),
        IsReceipt: values?.type?.some(val => val?.name === "Show Receipt/Refund in Bill") ? 1 : 0,
        logo: values?.type?.some(val => val?.name === "Logo") ? 1 : 0,
        signature: values?.type?.some(val => val?.name === "Signature") ? 1 : 0,

      });
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        notify(response?.data?.message, "error");
      }
    } catch (error) {
      notify(error, "No Record Found.");
    }
  };

  return (
    <>
      <div className="card patient_registration border">
        <Heading title={"Admitted Patients"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Type of Bills")}
            id={"billType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Summary Bill", value: "SUM" },
              { label: "Detail Bill", value: "DET" },
              { label: "Package Bill Summary", value: "PKGSUM" },
              { label: "Package Bill Detail", value: "PKGDET" },
              { label: "Surgery Bill Summary", value: "SURSUM" },
              { label: "Surgery Bill Detail", value: "SUR" },
            ]}
            name="billType"
            value={values.billType}
            handleChange={handleReactSelectChange}
          />

          <ReactSelect
            placeholderName={t("Bill Print Currency")}
            id={"currency"}
            searchable={true}
            removeIsClearable={true}

            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Base Currency", value: "0" },
              { label: "Bill Generate Currency", value: "1" },
            ]}
            name="currency"
            value={values.currency}
            handleChange={handleReactSelectChange}

          />

          <ReportsMultiSelect
            name="type"
            placeholderName="Type"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={[
              { typeName: "Logo", typeID: "1" },
              { typeName: "Signature", typeID: "1" },
              { typeName: "Show Receipt/Refund in Bill", typeID: "1" },
            ]}
            // dynamicOptions={[{name:"abc",code:"dsd"},{name:"ddf",code:"dfdf"}]}
            labelKey="typeName"
            valueKey="typeID"
            requiredClassName="required-fields"
          />
          {/* <div className="col-xl-2 col-md-2 colt-sm-6 col-12 d-flex align-items-center">
            <input
              type="checkbox"
              checked={values.showReceipt}
              onChange={() =>
                setValues({ ...values, showReceipt: !values.showReceipt })
              }
            />
            <span>{t("Show Receipt/Refund in Bill")}</span>
          </div> */}
          <div className="row">

            <div className="col-sm-12 text-right">
              <button
                className="btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                onClick={handlePrint}
              >
                {t("Bill Print")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IPDBillPrint;
