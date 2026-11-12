import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../formComponent/DatePicker";
import moment from "moment";
import Input from "../../../formComponent/Input";
import ReactSelect from "../../../formComponent/ReactSelect";
import {
  GateEntryGetPurchaseOrders,
  GetPurchaseOrderItems,
  GetPurchaseOrders,
} from "../../../../networkServices/InventoryApi";
import { handleReactSelectDropDownOptions, notify } from "../../../../utils/utils";
import Tables from "../../../UI/customTable";
import { Checkbox } from "primereact/checkbox";

const GRNPurchaseOrderModal = ({
  payload2,
  dataoption,
  setModalData,
  handeAdd,
  setSelectedPOs
}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState(payload2);
  const [selectedItems, setSelectedItems] = useState([]);

  const [checkUniqueVendor, setCheckUniqueVendor] = useState([]);

  console.log("dataoption", dataoption);
  console.log("selectedItems", selectedItems.join(","));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value || "" }));
  };

  const handleSearch = async () => {



    // debugger
    console.log("payload from handleSearch", payload);
    // if(!payload?.LedgerNumber){
    //   notify("Please select Supplier", "error");
    //   return;
    // }
    debugger
    let newPayload = {
      "storeType": payload?.StoreType?.value,
      "purchaseOrderFromDate": moment(payload.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      "purchaseOrderToDate": moment(payload.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      "purchaseOrderNumber": payload?.PurchaseOrder ? payload?.PurchaseOrder : "",
      "vendorID": payload?.LedgerNumber ? payload?.LedgerNumber : ""
    }
    try {
      const response = await GateEntryGetPurchaseOrders(
        newPayload
      );

      if (response?.data && response?.success) {
        setTableData(response?.data);
      } else {
        setTableData([])
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(tableData);
  const THEAD = [
    { name: "Sr.No", width: "1%" },
    { name: "Supplier", width: "6%" },
    { name: "Purchase Order", width: "6%" },
    { name: "Rasied By", width: "4%" },
    { name: "Rasied On", width: "4%" },
    {
      name: (
        <Checkbox
          className="mt-2 ml-4"
          checked={
            tableData.length > 0 &&
            selectedItems.length === tableData.length
          }
          onChange={(e) => {
            if (e.checked) {
              const allPoNumbers = tableData.map((ele) => ele.PurchaseOrderNo);
              const allVendors = tableData.map((ele) => ele.VendorName);
              const uniqueVendors = [...new Set(allVendors)];
    
              if (uniqueVendors.length === 1) {
                // All rows have same vendor
                setSelectedItems(allPoNumbers);
              } else {
                notify("Cannot select all: Purchase Orders belong to multiple suppliers", "warn");
              }
            } else {
              setSelectedItems([]);
            }
          }}
        />
      ),
      width: "1%",
    }
    

  ];
  const BindItemsToGrn = async (val) => {
    console.log("val", val);
    debugger
    const payload = [
      {
        "poNumber": selectedItems.join(","),
      }
    ]
    try {
      const response = await GetPurchaseOrderItems(payload);
      console.log("response", response);
      if (response?.data) {
        handeAdd(response?.data);
        setModalData({ visible: false });
        selectedItems?.length > 0 &&
          setSelectedPOs(selectedItems);
      } else {
        notify(response?.data?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(payload?.fromDate, "payload?.fromDate")
  return (
    <>
      <div className="row p-2">
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-3 col-sm-4 col-md-4  col-12"
          id="fromDate"
          name="fromDate"
          value={
            payload.fromDate
          }
          handleChange={handleChange}
          lable={t("FromDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-3 col-sm-4 col-md-4  col-12"
          id="toDate"
          name="toDate"
          value={
            payload?.toDate
          }
          handleChange={handleChange}
          lable={t("ToDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <Input
          type="text"
          className="form-control required-fields"
          id="PurchaseOrder "
          name="PurchaseOrder"
          onChange={handleChange}
          value={payload?.PurchaseOrder}
          lable={t("Purchase Order")}
          placeholder=" "
          respclass="col-xl-3 col-sm-4 col-md-4  col-12"
        />
        <ReactSelect
          placeholderName={t("Supplier")}
          id={"LedgerNumber"}
          searchable={true}
          respclass="col-xl-3 col-md-4 col-sm-4 col-12"
          // dynamicOptions={dataoption?.map((ele) => ({
          //   label: ele?.label,
          //   value: ele?.value,
          // }))}
          dynamicOptions={[...handleReactSelectDropDownOptions(dataoption, "label", "LedgerUserID")]}
          name="LedgerNumber"
          handleChange={handleReactSelect}
          value={payload?.LedgerNumber}
          requiredClassName="required-fields"
        />
        {console.log(payload?.LedgerNumber, "payload?.LedgerNumber")}
        <div className="col-sm-12 text-right">
          <button className="btn btn-primary mt-2" onClick={handleSearch}>
            {t("Search")}
          </button>
        </div>
      </div>
      {console.log(tableData)}
      <div className="row">
        <Tables
          thead={THEAD}
          tbody={Array.isArray(tableData) ? tableData?.map((ele, index) => ({
            SrNo: index + 1,
            VendorName: ele?.VendorName,
            PurchaseOrderNo: ele?.PurchaseOrderNo,
            EmployeeName: ele?.EmployeeName,
            RaisedOn: ele?.RaisedOn,
            // select: (
            //   <Checkbox
            //   className="mt-2 ml-4"
            //   checked={selectedItems.includes(ele?.PurchaseOrderNo)}
            //   onChange={(e) => {
            //     const checked = e.checked;
            //     const poNumber = ele?.PurchaseOrderNo;

            //     if (checked) {
            //       setSelectedItems((prev) => [...prev, poNumber]);
            //     } else {
            //       setSelectedItems((prev) => prev.filter((item) => item !== poNumber));
            //     }
            //   }}
            // />

            // ),
            select: (
              <Checkbox
                className="mt-2 ml-4"
                checked={selectedItems.includes(ele?.PurchaseOrderNo)}
                onChange={(e) => {
                  const checked = e.checked;
                  const poNumber = ele?.PurchaseOrderNo;
                  const vendorName = ele?.VendorName;

                  if (checked) {
                    // If it's the first item, accept
                    if (selectedItems.length === 0) {
                      setSelectedItems([poNumber]);
                    } else {
                      // Find the vendor of already selected items
                      const firstSelectedPo = tableData.find(item =>
                        item.PurchaseOrderNo === selectedItems[0]
                      );

                      if (firstSelectedPo?.VendorName === vendorName) {
                        setSelectedItems((prev) => [...prev, poNumber]);
                      } else {
                        notify("Please select Purchase Orders from the same Supplier only", "warn");
                      }
                    }
                  } else {
                    setSelectedItems((prev) => prev.filter((item) => item !== poNumber));
                  }
                }}
              />


            ),
          })) : []}
        />

        {tableData.length > 0 && <div className="col-sm-12 text-right">
          <button className="btn btn-primary mt-2"
            onClick={BindItemsToGrn}
            disabled={selectedItems.length === 0}
            title={selectedItems.length === 0 ? "Please select at least one item" : ""}
          >
            {t("Add Items")}
          </button>
        </div>}
      </div>
    </>
  );
};

export default GRNPurchaseOrderModal;
