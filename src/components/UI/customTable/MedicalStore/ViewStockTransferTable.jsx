import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NestedRowTable from "../NestedRowTable";
import DatePicker from "../../../formComponent/DatePicker";
import TimePicker from "../../../formComponent/TimePicker";
import Input from "../../../formComponent/Input";
import CustomSelect from "../../../formComponent/CustomSelect";
import {
  MedicineDetailsCancel,
  MedicineDetailsSave,
  MedicineFreQuency,
  MedicineRoute,
  MedicineTimes,
} from "../../../../networkServices/nursingWardAPI";
import { notify } from "../../../../utils/utils";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { GetStockItem } from "../../../../networkServices/InventoryApi";
const index = ({ thead, tbody, tableHeight, view, setTbody , handleClickEdit}) => {
  const localdata = useLocalStorage("userData", "get");

  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const [bodyData, setBodyData] = useState([]);

  const secondThead = [
    { name: t("Batch"), width: "3%" },
    { name: t("Expirable"), width: "6%" },
    { name: t("Expiry"), width: "6%" },
    { name: t("Unit Cost"), width: "10%" },
    { name: t("Selling Price"), width: "10%" },
    { name: t("Avail. Qty."), width: "10%" },
    { name: t("Unit"), width: "10%" },
    { name: t("Issue Qty."), width: "10%" },
    // { name: t("Rack"), width: "3%" },
    // { name: t("Shelf"), width: "3%" },

    "Rack",
    "Shelf",
  ];

  // const handleClickEdit = async (val, index, isopen) => {
  //   tbody[index]["isopen"] = !isopen;
  //   const ItemID = val?.itemID;
  //   const DeptNo = localdata?.deptLedgerNo;
  //   try {
  //     const response = await GetStockItem(ItemID, DeptNo);
  //     const data = response?.data?.map((ele) => ({
  //       ...ele,
  //       IssueQty: "",
  //     }));
  //     if (response?.data?.length > 0) {
  //       tbody[index]["BindSubRowList"] = data;
  //     } else {
  //       notify(response?.message, "error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching stock items:", error);
  //   }
  //   setTbody(tbody);
  // };

  // const handleClickEdit = async (val, index, isopen) => {
  //   const updatedTbody = [...tbody];
  //   updatedTbody[index]["isopen"] = !isopen;
  
  //   try {
  //     const response = await GetStockItem(val?.itemID, localdata?.deptLedgerNo);
  //     const data = response?.data?.map((ele) => ({
  //       ...ele,
  //       IssueQty: "",
  //     }));
  
  //     if (response?.data?.length > 0) {
  //       updatedTbody[index]["BindSubRowList"] = data;
  //     } else {
  //       notify(response?.message, "error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching stock items:", error);
  //   }
  
  //   setTbody(updatedTbody); // Ensure state updates correctly
  // };
  
  const handleSecondTableInputChange = (pIndex, name, value, cIndex, item) => {
    console.log(item);
    if (parseFloat(item?.AvailQty) < parseFloat(value)) {
      notify("Issue Quantity can not be exceed Available Quantity", "error");
    } else {
      tbody[pIndex]["BindSubRowList"][cIndex][name] = value;
      setTbody(tbody);
    }
  };
  // const handleRateItemsChange = (index, name, value, ele) => {
  //   const updatedData = [...view];
  //   updatedData[index][name] = value;
  //   setTbody(updatedData);
  // };

  const handleRateItemsChange = (index, name, value, ele) => {
    console.log(value);
    if (parseFloat(ele?.reqQty) < parseFloat(value)) {
      notify(`Reject quantity cannot exceed Request Quantity`, "error");
      return;
    } else {
      const updatedData = [...view];
      updatedData[index][name] = value;
      setTbody(updatedData);
    }
  };

  // const handleRateItemsChange = (index, name, value, ele) => {
  //   let requestedQty = parseFloat(value);
  //   let totalAvailableQty = ele?.BindSubRowList?.reduce((sum, batch) => sum + parseFloat(batch?.AvailQty || 0), 0);
  
  //   if (requestedQty > totalAvailableQty) {
  //     notify(`Requested quantity exceeds available quantity!`, "error");
  //     return;
  //   }
  
  //   // Sort batches by availability (optional, ensures distribution starts from batches with more stock)
  //   let sortedBatches = [...ele?.BindSubRowList].sort((a, b) => b.AvailQty - a.AvailQty);
  
  //   let remainingQty = requestedQty;
  //   let distributedBatches = sortedBatches.map((batch) => {
  //     let issueQty = Math.min(remainingQty, batch.AvailQty); // Assign as much as possible within limits
  //     remainingQty -= issueQty;
  
  //     return { ...batch, IssueQty: issueQty };
  //   });
  
  //   // Update the state with the new Issue Qty distribution
  //   setTbody((prevView) => {
  //     let updatedView = [...prevView];
  //     updatedView[index].BindSubRowList = distributedBatches;
  //     return updatedView;
  //   });
  // };
  
  console.log("tbody", tbody);
  const bindBodyData = (tbody) => {
    let list = [];
    tbody?.map((val, index) => {
      let secondTbody = [];
      val?.BindSubRowList?.length > 0 &&
        val?.BindSubRowList?.map((item, i) => {
          let obj = {
            BatchNumber: item?.BatchNumber,
            isexpirable: item?.isexpirable,
            MedExpiryDate: item?.MedExpiryDate,
            UnitPrice: (
              <div className="text-right">
                {parseFloat(item?.UnitPrice).toFixed(2)}
              </div>
            ),
            MRP: (
              <div className="text-right">
                {parseFloat(item?.MRP).toFixed(2)}
              </div>
            ),
            AvailQty: (
              <div className="text-right">
                {parseFloat(item?.AvailQty).toFixed(2)}
              </div>
            ),
            UnitType: item?.UnitType,
            IssueQty: (
              <Input
                className="table-input"
                name="IssueQty"
                display={"right"}
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleSecondTableInputChange(
                    index,
                    "IssueQty",
                    e.target.value,
                    i,
                    item
                  )
                }
                value={item?.IssueQty}
              />
            ),
            Rack: item?.Rack,
            Shelf: item?.Shelf,
          };
          secondTbody.push(obj);
        });
      let obj = {};

      obj.sno = val?.SrNo;
      obj.itemName = val?.itemName;
      obj.deptAvailQty = (
        <div className="text-right">
          {parseFloat(val?.deptAvailQty).toFixed(2)}
        </div>
      );
      obj.availQty = (
        val?.availQty === "0" ? <div className="text-right" style={{ backgroundColor: "#ff6961", color: "white" }}>{parseFloat(val?.availQty).toFixed(2)}</div> : <div className="text-right" >{parseFloat(val?.availQty).toFixed(2)}</div>
      );
      obj.reqQty = (
        <div className="text-right">{parseFloat(val?.reqQty).toFixed(2)}</div>
      );
      // obj.issuePossible = (
      //   <div className="text-right">
      //     {parseFloat(val?.issuePossible).toFixed(2)}
      //   </div>
      // );
      obj.rejectQty = (
        <div className="text-right">
          {parseFloat(val?.rejectQty).toFixed(2)}
        </div>
      );
      obj.pendingQty = (
        <div className="text-right">
          {parseFloat(val?.pendingQty).toFixed(2)}
        </div>
      );
      obj.narration = val?.narration;
      obj.Reject = (
        <Input
          className="table-input"
          name="Reject"
          display={"right"}
          removeFormGroupClass={true}
          type="number"
          onChange={(e) =>
            handleRateItemsChange(index, "Reject", e.target.value, val)
          }
          value={val?.Reject ? val.Reject : ""}
          disabled={val?.IsChecked === true ? false : true}
        />
      );
      obj.Reason = (
        <Input
          className="table-input"
          name="Reason"
          removeFormGroupClass={true}
          type="text"
          onChange={(e) =>
            handleRateItemsChange(index, "Reason", e.target.value, val)
          }
          value={val?.Reason ? val?.Reason : ""}
          disabled={val?.IsChecked === true ? false : true}
        />
      );
      obj.subRow = { subRowList: secondTbody, isopen: val?.isopen };
      list.push(obj);
      obj.Action = (
        <span
          onClick={() => {
            handleClickEdit(val, index, val?.isopen);
          }}
        >
          {val?.isopen > 0 ? (
            <i className="fa fa-minus" aria-hidden="true"></i>
          ) : (
            <i className="fa fa-plus" aria-hidden="true"></i>
          )}
        </span>
      );
    });
    setBodyData(list);
  };
  useEffect(() => {
    bindBodyData(tbody);
  }, [tbody]);

  const getRowClass = (val) => {
    if (val?.STATUS === "Completed") {
      return "medicationTbaleRowColor";
    }
    if (val?.STATUS === "Stopped") {
      return "medicationTbaleRowColorStopped";
    }
    if (val?.STATUS === "Not Issued") {
      return "medicationTbaleRowColorNotIssued";
    }
    if (val?.STATUS === "Running") {
      return "medicationTbaleRowColorRunning";
    }
    if (val?.STATUS === "Today Medicine") {
      return "medicationTbaleRowColorTodayMedicine";
    }
  };

  return (
    <>
      <NestedRowTable
        thead={thead}
        seondThead={secondThead}
        tbody={bodyData}
        tableHeight={tableHeight}
        getRowClass={getRowClass}
        style={{ height: "200px" }}
        handleClickEdit={handleClickEdit}
        SubtableClass={"ViewStockNestedTable"}
        zIndex={10}
      />
    </>
  );
};

export default index;
