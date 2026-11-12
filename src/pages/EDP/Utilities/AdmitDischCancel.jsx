import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import {
  EDPBillCancellationSearch,
  EDPCancelAdmitDischargeSave,
  EDPCancelAdmitDischargeSearch,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/ustil2";
import Input from "../../../components/formComponent/Input";
import { UpdateSVG } from "../../../components/SvgIcons";
import CustomSelect from "../../../components/formComponent/CustomSelect";

export default function AdmitDischCancel({ data }) {
  const [t] = useTranslation();

  const initialValues = {
    UHID: "",
    IPDNo: "",
    Name: "",
  };

  const [values, setValues] = useState({ ...initialValues });
  console.log("Values", values);
  const [tableData, setTableData] = useState([]);
  console.log("TableData", tableData);
  const tHead = [
    { name: "S.No.", width: "1%" },
    { name: "IPD No." },
    { name: "UHID" },
    { name: "Patient Name" },
    { name: "Address" },
    { name: "Ward" },
    { name: "Room No." },
    { name: "Type", width: "15%" },
    { name: "Status" },
    { name: "CancelReason" },
    { name: "Update" },
  ];

  const determineType = (item) => {
    // 
    if (item?.panelInvoiceNo !== "") {
      return null;
    }
    if (item?.IsBilledClosed === 1) {
      return null;
    }
    if (item?.BillNo !== "") {
      return null;
    }

    if (item?.IsDischargeIntimate === 0) {
      return "Admission";
    }

    if (
      item?.IsDischargeIntimate === 1 &&
      item?.Status?.toUpperCase() === "IN" &&
      item?.IsBillFreezed === 0
    ) {
      return "Discharge Intimation";
    }

    if (
      item?.IsDischargeIntimate === 1 &&
      item?.Status?.toUpperCase() === "OUT"
    ) {
      return "Discharged";
    }

    if (item?.IsBillFreezed === 1 && item?.Status?.toUpperCase() === "IN") {
      return "Bill Freezed";
    }

    if (item?.IsClearance === 1 && item?.Status?.toUpperCase() === "OUT") {
      return "Patient Clearance";
    }

    if (item?.IsNurseClean === 1 && item?.Status?.toUpperCase() === "OUT") {
      return "Nursing Clearance";
    }

    if (item?.IsRoomClean === 1 && item?.Status?.toUpperCase() === "OUT") {
      return "Room Clearance";
    }

    if (
      item?.IsMedCleared === 1 &&
      item?.Status?.toUpperCase() === "IN" &&
      item?.IsBillFreezed === 0
    ) {
      return "Revert Med Clearance";
    }

    return null;
  };

  const typeDynamicOptions = [
    { value: "Room Clearance", label: "Room Clearance" },
    { value: "Nursing Clearance", label: "Nursing Clearance" },
    { value: "Patient Clearance", label: "Patient Clearance" },
    { value: "Discharged", label: "Discharged" },
    { value: "Bill Freezed", label: "Bill Freezed" },
    {
      value: "Revert Med Clearance",
      label: "Revert Med Clearance",
    },
    {
      value: "Discharge Intimation",
      label: "Discharge Intimation",
    },
    { value: "Admission", label: "Admission" },
  ];

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleCustomTableInput = (index, name, e) => {
    const data = [...tableData];
    data[index][name] = e.target.value;
    // 
    setTableData(data);
  };

  const handleSearch = async () => {
    if (!values?.IPDNo && !values?.UHID && !values?.Name) {
      notify("Please enter atLeast One Field", "error");
      return;
    }

    const payload = {
      patientID: values?.IPDNo,
      crNo: values?.UHID,
      pName: values?.Name,
    };

    const response = await EDPCancelAdmitDischargeSearch(payload);

    if (response?.success) {
      const processedData = response.data.map((item) => ({
        ...item,
        type: determineType(item),
      }));
      setTableData(processedData);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleCustomSelect = (index, name, e) => {
    const data = [...tableData];
    data[index][name] = e.value;
    setTableData(data);
  };

  const handleUpdate = async (ele) => {
    console.log("Ele", ele);
    ;

    const payload = {
      cancelReason: ele?.Reason,
      ipdNo: ele?.TransNo,
      roomID: ele?.RoomID,
      patientIPDProfileID: ele?.PatientIPDProfile_ID,
      patientID: ele?.PatientID,
      isDischarge: ele?.IsBilledClosed === 1,
      isMedicine: ele?.IsMedCleared === 1,
      isPatientClearance: ele?.IsClearance === 1,
      isNursingClearance: ele?.IsNurseClean === 1,
      isRoomClearance: ele?.IsRoomClean === 1,
      isBillFreezed: ele?.IsBillFreezed === 1,
      isAdmitted: ele?.Status === "ADMITTED",
      isDischargeIntimation: ele?.IsDischargeIntimate === 1,
    };

    const response = await EDPCancelAdmitDischargeSave(payload);

    if (response?.success) {
      notify(response?.message, "success");
      const Newpayload = {
        patientID: ele?.PatientID,
        crNo: values?.UHID,
        pName: values?.Name,
      };
      EDPCancelAdmitDischargeSearch(Newpayload);
    } else {
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
          <Input
            type="text"
            className={"form-control required-fields"}
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
            className={"form-control required-fields"}
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
            className={"form-control required-fields"}
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
          tbody={tableData?.map((ele, index) => {
            return {
              SNo: index + 1,
              IPDNo: ele?.TransNo,
              UHID: ele?.PatientID,
              PatientName: ele?.PName,
              Address: ele?.Address,
              Ward: ele?.CaseType,
              RoomName: ele?.Room_No,
              Type: (
                <CustomSelect
                  isDisable={true}
                  isRemoveSearchable={true}
                  option={typeDynamicOptions}
                  placeHolder={t("Type")}
                  value={typeDynamicOptions?.find((e) => e.value === ele?.type)}
                  name="type"
                  onChange={(name, e) => handleCustomSelect(index, name, e)}
                />
              ),
              Status: ele?.Status,
              CancelReason: (
                <Input
                  type="text"
                  className={"table-input required-fields"}
                  // lable={t("Name")}
                  placeholder=" "
                  // id="Name"
                  name="Reason"
                  onChange={(e) => handleCustomTableInput(index, "Reason", e)}
                  value={ele?.Reason}
                  respclass="col-xl-12 col-md-4 col-sm-6 col-12"
                />
              ),
              update: (
                <div type="button" onClick={() => handleUpdate(ele)}>
                  {UpdateSVG()}
                </div>
              ),
            };
          })}
          style={{ height: "68vh" }}
        />
      </div>
    </div>
  );
}
