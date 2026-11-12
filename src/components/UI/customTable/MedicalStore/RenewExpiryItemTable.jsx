import React, { useState } from "react";
import Tables from "..";
import DatePicker from "../../../formComponent/DatePicker";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Input from "../../../formComponent/Input";

const RenewExpiryItemTable = ({
  thead,
  tbody,
  handleChangeCheckbox,
  handleSaveItemExpiry,
  handleChangeDate,
}) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  console.log(tbody);
  return (
    <Tables
      thead={thead}
      tbody={tbody?.map((ele, index) => ({
        ItemName: ele?.ItemName,
        MedExpiryDate:
          ele?.isChecked === true ? (
            // <DatePicker
            //   className="custom-calendar"
            //   removeFormGroupClass={true}
            //   id="UpDateExp"
            //   name="UpDateExp"
            //   value={ele?.expDate?ele?.expDate:ele?.UpDateExp}
            //   handleChange={(e) => handleChangeDate(e, index)}
            //   placeholder={VITE_DATE_FORMAT}
            // />
            <DatePicker
              className="custom-calendar"
              removeFormGroupClass={true}
              id="expDate"
              name="expDate"
              value={ele?.expDate?ele?.expDate: ele?.MedExpiryDate}
              // value={ele?.expDate || new Date()}
              handleChange={(e) => handleChangeDate(e, index)}
              placeholder={VITE_DATE_FORMAT}
            />
          ) : (
            ele?.MedExpiryDate
          ),
        BatchNumber: ele?.isChecked === true ?(<Input
          type="text"
          className="form-control"
          id="BatchNumber"
          name="BatchNumber"
          value={ele?.BatchNumber}
          onChange={(e) => handleChangeDate(e, index)}
          // onChange={handleChange}
          // lable={t("Item Name")}
          placeholder=" "
          // respclass="col-xl-1 col-md-2 col-sm-12 col-12"
        />): ele?.BatchNumber,
        HSNCode: ele?.isChecked === true ?(<Input
          type="text"
          className="form-control"
          // id="itemName"
          name="HSNCode"
          value={ele?.HSNCode}
          onChange={(e) => handleChangeDate(e, index)}
          // onChange={handleChange}
          // lable={t("Item Name")}
          placeholder=" "
          // respclass="col-xl-1 col-md-2 col-sm-12 col-12"
        />): ele?.HSNCode,
        InHandQty: <div className="text-right">{ele?.InHandQty}</div>,
        edit: (
          <>
            <div 
          className="d-flex align-items-center justify-content-between"
            >
              <input
                type="checkbox"
                onChange={(e) => {
                  handleChangeCheckbox(e, ele, index);
                }}
                checked={ele?.isChecked ? ele?.isChecked : false}
              />
              {ele?.isChecked === true && (
                // <button
                //   className="fa fa-edit"
                //   aria-hidden="true"
                //   onClick={() => handleSaveItemExpiry(ele)}
                // >
                //   Update
                // </button>
                 <button
                 className="btn btn-sm btn-success mx-1"
                 style={{
                  padding:"10px"
                 }}
                 onClick={() => handleSaveItemExpiry(ele)}
               >
                 {t("Update")}
               </button>
              )}
            </div>
          </>
        ),
      }))}
    />
  );
};

export default RenewExpiryItemTable;
