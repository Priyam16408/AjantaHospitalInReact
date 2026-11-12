import React, { useEffect, useState } from "react";
import Input from "../../components/formComponent/Input";
import Heading from "../../components/UI/Heading";
import ReportDatePicker from "../../components/ReportCommonComponents/ReportDatePicker";
import moment from "moment";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import {
  BindManufacturer,
  GetGRNList,
  GRNPost,
  GRNReject,
  BindGRNItems,
  ReprintGRN,
} from "../../networkServices/InventoryApi";
import UpdateInvoicePopup from "./UpdateInvoicePopup";
import Tables from "../../components/UI/customTable";
import { notify } from "../../utils/utils";
import Modal from "../../components/modalComponent/Modal";
import { Link } from "react-router-dom";
import { RedirectURL } from "../../networkServices/PDFURL";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";

const GRNSearch = () => {
  const [t] = useTranslation();
  const [selectedGrnData, setSelectedGrnData] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [grnNo, setGrnNo] = useState("");
  const [poNo, setPoNo] = useState("");
  const [consignmentNo, setConsignmentNo] = useState("");
  const initialValues = {
    StoreType: { label: " Medical Store", value: "STO00001" },
    GRNType: { label: "All", value: "2" },
    GRNListdata: [],
    GRNItemListdata: [],
    fromDate: new Date(),
    toDate: new Date(),
  };
  const [values, setValues] = useState({ ...initialValues });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Invoice No") setInvoiceNo(value);
    if (name === "GRN No") setGrnNo(value);
    if (name === "PO No") setPoNo(value);
    if (name === "Consignment No") setConsignmentNo(value);
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };
  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
  });
  const handleModalState = (show, name, component, size, footer) => {
    setModalState({
      show: show,
      name: name,
      component: component,
      size: size,
      footer: footer,
    });
  };
  const IsGRNPost = async (GRNNo, StoreType) => {
    const payloadIsGRNPost = {
      GRNNo: GRNNo,
      StoreType: StoreType,
    };
    try {
      const response = await GRNPost(payloadIsGRNPost);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleSearch();
      }
    } catch (error) {
      notify("Failed to update invoice.", "error");
    }
  };
  const GRNView = async (GRNNo, StoreType) => {
    const payloadIsReject = {
      GRNNo: GRNNo,
      StoreType: StoreType,
    };
    try {
      const response = await BindGRNItems(payloadIsReject);
      if (response?.success) {
        const data = response?.data?.map((val, index) => ({
          sno: index + 1,
          ItemName: val?.ItemName,
          BatchNumber: val?.BatchNumber,
          Rate: val?.Rate,
          InitialCount: val?.InitialCount,
          MajorMRP: val?.MajorMRP,
          Free: val?.IsFree === 0 ? "No" : "Yes",
          CurrentManufacturer: val?.CurrentManufacturer,
          LastManufacturer:
            val?.LastManufacturer == null ? "" : val?.LastManufacturer,
          CurrentVendor: val?.CurrentVendor == null ? "" : val?.CurrentVendor,
          LastVendor: val?.LastVendor,
        }));

        setValues((val) => ({ ...val, GRNItemListdata: data }));
      } else {
        notify(response?.message, "error");
        setValues((val) => ({ ...val, GRNItemListdata: [] }));
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setValues((val) => ({ ...val, GRNItemListdata: [] }));
    }
  };

  const Reprint = async (GRNNo) => {
    const payloadIsReject = {
      hos_GRN: GRNNo,
    };
    try {
      const response = await ReprintGRN(payloadIsReject);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setValues((val) => ({ ...val, GRNItemListdata: [] }));
    }
  };

  useEffect(() => {
    fetchManufacturer();
    setValues({ ...values });
  }, []);

  const fetchManufacturer = async () => {
    const payLoadList = {};
    try {
      const response = await BindManufacturer(payLoadList);
      if (response?.data) {
        const itemOptions = response.data.map((item) => ({
          value: item.ManufactureID,
          label: item.NAME,
        }));
        setValues((prevState) => ({
          ...prevState,
          ManufacturerData: itemOptions,
        }));
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };

  const handleSearch = async () => {
    if (!values?.StoreType?.value) {
      return notify("Please Select Store Type.", "error");
    }
    if (!values?.GRNType?.value) {
      return notify("Please Select GRN Type.", "error");
    }

    const payload = {
      storeType: values?.StoreType?.value || "",
      invoiceNo: invoiceNo || "",
      grnNo: grnNo || "",
      grnType: values?.GRNType?.value || "2",
      fromDate: moment(values.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      toDate: moment(values.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      consignmentNo: consignmentNo || "",
      poNo: poNo || "",
      vendor: values.manufacturer?.value?.toString() || "",
    };

    try {
      const response = await GetGRNList(payload);
      if (response?.success) {
        const data = response?.data?.map((val, index) => ({
          sno: index + 1,
          grnNo: val?.BillNo,
          poNo: val?.poNo,
          invoiceNo: val?.InvoiceNo,
          chalanNo: val?.ChalanNo,
          supplierName: val?.LedgerName,
          grnDate: val?.GRNDate,
          PostStatus: t(val.NewPost),
          UpdateInvoice: (
            <button
              className="btn btn-primary table-btn"
              onClick={() =>
                handleModalState(
                  true,
                  `Update Invoice Details (GRN No.: ${val?.BillNo})`,
                  <UpdateInvoicePopup
                    isOpen={true}
                    onClose={handleClosePopup}
                    grnData={selectedGrnData}
                    invoiceDetails={val}
                    AddRemark={false}
                  />,
                  "70vw",
                  <></>
                )
              }
            >
              {t("Update Invoice")}
            </button>
          ),

          edit: (
            <Link
              to="/DirectGRN"
              state={{
                data: val,
                edit: true,
                StoreType: values?.StoreType,
                GRNNo: val?.GRNNo,
                // isDefaultGSTType: false 
              }}
            >
              {t("Edit")}
            </Link>
          ),
          Post:
            val.NewPost == "Yes" || val.NewPost == "Cancel" ? (
              ""
            ) : (
              <button
                className="btn btn-primary table-btn"
                onClick={() => IsGRNPost(val.GRNNo, values?.StoreType?.value)}
              >
                {t("Post")}
              </button>
            ),
          Reject:
            val.NewPost == "Cancel" || val.NewPost == "Yes" ? (
              ""
            ) : (
              <button
                className="btn btn-primary table-btn"
                onClick={() => {
                  handleModalState(
                    true,
                    "Remark",
                    <UpdateInvoicePopup
                      AddRemark={true}
                      StoreType={values?.StoreType?.value}
                      GRNId={val.GRNNo}
                      value={val}
                      onClose={handleClosePopup}
                    />,
                    "25vw",
                    <></>
                  )
                }
                }
              >
                {t("Rejectasas")}
              </button>
            ),
          UploadView: "",
          View: (
            <i
              className="fa fa-eye"
              aria-hidden="true"
              onClick={() => GRNView(val.GRNNo, values?.StoreType?.value)}
            ></i>
          ),
          "Re-Print": (
            <i
              className="fa fa-print"
              aria-hidden="true"
              onClick={() => Reprint(val.GRNNo)}
            ></i>
          ),
        }));

        setValues((val) => ({
          ...val,
          GRNListdata: data,
          GRNItemListdata: [],
        }));
      } else {
        notify(response?.message, "error");
        setValues((val) => ({ ...val, GRNListdata: [], GRNItemListdata: [] }));
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setValues((val) => ({ ...val, GRNListdata: [], GRNItemListdata: [] }));
    }
  };

  const handleClosePopup = () => {
    setModalState({
      show: false,
    });
    setSelectedGrnData(null);
    handleSearch();
  };

  const THEAD = [
    t("S.No."),
    t("GRN No."),
    t("PO No."),
    t("Invoice No."),
    t("Chalan No."),
    t("Supplier Name"),
    t("Date"),
    t("Post Status"),
    t("Update Invoice"),
    t("Edit"),
    t("Post"),
    t("Reject"),
    t("Upload/View"),
    t("View"),
    t("Re-Print"),
  ];

  const THEAD2 = [
    t("S.No."),
    t("Item Name"),
    t("Batch"),
    t("Rate"),
    t("Qty"),
    t("MRP"),
    t("Free"),
    t("Current Manufacturer"),
    t("Last Manufacturer"),
    t("Current Vendor"),
    t("Last Vendor"),
  ];

  return (
    <>
      <div className="card">
        <Heading title={"GRN Search"} isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            lable={t("Invoice No.")}
            placeholder=" "
            id="InvoiceNo"
            name="Invoice No"
            value={invoiceNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("GRN No.")}
            placeholder=" "
            id="GRNNo"
            name="GRN No"
            value={grnNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            requiredClassName="required-fields"
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("from Date")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            lable={t("to Date")}
            values={values}
            setValues={setValues}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("PO No.")}
            placeholder=" "
            id="PONo"
            name="PO No"
            value={poNo}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("ManuFacturer")}
            id={"manufacturer"}
            searchable={true}
            name={"manufacturer"}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            // style={{ width: "100px" }}
            dynamicOptions={values?.ManufacturerData}
            handleChange={handleReactSelect}
            value={values?.manufacturer}
            removeIsClearable={false}
          />
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={[
              { label: t("Medical Store"), value: "STO00001" },
              { label: t("General Store"), value: "STO00002" },
            ]}
            name="StoreType"
            handleChange={handleReactSelect}
            value={values?.StoreType.value}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("GRN Type")}
            id={"GRNType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={[
              { label: t("All"), value: "2" },
              { label: t("Non-Posted"), value: "0" },
              { label: t("Posted"), value: "1" },
              { label: t("Rejected"), value: "3" },
            ]}
            name="GRNType"
            handleChange={handleReactSelect}
            value={values?.GRNType.value}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Consignment No.")}
            placeholder=" "
            id="ConsignmentNo"
            name="Consignment No"
            value={consignmentNo}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            requiredClassName="required-fields"
          />
          <div className="row ml-1">
            <div className="col">
              <button className="btn btn-primary" onClick={handleSearch}>
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="card my-2 p-2">
        <div className="row">
          <div className="col-sm-1">
            <div className="d-flex justify-content-start">
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "red",
                }}
              ></div>
              <label className="m-0 mx-1 text-nowrap">
                {t("For Manufacture")}
              </label>
            </div>
          </div>
          <div className="col-sm-1">
            <div className="d-flex justify-content-start">
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                }}
              ></div>
              <label className="m-0 mx-1 text-nowrap">{t("For Vendor")}</label>
            </div>
          </div>
        </div>
      </div> */}

      <div className="card my-2">
        <Heading title={t("Grn List")} isBreadcrumb={false} secondTitle={<> 
          <ColorCodingSearch color={"color-indicator-1-bg"} label={"For Manufacture"} />
          <ColorCodingSearch color={"color-indicator-2-bg"} label={"For Vendor"} />
          </>} />
        <Tables
          thead={THEAD}
          tbody={values.GRNListdata}
          style={{ maxHeight: "50vh" }}
        />

        <div
          className={
            values.GRNItemListdata.length > 0 ? " p-2 row mt-4" : "d-none"
          }
        >
          <div className="col-12">
            <Tables
              thead={THEAD2}
              tbody={values?.GRNItemListdata}
              style={{ maxHeight: "220px" }}
            />
          </div>
        </div>
      </div>

      <Modal
        Header={modalState?.name}
        modalWidth={modalState?.size}
        visible={modalState?.show}
        setVisible={() => {
          handleModalState(false, null, null, null, <></>);
        }}
        footer={modalState?.footer}
      >
        {modalState?.component}
      </Modal>
    </>
  );
};

export default GRNSearch;
