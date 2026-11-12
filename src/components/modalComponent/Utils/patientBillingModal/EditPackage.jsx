import React, { useEffect, useState } from "react";
import {
  PatientBillingEditPackage,
  PatientBillingGetPackage,
} from "../../../../networkServices/BillingsApi";
import Tables from "../../../UI/customTable";
import Input from "../../../formComponent/Input";
import { AMOUNT_REGX } from "../../../../utils/constant";
import { GetDiscReasonList } from "../../../../networkServices/opdserviceAPI";
import ReactSelect from "../../../formComponent/ReactSelect";
import { notify, reactSelectOptionList } from "../../../../utils/utils";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";

const EditPackage = ({
  pateintDetails,
  handleModalState,
  GetBindBillDepartment,
}) => {
  debugger
  const ip = useLocalStorage("ip", "get");
  const [tableData, setTableData] = useState([]);
  const [discounts, setDiscounts] = useState({
    discountReasonList: [],
  });

  const handleCheckedAllTable = (e) => {
    const { name, checked } = e.target;
    const data = tableData?.map((item, _) => {
      return {
        ...item,
        [name]: checked,
      };
    });

    setTableData(data);
  };

  const THEAD_TABLE = [
    {name:(<input
      type="checkbox"
      name="isChecked"
      checked={tableData?.every((row, _) => row?.isChecked === true)}
      onChange={handleCheckedAllTable}
    />)},
    "Package",
    "Date",
    "Discount(%)",
    "Amount",
    "Reject",
  ];

  const GetDiscListAPI = async () => {
    try {
      const [discountReasonListRes] = await Promise.all([
        GetDiscReasonList("OPD"),
      ]);

      setDiscounts({
        ...discounts,
        discountReasonList: discountReasonListRes?.data,
      });
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handlePatientBillingGetPackage = async (TransactionID) => {
    try {
      const response = await PatientBillingGetPackage(TransactionID);
      setTableData(response?.data);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChangeTable = (e, index, ...rest) => {
    const { name, value } = e.target;
    if (rest?.length > 0 && rest.some((item, _) => item === false)) {
      return;
    }
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const handleIsCheckedTable = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  const handleTableData = (tableData) => {
    debugger
    return tableData?.map((row, index) => {
      const { TypeName, PDate, Discount, Amount, isChecked } = row;
      return {
        input: (
          <input
            type="checkbox"
            checked={isChecked}
            name="isChecked"
            onChange={(e) => handleIsCheckedTable(e, index)}
          />
        ),
        TypeName: TypeName,
        PDate: PDate,
        DisPercentage: (
          <Input
            type={"text"}
            className={"table-input"}
            removeFormGroupClass={true}
            value={Discount}
            name={"Discount"}
            onChange={(e) =>
              handleChangeTable(
                e,
                index,
                AMOUNT_REGX(3).test(e?.target?.value),
                e?.target?.value < 100
              )
            }
          />
        ),
        Amount: (
          <Input
            type={"text"}
            className={"table-input"}
            removeFormGroupClass={true}
            value={Amount}
            name={"Amount"}
            onChange={(e) =>
              handleChangeTable(e, index, AMOUNT_REGX(3).test(e?.target?.value))
            }
          />
        ),
        Reject: <i className="fa fa-trash text-danger text-center" />,
      };
    });
  };

  const handleReactChange = (name, e) => {
    const data = tableData?.map((row, _) => {
      return {
        ...row,
        [name]: e?.value,
      };
    });
    setTableData(data);
  };

  const handlePatientBillingEditPackage = async () => {
    try {
      const requestBody = tableData
        ?.filter((row, _) => row?.isChecked)
        ?.map((item, _) => {
          return {
            amount: Number(item?.Amount),
            discount: Number(item?.Discount),
            ipAddress: String(ip),
            disReason: String(item?.DiscReason),
            ledgerTnxID: String(item?.LedgerTnxID),
            isChecked: Boolean(item?.isChecked),
          };
        });

      const response = await PatientBillingEditPackage(requestBody);
      // const response = await PatientBillingEditPackage({
      //   edits: requestBody,
      // });

      notify(response?.message, response?.success ? "success" : "error");

      if (response?.success) {
        handleModalState(false, null, null, null, <></>);
        GetBindBillDepartment();
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    
    handlePatientBillingGetPackage(pateintDetails?.TransactionID);
    GetDiscListAPI();
  }, []);

  console.log(tableData,"tableDatatableData")

  return (
    <div>
      <Tables thead={THEAD_TABLE} tbody={handleTableData(tableData)} />
      <div className="mt-2  row flex-row-reverse">
        <button
          className="btn btn-sm btn-primary"
          onClick={handlePatientBillingEditPackage}
        >
          Save
        </button>
        <ReactSelect
          respclass={"col-8"}
          placeholderName={"Discount Reason"}
          value={tableData?.[0]?.DiscReason}
          name={"DiscReason"}
          dynamicOptions={reactSelectOptionList(discounts?.discountReasonList,
            "DiscountReason",
            "DiscountReason"
          )}
          handleChange={handleReactChange}
        />
      </div>
    </div>
  );
};

export default EditPackage;
