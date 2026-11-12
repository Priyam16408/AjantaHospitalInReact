import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SaveButton from "@components/UI/SaveButton";
import CancelButton from "../../../components/UI/CancelButton";
import { ApprovalGRNAppovalCancel } from "../../../networkServices/purchaseDepartment";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  ChangeTransactionalPanel,
  CheckPanelWiseRate,
  GetBindDoctorforChangePatient,
  getBindPanelListforchangedetails,
  OPDChangeTransactionalDoctor,
  OPDCheckDoctorWiseRate,
  OPDUpdateBillDetails,
} from "../../../networkServices/opdserviceAPI";
import moment from "moment";
import LabeledInput from "../../../components/formComponent/LabeledInput";

export default function ChangeDetails({
  handleClose,
  inputData,
  handleSearch,
  setTbodyRequestDetails,
  changeDoctor
}) {
  const [t] = useTranslation();
  const [data, setData] = useState(inputData);
  console.log("data", data);
  const [values, setValues] = useState({
    doctor: {},
    panel: {},
  });
  console.log("values", values)
  const [panelRate, setPanelRate] = useState({
    "OldRate": "",
    "NewRate": "",
    "IsPanelRate": "",
    "IsDoctorRate": "",
    "text": "",
    "ItemID": ""
  }
  )

  console.log("inputDatainputData", inputData);
  const [dropDownState, setDropDownState] = useState({
    GetBindAllDoctor: [],
    getBindAllPanel: [],
  });

  const checkPanelRate = async (panelID, ledgerNo) => {
    
    try {
      const response = await CheckPanelWiseRate(panelID, ledgerNo);
      if (response?.success) {
        const isDisable = response?.data[0]?.IsPanelRate == 1 ? false : true;
        setPanelRate({
          ...response?.data[0],
          IsPanelRate: isDisable,

        });

      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  }
  const getDoctorWiseRate = async (DoctorID, ledgerNo) => {

    try {
      const response = await OPDCheckDoctorWiseRate(DoctorID, ledgerNo);
      if (response?.success) {
        const isDisable = response?.data[0]?.IsDoctorRate == 1 ? false : true;
        setPanelRate({
          ...response?.data[0],
          IsDoctorRate: isDisable,

        });

      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  }

  const HandleSave = async () => {
    //  if(!values?.doctor?.DoctorID){
    //   notify("Please Change Doctor","warn")
    //   return
    // }
    try {
      let payload =
      {
        "panelID": String(values?.panel?.PanelID),
        "parentPanel": String(data?.ParentID),
        "panelCorporate": String(data?.CorporatePanelID),
        "policyNO": String(data?.PolicyNo),

        "policyCardNO": String(data?.CardNo),

        "cardHolderName": String(data?.CardHolderName),
        "expireDate": String(data?.ExpiryDate),

        "cardHolder": String(data?.CardHolder),

        "panelApprovalAmount": String(data?.PanelApprovedAmt),
        "panelApprovalRemark": String(data?.PanelAppRemarks),
        "ledgerTransactionNo": String(data?.LedgertransactionNo),
        "transactionID": String(data?.TransactionID),
      }



      // {
      //   billNo: String(data?.BillNo),
      //   transactionID: String(data?.TransactionID),
      //   billlDate: moment(new Date()).format("YYYY-MM-DD"),
      //   oldBilllDate: moment(data?.BillDate).format("YYYY-MM-DD"),
      //   panelID: Number(
      //     values?.panel?.PanelID ? values?.panel?.PanelID : values?.panel
      //   ),
      //   doctorID: Number(
      //     values?.doctor?.DoctorID ? values?.doctor?.DoctorID : values?.doctor
      //   ),
      //   oldPanelID: Number(data?.PanelID),
      // };
      console.log("payload", payload);
      let apiResp = await ChangeTransactionalPanel(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        handleClose();
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
    }
  };
  const HandleSaveDoctor = async () => {
    if (!values?.doctor?.DoctorID) {
      notify("Please Change Doctor", "warn")
      return
    }
    try {
      let payload =
      {
        "newDoctorID": String(values?.doctor?.DoctorID),
        "ledgetTnxNo": String(data?.LedgertransactionNo),
        "transactionID": String(data?.TransactionID),
        itemID:String(panelRate?.ItemID?.split("#")[0] || ""),

      }



      console.log("payload", payload);
      let apiResp = await OPDChangeTransactionalDoctor(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        handleClose();
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
    }
  };

  const getBindDoctor = async () => {
    try {
      const response = await GetBindDoctorforChangePatient();
      setDropDownState((val) => ({
        ...val,
        GetBindAllDoctor: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "DoctorID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const getBindPanel = async () => {
   
    try {
      const response = await getBindPanelListforchangedetails();
      console.log("response", response);
      // const response = await bindPanelByPatientID(data?.PatientID);
      setDropDownState((val) => ({
        ...val,
        getBindAllPanel: handleReactSelectDropDownOptions(
          response?.data,
          "Company_Name",
          "PanelID"
        ),
      }));
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  const handleReactChange = (name, e, key) => {
   
    if (name === "panel") {
      checkPanelRate(e?.PanelID, data?.LedgertransactionNo);
    }
    else if (name === "doctor") {
      getDoctorWiseRate(e?.DoctorID, data?.LedgertransactionNo);
    }
    setValues((val) => ({ ...val, [name]: e }));
  };

  useEffect(() => {

    if (changeDoctor) {
      getBindDoctor();
    }
    else {
      getBindPanel();
    }
    setValues((preV) => ({
      ...preV,
      doctor: data?.DoctorID,
      panel: data?.PanelID,
    }));
  }, [data]);
  return (
    <div
    // className="card patient_registration border mt-2"
    >
      {/* <Heading title={t("Change Details")} isBreadcrumb={false} /> */}

      <div className="container">
        <div className="row p-2">

          <div className="col-md-6 col-12 mb-3">
            <LabeledInput label={t("Patient Name")} value={data?.PatientName} />
          </div>
          <div className="col-md-6 col-12 mb-3">
            <LabeledInput label={t("Consultant")} value={data?.DoctorName} />
          </div>
          <div className="col-md-6 col-12 mb-3">
            <LabeledInput label={t("UHID")} value={data?.PatientID} />
          </div>
          <div className="col-md-6 col-12 mb-3">
            <LabeledInput label={t("Bill No.")} value={data?.PatientID} />
          </div>

          {/* <div className="col-md-6 col-12 mb-3"> */}
            {changeDoctor ? (
              <div className="col-md-6 col-12 mb-3">
                <ReactSelect
                  placeholderName={t("Change Doctor")}
                  id="doctor"
                  name="doctor"
                  searchable
                  removeIsClearable
                  dynamicOptions={dropDownState?.GetBindAllDoctor}
                  handleChange={(name, e) => handleReactChange(name, e)}
                  value={values?.doctor || null}
                />
              </div>
            ) : (
              <div className="col-md-6 col-12 mb-3">
                <ReactSelect
                  placeholderName={t("Change Panel")}
                  id="panel"
                  name="panel"
                  searchable
                  removeIsClearable
                  dynamicOptions={dropDownState?.getBindAllPanel.filter((val)=>val?.IsCash===data?.IsCash)}
                  handleChange={(name, e) => handleReactChange(name, e)}
                  value={`${values?.panel}`}
                />
              </div>
            )}
            
            {panelRate?.IsPanelRate && (< >
             
              <div className="col-md-6 col-12 mb-3">
              
                <LabeledInput label={t("Bill No.")} value={data?.PatientID} />
              </div>
               <div className="col-md-6 col-12 mb-3">
              
                <LabeledInput label={t("Item Name")} value={panelRate?.itemname} />
              </div>  
              <div className="col-md-6 col-12 mb-3">
                <LabeledInput label={t("Old Panel  Rate.")} value={panelRate?.OldRate} />
              </div>
              <div className="col-md-6 col-12 mb-3">
                <LabeledInput label={t("New Panel Rate")} value={panelRate?.NewRate} />
              </div>
              <p className="blink-red" >The selected Panel Rate is different, so you can't change the Panel.</p>
            </>
            )}
            {panelRate?.IsDoctorRate && (<>

              <p className="blink-red">The selected Doctor is different, so you can't change the Doctor.</p>
              <div className="col-md-6 col-12  mb-3">
                <LabeledInput label={t("Old Rate")} value={panelRate?.OldRate} />
              </div>
              
              <div className="col-md-6 col-12  mb-3">
                <LabeledInput label={t("Old Item")} value={panelRate?.Itemname} />
              </div>

              <div className="col-md-6 col-12  mb-3">
                <LabeledInput label={t("New Rate")} value={panelRate?.NewRate} />
              </div>
              <div className="col-md-6 col-12  mb-3">
                <LabeledInput label={t("New Item")} value={panelRate?.ItemID?.split("#")[1]} />
              </div>
           
            </>
            )}
          {/* </div> */}

        </div>
      </div>
      <div className="ftr_btn">
        {
          changeDoctor ? <SaveButton btnName={"Save"} onClick={HandleSaveDoctor} disabled={panelRate?.IsDoctorRate} />
            //  : <SaveButton btnName={"Save"} onClick={HandleSave} disabled={false} />
            : <SaveButton btnName={"Save"} onClick={HandleSave} disabled={panelRate?.IsPanelRate} />

        }
        <CancelButton cancleBtnName={"Cancel"} onClick={() => handleClose()} />
      </div>
    </div>
  );
}
