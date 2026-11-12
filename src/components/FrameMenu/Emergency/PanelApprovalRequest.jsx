import React, { useEffect, useMemo, useState } from "react";
import Heading from "../../UI/Heading";
import DatePicker from "../../formComponent/DatePicker";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import {
  AMOUNT_REGX,
  AmountApprovalType,
  CalculateOption,
  PanelApprovalType,
  RateOnOptions,
  RateType,
} from "../../../utils/constant";
import SearchByName from "../../commonComponents/SearchByName";
import SurgeryDepartmentDetailsTable from "../../UI/customTable/billings/SurgeryDepartmentDetailsTable";
import Input from "../../formComponent/Input";
import TextAreaInput from "../../formComponent/TextAreaInput";
import LabeledInput from "../../formComponent/LabeledInput";
import PatientBillingDetails from "../../commonComponents/PatientBillingDetails";
import {
  BindApprovalData,
  BindPanelDetail,
  BindPanels,
  GetBillDetails,
  GetPanelApprovalDetails,
  PanelApprovalReject,
  SendPanelApprovalEmail,
  UpdateBilling,
} from "../../../networkServices/BillingsApi";
import { bindPanelByPatientID } from "../../../networkServices/opdserviceAPI";
import {
  handleReactSelectDropDownOptions,
  inputBoxValidation,
  notify,
  SendPanelApprovalBillingPayload,
} from "../../../utils/utils";
import SeeMore from "../../UI/SeeMore";
import OverLay from "../../modalComponent/OverLay";
import SeeMoreList from "../../commonComponents/SeeMoreList";
import Modal from "../../modalComponent/Modal";
import Tables from "../../UI/customTable";
import { ReprintSVG } from "../../../components/SvgIcons/index";
import BrowseButton from "../../formComponent/BrowseButton";
import PanelApprovalRejectModal from "../../modalComponent/Utils/PanelApprovalRejectModal";
import moment from "moment";

