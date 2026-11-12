import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/UI/Heading";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import { useTranslation } from "react-i18next";
import BalanceSheetReport from "./BalanceSheetReport";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Demo from "./Demo";
import TrialBalanceReport from "./TrialBalanceReport";
import ChartOfGroupReport from "./ChartOfGroupReport";
import GeneralLedger from "./GeneralLedger";
import ReceivableLedger from "./ReceivableLedger";
import ReceivableAgeing from "./ReceivableAgeing";
import PayableLedgerReport from "./PayableLedgerReport";
import PayableAgingSummary from "./PayableAgingSummary";
import PurchaseBillDueReport from './PurchaseBillDueReport'; 
import BankReconciliationReport from "./BankReconciliationReport";
import PayableStatement from "./PayableStatementReport";

export default function Index() {
  const [values, setValues] = useState("balance_sheet");

  let data = [
    { label: "Balance Sheet", value: "balance_sheet" },
    { label: "Income Statement (PNL)", value: "income_statement_pnl" },
    { label: "Trial Balance", value: "trial_balance" },
    { label: "Chart Of Group Report", value: "chart_of_group_report" },
    { label: "General Ledger", value: "general_ledger" },
    { label: "Receivable Ledger", value: "receivable_ledger" },
    { label: "Receivable Ageing Summary", value: "receivable_ageing_summary" },
    { label: "Invoice/Sale Due Report", value: "invoice_sale_due_report" },
    { label: "Customer Statement", value: "customer_statement" },
    { label: "Payable Ledger", value: "payable_ledger" },
    { label: "Payable Ageing Summary", value: "payable_ageing_summary" },
    { label: "Purchase Bill Due Report", value: "purchase_bill_due_report" },
    { label: "Supplier Statement", value: "supplier_statement" },
    {
      label: "Bank Reconciliation Report",
      value: "bank_reconciliation_report",
    },
    { label: "Payable Bank Wise", value: "payable_bank_wise" },
    { label: "SIC Report", value: "sic_report" },
  ];

  const handleReactSelect = (name, value) => {
    setValues(value.value);
  };

  function RenderReportType() {
    if( values==="balance_sheet"){
        return <BalanceSheetReport />
    } else if (values === "income_statement_pnl") {
        return <Demo />;
    } else if (values === "trial_balance") {
        return <TrialBalanceReport />;
    } else if (values === "chart_of_group_report") {
        return <ChartOfGroupReport />;
    } else if (values === "general_ledger") {
        return <GeneralLedger />;
    } else if (values === "receivable_ledger") {
        return <ReceivableLedger />;
    } else if (values === "receivable_ageing_summary") {
        return <ReceivableAgeing />;
    } else if (values === "invoice_sale_due_report") {
        return <Demo />;
    } else if (values === "customer_statement") {
        return <Demo />;
    } else if (values === "payable_ledger") {
        return <PayableLedgerReport />;
    } else if (values === "payable_ageing_summary") {
        return <PayableAgingSummary />;
    } else if (values === "purchase_bill_due_report") {
        return <PurchaseBillDueReport />;
    } else if (values === "supplier_statement") {
        return <PayableStatement />;
    } else if (values === "bank_reconciliation_report") {
        return <BankReconciliationReport />;
    } else if (values === "payable_bank_wise") {
        return <Demo />;
    } else if (values === "sic_report") {
        return <Demo />;
    }
}


  const [t] = useTranslation();

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            isBreadcrumb={true}
            secondTitle={
              <>
                <ReactSelect
                  id="reportType"
                  placeholderName={t("Report Type")}
                  searchable={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
                  name="reportType"
                  value={values}
                  handleChange={(name, e) => handleReactSelect(name, e)}
                  dynamicOptions={data}
                  requiredClassName={`required-fields`}
                  removeIsClearable={true}
                />
              </>
            }
          />
          {RenderReportType()}
          
        </div>
      </div>
    </>
  );
}
