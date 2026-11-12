import React, { useState } from "react";
import Tables from "..";
import { useTranslation } from "react-i18next";

const CTBTable = ({ tbody, CTBList, setCTBList }) => {
  const [t] = useTranslation();

  const [tableBody, setTableBody] = useState(tbody);

  const handleChangeCheckboxHeader = (e) => {
    let respData = tbody?.map((val) => {
      val.isChecked = e?.target?.checked;
      return val;
    });
    setTableBody(respData);
    setCTBList(respData);
  };

  const handleChangeCheckbox = (e, ele, index) => {
    let data = CTBList.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setTableBody(data);
    setCTBList(data);
  };
  const thead = [
    {
      width: "1%",
      name: (
        <input
          type="checkbox"
          name="checkbox"
          onChange={(e) => {
            handleChangeCheckboxHeader(e);
          }}
        />
      ),
    },

    t("Item Name"),
    t("Request No"),
    t("Amount"),
  ];

  return (
    <>
      <Tables
        thead={thead}
        tbody={tableBody?.map((item, index) => ({
          Actions: (
            <div>
              {
                <input
                  type="checkbox"
                  onChange={(e) => {
                    handleChangeCheckbox(e, item, index);
                  }}
                  checked={item?.isChecked ? item?.isChecked : false}
                />
              }
            </div>
          ),
          ItemName: item?.ItemName,
          RequestNo: item?.RequestNo,
          Amount: item?.Amount ? item?.Amount : "0",
          // UniqueID: item?.UniqueID,
        }))}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "auto" }}
      />
      {/* <div className="d-flex justify-content-end mt-2">
        <label className="">
          Total CTB Amount:{" "}
          <span className="text-danger">{totalAmount.toFixed(2)}</span>
        </label>
      </div> */}
    </>
  );
};

export default CTBTable;
