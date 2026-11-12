import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/utils";
import {
  BindPhysicalData,
  GridView1_RowCommand,
} from "../../../networkServices/InventoryApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { CancelSVG } from "../../../components/SvgIcons";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import { useTranslation } from "react-i18next";

const StockTakeApproval = () => {
  const [t] = useTranslation();

  const initialState = {
    StoreType: "STO00001",
  };
  const [payload, setPayload] = useState({ ...initialState });
  const [PhysicalDataList, setPhysicalData] = useState([]);
  const [DataList, setItemListData] = useState([]);
  const localData = useLocalStorage("userData", "get");

  useEffect(() => {
    GetStockTackApprova(payload.StoreType);
    setItemListData([]);
  }, [payload.StoreType]);
  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value || "" }));
  };

  const formatRowData = (item, index) => {
    return {
      SNo: index + 1,
      EntryNo: item.EntryNo,
      CenterName: item.CenterName,
      RoleName: item.RoleName,
      GroupName: item.GroupName,
      EntryBy: item.EntryBy,
      EntryDate: item.EntryDate,
      Reject: (
        <i
          className="fa fa-trash text-danger text-center"
          onClick={() => ViewDataList(item.EntryNo, "Reject", item)}
        />
      ),
      Save: (
        <button
          className="btn btn-primary"
          onClick={() => ViewDataList(item.EntryNo, "Save", item)}
        >
          {t("Save")}
        </button>
      ),
      View: (
        <i
          className="fa fa-eye"
          aria-hidden="true"
          onClick={() => ViewDataList(item.EntryNo, "View", item)}
        ></i>
      ),
    };
  };
  const formatItemRowData = (item, index) => {
    return {
      SNo: index + 1,
      EntryNo: item.EntryNo,
      ItemName: item.ItemName,
      Rate: item.Rate,
      MRP: item.MRP,
      BatchNumber: item.BatchNumber,
      CurrentStock: item.CurrentStock,
      InitialCount: item.InitialCount,
      Type: item.TypeOfTnx,
      PurTaxPer: item.PurTaxPer, //<button className="btn btn-primary" //onClick={() => IsGRNPost(val.GRNNo, values?.StoreType?.value)}
      Reject:
        item.Approved === 0 ? (
          <i
            className="fa fa-trash text-danger text-center"
            onClick={() => ViewDataList(item.ID, "RejectItem", item)}
          />
        ) : (
          ""
        ),
      // Reject: item.Approved === 0 ? (
      //   <i onClick={() => ViewDataList(item.ID, "RejectItem", item)}>
      //     <CancelSVG />
      //   </i>
      // ) : (
      //   ""
      // ),

      // colorcode: item.Approved == 1 ? "yellowgreen" : item.Approved == 0 ? "yellow" : "lightpink"
    };
  };

  // const ViewDataList = async (EntryNo, View, itemdata) => {
  //   try {

  //     const response = await GridView1_RowCommand(EntryNo, View, payload.StoreType);

  //     if (response.success) {
  //       if (View === "View") {
  //         if (response.data.reduce((acc, item) => acc && item.Approved === 2, true)) {
  //           setPhysicalData([]);
  //           setItemListData([]);
  //           // setItemListData
  //         }
  //         else {
  //           setItemListData(response.data);
  //         }
  //       }
  //       else if (View === "RejectItem") {
  //         ViewDataList(itemdata.EntryNo, "View", itemdata)
  //         GetStockTackApprova(payload.StoreType);
  //         // setItemListData([]);
  //         notify(response.message, 'success')

  //       }
  //       else {
  //         notify(response.message, 'success')
  //         GetStockTackApprova(payload.StoreType);
  //       }
  //     }
  //     // console.log("New Data:",response.data);
  //   }
  //   catch {
  //     console.log("New Data00000000000000")

  //   }
  // };

  const ViewDataList = async (EntryNo, View, itemdata) => {
    try {
      const response = await GridView1_RowCommand(
        EntryNo,
        View,
        payload.StoreType
      );

      if (response.success) {
        if (View === "View") {
          if (
            response.data.reduce(
              (acc, item) => acc && item.Approved === 2,
              true
            )
          ) {
            setPhysicalData([]);
            setItemListData([]);
          } else {
            setItemListData(response.data);
          }
        } else if (View === "RejectItem") {
          ViewDataList(itemdata.EntryNo, "View", itemdata);
          GetStockTackApprova(payload.StoreType);
          notify(response.message, "success");
        } else if (View === "Save") {
          // When "Save" button is clicked, clear the DataList to hide the table
          setItemListData([]); // This will hide the second table since DataList will be empty
          notify(response.message, "success");
          GetStockTackApprova(payload.StoreType);
        }
      }
    } catch {
      console.log("Error in fetching data");
    }
  };

  const THEAD = [
    { name: t("S.No."), width: "1%" },
    { name: t("Entry No."), width: "1%" },
    t("Center Name"),
    t("Department Name"),
    t("Store Type"),
    t("Raised User"),
    t("Raised Date"),
    { name: t("Reject"), width: "1%" },
    { name: t("Save"), width: "7%" },
    { name: t("View"), width: "7%" },
  ];

  const THEAD2 = [
    t("S.No."),
    t("Entry No."),
    t("Item Name"),
    t("Unit Price"),
    t("Selling Price"),
    t("Batch No."),
    t("Current Stock"),
    t("Quantity"),
    t("Type"),
    t("Tax"),
    t("Reject"),
  ];

  const GetStockTackApprova = async (val) => {
    try {
      const response = await BindPhysicalData(val);
      if (response?.success && response?.data.length > 0) {
        setPhysicalData(response?.data);
      } else {
        setPhysicalData([]);
        return notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
      setPhysicalData([]);
    }
  };

  const getRowClass = (value, index) => {
    let data = DataList[index];
    if (data?.Approved === 1) {
      return "statusDocOut";
    } else if (data?.Approved === 0) {
      return "statusEmergency";
    } else if (data?.Approved === 2) {
      return "statusIsPaid";
    }
    // item.Approved == 1 ? "yellowgreen" : item.Approved == 0 ? "yellow" : "lightpink"
    console.log("aaaaa", data);
  };
  return (
    <>
      <div className="card">
        <Heading title={"Admitted Patients"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={"Store Type"}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: " Medical Store", value: "STO00001" },
              { label: "General Store", value: "STO00002" },
            ]}
            name="StoreType"
            handleChange={handleReactSelect}
            value={payload?.StoreType}
            requiredClassName="required-fields"
            removeIsClearable={true}
          />
        </div>
        <div className="card ">
          <Heading title={"Adjustment List"} />
          <div className="row">
            <div className="col-sm-12">
              <Tables
                thead={THEAD}
                tbody={PhysicalDataList.map((item, index) =>
                  formatRowData(item, index)
                )}
                tableHeight="tableHeight"
                style={{ maxHeight: "auto" }}
              />
            </div>
          </div>
        </div>

        {DataList?.length > 0 && (
          <div className="card mt-3">
            <Heading
              title={"Item Details"}
              secondTitle={
                <>
                  <ColorCodingSearch
                    color={"#f5f3b2"}
                    label={t("Pending")}
                    onClick={() => {}}
                  />
                  <ColorCodingSearch
                    color={"#c6eea7"}
                    label={t("Approved")}
                    onClick={() => {}}
                  />
                  <ColorCodingSearch
                    color={"#f5c6f7"}
                    label={t("Rejected")}
                    onClick={() => {}}
                  />
                </>
              }
            />
            <div className="row">
              <div className="col-sm-12">
                <Tables
                  thead={THEAD2}
                  tbody={DataList.map((item, index) =>
                    formatItemRowData(item, index)
                  )}
                  tableHeight="tableHeight"
                  style={{ maxHeight: "auto" }}
                  getRowClass={getRowClass}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StockTakeApproval;
