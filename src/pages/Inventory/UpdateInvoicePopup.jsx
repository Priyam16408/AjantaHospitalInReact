import React, { useState, useEffect } from "react";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import moment from "moment";
import {
  updateInvoiceDetails,
  GRNReject,
  ConsignmentCancelAll,
  ConsignmentRejectItem,
} from "../../networkServices/InventoryApi";
import { notify } from "../../utils/utils";
import TextAreaInput from "../../components/formComponent/TextAreaInput";

import { useTranslation } from "react-i18next";

const UpdateInvoicePopup = ({
  invoiceDetails,
  isOpen,
  onClose,
  AddRemark,
  StoreType,
  GRNId,
  callfrom,
}) => {
  const [invoiceData, setInvoiceData] = useState({
    GRNNo: "",
    ChalanNo: "",
    ChalanDate: "",
    InvoiceNo: "",
    InvoiceDate: "",
  });
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const [billingRemark, setBillingRemark] = useState("");
  useEffect(() => {
    if (isOpen && invoiceDetails) {
      setInvoiceData({
        GRNNo: invoiceDetails.GRNNo || "N/A",
        ChalanNo: invoiceDetails.ChalanNo || "",
        ChalanDate: new Date(invoiceDetails.ChalanDate) || "",
        InvoiceNo: invoiceDetails.InvoiceNo || "",
        InvoiceDate: new Date(invoiceDetails.InvoiceDate) || "",
      });
    }
  }, [isOpen, invoiceDetails]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleIndicator = (state) => {
    return (
      <div className="text-danger">
        (max 200 Charcter) <span className="text-dark">Remaining : </span>{" "}
        <span className="text-success">{Number(200 - state?.length)}</span>
      </div>
    );
  };

  const handleChange1 = (e) => {
    const { value } = e.target;
    if (value.length <= 200) setBillingRemark(value);
  };
  // Handle invoice update
  const handleUpdateInvoice = async () => {
    const payload = {
      LedgerTransactionNo: invoiceDetails.GRNNo,
      challanNo: invoiceData.ChalanNo,
      challanDate: moment(invoiceData.ChalanDate, "DD-MMM-YYYY").format(
        "DD-MMM-YYYY"
      ),
      InvoiceNumber: invoiceData.InvoiceNo,
      invoiceDate: moment(invoiceData.InvoiceDate, "DD-MMM-YYYY").format(
        "DD-MMM-YYYY"
      ),
      GrnNumber: invoiceData.GRNNo,
    };
    try {
      const response = await updateInvoiceDetails(payload);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        onClose();
      }
    } catch (error) {
      console.log("Error updating invoice:", error);
      notify("Failed to update invoice.", "error");
    }
  };

  const handleRemark = async () => {
    if (billingRemark?.length == 0) {
      return notify("Please enter Remarks.", "error");
    }
    if (callfrom == "Con" || callfrom == "Con_Item") {
      const payload = {
        consignmentNo: GRNId,
        CancelReason: billingRemark,
      };
      if (callfrom == "Con_Item") {
        try {
          const response = await ConsignmentRejectItem(payload);
          notify(response?.message, response?.success ? "success" : "error");
          if (response?.success) {
            onClose();
          }
        } catch (error) {
          console.log(
            "Error No record found with the given ConsignmentNo.:",
            error
          );
          notify(
            "Error No record found with the given ConsignmentNo.",
            "error"
          );
        }
      } else if (callfrom == "Con") {
        try {
          const response = await ConsignmentCancelAll(payload);
          notify(response?.message, response?.success ? "success" : "error");
          if (response?.success) {
            onClose();
          }
        } catch (error) {
          console.log(
            "Error No record found with the given ConsignmentNo.:",
            error
          );
          notify(
            "Error No record found with the given ConsignmentNo.",
            "error"
          );
        }
      }
    } else {
      const payload = {
        GRNNo: GRNId,
        CancelReason: billingRemark,
        StoreType: StoreType,
      };
      try {
        const response = await GRNReject(payload);
        notify(response?.message, response?.success ? "success" : "error");
        if (response?.success) {
          onClose();
        }
      } catch (error) {
        console.log("Error No record found with the given GRN:", error);
        notify("No record found with the given GRN", "error");
      }
    }
  };
  // if (!isOpen) return null;

  return (
    <>
      {isOpen == true ? (
        // <div className="card">
          <div className="col">
            <div className="row p-2">
              <Input
                type="text"
                className="form-control"
                lable="Delivery No./Chalan No."
                placeholder=" "
                id="ChalanNo"
                name="ChalanNo"
                value={invoiceData.ChalanNo}
                required={true}
                respclass="col-xl-4 col-md-6 col-sm-12"
                onChange={handleChange}
                // onKeyDown={Tabfunctionality}
                // requiredClassName="required-fields"
              />
              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                id="ChalanDate"
                name="ChalanDate"
                lable={t("Delivery /Chalan Date")}
                value={invoiceData.ChalanDate}
                handleChange={handleChange}
                placeholder={VITE_DATE_FORMAT}
              />
              <Input
                type="text"
                className="form-control"
                lable="Invoice No."
                placeholder=" "
                id="InvoiceNo"
                name="InvoiceNo"
                value={invoiceData.InvoiceNo}
                required={true}
                respclass="col-xl-4 col-md-6 col-sm-12"
                onChange={handleChange}
                // onKeyDown={Tabfunctionality}
                // requiredClassName="required-fields"
              />
              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                id="InvoiceDate"
                name="InvoiceDate"
                lable={t("Invoice Date")}
                value={invoiceData.InvoiceDate}
                handleChange={handleChange}
                placeholder={VITE_DATE_FORMAT}

                // setValues={setValues}
              />
              <div className="col-12 mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-primary mr-2"
                  onClick={handleUpdateInvoice}
                >
                  {t("Update Invoice")}
                </button>
                {/* <button className="btn btn-secondary" onClick={onClose}>Close</button> */}
              </div>
            </div>
          </div>
        // </div>
      ) : (
        <></>
      )}
      {AddRemark == true ? (
        <>
          <div className="row">
            <TextAreaInput
              respclass="col-12"
              lable="Remark"
              id="Remark"
              rows={3}
              value={billingRemark}
              onChange={(e) => handleChange1(e)}
            />
            <div className="col-12">{handleIndicator(billingRemark)}</div>
          </div>

          <div className="d-flex align-items-center justify-content-end">
            <button
              className="btn btn-sm btn-primary mx-1"
              onClick={handleRemark}
            >
              {t("Remark")}
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default UpdateInvoicePopup;
