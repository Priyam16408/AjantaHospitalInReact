import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { ChangeTypeOption } from "../../utils/constant";
import {
  BillingCategory,
  bindPanelRoleWisePanelGroupWise,
  LoadDiffPanelRates,
  SaveTariffic,
} from "../../networkServices/BillingsApi";
import Heading from "../UI/Heading";
import TariffModificationTable from "../UI/customTable/billings/TariffModificationTable";
import LabeledInput from "../formComponent/LabeledInput";
import { notify } from "../../utils/utils";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const TariffChange = ({ data }) => {
  const { t } = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [billingCategory, setBillingCategory] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [panel, setPanel] = useState([]);
  const initialState = {
    ChangeType: "2",
    billCategory: "",
    panelID: "",
  };
  const [payload, setPayload] = useState({ ...initialState });
  console.log(tableData);
  const handleReactSelect = (name, value) => {
    setPayload((prevData) => ({
      ...prevData,
      [name]: value?.value || "",
    }));
    if (name == "ChangeType") {
      if (payload?.ChangeType === "1") {
        setPayload((prevData) => ({
          ...prevData,
          billCategory: "",
        }));
        getBindPanelGroup();
      } else {
        setPayload((prevData) => ({
          ...prevData,
          billCategory: "",
        }));
        getBindBillingCategory();
      }
    }
    console.log(value?.value);
    if (name === "billCategory") {
      getLoadDiffPanelRates({ ...payload, [name]: value?.value });
    }
  };
  console.log(payload);
  const getBindBillingCategory = async () => {
    try {
      const response = await BillingCategory();
      setBillingCategory(response?.data || []);
    } catch (error) {
      console.error("Error fetching billing categories", error);
    }
  };
  const getLoadDiffPanelRates = async (updatedPayload = payload) => {
    // debugger;
    const listPayload = {
      tid: Number(data?.transactionID),
      panelID:
        payload?.ChangeType == "2"
          ? 0
          : updatedPayload?.billCategory
            ? Number(updatedPayload?.billCategory)
            : 0,
      ipdCaseTypeID:
        payload?.ChangeType == "2"
          ? Number(updatedPayload?.billCategory)
          : Number(data?.ipdCaseTypeID),
      scheduleChargeID: Number(data?.scheduleChargeID),
      actualPanelID: Number(data?.panelID),
    };

    try {
      const response = await LoadDiffPanelRates(listPayload);
      setTableData(response?.data);
    } catch (error) {
      console.error("Error fetching table data", error);
    }
  };

  const getBindPanelGroup = async () => {
    try {
      const response = await bindPanelRoleWisePanelGroupWise();
      setPanel(response?.data || []);
    } catch (error) {
      console.error("Error fetching panel data", error);
    }
  };
  console.log(payload,"payloadpayload")

  const handleSave = async () => {
    debugger
    try {
      const requestBody = {
        ipAddress: ip,
        scheduleChargeID: Number(data?.scheduleChargeID),
        ipdCaseTypeID: data?.ipdCaseTypeID,
        tid: Number(data?.transactionID),
        panelID: Number(payload?.panelID),
      };

      const response = await SaveTariffic(requestBody);

      if (response?.success) {
        notify(response?.message, "success");
        getLoadDiffPanelRates();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  useEffect(() => {
    getBindBillingCategory();
    getBindPanelGroup();
    getLoadDiffPanelRates();
  }, []);

  const thead = [
    { width: "3%", name: t("S.No.") },
    { width: "30%", name: t("Category") },
    t("Current Gross Bill"),
    t("Total Disc. Amt."),
    t("Proposed Gross Bill"),
    t("Proposed Panel Disc. Amt."),
    t("Diff. in Gross Amt."),
  ];
  const TotalCurrentGrossBill = tableData?.reduce((acc, item) => {
    return acc + item.CurrentGrossBill;
  }, 0);
  const TotalProposedGrossBill = tableData?.reduce((acc, item) => {
    return acc + item.ProposedGrossBill;
  }, 0);
  const totalDiff = tableData?.reduce((acc, item) => {
    return acc + item.GrossAmtDiff;
  }, 0);
  return (
    <div className="card">
      <Heading title={t("Tariff Change")} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Change Type")}
          id="ChangeType"
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          name="ChangeType"
          dynamicOptions={ChangeTypeOption}
          value={payload?.ChangeType}
          handleChange={handleReactSelect}
        />
        <ReactSelect
          placeholderName={t(
            payload?.ChangeType === "2" ? t("Proposed Billing Category") : t("Panel")
          )}
          id="billCategory"
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          name={payload?.ChangeType === "2"? "billCategory":"panelID"}
          value={ payload?.ChangeType === "2"? payload?.billCategory : payload?.panelID}
          handleChange={handleReactSelect}
          dynamicOptions={
            payload?.ChangeType === "2"
              ? billingCategory.map((ele) => ({
                  label: ele?.Name,
                  value: ele?.IPDCaseTypeID,
                }))
              : panel.map((item) => ({
                  label: item?.company_Name,
                  value: item?.panelID,
                }))
          }
        />
      </div>
      <div className="row">
        <div className="col-sm-12">
          <TariffModificationTable THEAD={thead} tbody={tableData} />
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="row p-2">
          <div className="col-sm-2">
            <LabeledInput
              label={t("Current Gross Total")}
              value={TotalCurrentGrossBill}
            />
          </div>
          <div className="col-sm-2">
            <LabeledInput
              label={t("Proposed Gross Total")}
              value={TotalProposedGrossBill}
            />
          </div>
          <div className="col-sm-2">
            <LabeledInput label={t("Total Gross AmtDiff")} value={totalDiff} />
          </div>
          <div className="col-sm-2">
            <button className="btn btn-sm btn-success" onClick={handleSave}>
              {t("Update")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TariffChange;