const PanelApprovalRequest = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [BillDetails, setBillDetails] = useState([]);
  const [panelList, setPanelList] = useState([]);
  const [panelDetail, setPanelDetail] = useState({});
  const [visible, setVisible] = useState(false);
  const [handleModelData, setHandleModelData] = useState({});
  const [seeMore, setSeeMore] = useState([
    {
      ID: 2,
      MenuName: "Add/Remove Panels List",
      MenuURL: "Add/RemovePanelsList",
    },
  ]);
  const [renderComponent, setRenderComponent] = useState({
    name: "",
    component: null,
  });

  const [t] = useTranslation();
  const tHead = [
    t("CompanyName"),
    t("PolicyNumber"),
    t("ApprovalAmount"),
    t("ApprovalRemark"),
    t("ApprovalSendOn"),
    t("CreateBy"),
    { name: t("Print"), width: "1%" },
  ];
  const tHeadApproval = [
    t("IPDNo"),
    t("PanelName"),
    t("ApprovalAmount"),
    t("ApprovalDate"),
    t("ClaimNo"),
    t("ApprovalType"),
    t("Remarks"),
    t("AmtAppType"),
    t("AppExpiryDate"),
    t("CreatedBy"),
    t("View"),
    t("Edit"),
    t("Reject"),
    // { name: t("Print"), width: "1%" },
  ];
  const GetBindBillDetails = async () => {
    try {
      const datas = await GetBillDetails(data?.transactionID);
      setBillDetails(datas?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetbindPanelByPatientID = async () => {
    try {
      let apiResp = await bindPanelByPatientID(data?.patientID);
      if (apiResp?.success) {
        setPanelList(
          handleReactSelectDropDownOptions(
            apiResp?.data,
            "PanelName",
            "PanelID"
          )
        );
      } else {
        setPanelList([]);
      }
    } catch (error) {}
  };

  const handleDataInDetailView = useMemo(() => {
    if (Object.keys(panelDetail ? panelDetail : {})?.length > 0) {
      const data = [
        {
          label: t("ParentPanel"),
          value: panelDetail?.ParentPanel,
        },
        {
          label: t("Corporate"),
          value: panelDetail?.CorporareName,
        },
        // {
        //   label: t("IgnorePolicy"),
        //   value:  panelDetail?.ParentPanel,
        // },
        // {
        //   label: t("IgnorePolicyReason"),
        //   value:  panelDetail?.ParentPanel,
        // },
        {
          label: t("PolicyNo"),
          value: panelDetail?.PolicyNo,
        },
        {
          label: t("PolicyCardNo"),
          value: panelDetail?.PolicyCardNo,
        },
        {
          label: t("NameOnCard"),
          value: panelDetail?.PanelCardName,
        },
        {
          label: t("ExpireDate"),
          value: panelDetail?.PolicyExpiry,
        },
        {
          label: t("CardHolder"),
          value: panelDetail?.PolciyCardHolderRelation,
        },
        {
          label: t("Amount"),
          value: panelDetail?.ApprovalAmount,
        },
        // {
        //   label: t("Remark"),
        //   value: panelDetail?.ApprovalRemarks,
        // },
      ];

      return data;
    } else {
      return [];
    }
  }, [panelDetail]);

  let PatientRegistrationArg = {
    PatientID: data?.patientID,
    setVisible: setVisible,
    bindDetailAPI: () => {},
    handleBindPanelByPatientID: GetbindPanelByPatientID,
  };

  const [tBody, setTBody] = useState([]);

  const GetPanelApprovalDetailsAPI = async () => {
    let apiResp = await GetPanelApprovalDetails({
      TID: data?.transactionID,
      PID: data?.patientID,
    });
    if (apiResp?.success) {
      setTBody(apiResp?.data);
    } else {
      notify(apiResp?.message, "error");
      setTBody([]);
    }
    if (apiResp?.status !== 200) {
      notify(apiResp?.data?.message, "error");
    }
  };

  useEffect(() => {
    let list = SeeMoreList(
      [
        {
          ID: 2,
          MenuName: "Add/Remove Panels List",
          MenuURL: "Add/RemovePanelsList",
        },
      ],
      PatientRegistrationArg
    );
    setSeeMore(list);
    GetPanelApprovalDetailsAPI();
    GetBindBillDetails();
    GetbindPanelByPatientID();
    GetPanelApprovalSearchAPI();
  }, []);
  const ModalComponent = (name, component) => {
    setVisible(true);
    setRenderComponent({
      name: name,
      component: component,
    });
  };

  const handleChange = (e) => {
    setPanelDetail((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const saveDetail = async (status) => {
    panelDetail.attachCostEstimation = status;
    let payload = SendPanelApprovalBillingPayload(data, panelDetail);
    let apiResp = await SendPanelApprovalEmail(payload);

    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      GetPanelApprovalDetailsAPI();
      setHandleModelData((val) => ({ ...val, isOpen: false }));
    } else {
      notify(apiResp?.message, "error");
    }
    if (apiResp?.status !== 200) {
      notify(apiResp?.data?.message, "error");
    }
  };

  const savePanelDetail = async () => {
    if (!panelDetail?.approvalAmount) {
      notify(t("approvalAmountRequired"), "error");
      return false;
    }
    setHandleModelData({
      label: t("CostEstimation"),
      width: "20vw",
      isOpen: true,
      Component: (
        <h3 className="text-center">
          {" "}
          <strong>
            {" "}
            <span className="text-danger">
              {" "}
              {t("areYouSure")}{" "}
            </span>{" "}
            {t("ToAttachCostEstimation")}{" "}
          </strong>
        </h3>
      ),
      footer: (
        <>
          {" "}
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={() => {
              saveDetail(true);
            }}
          >
            {" "}
            {t("YesContinue")}{" "}
          </button>{" "}
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={() => {
              saveDetail(false);
            }}
          >
            {" "}
            {t("Cancel")}{" "}
          </button>{" "}
        </>
      ),
    });
  };

  // Approval Screen JS

  const [rejectVisible, setRejectVisible] = useState(false);
  const currentDate = moment();
  const panelApproveDate = moment(data.PanelApprovalDate);
  const diff = currentDate.diff(panelApproveDate, "hours");
  const shouldShowImage = diff > 24 || data.IsActive === 0;

  const [activeClass, setActiveClass] = useState("panel-request");
  const [panelApprovalDetails, setPanelApprovalDetails] = useState({
    PanelApprovalAmount: "",
    ClaimNo: "",
    Remarks: "",
  });
  const [panelApprovalList, setpanelApprovalList] = useState([]);
  const [panelApproalTbody, setPanelApprovalTbody] = useState([]);
  const [panelApproveData, setPanelApproveData] = useState([]);

  const GetBindApprovalData = async () => {
    let apiResp = await BindApprovalData(data?.transactionID);
    if (apiResp?.success) {
      setPanelApproveData(apiResp?.data);
    } else {
      // notify(apiResp?.message, "error");
      setPanelApproveData([]);
    }
  };

  const GetPanelApprovalSearchAPI = async () => {
    let apiResp = await BindPanelDetail(data?.transactionID);
    if (apiResp?.success) {
      setPanelApprovalTbody(apiResp?.data);
    } else {
      notify(apiResp?.message, "error");
      setPanelApprovalTbody([]);
    }
  };

  const bindPanelApprovalDetails = async () => {
    try {
      Promise.all([
        BindPanelDetail(data?.transactionID),
        BindPanels(data?.transactionID),
      ]).then(([BindPanelDetail, BindPanels]) => {
        let panelDetail = BindPanelDetail?.data;
        panelDetail.Remarks = "";
        panelDetail.PanelApproval = { label: "", value: "92" };
        panelDetail.ClaimNo = "";
        panelDetail.PanelApprovalType = {
          label: "",
          value: "PanelApprovalType",
        };
        panelDetail.AmountApprovalType = { label: "", value: "Open" };

        setPanelApprovalDetails(panelDetail);
        setpanelApprovalList(
          handleReactSelectDropDownOptions(
            BindPanels?.data,
            "Company_Name",
            "PanelID"
          )
        );
      });
    } catch (error) {}
  };

  const handleClickPanelChange = (classes) => {
    setActiveClass(classes);
    if (classes === "panel-approval") {
      bindPanelApprovalDetails();
    }
  };
  const HandlePanelPage = () => {
    return (
      <>
        <span
          className={`pointer-cursor ${activeClass === "panel-request" ? "active-panel" : ""}`}
          onClick={() => {
            handleClickPanelChange("panel-request");
          }}
        >
          {" "}
          {t("PanelRequest")}{" "}
        </span>
        <span
          className={`pointer-cursor ml-2 ${activeClass === "panel-approval" ? "active-panel" : ""}`}
          onClick={() => {
            handleClickPanelChange("panel-approval");
          }}
        >
          {" "}
          {t("PanelApproval")}{" "}
        </span>
      </>
    );
  };
  const handleTableDetails = (ele, i) => {
    setPanelApprovalDetails({
      ...panelApprovalDetails,
      BillAmount: panelApproalTbody[i]?.amountBilled,
      PanelApproval: { label: "", value: panelApproalTbody[i]?.PanelID },
      PatientAmount: "",
      PanelApprovalAmount: panelApproalTbody[i]?.PanelApprovedAmt,
      ApprovalDate: panelApproalTbody[i]?.PanelApprovalDate,
      ClaimNo: panelApproalTbody[i]?.ClaimNo,
      FinalApprovalAmount: "",
      PanelApprovalType: {
        label: "",
        value: panelApproalTbody[i]?.PanelApprovalTypeID,
      },
      Remarks: panelApproalTbody[i]?.PanelAppRemarks,
      AmountApprovalType: {
        label: "",
        value: panelApproalTbody[i]?.AmountApprovalTypeID,
      },
      panelid: panelApproalTbody[i]?.PanelID,
      approvalID: panelApproalTbody[i]?.ID,
    });
  };
  const handleImageChange = (e) => {
    const file = e?.target?.files[0];

    if (file) {
      // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 5MB. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader?.result.split(",")[1];
        const fileExtension = file?.name.split(".").pop();
        setPanelApprovalDetails({
          ...panelApprovalDetails,
          SelectFile: file,
          Document_Base64: base64String,
          FileExtension: fileExtension,
        });
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };
  const handleReactSelect = (name, value) => {
    setPanelApprovalDetails((val) => ({ ...val, [name]: value }));
  };

  const handleChangeApproval = (e) => {
    if (
      e.target.name === "PanelApprovalAmount" &&
      Number(e.target.value) <= Number(panelApproveData?.amountBilled)
    ) {
      setPanelApprovalDetails((val) => ({
        ...val,
        [e.target.name]: e.target.value,
      }));
    } else if (e.target.name !== "PanelApprovalAmount") {
      setPanelApprovalDetails((val) => ({
        ...val,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleUpdateBilling = async () => {
    const dateOfApproval = "2024-09-30T14:04:05.569Z";
    const currentDate = new Date(dateOfApproval);
    const formattedDate = currentDate.toISOString().split("T")[0];

    const approvalDate = panelApprovalDetails?.ApprovalDate;
    const startDate = approvalDate
      ? new Date(approvalDate).toISOString().split("T")[0]
      : "";

    const payload = {
      transactionID: data?.transactionID,
      dateOfApproval: formattedDate,
      panelBillAmt: panelApprovalDetails?.PanelApprovalAmount,
      typeOfApproval: panelApprovalDetails?.PanelApprovalType.value,
      remarks: panelApprovalDetails?.Remarks,
      appWay: panelApprovalDetails?.AmountApprovalType.value,
      startDate: startDate,
      updateBillingText: "Update Billing",
      billAmount: panelApprovalDetails?.BillAmount,
      claimNo: panelApprovalDetails?.ClaimNo,
      panelId: panelApprovalDetails?.panelid,
      cashBillAmount: panelApproveData?.dt[0]?.PatientCashAmt,
      prePanelApprovedAmt: panelApproveData?.dt[0]?.PanelApprovedAmt,
      approvalID: panelApprovalDetails?.approvalID,
      panelDocsBase64: panelApprovalDetails?.Document_Base64,
    };

    try {
      let apiResp = await UpdateBilling(payload);
      if (apiResp?.success) {
        notify(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
        notify([]);
      }

      if (apiResp?.status !== 200) {
        notify(apiResp?.data?.message, "error");
      }
    } catch (error) {
      notify("Error occurred while processing request", "error");
    }
  };

  const handleIndicator = (state) => {
    return (
      <div className="text-danger">
        (max 300 Character) <span className="text-dark">Remaining : </span>{" "}
        <span className="text-success">{Number(300 - state?.length)}</span>
      </div>
    );
  };

  useEffect(() => {
    GetBindApprovalData();
  }, []);
  return (
    <>
      <PatientBillingDetails
        BillDetails={BillDetails}
        heading={t("PatientBillDetails")}
      />
      <div className="card mt-2">
        <Heading
          title={
            <div className="mt-1">
              <HandlePanelPage />
            </div>
          }
        >
          {" "}
        </Heading>

        {activeClass === "panel-request" ? (
          <>
            <div
              className={`row px-1 mt-2 mb-2 position-relative ${panelDetail?.value ? "pb-4" : ""}`}
            >
              <div className="col-xl-4 col-md-4 col-sm-4 col-12">
                <div className="row">
                  <ReactSelect
                    placeholderName={t("Panel")}
                    name="Panel"
                    inputId="Panel"
                    dynamicOptions={panelList}
                    value={panelDetail?.value}
                    handleChange={(name, value) => {
                      setPanelDetail(value);
                    }}
                    searchable={true}
                    respclass="col-11"
                    requiredClassName="required-fields"
                  />

                  <div className="col-1">
                    {seeMore.length > 0 && (
                      <SeeMore
                        Header={
                          <div
                            style={{
                              position: "relative",
                              right: "1px",
                              top: "2px",
                            }}
                          >
                            <div className="box-inner">
                              <button
                                className="btn btn-sm btn-primary"
                                type="button"
                                onClick={() =>
                                  ModalComponent(
                                    seeMore[0]?.name,
                                    seeMore[0]?.component
                                  )
                                }
                              >
                                <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                              </button>
                            </div>
                          </div>
                        }
                      ></SeeMore>
                    )}
                  </div>
                </div>
              </div>

              {handleDataInDetailView?.length > 0 ? (
                <>
                  {handleDataInDetailView?.map((data, index) => (
                    <>
                      <div
                        className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
                        key={index}
                        style={{
                          display: "grid",
                          alignItems: "center",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <LabeledInput
                            label={data?.label}
                            value={data?.value}
                            className={"w-100"}
                            style={{ textAligns: "right" }}
                          />
                        </div>
                      </div>
                    </>
                  ))}
                  <Input
                    type="text"
                    className="form-control "
                    id="ApprovalRemarks"
                    name="ApprovalRemarks"
                    value={
                      panelDetail?.ApprovalRemarks
                        ? panelDetail?.ApprovalRemarks
                        : ""
                    }
                    onChange={handleChange}
                    lable={t("Remark")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 "
                    showTooltipCount={true}
                    // onKeyDown={handleAddDocumentIDs}
                  />
                  <Input
                    type="text"
                    className="form-control required-fields"
                    id="approvalAmount"
                    name="approvalAmount"
                    value={
                      panelDetail?.approvalAmount
                        ? panelDetail?.approvalAmount
                        : ""
                    }
                    onChange={(e) => {
                      inputBoxValidation(AMOUNT_REGX(8), e, handleChange);
                    }}
                    lable={t("Amount")}
                    placeholder=" "
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 "
                    showTooltipCount={true}
                    // onKeyDown={handleAddDocumentIDs}
                  />
                  <div
                    className="position-absolute"
                    style={{ right: "10px", bottom: "0px" }}
                  >
                    <button
                      className="btn btn-sm btn-primary "
                      type="button"
                      onClick={savePanelDetail}
                    >
                      {t("Save")}
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            <div className="card mt-2">
              <Heading title={t("PanelRequestDetails")}>
                {" "}
              </Heading>

              <Tables
                thead={tHead}
                tbody={tBody?.map((item, index) => ({
                  IPDNo: item?.IPDNo,
                  PanelName: item?.PanelName,
                  ApprovalAmount: item?.ApprovalAmount,
                  ApprovalRemark: item?.ApprovalRemark,
                  Approval_Send_On: item?.Approval_Send_On,
                  Create_By: item?.Create_By ? item?.Create_By : "",
                  print: (
                    <div className="">
                      <ReprintSVG />
                    </div>
                  ),
                }))}
                style={{ maxHeight: "25vh" }}
              />
            </div>
          </>
        ) : (
          <>
            {rejectVisible && (
              <Modal
                modalWidth={"500px"}
                visible={rejectVisible}
                setVisible={setRejectVisible}
                Header="Reject Panel Approval"
                footer={
                  <>
                    <div className="col-12 d-flex justify-content-end">
                      {/* <button
                        className="btn btn-sm btn-danger"
                        // onClick={handlePanelApprovalReject}
                      >
                        Reject
                      </button> */}
                      {/* <button
                        className="btn btn-sm btn-primary mx-2"
                        style={{ backgroundColor: "red", border: 0 }}
                      >
                        Cancel
                      </button> */}
                    </div>
                  </>
                }
              >
                <PanelApprovalRejectModal
                  rejectVisible={rejectVisible}
                  setRejectVisible={setRejectVisible}
                  tableData={rejectVisible?.showData}
                  data={data}
                />
              </Modal>
            )}

            <div className="row px-1 mt-2 mb-2 position-relative pb-4">
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <div className="d-flex align-items-center">
                  <LabeledInput
                    label={t("BillAmount")}
                    value={panelApproveData?.amountBilled}
                    className={"w-100"}
                    style={{ textAligns: "right" }}
                  />
                </div>
              </div>

              <ReactSelect
                placeholderName={t("Panel")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
                id={"PanelApproval"}
                name={"PanelApproval"}
                PatientCashAmt
                dynamicOptions={panelApprovalList}
                value={panelApprovalDetails?.PanelApproval?.value}
                // handleChange={(name, value) => { setPanelApprovalDetails((val)=>({...val,[name]:value})) }}
                handleChange={handleReactSelect}
              />

              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <div className="d-flex align-items-center">
                  <LabeledInput
                    label={t("PatientAmount")}
                    value={
                      Number(panelApproveData?.amountBilled) -
                      (panelApprovalDetails?.PanelApprovalAmount
                        ? Number(panelApprovalDetails?.PanelApprovalAmount)
                        : 0)
                    }
                    className={"w-100"}
                    style={{ textAligns: "right" }}
                  />
                </div>
              </div>

              <Input
                type="text"
                className="form-control required-fields"
                id="PanelApprovalAmount"
                name="PanelApprovalAmount"
                value={
                  panelApprovalDetails?.PanelApprovalAmount
                    ? panelApprovalDetails?.PanelApprovalAmount
                    : ""
                }
                onChange={(e) => {
                  inputBoxValidation(AMOUNT_REGX(8), e, handleChangeApproval);
                }}
                lable={t("PanelApprovalAmount")}
                placeholder=" "
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 "
                showTooltipCount={true}
              />
              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 "
                id="ApprovalDate"
                name="ApprovalDate"
                value={
                  panelApprovalDetails?.ApprovalDate
                    ? new Date(panelApprovalDetails?.ApprovalDate)
                    : new Date()
                }
                handleChange={handleChangeApproval}
                lable={t("ApprovalDate")}
                placeholder={VITE_DATE_FORMAT}
              />

              <Input
                type="text"
                className="form-control "
                id="ClaimNo"
                name="ClaimNo"
                value={
                  panelApprovalDetails.ClaimNo
                    ? panelApprovalDetails.ClaimNo
                    : ""
                }
                onChange={(e) => {
                  inputBoxValidation(AMOUNT_REGX(8), e, handleChangeApproval);
                }}
                lable={t("ClaimNo")}
                placeholder=" "
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 "
                showTooltipCount={true}
              />

              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <div className="d-flex align-items-center">
                  <LabeledInput
                    label={t("FinalApprovalAmount")}
                    value={
                      panelApproveData?.dt[0]?.PanelApprovedAmt
                        ? panelApproveData?.dt[0]?.PanelApprovedAmt
                        : ""
                    }
                    className={"w-100"}
                    style={{ textAligns: "right" }}
                  />
                </div>
              </div>

              <ReactSelect
                placeholderName={t("PanelApprovalType")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
                id={"PanelApprovalType"}
                name={"PanelApprovalType"}
                value={panelApprovalDetails?.PanelApprovalType?.value}
                handleChange={handleReactSelect}
                dynamicOptions={PanelApprovalType}
              />

              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-0">
                <TextAreaInput
                  lable={t("Remarks")}
                  className="w-100 required-fields"
                  id="Remarks"
                  rows={2}
                  name="Remarks"
                  value={
                    panelApprovalDetails?.Remarks
                      ? panelApprovalDetails?.Remarks
                      : ""
                  }
                  onChange={handleChangeApproval}
                  maxLength={300}
                />
               <div style={{position:"absolute" ,top:"35px"}}> {handleIndicator(panelApprovalDetails?.Remarks)}</div>
              </div>

              <ReactSelect
                placeholderName={t("AmountApprovalType")}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
                id={"AmountApprovalType"}
                name={"AmountApprovalType"}
                value={panelApprovalDetails?.AmountApprovalType?.value}
                handleChange={handleReactSelect}
                dynamicOptions={AmountApprovalType}
              />
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <div className="d-flex align-items-center">
                  <BrowseButton
                    label={t("BrowseApprovalFile")}
                    handleImageChange={handleImageChange}
                  />
                </div>
              </div>
              <div
                className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
                style={{ right: "10px", bottom: "0px" }}
              >
                <button
                  className="btn btn-sm btn-primary "
                  type="button"
                  onClick={handleUpdateBilling}
                >
                  {t("UpdateBilling")}
                </button>
              </div>
            </div>

            <div className="card mt-2">
              <Heading
                title={t("PanelRequestDetails")}
              ></Heading>

              <Tables
                thead={tHeadApproval}
                tbody={panelApproalTbody?.map((item, index) => ({
                  IPDNo: item?.TransactionID,
                  PanelName: item?.Company_Name,
                  ApprovalAmount: item?.PanelApprovedAmt,
                  ApprovalDate: item?.PanelApprovalDate,
                  ClaimNo: item?.ClaimNo,
                  ApprovalType: item?.PanelApprovalType,
                  Remarks: item?.PanelAppRemarks,
                  AmtAppType: item?.AmountApprovalType,
                  AppExpiryDate: item?.AppExpiryDate,
                  CreatedBy: item?.UserID,
                  View: <i className="fa fa-eye"></i>,
                  Edit: (
                    <i
                      className="fa fa-edit"
                      onClick={() => handleTableDetails(item, index)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  ),
                  Reject: !shouldShowImage && (
                    <i
                      className="fa fa-trash"
                      onClick={() => {
                        setRejectVisible({
                          rejectVisible: true,
                          showData: item,
                        });
                      }}
                      style={{ marginLeft: "10px", color: "red" }}
                    ></i>
                  ),
                  // print: (
                  //   <div className="">
                  //     <ReprintSVG />
                  //   </div>
                  // ),
                }))}
                style={{ maxHeight: "25vh" }}
              />
            </div>
          </>
        )}
      </div>

      <OverLay
        visible={visible}
        setVisible={setVisible}
        Header={renderComponent?.name}
      >
        {renderComponent?.component}
      </OverLay>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={() => {
            setHandleModelData((val) => ({
              ...val,
              isOpen: !handleModelData?.isOpen,
            }));
          }}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          // modalData={modalData}
          // setModalData={setModalData}
          footer={handleModelData?.footer}
          // handleAPI={handleModelData?.handleInsertAPI}
          // CancelbuttonName={handleModelData?.CancelbuttonName}
        >
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  );
};

export default PanelApprovalRequest;
