import React, { useEffect, useState } from "react";
import {
  PatientBillingGetPackage,
  PatientBillingItemPackageSave,
} from "../../../../networkServices/BillingsApi";
import ReactSelect from "../../../formComponent/ReactSelect";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { setLoading } from "../../../../store/reducers/loadingSlice/loadingSlice";
import store from "../../../../store/store";

const PackageBilling = ({
  data,
  pateintDetails,
  handleModalState,
  GetBindBillDepartment,
}) => {
  const [dropDownState, setDropDownState] = useState([]);
  const [packageID, setPackageID] = useState("0");
  const ip = useLocalStorage("ip", "get");

  const handlePatientBillingGetPackage = async (TransactionID) => {
    try {
      const response = await PatientBillingGetPackage(TransactionID);
      setDropDownState([
        { label: "No Package", value: "0" },
        ...handleReactSelectDropDownOptions(
          response?.data,
          "TypeName",
          "ItemID"
        ),
      ]);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handlePayload = () => {
    const obj = {
      ltdNo: [],
      ltNo: [],
    };

    for (let i = 0; i < data.length; i++) {
      if (
        data[i]?.subRow?.subRowList?.length > 0 ||
        data[i]?.subRow?.subRowList.some((ele, _) => ele?.isChecked)
      ) {
        for (let j = 0; j < data[i]["subRow"]["subRowList"].length; j++) {
          const subRow = data[i]["subRow"]["subRowList"];
          if (subRow[j]?.["isChecked"] === true) {
            obj.ltNo.push(`'${subRow[j]?.["LedgerTransactionNo"]}'`);
            obj.ltdNo.push(`'${subRow[j]?.["LtNo"]}'`);
          }
        }
      }
    }

    return {
      ltdNo: obj.ltdNo,
      ltNo: obj.ltNo,
    };
  };

  const handleSave = async () => {
    store.dispatch(setLoading(true));
    try {
      const { ltdNo, ltNo } = handlePayload();
      if (ltdNo.length > 0 && ltNo.length > 0) {
        const requestBody = {
          ltdNo: ltdNo.join(","),
          ltNo: ltNo.join(","),
          package: String(packageID),
          ipAddress: String(ip),
        };
        const response = await PatientBillingItemPackageSave(requestBody);
        notify(response?.message, response?.success ? "success" : "error");

        if (response?.success) {
          handleModalState(false, null, null, null, null);
          await GetBindBillDepartment();
        }
      } else {
        notify("Please Select Test", "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handlePatientBillingGetPackage(pateintDetails?.TransactionID);
  }, []);
  return (
    <div>
      <ReactSelect
        placeholderName={"package"}
        dynamicOptions={dropDownState}
        value={packageID}
        removeIsClearable={true}
        handleChange={(_, e) => setPackageID(e?.value)}
      />

      <div className="d-flex aling-items-center justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PackageBilling;
