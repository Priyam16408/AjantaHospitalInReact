import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  EDPBillCancel,
  EDPBillCancellationSearch,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/ustil2";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

export default function IPDBillCentre({ data }) {
  const ip = useLocalStorage("ip", "get");
  const [t] = useTranslation();

  const initialValues = {
    Type: {
      label: "Bill",
      value: "1",
    },
    Name: ""
  };

  const [values, setValues] = useState({ ...initialValues });
  console.log("values", values);
  const tHead = [
    { name: "S.No." , width: "1%"},
    { name: "Patient Name" },
    { name: "UHID" },
    { name: "IPD No." },
    { name: "Bill No." },
    { name: "Total Bill" },
    { name: "Cancel Reason" },
    { name: "Select", width: "1%" },
  ];

  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleReactSelect = (name, value) => {
    if(name == "Type"){
      setTableData([]);
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSearch = async () => {
    console.log("values", values);

    if(values?.Name == "" || values?.UHID == "" || values?.IPDNo == "" || values?.Type?.value == "" ){
      notify("Please enter atLeast One Field", "error");
      return
    }
    // 
    const payload = {
      patientID: values?.UHID ? values?.UHID : "",
      transactionNo: values?.IPDNo ? values?.IPDNo : "",
      pName: values?.Name ? values?.Name : "",
      searchType: values?.Type?.value ? values?.Type?.value : "1",
    };

    const response = await EDPBillCancellationSearch(payload);

    if (response?.success) {
      // setValues(initialValues);
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };

  const handleCustomTableInput = (index, name, e) => {
    const data = [...tableData];
    data[index][name] = e.target.value;
    // 
    setTableData(data);
  };

  const handleUpdate = async (ele) => {
    // ;
    const payload = {
      patientID: ele?.PatientID,
      transactionNo: ele?.TransactionID,
      billNo: ele?.BillNo,
      searchType: values?.Type?.value ? values?.Type?.value : "1",
      reason: ele?.Reason,
      ipAddress: ip,
    };

    const response = await EDPBillCancel(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      handleSearch();
    } else {
      notify(response?.message, "error");
    }
  };

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />
        <div className="row p-2">
          <ReactSelect
            removeIsClearable={true}
            placeholderName={t("Type")}
            id="Type"
            // requiredClassName={"required-fields"}
            name="Type"
            value={values?.Type?.value}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={[
              { label: "Bill", value: "1" },
              { label: "Bill Finalised", value: "2" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className={"form-control"}
            lable={t("UHID")}
            placeholder=" "
            id="UHID"
            name="UHID"
            onChange={(e) => handleInputChange(e, 0, "UHID")}
            value={values?.UHID}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className={"form-control"}
            lable={t("IPD No.")}
            placeholder=" "
            id="IPDNo"
            name="IPDNo"
            onChange={(e) => handleInputChange(e, 0, "IPDNo")}
            value={values?.IPDNo}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className={"form-control"}
            lable={t("Name")}
            placeholder=" "
            id="Name"
            name="Name"
            onChange={(e) => handleInputChange(e, 0, "Name")}
            value={values?.Name}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div className="col-1">
            <button
              className="btn btn-sm btn-primary w-100"
              type="button"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>

        <Heading title={t("Result Details")} isBreadcrumb={false} />
        <Tables
          thead={tHead}
          tbody={tableData?.map((ele, i) => {
            return {
              SNo: i + 1,
              PName: ele?.PName,
              PatientID: ele?.PatientID,
              IPDNo: ele?.IPDNo,
              BillNo: ele?.BillNo,
              TotalBilledAmt: ele?.TotalBilledAmt,
              CancelReason: (
                <Input
                  type="text"
                  className={"table-input required-fields"}
                  removeFormGroupClass={true}
                  // lable={t("Name")}
                  placeholder=" "
                  // id="Name"
                  name="Reason"
                  onChange={(e) => handleCustomTableInput(i, "Reason", e)}
                  value={ele?.Reason ? ele?.Reason : ""}
                  respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                />
              ),
              Select:(
                  <button
                    className="btn btn-sm btn-primary update-btn"
                    type="button"
                    onClick={() => handleUpdate(ele)}
                  >
                    {t("Update")}
                  </button>
                ),
            };
          })}
          style={{height:"68vh"}}
        />
      </div>
    </div>
  );
}
