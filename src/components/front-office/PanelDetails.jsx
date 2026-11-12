import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import i18n from "@app/utils/i18n";
import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import Tables from "../UI/customTable";
import AttachDoumentModal from "../modalComponent/Utils/AttachDoumentModal";
import {
  filterByType,
  filterByTypes,
  inputBoxValidation,
  notify,
} from "../../utils/utils";
import DatePicker from "../formComponent/DatePicker";
import moment from "moment";
import { AMOUNT_REGX } from "../../utils/constant";

const PanelDetails = ({
  CentreWisePanelControlCacheList,
  handleChangePanelDetail,
  values,
  setValues,
  handleReactSelect,
  PanelPatientDetailList,
  setPanelBodyData,
  panelBodyData,
  setPanelDocumentData,
  panelDocumentData,
}) => {
  console.log(
    "panelDocumentDatapanelDocumentDatapanelDocumentDatapanelDocumentData",
    panelDocumentData
  );
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [isDesabled, setIsDesabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [isuploadOpen, setIsuploadOpen] = useState(false);
  const [isEditable, setIsEditable] = useState({});
  const inputRef = useRef(null);

  const headData = [
    t("PanelGroup"),
    t("Panel"),
    t("ParentPanel"),
    t("Corporate"),
    t("PolicyNo"),
    t("PolicyCardNo"),
    t("NameOnCard"),
    t("ExpireDate"),
    t("CardHolder"),
    t("ApprovalAmount"),
    t("ApprovalRemark"),
    t("Upload Document"),
    t("Actions"),
  ];

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!values?.PanelGroup) {
      errors.PanelGroup = "Panel Group Is Required";
      errors.id[errors.id?.length] = "PanelGroupFocus";
    }
    if (!values?.ParentPanel) {
      errors.ParentPanel = "Parent Panel Is Required";
      errors.id[errors.id?.length] = "ParentPanelFocus";
    }
    if (!values?.PanelName) {
      errors.PanelName = "Panel Is Required";
      errors.id[errors.id?.length] = "PanelFocus";
    }
    // if (!values?.PolicyNo) {
    //   errors.PolicyNo = "Policy No Is Required";
    //   errors.id[errors.id?.length] = "PolicyNo";
    // }
    // if (!values?.PolicyCardNo) {
    //   errors.PolicyCardNo = "Policy Card No Is Required";
    //   errors.id[errors.id?.length] = "PolicyCardNo";
    // }
    // if (!values?.PanelCardName) {
    //   errors.PanelCardName = "Name On Card Is Required";
    //   errors.id[errors.id?.length] = "PanelCardName";
    // }
    // if (!values?.PolicyExpiry) {
    //   errors.PolicyExpiry = "Expire Date Is Required";
    //   errors.id[errors.id?.length] = "PolicyExpiry";
    // }
    // if (!values?.CardHolder) {
    //   errors.CardHolder = "Card Holder Is Required";
    //   errors.id[errors.id?.length] = "CardHolderFocus";
    // }
    // if (!values?.ApprovalAmount) {
    //   errors.ApprovalAmount = "Approval Amount Is Required";
    //   errors.id[errors.id?.length] = "ApprovalAmount";
    // }
    // if (!values?.ApprovalRemarks) {
    //   errors.ApprovalRemarks = "Approval Remark Is Required";
    //   errors.id[errors.id?.length] = "ApprovalRemarks";
    // }

    return errors;
  };

  useEffect(() => {
    if (errors?.id) {
      const inputElement = document.getElementById(errors?.id[0]);
      console.log("ASdasd", errors?.id[0]);
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [errors]);

  const handleSavePanelDetail = () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return false;
    }

    const isDuplicate = panelBodyData?.find(
      (item) => item?.PanelName?.value === values?.PanelName?.value
    );
    if (isDuplicate) {
      notify("Panel Name already exist", "error");
      return false;
    }
    setPanelBodyData((val) => [
      {
        PanelGroup: values?.PanelGroup,
        PanelName: values?.PanelName,
        ParentPanel: values?.ParentPanel,
        CorporareName: values?.CorporareName?.value
          ? values?.CorporareName
          : "",
        PolicyNo: values?.PolicyNo,
        PolicyCardNo: values?.PolicyCardNo,
        PanelCardName: values?.PanelCardName,
        PolicyExpiry: values?.PolicyExpiry
          ? moment(new Date(values?.PolicyExpiry)).format("DD-MM-YYYY")
          : "",
        CardHolder: values?.CardHolder,
        ApprovalAmount: values?.ApprovalAmount,
        ApprovalRemarks: values?.ApprovalRemarks,
      },
      ...val,
    ]);
    setPanelDocumentData((val) => [
      {
        panelDocumentViewList: [],
        panelID: values?.PanelName?.value,
      },
      ...val,
    ]);

    setValues((val) => ({
      ...val,
      PanelGroup: { label: "", value: "" },
      PanelName: { label: "", value: "" },
      ParentPanel: { label: "", value: "" },
      CorporareName: values?.CorporareName ? { label: "", value: "" } : "",
      PolicyNo: "",
      PolicyCardNo: "",
      PanelCardName: "",
      PolicyExpiry: "",
      CardHolder: "",
      ApprovalAmount: "",
      ApprovalRemarks: "",
    }));
  };

  const handleUpdatePanelDetail = () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return false;
    }

    let panelDetailTableData = panelBodyData?.map((obj, key) => {
      if (key === isEditable?.index) {
        obj["PanelGroup"] = values?.PanelGroup;
        obj["PanelName"] = values?.PanelName;
        obj["ParentPanel"] = values?.ParentPanel;
        obj["CorporareName"] = values?.CorporareName;
        obj["PolicyNo"] = values?.PolicyNo;
        obj["PolicyCardNo"] = values?.PolicyCardNo;
        obj["PanelCardName"] = values?.PanelCardName;
        obj["PolicyExpiry"] = values?.PolicyExpiry;
        obj["CardHolder"] = values?.CardHolder;
        obj["ApprovalAmount"] = values?.ApprovalAmount;
        obj["ApprovalRemarks"] = values?.ApprovalRemarks;
      }
      return obj;
    });

    setPanelBodyData(panelDetailTableData);

    setValues((val) => ({
      ...val,
      PanelGroup: {},
      PanelName: "",
      ParentPanel: "",
      CorporareName: "",
      PolicyNo: "",
      PolicyCardNo: "",
      PanelCardName: "",
      PolicyExpiry: "",
      CardHolder: "",
      ApprovalAmount: "",
      ApprovalRemarks: "",
    }));
    setIsEditable({ status: false, index: null });
  };

  // Dynamically generate THEAD using bodyData keys
  const THEAD = headData?.map((key) => {
    // Capitalize first letter and replace underscores with spaces
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
  });
  // const handleChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const data = [...panelBodyData];
  //   data[index][name] = (
  //     <input
  //       value={value}
  //       onChange={(e) => handleChange(e, index)}
  //       name="input"
  //     />
  //   );
  //   setPanelBodyData(data);
  // };

  const handleEditAction = (index) => {
    let editData = panelBodyData?.find((item, i) => i === index);
    Object.keys(editData).forEach((key) => {
      values[key] = editData[key];
    });
    let ParentPanel = {
      ...values?.ParentPanel,
      extraColomn: values?.ParentPanel?.value,
    };
    let PanelName = {
      ...values?.PanelName,
      extraColomn: values?.PanelName?.value,
    };
    values.ParentPanel = ParentPanel;
    values.PanelName = PanelName;
    setIsEditable({ status: true, index: index });
    setValues(values);
  };

  const handleDeleteAction = (index) => {
    let editData = panelBodyData?.filter((item, i) => i !== index);
    let documentData = panelDocumentData?.filter((item, i) => i !== index);
    setPanelBodyData(editData);
    setPanelDocumentData(documentData);
  };

  const handleChangeParentPanel = (name, value) => {
    setValues((val) => ({ ...val, [name]: value, PanelName: value }));
  };

  const [panelDocumentIndex, setPanelDocumentIndex] = useState(0);
  const handleOpenMode = (index, value) => {
    setPanelDocumentIndex(index);
    setIsuploadOpen(true);
  };

  const handleAddPanelDetail = (data) => {
    let bodyData = JSON.parse(JSON.stringify(panelDocumentData));
    bodyData[panelDocumentIndex]["panelDocumentViewList"] = JSON.parse(
      JSON.stringify(data)
    );
    setPanelDocumentData(bodyData);
    setIsuploadOpen(false);
  };

  const handleAddPanelTable = useCallback(
    (panelBodyData) => {
      return panelBodyData?.map((val, key) => {
        const obj = { ...val };
        obj["Upload_Document"] = (
          <>
            <button
              className="btn btn-primary btn-sm w-100 "
              type="button"
              disabled={isDesabled}
              onClick={() => {
                handleOpenMode(key, val);
              }}
            >
              {t("upload", {
                quantity: "0",
              })}
              {/* <i className="fa fa-file ml-1" aria-hidden="true"></i> */}
            </button>
          </>
        );

        obj["Actions"] = (
          <>
            <span
              className="mx-2"
              onClick={(e) => {
                handleEditAction(key);
              }}
            >
              <i className="fa fa-edit" aria-hidden="true"></i>
            </span>
            <span
              className="mx-2"
              onClick={(e) => {
                handleDeleteAction(key);
              }}
            >
              <i
                className="fa fa-trash text-danger text-center"
                aria-hidden="true"
              ></i>
            </span>
          </>
        );

        return obj;
      });
    },
    [panelBodyData.length]
  );

  const handleDateTab = (e) => {
    // const inputElement = document.getElementById(`${e?.target?.name}`);
    const inputElement = document.getElementById("CardHolderFocus");
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <>
      {isuploadOpen && (
        <AttachDoumentModal
          isuploadOpen={isuploadOpen}
          setIsuploadOpen={setIsuploadOpen}
          documentsViewList={
            panelDocumentData[panelDocumentIndex]["panelDocumentViewList"]
          }
          modelHeader={t("Panel Document")}
          handleAPI={(data) => {
            handleAddPanelDetail(data);
          }}
        />
      )}
      <div className="row g-4 pt-2 pl-2 pr-2">
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={i18n.t("PanelGroup")}
              dynamicOptions={filterByType(
                CentreWisePanelControlCacheList,
                4,
                "TypeID",
                "TextField",
                "ValueField"
              )?.filter((val) => val?.label !== "CASH")}
              name="PanelGroup"
              value={`${values?.PanelGroup?.value}`}
              // defaultValue={values?.PanelGroupID}
              handleChange={handleReactSelect}
              requiredClassName={`required-fields ${errors?.PanelGroup ? "required-fields-active" : ""}`}
              id="PanelGroup"
              inputId="PanelGroupFocus"
              searchable={true}
              //tabIndex="6"
            />
          </div>
        </div>

        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={i18n.t("ParentPanel")}
              // isDisabled={values?.PanelGroup?.value ? false : true}
              dynamicOptions={filterByTypes(
                CentreWisePanelControlCacheList,
                [1, parseInt(values?.PanelGroup?.value)],
                ["TypeID", "PanelGroupID"],
                "TextField",
                "ValueField",
                "ParentID"
              )}
              id="ParentPanel"
              inputId="ParentPanelFocus"
              name="ParentPanel"
              value={`${values?.ParentPanel?.value}`}
              handleChange={handleChangeParentPanel}
              searchable={true}
              requiredClassName={`required-fields ${errors?.ParentPanel ? "required-fields-active" : ""}`}
              //tabIndex="7"
            />
          </div>
        </div>

        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={i18n.t("Panel")}
              // isDisabled={values?.PanelGroup?.value ? false : true}
              id="Panel"
              inputId="PanelFocus"
              name="PanelName"
              value={`${values?.PanelName?.value}`}
              handleChange={handleReactSelect}
              dynamicOptions={filterByTypes(
                CentreWisePanelControlCacheList,
                [
                  1,
                  parseInt(values?.ParentPanel?.extraColomn) === 0
                    ? NaN
                    : parseInt(values?.ParentPanel?.extraColomn),
                ],
                ["TypeID", "ParentID"],
                "TextField",
                "ValueField",
                "ParentID"
              )}
              requiredClassName={`required-fields ${errors?.PanelName ? "required-fields-active" : ""}`}
              searchable={true}
              //tabIndex="8"
            />
          </div>
        </div>

        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={i18n.t("Corporate")}
              dynamicOptions={filterByTypes(
                CentreWisePanelControlCacheList,
                [2],
                ["TypeID"],
                "TextField",
                "ValueField"
              )}
              name="CorporareName"
              value={`${values?.CorporareName?.value}`}
              handleChange={handleReactSelect}
              id={"CorporareName"}
              searchable={true}
            />
          </div>
        </div>

        <div className="col-xl-2 col-md-3 col-sm-4 col-12 d-flex">
          <Input
            type="text"
            className={`form-control  ${errors?.PolicyNo && ""}`}
            id="PolicyNo"
            name="PolicyNo"
            value={values?.PolicyNo}
            onChange={handleChangePanelDetail}
            inputRef={inputRef}
            disabled={isDesabled}
            lable={i18n.t("Policy_No")}
            placeholder=" "
            respclass="w-100 ml-1"
            //tabIndex="9"
          />
        </div>

        <Input
          type="text"
          className={`form-control  ${errors?.PolicyCardNo && ""}`}
          id="PolicyCardNo"
          name="PolicyCardNo"
          value={values?.PolicyCardNo}
          onChange={handleChangePanelDetail}
          lable={i18n.t("Policy_Card_No")}
          placeholder=" "
          disabled={isDesabled}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          //tabIndex="10"
        />

        <Input
          type="text"
          className={`form-control  ${errors?.PanelCardName && ""}`}
          id="PanelCardName"
          name="PanelCardName"
          value={values?.PanelCardName}
          onChange={handleChangePanelDetail}
          lable={i18n.t("Name_On_Card")}
          placeholder=" "
          disabled={isDesabled}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          //tabIndex="11"
        />

        <DatePicker
          className={`custom-calendar  ${errors?.PolicyExpiry && ""}`}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          // id="PolicyExpiry"
          name="PolicyExpiry"
          minDate={new Date()}
          // inputClassName={"required-fields"}
          value={values?.PolicyExpiry}
          // handleChange={handleChangePanelDetail}
          handleChange={(e) => {
            handleChangePanelDetail(e);
          }}
          lable={t("Expire_Date")}
          handleSelect={handleDateTab}
          placeholder={VITE_DATE_FORMAT}
        />

        {/* <Input
          type="date"
          className={`form-control required-fields ${errors?.PolicyExpiry && "required-fields-active"}`}
          id="PolicyExpiry"
          name="PolicyExpiry"
          value={values?.PolicyExpiry}
          onChange={handleChangePanelDetail}
          lable={i18n.t("Expire_Date")}
          placeholder=" "
          disabled={isDesabled}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        /> */}

        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={i18n.t("Card Holder")}
              dynamicOptions={filterByTypes(
                CentreWisePanelControlCacheList,
                [3],
                ["TypeID"],
                "TextField",
                "ValueField"
              )}
              name="CardHolder"
              value={values?.CardHolder?.value}
              handleChange={handleReactSelect}
              isDisabled={isDesabled}
              id="CardHolder"
              inputId="CardHolderFocus"
              searchable={true}
              requiredClassName={` ${errors?.CardHolder ? "" : ""}`}
              //tabIndex="13"
            />
          </div>
        </div>

        <Input
          type="text"
          className={`form-control  ${errors?.ApprovalAmount && ""}`}
          id="ApprovalAmount"
          name="ApprovalAmount"
          value={values?.ApprovalAmount}
          defaultValue={values?.ApprovalAmount}
          // onChange={handleChangePanelDetail}
          onChange={(e) => {
            inputBoxValidation(AMOUNT_REGX(8), e, handleChangePanelDetail);
          }}
          lable={i18n.t("Approval_Amount")}
          placeholder=" "
          disabled={isDesabled}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          //tabIndex="14"
        />
        <Input
          type="text"
          className={`form-control  ${errors?.ApprovalRemarks && ""}`}
          id="ApprovalRemarks"
          name="ApprovalRemarks"
          value={values?.ApprovalRemarks}
          onChange={handleChangePanelDetail}
          lable={i18n.t("Approval_Remark")}
          placeholder=" "
          disabled={isDesabled}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          //tabIndex="15"
        />

        <div className="col-xl-2 col-md-3 col-sm-4 col-12 d-flex">
          {isEditable?.status ? (
            <button
              className="btn btn-primary btn-sm  w-50 ml-1"
              type="button"
              onClick={handleUpdatePanelDetail}
            >
              {t("update")}
            </button>
          ) : (
            <button
              className="custom_save_button btn-primary btn-sm  w-50 ml-1 required-fields"
              type="button"
              onClick={handleSavePanelDetail}
            >
              {t("add")}
              {/* <i className="fa fa-save ml-1" aria-hidden="true"></i> */}
            </button>
          )}
        </div>
      </div>

      <Tables
        thead={THEAD}
        scrollView={"scrollView"}
        style={{
          maxHeight: "125px",
        }}
        tbody={handleAddPanelTable(panelBodyData)}
        fs={"12"}
      />
    </>
  );
};

export default PanelDetails;
