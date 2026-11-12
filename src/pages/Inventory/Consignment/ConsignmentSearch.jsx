import React, { useEffect, useState } from "react";
import Input from "../../../../src/components/formComponent/Input";
import Heading from "../../../../src/components/UI/Heading";
import ReportDatePicker from "../../../../src/components/ReportCommonComponents/ReportDatePicker";
import moment from "moment";
import ReactSelect from "../../../../src/components/formComponent/ReactSelect";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  BindManufacturer,
  GetConsignmentList,
  ConsignmentPost,
  GRNReject,
  BindConsignmentItemList,
} from "../../../networkServices/InventoryApi";
import UpdateInvoicePopup from "../UpdateInvoicePopup";
import Tables from "../../../../src/components/UI/customTable";
import { notify } from "../../../utils/utils";
import Modal from "../../../../src/components/modalComponent/Modal";
import { Link } from "react-router-dom";
import ColorCodingSearch from "../../../../src/components/commonComponents/ColorCodingSearch";
import { BindSupplier } from "../../../networkServices/BillingsApi";

const ConsignmentSearch = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [isPopupOpen, SetPopupOpen] = useState(false);
  const [selectedGrnData, setSelectedGrnData] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [grnNo, setGrnNo] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
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
  useEffect(() => {
    console.log("values" , values)
  },[values])
  //   console.log("Setvalues" , values)

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Invoice No") setInvoiceNo(value);
    if (name === "GRN No") setGrnNo(value);
    if (name === "PO No") setPoNo(value);
    if (name === "Consignment No") setConsignmentNo(value);
  };

  const handleReactSelect = (name, value) => {
    console.log("name", name, "value", value);
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
  const ConsignmentPosts = async (GRNNo) => {
    const payloadIsGRNPost = {
      consignmentNo: GRNNo,
    };
    try {
      const response = await ConsignmentPost(payloadIsGRNPost);
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleSearch();
      }
    } catch (error) {
      notify("Failed to update invoice.", "error");
    }
  };

  const GRNView = async (consignmentNo) => {
    const payloadIsReject = {
      consignmentNo: consignmentNo,
    };
    try {
      const response = await BindConsignmentItemList(payloadIsReject);
      console.log("BindConsignmentItemList", response);
      if (response?.success && response?.data.length > 0) {
        // debugger;
        const data = response?.data?.map((val, index) => ({
          sno: index + 1,
          ConsignmentNo: val?.ConsignmentNo,
          ItemName: val?.ItemName,
          BatchNumber: val?.BatchNumber,
          DiscountPer: val?.DiscountPer,
          SpecialDiscPer: val?.SpecialDiscPer,
          InititalCount: val?.InititalCount,
          Rate: val?.Rate,
          MRP: val?.MRP,
          Free: val?.Free == "false" ? "No" : "Yes",

          Reject:
            val?.IsReject == "NotRej." ? (
              <i
                className="fa fa-trash text-danger text-center"
                onClick={() =>
                  handleModalState(
                    true,
                    "Remark",
                    <UpdateInvoicePopup
                      AddRemark={true}
                      //   isOpen={isPopupOpen}
                      callfrom="Con_Item"
                      StoreType={values?.StoreType}
                      GRNId={val?.ID}
                      onClose={handleClosePopup}
                    />,
                    "25vw",
                    <></>
                  )
                }
              />
            ) : (
              ""
            ),
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

  useEffect(() => {
    fetchSupplier();
    setValues({ ...values });
  }, []);

  // const fetchManufacturer = async () => {
  //   const payLoadList = {};
  //   try {
  //     const response = await BindManufacturer(payLoadList);
  //     if (response?.data) {
  //       const itemOptions = response.data.map((item) => ({
  //         value: item.ManufactureID,
  //         label: item.NAME,
  //       }));
  //       setValues((prevState) => ({
  //         ...prevState,
  //         ManufacturerData: itemOptions,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching item names: ", error);
  //   }
  // };

  const fetchSupplier = async () => {
    const payloadList = {};

    try {
      const response = await BindSupplier(payloadList);
      console.log("Response", response);
      if (response?.data) {
        const itemOptions = response.data.map((item) => ({
          value: item.LedgerNumber,
          label: item.LedgerName,
        }));
        setValues((prevState) => ({
          ...prevState,
          SupplierData: itemOptions,
        }));
      }
    } catch (error) {
      console.error("Error fetching item names: ", error);
    }
  };

  const handleSearch = async () => {
    // if (!values?.StoreType?.value) {
    //     return notify("Please Select Store Type.", "error");
    // }
    if (!values?.GRNType?.value) {
      return notify("Please Select GRN Type.", "error");
    }

    const payload = {
      InvoiceNo: invoiceNo || "",
      GRNNo: grnNo || "",
      GRNType: values?.GRNType?.value || "2",
      FromDate: moment(values.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      ToDate: moment(values.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      Vendor: values.supplier?.value?.toString() || "",
    };

    try {
      const response = await GetConsignmentList(payload);
      //   console.log("Response from GetConsignmentList", response);
      if (response?.success && response.data.length > 0) {
        // debugger;
        const data = response?.data?.map((val, index) => ({
          sno: index + 1,
          consignmentNo: val?.consignmentNo,
          Return: val?.IsReturn,
          invoiceNo: val?.BillNo,
          chalanNo: val?.ChallanNo,
          supplierName: val?.LedgerName,
          Date: val?.StockDate,
          PostStatus: val.NewPost,
          View: (
            <i
              className="fa fa-eye"
              aria-hidden="true"
              onClick={() => GRNView(val?.consignmentNo)}
            ></i>
          ),

          edit: (
            // <i className="fa fa-edit" aria-hidden="true" onClick={() => handleEdit(val)}></i>
            <Link
              to="/ConsignmentReceive"
              state={{
                data: val,
                edit: true,
                StoreType: values?.StoreType,
                GRNNo: val?.consignmentNo,
                // currency: val?.Currency,
              }}
            >
              {t("Edit")}
            </Link>
          ),
          Post:
            val.NewPost == "Post" || val.NewPost == "Cancel" ? (
              ""
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => ConsignmentPosts(val?.consignmentNo)}
              >
                {t("Post")}
              </button>
            ),
          Reject:
            val.NewPost == "Cancel" || val.NewPost == "Post" ? (
              ""
            ) : (
              <button
                className="btn btn-primary"
                onClick={() =>
                  handleModalState(
                    true,
                    "Remark",
                    <UpdateInvoicePopup
                      AddRemark={true}
                      //   isOpen={isPopupOpen}
                      callfrom="Con"
                      StoreType={values?.StoreType?.value}
                      GRNId={val?.consignmentNo}
                      onClose={handleClosePopup}
                    />,
                    "25vw",
                    <></>
                  )
                }
              >
                {t("Reject")}
              </button>
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

  const handleUpdateInvoice = (billNo) => {
    // console.log("Updating invoice for Bill No:", billNo);
    handleClosePopup();
  };
  const Tabfunctionality = (e) => {};
  const THEAD = [
    t("S.No."),
    t("Consignment No"),
    t("Return"),
    t("Invoice No."),
    t("Chalan No."),
    t("Supplier Name"),
    t("Date"),
    t("Post Status"),
    t("View"),
    t("Edit"),
    t("Post"),
    t("Reject"),
  ];
  const THEAD2 = [
    t("S.No."),
    t("Consignment No"),
    t("Item Name"),
    t("Batch No"),
    t("Disc(%)"),
    t("Special Disc(%)"),
    t("Qty"),
    t("Rate"),
    t("Selling Price"),
    t("Free"),
    // t("Edit"),
    t("Reject"),
  ];

  return (
    <>
      {/* <UpdateInvoicePopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                grnData={selectedGrnData}
                onUpdate={handleUpdateInvoice}
            /> */}
      <div className="card">
        <Heading title={t("GRN Search")} isBreadcrumb={true} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control"
            lable={t("Invoice No")}
            placeholder=" "
            id="InvoiceNo"
            name="Invoice No"
            value={invoiceNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            onKeyDown={Tabfunctionality}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("GRN No")}
            placeholder=" "
            id="GRNNo"
            name="GRN No"
            value={grnNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
            onKeyDown={Tabfunctionality}
            requiredClassName="required-fields"
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            values={values}
            setValues={setValues}
          />
          {/* <Input
                        type="text"
                        className="form-control"
                        lable="PO No."
                        placeholder=" "
                        id="PONo"
                        name="PO No"
                        value={poNo}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        onChange={handleChange}
                        requiredClassName="required-fields"
                    /> */}
          {console.log("values?.ManufacturerData", values?.SupplierData)}
          <ReactSelect
            placeholderName={t("Supplier Name")}
            id={"supplier"}
            searchable={true}
            name={"supplier"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            style={{ width: "100px" }}
            dynamicOptions={values?.SupplierData} // Ensure you use the correct data for manufacturers
            // handleChange={(label, value, val) => handleReactSelect(label, value, val, index)} // Pass index here
            handleChange={handleReactSelect}
            value={values?.supplier}
            removeIsClearable={false}
            // requiredClassName="required-fields"
          />
          {/* <ReactSelect
                        placeholderName={t("Store Type")}
                        id={"StoreType"}
                        searchable={true}
                        respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
                        dynamicOptions={[
                            { label: " Medical Store", value: "STO00001" },
                            { label: "General Store", value: "STO00002" },
                        ]}
                        name="StoreType"
                        handleChange={handleReactSelect}
                        value={values?.StoreType}
                        requiredClassName="required-fields"
                    /> */}
          <ReactSelect
            placeholderName={t("GRN Type")}
            id={"GRNType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "2" },
              { label: " Non-Posted", value: "0" },
              { label: "Posted", value: "1" },
              { label: "Rejected", value: "3" },
            ]}
            name="GRNType"
            handleChange={handleReactSelect}
            value={values?.GRNType.value}
            requiredClassName="required-fields"
          />

          {/* Additional fields like dropdowns for Item Type, Supplier Name, etc. */}
          {/* Search Button */}
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleSearch}>
              {t("Search")}
            </button>
          </div>
        </div>
      </div>

      <div className="card my-2">
        <div className="px-2 row">
          <div className="col-12">
            <Tables
              thead={THEAD}
              tbody={values.GRNListdata}
              style={{ maxHeight: "220px" }}
            />
          </div>
        </div>
        <div
          className={
            values.GRNItemListdata.length > 0 ? " p-2 row mt-4" : "d-none"
          }
        >
          <div className="col-12">
            <Tables
              thead={THEAD2}
              tbody={values.GRNItemListdata}
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

export default ConsignmentSearch;
