import React, { useState, useEffect } from "react";
import { Tabfunctionality } from "../../../../utils/helpers";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import CurrencyMasterTable from "./CurrencyMasterTable";
import { BindCurrencyMaster, FinanceGetCountry, FinanceSaveCurrencyMaster } from "../../../../networkServices/finance";

const CurrencyMaster = () => {
  const [t] = useTranslation();
  const [isEdit, setIsEdit] = useState(false)
  const [bindCurencyData, setBindCurrencyData] = useState()
  const [dropDownState, setDropDownState] = useState({
    Countrydata: [],
  })
  const [values, setValues] = useState({
    BaseCurrency: "",
    currencyCode: "",
    country: "",
    CurrencyID: "",
    active: {
      value: "1",
      label: "YES",
    },
  });

  const GetCountry = async () => {
    try {
      const response = await FinanceGetCountry();
      setDropDownState((val) => ({
        ...val,
        Countrydata: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "CountryID"
        ),
      }));
      setValues((preV) => ({
        ...preV,
        country: response.data[0]
      }))
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const FBindCurrencyMaster = async () => {
    try {
      let apiResp = await BindCurrencyMaster()

      if (apiResp?.success) {
        setBindCurrencyData(apiResp?.data);
      } else {

        notify("some error occurs", "error");
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    GetCountry()
    FBindCurrencyMaster()
  }, [])

  const handleReactSelect = (name, e) => {
    setValues((val) => ({ ...val, [name]: e }));
  };
  const handleInputChange = (name, event) => {
    setValues((prevValues) => ({ ...prevValues, [name]: event.target.value }));
  };

  const handleSaveMaster = async () => {
    if (!values?.BaseCurrency) {
      notify("BaseCurrency is Required", "error")
      return
    }
    if (!values?.currencyCode) {
      notify("currencyCode is Required", "error")
      return
    }
    if (!values?.country) {

      notify("country is Required", "error")
      return
    }
    if (!values?.active) {

      notify("Active is Required", "error")
      return
    }
    const payload = {
      "currDescription": values?.BaseCurrency,
      "currencyCode": values?.currencyCode,
      "isActive": Number(values?.active?.value),
      "savetype": isEdit ? "Update" : "Save",
      "currID": Number(isEdit ? values?.CurrencyID : ""),
      "countryID": Number(values?.country?.CountryID)

    }

    try {
      const response = await FinanceSaveCurrencyMaster(payload);
      if (response?.success) {
        notify(response?.message, "success");
        FBindCurrencyMaster()
        setIsEdit(false)
        setValues((preV) => (
          {
            ...preV,
            BaseCurrency: "",
            currencyCode: "",
            country: "",
            CurrencyID: "",
            active: {
              value: "1",
              label: "YES",
            },
          }
        ))

      }
      else {
        notify(response?.message, "error");
      }

    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleEdit = (val) => {
   
    setIsEdit(true)
    setValues((preV) => (
      {
        ...preV,
        CurrencyID: val?.CurrencyID,
        BaseCurrency: val?.CurrDescription,
        currencyCode: val?.CurrencyCode,
        country: {
          CountryID: val?.CountryID

        },
        active: val?.Active == "Yes"
          ? { label: "YES", value: "1" }
          : { label: "NO", value: "0" }
      }
    ))
  }
  const handleCencel = () => {
    setIsEdit(false)
    setValues({
      BaseCurrency: "",
      currencyCode: "",
      country: "",
      active: "",
    })

  }
  return (
    <div className="card border">
      <Heading title={"Currency Master"} isBreadcrumb={false} />
      <div className="row p-2">
        <Input
          type="text"
          className="form-control required-fields"
          lable={t("Base Currency")}
          placeholder=" "
          id="BaseCurrency"
          name="BaseCurrency"
          value={values?.BaseCurrency}
          // onChange={handleChange}
          onChange={(e) => handleInputChange("BaseCurrency", e)}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          onKeyDown={Tabfunctionality}
        />
        <Input
          type="text"
          className="form-control required-fields"
          lable={t("Currency Code")}
          placeholder=" "
          id="currencyCode"
          name="currencyCode"
          value={values?.currencyCode}
          // onChange={(e) => handleInputChange("fullName", e)}
          onChange={(e) => handleInputChange("currencyCode", e)}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          onKeyDown={Tabfunctionality}
        />

        <ReactSelect
          placeholderName={t("Country")}
          requiredClassName={"required-fields"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id={"country"}
          name={"country"}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}

          dynamicOptions={dropDownState?.Countrydata}
          value={values?.country?.CountryID || values?.country?.value}
        />

        <ReactSelect
          placeholderName={t("Active")}
          id={"active"}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"

          dynamicOptions={[
            {
              value: "1",
              label: "YES",
            },
            {
              value: "0",
              label: "NO",
            },
          ]}
          name="active"
          handleChange={handleReactSelect}
          value={values?.active?.value}
        />
        {
          isEdit ? (
            <>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSaveMaster}
              >
                {t("Update")}
              </button>
              <button
                className="btn btn-sm btn-primary ml-2"
                onClick={handleCencel}
              >
                {t("Cancel")}
              </button>
            </>
          )
            :
            (
              <> <button
                  className="btn btn-sm btn-success mx-2"
                  onClick={handleSaveMaster}
                >
                  {t("Save")}
                </button>
              </>
            )
        }
      </div>
      <Heading title={"Currency Details"} isBreadcrumb={false} />
      <CurrencyMasterTable bindCurencyData={bindCurencyData} onEdit={handleEdit} />
    </div>
  );
};

export default CurrencyMaster;
