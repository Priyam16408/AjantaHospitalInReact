import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import Input from "../../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import TimePicker from "../../../../components/formComponent/TimePicker";
import DatePicker from "../../../../components/formComponent/DatePicker";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  EDPAdmitDischSearch,
  EDPAdmitDischUpdate,
  EDPBindDischargeType,
} from "../../../../networkServices/EDP/govindedp";
import { notify } from "../../../../utils/ustil2";
import moment from "moment";
import {
  getDateWithTime,
  handleReactSelectDropDownOptions,
  parseTimeString,
  timeFormateDate,
} from "../../../../utils/utils";

const AdmitDiscDateEdit = ({ data }) => {
  const [t] = useTranslation();

  const initialValues = {
    IPDNo: "",
    isAdmission: {
      label: "No",
      value: "No",
    },
    isDischargeType: {
      label: "No",
      value: "No",
    },
    isDischarge: {
      label: "No",
      value: "No",
    },
    isBilling: {
      label: "No",
      value: "No",
    },
    type: {
      value: 0,
    },
  };

  const [values, setValues] = useState({ ...initialValues });
  console.log("values", values);
  const [tableData, setTableData] = useState([]);
  console.log("first", tableData);
  const [DropDownState, setDropDownState] = useState({
    dischargeType: [],
  });

  const [originalData, setOriginalData] = useState([]);

  console.log("dropDownState", DropDownState);

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    // const formattedValue = moment(value).isValid()
    //   ? moment(value).format("YYYY-MM-DDTHH:mm:ss")
    //   : value;
    setValues((val) => ({ ...val, [name]: value }));

    // if (tableData.length > 0) {
    //   const updatedTableData = [...tableData];
    //   updatedTableData[0] = {
    //     ...updatedTableData[0],
    //     [name]: value,
    //   };
    //   setTableData(updatedTableData);
    // }
  };

  const handleReactSelect = (label, selectedOption) => {
    // if (tableData.length > 0) {
    setValues((val) => ({ ...val, [label]: selectedOption }));
    // }
  };
  const handleReactSelectField = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSearch = async () => {
    if (!values?.IPDNo) {
      notify("Please enter IPD No.", "error");
      return;
    }
    const payload = values?.IPDNo;

    const response = await EDPAdmitDischSearch(payload);
    ;

    if (response?.success) {
      setValues({
        ...response?.data[0],
        IPDNo: values?.IPDNo,
        type: { value: 1 },
        TimeOfAdmit: getDateWithTime(response?.data[0].TimeOfAdmit),
        TimeOfDischarge: getDateWithTime(response?.data[0].TimeOfDischarge),
        dischargeType: {
          label: response?.data[0].dischargeType,
          value: response?.data[0].dischargeType,
        },
      });
      setOriginalData(response?.data);
      // setTableData(response?.data);
      // setTableData({...response?.data[0],TimeOfAdmit: getDateWithTime(response?.data[0].TimeOfAdmit),getDateWithTime: timeFormateDate(response?.data[0].TimeOfDischarge)});
    } else {
      notify(response?.message, "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const dischargeOption = [
    { label: "Normal", value: "Normal" },
    { label: "LAMA", value: "LAMA" },
    { label: "Absconding", value: "Absconding" },
    {
      label: "Discharge On Request",
      value: "Discharge On Request",
    },
    { label: "Death", value: "Death" },
    { label: "Patient On Leave", value: "Patient On Leave" },
    { label: "Referred", value: "Referred" },
  ];

  const handleUpdate = async () => {
    ;

    const payload = {
      ipdNo: values?.IPDNo || "",
      dischargeType: values?.dischargeType?.value || "",

      admissionDate: values?.DateOFAdmit?.split("T")[0] || "",
      admissionTime: values?.TimeOfAdmit || "",
      // dischargeDate: values?.DateOfDischarge?.split("T")[0] || "",
      dischargeDate: values?.DateOfDischarge || "",
      dischargeTime: values?.TimeOfDischarge || "",
      billingDate: values?.BillDate?.split("T")[0] || "",
      billingTime: values?.BillDate?.split("T")[1] || "",

      isAdmissionDT: values?.isAdmission?.value === "Yes",
      isDischargeDT: values?.isDischarge?.value === "Yes",
      isBillingDT: values?.isBilling?.value === "Yes",
      isDischargeType: values?.isDischargeType?.value === "Yes",
    };

    const response = await EDPAdmitDischUpdate(payload);

    if (response?.success) {
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  const handleDischargeType = async () => {
    const response = await EDPBindDischargeType();

    if (response?.success) {
      setDropDownState((prev) => ({
        ...prev,
        dischargeType: handleReactSelectDropDownOptions(
          response?.data,
          "NAME",
          "DeptHeadID"
        ),
      }));
    } else {
      notify(response?.message, "error");
    }
  };
  console.log("adasdasd", values);
  const handlePatientSearchPage = () => {
    setValues({ ...initialValues, IPDNo: values?.IPDNo, type: { value: 0 } });
    setTableData([]);
  };

  const handleReset = () => {
    setTableData([]);
    setValues(initialValues);
  };

  useEffect(() => {
    handleDischargeType();
  }, []);

  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        isSlideScreen={false}
        isBreadcrumb={true}
      />
      {values?.type?.value === 1 && values?.PatientID ? (
        <div className="row p-2">
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="row">
              <div className="col-1">
                <i
                  className="fa fa-search "
                  aria-hidden="true"
                  onClick={handlePatientSearchPage}
                  style={{
                    border: "1px solid #447dd5",
                    padding: "5px 3px",
                    borderRadius: "3px",
                    backgroundColor: "#447dd5",
                    color: "white",
                  }}
                ></i>
              </div>
              <div className="col-11">
                <LabeledInput label={t("UHID")} value={values?.PatientID} />
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <LabeledInput label={t("First Name")} value={values?.PFirstname} />
          </div>
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <LabeledInput label={t("Last Name")} value={values?.PLastname} />
          </div>
          <ReactSelect
            removeIsClearable={true}
            placeholderName={t("Is Admission")}
            requiredClassName="required-fields"
            name="isAdmission"
            value={values?.isAdmission?.value}
            handleChange={(name, e) => handleReactSelectField(name, e)}
            dynamicOptions={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
          />
          <DatePicker
            disable={values?.isAdmission?.value == "Yes" ? false : true}
            className="custom-calendar"
            placeholder=""
            lable={t("Admission Date")}
            name="DateOFAdmit"
            id="DateOFAdmit"
            value={new Date(values?.DateOFAdmit)}
            showTime
            hourFormat="12"
            handleChange={handleDateTimeChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
          />
          {console.log("getDate", values?.TimeOfAdmit)}
          <TimePicker
            disable={values?.isAdmission?.value == "Yes" ? false : true}
            placeholderName=""
            lable={t("Admission Time")}
            id="TimeOfAdmit"
            name="TimeOfAdmit"
            value={values?.TimeOfAdmit}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-1"
            handleChange={handleDateTimeChange}
          />
          <ReactSelect
            removeIsClearable={true}
            placeholderName={t("Is Discharge Type")}
            requiredClassName="required-fields"
            name="isDischargeType"
            value={values?.isDischargeType?.value}
            handleChange={(name, e) => handleReactSelectField(name, e)}
            dynamicOptions={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          {console.log(
            "getDate",
            DropDownState?.dischargeType?.find(
              (x) => x.label == String(values?.dischargeType?.value)
            )?.value
          )}
          <ReactSelect
            isDisabled={values?.isDischargeType?.value == "Yes" ? false : true}
            placeholderName={t("Discharge Type")}
            requiredClassName="required-fields"
            name="dischargeType"
            value={
              DropDownState?.dischargeType?.find(
                (x) => x.label == String(values?.dischargeType?.value)
              )?.value
            }
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={DropDownState?.dischargeType}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            removeIsClearable={true}
            placeholderName={t("Is Discharge")}
            requiredClassName="required-fields"
            name="isDischarge"
            value={values?.isDischarge?.value}
            handleChange={(name, e) => handleReactSelectField(name, e)}
            dynamicOptions={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <DatePicker
            disable={values?.isDischarge?.value == "Yes" ? false : true}
            className="custom-calendar"
            placeholder=""
            lable={t("Discharge Date")}
            name="DateOfDischarge"
            id="DateOfDischarge"
            value={new Date(values?.DateOfDischarge)}
            showTime
            hourFormat="12"
            handleChange={handleDateTimeChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <TimePicker
            disable={values?.isDischarge?.value == "Yes" ? false : true}
            placeholderName=""
            lable={t("Discharge Time")}
            id="TimeOfDischarge"
            name="TimeOfDischarge"
            value={values?.TimeOfDischarge}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleDateTimeChange}
          />

          <ReactSelect
            removeIsClearable={true}
            placeholderName={t("Is Billing")}
            requiredClassName="required-fields"
            name="isBilling"
            value={values?.isBilling?.value}
            handleChange={(name, e) => handleReactSelectField(name, e)}
            dynamicOptions={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <DatePicker
            disable={values?.isBilling?.value == "Yes" ? false : true}
            className="custom-calendar"
            placeholder=""
            lable={t("Billing Date")}
            name="BillDate"
            id="BillDate"
            value={new Date(values?.BillDate)}
            showTime
            hourFormat="12"
            handleChange={handleDateTimeChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <TimePicker
            disable={values?.isBilling?.value == "Yes" ? false : true}
            placeholderName=""
            lable={t("Billing Time")}
            id="BillDate"
            name="BillDate"
            value={new Date(values?.BillDate)}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleDateTimeChange}
          />
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={handleUpdate}
          >
            {t("Update")}
          </button>
        </div>
      ) : (
        <div className="row p-2">
          <Input
            type="text"
            className={"form-control required-fields"}
            lable={t("IPD No")}
            placeholder=" "
            name="IPDNo"
            onChange={(e) => handleInputChange(e, 0, "IPDNo")}
            value={values?.IPDNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <button
            className=" btn btn-sm btn-success ml-2 px-3"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdmitDiscDateEdit;
