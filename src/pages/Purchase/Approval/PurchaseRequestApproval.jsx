import React, { useEffect, useState, useRef } from "react";
import Heading from "../../../components/UI/Heading.jsx";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect.jsx";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils.js";
import Modal from "../../../components/modalComponent/Modal.jsx";

import Tables from "../../../components/UI/customTable/index.jsx";
import {
  approvalBindLedger,
  approvalGetPurchaseRequests,
  ApprovalGetSelectedItems, 
  ApprovalSavePurchaseApproval,
  bindDepartments,
  LoadApprovalRight,
} from "../../../networkServices/purchaseDepartment.js"; 
import CancelPurchaseRQ from "./CancelPurchaseRQ.jsx";    
import RejectItem from "./RejectItem.jsx";
import UpdateItem from "./UpdateItem.jsx";
import ViewItem from "./ViewItem.jsx";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage.js";

const PurchaseRequestApproval = () => {
  const [t] = useTranslation();
  const {deptLedgerNo} = useLocalStorage("userData","get")
  const [modalInput, setModalInput] = useState({
    reason: "",
  });
  const [tbodyPurchaseRequest, setTbodyPurchaseRequest] = useState([]);
  //checkbox
  const [dropDownState, setDropDownState] = useState({
    loadPRApproval: [],
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedPRNOs, setSelectedPRNOs] = useState([]);
  const [isApprovel, setIsApprovel] = useState(null); 
  const selectAllRef = useRef(null); 
  const areAllSelected = selectedRows.length === tbodyPurchaseRequest.length;

  const [values, setValues] = useState({  
    action: {},
    department: { value: deptLedgerNo, label: "" },
    store: { LedgerName: "Medical Store", LedgerNumber: "STO00001" },
  });
  const theadRequestDetails = [
    { width: "5%", name: t("PR No.") },
    { width: "5%", name: t("Item Name") },
    { width: "5%", name: t("Remarks") },
    { width: "5%", name: t("Purpose") },
    { width: "5%", name: t("Vendor") },
    { width: "5%", name: t("Rate") },
    { width: "5%", name: t("Discount") },
    { width: "5%", name: t("MRP") },
    { width: "5%", name: t("Unit") },
    { width: "5%", name: t("Req. Qty.") },
    { width: "5%", name: t("App. Qty.") },
    { width: "5%", name: t("LPurQty") },
    { width: "5%", name: t("FreeQty") },
    { width: "5%", name: t("LPurDate") },
    { width: "5%", name: t("ROL") },
    { width: "5%", name: t("PO Stock") },
    { width: "5%", name: t("Dept. Stock") },
    { width: "5%", name: t("Main Stock") },
    { width: "1%", name: t("Edit") },
    { width: "1%", name: t("Reject") },
    { width: "1%", name: t("View Stock") },
  ];

  //checkbox Logic

  const LoadApporval = async () => {
    try {
      const response = await LoadApprovalRight();
      if (response?.success) {
        setIsApprovel(response?.data[0]?.Approval);
        console.log(
          "firstresponse?.data[0]?.Approval",
          response?.data[0]?.Approval
        );
        // setDropDownState((val) => ({
        //   ...val,
        //   loadPRApproval: handleReactSelectDropDownOptions(
        //     response?.data,
        //     "Name",
        //     "ManufactureID"
        //   ),
        // }));
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  useEffect(() => {
    LoadApporval();
  }, []);

  // Effect to handle the indeterminate state of "Select All"
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRows.length > 0 &&
        selectedRows.length < tbodyPurchaseRequest.length;
    }
  }, [selectedRows, tbodyPurchaseRequest.length]);

  // Toggle individual row selection using index
  const handleRowSelect = (index) => {
    setSelectedRows((prevSelectedRows) => {
      let updatedSelectedRows;

      if (prevSelectedRows.includes(index)) {
        // Remove the index if already selected
        updatedSelectedRows = prevSelectedRows.filter((i) => i !== index);
      } else {
        // Add the index if not selected
        updatedSelectedRows = [...prevSelectedRows, index];
      }

      // Update selectedPRNOs state
      setSelectedPRNOs(
        updatedSelectedRows.map(
          (i) => tbodyPurchaseRequest[i].PurchaseRequestNo
        )
      );

      return updatedSelectedRows;
    });
    // console.log(selectedPRNOs)
  };

  // Toggle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all rows
      const allIndices = tbodyPurchaseRequest.map((_, index) => index);
      const allPRNOs = tbodyPurchaseRequest.map((row) => row.PurchaseRequestNo);
      setSelectedRows(allIndices);
      setSelectedPRNOs(allPRNOs);
    } else {
      // Deselect all rows
      setSelectedRows([]);
      setSelectedPRNOs([]);
    }
  };
  const isMobile = window.innerWidth <= 800;
  const theadPurchaseRequest = [
    {
      width: "0.5%",
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          className="ml-2"
          ref={selectAllRef} // Ref for indeterminate state
          checked={areAllSelected}
          onChange={handleSelectAll}
        />
      ),
    },

    { width: "1%", name: t("SNo") },
    { width: "5%", name: t("PR NO") },
    { width: "5%", name: t("DepartMentName") },
    { width: "5%", name: t("Narration") },
    { width: "5%", name: t("RequestedUser") },
    { width: "5%", name: t("RequestedDate") },
    { width: "1%", name: t("Reject") },
  ];

  const [handleModelData, setHandleModelData] = useState({});
  const [tbodyRequestDetails, setTbodyRequestDetails] = useState([]);

  const [departmentData, setDepartmentData] = useState([]);
  const [storeList, setStoreList] = useState([]);

  const CheckDepartment = async () => {
    try {
      const response = await bindDepartments();
      if (response.success) {
        setDepartmentData(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setDepartmentData([]);
    }
  };

  const GetStoreList = async () => {
    try {
      const response = await approvalBindLedger();
      if (response.success) {
        setStoreList(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setStoreList([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setStoreList([]);
    }
  };

  const GetPurchaseRequests = async () => {
    debugger
    try {
      const response = await approvalGetPurchaseRequests(
        `${values.store?.LedgerNumber}`,
        `${values.department?.value}`
      );
      if (response.success) {
        setTbodyPurchaseRequest(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        notify(response?.message,"error");
        setTbodyPurchaseRequest([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setTbodyPurchaseRequest([]);
    }
  };

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const UpdatePurchaseOrder = async () => {
    if (!values.action?.value) {
      notify("Please Select Action", "warn");
      return;
    }
    try {
      let payload = {
        paUserID: "",
        itemIDs: "",
        approvalType: values.action?.value,
        prnOs: selectedPRNOs,
      };

      let apiResp = await ApprovalSavePurchaseApproval(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
        setSelectedRows([]);
        setSelectedPRNOs([]);
        setTbodyRequestDetails([]);
        GetPurchaseRequests();
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);

      notify(apiResp?.message, "error");
    }
  };

  const handleClickReject = (data, Details) => {
    const { itemLabel, Component } = Details;

    setHandleModelData({
      isOpen: true,
      width: "40vw",
      label: itemLabel,
      Component: Component,
      // RejectPurchaseRequest: RejectPurchaseRequest
    });
  };
  const getItemsOfPurchaseRq = async (prNo) => {
    try {
      let payload = {
        prnOs: [prNo],
        ledgerNumber: values.store?.LedgerNumber,
      };

      let apiResp = await ApprovalGetSelectedItems(payload);
      if (apiResp?.success) {
        setTbodyRequestDetails(apiResp.data);
      }
    } catch (error) {
      console.log(apiResp?.message);
      console.log(error);
      notify(apiResp?.message, "error");
      setTbodyRequestDetails([]);
    }
    console.log(tbodyRequestDetails);
  };

  useEffect(() => {
    CheckDepartment();
    GetStoreList();
    // departmentData.length > 0 ? console.log("🎂🌹", departmentData) : ""
  }, []);

  useEffect(() => {
    GetPurchaseRequests();
  }, [values, handleModelData]);

  const handleClose = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={handleClose}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          // modalData={handleModelData?.modalData}
          // buttons={handleModelData?.extrabutton}
          // buttonName={handleModelData?.buttonName}

          footer={<></>}
          // handleAPI={handleModelData?.RejectPurchaseRequest}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className=" patient_registration border mt-2">
        <div className="row p-2">
          <div className="col-sm-12">
            <div className=" patient_registration  ">
              <form className="patient_registration card">
                <Heading
                  title={t("Purchase Request Approval")}
                  isBreadcrumb={true}
                />
                <div className="row p-2">
                  <ReactSelect
                    placeholderName={t("Department")}
                    id={"department"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={[
                      { value: "0", label: "ALL" },
                      ...handleReactSelectDropDownOptions(
                        departmentData,
                        "ledgerName",
                        "ledgerNumber"
                      ),
                    ]}
                    handleChange={handleSelect}
                    value={`${values?.department?.value}`}
                    name={"department"}
                  />

                  <ReactSelect
                    placeholderName={t("Store Type")}
                    id={"store"}
                    searchable={true}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    dynamicOptions={[
                      ...handleReactSelectDropDownOptions(
                        storeList,
                        "LedgerName",
                        "LedgerNumber"
                      ),
                    ]}
                    removeIsClearable={true}
                    handleChange={handleSelect}
                    value={`${values?.store?.LedgerNumber}`}
                    name={"store"}
                  />
                </div>
              </form>
            </div>
            <div className="card">
              <div className=" spatient_registration_card">
                <Heading title={t("Purchase Request")} isBreadcrumb={false} />
                <Tables
                  // getRowClick={getItemsOfPurchaseRq}
                  thead={theadPurchaseRequest}
                  tbody={tbodyPurchaseRequest?.map((val, index) => ({
                    checkbox: (
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleRowSelect(index)}
                      />
                    ),
                    sno: index + 1,
                    prNo: (
                      <strong
                        className="text-primary"
                        onClick={() =>
                          getItemsOfPurchaseRq(val.PurchaseRequestNo)
                        }
                      >
                        {" "}
                        {val.PurchaseRequestNo}
                      </strong>
                    ),
                    departMentName: val.DepartMentName || "",
                    narration: val.Subject || "",
                    requestedUser: val.Name || "",
                    raisedDate: val.RaisedDate || "",
                    // reject: <i className="fa fa-trash text-danger" /> || "",
                    reject: (
                      <span
                        onClick={() => {
                          handleClickReject(val, {
                            itemLabel: "Cancel PR",
                            Component: (
                              <CancelPurchaseRQ
                                inputData={val}
                                handleClose={handleClose}
                                setTbodyRequestDetails={setTbodyRequestDetails}
                              />
                            ),
                          });
                        }}
                      >
                        <i className="fa fa-trash text-danger" />
                      </span>
                    ),
                    colorcode: val?.IsAlreadyRequested ? "#f88891" : "",
                  }))}
                  style={{ maxHeight: "23vh" }}
                />

                {tbodyPurchaseRequest.length > 0 ? (
                  <div className="py-2 col-sm-12 d-flex justify-content-end align-items-center  ">
                    <ReactSelect
                      placeholderName={t("Select Action")}
                      id={"action"}
                      searchable={true}
                      respclass="col-xl-2 col-md-4 col-sm-4 col-11"
                      // dynamicOptions={[
                      //     isApprovel === 1 && { value: "Approve", label: "Approve", isDisabled: false },
                      //     // isApprovel === 1 ? { value: "Approve", label: "Approve", isDisabled: false } : { value: "Approve", label: "Approve", isDisabled: true },
                      //     { value: "Forward", label: "Forward" },
                      //     { value: "Reject", label: "Reject" },
                      // ]}

                      dynamicOptions={[
                        ...(isApprovel === 1
                          ? [
                              {
                                value: "Approve",
                                label: "Approve",
                                isDisabled: false,
                              },
                            ]
                          : [{ value: "Forward", label: "Forward" }]),
                        // { value: "Forward", label: "Forward" },
                        { value: "Reject", label: "Reject" },
                      ]}
                      removeIsClearable={true}
                      handleChange={handleSelect}
                      value={`${values?.action?.value}`}
                      name={"action"}
                    />
                    <button
                      className="btn btn-sm btn-success m-2"
                      type="button"
                      onClick={() => UpdatePurchaseOrder()}
                    >
                      {t("Save")}
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className=" mt-2 spatient_registration_card">
              {tbodyRequestDetails.length > 0 ? (
                <>
                  <Heading title={t("Request Details")} isBreadcrumb={false} />
                  <Tables
                    thead={theadRequestDetails}
                    tbody={tbodyRequestDetails?.map((val, index) => ({
                      PurchaseRequisitionNo: val.PurchaseRequisitionNo,
                      ItemName: val.ItemName || "",
                      Specification: val.Specification || "",
                      Purpose: val.Purpose || "",
                      LastVendor: val.LastVendor || "",
                      ApproxRate: val.ApproxRate || "",
                      Discount: val.Discount || "",
                      LastMRP: val.LastMRP || "",
                      Unit: val.Unit || "",
                      RequestedQty: val.RequestedQty || "",
                      ApprovedQty: val.ApprovedQty || "",
                      LastPurchaseQty: val.LastPurchaseQty || "",
                      FreeQty: val.FreeQty || "0",
                      LastpurchaseDate: val.LastpurchaseDate || "",
                      ReorderLevel: val.ReorderLevel || "",
                      POStock: val.POStock || "",
                      DeptStock: val.DeptStock || "0",
                      MainStock: val.MainStock || "",

                      edit:
                        (
                          <span
                            onClick={() => {
                              handleClickReject(val, {
                                itemLabel: "Update Item Details",
                                Component: (
                                  <UpdateItem
                                    inputData={val}
                                    handleClose={handleClose}
                                    getItemsOfPurchaseRq={getItemsOfPurchaseRq}
                                  />
                                ),
                              });
                            }}
                          >
                            <i className="fa fa-edit" />{" "}
                          </span>
                        ) || "",
                      reject:
                        (
                          <span
                            onClick={() => {
                              handleClickReject(val, {
                                itemLabel: "Cancel Item",
                                Component: (
                                  <RejectItem
                                    inputData={val}
                                    handleClose={handleClose}
                                    getItemsOfPurchaseRq={getItemsOfPurchaseRq}
                                  />
                                ),
                              });
                            }}
                          >
                            <i className="fa fa-trash text-danger" />
                          </span>
                        ) || "",
                      viewStock:
                        (
                          <span
                            onClick={() => {
                              handleClickReject(val, {
                                itemLabel: "Department Stock Status",
                                Component: (
                                  <ViewItem
                                    inputData={val}
                                    handleClose={handleClose}
                                    storeType={values.store?.LedgerName}
                                  />
                                ),
                              });
                            }}
                          >
                            <i className="fa fa-eye" />
                          </span>
                        ) || "",
                    }))}
                    style={{ maxHeight: "27vh" }}
                     tableHeight={"scrollView"}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseRequestApproval;
