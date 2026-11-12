import React, { useState } from "react";
import Tables from "..";
import { AutoComplete } from "primereact/autocomplete";
import {
  GetItems,
  GetItemStockDetailsRequisition,
} from "../../../../networkServices/BillingsApi";
import Input from "../../../formComponent/Input";
import moment from "moment";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";

const CreateRequisitionIndentTable = ({
  THEAD,
  val,
  values,
  handleItemSelect,
  setTbody,
  tbody,
  localData,
}) => {
  console.log("Values", values);

  const localDataFrom = useLocalStorage("userData", "get");
  console.log("LocalData", localDataFrom);
  const [itemList, setItemList] = useState([]);

  const BindGetItems = async (query) => {
    const StoreID = val;
    const Itemtype = 1;
    const DeptLedgerNo = localDataFrom?.deptLedgerNo;
    try {
      const response = await GetItems(StoreID, Itemtype, DeptLedgerNo, query);
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  };
  console.log(localData);
  const handleIndexChange = (index, name, value, item) => {
    const updatedItems = [...tbody];
    updatedItems[index][name] = value;
    setTbody(updatedItems);
  };

  console.log(itemList);

  const BindGetItemStockDetails = async (index, val) => {
    console.log(val);
    const requestBody = {
      itemID: Number(val?.ItemID),
      departmentLedgerID: String(localDataFrom?.deptLedgerNo),
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      Dept: values?.Department,
    };

    try {
      const response = await GetItemStockDetailsRequisition(requestBody);
      console.log(response);
      // debugger;
      const data = [...tbody];
      data[index] = {
        value: val?.ItemName,
        ItemId: val?.ItemID,
        Unit: val?.MajorUnit,
        Quantity: tbody?.filter((ele) => ele?.Quantity),
        SalesQty: response?.data[0]?.SalesQuantity
          ? response?.data[0]?.SalesQuantity
          : "0",
        NetQty:
          response?.data[0]?.SalesQuantity * response?.data[0]?.PendingQty,
        Stock: response?.data[0]?.CurrentStock || "0.00",
        DeptStock: response?.data[0]?.DeptStock || "0.00",
        PenIndentQuantity: response?.data[0]?.PendingQty || "0.00",
        // Remarks: val?.Remarks,
      };
      if (data?.length === index + 1) {
        data.push({});
      }
      console.log("datadatadatadata", data);
      handleItemSelect(data);
      setTbody(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = async (event, index) => {
    const query = event.query.trim();
    const items = await BindGetItems(query);
    setItemList(items);

    const updatedTbody = [...tbody];
    updatedTbody[index] = { value: query };
    setTbody(updatedTbody);
  };
  // const search = async (event, index) => {
  //   const item = await BindGetItems(event?.query.trim());
  //   console.log(item);
  //   setItemList(item);
  //   let data = [...tbody];
  //   data[index] = {
  //     value: event?.query.trim(),
  //   };
  //   setTbody(data);
  // };

  const handleInputChange = (index, name, value) => {
    const updatedTbody = [...tbody];
    updatedTbody[index][name] = value;
    setTbody(updatedTbody);
  };

  const handleSelectRow = (e, index) => {
    const { value } = e;
    console.log(value);
    BindGetItemStockDetails(index, value);
  };
  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.ItemName}
        </div>
      </div>
    );
  };
  // const handleRateItemsChange = (index, name, value, ele) => {
  //   const updatedData = [...view];
  //   updatedData[index][name] = value;
  //   setView(updatedData);
  // };
  console.log(tbody);
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "Sr No": index + 1,
          ItemName: (
            <AutoComplete
              value={item?.value || ""}
              suggestions={itemList}
              completeMethod={(e) => handleSearch(e, index)}
              className="required-fields w-100"
              onSelect={(e) => handleSelectRow(e, index)}
              itemTemplate={itemTemplate}
              onChange={(e) => handleInputChange(index, "value", e.value)}
            />
            // <AutoComplete
            //   value={item?.value}
            //   suggestions={itemList}
            //   completeMethod={(e) => {
            //     search(e, index);
            //   }}
            //   className="required-fields w-100 "
            //   onSelect={(e) => handleSelectRow(e, index)}
            //   id="searchtest"
            //   onChange={(e) => {
            //     setValue(e?.value?.ItemName);
            //   }}
            //   itemTemplate={itemTemplate}
            // />
          ),
          Quantity: (
            <Input
              className="w-100 table-input"
              name="Quantity"
              respclass="nested-Table-Inputswidth  required-fields"
              removeFormGroupClass={true}
              type="number"
              display={"right"}
              onChange={(e) =>
                handleIndexChange(index, "Quantity", e.target.value, item)
              }
              value={item?.Quantity ? item?.Quantity : ""}
              // disabled={ele?.IsChecked === true ? false : true}
            />
          ),
          Unit: item?.Unit,
          "Sales Qty.": (
            <div className="text-right">
              {item?.SalesQty ? parseFloat(item?.SalesQty).toFixed(2) : "0.00"}
            </div>
          ),
          "Net Qty.": (
            <div className="text-right">
              {item?.NetQty ? parseFloat(item?.NetQty).toFixed(2) : "0.00"}
            </div>
          ),
          "Min Level": item?.MinLevel,
          "Max Level": item?.MaxLevel,
          Stock: (
            <div className="text-right">
              {item?.Stock ? parseFloat(item?.Stock).toFixed(2) : "0.00"}
            </div>
          ),
          "Dept. Stock": (
            <div className="text-right">
              {item?.DeptStock
                ? parseFloat(item?.DeptStock).toFixed(2)
                : "0.00"}
            </div>
          ),

          "Pen Indent Quantity": (
            <div className="text-right">
              {item?.PenIndentQuantity
                ? parseFloat(item?.PenIndentQuantity).toFixed(2)
                : "0.00"}
            </div>
          ),
          Remarks: (
            <Input
              className="table-input w-100"
              name="Remarks"
              respclass="nested-Table-Inputswidth required-fields"
              removeFormGroupClass={true}
              type="text"
              onChange={(e) =>
                handleIndexChange(index, "Remarks", e.target.value, item)
              }
              value={item?.Remarks ? item?.Remarks : ""}
            />
          ),
        }))}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "auto" }}
      />
    </>
  );
};

export default CreateRequisitionIndentTable;
