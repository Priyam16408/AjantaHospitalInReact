import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import {
  IssueReturnTypeOptions,
  SearchSalesOption,
  SearchtypeOptions,
} from "../../../utils/constant";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getBindPanelList } from "../../../store/reducers/common/CommonExportFunction";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import {
  BindSearchSalesItem,
  BindUser,
  ReportDetail,
  SearchSales,
  StoreCommonReceiptPdf,
} from "../../../networkServices/InventoryApi";
import moment from "moment";
import { notify } from "../../../utils/utils";
import ViewIssueReturnTable from "../../../components/UI/customTable/MedicalStore/ViewIssueReturnTable";
import { RedirectURL } from "../../../networkServices/PDFURL";
import Modal from "../../../components/modalComponent/Modal";
import ViewIssueReturnModal from "../../../components/modalComponent/Utils/MedicalStore/ViewIssueReturnModal";
import { GetIPDSearchSalesAPI } from "../../../networkServices/pharmecy";

const ViewIssueReturn = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { getBindPanelListData } = useSelector((state) => state.CommonSlice);
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const [Items, setItems] = useState([]);
  const [ReportVisible, setReportVisible] = useState(false);
  const initialOPDData = {
    billtype: "1",
    UHID: "",
    Name: "",
    issuetype: "All",
    panelID: "All",
    User: "All",
    Item: "",
    BillNo: "",
    ReceiptNo: "",
    Mobile: "",
    fromDate: new Date(),
    toDate: new Date(),
    Searchtype: "ALL",
    ReportType: "1",
    BillingType: "1",
  };
  const initialIPDData = {
    UHID: "",
    Name: "",
    issuetype: "All",
    panelID: "All",
    User: "All",
    Item: "",
    fromDate: new Date(),
    toDate: new Date(),
    ReportType: "1",
    BillingType: "1",
    ipdNo: "",
  };
  const [payload, setPayload] = useState(initialOPDData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const handleReactSelect = (name, value) => {
    if (name === "billtype") {
      if (value?.value === "2") {
        setPayload({ ...payload, [name]: value?.value, BillNo: "" });
      } else {
        setPayload({ ...payload, [name]: value?.value, ReceiptNo: "" });
      }
    } else if (name === "BillingType") {
      if (value?.value === "1") {
        setPayload({ ...initialOPDData, [name]: value?.value });
      } else {
        setPayload({ ...initialIPDData, [name]: value?.value });
      }
      setTableData([]);
    } else {
      setPayload({ ...payload, [name]: value?.value });
    }
  };

  const getBindUser = async () => {
    try {
      const response = await BindUser();
      setUsers(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const GetReportDetail = async () => {
    const reqBody = {
      typeId: payload?.billtype,
      regNo: payload?.UHID,
      panelID: payload?.panelID == "All" ? "" : payload?.panelID,
      pName: payload?.Name,
      searchType: payload?.Searchtype,
      mobileNo: payload?.Mobile,
      billNo: payload?.BillNo,
      fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
      itemId: payload?.Item,
      userID: payload?.User == "All" ? "" : payload?.User,
      receiptNo: payload?.ReceiptNo,
      typeIssue: payload?.issuetype,
      ReportType: payload?.ReportType,
    };
    try {
      const response = await ReportDetail(reqBody);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getBindSearchSalesItem = async () => {
    try {
      const response = await BindSearchSalesItem();
      setItems(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getStoreCommonReceiptPdf = async (item) => {
    const requestBody = {
      ledgerTransactionNo: String(item?.LedgerTransactionNo),
      isBill: "0",
      receiptNo: "",
      duplicate: "0",
      type: "PHY",
      supplierID: "",
      billNo: "",
      isEMGBilling: "",
      isOnlinePrint: "",
      isRefound: 0,
    };
    try {
      const response = await StoreCommonReceiptPdf(requestBody);
      RedirectURL(response?.data?.pdfUrl);
    } catch (error) {
      console.error(error);
    }
  };
  function handleDoubleClick(ele, index) {
    const newitem = tableData[index];
    getStoreCommonReceiptPdf(newitem);
  }

  const GetSearchSales = async () => {
    const bodyRequest = {
      typeId: payload?.billtype,
      regNo: payload?.UHID,
      panelID: payload?.panelID == "All" ? "" : payload?.panelID,
      pName: payload?.Name,
      searchType: payload?.Searchtype,
      mobileNo: payload?.Mobile,
      billNo: payload?.BillNo,
      fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
      itemId: payload?.Item,
      userID: payload?.User == "All" ? "" : payload?.User,
      receiptNo: payload?.ReceiptNo,
      typeIssue: payload?.issuetype === "All" ? "" : payload?.issuetype,
      ReportType: "",
    };
    try {
      const response = await SearchSales(bodyRequest);
      if (response?.success) {
        // notify(response?.message, "success");
        setTableData(response?.data);
      } else {
        setTableData([]);
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBindUser();
    getBindSearchSalesItem();
    dispatch(
      getBindPanelList({
        PanelGroup: "ALL",
      })
    );
  }, []);

  const handleCancle = () => {
    setReportVisible(false);
  };

  // IPD SEarch

  const GetIPDSearchSales = async () => {
    let newPayload = {
      typeOfTnx:
        payload?.issuetype === "Pharmacy-Issue"
          ? "Sales"
          : payload?.issuetype === "Pharmacy-Return"
            ? "Patient-Return"
            : "",
      patientID: payload?.UHID,
      pName: payload?.Name,
      panelID: Number(payload?.panelID === "All" ? 0 : payload?.panelID),
      fromDate: payload?.fromDate,
      toDate: payload?.toDate,
      ipdNo: payload?.ipdNo,
      userID: payload?.User === "All" ? "" : payload?.User,
    };

    let apiResp = await GetIPDSearchSalesAPI(newPayload);
    if (apiResp?.success) {
      setTableData(apiResp?.data);
    } else {
      setTableData([]);
      notify(apiResp?.message, "error");
    }
  };
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} title={"Search Sales"} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("BillingType")}
            id="BillingType"
            name="BillingType"
            value={payload?.BillingType}
            handleChange={(name, e) => handleReactSelect(name, e)}
            removeIsClearable={true}
            dynamicOptions={[
              { label: "OPD Billing", value: "1" },
              { label: "IPD Billing", value: "2" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            value={payload?.UHID ? payload?.UHID : ""}
            onChange={handleChange}
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          {payload?.BillingType === "2" && (
            <Input
              type="text"
              className="form-control"
              id="ipdNo"
              name="ipdNo"
              value={payload?.ipdNo ? payload?.ipdNo : ""}
              onChange={handleChange}
              lable={t("IPD No.")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
          )}
          <Input
            type="text"
            className="form-control"
            id="Name"
            name="Name"
            value={payload?.Name ? payload?.Name : ""}
            onChange={handleChange}
            lable={t("PatientName")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"issuetype"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            name={"issuetype"}
            removeIsClearable={true}
            dynamicOptions={[
              { label: "All", value: "All" },
              ...IssueReturnTypeOptions,
            ]}
            value={payload?.issuetype}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Panel")}
            id="panelID"
            name="panelID"
            value={payload?.panelID}
            handleChange={handleReactSelect}
            dynamicOptions={[
              { label: "All", value: "All" },
              ...getBindPanelListData.map((item) => ({
                label: item?.Company_Name,
                value: item?.PanelID,
              })),
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("User Name")}
            id={"User"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            name={"User"}
            dynamicOptions={[
              { label: "All", value: "All" },
              ...users.map((item) => ({
                label: item?.ename,
                value: item?.EmployeeID,
              })),
            ]}
            value={payload?.User}
            handleChange={handleReactSelect}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={payload}
            setValues={setPayload}
            max={payload?.toDate}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={payload}
            setValues={setPayload}
            max={new Date()}
            min={payload?.fromDate}
          />

          {payload?.BillingType === "1" && (
            <>
              <ReactSelect
                placeholderName={t("BillType")}
                id={"billtype"}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                name={"billtype"}
                dynamicOptions={SearchSalesOption}
                removeIsClearable={true}
                value={payload?.billtype}
                handleChange={handleReactSelect}
                //   requiredClassName="required-fields"
              />
              {payload?.billtype === "1" && (
                <Input
                  type="number"
                  className="form-control"
                  id="BillNo"
                  name="BillNo"
                  value={payload?.BillNo}
                  onChange={handleChange}
                  lable={t("Bill Number")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                />
              )}
              {payload?.billtype === "2" && (
                <Input
                  type="number"
                  className="form-control"
                  id="ReceiptNo"
                  name="ReceiptNo"
                  value={payload?.ReceiptNo}
                  onChange={handleChange}
                  lable={t("ReceiptNo")}
                  placeholder=" "
                  respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                />
              )}
              <Input
                type="number"
                className="form-control"
                id="Mobile"
                name="Mobile"
                value={payload?.Mobile}
                onChange={handleChange}
                lable={t("Mobile Number")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              />

              <ReactSelect
                placeholderName={t("Search Type")}
                id={"Searchtype"}
                searchable={true}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                name={t("Searchtype")}
                dynamicOptions={SearchtypeOptions}
                value={payload?.Searchtype}
                handleChange={handleReactSelect}
              />
            </>
          )}
          <div
            className={`${payload?.BillingType === "1" ? "col-12" : "col-6"}`}
          >
            <div className="text-right">
              {payload?.BillingType === "1" ? (
                <button
                  className="btn btn-primary btn-sm px-4 ml-1"
                  onClick={GetSearchSales}
                >
                  {t("Search")}
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm px-4 ml-1"
                  onClick={GetIPDSearchSales}
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* </form> */}
      </div>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            isBreadcrumb={false}
            title={t("BillDetails")}
            secondTitle={
              <>
                <span className="pointer-cursor">
                  <ColorCodingSearch
                    color={"rgb(160, 216, 160)"}
                    label={t("Pharmacy Issue")}
                  />
                </span>
                <span className="pointer-cursor">
                  <ColorCodingSearch
                    color={"rgb(196, 173, 233)"}
                    label={t("Pharmacy Return")}
                  />
                </span>
                <span className="pointer-cursor">
                  <ColorCodingSearch color={"yellow"} label={t("Settlement")} />
                </span>
              </>
            }
          />
        </div>
      </div>
      {tableData?.length > 0 && (
        <div className="mt-2 spatient_registration_card">
          <div
            className="patient_registration card p-1"
            style={{ borderRadius: "5px" }}
          >
            <ViewIssueReturnTable
              tbody={tableData}
              handleDoubleClick={handleDoubleClick}
              BillingType={payload?.BillingType}
            />
          </div>
        </div>
      )}

      {ReportVisible && (
        <Modal
          modalWidth={"500px"}
          visible={ReportVisible}
          setVisible={setReportVisible}
          Header="Select Report Type"
          footer={
            <>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={GetReportDetail}
              >
                {t("Print")}
              </button>
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={handleCancle}
              >
                {t("Cancel")}
              </button>
            </>
          }
        >
          <ViewIssueReturnModal
            payload={payload}
            setPayload={setPayload}
            handleReactSelect={handleReactSelect}
          />
        </Modal>
      )}
    </>
  );
};

export default ViewIssueReturn;
