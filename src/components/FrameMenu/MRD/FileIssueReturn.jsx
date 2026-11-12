import React, { useEffect, useState } from "react";
import FileStatus from "./FileStatus";
import LabeledInput from "../../formComponent/LabeledInput";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import DatePicker from "../../formComponent/DatePicker";
import moment from "moment";
import TimePicker from "../../formComponent/TimePicker";
import { BindMRDRequisitionDetail, handleMRDFileIssueSave, MRDBindFileDetail, MRDBindFileDoc, MRDBindPatientDetail, MRDBindEmployeeAPI, handleFileReturnSave, handleEnDisableSave } from "../../../networkServices/MRDApi";
import MultiSelectComp from "../../formComponent/MultiSelectComp";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { handleMRDFFileReturnSavePayload, handleMRDFileIssueSavePayload, handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { bindDepartments } from "../../../networkServices/purchaseDepartment";
import Input from "../../formComponent/Input";

const INPUT_CHECKBOX = [
  {
    label: "Soft Copy",
    name: "softCopy",
    secondName: "hardCopy",
  },
  {
    label: "Hard Copy",
    name: "hardCopy",
    secondName: "softCopy",
  },
];

const FileIssueReturn = ({ data, FileName }) => {
  const [t] = useTranslation()
  const { VITE_DATE_FORMAT } = import.meta.env;

  const handleLabelData = ({ Details, BindFileDetail }) => {
    console.log("Details", Details)
    let fileDetail = BindFileDetail?.length > 0 ? BindFileDetail[0] : {}
    const LabelData = [
      {
        label: "IPD No.",
        value: Details?.TransNo,
      },
      {
        label: "Patient Name",
        value: Details?.PName,
      },

      {
        label: "MLC Number",
        value: Details?.MLC_NO,
      },

      {
        label: "Bill No.",
        value: Details?.BillNo,
      },
      {
        label: "Discharge Date",
        value: Details?.DateOfDischarge,
      },
      {
        label: "Shelf No.",
        value: fileDetail?.AlmID,
      },
      {
        label: "File Reg. Date",
        value: fileDetail?.EntDate,
      },
      {
        label: "Rack Name",
        value: fileDetail?.AlmName,
      },

    ];
    return LabelData.map((row, index) => (
      <div className="col-xl-2 col-md-3 col-sm-4 col-12 mt-2" key={index}>
        <LabeledInput
          label={row?.label}
          value={row?.value}
          className={"w-100"}
        />
      </div>
    ));
  };
  const [payload, setPayload] = useState({ FileType: { value: "Internal" }, IssueDate: new Date(), IssueTime: new Date() })

  const [patientDetails, setPatientDetails] = useState({ fileList: [], PersonToIssueList: [] })
  const getBindFileList = async (Transaction_id, FileID, RequestedRoleID) => {
    let apiResp = await MRDBindFileDoc(Transaction_id, FileID)
    let data = await MRDBindEmployeeAPI(RequestedRoleID)
    if (data?.success) {
      setPatientDetails((val) => ({ ...val, PersonToIssueList: handleReactSelectDropDownOptions(data?.data, "name", "employeeID") }))

      let IssuedToDetail = data?.data?.find((val) => String(payload?.IssuedTo?.value) === val?.EmployeeID)

      if (IssuedToDetail) {
        setPayload((val) => ({ ...val, ["IssuedTo"]: { ...payload?.IssuedTo, ...IssuedToDetail } }))
      }
    }
    if (apiResp?.success) {
      setPatientDetails((val) => ({ ...val, fileList: apiResp?.data }))
    }
  }


  const handleMRDBindPatientDetail = async (Transaction_id, patient_id) => {
    try {
      const [BindPatientDetails, BindFileDetail, departmentList, RequisitionDetail] = await Promise.all([
        MRDBindPatientDetail(Transaction_id, patient_id),
        MRDBindFileDetail(Transaction_id, patient_id),
        bindDepartments(),
        BindMRDRequisitionDetail(data?.MRDRequisitionID)
      ]);

      const responseData = {
        Details: BindPatientDetails?.data,
        BindFileDetail: handleReactSelectDropDownOptions(BindFileDetail?.data, "FileID", "FileID"),
        fileList: [],
        PersonToIssueList: [],
        departmentList: handleReactSelectDropDownOptions(departmentList?.data, "ledgerName", "roleID"),
        RequisitionDetail: data?.MRDRequisitionID ? RequisitionDetail?.data : {}
      };

      let departmetDetail = responseData?.departmentList?.find((val) => String(RequisitionDetail?.data?.RequestedRoleID) === val?.value)
      setPayload((val) => ({ ...val, Department: departmetDetail, IssuedTo: { value: String(RequisitionDetail?.data?.RequestedBy), label: RequisitionDetail?.data?.NAME }, softCopy: RequisitionDetail?.data?.SoftCopy, hardCopy: RequisitionDetail?.data?.HardCopy, Type: { value: "Employee" }, ReturnTimeDays: { value: RequisitionDetail?.data?.AveragereturnDay }, ReturnTimeHrs: { value: RequisitionDetail?.data?.AveragereturnHour } }))

      if (responseData?.BindFileDetail?.length > 0) {
        setPayload((val) => ({ ...val, FileNo: { value: responseData?.BindFileDetail[0]?.value } }))
        data?.MRDRequisitionID && getBindFileList(Transaction_id, responseData?.BindFileDetail[0]?.value, RequisitionDetail?.data?.RequestedRoleID)
      }



      setPatientDetails(responseData);
    } catch (error) {
      console.log(error, "SomThing Went Wrong");
    }
  };




  useEffect(() => {
    // console.log("first",data)
    handleMRDBindPatientDetail(data?.transactionID ? data?.transactionID : data?.TransactionID, data?.patientID ? data?.patientID : data?.PatientID)
   debugger;
    if(FileName === "File Return"){
    EnDisableSave(data?.transactionID, data?.MRDRequisitionID);
    }
    // else{
    //   setIsIssue(1)
    // }
  }, [])

  const EnDisableSave = async (TID, ReqID) => {
    // const payload = {
    //   TransactionID: TID,
    //   RequestID: ReqID
    // }
    try {
      const response = await handleEnDisableSave(TID,ReqID);
      if (response?.success) {
        if (response.data.length > 0) {
          setIsIssue(1);
        }
      }
      else {
        setIsIssue(0);

      }
    }
    catch {
      setIsIssue(0);

    }
  }
  // const handleMultiSelectChange = (name, selectedOptions) => {
  //   setPayload({ ...payload, [name]: selectedOptions });
  // };
  const handleChecked = (e, secondName) => {
    const { name, checked } = e.target;
    setPayload({
      ...payload,
      [name]: Number(checked),
      [secondName]: 0,
    });
  };

  const handleSelect = (name, value) => {
    if (name === "FileType") {
      if (value?.value === "External") {
        setPayload((val) => ({ ...val, [name]: value, Department: "" }))
      } else {
        setPayload((val) => ({ ...val, [name]: value, Department: { value: "" } }))
      }
    } else {
      setPayload((val) => ({ ...val, [name]: value }))
    }
  }

  const handleChange = (e) => {
    setPayload((val) => ({ ...val, [e?.target?.name]: e?.target?.value }))
  }

  const [isIssue, setIsIssue] = useState(data?.IsIssue);
  debugger;
  const handleFileIssueSave = async () => {
    if (!payload?.Department) {
      notify("Department Fields Is Required", "error")
      return 0
    } else if (!payload?.IssuedTo) {
      notify("IssuedTo Fields Is Required", "error")
      return 0
    } else if (!payload?.Remarks) {
      notify("Remarks Fields Is Required", "error")
      return 0
    }
    if (FileName == "File Return") {
      let payloadData = handleMRDFFileReturnSavePayload(payload, patientDetails, data)
      let apiResp = await handleFileReturnSave(payloadData)
      if (apiResp?.success) {
        notify(apiResp?.message, "success")
        setIsIssue(0)
      } else {
        notify(apiResp?.message, "error")
      }
    }
    else {
      let payloadData = handleMRDFileIssueSavePayload(payload, patientDetails, data)

      let apiResp = await handleMRDFileIssueSave(payloadData)
      if (apiResp?.success) {
        notify(apiResp?.message, "success")
        setIsIssue(1)
      } else {
        notify(apiResp?.message, "error")
      }
      console.log("apiResp", apiResp)
    }
  }
  return (
    <>
      {/* <FileStatus data={data} /> */}
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("File Issue")} isBreadcrumb={false} />

          <div className="row p-2">
            {handleLabelData(patientDetails)}

            <ReactSelect
              placeholderName={t("File No.")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12 mt-2"
              id={"FileNo"}
              name={"FileNo"}
              removeIsClearable={true}
              handleChange={(name, e) => setPayload((val) => ({ ...val, [name]: e }))}
              dynamicOptions={patientDetails?.BindFileDetail?.length > 0 ? patientDetails?.BindFileDetail : []}
              value={payload?.FileNo?.value}
            />

            {data?.MRDRequisitionID && <ReactSelect
              placeholderName={t("File Type")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12 mt-2"
              id={"FileType"}
              name={"FileType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleSelect(name, e)}
              dynamicOptions={[{ label: "Internal", value: "Internal" }, { label: "External", value: "External" }]}
              value={payload?.FileType?.value}
            />
            }
          </div>

          <Tables
            thead={[t("File No."), t("Document	"), t("Issue Type"), t("Issue To Name"), t("Department"), t("Issue By"), t("Issue Date & Time"), t("Status")]}
            tbody={patientDetails?.fileList?.map((val) => ({
              FileID: val?.FileID,
              Name: val?.Name,
              IssueType: val?.IssueType,
              Issue_To_Name: val?.Issue_To_Name,
              department: val?.department,
              IssueDate: val?.IssueDate,
              IssueBy: "",
              STATUS: val?.STATUS,
            }))}
            tableHeight="tableHeight"
          />


          <div className="row  p-2">

            <ReactSelect
              placeholderName={t("Type")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
              id={"Type"}
              name={"Type"}
              removeIsClearable={true}
              isDisabled={true}
              handleChange={(name, e) => setPayload((val) => ({ ...val, [name]: e }))}
              dynamicOptions={[
                { label: "Select", value: "All" },
                { label: "Doctor", value: "Doctor" },
                { label: "Employee", value: "Employee" }
              ]}
              value={payload?.Type?.value}
            />

            {payload?.FileType?.value === "External" ? <>
              <Input
                type="text"
                className="form-control required-fields"
                id="Department"
                name="Department"
                value={payload?.Department ? payload?.Department : ""}
                onChange={handleChange}
                lable={t("Department")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
              <Input
                type="text"
                className="form-control required-fields"
                id="IssueTo"
                name="IssueTo"
                value={payload?.IssueTo ? payload?.IssueTo : ""}
                onChange={handleChange}
                lable={t("Issue To")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />
            </> : <>
              <ReactSelect
                placeholderName={t("Department")}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
                id={"Department"}
                name={"Department"}
                removeIsClearable={true}
                isDisabled={true}
                handleChange={(name, e) => setPayload((val) => ({ ...val, [name]: e }))}
                dynamicOptions={patientDetails?.departmentList}
                value={payload?.Department?.value}
                requiredClassName={"required-fields"}
              />

              <ReactSelect
                placeholderName={t("Issued To")}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
                id={"IssuedTo"}
                name={"IssuedTo"}
                removeIsClearable={true}
                isDisabled={payload?.hardCopy ? false : true}
                handleChange={(name, e) => setPayload((val) => ({ ...val, [name]: e }))}
                dynamicOptions={patientDetails?.PersonToIssueList}
                value={payload?.IssuedTo?.value}
                requiredClassName={"required-fields"}
              />



            </>
            }
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              id="IssueDate"
              name="IssueDate"
              value={payload?.IssueDate ? moment(payload?.IssueDate).toDate() : ""}
              maxDate={new Date()}
              handleChange={handleChange}
              lable={("Issue Date")}
              placeholder={VITE_DATE_FORMAT}
            />

            <TimePicker
              placeholderName="IssueTime"
              lable={t("Issue Time")}
              id="IssueTime"
              name="IssueTime"
              value={payload?.IssueTime}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              handleChange={handleChange}
            />

            <ReactSelect
              placeholderName={t("Return Time Days")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
              id={"ReturnTimeDays"}
              name={"ReturnTimeDays"}
              removeIsClearable={true}
              isDisabled={true}
              handleChange={(name, e) => setPayload((val) => ({ ...val, [name]: e }))}
              dynamicOptions={Array.from({ length: 31 }, (_, index) => index)?.map((val) => ({ label: val, value: String(val) }))}
              value={String(payload?.ReturnTimeDays?.value)}
            />
            <ReactSelect
              placeholderName={t("Return Time Hrs")}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
              id={"ReturnTimeHrs"}
              name={"ReturnTimeHrs"}
              removeIsClearable={true}
              isDisabled={true}
              handleChange={(name, e) => setPayload((val) => ({ ...val, [name]: e }))}
              dynamicOptions={Array.from({ length: 24 }, (_, index) => index)?.map((val) => ({ label: val, value: String(val) }))}
              value={String(payload?.ReturnTimeHrs?.value)}
            />


            <div className="col-xl-2 col-md-3 col-sm-4 col-12 mt-2">
              <div className="row">
                {INPUT_CHECKBOX?.map((row, index) => (
                  <div className="col-6" key={index}>
                    <input
                      type="checkbox"
                      name={row?.name}
                      id={row?.name}
                      className="mx-1"
                      checked={payload[row?.name]}
                      onChange={(e) => handleChecked(e, row?.secondName)}
                    />
                    <label htmlFor={row?.name} className="m-0">
                      {row?.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>


            <div className="col-xl-2 col-md-3 col-sm-4 col-12 mt-2">
              <LabeledInput
                label={t("Req.Remarks")}
                value={patientDetails?.RequisitionDetail?.remarks}
                className={"w-100"}
              />
            </div>

            <TextAreaInput
              lable={t("Remarks")}
              className="w-100 required-fields"
              id="Remarks"
              rows={2}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="Remarks"
              value={payload?.Remarks ? payload?.Remarks : ""}
              onChange={handleChange}
            />

            {data?.MRDRequisitionID && isIssue===0 && (FileName == "File Issue") &&
              <div className="col-1 mt-2">
                <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button" type="button" onClick={handleFileIssueSave} >
                  {t("Save")}
                </button>
              </div>
            }
            {(FileName == "File Return")? isIssue===0 ?<></>:
              <div className="col-1 mt-2">
                <button className=" btn-primary btn-sm px-5 ml-1 custom_save_button" type="button" onClick={handleFileIssueSave} >
                  {t("Save")}
                </button>
              </div>:<></>
            }


          </div>
        </div>
      </div>
    </>
  );
};

export default FileIssueReturn;
