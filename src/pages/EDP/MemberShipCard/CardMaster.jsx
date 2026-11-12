import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import { notify } from "../../../utils/ustil2";
import Tables from "../../../components/UI/customTable";
import {
  EDPBindOPdPackage,
  EDPGetBindItem,
  EDPSaveItemData,
} from "../../../networkServices/EDP/govindedp";
import { AutoComplete } from "primereact/autocomplete";
import CustomSelect from "../../../components/formComponent/CustomSelect";

function CardMaster(props) {
  const { data, incomingValues } = props;
  console.log("data , incomingValues", data, incomingValues);
  const ip = localStorage.getItem("ip");
  const [t] = useTranslation();

  const intialValue = {
    cardName: "",
    description: "",
    dependant: { value: "" },
    cardValid: { value: "" },
  };

  const [values, setValues] = useState({ ...intialValue });

  const [tableData, setTableData] = useState([]);
  console.log("TableData inside the Modal", tableData);
  const [tbody, setTbody] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [searchvalue, setSearchValue] = useState("");
  const [isAmntCheckd, setIsAmtChecked] = useState(false);

  const handleCheckIsAmt = () => {
    setIsAmtChecked(!isAmntCheckd);
    setTableData(
      tableData.map((item) => ({
        ...item,
        particularItem: isAmntCheckd ? "OP" : "OA",
      }))
    );
  };

  const handleCheckAll = () => {
    setTableData(
      tableData.map((item) => ({
        ...item,
        isChecked: !item.isChecked,
      }))
    );
  };

  const theadtableData = [
    {
      width: "1%",
      name: <input type="checkbox" onChange={() => handleCheckAll()} />,
    },
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Item Name") },
    {
      width: "15%",
      name: (
        <>
          <span>OPD:Is Amt</span>
          <input type="checkbox" onChange={() => handleCheckIsAmt()} />
        </>
      ),
    },
    { width: "15%", name: t("IPD(%)") },
  ];

  const itemData = async (query) => {
    const payload = {
      cardId: incomingValues?.CardName?.value,
      word: query ? query : "",
      subCategoryId: data?.SubCategoryID,
    };

    const response = await EDPGetBindItem(payload);
    if (response?.success) {
      return response?.data;
    } else {
      notify(response?.message, "error");
    }
  };
  const handleSearch = async (event, index) => {
    const query = event.query.trim();
    const items = await itemData(query);

    const filteredData = items?.map((ele) => ({
      NAME: ele.ItemName,
      VALUE: ele.ItemID,
      particularItem: "OP",
    }));
    setItemList(filteredData);

    const updatedTbody = [...tbody];
    updatedTbody[index] = { value: query };
    setTbody(updatedTbody);
  };
  const handleSelectRow = (e, index) => {
    const { value } = e;
    console.log(value);
    setTableData((prevData) => [...prevData, value]);
    setSearchValue("");
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.NAME}
        </div>
      </div>
    );
  };

  const handleInputChange = (index, name, value) => {
    const updatedTbody = [...tbody];

    updatedTbody[index][name] = value;
    setTbody(updatedTbody);
  };

  const handleCustomSelect = (index, name, e) => {
    const data = [...tableData];
    data[index][name] = e.value;
    setTableData(data);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const handleCheck = (e, index) => {
    const data = [...tableData];
    data[index].isChecked = e.target.checked;
    setTableData(data);
  };

  const handleSave = async () => {
    const filteredData = tableData.filter((item) => item.isChecked);
    const payload = filteredData?.map((item) => ({
      cardId: incomingValues?.CardName?.value,
      itemId: item?.VALUE?.split("###")[0],
      itemName: item?.NAME,
      opd: item?.OPD ? item?.OPD : 0,
      ipd: item?.IPD ? item?.IPD : 0,
      isOPDPer: item?.particularItem === "OA" ? 1 : 0,
      isIPDPer: item?.particularItem === "OP" ? 1 : 0,
    }));

    const response = await EDPSaveItemData(payload);
    if (response?.success) {
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };
  return (
    <>
      <div className="m-2">
        <div className="row p-2">
          <AutoComplete
            requiredClassName={"required-fields"}
            placeholder={t("Items")}
            value={searchvalue}
            suggestions={itemList}
            field="NAME" // <- Add this line to tell AutoComplete what to display
            completeMethod={(e) => handleSearch(e, 0)}
            className="w-100"
            onSelect={(e) => handleSelectRow(e, 0)}
            itemTemplate={itemTemplate}
            onChange={(e) => {
              setSearchValue(e?.value);
            }}
          />
        </div>
        {tableData.length > 0 && (
          <div className="card">
            <Tables
              thead={theadtableData}
              tbody={tableData?.map((val, index) => ({
                checkbox: (
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheck(e, index)}
                    checked={val.isChecked}
                  />
                ),
                sno: index + 1,
                name: val.NAME,
                OPDamt: (
                  <div style={{ gap: "10px" }}>
                    <CustomSelect
                      isRemoveSearchable={true}
                      option={[
                        { label: "In Percentage", value: "OP" },
                        { label: "In Amount", value: "OA" },
                      ]}
                      placeHolder={t("Select Particulars")}
                      value={
                        val?.particularItem
                          ? val?.particularItem
                          : { label: "In Percentage", value: "OP" }
                      }
                      name="particularItem"
                      onChange={(name, e) => handleCustomSelect(index, name, e)}
                    />
                    <Input
                      type="number"
                      className="table-input"
                      name={"OPD"}
                      removeFormGroupClass={true}
                      value={val?.OPD}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                ),
                IPD: (
                  <>
                    <Input
                      type="number"
                      className="table-input"
                      name={"IPD"}
                      removeFormGroupClass={true}
                      value={val?.IPD}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </>
                ),
              }))}
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <button className="btn btn-success m-2" onClick={handleSave}>
                {t("Save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CardMaster;