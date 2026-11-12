import React, { useState } from "react";
import Tables from "../../../UI/customTable";
import { useTranslation } from "react-i18next";
import moment from "moment";

const RequestApprovalModal = ({ bindApprovalList, setBindApprovalList }) => {
  const [t] = useTranslation();
  const [approvalList, setApprovalList] = useState(bindApprovalList);

  const handleChangeCheckboxHeader = (e) => {
    let respData = approvalList?.map((val) => {
      val.IsApproved = e?.target?.checked;
      return val;
    });

    setBindApprovalList(respData);
    setApprovalList(respData);
  };

  const handleChangeCheckbox = (e, ele, index) => {
    console.log(approvalList);
    let data = approvalList?.map((val, i) => {
      if (i === index) {
        val.IsApproved = Number(e?.target?.checked);
      }
      return val;
    });
    setBindApprovalList(data);
    setApprovalList(data);
  };

  console.log("IsApproved", approvalList?.IsApproved);

  const thead = [
    {
      width: "1%",
      name: (
        <input
          type="checkbox"
          name="IsApproved"
          onChange={(e) => {
            handleChangeCheckboxHeader(e);
          }}
        />
      ),
    },

    t("Item Name"),
    t("Request By"),
    t("Request No"),
    t("Request Date"),
    t("Approved Date"),
    t("Quantity"),
    t("Amount"),
  ];
  return (
    <>
      <div className="card">
        <div className="row">
          <div className="col-sm-12">
            <Tables
              thead={thead}
              tbody={approvalList?.map((ele, index) => ({
                Select: (
                  <>
                    <input
                      type="checkbox"
                      name="IsApproved"
                      onChange={(e) => {
                        handleChangeCheckbox(e, ele, index);
                      }}
                      checked={ele?.IsApproved ? true : false}
                    />
                    {console.log("ele?.IsApproved", ele?.IsApproved)}
                  </>
                ),

                ItemName: ele?.ItemName,
                RequestBy: ele?.RequestBy,
                RequestNo: ele?.RequestNo,
                RequestDateTime: moment(ele?.RequestDateTime).format(
                  "YYYY-MM-DD"
                ),
                Approveddatetime: ele?.ApprovedDateTime,
                Quantity: ele?.Quantity ? ele?.Quantity : "0",
                Amount: ele?.Amount ? ele?.Amount : "0",
              }))}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestApprovalModal;
