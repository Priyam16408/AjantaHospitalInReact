import React, { useEffect, useState } from "react";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  BloodBankPatientProcessGetExpiry,
  PatientProcessBindBag,
} from "../../../networkServices/BloodBank/BloodBank";
import { useTranslation } from "react-i18next";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { notify } from "../../../utils/ustil2";
import Tables from "../../../components/UI/customTable";
import CustomSelect from "../../../components/formComponent/CustomSelect";

const CrossMatchModal = ({ ele, setModalState }) => {
  const [t] = useTranslation();

  const initialValue = {
    crossMatch: { value: "Select", label: "Select" },
  };
  const [values, setValues] = useState({ ...initialValue });

  const [tableData, setTableData] = useState([]);

  const [responseData, setResponseData] = useState([]);

  const [bloodBagData, setBloodBagData] = useState([]);

  const THEAD = [
    { name: "S.No.", width: "1%" },
    { name: "Component Name", width: "1%" },
    { name: "Blood Bag No", width: "10%" },
    { name: "BloodGroup" },
    { name: "Expiry Date" },
    { name: "Cross Match", width: "20%" },
    { name: "Close" },
  ];

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleTableReactSelect = (name, value, index) => {
    const updatedItems = [...tableData];
    updatedItems[index][name] = value?.value;
    setTableData(updatedItems);
  };

  const addRow = () => {
    const newRow = {
      id: Date.now(),
      ComponentName: ele?.ComponentName,
      BloodBagNo: values?.bloodBagNo?.BBTubeNo?.split("#")[0],
      BloodGroup: ele?.BloodGroup,
      ExpiryDate: responseData?.date,
      CrossMatch: values?.crossMatch?.value || "",
      isExist: responseData?.isExists,
    };

    setTableData((prev) => [...prev, newRow]);
  };

  const handleRemove = (rowId) => {
    setTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  const getExipryDate = async (ele) => {
    const payload = {
      ID: ele?.ID,
      TubeNo: ele?.BBTubeNo,
    };
    const response = await BloodBankPatientProcessGetExpiry(payload);
    if (response?.success) {
      setResponseData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const bagData = async () => {
    const response = await PatientProcessBindBag(ele?.BloodGroup);

    if (response?.success) {
      setBloodBagData(response?.data);
    }
  };

  useEffect(() => {
    setModalState((val) => ({
      ...val,
      modalData: { ...values, ...ele, ...tableData },
    }));
  }, [values]);

  useEffect(() => {
    bagData();
  }, []);

  useEffect(() => {
    if (values?.bloodBagNo) {
      getExipryDate(values?.bloodBagNo);
    }
  }, [values?.bloodBagNo]);
  return (
    <div className="">
      <div className="row p-2">
        <LabeledInput
          label={"UHID"}
          value={ele?.PatientID}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"IPD No."}
          value={ele?.IPDNo}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"Patient Name"}
          value={ele?.Pname}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"Component"}
          value={ele?.ItemName}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <LabeledInput
          label={"Blood Group"}
          value={ele?.BloodGroup}
          className={"col-xl-4 col-md-4 col-sm-6 col-12 mb-2"}
        />
        <ReactSelect
          placeholderName={t("Blood Bag No.")}
          name="bloodBagNo"
          value={values?.bloodBagNo?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            ...handleReactSelectDropDownOptions(
              bloodBagData,
              "BBTubeNo",
              "Stock_Id"
            ),
          ]}
          searchable={true}
          respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        />
        <div className="w-100 d-flex justify-content-end mr-2">
          <button
            className="btn btn-primary btn-success"
            onClick={() => {
              addRow((val) => [values]);
            }}
          >
            {t("Add")}
          </button>
        </div>
      </div>
      {tableData?.length > 0 && (
        <Tables
          thead={THEAD}
          tbody={tableData?.map((val, i) => ({
            SNo: i + 1,
            ComponentName: ele?.ComponentName,
            BloodBagNo: values?.bloodBagNo?.BBTubeNo?.split("#")[0],
            BloodGroup: ele?.BloodGroup,
            ExpiryDate: responseData?.date,
            CrossMatch: (
              <CustomSelect
                option={[
                  { value: "Select", label: "Select" },
                  { value: "Compatible", label: "Compatible" },
                  { value: "Not Compatible", label: "Non Compatible" },
                ]}
                placeholderName={t("Cross Match")}
                name="CrossMatch"
                isRemoveSearchable={true}
                value={val?.CrossMatch}
                onChange={(name, e) => handleTableReactSelect(name, e, i)}
                respclass="w-100"
              />
            ),
            Close: (
              <i
                className="fa fa-trash"
                onClick={() => handleRemove(val?.id)}
              ></i>
            ),
          }))}
        />
      )}
    </div>
  );
};

export default CrossMatchModal;
